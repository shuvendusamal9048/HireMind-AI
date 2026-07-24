import json
import google.generativeai as genai

from app.core.config import settings


genai.configure(
    api_key=settings.GEMINI_API_KEY
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


import google.generativeai as genai

from app.core.config import settings


genai.configure(
    api_key=settings.GEMINI_API_KEY
)


class GeminiService:

    @staticmethod
    def get_model():

        return genai.GenerativeModel(
            "gemini-2.5-flash"
        )

    @staticmethod
    def score_resume(
        resume_text,
        job
    ):

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        prompt = f"""
You are an ATS Resume Screening AI.

Job Title:
{job.title}

Job Description:
{job.description}

Required Skills:
{job.skills}

Candidate Resume:
{resume_text}

Give ONLY a score from 0 to 100.

Output example:
78
"""

        response = model.generate_content(
            prompt
        )

        score_text = (
            response.text.strip()
        )

        print("Gemini Response:")
        print(score_text)

        try:
            score = int(
                "".join(
                    filter(
                        str.isdigit,
                        score_text
                    )
                )
            )

        except:
            score = 0

        return min(score, 100)
    
    @staticmethod
    def generate_questions(
        application
    ):

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        job_title = application.job.title if getattr(application, 'job', None) else "Software Developer"

        prompt = f"""
You are an expert AI Technical Recruiter.

Job Role: {job_title}
Candidate Resume Summary:
{application.parsed_resume_text[:2000] if application.parsed_resume_text else 'Software engineering candidate'}

Generate EXACTLY 20 Multiple-Choice Questions (MCQs).

Each question MUST include:
- Question text
- Exactly 4 options (A, B, C, D)

Return ONLY a JSON array of 20 objects. Example format:
[
  {{
    "question": "What is the primary benefit of React Virtual DOM?",
    "options": [
      "A) Direct manipulation of browser DOM nodes",
      "B) Minimizing real DOM reflows by diffing lightweight in-memory representations",
      "C) Bypassing JavaScript execution engine",
      "D) Replacing CSS stylesheet compilation"
    ]
  }}
]
"""

        try:
            response = model.generate_content(prompt)
            text = response.text.replace("```json", "").replace("```", "").strip()
            questions_data = json.loads(text)
            
            formatted_questions = []
            for item in questions_data:
                if isinstance(item, dict):
                    formatted_questions.append(json.dumps(item))
                else:
                    formatted_questions.append(str(item))
                    
            if len(formatted_questions) >= 20:
                return formatted_questions[:20]
            return formatted_questions
        except Exception as e:
            print("Gemini generate_questions error, fallback:", e)
            return []
    
    @staticmethod
    def evaluate_answer(
        question,
        answer
    ):

        model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

        prompt = f"""
    You are an AI Technical Interviewer.

    Question:
    {question}

    Candidate Answer:
    {answer}

    Evaluate the answer.

    Return ONLY JSON.

    Example:

    {{
        "score": 78,
        "feedback":
        "Good understanding but missing optimization details.",
        "communication_score":80,
        "confidence_score":75
    }}
    """

        response = model.generate_content(
            prompt
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
                "score": 0,
                "feedback":
                "Evaluation Failed",
                "communication_score": 0,
                "confidence_score": 0
            }
        
    