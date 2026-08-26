import { Building2, CalendarPlus, Play, Radio, Square, UsersRound } from "lucide-react";
import { type FormEvent, useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import { EmptyState, Field, PixelButton, PixelSurface, StatusPill, TextAreaField } from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import type { JobFair } from "../domain/types";

export function AdminFairsPage() {
  const { user, database, actions } = useApp();
  const [error, setError] = useState("");
  if (!user) return null;
  const fairs = database.fairs.filter((fair) => fair.ownerId === user.id);
  const fairIds = new Set(fairs.map((fair) => fair.id));
  const recruiterBooths = database.booths.filter((booth) => fairIds.has(booth.fairId));

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const startsAt = String(form.get("startsAt"));
    const endsAt = String(form.get("endsAt"));
    if (new Date(endsAt) <= new Date(startsAt)) {
      setError("เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มงาน");
      return;
    }
    setError("");
    actions.createFair(user.id, {
      title: String(form.get("title")).trim(),
      slug: String(form.get("slug")).trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      summary: String(form.get("summary")).trim(),
      locationLabel: String(form.get("locationLabel")).trim(),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      status: "DRAFT",
    });
    event.currentTarget.reset();
  };

  const transition = (fair: JobFair) => {
    const next: Record<JobFair["status"], JobFair["status"]> = {
      DRAFT: "PUBLISHED",
      PUBLISHED: "LIVE",
      LIVE: "ENDED",
      ENDED: "ENDED",
    };
    actions.setFairStatus(fair.id, next[fair.status]);
  };

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Admin workspace</span>
        <h1>สร้างและเปิด Job Fair</h1>
        <p>สร้างกำหนดการก่อน แล้ว Publish เพื่อให้ Recruiter เลือกงานและ Candidate เข้าร่วมได้</p>
      </div>

      <div className="dashboard-grid">
        <PixelSurface data-reveal>
          <h2><CalendarPlus aria-hidden="true" /> งานแฟร์ใหม่</h2>
          <form className="form-grid" onSubmit={submit}>
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

      <section style={{ marginTop: 36 }}>
        <div className="section-heading" data-reveal>
          <h2>งานแฟร์ทั้งหมด</h2>
          <p>ลำดับสถานะปัจจุบันคือ Draft → Published → Live → Ended</p>
        </div>
        <div className="card-grid">
          {fairs.map((fair) => {
            const boothCount = database.booths.filter((booth) => booth.fairId === fair.id).length;
            const memberCount = database.memberships.filter((member) => member.fairId === fair.id).length;
            return (
              <PixelSurface className="fair-card" data-reveal key={fair.id}>
                <StatusPill tone={fair.status === "LIVE" ? "cyan" : fair.status === "DRAFT" ? "mango" : "violet"}>
                  {fair.status}
                </StatusPill>
                <h3>{fair.title}</h3>
                <p>{fair.summary}</p>
                <div className="inline-meta">
                  <span>{boothCount} บูธ</span><span>{memberCount} สมาชิก</span><span>/{fair.slug}</span>
                </div>
                {fair.status !== "ENDED" ? (
                  <PixelButton tone={fair.status === "LIVE" ? "danger" : "cyan"} onClick={() => transition(fair)}>
                    {fair.status === "DRAFT" ? <Radio aria-hidden="true" /> : fair.status === "PUBLISHED" ? <Play aria-hidden="true" /> : <Square aria-hidden="true" />}
                    {fair.status === "DRAFT" ? "Publish" : fair.status === "PUBLISHED" ? "เริ่มงาน" : "ปิดงาน"}
                  </PixelButton>
                ) : null}
              </PixelSurface>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 48 }} aria-labelledby="recruiter-overview-title">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow">Recruiter oversight</span>
            <h2 id="recruiter-overview-title">บริษัทและผู้ดูแลบูธในแต่ละงาน</h2>
          </div>
          <p>ตรวจว่าใครเป็นเจ้าของบูธ บริษัทใดกำลังเข้าร่วม และประกาศตำแหน่งแล้วกี่ตำแหน่ง โดย Recruiter แก้ไขได้เฉพาะข้อมูลที่ตนเองเป็นเจ้าของ</p>
        </div>

        {recruiterBooths.length === 0 ? (
          <EmptyState title="ยังไม่มี Recruiter เปิดบูธ" body="เมื่อ Job Fair ถูก Publish แล้ว Recruiter จะเลือกงาน สร้างข้อมูลบริษัท และเปิดบูธของตนเองได้" />
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
                    <StatusPill tone={booth.status === "PUBLISHED" ? "cyan" : "mango"}>{booth.status}</StatusPill>
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
