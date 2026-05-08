# ElevateAI Resume Reviewer

A modern, AI-powered resume analysis tool built with React, Node.js, and Google's Gemini 3 Flash. ElevateAI helps job seekers optimize their resumes for ATS (Applicant Tracking Systems) and professional impact.

## Features

- **PDF Text Extraction**: Secure server-side processing of PDF resumes.
- **AI-Powered Insights**: Comprehensive review using Gemini AI.
- **ATS Optimization**: Specific tips to pass through automated filters.
- **Project Refinement**: AI-suggested rewrites for project and experience descriptions.
- **Modern UI**: Dark-themed, responsive interface with glassmorphism and smooth animations.

## Tech Stack

- **Frontend**: React 19, Tailwind CSS 4, Motion, Recharts, Lucide React.
- **Backend**: Node.js, Express, Multer, PDF-parse.
- **AI**: Google Gemini API (@google/genai).

## Getting Started

### Prerequisites

- Node.js (v18+)
- A Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file based on `.env.example`:
   ```bash
   GEMINI_API_KEY=your_actual_api_key
   ```

### Running Locally

To start the full-stack application in development mode:
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

## Deployment

This application is designed to be deployed as a full-stack containerized app.

### Deployment Instructions (Cloud Run)

1. Build the production assets:
   ```bash
   npm run build
   ```
2. The server (`server.ts`) is configured to serve the static files from the `dist/` directory in production mode.
3. Ensure the environment variable `GEMINI_API_KEY` is set in your deployment environment.
4. The application listens on port 3000.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Your Google AI Studio API key. |
| `APP_URL` | (Optional) The base URL of the deployed application. |

---
Built with ❤️ using Google AI Studio.
