import { MapPin, Search, X, ChevronDown } from "lucide-react";
import { type ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import { THAI_PROVINCES_DATA } from "../data/thai-provinces";
import { InfoTooltip } from "./InfoTooltip";

interface ProvinceSelectorProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  label?: string;
  hint?: string;
}

const POPULAR_SHORTCUTS = [
  "กรุงเทพมหานคร",
  "เชียงใหม่",
  "ชลบุรี (พัทยา / ศรีราชา)",
  "ภูเก็ต",
  "ขอนแก่น",
  "ทำงานจากที่ไหนก็ได้ (Anywhere in Thailand)",
];

export function ProvinceSelector({
  value,
  onChange,
  name = "region",
  label = "จังหวัดที่สะดวกทำงาน",
  hint = "เลือกจังหวัด หรือ Remote ทำงานจากที่ไหนก็ได้",
}: ProvinceSelectorProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const filteredGroups = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return THAI_PROVINCES_DATA;

    return THAI_PROVINCES_DATA.map((group) => {
      const matched = group.provinces.filter(
        (p) =>
          p.nameTh.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          group.region.toLowerCase().includes(q),
      );
      return { ...group, provinces: matched };
    }).filter((group) => group.provinces.length > 0);
  }, [query]);

  const selectProvince = (provName: string) => {
    setQuery(provName);
    onChange(provName);
    setIsOpen(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value;
    setQuery(next);
    onChange(next);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="province-selector-container">
      <div className="field-label-group">
        <label className="field-label" htmlFor="province-search-input">
          <MapPin className="label-icon" aria-hidden="true" />
          {label}
        </label>
        <InfoTooltip text={hint} />
      </div>

      <div className="province-input-wrapper">
        <div className="province-search-box">
          <MapPin className="pin-icon" aria-hidden="true" />
          <input
            id="province-search-input"
            name={name}
            type="text"
            className="pixel-text-input"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="พิมพ์หรือเลือกจังหวัด เช่น กรุงเทพฯ, เชียงใหม่, ภูเก็ต..."
            autoComplete="off"
          />
          {query ? (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => {
                setQuery("");
                onChange("");
              }}
              aria-label="ล้างการเลือกจังหวัด"
            >
              <X aria-hidden="true" />
            </button>
          ) : (
            <ChevronDown className="dropdown-arrow-icon" aria-hidden="true" />
          )}
        </div>

        {/* Dropdown with Grouped Provinces */}
        {isOpen && (
          <div className="provinces-dropdown-menu" role="listbox">
            <div className="provinces-dropdown-scroll">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group) => (
                  <div key={group.region} className="province-group-section">
                    <div className="province-group-heading">{group.region}</div>
                    {group.provinces.map((prov) => (
                      <button
                        key={prov.nameTh}
                        type="button"
                        className={`province-dropdown-option ${query === prov.nameTh ? "selected" : ""}`}
                        onClick={() => selectProvince(prov.nameTh)}
                      >
                        <span className="prov-th">{prov.nameTh}</span>
                        <span className="prov-en">{prov.nameEn}</span>
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div className="no-provinces-row">
                  <p>ไม่พบจังหวัดที่ตรงกับ &quot;{query}&quot;</p>
                  <small>ระบบจะบันทึก &quot;{query}&quot; เป็นที่อยู่ที่คุณกำหนดเอง</small>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Pick Province Shortcuts */}
      <div className="province-quick-shortcuts">
        <span className="shortcuts-label">ตัวเลือกยอดนิยม:</span>
        <div className="shortcuts-list">
          {POPULAR_SHORTCUTS.map((item) => (
            <button
              key={item}
              type="button"
              className={`shortcut-chip ${query === item ? "active" : ""}`}
              onClick={() => selectProvince(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
