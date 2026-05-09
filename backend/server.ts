import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import pdf from "pdf-parse-new";

// Initialize environment variables BEFORE any other imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env if it exists (mostly for local development)
dotenv.config({ path: path.join(__dirname, "../.env") });
dotenv.config();

import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import admin from "firebase-admin";
import { analyzeResumeBackend, recreateResume } from "./gemini.ts";

// Load service account from ENV or file
let serviceAccount: any = null;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log("ℹ️ Loading Firebase service account from environment variable.");
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const saPath = path.join(__dirname, "../resumeiq-495613-firebase-adminsdk-fbsvc-52ac0bf3e5.json");
    console.log(`ℹ️ Looking for Firebase service account file at: ${saPath}`);
    serviceAccount = require(saPath);
  }
} catch (error) {
  console.warn("⚠️ Firebase service account not found or invalid. History features will be disabled.");
}

// Initialize Firebase Admin SDK safely
let isFirebaseInitialized = false;
if (serviceAccount) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      isFirebaseInitialized = true;
      console.log("✅ Firebase Admin SDK initialized successfully.");
    }
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error);
  }
}

// Safe accessors for Firebase services
export const getAdminAuth = () => {
  if (!isFirebaseInitialized) return null;
  return admin.auth();
};

export const getAdminDb = () => {
  if (!isFirebaseInitialized) return null;
  return admin.firestore();
};

async function startServer() {
  console.log("🚀 Starting server initialization...");
  const app = express();
  const PORT = Number(process.env.PORT) || 8080; // Default to 8080 for Cloud Run

  // Configure Multer for file uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  });

  app.use(express.json());

  // API Route to parse PDF
  app.post("/api/parse-resume", upload.single("resume"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });
      console.log(`📄 Parsing PDF: ${req.file.originalname} (${req.file.size} bytes)`);
      
      const data = await pdf(req.file.buffer);
      
      if (!data.text || data.text.trim().length === 0) {
        console.warn("⚠️ PDF parsed but no text was extracted. Is it a scanned document?");
        return res.status(422).json({ error: "The PDF appears to be empty or a scanned image. Please provide a text-based PDF." });
      }

      console.log("✅ PDF parsed successfully. Character count:", data.text.length);
      res.json({ text: data.text });
    } catch (err: any) {
      console.error("❌ PDF Parsing Error Details:", err);
      res.status(500).json({ error: `Failed to parse resume PDF: ${err.message}` });
    }
  });

  app.post("/api/analyze-resume", async (req, res) => {
    try {
      const { resumeText, jobDescription } = req.body;
      if (!resumeText) {
        return res.status(400).json({ error: "Resume text is required" });
      }
      console.log("🧠 Analyzing resume with Gemini...");
      const analysis = await analyzeResumeBackend(resumeText, jobDescription);
      res.json(analysis);
    } catch (error: any) {
      console.error("Analysis Error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze resume" });
    }
  });

  app.post("/api/recreate-resume", async (req, res) => {
    try {
      const { resumeText, jobDescription, templateName } = req.body;
      if (!resumeText || !jobDescription || !templateName) {
        return res.status(400).json({ error: "Missing required fields (resumeText, jobDescription, templateName)" });
      }
      console.log(`✨ Recreating resume with template: ${templateName}...`);
      const result = await recreateResume(resumeText, jobDescription, templateName);
      res.json(result);
    } catch (error: any) {
      console.error("Recreation Error:", error);
      res.status(500).json({ error: error.message || "Failed to recreate resume" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      firebase: isFirebaseInitialized ? "connected" : "disabled",
      timestamp: new Date().toISOString()
    });
  });

  // Serve static files or Vite dev server
  if (process.env.NODE_ENV !== "production") {
    console.log("🛠️ Running in development mode with Vite middleware");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.join(__dirname, "../frontend"),
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "../frontend/dist");
    console.log(`📦 Serving static files from: ${distPath}`);
    
    // Debug: Check if dist exists
    import("fs").then(fs => {
      if (fs.existsSync(distPath)) {
        console.log("✅ dist directory found");
        console.log("📄 Files in dist:", fs.readdirSync(distPath));
        if (fs.existsSync(path.join(distPath, "assets"))) {
          console.log("📄 Files in dist/assets:", fs.readdirSync(path.join(distPath, "assets")));
        }
      } else {
        console.error("❌ dist directory NOT found at:", distPath);
      }
    });

    app.use(express.static(distPath));
    
    // Config API to pass env vars to frontend
    app.get("/api/config", (req, res) => {
      res.json({
        firebase: {
          apiKey: process.env.VITE_FIREBASE_API_KEY,
          authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.VITE_FIREBASE_PROJECT_ID,
          storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.VITE_FIREBASE_APP_ID,
          measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
        }
      });
    });

    // Debug API to check file existence
    app.get("/api/debug-files", (req, res) => {
      const fs = require("fs");
      try {
        const files = fs.readdirSync(distPath);
        res.json({ distPath, files });
      } catch (err: any) {
        res.status(500).json({ error: err.message, distPath });
      }
    });

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server is listening on port ${PORT}`);
    console.log(`🔗 URL: http://0.0.0.0:${PORT}`);
  });
}

// Global error handler to catch unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
});

startServer().catch(err => {
  console.error("❌ Failed to start server:", err);
  process.exit(1);
});

