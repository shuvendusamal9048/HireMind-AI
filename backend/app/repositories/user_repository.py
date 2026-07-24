from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User


class UserRepository:

    @staticmethod
    async def get_user_by_email(
        db: AsyncSession,
        email: str
    ):
        from sqlalchemy.orm import selectinload
        result = await db.execute(
            select(User).options(selectinload(User.company)).where(
                User.email == email
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def get_user_by_id(
        db: AsyncSession,
        user_id
    ):
        result = await db.execute(
            select(User).where(
                User.id == user_id
            )
        )

        return result.scalar_one_or_none()

    @staticmethod
    async def create_user(
        db: AsyncSession,
        user: User
    ):
        db.add(user)

        await db.flush()
        await db.refresh(user)

        return user