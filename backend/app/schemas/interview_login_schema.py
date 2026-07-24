from pydantic import BaseModel


class InterviewLoginRequest(
    BaseModel
):
    interview_code: str
    password: str