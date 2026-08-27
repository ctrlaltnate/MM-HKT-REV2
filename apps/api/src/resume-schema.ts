import { ResumeSkillSchema, ResumeAnalysisSchema, type ResumeAnalysis } from "@maskedmatch/contracts";

export const skillSchema = ResumeSkillSchema;
export const resumeAnalysisSchema = ResumeAnalysisSchema;
export type { ResumeAnalysis };

export const resumeAnalysisJsonSchema = {
  type: "object",
  required: [
    "candidateSummary",
    "recruiterSummary",
    "skills",
    "experience",
    "education",
    "languages",
    "strengths",
    "gaps",
    "suggestedRoles",
    "redactionWarnings",
  ],
  properties: {
    candidateSummary: { type: "string", description: "ภาพรวมของผู้สมัคร" },
    recruiterSummary: { type: "string", description: "สรุปทักษะแบบไม่เปิดเผยตัวตนสำหรับ Recruiter" },
    skills: {
      type: "array",
      items: {
        type: "object",
        required: ["name", "category", "level", "confidence", "evidence"],
        properties: {
          name: { type: "string" },
          category: { type: "string" },
          level: {
            type: "string",
            enum: ["FOUNDATIONAL", "WORKING", "ADVANCED", "EXPERT", "UNKNOWN"],
          },
          confidence: { type: "number" },
          evidence: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    experience: {
      type: "array",
      items: {
        type: "object",
        required: ["role", "industry", "durationSummary", "achievements"],
        properties: {
          role: { type: "string" },
          industry: { type: "string" },
          durationSummary: { type: "string" },
          achievements: {
            type: "array",
            items: { type: "string" },
          },
        },
      },
    },
    education: {
      type: "array",
      items: {
        type: "object",
        required: ["degree", "field", "evidence"],
        properties: {
          degree: { type: "string" },
          field: { type: "string" },
          evidence: { type: "string" },
        },
      },
    },
    languages: {
      type: "array",
      items: { type: "string" },
    },
    strengths: {
      type: "array",
      items: { type: "string" },
    },
    gaps: {
      type: "array",
      items: { type: "string" },
    },
    suggestedRoles: {
      type: "array",
      items: {
        type: "object",
        required: ["title", "reason"],
        properties: {
          title: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    redactionWarnings: {
      type: "array",
      items: {
        type: "object",
        required: ["type", "description"],
        properties: {
          type: { type: "string" },
          description: { type: "string" },
        },
      },
    },
  },
} as const;

export function parseResumeAnalysis(raw: string): ResumeAnalysis {
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  return resumeAnalysisSchema.parse(JSON.parse(cleaned));
}
