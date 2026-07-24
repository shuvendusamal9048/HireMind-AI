from pydantic import BaseModel
from typing import Optional


class InterviewEventRequest(
    BaseModel
):
    event_type: str
    details: Optional[str] = None