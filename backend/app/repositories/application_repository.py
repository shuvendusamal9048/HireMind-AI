from uuid import UUID
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.candidate_application import (
    CandidateApplication
)

class ApplicationRepository:

    @staticmethod
    async def create(
        db,
        application
    ):
        db.add(application)

        await db.flush()
        await db.refresh(application)

        return application

    @staticmethod
    async def get_all_by_company(
        db,
        company_id
    ):
        result = await db.execute(
            select(
                CandidateApplication
            )
            .options(
                selectinload(
                    CandidateApplication.job
                )
            )
            .where(
                CandidateApplication.company_id
                == company_id
            )
        )

        return result.scalars().all()

    @staticmethod
    async def get_by_job(
        db,
        company_id,
        job_id
    ):
        result = await db.execute(
            select(
                CandidateApplication
            )
            .options(
                selectinload(
                    CandidateApplication.job
                )
            )
            .where(
                CandidateApplication.company_id
                == company_id,
                CandidateApplication.job_id
                == job_id
            )
        )

        return result.scalars().all()
    
    @staticmethod
    async def update(
        db,
        application
    ):
        await db.flush()
        await db.refresh(
            application
        )

        return application
    
    @staticmethod
    async def get_by_company(
        db,
        company_id
    ):
        result = await db.execute(
            select(
                CandidateApplication
            )
            .options(
                selectinload(
                    CandidateApplication.job
                )
            )
            .where(
                CandidateApplication.company_id
                == company_id
            )
            .order_by(
                CandidateApplication.ai_score.desc()
            )
        )

        return result.scalars().all()

    @staticmethod
    async def get_by_id(
        db,
        application_id
    ):
        try:
            if isinstance(application_id, str):
                application_id = UUID(application_id)
        except (ValueError, TypeError):
            return None

        result = await db.execute(
            select(
                CandidateApplication
            )
            .options(
                selectinload(
                    CandidateApplication.job
                )
            )
            .where(
                CandidateApplication.id
                == application_id
            )
        )

        return result.scalar_one_or_none()