import {
  AlertCircle,
  ArrowRight,
  BrainCircuit,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Edit2,
  Eye,
  FileCheck,
  FileText,
  LayoutDashboard,
  Lock,
  MapPin,
  PenLine,
  Plus,
  Rocket,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  UserCheck,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { JobFair } from "@maskedmatch/contracts";

import { AnimatedPage } from "../components/AnimatedPage";
import { FairQuickPreviewModal } from "../components/FairQuickPreviewModal";
import { InfoTooltip } from "../components/InfoTooltip";
import { Modal } from "../components/Modal";
import { ProfileAvatar } from "../components/ProfileAvatar";
import { PixelButton, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { ResumeAnalysisModal } from "../components/ResumeAnalysisModal";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";

export function DashboardPage() {
  const { user, database, actions } = useApp();
  const { toast } = useToast();
  const [previewFair, setPreviewFair] = useState<JobFair | null>(null);
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [skillsModalOpen, setSkillsModalOpen] = useState(false);

  if (!user) return null;

  const profile = database.candidateProfiles.find((item) => item.userId === user.id);
  const memberships = database.memberships.filter((item) => item.userId === user.id);
  const activeMemberships = memberships.filter((m) => m.status === "ACTIVE");
  const company = database.companies.find((item) => item.ownerId === user.id);
  const ownedBooths = database.booths.filter((item) => item.ownerId === user.id);
  const ownedFairs = database.fairs.filter((item) => item.ownerId === user.id);
  const publicFairs = database.fairs.filter((fair) => fair.status === "PUBLISHED" || fair.status === "LIVE");
  const myApplications = (database.applications || []).filter((a) => a.candidateUserId === user.id);
  const receivedApplications = (database.applications || []).filter((a) =>
    database.jobs.some((j) => j.id === a.jobId && ownedBooths.some((b) => b.id === j.boothId)),
  );

  const targetRoles = profile?.targetRoles ?? [];
  const manualSkills = profile?.manualSkills ?? [];
  const experiences = profile?.experiences ?? [];

  // Candidate completeness calculation
  const candidateSteps = [
    { label: "เลือกตำแหน่งหรือสายงานเป้าหมาย", complete: targetRoles.length > 0, link: "/candidate/profile" },
    { label: "ระบุประวัติและประสบการณ์ทำงาน", complete: experiences.length > 0, link: "/candidate/profile" },
    { label: "เพิ่มทักษะความสามารถ (Skills)", complete: manualSkills.length > 0, link: "/candidate/profile" },
    { label: "อัปโหลดและวิเคราะห์ Resume ด้วย AI", complete: Boolean(profile?.resume?.analysis), link: "/candidate/profile" },
    { label: "เปิดการแชร์ทักษะแบบ Masked Privacy", complete: Boolean(profile?.shareWithJoinedFairs), link: "/candidate/profile" },
    { label: "เข้าร่วม Job Fair อย่างน้อย 1 งาน", complete: activeMemberships.length > 0, link: "/fairs" },
  ];

  const completedCount = candidateSteps.filter((s) => s.complete).length;
  const progressPercent = Math.round((completedCount / candidateSteps.length) * 100);

  const handleAllowReveal = (appId: string) => {
    actions.toggleApplicationRevealConsent(appId, true);
    toast.success("ยินยอมเปิดเผยข้อมูลติดต่อให้บริษัทเรียบร้อยแล้ว!");
  };

  return (
    <AnimatedPage className="page-shell dashboard-page">
      {/* ========================================================
          1. CYBER HEADER HERO BANNER
         ======================================================== */}
      <div className="dashboard-hero-card" data-reveal>
        <div className="dashboard-hero-info">
          <div className="dashboard-avatar-box">
            <ProfileAvatar seed={user.id} size={64} />
          </div>

          <div className="dashboard-welcome-copy">
            <div className="dashboard-eyebrow-row">
              <StatusPill tone={user.role === "candidate" ? "cyan" : user.role === "recruiter" ? "violet" : "mango"}>
                {user.role === "candidate" ? "JOB SEEKER" : user.role === "recruiter" ? "RECRUITER" : "ADMIN"}
              </StatusPill>
            </div>
            <h1 className="dashboard-main-title">
              สวัสดีคุณ <span>{user.displayName}</span>
            </h1>
            <p className="dashboard-subtitle">
              {user.role === "candidate" && "ศูนย์บัญชาการโปรไฟล์ ทักษะที่จับคู่ และงานแฟร์ออนไลน์ที่เปิดรับ"}
              {user.role === "recruiter" && "จัดการบูธบริษัท ตำแหน่งงานที่เปิดรับ และคัดเลือกผู้สมัครในงานแฟร์"}
              {user.role === "admin" && "ควบคุมดูแลงานแฟร์ อนุมัติสมาชิก และตรวจสอบความปลอดภัยระบบ"}
            </p>
          </div>
        </div>

        <div className="dashboard-hero-actions">
          {user.role === "candidate" && (
            <PixelLink to="/candidate/profile" tone="mango">
              <PenLine aria-hidden="true" /> จัดการโปรไฟล์ทักษะ & Resume
            </PixelLink>
          )}
          {user.role === "recruiter" && (
            <PixelLink to="/recruiter/workspace" tone="violet">
              <Building2 aria-hidden="true" /> เปิด Recruiter Studio
            </PixelLink>
          )}
          {user.role === "admin" && (
            <PixelLink to="/admin/fairs" tone="mango">
              <ShieldCheck aria-hidden="true" /> จัดการงานแฟร์
            </PixelLink>
          )}
          <PixelLink to="/fairs" tone="neutral">
            <CalendarDays aria-hidden="true" /> สำรวจจ็อบแฟร์
          </PixelLink>
        </div>
      </div>

      {/* ========================================================
          2. CANDIDATE WORKSPACE DASHBOARD
         ======================================================== */}
      {user.role === "candidate" && (
        <div className="dashboard-content-layout">
          {/* Top 3 Cyber Stats Grid */}
          <div className="cyber-stats-grid" data-reveal>
            {/* Stat 1: Target Roles (Chips view) */}
            <div className="cyber-stat-card chip-card">
              <div className="stat-card-top">
                <div className="stat-icon-badge cyan">
                  <Briefcase aria-hidden="true" />
                </div>
                <span className="stat-label">สายงานเป้าหมาย</span>
              </div>
              <div className="stat-chips-wrap">
                {targetRoles.length > 0 ? (
                  targetRoles.map((role) => (
                    <span className="stat-chip cyan" key={role}>{role}</span>
                  ))
                ) : (
                  <span className="stat-empty-hint">ยังไม่ได้ระบุสายงาน</span>
                )}
              </div>
            </div>

            {/* Stat 2: My Skills (Chips view with modal trigger) */}
            <div className="cyber-stat-card chip-card">
              <div className="stat-card-top">
                <div className="stat-icon-badge mango">
                  <Sparkles aria-hidden="true" />
                </div>
                <span className="stat-label">ทักษะของฉัน</span>
              </div>
              <div className="stat-chips-wrap">
                {manualSkills.length > 0 ? (
                  <>
                    {manualSkills.slice(0, 4).map((skill) => (
                      <span className="stat-chip mango" key={skill}>{skill}</span>
                    ))}
                    {manualSkills.length > 4 && (
                      <button
                        type="button"
                        className="stat-more-btn"
                        onClick={() => setSkillsModalOpen(true)}
                        aria-label={`ดูทักษะเพิ่มเติมทั้งหมด ${manualSkills.length} รายการ`}
                      >
                        ดูเพิ่มเติม (+{manualSkills.length - 4})
                      </button>
                    )}
                  </>
                ) : (
                  <span className="stat-empty-hint">ยังไม่มีทักษะในคลัง</span>
                )}
              </div>
            </div>

            {/* Stat 3: Job Applications */}
            <div className="cyber-stat-card">
              <div className="stat-icon-badge green">
                <Send aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">ใบสมัครของฉัน</span>
                <strong className="stat-number">{myApplications.length}</strong>
                <span className="stat-sub">{activeMemberships.length} งานแฟร์ที่เข้าร่วม</span>
              </div>
            </div>
          </div>

          {/* 2-Column Main Dashboard Section */}
          <div className="dashboard-dual-columns">
            {/* LEFT: Profile Readiness & Applications */}
            <div className="dashboard-left-col">
              <PixelSurface data-reveal className="dashboard-widget-card">
                <div className="widget-header">
                  <div>
                    <span className="widget-eyebrow"><CheckCircle2 aria-hidden="true" /> ความสมบูรณ์ของโปรไฟล์</span>
                    <h3>ความพร้อมในการจับคู่ ({progressPercent}%)</h3>
                  </div>
                  <StatusPill tone={progressPercent === 100 ? "cyan" : progressPercent >= 50 ? "mango" : "violet"}>
                    {progressPercent === 100 ? "โปรไฟล์สมบูรณ์ 100%" : `${completedCount}/${candidateSteps.length} ขั้นตอน`}
                  </StatusPill>
                </div>

                {/* Progress Bar */}
                <div className="pixel-progress-track">
                  <div className="pixel-progress-fill" style={{ width: `${progressPercent}%` }} />
                </div>

                {/* Interactive Checklist Items */}
                <div className="checklist-items-stack">
                  {candidateSteps.map((step, idx) => (
                    <Link to={step.link} key={idx} className={`checklist-item-row ${step.complete ? "done" : "pending"}`}>
                      <div className="check-indicator">
                        {step.complete ? <CheckCircle2 aria-hidden="true" /> : <div className="pending-dot" />}
                      </div>
                      <span className="check-text">{step.label}</span>
                      <ChevronRight className="check-arrow" aria-hidden="true" />
                    </Link>
                  ))}
                </div>

                <div className="widget-footer">
                  <PixelLink to="/candidate/profile" tone="mango">
                    <Edit2 aria-hidden="true" /> อัปเดตโปรไฟล์ทักษะของคุณ
                  </PixelLink>
                </div>
              </PixelSurface>

              {/* My Job Applications Widget */}
              <PixelSurface data-reveal className="dashboard-widget-card">
                <div className="widget-header">
                  <div>
                    <span className="widget-eyebrow"><Send aria-hidden="true" /> Application Pipeline</span>
                    <h3>สถานะใบสมัครงาน ({myApplications.length})</h3>
                  </div>
                  <PixelLink to="/fairs" tone="neutral">ค้นหาตำแหน่งเพิ่ม</PixelLink>
                </div>

                {myApplications.length > 0 ? (
                  <div className="checklist-items-stack">
                    {myApplications.map((app) => {
                      const job = database.jobs.find((j) => j.id === app.jobId);
                      const fair = database.fairs.find((f) => f.id === app.fairId);
                      const isRevealed = app.status === "REVEALED" || app.revealConsentGiven;

                      return (
                        <div key={app.id} className="checklist-item-row done" style={{ flexDirection: "column", alignItems: "stretch", gap: 10, padding: 14 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
                            <div>
                              <strong style={{ fontSize: "0.95rem", color: "var(--text)" }}>{job?.title ?? "ตำแหน่งงาน"}</strong>
                              <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginTop: 2 }}>
                                {fair?.title} • Skill Match: <strong style={{ color: "var(--cyan)" }}>{app.matchScore}%</strong>
                              </div>
                            </div>

                            <StatusPill tone={app.status === "SHORTLISTED" ? "mango" : isRevealed ? "cyan" : "violet"}>
                              {app.status === "APPLIED" && "รอพิจารณา"}
                              {app.status === "SHORTLISTED" && "⭐ Shortlisted"}
                              {app.status === "REVEAL_REQUESTED" && !isRevealed && "🔔 บริษัทขอดูข้อมูลติดต่อ"}
                              {isRevealed && "✓ เปิดเผยข้อมูลแล้ว"}
                              {app.status === "INTERVIEW_SCHEDULED" && "📅 มีนัดสัมภาษณ์"}
                            </StatusPill>
                          </div>

                          {/* Reveal Request Alert action */}
                          {app.status === "REVEAL_REQUESTED" && !isRevealed && (
                            <div style={{
                              padding: "10px 12px",
                              background: "rgba(255, 184, 77, 0.1)",
                              border: "1px solid rgba(255, 184, 77, 0.3)",
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 10,
                            }}>
                              <span style={{ fontSize: "0.8rem", color: "var(--mango)", fontWeight: 600 }}>
                                บริษัทสนใจโปรไฟล์และขอดูข้อมูลติดต่อของคุณ
                              </span>
                              <PixelButton
                                type="button"
                                tone="cyan"
                                onClick={() => handleAllowReveal(app.id)}
                              >
                                <Check aria-hidden="true" /> ยินยอมแชร์ข้อมูล
                              </PixelButton>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="dashboard-resume-empty-box">
                    <p>ยังไม่มีประวัติการยื่นใบสมัคร</p>
                    <small>เลือกงานแฟร์ที่สนใจและกดสมัครตำแหน่งงานด้วยโปรไฟล์แบบ Masked ได้ทันที</small>
                    <PixelLink to="/fairs" tone="mango" style={{ marginTop: 8 }}>
                      <CalendarDays aria-hidden="true" /> สำรวจจ็อบแฟร์และตำแหน่งงาน
                    </PixelLink>
                  </div>
                )}
              </PixelSurface>
            </div>

            {/* RIGHT: AI Resume Studio, Matched Job Fairs & Privacy */}
            <div className="dashboard-right-col">
              {/* AI Resume Studio Status Widget */}
              <PixelSurface data-reveal className="dashboard-widget-card ai-resume-widget">
                <div className="widget-header">
                  <div>
                    <span className="widget-eyebrow"><BrainCircuit aria-hidden="true" /> AI Resume Studio</span>
                    <h3>เอกสารและผลวิเคราะห์ AI</h3>
                  </div>
                </div>

                {profile?.resume ? (
                  <div className="dashboard-resume-info-box">
                    <div className="resume-meta-row">
                      <FileCheck className="file-icon-green" aria-hidden="true" />
                      <div>
                        <strong>{profile.resume.fileName}</strong>
                        <span>อัปโหลดเมื่อ {new Date(profile.resume.uploadedAt).toLocaleDateString("th-TH")} • {(profile.resume.size / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>

                    <div className="resume-chips-row">
                      <StatusPill tone="cyan">สกัดได้ {profile.resume.analysis?.skills.length ?? 0} ทักษะ</StatusPill>
                      <StatusPill tone="mango">นำเข้าสู่โปรไฟล์แล้ว</StatusPill>
                    </div>

                    <div className="resume-actions-row">
                      <PixelButton type="button" tone="cyan" onClick={() => setAnalysisModalOpen(true)}>
                        <Eye aria-hidden="true" /> ดูผลวิเคราะห์ Resume เต็ม
                      </PixelButton>
                      <PixelLink to="/candidate/profile" tone="neutral">
                        อัปโหลดใหม่
                      </PixelLink>
                    </div>
                  </div>
                ) : (
                  <div className="dashboard-resume-empty-box">
                    <p>คุณยังไม่ได้อัปโหลดไฟล์ Resume เพื่อสกัดทักษะด้วยระบบ AI</p>
                    <small>ระบบจะอ่านไฟล์ PDF และดึงทักษะ ประวัติงาน และตำแหน่งที่เหมาะสมเข้าสู่โปรไฟล์ให้อัตโนมัติ</small>
                    <PixelLink to="/candidate/profile" tone="cyan" style={{ marginTop: 10 }}>
                      <Sparkles aria-hidden="true" /> ไปที่สตูดิโอเพื่ออัปโหลด Resume
                    </PixelLink>
                  </div>
                )}
              </PixelSurface>

              {/* Matched Job Fairs Widget */}
              <PixelSurface data-reveal className="dashboard-widget-card fairs-widget">
                <div className="widget-header">
                  <div>
                    <span className="widget-eyebrow"><Store aria-hidden="true" /> Online Career Halls</span>
                    <h3>งานแฟร์ที่จับคู่กับทักษะของคุณ</h3>
                  </div>
                  <PixelLink to="/fairs" tone="neutral">ดูทั้งหมด ({publicFairs.length})</PixelLink>
                </div>

                {/* Fairs Cards Mini-Stream */}
                <div className="dashboard-fairs-stream">
                  {publicFairs.length > 0 ? (
                    publicFairs.slice(0, 3).map((fair) => {
                      const isJoined = activeMemberships.some((m) => m.fairId === fair.id);
                      const fairText = `${fair.title} ${fair.summary} ${fair.locationLabel}`.toLowerCase();
                      const isTrackMatched = targetRoles.length > 0 && targetRoles.some((role) => {
                        const r = role.toLowerCase();
                        const words = r.split(/[\s/,]+/).filter((w) => w.length > 2);
                        return fairText.includes(r) || words.some((w) => fairText.includes(w));
                      });

                      return (
                        <div key={fair.id} className="dashboard-fair-item-card">
                          <div className="fair-item-top">
                            <div>
                              <div className="fair-badges-line">
                                <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>
                                  {fair.status === "LIVE" ? "● LIVE NOW" : "PUBLISHED"}
                                </StatusPill>
                                {isTrackMatched && (
                                  <span className="track-matched-tag">✨ ตรงสายงานของคุณ</span>
                                )}
                                {isJoined && (
                                  <span className="joined-tag">✓ เข้าร่วมแล้ว</span>
                                )}
                              </div>
                              <h4 className="fair-item-title">{fair.title}</h4>
                              <p className="fair-item-desc">{fair.summary}</p>
                            </div>
                          </div>

                          <div className="fair-item-footer">
                            <div className="fair-item-meta">
                              <span><Store className="mini-icon" aria-hidden="true" /> {database.booths.filter((b) => b.fairId === fair.id).length} บูธ</span>
                              <span><Briefcase className="mini-icon" aria-hidden="true" /> {database.jobs.filter((j) => {
                                const booth = database.booths.find((b) => b.id === j.boothId);
                                return booth?.fairId === fair.id;
                              }).length} ตำแหน่ง</span>
                            </div>

                            <div className="fair-item-actions">
                              <button
                                type="button"
                                className="quick-preview-btn-small"
                                onClick={() => setPreviewFair(fair)}
                              >
                                <Eye aria-hidden="true" /> ดูด่วน
                              </button>
                              <PixelLink to={`/fairs/${fair.id}`} tone="cyan">
                                เข้าสู่งาน <ArrowRight aria-hidden="true" />
                              </PixelLink>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="empty-stream-box">
                      <p>ยังไม่มีงานแฟร์ที่เปิดอยู่ขณะนี้</p>
                    </div>
                  )}
                </div>
              </PixelSurface>

              {/* Masked Privacy Guarantee Widget */}
              <PixelSurface data-reveal className="dashboard-widget-card privacy-card">
                <div className="privacy-card-inner">
                  <ShieldCheck className="privacy-badge-icon" aria-hidden="true" />
                  <div>
                    <h4>ความปลอดภัยและสิทธิความเป็นส่วนตัว (Masked Matching)</h4>
                    <p>
                      บริษัทในงานแฟร์จะเห็นเฉพาะความเชี่ยวชาญ ทักษะ และหลักฐานผลงานของคุณ โดยไม่เห็นชื่อ อีเมล หรือไฟล์ Resume ต้นฉบับจนกว่าคุณจะกดอนุญาต
                    </p>
                  </div>
                </div>
              </PixelSurface>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. RECRUITER WORKSPACE DASHBOARD
         ======================================================== */}
      {user.role === "recruiter" && (
        <div className="dashboard-content-layout">
          <div className="cyber-stats-grid" data-reveal>
            <div className="cyber-stat-card">
              <div className="stat-icon-badge violet">
                <Building2 aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">บริษัทของคุณ</span>
                <strong className="stat-number">{company ? "1" : "0"}</strong>
                <span className="stat-sub">{company?.name ?? "ยังไม่ได้สร้าง"}</span>
              </div>
            </div>

            <div className="cyber-stat-card">
              <div className="stat-icon-badge cyan">
                <Store aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">บูธในงานแฟร์</span>
                <strong className="stat-number">{ownedBooths.length}</strong>
                <span className="stat-sub">บูธที่เปิดใช้งาน</span>
              </div>
            </div>

            <div className="cyber-stat-card">
              <div className="stat-icon-badge mango">
                <Briefcase aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">ตำแหน่งงานที่เปิดรับ</span>
                <strong className="stat-number">
                  {database.jobs.filter((j) => ownedBooths.some((b) => b.id === j.boothId)).length}
                </strong>
                <span className="stat-sub">ตำแหน่งงานทั้งหมด</span>
              </div>
            </div>

            <div className="cyber-stat-card">
              <div className="stat-icon-badge green">
                <Send aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">ใบสมัครที่ได้รับ</span>
                <strong className="stat-number">{receivedApplications.length}</strong>
                <span className="stat-sub">Applications Pipeline</span>
              </div>
            </div>
          </div>

          <div className="dashboard-dual-columns">
            <PixelSurface data-reveal className="dashboard-widget-card">
              <div className="widget-header">
                <div>
                  <span className="widget-eyebrow"><BriefcaseBusiness aria-hidden="true" /> Applications Review</span>
                  <h3>ใบสมัครงานที่ได้รับ ({receivedApplications.length})</h3>
                </div>
              </div>
              <p>ตรวจสอบผู้สมัครที่ยื่นโปรไฟล์แบบ Masked เข้ามาในตำแหน่งงาน พร้อมขอดูข้อมูลติดต่อและนัดสัมภาษณ์</p>
              <div className="widget-footer">
                <PixelLink to="/recruiter/workspace" tone="mango">
                  <Send aria-hidden="true" /> จัดการใบสมัครงานใน Studio
                </PixelLink>
              </div>
            </PixelSurface>

            <PixelSurface data-reveal className="dashboard-widget-card">
              <div className="widget-header">
                <div>
                  <span className="widget-eyebrow"><UsersRound aria-hidden="true" /> Candidate Pool</span>
                  <h3>บอร์ดผู้สมัครที่จับคู่ด้วยทักษะ</h3>
                </div>
              </div>
              <p>ดูสรุปทักษะและ Match Score ของผู้สมัครที่เข้าร่วมงานแฟร์เดียวกับคุณแบบไม่เปิดเผยตัวตน</p>
              <div className="widget-footer">
                <PixelLink to="/recruiter/workspace" tone="cyan">
                  <UserCheck aria-hidden="true" /> ตรวจสอบบอร์ดผู้สมัคร
                </PixelLink>
              </div>
            </PixelSurface>
          </div>
        </div>
      )}

      {/* ========================================================
          4. ADMIN WORKSPACE DASHBOARD
         ======================================================== */}
      {user.role === "admin" && (
        <div className="dashboard-content-layout">
          <div className="cyber-stats-grid" data-reveal>
            <div className="cyber-stat-card">
              <div className="stat-icon-badge mango">
                <CalendarDays aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">งานแฟร์ทั้งหมด</span>
                <strong className="stat-number">{database.fairs.length}</strong>
                <span className="stat-sub">{publicFairs.length} งานที่เปิดเผยแพร่</span>
              </div>
            </div>

            <div className="cyber-stat-card">
              <div className="stat-icon-badge cyan">
                <Store aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">บูธทั้งหมดในระบบ</span>
                <strong className="stat-number">{database.booths.length}</strong>
                <span className="stat-sub">จาก {database.companies.length} บริษัท</span>
              </div>
            </div>

            <div className="cyber-stat-card">
              <div className="stat-icon-badge violet">
                <UsersRound aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">ผู้ใช้งานในระบบ</span>
                <strong className="stat-number">{database.users.length}</strong>
                <span className="stat-sub">{database.candidateProfiles.length} Candidate Profiles</span>
              </div>
            </div>

            <div className="cyber-stat-card">
              <div className="stat-icon-badge green">
                <ShieldCheck aria-hidden="true" />
              </div>
              <div className="stat-meta">
                <span className="stat-label">คำขอรออนุมัติ</span>
                <strong className="stat-number">
                  {database.memberships.filter((m) => m.status === "PENDING_APPROVAL").length}
                </strong>
                <span className="stat-sub">คำขอเข้าร่วม Fair จาก Recruiter</span>
              </div>
            </div>
          </div>

          <div className="dashboard-dual-columns">
            <PixelSurface data-reveal className="dashboard-widget-card">
              <div className="widget-header">
                <div>
                  <span className="widget-eyebrow"><ShieldCheck aria-hidden="true" /> Fair Lifecycle Control</span>
                  <h3>ศูนย์ควบคุมและจัดการ Job Fair</h3>
                </div>
              </div>
              <p>สร้างงานแฟร์ใหม่ ปรับสถานะ DRAFT → PUBLISHED → LIVE → ENDED และจัดการสิทธิ์สมาชิก</p>
              <div className="widget-footer">
                <PixelLink to="/admin/fairs" tone="mango">
                  <ShieldCheck aria-hidden="true" /> เปิดศูนย์จัดการ Job Fair
                </PixelLink>
              </div>
            </PixelSurface>

            <PixelSurface data-reveal className="dashboard-widget-card">
              <div className="widget-header">
                <div>
                  <span className="widget-eyebrow"><CalendarDays aria-hidden="true" /> Public Directory</span>
                  <h3>งานแฟร์ที่กำลังจัดอยู่</h3>
                </div>
              </div>
              <p>ตรวจสอบมุมมองของประชาชนและผู้สมัครในแต่ละงานแฟร์</p>
              <div className="widget-footer">
                <PixelLink to="/fairs" tone="neutral">
                  <Eye aria-hidden="true" /> ส่องงานแฟร์ทั้งหมด
                </PixelLink>
              </div>
            </PixelSurface>
          </div>
        </div>
      )}

      {/* Modal: All Candidate Skills */}
      <Modal
        open={skillsModalOpen}
        onClose={() => setSkillsModalOpen(false)}
        title="ทักษะความสามารถทั้งหมดของคุณ"
        subtitle={`รวมทั้งหมด ${manualSkills.length} ทักษะในระบบ`}
        maxWidth="600px"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", margin: 0, lineHeight: 1.5 }}>
            ทักษะเหล่านี้ถูกใช้ในการจับคู่ (Match Score) อัตโนมัติกับตำแหน่งงานใน Job Fair ทั้งหมด
          </p>

          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            padding: 18,
            background: "var(--surface-1)",
            border: "1px solid var(--line)",
            maxHeight: "340px",
            overflowY: "auto",
          }}>
            {manualSkills.length > 0 ? (
              manualSkills.map((skill, idx) => (
                <span
                  key={idx}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "rgba(255, 184, 77, 0.12)",
                    border: "1px solid rgba(255, 184, 77, 0.4)",
                    color: "var(--mango)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  <Sparkles style={{ width: 14, height: 14 }} aria-hidden="true" />
                  {skill}
                </span>
              ))
            ) : (
              <span style={{ color: "var(--muted)", fontStyle: "italic" }}>ยังไม่มีทักษะในโปรไฟล์</span>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: "1px solid var(--line)" }}>
            <PixelLink to="/candidate/profile" tone="mango" onClick={() => setSkillsModalOpen(false)}>
              <PenLine aria-hidden="true" /> แก้ไขหรือเพิ่มทักษะในโปรไฟล์
            </PixelLink>
            <PixelButton type="button" tone="neutral" onClick={() => setSkillsModalOpen(false)}>
              ปิดหน้าต่าง
            </PixelButton>
          </div>
        </div>
      </Modal>

      {/* Modal: Fair Quick Preview */}
      <FairQuickPreviewModal
        open={Boolean(previewFair)}
        fair={previewFair}
        booths={database.booths}
        jobs={database.jobs}
        onClose={() => setPreviewFair(null)}
      />

      {/* Modal: Full AI Resume Analysis */}
      {profile?.resume?.analysis && (
        <ResumeAnalysisModal
          open={analysisModalOpen}
          file={null}
          existingAnalysis={profile.resume.analysis}
          onClose={() => setAnalysisModalOpen(false)}
          onImport={() => setAnalysisModalOpen(false)}
        />
      )}
    </AnimatedPage>
  );
}
