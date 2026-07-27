import asyncio
import smtplib
from email.mime.text import MIMEText
from app.core.config import settings


class EmailService:

    @staticmethod
    def _send_email_sync(to_email: str, subject: str, html_body: str):
        msg = MIMEText(html_body, "html")
        msg["Subject"] = subject
        msg["From"] = settings.MAIL_USERNAME
        msg["To"] = to_email

        with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as server:
            server.ehlo()
            server.starttls()
            server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
            server.sendmail(settings.MAIL_USERNAME, [to_email], msg.as_string())

    @staticmethod
    async def send_shortlist_email(
        email: str,
        name: str,
        job_title: str
    ):
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 35px 30px; text-align: center; color: #ffffff; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }}
        .header p {{ margin: 6px 0 0 0; opacity: 0.9; font-size: 13px; font-weight: 500; }}
        .content {{ padding: 35px 30px; color: #334155; line-height: 1.6; }}
        .badge {{ display: inline-block; background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 12px; margin-bottom: 15px; border: 1px solid #bbf7d0; }}
        .job-card {{ background: #f1f5f9; border-left: 4px solid #4f46e5; padding: 18px 20px; border-radius: 12px; margin: 20px 0; }}
        .footer {{ background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HireMind AI — Recruitment</h1>
            <p>Autonomous Talent Acquisition Engine</p>
        </div>
        <div class="content">
            <div class="badge">🎉 APPLICATION SHORTLISTED</div>
            <h2 style="margin:0 0 12px 0; color: #0f172a; font-size: 20px;">Congratulations, {name}! 👋</h2>
            <p style="margin: 0 0 15px 0; font-size: 14px;">Our talent acquisition team and AI screening engine have reviewed your credentials and experience.</p>
            
            <div class="job-card">
                <div style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: #64748b; letter-spacing: 0.5px;">Target Position</div>
                <div style="font-size: 16px; font-weight: 800; color: #1e293b; margin-top: 4px;">{job_title}</div>
            </div>

            <p style="font-size: 14px;">You have been officially <strong>shortlisted</strong> for this role. Our recruitment team will be scheduling your AI technical interview session shortly.</p>
            <p style="font-size: 13px; color: #64748b; margin-top: 25px;">Best regards,<br><strong style="color: #334155;">HireMind AI HR Team</strong></p>
        </div>
        <div class="footer">
            © 2026 HireMind AI Platform. All rights reserved.
        </div>
    </div>
</body>
</html>
"""
        try:
            await asyncio.to_thread(EmailService._send_email_sync, email, f"🎉 You have been shortlisted for {job_title}", html_body)
            print(f"HTML Shortlist Email sent successfully to {email}")
        except Exception as e:
            print(f"Failed to send shortlist email to {email}: {e}")

    @staticmethod
    async def send_rejection_email(
        email: str,
        name: str,
        job_title: str
    ):
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }}
        .header {{ background: #1e293b; padding: 30px; text-align: center; color: #ffffff; }}
        .content {{ padding: 35px 30px; color: #334155; line-height: 1.6; }}
        .footer {{ background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin:0; font-size: 22px;">HireMind AI</h1>
        </div>
        <div class="content">
            <p style="font-size: 14px;">Hello {name},</p>
            <p style="font-size: 14px;">Thank you for your interest in the <strong>{job_title}</strong> position at our organization.</p>
            <p style="font-size: 14px;">After careful review of all applicants, we have decided to move forward with candidates whose qualifications more closely match our current requirements.</p>
            <p style="font-size: 14px;">We wish you the very best in your job search.</p>
            <p style="font-size: 13px; color: #64748b; margin-top: 25px;">Regards,<br><strong>HireMind AI Recruitment Team</strong></p>
        </div>
        <div class="footer">
            © 2026 HireMind AI Platform. All rights reserved.
        </div>
    </div>
</body>
</html>
"""
        try:
            await asyncio.to_thread(EmailService._send_email_sync, email, f"Application Update — {job_title}", html_body)
            print(f"HTML Rejection Email sent to {email}")
        except Exception as e:
            print(f"Failed to send rejection email to {email}: {e}")

    @staticmethod
    async def send_interview_email(
        email: str,
        subject: str,
        html_body: str
    ):
        try:
            await asyncio.to_thread(EmailService._send_email_sync, email, subject, html_body)
            print(f"HTML Interview Email sent successfully to {email}")
        except Exception as e:
            print(f"Failed to send interview email to {email}: {e}")

    @staticmethod
    async def send_company_approval_email(
        email: str,
        company_name: str
    ):
        html_body = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }}
        .container {{ max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }}
        .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 35px 30px; text-align: center; color: #ffffff; }}
        .header h1 {{ margin: 0; font-size: 24px; font-weight: 800; }}
        .content {{ padding: 35px 30px; color: #334155; line-height: 1.6; }}
        .btn {{ display: inline-block; background: #10b981; color: #ffffff !important; font-weight: 800; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-size: 14px; margin-top: 15px; }}
        .footer {{ background: #f8fafc; padding: 20px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }}
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HireMind AI — Company Approved</h1>
            <p>GST Verification Successful</p>
        </div>
        <div class="content">
            <h2 style="margin:0 0 12px 0; color: #0f172a; font-size: 20px;">Congratulations, {company_name}! 🎉</h2>
            <p style="font-size: 14px;">We are pleased to inform you that your company registration and GST number have been verified and <strong>APPROVED</strong> by the HireMind Super Admin.</p>
            <p style="font-size: 14px;">Your account is now fully active. You can log in to your employer portal to start creating job postings and evaluating candidates with AI.</p>
            <div style="text-align: center; margin: 25px 0;">
                <a href="http://localhost:5173/login" class="btn">Log In to Employer Dashboard</a>
            </div>
            <p style="font-size: 13px; color: #64748b;">Best regards,<br><strong>HireMind Admin Verification Team</strong></p>
        </div>
        <div class="footer">
            © 2026 HireMind AI Platform. All rights reserved.
        </div>
    </div>
</body>
</html>
"""
        try:
            await asyncio.to_thread(EmailService._send_email_sync, email, f"🎉 Company Approved — Welcome to HireMind AI ({company_name})", html_body)
            print(f"Company approval email sent to {email}")
        except Exception as e:
            print(f"Failed to send company approval email to {email}: {e}")