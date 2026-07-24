from pydantic import BaseModel


class SaveAnswerRequest(
    BaseModel
):
    answer: str