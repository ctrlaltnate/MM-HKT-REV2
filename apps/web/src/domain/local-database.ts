import type {
  Booth,
  CandidateProfile,
  Company,
  FairMembership,
  JobFair,
  JobPosting,
  LocalDatabase,
  LocalUser,
  UserRole,
} from "./types";

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

export function setFairStatus(fairId: string, status: JobFair["status"]): void {
  commit({
    ...database,
    fairs: database.fairs.map((fair) => (fair.id === fairId ? { ...fair, status } : fair)),
  });
}

export function joinFair(userId: string, fairId: string, role: FairMembership["role"]): void {
  if (database.memberships.some((item) => item.userId === userId && item.fairId === fairId)) return;
  commit({
    ...database,
    memberships: [
      ...database.memberships,
      { id: createId("member"), userId, fairId, role, joinedAt: new Date().toISOString() },
    ],
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

export function createJob(input: Omit<JobPosting, "id" | "createdAt">): JobPosting {
  const job: JobPosting = { ...input, id: createId("job"), createdAt: new Date().toISOString() };
  commit({ ...database, jobs: [...database.jobs, job] });
  return job;
}
