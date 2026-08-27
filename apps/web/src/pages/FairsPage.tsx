import { ArrowRight, CalendarDays, Eye, MapPin, Radio, Sparkles, UsersRound } from "lucide-react";
import { useState } from "react";

import { AnimatedPage } from "../components/AnimatedPage";
import { FairQuickPreviewModal } from "../components/FairQuickPreviewModal";
import { EmptyState, PixelButton, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { useApp } from "../context/AppContext";
import type { JobFair } from "../domain/types";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function FairsPage() {
  const { user, database } = useApp();
  const [previewFair, setPreviewFair] = useState<JobFair | null>(null);
  const fairs = database.fairs.filter((fair) => fair.status === "PUBLISHED" || fair.status === "LIVE");

  const candidateProfile = user?.role === "candidate"
    ? database.candidateProfiles.find((p) => p.userId === user.id)
    : undefined;

  const targetRoles = candidateProfile?.targetRoles ??
    (candidateProfile?.headline ? candidateProfile.headline.split(",").map((s) => s.trim()) : []);

  const checkTrackMatch = (fair: JobFair) => {
    if (targetRoles.length === 0) return false;
    const fairText = `${fair.title} ${fair.summary} ${fair.locationLabel}`.toLowerCase();
    return targetRoles.some((role) => {
      const r = role.toLowerCase();
      const words = r.split(/[\s/,]+/).filter((w) => w.length > 2);
      return fairText.includes(r) || words.some((w) => fairText.includes(w));
    });
  };

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow"><CalendarDays aria-hidden="true" /> Job fair directory</span>
        <h1>จ็อบแฟร์</h1>
        <p>ดูบริษัท บูธ และตำแหน่งงานก่อนตัดสินใจเข้าร่วม หนึ่งบัญชีสามารถเข้าร่วมได้หลายงาน</p>
      </div>

      {fairs.length === 0 ? (
        <EmptyState
          title="ยังไม่มีงานแฟร์ที่เปิดรับ"
          body="ผู้ดูแลระบบสามารถสร้างและ Publish งานแรกได้จาก Admin workspace"
        />
      ) : (
        <div className="card-grid">
          {fairs.map((fair) => {
            const booths = database.booths.filter((booth) => booth.fairId === fair.id && booth.status === "PUBLISHED");
            const companyIds = new Set(booths.map((booth) => booth.companyId));
            const jobs = database.jobs.filter((job) => companyIds.has(job.companyId) && job.status === "PUBLISHED");
            const isMatch = checkTrackMatch(fair);

            return (
              <PixelSurface className="fair-card" data-reveal key={fair.id}>
                <div className="fair-card-top-badges">
                  <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>
                    {fair.status === "LIVE" ? <Radio aria-hidden="true" /> : <CalendarDays aria-hidden="true" />}
                    {fair.status}
                  </StatusPill>
                  {user?.role === "candidate" && isMatch && (
                    <StatusPill tone="mango">
                      <Sparkles aria-hidden="true" /> ตรงสายงานเป้าหมาย
                    </StatusPill>
                  )}
                </div>

                <h2>{fair.title}</h2>
                <p>{fair.summary}</p>
                <div className="fair-meta">
                  <span><MapPin aria-hidden="true" /> {fair.locationLabel}</span>
                  <span><UsersRound aria-hidden="true" /> {booths.length} บูธ · {jobs.length} งาน</span>
                </div>
                <small>{formatDate(fair.startsAt)} — {formatDate(fair.endsAt)}</small>

                <div className="fair-card-actions-row">
                  <PixelButton
                    type="button"
                    tone="neutral"
                    onClick={() => setPreviewFair(fair)}
                  >
                    <Eye aria-hidden="true" /> ดูด่วน
                  </PixelButton>
                  <PixelLink to={`/fairs/${fair.id}`} tone="mango">
                    รายละเอียด <ArrowRight aria-hidden="true" />
                  </PixelLink>
                </div>
              </PixelSurface>
            );
          })}
        </div>
      )}

      {/* Quick Preview Modal */}
      <FairQuickPreviewModal
        open={Boolean(previewFair)}
        fair={previewFair}
        booths={database.booths}
        jobs={database.jobs}
        onClose={() => setPreviewFair(null)}
      />
    </AnimatedPage>
  );
}
