import {
  AlertCircle,
  Archive,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  LockKeyhole,
  Mail,
  Play,
  ShieldCheck,
  Store,
  Trash2,
  Upload,
  UsersRound,
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
  SelectField,
  StatusPill,
  TextAreaField,
} from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import { calculateLocalMatch } from "../domain/matching";
import type { Booth, JobPosting } from "../domain/types";

const splitList = (value: FormDataEntryValue | null) =>
  String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export function RecruiterWorkspacePage() {
  const { user, database, actions } = useApp();
  const [activeBoothId, setActiveBoothId] = useState("");
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null);
  const [deleteBoothId, setDeleteBoothId] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  if (!user) return null;

  const company = database.companies.find((item) => item.ownerId === user.id);
  const booths = database.booths.filter((item) => item.ownerId === user.id);
  const fairs = database.fairs.filter(
    (fair) => fair.status === "PUBLISHED" || fair.status === "LIVE" || fair.status === "PAUSED",
  );
  const boothFairIds = new Set(booths.map((booth) => booth.fairId));
  const companyJobs = database.jobs.filter((job) => job.companyId === company?.id);
  const publishedCompanyJobs = companyJobs.filter((job) => job.status === "PUBLISHED");

  // Recruiter Fair Memberships
  const recruiterMemberships = database.memberships.filter(
    (m) =>
      m.role === "RECRUITER" &&
      (m.userId === user.id || (m.invitedEmail && m.invitedEmail.toLowerCase() === user.email.toLowerCase())),
  );
  const invitedMemberships = recruiterMemberships.filter((m) => m.status === "INVITED");
  const pendingMemberships = recruiterMemberships.filter((m) => m.status === "PENDING_APPROVAL");
  const activeMemberships = recruiterMemberships.filter((m) => m.status === "ACTIVE");
  const activeFairIds = new Set(activeMemberships.map((m) => m.fairId));
  const approvedFairs = fairs.filter((fair) => activeFairIds.has(fair.id));

  const sharedCandidates = database.memberships.flatMap((membership) => {
    if (membership.role !== "CANDIDATE" || !boothFairIds.has(membership.fairId)) return [];
    const profile = database.candidateProfiles.find((item) => item.userId === membership.userId);
    if (!profile?.shareWithJoinedFairs || !profile.resume?.analysis) return [];
    const fair = database.fairs.find((item) => item.id === membership.fairId);
    const fairBoothIds = new Set(booths.filter((booth) => booth.fairId === membership.fairId).map((booth) => booth.id));
    const rankedJobs = publishedCompanyJobs
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
    const fairId = String(form.get("fairId"));
    if (!activeFairIds.has(fairId)) return;

    const booth = actions.createBooth(user.id, {
      fairId,
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

  const submitEditBooth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingBooth) return;
    const form = new FormData(event.currentTarget);
    actions.updateBooth(editingBooth.id, {
      name: String(form.get("name")).trim(),
      summary: String(form.get("summary")).trim(),
      technologyTags: splitList(form.get("technologyTags")),
      accessibilityNote: String(form.get("accessibilityNote")).trim(),
      status: String(form.get("status")) as Booth["status"],
    });
    setEditingBooth(null);
  };

  const confirmDeleteBooth = (boothId: string) => {
    actions.deleteBooth(boothId);
    setDeleteBoothId(null);
    if (activeBoothId === boothId) setActiveBoothId("");
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

  const submitEditJob = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingJob) return;
    const form = new FormData(event.currentTarget);
    actions.updateJob(editingJob.id, {
      title: String(form.get("title")).trim(),
      summary: String(form.get("summary")).trim(),
      responsibilities: String(form.get("responsibilities")).trim(),
      mustHave: splitList(form.get("mustHave")),
      niceToHave: splitList(form.get("niceToHave")),
      salaryMin: form.get("salaryMin") ? Number(form.get("salaryMin")) : null,
      salaryMax: form.get("salaryMax") ? Number(form.get("salaryMax")) : null,
      workMode: String(form.get("workMode")) as JobPosting["workMode"],
      employmentType: String(form.get("employmentType")) as JobPosting["employmentType"],
      status: String(form.get("status")) as JobPosting["status"],
    });
    setEditingJob(null);
  };

  const confirmDeleteJob = (jobId: string) => {
    actions.deleteJob(jobId);
    setDeleteJobId(null);
  };

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Recruiter workspace</span>
        <h1>บริษัท บูธ และตำแหน่งงาน</h1>
        <p>สร้างและจัดการข้อมูลบริษัท ขอเข้าร่วมงาน Job Fair และประกาศรับสมัครงาน</p>
      </div>

      {/* Invitations Alert Banner */}
      {invitedMemberships.length > 0 ? (
        <PixelSurface data-reveal style={{ marginBottom: 24, background: "rgba(255, 216, 77, 0.08)", borderColor: "var(--mango)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Mail style={{ color: "var(--mango)" }} aria-hidden="true" />
            <h2 style={{ fontSize: "1.15rem", margin: 0, color: "var(--mango)" }}>คุณได้รับคำเชิญเข้าร่วม Job Fair!</h2>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {invitedMemberships.map((inv) => {
              const fair = database.fairs.find((f) => f.id === inv.fairId);
              return (
                <div
                  key={inv.id}
                  style={{
                    background: "rgba(0,0,0,0.2)",
                    borderRadius: 6,
                    padding: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                  }}
                >
                  <div>
                    <strong>{fair?.title ?? "Job Fair"}</strong> · {fair?.locationLabel ?? "-"}
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>{fair?.summary}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <PixelButton
                      tone="mango"
                      onClick={() => actions.acceptFairInvitation(user.id, inv.fairId)}
                    >
                      <CheckCircle2 aria-hidden="true" /> ตอบรับคำเชิญ
                    </PixelButton>
                    <PixelButton
                      tone="neutral"
                      onClick={() => actions.removeFairMembership(inv.id)}
                    >
                      <XCircle aria-hidden="true" /> ปฏิเสธ
                    </PixelButton>
                  </div>
                </div>
              );
            })}
          </div>
        </PixelSurface>
      ) : null}

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

      {/* Fair Participation & Access Management */}
      <PixelSurface data-reveal style={{ marginTop: 24 }}>
        <div className="section-heading" style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShieldCheck style={{ color: "var(--cyan)" }} aria-hidden="true" />
            <h2 style={{ margin: 0 }}>สิทธิ์การเข้าร่วมงาน Job Fair</h2>
          </div>
          <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
            Recruiter ต้องได้รับอนุมัติจากผู้จัดงานหรือตอบรับคำเชิญก่อนจึงจะสามารถเปิดบูธในงานได้
          </p>
        </div>

        {fairs.length === 0 ? (
          <EmptyState title="ยังไม่มี Job Fair ที่เปิดรับ" body="ผู้จัดงานต้อง Publish งานแฟร์ก่อนจึงจะเปิดรับสมัครบูธได้" />
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {fairs.map((fair) => {
              const membership = recruiterMemberships.find((m) => m.fairId === fair.id);
              const isApproved = membership?.status === "ACTIVE";
              const isPending = membership?.status === "PENDING_APPROVAL";
              const isInvited = membership?.status === "INVITED";
              const isRejected = membership?.status === "REJECTED";

              return (
                <div
                  key={fair.id}
                  style={{
                    background: isApproved
                      ? "rgba(120, 219, 230, 0.04)"
                      : isPending
                      ? "rgba(255, 216, 77, 0.04)"
                      : "rgba(255, 255, 255, 0.02)",
                    border: `1px solid ${
                      isApproved
                        ? "rgba(120, 219, 230, 0.2)"
                        : isPending
                        ? "rgba(255, 216, 77, 0.2)"
                        : "rgba(255, 255, 255, 0.08)"
                    }`,
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
                      <strong style={{ fontSize: "1.05rem" }}>{fair.title}</strong>
                      <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>{fair.status}</StatusPill>
                      {isApproved ? (
                        <StatusPill tone="cyan">ได้รับอนุญาตแล้ว</StatusPill>
                      ) : isPending ? (
                        <StatusPill tone="mango">รอผู้จัดงานอนุมัติ</StatusPill>
                      ) : isInvited ? (
                        <StatusPill tone="mango">ได้รับคำเชิญ</StatusPill>
                      ) : isRejected ? (
                        <StatusPill tone="danger">คำขอถูกปฏิเสธ</StatusPill>
                      ) : (
                        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>ยังไม่เข้าร่วม</span>
                      )}
                    </div>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--muted)" }}>
                      {fair.summary} · {fair.locationLabel}
                    </p>
                  </div>

                  <div>
                    {isApproved ? (
                      <span style={{ color: "var(--cyan)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <CheckCircle2 size={16} aria-hidden="true" /> พร้อมเปิดบูธ
                      </span>
                    ) : isPending ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "var(--mango)", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: 4 }}>
                          <Clock size={14} aria-hidden="true" /> ส่งคำขอแล้ว
                        </span>
                        <PixelButton tone="neutral" onClick={() => actions.removeFairMembership(membership!.id)}>
                          ยกเลิกคำขอ
                        </PixelButton>
                      </div>
                    ) : isInvited ? (
                      <PixelButton tone="mango" onClick={() => actions.acceptFairInvitation(user.id, fair.id)}>
                        <CheckCircle2 aria-hidden="true" /> ตอบรับคำเชิญ
                      </PixelButton>
                    ) : (
                      <PixelButton tone="cyan" onClick={() => actions.requestRecruiterFairAccess(user.id, fair.id)}>
                        <ShieldCheck aria-hidden="true" /> ขอยื่นเข้าร่วมงาน
                      </PixelButton>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </PixelSurface>

      {/* Booth Creation */}
      <div className="dashboard-grid" style={{ marginTop: 24 }}>
        <PixelSurface data-reveal>
          <h2><Store aria-hidden="true" /> สร้างบูธ</h2>
          {!company ? (
            <p>กรุณาบันทึกข้อมูลบริษัทด้านบนก่อน</p>
          ) : approvedFairs.length === 0 ? (
            <div style={{ padding: 12, background: "rgba(255, 216, 77, 0.05)", border: "1px solid rgba(255, 216, 77, 0.2)", borderRadius: 6 }}>
              <p style={{ margin: 0, color: "var(--mango)", fontSize: "0.9rem" }}>
                <Clock size={16} style={{ verticalAlign: "middle", marginRight: 6 }} aria-hidden="true" />
                คุณยังไม่มี Job Fair ที่ได้รับอนุญาตเปิดบูธ กรุณายื่นขอเข้าร่วมงานหรือตอบรับคำเชิญในส่วน <strong>"สิทธิ์การเข้าร่วมงาน Job Fair"</strong> ด้านบน
              </p>
            </div>
          ) : (
            <form className="form-grid" onSubmit={createBooth}>
              <SelectField className="full" label="Job Fair ที่ได้รับอนุญาต" name="fairId" required>
                <option value="">เลือกงาน</option>
                {approvedFairs.map((fair) => (
                  <option value={fair.id} key={fair.id}>
                    {fair.title} · {fair.status}
                  </option>
                ))}
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
          <p>{companyJobs.length} ตำแหน่งงาน ({publishedCompanyJobs.length} Published)</p>
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

      {/* Edit Booth Modal */}
      {editingBooth ? (
        <div className="auth-backdrop" role="presentation" onClick={() => setEditingBooth(null)}>
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-label="แก้ไขบูธ"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 540 }}
          >
            <div className="auth-header">
              <div className="auth-title">
                <Edit3 aria-hidden="true" />
                <h2>แก้ไขบูธ</h2>
              </div>
              <button
                type="button"
                className="auth-close"
                onClick={() => setEditingBooth(null)}
                aria-label="ปิดกล่องแก้ไข"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <form className="form-grid" onSubmit={submitEditBooth} style={{ marginTop: 16 }}>
              <Field label="ชื่อบูธ" name="name" defaultValue={editingBooth.name} required />
              <div>
                <label className="pixel-label">สถานะบูธ</label>
                <select name="status" defaultValue={editingBooth.status} className="pixel-input">
                  <option value="DRAFT">DRAFT (ฉบับร่าง)</option>
                  <option value="PUBLISHED">PUBLISHED (เปิดแสดง)</option>
                  <option value="ARCHIVED">ARCHIVED (เก็บถาวร)</option>
                </select>
              </div>
              <Field label="Technology tags" name="technologyTags" defaultValue={editingBooth.technologyTags.join(", ")} help="คั่นด้วย comma" />
              <TextAreaField className="full" label="รายละเอียดบูธ" name="summary" defaultValue={editingBooth.summary} required />
              <TextAreaField className="full" label="ข้อมูล Accessibility" name="accessibilityNote" defaultValue={editingBooth.accessibilityNote} />
              <div className="button-row" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <PixelButton type="button" tone="neutral" onClick={() => setEditingBooth(null)}>
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

      {/* Delete Booth Confirmation */}
      {deleteBoothId ? (
        <div className="auth-backdrop" role="presentation" onClick={() => setDeleteBoothId(null)}>
          <div
            className="auth-modal"
            role="alertdialog"
            aria-modal="true"
            aria-label="ยืนยันการลบบูธ"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 440 }}
          >
            <div className="auth-header">
              <div className="auth-title">
                <Trash2 aria-hidden="true" />
                <h2>ยืนยันการลบบูธ</h2>
              </div>
              <button
                type="button"
                className="auth-close"
                onClick={() => setDeleteBoothId(null)}
                aria-label="ปิดกล่องลบ"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <p style={{ margin: "16px 0", color: "#f87171" }}>
              คำเตือน: การลบบูธนี้จะลบตำแหน่งงานทั้งหมดที่สร้างไว้ในบูธนี้ด้วย
            </p>
            <div className="button-row" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <PixelButton type="button" tone="neutral" onClick={() => setDeleteBoothId(null)}>
                ยกเลิก
              </PixelButton>
              <PixelButton type="button" tone="danger" onClick={() => confirmDeleteBooth(deleteBoothId)}>
                <Trash2 aria-hidden="true" /> ลบบูธนี้
              </PixelButton>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit Job Modal */}
      {editingJob ? (
        <div className="auth-backdrop" role="presentation" onClick={() => setEditingJob(null)}>
          <div
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-label="แก้ไขตำแหน่งงาน"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560 }}
          >
            <div className="auth-header">
              <div className="auth-title">
                <Edit3 aria-hidden="true" />
                <h2>แก้ไขตำแหน่งงาน</h2>
              </div>
              <button
                type="button"
                className="auth-close"
                onClick={() => setEditingJob(null)}
                aria-label="ปิดกล่องแก้ไข"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <form className="form-grid" onSubmit={submitEditJob} style={{ marginTop: 16 }}>
              <Field label="ชื่อตำแหน่ง" name="title" defaultValue={editingJob.title} required />
              <div>
                <label className="pixel-label">สถานะตำแหน่งงาน</label>
                <select name="status" defaultValue={editingJob.status} className="pixel-input">
                  <option value="DRAFT">DRAFT (ฉบับร่าง)</option>
                  <option value="PUBLISHED">PUBLISHED (เปิดรับสมัคร)</option>
                  <option value="ARCHIVED">ARCHIVED (ปิดรับ/เก็บถาวร)</option>
                </select>
              </div>
              <SelectField label="รูปแบบการทำงาน" name="workMode" defaultValue={editingJob.workMode}>
                <option value="REMOTE">Remote</option><option value="HYBRID">Hybrid</option><option value="ONSITE">On-site</option>
              </SelectField>
              <SelectField label="ประเภทการจ้าง" name="employmentType" defaultValue={editingJob.employmentType}>
                <option value="FULL_TIME">Full-time</option><option value="PART_TIME">Part-time</option><option value="CONTRACT">Contract</option><option value="INTERNSHIP">Internship</option>
              </SelectField>
              <Field label="เงินเดือนขั้นต่ำ" name="salaryMin" type="number" min="0" defaultValue={editingJob.salaryMin ?? ""} />
              <Field label="เงินเดือนสูงสุด" name="salaryMax" type="number" min="0" defaultValue={editingJob.salaryMax ?? ""} />
              <TextAreaField className="full" label="สรุป JD" name="summary" defaultValue={editingJob.summary} required />
              <TextAreaField className="full" label="หน้าที่รับผิดชอบ" name="responsibilities" defaultValue={editingJob.responsibilities} required />
              <Field label="Must-have skills" name="mustHave" defaultValue={editingJob.mustHave.join(", ")} help="คั่นด้วย comma" required />
              <Field label="Nice-to-have skills" name="niceToHave" defaultValue={editingJob.niceToHave.join(", ")} help="คั่นด้วย comma" />
              <div className="button-row" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
                <PixelButton type="button" tone="neutral" onClick={() => setEditingJob(null)}>
                  ยกเลิก
                </PixelButton>
                <PixelButton type="submit" tone="violet">
                  <Check aria-hidden="true" /> บันทึกตำแหน่งงาน
                </PixelButton>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {/* Delete Job Confirmation */}
      {deleteJobId ? (
        <div className="auth-backdrop" role="presentation" onClick={() => setDeleteJobId(null)}>
          <div
            className="auth-modal"
            role="alertdialog"
            aria-modal="true"
            aria-label="ยืนยันการลบตำแหน่งงาน"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 440 }}
          >
            <div className="auth-header">
              <div className="auth-title">
                <Trash2 aria-hidden="true" />
                <h2>ยืนยันการลบตำแหน่งงาน</h2>
              </div>
              <button
                type="button"
                className="auth-close"
                onClick={() => setDeleteJobId(null)}
                aria-label="ปิดกล่องลบ"
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <p style={{ margin: "16px 0", color: "#f87171" }}>
              คุณต้องการลบตำแหน่งงานนี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="button-row" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
              <PixelButton type="button" tone="neutral" onClick={() => setDeleteJobId(null)}>
                ยกเลิก
              </PixelButton>
              <PixelButton type="button" tone="danger" onClick={() => confirmDeleteJob(deleteJobId)}>
                <Trash2 aria-hidden="true" /> ลบตำแหน่งงาน
              </PixelButton>
            </div>
          </div>
        </div>
      ) : null}

      <section style={{ marginTop: 36 }}>
        <div className="section-heading" data-reveal>
          <h2>บูธและตำแหน่งงานของบริษัท</h2>
          <p>จัดการข้อมูล เปลี่ยนสถานะ หรือแก้ไขรายละเอียดบูธและตำแหน่งงาน</p>
        </div>
        <div className="card-grid">
          {booths.map((booth) => {
            const fair = database.fairs.find((item) => item.id === booth.fairId);
            const jobs = database.jobs.filter((job) => job.boothId === booth.id);
            return (
              <PixelSurface className="fair-card" data-reveal key={booth.id}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <StatusPill tone={booth.status === "PUBLISHED" ? "cyan" : booth.status === "ARCHIVED" ? "neutral" : "mango"}>
                    {booth.status}
                  </StatusPill>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      type="button"
                      className="edit-button-sm"
                      onClick={() => setEditingBooth(booth)}
                      aria-label={`แก้ไข ${booth.name}`}
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
                      onClick={() => setDeleteBoothId(booth.id)}
                      aria-label={`ลบ ${booth.name}`}
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

                <h3>{booth.name}</h3>
                <p>{booth.summary}</p>
                <span>{fair?.title ?? "Unknown fair"}</span>
                <div className="tag-list">
                  {booth.technologyTags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
                </div>

                {/* Booth Status Toggle Action */}
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  {booth.status === "PUBLISHED" ? (
                    <PixelButton tone="neutral" onClick={() => actions.setBoothStatus(booth.id, "ARCHIVED")}>
                      <Archive aria-hidden="true" /> Archive บูธ
                    </PixelButton>
                  ) : (
                    <PixelButton tone="cyan" onClick={() => actions.setBoothStatus(booth.id, "PUBLISHED")}>
                      <Play aria-hidden="true" /> Publish บูธ
                    </PixelButton>
                  )}
                </div>

                <div style={{ marginTop: 16, borderTop: "1px dashed rgba(255,255,255,0.1)", paddingTop: 12 }}>
                  <strong style={{ fontSize: "0.9rem", color: "#ffd84d" }}>ตำแหน่งงานในบูธนี้ ({jobs.length})</strong>
                  {jobs.length === 0 ? (
                    <p style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: 4 }}>ยังไม่มีตำแหน่งงาน</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          style={{
                            background: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 6,
                            padding: "8px 10px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{job.title}</div>
                            <div style={{ fontSize: "0.78rem", opacity: 0.65 }}>
                              {job.workMode} · {job.employmentType} · <span style={{ color: job.status === "PUBLISHED" ? "#78dbe6" : "#ffd84d" }}>{job.status}</span>
                            </div>
                          </div>
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              type="button"
                              onClick={() => setEditingJob(job)}
                              aria-label={`แก้ไขตำแหน่ง ${job.title}`}
                              style={{
                                background: "none",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: 4,
                                color: "#f0f6fc",
                                cursor: "pointer",
                                padding: "3px 6px",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              <Edit3 size={13} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => actions.setJobStatus(job.id, job.status === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED")}
                              aria-label={`เปลี่ยนสถานะตำแหน่ง ${job.title}`}
                              title={job.status === "PUBLISHED" ? "Archive" : "Publish"}
                              style={{
                                background: "none",
                                border: "1px solid rgba(255,255,255,0.15)",
                                borderRadius: 4,
                                color: job.status === "PUBLISHED" ? "#fcd34d" : "#78dbe6",
                                cursor: "pointer",
                                padding: "3px 6px",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              {job.status === "PUBLISHED" ? <Archive size={13} aria-hidden="true" /> : <Play size={13} aria-hidden="true" />}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteJobId(job.id)}
                              aria-label={`ลบตำแหน่ง ${job.title}`}
                              style={{
                                background: "none",
                                border: "1px solid rgba(239,68,68,0.3)",
                                borderRadius: 4,
                                color: "#f87171",
                                cursor: "pointer",
                                padding: "3px 6px",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              <Trash2 size={13} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PixelSurface>
            );
          })}
        </div>
      </section>

      {/* ========================================================
          JOB APPLICATIONS PIPELINE SECTION
         ======================================================== */}
      <section style={{ marginTop: 40 }} aria-labelledby="applications-pipeline-title">
        <div className="section-heading" data-reveal>
          <div>
            <span className="eyebrow"><BriefcaseBusiness aria-hidden="true" /> Applications Pipeline</span>
            <h2 id="applications-pipeline-title">ใบสมัครงานที่ได้รับ ({(database.applications || []).filter((a) => companyJobs.some((j) => j.id === a.jobId)).length})</h2>
          </div>
          <p>ตรวจสอบผู้สมัครที่ยื่นโปรไฟล์แบบ Masked เข้ามาในตำแหน่งงานของบริษัท พร้อมจัดการขั้นตอนการคัดเลือกและขอเปิดเผยข้อมูลติดต่อ</p>
        </div>

        {(() => {
          const companyJobIds = new Set(companyJobs.map((j) => j.id));
          const receivedApps = (database.applications || []).filter((a) => companyJobIds.has(a.jobId));

          if (receivedApps.length === 0) {
            return (
              <PixelSurface data-reveal style={{ padding: "28px 32px", textAlign: "center" }}>
                <BriefcaseBusiness aria-hidden="true" style={{ width: 36, height: 36, color: "var(--muted)", margin: "0 auto 12px" }} />
                <h3>ยังไม่มีใบสมัครงานเข้ามา</h3>
                <p>เมื่อผู้สมัครกด "ยื่นใบสมัครแบบ Masked" ในบูธของคุณ ใบสมัครและคะแนน Match Score จะปรากฏที่นี่</p>
              </PixelSurface>
            );
          }

          return (
            <div className="jobs-stream-grid">
              {receivedApps.map((app) => {
                const job = companyJobs.find((j) => j.id === app.jobId);
                const candidateUser = database.users.find((u) => u.id === app.candidateUserId);
                const candidateProfile = database.candidateProfiles.find((p) => p.userId === app.candidateUserId);
                const isRevealed = app.status === "REVEALED" || app.revealConsentGiven;
                const candidateDisplayName = isRevealed && candidateUser ? candidateUser.displayName : `Candidate #${app.candidateUserId.slice(-6).toUpperCase()}`;

                return (
                  <PixelSurface className="job-interactive-card" data-reveal key={app.id}>
                    <div className="job-card-header">
                      <div>
                        <div className="job-badges-line">
                          <StatusPill tone={app.status === "REVEALED" || isRevealed ? "cyan" : app.status === "SHORTLISTED" ? "mango" : app.status === "INTERVIEW_SCHEDULED" ? "cyan" : "violet"}>
                            {app.status === "APPLIED" && "รอพิจารณา (APPLIED)"}
                            {app.status === "SHORTLISTED" && "⭐ SHORTLISTED"}
                            {app.status === "REVEAL_REQUESTED" && "⏳ รอ Candidate อนุญาตเปิดเผยข้อมูล"}
                            {(app.status === "REVEALED" || isRevealed) && "✓ เปิดเผยข้อมูลติดต่อแล้ว"}
                            {app.status === "INTERVIEW_SCHEDULED" && "📅 มีนัดสัมภาษณ์"}
                            {app.status === "REJECTED" && "ปฏิเสธแล้ว"}
                          </StatusPill>
                          <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                            ยื่นเมื่อ {new Date(app.appliedAt).toLocaleDateString("th-TH")}
                          </span>
                        </div>

                        <h3 className="job-card-title">{candidateDisplayName}</h3>
                        <strong className="job-company-label">
                          สมัครตำแหน่ง: <span style={{ color: "var(--cyan)" }}>{job?.title}</span>
                          {candidateProfile?.headline && ` • ${candidateProfile.headline}`}
                        </strong>
                      </div>

                      <div className="match-score-badge-box">
                        <strong className="match-number">{app.matchScore}%</strong>
                        <span className="match-label">Match Score</span>
                      </div>
                    </div>

                    {/* Contact Info if Revealed */}
                    {isRevealed && candidateUser && (
                      <div style={{
                        padding: "12px 16px",
                        background: "rgba(52, 211, 153, 0.08)",
                        border: "1px solid rgba(52, 211, 153, 0.3)",
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}>
                        <span style={{ color: "#34d399", fontWeight: 700, fontSize: "0.85rem" }}>
                          ✓ ข้อมูลติดต่อจริง:
                        </span>
                        <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>📧 {candidateUser.email}</span>
                        {candidateProfile?.region && (
                          <span style={{ fontSize: "0.85rem", color: "var(--text)" }}>📍 {candidateProfile.region}</span>
                        )}
                      </div>
                    )}

                    {/* Candidate Skills Preview */}
                    {candidateProfile?.manualSkills && candidateProfile.manualSkills.length > 0 && (
                      <div className="job-skills-section">
                        <strong className="skills-heading">ทักษะของผู้สมัคร:</strong>
                        <div className="tag-list">
                          {candidateProfile.manualSkills.map((s) => (
                            <span key={s} className="tag">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recruiter Action Buttons */}
                    <div className="job-card-action-footer">
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                        {!isRevealed && app.status !== "REVEAL_REQUESTED" && (
                          <PixelButton
                            type="button"
                            tone="cyan"
                            onClick={() => actions.updateApplicationStatus(app.id, "REVEAL_REQUESTED")}
                          >
                            <ShieldCheck aria-hidden="true" /> ส่งคำขอเปิดเผยข้อมูลติดต่อ
                          </PixelButton>
                        )}

                        {app.status !== "SHORTLISTED" && (
                          <PixelButton
                            type="button"
                            tone="mango"
                            onClick={() => actions.updateApplicationStatus(app.id, "SHORTLISTED")}
                          >
                            ⭐ คัดเลือกเข้า Shortlist
                          </PixelButton>
                        )}

                        {app.status !== "INTERVIEW_SCHEDULED" && (
                          <PixelButton
                            type="button"
                            tone="violet"
                            onClick={() => actions.updateApplicationStatus(app.id, "INTERVIEW_SCHEDULED", {
                              scheduledInterviewAt: new Date(Date.now() + 86400000 * 2).toISOString(),
                              interviewNote: "นัดสัมภาษณ์ออนไลน์ผ่าน Google Meet",
                            })}
                          >
                            <Clock aria-hidden="true" /> นัดสัมภาษณ์
                          </PixelButton>
                        )}

                        {app.status !== "REJECTED" && (
                          <PixelButton
                            type="button"
                            tone="neutral"
                            onClick={() => actions.updateApplicationStatus(app.id, "REJECTED")}
                          >
                            ปฏิเสธ
                          </PixelButton>
                        )}
                      </div>
                    </div>
                  </PixelSurface>
                );
              })}
            </div>
          );
        })()}
      </section>

      {/* ========================================================
          MASKED CANDIDATE BOARD SECTION
         ======================================================== */}
      <section style={{ marginTop: 40 }} aria-labelledby="candidate-board-title">
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
