import {
  AlertTriangle,
  BrainCircuit,
  Briefcase,
  Calendar,
  CheckCircle,
  Eye,
  FileCheck,
  FileText,
  Lightbulb,
  Lock,
  MapPin,
  Monitor,
  PenLine,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  UploadCloud,
  UserCheck,
} from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import { ExperienceCrudManager } from "../components/ExperienceCrudManager";
import { InfoTooltip } from "../components/InfoTooltip";
import { OccupationsSelector } from "../components/OccupationsSelector";
import {
  PixelButton,
  PixelSurface,
  SelectField,
  StatusPill,
  TextAreaField,
} from "../components/PixelUI";
import { ProvinceSelector } from "../components/ProvinceSelector";
import { ResumeAnalysisModal } from "../components/ResumeAnalysisModal";
import { SkillTagInput } from "../components/SkillTagInput";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import type { CandidateExperience, CandidateProfile, ResumeAnalysis } from "../domain/types";
import { getApiHealth } from "../services/resume-api";

const emptyProfile: Omit<CandidateProfile, "userId" | "updatedAt"> = {
  headline: "",
  region: "กรุงเทพมหานคร",
  preferredWorkMode: "FLEXIBLE",
  about: "",
  manualSkills: [],
  targetRoles: [],
  experiences: [],
  shareWithJoinedFairs: false,
};

export function CandidateProfilePage() {
  const { user, database, actions } = useApp();
  const { toast } = useToast();

  if (!user) return null;

  const savedProfile = database.candidateProfiles.find((item) => item.userId === user.id);
  const hasExistingProfile = !!(savedProfile && (savedProfile.targetRoles?.length || savedProfile.about || savedProfile.experiences?.length || savedProfile.manualSkills?.length));
  const [draft, setDraft] = useState<Omit<CandidateProfile, "userId" | "updatedAt">>(
    savedProfile ?? emptyProfile,
  );
  const [targetRoles, setTargetRoles] = useState<string[]>(
    draft.targetRoles ??
    (savedProfile?.headline
      ? savedProfile.headline.split(",").map((s) => s.trim()).filter(Boolean)
      : []),
  );
  const [region, setRegion] = useState<string>(draft.region || "กรุงเทพมหานคร");
  const [about, setAbout] = useState<string>(draft.about || "");
  const [manualSkills, setManualSkills] = useState<string[]>(draft.manualSkills ?? []);
  const [experiences, setExperiences] = useState<CandidateExperience[]>(draft.experiences ?? []);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewingExistingAnalysis, setViewingExistingAnalysis] = useState(false);
  const [consent, setConsent] = useState(false);
  const [isEditing, setIsEditing] = useState(!hasExistingProfile);
  const [apiHealth, setApiHealth] = useState<{ configured: boolean; model: string; online: boolean }>({
    configured: false,
    model: "",
    online: false,
  });

  useEffect(() => {
    getApiHealth()
      .then((health) =>
        setApiHealth({ configured: health.geminiConfigured, model: health.model, online: true }),
      )
      .catch(() => setApiHealth({ configured: false, model: "", online: false }));
  }, []);

  const saveProfileData = (nextData = draft) => {
    actions.saveCandidateProfile(user.id, nextData);
    toast.success("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว");
  };

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const primaryHeadline = targetRoles.length > 0 ? targetRoles.join(", ") : region;
    const next: Omit<CandidateProfile, "userId" | "updatedAt"> = {
      ...draft,
      headline: primaryHeadline,
      targetRoles,
      region: region.trim(),
      preferredWorkMode: String(form.get("preferredWorkMode")) as CandidateProfile["preferredWorkMode"],
      about: about.trim(),
      manualSkills,
      experiences,
      shareWithJoinedFairs: form.get("shareWithJoinedFairs") === "on",
    };
    setDraft(next);
    saveProfileData(next);
    setIsEditing(false);
  };

  const selectResume = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("รองรับเฉพาะไฟล์ PDF เท่านั้น");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("ไฟล์ PDF ต้องมีขนาดไม่เกิน 10 MB");
      return;
    }

    setSelectedFile(file);
    toast.info(`เลือกไฟล์ ${file.name} พร้อมส่งวิเคราะห์`);
  };

  const openNewAnalysisModal = () => {
    if (!selectedFile) {
      toast.error("กรุณาเลือกไฟล์ PDF Resume ก่อนส่งวิเคราะห์");
      return;
    }
    if (!consent) {
      toast.error("กรุณากดยินยอมให้ส่ง PDF ไปประมวลผลด้วย AI ก่อน");
      return;
    }
    setViewingExistingAnalysis(false);
    setModalOpen(true);
  };

  const openExistingAnalysisModal = () => {
    setViewingExistingAnalysis(true);
    setModalOpen(true);
  };

  const handleImportAnalysis = (analysis: ResumeAnalysis) => {
    // 1. Merge Skills
    const extractedSkillNames = analysis.skills.map((s) => s.name);
    const mergedSkills = Array.from(new Set([...manualSkills, ...extractedSkillNames]));

    // 2. Map Experiences
    const extractedExp: CandidateExperience[] = (analysis.experience || []).map((exp, idx) => ({
      id: `exp-auto-${Date.now()}-${idx}`,
      role: exp.role,
      companyName: exp.industry || undefined,
      durationSummary: exp.durationSummary || "ตาม Resume",
      achievements: exp.achievements || [],
    }));
    const mergedExp = [...experiences, ...extractedExp];

    // 3. Map Suggested Roles
    const suggestedRoleTitles = (analysis.suggestedRoles || []).map((r) => r.title);
    const mergedRoles = Array.from(new Set([...targetRoles, ...suggestedRoleTitles]));

    // 4. Update About if empty
    const nextAbout = about ? about : analysis.candidateSummary;

    const next: Omit<CandidateProfile, "userId" | "updatedAt"> = {
      ...draft,
      about: nextAbout,
      manualSkills: mergedSkills,
      experiences: mergedExp,
      targetRoles: mergedRoles,
      headline: mergedRoles.length > 0 ? mergedRoles.join(", ") : draft.headline,
      resume: {
        fileName: selectedFile?.name ?? draft.resume?.fileName ?? "resume.pdf",
        size: selectedFile?.size ?? draft.resume?.size ?? 102400,
        uploadedAt: new Date().toISOString(),
        extractedText: analysis.candidateSummary,
        analysis,
        analyzedAt: new Date().toISOString(),
      },
    };

    setDraft(next);
    setAbout(nextAbout);
    setManualSkills(mergedSkills);
    setExperiences(mergedExp);
    setTargetRoles(mergedRoles);
    actions.saveCandidateProfile(user.id, next);
    setModalOpen(false);
    toast.success(`นำเข้า ${analysis.skills.length} ทักษะและ ${extractedExp.length} ประวัติการทำงานสู่โปรไฟล์แล้ว!`);
  };

  const removeResume = () => {
    const next = {
      ...draft,
      resume: undefined,
    };
    setDraft(next);
    setSelectedFile(null);
    actions.saveCandidateProfile(user.id, next);
    toast.info("ลบข้อมูล Resume เดิมเรียบร้อยแล้ว สามารถอัปโหลดไฟล์ใหม่ได้ทันที");
  };

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow"><UserCheck aria-hidden="true" /> Candidate Profile & Skills Studio</span>
        <h1>ประวัติและโปรไฟล์ทักษะ</h1>
        <p>ระบุสายงานเป้าหมาย จัดการประวัติการทำงาน และเชื่อมต่อผลวิเคราะห์ Resume ด้วย AI</p>
      </div>

      <div className="candidate-profile-layout">
        {/* ========================================================
            LEFT COLUMN: Main Profile Form (Step 1, Step 2, Step 3)
           ======================================================== */}
        <div className="profile-main-column">
          <PixelSurface data-reveal className="profile-form-surface">
            {isEditing ? (
              /* ===== EDIT MODE ===== */
              <>
                <div className="surface-heading-group">
                  <div>
                    <span className="eyebrow"><PenLine aria-hidden="true" /> กำลังแก้ไขโปรไฟล์</span>
                    <h2>แก้ไขข้อมูลการทำงาน</h2>
                  </div>
                  <InfoTooltip text="ข้อมูลเหล่านี้จะถูกใช้ในการจับคู่กับตำแหน่งงานและงานแฟร์" />
                </div>

                <form className="candidate-profile-form" onSubmit={submitProfile}>
                  {/* 1. Target Occupations Multi-Selector */}
                  <div className="form-section-block">
                    <OccupationsSelector
                      selectedRoles={targetRoles}
                      onChange={setTargetRoles}
                      label="ตำแหน่งหรือสายงานเป้าหมาย"
                      hint="เลือกหรือพิมพ์สายงานเพื่อใช้จับคู่กับงานแฟร์และตำแหน่งงาน"
                    />
                  </div>

                  {/* 2. 2-Column Row for Region and Work Mode */}
                  <div className="form-row-2col">
                    <div className="field-with-hint">
                      <ProvinceSelector
                        value={region}
                        onChange={setRegion}
                        label="จังหวัดที่สะดวกทำงาน"
                        hint="เลือกจังหวัด หรือ Remote ทำงานจากที่ไหนก็ได้"
                      />
                    </div>

                    <div className="field-with-hint">
                      <SelectField
                        label="รูปแบบการทำงาน"
                        name="preferredWorkMode"
                        defaultValue={draft.preferredWorkMode}
                      >
                        <option value="FLEXIBLE">ยืดหยุ่น (Flexible)</option>
                        <option value="REMOTE">ทำงานจากที่บ้าน (Remote)</option>
                        <option value="HYBRID">เข้าออฟฟิศบางวัน (Hybrid)</option>
                        <option value="ONSITE">เข้าออฟฟิศ (Onsite)</option>
                      </SelectField>
                    </div>
                  </div>

                  {/* 3. About Me */}
                  <div className="form-section-block">
                    <div className="field-label-group">
                      <label className="field-label" htmlFor="candidate-about-textarea">
                        เกี่ยวกับฉัน (About Me)
                      </label>
                      <InfoTooltip text="สรุปจุดเด่นและเป้าหมายการทำงานของคุณสั้น ๆ" />
                    </div>
                    <textarea
                      id="candidate-about-textarea"
                      name="about"
                      className="pixel-textarea"
                      rows={3}
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="สรุปจุดเด่นและประสบการณ์ของคุณสั้น ๆ..."
                    />
                  </div>

                  {/* 4. Work Experience CRUD Manager */}
                  <div className="form-section-block">
                    <ExperienceCrudManager
                      experiences={experiences}
                      onChange={setExperiences}
                      label="ประวัติและประสบการณ์ทำงาน"
                      hint="เพิ่มประวัติการทำงานของคุณเป็นข้อๆ หรือกดนำเข้าจาก Resume"
                    />
                  </div>

                  {/* 5. Interactive Skill Tag Input */}
                  <div className="form-section-block">
                    <SkillTagInput
                      skills={manualSkills}
                      onChange={setManualSkills}
                      label="ทักษะของคุณ (Skills)"
                      hint="ทักษะที่คุณกรอกจะใช้คำนวณ Match Score กับตำแหน่งงาน"
                    />
                  </div>

                  {/* 6. Privacy Consent Checkbox */}
                  <div className="form-section-block privacy-checkbox-box">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="shareWithJoinedFairs"
                        defaultChecked={draft.shareWithJoinedFairs}
                      />
                      <span>
                        <strong>อนุญาตแชร์โปรไฟล์แบบ Masked กับบริษัทในงานแฟร์</strong>
                        <small>Recruiter เห็นเฉพาะสรุปทักษะและหลักฐาน โดยไม่เห็นข้อมูลส่วนตัวของคุณ</small>
                      </span>
                    </label>
                  </div>

                  {/* 7. Submit Button */}
                  <div className="form-submit-row">
                    <PixelButton type="submit" tone="mango">
                      <Save aria-hidden="true" /> บันทึกข้อมูลโปรไฟล์
                    </PixelButton>
                    {hasExistingProfile && (
                      <PixelButton type="button" tone="neutral" onClick={() => setIsEditing(false)}>
                        ยกเลิกการแก้ไข
                      </PixelButton>
                    )}
                  </div>
                </form>
              </>
            ) : (
              /* ===== VIEW MODE (Read-Only Profile Summary) ===== */
              <>
                <div className="surface-heading-group">
                  <div>
                    <span className="eyebrow"><CheckCircle aria-hidden="true" /> โปรไฟล์ที่บันทึกแล้ว</span>
                    <h2>ข้อมูลโปรไฟล์ของคุณ</h2>
                  </div>
                  <PixelButton type="button" tone="cyan" onClick={() => setIsEditing(true)}>
                    <PenLine aria-hidden="true" /> แก้ไขโปรไฟล์
                  </PixelButton>
                </div>

                <div className="profile-view-content">
                  {/* Target Roles */}
                  <div className="profile-view-section">
                    <h3 className="view-section-label"><Briefcase className="view-icon" aria-hidden="true" /> ตำแหน่งหรือสายงานเป้าหมาย</h3>
                    {targetRoles.length > 0 ? (
                      <div className="view-tags-list">
                        {targetRoles.map((r) => (
                          <span key={r} className="view-tag-chip">{r}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="view-empty-text">ยังไม่ได้ระบุ</p>
                    )}
                  </div>

                  {/* Region & Work Mode */}
                  <div className="profile-view-row-2col">
                    <div className="profile-view-section">
                      <h3 className="view-section-label"><MapPin className="view-icon" aria-hidden="true" /> จังหวัดที่สะดวกทำงาน</h3>
                      <p className="view-text-value">{region || "ไม่ระบุ"}</p>
                    </div>
                    <div className="profile-view-section">
                      <h3 className="view-section-label"><Monitor className="view-icon" aria-hidden="true" /> รูปแบบการทำงาน</h3>
                      <p className="view-text-value">
                        {draft.preferredWorkMode === "FLEXIBLE" && "ยืดหยุ่น (Flexible)"}
                        {draft.preferredWorkMode === "REMOTE" && "ทำงานจากที่บ้าน (Remote)"}
                        {draft.preferredWorkMode === "HYBRID" && "เข้าออฟฟิศบางวัน (Hybrid)"}
                        {draft.preferredWorkMode === "ONSITE" && "เข้าออฟฟิศ (Onsite)"}
                      </p>
                    </div>
                  </div>

                  {/* About Me */}
                  <div className="profile-view-section">
                    <h3 className="view-section-label"><FileText className="view-icon" aria-hidden="true" /> เกี่ยวกับฉัน</h3>
                    {about ? (
                      <p className="view-about-text">{about}</p>
                    ) : (
                      <p className="view-empty-text">ยังไม่ได้เขียนเกี่ยวกับตัวเอง</p>
                    )}
                  </div>

                  {/* Experience Cards (Read-Only) */}
                  <div className="profile-view-section">
                    <h3 className="view-section-label"><Briefcase className="view-icon" aria-hidden="true" /> ประวัติการทำงาน ({experiences.length} รายการ)</h3>
                    {experiences.length > 0 ? (
                      <div className="view-experience-list">
                        {experiences.map((item) => (
                          <div key={item.id} className="view-exp-card">
                            <div className="view-exp-header">
                              <h4>{item.role}</h4>
                              <div className="view-exp-meta">
                                {item.companyName && <span className="view-exp-company">{item.companyName}</span>}
                                <span className="view-exp-duration"><Calendar className="cal-icon" aria-hidden="true" /> {item.durationSummary}</span>
                              </div>
                            </div>
                            {item.achievements && item.achievements.length > 0 && (
                              <ul className="view-exp-bullets">
                                {item.achievements.map((ach, idx) => (
                                  <li key={idx}>{ach}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="view-empty-text">ยังไม่มีประวัติการทำงาน</p>
                    )}
                  </div>

                  {/* Skills */}
                  <div className="profile-view-section">
                    <h3 className="view-section-label"><Lightbulb className="view-icon" aria-hidden="true" /> ทักษะ ({manualSkills.length})</h3>
                    {manualSkills.length > 0 ? (
                      <div className="view-tags-list">
                        {manualSkills.map((s) => (
                          <span key={s} className="view-skill-chip">{s}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="view-empty-text">ยังไม่ได้ระบุทักษะ</p>
                    )}
                  </div>

                  {/* Privacy Status */}
                  <div className="profile-view-section view-privacy-row">
                    <ShieldCheck className="view-icon privacy-icon" aria-hidden="true" />
                    <span>{draft.shareWithJoinedFairs ? "อนุญาตแชร์โปรไฟล์แบบ Masked กับบริษัท" : "ยังไม่ได้เปิดการแชร์โปรไฟล์"}</span>
                  </div>
                </div>
              </>
            )}
          </PixelSurface>
        </div>

        {/* ========================================================
            RIGHT SIDEBAR: AI Resume Studio & Analysis Card
           ======================================================== */}
        <aside className="profile-sidebar-column">
          <PixelSurface data-reveal className="resume-studio-sidebar-card">
            <div className="sidebar-studio-header">
              <span className="eyebrow"><Sparkles aria-hidden="true" /> AI Resume Studio</span>
              <h2>นำเข้า Resume PDF</h2>
              <p>สกัดทักษะและประวัติการทำงานด้วย AI เพื่อกรอกลงโปรไฟล์ให้อัตโนมัติ</p>
            </div>

            {/* AI Health Status Indicator */}
            <div className="gemini-status-indicator">
              <span className={`status-dot ${apiHealth.configured ? "online" : "offline"}`} />
              <div className="gemini-status-info">
                <strong>{apiHealth.configured ? "ระบบ AI พร้อมใช้งาน" : "ระบบ AI ออฟไลน์"}</strong>
                <span>{apiHealth.configured ? "AI Verification Engine" : "Offline"}</span>
              </div>
            </div>

            {/* CASE A: Candidate ALREADY has an analyzed Resume */}
            {draft.resume ? (
              <div className="existing-resume-card">
                <div className="existing-resume-head">
                  <FileCheck className="file-check-icon" aria-hidden="true" />
                  <div>
                    <strong>{draft.resume.fileName}</strong>
                    <span>
                      อัปโหลดเมื่อ {new Date(draft.resume.uploadedAt).toLocaleDateString("th-TH")} • {(draft.resume.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                </div>

                <div className="existing-analysis-summary-box">
                  <StatusPill tone="cyan">
                    สกัดได้ {draft.resume.analysis?.skills.length ?? 0} ทักษะแล้ว
                  </StatusPill>
                  <p>
                    ระบบวิเคราะห์และนำเข้าข้อมูลเข้าสู่โปรไฟล์แล้ว คุณสามารถกดดูผลการวิเคราะห์เต็มได้ตลอดเวลา
                  </p>
                </div>

                <div className="sidebar-actions-stacked">
                  <PixelButton
                    type="button"
                    tone="cyan"
                    onClick={openExistingAnalysisModal}
                  >
                    <Eye aria-hidden="true" /> ดูผลการวิเคราะห์ AI แบบละเอียด
                  </PixelButton>

                  <PixelButton type="button" tone="violet" onClick={removeResume}>
                    <Trash2 aria-hidden="true" /> ลบ Resume/CV
                  </PixelButton>
                </div>
              </div>
            ) : (
              /* CASE B: Candidate has NO Resume uploaded yet */
              <>
                <label className="pdf-upload-dropzone" htmlFor="resume-file-input">
                  <input
                    id="resume-file-input"
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={selectResume}
                  />
                  <UploadCloud className="upload-icon" aria-hidden="true" />
                  <span className="upload-title">
                    {selectedFile ? selectedFile.name : "คลิกหรือลากไฟล์ PDF มาที่นี่"}
                  </span>
                  <span className="upload-hint">รองรับเฉพาะไฟล์ PDF (สูงสุด 10 MB)</span>
                </label>

                {selectedFile && (
                  <div className="selected-file-status-bar">
                    <FileCheck aria-hidden="true" />
                    <div className="file-meta-info">
                      <strong>{selectedFile.name}</strong>
                      <span>{(selectedFile.size / 1024).toFixed(1)} KB • พร้อมส่งวิเคราะห์</span>
                    </div>
                  </div>
                )}

                <div className="consent-agreement-box">
                  <label className="consent-checkbox-label">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                    />
                    <span>ฉันยินยอมให้ส่งเอกสารนี้ไปประมวลผลทักษะด้วยระบบ AI</span>
                  </label>
                  <span className="consent-safety-note">
                    <ShieldCheck aria-hidden="true" /> ระบบจะไม่จัดเก็บเอกสารต้นฉบับไว้บนเซิร์ฟเวอร์
                  </span>
                </div>

                <div className="sidebar-action-box">
                  <PixelButton
                    type="button"
                    tone="cyan"
                    disabled={!selectedFile || !consent}
                    onClick={openNewAnalysisModal}
                  >
                    <BrainCircuit aria-hidden="true" /> เริ่มวิเคราะห์ผลด้วย AI
                  </PixelButton>
                </div>
              </>
            )}

            {/* Masked Privacy Guarantee */}
            <div className="privacy-guarantee-note">
              <Lock aria-hidden="true" />
              <div>
                <strong>ความเป็นส่วนตัว 100%</strong>
                <p>ข้อมูลส่วนบุคคล ชื่อ และช่องทางติดต่อจะไม่ถูกแชร์ให้บริษัทจนกว่าคุณจะกดอนุญาตด้วยตนเอง</p>
              </div>
            </div>
          </PixelSurface>
        </aside>
      </div>

      {/* AI Resume Analysis Studio Modal Popup */}
      <ResumeAnalysisModal
        open={modalOpen}
        file={viewingExistingAnalysis ? null : selectedFile}
        existingAnalysis={viewingExistingAnalysis ? draft.resume?.analysis : null}
        onClose={() => setModalOpen(false)}
        onImport={handleImportAnalysis}
      />
    </AnimatedPage>
  );
}
