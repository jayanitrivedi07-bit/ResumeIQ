# ☁️ Deploying ResumeIQ to Google Cloud Platform (GCP)

This guide will walk you through deploying your **ResumeIQ** application to **Google Cloud Run**. This is the most modern and cost-effective way to host an Express + React application on GCP.

## 📋 Prerequisites

1.  **Google Cloud Project:** Ensure you have a project created in the [GCP Console](https://console.cloud.google.com/).
2.  **Billing Enabled:** Cloud Run requires billing to be enabled (though it has a generous free tier).
3.  **gcloud CLI:** Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install) on your computer.

---

## 🚀 Step-by-Step Deployment

### 1. Authenticate and Initialize
Open your terminal and run:
```bash
# Login to your Google account
gcloud auth login

# Set your project ID (Replace [PROJECT_ID] with your actual GCP Project ID)
gcloud config set project [PROJECT_ID]

# Enable required services
gcloud services enable cloudshell.googleapis.com \
                       cloudbuild.googleapis.com \
                       run.googleapis.com \
                       containerregistry.googleapis.com
```

### 2. Build the Docker Image
We will use **Google Cloud Build** to create your container image directly in the cloud. Run this from the root directory of your project:
```bash
gcloud builds submit --tag gcr.io/[PROJECT_ID]/resumeiq
```
> [!NOTE]
> This command uses the `Dockerfile` I created. It will build your frontend, install backend dependencies, and package everything into a single image.

### 3. Deploy to Cloud Run
Once the build is finished, deploy the image:
```bash
gcloud run deploy resumeiq \
  --image gcr.io/[PROJECT_ID]/resumeiq \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

### 4. Configure Environment Variables
Your app needs its API keys to function. You must set these in the Cloud Run console:
1.  Go to the [Cloud Run Console](https://console.cloud.google.com/run).
2.  Click on your service **resumeiq**.
3.  Click **Edit & Deploy New Revision**.
4.  Scroll down to **Variables & Secrets**.
5.  Add the following:
    *   `GEMINI_API_KEY`: Your key from Google AI Studio.
    *   `FIREBASE_SERVICE_ACCOUNT`: The **entire JSON content** of your service account file.
    *   **Note:** You do **not** need to set `PORT`. Cloud Run will automatically provide it (usually 8080) and the app is now configured to listen to it.
6.  Click **Deploy**.

---

## 🛠️ Maintenance & Updates

- **To push updates:** Simply run the `gcloud builds submit` and `gcloud run deploy` commands again.
- **Custom Domain:** You can map a custom domain (like `resumeiq.ai`) in the **Manage Custom Domains** tab of the Cloud Run console.

---

## 💡 Pro Tip
If you want to automate this, you can connect your **GitHub repository** directly to Cloud Run.
1. In the Cloud Run console, click **Create Service**.
2. Select **Continuously deploy from a repository**.
3. Select your `ResumeIQ` repo and the `main` branch.
4. GCP will now automatically redeploy your app every time you push to GitHub!
