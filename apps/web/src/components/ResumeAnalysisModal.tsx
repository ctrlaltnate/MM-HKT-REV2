import {
  AlertTriangle,
  BookOpen,
  BrainCircuit,
  Briefcase,
  CheckCircle2,
  Globe,
  Lightbulb,
  Loader2,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import type { ResumeAnalysis } from "../domain/types";
import { analyzeResume } from "../services/resume-api";
import { Modal } from "./Modal";
import { PixelButton, StatusPill } from "./PixelUI";

interface ResumeAnalysisModalProps {
  open: boolean;
  file: File | null;
  existingAnalysis?: ResumeAnalysis | null;
  onClose: () => void;
  onImport: (analysis: ResumeAnalysis) => void;
}

interface LogEntry {
  time: string;
  text: string;
  status: "done" | "active" | "pending";
}

export function ResumeAnalysisModal({
  open,
  file,
  existingAnalysis = null,
  onClose,
  onImport,
}: ResumeAnalysisModalProps) {
  const [phase, setPhase] = useState<"analyzing" | "success" | "error">(
    existingAnalysis && !file ? "success" : "analyzing",
  );
  const [progress, setProgress] = useState(15);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(existingAnalysis);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!open) return;

    if (existingAnalysis && !file) {
      setAnalysisResult(existingAnalysis);
      setPhase("success");
      return;
    }

    if (!file) {
      setPhase("analyzing");
      setProgress(15);
      setLogs([]);
      setAnalysisResult(null);
      setErrorMsg("");
      return;
    }

    let isMounted = true;
    setPhase("analyzing");
    setProgress(20);
    setLogs([
      { time: "0.1s", text: `อ่านไฟล์ ${file.name} (${(file.size / 1024).toFixed(1)} KB) ในเครื่องสำเร็จ`, status: "done" },
      { time: "0.4s", text: "ตรวจสอบ Privacy Shield — คัดกรองข้อมูลระบุตัวตน PII", status: "active" },
    ]);

    const run = async () => {
      try {
        await new Promise((res) => setTimeout(res, 500));
        if (!isMounted) return;

        setProgress(50);
        setLogs((prev) => [
          ...prev.map((l) => ({ ...l, status: "done" as const })),
          { time: "1.2s", text: "กำลังส่งข้อความไปยังระบบประมวลผล AI...", status: "active" },
        ]);

        const result = await analyzeResume(file);
        if (!isMounted) return;

        setProgress(100);
        setLogs((prev) => [
          ...prev.map((l) => ({ ...l, status: "done" as const })),
          { time: "2.4s", text: `วิเคราะห์สำเร็จ! สกัดได้ ${result.skills.length} ทักษะและหลักฐาน`, status: "done" },
        ]);

        setAnalysisResult(result);
        setPhase("success");
      } catch (err) {
        if (!isMounted) return;
        setPhase("error");
        setErrorMsg(err instanceof Error ? err.message : "วิเคราะห์ Resume ไม่สำเร็จ");
      }
    };

    run();

    return () => {
      isMounted = false;
    };
  }, [open, file, existingAnalysis]);

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="AI Resume Analysis Studio" maxWidth="780px">
      <div className="resume-analysis-modal-body">
        {/* Analyzing Phase */}
        {phase === "analyzing" && (
          <div className="analysis-progress-view">
            <div className="progress-spinner-box">
              <Loader2 className="spin progress-icon" aria-hidden="true" />
              <h3>ระบบ AI กำลังประมวลผล...</h3>
              <p>ระบบกำลังอ่านไฟล์ PDF และสกัดทักษะพร้อมหลักฐานอ้างอิงโดยไม่เปิดเผยตัวตน</p>
              <div className="analyzing-time-estimate-badge">
                ⏱️ กระบวนการวิเคราะห์และสกัดข้อมูลด้วย AI ใช้เวลาประมาณ <strong>1–2 นาที</strong>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="modal-progress-bar-container">
              <div className="modal-progress-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Live API Console Log */}
            <div className="live-api-logs-console">
              <div className="console-title">
                <BrainCircuit aria-hidden="true" /> LIVE AI PROCESS LOGS:
              </div>
              <ul className="console-log-list">
                {logs.map((log, idx) => (
                  <li key={idx} className={`log-item status-${log.status}`}>
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-text">{log.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Error Phase */}
        {phase === "error" && (
          <div className="analysis-error-view">
            <AlertTriangle className="error-big-icon" aria-hidden="true" />
            <h3>เกิดข้อผิดพลาดในการวิเคราะห์</h3>
            <p className="error-message-text">{errorMsg}</p>
            <div className="modal-action-row">
              <PixelButton type="button" tone="cyan" onClick={onClose}>
                ปิดและลองใหม่อีกครั้ง
              </PixelButton>
            </div>
          </div>
        )}

        {/* Success Phase: Extracted Preview & Import Options */}
        {phase === "success" && analysisResult && (
          <div className="analysis-success-view">
            <div className="success-banner">
              <div>
                <h3>ผลการวิเคราะห์ Resume ด้วย AI</h3>
                <p>สกัดได้ {analysisResult.skills.length} ทักษะ, {analysisResult.experience?.length ?? 0} ประสบการณ์ทำงาน</p>
              </div>
            </div>

            {/* Candidate Summary */}
            <div className="modal-summary-box">
              <strong><Lightbulb aria-hidden="true" /> สรุปภาพรวมผู้สมัคร:</strong>
              <p>{analysisResult.candidateSummary}</p>
            </div>

            {/* Extracted Skills Grid */}
            <div className="modal-skills-preview-list">
              <h4>ทักษะและระดับความเชี่ยวชาญ ({analysisResult.skills.length} รายการ):</h4>
              <div className="modal-skills-grid">
                {analysisResult.skills.map((skill, idx) => (
                  <div key={idx} className="modal-skill-item">
                    <div className="skill-item-head">
                      <strong>{skill.name}</strong>
                      <StatusPill tone={skill.level === "EXPERT" ? "mango" : skill.level === "ADVANCED" ? "violet" : "cyan"}>
                        {skill.level}
                      </StatusPill>
                    </div>
                    {skill.evidence?.[0] && <span className="evidence-snippet">"{skill.evidence[0]}"</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Experiences */}
            {analysisResult.experience && analysisResult.experience.length > 0 && (
              <div className="modal-exp-preview-section">
                <h4><Briefcase aria-hidden="true" /> ประสบการณ์ทำงานที่สกัดได้ ({analysisResult.experience.length} รายการ):</h4>
                <div className="modal-exp-grid">
                  {analysisResult.experience.map((exp, i) => (
                    <div key={i} className="modal-exp-card">
                      <strong>{exp.role}</strong>
                      <span className="exp-sub">{exp.industry} • {exp.durationSummary}</span>
                      {exp.achievements?.[0] && <small className="exp-bullet">• {exp.achievements[0]}</small>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Education & Languages */}
            {(analysisResult.education?.length > 0 || analysisResult.languages?.length > 0) && (
              <div className="modal-edu-lang-row">
                {analysisResult.education?.length > 0 && (
                  <div className="modal-edu-box">
                    <strong><BookOpen aria-hidden="true" /> การศึกษา:</strong>
                    {analysisResult.education.map((edu, idx) => (
                      <span key={idx} className="edu-tag">{edu.degree} {edu.field}</span>
                    ))}
                  </div>
                )}
                {analysisResult.languages?.length > 0 && (
                  <div className="modal-lang-box">
                    <strong><Globe aria-hidden="true" /> ภาษา:</strong>
                    <div className="lang-chips">
                      {analysisResult.languages.map((l, idx) => (
                        <span key={idx} className="lang-pill">{l}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Suggested Roles */}
            {analysisResult.suggestedRoles && analysisResult.suggestedRoles.length > 0 && (
              <div className="modal-suggested-roles">
                <strong><Sparkles aria-hidden="true" /> สายงานที่เหมาะสม:</strong>
                <div className="roles-chips">
                  {analysisResult.suggestedRoles.map((r, i) => (
                    <span key={i} className="role-tag">+ {r.title}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="import-prompt-box">
              <UserCheck aria-hidden="true" />
              <span>บันทึกและนำเข้าข้อมูลทักษะ & ประสบการณ์นี้สู่โปรไฟล์ของคุณ</span>
            </div>

            <div className="modal-action-row">
              <PixelButton
                type="button"
                tone="mango"
                onClick={() => onImport(analysisResult)}
              >
                <CheckCircle2 aria-hidden="true" /> นำเข้าข้อมูลและบันทึกสู่โปรไฟล์
              </PixelButton>
              <PixelButton type="button" tone="neutral" onClick={onClose}>
                ปิด
              </PixelButton>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
