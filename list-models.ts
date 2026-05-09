import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({ path: "backend/.env" });
dotenv.config();

const aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

async function list() {
  const models = await aiInstance.models.list();
  for (const model of models) {
    if (model.name.includes("gemini")) {
      console.log(model.name);
    }
  }
}
list();
