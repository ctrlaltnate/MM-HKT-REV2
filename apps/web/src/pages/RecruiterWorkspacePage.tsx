import {
  AlertCircle,
  Archive,
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Edit3,
  Layers,
  Mail,
  Play,
  Plus,
  ShieldCheck,
  Store,
  Target,
  Trash2,
  Upload,
  UserCheck,
  UserMinus,
} from "lucide-react";
import { type FormEvent, useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import { Modal } from "../components/Modal";
import { SkillTagInput } from "../components/SkillTagInput";
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
import { useToast } from "../context/ToastContext";
import type { Booth, JobPosting } from "../domain/types";

export function RecruiterWorkspacePage() {
  const { user, database, actions } = useApp();
  const { toast } = useToast();

  // Modals state
  const [companyModalOpen, setCompanyModalOpen] = useState(false);
  const [boothModalOpen, setBoothModalOpen] = useState(false);
  const [editingBooth, setEditingBooth] = useState<Booth | null>(null);
  const [deleteBoothId, setDeleteBoothId] = useState<string | null>(null);
  const [assigningBooth, setAssigningBooth] = useState<Booth | null>(null);
  const [selectedBoothJobIds, setSelectedBoothJobIds] = useState<string[]>([]);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  // Tag inputs state
  const [boothTags, setBoothTags] = useState<string[]>([]);
  const [editingBoothTags, setEditingBoothTags] = useState<string[]>([]);
  const [boothJobSelection, setBoothJobSelection] = useState<string[]>([]);
  const [jobMustHave, setJobMustHave] = useState<string[]>([]);
  const [jobNiceToHave, setJobNiceToHave] = useState<string[]>([]);
  const [editingJobMustHave, setEditingJobMustHave] = useState<string[]>([]);
  const [editingJobNiceToHave, setEditingJobNiceToHave] = useState<string[]>([]);

  // Pipeline Filter state (Job Role Tab & Status Stage Filter)
  const [selectedPipelineJobId, setSelectedPipelineJobId] = useState<string>("ALL");
  const [selectedPipelineStatus, setSelectedPipelineStatus] = useState<string>("ALL");

  if (!user) return null;

  const company = database.companies.find((item) => item.ownerId === user.id);
  const booths = database.booths.filter((item) => item.ownerId === user.id);
  const fairs = database.fairs.filter(
    (fair) => fair.status === "PUBLISHED" || fair.status === "LIVE" || fair.status === "PAUSED",
  );
  const companyJobs = database.jobs.filter((job) => job.companyId === company?.id);

  // Recruiter Fair Memberships
  const recruiterMemberships = database.memberships.filter(
    (m) =>
      m.role === "RECRUITER" &&
      (m.userId === user.id || (m.invitedEmail && m.invitedEmail.toLowerCase() === user.email.toLowerCase())),
  );
  const invitedMemberships = recruiterMemberships.filter((m) => m.status === "INVITED");
  const activeMemberships = recruiterMemberships.filter((m) => m.status === "ACTIVE");
  const activeFairIds = new Set(activeMemberships.map((m) => m.fairId));
  const approvedFairs = fairs.filter((fair) => activeFairIds.has(fair.id));

  // Helper to get active jobs for a specific booth
  const getJobsForBooth = (booth: Booth) => {
    return companyJobs.filter((job) => booth.assignedJobIds?.includes(job.id) || job.boothId === booth.id);
  };

  // 4 Readiness Checklist Steps
  const setupSteps = [
    Boolean(company),
    companyJobs.length > 0,
    approvedFairs.length > 0,
    booths.length > 0,
  ];
  const completedSetupSteps = setupSteps.filter(Boolean).length;
  const setupProgress = Math.round((completedSetupSteps / setupSteps.length) * 100);

  // Applications Pipeline Data
  const companyJobIds = new Set(companyJobs.map((j) => j.id));
  const receivedApps = (database.applications || []).filter((a) => companyJobIds.has(a.jobId));

  // Helper to calculate job-specific funnel stats
  const getJobFunnelStats = (jobId: string) => {
    const apps = receivedApps.filter((a) => a.jobId === jobId);
    const applied = apps.filter((a) => a.status === "APPLIED").length;
    const shortlisted = apps.filter((a) => a.status === "SHORTLISTED").length;
    const interview = apps.filter((a) => a.status === "INTERVIEW_SCHEDULED").length;
    const revealed = apps.filter((a) => a.status === "REVEALED" || a.revealConsentGiven).length;
    const rejected = apps.filter((a) => a.status === "REJECTED").length;
    return {
      total: apps.length,
      applied,
      shortlisted,
      interview,
      revealed,
      rejected,
    };
  };

  // Filtered Applications in Pipeline
  const jobFilteredApps =
    selectedPipelineJobId === "ALL"
      ? receivedApps
      : receivedApps.filter((a) => a.jobId === selectedPipelineJobId);

  const statusFilteredApps =
    selectedPipelineStatus === "ALL"
      ? jobFilteredApps
      : selectedPipelineStatus === "REVEALED"
      ? jobFilteredApps.filter((a) => a.status === "REVEALED" || a.revealConsentGiven)
      : jobFilteredApps.filter((a) => a.status === selectedPipelineStatus);

  // Stats for currently selected Job Tab (or Overall)
  const currentPipelineStats = {
    total: jobFilteredApps.length,
    applied: jobFilteredApps.filter((a) => a.status === "APPLIED").length,
    shortlisted: jobFilteredApps.filter((a) => a.status === "SHORTLISTED").length,
    interview: jobFilteredApps.filter((a) => a.status === "INTERVIEW_SCHEDULED").length,
    revealed: jobFilteredApps.filter((a) => a.status === "REVEALED" || a.revealConsentGiven).length,
    rejected: jobFilteredApps.filter((a) => a.status === "REJECTED").length,
  };

  const selectedJobDetails = companyJobs.find((j) => j.id === selectedPipelineJobId);

  // Action Handlers
  const handleSaveCompany = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const industry = String(form.get("industry") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const website = String(form.get("website") || "").trim();
    const workLocations = String(form.get("workLocations") || "").trim();

    if (!name) {
      toast.error("กรุณาระบุชื่อบริษัท");
      return;
    }
    if (!industry) {
      toast.error("กรุณาระบุหมวดหมู่อุตสาหกรรม");
      return;
    }
    if (!workLocations) {
      toast.error("กรุณาระบุสถานที่ทำงาน");
      return;
    }
    if (!summary) {
      toast.error("กรุณาระบุข้อมูลแนะนำบริษัท");
      return;
    }

    try {
      actions.saveCompany(user.id, {
        name,
        industry,
        summary,
        website,
        workLocations,
      });
      setCompanyModalOpen(false);
      toast.success(company ? "แก้ไขข้อมูลบริษัทเรียบร้อยแล้ว" : "สร้างข้อมูลบริษัทเรียบร้อยแล้ว");
    } catch {
      toast.error("บันทึกข้อมูลบริษัทไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleCreateBooth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!company) {
      toast.error("กรุณาเพิ่มข้อมูลบริษัทก่อนสร้างบูธ");
      return;
    }
    const form = new FormData(event.currentTarget);
    const fairId = String(form.get("fairId") || "");
    const name = String(form.get("name") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const accessibilityNote = String(form.get("accessibilityNote") || "").trim();

    if (!fairId) {
      toast.error("กรุณาเลือก Job Fair ที่ต้องการเปิดบูธ");
      return;
    }
    if (!activeFairIds.has(fairId)) {
      toast.error("กรุณาเลือก Job Fair ที่ได้รับอนุญาตแล้ว");
      return;
    }
    if (!name) {
      toast.error("กรุณาระบุชื่อบูธ");
      return;
    }
    if (!summary) {
      toast.error("กรุณาระบุรายละเอียดของบูธ");
      return;
    }

    try {
      actions.createBooth(user.id, {
        fairId,
        companyId: company.id,
        name,
        summary,
        technologyTags: boothTags,
        accessibilityNote,
        status: "PUBLISHED",
        assignedJobIds: boothJobSelection,
      });
      setBoothTags([]);
      setBoothJobSelection([]);
      setBoothModalOpen(false);
      toast.success("สร้างบูธของบริษัทเรียบร้อยแล้ว");
    } catch {
      toast.error("สร้างบูธไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const openEditBooth = (booth: Booth) => {
    setEditingBoothTags(booth.technologyTags);
    setEditingBooth(booth);
  };

  const handleUpdateBooth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingBooth) return;
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const accessibilityNote = String(form.get("accessibilityNote") || "").trim();

    if (!name) {
      toast.error("กรุณาระบุชื่อบูธ");
      return;
    }
    if (!summary) {
      toast.error("กรุณาระบุรายละเอียดของบูธ");
      return;
    }

    try {
      actions.updateBooth(editingBooth.id, {
        name,
        summary,
        technologyTags: editingBoothTags,
        accessibilityNote,
        status: String(form.get("status")) as Booth["status"],
      });
      setEditingBooth(null);
      toast.success("แก้ไขข้อมูลบูธเรียบร้อยแล้ว");
    } catch {
      toast.error("แก้ไขข้อมูลบูธไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const openAssignJobsModal = (booth: Booth) => {
    setAssigningBooth(booth);
    const currentAssigned = booth.assignedJobIds ?? companyJobs.filter((j) => j.boothId === booth.id).map((j) => j.id);
    setSelectedBoothJobIds(currentAssigned);
  };

  const handleSaveAssignedJobs = () => {
    if (!assigningBooth) return;
    try {
      actions.setBoothAssignedJobs(assigningBooth.id, selectedBoothJobIds);
      setAssigningBooth(null);
      toast.success(`อัปเดตตำแหน่งงานในบูธเรียบร้อยแล้ว (${selectedBoothJobIds.length} ตำแหน่ง)`);
    } catch {
      toast.error("อัปเดตตำแหน่งงานในบูธไม่สำเร็จ");
    }
  };

  const handleToggleBoothStatus = (boothId: string, currentStatus: Booth["status"]) => {
    const nextStatus: Booth["status"] = currentStatus === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    actions.setBoothStatus(boothId, nextStatus);
    toast.success(nextStatus === "PUBLISHED" ? "เปิดแสดงบูธแล้ว" : "เก็บถาวรบูธแล้ว");
  };

  const confirmDeleteBooth = (boothId: string) => {
    actions.deleteBooth(boothId);
    setDeleteBoothId(null);
    toast.success("ลบบูธเรียบร้อยแล้ว");
  };

  const handleCreateJob = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!company) {
      toast.error("กรุณาเพิ่มข้อมูลบริษัทก่อน");
      return;
    }
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const responsibilities = String(form.get("responsibilities") || "").trim();
    const salaryMin = form.get("salaryMin") ? Number(form.get("salaryMin")) : null;
    const salaryMax = form.get("salaryMax") ? Number(form.get("salaryMax")) : null;

    if (!title) {
      toast.error("กรุณาระบุชื่อตำแหน่งงาน");
      return;
    }
    if (!summary) {
      toast.error("กรุณาระบุสรุป JD / ขอบเขตงาน");
      return;
    }
    if (!responsibilities) {
      toast.error("กรุณาระบุหน้าที่ความรับผิดชอบ");
      return;
    }
    if (jobMustHave.length === 0) {
      toast.error("กรุณาระบุทักษะจำเป็น (Must-have skills) อย่างน้อย 1 ทักษะ");
      return;
    }
    if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
      toast.error("เงินเดือนขั้นต่ำต้องไม่มากกว่าเงินเดือนสูงสุด");
      return;
    }

    const defaultBoothId = booths[0]?.id;
    const headcountVal = form.get("headcount") ? Math.max(1, Number(form.get("headcount"))) : 1;

    try {
      actions.createJob({
        companyId: company.id,
        boothId: defaultBoothId,
        title,
        summary,
        responsibilities,
        mustHave: jobMustHave,
        niceToHave: jobNiceToHave,
        headcount: headcountVal,
        salaryMin,
        salaryMax,
        workMode: String(form.get("workMode")) as JobPosting["workMode"],
        employmentType: String(form.get("employmentType")) as JobPosting["employmentType"],
        status: "PUBLISHED",
      });
      setJobMustHave([]);
      setJobNiceToHave([]);
      setJobModalOpen(false);
      toast.success("เพิ่มตำแหน่งงานสู่คลังบริษัทเรียบร้อยแล้ว");
    } catch {
      toast.error("เพิ่มตำแหน่งงานไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const openEditJob = (job: JobPosting) => {
    setEditingJobMustHave(job.mustHave);
    setEditingJobNiceToHave(job.niceToHave);
    setEditingJob(job);
  };

  const handleUpdateJob = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingJob) return;
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") || "").trim();
    const summary = String(form.get("summary") || "").trim();
    const responsibilities = String(form.get("responsibilities") || "").trim();
    const salaryMin = form.get("salaryMin") ? Number(form.get("salaryMin")) : null;
    const salaryMax = form.get("salaryMax") ? Number(form.get("salaryMax")) : null;

    if (!title) {
      toast.error("กรุณาระบุชื่อตำแหน่งงาน");
      return;
    }
    if (!summary) {
      toast.error("กรุณาระบุสรุป JD / ขอบเขตงาน");
      return;
    }
    if (!responsibilities) {
      toast.error("กรุณาระบุหน้าที่ความรับผิดชอบ");
      return;
    }
    if (editingJobMustHave.length === 0) {
      toast.error("กรุณาระบุทักษะจำเป็น (Must-have skills) อย่างน้อย 1 ทักษะ");
      return;
    }
    if (salaryMin !== null && salaryMax !== null && salaryMin > salaryMax) {
      toast.error("เงินเดือนขั้นต่ำต้องไม่มากกว่าเงินเดือนสูงสุด");
      return;
    }

    const headcountVal = form.get("headcount") ? Math.max(1, Number(form.get("headcount"))) : 1;

    try {
      actions.updateJob(editingJob.id, {
        title,
        summary,
        responsibilities,
        mustHave: editingJobMustHave,
        niceToHave: editingJobNiceToHave,
        headcount: headcountVal,
        salaryMin,
        salaryMax,
        workMode: String(form.get("workMode")) as JobPosting["workMode"],
        employmentType: String(form.get("employmentType")) as JobPosting["employmentType"],
        status: String(form.get("status")) as JobPosting["status"],
      });
      setEditingJob(null);
      toast.success("แก้ไขตำแหน่งงานเรียบร้อยแล้ว");
    } catch {
      toast.error("แก้ไขตำแหน่งงานไม่สำเร็จ กรุณาลองใหม่");
    }
  };

  const handleToggleJobStatus = (jobId: string, currentStatus: JobPosting["status"]) => {
    const nextStatus: JobPosting["status"] = currentStatus === "PUBLISHED" ? "ARCHIVED" : "PUBLISHED";
    actions.setJobStatus(jobId, nextStatus);
    toast.success(nextStatus === "PUBLISHED" ? "เปิดรับสมัครตำแหน่งงานแล้ว" : "ปิดรับสมัครตำแหน่งงานแล้ว");
  };

  const confirmDeleteJob = (jobId: string) => {
    actions.deleteJob(jobId);
    setDeleteJobId(null);
    toast.success("ลบตำแหน่งงานออกจากคลังเรียบร้อยแล้ว");
  };

  const handleRequestFairAccess = (fairId: string) => {
    actions.requestRecruiterFairAccess(user.id, fairId);
    toast.success("ส่งคำขอเข้าร่วมงาน Job Fair เรียบร้อยแล้ว");
  };

  const handleAcceptInvitation = (fairId: string) => {
    actions.acceptFairInvitation(user.id, fairId);
    toast.success("ตอบรับคำเชิญเข้าร่วมงาน Job Fair แล้ว");
  };

  const handleCancelMembership = (membershipId: string) => {
    actions.removeFairMembership(membershipId);
    toast.info("ยกเลิกรายการเรียบร้อยแล้ว");
  };

  const handleUpdateApplication = (
    appId: string,
    status: Parameters<typeof actions.updateApplicationStatus>[1],
    meta?: Parameters<typeof actions.updateApplicationStatus>[2],
  ) => {
    actions.updateApplicationStatus(appId, status, meta);
    if (status === "REVEAL_REQUESTED") {
      toast.success("ส่งคำขอเปิดเผยข้อมูลติดต่อถึงผู้สมัครแล้ว");
    } else if (status === "SHORTLISTED") {
      toast.success("เพิ่มผู้สมัครเข้าสู่ Shortlist แล้ว");
    } else if (status === "INTERVIEW_SCHEDULED") {
      toast.success("บันทึกนัดหมายการสัมภาษณ์แล้ว");
    } else if (status === "REJECTED") {
      toast.info("ปฏิเสธใบสมัครแล้ว");
    }
  };

  return (
    <AnimatedPage className="page-shell">
      {/* Page Header */}
      <header className="page-header recruiter-workspace-header" data-reveal>
        <div>
          <span className="eyebrow">Recruiter workspace · Local preparation</span>
          <h1>Recruiter Studio</h1>
          <p>จัดการคลังตำแหน่งงานของบริษัท กำหนด Headcount และคัดเลือกผู้สมัครแยกตามสายงานอย่างเป็นระบบ</p>
        </div>
      </header>

      {/* Task-first Hero: Single Primary Next Action & 4-Step Readiness */}
      <PixelSurface className="recruiter-overview" data-reveal>
        <div className="recruiter-next-action">
          <span className="eyebrow">สิ่งที่ควรทำต่อ</span>
          {!company ? (
            <>
              <h2>เพิ่มข้อมูลบริษัท</h2>
              <p>เริ่มจากข้อมูลพื้นฐานที่จะแสดงบนบูธและประกาศงานทั้งหมด</p>
              <PixelButton type="button" tone="cyan" onClick={() => setCompanyModalOpen(true)}>
                กรอกข้อมูลบริษัท <ArrowRight aria-hidden="true" />
              </PixelButton>
            </>
          ) : companyJobs.length === 0 ? (
            <>
              <h2>เพิ่มตำแหน่งงานแรกสู่คลังบริษัท</h2>
              <p>สร้างตำแหน่งงานกลางของบริษัท ระบุจำนวนที่เปิดรับ (Headcount) และทักษะ เพื่อใช้เปิดรับในงานแฟร์</p>
              <PixelButton type="button" tone="violet" onClick={() => setJobModalOpen(true)}>
                เพิ่มตำแหน่งงานแรก <ArrowRight aria-hidden="true" />
              </PixelButton>
            </>
          ) : approvedFairs.length === 0 ? (
            <>
              <h2>เลือกงาน Job Fair ที่ต้องการเข้าร่วม</h2>
              <p>ส่งคำขอเข้าร่วม หรือตอบรับคำเชิญจากผู้จัดงานเพื่อปลดล็อกการสร้างบูธ</p>
              <a className="recruiter-primary-link" href="#fair-access">
                ดูงานที่เปิดรับ <ArrowRight aria-hidden="true" />
              </a>
            </>
          ) : booths.length === 0 ? (
            <>
              <h2>สร้างบูธและเลือกตำแหน่งงานเข้างานแฟร์</h2>
              <p>คุณได้รับสิทธิ์เข้างานแล้ว สร้างบูธและเลือกตำแหน่งงานจากคลังบริษัทมาเปิดรับได้ทันที</p>
              <PixelButton type="button" tone="mango" onClick={() => setBoothModalOpen(true)}>
                สร้างบูธแรก <ArrowRight aria-hidden="true" />
              </PixelButton>
            </>
          ) : (
            <>
              <h2>Workspace พร้อมใช้งานแล้ว</h2>
              <p>ข้อมูลหลักครบแล้ว คุณสามารถจัดการตำแหน่งงานหรือตรวจสอบผู้สมัครแยกตามสายงานได้</p>
              <a className="recruiter-primary-link" href="#applications-pipeline-title">
                ดูใบสมัคร ({receivedApps.length}) <ArrowRight aria-hidden="true" />
              </a>
            </>
          )}
        </div>

        <div className="recruiter-readiness" aria-label={`ความพร้อม ${completedSetupSteps} จาก 4 ขั้นตอน`}>
          <div className="recruiter-readiness-heading">
            <div>
              <span className="eyebrow">ความพร้อม</span>
              <strong>{completedSetupSteps}/4 ขั้นตอน</strong>
            </div>
            <strong className="recruiter-readiness-percent">{setupProgress}%</strong>
          </div>
          <div className="recruiter-progress-track" aria-hidden="true">
            <span style={{ width: `${setupProgress}%` }} />
          </div>
          <ol className="recruiter-setup-steps">
            <li className={setupSteps[0] ? "is-complete" : "is-current"}>
              <span className="recruiter-step-number">
                {setupSteps[0] ? <Check aria-hidden="true" /> : "1"}
              </span>
              <div>
                <strong>ข้อมูลบริษัท</strong>
                <span>{setupSteps[0] ? "เรียบร้อย" : "ยังไม่ได้เพิ่ม"}</span>
              </div>
            </li>
            <li className={setupSteps[1] ? "is-complete" : setupSteps[0] ? "is-current" : "is-locked"}>
              <span className="recruiter-step-number">
                {setupSteps[1] ? <Check aria-hidden="true" /> : "2"}
              </span>
              <div>
                <strong>คลังตำแหน่งงานบริษัท</strong>
                <span>
                  {setupSteps[1] ? `${companyJobs.length} ตำแหน่งงานกลาง` : "ยังไม่มีตำแหน่งงาน"}
                </span>
              </div>
            </li>
            <li className={setupSteps[2] ? "is-complete" : setupSteps[1] ? "is-current" : "is-locked"}>
              <span className="recruiter-step-number">
                {setupSteps[2] ? <Check aria-hidden="true" /> : "3"}
              </span>
              <div>
                <strong>สิทธิ์เข้างานแฟร์</strong>
                <span>
                  {setupSteps[2] ? `อนุมัติแล้ว ${approvedFairs.length} งาน` : "รอดำเนินการ"}
                </span>
              </div>
            </li>
            <li className={setupSteps[3] ? "is-complete" : setupSteps[2] ? "is-current" : "is-locked"}>
              <span className="recruiter-step-number">
                {setupSteps[3] ? <Check aria-hidden="true" /> : "4"}
              </span>
              <div>
                <strong>บูธในงานแฟร์</strong>
                <span>{setupSteps[3] ? `สร้างแล้ว ${booths.length} บูธ` : "ยังไม่ได้สร้าง"}</span>
              </div>
            </li>
          </ol>
        </div>
      </PixelSurface>

      {/* Sticky Anchor Navigation */}
      <nav className="recruiter-section-nav" aria-label="เมนูจัดการ Recruiter Studio" data-reveal>
        <span>ไปยัง:</span>
        <a href="#company-profile">1. ข้อมูลบริษัท</a>
        <a href="#job-catalog">2. คลังตำแหน่งงาน ({companyJobs.length})</a>
        <a href="#fair-access">3. สิทธิ์เข้างาน ({approvedFairs.length})</a>
        <a href="#booth-management">4. บูธในงานแฟร์ ({booths.length})</a>
        <a href="#applications-pipeline-title">5. ใบสมัคร ({receivedApps.length})</a>
      </nav>

      {/* Fair Invitations Alert Banner */}
      {invitedMemberships.length > 0 ? (
        <PixelSurface
          data-reveal
          style={{
            marginBottom: 24,
            background: "rgba(255, 216, 77, 0.08)",
            borderColor: "var(--mango)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Mail style={{ color: "var(--mango)" }} aria-hidden="true" />
            <h2 style={{ fontSize: "1.15rem", margin: 0, color: "var(--mango)" }}>
              คุณได้รับคำเชิญเข้าร่วม Job Fair!
            </h2>
          </div>
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {invitedMemberships.map((inv) => {
              const fair = database.fairs.find((f) => f.id === inv.fairId);
              return (
                <div
                  key={inv.id}
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    borderRadius: 6,
                    padding: "12px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 12,
                    border: "1px solid rgba(255, 216, 77, 0.3)",
                  }}
                >
                  <div>
                    <strong>{fair?.title ?? "Job Fair"}</strong> · {fair?.locationLabel ?? "-"}
                    <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--muted)" }}>
                      {fair?.summary}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <PixelButton
                      type="button"
                      tone="mango"
                      onClick={() => handleAcceptInvitation(inv.fairId)}
                    >
                      <CheckCircle2 aria-hidden="true" /> ตอบรับคำเชิญ
                    </PixelButton>
                    <PixelButton
                      type="button"
                      tone="neutral"
                      onClick={() => handleCancelMembership(inv.id)}
                    >
                      ปฏิเสธ
                    </PixelButton>
                  </div>
                </div>
              );
            })}
          </div>
        </PixelSurface>
      ) : null}

      {/* ========================================================
          SECTION 1: COMPANY PROFILE (#company-profile)
         ======================================================== */}
      <section id="company-profile" className="recruiter-workspace-section" data-reveal>
        <PixelSurface>
          <div className="company-summary-heading">
            <div>
              <span className="eyebrow">ขั้นตอนที่ 1</span>
              <h2><Building2 aria-hidden="true" /> ข้อมูลบริษัท</h2>
            </div>
            <PixelButton
              type="button"
              tone={company ? "neutral" : "cyan"}
              onClick={() => setCompanyModalOpen(true)}
            >
              {company ? <Edit3 aria-hidden="true" /> : <Plus aria-hidden="true" />}
              {company ? "แก้ไขข้อมูลบริษัท" : "เพิ่มข้อมูลบริษัท"}
            </PixelButton>
          </div>

          {company ? (
            <div className="company-summary-grid">
              <div>
                <span>ชื่อบริษัท</span>
                <strong>{company.name}</strong>
              </div>
              <div>
                <span>อุตสาหกรรม</span>
                <strong>{company.industry}</strong>
              </div>
              <div>
                <span>เว็บไซต์</span>
                <strong>{company.website || "ยังไม่ได้ระบุ"}</strong>
              </div>
              <div>
                <span>สถานที่ทำงาน</span>
                <strong>{company.workLocations}</strong>
              </div>
              <div className="company-summary-wide">
                <span>แนะนำบริษัท</span>
                <p>{company.summary}</p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="ยังไม่มีข้อมูลบริษัท"
              body="เพิ่มข้อมูลบริษัทก่อนขอเปิดบูธและประกาศตำแหน่งงาน ข้อมูลนี้จะแสดงบนบูธและประกาศงานทั้งหมด"
            />
          )}
        </PixelSurface>
      </section>

      {/* ========================================================
          SECTION 2: COMPANY JOB CATALOG (#job-catalog)
         ======================================================== */}
      <section id="job-catalog" className="recruiter-workspace-section" data-reveal style={{ marginTop: 28 }}>
        <PixelSurface>
          <div className="company-summary-heading">
            <div>
              <span className="eyebrow">ขั้นตอนที่ 2 · Centralized Catalog</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Layers style={{ color: "var(--violet)" }} aria-hidden="true" />
                <h2 style={{ margin: 0 }}>คลังตำแหน่งงานของบริษัท ({companyJobs.length})</h2>
              </div>
              <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
                สร้างและจัดการตำแหน่งงานส่วนกลางของบริษัท พร้อมกำหนดจำนวนที่เปิดรับ (Headcount) และสามารถนำไปเลือกเปิดรับในบูธแต่ละงาน Job Fair ได้อย่างอิสระ
              </p>
            </div>
            {company ? (
              <PixelButton type="button" tone="violet" onClick={() => setJobModalOpen(true)}>
                <Plus aria-hidden="true" /> เพิ่มตำแหน่งงานสู่คลัง
              </PixelButton>
            ) : null}
          </div>

          {!company ? (
            <EmptyState
              title="กรุณาเพิ่มข้อมูลบริษัทก่อน"
              body="บันทึกข้อมูลบริษัทในขั้นตอนที่ 1 ก่อน จึงจะสามารถสร้างคลังตำแหน่งงานของบริษัทได้"
            />
          ) : companyJobs.length === 0 ? (
            <EmptyState
              title="ยังไม่มีตำแหน่งงานในคลังบริษัท"
              body="สร้างตำแหน่งงานกลางระบุ JD, Headcount, รูปแบบการทำงาน, เงินเดือน และทักษะที่ต้องการ เพื่อใช้เปิดรับในงานแฟร์ต่างๆ"
              action={
                <PixelButton type="button" tone="violet" onClick={() => setJobModalOpen(true)}>
                  <Plus aria-hidden="true" /> เพิ่มตำแหน่งงานแรก
                </PixelButton>
              }
            />
          ) : (
            <div className="recruiter-job-list" aria-label="รายการตำแหน่งงานในคลังบริษัท" style={{ display: "grid", gap: 12 }}>
              {companyJobs.map((job) => {
                const assignedBooths = booths.filter((b) => b.assignedJobIds?.includes(job.id) || job.boothId === b.id);
                const salaryText =
                  job.salaryMin && job.salaryMax
                    ? `฿${job.salaryMin.toLocaleString()} - ฿${job.salaryMax.toLocaleString()}`
                    : job.salaryMin
                    ? `เริ่มต้น ฿${job.salaryMin.toLocaleString()}`
                    : null;

                return (
                  <div
                    className="recruiter-job-list-item"
                    key={job.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "16px 20px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      gap: 16,
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Left: Structured Job Details */}
                    <div style={{ flex: 1, minWidth: 280, display: "grid", gap: 6 }}>
                      {/* Line 1: Title + Status + Headcount + Fair Booth Badge */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "1.08rem", color: "var(--text)" }}>{job.title}</strong>
                        <StatusPill tone={job.status === "PUBLISHED" ? "cyan" : job.status === "ARCHIVED" ? "neutral" : "mango"}>
                          {job.status}
                        </StatusPill>
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "var(--mango)",
                            background: "rgba(255, 216, 77, 0.08)",
                            border: "1px solid rgba(255, 216, 77, 0.25)",
                            padding: "2px 8px",
                            borderRadius: 4,
                            fontWeight: 700,
                          }}
                        >
                          <Target size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} />
                          เปิดรับ {job.headcount ?? 1} อัตรา
                        </span>
                        {assignedBooths.length > 0 ? (
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--success)",
                              background: "rgba(74, 222, 128, 0.1)",
                              border: "1px solid rgba(74, 222, 128, 0.25)",
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            ✓ เปิดรับใน {assignedBooths.length} บูธงานแฟร์
                          </span>
                        ) : (
                          <span
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--muted)",
                              background: "rgba(255, 255, 255, 0.04)",
                              padding: "2px 8px",
                              borderRadius: 4,
                            }}
                          >
                            ยังไม่ได้เลือกใส่ในบูธใด
                          </span>
                        )}
                      </div>

                      {/* Line 2: Meta Info (Work Mode, Salary, Summary) */}
                      <div
                        style={{
                          fontSize: "0.86rem",
                          color: "var(--muted)",
                          display: "flex",
                          gap: 8,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ color: "var(--text)", fontWeight: 600 }}>
                          {job.workMode} · {job.employmentType}
                        </span>
                        {salaryText && <span style={{ color: "var(--cyan)", fontWeight: 600 }}>· {salaryText}</span>}
                        {job.summary && <span style={{ color: "var(--muted)" }}>— {job.summary}</span>}
                      </div>

                      {/* Line 3: Skills Badges (Must-have & Nice-to-have) */}
                      {job.mustHave.length > 0 && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                          <span style={{ fontSize: "0.78rem", color: "var(--cyan)", fontWeight: 600 }}>ทักษะ:</span>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {job.mustHave.map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  fontSize: "0.75rem",
                                  background: "rgba(120, 219, 230, 0.08)",
                                  border: "1px solid rgba(120, 219, 230, 0.2)",
                                  padding: "1px 6px",
                                  borderRadius: 3,
                                  color: "var(--text)",
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                            {job.niceToHave?.map((skill) => (
                              <span
                                key={skill}
                                style={{
                                  fontSize: "0.75rem",
                                  background: "rgba(255, 255, 255, 0.04)",
                                  border: "1px solid rgba(255, 255, 255, 0.08)",
                                  padding: "1px 6px",
                                  borderRadius: 3,
                                  color: "var(--muted)",
                                }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions Row */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexShrink: 0 }}>
                      <PixelButton type="button" tone="neutral" onClick={() => openEditJob(job)}>
                        <Edit3 aria-hidden="true" /> แก้ไข
                      </PixelButton>
                      <PixelButton
                        type="button"
                        tone={job.status === "PUBLISHED" ? "neutral" : "cyan"}
                        onClick={() => handleToggleJobStatus(job.id, job.status)}
                      >
                        {job.status === "PUBLISHED" ? <Archive aria-hidden="true" /> : <Play aria-hidden="true" />}
                        {job.status === "PUBLISHED" ? "Archive" : "Publish"}
                      </PixelButton>
                      <PixelButton type="button" tone="danger" onClick={() => setDeleteJobId(job.id)}>
                        <Trash2 aria-hidden="true" /> ลบ
                      </PixelButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </PixelSurface>
      </section>

      {/* ========================================================
          SECTION 3: FAIR ACCESS & INVITATIONS (#fair-access)
         ======================================================== */}
      <section id="fair-access" className="recruiter-workspace-section" data-reveal style={{ marginTop: 28 }}>
        <PixelSurface>
          <div className="section-heading" style={{ marginBottom: 16 }}>
            <div>
              <span className="eyebrow">ขั้นตอนที่ 3</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck style={{ color: "var(--cyan)" }} aria-hidden="true" />
                <h2 style={{ margin: 0 }}>สิทธิ์การเข้าร่วมงาน Job Fair</h2>
              </div>
            </div>
            <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
              Recruiter ต้องได้รับอนุมัติจากผู้จัดงานหรือตอบรับคำเชิญก่อนจึงจะสามารถเปิดบูธในงานได้
            </p>
          </div>

          {fairs.length === 0 ? (
            <EmptyState
              title="ยังไม่มี Job Fair ที่เปิดรับ"
              body="ผู้จัดงานต้อง Publish งานแฟร์ก่อนจึงจะเปิดรับสมัครบูธได้"
            />
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
                          ? "rgba(120, 219, 230, 0.25)"
                          : isPending
                          ? "rgba(255, 216, 77, 0.25)"
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
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <strong style={{ fontSize: "1.05rem" }}>{fair.title}</strong>
                        <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>
                          {fair.status}
                        </StatusPill>
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
                        <span
                          style={{
                            color: "var(--cyan)",
                            fontSize: "0.9rem",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 6,
                            fontWeight: 600,
                          }}
                        >
                          <CheckCircle2 size={16} aria-hidden="true" /> พร้อมเปิดบูธ
                        </span>
                      ) : isPending ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span
                            style={{
                              color: "var(--mango)",
                              fontSize: "0.85rem",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 4,
                            }}
                          >
                            <Clock size={14} aria-hidden="true" /> ส่งคำขอแล้ว
                          </span>
                          <PixelButton
                            type="button"
                            tone="neutral"
                            onClick={() => handleCancelMembership(membership!.id)}
                          >
                            ยกเลิกคำขอ
                          </PixelButton>
                        </div>
                      ) : isInvited ? (
                        <PixelButton
                          type="button"
                          tone="mango"
                          onClick={() => handleAcceptInvitation(fair.id)}
                        >
                          <CheckCircle2 aria-hidden="true" /> ตอบรับคำเชิญ
                        </PixelButton>
                      ) : (
                        <PixelButton
                          type="button"
                          tone="cyan"
                          onClick={() => handleRequestFairAccess(fair.id)}
                        >
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
      </section>

      {/* ========================================================
          SECTION 4: BOOTHS IN FAIRS (#booth-management)
         ======================================================== */}
      <section id="booth-management" className="recruiter-workspace-section" data-reveal style={{ marginTop: 28 }}>
        <PixelSurface>
          <div className="section-heading" style={{ marginBottom: 16 }}>
            <div>
              <span className="eyebrow">ขั้นตอนที่ 4</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Store style={{ color: "var(--mango)" }} aria-hidden="true" />
                <h2 style={{ margin: 0 }}>บูธของบริษัทในงาน Job Fair ({booths.length})</h2>
              </div>
            </div>
            <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>
              เปิดบูธในงานที่ได้รับอนุมัติ และเลือกติ๊กตำแหน่งงานจากคลังบริษัทมาเปิดรับในบูธนี้ได้อิสระ
            </p>
          </div>

          {!company ? (
            <EmptyState
              title="ยังไม่มีข้อมูลบริษัท"
              body="กรุณาบันทึกข้อมูลบริษัทในขั้นตอนที่ 1 ด้านบนก่อน จึงจะสามารถสร้างบูธได้"
            />
          ) : approvedFairs.length === 0 ? (
            <div
              style={{
                padding: "16px 20px",
                background: "rgba(255, 216, 77, 0.05)",
                border: "1px solid rgba(255, 216, 77, 0.25)",
                borderRadius: 8,
              }}
            >
              <p style={{ margin: 0, color: "var(--mango)", fontSize: "0.92rem", lineHeight: 1.5 }}>
                <Clock size={16} style={{ verticalAlign: "middle", marginRight: 6 }} aria-hidden="true" />
                คุณยังไม่มี Job Fair ที่ได้รับอนุญาตเปิดบูธ กรุณายื่นขอเข้าร่วมงานหรือตอบรับคำเชิญในส่วน{" "}
                <a href="#fair-access" style={{ color: "var(--cyan)", textDecoration: "underline" }}>
                  "สิทธิ์การเข้าร่วมงาน Job Fair"
                </a>{" "}
                ด้านบน
              </p>
            </div>
          ) : booths.length === 0 ? (
            <EmptyState
              title="ยังไม่มีบูธของบริษัท"
              body="คุณได้รับสิทธิ์เข้างานแล้ว พร้อมสร้างบูธและเลือกตำแหน่งงานจากคลังบริษัทมาเปิดรับในงาน Job Fair"
              action={
                <PixelButton type="button" tone="mango" onClick={() => setBoothModalOpen(true)}>
                  <Plus aria-hidden="true" /> สร้างบูธ
                </PixelButton>
              }
            />
          ) : (
            <div style={{ display: "grid", gap: 16 }}>
              {booths.map((booth) => {
                const fair = database.fairs.find((item) => item.id === booth.fairId);
                const assignedJobs = getJobsForBooth(booth);

                return (
                  <div
                    key={booth.id}
                    style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid var(--line)",
                      borderRadius: 8,
                      padding: 20,
                      display: "grid",
                      gap: 14,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <StatusPill tone={booth.status === "PUBLISHED" ? "cyan" : booth.status === "ARCHIVED" ? "neutral" : "mango"}>
                            {booth.status}
                          </StatusPill>
                          <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{booth.name}</h3>
                          <span style={{ fontSize: "0.85rem", color: "var(--muted)" }}>
                            ผูกกับงาน: <strong style={{ color: "var(--text)" }}>{fair?.title ?? "Unknown fair"}</strong>
                          </span>
                        </div>
                        <p style={{ margin: "4px 0 0", color: "var(--muted)", fontSize: "0.9rem" }}>{booth.summary}</p>
                      </div>

                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                        <PixelButton type="button" tone="violet" onClick={() => openAssignJobsModal(booth)}>
                          <BriefcaseBusiness aria-hidden="true" /> จัดการตำแหน่งงานในบูธ ({assignedJobs.length})
                        </PixelButton>
                        <PixelButton type="button" tone="neutral" onClick={() => openEditBooth(booth)}>
                          <Edit3 aria-hidden="true" /> แก้ไขข้อมูลบูธ
                        </PixelButton>
                        <PixelButton
                          type="button"
                          tone={booth.status === "PUBLISHED" ? "neutral" : "cyan"}
                          onClick={() => handleToggleBoothStatus(booth.id, booth.status)}
                        >
                          {booth.status === "PUBLISHED" ? <Archive aria-hidden="true" /> : <Play aria-hidden="true" />}
                          {booth.status === "PUBLISHED" ? "Archive บูธ" : "Publish บูธ"}
                        </PixelButton>
                        <PixelButton type="button" tone="danger" onClick={() => setDeleteBoothId(booth.id)}>
                          <Trash2 aria-hidden="true" /> ลบบูธ
                        </PixelButton>
                      </div>
                    </div>

                    {/* Assigned Jobs Summary in this Booth */}
                    <div style={{ background: "rgba(0, 0, 0, 0.2)", borderRadius: 6, padding: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <strong style={{ fontSize: "0.88rem", color: "var(--cyan)" }}>
                          ตำแหน่งงานที่เปิดรับในบูธนี้ ({assignedJobs.length}):
                        </strong>
                        <button
                          type="button"
                          onClick={() => openAssignJobsModal(booth)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--mango)",
                            fontSize: "0.82rem",
                            cursor: "pointer",
                            textDecoration: "underline",
                            padding: 0,
                          }}
                        >
                          + เลือก/ปรับตำแหน่งงาน
                        </button>
                      </div>
                      {assignedJobs.length === 0 ? (
                        <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
                          ยังไม่ได้เลือกตำแหน่งงานจากคลังบริษัทมาเปิดรับในบูธนี้ (กดปุ่ม "จัดการตำแหน่งงานในบูธ" เพื่อเลือก)
                        </p>
                      ) : (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {assignedJobs.map((job) => (
                            <span
                              key={job.id}
                              style={{
                                background: "rgba(120, 219, 230, 0.1)",
                                border: "1px solid rgba(120, 219, 230, 0.3)",
                                color: "var(--text)",
                                padding: "3px 8px",
                                borderRadius: 4,
                                fontSize: "0.82rem",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 6,
                              }}
                            >
                              <BriefcaseBusiness size={12} style={{ color: "var(--cyan)" }} />
                              {job.title}
                              <span style={{ color: "var(--mango)", fontSize: "0.75rem" }}>
                                (รับ {job.headcount ?? 1})
                              </span>
                              <StatusPill tone={job.status === "PUBLISHED" ? "cyan" : "neutral"}>
                                {job.status}
                              </StatusPill>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {booth.technologyTags && booth.technologyTags.length > 0 ? (
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>Tech tags:</span>
                        <div className="tag-list" style={{ margin: 0 }}>
                          {booth.technologyTags.map((tag) => (
                            <span className="tag" key={tag}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    ) : null}

                    {booth.accessibilityNote ? (
                      <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--muted)" }}>
                        ♿ <strong>Accessibility:</strong> {booth.accessibilityNote}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </PixelSurface>
      </section>

      {/* ========================================================
          SECTION 5: APPLICATIONS PIPELINE (#applications-pipeline-title)
          Clean & Minimal Unified ATS Pipeline
         ======================================================== */}
      <section
        style={{ marginTop: 44, borderTop: "2px solid var(--line)", paddingTop: 32 }}
        aria-labelledby="applications-pipeline-title"
      >
        <div className="section-heading" data-reveal style={{ marginBottom: 20 }}>
          <div>
            <span className="eyebrow" style={{ color: "var(--cyan)" }}>
              <BriefcaseBusiness aria-hidden="true" /> Daily Operations · Candidate Pipeline
            </span>
            <h2 id="applications-pipeline-title" style={{ margin: "4px 0" }}>
              ใบสมัครงานที่ได้รับ ({receivedApps.length})
            </h2>
          </div>
          <p style={{ margin: 0 }}>
            ตรวจสอบผู้สมัครที่ยื่นโปรไฟล์แบบ Masked เข้ามาในตำแหน่งงานของบริษัท พร้อมจัดการขั้นตอนการคัดเลือกและขอเปิดเผยข้อมูลติดต่อ
          </p>
        </div>

        {/* 1. Job Role Tabs (เมื่อมีมากกว่า 1 ตำแหน่ง) */}
        {companyJobs.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 10,
              marginBottom: 14,
            }}
            role="tablist"
            aria-label="เลือกดูผู้สมัครแยกตามตำแหน่งงาน"
          >
            <button
              type="button"
              role="tab"
              aria-selected={selectedPipelineJobId === "ALL"}
              onClick={() => setSelectedPipelineJobId("ALL")}
              style={{
                padding: "8px 14px",
                borderRadius: 4,
                border: `1px solid ${selectedPipelineJobId === "ALL" ? "var(--cyan)" : "rgba(255,255,255,0.08)"}`,
                background: selectedPipelineJobId === "ALL" ? "rgba(120, 219, 230, 0.12)" : "rgba(255,255,255,0.02)",
                color: selectedPipelineJobId === "ALL" ? "var(--cyan)" : "var(--muted)",
                fontWeight: selectedPipelineJobId === "ALL" ? 700 : 500,
                fontSize: "0.85rem",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease",
              }}
            >
              <Layers size={14} /> ทุกตำแหน่งงาน ({receivedApps.length})
            </button>

            {companyJobs.map((job) => {
              const stats = getJobFunnelStats(job.id);
              const isSelected = selectedPipelineJobId === job.id;
              return (
                <button
                  key={job.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => setSelectedPipelineJobId(job.id)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 4,
                    border: `1px solid ${isSelected ? "var(--cyan)" : "rgba(255,255,255,0.08)"}`,
                    background: isSelected ? "rgba(120, 219, 230, 0.12)" : "rgba(255,255,255,0.02)",
                    color: isSelected ? "var(--cyan)" : "var(--text)",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    whiteSpace: "nowrap",
                    transition: "all 0.15s ease",
                  }}
                >
                  <BriefcaseBusiness size={14} style={{ color: isSelected ? "var(--cyan)" : "var(--muted)" }} />
                  {job.title}
                  <span
                    style={{
                      background: isSelected ? "var(--cyan)" : "rgba(255,255,255,0.1)",
                      color: isSelected ? "#07101a" : "var(--text)",
                      padding: "1px 6px",
                      borderRadius: 10,
                      fontSize: "0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {stats.total}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Selected Job Headcount Info Banner (แสดงเมื่อเลือกเจาะจงตำแหน่ง) */}
        {selectedJobDetails && (
          <div
            style={{
              padding: "8px 14px",
              background: "rgba(120, 219, 230, 0.05)",
              border: "1px solid rgba(120, 219, 230, 0.2)",
              borderRadius: 6,
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 8,
              fontSize: "0.85rem",
            }}
          >
            <div>
              <strong>{selectedJobDetails.title}</strong> ·{" "}
              <span style={{ color: "var(--mango)", fontWeight: 700 }}>
                🎯 เปิดรับ {selectedJobDetails.headcount ?? 1} อัตรา
              </span>
            </div>
            <div style={{ color: "var(--muted)" }}>
              {selectedJobDetails.workMode} · {selectedJobDetails.employmentType}
            </div>
          </div>
        )}

        {/* 3. Unified Interactive Stage Tabs (รวมสถิติ + ปุ่มกรองเป็นอันเดียว ไม่ซ้ำซ้อน) */}
        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 20,
          }}
          role="tablist"
          aria-label="ตัวกรองสถานะผู้สมัคร"
        >
          {[
            { id: "ALL", label: "ทั้งหมด", count: currentPipelineStats.total, tone: "cyan" },
            { id: "APPLIED", label: "⏳ รอพิจารณา", count: currentPipelineStats.applied, tone: "mango" },
            { id: "SHORTLISTED", label: "⭐ เข้ารอบ", count: currentPipelineStats.shortlisted, tone: "mango" },
            { id: "INTERVIEW_SCHEDULED", label: "📅 นัดสัมภาษณ์", count: currentPipelineStats.interview, tone: "violet" },
            { id: "REVEALED", label: "✓ เปิดเผยข้อมูล", count: currentPipelineStats.revealed, tone: "cyan" },
            { id: "REJECTED", label: "❌ ตกรอบ/ปฏิเสธ", count: currentPipelineStats.rejected, tone: "danger" },
          ].map((stage) => {
            const isSelected = selectedPipelineStatus === stage.id;
            return (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedPipelineStatus(stage.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 20,
                  border: `1px solid ${
                    isSelected
                      ? "var(--cyan)"
                      : "rgba(255,255,255,0.08)"
                  }`,
                  background: isSelected ? "var(--cyan)" : "rgba(255,255,255,0.03)",
                  color: isSelected ? "#07101a" : "var(--text)",
                  fontSize: "0.82rem",
                  fontWeight: isSelected ? 700 : 500,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  whiteSpace: "nowrap",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{stage.label}</span>
                <span
                  style={{
                    background: isSelected ? "#07101a" : "rgba(255,255,255,0.1)",
                    color: isSelected ? "#fff" : "var(--text)",
                    padding: "1px 6px",
                    borderRadius: 10,
                    fontSize: "0.72rem",
                    fontWeight: 700,
                  }}
                >
                  {stage.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* 4. Applications Stream Grid (Filtered) */}
        {statusFilteredApps.length === 0 ? (
          <PixelSurface data-reveal style={{ padding: "32px 24px", textAlign: "center" }}>
            <BriefcaseBusiness
              aria-hidden="true"
              style={{ width: 40, height: 40, color: "var(--muted)", margin: "0 auto 12px" }}
            />
            <h3>ไม่พบใบสมัครในเงื่อนไขที่เลือก</h3>
            <p style={{ color: "var(--muted)", maxWidth: 500, margin: "0 auto" }}>
              {selectedPipelineStatus !== "ALL"
                ? `ไม่มีผู้สมัครที่มีสถานะ "${selectedPipelineStatus}" ในตำแหน่งที่เลือก ลองเลือกตัวกรองสถานะอื่น`
                : "ยังไม่มีผู้สมัครยื่นเข้ามาในตำแหน่งงานนี้"}
            </p>
          </PixelSurface>
        ) : (
          <div className="jobs-stream-grid">
            {statusFilteredApps.map((app) => {
              const job = companyJobs.find((j) => j.id === app.jobId);
              const candidateUser = database.users.find((u) => u.id === app.candidateUserId);
              const candidateProfile = database.candidateProfiles.find((p) => p.userId === app.candidateUserId);
              const isRevealed = app.status === "REVEALED" || app.revealConsentGiven;
              const candidateDisplayName =
                isRevealed && candidateUser
                  ? candidateUser.displayName
                  : `Candidate #${app.candidateUserId.slice(-6).toUpperCase()}`;

              return (
                <PixelSurface className="job-interactive-card" data-reveal key={app.id}>
                  <div className="job-card-header">
                    <div>
                      <div className="job-badges-line">
                        <StatusPill
                          tone={
                            app.status === "REVEALED" || isRevealed
                              ? "cyan"
                              : app.status === "SHORTLISTED"
                              ? "mango"
                              : app.status === "INTERVIEW_SCHEDULED"
                              ? "cyan"
                              : app.status === "REJECTED"
                              ? "danger"
                              : "violet"
                          }
                        >
                          {app.status === "APPLIED" && "รอพิจารณา (APPLIED)"}
                          {app.status === "SHORTLISTED" && "⭐ SHORTLISTED"}
                          {app.status === "REVEAL_REQUESTED" && "⏳ รอ Candidate อนุญาตเปิดเผยข้อมูล"}
                          {(app.status === "REVEALED" || isRevealed) && "✓ เปิดเผยข้อมูลติดต่อแล้ว"}
                          {app.status === "INTERVIEW_SCHEDULED" && "📅 มีนัดสัมภาษณ์"}
                          {app.status === "REJECTED" && "ปฏิเสธ/ตกรอบ"}
                        </StatusPill>
                        <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                          ยื่นเมื่อ {new Date(app.appliedAt).toLocaleDateString("th-TH")}
                        </span>
                      </div>

                      <h3 className="job-card-title">{candidateDisplayName}</h3>
                      <strong className="job-company-label">
                        สมัครตำแหน่ง: <span style={{ color: "var(--cyan)" }}>{job?.title ?? "Unknown Job"}</span>
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
                    <div
                      style={{
                        padding: "12px 16px",
                        background: "rgba(52, 211, 153, 0.08)",
                        border: "1px solid rgba(52, 211, 153, 0.3)",
                        borderRadius: 6,
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                        alignItems: "center",
                      }}
                    >
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
                          onClick={() => handleUpdateApplication(app.id, "REVEAL_REQUESTED")}
                        >
                          <ShieldCheck aria-hidden="true" /> ส่งคำขอเปิดเผยข้อมูลติดต่อ
                        </PixelButton>
                      )}

                      {app.status !== "SHORTLISTED" && (
                        <PixelButton
                          type="button"
                          tone="mango"
                          onClick={() => handleUpdateApplication(app.id, "SHORTLISTED")}
                        >
                          <UserCheck aria-hidden="true" /> คัดเลือกเข้า Shortlist
                        </PixelButton>
                      )}

                      {app.status !== "INTERVIEW_SCHEDULED" && (
                        <PixelButton
                          type="button"
                          tone="violet"
                          onClick={() =>
                            handleUpdateApplication(app.id, "INTERVIEW_SCHEDULED", {
                              scheduledInterviewAt: new Date(Date.now() + 86400000 * 2).toISOString(),
                              interviewNote: "นัดสัมภาษณ์ออนไลน์ผ่านระบบ MaskedMatch",
                            })
                          }
                        >
                          <Clock aria-hidden="true" /> นัดสัมภาษณ์
                        </PixelButton>
                      )}

                      {app.status !== "REJECTED" && (
                        <PixelButton
                          type="button"
                          tone="danger"
                          onClick={() => handleUpdateApplication(app.id, "REJECTED")}
                        >
                          <UserMinus aria-hidden="true" /> ปฏิเสธ/ให้ตกรอบ
                        </PixelButton>
                      )}
                    </div>
                  </div>
                </PixelSurface>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================
          MODALS & DIALOGS (Accessible & Screen-reader compliant)
         ======================================================== */}

      {/* 1. Company Modal (Create / Edit) */}
      <Modal
        open={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
        title={company ? "แก้ไขข้อมูลบริษัท" : "เพิ่มข้อมูลบริษัท"}
        subtitle="ข้อมูลนี้จะแสดงในบูธและตำแหน่งงานของบริษัท"
        maxWidth="780px"
      >
        <form className="form-grid" onSubmit={handleSaveCompany}>
          <Field label="ชื่อบริษัท" name="name" defaultValue={company?.name} required data-autofocus />
          <Field label="อุตสาหกรรม" name="industry" defaultValue={company?.industry} required />
          <Field label="เว็บไซต์" name="website" type="url" defaultValue={company?.website} placeholder="https://" />
          <Field label="สถานที่ทำงาน" name="workLocations" defaultValue={company?.workLocations} required />
          <TextAreaField className="full" label="แนะนำบริษัท" name="summary" defaultValue={company?.summary} required />
          <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <PixelButton type="button" tone="neutral" onClick={() => setCompanyModalOpen(false)}>
              ยกเลิก
            </PixelButton>
            <PixelButton type="submit" tone="cyan">
              <Upload aria-hidden="true" /> บันทึกบริษัท
            </PixelButton>
          </div>
        </form>
      </Modal>

      {/* 2. Booth Modal (Create) */}
      <Modal
        open={boothModalOpen}
        onClose={() => {
          setBoothModalOpen(false);
          setBoothTags([]);
          setBoothJobSelection([]);
        }}
        title="สร้างบูธของบริษัท"
        subtitle="กำหนดรายละเอียดบูธและเลือกตำแหน่งงานจากคลังที่จะเปิดรับในงาน Job Fair นี้"
        maxWidth="720px"
      >
        <form className="form-grid" onSubmit={handleCreateBooth}>
          <SelectField className="full" label="Job Fair ที่ได้รับอนุญาต" name="fairId" required data-autofocus>
            <option value="">-- เลือก Job Fair --</option>
            {approvedFairs.map((fair) => (
              <option value={fair.id} key={fair.id}>
                {fair.title} · {fair.status}
              </option>
            ))}
          </SelectField>
          <Field label="ชื่อบูธ" name="name" defaultValue={company ? `บูธ ${company.name}` : ""} required />
          <div className="full">
            <SkillTagInput
              id="booth-technology-tags"
              label="Technology Tags"
              hint="พิมพ์แล้วกด Enter หรือ comma เพื่อเพิ่ม และกดปุ่มกากบาทเพื่อลบ"
              skills={boothTags}
              onChange={setBoothTags}
              emptyText="ยังไม่มี Technology tag — พิมพ์แล้วกด Enter หรือ comma เพื่อเพิ่ม"
            />
          </div>

          {/* Job Selection Checkbox Group from Company Catalog */}
          {companyJobs.length > 0 ? (
            <div className="full" style={{ background: "rgba(0,0,0,0.2)", padding: 14, borderRadius: 6, border: "1px solid var(--line)" }}>
              <label className="pixel-label" style={{ marginBottom: 8, display: "block" }}>
                เลือกตำแหน่งงานจากคลังบริษัทที่จะเปิดรับในบูธนี้ ({boothJobSelection.length}/{companyJobs.length}):
              </label>
              <div style={{ display: "grid", gap: 8, maxHeight: 180, overflowY: "auto" }}>
                {companyJobs.map((job) => {
                  const isChecked = boothJobSelection.includes(job.id);
                  return (
                    <label
                      key={job.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 10px",
                        background: isChecked ? "rgba(120, 219, 230, 0.08)" : "transparent",
                        border: `1px solid ${isChecked ? "var(--cyan)" : "rgba(255,255,255,0.08)"}`,
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBoothJobSelection([...boothJobSelection, job.id]);
                          } else {
                            setBoothJobSelection(boothJobSelection.filter((id) => id !== job.id));
                          }
                        }}
                      />
                      <div>
                        <strong style={{ fontSize: "0.9rem" }}>{job.title}</strong>
                        <span style={{ fontSize: "0.78rem", color: "var(--mango)", marginLeft: 6 }}>
                          (รับ {job.headcount ?? 1} อัตรา)
                        </span>
                        <span style={{ fontSize: "0.78rem", color: "var(--muted)", marginLeft: 6 }}>
                          · {job.workMode} · {job.employmentType}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="full" style={{ padding: 10, background: "rgba(255,216,77,0.05)", border: "1px solid rgba(255,216,77,0.2)", borderRadius: 4 }}>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "var(--mango)" }}>
                💡 คุณยังไม่มีตำแหน่งงานในคลังบริษัท สามารถสร้างบูธก่อนแล้วเพิ่มตำแหน่งงานเข้าบูธภายหลังได้
              </p>
            </div>
          )}

          <TextAreaField className="full" label="รายละเอียดบูธ" name="summary" required />
          <TextAreaField
            className="full"
            label="ข้อมูล Accessibility"
            name="accessibilityNote"
            placeholder="ช่องทางติดต่อ วิธีสัมภาษณ์ทดแทน หรือพื้นที่รองรับ"
          />
          <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <PixelButton
              type="button"
              tone="neutral"
              onClick={() => {
                setBoothModalOpen(false);
                setBoothTags([]);
                setBoothJobSelection([]);
              }}
            >
              ยกเลิก
            </PixelButton>
            <PixelButton type="submit" tone="mango">
              <Store aria-hidden="true" /> Publish Booth
            </PixelButton>
          </div>
        </form>
      </Modal>

      {/* 3. Booth Modal (Edit) */}
      <Modal
        open={Boolean(editingBooth)}
        onClose={() => setEditingBooth(null)}
        title="แก้ไขข้อมูลบูธ"
        subtitle={editingBooth ? `บูธ: ${editingBooth.name}` : undefined}
        maxWidth="720px"
      >
        {editingBooth ? (
          <form className="form-grid" onSubmit={handleUpdateBooth}>
            <Field label="ชื่อบูธ" name="name" defaultValue={editingBooth.name} required data-autofocus />
            <div>
              <label className="pixel-label">สถานะบูธ</label>
              <select name="status" defaultValue={editingBooth.status} className="pixel-input">
                <option value="DRAFT">DRAFT (ฉบับร่าง)</option>
                <option value="PUBLISHED">PUBLISHED (เปิดแสดง)</option>
                <option value="ARCHIVED">ARCHIVED (เก็บถาวร)</option>
              </select>
            </div>
            <div className="full">
              <SkillTagInput
                id="edit-booth-technology-tags"
                label="Technology tags"
                skills={editingBoothTags}
                onChange={setEditingBoothTags}
                emptyText="ยังไม่มี Technology tag"
              />
            </div>
            <TextAreaField className="full" label="รายละเอียดบูธ" name="summary" defaultValue={editingBooth.summary} required />
            <TextAreaField
              className="full"
              label="ข้อมูล Accessibility"
              name="accessibilityNote"
              defaultValue={editingBooth.accessibilityNote}
            />
            <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <PixelButton type="button" tone="neutral" onClick={() => setEditingBooth(null)}>
                ยกเลิก
              </PixelButton>
              <PixelButton type="submit" tone="mango">
                <Check aria-hidden="true" /> บันทึกการแก้ไข
              </PixelButton>
            </div>
          </form>
        ) : null}
      </Modal>

      {/* 4. Assign Jobs to Booth Modal */}
      <Modal
        open={Boolean(assigningBooth)}
        onClose={() => setAssigningBooth(null)}
        title="จัดการตำแหน่งงานในบูธ"
        subtitle={assigningBooth ? `บูธ: ${assigningBooth.name} · เลือกตำแหน่งงานจากคลังบริษัทที่จะเปิดรับในงานนี้` : undefined}
        maxWidth="680px"
      >
        {assigningBooth ? (
          <div style={{ display: "grid", gap: 16 }}>
            {companyJobs.length === 0 ? (
              <p style={{ color: "var(--muted)", margin: 0 }}>
                ยังไม่มีตำแหน่งงานในคลังบริษัท กรุณาเพิ่มตำแหน่งงานในส่วน "คลังตำแหน่งงานของบริษัท" ก่อน
              </p>
            ) : (
              <div style={{ display: "grid", gap: 8, maxHeight: 320, overflowY: "auto" }}>
                {companyJobs.map((job) => {
                  const isChecked = selectedBoothJobIds.includes(job.id);
                  return (
                    <label
                      key={job.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: 12,
                        background: isChecked ? "rgba(120, 219, 230, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: `1px solid ${isChecked ? "var(--cyan)" : "rgba(255, 255, 255, 0.08)"}`,
                        borderRadius: 6,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBoothJobIds([...selectedBoothJobIds, job.id]);
                          } else {
                            setSelectedBoothJobIds(selectedBoothJobIds.filter((id) => id !== job.id));
                          }
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <strong>{job.title}</strong>
                          <span style={{ color: "var(--mango)", fontSize: "0.8rem", fontWeight: 600 }}>
                            (รับ {job.headcount ?? 1} อัตรา)
                          </span>
                          <StatusPill tone={job.status === "PUBLISHED" ? "cyan" : "neutral"}>
                            {job.status}
                          </StatusPill>
                        </div>
                        <span style={{ fontSize: "0.8rem", color: "var(--muted)" }}>
                          {job.workMode} · {job.employmentType}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}

            <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end", borderTop: "1px solid var(--line)", paddingTop: 14 }}>
              <PixelButton type="button" tone="neutral" onClick={() => setAssigningBooth(null)}>
                ยกเลิก
              </PixelButton>
              <PixelButton type="button" tone="violet" onClick={handleSaveAssignedJobs}>
                <Check aria-hidden="true" /> บันทึกตำแหน่งงานในบูธ ({selectedBoothJobIds.length})
              </PixelButton>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* 5. Delete Booth Confirmation Modal */}
      <Modal
        open={Boolean(deleteBoothId)}
        onClose={() => setDeleteBoothId(null)}
        title="ยืนยันการลบบูธ"
        subtitle="การลบบูธจะลบบูธออกจากงานแฟร์นี้ (ตำแหน่งงานในคลังบริษัทจะไม่ถูกลบ)"
        maxWidth="500px"
      >
        <div style={{ padding: "8px 0 16px" }}>
          <p style={{ color: "var(--danger)", margin: "0 0 20px" }}>
            <AlertCircle size={16} style={{ verticalAlign: "middle", marginRight: 6 }} aria-hidden="true" />
            คุณแน่ใจหรือไม่ที่จะลบบูธนี้? การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
          <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <PixelButton type="button" tone="neutral" onClick={() => setDeleteBoothId(null)}>
              ยกเลิก
            </PixelButton>
            <PixelButton
              type="button"
              tone="danger"
              onClick={() => deleteBoothId && confirmDeleteBooth(deleteBoothId)}
            >
              <Trash2 aria-hidden="true" /> ยืนยันลบบูธ
            </PixelButton>
          </div>
        </div>
      </Modal>

      {/* 6. Job Modal (Create) */}
      <Modal
        open={jobModalOpen}
        onClose={() => {
          setJobModalOpen(false);
          setJobMustHave([]);
          setJobNiceToHave([]);
        }}
        title="เพิ่มตำแหน่งงานสู่คลังบริษัท"
        subtitle="ตำแหน่งงานนี้จะอยู่ในคลังกลางของบริษัท และสามารถนำไปเลือกเปิดรับในบูธ Job Fair ใดก็ได้"
        maxWidth="820px"
      >
        <form className="form-grid" onSubmit={handleCreateJob}>
          <Field label="ชื่อตำแหน่งงาน" name="title" placeholder="เช่น Senior Frontend Engineer" required data-autofocus />
          <Field label="จำนวนอัตราที่เปิดรับ (คน)" name="headcount" type="number" min="1" defaultValue="1" required />
          <SelectField label="รูปแบบการทำงาน" name="workMode" defaultValue="HYBRID">
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </SelectField>
          <SelectField label="ประเภทการจ้าง" name="employmentType" defaultValue="FULL_TIME">
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </SelectField>
          <Field label="เงินเดือนขั้นต่ำ (บาท)" name="salaryMin" type="number" min="0" placeholder="เช่น 45000" />
          <Field label="เงินเดือนสูงสุด (บาท)" name="salaryMax" type="number" min="0" placeholder="เช่น 80000" />
          <TextAreaField className="full" label="สรุป JD / ขอบเขตงาน" name="summary" required />
          <TextAreaField className="full" label="หน้าที่ความรับผิดชอบ" name="responsibilities" required />
          <div className="full">
            <SkillTagInput
              id="job-must-have"
              label="Must-have Skills (จำเป็น)"
              hint="พิมพ์แล้วกด Enter หรือ comma เพื่อเพิ่ม และกดปุ่มกากบาทเพื่อลบ"
              skills={jobMustHave}
              onChange={setJobMustHave}
              emptyText="ยังไม่มี Must-have skill — กรุณาเพิ่มอย่างน้อย 1 ทักษะเพื่อใช้คำนวณ Match Score"
            />
          </div>
          <div className="full">
            <SkillTagInput
              id="job-nice-to-have"
              label="Nice-to-have Skills (ถ้ามีจะพิจารณาเป็นพิเศษ)"
              hint="พิมพ์แล้วกด Enter หรือ comma เพื่อเพิ่ม และกดปุ่มกากบาทเพื่อลบ"
              skills={jobNiceToHave}
              onChange={setJobNiceToHave}
              emptyText="ยังไม่มี Nice-to-have skill (ทางเลือก)"
            />
          </div>
          <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <PixelButton
              type="button"
              tone="neutral"
              onClick={() => {
                setJobModalOpen(false);
                setJobMustHave([]);
                setJobNiceToHave([]);
              }}
            >
              ยกเลิก
            </PixelButton>
            <PixelButton type="submit" tone="violet" disabled={jobMustHave.length === 0}>
              <Plus aria-hidden="true" /> บันทึกสู่คลังตำแหน่งงาน
            </PixelButton>
          </div>
        </form>
      </Modal>

      {/* 7. Job Modal (Edit) */}
      <Modal
        open={Boolean(editingJob)}
        onClose={() => setEditingJob(null)}
        title="แก้ไขตำแหน่งงาน"
        subtitle={editingJob ? `${editingJob.title} · แก้ไขรายละเอียด JD, Headcount และทักษะในคลังบริษัท` : undefined}
        maxWidth="820px"
      >
        {editingJob ? (
          <form className="form-grid" onSubmit={handleUpdateJob}>
            <Field label="ชื่อตำแหน่ง" name="title" defaultValue={editingJob.title} required data-autofocus />
            <Field label="จำนวนอัตราที่เปิดรับ (คน)" name="headcount" type="number" min="1" defaultValue={editingJob.headcount ?? 1} required />
            <div>
              <label className="pixel-label">สถานะตำแหน่งงาน</label>
              <select name="status" defaultValue={editingJob.status} className="pixel-input">
                <option value="DRAFT">DRAFT (ฉบับร่าง)</option>
                <option value="PUBLISHED">PUBLISHED (เปิดรับสมัคร)</option>
                <option value="ARCHIVED">ARCHIVED (ปิดรับ/เก็บถาวร)</option>
              </select>
            </div>
            <SelectField label="รูปแบบการทำงาน" name="workMode" defaultValue={editingJob.workMode}>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </SelectField>
            <SelectField label="ประเภทการจ้าง" name="employmentType" defaultValue={editingJob.employmentType}>
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </SelectField>
            <Field label="เงินเดือนขั้นต่ำ" name="salaryMin" type="number" min="0" defaultValue={editingJob.salaryMin ?? ""} />
            <Field label="เงินเดือนสูงสุด" name="salaryMax" type="number" min="0" defaultValue={editingJob.salaryMax ?? ""} />
            <TextAreaField className="full" label="สรุป JD" name="summary" defaultValue={editingJob.summary} required />
            <TextAreaField className="full" label="หน้าที่รับผิดชอบ" name="responsibilities" defaultValue={editingJob.responsibilities} required />
            <div className="full">
              <SkillTagInput
                id="edit-job-must-have"
                label="Must-have Skills (จำเป็น)"
                skills={editingJobMustHave}
                onChange={setEditingJobMustHave}
                emptyText="ยังไม่มี Must-have skill"
              />
            </div>
            <div className="full">
              <SkillTagInput
                id="edit-job-nice-to-have"
                label="Nice-to-have Skills"
                skills={editingJobNiceToHave}
                onChange={setEditingJobNiceToHave}
                emptyText="ยังไม่มี Nice-to-have skill"
              />
            </div>
            <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <PixelButton type="button" tone="neutral" onClick={() => setEditingJob(null)}>
                ยกเลิก
              </PixelButton>
              <PixelButton type="submit" tone="violet" disabled={editingJobMustHave.length === 0}>
                <Check aria-hidden="true" /> บันทึกตำแหน่งงาน
              </PixelButton>
            </div>
          </form>
        ) : null}
      </Modal>

      {/* 8. Delete Job Confirmation Modal */}
      <Modal
        open={Boolean(deleteJobId)}
        onClose={() => setDeleteJobId(null)}
        title="ยืนยันการลบตำแหน่งงาน"
        subtitle="การกระทำนี้จะลบตำแหน่งงานออกจากคลังบริษัทและนำออกจากบูธทุกงานแฟร์"
        maxWidth="500px"
      >
        <div style={{ padding: "8px 0 16px" }}>
          <p style={{ color: "var(--danger)", margin: "0 0 20px" }}>
            <AlertCircle size={16} style={{ verticalAlign: "middle", marginRight: 6 }} aria-hidden="true" />
            คุณแน่ใจหรือไม่ที่จะลบตำแหน่งงานนี้ออกจากคลังบริษัท? การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
          <div className="button-row" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <PixelButton type="button" tone="neutral" onClick={() => setDeleteJobId(null)}>
              ยกเลิก
            </PixelButton>
            <PixelButton
              type="button"
              tone="danger"
              onClick={() => deleteJobId && confirmDeleteJob(deleteJobId)}
            >
              <Trash2 aria-hidden="true" /> ยืนยันลบตำแหน่งงาน
            </PixelButton>
          </div>
        </div>
      </Modal>
    </AnimatedPage>
  );
}
