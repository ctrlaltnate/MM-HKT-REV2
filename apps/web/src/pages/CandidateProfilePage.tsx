import { BrainCircuit, CheckCircle2, FileText, Info, Save, UploadCloud } from "lucide-react";
import { type ChangeEvent, type FormEvent, useEffect, useMemo, useState } from "react";

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
import type { CandidateProfile } from "../domain/types";
import { extractPdfText } from "../services/pdf";
import { analyzeResume, getApiHealth } from "../services/resume-api";

const emptyProfile: Omit<CandidateProfile, "userId" | "updatedAt"> = {
  headline: "",
  region: "",
  preferredWorkMode: "FLEXIBLE",
  about: "",
  manualSkills: [],
  shareWithJoinedFairs: false,
};

export function CandidateProfilePage() {
  const { user, database, actions } = useApp();
  if (!user) return null;
  const savedProfile = database.candidateProfiles.find((item) => item.userId === user.id);
  const [draft, setDraft] = useState<Omit<CandidateProfile, "userId" | "updatedAt">>(
    savedProfile ?? emptyProfile,
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "extracting" | "analyzing" | "saved">("idle");
  const [error, setError] = useState("");
  const [consent, setConsent] = useState(false);
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

  const extractedPreview = useMemo(
    () => draft.resume?.extractedText.slice(0, 900) ?? "",
    [draft.resume?.extractedText],
  );

  const saveDraft = (next = draft) => {
    actions.saveCandidateProfile(user.id, next);
    setStatus("saved");
    window.setTimeout(() => setStatus("idle"), 1400);
  };

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const next = {
      ...draft,
      headline: String(form.get("headline") ?? "").trim(),
      region: String(form.get("region") ?? "").trim(),
      preferredWorkMode: String(form.get("preferredWorkMode")) as CandidateProfile["preferredWorkMode"],
      about: String(form.get("about") ?? "").trim(),
      manualSkills: String(form.get("manualSkills") ?? "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      shareWithJoinedFairs: form.get("shareWithJoinedFairs") === "on",
    };
    setDraft(next);
    saveDraft(next);
  };

  const selectResume = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    if (file.type !== "application/pdf") {
      setError("รองรับเฉพาะไฟล์ PDF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("ไฟล์ต้องมีขนาดไม่เกิน 10 MB");
      return;
    }
    setSelectedFile(file);
    setStatus("extracting");
    try {
      const extractedText = await extractPdfText(file);
      const next = {
        ...draft,
        resume: {
          fileName: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          extractedText,
        },
      };
      setDraft(next);
      saveDraft(next);
    } catch {
      setError("อ่านข้อความจาก PDF ไม่สำเร็จ กรุณาตรวจว่าไฟล์ไม่เสียหายหรือถูกล็อก");
      setStatus("idle");
    }
  };

  const runAnalysis = async () => {
    if (!selectedFile) {
      setError("กรุณาเลือกไฟล์ PDF อีกครั้งก่อนส่งวิเคราะห์ ระบบไม่เก็บไฟล์ต้นฉบับไว้ถาวร");
      return;
    }
    if (!consent) {
      setError("กรุณายืนยันการส่ง PDF ไปยัง Gemini ก่อน");
      return;
    }
    setStatus("analyzing");
    setError("");
    try {
      const analysis = await analyzeResume(selectedFile);
      const next = {
        ...draft,
        resume: {
          ...draft.resume!,
          analysis,
          analyzedAt: new Date().toISOString(),
        },
      };
      setDraft(next);
      saveDraft(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "วิเคราะห์ Resume ไม่สำเร็จ");
      setStatus("idle");
    }
  };

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Candidate profile</span>
        <h1>สร้างประวัติจากหลักฐานจริง</h1>
        <p>เพิ่มข้อมูลพื้นฐาน อ่านข้อความจาก PDF ในเครื่อง และตรวจผลการวิเคราะห์ก่อนนำสรุปไปแสดงกับ Recruiter</p>
      </div>

      <div className="dashboard-grid">
        <PixelSurface data-reveal>
          <h2>ข้อมูลการทำงาน</h2>
          <form className="form-grid" onSubmit={submitProfile}>
            <Field label="ตำแหน่งหรือสายงานที่สนใจ" name="headline" defaultValue={draft.headline} required />
            <Field label="ภูมิภาค" name="region" defaultValue={draft.region} placeholder="เช่น กรุงเทพฯ / ภาคเหนือ" />
            <SelectField label="รูปแบบการทำงานที่ต้องการ" name="preferredWorkMode" defaultValue={draft.preferredWorkMode}>
              <option value="FLEXIBLE">ยืดหยุ่น</option>
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">On-site</option>
            </SelectField>
            <Field
              label="ทักษะที่กรอกเอง"
              name="manualSkills"
              defaultValue={draft.manualSkills.join(", ")}
              help="คั่นแต่ละทักษะด้วย comma"
            />
            <TextAreaField
              className="full"
              label="เกี่ยวกับฉัน"
              name="about"
              defaultValue={draft.about}
              help="เขียนเฉพาะข้อมูลที่ต้องการใช้ประกอบการหางาน"
            />
            <label className="checkbox-row form-section">
              <input
                type="checkbox"
                name="shareWithJoinedFairs"
                defaultChecked={draft.shareWithJoinedFairs}
              />
              <span>
                แชร์เฉพาะ Recruiter summary, ทักษะ และหลักฐานที่ลดข้อมูลระบุตัวตนแล้วกับบริษัทใน Job Fair ที่ฉันเข้าร่วม
              </span>
            </label>
            <div className="button-row">
              <PixelButton type="submit">
                <Save aria-hidden="true" /> {status === "saved" ? "บันทึกแล้ว" : "บันทึกข้อมูล"}
              </PixelButton>
            </div>
          </form>
        </PixelSurface>

        <PixelSurface data-reveal>
          <StatusPill tone={apiHealth.online && apiHealth.configured ? "cyan" : "mango"}>
            {!apiHealth.online
              ? "Local API offline"
              : apiHealth.configured
                ? `Gemini ready · ${apiHealth.model}`
                : "Gemini key required"}
          </StatusPill>
          <h2>Resume PDF</h2>
          <p>ไฟล์ต้นฉบับอยู่ใน memory ระหว่างทำงานและไม่ถูกเก็บบน local API</p>
        </PixelSurface>
      </div>

      <PixelSurface data-reveal style={{ marginTop: 20 }}>
        <div className="resume-drop">
          <UploadCloud aria-hidden="true" />
          <div>
            <h2>เลือก Resume PDF</h2>
            <p>สูงสุด 10 MB ระบบจะอ่านข้อความเพื่อ preview ใน browser ก่อน</p>
          </div>
          <input
            className="resume-file-input"
            type="file"
            accept="application/pdf,.pdf"
            onChange={selectResume}
            aria-label="เลือก Resume PDF"
          />
          {status === "extracting" ? <div className="loading-line" aria-label="กำลังอ่านข้อความ PDF" /> : null}
        </div>
        {error ? <p className="form-message error" role="alert">{error}</p> : null}
      </PixelSurface>

      {draft.resume ? (
        <div className="analysis-grid">
          <PixelSurface data-reveal>
            <StatusPill tone="cyan">PDF read locally</StatusPill>
            <h2><FileText aria-hidden="true" /> {draft.resume.fileName}</h2>
            <p>{Math.ceil(draft.resume.size / 1024)} KB · อ่านได้ {draft.resume.extractedText.length.toLocaleString()} ตัวอักษร</p>
            <div className="analysis-summary">
              {extractedPreview || "PDF ไม่มีข้อความที่ extract ได้ อาจเป็นไฟล์สแกนภาพ แต่ Gemini ยังสามารถวิเคราะห์ภาพใน PDF ได้"}
              {draft.resume.extractedText.length > extractedPreview.length ? "…" : ""}
            </div>
          </PixelSurface>

          <PixelSurface data-reveal>
            <h2>ส่งวิเคราะห์ด้วย Gemini</h2>
            <div className="notice">
              <Info aria-hidden="true" />
              <span>ขั้นตอนนี้ส่งเนื้อหา PDF ไปยัง Google Gemini API ตามนโยบายของบัญชี API ที่ตั้งค่าไว้</span>
            </div>
            <label className="checkbox-row" style={{ margin: "18px 0" }}>
              <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
              <span>ฉันเข้าใจและยินยอมให้ส่ง PDF นี้ไปประมวลผลด้วย Gemini เพื่อสกัดทักษะและหลักฐาน</span>
            </label>
            <PixelButton
              type="button"
              tone="violet"
              onClick={runAnalysis}
              disabled={status === "analyzing" || !apiHealth.configured}
            >
              <BrainCircuit aria-hidden="true" />
              {status === "analyzing" ? "Gemini กำลังวิเคราะห์..." : "วิเคราะห์ Resume"}
            </PixelButton>
            {!apiHealth.configured ? <p className="field-help">ตั้งค่า `GEMINI_API_KEY` ใน `.env.local` แล้วเปิด API ใหม่</p> : null}
          </PixelSurface>
        </div>
      ) : null}

      {draft.resume?.analysis ? (
        <section style={{ marginTop: 32 }} aria-labelledby="analysis-title">
          <div className="section-heading" data-reveal>
            <div>
              <StatusPill tone="cyan"><CheckCircle2 aria-hidden="true" /> Analysis ready</StatusPill>
              <h2 id="analysis-title">สรุปทักษะจาก Resume</h2>
            </div>
            <p>ตรวจความถูกต้องก่อนใช้ข้อมูลนี้กับงานแฟร์ บริษัทจะเห็นเฉพาะ Recruiter summary และหลักฐานที่ลดข้อมูลระบุตัวตนแล้ว</p>
          </div>
          <div className="analysis-grid">
            <PixelSurface data-reveal>
              <h3>สรุปสำหรับผู้สมัคร</h3>
              <div className="analysis-summary">{draft.resume.analysis.candidateSummary}</div>
              <h3>ทักษะที่พบ</h3>
              <div className="skill-list">
                {draft.resume.analysis.skills.map((skill) => (
                  <div className="skill-row" key={`${skill.category}-${skill.name}`}>
                    <div><strong>{skill.name}</strong><small>{skill.category}</small></div>
                    <div className="confidence-meter" aria-label={`ความมั่นใจ ${Math.round(skill.confidence * 100)} เปอร์เซ็นต์`}>
                      <span style={{ width: `${Math.round(skill.confidence * 100)}%` }} />
                    </div>
                    <StatusPill tone="violet">{skill.level}</StatusPill>
                  </div>
                ))}
              </div>
            </PixelSurface>
            <PixelSurface data-reveal>
              <h3>มุมมองสำหรับ Recruiter</h3>
              <div className="analysis-summary">{draft.resume.analysis.recruiterSummary}</div>
              <h3>บทบาทที่สอดคล้อง</h3>
              <ul className="plain-list">
                {draft.resume.analysis.suggestedRoles.map((role) => (
                  <li key={role.title}><strong>{role.title}</strong><br /><span>{role.reason}</span></li>
                ))}
              </ul>
              {draft.resume.analysis.redactionWarnings.length ? (
                <div className="notice">
                  <Info aria-hidden="true" />
                  <span>พบ {draft.resume.analysis.redactionWarnings.length} จุดที่ควรตรวจเรื่องข้อมูลระบุตัวตน</span>
                </div>
              ) : null}
            </PixelSurface>
          </div>
        </section>
      ) : null}
    </AnimatedPage>
  );
}
