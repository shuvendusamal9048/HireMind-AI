# HireMind AI — Production Free Deployment & GitHub CI/CD Guide 🚀

This guide provides step-by-step instructions to deploy **HireMind AI** on **100% Free Cloud Services** with automated **GitHub CI/CD**.

---

## 💡 Expert Opinion & Recommended Stack

For **HireMind AI**, the **Vercel + Render + Neon PostgreSQL** cloud stack is the absolute best free combination:
1. **Frontend (Vercel)**: Lightning-fast global CDN, instant HTTPS, automatic preview deployments for GitHub PRs.
2. **Backend (Render.com)**: Automatic Git deploys, supports Python 3.11 & FastAPI, free SSL certificates.
3. **Database (Neon.tech)**: Serverless PostgreSQL that scales to 0 when idle and awakes in milliseconds.
4. **Storage Fallback**: Local file storage fallback built directly into `minio_service.py` & `resume_screening_agent.py` ensures public job applications and AI resume parsing work flawlessly without needing paid cloud storage.

---

## ⚡ Step-by-Step Deployment Instructions

### 1. Database Setup (Neon.tech — 2 Mins)
1. Register at [Neon.tech](https://neon.tech/).
2. Create project `hiremind-db`.
3. Copy PostgreSQL credentials to your environment variables:
   ```env
   POSTGRES_HOST=ep-example.neon.tech
   POSTGRES_USER=neondb_owner
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=neondb
   ```

---

### 2. Backend API Setup (Render.com — 3 Mins)
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Deploy HireMind AI"
   git push origin main
   ```
2. On [Render.com](https://render.com/), click **New +** -> **Web Service**.
3. Select your GitHub repository.
4. Set:
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (`POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `GEMINI_API_KEY`, `MAIL_USERNAME`, `MAIL_PASSWORD`).
6. Click **Deploy**. Your API URL will be `https://hiremind-backend.onrender.com`.

---

### 3. Frontend Portal Setup (Vercel — 2 Mins)
1. On [Vercel.com](https://vercel.com/), click **Add New Project**.
2. Select your `HireMind-AI` GitHub repo.
3. Root Directory: `frontend`.
4. Environment Variable:
   ```env
   VITE_API_BASE_URL=https://hiremind-backend.onrender.com/api/v1
   ```
5. Click **Deploy**. Live URL: `https://hiremind-ai.vercel.app`!

---

## 🔄 GitHub CI/CD Automated Workflow (`.github/workflows/ci-cd.yml`)

We have created `.github/workflows/ci-cd.yml` in your codebase!

### How GitHub CI/CD Works:
1. **On Code Push to `main`**:
   - **Job 1 (Backend CI)**: Installs Python 3.11, validates FastAPI routes & dependencies.
   - **Job 2 (Frontend CI)**: Installs Node.js, compiles Vite production bundle.
   - **Job 3 (Continuous Deployment)**: Triggers Render Deploy Hook & Vercel production deployment automatically!

### How to Enable Automatic Deployments on GitHub:
1. Go to your GitHub Repo -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add these secrets:
   - `RENDER_DEPLOY_HOOK`: Copy from Render Web Service -> *Deploy Hook URL*.
   - `VERCEL_TOKEN`: Copy from Vercel Account Settings -> *Tokens*.

Now, every time you run `git push origin main`, GitHub Actions automatically tests, builds, and deploys your changes online! 🚀
