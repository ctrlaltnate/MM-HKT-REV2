import { Plus, X, Sparkles } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { PixelButton } from "./PixelUI";
import { InfoTooltip } from "./InfoTooltip";

interface SkillTagInputProps {
  skills: string[];
  onChange: (skills: string[]) => void;
  id?: string;
  label?: string;
  hint?: string;
  placeholder?: string;
  suggestions?: string[];
  emptyText?: string;
}

export function SkillTagInput({
  skills,
  onChange,
  id = "skill-tag-input",
  label = "ทักษะที่คุณถนัด (Manual Skills)",
  hint = "พิมพ์แล้วกด Enter หรือ comma เพื่อเพิ่ม และกดกากบาทเพื่อลบ",
  placeholder = "พิมพ์ชื่อทักษะ แล้วกด Enter หรือ comma",
  suggestions = [],
  emptyText = "ยังไม่ได้เพิ่มรายการ",
}: SkillTagInputProps) {
  const [inputValue, setInputValue] = useState("");

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      onChange([...skills, trimmed]);
    }
    setInputValue("");
  };

  const removeSkill = (indexToRemove: number) => {
    onChange(skills.filter((_, i) => i !== indexToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(inputValue);
    }
  };

  return (
    <div className="skill-tag-input-container">
      <div className="field-label-group">
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
        <InfoTooltip text={hint} />
      </div>

      <div className="tag-input-row">
        <input
          id={id}
          type="text"
          className="pixel-text-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <PixelButton type="button" tone="cyan" onClick={() => addSkill(inputValue)}>
          <Plus aria-hidden="true" /> เพิ่ม
        </PixelButton>
      </div>

      {skills.length > 0 ? (
        <div className="active-tag-chips-list" aria-label="รายการทักษะที่เพิ่มแล้ว">
          {skills.map((skill, index) => (
            <span key={`${skill}-${index}`} className="active-skill-chip">
              <span>{skill}</span>
              <button
                type="button"
                className="chip-remove-btn"
                onClick={() => removeSkill(index)}
                aria-label={`ลบทักษะ ${skill}`}
              >
                <X aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className="empty-tags-hint">{emptyText}</p>
      )}

      {/* Suggested Quick Chips */}
      {suggestions.length > 0 ? <div className="suggested-tags-wrapper">
        <span className="suggested-heading">
          <Sparkles aria-hidden="true" /> แนะนำด่วน:
        </span>
        <div className="suggested-chips-group">
          {suggestions.filter((s) => !skills.some((sk) => sk.toLowerCase() === s.toLowerCase())).map((tag) => (
            <button
              key={tag}
              type="button"
              className="quick-suggestion-chip"
              onClick={() => addSkill(tag)}
            >
              + {tag}
            </button>
          ))}
        </div>
      </div> : null}
    </div>
  );
}
