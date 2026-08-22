import React from 'react';
import { JobPosting } from '../../types';
import { IconCheck, IconAlert } from '../common/PixelIcons';

interface MatchScoreCardProps {
  job: JobPosting;
}

export const MatchScoreCard: React.FC<MatchScoreCardProps> = ({ job }) => {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-brand-cyan border-brand-cyan bg-brand-cyan/10';
    if (score >= 70) return 'text-brand-mango border-brand-mango bg-brand-mango/10';
    return 'text-text-muted border-[#352C5E] bg-[#17162E]';
  };

  return (
    <div className="p-4 rounded-xl bg-[#262047]/50 border border-[#352C5E] space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs text-text-muted font-display block">ความตรงกันของทักษะ (Skill Match)</span>
          <span className="text-xs font-mono text-brand-purple">{job.matchConfidence}</span>
        </div>
        <div className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-lg ${getScoreColor(job.matchScore)}`}>
          {job.matchScore}/100
        </div>
      </div>

      {/* Match Reasons */}
      <div className="space-y-1.5 pt-2 border-t border-[#352C5E]">
        <span className="text-xs font-display font-semibold text-text-primary block">
          หลักฐานความสอดคล้อง (Evidence-based Match):
        </span>
        {job.matchReasons.map((reason, idx) => (
          <div key={idx} className="flex items-start gap-2 text-xs text-text-muted">
            <span className="text-status-success mt-0.5"><IconCheck size={14} color="var(--status-success)" /></span>
            <span>{reason}</span>
          </div>
        ))}
      </div>

      {/* Uncertainty Notice */}
      {job.uncertainReasons.length > 0 && (
        <div className="space-y-1 pt-1.5 border-t border-[#352C5E]">
          {job.uncertainReasons.map((unc, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-brand-mango">
              <span className="text-brand-mango mt-0.5"><IconAlert size={13} color="var(--brand-mango)" /></span>
              <span>{unc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
