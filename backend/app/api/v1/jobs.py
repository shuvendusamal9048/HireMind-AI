from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.ext.asyncio import (
    AsyncSession
)

from app.db.session import get_db
from app.schemas.job_schema import (
    JobCreate
)

from app.services.job_service import (
    JobService
)

from app.api.v1.dependencies.current_user import (
    get_current_user
)

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)

@router.post("")
async def create_job(
    request: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return await (
        JobService.create_job(
            db,
            current_user,
            request
        )
    )


@router.get("")
async def get_jobs(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return await (
        JobService.get_jobs(
            db,
            current_user
        )
    )

@router.get("/{job_id}")
async def get_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    job = await JobService.get_job_by_id(db, job_id, current_user)
    if not job:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Job position not found")
    return job

@router.put("/{job_id}")
async def update_job(
    job_id: str,
    request: JobCreate,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    job = await JobService.update_job(db, job_id, request, current_user)
    if not job:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Job position not found or unauthorized")
    return job

@router.delete("/{job_id}")
async def delete_job(
    job_id: str,
    db: AsyncSession = Depends(get_db),
    current_user=Depends(get_current_user)
):
    success = await JobService.delete_job(db, job_id, current_user)
    if not success:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Job position not found or unauthorized")
    return {"message": "Job deleted successfully"}