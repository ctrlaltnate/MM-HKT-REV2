import gsap from "gsap";
import { Check, Sparkles, Shield, Eye, EyeOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PixelButton, PixelSurface, StatusPill } from "./PixelUI";

const SAMPLE_SKILLS = [
  { id: "react", name: "React / Next.js", category: "Frontend", level: "EXPERT", evidence: "สร้าง Full-stack Web Apps และ Production UI" },
  { id: "ts", name: "TypeScript", category: "Languages", level: "ADVANCED", evidence: "Strict typing, generic types และ Zod validation" },
  { id: "node", name: "Node.js / Express", category: "Backend", level: "ADVANCED", evidence: "REST API, Middleware, PBKDF2 auth" },
  { id: "ai", name: "Generative AI & LLM", category: "AI & ML", level: "WORKING", evidence: "Resume parsing & prompt engineering" },
  { id: "db", name: "PostgreSQL / DB", category: "Database", level: "WORKING", evidence: "Schema design, relational indexes" },
  { id: "figma", name: "UI/UX & Figma", category: "Design", level: "FOUNDATIONAL", evidence: "Design system & 8-bit aesthetic" },
];

const TARGET_ROLES = [
  { title: "Senior Full-Stack AI Engineer", required: ["react", "ts", "node", "ai"], matchMin: 4 },
  { title: "Frontend Specialist", required: ["react", "ts", "figma"], matchMin: 3 },
  { title: "Backend & Systems Developer", required: ["node", "ts", "db"], matchMin: 3 },
];

export function InteractiveSkillSimulator() {
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(["react", "ts", "node"]);
  const [maskedMode, setMaskedMode] = useState<boolean>(true);
  const meterRef = useRef<HTMLDivElement>(null);
  const scoreTextRef = useRef<HTMLSpanElement>(null);

  const toggleSkill = (id: string) => {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  };

  const selectedSkills = SAMPLE_SKILLS.filter((s) => selectedSkillIds.includes(s.id));

  // Compute best match percentage
  const bestMatch = TARGET_ROLES.reduce(
    (acc, role) => {
      const matchCount = role.required.filter((id) => selectedSkillIds.includes(id)).length;
      const score = Math.round((matchCount / role.required.length) * 100);
      return score > acc.score ? { role: role.title, score } : acc;
    },
    { role: TARGET_ROLES[0]?.title ?? "Software Developer", score: 0 },
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (meterRef.current) {
      gsap.to(meterRef.current, {
        width: `${bestMatch.score}%`,
        duration: 0.45,
        ease: "power2.out",
      });
    }
    if (scoreTextRef.current) {
      gsap.fromTo(
        scoreTextRef.current,
        { scale: 1.25, color: "#fca311" },
        { scale: 1, color: "#78dbe6", duration: 0.35, ease: "back.out(2)" },
      );
    }
  }, [bestMatch.score]);

  return (
    <PixelSurface className="interactive-simulator-surface" data-reveal>
      <div className="simulator-header">
        <div className="simulator-title-group">
          <span className="eyebrow"><Sparkles aria-hidden="true" /> Interactive Playground</span>
          <h3>ทดลองระบบจับคู่ทักษะ & Masked Privacy</h3>
          <p>เลือกทักษะที่คุณมีเพื่อดูการคำนวณ Match Score แบบ Real-time และการจำลองมุมมองของ Recruiter</p>
        </div>
        <div className="simulator-mode-toggle">
          <PixelButton
            type="button"
            tone={maskedMode ? "cyan" : "neutral"}
            onClick={() => setMaskedMode(!maskedMode)}
          >
            {maskedMode ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
            {maskedMode ? "มุมมอง Recruiter (Masked)" : "มุมมองผู้สมัคร (เต็ม)"}
          </PixelButton>
        </div>
      </div>

      <div className="simulator-grid">
        <div className="simulator-skills-panel">
          <span className="simulator-subheading">1. เลือกทักษะของคุณ:</span>
          <div className="simulator-chips-group" role="group" aria-label="เลือกทักษะ">
            {SAMPLE_SKILLS.map((skill) => {
              const isSelected = selectedSkillIds.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  className={`interactive-skill-chip ${isSelected ? "is-selected" : ""}`}
                  onClick={() => toggleSkill(skill.id)}
                  aria-pressed={isSelected}
                >
                  <span className="chip-indicator">
                    {isSelected ? <Check aria-hidden="true" /> : "+"}
                  </span>
                  <span className="chip-name">{skill.name}</span>
                  <span className="chip-level">{skill.level}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="simulator-results-panel">
          <span className="simulator-subheading">2. ผลการประเมินและการจับคู่:</span>
          <div className="simulator-score-card">
            <div className="score-header">
              <div>
                <span className="score-label">ตำแหน่งที่เหมาะสมที่สุด:</span>
                <strong>{bestMatch.role}</strong>
              </div>
              <div className="score-badge">
                <span ref={scoreTextRef} className="score-value">
                  {bestMatch.score}%
                </span>
              </div>
            </div>
            <div className="progress-track" aria-hidden="true">
              <div ref={meterRef} className="progress-bar-fill" style={{ width: "0%" }} />
            </div>
          </div>

          <div className="simulator-preview-box">
            <div className="preview-box-header">
              <Shield aria-hidden="true" />
              <span>{maskedMode ? "ข้อมูลที่ Recruiter มองเห็น (นิรนาม 100%)" : "ข้อมูลในโปรไฟล์ผู้สมัคร"}</span>
              <StatusPill tone={maskedMode ? "violet" : "cyan"}>
                {maskedMode ? "MASKED ACTIVE" : "PRIVATE VIEW"}
              </StatusPill>
            </div>

            <div className="preview-content">
              {maskedMode ? (
                <div className="masked-view-content">
                  <div className="masked-identity-row">
                    <span className="masked-avatar-box" aria-hidden="true">🐱</span>
                    <div>
                      <strong>Candidate #8F3A</strong>
                      <span className="masked-location">📍 Bangkok (Hybrid) • ความยินยอม: อนุญาตเฉพาะสรุปทักษะ</span>
                    </div>
                  </div>
                  <div className="masked-skills-list">
                    {selectedSkills.length === 0 ? (
                      <p className="empty-text">ยังไม่ได้เลือกทักษะ — กรุณากดเลือกทักษะด้านซ้าย</p>
                    ) : (
                      selectedSkills.map((s) => (
                        <div key={s.id} className="masked-skill-item">
                          <div>
                            <strong>{s.name}</strong>
                            <span>หลักฐาน: {s.evidence}</span>
                          </div>
                          <StatusPill tone="mango">{s.level}</StatusPill>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="full-view-content">
                  <p><strong>ชื่อผู้สมัคร:</strong> สมชาย นักพัฒนา (สมมุติ)</p>
                  <p><strong>อีเมล:</strong> somchai@example.com (ไม่เปิดเผยต่อบุคคลภายนอก)</p>
                  <p><strong>ทักษะที่เลือก:</strong> {selectedSkills.map((s) => s.name).join(", ") || "ไม่มี"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PixelSurface>
  );
}
