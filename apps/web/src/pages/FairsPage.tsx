import { ArrowRight, CalendarDays, MapPin, Radio, UsersRound } from "lucide-react";

import { AnimatedPage } from "../components/AnimatedPage";
import { EmptyState, PixelLink, PixelSurface, StatusPill } from "../components/PixelUI";
import { useApp } from "../context/AppContext";

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("th-TH", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));

export function FairsPage() {
  const { database } = useApp();
  const fairs = database.fairs.filter((fair) => fair.status === "PUBLISHED" || fair.status === "LIVE");

  return (
    <AnimatedPage className="page-shell">
      <div className="page-header" data-reveal>
        <span className="eyebrow">Job fair directory</span>
        <h1>งานแฟร์ที่เข้าร่วมได้</h1>
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
            return (
              <PixelSurface className="fair-card" data-reveal key={fair.id}>
                <StatusPill tone={fair.status === "LIVE" ? "cyan" : "violet"}>
                  {fair.status === "LIVE" ? <Radio aria-hidden="true" /> : <CalendarDays aria-hidden="true" />}
                  {fair.status}
                </StatusPill>
                <h2>{fair.title}</h2>
                <p>{fair.summary}</p>
                <div className="fair-meta">
                  <span><MapPin aria-hidden="true" /> {fair.locationLabel}</span>
                  <span><UsersRound aria-hidden="true" /> {booths.length} บูธ · {jobs.length} งาน</span>
                </div>
                <small>{formatDate(fair.startsAt)} — {formatDate(fair.endsAt)}</small>
                <PixelLink to={`/fairs/${fair.id}`} tone="mango">เปิดรายละเอียด <ArrowRight aria-hidden="true" /></PixelLink>
              </PixelSurface>
            );
          })}
        </div>
      )}
    </AnimatedPage>
  );
}
