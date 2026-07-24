from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class InterviewScheduleRequest(
    BaseModel
):
    interview_date: Optional[datetime] = None
    interviewer_name: Optional[str] = None