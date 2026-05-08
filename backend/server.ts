import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { analyzeResumeBackend } from "./gemini.ts";
import dotenv from "dotenv";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config(); // Also try default for local dev flexibility

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse");

// Load service account from ENV or file
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    // Look in parent dir since we moved to /backend
    serviceAccount = require("../resumeiq-495613-firebase-adminsdk-fbsvc-52ac0bf3e5.json");
  }
} catch (error) {
  console.warn("⚠️ Firebase service account not found. History features will be disabled until FIREBASE_SERVICE_ACCOUNT env var is set.");
}

const PDFParse = pdf.PDFParse;

// Initialize Firebase Admin SDK (only once)
if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();


async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Configure Multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  });

  app.use(express.json());

  // API Route to parse PDF
  app.post("/api/parse-resume", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (req.file.mimetype !== "application/pdf") {
        return res.status(400).json({ error: "Only PDF files are supported" });
      }

      const parser = new PDFParse({ data: req.file.buffer });
      const result = await parser.getText();
      res.json({ text: result.text });
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      res.status(500).json({ error: "Failed to parse resume PDF" });
    }
  });

  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { resumeText, jobDescription } = req.body;
      if (!resumeText) {
        return res.status(400).json({ error: "Resume text is required" });
      }
      const analysis = await analyzeResumeBackend(resumeText, jobDescription);
      res.json(analysis);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze resume" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(__dirname, "../frontend"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "../frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
