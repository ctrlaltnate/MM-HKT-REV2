import { describe, expect, it } from "vitest";

import { parseResumeAnalysis } from "./resume-schema.js";

describe("parseResumeAnalysis", () => {
  it("accepts a structured Gemini response", () => {
    const result = parseResumeAnalysis(
      JSON.stringify({
        candidateSummary: "ผู้สมัครสายระบบหลังบ้าน",
        recruiterSummary: "มีหลักฐานงานระบบคิว",
        skills: [
          {
            name: "Node.js",
            category: "Backend",
            level: "WORKING",
            confidence: 0.8,
            evidence: ["พัฒนาระบบ API"],
          },
        ],
        experience: [],
        education: [],
        languages: ["ไทย"],
        strengths: ["ระบบคิว"],
        gaps: [],
        suggestedRoles: [{ title: "Backend Developer", reason: "มีหลักฐาน API" }],
        redactionWarnings: [],
      }),
    );

    expect(result.skills[0]?.name).toBe("Node.js");
  });
});
