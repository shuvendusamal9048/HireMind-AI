from fastapi import (
    APIRouter,
    Depends,
    Form,
    File,
    UploadFile,
    HTTPException,
    BackgroundTasks
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db

from app.repositories.job_repository import (
    JobRepository
)

from app.repositories.application_repository import (
    ApplicationRepository
)

from app.models.candidate_application import (
    CandidateApplication
)

from app.services.minio_service import (
    upload_resume
)

from app.agents.resume_screening_agent import (
    ResumeScreeningAgent
)

router = APIRouter(
    prefix="/public/jobs",
    tags=["Public Jobs"]
)


@router.get("/{code}")
async def get_job(
    code: str,
    db: AsyncSession = Depends(get_db)
):

    job = await (
        JobRepository.get_by_application_code(
            db,
            code
        )
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return {
        "id": str(job.id),
        "title": job.title,
        "description": job.description,
        "experience": job.experience,
        "location": job.location,
        "employment_type": job.employment_type,
        "salary_min": job.salary_min,
        "salary_max": job.salary_max,
        "skills": job.skills,
        "company_name": job.company.name if job.company else "HireMind Client",
        "application_code": job.application_code
    }


@router.post("/{code}/apply")
async def apply(
    code: str,
    background_tasks: BackgroundTasks,
    candidate_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    resume: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):

    # Find Job
    job = await (
        JobRepository.get_by_application_code(
            db,
            code
        )
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    # Upload Resume To MinIO
    resume_data = upload_resume(
        resume
    )

    # Create Application
    application = (
        CandidateApplication(
            job_id=job.id,
            company_id=job.company_id,
            candidate_name=candidate_name,
            email=email,
            phone=phone,
            resume_filename=
                resume_data["filename"],
            resume_url=
                resume_data["url"]
        )
    )

    await (
        ApplicationRepository.create(
            db,
            application
        )
    )

    await db.commit()

    await db.refresh(
        application
    )

    # Run AI Screening
    background_tasks.add_task(
        ResumeScreeningAgent.screen,
        db,
        application,
        job
    )

    return {
        "message":
            "Application submitted successfully"
    }