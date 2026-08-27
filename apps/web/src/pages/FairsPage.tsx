import { Archive, ArrowRight, CalendarDays, Eye, MapPin, Radio, Sparkles, UsersRound } from "lucide-react";
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
  const [publicCategory, setPublicCategory] = useState<"ACTIVE" | "ENDED">("ACTIVE");

  const activeFairs = database.fairs.filter(
    (fair) => fair.status === "PUBLISHED" || fair.status === "LIVE" || fair.status === "PAUSED",
  );
  const endedFairs = database.fairs.filter((fair) => fair.status === "ENDED" || fair.status === "ARCHIVED");
  const displayedFairs = publicCategory === "ACTIVE" ? activeFairs : endedFairs;

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
      <div className="page-header" data-reveal style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16 }}>
        <div>
          <span className="eyebrow"><CalendarDays aria-hidden="true" /> Job fair directory</span>
          <h1>จ็อบแฟร์</h1>
          <p>ดูบริษัท บูธ และตำแหน่งงานก่อนตัดสินใจเข้าร่วม หนึ่งบัญชีสามารถเข้าร่วมได้หลายงาน</p>
        </div>

        {/* Category Tabs */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <PixelButton
            type="button"
            tone={publicCategory === "ACTIVE" ? "mango" : "neutral"}
            onClick={() => setPublicCategory("ACTIVE")}
          >
            <Radio size={14} aria-hidden="true" /> กำลังจัด / เปิดรับ ({activeFairs.length})
          </PixelButton>
          <PixelButton
            type="button"
            tone={publicCategory === "ENDED" ? "danger" : "neutral"}
            onClick={() => setPublicCategory("ENDED")}
          >
            <Archive size={14} aria-hidden="true" /> หมดอายุ / จบงาน ({endedFairs.length})
          </PixelButton>
        </div>
      </div>

      {displayedFairs.length === 0 ? (
        <EmptyState
          title={publicCategory === "ACTIVE" ? "ยังไม่มีงานแฟร์ที่กำลังเปิดรับ" : "ไม่มีงานแฟร์ที่หมดอายุ"}
          body={publicCategory === "ACTIVE" ? "ผู้ดูแลระบบสามารถสร้างและ Publish งานแรกได้จาก Admin workspace" : "งานแฟร์ที่สิ้นสุดแล้วจะถูกจัดเก็บไว้ในหมวดนี้"}
        />
      ) : (
        <div className="card-grid">
          {displayedFairs.map((fair) => {
            const booths = database.booths.filter((booth) => booth.fairId === fair.id && booth.status === "PUBLISHED");
            const companyIds = new Set(booths.map((booth) => booth.companyId));
            const jobs = database.jobs.filter((job) => companyIds.has(job.companyId) && job.status === "PUBLISHED");
            const isMatch = checkTrackMatch(fair);

            return (
              <PixelSurface className="fair-card" data-reveal key={fair.id}>
                {/* Cover Banner (if set) */}
                {fair.coverUrl && (
                  <div
                    style={{
                      height: 110,
                      margin: "-16px -16px 12px -16px",
                      background: `url(${fair.coverUrl}) center/cover no-repeat`,
                      borderBottom: "1px solid var(--line)",
                      position: "relative",
                    }}
                  >
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(7,16,26,0.85))" }} />
                  </div>
                )}

                <div className="fair-card-top-badges" style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
                  <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>
                    {fair.status === "LIVE" ? <Radio aria-hidden="true" /> : <CalendarDays aria-hidden="true" />}
                    {fair.status}
                  </StatusPill>
                  {fair.timezone && (
                    <span style={{ fontSize: "0.72rem", color: "var(--cyan)", background: "rgba(120,219,230,0.08)", padding: "2px 6px", borderRadius: 2 }}>
                      {fair.timezone}
                    </span>
                  )}
                  {user?.role === "candidate" && isMatch && (
                    <StatusPill tone="mango">
                      <Sparkles aria-hidden="true" /> ตรงสายงานเป้าหมาย
                    </StatusPill>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  {fair.logoUrl && (
                    <img
                      src={fair.logoUrl}
                      alt=""
                      style={{ width: 34, height: 34, borderRadius: 4, objectFit: "cover", border: "1px solid var(--line)", flexShrink: 0 }}
                    />
                  )}
                  <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{fair.title}</h2>
                </div>

                <p style={{ marginTop: 8 }}>{fair.summary}</p>

                {/* Tags */}
                {fair.tags && fair.tags.length > 0 && (
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap", margin: "6px 0" }}>
                    {fair.tags.map((t) => (
                      <span key={t} className="stat-chip" style={{ fontSize: "0.68rem", padding: "1px 6px" }}>
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

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
                  <PixelLink to={`/fairs/${fair.slug || fair.id}`} tone="mango">
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
