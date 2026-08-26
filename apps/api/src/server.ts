import { resolve } from "node:path";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";

import { analyzeResumePdf } from "./gemini.js";

dotenv.config({ path: resolve(process.cwd(), "../../.env.local"), quiet: true });
dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

const app = express();
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
app.use(cors({ origin }));
app.use(express.json({ limit: "256kb" }));

app.get("/health", (_request, response) => {
  response.json({
    data: {
      status: "ok",
      geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
      model: process.env.GEMINI_MODEL ?? "gemini-3.7-flash",
    },
  });
});

app.post("/api/resumes/analyze", upload.single("resume"), async (request, response) => {
  const requestId = crypto.randomUUID();
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    response.status(503).json({
      error: {
        code: "GEMINI_NOT_CONFIGURED",
        message: "ยังไม่ได้ตั้งค่า GEMINI_API_KEY ใน .env.local",
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
      process.env.GEMINI_MODEL ?? "gemini-3.7-flash",
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
    response.status(502).json({
      error: {
        code: "RESUME_ANALYSIS_FAILED",
        message: "ประมวลผล Resume ไม่สำเร็จ กรุณาตรวจไฟล์หรือทดลองใหม่",
        requestId,
        retryable: true,
        detail: process.env.APP_ENV === "development" ? message : undefined,
      },
    });
  }
});

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

app.listen(port, "127.0.0.1", () => {
  console.log(`MaskedMatch local API listening on http://127.0.0.1:${port}`);
});
