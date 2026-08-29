import crypto from "node:crypto";
import type {
  AppUser,
  LocalUser,
  JobFair,
  FairMembership,
  Company,
  Booth,
  JobPosting,
  CandidateProfile,
  UserRole,
  FairStatus,
  BoothStatus,
  JobPostingStatus,
  FairMembershipStatus,
  RegisterUserRequest,
  CreateFairRequest,
  UpdateFairRequest,
  CreateCompanyRequest,
  UpdateCompanyRequest,
  CreateBoothRequest,
  UpdateBoothRequest,
  CreateJobPostingRequest,
  UpdateJobPostingRequest,
  UpdateCandidateProfileRequest,
} from "@maskedmatch/contracts";

function hashPassword(password: string, saltHex?: string): { hash: string; salt: string } {
  const salt = saltHex ?? crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return { hash, salt };
}

function verifyPassword(password: string, salt: string, hash: string): boolean {
  const calculated = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(calculated, "hex"), Buffer.from(hash, "hex"));
}

export class DataStore {
  private users: LocalUser[] = [];
  private fairs: JobFair[] = [];
  private memberships: FairMembership[] = [];
  private companies: Company[] = [];
  private booths: Booth[] = [];
  private jobs: JobPosting[] = [];
  private candidateProfiles: CandidateProfile[] = [];

  constructor() {
    this.seedDefaultAdmin();
  }

  public reset(): void {
    this.users = [];
    this.fairs = [];
    this.memberships = [];
    this.companies = [];
    this.booths = [];
    this.jobs = [];
    this.candidateProfiles = [];
    this.seedDefaultAdmin();
  }

  private seedDefaultAdmin(): void {
    const adminEmail = "admin@maskedmatch.local";
    const { hash, salt } = hashPassword("Admin123456!");
    this.users.push({
      id: "user_admin_root",
      email: adminEmail,
      displayName: "System Admin",
      role: "admin",
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
    });
  }

  // ==========================================
  // Users & Auth
  // ==========================================
  public createUser(input: RegisterUserRequest): AppUser {
    const existing = this.users.find((u) => u.email.toLowerCase() === input.email.toLowerCase());
    if (existing) {
      throw new Error("อีเมลนี้ถูกใช้งานในระบบแล้ว");
    }
    const { hash, salt } = hashPassword(input.password);
    const id = `user_${crypto.randomUUID()}`;
    const now = new Date().toISOString();

    const user: LocalUser = {
      id,
      email: input.email,
      displayName: input.displayName,
      role: input.role,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: now,
    };
    this.users.push(user);

    if (input.role === "candidate") {
      this.candidateProfiles.push({
        userId: id,
        headline: "",
        region: "",
        preferredWorkMode: "HYBRID",
        about: "",
        manualSkills: [],
        shareWithJoinedFairs: false,
        updatedAt: now,
      });
    }

    return this.toAppUser(user);
  }

  public findUserByEmail(email: string): LocalUser | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): LocalUser | undefined {
    return this.users.find((u) => u.id === id);
  }

  public authenticate(email: string, password: string): AppUser | null {
    const user = this.findUserByEmail(email);
    if (!user) return null;
    const isValid = verifyPassword(password, user.passwordSalt, user.passwordHash);
    if (!isValid) return null;
    return this.toAppUser(user);
  }

  public updateUserAccount(userId: string, input: { displayName: string; email: string }): AppUser {
    const user = this.findUserById(userId);
    if (!user) throw new Error("ไม่พบผู้ใช้งานในระบบ");

    const duplicate = this.users.find(
      (u) => u.id !== userId && u.email.toLowerCase() === input.email.toLowerCase(),
    );
    if (duplicate) throw new Error("อีเมลนี้ถูกใช้งานโดยบัญชีอื่นแล้ว");

    user.displayName = input.displayName;
    user.email = input.email;
    return this.toAppUser(user);
  }

  public changePassword(userId: string, currentPassword: string, newPassword: string): void {
    const user = this.findUserById(userId);
    if (!user) throw new Error("ไม่พบผู้ใช้งานในระบบ");

    const isValid = verifyPassword(currentPassword, user.passwordSalt, user.passwordHash);
    if (!isValid) throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");

    const { hash, salt } = hashPassword(newPassword);
    user.passwordHash = hash;
    user.passwordSalt = salt;
  }

  public toAppUser(user: LocalUser): AppUser {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }

  // ==========================================
  // Job Fairs
  // ==========================================
  public getFairs(role?: UserRole): JobFair[] {
    if (role === "admin") {
      return [...this.fairs];
    }
    return this.fairs.filter((f) => f.status !== "ARCHIVED");
  }

  public getFairById(id: string): JobFair | undefined {
    return this.fairs.find((f) => f.id === id);
  }

  public getFairBySlug(slug: string): JobFair | undefined {
    return this.fairs.find((f) => f.slug === slug);
  }

  public createFair(ownerId: string, input: CreateFairRequest): JobFair {
    const existingSlug = this.fairs.find((f) => f.slug === input.slug);
    if (existingSlug) {
      throw new Error(`Slug '${input.slug}' ถูกใช้งานแล้ว กรุณาเลือก slug อื่น`);
    }

    const fair: JobFair = {
      id: `fair_${crypto.randomUUID()}`,
      ownerId,
      title: input.title,
      slug: input.slug,
      summary: input.summary,
      locationLabel: input.locationLabel,
      startsAt: input.startsAt,
      endsAt: input.endsAt,
      timezone: input.timezone || "Asia/Bangkok (UTC+7)",
      logoUrl: input.logoUrl,
      coverUrl: input.coverUrl,
      autoSchedule: input.autoSchedule ?? false,
      mediaLinks: input.mediaLinks || [],
      tags: input.tags || [],
      status: "DRAFT",
      createdAt: new Date().toISOString(),
    };
    this.fairs.push(fair);
    return fair;
  }

  public updateFair(id: string, input: UpdateFairRequest): JobFair {
    const fair = this.getFairById(id);
    if (!fair) throw new Error("ไม่พบงานแฟร์ที่ต้องการแก้ไข");

    if (input.slug && input.slug !== fair.slug) {
      const duplicate = this.fairs.find((f) => f.id !== id && f.slug === input.slug);
      if (duplicate) throw new Error(`Slug '${input.slug}' ถูกใช้งานแล้ว`);
    }

    Object.assign(fair, input);
    return fair;
  }

  public deleteFair(id: string): void {
    const fair = this.getFairById(id);
    if (!fair) throw new Error("ไม่พบงานแฟร์ที่ต้องการลบ");

    // Cascading delete booths and jobs under this fair
    const boothIds = this.booths.filter((b) => b.fairId === id).map((b) => b.id);
    this.jobs = this.jobs.filter((j) => !j.boothId || !boothIds.includes(j.boothId));
    this.booths = this.booths.filter((b) => b.fairId !== id);
    this.memberships = this.memberships.filter((m) => m.fairId !== id);
    this.fairs = this.fairs.filter((f) => f.id !== id);
  }

  // ==========================================
  // Fair Memberships
  // ==========================================
  public getMembershipsByFair(fairId: string): FairMembership[] {
    return this.memberships.filter((m) => m.fairId === fairId);
  }

  public getMembershipsByUser(userId: string): FairMembership[] {
    return this.memberships.filter((m) => m.userId === userId);
  }

  public joinFairAsCandidate(fairId: string, candidateId: string): FairMembership {
    const fair = this.getFairById(fairId);
    if (!fair) throw new Error("ไม่พบงานแฟร์");

    const existing = this.memberships.find((m) => m.fairId === fairId && m.userId === candidateId);
    if (existing) return existing;

    const membership: FairMembership = {
      id: `mem_${crypto.randomUUID()}`,
      fairId,
      userId: candidateId,
      role: "CANDIDATE",
      status: "ACTIVE",
      joinedAt: new Date().toISOString(),
    };
    this.memberships.push(membership);
    return membership;
  }

  public requestRecruiterFairAccess(fairId: string, recruiterId: string): FairMembership {
    const fair = this.getFairById(fairId);
    if (!fair) throw new Error("ไม่พบงานแฟร์");

    const existing = this.memberships.find((m) => m.fairId === fairId && m.userId === recruiterId);
    if (existing) {
      if (existing.status === "ACTIVE") return existing;
      existing.status = "PENDING_APPROVAL";
      existing.joinedAt = new Date().toISOString();
      return existing;
    }

    const membership: FairMembership = {
      id: `mem_${crypto.randomUUID()}`,
      fairId,
      userId: recruiterId,
      role: "RECRUITER",
      status: "PENDING_APPROVAL",
      joinedAt: new Date().toISOString(),
    };
    this.memberships.push(membership);
    return membership;
  }

  public inviteRecruiterToFair(fairId: string, email: string): FairMembership {
    const fair = this.getFairById(fairId);
    if (!fair) throw new Error("ไม่พบงานแฟร์");

    const existing = this.memberships.find(
      (m) => m.fairId === fairId && m.invitedEmail?.toLowerCase() === email.toLowerCase(),
    );
    if (existing) return existing;

    const registeredRecruiter = this.findUserByEmail(email);

    const membership: FairMembership = {
      id: `mem_${crypto.randomUUID()}`,
      fairId,
      userId: registeredRecruiter ? registeredRecruiter.id : `pending_${crypto.randomUUID()}`,
      role: "RECRUITER",
      status: "INVITED",
      invitedEmail: email.toLowerCase(),
      joinedAt: new Date().toISOString(),
    };
    this.memberships.push(membership);
    return membership;
  }

  public reviewFairMembership(
    membershipId: string,
    decision: "APPROVE" | "REJECT",
    reviewerId: string,
  ): FairMembership {
    const membership = this.memberships.find((m) => m.id === membershipId);
    if (!membership) throw new Error("ไม่พบข้อมูลสมาชิกที่ต้องการตรวจสอบ");

    membership.status = decision === "APPROVE" ? "ACTIVE" : "REJECTED";
    membership.reviewedAt = new Date().toISOString();
    membership.reviewedBy = reviewerId;
    return membership;
  }

  public acceptFairInvitation(membershipId: string, recruiterId: string): FairMembership {
    const membership = this.memberships.find((m) => m.id === membershipId);
    if (!membership) throw new Error("ไม่พบคำเชิญ");

    membership.userId = recruiterId;
    membership.status = "ACTIVE";
    membership.joinedAt = new Date().toISOString();
    return membership;
  }

  public removeFairMembership(membershipId: string): void {
    this.memberships = this.memberships.filter((m) => m.id !== membershipId);
  }

  // ==========================================
  // Companies & Booths
  // ==========================================
  public getCompanies(ownerId?: string): Company[] {
    if (ownerId) {
      return this.companies.filter((c) => c.ownerId === ownerId);
    }
    return [...this.companies];
  }

  public getCompanyById(id: string): Company | undefined {
    return this.companies.find((c) => c.id === id);
  }

  public createCompany(ownerId: string, input: CreateCompanyRequest): Company {
    const company: Company = {
      id: `comp_${crypto.randomUUID()}`,
      ownerId,
      name: input.name,
      industry: input.industry,
      summary: input.summary,
      website: input.website,
      workLocations: input.workLocations,
      createdAt: new Date().toISOString(),
    };
    this.companies.push(company);
    return company;
  }

  public updateCompany(id: string, input: UpdateCompanyRequest): Company {
    const company = this.getCompanyById(id);
    if (!company) throw new Error("ไม่พบข้อมูลบริษัท");
    Object.assign(company, input);
    return company;
  }

  public getBooths(fairId?: string, ownerId?: string): Booth[] {
    let result = [...this.booths];
    if (fairId) result = result.filter((b) => b.fairId === fairId);
    if (ownerId) result = result.filter((b) => b.ownerId === ownerId);
    return result;
  }

  public getBoothById(id: string): Booth | undefined {
    return this.booths.find((b) => b.id === id);
  }

  public createBooth(ownerId: string, input: CreateBoothRequest): Booth {
    const isApproved = this.memberships.some(
      (m) => m.fairId === input.fairId && m.userId === ownerId && m.status === "ACTIVE",
    );
    if (!isApproved) {
      throw new Error("คุณยังไม่ได้รับอนุมัติให้เปิดบูธในงานแฟร์นี้");
    }

    const booth: Booth = {
      id: `booth_${crypto.randomUUID()}`,
      fairId: input.fairId,
      companyId: input.companyId,
      ownerId,
      name: input.name,
      summary: input.summary,
      technologyTags: input.technologyTags,
      accessibilityNote: input.accessibilityNote ?? "",
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
    };
    this.booths.push(booth);
    return booth;
  }

  public updateBooth(id: string, input: UpdateBoothRequest): Booth {
    const booth = this.getBoothById(id);
    if (!booth) throw new Error("ไม่พบข้อมูลบูธ");
    Object.assign(booth, input);
    return booth;
  }

  public deleteBooth(id: string): void {
    const booth = this.getBoothById(id);
    if (!booth) throw new Error("ไม่พบข้อมูลบูธ");
    this.jobs = this.jobs.filter((j) => j.boothId !== id);
    this.booths = this.booths.filter((b) => b.id !== id);
  }

  // ==========================================
  // Job Postings
  // ==========================================
  public getJobs(boothId?: string): JobPosting[] {
    if (boothId) {
      return this.jobs.filter((j) => j.boothId === boothId);
    }
    return [...this.jobs];
  }

  public getJobById(id: string): JobPosting | undefined {
    return this.jobs.find((j) => j.id === id);
  }

  public createJob(ownerId: string, input: CreateJobPostingRequest): JobPosting {
    const booth = this.getBoothById(input.boothId);
    if (!booth || booth.ownerId !== ownerId) {
      throw new Error("คุณไม่มีสิทธิ์สร้างตำแหน่งงานในบูธนี้");
    }

    const job: JobPosting = {
      id: `job_${crypto.randomUUID()}`,
      boothId: input.boothId,
      companyId: input.companyId,
      title: input.title,
      summary: input.summary,
      responsibilities: input.responsibilities,
      mustHave: input.mustHave,
      niceToHave: input.niceToHave ?? [],
      salaryMin: input.salaryMin,
      salaryMax: input.salaryMax,
      workMode: input.workMode,
      employmentType: input.employmentType,
      status: "PUBLISHED",
      createdAt: new Date().toISOString(),
    };
    this.jobs.push(job);
    return job;
  }

  public updateJob(id: string, input: UpdateJobPostingRequest): JobPosting {
    const job = this.getJobById(id);
    if (!job) throw new Error("ไม่พบข้อมูลตำแหน่งงาน");
    Object.assign(job, input);
    return job;
  }

  public deleteJob(id: string): void {
    const job = this.getJobById(id);
    if (!job) throw new Error("ไม่พบข้อมูลตำแหน่งงาน");
    this.jobs = this.jobs.filter((j) => j.id !== id);
  }

  // ==========================================
  // Candidate Profile
  // ==========================================
  public getCandidateProfile(userId: string): CandidateProfile | undefined {
    return this.candidateProfiles.find((p) => p.userId === userId);
  }

  public updateCandidateProfile(userId: string, input: UpdateCandidateProfileRequest): CandidateProfile {
    let profile = this.candidateProfiles.find((p) => p.userId === userId);
    const now = new Date().toISOString();
    if (!profile) {
      profile = {
        userId,
        headline: input.headline,
        region: input.region,
        preferredWorkMode: input.preferredWorkMode,
        about: input.about,
        manualSkills: input.manualSkills,
        shareWithJoinedFairs: input.shareWithJoinedFairs,
        updatedAt: now,
      };
      this.candidateProfiles.push(profile);
    } else {
      Object.assign(profile, input, { updatedAt: now });
    }
    return profile;
  }
}

export const dataStore = new DataStore();
