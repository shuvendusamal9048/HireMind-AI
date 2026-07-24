from uuid import UUID

from fastapi import (
    APIRouter,
    Depends,
    HTTPException
)

from sqlalchemy.ext.asyncio import (
    AsyncSession
)

from app.db.session import get_db

from app.services.application_service import (
    ApplicationService
)

from app.api. v1.dependencies.current_user import (
    get_current_user
)

from app.services.application_management_service import (
    ApplicationManagementService
)

from app.schemas.interview_schema import (
    InterviewScheduleRequest
)


from app.services.interview_service import (
    InterviewService
)

from app.services.interview_generation_service import (
    InterviewGenerationService
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"]
)

@router.get("/")
async def get_applications(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    applications = await (
        ApplicationService
        .get_company_applications(
            db,
            current_user.company_id
        )
    )

    data = []

    for app in applications:

        data.append({
            "id": app.id,
            "candidate_name":
                app.candidate_name,
            "email":
                app.email,
            "phone":
                app.phone,
            "status":
                app.status,
            "resume_score":
                app.resume_score,
            "ai_score":
                app.ai_score,
            "job_title":
                app.job.title
        })

    return data

@router.get("/job/{job_id}")
async def get_job_applications(
    job_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    applications = await (
        ApplicationService
        .get_job_applications(
            db,
            current_user.company_id,
            job_id
        )
    )

    data = []

    for app in applications:

        data.append({
            "id": app.id,
            "candidate_name":
                app.candidate_name,
            "email":
                app.email,
            "phone":
                app.phone,
            "status":
                app.status,
            "resume_score":
                app.resume_score,
            "ai_score":
                app.ai_score,
            "job_title":
                app.job.title
        })

    return data

@router.get("")
async def get_applications(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):
    return await (
        ApplicationService.get_applications(
            db,
            current_user
        )
    )

@router.get("/job/{job_id}")
async def get_job_applications(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):
    return await (
        ApplicationService.get_job_applications(
            db,
            job_id
        )
    )

@router.get("/{application_id}")
async def get_application(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    application = await (
        ApplicationService.get_application(
            db,
            application_id
        )
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return application

@router.patch(
    "/{application_id}/shortlist"
)
async def shortlist(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return await (
        ApplicationManagementService.shortlist(
            db,
            application_id
        )
    )

@router.patch(
    "/{application_id}/reject"
)
async def reject(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return await (
        ApplicationManagementService.reject(
            db,
            application_id
        )
    )

@router.patch(
    "/{application_id}/schedule"
)
async def schedule_interview(
    application_id: str,
    request: InterviewScheduleRequest,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    application = await (
        ApplicationService
        .get_application(
            db,
            application_id
        )
    )

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return await (
        InterviewService.schedule(
            db,
            application,
            request
        )
    )

@router.post(
    "/{application_id}/generate-interview"
)
async def generate_interview(
    application_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    application = await (
        ApplicationService
        .get_application(
            db,
            application_id
        )
    )

    if not application:

        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    return await (
        InterviewGenerationService
        .generate(
            db,
            application
        )
    )