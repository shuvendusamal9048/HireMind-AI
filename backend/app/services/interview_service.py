from app.core.config import settings
from app.constants.application_constants import (
    ApplicationStatus
)

from app.services.email_service import (
    EmailService
)
from app.services.interview_generation_service import (
    InterviewGenerationService
)

from app.repositories.interview_repository import (
    InterviewRepository
)

class InterviewService:

    @staticmethod
    async def schedule(
        db,
        application,
        request
    ):

        application.interview_date = (
            request.interview_date.replace(
                tzinfo=None
            )
            if request.interview_date
            else None
        )

        application.interview_link = (
            f"{settings.FRONTEND_URL}/interview/login"
        )

        application.interviewer_name = (
            request.interviewer_name
        )

        application.status = (
            ApplicationStatus
            .INTERVIEW_SCHEDULED
        )

        await db.commit()

        existing_interview = await (
            InterviewRepository.get_by_application_id(
                db,
                application.id
            )
        )

        if existing_interview:
            interview_data = {
                "interview_id": existing_interview.id,
                "interview_code": existing_interview.interview_code,
                "password": existing_interview.candidate_password,
                "login_url": f"{settings.FRONTEND_URL}/interview/login"
            }
        else:
            interview_data = await (
                InterviewGenerationService.generate(
                    db,
                    application
                )
            )


        job_title = application.job.title if getattr(application, 'job', None) else "Technical Position"
        deadline_date = request.interview_date.strftime("%B %d, %Y") if hasattr(request.interview_date, 'strftime') else str(request.interview_date).split("T")[0]

        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #4f46e5 0%, #1e1b4b 100%); padding: 35px 30px; text-align: center; color: #ffffff; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 800; tracking: -0.5px; }}
        .header p {{ margin: 6px 0 0 0; color: #c7d2fe; font-size: 13px; font-weight: 500; }}
        .content {{ padding: 35px 30px; color: #334155; line-height: 1.6; }}
        .badge {{ display: inline-block; background: #e0e7ff; color: #4338ca; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 12px; margin-bottom: 15px; border: 1px solid #c7d2fe; }}
        .details-grid {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px; margin: 20px 0; }}
        .creds-box {{ background: #0f172a; border-radius: 16px; padding: 20px; color: #ffffff; margin: 25px 0; text-align: center; border: 1px solid #1e293b; }}
        .cred-item {{ margin: 10px 0; }}
        .cred-val {{ font-family: 'Courier New', Courier, monospace; font-size: 18px; font-weight: bold; background: #1e293b; padding: 6px 14px; border-radius: 8px; display: inline-block; border: 1px solid #334155; margin-top: 4px; }}
        .btn {{ display: block; width: 80%; margin: 25px auto 10px auto; background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); color: #ffffff !important; text-decoration: none; font-weight: 800; font-size: 15px; padding: 14px 20px; border-radius: 14px; text-align: center; box-shadow: 0 4px 14px rgba(79,70,229,0.3); }}
        .footer {{ background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HireMind AI Technical Assessment</h1>
            <p>Autonomous Candidate Interview Invitation</p>
        </div>
        <div class="content">
            <div class="badge">📅 INTERVIEW INVITATION</div>
            <h2 style="margin:0 0 10px 0; color: #0f172a; font-size: 20px;">Hello {application.candidate_name}, 👋</h2>
            <p style="margin: 0 0 15px 0; font-size: 14px;">Your AI technical interview session is now active. Please review your completion window below.</p>
            
            <div class="details-grid">
                <div style="margin-bottom: 8px;"><strong>Position:</strong> <span style="color: #4f46e5; font-weight: 700;">{job_title}</span></div>
                <div style="margin-bottom: 8px;"><strong>Complete exam before:</strong> <span style="color: #dc2626; font-weight: 800;">{deadline_date}</span></div>
                <div><strong>Session Host:</strong> {request.interviewer_name}</div>
            </div>

            <div class="creds-box">
                <div style="font-size: 11px; text-transform: uppercase; tracking: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 12px;">Candidate Portal Access Credentials</div>
                <div class="cred-item">
                    <span style="font-size: 12px; color: #cbd5e1;">Interview Code:</span><br>
                    <span class="cred-val" style="color: #34d399;">{interview_data["interview_code"]}</span>
                </div>
                <div class="cred-item" style="margin-top: 15px;">
                    <span style="font-size: 12px; color: #cbd5e1;">Candidate Password:</span><br>
                    <span class="cred-val" style="color: #818cf8;">{interview_data["password"]}</span>
                </div>
            </div>

            <a href="{settings.FRONTEND_URL}/interview/login" class="btn">Launch Candidate Interview Portal →</a>

            <p style="font-size: 12px; color: #64748b; text-align: center; margin-top: 20px;">
                💡 <strong>Flexible Assessment Deadline:</strong> You may complete your online AI technical interview at any time convenient to you before <strong>{deadline_date}</strong>. Please ensure your webcam and proctoring permissions are enabled before starting.
            </p>
        </div>
        <div class="footer">
            © 2026 HireMind AI Platform. All rights reserved.
        </div>
    </div>
</body>
</html>
"""
        await EmailService.send_interview_email(
            application.email,
            f"📅 Technical AI Interview Invitation — {job_title}",
            html_body
        )
        return {
    "message":
        "Interview scheduled successfully",

    "interview_code":
        interview_data["interview_code"],

    "password":
        interview_data["password"],

    "login_url":
        f"{settings.FRONTEND_URL}/interview/login"
}