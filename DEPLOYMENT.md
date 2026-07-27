# 🚀 HireMind AI — Production Free Deployment Guide

This guide details how to deploy **HireMind AI** online **100% FREE** with **ZERO credit card required**.

---

## 🏗️ Production Architecture

```
┌────────────────────────────────┐       ┌────────────────────────────────┐
│   React Frontend (Vite)       │       │    FastAPI Backend (Python)    │
│   Deployed on Vercel           ├──────►│    Deployed on Render.com      │
│   https://hiremind.vercel.app  │  API  │    https://api.onrender.com    │
└────────────────────────────────┘       └──────────────┬─────────────────┘
                                                        │
                                         ┌──────────────┴─────────────────┐
                                         │  Neon.tech PostgreSQL Database │
                                         │  (Serverless 100% Free)        │
                                         └────────────────────────────────┘
```

> ℹ️ **Storage Note**: PDF candidate resumes are handled seamlessly by the built-in local disk fallback inside `backend/uploads/resumes/` — no external MinIO or AWS S3 required!

---

## ⚡ Step 1: Create Free PostgreSQL Database on Neon.tech (2 Mins)

1. Go to [Neon.tech](https://neon.tech/) and click **Continue with GitHub**.
2. Click **Create Project** -> Name: `hiremind-production-db`.
3. Under **Connection Details**, copy your pooled connection parameters:
   - **`POSTGRES_HOST`**: `ep-example-pooler.ap-southeast-1.aws.neon.tech`
   - **`POSTGRES_USER`**: `neondb_owner`
   - **`POSTGRES_PASSWORD`**: `your_neon_password`
   - **`POSTGRES_DB`**: `neondb`
   - **`POSTGRES_PORT`**: `5432`

---

## ⚡ Step 2: Deploy Backend API on Render.com (3 Mins)

1. Go to [Render.com](https://render.com/) and click **Sign Up with GitHub**.
2. Click **New +** -> **Web Service**.
3. Connect your repository: `shuvendusamal9048/HireMind-AI`.
4. Configure Web Service:
   - **Name**: `hiremind-backend`
   - **Branch**: `main`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add the following **Environment Variables**:

| Variable Name | Production Value |
|---|---|
| `PYTHON_VERSION` | `3.11.9` |
| `PYTHONPATH` | `backend` |
| `POSTGRES_HOST` | *(From Neon.tech)* `ep-soft-hall-aghtibpv.c-2.eu-central-1.aws.neon.tech` |
| `POSTGRES_PORT` | `5432` |
| `POSTGRES_DB` | `neondb` |
| `POSTGRES_USER` | `neondb_owner` |
| `POSTGRES_PASSWORD` | *(From Neon.tech)* `npg_CcYl5Ux8ytdg` |
| `JWT_SECRET_KEY` | `hiremind_production_jwt_secret_key_2026` |
| `GEMINI_API_KEY` | `YOUR_GEMINI_API_KEY` |
| `MAIL_USERNAME` | `shuvendusamal9048@gmail.com` |
| `MAIL_PASSWORD` | `your_gmail_app_password` |

6. Click **Create Web Service**. Render will deploy your API and provide a live URL (e.g. `https://hiremind-backend.onrender.com`).

---

## ⚡ Step 3: Deploy Frontend Portal on Vercel (2 Mins)

1. Go to [Vercel.com](https://vercel.com/) and click **Continue with GitHub**.
2. Click **Add New...** -> **Project**.
3. Import repository: `shuvendusamal9048/HireMind-AI`.
4. Configure Project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* -> Select **`frontend`**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variable**:
   - **`VITE_API_URL`**: `https://hiremind-backend.onrender.com/api/v1` *(Your Render backend URL + `/api/v1`)*
6. Click **Deploy**.

---

## 🎉 Verification & Live Usage

Once Vercel finishes building, your platform will be live at:
👉 **`https://hiremind-ai.vercel.app`**

### Live Platform Features:
- 🏢 **Company Signup & Super Admin Verification**:
  - Companies sign up with GST Number.
  - Dedicated Super Admin Login at `/admin/login` (`rishisamal2005@gmail.com` / `Samal@123`) to verify and approve company registrations with automated HTML approval emails.
- 📄 **Public Job Application Gateway**:
  - Formal corporate portal where candidates apply and upload PDF resumes.
  - Automatic AI resume extraction powered by Gemini AI.
- 📝 **Proctored Online Examinations**:
  - Technical MCQs & Coding environment with live proctoring (tab-switch tracking & camera monitoring).
  - Automatic partial submission on exam timer expiration.
- 📊 **HR Dashboard**:
  - Real-time candidate analytics, exam scores, and automated shortlisting.
