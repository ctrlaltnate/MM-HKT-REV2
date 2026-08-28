import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  applyToJob,
  createBooth,
  createFair,
  getDatabaseSnapshot,
  joinFair,
  resetLocalDatabase,
  reviewFairMembership,
  saveCandidateProfile,
  updateApplicationStatus,
} from "../domain/local-database";
import { LocalOperationsGateway } from "./operations-gateway";

const OWNER_ID = "admin_owner";

function createLiveFair(ownerId = OWNER_ID) {
  return createFair(ownerId, {
    title: "Local Operations Fair",
    slug: `local-operations-${crypto.randomUUID()}`,
    summary: "Synthetic fair used by the operations gateway contract tests.",
    locationLabel: "Online",
    startsAt: "2026-08-27T09:00:00.000Z",
    endsAt: "2026-08-27T17:00:00.000Z",
    status: "LIVE",
  });
}

describe("LocalOperationsGateway", () => {
  let gateway: LocalOperationsGateway;

  beforeEach(() => {
    window.localStorage.clear();
    resetLocalDatabase();
    gateway = new LocalOperationsGateway();
  });

  afterEach(() => {
    gateway.dispose();
    vi.restoreAllMocks();
  });

  it("allows only the fair owner to read or operate an event", async () => {
    const fair = createLiveFair();

    await expect(
      gateway.getEventOverview({ eventId: fair.id, actorId: "another_admin" }),
    ).rejects.toMatchObject({ code: "FORBIDDEN", retryable: false });

    await expect(
      gateway.pauseEvent({
        eventId: fair.id,
        actorId: "another_admin",
        expectedVersion: 1,
        idempotencyKey: "foreign-owner-pause",
        reason: "หยุดงานเพื่อทดสอบสิทธิ์ผู้ดูแล",
        scope: "ENTRY_AND_QUEUES",
      }),
    ).rejects.toMatchObject({ code: "FORBIDDEN", retryable: false });

    expect(getDatabaseSnapshot().fairs.find((item) => item.id === fair.id)?.status).toBe(
      "LIVE",
    );
  });

  it("pauses and resumes a live event with versioned, reasoned audit entries", async () => {
    const fair = createLiveFair();
    const initial = await gateway.getEventOverview({ eventId: fair.id, actorId: OWNER_ID });

    const paused = await gateway.pauseEvent({
      eventId: fair.id,
      actorId: OWNER_ID,
      expectedVersion: initial.version,
      idempotencyKey: "pause-command",
      reason: "  ตรวจสอบความจุของระบบก่อนรับผู้เข้าร่วมเพิ่ม  ",
      scope: "ENTRY_AND_QUEUES",
    });

    expect(paused).toMatchObject({
      eventState: "PAUSED",
      version: 2,
      pauseReason: "ตรวจสอบความจุของระบบก่อนรับผู้เข้าร่วมเพิ่ม",
      pauseScope: "ENTRY_AND_QUEUES",
    });
    expect(paused.auditTrail).toHaveLength(1);
    expect(paused.auditTrail[0]).toMatchObject({
      eventId: fair.id,
      action: "PAUSE",
      reason: "ตรวจสอบความจุของระบบก่อนรับผู้เข้าร่วมเพิ่ม",
      scope: "ENTRY_AND_QUEUES",
      actorLabel: "LOCAL_ADMIN_SESSION",
    });
    expect(getDatabaseSnapshot().fairs.find((item) => item.id === fair.id)?.status).toBe(
      "PAUSED",
    );

    const resumed = await gateway.resumeEvent({
      eventId: fair.id,
      actorId: OWNER_ID,
      expectedVersion: paused.version,
      idempotencyKey: "resume-command",
      reason: "  ตรวจสอบเสร็จแล้วและพร้อมเปิดรับผู้เข้าร่วมต่อ  ",
    });

    expect(resumed.eventState).toBe("LIVE");
    expect(resumed.version).toBe(3);
    expect(resumed.pauseReason).toBeUndefined();
    expect(resumed.pauseScope).toBeUndefined();
    expect(resumed.auditTrail.map((event) => event.action)).toEqual(["RESUME", "PAUSE"]);
    expect(resumed.auditTrail[0]?.reason).toBe(
      "ตรวจสอบเสร็จแล้วและพร้อมเปิดรับผู้เข้าร่วมต่อ",
    );
    expect(getDatabaseSnapshot().fairs.find((item) => item.id === fair.id)?.status).toBe(
      "LIVE",
    );
  });

  it("requires meaningful reasons for both pause and resume without changing state", async () => {
    const fair = createLiveFair();

    await expect(
      gateway.pauseEvent({
        eventId: fair.id,
        actorId: OWNER_ID,
        expectedVersion: 1,
        idempotencyKey: "invalid-pause-reason",
        reason: "   ",
        scope: "QUEUES_ONLY",
      }),
    ).rejects.toMatchObject({ code: "INVALID_REASON", retryable: false });
    expect(getDatabaseSnapshot().fairs.find((item) => item.id === fair.id)?.status).toBe(
      "LIVE",
    );

    const paused = await gateway.pauseEvent({
      eventId: fair.id,
      actorId: OWNER_ID,
      expectedVersion: 1,
      idempotencyKey: "valid-pause-reason",
      reason: "หยุดคิวเพื่อตรวจสอบระบบ",
      scope: "QUEUES_ONLY",
    });

    await expect(
      gateway.resumeEvent({
        eventId: fair.id,
        actorId: OWNER_ID,
        expectedVersion: paused.version,
        idempotencyKey: "invalid-resume-reason",
        reason: "ok",
      }),
    ).rejects.toMatchObject({ code: "INVALID_REASON", retryable: false });

    const unchanged = await gateway.getEventOverview({ eventId: fair.id, actorId: OWNER_ID });
    expect(unchanged).toMatchObject({ eventState: "PAUSED", version: 2 });
    expect(unchanged.auditTrail).toHaveLength(1);
  });

  it("rejects stale expected versions and leaves the current snapshot untouched", async () => {
    const fair = createLiveFair();

    await expect(
      gateway.broadcastMessage({
        eventId: fair.id,
        actorId: OWNER_ID,
        expectedVersion: 0,
        idempotencyKey: "stale-initial-command",
        message: "ประกาศที่ไม่ควรถูกบันทึก",
      }),
    ).rejects.toMatchObject({ code: "VERSION_CONFLICT", retryable: true });

    const current = await gateway.getEventOverview({ eventId: fair.id, actorId: OWNER_ID });
    expect(current).toMatchObject({ version: 1, broadcasts: [], auditTrail: [] });

    const updated = await gateway.broadcastMessage({
      eventId: fair.id,
      actorId: OWNER_ID,
      expectedVersion: current.version,
      idempotencyKey: "fresh-command",
      message: "ระบบพร้อมให้บริการ",
    });

    await expect(
      gateway.broadcastMessage({
        eventId: fair.id,
        actorId: OWNER_ID,
        expectedVersion: current.version,
        idempotencyKey: "different-stale-command",
        message: "ประกาศที่ใช้ version เก่า",
      }),
    ).rejects.toMatchObject({ code: "VERSION_CONFLICT", retryable: true });

    const afterConflict = await gateway.getEventOverview({
      eventId: fair.id,
      actorId: OWNER_ID,
    });
    expect(afterConflict.version).toBe(updated.version);
    expect(afterConflict.broadcasts).toHaveLength(1);
    expect(afterConflict.auditTrail).toHaveLength(1);
  });

  it("deduplicates repeated pause and broadcast commands by idempotency key", async () => {
    const fair = createLiveFair();
    const pauseInput = {
      eventId: fair.id,
      actorId: OWNER_ID,
      expectedVersion: 1,
      idempotencyKey: "same-pause-command",
      reason: "หยุดระบบเพื่อตรวจสอบเหตุขัดข้อง",
      scope: "ENTRY_AND_QUEUES" as const,
    };

    const firstPause = await gateway.pauseEvent(pauseInput);
    const repeatedPause = await gateway.pauseEvent(pauseInput);

    expect(repeatedPause.version).toBe(firstPause.version);
    expect(repeatedPause.auditTrail).toHaveLength(1);
    expect(repeatedPause.auditTrail[0]?.action).toBe("PAUSE");

    const broadcastInput = {
      eventId: fair.id,
      actorId: OWNER_ID,
      expectedVersion: repeatedPause.version,
      idempotencyKey: "same-broadcast-command",
      message: "โปรดรอประกาศเปิดระบบอีกครั้ง",
    };
    const firstBroadcast = await gateway.broadcastMessage(broadcastInput);
    const repeatedBroadcast = await gateway.broadcastMessage(broadcastInput);

    expect(repeatedBroadcast.version).toBe(firstBroadcast.version);
    expect(repeatedBroadcast.broadcasts).toHaveLength(1);
    expect(repeatedBroadcast.auditTrail.map((event) => event.action)).toEqual([
      "BROADCAST",
      "PAUSE",
    ]);
  });

  it("rolls back a lifecycle transition when the operations record cannot be stored", async () => {
    const fair = createLiveFair();
    const originalSetItem = window.localStorage.setItem.bind(window.localStorage);
    vi.spyOn(window.localStorage, "setItem").mockImplementation((key, value) => {
      if (key === "maskedmatch.local.operations.v1") {
        throw new DOMException("Synthetic quota failure", "QuotaExceededError");
      }
      return originalSetItem(key, value);
    });

    await expect(
      gateway.pauseEvent({
        eventId: fair.id,
        actorId: OWNER_ID,
        expectedVersion: 1,
        idempotencyKey: "storage-failure-pause",
        reason: "ทดสอบ rollback เมื่อพื้นที่จัดเก็บไม่พร้อม",
        scope: "ENTRY_AND_QUEUES",
      }),
    ).rejects.toMatchObject({ code: "STORAGE_UNAVAILABLE", retryable: true });

    expect(getDatabaseSnapshot().fairs.find((item) => item.id === fair.id)?.status).toBe("LIVE");
  });

  it("normalizes broadcast text and enforces the 1–280 character boundary", async () => {
    const fair = createLiveFair();

    await expect(
      gateway.broadcastMessage({
        eventId: fair.id,
        actorId: OWNER_ID,
        expectedVersion: 1,
        idempotencyKey: "blank-broadcast",
        message: "   ",
      }),
    ).rejects.toMatchObject({ code: "INVALID_MESSAGE", retryable: false });

    const accepted = await gateway.broadcastMessage({
      eventId: fair.id,
      actorId: OWNER_ID,
      expectedVersion: 1,
      idempotencyKey: "trimmed-broadcast",
      message: `  ${"x".repeat(280)}  `,
    });

    expect(accepted.broadcasts[0]?.message).toBe("x".repeat(280));
    expect(accepted.broadcasts[0]).not.toHaveProperty("actorId");
    expect(accepted.broadcasts[0]).not.toHaveProperty("idempotencyKey");

    await expect(
      gateway.broadcastMessage({
        eventId: fair.id,
        actorId: OWNER_ID,
        expectedVersion: accepted.version,
        idempotencyKey: "oversized-broadcast",
        message: "x".repeat(281),
      }),
    ).rejects.toMatchObject({ code: "INVALID_MESSAGE", retryable: false });

    const unchanged = await gateway.getEventOverview({ eventId: fair.id, actorId: OWNER_ID });
    expect(unchanged.version).toBe(accepted.version);
    expect(unchanged.broadcasts).toHaveLength(1);
  });

  it("builds an aggregate-only local snapshot without candidate or decision data", async () => {
    const fair = createLiveFair();
    const candidateId = "candidate_private_123";
    const recruiterId = "recruiter_private_456";

    joinFair(candidateId, fair.id, "CANDIDATE");
    const recruiterMembership = joinFair(recruiterId, fair.id, "RECRUITER");
    reviewFairMembership(recruiterMembership.id, "ACTIVE", OWNER_ID);

    for (const suffix of ["one", "two"]) {
      createBooth(recruiterId, {
        fairId: fair.id,
        companyId: `company_${suffix}`,
        name: `Booth ${suffix}`,
        summary: "Synthetic aggregate fixture",
        technologyTags: ["TypeScript"],
        accessibilityNote: "Text support available",
        status: "PUBLISHED",
      });
    }

    saveCandidateProfile(candidateId, {
      headline: "Private candidate",
      region: "Bangkok",
      preferredWorkMode: "REMOTE",
      about: "candidate.secret@example.com",
      manualSkills: ["TypeScript"],
      shareWithJoinedFairs: true,
    });
    const application = applyToJob({
      jobId: "job_private_789",
      boothId: "booth_private_789",
      fairId: fair.id,
      companyId: "company_private_789",
      candidateUserId: candidateId,
      matchScore: 97,
    });
    updateApplicationStatus(application.id, "INTERVIEW_SCHEDULED", {
      interviewNote: "Private decision and contact: +66-00-000-0000",
      scheduledInterviewAt: "2026-08-27T12:00:00.000Z",
    });

    const snapshot = await gateway.getEventOverview({ eventId: fair.id, actorId: OWNER_ID });

    expect(snapshot.metrics).toEqual({
      concurrentUsers: 2,
      instanceCapacity: 100,
      queueDepth: 0,
      availableRecruiters: 1,
      liveInterviews: 0,
      callHealthPercent: null,
      mutualMatches: 0,
      openIncidents: 0,
    });
    expect(snapshot.integrations.map((item) => item.service)).toEqual([
      "AUTH",
      "PROFILE_WORKER",
      "OBJECT_STORAGE",
      "REALTIME",
      "MEDIA",
      "NOTIFICATION",
      "AUDIT",
    ]);

    const serialized = JSON.stringify(snapshot);
    for (const privateValue of [
      candidateId,
      recruiterId,
      "candidate.secret@example.com",
      "+66-00-000-0000",
      "Private decision",
      "revealConsentGiven",
      "passwordHash",
    ]) {
      expect(serialized).not.toContain(privateValue);
    }
    expect(snapshot.mode).toBe("LOCAL_SIMULATION");
    expect(snapshot.broadcasts).toEqual([]);
    expect(snapshot.auditTrail).toEqual([]);
  });
});
