import { describe, it, expect } from "vitest";
import {
  RegisterUserRequestSchema,
  CreateFairRequestSchema,
  CreateBoothRequestSchema,
  CreateJobPostingRequestSchema,
  InviteRecruiterSchema,
  ReviewFairMembershipSchema,
  ResumeAnalysisSchema,
} from "./schemas.js";

describe("Contracts — Schema Validations", () => {
  it("validates valid registration request and rejects invalid email or short password", () => {
    const valid = RegisterUserRequestSchema.safeParse({
      displayName: "Somchai Dev",
      email: "somchai@example.com",
      password: "password123",
      role: "candidate",
    });
    expect(valid.success).toBe(true);

    const invalidEmail = RegisterUserRequestSchema.safeParse({
      displayName: "Somchai",
      email: "invalid-email",
      password: "password123",
      role: "candidate",
    });
    expect(invalidEmail.success).toBe(false);

    const shortPassword = RegisterUserRequestSchema.safeParse({
      displayName: "Somchai",
      email: "somchai@example.com",
      password: "short",
      role: "candidate",
    });
    expect(shortPassword.success).toBe(false);
  });

  it("validates fair creation slug regex and required fields", () => {
    const validFair = CreateFairRequestSchema.safeParse({
      title: "Bangkok Tech Fair 2026",
      slug: "bkk-tech-2026",
      summary: "Annual hiring expo",
      locationLabel: "Online",
      startsAt: "2026-10-01T09:00",
      endsAt: "2026-10-01T18:00",
    });
    expect(validFair.success).toBe(true);

    const invalidSlug = CreateFairRequestSchema.safeParse({
      title: "Bangkok Tech Fair 2026",
      slug: "Invalid Slug With Spaces!",
      summary: "Annual hiring expo",
      locationLabel: "Online",
      startsAt: "2026-10-01T09:00",
      endsAt: "2026-10-01T18:00",
    });
    expect(invalidSlug.success).toBe(false);
  });

  it("validates membership governance invite and review schemas", () => {
    const validInvite = InviteRecruiterSchema.safeParse({
      fairId: "fair_123",
      email: "recruiter@partner.local",
    });
    expect(validInvite.success).toBe(true);

    const validReview = ReviewFairMembershipSchema.safeParse({
      membershipId: "mem_123",
      decision: "APPROVE",
    });
    expect(validReview.success).toBe(true);

    const invalidDecision = ReviewFairMembershipSchema.safeParse({
      membershipId: "mem_123",
      decision: "UNKNOWN_ACTION",
    });
    expect(invalidDecision.success).toBe(false);
  });

  it("validates resume analysis structure and skills array constraints", () => {
    const validAnalysis = ResumeAnalysisSchema.safeParse({
      candidateSummary: "Experienced engineer",
      recruiterSummary: "Strong frontend capabilities",
      skills: [
        {
          name: "React",
          category: "Frontend",
          level: "ADVANCED",
          confidence: 0.95,
          evidence: ["Built complex SPA in React 19"],
        },
      ],
      experience: [
        {
          role: "Senior Frontend Engineer",
          industry: "FinTech",
          durationSummary: "3 years",
          achievements: ["Modernized UI architecture"],
        },
      ],
      education: [
        {
          degree: "Bachelor",
          field: "Computer Engineering",
          evidence: "Graduated with honors",
        },
      ],
      languages: ["Thai", "English"],
      strengths: ["Clean Code", "Design Systems"],
      gaps: ["No mobile experience"],
      suggestedRoles: [{ title: "Frontend Lead", reason: "Strong architecture knowledge" }],
      redactionWarnings: [],
    });
    expect(validAnalysis.success).toBe(true);
  });
});
