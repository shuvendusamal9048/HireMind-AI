from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)
from app.schemas.interview_login_schema import (
    InterviewLoginRequest
)

from sqlalchemy.ext.asyncio import (
    AsyncSession
)

from app.schemas.interview_login_schema import (
    InterviewLoginRequest
)

from app.db.session import (
    get_db
)

from app.repositories.interview_repository import (
    InterviewRepository
)

from app.schemas.interview_answer_schema import (
    InterviewSubmitRequest
)

from app.services.interview_evalution_service import (
    InterviewEvaluationService
)
from app.schemas.question_answer_schema import (
    SaveAnswerRequest
)

from datetime import datetime

from app.schemas.interview_event_schema import (
    InterviewEventRequest
)

from app.api.v1.dependencies.current_user import get_current_user

router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"]
)

@router.get("/")
async def get_company_interviews(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    interviews = await InterviewRepository.get_all_by_company(
        db,
        current_user.company_id
    )

    data = []
    for it in interviews:
        app = it.application
        job_title = app.job.title if (app and hasattr(app, "job") and app.job) else "Software Position"
        data.append({
            "id": str(it.id),
            "candidate_name": app.candidate_name if app else "Candidate",
            "job_title": job_title,
            "email": app.email if app else "",
            "interview_code": it.interview_code or "N/A",
            "password": it.candidate_password or "N/A",
            "scheduled_at": app.interview_date.isoformat() if (app and app.interview_date) else it.created_at.isoformat(),
            "interviewer": app.interviewer_name if (app and app.interviewer_name) else "AI Host",
            "status": "SCHEDULED" if not it.is_completed else "COMPLETED"
        })

    return data

@router.get("/{interview_id}")
async def get_interview(
    interview_id: str,
    db: AsyncSession = Depends(
        get_db
    )
):
    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    import json
    import re
    sectionA = []
    sectionB = None

    for q in interview.questions:
        q_text = str(q.question or "")
        options = [
            "A) Option A",
            "B) Option B",
            "C) Option C",
            "D) Option D"
        ]

        if isinstance(q_text, str) and q_text.strip().startswith("{"):
            try:
                parsed = json.loads(q_text)
                q_text = parsed.get("question", q_text)
                if "options" in parsed:
                    options = parsed["options"]
            except Exception:
                pass

        is_coding = "Section B" in q_text or "two_sum" in q_text or "Coding Challenge" in q_text

        if is_coding:
            sectionB = {
                "id": str(q.id),
                "title": "Section B — Python Coding Challenge",
                "problem": "Given a list of integers nums and an integer target, complete the Python function two_sum(nums, target) to return the indices [i, j] of the two numbers such that they add up to target.",
                "starterCode": "def two_sum(nums, target):\n    # Write code here\n    pass",
                "testCases": [
                    {"id": 1, "name": "Test Case 1", "input": "nums = [2, 7, 11, 15], target = 9", "expected": "[0, 1]"},
                    {"id": 2, "name": "Test Case 2", "input": "nums = [3, 2, 4], target = 6", "expected": "[1, 2]"},
                    {"id": 3, "name": "Test Case 3", "input": "nums = [3, 3], target = 6", "expected": "[0, 1]"}
                ]
            }
        else:
            sectionA.append({
                "id": str(q.id),
                "question": q_text,
                "options": options
            })

    # Sort sectionA by Q1..Q10 sequence
    def extract_q_num(item):
        match = re.search(r'Q(\d+)\/10', item["question"])
        return int(match.group(1)) if match else 99

    sectionA.sort(key=extract_q_num)

    if not sectionB and len(interview.questions) > 0:
        last_q = interview.questions[-1]
        sectionB = {
            "id": str(last_q.id),
            "title": "Section B — Python Coding Challenge",
            "problem": "Given a list of integers nums and an integer target, complete the Python function two_sum(nums, target) to return the indices [i, j] of the two numbers such that they add up to target.",
            "starterCode": "def two_sum(nums, target):\n    # Write code here\n    pass",
            "testCases": [
                {"id": 1, "name": "Test Case 1", "input": "nums = [2, 7, 11, 15], target = 9", "expected": "[0, 1]"},
                {"id": 2, "name": "Test Case 2", "input": "nums = [3, 2, 4], target = 6", "expected": "[1, 2]"},
                {"id": 3, "name": "Test Case 3", "input": "nums = [3, 3], target = 6", "expected": "[0, 1]"}
            ]
        }

    return {
        "id": str(interview.id),
        "sectionA": sectionA,
        "sectionB": sectionB
    }

@router.post(
    "/{interview_id}/submit"
)
async def submit(
    interview_id: str,
    request:
    InterviewSubmitRequest,
    db: AsyncSession = Depends(
        get_db
    )
):

    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:

        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return await (
        InterviewEvaluationService
        .submit_answers(
            db,
            interview,
            request
        )
    )

@router.get(
    "/{interview_id}/report"
)
async def get_report(
    interview_id: str,
    db: AsyncSession = Depends(
        get_db
    )
):

    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:

        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return {
        "interview_id":
            interview.id,
        "overall_score":
            interview.overall_score,
        "technical_score":
            interview.technical_score,
        "communication_score":
            interview.communication_score,
        "confidence_score":
            interview.confidence_score,
        "recommendation":
            interview.recommendation,
        "report":
            interview.report
    }
@router.post(
    "/login"
)
async def login(
    request: InterviewLoginRequest,
    db: AsyncSession = Depends(
        get_db
    )
):
    interview = await (
        InterviewRepository
        .get_by_code(
            db,
            request.interview_code
        )
    )

    if (
        not interview
        or
        interview.candidate_password
        != request.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid interview access code or candidate password."
        )

    if interview.is_completed:
        raise HTTPException(
            status_code=400,
            detail="Interview session already completed. You have already submitted your examination for this position."
        )

    return {
        "interview_id": str(interview.id),
        "status": interview.status,
        "candidate_name":
            interview.application.candidate_name if interview.application else "Candidate",
        "message":
            "Login successful"
    }

@router.post(
    "/{interview_id}/start"
)
async def start_interview(
    interview_id: str,
    db: AsyncSession = Depends(
        get_db
    )
):

    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if interview.is_started:
        return {
            "message":
                "Interview already started"
        }

    interview.is_started = True
    interview.status = "IN_PROGRESS"
    interview.started_at = datetime.utcnow()

    await db.commit()

    return {
        "message":
            "Interview started"
    }


@router.get(
    "/{interview_id}/progress"
)
async def get_progress(
    interview_id: str,
    db: AsyncSession = Depends(
        get_db
    )
):

    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    answered = len(
        [
            q
            for q in interview.questions
            if q.answer
        ]
    )

    return {
        "total_questions":
            len(
                interview.questions
            ),

        "answered":
            answered,

        "remaining":
            len(
                interview.questions
            )
            -
            answered
    }

@router.post(
    "/{interview_id}/finish"
)
async def finish(
    interview_id: str,
    db: AsyncSession = Depends(
        get_db
    )
):

    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    if interview.is_completed:
        return {
            "message":
                "Interview already completed"
        }

    interview.is_completed = True
    interview.status = "COMPLETED"
    interview.ended_at = datetime.utcnow()

    await db.commit()

    return {
        "message":
            "Interview finished"
    }

@router.post(
    "/{interview_id}/submit"
)
async def submit_interview(
    interview_id: str,
    request: InterviewSubmitRequest,
    db: AsyncSession = Depends(
        get_db
    )
):
    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return await (
        InterviewEvaluationService
        .submit_answers(
            db,
            interview,
            request
        )
    )
@router.post(
    "/questions/{question_id}/answer"
)
async def save_answer(
    question_id: str,
    request: SaveAnswerRequest,
    db: AsyncSession = Depends(
        get_db
    )
):
    question = await (
    InterviewRepository
    .get_question(
        db,
        question_id
    )
    )

    if not question:
        raise HTTPException(
            status_code=404,
            detail="Question not found"
        )

    question.answer = request.answer

    await (
        InterviewRepository
        .save_answer(
            db,
            question
        )
    )

    await db.commit()

    return {
        "message":
            "Answer saved"
    }
@router.get(
    "/{interview_id}/questions"
)
async def get_questions(
    interview_id: str,
    db: AsyncSession = Depends(
        get_db
    )
):

    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    return [
        {
            "id": q.id,
            "question": q.question,
            "answer": q.answer,
            "score": q.score,
            "feedback": q.feedback
        }
        for q in interview.questions
    ]

@router.post(
    "/{interview_id}/event"
)
async def add_event(
    interview_id: str,
    request: InterviewEventRequest,
    db: AsyncSession = Depends(
        get_db
    )
):

    interview = await (
        InterviewRepository
        .get_by_id(
            db,
            interview_id
        )
    )

    if not interview:
        raise HTTPException(
            status_code=404,
            detail="Interview not found"
        )

    await (
        InterviewRepository
        .add_event(
            db,
            interview_id,
            request.event_type,
            request.details
        )
    )

    await db.commit()

    return {
        "message":
            "Event saved"
    }