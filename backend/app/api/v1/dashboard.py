from fastapi import (
    APIRouter,
    Depends
)

from sqlalchemy.ext.asyncio import (
    AsyncSession
)

from app.db.session import get_db

from app.api.v1.dependencies.current_user import (
    get_current_user
)

from app.services.dashboard_service import (
    DashboardService
)

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
async def stats(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return await (
        DashboardService.get_stats(
            db,
            current_user
        )
    )


@router.get("/status-chart")
async def status_chart(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return await (
        DashboardService.get_status_chart(
            db,
            current_user
        )
    )


@router.get("/top-candidates")
async def top_candidates(
    db: AsyncSession = Depends(get_db),
    current_user=Depends(
        get_current_user
    )
):

    return await (
        DashboardService.get_top_candidates(
            db,
            current_user
        )
    )