import type {
  EventOperationsSnapshot,
  IntegrationHealthItem,
  IntegrationHealthService,
  JobFair,
  OperationsAuditEvent,
  OperationsBroadcast,
  OperationsMetrics,
  OperationsScope,
} from "@maskedmatch/contracts";

import {
  getDatabaseSnapshot,
  subscribeDatabase,
  transitionFairStatus,
} from "../domain/local-database";

export interface OperationsActorInput {
  eventId: string;
  actorId: string;
}

export interface OperationsCommandInput extends OperationsActorInput {
  expectedVersion: number;
  idempotencyKey: string;
}

export interface PauseEventInput extends OperationsCommandInput {
  reason: string;
  scope: OperationsScope;
}

export interface ResumeEventInput extends OperationsCommandInput {
  reason: string;
}

export interface BroadcastMessageInput extends OperationsCommandInput {
  message: string;
}

export interface RecheckIntegrationInput extends OperationsCommandInput {
  service: IntegrationHealthService;
}

export interface OperationsGateway {
  getEventOverview(input: OperationsActorInput): Promise<EventOperationsSnapshot>;
  pauseEvent(input: PauseEventInput): Promise<EventOperationsSnapshot>;
  resumeEvent(input: ResumeEventInput): Promise<EventOperationsSnapshot>;
  broadcastMessage(input: BroadcastMessageInput): Promise<EventOperationsSnapshot>;
  recheckIntegration(input: RecheckIntegrationInput): Promise<EventOperationsSnapshot>;
  subscribe(eventId: string, listener: () => void): () => void;
}

export type OperationsGatewayErrorCode =
  | "EVENT_NOT_FOUND"
  | "EVENT_NOT_OPERABLE"
  | "FORBIDDEN"
  | "INVALID_REASON"
  | "INVALID_MESSAGE"
  | "VERSION_CONFLICT"
  | "STORAGE_UNAVAILABLE";

export class OperationsGatewayError extends Error {
  constructor(
    public readonly code: OperationsGatewayErrorCode,
    message: string,
    public readonly retryable: boolean,
  ) {
    super(message);
    this.name = "OperationsGatewayError";
  }
}

interface StoredOperationsRecord {
  eventId: string;
  version: number;
  updatedAt: string;
  pauseScope?: OperationsScope;
  pauseReason?: string;
  broadcasts: OperationsBroadcast[];
  auditTrail: OperationsAuditEvent[];
  integrationChecks: Partial<Record<IntegrationHealthService, string>>;
  processedCommands: Record<string, string>;
}

interface StoredOperationsDatabase {
  version: 1;
  events: Record<string, StoredOperationsRecord>;
}

const OPERATIONS_STORAGE_KEY = "maskedmatch.local.operations.v1";
const OPERATIONS_CHANNEL = "maskedmatch.local.operations";

const integrationCatalog: Array<{
  service: IntegrationHealthService;
  status: IntegrationHealthItem["status"];
  summary: string;
  recoveryAction: string;
}> = [
  {
    service: "AUTH",
    status: "DEGRADED",
    summary: "ใช้บัญชีและ session ในเบราว์เซอร์เครื่องนี้",
    recoveryAction: "เชื่อม Supabase Auth ก่อนใช้งานหลายอุปกรณ์",
  },
  {
    service: "PROFILE_WORKER",
    status: "UNAVAILABLE",
    summary: "ยังไม่มี worker และ durable job queue",
    recoveryAction: "ตรวจการวิเคราะห์ Resume จากหน้า Candidate แยกต่างหาก",
  },
  {
    service: "OBJECT_STORAGE",
    status: "UNAVAILABLE",
    summary: "ยังไม่เชื่อม object storage สำหรับไฟล์จริง",
    recoveryAction: "ใช้เฉพาะข้อมูลสังเคราะห์และไฟล์ทดสอบในเครื่อง",
  },
  {
    service: "REALTIME",
    status: "DEGRADED",
    summary: "ซิงก์เฉพาะ localStorage และ BroadcastChannel",
    recoveryAction: "เปิดทุกแท็บบน origin และเบราว์เซอร์เดียวกัน",
  },
  {
    service: "MEDIA",
    status: "UNAVAILABLE",
    summary: "ยังไม่มี media room หรือ call-health collector",
    recoveryAction: "ใช้ avatar/text fallback ในการสาธิต",
  },
  {
    service: "NOTIFICATION",
    status: "UNAVAILABLE",
    summary: "ประกาศถูกบันทึกใน local event log เท่านั้น",
    recoveryAction: "แจ้งผู้ทดสอบให้เปิดหน้า Operations ในแท็บเดียวกัน",
  },
  {
    service: "AUDIT",
    status: "DEGRADED",
    summary: "Audit เป็น local append-only simulation และล้างได้จากเบราว์เซอร์",
    recoveryAction: "ห้ามใช้เป็นหลักฐาน production หรือ compliance",
  },
];

function emptyStore(): StoredOperationsDatabase {
  return { version: 1, events: {} };
}

function loadStore(): StoredOperationsDatabase {
  if (typeof window === "undefined") return emptyStore();
  const raw = window.localStorage.getItem(OPERATIONS_STORAGE_KEY);
  if (!raw) return emptyStore();
  try {
    const parsed = JSON.parse(raw) as StoredOperationsDatabase;
    return parsed.version === 1 && parsed.events ? parsed : emptyStore();
  } catch {
    return emptyStore();
  }
}

function createRecord(eventId: string, now = new Date().toISOString()): StoredOperationsRecord {
  return {
    eventId,
    version: 1,
    updatedAt: now,
    broadcasts: [],
    auditTrail: [],
    integrationChecks: {},
    processedCommands: {},
  };
}

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function getOwnedFair(eventId: string, actorId: string): JobFair {
  const fair = getDatabaseSnapshot().fairs.find((candidate) => candidate.id === eventId);
  if (!fair) {
    throw new OperationsGatewayError("EVENT_NOT_FOUND", "ไม่พบงานแฟร์ที่ต้องการเปิด", false);
  }
  if (fair.ownerId !== actorId) {
    throw new OperationsGatewayError("FORBIDDEN", "คุณไม่มีสิทธิ์ดูศูนย์ควบคุมของงานนี้", false);
  }
  if (fair.status !== "LIVE" && fair.status !== "PAUSED" && fair.status !== "ENDED") {
    throw new OperationsGatewayError(
      "EVENT_NOT_OPERABLE",
      "ศูนย์ควบคุมสดเปิดได้เมื่องานอยู่ในสถานะ LIVE, PAUSED หรือ ENDED เท่านั้น",
      false,
    );
  }
  return fair;
}

function deriveMetrics(eventId: string): OperationsMetrics {
  const database = getDatabaseSnapshot();
  const memberships = database.memberships.filter((item) => item.fairId === eventId);
  const boothCount = database.booths.filter((item) => item.fairId === eventId).length;
  return {
    concurrentUsers: memberships.filter((item) => item.status === "ACTIVE").length,
    instanceCapacity: Math.max(50, boothCount * 50),
    // Queue, live interview, media and match services do not exist in the local foundation.
    queueDepth: 0,
    availableRecruiters: memberships.filter(
      (item) => item.role === "RECRUITER" && item.status === "ACTIVE",
    ).length,
    liveInterviews: 0,
    callHealthPercent: null,
    mutualMatches: 0,
    openIncidents: 0,
  };
}

function integrationsFor(record: StoredOperationsRecord): IntegrationHealthItem[] {
  return integrationCatalog.map((item) => ({
    ...item,
    checkedAt: record.integrationChecks[item.service] ?? record.updatedAt,
  }));
}

function toSnapshot(fair: JobFair, record: StoredOperationsRecord): EventOperationsSnapshot {
  const eventState = fair.status === "PAUSED" ? "PAUSED" : fair.status === "ENDED" ? "ENDED" : "LIVE";
  return {
    eventId: fair.id,
    eventState,
    version: record.version,
    updatedAt: record.updatedAt,
    mode: "LOCAL_SIMULATION",
    pauseScope: record.pauseScope,
    pauseReason: record.pauseReason,
    metrics: deriveMetrics(fair.id),
    integrations: integrationsFor(record),
    broadcasts: record.broadcasts,
    auditTrail: record.auditTrail,
  };
}

export class LocalOperationsGateway implements OperationsGateway {
  private readonly listeners = new Map<string, Set<() => void>>();
  private readonly channel: BroadcastChannel | null;
  private readonly unsubscribeDatabase: () => void;

  constructor() {
    this.channel = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(OPERATIONS_CHANNEL);
    this.channel?.addEventListener("message", (event: MessageEvent<{ eventId?: string }>) => {
      if (event.data?.eventId) this.emit(event.data.eventId);
    });
    if (typeof window !== "undefined") {
      window.addEventListener("storage", this.handleStorage);
    }
    this.unsubscribeDatabase = subscribeDatabase(() => {
      this.listeners.forEach((_listeners, eventId) => this.emit(eventId));
    });
  }

  async getEventOverview(input: OperationsActorInput): Promise<EventOperationsSnapshot> {
    const fair = getOwnedFair(input.eventId, input.actorId);
    const store = loadStore();
    const record = store.events[input.eventId] ?? createRecord(input.eventId);
    return toSnapshot(fair, record);
  }

  async pauseEvent(input: PauseEventInput): Promise<EventOperationsSnapshot> {
    const reason = input.reason.trim();
    if (reason.length < 5) {
      throw new OperationsGatewayError("INVALID_REASON", "กรุณาระบุเหตุผลอย่างน้อย 5 ตัวอักษร", false);
    }
    return this.mutate(input, "PAUSE", reason, (record) => {
      transitionFairStatus(input.eventId, "PAUSE");
      return { ...record, pauseReason: reason, pauseScope: input.scope };
    }, input.scope);
  }

  async resumeEvent(input: ResumeEventInput): Promise<EventOperationsSnapshot> {
    const reason = input.reason.trim();
    if (reason.length < 5) {
      throw new OperationsGatewayError("INVALID_REASON", "กรุณาระบุเหตุผลที่พร้อมเปิดงานต่อ", false);
    }
    return this.mutate(input, "RESUME", reason, (record) => {
      transitionFairStatus(input.eventId, "RESUME");
      return { ...record, pauseReason: undefined, pauseScope: undefined };
    });
  }

  async broadcastMessage(input: BroadcastMessageInput): Promise<EventOperationsSnapshot> {
    const message = input.message.trim();
    if (!message || message.length > 280) {
      throw new OperationsGatewayError(
        "INVALID_MESSAGE",
        "ประกาศต้องมีความยาว 1–280 ตัวอักษร",
        false,
      );
    }
    return this.mutate(input, "BROADCAST", "ส่งประกาศแบบ local simulation", (record, now) => ({
      ...record,
      broadcasts: [
        {
          id: createId("broadcast"),
          message,
          createdAt: now,
          deliveryMode: "LOCAL_SIMULATION" as const,
        },
        ...record.broadcasts,
      ].slice(0, 20),
    }));
  }

  async recheckIntegration(input: RecheckIntegrationInput): Promise<EventOperationsSnapshot> {
    return this.mutate(
      input,
      "INTEGRATION_RECHECK",
      `ตรวจสถานะ ${input.service} อีกครั้ง`,
      (record, now) => ({
        ...record,
        integrationChecks: { ...record.integrationChecks, [input.service]: now },
      }),
    );
  }

  subscribe(eventId: string, listener: () => void): () => void {
    const eventListeners = this.listeners.get(eventId) ?? new Set<() => void>();
    eventListeners.add(listener);
    this.listeners.set(eventId, eventListeners);
    return () => {
      eventListeners.delete(listener);
      if (eventListeners.size === 0) this.listeners.delete(eventId);
    };
  }

  dispose(): void {
    this.channel?.close();
    this.unsubscribeDatabase();
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", this.handleStorage);
    }
  }

  private readonly handleStorage = (event: StorageEvent) => {
    if (event.key !== OPERATIONS_STORAGE_KEY) return;
    this.listeners.forEach((_listeners, eventId) => this.emit(eventId));
  };

  private emit(eventId: string): void {
    this.listeners.get(eventId)?.forEach((listener) => listener());
  }

  private async mutate(
    input: OperationsCommandInput,
    action: OperationsAuditEvent["action"],
    reason: string,
    update: (record: StoredOperationsRecord, now: string) => StoredOperationsRecord,
    scope?: OperationsScope,
  ): Promise<EventOperationsSnapshot> {
    getOwnedFair(input.eventId, input.actorId);
    const store = loadStore();
    const current = store.events[input.eventId] ?? createRecord(input.eventId);
    if (current.processedCommands[input.idempotencyKey]) {
      return toSnapshot(getOwnedFair(input.eventId, input.actorId), current);
    }
    if (current.version !== input.expectedVersion) {
      throw new OperationsGatewayError(
        "VERSION_CONFLICT",
        "ข้อมูล Operations ถูกเปลี่ยนจากอีกแท็บ กรุณาโหลดสถานะล่าสุดแล้วลองใหม่",
        true,
      );
    }

    const now = new Date().toISOString();
    const base = update(current, now);
    const next: StoredOperationsRecord = {
      ...base,
      version: current.version + 1,
      updatedAt: now,
      processedCommands: { ...current.processedCommands, [input.idempotencyKey]: now },
      auditTrail: [
        {
          id: createId("audit"),
          eventId: input.eventId,
          action,
          reason,
          scope,
          createdAt: now,
          actorLabel: "LOCAL_ADMIN_SESSION",
        },
        ...current.auditTrail,
      ].slice(0, 50),
    };

    const nextStore: StoredOperationsDatabase = {
      ...store,
      events: { ...store.events, [input.eventId]: next },
    };
    try {
      window.localStorage.setItem(OPERATIONS_STORAGE_KEY, JSON.stringify(nextStore));
    } catch {
      throw new OperationsGatewayError(
        "STORAGE_UNAVAILABLE",
        "บันทึกสถานะ local ไม่สำเร็จ กรุณาตรวจพื้นที่จัดเก็บของเบราว์เซอร์",
        true,
      );
    }
    this.emit(input.eventId);
    this.channel?.postMessage({ eventId: input.eventId });
    return toSnapshot(getOwnedFair(input.eventId, input.actorId), next);
  }
}

export const localOperationsGateway = new LocalOperationsGateway();
