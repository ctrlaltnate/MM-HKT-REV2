import { beforeEach, describe, expect, it } from "vitest";

import {
  createBooth,
  updateBooth,
  setBoothStatus,
  deleteBooth,
  createFair,
  updateFair,
  deleteFair,
  createJob,
  updateJob,
  setJobStatus,
  deleteJob,
  changeLocalPassword,
  getDatabaseSnapshot,
  joinFair,
  requestRecruiterFairAccess,
  inviteRecruiterToFair,
  reviewFairMembership,
  acceptFairInvitation,
  removeFairMembership,
  loginLocalUser,
  logoutLocalUser,
  registerLocalUser,
  resetLocalDatabase,
  saveCompany,
  setFairStatus,
  updateLocalUser,
} from "./local-database";

beforeEach(() => resetLocalDatabase());

describe("local identity", () => {
  it("hashes the password and restores a local session with valid credentials", async () => {
    const user = await registerLocalUser({
      displayName: "Candidate One",
      email: "candidate@example.com",
      password: "correct-horse",
      role: "candidate",
    });

    expect(user.passwordHash).not.toBe("correct-horse");
    expect(getDatabaseSnapshot().sessionUserId).toBe(user.id);

    logoutLocalUser();
    await expect(loginLocalUser("candidate@example.com", "wrong-password")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
    await loginLocalUser("candidate@example.com", "correct-horse");
    expect(getDatabaseSnapshot().sessionUserId).toBe(user.id);
  });

  it("updates account details and requires the current password before changing it", async () => {
    const user = await registerLocalUser({
      displayName: "Old Name",
      email: "old@example.com",
      password: "old-password",
      role: "candidate",
    });

    updateLocalUser(user.id, { displayName: "New Name", email: "new@example.com" });
    await expect(changeLocalPassword(user.id, "incorrect", "new-password")).rejects.toThrow("INVALID_CREDENTIALS");
    await changeLocalPassword(user.id, "old-password", "new-password");
    logoutLocalUser();

    await expect(loginLocalUser("new@example.com", "old-password")).rejects.toThrow("INVALID_CREDENTIALS");
    await loginLocalUser("new@example.com", "new-password");
    expect(getDatabaseSnapshot().users[0]).toMatchObject({ displayName: "New Name", email: "new@example.com" });
  });
});

describe("multi-role preparation data", () => {
  it("connects a published fair, recruiter booth, job and candidate membership", async () => {
    const admin = await registerLocalUser({
      displayName: "Admin",
      email: "admin@example.com",
      password: "admin-password",
      role: "admin",
    });
    const fair = createFair(admin.id, {
      title: "Tech Fair",
      slug: "tech-fair",
      summary: "A fair",
      locationLabel: "Online",
      startsAt: "2026-09-01T02:00:00.000Z",
      endsAt: "2026-09-01T10:00:00.000Z",
      status: "DRAFT",
    });
    setFairStatus(fair.id, "PUBLISHED");

    logoutLocalUser();
    const recruiter = await registerLocalUser({
      displayName: "Recruiter",
      email: "recruiter@example.com",
      password: "recruiter-password",
      role: "recruiter",
    });
    const company = saveCompany(recruiter.id, {
      name: "Example Company",
      industry: "Technology",
      summary: "Builds products",
      website: "https://example.com",
      workLocations: "Bangkok",
    });
    const booth = createBooth(recruiter.id, {
      fairId: fair.id,
      companyId: company.id,
      name: "Engineering Booth",
      summary: "Meet the team",
      technologyTags: ["TypeScript"],
      accessibilityNote: "Text channel available",
      status: "PUBLISHED",
    });
    createJob({
      boothId: booth.id,
      companyId: company.id,
      title: "Frontend Engineer",
      summary: "Build interfaces",
      responsibilities: "Ship accessible UI",
      mustHave: ["TypeScript"],
      niceToHave: ["React"],
      salaryMin: 50_000,
      salaryMax: 80_000,
      workMode: "HYBRID",
      employmentType: "FULL_TIME",
      status: "PUBLISHED",
    });

    logoutLocalUser();
    const candidate = await registerLocalUser({
      displayName: "Candidate",
      email: "join@example.com",
      password: "candidate-password",
      role: "candidate",
    });
    joinFair(candidate.id, fair.id, "CANDIDATE");

    const snapshot = getDatabaseSnapshot();
    expect(snapshot.fairs[0]?.status).toBe("PUBLISHED");
    expect(snapshot.booths[0]?.fairId).toBe(fair.id);
    expect(snapshot.jobs[0]?.boothId).toBe(booth.id);
    expect(snapshot.memberships[0]).toMatchObject({ userId: candidate.id, fairId: fair.id });
  });

  it("supports update, archive, and delete operations for fairs, booths, and jobs (WEB-CRUD-01)", async () => {
    const admin = await registerLocalUser({
      displayName: "Admin",
      email: "admin2@example.com",
      password: "admin-password",
      role: "admin",
    });
    const fair = createFair(admin.id, {
      title: "Initial Fair",
      slug: "initial-fair",
      summary: "Initial summary",
      locationLabel: "Remote",
      startsAt: "2026-09-01T00:00:00.000Z",
      endsAt: "2026-09-02T00:00:00.000Z",
      status: "DRAFT",
    });

    // Update fair
    const updatedFair = updateFair(fair.id, {
      title: "Updated Fair Title",
      summary: "Updated summary text",
    });
    expect(updatedFair.title).toBe("Updated Fair Title");
    expect(updatedFair.summary).toBe("Updated summary text");

    // Change status to ARCHIVED
    setFairStatus(fair.id, "ARCHIVED");
    expect(getDatabaseSnapshot().fairs.find((f) => f.id === fair.id)?.status).toBe("ARCHIVED");

    // Create recruiter, booth, and job
    const recruiter = await registerLocalUser({
      displayName: "Recruiter 2",
      email: "recruiter2@example.com",
      password: "recruiter-password",
      role: "recruiter",
    });
    const company = saveCompany(recruiter.id, {
      name: "Acme Corp",
      industry: "Design",
      summary: "Creative studio",
      website: "https://acme.example.com",
      workLocations: "Chiang Mai",
    });
    const booth = createBooth(recruiter.id, {
      fairId: fair.id,
      companyId: company.id,
      name: "Acme Design Booth",
      summary: "Design positions",
      technologyTags: ["Figma"],
      accessibilityNote: "Sign language interpreter on call",
      status: "DRAFT",
    });

    // Update booth
    const updatedBooth = updateBooth(booth.id, {
      name: "Acme Studio Booth",
      technologyTags: ["Figma", "UI/UX"],
    });
    expect(updatedBooth.name).toBe("Acme Studio Booth");
    expect(updatedBooth.technologyTags).toEqual(["Figma", "UI/UX"]);

    // Set booth status
    setBoothStatus(booth.id, "PUBLISHED");
    expect(getDatabaseSnapshot().booths.find((b) => b.id === booth.id)?.status).toBe("PUBLISHED");

    // Create, update, set status, delete job
    const job = createJob({
      boothId: booth.id,
      companyId: company.id,
      title: "UI Designer",
      summary: "Craft 8-bit UI",
      responsibilities: "Design systems",
      mustHave: ["Figma"],
      niceToHave: ["Pixel Art"],
      salaryMin: 40_000,
      salaryMax: 65_000,
      workMode: "REMOTE",
      employmentType: "FULL_TIME",
      status: "DRAFT",
    });

    const updatedJob = updateJob(job.id, {
      title: "Senior UI Designer",
      salaryMin: 55_000,
    });
    expect(updatedJob.title).toBe("Senior UI Designer");
    expect(updatedJob.salaryMin).toBe(55_000);

    setJobStatus(job.id, "ARCHIVED");
    expect(getDatabaseSnapshot().jobs.find((j) => j.id === job.id)?.status).toBe("ARCHIVED");

    deleteJob(job.id);
    expect(getDatabaseSnapshot().jobs.find((j) => j.id === job.id)).toBeUndefined();

    // Delete fair cascades to associated booths and jobs
    deleteFair(fair.id);
    expect(getDatabaseSnapshot().fairs.find((f) => f.id === fair.id)).toBeUndefined();
    expect(getDatabaseSnapshot().booths.find((b) => b.id === booth.id)).toBeUndefined();
  });

  it("handles fair membership requests, admin approvals, invitations, and acceptances", async () => {
    const admin = await registerLocalUser({
      displayName: "Fair Organizer",
      email: "organizer@fair.org",
      password: "adminpassword123",
      role: "admin",
    });
    const recruiter = await registerLocalUser({
      displayName: "Talent Scout",
      email: "scout@company.com",
      password: "recruiterpassword123",
      role: "recruiter",
    });
    const candidate = await registerLocalUser({
      displayName: "Software Engineer",
      email: "engineer@candidate.com",
      password: "candidatepassword123",
      role: "candidate",
    });

    const fair = createFair(admin.id, {
      title: "Tech Talents 2026",
      slug: "tech-talents-2026",
      summary: "Annual hiring event",
      locationLabel: "Bangkok",
      startsAt: "2026-09-01T09:00:00.000Z",
      endsAt: "2026-09-01T18:00:00.000Z",
      status: "PUBLISHED",
    });

    // 1. Candidate joins fair -> status ACTIVE immediately
    const candMembership = joinFair(candidate.id, fair.id, "CANDIDATE");
    expect(candMembership.status).toBe("ACTIVE");
    expect(candMembership.role).toBe("CANDIDATE");

    // 2. Recruiter requests access -> status PENDING_APPROVAL
    const reqMembership = requestRecruiterFairAccess(recruiter.id, fair.id);
    expect(reqMembership.status).toBe("PENDING_APPROVAL");
    expect(reqMembership.role).toBe("RECRUITER");

    // 3. Admin reviews and approves recruiter
    const approvedMembership = reviewFairMembership(reqMembership.id, "ACTIVE", admin.id);
    expect(approvedMembership.status).toBe("ACTIVE");
    expect(approvedMembership.reviewedBy).toBe(admin.id);
    expect(approvedMembership.reviewedAt).toBeDefined();

    // 4. Admin reviews and rejects a membership
    const rejectedMembership = reviewFairMembership(reqMembership.id, "REJECTED", admin.id);
    expect(rejectedMembership.status).toBe("REJECTED");

    // Recruiter can re-request after rejection
    const reRequest = requestRecruiterFairAccess(recruiter.id, fair.id);
    expect(reRequest.status).toBe("PENDING_APPROVAL");

    // 5. Admin invites a recruiter by email
    const invitedMembership = inviteRecruiterToFair(fair.id, "invited.recruiter@company.com", admin.id);
    expect(invitedMembership.status).toBe("INVITED");
    expect(invitedMembership.invitedEmail).toBe("invited.recruiter@company.com");

    // Recruiter registers / logs in with that email and accepts
    const newRecruiter = await registerLocalUser({
      displayName: "Invited Recruiter",
      email: "invited.recruiter@company.com",
      password: "password12345",
      role: "recruiter",
    });

    const acceptedMembership = acceptFairInvitation(newRecruiter.id, fair.id);
    expect(acceptedMembership.status).toBe("ACTIVE");
    expect(acceptedMembership.userId).toBe(newRecruiter.id);

    // 6. Membership removal
    removeFairMembership(acceptedMembership.id);
    expect(getDatabaseSnapshot().memberships.find((m) => m.id === acceptedMembership.id)).toBeUndefined();
  });
});
