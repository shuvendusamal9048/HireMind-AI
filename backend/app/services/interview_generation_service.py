import json
from app.core.config import settings

from app.models.interview import Interview
from app.models.interview_question import InterviewQuestion

from app.repositories.interview_repository import (
    InterviewRepository
)

from app.services.gemini_service import (
    GeminiService
)
from app.utils.interview_utils import (
    generate_interview_code,
    generate_password
)

class InterviewGenerationService:

    @staticmethod
    async def generate(
        db,
        application
    ):

        interview = Interview(
            application_id=application.id,
            status="GENERATED",
            interview_code=
                generate_interview_code(),
            candidate_password=
                generate_password()
        )

        interview = await (
            InterviewRepository.create(
                db,
                interview
            )
        )

        sectionA_questions = [
            # Advanced Python (Q1 to Q5)
            {
                "question": "Section A (Q1/15 — Advanced Python): In Python, what does the `@functools.wraps(fn)` decorator do when creating a custom decorator?",
                "options": [
                    "A) Preserves the original function's name, docstring, and metadata",
                    "B) Automatically compiles the decorated function into C extension code",
                    "C) Converts the decorated function into an asynchronous coroutine",
                    "D) Enforces type checking at runtime for all function arguments"
                ]
            },
            {
                "question": "Section A (Q2/15 — Advanced Python): What is the main operational difference between a Python Generator function (using `yield`) and a function returning a list?",
                "options": [
                    "A) Generators evaluate lazily and yield values one at a time with minimal memory overhead",
                    "B) Generators run faster because they bypass Python GIL lock",
                    "C) Regular functions returning lists cannot be iterated over in a for loop",
                    "D) Generator functions store all output items permanently in CPU Cache"
                ]
            },
            {
                "question": "Section A (Q3/15 — Advanced Python): How does CPython's Global Interpreter Lock (GIL) affect multi-threaded execution?",
                "options": [
                    "A) Prevents multiple native CPU threads from executing Python bytecode simultaneously in parallel",
                    "B) Prevents multiprocessing processes from sharing memory",
                    "C) Automatically garbage collects unused variables after 10 seconds",
                    "D) Restricts Python scripts from executing network socket operations"
                ]
            },
            {
                "question": "Section A (Q4/15 — Advanced Python): In Python OOP, which dunder methods must be defined to create an asynchronous Context Manager (`async with`)?",
                "options": [
                    "A) __aenter__ and __aexit__",
                    "B) __enter__ and __exit__",
                    "C) __init__ and __del__",
                    "D) __async_start__ and __async_stop__"
                ]
            },
            {
                "question": "Section A (Q5/15 — Advanced Python): What will be the output of `list(map(lambda x: x * 2, filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5])))`?",
                "options": [
                    "A) [4, 8]",
                    "B) [2, 4, 6, 8, 10]",
                    "C) [2, 6, 10]",
                    "D) [1, 4, 9, 16, 25]"
                ]
            },

            # Medium Machine Learning (Q6 to Q10)
            {
                "question": "Section A (Q6/15 — Medium ML): Which technique is primarily used to mitigate the Problem of Overfitting in Decision Tree models?",
                "options": [
                    "A) Cost-Complexity Pruning and setting max_depth bounds",
                    "B) Increasing the number of tree splits infinitely",
                    "C) Using One-Hot Encoding on numeric features",
                    "D) Disabling feature scaling completely"
                ]
            },
            {
                "question": "Section A (Q7/15 — Medium ML): When evaluating a Classification model on a highly imbalanced dataset (e.g., 99% negative, 1% positive), which metric is LEAST informative?",
                "options": [
                    "A) Overall Accuracy",
                    "B) F1-Score",
                    "C) Precision-Recall AUC (PR-AUC)",
                    "D) Balanced Accuracy"
                ]
            },
            {
                "question": "Section A (Q8/15 — Medium ML): What is the principal mathematical objective of Principal Component Analysis (PCA)?",
                "options": [
                    "A) Transform correlated features into uncorrelated orthogonal components maximizing variance",
                    "B) Train deep neural network weights via backpropagation",
                    "C) Predict discrete class labels using Bayes theorem",
                    "D) Automatically cluster data without specifying number of clusters"
                ]
            },
            {
                "question": "Section A (Q9/15 — Medium ML): In Gradient Descent optimization, what occurs if the learning rate hyperparameter (alpha) is set excessively high?",
                "options": [
                    "A) The optimization algorithm may overshoot the minimum and diverge",
                    "B) The model will converge to the global minimum instantaneously",
                    "C) The loss function will immediately drop to 0.0",
                    "D) The weights will freeze and stop updating altogether"
                ]
            },
            {
                "question": "Section A (Q10/15 — Medium ML): Which loss function is standard for training Binary Logistic Regression models?",
                "options": [
                    "A) Binary Cross-Entropy (Log Loss)",
                    "B) Mean Squared Error (MSE)",
                    "C) Mean Absolute Error (MAE)",
                    "D) Categorical Hinge Loss"
                ]
            },

            # Easy Generative AI (Q11 to Q15)
            {
                "question": "Section A (Q11/15 — Easy Gen AI): What does the acronym LLM stand for in Generative AI technology?",
                "options": [
                    "A) Large Language Model",
                    "B) Linear Logic Machine",
                    "C) Layered Learning Mechanism",
                    "D) Latent Language Matrix"
                ]
            },
            {
                "question": "Section A (Q12/15 — Easy Gen AI): In Large Language Models (LLMs), what is a 'Prompt'?",
                "options": [
                    "A) The input text or instruction given to an AI model to guide its response",
                    "B) The hardware GPU clock speed of the AI server",
                    "C) The database storage format for text embeddings",
                    "D) The error notification displayed when a query fails"
                ]
            },
            {
                "question": "Section A (Q13/15 — Easy Gen AI): What is 'Hallucination' in the context of Generative AI language models?",
                "options": [
                    "A) When an AI model generates plausible-sounding but incorrect or fabricated facts",
                    "B) When an AI server overheats during inference",
                    "C) When an AI model runs out of memory while tokenizing text",
                    "D) When an AI system encrypts user input data"
                ]
            },
            {
                "question": "Section A (Q14/15 — Easy Gen AI): What fundamental neural network architecture introduced in 2017 forms the foundation for modern LLMs like ChatGPT and Gemini?",
                "options": [
                    "A) Transformer (Self-Attention mechanism)",
                    "B) Convolutional Neural Network (CNN)",
                    "C) Recurrent Neural Network (RNN)",
                    "D) Multi-Layer Perceptron (MLP)"
                ]
            },
            {
                "question": "Section A (Q15/15 — Easy Gen AI): What is RAG (Retrieval-Augmented Generation) used for in Generative AI applications?",
                "options": [
                    "A) Enhancing LLM responses by retrieving external factual documents from a database or vector store",
                    "B) Training an AI model from scratch using raw image pixels",
                    "C) Compressing LLM model file sizes for mobile deployment",
                    "D) Generating synthetic audio files from text descriptions"
                ]
            }
        ]

        # Add 10 MCQs
        for item in sectionA_questions:
            q_data = {
                "question": item["question"],
                "options": item["options"]
            }
            q_obj = InterviewQuestion(
                interview_id=interview.id,
                question=json.dumps(q_data)
            )
            db.add(q_obj)

        # Add Section B Coding Question
        q_secB = InterviewQuestion(
            interview_id=interview.id,
            question="Section B — Python Coding Challenge\nProblem: Given a list of integers nums and an integer target, complete the Python function two_sum(nums, target) to return the indices [i, j] of the two numbers such that they add up to target."
        )
        db.add(q_secB)

        await db.commit()

        result = await (
    InterviewRepository
    .get_by_id(
        db,
        interview.id
    )
)

        return {
    "interview_id":
        interview.id,

    "interview_code":
        interview.interview_code,

    "password":
        interview.candidate_password,

    "login_url":
        f"{settings.FRONTEND_URL}/interview/login",

    "questions":
    [
        {
            "id": q.id,
            "question": q.question
        }
        for q in result.questions
    ]
}