import type {
  AvatarConfig,
  Booth,
  CandidateProfile,
  Company,
  FairMembership,
  JobApplication,
  JobFair,
  JobPosting,
  LocalDatabase,
  LocalUser,
  UserRole,
} from "./types";
import { resolveFairTransition, type FairLifecycleAction } from "@maskedmatch/contracts";

const STORAGE_KEY = "maskedmatch.local.database.v1";
const listeners = new Set<() => void>();

const emptyDatabase = (): LocalDatabase => ({
  version: 1,
  sessionUserId: null,
  users: [],
  candidateProfiles: [],
  fairs: [],
  memberships: [],
  companies: [],
  booths: [],
  jobs: [],
  applications: [],
});

function loadDatabase(): LocalDatabase {
  if (typeof window === "undefined") return emptyDatabase();
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (!value) return emptyDatabase();
  try {
    const parsed = JSON.parse(value) as LocalDatabase;
    return parsed.version === 1 ? parsed : emptyDatabase();
  } catch {
    return emptyDatabase();
  }
}

let database = loadDatabase();

function emit(): void {
  listeners.forEach((listener) => listener());
}

function commit(next: LocalDatabase): void {
  database = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    database = loadDatabase();
    emit();
  });
}

export function subscribeDatabase(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getDatabaseSnapshot(): LocalDatabase {
  return database;
}

export function resetLocalDatabase(): void {
  commit(emptyDatabase());
}

function createId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID()}`;
}

function bytesToBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

async function passwordDigest(password: string, saltBase64: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = Uint8Array.from(atob(saltBase64), (character) => character.charCodeAt(0));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 120_000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  return bytesToBase64(new Uint8Array(bits));
}

export async function registerLocalUser(input: {
  email: string;
  displayName: string;
  password: string;
  role: UserRole;
}): Promise<LocalUser> {
  const email = input.email.trim().toLowerCase();
  if (database.users.some((user) => user.email === email)) {
    throw new Error("EMAIL_EXISTS");
  }
  if (input.password.length < 8) throw new Error("PASSWORD_TOO_SHORT");

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordSalt = bytesToBase64(salt);
  const user: LocalUser = {
    id: createId("usr"),
    email,
    displayName: input.displayName.trim(),
    role: input.role,
    passwordSalt,
    passwordHash: await passwordDigest(input.password, passwordSalt),
    createdAt: new Date().toISOString(),
  };

  commit({ ...database, users: [...database.users, user], sessionUserId: user.id });
  return user;
}

export async function loginLocalUser(emailInput: string, password: string): Promise<LocalUser> {
  const email = emailInput.trim().toLowerCase();
  const user = database.users.find((candidate) => candidate.email === email);
  if (!user) throw new Error("INVALID_CREDENTIALS");
  const hash = await passwordDigest(password, user.passwordSalt);
  if (hash !== user.passwordHash) throw new Error("INVALID_CREDENTIALS");
  commit({ ...database, sessionUserId: user.id });
  return user;
}

export function logoutLocalUser(): void {
  commit({ ...database, sessionUserId: null });
}

export function updateLocalUser(
  userId: string,
  input: { displayName: string; email: string },
): LocalUser {
  const email = input.email.trim().toLowerCase();
  if (database.users.some((user) => user.id !== userId && user.email === email)) {
    throw new Error("EMAIL_EXISTS");
  }
  const existing = database.users.find((user) => user.id === userId);
  if (!existing) throw new Error("USER_NOT_FOUND");
  const updated = { ...existing, displayName: input.displayName.trim(), email };
  commit({ ...database, users: database.users.map((user) => (user.id === userId ? updated : user)) });
  return updated;
}

export async function changeLocalPassword(
  userId: string,
  currentPassword: string,
  nextPassword: string,
): Promise<void> {
  const existing = database.users.find((user) => user.id === userId);
  if (!existing) throw new Error("USER_NOT_FOUND");
  if (nextPassword.length < 8) throw new Error("PASSWORD_TOO_SHORT");
  const currentHash = await passwordDigest(currentPassword, existing.passwordSalt);
  if (currentHash !== existing.passwordHash) throw new Error("INVALID_CREDENTIALS");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordSalt = bytesToBase64(salt);
  const passwordHash = await passwordDigest(nextPassword, passwordSalt);
  commit({
    ...database,
    users: database.users.map((user) =>
      user.id === userId ? { ...user, passwordSalt, passwordHash } : user,
    ),
  });
}

export function saveCandidateProfile(
  userId: string,
  input: Omit<CandidateProfile, "userId" | "updatedAt">,
): CandidateProfile {
  const profile: CandidateProfile = {
    ...input,
    userId,
    updatedAt: new Date().toISOString(),
  };
  commit({
    ...database,
    candidateProfiles: [
      ...database.candidateProfiles.filter((candidate) => candidate.userId !== userId),
      profile,
    ],
  });
  return profile;
}

export function createFair(ownerId: string, input: Omit<JobFair, "id" | "ownerId" | "createdAt">): JobFair {
  const fair: JobFair = {
    ...input,
    id: createId("fair"),
    ownerId,
    createdAt: new Date().toISOString(),
  };
  commit({ ...database, fairs: [...database.fairs, fair] });
  return fair;
}

export function updateFair(
  fairId: string,
  input: Partial<Omit<JobFair, "id" | "ownerId" | "createdAt">>,
): JobFair {
  const existing = database.fairs.find((fair) => fair.id === fairId);
  if (!existing) throw new Error("FAIR_NOT_FOUND");
  const updated: JobFair = { ...existing, ...input };
  commit({
    ...database,
    fairs: database.fairs.map((fair) => (fair.id === fairId ? updated : fair)),
  });
  return updated;
}

export function deleteFair(fairId: string): void {
  const boothIdsToDelete = new Set(
    database.booths.filter((b) => b.fairId === fairId).map((b) => b.id),
  );
  commit({
    ...database,
    fairs: database.fairs.filter((fair) => fair.id !== fairId),
    memberships: database.memberships.filter((m) => m.fairId !== fairId),
    booths: database.booths.filter((b) => b.fairId !== fairId),
    jobs: database.jobs.filter((j) => !boothIdsToDelete.has(j.boothId)),
  });
}

export function setFairStatus(fairId: string, status: JobFair["status"]): void {
  const existing = database.fairs.find((fair) => fair.id === fairId);
  if (!existing) throw new Error("FAIR_NOT_FOUND");
  commit({
    ...database,
    fairs: database.fairs.map((fair) => (fair.id === fairId ? { ...fair, status } : fair)),
  });
}

export function transitionFairStatus(
  fairId: string,
  action: FairLifecycleAction,
  now = new Date(),
): JobFair {
  const existing = database.fairs.find((fair) => fair.id === fairId);
  if (!existing) throw new Error("FAIR_NOT_FOUND");
  const status = resolveFairTransition(existing, action, now);
  const updated = { ...existing, status };
  commit({
    ...database,
    fairs: database.fairs.map((fair) => (fair.id === fairId ? updated : fair)),
  });
  return updated;
}

export function applyAutoScheduleTransitions(now = new Date()): number {
  let changed = 0;
  const nowMs = now.getTime();
  const fairs = database.fairs.map((fair) => {
    if (!fair.autoSchedule) return fair;
    const startsAt = new Date(fair.startsAt).getTime();
    const endsAt = new Date(fair.endsAt).getTime();
    if (Number.isNaN(startsAt) || Number.isNaN(endsAt) || endsAt <= startsAt) return fair;
    if (
      (fair.status === "PUBLISHED" || fair.status === "LIVE" || fair.status === "PAUSED") &&
      nowMs >= endsAt
    ) {
      changed += 1;
      return { ...fair, status: "ENDED" as const };
    }
    if (fair.status === "PUBLISHED" && nowMs >= startsAt && nowMs < endsAt) {
      changed += 1;
      return { ...fair, status: "LIVE" as const };
    }
    return fair;
  });
  if (changed > 0) commit({ ...database, fairs });
  return changed;
}

export function joinFair(
  userId: string,
  fairId: string,
  role: FairMembership["role"] = "CANDIDATE",
): FairMembership {
  const existing = database.memberships.find(
    (item) => item.userId === userId && item.fairId === fairId,
  );
  if (existing) return existing;
  const membership: FairMembership = {
    id: createId("member"),
    userId,
    fairId,
    role,
    status: role === "CANDIDATE" ? "ACTIVE" : "PENDING_APPROVAL",
    joinedAt: new Date().toISOString(),
  };
  commit({
    ...database,
    memberships: [...database.memberships, membership],
  });
  return membership;
}

export function requestRecruiterFairAccess(userId: string, fairId: string): FairMembership {
  const existing = database.memberships.find(
    (item) => item.userId === userId && item.fairId === fairId && item.role === "RECRUITER",
  );
  if (existing) {
    if (existing.status === "REJECTED") {
      const updated: FairMembership = {
        ...existing,
        status: "PENDING_APPROVAL",
        joinedAt: new Date().toISOString(),
        reviewedAt: undefined,
        reviewedBy: undefined,
      };
      commit({
        ...database,
        memberships: database.memberships.map((m) => (m.id === existing.id ? updated : m)),
      });
      return updated;
    }
    return existing;
  }
  const membership: FairMembership = {
    id: createId("member"),
    userId,
    fairId,
    role: "RECRUITER",
    status: "PENDING_APPROVAL",
    joinedAt: new Date().toISOString(),
  };
  commit({
    ...database,
    memberships: [...database.memberships, membership],
  });
  return membership;
}

export function inviteRecruiterToFair(
  fairId: string,
  email: string,
  adminUserId: string,
): FairMembership {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = database.users.find(
    (u) => u.email.toLowerCase() === normalizedEmail,
  );
  const targetUserId = existingUser ? existingUser.id : `pending_user_${normalizedEmail}`;

  const existingMembership = database.memberships.find(
    (m) =>
      m.fairId === fairId &&
      (m.userId === targetUserId || m.invitedEmail?.toLowerCase() === normalizedEmail),
  );

  if (existingMembership) {
    const updated: FairMembership = {
      ...existingMembership,
      status: existingMembership.status === "ACTIVE" ? "ACTIVE" : "INVITED",
      invitedEmail: normalizedEmail,
      reviewedBy: adminUserId,
      reviewedAt: new Date().toISOString(),
    };
    commit({
      ...database,
      memberships: database.memberships.map((m) =>
        m.id === existingMembership.id ? updated : m,
      ),
    });
    return updated;
  }

  const membership: FairMembership = {
    id: createId("member"),
    userId: targetUserId,
    fairId,
    role: "RECRUITER",
    status: "INVITED",
    invitedEmail: normalizedEmail,
    reviewedBy: adminUserId,
    reviewedAt: new Date().toISOString(),
    joinedAt: new Date().toISOString(),
  };
  commit({
    ...database,
    memberships: [...database.memberships, membership],
  });
  return membership;
}

export function reviewFairMembership(
  membershipId: string,
  status: "ACTIVE" | "REJECTED",
  adminUserId: string,
): FairMembership {
  const membership = database.memberships.find((m) => m.id === membershipId);
  if (!membership) throw new Error("MEMBERSHIP_NOT_FOUND");
  const updated: FairMembership = {
    ...membership,
    status,
    reviewedAt: new Date().toISOString(),
    reviewedBy: adminUserId,
  };
  commit({
    ...database,
    memberships: database.memberships.map((m) => (m.id === membershipId ? updated : m)),
  });
  return updated;
}

export function acceptFairInvitation(userId: string, fairId: string): FairMembership {
  const user = database.users.find((u) => u.id === userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  const membership = database.memberships.find(
    (m) =>
      m.fairId === fairId &&
      (m.userId === userId ||
        (m.invitedEmail && m.invitedEmail.toLowerCase() === user.email.toLowerCase())),
  );
  if (!membership) throw new Error("INVITATION_NOT_FOUND");
  const updated: FairMembership = {
    ...membership,
    userId,
    status: "ACTIVE",
    joinedAt: new Date().toISOString(),
  };
  commit({
    ...database,
    memberships: database.memberships.map((m) => (m.id === membership.id ? updated : m)),
  });
  return updated;
}

export function removeFairMembership(membershipId: string): void {
  const membership = database.memberships.find((m) => m.id === membershipId);
  if (!membership) return;
  commit({
    ...database,
    memberships: database.memberships.filter((m) => m.id !== membershipId),
  });
}

export function saveCompany(ownerId: string, input: Omit<Company, "id" | "ownerId" | "createdAt">): Company {
  const existing = database.companies.find((company) => company.ownerId === ownerId);
  const company: Company = existing
    ? { ...existing, ...input }
    : { ...input, id: createId("company"), ownerId, createdAt: new Date().toISOString() };
  commit({
    ...database,
    companies: [...database.companies.filter((item) => item.ownerId !== ownerId), company],
  });
  return company;
}

export function createBooth(
  ownerId: string,
  input: Omit<Booth, "id" | "ownerId" | "createdAt">,
): Booth {
  const booth: Booth = { ...input, id: createId("booth"), ownerId, createdAt: new Date().toISOString() };
  commit({ ...database, booths: [...database.booths, booth] });
  return booth;
}

export function updateBooth(
  boothId: string,
  input: Partial<Omit<Booth, "id" | "ownerId" | "createdAt">>,
): Booth {
  const existing = database.booths.find((booth) => booth.id === boothId);
  if (!existing) throw new Error("BOOTH_NOT_FOUND");
  const updated: Booth = { ...existing, ...input };
  commit({
    ...database,
    booths: database.booths.map((booth) => (booth.id === boothId ? updated : booth)),
  });
  return updated;
}

export function setBoothStatus(boothId: string, status: Booth["status"]): void {
  commit({
    ...database,
    booths: database.booths.map((booth) => (booth.id === boothId ? { ...booth, status } : booth)),
  });
}

export function deleteBooth(boothId: string): void {
  commit({
    ...database,
    booths: database.booths.filter((booth) => booth.id !== boothId),
    jobs: database.jobs.filter((job) => job.boothId !== boothId),
  });
}

export function createJob(input: Omit<JobPosting, "id" | "createdAt">): JobPosting {
  const job: JobPosting = { ...input, id: createId("job"), createdAt: new Date().toISOString() };
  commit({ ...database, jobs: [...database.jobs, job] });
  return job;
}

export function updateJob(
  jobId: string,
  input: Partial<Omit<JobPosting, "id" | "createdAt">>,
): JobPosting {
  const existing = database.jobs.find((job) => job.id === jobId);
  if (!existing) throw new Error("JOB_NOT_FOUND");
  const updated: JobPosting = { ...existing, ...input };
  commit({
    ...database,
    jobs: database.jobs.map((job) => (job.id === jobId ? updated : job)),
  });
  return updated;
}

export function setJobStatus(jobId: string, status: JobPosting["status"]): void {
  commit({
    ...database,
    jobs: database.jobs.map((job) => (job.id === jobId ? { ...job, status } : job)),
  });
}

export function deleteJob(jobId: string): void {
  commit({
    ...database,
    jobs: database.jobs.filter((job) => job.id !== jobId),
    applications: (database.applications || []).filter((app) => app.jobId !== jobId),
  });
}

export function applyToJob(input: {
  jobId: string;
  boothId: string;
  fairId: string;
  companyId: string;
  candidateUserId: string;
  matchScore: number;
}): JobApplication {
  const currentApps = database.applications || [];
  const existing = currentApps.find(
    (app) => app.jobId === input.jobId && app.candidateUserId === input.candidateUserId,
  );
  if (existing) return existing;

  const newApp: JobApplication = {
    id: createId("app"),
    jobId: input.jobId,
    boothId: input.boothId,
    fairId: input.fairId,
    companyId: input.companyId,
    candidateUserId: input.candidateUserId,
    status: "APPLIED",
    appliedAt: new Date().toISOString(),
    matchScore: input.matchScore,
    revealConsentGiven: false,
  };

  commit({
    ...database,
    applications: [...currentApps, newApp],
  });
  return newApp;
}

export function updateApplicationStatus(
  applicationId: string,
  status: JobApplication["status"],
  extra?: { interviewNote?: string; scheduledInterviewAt?: string },
): JobApplication {
  const currentApps = database.applications || [];
  const existing = currentApps.find((app) => app.id === applicationId);
  if (!existing) throw new Error("APPLICATION_NOT_FOUND");

  const updated: JobApplication = {
    ...existing,
    status,
    interviewNote: extra?.interviewNote !== undefined ? extra.interviewNote : existing.interviewNote,
    scheduledInterviewAt:
      extra?.scheduledInterviewAt !== undefined
        ? extra.scheduledInterviewAt
        : existing.scheduledInterviewAt,
  };

  commit({
    ...database,
    applications: currentApps.map((app) => (app.id === applicationId ? updated : app)),
  });
  return updated;
}

export function toggleApplicationRevealConsent(
  applicationId: string,
  revealConsentGiven: boolean,
): JobApplication {
  const currentApps = database.applications || [];
  const existing = currentApps.find((app) => app.id === applicationId);
  if (!existing) throw new Error("APPLICATION_NOT_FOUND");

  const updated: JobApplication = {
    ...existing,
    revealConsentGiven,
    status: revealConsentGiven && existing.status === "REVEAL_REQUESTED" ? "REVEALED" : existing.status,
  };

  commit({
    ...database,
    applications: currentApps.map((app) => (app.id === applicationId ? updated : app)),
  });
  return updated;
}

export function withdrawApplication(applicationId: string): void {
  const currentApps = database.applications || [];
  commit({
    ...database,
    applications: currentApps.filter((app) => app.id !== applicationId),
  });
}

export function updateUserAvatar(userId: string, avatarConfig: AvatarConfig): LocalUser {
  const user = database.users.find((item) => item.id === userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  const updatedUser: LocalUser = {
    ...user,
    avatarConfig,
  };
  commit({
    ...database,
    users: database.users.map((item) => (item.id === userId ? updatedUser : item)),
  });
  return updatedUser;
}
