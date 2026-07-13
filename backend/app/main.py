from fastapi import FastAPI

from app.core.config import settings
from app.api.v1.router import api_router

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0"
)

app.include_router(api_router)