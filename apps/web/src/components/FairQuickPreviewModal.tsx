import {
  CalendarDays,
  CalendarPlus,
  Clock,
  ExternalLink,
  FileText,
  Globe,
  Link2,
  MapPin,
  Radio,
  Store,
  Video,
  Zap,
} from "lucide-react";
import type { Booth, JobFair, JobPosting } from "@maskedmatch/contracts";
import { Modal } from "./Modal";
import { PixelButton, PixelLink, StatusPill } from "./PixelUI";

interface FairQuickPreviewModalProps {
  fair: JobFair | null;
  booths: Booth[];
  jobs: JobPosting[];
  open: boolean;
  onClose: () => void;
}

export function FairQuickPreviewModal({
  fair,
  booths,
  jobs,
  open,
  onClose,
}: FairQuickPreviewModalProps) {
  if (!fair) return null;

  const fairBooths = booths.filter((b) => b.fairId === fair.id);
  const fairBoothIds = new Set(fairBooths.map((b) => b.id));
  const fairJobs = jobs.filter((j) => fairBoothIds.has(j.boothId));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={fair.title}
      subtitle={`กำหนดการ: ${new Date(fair.startsAt).toLocaleDateString("th-TH")} – ${new Date(fair.endsAt).toLocaleDateString("th-TH")}`}
      maxWidth="740px"
    >
      <div className="preview-modal-body">
        {/* Cover Banner (if set) */}
        {fair.coverUrl && (
          <div
            style={{
              width: "100%",
              height: 140,
              background: `url(${fair.coverUrl}) center/cover no-repeat`,
              border: "1px solid var(--line)",
              marginBottom: 16,
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(7,16,26,0.85))" }} />
          </div>
        )}

        <div className="preview-modal-meta" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <StatusPill tone="cyan"><MapPin aria-hidden="true" /> {fair.locationLabel}</StatusPill>
          <StatusPill tone="mango"><CalendarPlus aria-hidden="true" /> {fair.status}</StatusPill>
          <StatusPill tone="violet"><Store aria-hidden="true" /> {fairBooths.length} บูธบริษัท</StatusPill>
          {fair.timezone && (
            <span style={{ fontSize: "0.78rem", color: "var(--cyan)", background: "rgba(120,219,230,0.1)", border: "1px solid rgba(120,219,230,0.3)", padding: "2px 8px", borderRadius: 2 }}>
              <Clock size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 4 }} /> {fair.timezone}
            </span>
          )}
          {fair.autoSchedule && (
            <span style={{ fontSize: "0.75rem", color: "var(--mango)", background: "rgba(255,216,77,0.1)", border: "1px solid rgba(255,216,77,0.3)", padding: "2px 8px", borderRadius: 2 }}>
              <Zap size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: 3 }} /> Auto-Schedule
            </span>
          )}
        </div>

        <p className="preview-modal-summary" style={{ marginTop: 12 }}>{fair.summary}</p>

        {/* Media links */}
        {fair.mediaLinks && fair.mediaLinks.length > 0 && (
          <div style={{ margin: "12px 0", display: "flex", gap: 8, flexWrap: "wrap" }}>
            {fair.mediaLinks.map((l) => (
              <a
                key={l.id}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 10px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--line)",
                  color: "var(--text)",
                  fontSize: "0.78rem",
                  textDecoration: "none",
                }}
              >
                {l.type === "video" && <Video size={13} style={{ color: "#ff5470" }} />}
                {l.type === "deck" && <FileText size={13} style={{ color: "var(--mango)" }} />}
                {l.type === "website" && <Globe size={13} style={{ color: "var(--cyan)" }} />}
                {l.type === "livestream" && <Radio size={13} style={{ color: "#ef4444" }} />}
                {(!l.type || l.type === "social" || l.type === "other") && <Link2 size={13} style={{ color: "var(--cyan)" }} />}
                <span>{l.title}</span>
                <ExternalLink size={11} style={{ color: "var(--muted)" }} />
              </a>
            ))}
          </div>
        )}

        <div className="preview-modal-section">
          <h4>บูธบริษัทที่เปิดในงานนี้ ({fairBooths.length})</h4>
          {fairBooths.length === 0 ? (
            <p className="empty-text">ยังไม่มีบูธบริษัทที่เปิดในงานนี้</p>
          ) : (
            <div className="preview-booths-list">
              {fairBooths.map((b) => {
                const boothJobs = fairJobs.filter((j) => j.boothId === b.id);
                return (
                  <div key={b.id} className="preview-booth-card">
                    <div>
                      <strong>{b.name}</strong>
                      <p>{b.summary}</p>
                      <div className="tech-tags-list">
                        {b.technologyTags.map((t) => (
                          <span key={t} className="tech-tag">{t}</span>
                        ))}
                      </div>
                    </div>
                    <span className="booth-jobs-count">{boothJobs.length} ตำแหน่ง</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="preview-modal-footer">
          <PixelButton type="button" tone="neutral" onClick={onClose}>
            ปิดหน้าต่าง
          </PixelButton>
          <PixelLink to={`/fairs/${fair.slug || fair.id}`} tone="mango">
            เข้าสู่หน้ารายละเอียดงานแฟร์ <ExternalLink aria-hidden="true" />
          </PixelLink>
        </div>
      </div>
    </Modal>
  );
}
