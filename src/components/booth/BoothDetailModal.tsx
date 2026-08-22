import React, { useState } from 'react';
import { ExhibitorBooth, JobPosting } from '../../types';
import { DialogWindow } from '../common/DialogWindow';
import { PixelButton } from '../common/PixelButton';
import { MatchScoreCard } from './MatchScoreCard';
import { IconCheck, IconClock, IconCode, IconUser } from '../common/PixelIcons';

interface BoothDetailModalProps {
  booth: ExhibitorBooth | null;
  isOpen: boolean;
  onClose: () => void;
  onJoinQueue: (jobId: string, boothId: string) => void;
  isQueuedForThisBooth?: boolean;
}

export const BoothDetailModal: React.FC<BoothDetailModalProps> = ({
  booth,
  isOpen,
  onClose,
  onJoinQueue,
  isQueuedForThisBooth = false
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  if (!booth) return null;

  const currentJob =
    booth.activeJobs.find((j) => j.id === selectedJobId) || booth.activeJobs[0];

  return (
    <DialogWindow
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="xl"
      headerColor="purple"
      title={
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-brand-purple text-white text-xs rounded font-mono">
            ZONE {booth.zone}
          </span>
          <span>{booth.companyName}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Booth Visual Showcase Banner */}
        {booth.id === 'company-cyber-orchard' && (
          <div className="rounded-xl overflow-hidden border border-brand-purple/40 shadow-lg max-h-48">
            <img
              src="/assets/world/cyber_orchard_booth.jpg"
              alt="Cyber Orchard Booth"
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Booth Hero Header */}
        <div className="p-4 rounded-xl bg-[#262047]/40 border border-[#352C5E] flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <span className="text-xs font-mono text-brand-cyan">{booth.industry}</span>
            <h2 className="text-lg font-display font-bold text-text-primary mt-0.5">
              {booth.tagline}
            </h2>
            <p className="text-xs text-text-muted mt-1 leading-relaxed">
              {booth.description}
            </p>
          </div>

          <div className="flex sm:flex-col items-center justify-between sm:items-end gap-2 flex-shrink-0 bg-[#17162E] p-3 rounded-lg border border-[#352C5E]">
            <div className="flex items-center gap-1.5 text-xs text-status-success font-display font-bold">
              <IconClock size={14} color="var(--status-success)" />
              <span>คิวรอ: {booth.queueCount} คน (~{booth.avgWaitMinutes}m)</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-brand-mango font-display">
              <IconUser size={14} color="var(--brand-mango)" />
              <span>{booth.recruiter.codeName}</span>
            </div>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div>
          <span className="text-xs font-display font-semibold text-text-muted block mb-2">
            เทคโนโลยี & Tech Stack:
          </span>
          <div className="flex flex-wrap gap-2">
            {booth.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 bg-[#17162E] text-brand-cyan border border-brand-cyan/30 rounded text-xs font-mono flex items-center gap-1.5"
              >
                <IconCode size={12} color="var(--brand-cyan)" />
                <span>{tech}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Job Postings Selection */}
        <div>
          <span className="text-xs font-display font-semibold text-text-muted block mb-2">
            ตำแหน่งงานที่เปิดรับสมัคร ({booth.activeJobs.length} ตำแหน่ง):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {booth.activeJobs.map((job) => (
              <button
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-3 rounded-lg text-left transition-all border ${
                  currentJob.id === job.id
                    ? 'bg-brand-purple/20 border-brand-purple ring-1 ring-brand-purple'
                    : 'bg-[#17162E] border-[#352C5E] hover:border-brand-purple/40'
                }`}
              >
                <div className="text-xs font-display font-bold text-text-primary">
                  {job.title}
                </div>
                <div className="text-[11px] text-brand-mango font-mono mt-0.5">
                  {job.salaryRange} • {job.workMode}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Job Detail & Match Analysis */}
        {currentJob && (
          <div className="space-y-4 p-4 rounded-xl bg-[#17162E] border border-brand-purple/40">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-display font-bold text-brand-cyan">
                  {currentJob.title}
                </h3>
                <div className="text-xs text-text-muted">
                  สถานที่: {currentJob.location} • เวลาสัมภาษณ์: {currentJob.interviewMinutes} นาที
                </div>
              </div>

              <PixelButton
                variant="accent"
                size="md"
                disabled={isQueuedForThisBooth}
                onClick={() => {
                  onJoinQueue(currentJob.id, booth.id);
                  onClose();
                }}
              >
                {isQueuedForThisBooth ? 'คุณกำลังอยู่ในคิวนี้แล้ว' : 'เข้าคิวสัมภาษณ์ตำแหน่งนี้ ⚡'}
              </PixelButton>
            </div>

            {/* AI Match Score Breakdown */}
            <MatchScoreCard job={currentJob} />

            {/* Must-have skills list */}
            <div>
              <span className="text-xs font-display font-semibold text-text-primary block mb-1.5">
                คุณสมบัติหลักที่ต้องการ (Must-have Skills):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {currentJob.mustHaveSkills.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 bg-brand-purple/20 text-brand-purple border border-brand-purple/40 rounded text-xs font-mono"
                  >
                    ✓ {m}
                  </span>
                ))}
              </div>
            </div>

            {/* Responsibilities */}
            <div>
              <span className="text-xs font-display font-semibold text-text-primary block mb-1.5">
                ความรับผิดชอบหลัก:
              </span>
              <ul className="space-y-1 text-xs text-text-muted list-disc list-inside">
                {currentJob.responsibilities.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </DialogWindow>
  );
};
