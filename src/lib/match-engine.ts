import { SkillItem, EvidenceItem, JobPosting } from '../types';

export interface MatchCalculationResult {
  score: number;
  confidence: string;
  reasons: string[];
  uncertainties: string[];
  isEligible: boolean;
}

export function calculateSkillMatch(
  candidateSkills: SkillItem[],
  candidateEvidence: EvidenceItem[],
  job: JobPosting
): MatchCalculationResult {
  const candidateSkillNames = candidateSkills.map(s => s.name.toLowerCase());
  
  // 1. Skill Coverage (45%)
  let matchedMustHaves = 0;
  const mustHaves = job.mustHaveSkills.map(s => s.toLowerCase());
  const reasons: string[] = [];
  const uncertainties: string[] = [];

  mustHaves.forEach(must => {
    if (candidateSkillNames.some(cs => cs.includes(must) || must.includes(cs))) {
      matchedMustHaves++;
      reasons.push(`ทักษะ ${must} ตรงกับ Must-have ความต้องการหลักของตำแหน่ง`);
    } else {
      uncertainties.push(`ยังไม่พบหลักฐานทักษะ ${must} โดยตรงในโปรไฟล์ (สามารถสอบถามเพิ่มเติมได้)`);
    }
  });

  const skillCoverageRatio = mustHaves.length > 0 ? matchedMustHaves / mustHaves.length : 1;
  const skillScore = skillCoverageRatio * 45;

  // 2. Evidence Strength (25%)
  const evidenceCount = candidateEvidence.length;
  const evidenceScore = Math.min(25, evidenceCount * 12.5);
  if (evidenceCount > 0) {
    reasons.push(`มีหลักฐานผลงานที่สอดคล้องกับระบบงานจริง (${evidenceCount} โครงการ)`);
  }

  // 3. Role Level / Recency (15%)
  const expertCount = candidateSkills.filter(s => s.proficiency === 'expert' || s.proficiency === 'advanced').length;
  const roleScore = Math.min(15, expertCount * 4);

  // 4. Preference alignment (15%)
  const preferenceScore = 15;

  const totalScore = Math.round(skillScore + evidenceScore + roleScore + preferenceScore);
  const clampedScore = Math.max(0, Math.min(100, totalScore));

  return {
    score: clampedScore,
    confidence: clampedScore >= 80 ? 'High (Evidence-Backed Rule Engine v2.1)' : 'Medium',
    reasons: reasons.slice(0, 4),
    uncertainties: uncertainties.slice(0, 2),
    isEligible: skillCoverageRatio >= 0.5
  };
}
