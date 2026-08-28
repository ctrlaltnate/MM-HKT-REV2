import {
  CalendarDays,
  Check,
  FileText,
  Globe,
  Image as ImageIcon,
  Link2,
  Plus,
  Radio,
  Trash2,
  Video,
  X,
  Zap,
} from "lucide-react";
import { type FormEvent, type KeyboardEvent, useEffect, useId, useState } from "react";

import type { FairMediaLink, FairStatus, JobFair } from "../domain/types";
import { useToast } from "../context/ToastContext";
import { Modal } from "./Modal";
import { PixelButton, StatusPill } from "./PixelUI";

const FAIR_STUDIO_TABS = ["schedule", "branding", "media"] as const;
type FairStudioTab = (typeof FAIR_STUDIO_TABS)[number];

const VISUALLY_HIDDEN_STYLE = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
} as const;

const TIMEZONES = [
  { label: "Asia/Bangkok (UTC+7 / THA)", value: "Asia/Bangkok (UTC+7)" },
  { label: "Asia/Tokyo (UTC+9 / JST)", value: "Asia/Tokyo (UTC+9)" },
  { label: "Asia/Singapore (UTC+8 / SGT)", value: "Asia/Singapore (UTC+8)" },
  { label: "UTC (Coordinated Universal Time)", value: "UTC" },
  { label: "Europe/London (UTC+0 / GMT)", value: "Europe/London (UTC+0)" },
  { label: "Europe/Berlin (UTC+1 / CET)", value: "Europe/Berlin (UTC+1)" },
  { label: "America/New_York (UTC-5 / EST)", value: "America/New_York (UTC-5)" },
  { label: "America/Los_Angeles (UTC-8 / PST)", value: "America/Los_Angeles (UTC-8)" },
];

const PRESET_LOGOS = [
  { label: "Cyber Matrix", url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80" },
  { label: "AI Summit", url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80" },
  { label: "Tech Unicorn", url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=200&auto=format&fit=crop&q=80" },
  { label: "Developer Hub", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&auto=format&fit=crop&q=80" },
];

const PRESET_COVERS = [
  { label: "Cyberpunk City", url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80" },
  { label: "Virtual Hologram", url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80" },
  { label: "Quantum Grid", url: "https://images.unsplash.com/photo-1534972195531-a756b1126f24?w=1200&auto=format&fit=crop&q=80" },
  { label: "Global Arena", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80" },
];

interface FairStudioModalProps {
  open: boolean;
  onClose: () => void;
  initialFair?: JobFair | null;
  onSubmit: (data: {
    title: string;
    slug: string;
    summary: string;
    locationLabel: string;
    startsAt: string;
    endsAt: string;
    timezone: string;
    logoUrl?: string;
    coverUrl?: string;
    autoSchedule: boolean;
    mediaLinks: FairMediaLink[];
    tags: string[];
    status?: FairStatus;
  }) => void;
}

export function FairStudioModal({
  open,
  onClose,
  initialFair,
  onSubmit,
}: FairStudioModalProps) {
  const isEditing = Boolean(initialFair);
  const { toast } = useToast();
  const formId = useId();
  const fieldIds = {
    title: `${formId}-title`,
    slug: `${formId}-slug`,
    location: `${formId}-location`,
    timezone: `${formId}-timezone`,
    startsAt: `${formId}-starts-at`,
    endsAt: `${formId}-ends-at`,
    autoSchedule: `${formId}-auto-schedule`,
    autoScheduleTitle: `${formId}-auto-schedule-title`,
    autoScheduleDescription: `${formId}-auto-schedule-description`,
    status: `${formId}-status`,
    summary: `${formId}-summary`,
    logoUrl: `${formId}-logo-url`,
    coverUrl: `${formId}-cover-url`,
    mediaType: `${formId}-media-type`,
    mediaTitle: `${formId}-media-title`,
    mediaUrl: `${formId}-media-url`,
    tagsHeading: `${formId}-tags-heading`,
    tagInput: `${formId}-tag-input`,
  };

  const [activeTab, setActiveTab] = useState<FairStudioTab>("schedule");
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [locationLabel, setLocationLabel] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [timezone, setTimezone] = useState("Asia/Bangkok (UTC+7)");
  const [autoSchedule, setAutoSchedule] = useState(false);
  const [status, setStatus] = useState<FairStatus>("DRAFT");
  const [summary, setSummary] = useState("");

  // Media & Branding
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [mediaLinks, setMediaLinks] = useState<FairMediaLink[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState("");

  // Media Link Form (for adding)
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkType, setNewLinkType] = useState<FairMediaLink["type"]>("video");

  const toLocalInputFormat = (isoString?: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const offsetMs = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() - offsetMs);
      return localDate.toISOString().slice(0, 16);
    } catch {
      return "";
    }
  };

  useEffect(() => {
    if (initialFair) {
      setTitle(initialFair.title);
      setSlug(initialFair.slug);
      setLocationLabel(initialFair.locationLabel);
      setStartsAt(toLocalInputFormat(initialFair.startsAt));
      setEndsAt(toLocalInputFormat(initialFair.endsAt));
      setTimezone(initialFair.timezone || "Asia/Bangkok (UTC+7)");
      setAutoSchedule(Boolean(initialFair.autoSchedule));
      setStatus(initialFair.status);
      setSummary(initialFair.summary);
      setLogoUrl(initialFair.logoUrl || "");
      setCoverUrl(initialFair.coverUrl || "");
      setMediaLinks(initialFair.mediaLinks || []);
      setTags(initialFair.tags || []);
    } else {
      // Default new fair values
      const now = new Date();
      const nextWeek = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      setTitle("");
      setSlug("");
      setLocationLabel("Online · Thailand (Cyber Hall)");
      setStartsAt(toLocalInputFormat(now.toISOString()));
      setEndsAt(toLocalInputFormat(nextWeek.toISOString()));
      setTimezone("Asia/Bangkok (UTC+7)");
      setAutoSchedule(false);
      setStatus("DRAFT");
      setSummary("");
      setLogoUrl("");
      setCoverUrl("");
      setMediaLinks([]);
      setTags(["Tech", "AI", "Remote-Friendly"]);
    }
    setCurrentTagInput("");
    setError("");
    setActiveTab("schedule");
  }, [initialFair, open]);

  const handleAddMediaLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;
    const newLink: FairMediaLink = {
      id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: newLinkTitle.trim(),
      url: newLinkUrl.trim(),
      type: newLinkType,
    };
    setMediaLinks([...mediaLinks, newLink]);
    setNewLinkTitle("");
    setNewLinkUrl("");
  };

  const handleRemoveMediaLink = (id: string) => {
    setMediaLinks(mediaLinks.filter((l) => l.id !== id));
  };

  const handleAddTag = (rawTag?: string) => {
    const tagText = (rawTag !== undefined ? rawTag : currentTagInput).trim().replace(/,/g, "");
    if (!tagText) return;
    if (!tags.includes(tagText)) {
      setTags([...tags, tagText]);
    }
    setCurrentTagInput("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    } else if (e.key === "Backspace" && !currentTagInput && tags.length > 0) {
      e.preventDefault();
      const lastTag = tags[tags.length - 1];
      if (lastTag) handleRemoveTag(lastTag);
    }
  };

  const handleAutoSlug = (rawTitle: string) => {
    setTitle(rawTitle);
    if (!isEditing && !slug) {
      setSlug(
        rawTitle
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, ""),
      );
    }
  };

  const getTabId = (tab: FairStudioTab) => `${formId}-${tab}-tab`;
  const getTabPanelId = (tab: FairStudioTab) => `${formId}-${tab}-panel`;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentTab: FairStudioTab) => {
    const currentIndex = FAIR_STUDIO_TABS.indexOf(currentTab);
    let nextIndex: number | null = null;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % FAIR_STUDIO_TABS.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + FAIR_STUDIO_TABS.length) % FAIR_STUDIO_TABS.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = FAIR_STUDIO_TABS.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = FAIR_STUDIO_TABS[nextIndex];
    if (!nextTab) return;
    setActiveTab(nextTab);
    window.requestAnimationFrame(() => document.getElementById(getTabId(nextTab))?.focus());
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      const msg = "กรุณาระบุชื่องาน Job Fair";
      setError(msg);
      toast.error(msg);
      setActiveTab("schedule");
      return;
    }
    if (!slug.trim()) {
      const msg = "กรุณาระบุ Slug URL สำหรับงานแฟร์";
      setError(msg);
      toast.error(msg);
      setActiveTab("schedule");
      return;
    }
    if (new Date(endsAt) <= new Date(startsAt)) {
      const msg = "เวลาสิ้นสุดงานแฟร์ต้องอยู่หลังเวลาเริ่มงาน";
      setError(msg);
      toast.error(msg);
      setActiveTab("schedule");
      return;
    }

    setError("");

    // If user left untyped tag in the field, add it too
    let finalTags = [...tags];
    if (currentTagInput.trim()) {
      const pendingTag = currentTagInput.trim().replace(/,/g, "");
      if (pendingTag && !finalTags.includes(pendingTag)) {
        finalTags.push(pendingTag);
      }
    }

    onSubmit({
      title: title.trim(),
      slug: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      summary: summary.trim(),
      locationLabel: locationLabel.trim(),
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      timezone,
      logoUrl: logoUrl.trim() || undefined,
      coverUrl: coverUrl.trim() || undefined,
      autoSchedule,
      mediaLinks,
      tags: finalTags,
      status: isEditing ? status : "DRAFT",
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? `แก้ไข Job Fair: ${initialFair?.title}` : "สร้าง Job Fair ใหม่ (Fair Studio)"}
      subtitle="กำหนดวันเวลาเปิด-ปิดงาน ไทม์โซน โลโก้ ภาพ Cover และมีเดียประกอบงานอย่างยืดหยุ่น"
      maxWidth="860px"
    >
      <form onSubmit={handleSubmit} className="fair-studio-form">
        {/* Navigation Tabs */}
        <div className="fair-studio-tabs" role="tablist" aria-label="ขั้นตอนการตั้งค่า Job Fair">
          <button
            type="button"
            id={getTabId("schedule")}
            role="tab"
            aria-selected={activeTab === "schedule"}
            aria-controls={getTabPanelId("schedule")}
            tabIndex={activeTab === "schedule" ? 0 : -1}
            className={activeTab === "schedule" ? "active" : ""}
            onClick={() => setActiveTab("schedule")}
            onKeyDown={(event) => handleTabKeyDown(event, "schedule")}
          >
            <CalendarDays size={15} aria-hidden="true" /> 1. กำหนดการ & ไทม์โซน
          </button>
          <button
            type="button"
            id={getTabId("branding")}
            role="tab"
            aria-selected={activeTab === "branding"}
            aria-controls={getTabPanelId("branding")}
            tabIndex={activeTab === "branding" ? 0 : -1}
            className={activeTab === "branding" ? "active" : ""}
            onClick={() => setActiveTab("branding")}
            onKeyDown={(event) => handleTabKeyDown(event, "branding")}
          >
            <ImageIcon size={15} aria-hidden="true" /> 2. โลโก้ & ภาพ Cover
          </button>
          <button
            type="button"
            id={getTabId("media")}
            role="tab"
            aria-selected={activeTab === "media"}
            aria-controls={getTabPanelId("media")}
            tabIndex={activeTab === "media" ? 0 : -1}
            className={activeTab === "media" ? "active" : ""}
            onClick={() => setActiveTab("media")}
            onKeyDown={(event) => handleTabKeyDown(event, "media")}
          >
            <Link2 size={15} aria-hidden="true" /> 3. ลิงก์มีเดีย & แท็ก
          </button>
        </div>

        {/* ========================================================
            TAB 1: SCHEDULE & BASICS
           ======================================================== */}
        {activeTab === "schedule" && (
          <div
            className="fair-tab-content"
            id={getTabPanelId("schedule")}
            role="tabpanel"
            aria-labelledby={getTabId("schedule")}
          >
            <div className="form-row-2col">
              <div className="field-group">
                <label className="pixel-label" htmlFor={fieldIds.title}>ชื่องาน Job Fair <span style={{ color: "var(--mango)" }}>*</span></label>
                <input
                  id={fieldIds.title}
                  name="title"
                  type="text"
                  className="pixel-input"
                  value={title}
                  onChange={(e) => handleAutoSlug(e.target.value)}
                  placeholder="เช่น Virtual Tech Job Fair 2026"
                  required
                />
              </div>
              <div className="field-group">
                <label className="pixel-label" htmlFor={fieldIds.slug}>Slug ภาษาอังกฤษ (URL) <span style={{ color: "var(--mango)" }}>*</span></label>
                <input
                  id={fieldIds.slug}
                  name="slug"
                  type="text"
                  className="pixel-input"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="tech-fair-2026"
                  pattern="[A-Za-z0-9-]+"
                  required
                />
              </div>
            </div>

            <div className="form-row-2col">
              <div className="field-group">
                <label className="pixel-label" htmlFor={fieldIds.location}>สถานที่ / รูปแบบงาน</label>
                <input
                  id={fieldIds.location}
                  name="locationLabel"
                  type="text"
                  className="pixel-input"
                  value={locationLabel}
                  onChange={(e) => setLocationLabel(e.target.value)}
                  placeholder="Online · Thailand (Cyber Hall)"
                  required
                />
              </div>

              <div className="field-group">
                <label className="pixel-label" htmlFor={fieldIds.timezone}>ไทม์โซน (Timezone)</label>
                <select
                  id={fieldIds.timezone}
                  name="timezone"
                  className="pixel-input"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                >
                  {TIMEZONES.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-2col">
              <div className="field-group">
                <label className="pixel-label" htmlFor={fieldIds.startsAt}>เวลาเริ่มงาน (Starts At) <span style={{ color: "var(--mango)" }}>*</span></label>
                <input
                  id={fieldIds.startsAt}
                  name="startsAt"
                  type="datetime-local"
                  className="pixel-input"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  required
                />
              </div>
              <div className="field-group">
                <label className="pixel-label" htmlFor={fieldIds.endsAt}>เวลาสิ้นสุด (Ends At) <span style={{ color: "var(--mango)" }}>*</span></label>
                <input
                  id={fieldIds.endsAt}
                  name="endsAt"
                  type="datetime-local"
                  className="pixel-input"
                  value={endsAt}
                  onChange={(e) => setEndsAt(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Cyberpunk Auto Schedule Toggle Switch */}
            <button
              id={fieldIds.autoSchedule}
              type="button"
              className={`fair-autoschedule-box ${autoSchedule ? "active" : ""}`}
              onClick={() => setAutoSchedule(!autoSchedule)}
              role="switch"
              aria-checked={autoSchedule}
              aria-labelledby={fieldIds.autoScheduleTitle}
              aria-describedby={fieldIds.autoScheduleDescription}
              style={{ cursor: "pointer", width: "100%", color: "inherit", font: "inherit", textAlign: "left" }}
            >
              <span className="cyber-toggle-label">
                <span className="cyber-toggle-info">
                  <span className="cyber-toggle-title" id={fieldIds.autoScheduleTitle}>
                    <Zap size={16} aria-hidden="true" />
                    เปิดระบบเปิด-ปิดงานอัตโนมัติ (Auto-Lifecycle Transition)
                  </span>
                  <span className="cyber-toggle-desc" id={fieldIds.autoScheduleDescription}>
                    ระบบจะปรับสถานะเป็น LIVE เมื่อถึงเวลาเริ่มงาน และปรับเป็น ENDED อัตโนมัติเมื่อหมดเวลา
                  </span>
                </span>
                <span className={`cyber-toggle-switch ${autoSchedule ? "active" : ""}`} aria-hidden="true">
                  <span className="cyber-toggle-knob" />
                </span>
              </span>
            </button>

            {isEditing && (
              <div className="fair-status-readonly" role="status" style={{ marginTop: 8 }}>
                <span className="pixel-label">สถานะงานแฟร์ปัจจุบัน</span>
                <StatusPill tone={status === "LIVE" ? "cyan" : status === "PAUSED" ? "mango" : status === "ENDED" || status === "CANCELLED" ? "danger" : "neutral"}>
                  {status}
                </StatusPill>
                <span className="field-help">เปลี่ยนสถานะผ่าน lifecycle controls บนการ์ดงาน เพื่อให้ตรวจ guard และยืนยันทุกครั้ง</span>
              </div>
            )}

            <div className="field-group" style={{ marginTop: 8 }}>
              <label className="pixel-label" htmlFor={fieldIds.summary}>รายละเอียดและไฮไลต์งานแฟร์</label>
              <textarea
                id={fieldIds.summary}
                name="summary"
                className="pixel-input"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="อธิบายจุดเด่นของงาน บริษัทชั้นนำที่เข้าร่วม หรือสายงานที่เปิดรับ..."
                required
              />
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: LOGO & COVER BANNER BRANDING
           ======================================================== */}
        {activeTab === "branding" && (
          <div
            className="fair-tab-content"
            id={getTabPanelId("branding")}
            role="tabpanel"
            aria-labelledby={getTabId("branding")}
          >
            {/* Logo Section */}
            <div className="branding-section-block">
              <h4><label htmlFor={fieldIds.logoUrl}>โลโก้งานแฟร์ (Fair Logo Image)</label></h4>
              <div className="branding-input-row">
                <div style={{ flex: 1 }}>
                  <input
                    id={fieldIds.logoUrl}
                    name="logoUrl"
                    type="url"
                    className="pixel-input"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  <div className="preset-badges-row">
                    <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>หรือเลือกพรีเซ็ต:</span>
                    {PRESET_LOGOS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        className="preset-btn"
                        onClick={() => setLogoUrl(p.url)}
                      >
                        {p.label}
                      </button>
                    ))}
                    {logoUrl && (
                      <button type="button" className="preset-btn clear" onClick={() => setLogoUrl("")}>
                        ล้างโลโก้
                      </button>
                    )}
                  </div>
                </div>

                <div className="logo-preview-box">
                  {logoUrl ? (
                    <img src={logoUrl} alt={`ตัวอย่างโลโก้งาน ${title || "Job Fair"}`} onError={(e) => (e.currentTarget.style.display = "none")} />
                  ) : (
                    <div className="logo-placeholder"><ImageIcon size={24} aria-hidden="true" /><span>ไม่มีโลโก้</span></div>
                  )}
                </div>
              </div>
            </div>

            {/* Cover Banner Section */}
            <div className="branding-section-block" style={{ marginTop: 18 }}>
              <h4><label htmlFor={fieldIds.coverUrl}>ภาพหน้าปก / แบนเนอร์งาน (Cover Banner Image)</label></h4>
              <input
                id={fieldIds.coverUrl}
                name="coverUrl"
                type="url"
                className="pixel-input"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://example.com/cover-banner.jpg"
              />
              <div className="preset-badges-row">
                <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>หรือเลือกพรีเซ็ต:</span>
                {PRESET_COVERS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    className="preset-btn"
                    onClick={() => setCoverUrl(p.url)}
                  >
                    {p.label}
                  </button>
                ))}
                {coverUrl && (
                  <button type="button" className="preset-btn clear" onClick={() => setCoverUrl("")}>
                    ล้าง Cover
                  </button>
                )}
              </div>

              {/* Cover Banner Preview */}
              <div className="cover-preview-box">
                {coverUrl ? (
                  <img src={coverUrl} alt={`ตัวอย่างภาพหน้าปกงาน ${title || "Job Fair"}`} onError={(e) => (e.currentTarget.style.display = "none")} />
                ) : (
                  <div className="cover-placeholder">
                    <ImageIcon size={32} aria-hidden="true" />
                    <span>มุมมองแบนเนอร์กว้าง (Default Cyberpunk Grid)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: MEDIA LINKS & TAGS
           ======================================================== */}
        {activeTab === "media" && (
          <div
            className="fair-tab-content"
            id={getTabPanelId("media")}
            role="tabpanel"
            aria-labelledby={getTabId("media")}
          >
            <h4>ลิงก์มีเดียและเอกสารประกอบงาน (Flexible Media & Resources)</h4>
            <p style={{ color: "var(--muted)", fontSize: "0.82rem", margin: "0 0 12px" }}>
              สามารถใส่ลิงก์วิดีโอแนะนำงาน สไลด์ Keynote โบรชัวร์ PDF หรือช่องทาง Livestream ได้ไม่จำกัด
            </p>

            {/* Add New Link Bar */}
            <div className="add-media-link-bar">
              <label htmlFor={fieldIds.mediaType} style={VISUALLY_HIDDEN_STYLE}>ประเภทลิงก์มีเดีย</label>
              <select
                id={fieldIds.mediaType}
                name="mediaType"
                className="pixel-input"
                style={{ maxWidth: 140 }}
                value={newLinkType}
                onChange={(e) => setNewLinkType(e.target.value as FairMediaLink["type"])}
              >
                <option value="video">วิดีโอ</option>
                <option value="deck">สไลด์/เอกสาร</option>
                <option value="website">เว็บไซต์</option>
                <option value="livestream">ไลฟ์สตรีม</option>
                <option value="social">โซเชียล</option>
                <option value="other">ลิงก์ทั่วไป</option>
              </select>

              <label htmlFor={fieldIds.mediaTitle} style={VISUALLY_HIDDEN_STYLE}>ชื่อลิงก์มีเดีย</label>
              <input
                id={fieldIds.mediaTitle}
                name="mediaTitle"
                type="text"
                className="pixel-input"
                placeholder="ชื่อลิงก์ (เช่น แนะนำงานแฟร์บน YouTube)"
                value={newLinkTitle}
                onChange={(e) => setNewLinkTitle(e.target.value)}
                style={{ flex: 1 }}
              />

              <label htmlFor={fieldIds.mediaUrl} style={VISUALLY_HIDDEN_STYLE}>URL ของลิงก์มีเดีย</label>
              <input
                id={fieldIds.mediaUrl}
                name="mediaUrl"
                type="url"
                className="pixel-input"
                placeholder="https://youtube.com/watch?v=..."
                value={newLinkUrl}
                onChange={(e) => setNewLinkUrl(e.target.value)}
                style={{ flex: 1.2 }}
              />

              <PixelButton type="button" tone="cyan" onClick={handleAddMediaLink}>
                <Plus size={16} aria-hidden="true" /> เพิ่ม
              </PixelButton>
            </div>

            {/* Media Links List */}
            <div className="media-links-list">
              {mediaLinks.length === 0 ? (
                <p className="empty-link-text">ยังไม่มีลิงก์มีเดียประกอบงาน</p>
              ) : (
                mediaLinks.map((link) => (
                  <div key={link.id} className="media-link-row">
                    <div className="media-link-info">
                      <span className="media-type-badge">
                        {link.type === "video" && <><Video size={12} aria-hidden="true" /> Video</>}
                        {link.type === "deck" && <><FileText size={12} aria-hidden="true" /> Slides</>}
                        {link.type === "website" && <><Globe size={12} aria-hidden="true" /> Web</>}
                        {link.type === "livestream" && <><Radio size={12} aria-hidden="true" /> Stream</>}
                        {link.type === "social" && <><Link2 size={12} aria-hidden="true" /> Social</>}
                        {(!link.type || link.type === "other") && <><Link2 size={12} aria-hidden="true" /> Link</>}
                      </span>
                      <strong>{link.title}</strong>
                      <span className="media-url">{link.url}</span>
                    </div>
                    <button
                      type="button"
                      className="delete-link-btn"
                      onClick={() => handleRemoveMediaLink(link.id)}
                      title="ลบลิงก์นี้"
                      aria-label={`ลบลิงก์ ${link.title}`}
                    >
                      <Trash2 size={14} aria-hidden="true" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Interactive Tags & Categories */}
            <div style={{ marginTop: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, flexWrap: "wrap", gap: 6 }}>
                <h4 id={fieldIds.tagsHeading} style={{ margin: 0 }}>แท็กและหมวดหมู่งานแฟร์ (Tags & Categories)</h4>
                <span style={{ fontSize: "0.76rem", color: "var(--muted)" }}>
                  กด <kbd style={{ background: "var(--surface-2)", border: "1px solid var(--line)", padding: "1px 5px", borderRadius: 3 }}>Enter</kbd> หรือ <kbd style={{ background: "var(--surface-2)", border: "1px solid var(--line)", padding: "1px 5px", borderRadius: 3 }}>,</kbd> เพื่อเพิ่มแท็ก
                </span>
              </div>

              <div
                className="cyber-tag-input-container"
                onClick={() => {
                  document.getElementById(fieldIds.tagInput)?.focus();
                }}
              >
                {tags.map((tag) => (
                  <span key={tag} className="cyber-tag-chip">
                    #{tag}
                    <button
                      type="button"
                      className="cyber-tag-remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag);
                      }}
                      title={`ลบแท็ก #${tag}`}
                      aria-label={`ลบแท็ก #${tag}`}
                    >
                      <X size={13} aria-hidden="true" />
                    </button>
                  </span>
                ))}

                <input
                  id={fieldIds.tagInput}
                  name="tags"
                  type="text"
                  className="cyber-tag-field"
                  aria-labelledby={fieldIds.tagsHeading}
                  value={currentTagInput}
                  onChange={(e) => setCurrentTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  onBlur={() => handleAddTag()}
                  placeholder={tags.length === 0 ? "พิมพ์แท็กแล้วกด Enter (เช่น Tech, AI, Remote-Friendly)" : "เพิ่มแท็กอีก..."}
                />
              </div>

              {/* Quick Presets for Tags */}
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                <span style={{ fontSize: "0.74rem", color: "var(--muted)" }}>แท็กแนะนำ:</span>
                {["Tech", "AI", "Developer", "Design", "Remote-Friendly", "Startup", "Internship", "Data", "Cybersecurity"].map((preset) => {
                  const isSelected = tags.includes(preset);
                  return (
                    <button
                      key={preset}
                      type="button"
                      className={`preset-btn ${isSelected ? "clear" : ""}`}
                      onClick={() => (isSelected ? handleRemoveTag(preset) : handleAddTag(preset))}
                      aria-pressed={isSelected}
                      style={{ fontSize: "0.72rem", padding: "2px 7px" }}
                    >
                      #{preset}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {error && <p className="form-message error" role="alert">{error}</p>}

        {/* Footer Actions */}
        <div className="fair-studio-footer">
          <PixelButton type="button" tone="neutral" onClick={onClose}>
            ยกเลิก
          </PixelButton>
          <PixelButton type="submit" tone="mango">
            <Check aria-hidden="true" /> {isEditing ? "บันทึกการแก้ไขงานแฟร์" : "สร้าง Job Fair ใหม่"}
          </PixelButton>
        </div>
      </form>
    </Modal>
  );
}
