import {
  Archive,
  CalendarDays,
  Clock,
  Edit3,
  Link2,
  Play,
  Plus,
  Radio,
  ShieldCheck,
  Square,
  Store,
  Trash2,
  UsersRound,
  Zap,
} from "lucide-react";
import { useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import { FairMembershipModal } from "../components/FairMembershipModal";
import { FairStudioModal } from "../components/FairStudioModal";
import { Modal } from "../components/Modal";
import {
  EmptyState,
  PixelButton,
  PixelSurface,
  StatusPill,
} from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import type { FairMediaLink, FairStatus, JobFair } from "../domain/types";

export function AdminFairsPage() {
  const { user, database, actions } = useApp();
  const { toast } = useToast();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingFair, setEditingFair] = useState<JobFair | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Membership governance modal state
  const [membershipModalOpen, setMembershipModalOpen] = useState(false);
  const [membershipModalFairId, setMembershipModalFairId] = useState<string>("");

  // Fair category filter state (Default to ACTIVE: กำลังดำเนินงาน)
  const [fairCategory, setFairCategory] = useState<"ACTIVE" | "UPCOMING" | "EXPIRED" | "ALL">("ACTIVE");

  if (!user) return null;
  const fairs = database.fairs.filter((fair) => fair.ownerId === user.id);
  const fairIds = new Set(fairs.map((fair) => fair.id));

  const activeFairs = fairs.filter((f) => f.status === "LIVE" || (f.status === "PUBLISHED" && new Date(f.startsAt) <= new Date() && new Date(f.endsAt) >= new Date()));
  const upcomingFairs = fairs.filter((f) => f.status === "DRAFT" || (f.status === "PUBLISHED" && new Date(f.startsAt) > new Date()));
  const expiredFairs = fairs.filter((f) => f.status === "ENDED" || f.status === "ARCHIVED" || (f.endsAt && new Date(f.endsAt) < new Date() && f.status !== "DRAFT"));

  const displayedFairs = fairs.filter((fair) => {
    if (fairCategory === "ACTIVE") return fair.status === "LIVE" || (fair.status === "PUBLISHED" && new Date(fair.startsAt) <= new Date() && new Date(fair.endsAt) >= new Date());
    if (fairCategory === "UPCOMING") return fair.status === "DRAFT" || (fair.status === "PUBLISHED" && new Date(fair.startsAt) > new Date());
    if (fairCategory === "EXPIRED") return fair.status === "ENDED" || fair.status === "ARCHIVED" || (fair.endsAt && new Date(fair.endsAt) < new Date() && fair.status !== "DRAFT");
    return true;
  });

  const allPendingApprovals = database.memberships.filter(
    (m) => fairIds.has(m.fairId) && m.role === "RECRUITER" && m.status === "PENDING_APPROVAL",
  ).length;

  const handleCreateFair = (payload: {
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
  }) => {
    const newFair = actions.createFair(user.id, {
      ...payload,
      status: "DRAFT",
    });
    setCreateModalOpen(false);
    toast.success(`สร้างงานแฟร์ "${payload.title}" เรียบร้อยแล้ว!`);
  };

  const handleUpdateFair = (payload: {
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
  }) => {
    if (!editingFair) return;
    actions.updateFair(editingFair.id, payload);
    setEditingFair(null);
    toast.success(`บันทึกการแก้ไขงานแฟร์ "${payload.title}" เรียบร้อยแล้ว!`);
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
    toast.info("ลบงานแฟร์เรียบร้อยแล้ว");
  };

  const openMembershipGovernance = (fairId = "") => {
    setMembershipModalFairId(fairId);
    setMembershipModalOpen(true);
  };

  return (
    <AnimatedPage className="page-shell">
      {/* Header Banner */}
      <div className="page-header" data-reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20, flexWrap: "wrap" }}>
        <div>
          <span className="eyebrow"><ShieldCheck aria-hidden="true" /> Admin Governance Hub</span>
          <h1>ศูนย์จัดการ Job Fair</h1>
          <p>สร้างและแก้ไขกำหนดการงานแฟร์ อนุมัติสิทธิ์บูธบริษัท และติดตามสถานะความปลอดภัยของระบบ</p>
        </div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <PixelButton
            type="button"
            tone="cyan"
            onClick={() => openMembershipGovernance("")}
          >
            <UsersRound aria-hidden="true" /> จัดการสมาชิก & คำขอทั้งหมด {allPendingApprovals > 0 ? `(${allPendingApprovals})` : ""}
          </PixelButton>
          <PixelButton type="button" tone="mango" onClick={() => setCreateModalOpen(true)}>
            <Plus aria-hidden="true" /> สร้าง Job Fair ใหม่
          </PixelButton>
        </div>
      </div>

      {/* 4 Cyber Stat Cards */}
      <div className="cyber-stats-grid cols-4" data-reveal style={{ marginTop: 24, marginBottom: 32 }}>
        <div
          className="cyber-stat-card"
          onClick={() => setFairCategory("ALL")}
          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
          title="คลิกเพื่อดูงานแฟร์ทั้งหมด"
        >
          <div className="stat-icon-badge mango">
            <CalendarDays aria-hidden="true" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">งานแฟร์ที่คุณดูแล</span>
            <strong className="stat-number">{fairs.length}</strong>
          </div>
        </div>

        <div
          className="cyber-stat-card"
          onClick={() => setFairCategory("ACTIVE")}
          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
          title="คลิกเพื่อกรองงานที่กำลังดำเนินงาน (LIVE & PUBLISHED)"
        >
          <div className="stat-icon-badge cyan">
            <Radio aria-hidden="true" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">กำลังดำเนินงาน</span>
            <strong className="stat-number">{activeFairs.length}</strong>
          </div>
        </div>

        <div
          className="cyber-stat-card"
          onClick={() => setFairCategory("EXPIRED")}
          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
          title="คลิกเพื่อกรองจ็อบแฟร์ที่หมดอายุ / สิ้นสุดแล้ว"
        >
          <div className="stat-icon-badge violet">
            <Archive aria-hidden="true" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">จ็อบแฟร์ที่หมดอายุ</span>
            <strong className="stat-number">{expiredFairs.length}</strong>
          </div>
        </div>

        <div
          className="cyber-stat-card"
          onClick={() => openMembershipGovernance("")}
          style={{ cursor: "pointer", transition: "all 0.15s ease" }}
          title="คลิกเพื่อเปิดศูนย์จัดการคำขอรออนุมัติทั้งหมด"
        >
          <div className="stat-icon-badge green">
            <Clock aria-hidden="true" />
          </div>
          <div className="stat-meta">
            <span className="stat-label">คำขอรออนุมัติ</span>
            <strong className="stat-number" style={{ color: allPendingApprovals > 0 ? "var(--mango)" : "inherit" }}>
              {allPendingApprovals}
            </strong>
          </div>
        </div>
      </div>

      {/* Fair Studio Modal (Create) */}
      <FairStudioModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateFair}
      />

      {/* Fair Studio Modal (Edit) */}
      <FairStudioModal
        open={Boolean(editingFair)}
        initialFair={editingFair}
        onClose={() => setEditingFair(null)}
        onSubmit={handleUpdateFair}
      />

      {/* Fair Membership & Approval Governance Modal */}
      <FairMembershipModal
        open={membershipModalOpen}
        onClose={() => setMembershipModalOpen(false)}
        initialFairId={membershipModalFairId}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        title="ยืนยันการลบ Job Fair"
        subtitle="การลบงานแฟร์จะไม่สามารถกู้คืนได้"
        maxWidth="480px"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, color: "#f87171", fontSize: "0.92rem", lineHeight: 1.6 }}>
            ⚠️ <strong>คำเตือน:</strong> การลบงานแฟร์นี้จะลบบูธบริษัท ประกาศตำแหน่งงาน และข้อมูลสมาชิกทั้งหมดที่สังกัดอยู่ในงานนี้ทันที
          </p>
          <div className="button-row" style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 12, borderTop: "1px solid var(--line)" }}>
            <PixelButton type="button" tone="neutral" onClick={() => setDeleteTargetId(null)}>
              ยกเลิก
            </PixelButton>
            <PixelButton type="button" tone="danger" onClick={() => deleteTargetId && confirmDelete(deleteTargetId)}>
              <Trash2 aria-hidden="true" /> ยืนยันลบงานแฟร์นี้
            </PixelButton>
          </div>
        </div>
      </Modal>

      {/* All Fairs Section */}
      <section style={{ marginTop: 36 }}>
        <div className="section-heading" data-reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
          <div>
            <h2>งานแฟร์ทั้งหมด ({displayedFairs.length}/{fairs.length})</h2>
            <p>จัดการข้อมูล เปลี่ยนสถานะ ปรับแต่งแบรนดิ้ง หรือดูสถิติสมาชิกในแต่ละงาน</p>
          </div>

          {/* Category Filter Tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <PixelButton
              type="button"
              tone={fairCategory === "ACTIVE" ? "cyan" : "neutral"}
              onClick={() => setFairCategory("ACTIVE")}
            >
              <Radio size={14} aria-hidden="true" /> กำลังดำเนินงาน ({activeFairs.length})
            </PixelButton>
            <PixelButton
              type="button"
              tone={fairCategory === "UPCOMING" ? "mango" : "neutral"}
              onClick={() => setFairCategory("UPCOMING")}
            >
              <CalendarDays size={14} aria-hidden="true" /> งานแฟร์ที่กำลังจะมาถึง ({upcomingFairs.length})
            </PixelButton>
            <PixelButton
              type="button"
              tone={fairCategory === "EXPIRED" ? "danger" : "neutral"}
              onClick={() => setFairCategory("EXPIRED")}
            >
              <Archive size={14} aria-hidden="true" /> หมดอายุ / จบงาน ({expiredFairs.length})
            </PixelButton>
            <PixelButton
              type="button"
              tone={fairCategory === "ALL" ? "mango" : "neutral"}
              onClick={() => setFairCategory("ALL")}
            >
              ทั้งหมด ({fairs.length})
            </PixelButton>
          </div>
        </div>

        {displayedFairs.length === 0 ? (
          <EmptyState
            title={
              fairCategory === "ACTIVE"
                ? "ไม่มีงานแฟร์ที่กำลังดำเนินงานในขณะนี้"
                : fairCategory === "UPCOMING"
                ? "ไม่มีงานแฟร์ที่กำลังจะมาถึง"
                : fairCategory === "EXPIRED"
                ? "ไม่มีจ็อบแฟร์ที่หมดอายุ"
                : "ยังไม่มีงานแฟร์ในระบบ"
            }
            body={fairCategory === "ALL" ? "กดปุ่ม 'สร้าง Job Fair ใหม่' ด้านบน เพื่อเริ่มต้นเปิดงานแฟร์และกำหนดวันเวลาจัดงาน" : "เลือกหมวดหมู่อื่นเพื่อดูรายการงานแฟร์"}
          />
        ) : (
          <div className="card-grid">
            {displayedFairs.map((fair) => {
              const boothCount = database.booths.filter((booth) => booth.fairId === fair.id).length;
              const memberCount = database.memberships.filter((member) => member.fairId === fair.id).length;
              const pendingCount = database.memberships.filter(
                (m) => m.fairId === fair.id && m.role === "RECRUITER" && m.status === "PENDING_APPROVAL",
              ).length;

              return (
                <PixelSurface
                  className="admin-fair-card"
                  data-reveal
                  key={fair.id}
                >
                  {/* Top Bar: Badges on left, Quick Actions on right */}
                  <div className="admin-fair-card-header">
                    <div className="admin-fair-badges">
                      <StatusPill
                        tone={
                          fair.status === "LIVE"
                            ? "cyan"
                            : fair.status === "DRAFT"
                            ? "mango"
                            : fair.status === "ARCHIVED"
                            ? "neutral"
                            : fair.status === "ENDED"
                            ? "danger"
                            : "violet"
                        }
                      >
                        {fair.status}
                      </StatusPill>

                      {fair.autoSchedule && (
                        <span
                          style={{
                            background: "rgba(120, 219, 230, 0.12)",
                            border: "1px solid var(--cyan)",
                            color: "var(--cyan)",
                            padding: "2px 6px",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            borderRadius: 2,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 3,
                          }}
                        >
                          <Zap size={11} aria-hidden="true" /> Auto
                        </span>
                      )}

                      {pendingCount > 0 && (
                        <button
                          type="button"
                          onClick={() => openMembershipGovernance(fair.id)}
                          style={{
                            background: "rgba(255, 216, 77, 0.18)",
                            border: "1px solid var(--mango)",
                            color: "var(--mango)",
                            padding: "2px 8px",
                            borderRadius: 3,
                            fontSize: "0.74rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            cursor: "pointer",
                          }}
                        >
                          <Clock size={12} aria-hidden="true" /> {pendingCount} รออนุมัติ
                        </button>
                      )}
                    </div>

                    <div className="admin-fair-actions-top">
                      <button
                        type="button"
                        className="edit-button-sm"
                        onClick={() => setEditingFair(fair)}
                        title="แก้ไขข้อมูลงานแฟร์ & กำหนดการ"
                        aria-label={`แก้ไข ${fair.title}`}
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.18)",
                          borderRadius: 4,
                          color: "#f0f6fc",
                          cursor: "pointer",
                          padding: "4px 8px",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "0.78rem",
                          fontWeight: 600,
                          transition: "all 0.15s ease",
                        }}
                      >
                        <Edit3 size={13} aria-hidden="true" /> แก้ไขข้อมูลงาน
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
                          fontSize: "0.78rem",
                        }}
                      >
                        <Trash2 size={13} aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Slug Row */}
                  <div className="admin-fair-title-row">
                    {fair.logoUrl && (
                      <img
                        src={fair.logoUrl}
                        alt=""
                        style={{ width: 32, height: 32, borderRadius: 4, objectFit: "cover", border: "1px solid var(--line)", flexShrink: 0 }}
                      />
                    )}
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h3 className="admin-fair-title">{fair.title}</h3>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 2, fontSize: "0.76rem", color: "var(--muted)" }}>
                        <span>📍 {fair.locationLabel || "Online Fair"}</span>
                        <span className="admin-fair-slug-badge">/{fair.slug}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {fair.summary && (
                    <p className="admin-fair-summary">{fair.summary}</p>
                  )}

                  {/* Structured High-Clarity Info Grid */}
                  <div className="admin-fair-info-grid">
                    <div className="admin-fair-info-item">
                      <Store size={14} aria-hidden="true" />
                      <span><strong>{boothCount}</strong> บูธบริษัท</span>
                    </div>

                    <div className="admin-fair-info-item">
                      <UsersRound size={14} aria-hidden="true" />
                      <span><strong>{memberCount}</strong> สมาชิก</span>
                    </div>

                    <div className="admin-fair-info-item full-width">
                      <CalendarDays size={13} style={{ color: "var(--mango)" }} aria-hidden="true" />
                      <span>
                        {new Date(fair.startsAt).toLocaleDateString("th-TH")} – {new Date(fair.endsAt).toLocaleDateString("th-TH")}
                        {fair.timezone && ` (${fair.timezone})`}
                      </span>
                    </div>
                  </div>

                  {/* Tags & Media links pill (if any) */}
                  {((fair.tags && fair.tags.length > 0) || (fair.mediaLinks && fair.mediaLinks.length > 0)) && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                      {fair.mediaLinks && fair.mediaLinks.length > 0 && (
                        <span style={{ fontSize: "0.72rem", color: "var(--cyan)", display: "inline-flex", alignItems: "center", gap: 3 }}>
                          <Link2 size={11} /> {fair.mediaLinks.length} มีเดีย
                        </span>
                      )}
                      {fair.tags?.map((t) => (
                        <span key={t} className="stat-chip" style={{ fontSize: "0.7rem", padding: "1px 6px" }}>
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bottom Action Footer */}
                  <div className="admin-fair-card-footer">
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
                        <Radio aria-hidden="true" /> กู้คืน Draft
                      </PixelButton>
                    )}

                    <PixelButton
                      tone="neutral"
                      onClick={() => openMembershipGovernance(fair.id)}
                    >
                      <UsersRound aria-hidden="true" /> สมาชิก & คำขอ {pendingCount > 0 ? `(${pendingCount})` : ""}
                    </PixelButton>
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
