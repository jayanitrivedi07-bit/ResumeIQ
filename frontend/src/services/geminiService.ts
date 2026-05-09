import { ResumeAnalysis } from "../types";

export async function analyzeResume(resumeText: string, jobDescription?: string): Promise<ResumeAnalysis> {
  try {
    const response = await fetch("/api/analyze-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Analysis failed");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Analysis Error:", error);
    throw new Error(error.message || "Failed to analyze resume with AI.");
  }
}

export async function recreateResume(resumeText: string, jobDescription: string, templateName: string): Promise<{ text: string }> {
  try {
    const response = await fetch("/api/recreate-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jobDescription, templateName }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Recreation failed");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Recreation Error:", error);
    throw new Error(error.message || "Failed to recreate resume with AI.");
  }
}
