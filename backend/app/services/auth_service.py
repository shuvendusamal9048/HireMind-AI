from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.company import Company
from app.models.user import User
from app.repositories.company_repository import CompanyRepository
from app.repositories.user_repository import UserRepository
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token
)
from app.utils.company_code import generate_company_code

class AuthService:

    @staticmethod
    async def register_company(
        db: AsyncSession,
        company_name: str,
        admin_name: str,
        email: str,
        password: str,
        gst_number: str = ""
    ):

        existing_user = (
            await UserRepository.get_user_by_email(
                db,
                email
            )
        )

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        try:
            company = Company(
                name=company_name,
                company_code=generate_company_code(),
                email=email,
                gst_number=gst_number,
                approval_status="PENDING",
                is_active=False
            )

            company = await (
                CompanyRepository.create_company(
                    db,
                    company
                )
            )

            user = User(
                company_id=company.id,
                name=admin_name,
                email=email,
                password_hash=hash_password(
                    password
                ),
                role="ADMIN"
            )

            await UserRepository.create_user(
                db,
                user
            )

            await db.commit()

            return {
                "message":
                "Company registered successfully. Account is PENDING admin approval & GST verification."
            }

        except Exception as e:

            await db.rollback()

            raise HTTPException(
                status_code=500,
                detail=str(e)
            )

    @staticmethod
    async def login(
        db: AsyncSession,
        email: str,
        password: str
    ):
        # Super Admin Hardcoded Credentials check (rishisamal2005@gmail.com / Samal@123)
        if email.strip().lower() == "rishisamal2005@gmail.com" and password == "Samal@123":
            token = create_access_token(
                {
                    "sub": "admin-super-01",
                    "company_id": "00000000-0000-0000-0000-000000000000",
                    "role": "SUPER_ADMIN",
                    "email": "rishisamal2005@gmail.com",
                    "name": "Super Admin"
                }
            )
            return {
                "access_token": token,
                "token_type": "bearer",
                "role": "SUPER_ADMIN",
                "message": "Super Admin login successful"
            }

        user = await (
            UserRepository.get_user_by_email(
                db,
                email
            )
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        if not verify_password(
            password,
            user.password_hash
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid credentials"
            )

        # Check Company Approval Status
        if user.company:
            status = getattr(user.company, "approval_status", "APPROVED")
            is_active = getattr(user.company, "is_active", True)

            if status == "PENDING" or not is_active:
                raise HTTPException(
                    status_code=403,
                    detail="Your company registration is currently PENDING admin approval. You will receive an email once your GST number is verified."
                )

            if status == "REJECTED":
                raise HTTPException(
                    status_code=403,
                    detail="Your company registration was REJECTED by HireMind Admin. Please contact support."
                )

        token = create_access_token(
            {
                "sub": str(user.id),
                "company_id": str(user.company_id),
                "role": user.role
            }
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "role": user.role
        }