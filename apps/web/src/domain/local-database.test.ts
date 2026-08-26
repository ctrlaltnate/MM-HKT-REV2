import { beforeEach, describe, expect, it } from "vitest";

import {
  createBooth,
  createFair,
  createJob,
  changeLocalPassword,
  getDatabaseSnapshot,
  joinFair,
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
});
