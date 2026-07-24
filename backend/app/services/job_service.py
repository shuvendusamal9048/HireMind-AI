from sqlalchemy.ext.asyncio import AsyncSession

from app.models.job import Job
from app.repositories.job_repository import (
    JobRepository
)

from app.utils.job_utils import (
    generate_application_code
)
class JobService:

    @staticmethod
    async def create_job(
        db: AsyncSession,
        current_user,
        request
    ):

        try:

            job = Job(
                company_id=current_user.company_id,
                title=request.title,
                description=request.description,
                experience=request.experience,
                location=request.location,
                employment_type=request.employment_type,
                salary_min=request.salary_min,
                salary_max=request.salary_max,
                skills=request.skills,
                application_code=
                    generate_application_code()
            )

            job = await (
                JobRepository.create_job(
                    db,
                    job
                )
            )

            await db.commit()

            return job

        except Exception:

            await db.rollback()
            raise

    @staticmethod
    async def get_jobs(
        db,
        current_user
    ):

        return await (
            JobRepository.get_jobs_by_company(
                db,
                current_user.company_id
            )
        )

    @staticmethod
    async def get_job_by_id(
        db: AsyncSession,
        job_id,
        current_user
    ):
        job = await JobRepository.get_by_id(db, job_id)
        if job and job.company_id == current_user.company_id:
            return job
        return None

    @staticmethod
    async def update_job(
        db: AsyncSession,
        job_id,
        request,
        current_user
    ):
        job = await JobRepository.get_by_id(db, job_id)
        if not job or job.company_id != current_user.company_id:
            return None
        
        try:
            job.title = request.title
            job.description = request.description
            job.experience = request.experience
            job.location = request.location
            job.employment_type = request.employment_type
            job.salary_min = request.salary_min
            job.salary_max = request.salary_max
            job.skills = request.skills
            
            await db.commit()
            await db.refresh(job)
            return job
        except Exception:
            await db.rollback()
            raise

    @staticmethod
    async def delete_job(
        db: AsyncSession,
        job_id,
        current_user
    ):
        job = await JobRepository.get_by_id(db, job_id)
        if not job or job.company_id != current_user.company_id:
            return False
        
        try:
            await db.delete(job)
            await db.commit()
            return True
        except Exception:
            await db.rollback()
            raise