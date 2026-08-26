export type UserRole = "candidate" | "recruiter" | "admin";

export interface LocalUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  passwordHash: string;
  passwordSalt: string;
  createdAt: string;
}

export interface ResumeSkill {
  name: string;
  category: string;
  level: "FOUNDATIONAL" | "WORKING" | "ADVANCED" | "EXPERT" | "UNKNOWN";
  confidence: number;
  evidence: string[];
}

export interface ResumeAnalysis {
  candidateSummary: string;
  recruiterSummary: string;
  skills: ResumeSkill[];
  experience: Array<{
    role: string;
    industry: string;
    durationSummary: string;
    achievements: string[];
  }>;
  education: Array<{ degree: string; field: string; evidence: string }>;
  languages: string[];
  strengths: string[];
  gaps: string[];
  suggestedRoles: Array<{ title: string; reason: string }>;
  redactionWarnings: Array<{ type: string; description: string }>;
}

export interface CandidateProfile {
  userId: string;
  headline: string;
  region: string;
  preferredWorkMode: "REMOTE" | "HYBRID" | "ONSITE" | "FLEXIBLE";
  about: string;
  manualSkills: string[];
  shareWithJoinedFairs: boolean;
  resume?: {
    fileName: string;
    size: number;
    uploadedAt: string;
    extractedText: string;
    analysis?: ResumeAnalysis;
    analyzedAt?: string;
  };
  updatedAt: string;
}

export interface JobFair {
  id: string;
  ownerId: string;
  title: string;
  slug: string;
  summary: string;
  locationLabel: string;
  startsAt: string;
  endsAt: string;
  status: "DRAFT" | "PUBLISHED" | "LIVE" | "ENDED";
  createdAt: string;
}

export interface FairMembership {
  id: string;
  fairId: string;
  userId: string;
  role: "CANDIDATE" | "RECRUITER";
  joinedAt: string;
}

export interface Company {
  id: string;
  ownerId: string;
  name: string;
  industry: string;
  summary: string;
  website: string;
  workLocations: string;
  createdAt: string;
}

export interface Booth {
  id: string;
  fairId: string;
  companyId: string;
  ownerId: string;
  name: string;
  summary: string;
  technologyTags: string[];
  accessibilityNote: string;
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
}

export interface JobPosting {
  id: string;
  boothId: string;
  companyId: string;
  title: string;
  summary: string;
  responsibilities: string;
  mustHave: string[];
  niceToHave: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
  status: "DRAFT" | "PUBLISHED";
  createdAt: string;
}

export interface LocalDatabase {
  version: 1;
  sessionUserId: string | null;
  users: LocalUser[];
  candidateProfiles: CandidateProfile[];
  fairs: JobFair[];
  memberships: FairMembership[];
  companies: Company[];
  booths: Booth[];
  jobs: JobPosting[];
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    requestId?: string;
    retryable: boolean;
  };
}
