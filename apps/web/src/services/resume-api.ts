import type { ApiErrorEnvelope, ResumeAnalysis } from "../domain/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? "http://127.0.0.1:8787" : "");

export async function getApiHealth(): Promise<{ geminiConfigured: boolean; model: string }> {
  const response = await fetch(`${API_BASE_URL}${import.meta.env.DEV ? "/health" : "/api/health"}`);
  if (!response.ok) throw new Error("API_UNAVAILABLE");
  const payload = (await response.json()) as {
    data: { geminiConfigured: boolean; model: string };
  };
  return payload.data;
}

export async function analyzeResume(file: File): Promise<ResumeAnalysis> {
  const form = new FormData();
  form.set("resume", file);
  const response = await fetch(`${API_BASE_URL}/api/resumes/analyze`, {
    method: "POST",
    body: form,
  });
  const payload = (await response.json()) as { data: ResumeAnalysis } | ApiErrorEnvelope;
  if (!response.ok || !("data" in payload)) {
    throw new Error("error" in payload ? payload.error.message : "RESUME_ANALYSIS_FAILED");
  }
  return payload.data;
}

export type AssessmentQuestion = { id: string; question: string; options: [string, string, string, string]; correctIndex: number; explanation: string; skill: string };

export async function generateAssessment(input: { jobTitle: string; jobSummary: string; requiredSkills: string[]; resumeEvidence: string }): Promise<AssessmentQuestion[]> {
  const response = await fetch(`${API_BASE_URL}/api/assessments/generate`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
  const payload = await response.json() as { data?: { questions: AssessmentQuestion[] }; error?: { message: string } };
  if (!response.ok || !payload.data) throw new Error(payload.error?.message ?? "ASSESSMENT_GENERATION_FAILED");
  return payload.data.questions;
}
