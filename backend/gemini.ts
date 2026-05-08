import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Environment variables are loaded by server.ts

let aiInstance: GoogleGenAI | null = null;
function getAI() {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
  }
  return aiInstance;
}

const resumeAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER, description: "A score out of 10 for the overall resume quality." },
    summary: { type: Type.STRING, description: "A brief summary of the resume evaluation." },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key strengths found in the resume." },
    weaknesses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of areas for improvement." },
    atsOptimization: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          tip: { type: Type.STRING },
          details: { type: Type.STRING }
        },
        required: ["tip", "details"]
      },
      description: "Tips for passing ATS filters."
    },
    suggestedSkills: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Skills that could be added or emphasized." },
    betterDescriptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          suggested: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["original", "suggested", "reason"]
      },
      description: "Specific improvements for project or experience descriptions."
    }
  },
  required: ["score", "summary", "strengths", "weaknesses", "atsOptimization", "suggestedSkills", "betterDescriptions"]
};

export async function analyzeResumeBackend(resumeText: string, jobDescription?: string) {
  let prompt = `Analyze the following resume text and provide a comprehensive review. 
  Focus on quality, impact, ATS optimization, and professional presentation.
  
  Resume Text:
  ${resumeText}`;

  if (jobDescription) {
    prompt += `\n\nTARGET JOB DESCRIPTION:\n${jobDescription}\n\nTailor the analysis specifically to how well this resume matches the requirements of this job. Highlight missing keywords or skills relevant to this specific role.`;
  }

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", // Use a stable model name
      contents: prompt,
      config: {
        systemInstruction: "You are an expert recruitment consultant and ATS optimization specialist. Provide honest, constructive, and highly professional advice.",
        responseMimeType: "application/json",
        responseSchema: resumeAnalysisSchema,
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze resume with AI.");
  }
}
