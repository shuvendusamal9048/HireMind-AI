from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job
from sqlalchemy import select

class JobRepository:

    @staticmethod
    async def create_job(
        db: AsyncSession,
        job: Job
    ):
        db.add(job)

        await db.flush()
        await db.refresh(job)

        return job

    @staticmethod
    async def get_jobs_by_company(
        db: AsyncSession,
        company_id
    ):
        result = await db.execute(
            select(Job).where(
                Job.company_id ==
                company_id
            )
        )

        return result.scalars().all()

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        job_id
    ):
        from uuid import UUID
        try:
            if isinstance(job_id, str):
                job_id = UUID(job_id)
        except (ValueError, TypeError):
            return None

        from sqlalchemy.orm import selectinload
        result = await db.execute(
            select(Job)
            .options(selectinload(Job.company))
            .where(
                Job.id == job_id
            )
        )

        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_by_application_code(
        db,
        code
    ):
        from sqlalchemy.orm import selectinload
        result = await db.execute(
            select(Job)
            .options(selectinload(Job.company))
            .where(
                Job.application_code == code
            )
        )

        return result.scalar_one_or_none()