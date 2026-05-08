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
