import { Router } from "express";
import {
  CreateCompanyRequestSchema,
  UpdateCompanyRequestSchema,
  CreateBoothRequestSchema,
  UpdateBoothRequestSchema,
  CreateJobPostingRequestSchema,
  UpdateJobPostingRequestSchema,
  UpdateCandidateProfileRequestSchema,
  type ApiErrorEnvelope,
} from "@maskedmatch/contracts";
import { validateBody } from "../middleware/validate.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { dataStore } from "../store/data-store.js";

export const boothsAndJobsRouter = Router();

// ==========================================
// Companies
// ==========================================
boothsAndJobsRouter.get("/companies", (req, res) => {
  const ownerId = req.query.ownerId as string | undefined;
  const companies = dataStore.getCompanies(ownerId);
  res.json({ companies });
});

boothsAndJobsRouter.post(
  "/companies",
  requireRole(["recruiter", "admin"]),
  validateBody(CreateCompanyRequestSchema),
  (req, res) => {
    try {
      const company = dataStore.createCompany(req.user!.id, req.body);
      res.status(201).json({ company });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสร้างบริษัท";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "CREATE_COMPANY_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

boothsAndJobsRouter.patch(
  "/companies/:id",
  requireRole(["recruiter", "admin"]),
  validateBody(UpdateCompanyRequestSchema),
  (req, res) => {
    try {
      const id = String(req.params.id);
      const company = dataStore.updateCompany(id, req.body);
      res.json({ company });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแก้ไขบริษัท";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "UPDATE_COMPANY_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

// ==========================================
// Booths
// ==========================================
boothsAndJobsRouter.get("/booths", (req, res) => {
  const fairId = req.query.fairId as string | undefined;
  const ownerId = req.query.ownerId as string | undefined;
  const booths = dataStore.getBooths(fairId, ownerId);
  res.json({ booths });
});

boothsAndJobsRouter.post(
  "/booths",
  requireRole(["recruiter", "admin"]),
  validateBody(CreateBoothRequestSchema),
  (req, res) => {
    try {
      const booth = dataStore.createBooth(req.user!.id, req.body);
      res.status(201).json({ booth });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสร้างบูธ";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "CREATE_BOOTH_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

boothsAndJobsRouter.patch(
  "/booths/:id",
  requireRole(["recruiter", "admin"]),
  validateBody(UpdateBoothRequestSchema),
  (req, res) => {
    try {
      const id = String(req.params.id);
      const booth = dataStore.updateBooth(id, req.body);
      res.json({ booth });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแก้ไขบูธ";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "UPDATE_BOOTH_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

boothsAndJobsRouter.delete(
  "/booths/:id",
  requireRole(["recruiter", "admin"]),
  (req, res) => {
    try {
      const id = String(req.params.id);
      dataStore.deleteBooth(id);
      res.json({ success: true, message: "ลบบูธเรียบร้อยแล้ว" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบบูธ";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "DELETE_BOOTH_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

// ==========================================
// Job Postings
// ==========================================
boothsAndJobsRouter.get("/jobs", (req, res) => {
  const boothId = req.query.boothId as string | undefined;
  const jobs = dataStore.getJobs(boothId);
  res.json({ jobs });
});

boothsAndJobsRouter.post(
  "/jobs",
  requireRole(["recruiter", "admin"]),
  validateBody(CreateJobPostingRequestSchema),
  (req, res) => {
    try {
      const job = dataStore.createJob(req.user!.id, req.body);
      res.status(201).json({ job });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสร้างตำแหน่งงาน";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "CREATE_JOB_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

boothsAndJobsRouter.patch(
  "/jobs/:id",
  requireRole(["recruiter", "admin"]),
  validateBody(UpdateJobPostingRequestSchema),
  (req, res) => {
    try {
      const id = String(req.params.id);
      const job = dataStore.updateJob(id, req.body);
      res.json({ job });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการแก้ไขตำแหน่งงาน";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "UPDATE_JOB_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

boothsAndJobsRouter.delete(
  "/jobs/:id",
  requireRole(["recruiter", "admin"]),
  (req, res) => {
    try {
      const id = String(req.params.id);
      dataStore.deleteJob(id);
      res.json({ success: true, message: "ลบตำแหน่งงานเรียบร้อยแล้ว" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบตำแหน่งงาน";
      const errorBody: ApiErrorEnvelope = {
        error: { code: "DELETE_JOB_FAILED", message, retryable: false },
      };
      res.status(400).json(errorBody);
    }
  },
);

// ==========================================
// Candidate Profile
// ==========================================
boothsAndJobsRouter.get("/candidate/profile", requireAuth, (req, res) => {
  const profile = dataStore.getCandidateProfile(req.user!.id);
  res.json({ profile: profile ?? null });
});

boothsAndJobsRouter.put(
  "/candidate/profile",
  requireRole(["candidate"]),
  validateBody(UpdateCandidateProfileRequestSchema),
  (req, res) => {
    const profile = dataStore.updateCandidateProfile(req.user!.id, req.body);
    res.json({ profile });
  },
);
