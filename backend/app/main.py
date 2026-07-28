from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.api.v1.router import api_router
from app.api.v1.auth import router as auth_router
from app.api.v1.jobs import router as jobs_router
from app.api.v1.public_jobs import router as public_jobs_router
from app.api.v1.applications import router as applications_router
from app.api.v1.interviews import router as interview_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.admin import router as admin_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)


@app.on_event("startup")
async def startup_db_migration():
    """Ensure database schema and all table columns exist on startup."""
    try:
        async with engine.begin() as conn:
            # 1. Create missing tables
            await conn.run_sync(Base.metadata.create_all)

            # 2. Automatically add missing columns to existing tables if needed (AWS / Neon migration)
            await conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS gst_number VARCHAR;"))
            await conn.execute(text("ALTER TABLE companies ADD COLUMN IF NOT EXISTS approval_status VARCHAR DEFAULT 'APPROVED';"))
            await conn.execute(text("ALTER TABLE interviews ADD COLUMN IF NOT EXISTS proctoring_video_url VARCHAR;"))
            await conn.execute(text("ALTER TABLE candidate_applications ADD COLUMN IF NOT EXISTS proctoring_video_url VARCHAR;"))
            print("Database startup migration executed successfully.")
    except Exception as e:
        print(f"Startup DB migration notice: {e}")


import os
from fastapi.staticfiles import StaticFiles

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static file access & PDF downloads
uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Include all API v1 routers under /api/v1 prefix
app.include_router(api_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(jobs_router, prefix="/api/v1")
app.include_router(public_jobs_router, prefix="/api/v1")
app.include_router(applications_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(interview_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")