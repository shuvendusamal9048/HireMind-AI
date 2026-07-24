from app.repositories.application_repository import (
    ApplicationRepository
)


class ApplicationService:

    @staticmethod
    async def get_company_applications(
        db,
        company_id
    ):
        return await (
            ApplicationRepository
            .get_all_by_company(
                db,
                company_id
            )
        )

    @staticmethod
    async def get_job_applications(
        db,
        company_id,
        job_id
    ):
        return await (
            ApplicationRepository
            .get_by_job(
                db,
                company_id,
                job_id
            )
        )
    
    @staticmethod
    async def get_applications(
        db,
        current_user
    ):
        return await (
            ApplicationRepository.get_by_company(
                db,
                current_user.company_id
            )
        )

    @staticmethod
    async def get_application(
        db,
        application_id
    ):
        return await (
            ApplicationRepository.get_by_id(
                db,
                application_id
            )
        )