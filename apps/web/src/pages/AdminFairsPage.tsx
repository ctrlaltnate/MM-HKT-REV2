import {
  Archive,
  Building2,
  CalendarPlus,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Mail,
  Play,
  Radio,
  Send,
  ShieldCheck,
  Square,
  Trash2,
  UserCheck,
  UserPlus,
  UsersRound,
  UserX,
  X,
  XCircle,
} from "lucide-react";
import { type FormEvent, useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import {
  EmptyState,
  Field,
  PixelButton,
  PixelSurface,
  StatusPill,
  TextAreaField,
} from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import type { JobFair } from "../domain/types";

export function AdminFairsPage() {
  const { user, database, actions } = useApp();
  const [error, setError] = useState("");
  const [editingFair, setEditingFair] = useState<JobFair | null>(null);
  const [editError, setEditError] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Membership governance state
  const [selectedFairId, setSelectedFairId] = useState<string>("");
  const [memberTab, setMemberTab] = useState<"pending" | "invite" | "recruiters" | "candidates">("pending");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");

  if (!user) return null;
  const fairs = database.fairs.filter((fair) => fair.ownerId === user.id);
  const fairIds = new Set(fairs.map((fair) => fair.id));

  // Determine active fair for governance panel
  const activeFairId = selectedFairId && fairIds.has(selectedFairId) ? selectedFairId : fairs[0]?.id ?? "";
  const activeFair = fairs.find((f) => f.id === activeFairId);

  // Memberships for the selected fair
  const fairMemberships = database.memberships.filter((m) => m.fairId === activeFairId);
  const pendingRecruiterRequests = fairMemberships.filter(
    (m) => m.role === "RECRUITER" && m.status === "PENDING_APPROVAL",
  );
  const invitedRecruiters = fairMemberships.filter(
    (m) => m.role === "RECRUITER" && m.status === "INVITED",
  );
  const activeRecruiters = fairMemberships.filter(
    (m) => m.role === "RECRUITER" && m.status === "ACTIVE",
  );
  const activeCandidates = fairMemberships.filter(
    (m) => m.role === "CANDIDATE" && (m.status === "ACTIVE" || !m.status),
  );

  const recruiterBooths = database.booths.filter((booth) => fairIds.has(booth.fairId));

  const submitCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const startsAt = String(form.get("startsAt"));
    const endsAt = String(form.get("endsAt"));
    if (new Date(endsAt) <= new Date(startsAt)) {
      setError("เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มงาน");
      return;
    }
    setError("");
    const newFair = actions.createFair(user.id, {
      title: String(form.get("title")).trim(),
      slug: String(form.get("slug")).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      summary: String(form.get("summary")).trim(),
      locationLabel: String(form.get("locationLabel")).trim(),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      status: "DRAFT",
    });
    setSelectedFairId(newFair.id);
    event.currentTarget.reset();
  };

  const submitEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingFair) return;
    const form = new FormData(event.currentTarget);
    const startsAt = String(form.get("startsAt"));
    const endsAt = String(form.get("endsAt"));
    if (new Date(endsAt) <= new Date(startsAt)) {
      setEditError("เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มงาน");
      return;
    }
    setEditError("");
    actions.updateFair(editingFair.id, {
      title: String(form.get("title")).trim(),
      slug: String(form.get("slug")).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      summary: String(form.get("summary")).trim(),
      locationLabel: String(form.get("locationLabel")).trim(),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      status: String(form.get("status")) as JobFair["status"],
    });
    setEditingFair(null);
  };

  const transition = (fair: JobFair) => {
    const next: Record<JobFair["status"], JobFair["status"]> = {
      DRAFT: "PUBLISHED",
      PUBLISHED: "LIVE",
      LIVE: "ENDED",
      ENDED: "ARCHIVED",
      ARCHIVED: "DRAFT",
    };
    actions.setFairStatus(fair.id, next[fair.status]);
  };

  const confirmDelete = (fairId: string) => {
    actions.deleteFair(fairId);
    setDeleteTargetId(null);
    if (selectedFairId === fairId) {
      setSelectedFairId("");
    }
  };

  const handleSendInvite = (e: FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !activeFairId) return;
    try {
      setInviteError("");
      setInviteSuccess("");
      actions.inviteRecruiterToFair(activeFairId, inviteEmail.trim(), user.id);
      setInviteSuccess(`ส่งคำเชิญไปยัง ${inviteEmail.trim()} เรียบร้อยแล้ว`);
      setInviteEmail("");
    } catch {
      setInviteError("เกิดข้อผิดพลาดในการส่งคำเชิญ");
    }
  };

  const toLocalInputFormat = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const offsetMs = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offsetMs);
      return localDate.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Admin workspace</span>
        <h1>สร้างและเปิด Job Fair</h1>
        <p>สร้างและแก้ไขกำหนดการ Publish อนุมัติ Recruiter เข้าร่วมงาน หรือ Archive เมื่อเสร็จสิ้น</p>
      </div>

      <div className="dashboard-grid">
        <PixelSurface data-reveal>
          <h2><CalendarPlus aria-hidden="true" /> งานแฟร์ใหม่</h2>
          <form className="form-grid" onSubmit={submitCreate}>
            <Field label="ชื่องาน" name="title" required />
            <Field label="Slug ภาษาอังกฤษ" name="slug" placeholder="tech-career-2026" pattern="[A-Za-z0-9-]+" required />
            <Field label="สถานที่/รูปแบบ" name="locationLabel" placeholder="Online · Thailand" required />
            <Field label="เวลาเริ่ม" name="startsAt" type="datetime-local" required />
            <Field label="เวลาสิ้นสุด" name="endsAt" type="datetime-local" required />
            <TextAreaField className="full" label="รายละเอียดงาน" name="summary" required />
            {error ? <p className="form-message error" role="alert">{error}</p> : null}
            <div className="button-row">
              <PixelButton type="submit" tone="mango">สร้าง Draft</PixelButton>
            </div>
          </form>
        </PixelSurface>
        <PixelSurface data-reveal className="metric-card">
          <strong>{fairs.length}</strong>
          <span>งานที่คุณดูแล</span>
          <p>สถานะ Local จะถูกจดจำใน browser และใช้ร่วมกับหน้าของ Recruiter/Candidate บนเครื่องนี้</p>
        </PixelSurface>
      </div>

      {/* Edit Fair Modal */}
      {editingFair ? (
        <div className="auth-backdrop" role="presentation" onClick={() => setEditingFair(null)}>
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-label="แก้ไขข้อมูลงานแฟร์"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560 }}
          >
            <div className="auth-header">
              <div className="auth-title">
                <Edit3 aria-hidden="true" />
                <h2>แก้ไขงานแฟร์</h2>
              </div>
              <button
                type="button"
                className="auth-close"
                onClick={() => setEditingFair(null)}
                aria-label="ปิดกล่องแก้ไข"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <form className="form-grid" onSubmit={submitEdit} style={{ marginTop: 16 }}>
              <Field label="ชื่องาน" name="title" defaultValue={editingFair.title} required />
              <Field label="Slug ภาษาอังกฤษ" name="slug" defaultValue={editingFair.slug} pattern="[A-Za-z0-9-]+" required />
              <Field label="สถานที่/รูปแบบ" name="locationLabel" defaultValue={editingFair.locationLabel} required />
              <div>
                <label className="pixel-label">สถานะ</label>
                <select name="status" defaultValue={editingFair.status} className="pixel-input">
                  <option value="DRAFT">DRAFT (ฉบับร่าง)</option>
                  <option value="PUBLISHED">PUBLISHED (เปิดให้ดูบูธ)</option>
                  <option value="LIVE">LIVE (กำลังจัดงาน)</option>
                  <option value="ENDED">ENDED (จบงาน)</option>
                  <option value="ARCHIVED">ARCHIVED (เก็บถาวร)</option>
                </select>
              </div>
              <Field label="เวลาเริ่ม" name="startsAt" type="datetime-local" defaultValue={toLocalInputFormat(editingFair.startsAt)} required />
              <Field label="เวลาสิ้นสุด" name="endsAt" type="datetime-local" defaultValue={toLocalInputFormat(editingFair.endsAt)} required />
              <TextAreaField className="full" label="รายละเอียดงาน" name="summary" defaultValue={editingFair.summary} required />
              {editError ? <p className="form-message error" role="alert">{editError}</p> : null}
              <div className="button-row" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <PixelButton type="button" tone="neutral" onClick={() => setEditingFair(null)}>
                  ยกเลิก
                </PixelButton>
                <PixelButton type="submit" tone="mango">
                  <Check aria-hidden="true" /> บันทึกการแก้ไข
                </PixelButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Confirmation Modal */}
      {deleteTargetId ? (
        <div className="auth-backdrop" role="presentation" onClick={() => setDeleteTargetId(null)}>
          <div
            className="auth-modal"
            role="alertdialog"
            aria-modal="true"
            aria-label="ยืนยันการลบงานแฟร์"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 440 }}
          >
            <div className="auth-header">
              <div className="auth-title">
                <Trash2 aria-hidden="true" />
                <h2>ยืนยันการลบงานแฟร์</h2>
              </div>
              <button
                type="button"
                className="auth-close"
                onClick={() => setDeleteTargetId(null)}
                aria-label="ปิดการลบ"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <p style={{ margin: "16px 0", color: "#f87171" }}>
              คำเตือน: การลบงานแฟร์นี้จะลบบูธและตำแหน่งงานทั้งหมดที่สังกัดอยู่ในงานนี้ทันที
            </p>
            <div className="button-row" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <PixelButton type="button" tone="neutral" onClick={() => setDeleteTargetId(null)}>
                ยกเลิก
              </PixelButton>
              <PixelButton type="button" tone="danger" onClick={() => confirmDelete(deleteTargetId)}>
                <Trash2 aria-hidden="true" /> ลบงานแฟร์นี้
              </PixelButton>
            </div>
          </div>
        </div>
      ) : null}

      {/* All Fairs Section */}
      <section style={{ marginTop: 36 }}>
        <div className="section-heading" data-reveal>
          <h2>งานแฟร์ทั้งหมด</h2>
          <p>จัดการข้อมูล เปลี่ยนสถานะ หรือ Archive งานที่เสร็จสิ้น</p>
        </div>
        <div className="card-grid">
          {fairs.map((fair) => {
            const boothCount = database.booths.filter((booth) => booth.fairId === fair.id).length;
            const memberCount = database.memberships.filter((member) => member.fairId === fair.id).length;
            const pendingCount = database.memberships.filter(
              (m) => m.fairId === fair.id && m.role === "RECRUITER" && m.status === "PENDING_APPROVAL",
            ).length;

            return (
              <PixelSurface
                className="fair-card"
                data-reveal
                key={fair.id}
                style={fair.id === activeFairId ? { borderColor: "var(--cyan)", boxShadow: "0 0 16px rgba(120, 219, 230, 0.15)" } : undefined}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <StatusPill
                      tone={
                        fair.status === "LIVE"
                          ? "cyan"
                          : fair.status === "DRAFT"
                          ? "mango"
                          : fair.status === "ARCHIVED"
                          ? "neutral"
                          : "violet"
                      }
                    >
                      {fair.status}
                    </StatusPill>
                    {pendingCount > 0 ? (
                      <span
                        style={{
                          background: "rgba(255, 216, 77, 0.15)",
                          border: "1px solid var(--mango)",
                          color: "var(--mango)",
                          padding: "2px 8px",
                          borderRadius: 4,
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Clock size={12} aria-hidden="true" /> {pendingCount} คำขอรออนุมัติ
                      </span>
                    ) : null}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      className="edit-button-sm"
                      onClick={() => {
                        setEditingFair(fair);
                        setEditError("");
                      }}
                      title="แก้ไขงานแฟร์"
                      aria-label={`แก้ไข ${fair.title}`}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 4,
                        color: "#f0f6fc",
                        cursor: "pointer",
                        padding: "4px 8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.8rem",
                      }}
                    >
                      <Edit3 size={14} aria-hidden="true" /> แก้ไข
                    </button>
                    <button
                      type="button"
                      className="delete-button-sm"
                      onClick={() => setDeleteTargetId(fair.id)}
                      title="ลบงานแฟร์"
                      aria-label={`ลบ ${fair.title}`}
                      style={{
                        background: "rgba(239,68,68,0.1)",
                        border: "1px solid rgba(239,68,68,0.3)",
                        borderRadius: 4,
                        color: "#f87171",
                        cursor: "pointer",
                        padding: "4px 8px",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: "0.8rem",
                      }}
                    >
                      <Trash2 size={14} aria-hidden="true" /> ลบ
                    </button>
                  </div>
                </div>

                <h3>{fair.title}</h3>
                <p>{fair.summary}</p>
                <div className="inline-meta">
                  <span>{boothCount} บูธ</span><span>{memberCount} สมาชิก</span><span>/{fair.slug}</span>
                </div>
                <div className="button-row" style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                  {fair.status !== "ARCHIVED" ? (
                    <PixelButton
                      tone={fair.status === "LIVE" ? "danger" : fair.status === "DRAFT" ? "mango" : "cyan"}
                      onClick={() => transition(fair)}
                    >
                      {fair.status === "DRAFT" ? (
                        <Radio aria-hidden="true" />
                      ) : fair.status === "PUBLISHED" ? (
                        <Play aria-hidden="true" />
                      ) : fair.status === "LIVE" ? (
                        <Square aria-hidden="true" />
                      ) : (
                        <Archive aria-hidden="true" />
                      )}
                      {fair.status === "DRAFT"
                        ? "Publish"
                        : fair.status === "PUBLISHED"
                        ? "เริ่มงาน"
                        : fair.status === "LIVE"
                        ? "ปิดงาน"
                        : "Archive"}
                    </PixelButton>
                  ) : (
                    <PixelButton tone="neutral" onClick={() => actions.setFairStatus(fair.id, "DRAFT")}>
                      <Radio aria-hidden="true" /> กู้คืนเป็น Draft
                    </PixelButton>
                  )}
                  <PixelButton
                    tone={fair.id === activeFairId ? "cyan" : "neutral"}
                    onClick={() => {
                      setSelectedFairId(fair.id);
                      const el = document.getElementById("membership-governance-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    <ShieldCheck aria-hidden="true" /> จัดการสมาชิก
                  </PixelButton>
                </div>
              </PixelSurface>
            );
          })}
        </div>
      </section>

      {/* Fair Membership Governance Section */}
      <section id="membership-governance-section" style={{ marginTop: 48 }} aria-labelledby="membership-governance-title">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">Fair Membership Governance</span>
            <h2 id="membership-governance-title">การจัดการสมาชิกและคำขอเข้าร่วมงาน</h2>
          </div>
          <p>
            ควบคุมสิทธิ์การเปิดบูธของ Recruiter ตรวจสอบคำขอเข้าร่วม ส่งคำเชิญทางอีเมล และจัดการสมาชิกทั้งหมดในงาน
          </p>
        </div>

        {fairs.length === 0 ? (
          <EmptyState title="ยังไม่มีงานแฟร์" body="กรุณาสร้างงานแฟร์อย่างน้อยหนึ่งงานเพื่อเริ่มต้นจัดการสมาชิก" />
        ) : (
          <PixelSurface data-reveal style={{ padding: 24 }}>
            {/* Fair Switcher Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16, borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: 16 }}>
              <div>
                <label className="pixel-label" htmlFor="governance-fair-select" style={{ marginBottom: 4, display: "block" }}>
                  เลือกงานที่ต้องการจัดการสมาชิก:
                </label>
                <select
                  id="governance-fair-select"
                  aria-label="เลือกงานที่ต้องการจัดการสมาชิก"
                  className="pixel-input"
                  value={activeFairId}
                  onChange={(e) => setSelectedFairId(e.target.value)}
                  style={{ minWidth: 260 }}
                >
                  {fairs.map((fair) => (
                    <option key={fair.id} value={fair.id}>
                      {fair.title} ({fair.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Navigation Tabs */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <PixelButton
                  tone={memberTab === "pending" ? "mango" : "neutral"}
                  onClick={() => setMemberTab("pending")}
                >
                  <Clock aria-hidden="true" /> รออนุมัติ ({pendingRecruiterRequests.length})
                </PixelButton>
                <PixelButton
                  tone={memberTab === "invite" ? "mango" : "neutral"}
                  onClick={() => setMemberTab("invite")}
                >
                  <Mail aria-hidden="true" /> ส่งคำเชิญ ({invitedRecruiters.length})
                </PixelButton>
                <PixelButton
                  tone={memberTab === "recruiters" ? "cyan" : "neutral"}
                  onClick={() => setMemberTab("recruiters")}
                >
                  <Building2 aria-hidden="true" /> Recruiter ในงาน ({activeRecruiters.length})
                </PixelButton>
                <PixelButton
                  tone={memberTab === "candidates" ? "violet" : "neutral"}
                  onClick={() => setMemberTab("candidates")}
                >
                  <UsersRound aria-hidden="true" /> ผู้สมัคร ({activeCandidates.length})
                </PixelButton>
              </div>
            </div>

            {/* TAB 1: PENDING APPROVALS */}
            {memberTab === "pending" ? (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={18} style={{ color: "var(--mango)" }} aria-hidden="true" />
                  คำขอเข้าร่วมงานจาก Recruiter ที่รอการอนุมัติ ({activeFair?.title})
                </h3>
                {pendingRecruiterRequests.length === 0 ? (
                  <EmptyState
                    title="ไม่มีคำขอรออนุมัติ"
                    body="เมื่อ Recruiter ขอยื่นเข้าร่วมงานแฟร์นี้ รายชื่อและข้อมูลบริษัทจะปรากฏที่นี่เพื่อรอการอนุมัติจาก Admin"
                  />
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {pendingRecruiterRequests.map((req) => {
                      const recruiterUser = database.users.find((u) => u.id === req.userId);
                      const recruiterCompany = database.companies.find((c) => c.ownerId === req.userId);
                      return (
                        <div
                          key={req.id}
                          style={{
                            background: "rgba(255, 216, 77, 0.05)",
                            border: "1px solid rgba(255, 216, 77, 0.25)",
                            borderRadius: 8,
                            padding: 16,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 16,
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <strong style={{ fontSize: "1.05rem", color: "var(--text)" }}>
                                {recruiterUser?.displayName ?? "Recruiter"}
                              </strong>
                              <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>({recruiterUser?.email})</span>
                              <StatusPill tone="mango">รออนุมัติ</StatusPill>
                            </div>
                            <p style={{ margin: 0, fontSize: "0.9rem", color: "var(--muted)" }}>
                              บริษัท: <strong>{recruiterCompany?.name ?? "ยังไม่ได้กรอกข้อมูลบริษัท"}</strong> · ยื่นเมื่อ {new Date(req.joinedAt).toLocaleDateString("th-TH")}
                            </p>
                          </div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <PixelButton
                              tone="cyan"
                              onClick={() => actions.reviewFairMembership(req.id, "ACTIVE", user.id)}
                            >
                              <CheckCircle2 aria-hidden="true" /> อนุมัติเข้าร่วม
                            </PixelButton>
                            <PixelButton
                              tone="danger"
                              onClick={() => actions.reviewFairMembership(req.id, "REJECTED", user.id)}
                            >
                              <XCircle aria-hidden="true" /> ปฏิเสธ
                            </PixelButton>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}

            {/* TAB 2: INVITE RECRUITER */}
            {memberTab === "invite" ? (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Mail size={18} style={{ color: "var(--mango)" }} aria-hidden="true" />
                  เชิญ Recruiter เข้าร่วมงานแฟร์ ({activeFair?.title})
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 16 }}>
                  ระบุอีเมลของ Recruiter หรือตัวแทนบริษัทเพื่อส่งคำเชิญ เมื่อ Recruiter เข้าสู่ระบบจะสามารถกดยอมรับคำเชิญและเปิดบูธได้ทันที
                </p>

                <form onSubmit={handleSendInvite} style={{ display: "flex", gap: 12, maxWidth: 520, marginBottom: 24, flexWrap: "wrap" }}>
                  <input
                    type="email"
                    placeholder="recruiter@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    required
                    aria-label="อีเมล Recruiter ที่ต้องการเชิญ"
                    className="pixel-input"
                    style={{ flex: 1, minWidth: 240 }}
                  />
                  <PixelButton type="submit" tone="mango">
                    <Send aria-hidden="true" /> ส่งคำเชิญ
                  </PixelButton>
                </form>

                {inviteSuccess ? (
                  <p className="form-message" style={{ color: "var(--success)", marginBottom: 16 }} role="status">
                    <Check aria-hidden="true" /> {inviteSuccess}
                  </p>
                ) : null}
                {inviteError ? (
                  <p className="form-message error" style={{ marginBottom: 16 }} role="alert">
                    {inviteError}
                  </p>
                ) : null}

                <h4 style={{ fontSize: "0.95rem", color: "var(--muted)", marginBottom: 12 }}>คำเชิญที่รอดำเนินการ ({invitedRecruiters.length})</h4>
                {invitedRecruiters.length === 0 ? (
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>ไม่มีคำเชิญที่ค้างอยู่</p>
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {invitedRecruiters.map((inv) => (
                      <div
                        key={inv.id}
                        style={{
                          background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: 6,
                          padding: "10px 16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong>{inv.invitedEmail ?? "Unknown email"}</strong>
                          <span style={{ marginLeft: 12, color: "var(--muted)", fontSize: "0.8rem" }}>
                            เชิญเมื่อ {new Date(inv.joinedAt).toLocaleDateString("th-TH")}
                          </span>
                        </div>
                        <PixelButton tone="neutral" onClick={() => actions.removeFairMembership(inv.id)}>
                          <Trash2 size={14} aria-hidden="true" /> ยกเลิกคำเชิญ
                        </PixelButton>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* TAB 3: ACTIVE RECRUITERS & BOOTHS */}
            {memberTab === "recruiters" ? (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <Building2 size={18} style={{ color: "var(--cyan)" }} aria-hidden="true" />
                  Recruiter ที่ได้รับอนุญาตในงาน ({activeFair?.title})
                </h3>
                {activeRecruiters.length === 0 ? (
                  <EmptyState
                    title="ยังไม่มี Recruiter ที่ได้รับอนุญาต"
                    body="อนุมัติคำขอหรือส่งคำเชิญเพื่อให้ Recruiter สามารถเปิดบูธในงานนี้ได้"
                  />
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    {activeRecruiters.map((m) => {
                      const recruiterUser = database.users.find((u) => u.id === m.userId);
                      const recruiterCompany = database.companies.find((c) => c.ownerId === m.userId);
                      const booth = database.booths.find((b) => b.fairId === activeFairId && b.ownerId === m.userId);
                      const jobCount = booth ? database.jobs.filter((j) => j.boothId === booth.id).length : 0;

                      return (
                        <div
                          key={m.id}
                          style={{
                            background: "rgba(120, 219, 230, 0.04)",
                            border: "1px solid rgba(120, 219, 230, 0.15)",
                            borderRadius: 8,
                            padding: 16,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 16,
                          }}
                        >
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <strong style={{ fontSize: "1.05rem" }}>{recruiterCompany?.name ?? "ไม่ระบุบริษัท"}</strong>
                              <StatusPill tone="cyan">ACTIVE</StatusPill>
                              {booth ? (
                                <StatusPill tone={booth.status === "PUBLISHED" ? "cyan" : "mango"}>
                                  บูธ: {booth.status}
                                </StatusPill>
                              ) : (
                                <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>ยังไม่สร้างบูธ</span>
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
                              Recruiter: {recruiterUser?.displayName ?? "Unknown"} ({recruiterUser?.email}) · {jobCount} ตำแหน่งงาน
                            </p>
                          </div>
                          <PixelButton tone="danger" onClick={() => actions.removeFairMembership(m.id)}>
                            <UserX aria-hidden="true" /> เพิกถอนสิทธิ์
                          </PixelButton>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}

            {/* TAB 4: CANDIDATE PARTICIPANTS */}
            {memberTab === "candidates" ? (
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <UsersRound size={18} style={{ color: "var(--violet)" }} aria-hidden="true" />
                  ผู้สมัครที่ลงทะเบียนในงาน ({activeFair?.title})
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginBottom: 16 }}>
                  ผู้สมัครทุกคนที่กดยืนยันเข้าร่วมงานแฟร์นี้ (รักษาความเป็นส่วนตัวตามหลัก Blind Identity)
                </p>
                {activeCandidates.length === 0 ? (
                  <EmptyState title="ยังไม่มีผู้สมัครลงทะเบียน" body="เมื่อผู้สมัครกดยืนยันเข้าร่วมงานแฟร์ รายการจะปรากฏที่นี่" />
                ) : (
                  <div style={{ display: "grid", gap: 8 }}>
                    {activeCandidates.map((cand, idx) => {
                      const profile = database.candidateProfiles.find((p) => p.userId === cand.userId);
                      return (
                        <div
                          key={cand.id}
                          style={{
                            background: "rgba(154, 114, 255, 0.05)",
                            border: "1px solid rgba(154, 114, 255, 0.15)",
                            borderRadius: 6,
                            padding: "10px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <strong>ผู้สมัคร #{idx + 1} (Masked ID: {cand.userId.slice(-6).toUpperCase()})</strong>
                            <span style={{ marginLeft: 12, color: "var(--muted)", fontSize: "0.8rem" }}>
                              สถานะโปรไฟล์: {profile?.resume?.analysis ? "Masked Profile Ready" : "Pending CV"}
                            </span>
                          </div>
                          <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                            เข้าร่วมเมื่อ {new Date(cand.joinedAt).toLocaleDateString("th-TH")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : null}
          </PixelSurface>
        )}
      </section>

      {/* Recruiter Oversight Overview */}
      <section style={{ marginTop: 48 }} aria-labelledby="recruiter-overview-title">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">Recruiter oversight</span>
            <h2 id="recruiter-overview-title">บริษัทและผู้ดูแลบูธในแต่ละงาน</h2>
          </div>
          <p>ตรวจว่าใครเป็นเจ้าของบูธ บริษัทใดกำลังเข้าร่วม และประกาศตำแหน่งแล้วกี่ตำแหน่ง โดย Recruiter แก้ไขได้เฉพาะข้อมูลที่ตนเองเป็นเจ้าของ</p>
        </div>

        {recruiterBooths.length === 0 ? (
          <EmptyState title="ยังไม่มี Recruiter เปิดบูธ" body="เมื่อ Job Fair ถูก Publish แล้ว Recruiter ที่ได้รับอนุญาตจะเลือกงาน สร้างข้อมูลบริษัท และเปิดบูธของตนเองได้" />
        ) : (
          <div className="admin-recruiter-grid">
            {recruiterBooths.map((booth) => {
              const recruiter = database.users.find((item) => item.id === booth.ownerId);
              const company = database.companies.find((item) => item.id === booth.companyId);
              const fair = database.fairs.find((item) => item.id === booth.fairId);
              const jobCount = database.jobs.filter((job) => job.boothId === booth.id).length;
              return (
                <PixelSurface className="admin-recruiter-card" data-reveal key={booth.id}>
                  <div className="admin-recruiter-heading">
                    <span className="role-icon"><Building2 aria-hidden="true" /></span>
                    <StatusPill tone={booth.status === "PUBLISHED" ? "cyan" : booth.status === "ARCHIVED" ? "neutral" : "mango"}>
                      {booth.status}
                    </StatusPill>
                  </div>
                  <h3>{company?.name ?? booth.name}</h3>
                  <p>{booth.name} · {fair?.title ?? "ไม่พบงานแฟร์"}</p>
                  <dl className="admin-recruiter-facts">
                    <div><dt><UsersRound aria-hidden="true" /> Recruiter</dt><dd>{recruiter?.displayName ?? "Unknown"}</dd></div>
                    <div><dt>อีเมลบัญชี</dt><dd>{recruiter?.email ?? "-"}</dd></div>
                    <div><dt>ตำแหน่งงาน</dt><dd>{jobCount} ตำแหน่ง</dd></div>
                  </dl>
                </PixelSurface>
              );
            })}
          </div>
        )}
      </section>
    </AnimatedPage>
  );
}
