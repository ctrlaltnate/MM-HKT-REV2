// ==========================================
// MaskedMatch Domain & State Types
// ==========================================

export type UserRole = 'candidate' | 'recruiter' | 'admin' | 'visitor';

export type SkinTone = 'light' | 'medium' | 'warm_tan' | 'deep';
export type HairStyle = 'short' | 'bob' | 'curly' | 'afro' | 'spiky' | 'ponytail' | 'bald' | 'mohawk';
export type HairColor = 'black' | 'brown' | 'blonde' | 'cyan' | 'neon_pink' | 'purple' | 'silver' | 'green';
export type OutfitStyle = 'cyber_hoodie' | 'business_suit' | 'retro_jacket' | 'casual_shirt' | 'tech_labcoat';
export type OutfitColor = 'purple' | 'cyan' | 'pink' | 'mango' | 'emerald' | 'crimson' | 'slate' | 'gold';
export type AnimalMask = 'fox' | 'cat' | 'bear' | 'owl' | 'cyber_visor';
export type CharacterDirection = 'down' | 'left' | 'right' | 'up';

export interface AvatarCustomizationConfig {
  skinTone: SkinTone;
  hairStyle: HairStyle;
  hairColor: HairColor;
  outfitStyle: OutfitStyle;
  outfitColor: OutfitColor;
  animalMask: AnimalMask;
  scale?: number;
}

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  proficiency: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  provenance: 'parsed' | 'candidate_confirmed' | 'verified';
  evidenceSnippet?: string;
}

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  skillsDemonstrated: string[];
  linkPreview?: string;
}

export interface MaskedCandidateProfile {
  candidateId: string;
  candidateCode: string; // e.g. "Candidate #8F3A"
  isVerified: boolean;
  verificationMethod: 'thaid' | 'email_otp';
  assuranceLevel: 'IAL2.3' | 'IAL1.0';
  skills: SkillItem[];
  evidence: EvidenceItem[];
  bioSummary: string;
  avatarConfig: AvatarCustomizationConfig;
  consents: {
    resumeProcessing: boolean;
    realtimeMediaTransform: boolean;
    integritySignals: boolean;
    marketing: boolean;
  };
  hiddenPiiData: {
    fullName: string;
    email: string;
    phone: string;
    institution: string;
    exactEmployer: string;
    rawResumeUrl?: string;
  };
  revealedFields: Array<'email' | 'phone' | 'portfolio' | 'fullResume'>;
  profileVersion: number;
}

export interface JobPosting {
  id: string;
  boothId: string;
  companyName: string;
  title: string;
  workMode: 'Hybrid' | 'Remote' | 'On-site';
  salaryRange: string;
  location: string;
  interviewMinutes: number;
  mustHaveSkills: string[];
  niceToHaveSkills: string[];
  responsibilities: string[];
  evidenceRequirements: string[];
  matchScore: number;
  matchConfidence: string;
  matchReasons: string[];
  uncertainReasons: string[];
}

export interface ExhibitorBooth {
  id: string;
  companyName: string;
  industry: string;
  zone: 'A1' | 'A2' | 'B1' | 'B2';
  themeColor: string;
  accentColor: string;
  tagline: string;
  description: string;
  techStack: string[];
  activeJobs: JobPosting[];
  recruiter: {
    id: string;
    codeName: string;
    title: string;
    status: 'ONLINE' | 'BREAK' | 'OFFLINE';
  };
  queueCount: number;
  avgWaitMinutes: number;
  coordinates: { x: number; y: number; width: number; height: number };
}

export type QueueState =
  | 'QUEUED'
  | 'PAUSED_BY_EVENT'
  | 'READY_CHECK'
  | 'ACCEPTED'
  | 'CONNECTING'
  | 'IN_SESSION'
  | 'COMPLETED'
  | 'EXPIRED'
  | 'REQUEUE_ELIGIBLE';

export interface QueueTicket {
  id: string;
  jobId: string;
  boothId: string;
  companyName: string;
  jobTitle: string;
  candidateId: string;
  candidateCode: string;
  position: number;
  estimatedWaitSeconds: number;
  state: QueueState;
  joinedAt: string;
  readyCheckExpiresAt?: string;
  snoozeCount: number;
  entityVersion: number;
}

export type InterviewState =
  | 'CREATED'
  | 'PREFLIGHT'
  | 'LOBBY'
  | 'CONNECTING'
  | 'LIVE'
  | 'WRAP_UP'
  | 'COMPLETED'
  | 'RECONNECTING'
  | 'CANCELLED_TECHNICAL';

export interface InterviewSession {
  id: string;
  ticketId: string;
  candidateId: string;
  candidateCode: string;
  recruiterId: string;
  recruiterName: string;
  companyName: string;
  jobTitle: string;
  state: InterviewState;
  durationSeconds: number;
  elapsedSeconds: number;
  remainingSeconds: number;
  startedAt?: string;
  mediaMode: 'REAL_MASK' | 'AVATAR_ONLY' | 'AUDIO_ONLY';
  isFailClosedActive: boolean;
  topic: string;
  notes: string;
}

export type DecisionChoice = 'INTERESTED' | 'PASS';

export type DecisionState =
  | 'AWAITING_DECISIONS'
  | 'ONE_DECISION_SUBMITTED'
  | 'MUTUAL_MATCH'
  | 'NO_MATCH'
  | 'REVEAL_PENDING'
  | 'PARTIALLY_REVEALED'
  | 'REVEALED';

export interface DecisionCase {
  id: string;
  sessionId: string;
  jobId: string;
  boothId: string;
  companyName: string;
  jobTitle: string;
  candidateCode: string;
  candidateDecision: DecisionChoice | null;
  recruiterDecision: DecisionChoice | null;
  state: DecisionState;
  submittedAtCandidate?: string;
  submittedAtRecruiter?: string;
  revealedFields: Array<'email' | 'phone' | 'portfolio' | 'fullResume'>;
  recruiterContactGrant?: {
    recruiterName: string;
    recruiterEmail: string;
    recruiterRole: string;
    nextStepsGuide: string;
  };
}

export interface AdminBroadcastMessage {
  id: string;
  message: string;
  timestamp: string;
  level: 'info' | 'warning' | 'urgent';
}

export interface EventState {
  id: string;
  nameTh: string;
  status: 'LIVE' | 'PAUSED' | 'ENDED';
  pauseReason?: string;
  totalCcu: number;
  activeQueues: number;
  liveInterviews: number;
  mutualMatches: number;
  broadcasts: AdminBroadcastMessage[];
}
