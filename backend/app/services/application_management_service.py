from app.repositories.application_repository import ApplicationRepository
from app.constants.application_constants import ApplicationStatus
from app.services.email_service import EmailService


class ApplicationManagementService:

    @staticmethod
    async def shortlist(
        db,
        application_id
    ):
        from app.services.interview_generation_service import InterviewGenerationService
        from app.repositories.interview_repository import InterviewRepository
        import datetime

        application = await (
            ApplicationRepository.get_by_id(
                db,
                application_id
            )
        )

        if not application:
            return {
                "message": "Application not found"
            }

        application.is_shortlisted = True
        application.status = (
            ApplicationStatus.SHORTLISTED
        )

        await db.commit()

        # Check or generate Interview session
        interview = await InterviewRepository.get_by_application_id(db, application.id)
        if not interview:
            gen_res = await InterviewGenerationService.generate(db, application)
            interview_code = gen_res["interview_code"]
            password = gen_res["password"]
        else:
            interview_code = interview.interview_code
            password = interview.candidate_password

        job_title = application.job.title if getattr(application, 'job', None) else "Technical Position"
        deadline_date = (datetime.date.today() + datetime.timedelta(days=7)).strftime("%B %d, %Y")

        # 1. Send Shortlist Email
        try:
            await EmailService.send_shortlist_email(
                application.email,
                application.candidate_name,
                job_title
            )
        except Exception as e:
            print(f"Error sending shortlist email: {e}")

        # 2. Send Interview Schedule Email with Access Credentials
        try:
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
            <p style="margin: 0 0 15px 0; font-size: 14px;">Congratulations! You have been shortlisted for <strong>{job_title}</strong>. Your AI technical interview session is now active.</p>
            
            <div class="details-grid">
                <div style="margin-bottom: 8px;"><strong>Position:</strong> <span style="color: #4f46e5; font-weight: 700;">{job_title}</span></div>
                <div style="margin-bottom: 8px;"><strong>Complete exam before:</strong> <span style="color: #dc2626; font-weight: 800;">{deadline_date}</span></div>
                <div><strong>Session Host:</strong> AI HR Team</div>
            </div>

            <div class="creds-box">
                <div style="font-size: 11px; text-transform: uppercase; tracking: 1px; color: #94a3b8; font-weight: 700; margin-bottom: 12px;">Candidate Portal Access Credentials</div>
                <div class="cred-item">
                    <span style="font-size: 12px; color: #cbd5e1;">Interview Code:</span><br>
                    <span class="cred-val" style="color: #34d399;">{interview_code}</span>
                </div>
                <div class="cred-item" style="margin-top: 15px;">
                    <span style="font-size: 12px; color: #cbd5e1;">Candidate Password:</span><br>
                    <span class="cred-val" style="color: #818cf8;">{password}</span>
                </div>
            </div>

            <a href="http://localhost:5173/interview/login" class="btn">Launch Candidate Interview Portal →</a>

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
                f"📅 Technical AI Interview Invitation for {job_title} — Complete exam before {deadline_date}",
                html_body
            )
        except Exception as e:
            print(f"Error sending interview invitation email: {e}")

        return {
            "message": "Candidate shortlisted, interview created, and invitation emails sent successfully."
        }

    @staticmethod
    async def reject(
        db,
        application_id
    ):

        application = await (
            ApplicationRepository.get_by_id(
                db,
                application_id
            )
        )

        if not application:
            return {
                "message": "Application not found"
            }

        application.is_shortlisted = False
        application.status = (
            ApplicationStatus.REJECTED
        )

        await db.commit()

        return {
            "message": "Candidate rejected"
        }