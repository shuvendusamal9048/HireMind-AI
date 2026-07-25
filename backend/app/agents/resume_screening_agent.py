import tempfile
from app.services.pdf_service import PDFService
from app.services.gemini_service import GeminiService
from app.services.minio_service import client
import tempfile

from app.constants.application_constants import (
    ApplicationStatus
)
from app.services.email_service import (
    EmailService
)

class ResumeScreeningAgent:

    @staticmethod
    async def screen(
        db,
        application,
        job
    ):
        try:

            print(
                "Reading from MinIO:",
                application.resume_filename
            )

            # Download PDF from MinIO with local disk fallback
            try:
                obj = client.get_object(
                    "resumes",
                    application.resume_filename
                )
                pdf_bytes = obj.read()
            except Exception as minio_err:
                print(f"MinIO get_object unavailable ({minio_err}), reading from local file storage fallback...")
                import os
                base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
                local_file_path = os.path.join(base_dir, "uploads", "resumes", application.resume_filename)
                with open(local_file_path, "rb") as f:
                    pdf_bytes = f.read()

            # Save temporarily
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf"
            ) as temp_file:

                temp_file.write(pdf_bytes)
                temp_path = temp_file.name

            print("Temp PDF:", temp_path)

            # Extract text
            resume_text = (
                PDFService.extract_text(
                    temp_path
                )
            )

            print(
                resume_text[:1000]
            )

            # Gemini scoring
            score = (
                GeminiService.score_resume(
                    resume_text,
                    job
                )
            )

            print("Score:", score)

            application.resume_score = score
            application.ai_score = score
            application.is_shortlisted = (
                score >= 70
            )

            await db.commit()

            print(
                "Resume screening completed."
            )

        except Exception as e:
            print(
                "Resume Agent Error:"
            )
            print(e)

        application.resume_score = score
        application.ai_score = score

        if score >= 70:
            application.status = ApplicationStatus.SHORTLISTED
            application.is_shortlisted = True
            await db.commit()
            print("Candidate scored >= 70 and marked shortlisted (email notification pending HR action).")
        else:
            application.status = ApplicationStatus.REJECTED
            application.is_shortlisted = False
            await db.commit()
            print("Candidate scored < 70 and marked rejected.")