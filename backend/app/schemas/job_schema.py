from typing import List, Optional
from pydantic import BaseModel

from app.constants.job_constants import (
    EmploymentType,
    JobStatus
)


class JobCreate(BaseModel):
    title: str
    description: str
    experience: int = 0
    location: str
    employment_type: EmploymentType
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    skills: List[str]


class JobResponse(BaseModel):
    id: str
    title: str
    description: str
    experience: int
    location: str
    employment_type: EmploymentType
    salary_min: Optional[int]
    salary_max: Optional[int]
    skills: List[str]
    status: JobStatus
    application_code: str

    class Config:
        from_attributes = True