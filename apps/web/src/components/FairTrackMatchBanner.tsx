import { AlertCircle, CheckCircle2, Compass, Info } from "lucide-react";
import type { CandidateProfile, JobFair } from "../domain/types";

interface FairTrackMatchBannerProps {
  fair: JobFair;
  profile?: CandidateProfile;
  className?: string;
}

export function FairTrackMatchBanner({ fair, profile, className = "" }: FairTrackMatchBannerProps) {
  if (!profile) return null;

  const targetRoles = (profile as any).targetRoles as string[] | undefined ?? (profile.headline ? [profile.headline] : []);
  if (targetRoles.length === 0) return null;

  const fairText = `${fair.title} ${fair.summary} ${fair.locationLabel}`.toLowerCase();

  // Check if any role or keywords in role match fairText
  const isMatch = targetRoles.some((role) => {
    const r = role.toLowerCase();
    const words = r.split(/[\s/,]+/).filter((w) => w.length > 2);
    return fairText.includes(r) || words.some((w) => fairText.includes(w));
  });

  if (isMatch) {
    return (
      <div className={`fair-match-banner match ${className}`} role="note">
        <div className="banner-icon-box">
          <CheckCircle2 aria-hidden="true" />
        </div>
        <div className="banner-text-box">
          <strong>งานแฟร์นี้ตรงกับสายงานเป้าหมายของคุณ!</strong>
          <p>พบความสอดคล้องกับตำแหน่งที่คุณสนใจ ({targetRoles.slice(0, 2).join(", ")}) สามารถเดินชมบูธและสมัครงานได้ทันที</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fair-match-banner warning ${className}`} role="note">
      <div className="banner-icon-box warning">
        <AlertCircle aria-hidden="true" />
      </div>
      <div className="banner-text-box">
        <strong>งานแฟร์นี้อาจไม่ใช่สายงานหลักที่คุณตั้งเป้าไว้</strong>
        <p>
          สายงานที่คุณตั้งไว้คือ <em>{targetRoles.join(", ")}</em> แต่อย่างไรก็ตาม คุณสามารถเดินชมบูธบริษัท ดูตำแหน่งงานที่เปิดรับ และเข้าร่วมงานแฟร์นี้ได้ตามปกติ
        </p>
      </div>
    </div>
  );
}
