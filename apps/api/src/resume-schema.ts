import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: z.enum(["FOUNDATIONAL", "WORKING", "ADVANCED", "EXPERT", "UNKNOWN"]),
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()).max(6),
});

export const resumeAnalysisSchema = z.object({
  candidateSummary: z.string().min(1),
  recruiterSummary: z.string().min(1),
  skills: z.array(skillSchema).max(50),
  experience: z
    .array(
      z.object({
        role: z.string(),
        industry: z.string(),
        durationSummary: z.string(),
        achievements: z.array(z.string()).max(8),
      }),
    )
    .max(20),
  education: z
    .array(
      z.object({
        degree: z.string(),
        field: z.string(),
        evidence: z.string(),
      }),
    )
    .max(10),
  languages: z.array(z.string()).max(15),
  strengths: z.array(z.string()).max(10),
  gaps: z.array(z.string()).max(10),
  suggestedRoles: z
    .array(z.object({ title: z.string(), reason: z.string() }))
    .max(10),
  redactionWarnings: z
    .array(
      z.object({
        type: z.string(),
        description: z.string(),
      }),
    )
    .max(20),
});

export type ResumeAnalysis = z.infer<typeof resumeAnalysisSchema>;

export const resumeAnalysisJsonSchema = {
  type: "object",
  additionalProperties: false,
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
    candidateSummary: { type: "string" },
    recruiterSummary: { type: "string" },
    skills: {
      type: "array",
      maxItems: 50,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "category", "level", "confidence", "evidence"],
        properties: {
          name: { type: "string" },
          category: { type: "string" },
          level: {
            type: "string",
            enum: ["FOUNDATIONAL", "WORKING", "ADVANCED", "EXPERT", "UNKNOWN"],
          },
          confidence: { type: "number", minimum: 0, maximum: 1 },
          evidence: { type: "array", maxItems: 6, items: { type: "string" } },
        },
      },
    },
    experience: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["role", "industry", "durationSummary", "achievements"],
        properties: {
          role: { type: "string" },
          industry: { type: "string" },
          durationSummary: { type: "string" },
          achievements: { type: "array", maxItems: 8, items: { type: "string" } },
        },
      },
    },
    education: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["degree", "field", "evidence"],
        properties: {
          degree: { type: "string" },
          field: { type: "string" },
          evidence: { type: "string" },
        },
      },
    },
    languages: { type: "array", maxItems: 15, items: { type: "string" } },
    strengths: { type: "array", maxItems: 10, items: { type: "string" } },
    gaps: { type: "array", maxItems: 10, items: { type: "string" } },
    suggestedRoles: {
      type: "array",
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["title", "reason"],
        properties: {
          title: { type: "string" },
          reason: { type: "string" },
        },
      },
    },
    redactionWarnings: {
      type: "array",
      maxItems: 20,
      items: {
        type: "object",
        additionalProperties: false,
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
