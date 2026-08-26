import { BriefcaseBusiness, Building2, Eye, LockKeyhole, Store, Upload, UsersRound } from "lucide-react";
import { type FormEvent, useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import {
  Field,
  PixelButton,
  PixelSurface,
  SelectField,
  StatusPill,
  TextAreaField,
} from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import { calculateLocalMatch } from "../domain/matching";
import type { JobPosting } from "../domain/types";

const splitList = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export function RecruiterWorkspacePage() {
  const { user, database, actions } = useApp();
  const [activeBoothId, setActiveBoothId] = useState("");
  if (!user) return null;

  const company = database.companies.find((item) => item.ownerId === user.id);
  const booths = database.booths.filter((item) => item.ownerId === user.id);
  const fairs = database.fairs.filter((fair) => fair.status === "PUBLISHED" || fair.status === "LIVE");
  const boothFairIds = new Set(booths.map((booth) => booth.fairId));
  const companyJobs = database.jobs.filter((job) => job.companyId === company?.id && job.status === "PUBLISHED");
  const sharedCandidates = database.memberships.flatMap((membership) => {
    if (membership.role !== "CANDIDATE" || !boothFairIds.has(membership.fairId)) return [];
    const profile = database.candidateProfiles.find((item) => item.userId === membership.userId);
    if (!profile?.shareWithJoinedFairs || !profile.resume?.analysis) return [];
    const fair = database.fairs.find((item) => item.id === membership.fairId);
    const fairBoothIds = new Set(booths.filter((booth) => booth.fairId === membership.fairId).map((booth) => booth.id));
    const rankedJobs = companyJobs
      .filter((job) => fairBoothIds.has(job.boothId))
      .map((job) => ({ job, match: calculateLocalMatch(profile, job) }))
      .sort((left, right) => right.match.score - left.match.score);
    return [{ membership, profile, fair, rankedJobs }];
  });

  const saveCompany = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    actions.saveCompany(user.id, {
      name: String(form.get("name")).trim(),
      industry: String(form.get("industry")).trim(),
      summary: String(form.get("summary")).trim(),
      website: String(form.get("website")).trim(),
      workLocations: String(form.get("workLocations")).trim(),
    });
  };

  const createBooth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!company) return;
    const form = new FormData(event.currentTarget);
    const booth = actions.createBooth(user.id, {
      fairId: String(form.get("fairId")),
      companyId: company.id,
      name: String(form.get("name")).trim(),
      summary: String(form.get("summary")).trim(),
      technologyTags: splitList(form.get("technologyTags")),
      accessibilityNote: String(form.get("accessibilityNote")).trim(),
      status: "PUBLISHED",
    });
    setActiveBoothId(booth.id);
    event.currentTarget.reset();
  };

  const createJob = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!company) return;
    const form = new FormData(event.currentTarget);
    const boothId = String(form.get("boothId"));
    actions.createJob({
      boothId,
      companyId: company.id,
      title: String(form.get("title")).trim(),
      summary: String(form.get("summary")).trim(),
      responsibilities: String(form.get("responsibilities")).trim(),
      mustHave: splitList(form.get("mustHave")),
      niceToHave: splitList(form.get("niceToHave")),
      salaryMin: form.get("salaryMin") ? Number(form.get("salaryMin")) : null,
      salaryMax: form.get("salaryMax") ? Number(form.get("salaryMax")) : null,
      workMode: String(form.get("workMode")) as JobPosting["workMode"],
      employmentType: String(form.get("employmentType")) as JobPosting["employmentType"],
      status: "PUBLISHED",
    });
    setActiveBoothId(boothId);
    event.currentTarget.reset();
  };

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Recruiter workspace</span>
        <h1>บริษัท บูธ และตำแหน่งงาน</h1>
        <p>สร้างข้อมูลบริษัทครั้งเดียว จากนั้นเปิดบูธในแต่ละ Job Fair และเพิ่ม JD ที่ Candidate อ่านได้ก่อนเข้า World</p>
      </div>

      <PixelSurface data-reveal>
        <h2><Building2 aria-hidden="true" /> ข้อมูลบริษัท</h2>
        <form className="form-grid" onSubmit={saveCompany}>
          <Field label="ชื่อบริษัท" name="name" defaultValue={company?.name} required />
          <Field label="อุตสาหกรรม" name="industry" defaultValue={company?.industry} required />
          <Field label="เว็บไซต์" name="website" type="url" defaultValue={company?.website} placeholder="https://" />
          <Field label="สถานที่ทำงาน" name="workLocations" defaultValue={company?.workLocations} required />
          <TextAreaField className="full" label="แนะนำบริษัท" name="summary" defaultValue={company?.summary} required />
          <div className="button-row"><PixelButton type="submit"><Upload aria-hidden="true" /> บันทึกบริษัท</PixelButton></div>
        </form>
      </PixelSurface>

      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <PixelSurface data-reveal>
          <h2><Store aria-hidden="true" /> สร้างบูธ</h2>
          {!company ? <p>กรุณาบันทึกข้อมูลบริษัทก่อน</p> : fairs.length === 0 ? <p>ยังไม่มี Job Fair ที่เปิดรับบูธ ผู้ดูแลต้อง Publish งานก่อน</p> : (
            <form className="form-grid" onSubmit={createBooth}>
              <SelectField className="full" label="Job Fair" name="fairId" required>
                <option value="">เลือกงาน</option>
                {fairs.map((fair) => <option value={fair.id} key={fair.id}>{fair.title} · {fair.status}</option>)}
              </SelectField>
              <Field label="ชื่อบูธ" name="name" required />
              <Field label="Technology tags" name="technologyTags" help="คั่นด้วย comma" />
              <TextAreaField className="full" label="รายละเอียดบูธ" name="summary" required />
              <TextAreaField className="full" label="ข้อมูล Accessibility" name="accessibilityNote" placeholder="ช่องทางติดต่อ วิธีสัมภาษณ์ทดแทน หรือพื้นที่รองรับ" />
              <div className="button-row"><PixelButton type="submit" tone="mango">Publish Booth</PixelButton></div>
            </form>
          )}
        </PixelSurface>

        <PixelSurface data-reveal className="metric-card">
          <strong>{booths.length}</strong><span>บูธที่เปิดแล้ว</span>
          <p>{database.jobs.filter((job) => job.companyId === company?.id).length} ตำแหน่งงาน</p>
        </PixelSurface>
      </div>

      <PixelSurface data-reveal style={{ marginTop: 24 }}>
        <h2><BriefcaseBusiness aria-hidden="true" /> เพิ่มตำแหน่งงาน</h2>
        {booths.length === 0 ? <p>สร้างบูธอย่างน้อยหนึ่งบูธก่อนเพิ่มตำแหน่งงาน</p> : (
          <form className="form-grid" onSubmit={createJob}>
            <SelectField label="บูธ" name="boothId" value={activeBoothId} onChange={(event) => setActiveBoothId(event.target.value)} required>
              <option value="">เลือกบูธ</option>
              {booths.map((booth) => <option value={booth.id} key={booth.id}>{booth.name}</option>)}
            </SelectField>
            <Field label="ชื่อตำแหน่ง" name="title" required />
            <SelectField label="รูปแบบการทำงาน" name="workMode" defaultValue="HYBRID">
              <option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option>
            </SelectField>
            <SelectField label="ประเภทการจ้าง" name="employmentType" defaultValue="FULL_TIME">
              <option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="CONTRACT">Contract</option><option value="INTERNSHIP">Internship</option>
            </SelectField>
            <Field label="เงินเดือนขั้นต่ำ" name="salaryMin" type="number" min="0" />
            <Field label="เงินเดือนสูงสุด" name="salaryMax" type="number" min="0" />
            <TextAreaField className="full" label="สรุป JD" name="summary" required />
            <TextAreaField className="full" label="หน้าที่รับผิดชอบ" name="responsibilities" required />
            <Field label="Must-have skills" name="mustHave" help="คั่นด้วย comma" required />
            <Field label="Nice-to-have skills" name="niceToHave" help="คั่นด้วย comma" />
            <div className="button-row"><PixelButton type="submit" tone="violet">Publish Job</PixelButton></div>
          </form>
        )}
      </PixelSurface>

      <section style={{ marginTop: 36 }}>
        <div className="section-heading" data-reveal><h2>บูธของบริษัท</h2><p>ข้อมูลที่ Published จะปรากฏในหน้ารวมงานแฟร์ทันที</p></div>
        <div className="card-grid">
          {booths.map((booth) => {
            const fair = database.fairs.find((item) => item.id === booth.fairId);
            const jobs = database.jobs.filter((job) => job.boothId === booth.id);
            return (
              <PixelSurface className="fair-card" data-reveal key={booth.id}>
                <StatusPill tone="cyan">{booth.status}</StatusPill>
                <h3>{booth.name}</h3><p>{booth.summary}</p>
                <span>{fair?.title ?? "Unknown fair"}</span>
                <div className="tag-list">{booth.technologyTags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div>
                <strong>{jobs.length} ตำแหน่งงาน</strong>
              </PixelSurface>
            );
          })}
        </div>
      </section>

      <section style={{ marginTop: 36 }} aria-labelledby="candidate-board-title">
        <div className="section-heading" data-reveal>
          <div>
            <StatusPill tone="violet"><UsersRound aria-hidden="true" /> Masked candidate board</StatusPill>
            <h2 id="candidate-board-title">ผู้สมัครที่แชร์กับบูธของคุณ</h2>
          </div>
          <p>เห็นเฉพาะข้อมูลสรุปที่ Candidate ยินยอมแชร์หลังเข้าร่วมแฟร์ ไม่มีชื่อ อีเมล ไฟล์ PDF หรือ extracted text</p>
        </div>

        {sharedCandidates.length === 0 ? (
          <PixelSurface data-reveal>
            <LockKeyhole aria-hidden="true" />
            <h3>ยังไม่มี Masked profile ที่แชร์</h3>
            <p>ผู้สมัครต้องเข้าร่วม Job Fair เดียวกับบูธ วิเคราะห์ Resume และเปิดการแชร์ด้วยตนเองก่อน</p>
          </PixelSurface>
        ) : (
          <div className="job-list">
            {sharedCandidates.map(({ membership, profile, fair, rankedJobs }) => {
              const analysis = profile.resume!.analysis!;
              const alias = `Candidate-${membership.userId.slice(-6).toUpperCase()}`;
              const topMatch = rankedJobs[0];
              return (
                <PixelSurface className="candidate-card" data-reveal key={membership.id}>
                  <div className="section-heading">
                    <div>
                      <StatusPill tone="cyan"><Eye aria-hidden="true" /> Consent active</StatusPill>
                      <h3>{alias}</h3>
                      <strong>{profile.headline || "ไม่ได้ระบุสายงาน"}</strong>
                    </div>
                    {topMatch ? (
                      <div className="metric-card">
                        <strong>{topMatch.match.score}</strong>
                        <span>Skill coverage · {topMatch.job.title}</span>
                      </div>
                    ) : null}
                  </div>
                  <p className="field-help">Job Fair: {fair?.title ?? "Unknown fair"}</p>
                  <div className="analysis-summary">{analysis.recruiterSummary}</div>
                  <div>
                    <strong>ทักษะพร้อมระดับและหลักฐาน</strong>
                    <div className="skill-list compact">
                      {analysis.skills.map((skill) => (
                        <div className="skill-row" key={`${membership.id}-${skill.category}-${skill.name}`}>
                          <div><strong>{skill.name}</strong><small>{skill.category}</small></div>
                          <span>{skill.evidence.join(" · ") || "ไม่มีข้อความหลักฐานเพิ่มเติม"}</span>
                          <StatusPill tone="violet">{skill.level}</StatusPill>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="candidate-facts">
                    <div><strong>จุดแข็ง</strong><ul>{analysis.strengths.map((item) => <li key={item}>{item}</li>)}</ul></div>
                    <div><strong>ประเด็นที่ควรถามเพิ่ม</strong><ul>{analysis.gaps.map((item) => <li key={item}>{item}</li>)}</ul></div>
                    <div><strong>บทบาทที่สอดคล้อง</strong><ul>{analysis.suggestedRoles.map((item) => <li key={item.title}>{item.title} — {item.reason}</li>)}</ul></div>
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
