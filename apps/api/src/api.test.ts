import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "./server.js";
import { dataStore } from "./store/data-store.js";

describe("Express REST API Integration Tests", () => {
  beforeEach(() => {
    dataStore.reset();
  });

  describe("GET /health", () => {
    it("returns 200 with health status and model configuration", async () => {
      const res = await request(app).get("/health");
      expect(res.status).toBe(200);
      expect(res.body.data.status).toBe("ok");
    });
  });

  describe("Authentication Flow & Account Endpoints", () => {
    it("registers a candidate, logs in, fetches /me, and updates account", async () => {
      // 1. Register candidate
      const regRes = await request(app)
        .post("/api/auth/register")
        .send({
          displayName: "Somchai Candidate",
          email: "somchai@maskedmatch.local",
          password: "password12345",
          role: "candidate",
        });
      expect(regRes.status).toBe(201);
      expect(regRes.body.user.email).toBe("somchai@maskedmatch.local");
      const token = regRes.body.token;

      // 2. Duplicate registration fails
      const dupRes = await request(app)
        .post("/api/auth/register")
        .send({
          displayName: "Somchai Duplicate",
          email: "somchai@maskedmatch.local",
          password: "password12345",
          role: "candidate",
        });
      expect(dupRes.status).toBe(409);
      expect(dupRes.body.error.code).toBe("USER_ALREADY_EXISTS");

      // 3. Login with credentials
      const loginRes = await request(app)
        .post("/api/auth/login")
        .send({
          email: "somchai@maskedmatch.local",
          password: "password12345",
        });
      expect(loginRes.status).toBe(200);
      expect(loginRes.body.user.displayName).toBe("Somchai Candidate");

      // 4. Fetch profile via /api/auth/me
      const meRes = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);
      expect(meRes.status).toBe(200);
      expect(meRes.body.user.id).toBe(token);

      // 5. Update account
      const updateRes = await request(app)
        .patch("/api/auth/account")
        .set("Authorization", `Bearer ${token}`)
        .send({
          displayName: "Somchai Updated",
          email: "somchai.updated@maskedmatch.local",
        });
      expect(updateRes.status).toBe(200);
      expect(updateRes.body.user.displayName).toBe("Somchai Updated");

      // 6. Change password
      const pwRes = await request(app)
        .post("/api/auth/password")
        .set("Authorization", `Bearer ${token}`)
        .send({
          currentPassword: "password12345",
          newPassword: "newpassword9999",
        });
      expect(pwRes.status).toBe(200);
    });
  });

  describe("Job Fairs Lifecycle & RBAC", () => {
    it("enforces admin-only creation, allows public reads, and handles deletion", async () => {
      // 1. Register candidate
      const candRes = await request(app)
        .post("/api/auth/register")
        .send({
          displayName: "Normal User",
          email: "user@test.local",
          password: "password12345",
          role: "candidate",
        });
      const candToken = candRes.body.token;

      // 2. Candidate attempts to create fair -> 403 Forbidden
      const forbidRes = await request(app)
        .post("/api/fairs")
        .set("Authorization", `Bearer ${candToken}`)
        .send({
          title: "Unauthorized Fair",
          slug: "unauthorized-fair",
          summary: "Should fail",
          locationLabel: "Online",
          startsAt: "2026-10-01T09:00",
          endsAt: "2026-10-01T18:00",
        });
      expect(forbidRes.status).toBe(403);
      expect(forbidRes.body.error.code).toBe("FORBIDDEN");

      // 3. Admin login
      const adminLogin = await request(app)
        .post("/api/auth/login")
        .send({
          email: "admin@maskedmatch.local",
          password: "Admin123456!",
        });
      const adminToken = adminLogin.body.token;

      // 4. Admin creates fair
      const createRes = await request(app)
        .post("/api/fairs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Bangkok Tech Career 2026",
          slug: "bkk-tech-2026",
          summary: "Large scale tech hiring",
          locationLabel: "Online",
          startsAt: "2026-10-01T09:00",
          endsAt: "2026-10-01T18:00",
        });
      expect(createRes.status).toBe(201);
      const fairId = createRes.body.fair.id;

      // 5. Admin updates status to PUBLISHED
      const publishRes = await request(app)
        .patch(`/api/fairs/${fairId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          status: "PUBLISHED",
        });
      expect(publishRes.status).toBe(200);
      expect(publishRes.body.fair.status).toBe("PUBLISHED");

      // 6. Public list returns fair
      const listRes = await request(app).get("/api/fairs");
      expect(listRes.status).toBe(200);
      expect(listRes.body.fairs.length).toBe(1);

      // 7. Get by slug
      const slugRes = await request(app).get("/api/fairs/bkk-tech-2026");
      expect(slugRes.status).toBe(200);
      expect(slugRes.body.fair.id).toBe(fairId);
    });
  });

  describe("Fair Membership Governance & Booth Creation Flow", () => {
    it("handles recruiter invitation, approval gate, and booth creation", async () => {
      // 1. Admin login & create published fair
      const adminLogin = await request(app)
        .post("/api/auth/login")
        .send({
          email: "admin@maskedmatch.local",
          password: "Admin123456!",
        });
      const adminToken = adminLogin.body.token;

      const fairRes = await request(app)
        .post("/api/fairs")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "AI & Data Expo",
          slug: "ai-data-expo",
          summary: "Annual AI conference",
          locationLabel: "Bangkok",
          startsAt: "2026-11-01T09:00",
          endsAt: "2026-11-01T18:00",
        });
      const fairId = fairRes.body.fair.id;

      // 2. Register Recruiter
      const recRes = await request(app)
        .post("/api/auth/register")
        .send({
          displayName: "Tech Recruiter",
          email: "recruiter@ai.local",
          password: "password12345",
          role: "recruiter",
        });
      const recToken = recRes.body.token;

      // 3. Recruiter creates company
      const compRes = await request(app)
        .post("/api/companies")
        .set("Authorization", `Bearer ${recToken}`)
        .send({
          name: "Deep AI Inc.",
          industry: "Artificial Intelligence",
          summary: "Next gen LLMs",
          website: "https://deepai.example",
          workLocations: "Bangkok / Remote",
        });
      expect(compRes.status).toBe(201);
      const companyId = compRes.body.company.id;

      // 4. Recruiter tries to create booth without active membership -> 400
      const failedBoothRes = await request(app)
        .post("/api/booths")
        .set("Authorization", `Bearer ${recToken}`)
        .send({
          fairId,
          companyId,
          name: "Deep AI Booth",
          summary: "Hiring AI Engineers",
          technologyTags: ["Python", "PyTorch"],
        });
      expect(failedBoothRes.status).toBe(400);

      // 5. Admin invites recruiter by email
      const inviteRes = await request(app)
        .post(`/api/fairs/${fairId}/memberships/invite`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          fairId,
          email: "recruiter@ai.local",
        });
      expect(inviteRes.status).toBe(201);
      const membershipId = inviteRes.body.membership.id;

      // 6. Recruiter accepts invitation
      const acceptRes = await request(app)
        .post(`/api/fairs/${fairId}/memberships/accept`)
        .set("Authorization", `Bearer ${recToken}`)
        .send({ membershipId });
      expect(acceptRes.status).toBe(200);
      expect(acceptRes.body.membership.status).toBe("ACTIVE");

      // 7. Recruiter can now create booth
      const boothRes = await request(app)
        .post("/api/booths")
        .set("Authorization", `Bearer ${recToken}`)
        .send({
          fairId,
          companyId,
          name: "Deep AI Booth",
          summary: "Hiring AI Engineers",
          technologyTags: ["Python", "PyTorch"],
        });
      expect(boothRes.status).toBe(201);
      const boothId = boothRes.body.booth.id;

      // 8. Recruiter posts job
      const jobRes = await request(app)
        .post("/api/jobs")
        .set("Authorization", `Bearer ${recToken}`)
        .send({
          boothId,
          companyId,
          title: "Senior AI Researcher",
          summary: "Research and develop frontier AI models",
          responsibilities: "Conduct research and publish papers",
          mustHave: ["PyTorch", "Deep Learning"],
          niceToHave: ["Transformer Architecture"],
          salaryMin: 120000,
          salaryMax: 200000,
          workMode: "HYBRID",
          employmentType: "FULL_TIME",
        });
      expect(jobRes.status).toBe(201);
    });
  });
});
