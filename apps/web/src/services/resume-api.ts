import type { ApiErrorEnvelope, ResumeAnalysis } from "../domain/types";

export function resolveApiBaseUrl(): string {
  const envUrl = (import.meta.env.VITE_API_BASE_URL ?? import.meta.env.VITE_API_URL ?? "").trim();

  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "0.0.0.0";
    // If the web app is running on a deployed domain (e.g. Vercel, Netlify, custom domain),
    // NEVER allow localhost/127.0.0.1 URLs because client browsers will get net::ERR_CONNECTION_REFUSED.
    if (!isLocalhost && (envUrl.includes("localhost") || envUrl.includes("127.0.0.1"))) {
      return "";
    }
  }

  if (envUrl) return envUrl;
  return import.meta.env.DEV ? "http://127.0.0.1:8787" : "";
}

export async function getApiHealth(): Promise<{ geminiConfigured: boolean; model: string }> {
  const isLocalDev =
    import.meta.env.DEV &&
    (typeof window === "undefined" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const endpoint = isLocalDev ? "/health" : "/api/health";
  const baseUrl = resolveApiBaseUrl();
  const response = await fetch(`${baseUrl}${endpoint}`);
  if (!response.ok) throw new Error("API_UNAVAILABLE");
  const payload = (await response.json()) as {
    data: { geminiConfigured: boolean; model: string };
  };
  return payload.data;
}

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  const form = new FormData();
  form.set("resume", file);
  const baseUrl = resolveApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/resumes/analyze`, {
    method: "POST",
    body: form,
  });
  const payload = (await response.json()) as { data: ResumeAnalysis } | ApiErrorEnvelope;
  if (!response.ok || !("data" in payload)) {
    throw new Error("error" in payload ? payload.error.message : "RESUME_ANALYSIS_FAILED");
  }
  return payload.data;
}

export type AssessmentQuestion = {
  id: string;
  type?: "multiple_choice" | "subjective";
  question: string;
  options?: [string, string, string, string];
  correctIndex?: number;
  explanation: string;
  skill: string;
  placeholder?: string;
};

export async function generateAssessment(input: {
  jobTitle: string;
  jobSummary: string;
  requiredSkills: string[];
  resumeEvidence: string;
}): Promise<AssessmentQuestion[]> {
  const baseUrl = resolveApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/assessments/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const payload = (await response.json()) as {
    data?: { questions: AssessmentQuestion[] };
    error?: { message: string };
  };
  if (!response.ok || !payload.data) {
    throw new Error(payload.error?.message ?? "ASSESSMENT_GENERATION_FAILED");
  }
  return payload.data.questions;
}
