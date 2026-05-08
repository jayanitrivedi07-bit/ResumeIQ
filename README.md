# 🚀 ResumeIQ.ai - AI-Powered Resume Optimizer

ResumeIQ is a premium, state-of-the-art resume analysis tool that uses Gemini AI to help candidates optimize their resumes for modern hiring systems (ATS) and land their dream jobs with precision.

![ResumeIQ Landing Page](https://github.com/jayanitrivedi07-bit/ResumeIQ/raw/main/public/preview.png)

## ✨ Features

- **AI Analysis:** Detailed feedback on strengths, weaknesses, and ATS optimization.
- **Project Refinement:** Gemini-powered "Before & After" suggestions for your experience descriptions.
- **Targeted Insights:** Paste a specific job description to get tailored advice.
- **Analysis History:** Save and track your improvement scores over time.
- **Secure Architecture:** Backend-integrated AI calls for maximum API key security.
- **Premium UI:** Sleek, modern dashboard with dark mode and glassmorphism aesthetics.

## 🏗️ Project Structure

The project is organized into separate modules for easy navigation and maintenance:

```bash
├── frontend/          # Vite + React (UI, Components, Contexts)
├── backend/           # Node.js + Express (PDF Parsing, Gemini AI Integration)
├── Dockerfile         # Container configuration for GCP deployment
└── .env.example       # Template for required environment variables
```

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide React, Framer Motion.
- **Backend:** Node.js, Express, Multer, PDF-Parse.
- **AI:** Google Gemini 1.5 Flash via Google Generative AI SDK.
- **Database:** Firebase Firestore for history and authentication.
- **Deployment:** Docker-ready, optimized for Google Cloud Run.

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- A Google AI Studio API Key
- A Firebase Project (Firestore + Auth enabled)

### Local Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/jayanitrivedi07-bit/ResumeIQ.git
   cd ResumeIQ
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root (or use the one in `frontend/`) and add:
   ```env
   GEMINI_API_KEY=your_key_here
   FIREBASE_SERVICE_ACCOUNT=your_json_string_here
   ```

4. **Run Development Server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## ☁️ Deployment on GCP

This project is optimized for **Google Cloud Run**:

1. **Build the image:**
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/resumeiq
   ```

2. **Deploy:**
   ```bash
   gcloud run deploy resumeiq --image gcr.io/[PROJECT_ID]/resumeiq --platform managed
   ```

## 📄 License

© 2026 ResumeIQ Technologies Inc. - All rights reserved.
