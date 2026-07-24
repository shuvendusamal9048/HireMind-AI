from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion
from app.models.interview_event import (
    InterviewEvent
)

class InterviewRepository:

    @staticmethod
    async def create(
        db,
        interview
    ):
        db.add(interview)

        await db.flush()
        await db.refresh(interview)

        return interview


    @staticmethod
    async def add_question(
        db,
        question
    ):
        db.add(question)


    @staticmethod
    async def get_by_id(
        db,
        interview_id
    ):
        result = await db.execute(
            select(Interview)
            .options(
                selectinload(
                    Interview.questions
                ),
                selectinload(
                    Interview.application
                )
            )
            .where(
                Interview.id
                == interview_id
            )
        )

        return result.scalar_one_or_none()


    @staticmethod
    async def get_by_code(
        db,
        code
    ):
        result = await db.execute(
            select(Interview)
            .options(
                selectinload(
                    Interview.application
                ),
                selectinload(
                    Interview.questions
                )
            )
            .where(
                Interview.interview_code
                == code
            )
        )

        return result.scalar_one_or_none()


    @staticmethod
    async def get_question(
        db,
        question_id
    ):
        result = await db.execute(
            select(
                InterviewQuestion
            ).where(
                InterviewQuestion.id
                == question_id
            )
        )

        return result.scalar_one_or_none()


    @staticmethod
    async def save_answer(
        db,
        question
    ):
        await db.flush()
        await db.refresh(question)

        return question
    
    @staticmethod
    async def add_event(
        db,
        interview_id,
        event_type,
        details=None
    ):

        event = InterviewEvent(
            interview_id=interview_id,
            event_type=event_type,
            details=details
        )

        db.add(event)

        await db.flush()

        return event

    @staticmethod
    async def get_by_application_id(
        db,
        application_id
    ):
        result = await db.execute(
            select(Interview)
            .options(
                selectinload(
                    Interview.questions
                ),
                selectinload(
                    Interview.application
                )
            )
            .where(
                Interview.application_id
                == application_id
            )
            .order_by(Interview.created_at.desc())
        )

        return result.scalars().first()

    @staticmethod
    async def get_all_by_company(
        db,
        company_id
    ):
        from app.models.candidate_application import CandidateApplication
        result = await db.execute(
            select(Interview)
            .join(Interview.application)
            .options(
                selectinload(
                    Interview.application
                ).selectinload(
                    CandidateApplication.job
                )
            )
            .where(
                CandidateApplication.company_id
                == company_id
            )
            .order_by(Interview.created_at.desc())
        )

        return result.scalars().all()
