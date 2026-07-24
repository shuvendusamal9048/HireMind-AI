from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
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

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API v1 routers under /api/v1 prefix
app.include_router(api_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(jobs_router, prefix="/api/v1")
app.include_router(public_jobs_router, prefix="/api/v1")
app.include_router(applications_router, prefix="/api/v1")
app.include_router(dashboard_router, prefix="/api/v1")
app.include_router(interview_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")