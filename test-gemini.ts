import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" }); // Assuming backend has .env, or use root
dotenv.config(); // fallback to current dir

const aiInstance = new GoogleGenAI({ apiKey: "AIzaSyD5so9UMuMvypOpm_jLe1W2dMAV5x6UsJs" });

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

async function test() {
  try {
    const response = await aiInstance.models.generateContent({
      model: "gemini-1.5-flash-001",
      contents: "This is a test resume.",
      config: {
        systemInstruction: "You are an expert recruitment consultant.",
        responseMimeType: "application/json",
        responseSchema: resumeAnalysisSchema,
      },
    });
    console.log("Success:", response.text);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
test();
