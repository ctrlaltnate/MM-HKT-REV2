import { CalendarPlus, MapPin, Store, ArrowRight, ExternalLink } from "lucide-react";
import type { JobFair, Booth, JobPosting } from "@maskedmatch/contracts";
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
      maxWidth="720px"
    >
      <div className="preview-modal-body">
        <div className="preview-modal-meta">
          <StatusPill tone="cyan"><MapPin aria-hidden="true" /> {fair.locationLabel}</StatusPill>
          <StatusPill tone="mango"><CalendarPlus aria-hidden="true" /> {fair.status}</StatusPill>
          <StatusPill tone="violet"><Store aria-hidden="true" /> {fairBooths.length} บูธบริษัท</StatusPill>
        </div>

        <p className="preview-modal-summary">{fair.summary}</p>

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
