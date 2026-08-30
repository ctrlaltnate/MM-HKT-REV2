import { resolve } from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";

import { analyzeResumePdf, generateAssessment } from "./gemini.js";
import { authenticate } from "./middleware/auth.js";
import { authRouter } from "./routes/auth.js";
import { fairsRouter } from "./routes/fairs.js";
import { membershipsRouter } from "./routes/memberships.js";
import { boothsAndJobsRouter } from "./routes/booths-and-jobs.js";

// Load environment variables from all standard search locations
dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });
dotenv.config({ path: resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: resolve(process.cwd(), "../.env.local"), quiet: true });
dotenv.config({ path: resolve(process.cwd(), "../.env"), quiet: true });
dotenv.config({ path: resolve(process.cwd(), "../../.env.local"), quiet: true });
dotenv.config({ path: resolve(process.cwd(), "../../.env"), quiet: true });

export const app = express();
const port = Number(process.env.API_PORT ?? 8787);
const origin = process.env.APP_ORIGIN ?? "http://127.0.0.1:4173";
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: (_request, file, callback) => {
    if (file.mimetype !== "application/pdf") {
      callback(new Error("PDF_ONLY"));
      return;
    }
    callback(null, true);
  },
});

app.disable("x-powered-by");
app.use(
  cors({
    origin: (reqOrigin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl) or localhost/127.0.0.1
      if (!reqOrigin || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(reqOrigin) || reqOrigin === origin) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "256kb" }));
app.use(authenticate);

// Health check
app.get("/health", (_request, response) => {
  response.json({
    data: {
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "replace_with_your_gemini_api_key"),
      model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
    },
  });
});

// Same-origin production health endpoint used by the Vercel serverless deployment.
app.get("/api/health", (_request, response) => {
  response.json({
    data: {
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "replace_with_your_gemini_api_key"),
      model: process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
    },
  });
});

// REST API Routers
app.use("/api/auth", authRouter);
app.use("/api/fairs", fairsRouter);
app.use("/api/fairs", membershipsRouter);
app.use("/api", boothsAndJobsRouter);

// Resume Analysis Route
app.post(["/api/resumes/analyze", "/resumes/analyze"], upload.single("resume"), async (request, response) => {
  const requestId = crypto.randomUUID();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === "replace_with_your_gemini_api_key") {
    response.status(503).json({
      error: {
        code: "GEMINI_NOT_CONFIGURED",
        message: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Environment Variables ของ Hosting หรือ .env.local",
        requestId,
        retryable: false,
      },
    });
    return;
  }

  if (!request.file) {
    response.status(400).json({
      error: {
        code: "RESUME_REQUIRED",
        message: "กรุณาเลือกไฟล์ PDF",
        requestId,
        retryable: false,
      },
    });
    return;
  }

  try {
    const analysis = await analyzeResumePdf(
      request.file.buffer,
      apiKey,
      process.env.GEMINI_MODEL ?? "gemini-3.6-flash",
    );
    response.json({
      data: analysis,
      meta: {
        requestId,
        processedAt: new Date().toISOString(),
        persistedFile: false,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Gemini error";
    console.error("[Gemini Resume Analysis Error]", message);
    response.status(502).json({
      error: {
        code: "RESUME_ANALYSIS_FAILED",
        message: `ประมวลผล Resume ไม่สำเร็จ: ${message}`,
        requestId,
        retryable: true,
        detail: message,
      },
    });
  }
});

app.post(["/api/assessments/generate", "/assessments/generate"], async (request, response) => {
  const requestId = crypto.randomUUID();
  const apiKey = process.env.GEMINI_API_KEY;
  const { jobTitle, jobSummary, requiredSkills, resumeEvidence } = request.body ?? {};
  if (!apiKey || apiKey === "replace_with_your_gemini_api_key") {
    console.error("[Gemini Assessment Error] GEMINI_API_KEY is not configured in Environment Variables or .env.local");
    response.status(503).json({ error: { code: "GEMINI_NOT_CONFIGURED", message: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน Environment Variables ของ Hosting หรือ .env.local", requestId, retryable: false } });
    return;
  }
  if (!jobTitle || !jobSummary || !Array.isArray(requiredSkills) || !resumeEvidence) {
    response.status(400).json({ error: { code: "INVALID_ASSESSMENT_INPUT", message: "ข้อมูล JD หรือ Resume ไม่ครบ", requestId, retryable: false } });
    return;
  }
  try {
    const model = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";
    const questions = await generateAssessment({ jobTitle, jobSummary, requiredSkills, resumeEvidence }, apiKey, model);
    response.json({ data: { questions }, meta: { requestId, model } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "สร้าง Assessment ไม่สำเร็จ";
    console.error("[Gemini Assessment Generation Error]", message);
    response.status(502).json({ error: { code: "ASSESSMENT_GENERATION_FAILED", message, requestId, retryable: true } });
  }
});

// Error handling middleware
app.use(
  (
    error: Error,
    _request: express.Request,
    response: express.Response,
    _next: express.NextFunction,
  ) => {
    const isPdfError = error.message === "PDF_ONLY";
    const isSizeError = error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE";
    response.status(400).json({
      error: {
        code: isSizeError ? "RESUME_TOO_LARGE" : isPdfError ? "PDF_ONLY" : "INVALID_UPLOAD",
        message: isSizeError
          ? "ไฟล์ต้องมีขนาดไม่เกิน 10 MB"
          : isPdfError
            ? "รองรับเฉพาะไฟล์ PDF"
            : "ไฟล์ไม่ถูกต้อง",
        requestId: crypto.randomUUID(),
        retryable: false,
      },
    });
  },
);

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(port, "127.0.0.1", () => {
    console.log(`MaskedMatch local API listening on http://127.0.0.1:${port}`);
  });
}
