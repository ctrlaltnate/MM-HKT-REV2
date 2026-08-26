import type { ApiErrorEnvelope, ResumeAnalysis } from "../domain/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8787";

export async function getApiHealth(): Promise<{ geminiConfigured: boolean; model: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
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
