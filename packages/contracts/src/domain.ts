export type UserRole = "candidate" | "recruiter" | "admin";

export interface AvatarConfig {
  skinTone: string;
  hairStyle: string;
  hairColor: string;
  eyeStyle: string;
  eyeColor: string;
  mouthStyle: string;
  accessory: string;
  shirtStyle?: string;
  shirtColor: string;
  shirtSecondaryColor?: string;
  backgroundTone?: string;
}

export interface AppUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
  avatarConfig?: AvatarConfig;
}

export interface LocalUser extends AppUser {
  passwordHash: string;
  passwordSalt: string;
}

export type SkillLevel = "FOUNDATIONAL" | "WORKING" | "ADVANCED" | "EXPERT" | "UNKNOWN";

export interface ResumeSkill {
  name: string;
  category: string;
  level: SkillLevel;
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

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE" | "FLEXIBLE";

export interface CandidateExperience {
  id: string;
  role: string;
  companyName?: string;
  durationSummary: string;
  achievements: string[];
}

export interface CandidateEducation {
  id: string;
  degree: string;
  field: string;
  institution?: string;
}

export interface CandidateProfile {
  userId: string;
  headline: string;
  region: string;
  preferredWorkMode: WorkMode;
  about: string;
  manualSkills: string[];
  targetRoles?: string[];
  experiences?: CandidateExperience[];
  educationList?: CandidateEducation[];
  languages?: string[];
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

export type FairStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "LIVE"
  | "PAUSED"
  | "CANCELLED"
  | "ENDED"
  | "ARCHIVED";

export interface FairMediaLink {
  id: string;
  title: string;
  url: string;
  type?: "video" | "website" | "deck" | "livestream" | "social" | "other";
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
  timezone?: string;
  logoUrl?: string;
  coverUrl?: string;
  autoSchedule?: boolean;
  mediaLinks?: FairMediaLink[];
  tags?: string[];
  status: FairStatus;
  createdAt: string;
}

export type OperationsScope = "ENTRY_AND_QUEUES" | "ENTRY_ONLY" | "QUEUES_ONLY";
export type IntegrationHealthStatus = "OPERATIONAL" | "DEGRADED" | "UNAVAILABLE";
export type IntegrationHealthService =
  | "AUTH"
  | "PROFILE_WORKER"
  | "OBJECT_STORAGE"
  | "REALTIME"
  | "MEDIA"
  | "NOTIFICATION"
  | "AUDIT";

/**
 * Aggregate-only operations data. This contract intentionally excludes participant
 * identity, private decisions, reveal values, credentials, and provider secrets.
 */
export interface OperationsMetrics {
  concurrentUsers: number;
  instanceCapacity: number;
  queueDepth: number;
  availableRecruiters: number;
  liveInterviews: number;
  callHealthPercent: number | null;
  mutualMatches: number;
  openIncidents: number;
}

export interface IntegrationHealthItem {
  service: IntegrationHealthService;
  status: IntegrationHealthStatus;
  summary: string;
  checkedAt: string;
  recoveryAction: string;
}

export interface OperationsBroadcast {
  id: string;
  message: string;
  createdAt: string;
  deliveryMode: "LOCAL_SIMULATION" | "CONNECTED";
}

export interface OperationsAuditEvent {
  id: string;
  eventId: string;
  action: "PAUSE" | "RESUME" | "BROADCAST" | "INTEGRATION_RECHECK";
  reason: string;
  scope?: OperationsScope;
  createdAt: string;
  actorLabel: string;
}

export interface EventOperationsSnapshot {
  eventId: string;
  eventState: Extract<FairStatus, "LIVE" | "PAUSED" | "ENDED">;
  version: number;
  updatedAt: string;
  mode: "LOCAL_SIMULATION" | "CONNECTED";
  pauseScope?: OperationsScope;
  pauseReason?: string;
  metrics: OperationsMetrics;
  integrations: IntegrationHealthItem[];
  broadcasts: OperationsBroadcast[];
  auditTrail: OperationsAuditEvent[];
}

export type FairMembershipStatus = "ACTIVE" | "PENDING_APPROVAL" | "REJECTED" | "INVITED";

export interface FairMembership {
  id: string;
  fairId: string;
  userId: string;
  role: "CANDIDATE" | "RECRUITER";
  status: FairMembershipStatus;
  joinedAt: string;
  invitedEmail?: string;
  reviewedAt?: string;
  reviewedBy?: string;
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

export type BoothStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Booth {
  id: string;
  fairId: string;
  companyId: string;
  ownerId: string;
  name: string;
  summary: string;
  technologyTags: string[];
  accessibilityNote: string;
  status: BoothStatus;
  assignedJobIds?: string[];
  createdAt: string;
}

export type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP";
export type JobPostingStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface JobPosting {
  id: string;
  companyId: string;
  boothId?: string;
  title: string;
  summary: string;
  responsibilities: string;
  mustHave: string[];
  niceToHave: string[];
  headcount?: number;
  salaryMin: number | null;
  salaryMax: number | null;
  workMode: "REMOTE" | "HYBRID" | "ONSITE";
  employmentType: EmploymentType;
  status: JobPostingStatus;
  createdAt: string;
}

export type ApplicationStatus =
  | "APPLIED"
  | "SHORTLISTED"
  | "REVEAL_REQUESTED"
  | "REVEALED"
  | "INTERVIEW_SCHEDULED"
  | "REJECTED";

export interface JobApplication {
  id: string;
  jobId: string;
  boothId: string;
  fairId: string;
  companyId: string;
  candidateUserId: string;
  status: ApplicationStatus;
  appliedAt: string;
  matchScore: number;
  revealConsentGiven: boolean;
  interviewNote?: string;
  scheduledInterviewAt?: string;
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
  applications?: JobApplication[];
}

export interface ApiErrorEnvelope {
  error: {
    code: string;
    message: string;
    requestId?: string;
    retryable: boolean;
  };
}

export interface MatchInsight {
  matchedSkills: string[];
  missingSkills: string[];
  score: number;
  recommendationLevel: "HIGH" | "MEDIUM" | "LOW";
}
