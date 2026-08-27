import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface MonthYearPickerProps {
  id?: string;
  value: string; // format: "YYYY-MM" e.g. "2023-05"
  onChange: (value: string) => void;
  disabled?: boolean;
  disabledPlaceholder?: string;
  label?: string;
  placeholder?: string;
}

const MONTH_NAMES = [
  { val: "01", short: "ม.ค.", full: "มกราคม" },
  { val: "02", short: "ก.พ.", full: "กุมภาพันธ์" },
  { val: "03", short: "มี.ค.", full: "มีนาคม" },
  { val: "04", short: "เม.ย.", full: "เมษายน" },
  { val: "05", short: "พ.ค.", full: "พฤษภาคม" },
  { val: "06", short: "มิ.ย.", full: "มิถุนายน" },
  { val: "07", short: "ก.ค.", full: "กรกฎาคม" },
  { val: "08", short: "ส.ค.", full: "สิงหาคม" },
  { val: "09", short: "ก.ย.", full: "กันยายน" },
  { val: "10", short: "ต.ค.", full: "ตุลาคม" },
  { val: "11", short: "พ.ย.", full: "พฤศจิกายน" },
  { val: "12", short: "ธ.ค.", full: "ธันวาคม" },
];

export function MonthYearPicker({
  id,
  value,
  onChange,
  disabled = false,
  disabledPlaceholder = "— ปัจจุบัน (ยังทำอยู่) —",
  label,
  placeholder = "เลือกเดือนและปี...",
}: MonthYearPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const [selectedYear, selectedMonth] = useMemo(() => {
    if (!value) return ["", ""];
    const parts = value.split("-");
    return [parts[0] || "", parts[1] || ""];
  }, [value]);

  // View year inside the calendar picker popup
  const [viewYear, setViewYear] = useState<number>(() => {
    if (selectedYear) return parseInt(selectedYear, 10);
    return currentYear;
  });

  // Sync viewYear if selectedYear changes from outside
  useEffect(() => {
    if (selectedYear) {
      setViewYear(parseInt(selectedYear, 10));
    }
  }, [selectedYear]);

  // Close popup on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const displayLabel = useMemo(() => {
    if (!value || !selectedYear || !selectedMonth) return "";
    const m = MONTH_NAMES.find((item) => item.val === selectedMonth);
    const mName = m ? m.short : selectedMonth;
    const thaiYear = parseInt(selectedYear, 10) + 543;
    return `${mName} ${selectedYear} (พ.ศ. ${thaiYear})`;
  }, [value, selectedYear, selectedMonth]);

  const handleSelectMonth = (monthVal: string) => {
    onChange(`${viewYear}-${monthVal}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setIsOpen(false);
  };

  const handleSetCurrentMonth = () => {
    onChange(`${currentYear}-${currentMonth}`);
    setIsOpen(false);
  };

  if (disabled) {
    return (
      <div className="month-year-picker-wrapper disabled">
        {label && (
          <label className="picker-field-label" htmlFor={id}>
            <Calendar className="cal-icon" aria-hidden="true" /> {label}
          </label>
        )}
        <div className="month-year-disabled-box" id={id}>
          <span>{disabledPlaceholder}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="month-year-picker-wrapper" ref={containerRef}>
      {label && (
        <label className="picker-field-label" htmlFor={id ? `${id}-btn` : undefined}>
          <Calendar className="cal-icon" aria-hidden="true" /> {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        id={id ? `${id}-btn` : undefined}
        type="button"
        className={`month-year-trigger-btn ${isOpen ? "active" : ""} ${value ? "has-value" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <div className="trigger-text-group">
          <Calendar className="trigger-cal-icon" aria-hidden="true" />
          <span className="trigger-value-text">{displayLabel || placeholder}</span>
        </div>
        <ChevronDown className={`trigger-chevron ${isOpen ? "rotate" : ""}`} aria-hidden="true" />
      </button>

      {/* Interactive Calendar Month-Year Grid Popup */}
      {isOpen && (
        <div className="month-year-popup-card" data-reveal role="dialog" aria-modal="false">
          {/* Header with Year Navigation */}
          <div className="popup-year-nav-row">
            <button
              type="button"
              className="year-nav-btn prev"
              onClick={() => setViewYear((y) => y - 1)}
              aria-label="ปีก่อนหน้า"
            >
              <ChevronLeft aria-hidden="true" />
            </button>

            <div className="year-display-title">
              <strong>ค.ศ. {viewYear}</strong>
              <span className="year-thai-sub">(พ.ศ. {viewYear + 543})</span>
            </div>

            <button
              type="button"
              className="year-nav-btn next"
              onClick={() => setViewYear((y) => y + 1)}
              aria-label="ปีถัดไป"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>

          {/* 12 Months Grid */}
          <div className="popup-months-grid">
            {MONTH_NAMES.map((m) => {
              const isSelected = selectedYear === String(viewYear) && selectedMonth === m.val;
              const isThisMonth = currentYear === viewYear && currentMonth === m.val;

              return (
                <button
                  key={m.val}
                  type="button"
                  className={`month-cell-btn ${isSelected ? "selected" : ""} ${isThisMonth ? "is-current" : ""}`}
                  onClick={() => handleSelectMonth(m.val)}
                >
                  <span className="month-short">{m.short}</span>
                  <span className="month-full">{m.full}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Footer */}
          <div className="popup-footer-row">
            <button type="button" className="popup-quick-btn" onClick={handleSetCurrentMonth}>
              เดือนปัจจุบัน
            </button>
            {value && (
              <button type="button" className="popup-clear-btn" onClick={handleClear}>
                <X aria-hidden="true" /> ล้างค่า
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
