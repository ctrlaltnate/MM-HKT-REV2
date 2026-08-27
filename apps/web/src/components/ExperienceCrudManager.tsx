import {
  ArrowDownUp,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Check,
  Edit2,
  Eye,
  FileText,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { CandidateExperience } from "../domain/types";
import { InfoTooltip } from "./InfoTooltip";
import { Modal } from "./Modal";
import { MonthYearPicker } from "./MonthYearPicker";
import { PixelButton } from "./PixelUI";

interface ExperienceCrudManagerProps {
  experiences: CandidateExperience[];
  onChange: (experiences: CandidateExperience[]) => void;
  label?: string;
  hint?: string;
}

const THAI_MONTHS: Record<string, string> = {
  "01": "ม.ค.",
  "02": "ก.พ.",
  "03": "มี.ค.",
  "04": "เม.ย.",
  "05": "พ.ค.",
  "06": "มิ.ย.",
  "07": "ก.ค.",
  "08": "ส.ค.",
  "09": "ก.ย.",
  "10": "ต.ค.",
  "11": "พ.ย.",
  "12": "ธ.ค.",
};

function formatMonthYearThai(val: string): string {
  if (!val) return "";
  const parts = val.split("-");
  if (parts.length >= 2 && parts[1] && parts[0]) {
    const monthKey = parts[1];
    const month = THAI_MONTHS[monthKey] ?? monthKey;
    return `${month} ${parts[0]}`;
  }
  return val;
}

function computeDurationSummary(start: string, end: string, isCurrent: boolean): string {
  if (!start) return "";
  const startStr = formatMonthYearThai(start);
  if (isCurrent) {
    return `${startStr} - ปัจจุบัน`;
  }
  if (!end) return startStr;
  const endStr = formatMonthYearThai(end);
  return `${startStr} - ${endStr}`;
}

export function parseExperienceDateScore(durationStr: string): number {
  if (!durationStr) return 0;

  const isCurrent = durationStr.includes("ปัจจุบัน") || durationStr.toLowerCase().includes("present");

  const years = durationStr.match(/\b(19\d\d|20\d\d|25\d\d)\b/g);
  let maxYear = 0;
  if (years && years.length > 0) {
    maxYear = Math.max(
      ...years.map((y) => {
        let num = parseInt(y, 10);
        if (num >= 2400) num -= 543;
        return num;
      }),
    );
  }

  if (isCurrent) {
    const currentYear = new Date().getFullYear();
    maxYear = Math.max(maxYear, currentYear) + 0.5;
  }

  const monthScores: Record<string, number> = {
    "ม.ค.": 0.01,
    มกราคม: 0.01,
    "ก.พ.": 0.02,
    กุมภาพันธ์: 0.02,
    "มี.ค.": 0.03,
    มีนาคม: 0.03,
    "เม.ย.": 0.04,
    เมษายน: 0.04,
    "พ.ค.": 0.05,
    พฤษภาคม: 0.05,
    "มิ.ย.": 0.06,
    มิถุนายน: 0.06,
    "ก.ค.": 0.07,
    กรกฎาคม: 0.07,
    "ส.ค.": 0.08,
    สิงหาคม: 0.08,
    "ก.ย.": 0.09,
    กันยายน: 0.09,
    "ต.ค.": 0.1,
    ตุลาคม: 0.1,
    "พ.ย.": 0.11,
    พฤศจิกายน: 0.11,
    "ธ.ค.": 0.12,
    ธันวาคม: 0.12,
  };

  let monthOffset = 0;
  for (const [mName, mScore] of Object.entries(monthScores)) {
    if (durationStr.includes(mName)) {
      monthOffset = Math.max(monthOffset, mScore);
    }
  }

  return maxYear + monthOffset;
}

export function sortExperiencesNewestFirst(list: CandidateExperience[]): CandidateExperience[] {
  return [...list].sort((a, b) => {
    const scoreA = parseExperienceDateScore(a.durationSummary);
    const scoreB = parseExperienceDateScore(b.durationSummary);
    return scoreB - scoreA;
  });
}

export function ExperienceCrudManager({
  experiences,
  onChange,
  label = "ประวัติและประสบการณ์ทำงาน",
  hint = "ระบุประวัติการทำงานของคุณเพื่อให้บริษัทประเมินความเหมาะสม โดยระบบจะจัดเรียงจากใหม่สุดไปเก่าสุดอัตโนมัติ",
}: ExperienceCrudManagerProps) {
  const sortedExperiences = useMemo(() => sortExperiencesNewestFirst(experiences), [experiences]);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<"form" | "preview">("form");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [role, setRole] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [fallbackDuration, setFallbackDuration] = useState("");
  const [achievementsText, setAchievementsText] = useState("");

  const openAddModal = () => {
    setEditingId(null);
    setRole("");
    setCompanyName("");
    setStartMonth("");
    setEndMonth("");
    setIsCurrent(false);
    setFallbackDuration("");
    setAchievementsText("");
    setModalStep("form");
    setModalOpen(true);
  };

  const openEditModal = (item: CandidateExperience) => {
    setEditingId(item.id);
    setRole(item.role);
    setCompanyName(item.companyName || "");
    setFallbackDuration(item.durationSummary);
    setStartMonth("");
    setEndMonth("");
    setIsCurrent(item.durationSummary.includes("ปัจจุบัน"));
    setAchievementsText(item.achievements ? item.achievements.join("\n") : "");
    setModalStep("form");
    setModalOpen(true);
  };

  const currentDurationComputed = useMemo(() => {
    if (startMonth) {
      return computeDurationSummary(startMonth, endMonth, isCurrent);
    }
    if (fallbackDuration.trim()) {
      return fallbackDuration.trim();
    }
    return "ไม่ระบุระยะเวลา";
  }, [startMonth, endMonth, isCurrent, fallbackDuration]);

  const currentAchievementsList = useMemo(() => {
    return achievementsText
      .split("\n")
      .map((s) => s.trim().replace(/^•\s*/, ""))
      .filter(Boolean);
  }, [achievementsText]);

  const goToPreview = () => {
    if (!role.trim()) return;
    setModalStep("preview");
  };

  const backToForm = () => {
    setModalStep("form");
  };

  const confirmAndSave = () => {
    if (!role.trim()) return;

    let nextList: CandidateExperience[] = [];
    if (editingId) {
      nextList = experiences.map((item) =>
        item.id === editingId
          ? {
              ...item,
              role: role.trim(),
              companyName: companyName.trim() || undefined,
              durationSummary: currentDurationComputed,
              achievements: currentAchievementsList,
            }
          : item,
      );
    } else {
      const newItem: CandidateExperience = {
        id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        role: role.trim(),
        companyName: companyName.trim() || undefined,
        durationSummary: currentDurationComputed,
        achievements: currentAchievementsList,
      };
      nextList = [...experiences, newItem];
    }

    onChange(sortExperiencesNewestFirst(nextList));
    setModalOpen(false);
  };

  const deleteExperience = (id: string) => {
    onChange(experiences.filter((item) => item.id !== id));
  };

  return (
    <div className="experience-crud-manager">
      {/* Header with Add Button */}
      <div className="crud-header-row">
        <div className="field-label-group">
          <label className="field-label">
            <Briefcase className="label-icon" aria-hidden="true" />
            {label}
          </label>
          <InfoTooltip text={hint} />
        </div>

        <PixelButton type="button" tone="cyan" onClick={openAddModal}>
          <Plus aria-hidden="true" /> เพิ่มประวัติการทำงาน
        </PixelButton>
      </div>

      {/* Cards List Section */}
      {sortedExperiences.length > 0 ? (
        <div className="experience-cards-container">
          <div className="cards-sort-header">
            <span className="sort-indicator-pill">
              <ArrowDownUp className="sort-icon" aria-hidden="true" /> เรียงจากใหม่สุดไปเก่าสุดอัตโนมัติ ({sortedExperiences.length} รายการ)
            </span>
          </div>

          <div className="experience-cards-list">
            {sortedExperiences.map((item) => (
              <div key={item.id} className="experience-card-item">
                <div className="exp-card-header">
                  <div>
                    <h4 className="exp-role-title">{item.role}</h4>
                    <div className="exp-meta-line">
                      {item.companyName && <span className="exp-company">{item.companyName} • </span>}
                      <span className="exp-duration">
                        <Calendar className="cal-icon" aria-hidden="true" /> {item.durationSummary}
                      </span>
                    </div>
                  </div>

                  <div className="exp-actions">
                    <button
                      type="button"
                      className="exp-icon-btn edit"
                      onClick={() => openEditModal(item)}
                      aria-label={`แก้ไข ${item.role}`}
                    >
                      <Edit2 aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="exp-icon-btn delete"
                      onClick={() => deleteExperience(item.id)}
                      aria-label={`ลบ ${item.role}`}
                    >
                      <Trash2 aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {item.achievements && item.achievements.length > 0 && (
                  <ul className="exp-achievements-list">
                    {item.achievements.map((ach: string, idx: number) => (
                      <li key={idx}>{ach}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="empty-experience-box">
          <p>ยังไม่มีประวัติการทำงานในโปรไฟล์</p>
          <small>กดปุ่ม "+ เพิ่มประวัติการทำงาน" เพื่อระบุตำแหน่ง หรือนำเข้าจาก Resume AI ด้านขวา</small>
          <PixelButton type="button" tone="mango" onClick={openAddModal} style={{ marginTop: 12 }}>
            <Plus aria-hidden="true" /> เพิ่มประวัติการทำงานแรกของคุณ
          </PixelButton>
        </div>
      )}

      {/* POPUP MODAL: Add / Edit Work Experience */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "แก้ไขประวัติการทำงาน" : "เพิ่มประวัติการทำงาน"}
        subtitle={modalStep === "form" ? "กรอกรายละเอียดตำแหน่งและช่วงเวลาทำงาน" : "ตรวจสอบตัวอย่างการ์ดก่อนยืนยันบันทึก"}
        maxWidth="680px"
      >
        {modalStep === "form" ? (
          /* STEP 1: FORM INPUTS */
          <div className="exp-modal-form-body">
            <div className="exp-modal-grid">
              <div className="exp-modal-field">
                <label htmlFor="modal-exp-role">ตำแหน่งงาน *</label>
                <input
                  id="modal-exp-role"
                  type="text"
                  className="pixel-text-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="ระบุชื่อตำแหน่งที่คุณทำ"
                  autoFocus
                />
              </div>

              <div className="exp-modal-field">
                <label htmlFor="modal-exp-company">
                  <Building2 className="cal-icon" aria-hidden="true" /> บริษัท / องค์กร (ไม่ระบุก็ได้)
                </label>
                <input
                  id="modal-exp-company"
                  type="text"
                  className="pixel-text-input"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="ชื่อบริษัทหรือองค์กร (ปล่อยว่างได้)"
                />
              </div>

              {/* Month-Year Pickers */}
              <div className="exp-modal-field">
                <MonthYearPicker
                  label="เดือนที่เริ่มงาน"
                  value={startMonth}
                  onChange={setStartMonth}
                />
              </div>

              <div className="exp-modal-field">
                <MonthYearPicker
                  label="เดือนที่สิ้นสุด"
                  value={endMonth}
                  onChange={setEndMonth}
                  disabled={isCurrent}
                  disabledPlaceholder="— ปัจจุบัน (ยังทำอยู่) —"
                />
              </div>

              <div className="exp-modal-field full-col">
                <label className="quick-checkbox-label">
                  <input
                    type="checkbox"
                    checked={isCurrent}
                    onChange={(e) => setIsCurrent(e.target.checked)}
                  />
                  <span>ปัจจุบันยังทำงานที่นี่อยู่ (Disable ช่องเดือนสิ้นสุด)</span>
                </label>
              </div>

              {/* Job Details & Responsibilities */}
              <div className="exp-modal-field full-col">
                <label htmlFor="modal-exp-details">
                  <FileText className="cal-icon" aria-hidden="true" /> รายละเอียดงาน / ผลงานสำคัญ (1 บรรทัดต่อ 1 ข้อ)
                </label>
                <textarea
                  id="modal-exp-details"
                  className="pixel-textarea"
                  rows={4}
                  value={achievementsText}
                  onChange={(e) => setAchievementsText(e.target.value)}
                  placeholder="• หน้าที่หลักที่รับผิดชอบ&#10;• ผลงานเด่นหรือโปรเจกต์สำคัญ&#10;• ทักษะที่ได้ใช้หรือพัฒนา"
                />
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="exp-modal-footer">
              <PixelButton type="button" tone="neutral" onClick={() => setModalOpen(false)}>
                ยกเลิก
              </PixelButton>
              <PixelButton
                type="button"
                tone="mango"
                disabled={!role.trim()}
                onClick={goToPreview}
              >
                <Eye aria-hidden="true" /> ดูตัวอย่างก่อนบันทึก
              </PixelButton>
            </div>
          </div>
        ) : (
          /* STEP 2: PREVIEW & CONFIRMATION */
          <div className="exp-modal-preview-body">
            <div className="preview-guidance-banner">
              <strong>{editingId ? "ตรวจสอบการแก้ไขประวัติการทำงาน" : "ตรวจสอบตัวอย่างการ์ดประวัติการทำงานของคุณ"}</strong>
              <p>{editingId ? "ตรวจสอบข้อมูลที่แก้ไขก่อนยืนยันบันทึกการเปลี่ยนแปลง" : "นี่คือรูปแบบการ์ดที่จะแสดงบนโปรไฟล์และส่งให้บริษัทผู้จัดงานแฟร์พิจารณา"}</p>
            </div>

            {/* Live Preview Card */}
            <div className="experience-card-item preview-mode">
              <div className="exp-card-header">
                <div>
                  <h4 className="exp-role-title">{role}</h4>
                  <div className="exp-meta-line">
                    {companyName && <span className="exp-company">{companyName} • </span>}
                    <span className="exp-duration">
                      <Calendar className="cal-icon" aria-hidden="true" /> {currentDurationComputed}
                    </span>
                  </div>
                </div>
              </div>

              {currentAchievementsList.length > 0 ? (
                <ul className="exp-achievements-list">
                  {currentAchievementsList.map((ach, idx) => (
                    <li key={idx}>{ach}</li>
                  ))}
                </ul>
              ) : (
                <p className="no-achievements-text">(ไม่มีรายละเอียดผลงานเพิ่มเติม)</p>
              )}
            </div>

            {/* Preview Footer Actions */}
            <div className="exp-modal-footer">
              <PixelButton type="button" tone="neutral" onClick={backToForm}>
                <ArrowLeft aria-hidden="true" /> กลับไปแก้ไขข้อมูล
              </PixelButton>
              <PixelButton type="button" tone="cyan" onClick={confirmAndSave}>
                <Check aria-hidden="true" /> {editingId ? "ยืนยันการแก้ไข" : "ยืนยันและเพิ่มสู่โปรไฟล์"}
              </PixelButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
