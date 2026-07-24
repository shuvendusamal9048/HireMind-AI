from uuid import UUID
from typing import Optional
from pydantic import BaseModel
from datetime import datetime

class ApplicationListResponse(
    BaseModel
):
    id: str
    candidate_name: str
    email: str
    phone: str
    status: str
    resume_score: float | None
    ai_score: float | None
    is_shortlisted: bool
    resume_url: str | None
    created_at: datetime
    
    class Config:
        from_attributes = True