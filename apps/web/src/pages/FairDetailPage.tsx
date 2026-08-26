import { BriefcaseBusiness, Check, LogIn, MapPin, Store, UsersRound } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

import { AnimatedPage } from "../components/AnimatedPage";
import { PixelButton, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import { calculateLocalMatch } from "../domain/matching";

export function FairDetailPage() {
  const { fairId } = useParams();
  const { user, database, actions } = useApp();
  const fair = database.fairs.find((item) => item.id === fairId);
  if (!fair) return <Navigate to="/fairs" replace />;

  const booths = database.booths.filter((booth) => booth.fairId === fair.id && booth.status === "PUBLISHED");
  const membership = user
    ? database.memberships.find((item) => item.fairId === fair.id && item.userId === user.id)
    : undefined;
  const profile = user
    ? database.candidateProfiles.find((item) => item.userId === user.id)
    : undefined;

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>{fair.status}</StatusPill>
        <h1>{fair.title}</h1>
        <p>{fair.summary}</p>
        <div className="fair-meta">
          <span><MapPin aria-hidden="true" /> {fair.locationLabel}</span>
          <span><UsersRound aria-hidden="true" /> {booths.length} บูธ</span>
        </div>
      </div>

      <PixelSurface data-reveal>
        <h2>การเข้าร่วมงาน</h2>
        {!user ? (
          <PixelLink to="/auth" tone="mango"><LogIn aria-hidden="true" /> เข้าสู่ระบบเพื่อเข้าร่วม</PixelLink>
        ) : user.role !== "candidate" ? (
          <p>บัญชีบทบาท {user.role} สามารถดูข้อมูลได้ แต่การสมัครเข้าร่วมในฐานะ Candidate ต้องใช้บัญชีผู้สมัคร</p>
        ) : membership ? (
          <div className="button-row"><StatusPill tone="cyan"><Check aria-hidden="true" /> เข้าร่วมแล้ว</StatusPill><span>World จะเปิดในเฟสเกมหลัง profile/event readiness ผ่าน</span></div>
        ) : (
          <div className="button-row">
            <PixelButton tone="mango" onClick={() => actions.joinFair(user.id, fair.id, "CANDIDATE")}>เข้าร่วม Job Fair นี้</PixelButton>
            {!profile?.resume?.analysis ? <span className="field-help">เพิ่ม Resume analysis เพื่อดู match evidence ที่สมบูรณ์ขึ้น</span> : null}
          </div>
        )}
      </PixelSurface>

      <section style={{ marginTop: 36 }}>
        <div className="section-heading" data-reveal><h2>บริษัทและบูธ</h2><p>ข้อมูลทั้งหมดมาจาก Recruiter workspace และใช้ร่วมกับ World ในอนาคต</p></div>
        <div className="card-grid">
          {booths.map((booth) => {
            const company = database.companies.find((item) => item.id === booth.companyId);
            const jobs = database.jobs.filter((job) => job.boothId === booth.id && job.status === "PUBLISHED");
            return (
              <PixelSurface className="fair-card" data-reveal key={booth.id}>
                <StatusPill tone="cyan"><Store aria-hidden="true" /> Booth online</StatusPill>
                <h3>{booth.name}</h3>
                <strong>{company?.name}</strong>
                <p>{booth.summary}</p>
                <div className="tag-list">{booth.technologyTags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <span>{jobs.length} ตำแหน่งงาน</span>
              </PixelSurface>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 36 }}>
        <div className="section-heading" data-reveal><h2>ตำแหน่งงาน</h2><p>คะแนนด้านล่างเป็น deterministic skill coverage จากข้อมูลที่ผู้สมัครบันทึก ไม่ใช่โอกาสได้งาน</p></div>
        <div className="job-list">
          {booths.flatMap((booth) =>
            database.jobs.filter((job) => job.boothId === booth.id && job.status === "PUBLISHED").map((job) => {
              const company = database.companies.find((item) => item.id === job.companyId);
              const match = calculateLocalMatch(profile, job);
              return (
                <PixelSurface className="job-card" data-reveal key={job.id}>
                  <div className="section-heading">
                    <div><StatusPill tone="violet"><BriefcaseBusiness aria-hidden="true" /> {job.employmentType}</StatusPill><h3>{job.title}</h3><strong>{company?.name}</strong></div>
                    {user?.role === "candidate" ? <div className="metric-card"><strong>{match.score}</strong><span>Skill coverage / 100</span></div> : null}
                  </div>
                  <p>{job.summary}</p>
                  <div className="job-meta"><span>{job.workMode}</span><span>{job.salaryMin?.toLocaleString() ?? "—"}–{job.salaryMax?.toLocaleString() ?? "—"} THB</span></div>
                  <div><strong>Must-have</strong><div className="tag-list">{job.mustHave.map((skill) => <span className="tag" key={skill}>{skill}</span>)}</div></div>
                  {match.matched.length ? <p className="field-help">ตรงกับข้อมูลของคุณ: {match.matched.join(", ")}</p> : null}
                </PixelSurface>
              );
            }),
          )}
        </div>
      </section>
    </AnimatedPage>
  );
}
