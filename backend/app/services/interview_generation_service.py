import json

from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion

from app.repositories.interview_repository import (
    InterviewRepository
)

from app.services.gemini_service import (
    GeminiService
)
from app.utils.interview_utils import (
    generate_interview_code,
    generate_password
)

class InterviewGenerationService:

    @staticmethod
    async def generate(
        db,
        application
    ):

        interview = Interview(
            application_id=application.id,
            status="GENERATED",
            interview_code=
                generate_interview_code(),
            candidate_password=
                generate_password()
        )

        interview = await (
            InterviewRepository.create(
                db,
                interview
            )
        )

        sectionA_questions = [
            {
                "question": "Section A (Q1/10): In Python programming, which built-in data type is immutable (cannot be modified after creation)?",
                "options": ["A) Tuple", "B) List", "C) Dictionary", "D) Set"]
            },
            {
                "question": "Section A (Q2/10): Which keyword is used to define a function in Python?",
                "options": ["A) def", "B) function", "C) define", "D) func"]
            },
            {
                "question": "Section A (Q3/10): In SQL database queries, which statement is used to retrieve data from a database table?",
                "options": ["A) SELECT", "B) GET", "C) EXTRACT", "D) FIND"]
            },
            {
                "question": "Section A (Q4/10): Which HTTP method is standard for creating a new record in a RESTful API backend?",
                "options": ["A) POST", "B) GET", "C) PUT", "D) DELETE"]
            },
            {
                "question": "Section A (Q5/10): What is the value returned by `len([10, 20, 30, 40])` in Python?",
                "options": ["A) 4", "B) 3", "C) 5", "D) 40"]
            },
            {
                "question": "Section A (Q6/10): How do you access the value associated with key 'role' in Python dictionary `user = {'role': 'developer'}`?",
                "options": ["A) user['role']", "B) user.get_key('role')", "C) user(role)", "D) user->role"]
            },
            {
                "question": "Section A (Q7/10): In SQL database queries, which clause filters rows based on a specific condition?",
                "options": ["A) WHERE", "B) ORDER BY", "C) GROUP BY", "D) HAVING"]
            },
            {
                "question": "Section A (Q8/10): Which Git command creates a local working copy of a remote Git repository?",
                "options": ["A) git clone", "B) git copy", "C) git fork", "D) git download"]
            },
            {
                "question": "Section A (Q9/10): Which Python keyword immediately exits out of a `for` or `while` loop?",
                "options": ["A) break", "B) exit", "C) stop", "D) return"]
            },
            {
                "question": "Section A (Q10/10): Which standard Python module is used to parse JSON formatted strings?",
                "options": ["A) json", "B) parse_json", "C) pyjson", "D) string_json"]
            }
        ]

        # Add 10 MCQs
        for item in sectionA_questions:
            q_data = {
                "question": item["question"],
                "options": item["options"]
            }
            q_obj = InterviewQuestion(
                interview_id=interview.id,
                question=json.dumps(q_data)
            )
            db.add(q_obj)

        # Add Section B Coding Question
        q_secB = InterviewQuestion(
            interview_id=interview.id,
            question="Section B — Python Coding Challenge\nProblem: Given a list of integers nums and an integer target, complete the Python function two_sum(nums, target) to return the indices [i, j] of the two numbers such that they add up to target."
        )
        db.add(q_secB)

        await db.commit()

        result = await (
    InterviewRepository
    .get_by_id(
        db,
        interview.id
    )
)

        return {
    "interview_id":
        interview.id,

    "interview_code":
        interview.interview_code,

    "password":
        interview.candidate_password,

    "login_url":
        "http://localhost:5173/interview/login",

    "questions":
    [
        {
            "id": q.id,
            "question": q.question
        }
        for q in result.questions
    ]
}