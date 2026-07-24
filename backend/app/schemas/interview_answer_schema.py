from pydantic import BaseModel
from typing import List


class QuestionAnswer(
    BaseModel
):
    question_id: str
    answer: str


class InterviewSubmitRequest(
    BaseModel
):
    answers: List[
        QuestionAnswer
    ]