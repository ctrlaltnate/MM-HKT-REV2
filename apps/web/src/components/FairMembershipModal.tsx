import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock,
  Info,
  Mail,
  Send,
  ShieldCheck,
  UserCheck,
  UsersRound,
  UserX,
  XCircle,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";

import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import type { JobFair } from "../domain/types";
import { Modal } from "./Modal";
import { EmptyState, PixelButton, StatusPill } from "./PixelUI";

interface FairMembershipModalProps {
  open: boolean;
  onClose: () => void;
  initialFairId?: string; // empty string or "all" for global mode
}

export function FairMembershipModal({
  open,
  onClose,
  initialFairId = "",
}: FairMembershipModalProps) {
  const { user, database, actions } = useApp();
  const { toast } = useToast();

  const [selectedFairId, setSelectedFairId] = useState<string>(initialFairId);
  const [activeTab, setActiveTab] = useState<"pending" | "invite" | "recruiters" | "candidates">("pending");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFairId, setInviteFairId] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");
  const [inviteError, setInviteError] = useState("");

  useEffect(() => {
    setSelectedFairId(initialFairId);
    setInviteSuccess("");
    setInviteError("");
  }, [initialFairId, open]);

  if (!user) return null;

  const adminFairs = database.fairs.filter((fair) => fair.ownerId === user.id);
  const adminFairIds = new Set(adminFairs.map((f) => f.id));

  // Determine if opened specifically for ONE fair or opened from the GLOBAL hub button
  const isDirectSingleFairMode = Boolean(initialFairId && initialFairId !== "ALL" && initialFairId !== "");
  const isAllFairs = !selectedFairId || selectedFairId === "ALL";
  const activeFair = adminFairs.find((f) => f.id === (isDirectSingleFairMode ? initialFairId : selectedFairId));

  // Active vs Expired Fairs classification
  const activeAndUpcomingFairs = adminFairs.filter(
    (f) => f.status === "LIVE" || f.status === "PAUSED" || f.status === "PUBLISHED" || f.status === "DRAFT",
  );
  const expiredFairs = adminFairs.filter(
    (f) => f.status === "ENDED" || f.status === "CANCELLED" || f.status === "ARCHIVED",
  );

  const isCurrentSelectionExpired = Boolean(
    !isAllFairs && activeFair && (activeFair.status === "ENDED" || activeFair.status === "CANCELLED" || activeFair.status === "ARCHIVED"),
  );

  // Filter memberships
  const currentTargetFairId = isDirectSingleFairMode ? initialFairId : selectedFairId;
  const relevantMemberships = database.memberships.filter((m) => {
    if (!currentTargetFairId || currentTargetFairId === "ALL") {
      return adminFairIds.has(m.fairId);
    }
    return m.fairId === currentTargetFairId;
  });

  const pendingRecruiterRequests = relevantMemberships.filter(
    (m) => m.role === "RECRUITER" && m.status === "PENDING_APPROVAL",
  );
  const invitedRecruiters = relevantMemberships.filter(
    (m) => m.role === "RECRUITER" && m.status === "INVITED",
  );
  const activeRecruiters = relevantMemberships.filter(
    (m) => m.role === "RECRUITER" && m.status === "ACTIVE",
  );
  const activeCandidates = relevantMemberships.filter(
    (m) => m.role === "CANDIDATE" && (m.status === "ACTIVE" || !m.status),
  );

  const totalPendingAcrossAll = database.memberships.filter(
    (m) => adminFairIds.has(m.fairId) && m.role === "RECRUITER" && m.status === "PENDING_APPROVAL",
  ).length;

  const handleSendInvite = (e: FormEvent) => {
    e.preventDefault();
    const targetFair = isDirectSingleFairMode ? initialFairId : isAllFairs ? inviteFairId : selectedFairId;
    if (!inviteEmail.trim() || !targetFair) {
      setInviteError("กรุณาระบุอีเมลและเลือกงานแฟร์ที่ต้องการเชิญ");
      return;
    }

    const fairObj = adminFairs.find((f) => f.id === targetFair);
    if (fairObj && (fairObj.status === "ENDED" || fairObj.status === "CANCELLED" || fairObj.status === "ARCHIVED")) {
      setInviteError("ไม่สามารถส่งคำเชิญเข้าร่วมงานที่หมดอายุหรือสิ้นสุดแล้วได้");
      return;
    }

    try {
      setInviteError("");
      setInviteSuccess("");
      actions.inviteRecruiterToFair(targetFair, inviteEmail.trim(), user.id);
      setInviteSuccess(`ส่งคำเชิญไปยัง ${inviteEmail.trim()} เรียบร้อยแล้ว`);
      setInviteEmail("");
      toast.success("ส่งคำเชิญเปิดบูธให้ Recruiter เรียบร้อยแล้ว!");
    } catch {
      setInviteError("เกิดข้อผิดพลาดในการส่งคำเชิญ");
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={
        isDirectSingleFairMode
          ? `จัดการสมาชิก: ${activeFair?.title ?? "Job Fair"}`
          : isAllFairs
          ? "ศูนย์จัดการสมาชิก & คำขอทั้งหมด"
          : `จัดการสมาชิก: ${activeFair?.title ?? "Job Fair"}`
      }
      subtitle={
        isDirectSingleFairMode
          ? `ควบคุมสิทธิ์บูธบริษัทและตรวจสอบสมาชิกเฉพาะงาน "${activeFair?.title}"`
          : "ตรวจสอบคำขอเปิดบูธ อนุมัติสิทธิ์ ส่งคำเชิญ และจัดการรายชื่อสมาชิกในงานแฟร์ทั้งหมด"
      }
      maxWidth="880px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Case 1: Opened from Specific Fair Card -> Direct Single Fair Mode (No Dropdown Selector!) */}
        {isDirectSingleFairMode && activeFair && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              background: "var(--surface-1)",
              padding: "10px 16px",
              border: "1px solid var(--line)",
              borderRadius: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {activeFair.logoUrl && (
                <img
                  src={activeFair.logoUrl}
                  alt=""
                  style={{ width: 28, height: 28, borderRadius: 3, objectFit: "cover" }}
                />
              )}
              <div>
                <strong style={{ fontSize: "0.95rem", color: "var(--text)" }}>{activeFair.title}</strong>
                <span style={{ marginLeft: 8, fontSize: "0.78rem", color: "var(--muted)" }}>/{activeFair.slug}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <StatusPill
                tone={
                  activeFair.status === "LIVE"
                    ? "cyan"
                    : activeFair.status === "DRAFT"
                    ? "mango"
                    : activeFair.status === "ENDED"
                    ? "danger"
                    : "neutral"
                }
              >
                {activeFair.status === "ENDED" || activeFair.status === "ARCHIVED" ? "หมดอายุ / สิ้นสุดแล้ว" : activeFair.status}
              </StatusPill>
            </div>
          </div>
        )}

        {/* Case 2: Opened from Global Header Button -> Global Mode with Smart Categorized Dropdown Selector */}
        {!isDirectSingleFairMode && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 12,
              background: "var(--surface-1)",
              padding: "12px 16px",
              border: "1px solid var(--line)",
              borderRadius: 4,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", flex: 1 }}>
              <label className="pixel-label" htmlFor="modal-fair-filter" style={{ margin: 0, whiteSpace: "nowrap" }}>
                เลือกดูข้อมูลงาน:
              </label>
              <select
                id="modal-fair-filter"
                className="pixel-input"
                value={selectedFairId || "ALL"}
                onChange={(e) => setSelectedFairId(e.target.value === "ALL" ? "" : e.target.value)}
                style={{ minWidth: 280, flex: "1 1 auto" }}
              >
                <option value="ALL">รวมทุกงานแฟร์ ({totalPendingAcrossAll} คำขอรออนุมัติ)</option>

                {activeAndUpcomingFairs.length > 0 && (
                  <optgroup label="── งานที่กำลังเปิด / ยังไม่เริ่ม ──">
                    {activeAndUpcomingFairs.map((fair) => {
                      const fairPending = database.memberships.filter(
                        (m) => m.fairId === fair.id && m.role === "RECRUITER" && m.status === "PENDING_APPROVAL",
                      ).length;
                      return (
                        <option key={fair.id} value={fair.id}>
                          {fair.status} — {fair.title} {fairPending > 0 ? `(${fairPending} รออนุมัติ)` : ""}
                        </option>
                      );
                    })}
                  </optgroup>
                )}

                {expiredFairs.length > 0 && (
                  <optgroup label="── งานที่หมดอายุ / สิ้นสุดแล้ว ──">
                    {expiredFairs.map((fair) => (
                      <option key={fair.id} value={fair.id}>
                        {fair.status} — {fair.title} (หมดอายุ / สิ้นสุดแล้ว)
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
            </div>

            <StatusPill tone={isAllFairs ? "mango" : isCurrentSelectionExpired ? "danger" : "cyan"}>
              {isAllFairs ? `รวม ${adminFairs.length} งานแฟร์` : activeFair?.status}
            </StatusPill>
          </div>
        )}

        {/* Expired / Ended Fair Informational Banner */}
        {isCurrentSelectionExpired && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              padding: "10px 14px",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "0.85rem",
              color: "#fca5a5",
            }}
          >
            <AlertTriangle size={18} style={{ color: "#f87171", flexShrink: 0 }} aria-hidden="true" />
            <span>
              <strong>งานนี้หมดอายุ / สิ้นสุดแล้ว:</strong> อยู่ในโหมดตรวจสอบข้อมูลย้อนหลัง ไม่สามารถอนุมัติคำขอใหม่หรือส่งคำเชิญเปิดบูธเพิ่มได้
            </span>
          </div>
        )}

        {/* Tab Navigation */}
        <div style={{ display: "flex", gap: 6, borderBottom: "1px solid var(--line)", paddingBottom: 10, flexWrap: "wrap" }}>
          <PixelButton
            tone={activeTab === "pending" ? "mango" : "neutral"}
            onClick={() => setActiveTab("pending")}
          >
            <Clock size={15} aria-hidden="true" /> รออนุมัติ ({pendingRecruiterRequests.length})
          </PixelButton>
          <PixelButton
            tone={activeTab === "invite" ? "mango" : "neutral"}
            onClick={() => setActiveTab("invite")}
          >
            <Mail size={15} aria-hidden="true" /> ส่งคำเชิญ ({invitedRecruiters.length})
          </PixelButton>
          <PixelButton
            tone={activeTab === "recruiters" ? "cyan" : "neutral"}
            onClick={() => setActiveTab("recruiters")}
          >
            <Building2 size={15} aria-hidden="true" /> Recruiter ในงาน ({activeRecruiters.length})
          </PixelButton>
          <PixelButton
            tone={activeTab === "candidates" ? "violet" : "neutral"}
            onClick={() => setActiveTab("candidates")}
          >
            <UsersRound size={15} aria-hidden="true" /> ผู้สมัคร ({activeCandidates.length})
          </PixelButton>
        </div>

        {/* ========================================================
            TAB 1: PENDING APPROVALS
           ======================================================== */}
        {activeTab === "pending" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}>
            {pendingRecruiterRequests.length === 0 ? (
              <EmptyState
                title="ไม่มีคำขอรออนุมัติ"
                body={isAllFairs ? "ไม่มีคำขอเปิดบูธค้างอยู่ในทุกงานแฟร์ที่คุณดูแล" : `ไม่มีคำขอค้างสำหรับงาน "${activeFair?.title}"`}
              />
            ) : (
              pendingRecruiterRequests.map((req) => {
                const recruiterUser = database.users.find((u) => u.id === req.userId);
                const recruiterCompany = database.companies.find((c) => c.ownerId === req.userId);
                const targetFair = database.fairs.find((f) => f.id === req.fairId);
                const isTargetExpired = targetFair && (targetFair.status === "ENDED" || targetFair.status === "ARCHIVED");

                return (
                  <div
                    key={req.id}
                    style={{
                      background: isTargetExpired ? "rgba(239, 68, 68, 0.04)" : "rgba(255, 216, 77, 0.05)",
                      border: isTargetExpired ? "1px solid rgba(239, 68, 68, 0.25)" : "1px solid rgba(255, 216, 77, 0.25)",
                      padding: "14px 16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 14,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: "1rem", color: "var(--text)" }}>
                          {recruiterUser?.displayName ?? "Recruiter"}
                        </strong>
                        <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>({recruiterUser?.email})</span>
                        {isTargetExpired ? (
                          <StatusPill tone="danger">งานหมดอายุแล้ว</StatusPill>
                        ) : (
                          <StatusPill tone="mango">รออนุมัติ</StatusPill>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: "0.86rem", color: "var(--muted)" }}>
                        บริษัท: <strong style={{ color: "var(--text)" }}>{recruiterCompany?.name ?? "ยังไม่ได้กรอกข้อมูลบริษัท"}</strong> · ขอยื่นเข้างาน: <span style={{ color: "var(--cyan)" }}>{targetFair?.title ?? req.fairId}</span> · ยื่นเมื่อ {new Date(req.joinedAt).toLocaleDateString("th-TH")}
                      </p>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      {isTargetExpired ? (
                        <span style={{ fontSize: "0.8rem", color: "#f87171", fontStyle: "italic" }}>
                          (งานสิ้นสุดแล้ว ไม่อนุมัติเพิ่ม)
                        </span>
                      ) : (
                        <>
                          <PixelButton
                            tone="cyan"
                            onClick={() => {
                              actions.reviewFairMembership(req.id, "ACTIVE", user.id);
                              toast.success(`อนุมัติคำขอของ ${recruiterUser?.displayName ?? "Recruiter"} เรียบร้อยแล้ว!`);
                            }}
                          >
                            <CheckCircle2 size={14} aria-hidden="true" /> อนุมัติเข้าร่วม
                          </PixelButton>
                          <PixelButton
                            tone="danger"
                            onClick={() => {
                              actions.reviewFairMembership(req.id, "REJECTED", user.id);
                              toast.info("ปฏิเสธคำขอเข้าร่วมงาน");
                            }}
                          >
                            <XCircle size={14} aria-hidden="true" /> ปฏิเสธ
                          </PixelButton>
                        </>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================
            TAB 2: INVITE RECRUITERS
           ======================================================== */}
        {activeTab === "invite" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, minHeight: 220 }}>
            {isCurrentSelectionExpired ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--muted)" }}>
                <p style={{ margin: 0, fontSize: "0.9rem", display: "flex", gap: 8, alignItems: "center" }}><AlertTriangle size={16} aria-hidden="true" /> งานแฟร์นี้หมดอายุ/สิ้นสุดแล้ว จึงไม่สามารถส่งคำเชิญไปยัง Recruiter ใหม่ได้</p>
              </div>
            ) : (
              <>
                <p style={{ color: "var(--muted)", fontSize: "0.86rem", margin: 0 }}>
                  ระบุอีเมลของ Recruiter หรือตัวแทนบริษัทเพื่อส่งคำเชิญ เมื่อ Recruiter เข้าสู่ระบบจะสามารถกดยอมรับคำเชิญและเปิดบูธได้ทันที
                </p>

                <form onSubmit={handleSendInvite} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {isAllFairs && (
                    <select
                      className="pixel-input"
                      value={inviteFairId}
                      onChange={(e) => setInviteFairId(e.target.value)}
                      style={{ minWidth: 240 }}
                      required
                    >
                      <option value="">-- เลือกงานแฟร์ที่ต้องการเชิญ --</option>
                      {activeAndUpcomingFairs.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.title} [{f.status}]
                        </option>
                      ))}
                    </select>
                  )}

                  <input
                    type="email"
                    placeholder="recruiter@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pixel-input"
                    style={{ flex: 1, minWidth: 220 }}
                    required
                  />

                  <PixelButton type="submit" tone="mango">
                    <Send size={14} aria-hidden="true" /> ส่งคำเชิญ
                  </PixelButton>
                </form>

                {inviteSuccess && <p style={{ color: "var(--cyan)", fontSize: "0.85rem", margin: 0, display: "flex", gap: 8, alignItems: "center" }}><CheckCircle2 size={16} aria-hidden="true" /> {inviteSuccess}</p>}
                {inviteError && <p style={{ color: "#f87171", fontSize: "0.85rem", margin: 0 }}>✗ {inviteError}</p>}
              </>
            )}

            <h4 style={{ fontSize: "0.9rem", margin: "10px 0 4px", color: "var(--text)" }}>คำเชิญที่ส่งไปแล้ว ({invitedRecruiters.length})</h4>
            {invitedRecruiters.length === 0 ? (
              <p style={{ color: "var(--muted)", fontSize: "0.82rem", fontStyle: "italic", margin: 0 }}>ยังไม่มีคำเชิญที่รอยอมรับ</p>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {invitedRecruiters.map((inv) => {
                  const targetFair = database.fairs.find((f) => f.id === inv.fairId);
                  return (
                    <div
                      key={inv.id}
                      style={{
                        background: "var(--surface-1)",
                        border: "1px solid var(--line)",
                        padding: "10px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 10,
                      }}
                    >
                      <div>
                        <strong>{inv.invitedEmail || inv.userId}</strong>
                        <span style={{ marginLeft: 8, fontSize: "0.8rem", color: "var(--muted)" }}>
                          (งาน: <span style={{ color: "var(--cyan)" }}>{targetFair?.title ?? inv.fairId}</span> · ส่งเมื่อ {new Date(inv.joinedAt).toLocaleDateString("th-TH")})
                        </span>
                      </div>
                      <StatusPill tone="mango">รอ Recruiter ตอบรับ</StatusPill>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: ACTIVE RECRUITERS
           ======================================================== */}
        {activeTab === "recruiters" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}>
            {activeRecruiters.length === 0 ? (
              <EmptyState
                title="ยังไม่มี Recruiter ในงาน"
                body="เมื่อคำขอได้รับการอนุมัติ หรือ Recruiter กดยอมรับคำเชิญ รายชื่อบริษัทและบูธจะแสดงที่นี่"
              />
            ) : (
              activeRecruiters.map((rec) => {
                const recruiterUser = database.users.find((u) => u.id === rec.userId);
                const recruiterCompany = database.companies.find((c) => c.ownerId === rec.userId);
                const booth = database.booths.find((b) => b.fairId === rec.fairId && b.ownerId === rec.userId);
                const targetFair = database.fairs.find((f) => f.id === rec.fairId);
                return (
                  <div
                    key={rec.id}
                    style={{
                      background: "var(--surface-1)",
                      border: "1px solid var(--line)",
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text)" }}>
                          {recruiterUser?.displayName ?? "Recruiter"}
                        </strong>
                        <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>({recruiterUser?.email})</span>
                        <StatusPill tone="cyan">เปิดสิทธิ์แล้ว</StatusPill>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--muted)" }}>
                        งาน: <span style={{ color: "var(--cyan)" }}>{targetFair?.title ?? rec.fairId}</span> · บริษัท: <strong>{recruiterCompany?.name ?? "ยังไม่ได้กรอกข้อมูล"}</strong> · บูธ: <strong>{booth ? booth.name : "ยังไม่ได้สร้างบูธ"}</strong>
                      </p>
                    </div>
                    <div>
                      {!isCurrentSelectionExpired && (
                        <PixelButton
                          tone="danger"
                          onClick={() => {
                            actions.removeFairMembership(rec.id);
                            toast.info("เพิกถอนสิทธิ์เรียบร้อยแล้ว");
                          }}
                        >
                          <UserX size={14} aria-hidden="true" /> เพิกถอนสิทธิ์
                        </PixelButton>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: CANDIDATES
           ======================================================== */}
        {activeTab === "candidates" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, minHeight: 220 }}>
            {activeCandidates.length === 0 ? (
              <EmptyState
                title="ยังไม่มีผู้สมัครเข้าร่วมงาน"
                body="เมื่อผู้สมัครกด 'เข้าร่วมงานแฟร์' รายชื่อผู้สมัครจะปรากฏที่นี่เพื่อติดตามสถิติ"
              />
            ) : (
              activeCandidates.map((cand) => {
                const candUser = database.users.find((u) => u.id === cand.userId);
                const candProfile = database.candidateProfiles.find((p) => p.userId === cand.userId);
                const targetFair = database.fairs.find((f) => f.id === cand.fairId);
                return (
                  <div
                    key={cand.id}
                    style={{
                      background: "var(--surface-1)",
                      border: "1px solid var(--line)",
                      padding: "12px 14px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text)" }}>
                          {candUser?.displayName ?? "ผู้สมัคร"}
                        </strong>
                        <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>({candUser?.email})</span>
                        <StatusPill tone="violet">ผู้เข้าร่วมงาน</StatusPill>
                      </div>
                      <p style={{ margin: 0, fontSize: "0.84rem", color: "var(--muted)" }}>
                        งาน: <span style={{ color: "var(--cyan)" }}>{targetFair?.title ?? cand.fairId}</span> · สายงานเป้าหมาย: <strong>{candProfile?.targetRoles?.join(", ") || candProfile?.headline || "ยังไม่ได้ระบุ"}</strong> · ทักษะ: {candProfile?.manualSkills?.length ?? 0} ทักษะ
                      </p>
                    </div>
                    <div>
                      {!isCurrentSelectionExpired && (
                        <PixelButton
                          tone="neutral"
                          onClick={() => {
                            actions.removeFairMembership(cand.id);
                            toast.info("นำผู้สมัครออกจากงานแล้ว");
                          }}
                        >
                          <UserX size={14} aria-hidden="true" /> นำออกจากงาน
                        </PixelButton>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 14 }}>
          <PixelButton type="button" tone="neutral" onClick={onClose}>
            ปิดหน้าต่าง
          </PixelButton>
        </div>
      </div>
    </Modal>
  );
}
