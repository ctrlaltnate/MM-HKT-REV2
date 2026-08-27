import {
  AlertCircle,
  ArrowRight,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  LogIn,
  MapPin,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Tag,
  UserCheck,
  UsersRound,
  Video,
  Zap,
} from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

import { AnimatedPage } from "../components/AnimatedPage";
import { FairTrackMatchBanner } from "../components/FairTrackMatchBanner";
import { PixelButton, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import { useAuthModal } from "../context/AuthModalContext";
import { useToast } from "../context/ToastContext";
import { calculateLocalMatch } from "../domain/matching";
import type { JobPosting } from "../domain/types";

export function FairDetailPage() {
  const { fairId } = useParams();
  const { user, database, actions } = useApp();
  const { openAuthModal } = useAuthModal();
  const { toast } = useToast();

  const fair = database.fairs.find((item) => item.id === fairId || item.slug === fairId);
  if (!fair) return <Navigate to="/fairs" replace />;

  const booths = database.booths.filter((booth) => booth.fairId === fair.id && booth.status === "PUBLISHED");
  const membership = user
    ? database.memberships.find((item) => item.fairId === fair.id && item.userId === user.id)
    : undefined;
  const profile = user
    ? database.candidateProfiles.find((item) => item.userId === user.id)
    : undefined;
  const applications = database.applications || [];

  const handleApply = (job: JobPosting, boothId: string, companyId: string) => {
    if (!user) {
      openAuthModal("login");
      return;
    }
    if (user.role !== "candidate") {
      toast.error("เฉพาะบัญชีผู้สมัครงาน (Job Seeker) เท่านั้นที่สามารถยื่นใบสมัครได้");
      return;
    }

    const match = calculateLocalMatch(profile, job);
    actions.applyToJob({
      jobId: job.id,
      boothId,
      fairId: fair.id,
      companyId,
      candidateUserId: user.id,
      matchScore: match.score,
    });
    toast.success(`ยื่นใบสมัครตำแหน่ง "${job.title}" เรียบร้อยแล้ว! บริษัทจะเห็นข้อมูลทักษะของคุณแบบ Masked`);
  };

  const handleAllowReveal = (applicationId: string) => {
    actions.toggleApplicationRevealConsent(applicationId, true);
    toast.success("ยินยอมเปิดเผยข้อมูลติดต่อให้บริษัทเรียบร้อยแล้ว!");
  };

  return (
    <AnimatedPage className="page-shell fair-detail-page">
      {/* Fair Cover Banner (if set) */}
      {fair.coverUrl && (
        <div
          data-reveal
          style={{
            width: "100%",
            height: "220px",
            background: `url(${fair.coverUrl}) center/cover no-repeat`,
            border: "1px solid var(--line)",
            marginBottom: 24,
            position: "relative",
            boxShadow: "0 0 20px rgba(0,0,0,0.5)",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(7,16,26,0.9))" }} />
        </div>
      )}

      {/* Fair Header */}
      <div className="page-header fair-detail-header" data-reveal>
        <div className="fair-status-row" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>
            {fair.status === "LIVE" ? "● LIVE NOW" : fair.status}
          </StatusPill>
          <span className="fair-dates-pill">
            <CalendarDays aria-hidden="true" /> {new Date(fair.startsAt).toLocaleDateString("th-TH")} – {new Date(fair.endsAt).toLocaleDateString("th-TH")}
          </span>
          {fair.timezone && (
            <span style={{ fontSize: "0.8rem", color: "var(--cyan)", background: "rgba(120,219,230,0.1)", border: "1px solid rgba(120,219,230,0.25)", padding: "2px 8px", borderRadius: 2 }}>
              <Clock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
              {fair.timezone}
            </span>
          )}
          {fair.autoSchedule && (
            <span style={{ fontSize: "0.75rem", color: "var(--mango)", background: "rgba(255,216,77,0.1)", border: "1px solid rgba(255,216,77,0.3)", padding: "2px 8px", borderRadius: 2 }}>
              <Zap size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} /> Auto-Schedule
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12 }}>
          {fair.logoUrl && (
            <img
              src={fair.logoUrl}
              alt=""
              style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover", border: "2px solid var(--cyan)", flexShrink: 0 }}
            />
          )}
          <h1 className="fair-page-title" style={{ margin: 0 }}>{fair.title}</h1>
        </div>

        <p className="fair-page-summary">{fair.summary}</p>

        {/* Tags */}
        {fair.tags && fair.tags.length > 0 && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "10px 0" }}>
            {fair.tags.map((t) => (
              <span key={t} className="stat-chip" style={{ fontSize: "0.78rem" }}>
                #{t}
              </span>
            ))}
          </div>
        )}

        <div className="fair-meta-bar">
          <span><MapPin className="mini-icon" aria-hidden="true" /> {fair.locationLabel}</span>
          <span><Store className="mini-icon" aria-hidden="true" /> {booths.length} บูธบริษัท</span>
          <span><UsersRound className="mini-icon" aria-hidden="true" /> {database.memberships.filter((m) => m.fairId === fair.id && m.status === "ACTIVE").length} ผู้เข้าร่วม</span>
        </div>

        {/* Media & Resource Links */}
        {fair.mediaLinks && fair.mediaLinks.length > 0 && (
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid rgba(120,219,230,0.15)" }}>
            <span style={{ fontSize: "0.82rem", color: "var(--muted)", display: "block", marginBottom: 8 }}>
              เอกสารและสื่อประกอบงานแฟร์:
            </span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {fair.mediaLinks.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "var(--surface-1)",
                    border: "1px solid var(--cyan)",
                    color: "var(--text)",
                    fontSize: "0.82rem",
                    textDecoration: "none",
                    borderRadius: 2,
                    transition: "all 0.15s ease",
                  }}
                >
                  {l.type === "video" && <Video size={14} style={{ color: "#ff5470" }} />}
                  {l.type === "deck" && <FileText size={14} style={{ color: "var(--mango)" }} />}
                  {l.type === "website" && <Globe size={14} style={{ color: "var(--cyan)" }} />}
                  {l.type === "livestream" && <Radio size={14} style={{ color: "#ef4444" }} />}
                  {(!l.type || l.type === "social" || l.type === "other") && <Link2 size={14} style={{ color: "var(--cyan)" }} />}
                  <strong>{l.title}</strong>
                  <ExternalLink size={12} style={{ color: "var(--muted)" }} />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Target Track Match Banner */}
      {user?.role === "candidate" && profile && (
        <FairTrackMatchBanner fair={fair} profile={profile} />
      )}

      {/* Fair Join Action Surface */}
      <PixelSurface data-reveal className="fair-participation-card">
        <div className="participation-inner">
          <div>
            <h3>การเข้าร่วมงาน Job Fair</h3>
            <p>เมื่อเข้าร่วมงาน ข้อมูลสรุปทักษะของคุณจะปรากฏบน Candidate Board ของบริษัทในงานนี้แบบ Masked</p>
          </div>

          {!user ? (
            <PixelButton tone="mango" onClick={() => openAuthModal("login")}>
              <LogIn aria-hidden="true" /> เข้าสู่ระบบเพื่อเข้าร่วมงานแฟร์
            </PixelButton>
          ) : user.role !== "candidate" ? (
            <StatusPill tone="neutral">คุณกำลังเปิดดูในฐานะ {user.role.toUpperCase()}</StatusPill>
          ) : membership ? (
            <div className="joined-status-group">
              <StatusPill tone="cyan"><Check aria-hidden="true" /> คุณเข้าร่วมงานนี้แล้ว</StatusPill>
              <small>สามารถเลือกดูบูธและกดสมัครงานในตำแหน่งที่สนใจได้ทันที</small>
            </div>
          ) : (
            <div className="join-action-group">
              <PixelButton tone="mango" onClick={() => {
                actions.joinFair(user.id, fair.id, "CANDIDATE");
                toast.success(`เข้าร่วมงานแฟร์ "${fair.title}" สำเร็จ!`);
              }}>
                <Sparkles aria-hidden="true" /> เข้าร่วม Job Fair นี้
              </PixelButton>
            </div>
          )}
        </div>
      </PixelSurface>

      {/* Booths Section */}
      <section className="fair-detail-section">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow"><Store aria-hidden="true" /> Virtual Career Booths</span>
            <h2>บริษัทและบูธที่เปิดรับ ({booths.length})</h2>
          </div>
          <p>เลือกสำรวจบูธเพื่อดูข้อมูลบริษัท เทคโนโลยีที่ใช้ และตำแหน่งงานที่เปิดรับ</p>
        </div>

        <div className="booth-card-grid">
          {booths.map((booth) => {
            const company = database.companies.find((item) => item.id === booth.companyId);
            const jobs = database.jobs.filter((job) => job.boothId === booth.id && job.status === "PUBLISHED");
            return (
              <PixelSurface className="booth-showcase-card" data-reveal key={booth.id}>
                <div className="booth-showcase-head">
                  <StatusPill tone="cyan"><Store aria-hidden="true" /> Online Booth</StatusPill>
                  <span className="booth-jobs-count"><Briefcase aria-hidden="true" /> {jobs.length} ตำแหน่ง</span>
                </div>
                <h3>{booth.name}</h3>
                <strong className="booth-company-name"><Building2 aria-hidden="true" /> {company?.name ?? "องค์กร"}</strong>
                <p className="booth-summary-text">{booth.summary}</p>
                {booth.technologyTags && booth.technologyTags.length > 0 && (
                  <div className="tag-list">
                    {booth.technologyTags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                  </div>
                )}
              </PixelSurface>
            );
          })}
        </div>
      </section>

      {/* Jobs & Application Section */}
      <section className="fair-detail-section">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow"><BriefcaseBusiness aria-hidden="true" /> Opportunities</span>
            <h2>ตำแหน่งงานทั้งหมดที่เปิดรับ</h2>
          </div>
          <p>คะแนน Match Score คำนวณความสอดคล้องของทักษะและประวัติการทำงานของคุณกับตำแหน่งงานโดยตรง</p>
        </div>

        <div className="jobs-stream-grid">
          {booths.flatMap((booth) =>
            database.jobs
              .filter((job) => job.boothId === booth.id && job.status === "PUBLISHED")
              .map((job) => {
                const company = database.companies.find((item) => item.id === job.companyId);
                const match = calculateLocalMatch(profile, job);
                const userApp = user
                  ? applications.find((a) => a.jobId === job.id && a.candidateUserId === user.id)
                  : undefined;

                return (
                  <PixelSurface className="job-interactive-card" data-reveal key={job.id}>
                    <div className="job-card-header">
                      <div>
                        <div className="job-badges-line">
                          <StatusPill tone="violet">{job.employmentType}</StatusPill>
                          <StatusPill tone="neutral">{job.workMode}</StatusPill>
                          {job.salaryMin && (
                            <span className="salary-pill">
                              💰 {job.salaryMin.toLocaleString()} - {job.salaryMax?.toLocaleString() ?? "+"} THB
                            </span>
                          )}
                        </div>
                        <h3 className="job-card-title">{job.title}</h3>
                        <strong className="job-company-label">
                          <Building2 aria-hidden="true" /> {company?.name} • บูธ {booth.name}
                        </strong>
                      </div>

                      {user?.role === "candidate" && (
                        <div className="match-score-badge-box">
                          <strong className="match-number">{match.score}%</strong>
                          <span className="match-label">Skill Match</span>
                        </div>
                      )}
                    </div>

                    <p className="job-summary-body">{job.summary}</p>

                    {/* Must-have skills */}
                    {job.mustHave && job.mustHave.length > 0 && (
                      <div className="job-skills-section">
                        <strong className="skills-heading">ทักษะสำคัญ (Must-have):</strong>
                        <div className="tag-list">
                          {job.mustHave.map((skill) => {
                            const isUserMatched = match.matched.includes(skill);
                            return (
                              <span key={skill} className={`tag ${isUserMatched ? "matched" : ""}`}>
                                {isUserMatched ? "✓ " : ""}{skill}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Matched Summary */}
                    {match.matched.length > 0 && (
                      <div className="matched-feedback-banner">
                        <CheckCircle2 className="check-icon" aria-hidden="true" />
                        <span>ตรงกับทักษะของคุณ: <strong>{match.matched.join(", ")}</strong></span>
                      </div>
                    )}

                    {/* Application Action Footer */}
                    <div className="job-card-action-footer">
                      <div className="app-status-side">
                        {userApp ? (
                          <div className="app-current-status-box">
                            {userApp.status === "APPLIED" && (
                              <StatusPill tone="cyan"><Check aria-hidden="true" /> ยื่นใบสมัครแล้ว (รอพิจารณา)</StatusPill>
                            )}
                            {userApp.status === "SHORTLISTED" && (
                              <StatusPill tone="mango">⭐ ได้รับการคัดเลือก (Shortlisted)</StatusPill>
                            )}
                            {userApp.status === "REVEAL_REQUESTED" && !userApp.revealConsentGiven && (
                              <div className="reveal-request-alert">
                                <span>🔔 บริษัทขอดูข้อมูลติดต่อของคุณ:</span>
                                <PixelButton
                                  type="button"
                                  tone="cyan"
                                  onClick={() => handleAllowReveal(userApp.id)}
                                >
                                  <ShieldCheck aria-hidden="true" /> ยินยอมเปิดเผยข้อมูลติดต่อ
                                </PixelButton>
                              </div>
                            )}
                            {(userApp.status === "REVEALED" || userApp.revealConsentGiven) && (
                              <StatusPill tone="cyan">✓ เปิดเผยข้อมูลติดต่อแล้ว</StatusPill>
                            )}
                            {userApp.status === "INTERVIEW_SCHEDULED" && (
                              <div className="interview-scheduled-badge">
                                <StatusPill tone="cyan"><Clock aria-hidden="true" /> มีนัดสัมภาษณ์</StatusPill>
                                {userApp.scheduledInterviewAt && (
                                  <small>วันนัดหมาย: {new Date(userApp.scheduledInterviewAt).toLocaleString("th-TH")}</small>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="anonymous-safety-hint">
                            <ShieldCheck aria-hidden="true" /> ยื่นสมัครแบบ Masked Privacy ปลอดภัย 100%
                          </span>
                        )}
                      </div>

                      <div className="app-button-side">
                        {userApp ? (
                          <PixelButton
                            type="button"
                            tone="neutral"
                            onClick={() => {
                              actions.withdrawApplication(userApp.id);
                              toast.info(`ยกเลิกการสมัครตำแหน่ง "${job.title}" แล้ว`);
                            }}
                          >
                            ยกเลิกการสมัคร
                          </PixelButton>
                        ) : (
                          <PixelButton
                            type="button"
                            tone="mango"
                            onClick={() => handleApply(job, booth.id, job.companyId)}
                          >
                            <Send aria-hidden="true" /> สมัครตำแหน่งนี้ (Masked Profile)
                          </PixelButton>
                        )}
                      </div>
                    </div>
                  </PixelSurface>
                );
              }),
          )}
        </div>
      </section>
    </AnimatedPage>
  );
}
