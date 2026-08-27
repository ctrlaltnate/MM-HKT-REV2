import {
  AlertTriangle,
  Archive,
  CalendarDays,
  Clock,
  Edit3,
  Eye,
  Link2,
  MapPin,
  Play,
  Plus,
  Radio,
  Search,
  ShieldCheck,
  Square,
  Store,
  Trash2,
  UsersRound,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { FairLifecycleAction } from "@maskedmatch/contracts";

import { AnimatedPage } from "../components/AnimatedPage";
import { FairMembershipModal } from "../components/FairMembershipModal";
import { FairQuickPreviewModal } from "../components/FairQuickPreviewModal";
import { FairStudioModal } from "../components/FairStudioModal";
import { Modal } from "../components/Modal";
import {
  EmptyState,
  Field,
  PixelButton,
  PixelLink,
  PixelSurface,
  SelectField,
  StatusPill,
} from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import type { FairMediaLink, FairStatus, JobFair } from "../domain/types";

type FairCategory = "ACTIVE" | "UPCOMING" | "EXPIRED" | "ALL";
type FairSort = "START_ASC" | "START_DESC" | "TITLE_ASC";

interface FairFormPayload {
  title: string;
  slug: string;
  summary: string;
  locationLabel: string;
  startsAt: string;
  endsAt: string;
  timezone: string;
  logoUrl?: string;
  coverUrl?: string;
  autoSchedule: boolean;
  mediaLinks: FairMediaLink[];
  tags: string[];
  status?: FairStatus;
}

interface TransitionRequest {
  fair: JobFair;
  action: FairLifecycleAction;
}

const actionLabels: Record<FairLifecycleAction, string> = {
  PUBLISH: "Publish งานแฟร์",
  START: "เริ่มงาน",
  PAUSE: "พักงานชั่วคราว",
  RESUME: "เปิดงานต่อ",
  END: "สิ้นสุดงาน",
  CANCEL: "ยกเลิกงาน",
  ARCHIVE: "เก็บเข้า Archive",
  RESTORE_DRAFT: "กู้คืนเป็น Draft",
};

const actionDescriptions: Record<FairLifecycleAction, string> = {
  PUBLISH: "งานจะปรากฏใน Public Fair Directory แต่ยังไม่เปิด Live Operations",
  START: "ระบบจะเปิดงานและอนุญาตให้เข้าสู่ศูนย์ควบคุม Live Operations",
  PAUSE: "การเข้างานและคิวใหม่จะถูกพักตามขอบเขตที่เลือก",
  RESUME: "การเข้างานและคิวจะกลับมาทำงานต่อจากสถานะเดิม",
  END: "งานจะหยุดรับผู้เข้าร่วมและคิวใหม่ การกระทำนี้ต้องยืนยันอย่างชัดเจน",
  CANCEL: "งานที่ Publish แล้วจะถูกยกเลิกพร้อมเหตุผล",
  ARCHIVE: "งานจะย้ายออกจากรายการที่กำลังดำเนินงาน",
  RESTORE_DRAFT: "เฉพาะ local preparation: สร้างสถานะ Draft สำหรับทดลองแก้ไขอีกครั้ง",
};

function primaryActionFor(status: FairStatus): FairLifecycleAction | null {
  switch (status) {
    case "DRAFT": return "PUBLISH";
    case "PUBLISHED": return "START";
    case "LIVE":
    case "PAUSED": return "END";
    case "ENDED":
    case "CANCELLED": return "ARCHIVE";
    case "ARCHIVED": return "RESTORE_DRAFT";
  }
}

function statusTone(status: FairStatus): "cyan" | "violet" | "mango" | "danger" | "neutral" {
  if (status === "LIVE") return "cyan";
  if (status === "PAUSED" || status === "DRAFT") return "mango";
  if (status === "ENDED" || status === "CANCELLED") return "danger";
  if (status === "ARCHIVED") return "neutral";
  return "violet";
}

function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(() => typeof navigator === "undefined" || navigator.onLine);
  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);
  return online;
}

export function AdminFairsPage() {
  const { user, database, actions } = useApp();
  const { toast } = useToast();
  const online = useOnlineStatus();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingFair, setEditingFair] = useState<JobFair | null>(null);
  const [previewFair, setPreviewFair] = useState<JobFair | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [transitionRequest, setTransitionRequest] = useState<TransitionRequest | null>(null);
  const [pendingFairId, setPendingFairId] = useState<string | null>(null);
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [membershipModalFairId, setMembershipModalFairId] = useState("");
  const [fairCategory, setFairCategory] = useState<FairCategory>("ACTIVE");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<FairSort>("START_ASC");
  const [feedback, setFeedback] = useState<{ tone: "success" | "error"; message: string } | null>(null);

  const fairs = useMemo(
    () => (user ? database.fairs.filter((fair) => fair.ownerId === user.id) : []),
    [database.fairs, user],
  );
  const fairIds = new Set(fairs.map((fair) => fair.id));
  const { activeFairs, upcomingFairs, expiredFairs, displayedFairs } = useMemo(() => {
    const now = Date.now();
    const isActive = (fair: JobFair) =>
      fair.status === "LIVE" || fair.status === "PAUSED" ||
      (fair.status === "PUBLISHED" && new Date(fair.startsAt).getTime() <= now && new Date(fair.endsAt).getTime() >= now);
    const isUpcoming = (fair: JobFair) =>
      fair.status === "DRAFT" || (fair.status === "PUBLISHED" && new Date(fair.startsAt).getTime() > now);
    const isExpired = (fair: JobFair) =>
      fair.status === "ENDED" || fair.status === "CANCELLED" || fair.status === "ARCHIVED" ||
      (new Date(fair.endsAt).getTime() < now && fair.status !== "DRAFT");
    const active = fairs.filter(isActive);
    const upcoming = fairs.filter(isUpcoming);
    const expired = fairs.filter(isExpired);
    const normalizedQuery = query.trim().toLocaleLowerCase("th");
    const result = fairs.filter((fair) => {
      const categoryMatch = fairCategory === "ALL" ||
        (fairCategory === "ACTIVE" && isActive(fair)) ||
        (fairCategory === "UPCOMING" && isUpcoming(fair)) ||
        (fairCategory === "EXPIRED" && isExpired(fair));
      if (!categoryMatch) return false;
      if (!normalizedQuery) return true;
      return [fair.title, fair.slug, fair.locationLabel, ...(fair.tags ?? [])]
        .join(" ").toLocaleLowerCase("th").includes(normalizedQuery);
    });
    const displayed = result.sort((left, right) => {
      if (sort === "TITLE_ASC") return left.title.localeCompare(right.title, "th");
      const delta = new Date(left.startsAt).getTime() - new Date(right.startsAt).getTime();
      return sort === "START_ASC" ? delta : -delta;
    });
    return { activeFairs: active, upcomingFairs: upcoming, expiredFairs: expired, displayedFairs: displayed };
  }, [fairCategory, fairs, query, sort]);

  const allPendingApprovals = database.memberships.filter((membership) =>
    fairIds.has(membership.fairId) && membership.role === "RECRUITER" && membership.status === "PENDING_APPROVAL",
  ).length;
  if (!user) return null;
  const reportSuccess = (message: string) => {
    setFeedback({ tone: "success", message });
    toast.success(message);
  };
  const reportError = (error: unknown) => {
    const message = error instanceof Error ? error.message : "ไม่สามารถดำเนินการได้ กรุณาลองอีกครั้ง";
    setFeedback({ tone: "error", message });
    toast.error(message);
  };
  const handleCreateFair = (payload: FairFormPayload) => {
    try {
      actions.createFair(user.id, { ...payload, status: "DRAFT" });
      setCreateModalOpen(false);
      reportSuccess(`สร้างงานแฟร์ “${payload.title}” เป็น Draft เรียบร้อยแล้ว`);
    } catch (error) { reportError(error); }
  };
  const handleUpdateFair = (payload: FairFormPayload) => {
    if (!editingFair) return;
    try {
      const { status: _ignoredStatus, ...metadata } = payload;
      actions.updateFair(editingFair.id, metadata);
      setEditingFair(null);
      reportSuccess(`บันทึกข้อมูลงานแฟร์ “${payload.title}” เรียบร้อยแล้ว`);
    } catch (error) { reportError(error); }
  };
  const confirmTransition = async () => {
    if (!transitionRequest || pendingFairId) return;
    setPendingFairId(transitionRequest.fair.id);
    setFeedback(null);
    try {
      const updated = actions.transitionFairStatus(transitionRequest.fair.id, transitionRequest.action);
      reportSuccess(`เปลี่ยนสถานะ “${updated.title}” เป็น ${updated.status} แล้ว`);
      setTransitionRequest(null);
    } catch (error) { reportError(error); }
    finally { setPendingFairId(null); }
  };
  const confirmDelete = async () => {
    if (!deleteTargetId || pendingFairId) return;
    setPendingFairId(deleteTargetId);
    setFeedback(null);
    try {
      actions.deleteFair(deleteTargetId);
      setDeleteTargetId(null);
      reportSuccess("ลบงานแฟร์และข้อมูลที่เกี่ยวข้องออกจาก local browser แล้ว");
    } catch (error) { reportError(error); }
    finally { setPendingFairId(null); }
  };
  const openMembershipGovernance = (fairId = "") => {
    setMembershipModalFairId(fairId);
    setMembershipModalOpen(true);
  };
  const clearFilters = () => {
    setFairCategory("ALL");
    setQuery("");
    setSort("START_ASC");
  };

  return (
    <AnimatedPage className="page-shell admin-fairs-page">
      <div className="page-header admin-page-header" data-reveal>
        <div>
          <span className="eyebrow"><ShieldCheck aria-hidden="true" /> Admin Governance Hub</span>
          <h1>ศูนย์จัดการ Job Fair</h1>
          <p>เตรียมงาน กำหนด lifecycle อนุมัติสิทธิ์บูธ และเปิดศูนย์ควบคุมเมื่อเริ่มงาน</p>
          <StatusPill tone="mango">LOCAL FAIR PREPARATION</StatusPill>
        </div>
        <div className="admin-header-actions">
          <PixelButton type="button" tone="cyan" onClick={() => openMembershipGovernance("")}>
            <UsersRound aria-hidden="true" /> จัดการสมาชิกและคำขอทั้งหมด{allPendingApprovals > 0 ? ` (${allPendingApprovals})` : ""}
          </PixelButton>
          <PixelButton type="button" tone="mango" onClick={() => setCreateModalOpen(true)}>
            <Plus aria-hidden="true" /> สร้าง Job Fair ใหม่
          </PixelButton>
        </div>
      </div>

      {!online ? (
        <div className="admin-state-banner tone-warning" role="status" data-testid="offline-banner">
          <AlertTriangle aria-hidden="true" /><div><strong>เบราว์เซอร์ออฟไลน์</strong><span>งาน local ยังบันทึกในเครื่องนี้ได้ แต่บริการ Supabase/Realtime ในอนาคตจะยังใช้ไม่ได้</span></div>
        </div>
      ) : null}
      {feedback ? (
        <div className={`admin-state-banner tone-${feedback.tone}`} role={feedback.tone === "error" ? "alert" : "status"}>
          {feedback.tone === "error" ? <AlertTriangle aria-hidden="true" /> : <ShieldCheck aria-hidden="true" />}
          <span>{feedback.message}</span>
          <button type="button" className="admin-banner-dismiss" onClick={() => setFeedback(null)}>ปิดข้อความ</button>
        </div>
      ) : null}

      <div className="cyber-stats-grid cols-4 admin-stat-grid" data-reveal>
        <StatFilter selected={fairCategory === "ALL"} onClick={() => setFairCategory("ALL")} tone="mango" icon={<CalendarDays aria-hidden="true" />} label="งานแฟร์ที่คุณดูแล" value={fairs.length} />
        <StatFilter selected={fairCategory === "ACTIVE"} onClick={() => setFairCategory("ACTIVE")} tone="cyan" icon={<Radio aria-hidden="true" />} label="กำลังดำเนินงาน" value={activeFairs.length} />
        <StatFilter selected={fairCategory === "EXPIRED"} onClick={() => setFairCategory("EXPIRED")} tone="violet" icon={<Archive aria-hidden="true" />} label="หมดอายุหรือจบงาน" value={expiredFairs.length} />
        <StatFilter selected={false} onClick={() => openMembershipGovernance("")} tone="green" icon={<Clock aria-hidden="true" />} label="คำขอรออนุมัติ" value={allPendingApprovals} pressedState={false} />
      </div>

      <FairStudioModal open={createModalOpen} onClose={() => setCreateModalOpen(false)} onSubmit={handleCreateFair} />
      <FairStudioModal open={Boolean(editingFair)} initialFair={editingFair} onClose={() => setEditingFair(null)} onSubmit={handleUpdateFair} />
      <FairMembershipModal open={membershipModalOpen} onClose={() => setMembershipModalOpen(false)} initialFairId={membershipModalFairId} />
      <FairQuickPreviewModal fair={previewFair} booths={database.booths} jobs={database.jobs} open={Boolean(previewFair)} onClose={() => setPreviewFair(null)} showPublicLink={false} />

      <Modal open={Boolean(transitionRequest)} onClose={() => !pendingFairId && setTransitionRequest(null)} title={transitionRequest ? `ยืนยัน: ${actionLabels[transitionRequest.action]}` : "ยืนยันการเปลี่ยนสถานะ"} subtitle={transitionRequest?.fair.title} maxWidth="520px">
        <div className="admin-confirm-content" aria-busy={Boolean(pendingFairId)}>
          <AlertTriangle aria-hidden="true" /><p>{transitionRequest ? actionDescriptions[transitionRequest.action] : ""}</p>
          <div className="admin-confirm-actions">
            <PixelButton type="button" tone="neutral" onClick={() => setTransitionRequest(null)} disabled={Boolean(pendingFairId)}>ย้อนกลับ</PixelButton>
            <PixelButton type="button" tone={transitionRequest?.action === "END" ? "danger" : "mango"} onClick={() => void confirmTransition()} disabled={Boolean(pendingFairId)} data-autofocus>{pendingFairId ? "กำลังบันทึก…" : "ยืนยันการเปลี่ยนสถานะ"}</PixelButton>
          </div>
        </div>
      </Modal>
      <Modal open={Boolean(deleteTargetId)} onClose={() => !pendingFairId && setDeleteTargetId(null)} title="ยืนยันการลบ Job Fair" subtitle="การลบจะไม่สามารถกู้คืนจาก local browser ได้" maxWidth="480px">
        <div className="admin-confirm-content" aria-busy={Boolean(pendingFairId)}>
          <AlertTriangle aria-hidden="true" /><p>งานแฟร์ บูธ ตำแหน่งงาน และข้อมูลสมาชิกที่สังกัดงานนี้จะถูกลบจากเครื่องนี้ทันที</p>
          <div className="admin-confirm-actions">
            <PixelButton type="button" tone="neutral" onClick={() => setDeleteTargetId(null)} disabled={Boolean(pendingFairId)}>ยกเลิก</PixelButton>
            <PixelButton type="button" tone="danger" onClick={() => void confirmDelete()} disabled={Boolean(pendingFairId)} data-autofocus><Trash2 aria-hidden="true" /> {pendingFairId ? "กำลังลบ…" : "ยืนยันลบงานแฟร์"}</PixelButton>
          </div>
        </div>
      </Modal>

      <section className="admin-fairs-section">
        <div className="section-heading admin-fairs-heading" data-reveal>
          <div><h2>รายการงานแฟร์</h2><p aria-live="polite">แสดง {displayedFairs.length} จาก {fairs.length} งาน</p></div>
          <div className="admin-fair-filters" role="group" aria-label="ค้นหาและเรียงงานแฟร์">
            <Field label="ค้นหางานแฟร์" name="fairSearch" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="ชื่อ, slug, สถานที่ หรือแท็ก" />
            <SelectField label="เรียงตาม" name="fairSort" value={sort} onChange={(event) => setSort(event.target.value as FairSort)}>
              <option value="START_ASC">วันเริ่ม: เร็วไปช้า</option><option value="START_DESC">วันเริ่ม: ช้าไปเร็ว</option><option value="TITLE_ASC">ชื่อ: ก–ฮ / A–Z</option>
            </SelectField>
          </div>
        </div>
        <div className="admin-category-tabs" role="group" aria-label="หมวดหมู่งานแฟร์">
          {([ ["ACTIVE", `กำลังดำเนินงาน (${activeFairs.length})`], ["UPCOMING", `กำลังจะมาถึง (${upcomingFairs.length})`], ["EXPIRED", `หมดอายุหรือจบงาน (${expiredFairs.length})`], ["ALL", `ทั้งหมด (${fairs.length})`] ] as Array<[FairCategory, string]>).map(([value, label]) => (
            <PixelButton key={value} type="button" tone={fairCategory === value ? (value === "EXPIRED" ? "danger" : value === "UPCOMING" ? "mango" : "cyan") : "neutral"} onClick={() => setFairCategory(value)} aria-pressed={fairCategory === value}>{label}</PixelButton>
          ))}
        </div>

        {displayedFairs.length === 0 ? (
          <EmptyState title={fairs.length === 0 ? "ยังไม่มีงานแฟร์ในระบบ" : "ไม่พบงานแฟร์ที่ตรงกับตัวกรอง"} body={fairs.length === 0 ? "สร้าง Draft แรกเพื่อกำหนดข้อมูล แบรนดิ้ง และช่วงเวลาจัดงาน" : "ลองเปลี่ยนคำค้นหา หมวดหมู่ หรือล้างตัวกรองทั้งหมด"} action={fairs.length === 0 ? <PixelButton type="button" tone="mango" onClick={() => setCreateModalOpen(true)}><Plus aria-hidden="true" /> สร้าง Job Fair ใหม่</PixelButton> : <PixelButton type="button" tone="neutral" onClick={clearFilters}><Search aria-hidden="true" /> ล้างตัวกรอง</PixelButton>} />
        ) : (
          <div className="card-grid admin-fairs-card-grid">
            {displayedFairs.map((fair) => {
              const boothCount = database.booths.filter((booth) => booth.fairId === fair.id).length;
              const memberCount = database.memberships.filter((member) => member.fairId === fair.id).length;
              const pendingCount = database.memberships.filter((membership) => membership.fairId === fair.id && membership.role === "RECRUITER" && membership.status === "PENDING_APPROVAL").length;
              const action = primaryActionFor(fair.status);
              const isPending = pendingFairId === fair.id;
              return (
                <PixelSurface className="admin-fair-card" data-reveal key={fair.id} aria-busy={isPending}>
                  <div className="admin-fair-card-header">
                    <div className="admin-fair-badges">
                      <StatusPill tone={statusTone(fair.status)}>{fair.status}</StatusPill>
                      {fair.autoSchedule ? <span className="admin-auto-badge"><Zap aria-hidden="true" /> Auto schedule</span> : null}
                      {pendingCount > 0 ? <button type="button" className="admin-pending-badge" onClick={() => openMembershipGovernance(fair.id)}><Clock aria-hidden="true" /> {pendingCount} รออนุมัติ</button> : null}
                    </div>
                    <div className="admin-fair-actions-top">
                      <button type="button" className="admin-icon-text-button" onClick={() => setPreviewFair(fair)} aria-label={`ดูตัวอย่าง ${fair.title}`}><Eye aria-hidden="true" /> ตัวอย่าง</button>
                      <button type="button" className="admin-icon-text-button" onClick={() => setEditingFair(fair)} aria-label={`แก้ไข ${fair.title}`}><Edit3 aria-hidden="true" /> แก้ไข</button>
                      <button type="button" className="admin-icon-button danger" onClick={() => setDeleteTargetId(fair.id)} aria-label={`ลบ ${fair.title}`}><Trash2 aria-hidden="true" /></button>
                    </div>
                  </div>
                  <div className="admin-fair-title-row">
                    {fair.logoUrl ? <img src={fair.logoUrl} alt="" className="admin-fair-logo" /> : null}
                    <div className="admin-fair-title-copy"><h3 className="admin-fair-title">{fair.title}</h3><div className="admin-fair-subline"><span><MapPin aria-hidden="true" /> {fair.locationLabel || "Online Fair"}</span><span className="admin-fair-slug-badge">/{fair.slug}</span></div></div>
                  </div>
                  {fair.summary ? <p className="admin-fair-summary">{fair.summary}</p> : null}
                  <div className="admin-fair-info-grid">
                    <div className="admin-fair-info-item"><Store aria-hidden="true" /><span><strong>{boothCount}</strong> บูธบริษัท</span></div>
                    <div className="admin-fair-info-item"><UsersRound aria-hidden="true" /><span><strong>{memberCount}</strong> สมาชิก</span></div>
                    <div className="admin-fair-info-item full-width"><CalendarDays aria-hidden="true" /><span>{new Date(fair.startsAt).toLocaleString("th-TH")} – {new Date(fair.endsAt).toLocaleString("th-TH")} {fair.timezone ? `(${fair.timezone})` : ""}</span></div>
                  </div>
                  {((fair.tags?.length ?? 0) > 0 || (fair.mediaLinks?.length ?? 0) > 0) ? <div className="admin-fair-tags">{(fair.mediaLinks?.length ?? 0) > 0 ? <span className="admin-media-count"><Link2 aria-hidden="true" /> {fair.mediaLinks?.length} มีเดีย</span> : null}{fair.tags?.map((tag) => <span key={tag} className="stat-chip">#{tag}</span>)}</div> : null}
                  <div className="admin-fair-card-footer">
                    <div className="admin-card-primary-actions">
                      {action ? <PixelButton type="button" tone={action === "END" ? "danger" : action === "PUBLISH" || action === "RESTORE_DRAFT" ? "mango" : "cyan"} onClick={() => setTransitionRequest({ fair, action })} disabled={isPending}>{action === "PUBLISH" ? <Radio aria-hidden="true" /> : action === "START" ? <Play aria-hidden="true" /> : action === "END" ? <Square aria-hidden="true" /> : <Archive aria-hidden="true" />}{actionLabels[action]}</PixelButton> : null}
                      {(fair.status === "LIVE" || fair.status === "PAUSED") ? <PixelLink tone="mango" to={`/ops/events/${fair.id}/live`}><Radio aria-hidden="true" /> Live Operations</PixelLink> : null}
                    </div>
                    <PixelButton type="button" tone="neutral" onClick={() => openMembershipGovernance(fair.id)}><UsersRound aria-hidden="true" /> สมาชิกและคำขอ{pendingCount > 0 ? ` (${pendingCount})` : ""}</PixelButton>
                  </div>
                </PixelSurface>
              );
            })}
          </div>
        )}
      </section>
    </AnimatedPage>
  );
}

function StatFilter({ selected, onClick, tone, icon, label, value, pressedState = true }: { selected: boolean; onClick: () => void; tone: "mango" | "cyan" | "violet" | "green"; icon: ReactNode; label: string; value: number; pressedState?: boolean }) {
  return (
    <button type="button" className={`cyber-stat-card admin-stat-filter ${selected ? "is-selected" : ""}`} onClick={onClick} {...(pressedState ? { "aria-pressed": selected } : {})}>
      <span className={`stat-icon-badge ${tone}`}>{icon}</span><span className="stat-meta"><span className="stat-label">{label}</span><strong className="stat-number">{value}</strong></span>
    </button>
  );
}
