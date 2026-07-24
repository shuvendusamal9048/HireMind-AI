from app.repositories.job_repository import JobRepository
from app.repositories.application_repository import (
    ApplicationRepository
)
from app.constants.application_constants import (
    ApplicationStatus
)


class DashboardService:

    @staticmethod
    async def get_stats(
        db,
        current_user
    ):

        jobs = await (
            JobRepository.get_jobs_by_company(
                db,
                current_user.company_id
            )
        )

        applications = await (
            ApplicationRepository.get_by_company(
                db,
                current_user.company_id
            )
        )

        shortlisted = len([
            x for x in applications
            if x.status ==
            ApplicationStatus.SHORTLISTED
        ])

        rejected = len([
            x for x in applications
            if x.status ==
            ApplicationStatus.REJECTED
        ])

        interviews = len([
            x for x in applications
            if x.status ==
            ApplicationStatus.INTERVIEW_SCHEDULED
        ])

        return {
            "total_jobs": len(jobs),
            "total_applications": len(applications),
            "shortlisted": shortlisted,
            "rejected": rejected,
            "interviews_scheduled": interviews
        }
    
    @staticmethod
    async def get_status_chart(
            db,
            current_user
        ):

            applications = await (
                ApplicationRepository.get_by_company(
                    db,
                    current_user.company_id
                )
            )

            data = {
                "Applied": 0,
                "Shortlisted": 0,
                "Rejected": 0,
                "Interview Scheduled": 0
            }

            for app in applications:

                if app.status == ApplicationStatus.APPLIED:
                    data["Applied"] += 1

                elif app.status == ApplicationStatus.SHORTLISTED:
                    data["Shortlisted"] += 1

                elif app.status == ApplicationStatus.REJECTED:
                    data["Rejected"] += 1

                elif (
                    app.status ==
                    ApplicationStatus.INTERVIEW_SCHEDULED
                ):
                    data["Interview Scheduled"] += 1

            return data
        
    @staticmethod
    async def get_top_candidates(
            db,
            current_user
        ):

            applications = await (
                ApplicationRepository.get_by_company(
                    db,
                    current_user.company_id
                )
            )

            applications = sorted(
                applications,
                key=lambda x:
                x.ai_score or 0,
                reverse=True
            )

            data = []

            for app in applications[:5]:

                data.append({
                    "candidate_name":
                        app.candidate_name,
                    "job_title":
                        app.job.title,
                    "score":
                        app.ai_score
                })

            return data