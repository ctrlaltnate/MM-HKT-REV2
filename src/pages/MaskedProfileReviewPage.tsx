import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { BlindModeBadge } from '../components/common/BlindModeBadge';
import { IconCheck, IconLock, IconShieldCheck, IconUser } from '../components/common/PixelIcons';

export const MaskedProfileReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateCandidateProfile } = useAppStore();
  const profile = state.candidateProfile;

  const [skills, setSkills] = useState(profile.skills);
  const [evidence, setEvidence] = useState(profile.evidence);
  const [isApproved, setIsApproved] = useState(false);

  const handleApprove = () => {
    updateCandidateProfile({
      skills,
      evidence
    });
    setIsApproved(true);
    setTimeout(() => {
      navigate('/candidate/avatar');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
          {/* Header & Blind Mode Badge */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-[#352C5E]">
            <div>
              <div className="text-xs font-display text-text-muted">
                ขั้นตอนที่ 2 จาก 3 : ตรวจสอบผลการปิดบังข้อมูล
              </div>
              <h1 className="text-2xl font-display font-bold text-text-primary mt-1">
                Masked Profile Review (Side-by-Side)
              </h1>
            </div>
            <BlindModeBadge />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Original Data with Redaction Highlights */}
            <div className="p-5 rounded-xl bg-[#17162E] border border-[#352C5E] space-y-4">
              <div className="flex items-center justify-between border-b border-[#352C5E] pb-2">
                <span className="text-xs font-display font-bold text-text-muted">
                  1. ข้อมูลส่วนบุคคลที่ถูกปิดบัง (PII Hidden):
                </span>
                <span className="text-[10px] font-mono text-[#FF5A6F] bg-red-950/30 px-2 py-0.5 rounded border border-red-800/40">
                  REDACTED 100%
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded bg-[#0D1025] border border-[#352C5E] flex justify-between items-center">
                  <span className="text-text-muted">ชื่อ-นามสกุลจริง:</span>
                  <span className="font-mono text-[#FF5A6F] line-through bg-red-950/40 px-1.5 py-0.5 rounded">
                    {profile.hiddenPiiData.fullName}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#0D1025] border border-[#352C5E] flex justify-between items-center">
                  <span className="text-text-muted">อีเมลติดต่อ:</span>
                  <span className="font-mono text-[#FF5A6F] line-through bg-red-950/40 px-1.5 py-0.5 rounded">
                    {profile.hiddenPiiData.email}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#0D1025] border border-[#352C5E] flex justify-between items-center">
                  <span className="text-text-muted">เบอร์โทรศัพท์:</span>
                  <span className="font-mono text-[#FF5A6F] line-through bg-red-950/40 px-1.5 py-0.5 rounded">
                    {profile.hiddenPiiData.phone}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#0D1025] border border-[#352C5E] flex justify-between items-center">
                  <span className="text-text-muted">สถาบันการศึกษา:</span>
                  <span className="font-mono text-[#FF5A6F] line-through bg-red-950/40 px-1.5 py-0.5 rounded">
                    {profile.hiddenPiiData.institution}
                  </span>
                </div>

                <div className="p-2.5 rounded bg-[#0D1025] border border-[#352C5E] flex justify-between items-center">
                  <span className="text-text-muted">นายจ้างเดิม:</span>
                  <span className="font-mono text-[#FF5A6F] line-through bg-red-950/40 px-1.5 py-0.5 rounded">
                    {profile.hiddenPiiData.exactEmployer}
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-text-muted bg-[#262047]/30 p-3 rounded border border-[#352C5E] leading-relaxed">
                🔒 ข้อมูลเหล่านี้ถูกล็อกไว้ใน <strong>Identity Vault</strong> ฝั่ง Recruiter จะไม่เห็นจนกว่าจะเกิด Mutual Match และคุณกดยินยอม (Consented Reveal)
              </div>
            </div>

            {/* Right: What Recruiter Sees (Masked Profile) */}
            <div className="p-5 rounded-xl bg-[#17162E] border-2 border-brand-purple shadow-xl shadow-purple-950/30 space-y-4">
              <div className="flex items-center justify-between border-b border-[#352C5E] pb-2">
                <span className="text-xs font-display font-bold text-brand-cyan flex items-center gap-1.5">
                  <IconUser size={14} color="var(--brand-cyan)" />
                  <span>2. สิ่งที่ Recruiter จะมองเห็น (Masked Profile):</span>
                </span>
                <span className="text-[10px] font-mono text-status-success bg-status-success/20 px-2 py-0.5 rounded">
                  VERIFIED CANDIDATE
                </span>
              </div>

              {/* Candidate Alias Banner */}
              <div className="p-3 rounded-lg bg-brand-purple/20 border border-brand-purple flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-text-muted font-display">รหัสประจำตัวผู้สมัคร:</span>
                  <div className="text-base font-display font-bold text-text-primary">
                    {profile.candidateCode}
                  </div>
                </div>
                <div className="text-xs font-mono text-brand-mango bg-[#0D1025] px-2.5 py-1 rounded border border-brand-mango/40">
                  IAL 2.3 Verified
                </div>
              </div>

              {/* Extracted Skills List */}
              <div className="space-y-2">
                <span className="text-xs font-display font-semibold text-text-muted block">
                  ทักษะที่ผ่านการสกัดและยืนยัน ({skills.length} ทักษะ):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2.5 py-1 rounded-md bg-[#262047] text-brand-cyan border border-brand-cyan/40 text-xs font-mono flex items-center gap-1"
                    >
                      <IconCheck size={12} color="var(--brand-cyan)" />
                      <span>{skill.name} ({skill.proficiency})</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Extracted Evidence */}
              <div className="space-y-2">
                <span className="text-xs font-display font-semibold text-text-muted block">
                  หลักฐานผลงานเชิงประจักษ์ (Evidence):
                </span>
                <div className="space-y-2">
                  {evidence.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-2.5 rounded bg-[#0D1025] border border-[#352C5E] text-xs space-y-1"
                    >
                      <div className="font-display font-bold text-brand-purple">{ev.title}</div>
                      <div className="text-text-muted text-[11px] leading-relaxed">{ev.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Approval Bar */}
          <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <IconShieldCheck size={18} color="var(--status-success)" />
              <span>ตรวจทานความถูกต้องแล้ว พร้อมเข้าสู่ขั้นตอนสร้างตัวละคร 8-bit</span>
            </div>
            <PixelButton
              variant="accent"
              size="lg"
              className="w-full sm:w-auto font-bold px-8"
              onClick={handleApprove}
            >
              อนุมัติ Masked Profile และไปแต่งตัวละคร 🎨
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
};
