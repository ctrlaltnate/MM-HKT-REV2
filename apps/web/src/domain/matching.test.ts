import { describe, expect, it } from "vitest";

import type { CandidateProfile, JobPosting } from "./types";
import { calculateLocalMatch } from "./matching";

const job: JobPosting = {
  id: "job_1",
  boothId: "booth_1",
  companyId: "company_1",
  title: "Frontend Engineer",
  summary: "Build accessible interfaces",
  responsibilities: "Ship product UI",
  mustHave: ["React", "TypeScript", "Accessibility"],
  niceToHave: ["GSAP"],
  salaryMin: 50_000,
  salaryMax: 80_000,
  workMode: "HYBRID",
  employmentType: "FULL_TIME",
  status: "PUBLISHED",
  createdAt: "2026-08-26T00:00:00.000Z",
};

it("combines manual and resume skills with case-insensitive exact matching", () => {
  const profile: CandidateProfile = {
    userId: "usr_1",
    headline: "Frontend developer",
    region: "Bangkok",
    preferredWorkMode: "HYBRID",
    about: "",
    manualSkills: ["react"],
    shareWithJoinedFairs: true,
    resume: {
      fileName: "resume.pdf",
      size: 100,
      uploadedAt: "2026-08-26T00:00:00.000Z",
      extractedText: "",
      analysis: {
        candidateSummary: "",
        recruiterSummary: "",
        skills: [{ name: "TypeScript", category: "Programming", level: "WORKING", confidence: 0.9, evidence: [] }],
        experience: [],
        education: [],
        languages: [],
        strengths: [],
        gaps: [],
        suggestedRoles: [],
        redactionWarnings: [],
      },
    },
    updatedAt: "2026-08-26T00:00:00.000Z",
  };

  expect(calculateLocalMatch(profile, job)).toEqual({
    score: 67,
    matched: ["react", "typescript"],
    missing: ["accessibility"],
  });
});

describe("empty requirements", () => {
  it("returns a neutral zero score", () => {
    expect(calculateLocalMatch(undefined, { ...job, mustHave: [] })).toEqual({
      score: 0,
      matched: [],
      missing: [],
    });
  });
});
