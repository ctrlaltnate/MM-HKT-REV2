import { z } from "zod";

// ==========================================
// User & Auth Schemas
// ==========================================
export const UserRoleSchema = z.enum(["candidate", "recruiter", "admin"]);

export const RegisterUserRequestSchema = z.object({
  displayName: z.string().trim().min(1, "กรุณากรอกชื่อที่แสดง").max(100),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง").max(255),
  password: z.string().min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
  role: UserRoleSchema,
});

export const LoginUserRequestSchema = z.object({
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง"),
  password: z.string().min(1, "กรุณากรอกรหัสผ่าน"),
});

export const AccountUpdateRequestSchema = z.object({
  displayName: z.string().trim().min(1, "กรุณากรอกชื่อที่แสดง").max(100),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง").max(255),
});

export const PasswordChangeRequestSchema = z.object({
  currentPassword: z.string().min(1, "กรุณากรอกรหัสผ่านปัจจุบัน"),
  newPassword: z.string().min(8, "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร"),
});

// ==========================================
// Resume & Skill Schemas
// ==========================================
export const SkillLevelSchema = z.enum(["FOUNDATIONAL", "WORKING", "ADVANCED", "EXPERT", "UNKNOWN"]);

export const ResumeSkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  level: SkillLevelSchema,
  confidence: z.number().min(0).max(1),
  evidence: z.array(z.string()).max(6),
});

export const ResumeAnalysisSchema = z.object({
  candidateSummary: z.string().min(1),
  recruiterSummary: z.string().min(1),
  skills: z.array(ResumeSkillSchema).max(50),
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

// ==========================================
// Candidate Profile Schemas
// ==========================================
export const WorkModeSchema = z.enum(["REMOTE", "HYBRID", "ONSITE", "FLEXIBLE"]);

export const CandidateExperienceSchema = z.object({
  id: z.string(),
  role: z.string().trim().min(1).max(100),
  companyName: z.string().trim().max(100).optional(),
  durationSummary: z.string().trim().max(100),
  achievements: z.array(z.string().trim()).max(10),
});

export const CandidateEducationSchema = z.object({
  id: z.string(),
  degree: z.string().trim().min(1).max(100),
  field: z.string().trim().min(1).max(100),
  institution: z.string().trim().max(100).optional(),
});

export const UpdateCandidateProfileRequestSchema = z.object({
  headline: z.string().trim().max(120),
  region: z.string().trim().max(100),
  preferredWorkMode: WorkModeSchema,
  about: z.string().trim().max(2000),
  manualSkills: z.array(z.string().trim().min(1)).max(50),
  targetRoles: z.array(z.string().trim()).max(20).optional(),
  experiences: z.array(CandidateExperienceSchema).max(20).optional(),
  educationList: z.array(CandidateEducationSchema).max(10).optional(),
  languages: z.array(z.string().trim()).max(20).optional(),
  shareWithJoinedFairs: z.boolean(),
});

// ==========================================
// Job Fair Schemas
// ==========================================
export const FairStatusSchema = z.enum([
  "DRAFT",
  "PUBLISHED",
  "LIVE",
  "PAUSED",
  "CANCELLED",
  "ENDED",
  "ARCHIVED",
]);

export const FairMediaLinkSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "กรุณากรอกชื่อสื่อ/ลิงก์").max(100),
  url: z.string().trim().min(1, "กรุณากรอก URL"),
  type: z.enum(["video", "website", "deck", "livestream", "social", "other"]).optional(),
});

export const CreateFairRequestSchema = z.object({
  title: z.string().trim().min(1, "กรุณากรอกชื่องานแฟร์").max(150),
  slug: z.string().trim().min(1, "กรุณากรอก slug").regex(/^[a-z0-9-]+$/, "Slug ต้องเป็นตัวพิมพ์เล็ก ตัวเลข หรือขีดกลางเท่านั้น").max(100),
  summary: z.string().trim().min(1, "กรุณากรอกรายละเอียดงาน").max(2000),
  locationLabel: z.string().trim().min(1, "กรุณากรอกสถานที่หรือรูปแบบงาน").max(100),
  startsAt: z.string().min(1, "กรุณาระบุเวลาเริ่ม"),
  endsAt: z.string().min(1, "กรุณาระบุเวลาสิ้นสุด"),
  timezone: z.string().trim().max(100).optional(),
  logoUrl: z.string().trim().optional(),
  coverUrl: z.string().trim().optional(),
  autoSchedule: z.boolean().optional(),
  mediaLinks: z.array(FairMediaLinkSchema).max(20).optional(),
  tags: z.array(z.string().trim()).max(20).optional(),
});

export const UpdateFairRequestSchema = CreateFairRequestSchema.partial().extend({
  status: FairStatusSchema.optional(),
});

// ==========================================
// Fair Membership Schemas
// ==========================================
export const FairMembershipStatusSchema = z.enum(["ACTIVE", "PENDING_APPROVAL", "REJECTED", "INVITED"]);

export const RequestFairAccessSchema = z.object({
  fairId: z.string().min(1, "กรุณาระบุ fairId"),
});

export const InviteRecruiterSchema = z.object({
  fairId: z.string().min(1, "กรุณาระบุ fairId"),
  email: z.string().trim().email("รูปแบบอีเมลไม่ถูกต้อง"),
});

export const ReviewFairMembershipSchema = z.object({
  membershipId: z.string().min(1, "กรุณาระบุ membershipId"),
  decision: z.enum(["APPROVE", "REJECT"]),
});

// ==========================================
// Company & Booth Schemas
// ==========================================
export const CreateCompanyRequestSchema = z.object({
  name: z.string().trim().min(1, "กรุณากรอกชื่อบริษัท").max(150),
  industry: z.string().trim().min(1, "กรุณากรอกประเภทธุรกิจ").max(100),
  summary: z.string().trim().min(1, "กรุณากรอกข้อมูลบริษัท").max(2000),
  website: z.string().trim().url("รูปแบบ URL เว็บไซต์ไม่ถูกต้อง").or(z.literal("")),
  workLocations: z.string().trim().min(1, "กรุณาระบุสถานที่ทำงาน").max(200),
});

export const UpdateCompanyRequestSchema = CreateCompanyRequestSchema.partial();

export const BoothStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const CreateBoothRequestSchema = z.object({
  fairId: z.string().min(1, "กรุณาเลือกงานแฟร์"),
  companyId: z.string().min(1, "กรุณาเลือกหรือสร้างบริษัทก่อน"),
  name: z.string().trim().min(1, "กรุณากรอกชื่อบูธ").max(150),
  summary: z.string().trim().min(1, "กรุณากรอกรายละเอียดบูธ").max(2000),
  technologyTags: z.array(z.string().trim().min(1)).max(20),
  accessibilityNote: z.string().trim().max(500).default(""),
});

export const UpdateBoothRequestSchema = CreateBoothRequestSchema.partial().extend({
  status: BoothStatusSchema.optional(),
});

// ==========================================
// Job Posting Schemas
// ==========================================
export const EmploymentTypeSchema = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"]);
export const JobPostingStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const CreateJobPostingRequestSchema = z.object({
  boothId: z.string().min(1, "กรุณาเลือกบูธ"),
  companyId: z.string().min(1, "กรุณาเลือกบริษัท"),
  title: z.string().trim().min(1, "กรุณากรอกชื่อตำแหน่งงาน").max(150),
  summary: z.string().trim().min(1, "กรุณากรอกสรุปตำแหน่งงาน").max(2000),
  responsibilities: z.string().trim().min(1, "กรุณากรอกความรับผิดชอบ").max(4000),
  mustHave: z.array(z.string().trim().min(1)).min(1, "กรุณาระบุทักษะที่จำเป็นอย่างน้อย 1 รายการ").max(20),
  niceToHave: z.array(z.string().trim().min(1)).max(20).default([]),
  salaryMin: z.number().nullable().default(null),
  salaryMax: z.number().nullable().default(null),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
  employmentType: EmploymentTypeSchema,
});

export const UpdateJobPostingRequestSchema = CreateJobPostingRequestSchema.partial().extend({
  status: JobPostingStatusSchema.optional(),
});

// ==========================================
// Inferred TypeScript Types from Schemas
// ==========================================
export type RegisterUserRequest = z.infer<typeof RegisterUserRequestSchema>;
export type LoginUserRequest = z.infer<typeof LoginUserRequestSchema>;
export type AccountUpdateRequest = z.infer<typeof AccountUpdateRequestSchema>;
export type PasswordChangeRequest = z.infer<typeof PasswordChangeRequestSchema>;

export type UpdateCandidateProfileRequest = z.infer<typeof UpdateCandidateProfileRequestSchema>;

export type CreateFairRequest = z.infer<typeof CreateFairRequestSchema>;
export type UpdateFairRequest = z.infer<typeof UpdateFairRequestSchema>;

export type RequestFairAccessInput = z.infer<typeof RequestFairAccessSchema>;
export type InviteRecruiterInput = z.infer<typeof InviteRecruiterSchema>;
export type ReviewFairMembershipInput = z.infer<typeof ReviewFairMembershipSchema>;

export type CreateCompanyRequest = z.infer<typeof CreateCompanyRequestSchema>;
export type UpdateCompanyRequest = z.infer<typeof UpdateCompanyRequestSchema>;

export type CreateBoothRequest = z.infer<typeof CreateBoothRequestSchema>;
export type UpdateBoothRequest = z.infer<typeof UpdateBoothRequestSchema>;

export type CreateJobPostingRequest = z.infer<typeof CreateJobPostingRequestSchema>;
export type UpdateJobPostingRequest = z.infer<typeof UpdateJobPostingRequestSchema>;
