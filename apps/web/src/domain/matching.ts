import type { CandidateProfile, JobPosting } from "./types";

export function calculateLocalMatch(profile: CandidateProfile | undefined, job: JobPosting) {
  const candidateSkills = new Set(
    [
      ...(profile?.manualSkills ?? []),
      ...(profile?.resume?.analysis?.skills.map((skill) => skill.name) ?? []),
    ].map((skill) => skill.trim().toLowerCase()),
  );
  const mustHave = job.mustHave.map((skill) => skill.trim().toLowerCase()).filter(Boolean);
  const matched = mustHave.filter((skill) => candidateSkills.has(skill));
  const score = mustHave.length === 0 ? 0 : Math.round((matched.length / mustHave.length) * 100);
  return {
    score,
    matched,
    missing: mustHave.filter((skill) => !candidateSkills.has(skill)),
  };
}
