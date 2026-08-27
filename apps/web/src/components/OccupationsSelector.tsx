import { Briefcase, Check, Filter, Plus, Search, X } from "lucide-react";
import { type KeyboardEvent, useMemo, useRef, useState, useEffect } from "react";
import {
  OCCUPATION_CATEGORIES,
  POPULAR_OCCUPATIONS,
} from "../data/occupations";
import { InfoTooltip } from "./InfoTooltip";
import { PixelButton } from "./PixelUI";

interface OccupationsSelectorProps {
  selectedRoles: string[];
  onChange: (roles: string[]) => void;
  label?: string;
  hint?: string;
}

export function OccupationsSelector({
  selectedRoles,
  onChange,
  label = "ตำแหน่งหรือสายงานเป้าหมาย",
  hint = "เลือกหรือพิมพ์สายงานเป้าหมายเพื่อใช้จับคู่กับตำแหน่งงานและงานแฟร์",
}: OccupationsSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filteredOccupations = useMemo(() => {
    const q = query.trim().toLowerCase();
    return POPULAR_OCCUPATIONS.filter((item) => {
      const matchCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.titleTh.toLowerCase().includes(q) ||
        item.categoryTh.toLowerCase().includes(q);
      return matchCategory && matchQuery;
    });
  }, [query, selectedCategory]);

  const addRole = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    if (!selectedRoles.includes(trimmed)) {
      onChange([...selectedRoles, trimmed]);
    }
    setQuery("");
    setIsOpen(false);
  };

  const removeRole = (title: string) => {
    onChange(selectedRoles.filter((r) => r !== title));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const firstMatch = filteredOccupations[0];
      if (firstMatch && query.trim()) {
        addRole(firstMatch.title);
      } else if (query.trim()) {
        addRole(query.trim());
      }
    }
  };

  return (
    <div ref={containerRef} className="occupations-integrated-box">
      <div className="field-label-group">
        <label className="field-label" htmlFor="occupation-search-input">
          <Briefcase className="label-icon" aria-hidden="true" />
          {label}
        </label>
        <InfoTooltip text={hint} />
      </div>

      {/* Input Row: Category Select + Search/Type Box + Add Button */}
      <div className="occupations-input-bar">
        <div className="category-select-wrapper">
          <Filter className="select-filter-icon" aria-hidden="true" />
          <select
            className="pixel-category-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setIsOpen(true);
            }}
            aria-label="เลือกหมวดหมู่อาชีพ"
          >
            {OCCUPATION_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nameTh}
              </option>
            ))}
          </select>
        </div>

        <div className="search-input-wrapper">
          <Search className="search-icon" aria-hidden="true" />
          <input
            id="occupation-search-input"
            type="text"
            className="pixel-text-input"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์ค้นหาหรือระบุชื่อตำแหน่ง..."
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery("")}
              aria-label="ล้างข้อความค้นหา"
            >
              <X aria-hidden="true" />
            </button>
          )}
        </div>

        <PixelButton
          type="button"
          tone="cyan"
          disabled={!query.trim()}
          onClick={() => addRole(query)}
        >
          <Plus aria-hidden="true" /> เพิ่ม
        </PixelButton>

        {/* Suggestion Dropdown */}
        {isOpen && (
          <div className="smooth-suggest-dropdown" role="listbox">
            <div className="dropdown-meta-bar">
              <span>ตำแหน่งในหมวดนี้ ({filteredOccupations.length} รายการ)</span>
              <span className="dropdown-tip">คลิกเพื่อเพิ่มเข้าแท็ก</span>
            </div>

            <div className="dropdown-scrollable-list">
              {filteredOccupations.length > 0 ? (
                filteredOccupations.map((item) => {
                  const isSelected = selectedRoles.includes(item.title);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`suggest-option-item ${isSelected ? "selected" : ""}`}
                      onClick={() => addRole(item.title)}
                    >
                      <div className="option-texts">
                        <strong className="option-title-en">{item.title}</strong>
                        <span className="option-title-th">
                          {item.titleTh} • <span className="cat-badge">{item.categoryTh}</span>
                        </span>
                      </div>
                      <span className={`option-badge ${isSelected ? "checked" : "add"}`}>
                        {isSelected ? "เลือกแล้ว" : "+ เพิ่ม"}
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="dropdown-empty-row">
                  <p>ไม่พบตำแหน่งในคลังที่ตรงกับ &quot;{query}&quot;</p>
                  <PixelButton type="button" tone="mango" onClick={() => addRole(query)}>
                    <Plus aria-hidden="true" /> เพิ่ม &quot;{query}&quot; ลงในโปรไฟล์
                  </PixelButton>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Auto-filled Selected Role Tags (Directly under the input row) */}
      {selectedRoles.length > 0 && (
        <div className="auto-filled-roles-chips" aria-label="สายงานที่คุณเลือกแล้ว">
          {selectedRoles.map((role) => (
            <span key={role} className="target-role-chip animate-pop">
              <span className="role-title">{role}</span>
              <button
                type="button"
                className="chip-remove-btn"
                onClick={() => removeRole(role)}
                aria-label={`ลบสายงาน ${role}`}
              >
                <X aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
