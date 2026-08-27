import type {
  IntegrationHealthService,
  IntegrationHealthStatus,
  OperationsScope,
} from "@maskedmatch/contracts";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  Database,
  Loader2,
  Megaphone,
  Pause,
  Play,
  Radio,
  RefreshCw,
  Send,
  ShieldCheck,
  Store,
  UserCheck,
  UsersRound,
  Video,
  WifiOff,
} from "lucide-react";
import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { AnimatedPage } from "../components/AnimatedPage";
import { Modal } from "../components/Modal";
import {
  PixelButton,
  PixelLink,
  PixelSurface,
  StatusPill,
} from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import { useEventOperations } from "../context/OperationsContext";

const scopeLabels: Record<OperationsScope, string> = {
  ENTRY_AND_QUEUES: "ทางเข้างานและคิวใหม่ทั้งหมด",
  ENTRY_ONLY: "เฉพาะทางเข้างาน",
  QUEUES_ONLY: "เฉพาะการรับคิวใหม่",
};

const integrationLabels: Record<IntegrationHealthService, string> = {
  AUTH: "Authentication",
  PROFILE_WORKER: "Profile Worker",
  OBJECT_STORAGE: "Object Storage",
  REALTIME: "Realtime Sync",
  MEDIA: "Media / Call Health",
  NOTIFICATION: "Notification",
  AUDIT: "Audit Store",
};

const integrationStatusLabels: Record<IntegrationHealthStatus, string> = {
  OPERATIONAL: "พร้อมใช้งาน",
  DEGRADED: "ทำงานแบบจำกัด",
  UNAVAILABLE: "ยังไม่พร้อมใช้งาน",
};

const auditActionLabels = {
  PAUSE: "พักการให้บริการ",
  RESUME: "เปิดให้บริการต่อ",
  BROADCAST: "ส่งประกาศ",
  INTEGRATION_RECHECK: "ตรวจ Integration ซ้ำ",
} as const;

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "ไม่ทราบเวลา";
  return date.toLocaleString("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function integrationTone(status: IntegrationHealthStatus): "cyan" | "mango" | "danger" {
  if (status === "OPERATIONAL") return "cyan";
  if (status === "DEGRADED") return "mango";
  return "danger";
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <PixelSurface className="ops-metric-card">
      <div className="ops-metric-icon" aria-hidden="true">
        {icon}
      </div>
      <div className="ops-metric-copy">
        <h3>{label}</h3>
        <strong>{value}</strong>
        <p>{detail}</p>
      </div>
    </PixelSurface>
  );
}

export function AdminOperationsPage() {
  const { eventId: routeEventId } = useParams<{ eventId: string }>();
  const eventId = routeEventId ?? "";
  const { user, database } = useApp();
  const operations = useEventOperations(eventId, user?.id ?? "");

  const [isOnline, setIsOnline] = useState(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [isRetrying, setIsRetrying] = useState(false);
  const [transitionReason, setTransitionReason] = useState("");
  const [transitionScope, setTransitionScope] =
    useState<OperationsScope>("ENTRY_AND_QUEUES");
  const [confirmationAction, setConfirmationAction] = useState<"PAUSE" | "RESUME" | null>(
    null,
  );
  const [transitionError, setTransitionError] = useState<string | null>(null);
  const [transitionFeedback, setTransitionFeedback] = useState<string | null>(null);
  const [broadcastMessage, setBroadcastMessage] = useState("");
  const [broadcastError, setBroadcastError] = useState<string | null>(null);
  const [broadcastFeedback, setBroadcastFeedback] = useState<string | null>(null);
  const [checkingService, setCheckingService] =
    useState<IntegrationHealthService | null>(null);
  const [integrationFeedback, setIntegrationFeedback] = useState<string | null>(null);

  useEffect(() => {
    const markOnline = () => setIsOnline(true);
    const markOffline = () => setIsOnline(false);
    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    return () => {
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
    };
  }, []);

  const fair = database.fairs.find((item) => item.id === eventId);
  const ownedFair = fair && user && fair.ownerId === user.id ? fair : null;
  const snapshot = operations.snapshot;
  const isEnded = snapshot?.eventState === "ENDED";
  const transitionAction =
    snapshot?.eventState === "LIVE"
      ? "PAUSE"
      : snapshot?.eventState === "PAUSED"
        ? "RESUME"
        : null;
  const transitionPending =
    operations.pendingAction === "pause" || operations.pendingAction === "resume";

  const fairBooths = ownedFair
    ? database.booths.filter((booth) => booth.fairId === ownedFair.id)
    : [];

  const handleRetry = async () => {
    setIsRetrying(true);
    await operations.refresh();
    setIsRetrying(false);
  };

  const handleTransitionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    operations.clearActionError();
    setTransitionFeedback(null);
    const reason = transitionReason.trim();
    if (!transitionAction || isEnded) return;
    if (reason.length < 5) {
      setTransitionError("กรุณาระบุเหตุผลอย่างน้อย 5 ตัวอักษร");
      return;
    }
    setTransitionError(null);
    setConfirmationAction(transitionAction);
  };

  const handleConfirmTransition = async () => {
    if (!confirmationAction || !snapshot || isEnded) return;
    operations.clearActionError();
    setTransitionError(null);
    const reason = transitionReason.trim();
    const succeeded =
      confirmationAction === "PAUSE"
        ? await operations.pause(reason, transitionScope)
        : await operations.resume(reason);

    if (!succeeded) {
      setTransitionError("บันทึกคำสั่งไม่สำเร็จ โปรดตรวจข้อความผิดพลาดแล้วลองอีกครั้ง");
      return;
    }

    setTransitionFeedback(
      confirmationAction === "PAUSE"
        ? "พักการให้บริการตามขอบเขตที่เลือกแล้ว"
        : "เปิดการให้บริการของงานต่อแล้ว โดยรักษาข้อมูลคิวเดิมใน local simulation",
    );
    setTransitionReason("");
    setConfirmationAction(null);
  };

  const handleBroadcast = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    operations.clearActionError();
    setBroadcastFeedback(null);
    const message = broadcastMessage.trim();
    if (message.length < 1 || message.length > 280) {
      setBroadcastError("ประกาศต้องมีความยาว 1–280 ตัวอักษร");
      return;
    }
    if (isEnded) return;

    setBroadcastError(null);
    const succeeded = await operations.broadcast(message);
    if (!succeeded) {
      setBroadcastError("ส่งประกาศไม่สำเร็จ โปรดลองอีกครั้ง");
      return;
    }

    setBroadcastMessage("");
    setBroadcastFeedback(
      "บันทึกประกาศใน local simulation แล้ว ยังไม่มีการส่งผ่าน server หรือ notification provider",
    );
  };

  const handleIntegrationRecheck = async (service: IntegrationHealthService) => {
    if (isEnded || operations.pendingAction) return;
    operations.clearActionError();
    setIntegrationFeedback(null);
    setCheckingService(service);
    const succeeded = await operations.recheckIntegration(service);
    setCheckingService(null);
    setIntegrationFeedback(
      succeeded
        ? `อัปเดตเวลาตรวจ ${integrationLabels[service]} ใน local simulation แล้ว`
        : `ตรวจ ${integrationLabels[service]} ไม่สำเร็จ โปรดลองอีกครั้ง`,
    );
  };

  if (!user || !eventId || !ownedFair) {
    const fatalMessage = !eventId
      ? "URL นี้ไม่มีรหัสงานแฟร์"
      : fair
        ? "บัญชีนี้ไม่ได้เป็นเจ้าของงานแฟร์ที่ร้องขอ"
        : "ไม่พบงานแฟร์นี้ใน local database";
    return (
      <AnimatedPage className="ops-page ops-fatal-page">
        <PixelSurface className="ops-fatal-surface" role="alert">
          <AlertCircle aria-hidden="true" />
          <span className="ops-mode-label">LOCAL OPERATIONS SIMULATION</span>
          <h1>เปิดศูนย์ควบคุมงานไม่ได้</h1>
          <p>{fatalMessage}</p>
          <PixelLink to="/admin/fairs" tone="neutral">
            <ArrowLeft aria-hidden="true" /> กลับไปจัดการงานแฟร์
          </PixelLink>
        </PixelSurface>
      </AnimatedPage>
    );
  }

  if (operations.status === "loading" && !snapshot) {
    return (
      <AnimatedPage className="ops-page ops-loading-page">
        <PixelSurface
          className="ops-loading-surface"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <Loader2 className="ops-spin" aria-hidden="true" />
          <span className="ops-mode-label">LOCAL OPERATIONS SIMULATION</span>
          <h1>กำลังเปิดศูนย์ควบคุมงาน</h1>
          <p>กำลังอ่าน aggregate snapshot ของ {ownedFair.title} จากอุปกรณ์นี้</p>
        </PixelSurface>
      </AnimatedPage>
    );
  }

  if (operations.status === "error" && !snapshot) {
    return (
      <AnimatedPage className="ops-page ops-fatal-page">
        <PixelSurface className="ops-fatal-surface" role="alert">
          <AlertTriangle aria-hidden="true" />
          <span className="ops-mode-label">LOCAL OPERATIONS SIMULATION</span>
          <h1>โหลดข้อมูล Operations ไม่สำเร็จ</h1>
          <p>{operations.loadError?.message ?? "ไม่สามารถอ่านข้อมูลจากอุปกรณ์นี้ได้"}</p>
          <div className="ops-fatal-actions">
            <PixelButton
              type="button"
              tone="cyan"
              onClick={() => void handleRetry()}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <Loader2 className="ops-spin" aria-hidden="true" />
              ) : (
                <RefreshCw aria-hidden="true" />
              )}
              {isRetrying ? "กำลังลองใหม่" : "ลองโหลดอีกครั้ง"}
            </PixelButton>
            <PixelLink to="/admin/fairs" tone="neutral">
              <ArrowLeft aria-hidden="true" /> กลับไปจัดการงานแฟร์
            </PixelLink>
          </div>
        </PixelSurface>
      </AnimatedPage>
    );
  }

  if (!snapshot) return null;

  const metrics = [
    {
      icon: <Radio />,
      label: "CCU / Capacity",
      value: `${snapshot.metrics.concurrentUsers} / ${snapshot.metrics.instanceCapacity}`,
      detail: "จำนวน active membership เทียบความจุที่คำนวณใน local foundation",
    },
    {
      icon: <Clock />,
      label: "Queue depth",
      value: String(snapshot.metrics.queueDepth),
      detail: "จำนวนคิวรวมแบบ aggregate",
    },
    {
      icon: <UserCheck />,
      label: "Recruiters available",
      value: String(snapshot.metrics.availableRecruiters),
      detail: "สมาชิก Recruiter สถานะ active ในงานนี้",
    },
    {
      icon: <Video />,
      label: "Live interviews",
      value: String(snapshot.metrics.liveInterviews),
      detail: "ยังไม่เพิ่มค่าจำลองเมื่อไม่มี interview service",
    },
    {
      icon: <Activity />,
      label: "Call health",
      value:
        snapshot.metrics.callHealthPercent === null
          ? "N/A"
          : `${snapshot.metrics.callHealthPercent}%`,
      detail: "แสดง N/A เมื่อยังไม่มี call-health collector",
    },
    {
      icon: <CheckCircle2 />,
      label: "Mutual matches",
      value: String(snapshot.metrics.mutualMatches),
      detail: "จำนวนผลลัพธ์รวม โดยไม่เปิด private decision",
    },
    {
      icon: <AlertCircle />,
      label: "Open incidents",
      value: String(snapshot.metrics.openIncidents),
      detail: "จำนวน incident ที่ยังเปิดอยู่แบบ aggregate",
    },
  ];

  return (
    <AnimatedPage className="ops-page">
      <header className="ops-header" data-reveal>
        <div className="ops-header-copy">
          <PixelLink to="/admin/fairs" tone="neutral" className="ops-back-link">
            <ArrowLeft aria-hidden="true" /> กลับไป Fair Studio
          </PixelLink>
          <span className="ops-eyebrow">
            <ShieldCheck aria-hidden="true" /> Organizer Live Operations
          </span>
          <h1>ศูนย์ควบคุมงานสด</h1>
          <p>
            ติดตามข้อมูล aggregate และควบคุมงาน <strong>{ownedFair.title}</strong> ที่คุณเป็นเจ้าของ
          </p>
        </div>
        <div className="ops-header-status">
          <StatusPill tone="mango">LOCAL OPERATIONS SIMULATION</StatusPill>
          <StatusPill
            tone={
              snapshot.eventState === "LIVE"
                ? "cyan"
                : snapshot.eventState === "PAUSED"
                  ? "mango"
                  : "neutral"
            }
          >
            {snapshot.eventState}
          </StatusPill>
        </div>
      </header>

      <PixelSurface className="ops-event-context" data-reveal aria-labelledby="ops-context-title">
        <div className="ops-section-heading">
          <div>
            <span className="ops-section-kicker">Owned fair context</span>
            <h2 id="ops-context-title">{ownedFair.title}</h2>
          </div>
          <Building2 aria-hidden="true" />
        </div>
        <dl className="ops-context-list">
          <div>
            <dt>ผู้ดูแล</dt>
            <dd>{user.displayName}</dd>
          </div>
          <div>
            <dt>ช่วงจัดงาน</dt>
            <dd>
              {formatDateTime(ownedFair.startsAt)} – {formatDateTime(ownedFair.endsAt)}
            </dd>
          </div>
          <div>
            <dt>Timezone</dt>
            <dd>{ownedFair.timezone || "ไม่ได้ระบุ"}</dd>
          </div>
          <div>
            <dt>Snapshot ล่าสุด</dt>
            <dd>{formatDateTime(snapshot.updatedAt)}</dd>
          </div>
        </dl>
      </PixelSurface>

      {!isOnline ? (
        <div className="ops-banner ops-banner-offline" role="status" aria-live="polite">
          <WifiOff aria-hidden="true" />
          <div>
            <strong>อุปกรณ์กำลังออฟไลน์</strong>
            <p>
              หน้านี้ยังอ่านและบันทึก local simulation ได้ แต่ไม่มีการส่งข้อมูลไป server,
              notification provider หรืออุปกรณ์อื่นนอก browser นี้
            </p>
          </div>
        </div>
      ) : null}

      {operations.status === "error" && snapshot ? (
        <div className="ops-banner ops-banner-error" role="alert">
          <AlertTriangle aria-hidden="true" />
          <div>
            <strong>กำลังแสดง snapshot ล่าสุดที่อ่านได้</strong>
            <p>{operations.loadError?.message}</p>
          </div>
          <PixelButton
            type="button"
            tone="neutral"
            onClick={() => void handleRetry()}
            disabled={isRetrying}
          >
            <RefreshCw className={isRetrying ? "ops-spin" : ""} aria-hidden="true" />
            ลองซิงก์ใหม่
          </PixelButton>
        </div>
      ) : null}

      {isEnded ? (
        <div className="ops-banner ops-banner-ended" role="status">
          <ShieldCheck aria-hidden="true" />
          <div>
            <strong>งานนี้สิ้นสุดแล้ว: โหมดอ่านอย่างเดียว</strong>
            <p>
              Metrics, ประกาศ และ audit ยังตรวจสอบได้ แต่คำสั่ง Pause, Resume, Broadcast
              และ Integration recheck ถูกปิด
            </p>
          </div>
        </div>
      ) : null}

      {operations.actionError ? (
        <div className="ops-banner ops-banner-error" role="alert">
          <AlertCircle aria-hidden="true" />
          <div>
            <strong>คำสั่งล่าสุดไม่สำเร็จ</strong>
            <p>{operations.actionError.message}</p>
          </div>
          <PixelButton type="button" tone="neutral" onClick={operations.clearActionError}>
            รับทราบ
          </PixelButton>
        </div>
      ) : null}

      <section className="ops-section" data-reveal aria-labelledby="ops-metrics-title">
        <div className="ops-section-heading">
          <div>
            <span className="ops-section-kicker">Aggregate-only snapshot</span>
            <h2 id="ops-metrics-title">ภาพรวมการดำเนินงาน</h2>
            <p>
              ตัวเลขมาจาก local domain ที่มีอยู่จริงเท่านั้น ไม่มีการเติม realtime metric จำลอง
            </p>
          </div>
          <Activity aria-hidden="true" />
        </div>
        <div className="ops-metrics-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>
      </section>

      <div className="ops-control-grid" data-reveal>
        <PixelSurface className="ops-control-panel" aria-labelledby="ops-lifecycle-title">
          <div className="ops-section-heading">
            <div>
              <span className="ops-section-kicker">Lifecycle control</span>
              <h2 id="ops-lifecycle-title">Pause / Resume</h2>
            </div>
            {snapshot.eventState === "PAUSED" ? (
              <Play aria-hidden="true" />
            ) : (
              <Pause aria-hidden="true" />
            )}
          </div>

          {snapshot.eventState === "PAUSED" && snapshot.pauseReason ? (
            <div className="ops-current-pause">
              <strong>งานกำลังพักอยู่</strong>
              <p>{snapshot.pauseReason}</p>
              {snapshot.pauseScope ? <span>{scopeLabels[snapshot.pauseScope]}</span> : null}
            </div>
          ) : null}

          <form className="ops-form" onSubmit={handleTransitionSubmit} noValidate>
            <fieldset disabled={isEnded || !transitionAction || operations.pendingAction !== null}>
              <legend className="ops-form-legend">
                {transitionAction === "PAUSE"
                  ? "ตั้งค่าการพักงาน"
                  : transitionAction === "RESUME"
                    ? "ยืนยันความพร้อมก่อนเปิดงานต่อ"
                    : "ไม่มีคำสั่ง lifecycle สำหรับสถานะนี้"}
              </legend>

              {transitionAction === "PAUSE" ? (
                <label className="ops-field" htmlFor="ops-pause-scope">
                  <span>ขอบเขตที่ต้องการพัก</span>
                  <select
                    id="ops-pause-scope"
                    value={transitionScope}
                    onChange={(event) =>
                      setTransitionScope(event.target.value as OperationsScope)
                    }
                  >
                    {Object.entries(scopeLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <label className="ops-field" htmlFor="ops-transition-reason">
                <span>
                  {transitionAction === "PAUSE"
                    ? "เหตุผลที่ต้องพักงาน"
                    : "เหตุผลที่พร้อมเปิดงานต่อ"}
                </span>
                <textarea
                  id="ops-transition-reason"
                  value={transitionReason}
                  onChange={(event) => {
                    setTransitionReason(event.target.value);
                    setTransitionError(null);
                    setTransitionFeedback(null);
                  }}
                  minLength={5}
                  maxLength={280}
                  rows={4}
                  required
                  aria-invalid={Boolean(transitionError)}
                  aria-describedby="ops-transition-help ops-transition-error"
                />
                <small id="ops-transition-help">
                  อย่างน้อย 5 ตัวอักษร เหตุผลนี้จะปรากฏใน local audit trail
                </small>
              </label>

              {transitionError ? (
                <p className="ops-field-error" id="ops-transition-error" role="alert">
                  {transitionError}
                </p>
              ) : (
                <span id="ops-transition-error" />
              )}

              <PixelButton
                type="submit"
                tone={transitionAction === "PAUSE" ? "danger" : "cyan"}
                disabled={
                  isEnded ||
                  !transitionAction ||
                  operations.pendingAction !== null ||
                  transitionReason.trim().length < 5
                }
              >
                {transitionAction === "PAUSE" ? (
                  <Pause aria-hidden="true" />
                ) : (
                  <Play aria-hidden="true" />
                )}
                {transitionAction === "PAUSE"
                  ? "ตรวจสอบก่อนพักงาน"
                  : transitionAction === "RESUME"
                    ? "ตรวจสอบก่อนเปิดงานต่อ"
                    : "โหมดอ่านอย่างเดียว"}
              </PixelButton>
            </fieldset>
          </form>

          {transitionFeedback ? (
            <p className="ops-success-message" role="status" aria-live="polite">
              <CheckCircle2 aria-hidden="true" /> {transitionFeedback}
            </p>
          ) : null}
        </PixelSurface>

        <PixelSurface className="ops-control-panel" aria-labelledby="ops-broadcast-title">
          <div className="ops-section-heading">
            <div>
              <span className="ops-section-kicker">Local broadcast log</span>
              <h2 id="ops-broadcast-title">ประกาศถึงผู้เข้าร่วม</h2>
            </div>
            <Megaphone aria-hidden="true" />
          </div>
          <p className="ops-truth-note">
            การส่งในหน้านี้บันทึกลง browser เท่านั้น ยังไม่เชื่อม realtime หรือ notification provider
          </p>

          <form
            className="ops-form"
            onSubmit={handleBroadcast}
            aria-busy={operations.pendingAction === "broadcast"}
            noValidate
          >
            <fieldset disabled={isEnded || operations.pendingAction !== null}>
              <legend className="ops-form-legend">สร้างประกาศใหม่</legend>
              <label className="ops-field" htmlFor="ops-broadcast-message">
                <span>ข้อความประกาศ</span>
                <textarea
                  id="ops-broadcast-message"
                  value={broadcastMessage}
                  onChange={(event) => {
                    setBroadcastMessage(event.target.value);
                    setBroadcastError(null);
                    setBroadcastFeedback(null);
                  }}
                  rows={6}
                  minLength={1}
                  maxLength={280}
                  required
                  aria-invalid={Boolean(broadcastError)}
                  aria-describedby="ops-broadcast-help ops-broadcast-count ops-broadcast-error"
                />
                <small id="ops-broadcast-help">
                  ห้ามใส่ข้อมูลส่วนบุคคล คำตอบสัมภาษณ์ หรือข้อมูล contact ที่เปิดเผย
                </small>
                <span className="ops-character-count" id="ops-broadcast-count">
                  {broadcastMessage.length} / 280
                </span>
              </label>

              {broadcastError ? (
                <p className="ops-field-error" id="ops-broadcast-error" role="alert">
                  {broadcastError}
                </p>
              ) : (
                <span id="ops-broadcast-error" />
              )}

              <PixelButton
                type="submit"
                tone="mango"
                disabled={
                  isEnded ||
                  operations.pendingAction !== null ||
                  broadcastMessage.trim().length < 1
                }
              >
                {operations.pendingAction === "broadcast" ? (
                  <Loader2 className="ops-spin" aria-hidden="true" />
                ) : (
                  <Send aria-hidden="true" />
                )}
                {operations.pendingAction === "broadcast"
                  ? "กำลังบันทึกประกาศ"
                  : "บันทึกประกาศแบบ Local"}
              </PixelButton>
            </fieldset>
          </form>

          {broadcastFeedback ? (
            <p className="ops-success-message" role="status" aria-live="polite">
              <CheckCircle2 aria-hidden="true" /> {broadcastFeedback}
            </p>
          ) : null}
        </PixelSurface>
      </div>

      <PixelSurface
        className="ops-integrations-panel"
        data-reveal
        aria-labelledby="ops-integrations-title"
      >
        <div className="ops-section-heading">
          <div>
            <span className="ops-section-kicker">Sanitized dependency status</span>
            <h2 id="ops-integrations-title">Integration health</h2>
            <p>
              แสดงเฉพาะสถานะ สรุป และแนวทางกู้ระบบ ไม่มี credential, key, URL ภายใน หรือ secret
            </p>
          </div>
          <Database aria-hidden="true" />
        </div>

        {integrationFeedback ? (
          <p
            className={
              integrationFeedback.includes("ไม่สำเร็จ")
                ? "ops-inline-feedback ops-inline-feedback-error"
                : "ops-inline-feedback ops-inline-feedback-success"
            }
            role={integrationFeedback.includes("ไม่สำเร็จ") ? "alert" : "status"}
            aria-live="polite"
          >
            {integrationFeedback}
          </p>
        ) : null}

        <ul className="ops-integration-list">
          {snapshot.integrations.map((integration) => (
            <li className="ops-integration-item" key={integration.service}>
              <div className="ops-integration-summary">
                <div className="ops-integration-title-row">
                  <h3>{integrationLabels[integration.service]}</h3>
                  <StatusPill tone={integrationTone(integration.status)}>
                    {integrationStatusLabels[integration.status]}
                  </StatusPill>
                </div>
                <p>{integration.summary}</p>
                <small>
                  ตรวจล่าสุด <time dateTime={integration.checkedAt}>{formatDateTime(integration.checkedAt)}</time>
                </small>
              </div>
              <div className="ops-integration-recovery">
                <strong>Recovery action</strong>
                <p>{integration.recoveryAction}</p>
                <PixelButton
                  type="button"
                  tone="neutral"
                  disabled={isEnded || operations.pendingAction !== null}
                  onClick={() => void handleIntegrationRecheck(integration.service)}
                  aria-label={`ตรวจสถานะ ${integrationLabels[integration.service]} อีกครั้ง`}
                >
                  {checkingService === integration.service ? (
                    <Loader2 className="ops-spin" aria-hidden="true" />
                  ) : (
                    <RefreshCw aria-hidden="true" />
                  )}
                  {checkingService === integration.service ? "กำลังตรวจ" : "ตรวจอีกครั้ง"}
                </PixelButton>
              </div>
            </li>
          ))}
        </ul>
      </PixelSurface>

      <PixelSurface className="ops-booths-panel" data-reveal aria-labelledby="ops-booths-title">
        <div className="ops-section-heading">
          <div>
            <span className="ops-section-kicker">Local database inventory</span>
            <h2 id="ops-booths-title">ภาพรวมบูธ</h2>
            <p>
              ข้อมูลต่อไปนี้มาจาก booth และ job records ไม่ใช่ presence, queue หรือสถานะออนไลน์แบบ realtime
            </p>
          </div>
          <Store aria-hidden="true" />
        </div>

        {fairBooths.length === 0 ? (
          <div className="ops-empty-state">
            <Store aria-hidden="true" />
            <h3>ยังไม่มีบูธในงานนี้</h3>
            <p>สร้างและอนุมัติบูธจาก Fair Studio ก่อนเริ่มใช้งานจริง</p>
          </div>
        ) : (
          <div className="ops-table-scroll">
            <table className="ops-booth-table">
              <caption>รายการบูธที่ผูกกับ {ownedFair.title}</caption>
              <thead>
                <tr>
                  <th scope="col">บูธ</th>
                  <th scope="col">บริษัท</th>
                  <th scope="col">สถานะเนื้อหา</th>
                  <th scope="col">ตำแหน่งงาน</th>
                </tr>
              </thead>
              <tbody>
                {fairBooths.map((booth) => {
                  const company = database.companies.find(
                    (item) => item.id === booth.companyId,
                  );
                  const boothJobs = database.jobs.filter((job) => job.boothId === booth.id);
                  const publishedJobs = boothJobs.filter(
                    (job) => job.status === "PUBLISHED",
                  ).length;
                  return (
                    <tr key={booth.id}>
                      <th scope="row">{booth.name}</th>
                      <td>{company?.name ?? "ไม่พบข้อมูลบริษัท"}</td>
                      <td>
                        <StatusPill
                          tone={
                            booth.status === "PUBLISHED"
                              ? "cyan"
                              : booth.status === "ARCHIVED"
                                ? "neutral"
                                : "mango"
                          }
                        >
                          {booth.status}
                        </StatusPill>
                      </td>
                      <td>
                        {publishedJobs} เผยแพร่ / {boothJobs.length} ทั้งหมด
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </PixelSurface>

      <div className="ops-history-grid" data-reveal>
        <PixelSurface className="ops-history-panel" aria-labelledby="ops-broadcast-history-title">
          <div className="ops-section-heading">
            <div>
              <span className="ops-section-kicker">Recent local records</span>
              <h2 id="ops-broadcast-history-title">ประกาศล่าสุด</h2>
            </div>
            <Megaphone aria-hidden="true" />
          </div>
          {snapshot.broadcasts.length === 0 ? (
            <div className="ops-empty-state">
              <Send aria-hidden="true" />
              <h3>ยังไม่มีประกาศ</h3>
              <p>ประกาศที่บันทึกจากหน้านี้จะแสดงตรงนี้ โดยยังไม่ถูกส่งผ่าน server</p>
            </div>
          ) : (
            <ol className="ops-history-list">
              {snapshot.broadcasts.slice(0, 8).map((broadcast) => (
                <li key={broadcast.id}>
                  <div className="ops-history-meta">
                    <StatusPill tone="mango">LOCAL SIMULATION</StatusPill>
                    <time dateTime={broadcast.createdAt}>
                      {formatDateTime(broadcast.createdAt)}
                    </time>
                  </div>
                  <p>{broadcast.message}</p>
                </li>
              ))}
            </ol>
          )}
        </PixelSurface>

        <PixelSurface className="ops-history-panel" aria-labelledby="ops-audit-title">
          <div className="ops-section-heading">
            <div>
              <span className="ops-section-kicker">Scoped local audit</span>
              <h2 id="ops-audit-title">Audit trail ล่าสุด</h2>
            </div>
            <ShieldCheck aria-hidden="true" />
          </div>
          <p className="ops-truth-note">
            เป็น append-only simulation ใน browser ไม่ใช่หลักฐาน production หรือ compliance audit
          </p>
          {snapshot.auditTrail.length === 0 ? (
            <div className="ops-empty-state">
              <ShieldCheck aria-hidden="true" />
              <h3>ยังไม่มี operator action</h3>
              <p>คำสั่ง Pause, Resume, Broadcast และ Recheck จะถูกบันทึกโดยไม่ใส่ PII</p>
            </div>
          ) : (
            <ol className="ops-history-list">
              {snapshot.auditTrail.slice(0, 10).map((audit) => (
                <li key={audit.id}>
                  <div className="ops-history-meta">
                    <StatusPill tone="violet">{auditActionLabels[audit.action]}</StatusPill>
                    <time dateTime={audit.createdAt}>{formatDateTime(audit.createdAt)}</time>
                  </div>
                  <p>{audit.reason}</p>
                  <small>
                    {audit.actorLabel}
                    {audit.scope ? ` · ${scopeLabels[audit.scope]}` : ""}
                  </small>
                </li>
              ))}
            </ol>
          )}
        </PixelSurface>
      </div>

      <Modal
        open={confirmationAction !== null}
        onClose={() => {
          if (!transitionPending) setConfirmationAction(null);
        }}
        title={confirmationAction === "PAUSE" ? "ยืนยันการพักงาน" : "ยืนยันการเปิดงานต่อ"}
        subtitle="ตรวจสอบขอบเขตและเหตุผลก่อนบันทึกคำสั่งลง local simulation"
        maxWidth="620px"
        ariaLabelledBy="ops-transition-modal-title"
      >
        <div className="ops-confirmation-modal">
          <AlertTriangle aria-hidden="true" />
          <p>
            {confirmationAction === "PAUSE"
              ? "คำสั่งนี้จะเปลี่ยนสถานะงานและระงับการให้บริการตามขอบเขตที่เลือก"
              : "คำสั่งนี้จะเปิดการให้บริการต่อและคงลำดับคิวเดิมตาม domain policy"}
          </p>
          <dl>
            <div>
              <dt>งาน</dt>
              <dd>{ownedFair.title}</dd>
            </div>
            {confirmationAction === "PAUSE" ? (
              <div>
                <dt>ขอบเขต</dt>
                <dd>{scopeLabels[transitionScope]}</dd>
              </div>
            ) : null}
            <div>
              <dt>เหตุผล</dt>
              <dd>{transitionReason.trim()}</dd>
            </div>
          </dl>

          {transitionError || operations.actionError ? (
            <p className="ops-field-error" role="alert">
              {operations.actionError?.message ?? transitionError}
            </p>
          ) : null}

          <div className="ops-modal-actions">
            <PixelButton
              type="button"
              tone="neutral"
              disabled={transitionPending}
              onClick={() => setConfirmationAction(null)}
            >
              ยกเลิก
            </PixelButton>
            <PixelButton
              type="button"
              tone={confirmationAction === "PAUSE" ? "danger" : "cyan"}
              disabled={transitionPending || isEnded}
              onClick={() => void handleConfirmTransition()}
            >
              {transitionPending ? (
                <Loader2 className="ops-spin" aria-hidden="true" />
              ) : confirmationAction === "PAUSE" ? (
                <Pause aria-hidden="true" />
              ) : (
                <Play aria-hidden="true" />
              )}
              {transitionPending
                ? "กำลังบันทึก"
                : confirmationAction === "PAUSE"
                  ? "ยืนยันพักงาน"
                  : "ยืนยันเปิดงานต่อ"}
            </PixelButton>
          </div>
        </div>
      </Modal>
    </AnimatedPage>
  );
}
