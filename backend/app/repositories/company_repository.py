from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company


class CompanyRepository:

    @staticmethod
    async def get_company_by_email(
        db: AsyncSession,
        email: str
    ):
        result = await db.execute(
            select(Company).where(
                Company.email == email
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def create_company(
        db: AsyncSession,
        company: Company
    ):
        db.add(company)

        await db.flush()
        await db.refresh(company)

        return company