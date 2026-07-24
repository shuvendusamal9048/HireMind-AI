import json

from app.services.gemini_service import (
    GeminiService
)


class InterviewReportService:

    @staticmethod
    def generate_report(
        interview,
        questions
    ):

        prompt = f"""
Candidate Overall Score:
{interview.overall_score}

Recommendation:
{interview.recommendation}

Questions and Answers:

"""

        for q in questions:

            prompt += f"""

Question:
{q.question}

Answer:
{q.answer}

Score:
{q.score}

Feedback:
{q.feedback}

"""

        prompt += """

Return ONLY JSON:

{
    "strengths": [],
    "weaknesses": [],
    "summary": "",
    "recommendation": ""
}
"""

        model = (
            GeminiService.get_model()
        )

        response = (
            model.generate_content(
                prompt
            )
        )

        text = (
            response.text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        try:
            return json.loads(text)

        except:
            return {
                "summary": text
            }