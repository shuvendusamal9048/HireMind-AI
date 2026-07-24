from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.company import Company
from app.services.email_service import EmailService

router = APIRouter(
    prefix="/admin",
    tags=["Super Admin"]
)

@router.get("/companies")
async def get_all_companies(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Company).order_by(Company.created_at.desc())
    )
    companies = result.scalars().all()
    
    return [
        {
            "id": str(c.id),
            "name": c.name,
            "company_code": c.company_code,
            "email": c.email,
            "gst_number": getattr(c, "gst_number", "") or "N/A",
            "approval_status": getattr(c, "approval_status", "APPROVED"),
            "is_active": c.is_active,
            "created_at": c.created_at.isoformat() if c.created_at else None
        }
        for c in companies
    ]

@router.post("/companies/{company_id}/approve")
async def approve_company(
    company_id: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    try:
        uuid_id = UUID(company_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid company ID format")

    result = await db.execute(
        select(Company).where(Company.id == uuid_id)
    )
    company = result.scalar_one_or_none()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.approval_status = "APPROVED"
    company.is_active = True
    await db.commit()

    # Send Approval Email in background
    background_tasks.add_task(
        EmailService.send_company_approval_email,
        company.email,
        company.name
    )

    return {
        "message": f"Company {company.name} approved successfully!",
        "company_id": str(company.id),
        "approval_status": company.approval_status
    }

@router.post("/companies/{company_id}/reject")
async def reject_company(
    company_id: str,
    db: AsyncSession = Depends(get_db)
):
    try:
        uuid_id = UUID(company_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid company ID format")

    result = await db.execute(
        select(Company).where(Company.id == uuid_id)
    )
    company = result.scalar_one_or_none()

    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    company.approval_status = "REJECTED"
    company.is_active = False
    await db.commit()

    return {
        "message": f"Company {company.name} rejected.",
        "company_id": str(company.id),
        "approval_status": company.approval_status
    }
