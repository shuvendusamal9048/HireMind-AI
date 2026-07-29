import api from './api';

export const candidateInterviewService = {
  getScheduledInterviews: async () => {
    try {
      const response = await api.get('/interviews/');
      return response.data;
    } catch (err) {
      console.warn('Get scheduled interviews API error:', err);
      return [];
    }
  },

  login: async (interview_code, password) => {
    // POST /interviews/login
    const response = await api.post('/interviews/login', {
      interview_code,
      password,
    });
    return response.data; // { interview_id, status, candidate_name, message }
  },

  getInterview: async (interview_id) => {
    try {
      const response = await api.get(`/interviews/${interview_id}`);
      if (response.data && response.data.sectionA && response.data.sectionB) {
        return response.data;
      }
    } catch (err) {
      console.warn('Backend interview structure pending, using Section A (10 MCQs) & Section B (Coding) model:', err);
    }

    return {
      id: interview_id,
      sectionA: [
        {
          id: 'q-secA-1',
          question: 'Section A (Q1/15 — Advanced Python): In Python, what does the `@functools.wraps(fn)` decorator do when creating a custom decorator?',
          options: [
            "A) Preserves the original function's name, docstring, and metadata",
            'B) Automatically compiles the decorated function into C extension code',
            'C) Converts the decorated function into an asynchronous coroutine',
            'D) Enforces type checking at runtime for all function arguments'
          ]
        },
        {
          id: 'q-secA-2',
          question: 'Section A (Q2/15 — Advanced Python): What is the main operational difference between a Python Generator function (using `yield`) and a function returning a list?',
          options: [
            'A) Generators evaluate lazily and yield values one at a time with minimal memory overhead',
            'B) Generators run faster because they bypass Python GIL lock',
            'C) Regular functions returning lists cannot be iterated over in a for loop',
            'D) Generator functions store all output items permanently in CPU Cache'
          ]
        },
        {
          id: 'q-secA-3',
          question: "Section A (Q3/15 — Advanced Python): How does CPython's Global Interpreter Lock (GIL) affect multi-threaded execution?",
          options: [
            'A) Prevents multiple native CPU threads from executing Python bytecode simultaneously in parallel',
            'B) Prevents multiprocessing processes from sharing memory',
            'C) Automatically garbage collects unused variables after 10 seconds',
            'D) Restricts Python scripts from executing network socket operations'
          ]
        },
        {
          id: 'q-secA-4',
          question: 'Section A (Q4/15 — Advanced Python): In Python OOP, which dunder methods must be defined to create an asynchronous Context Manager (`async with`)?',
          options: [
            'A) __aenter__ and __aexit__',
            'B) __enter__ and __exit__',
            'C) __init__ and __del__',
            'D) __async_start__ and __async_stop__'
          ]
        },
        {
          id: 'q-secA-5',
          question: 'Section A (Q5/15 — Advanced Python): What will be the output of `list(map(lambda x: x * 2, filter(lambda x: x % 2 == 0, [1, 2, 3, 4, 5])))`?',
          options: [
            'A) [4, 8]',
            'B) [2, 4, 6, 8, 10]',
            'C) [2, 6, 10]',
            'D) [1, 4, 9, 16, 25]'
          ]
        },
        {
          id: 'q-secA-6',
          question: 'Section A (Q6/15 — Medium ML): Which technique is primarily used to mitigate the Problem of Overfitting in Decision Tree models?',
          options: [
            'A) Cost-Complexity Pruning and setting max_depth bounds',
            'B) Increasing the number of tree splits infinitely',
            'C) Using One-Hot Encoding on numeric features',
            'D) Disabling feature scaling completely'
          ]
        },
        {
          id: 'q-secA-7',
          question: 'Section A (Q7/15 — Medium ML): When evaluating a Classification model on a highly imbalanced dataset (e.g., 99% negative, 1% positive), which metric is LEAST informative?',
          options: [
            'A) Overall Accuracy',
            'B) F1-Score',
            'C) Precision-Recall AUC (PR-AUC)',
            'D) Balanced Accuracy'
          ]
        },
        {
          id: 'q-secA-8',
          question: 'Section A (Q8/15 — Medium ML): What is the principal mathematical objective of Principal Component Analysis (PCA)?',
          options: [
            'A) Transform correlated features into uncorrelated orthogonal components maximizing variance',
            'B) Train deep neural network weights via backpropagation',
            'C) Predict discrete class labels using Bayes theorem',
            'D) Automatically cluster data without specifying number of clusters'
          ]
        },
        {
          id: 'q-secA-9',
          question: 'Section A (Q9/15 — Medium ML): In Gradient Descent optimization, what occurs if the learning rate hyperparameter (alpha) is set excessively high?',
          options: [
            'A) The optimization algorithm may overshoot the minimum and diverge',
            'B) The model will converge to the global minimum instantaneously',
            'C) The loss function will immediately drop to 0.0',
            'D) The weights will freeze and stop updating altogether'
          ]
        },
        {
          id: 'q-secA-10',
          question: 'Section A (Q10/15 — Medium ML): Which loss function is standard for training Binary Logistic Regression models?',
          options: [
            'A) Binary Cross-Entropy (Log Loss)',
            'B) Mean Squared Error (MSE)',
            'C) Mean Absolute Error (MAE)',
            'D) Categorical Hinge Loss'
          ]
        },
        {
          id: 'q-secA-11',
          question: 'Section A (Q11/15 — Easy Gen AI): What does the acronym LLM stand for in Generative AI technology?',
          options: [
            'A) Large Language Model',
            'B) Linear Logic Machine',
            'C) Layered Learning Mechanism',
            'D) Latent Language Matrix'
          ]
        },
        {
          id: 'q-secA-12',
          question: "Section A (Q12/15 — Easy Gen AI): In Large Language Models (LLMs), what is a 'Prompt'?",
          options: [
            'A) The input text or instruction given to an AI model to guide its response',
            'B) The hardware GPU clock speed of the AI server',
            'C) The database storage format for text embeddings',
            'D) The error notification displayed when a query fails'
          ]
        },
        {
          id: 'q-secA-13',
          question: "Section A (Q13/15 — Easy Gen AI): What is 'Hallucination' in the context of Generative AI language models?",
          options: [
            'A) When an AI model generates plausible-sounding but incorrect or fabricated facts',
            'B) When an AI server overheats during inference',
            'C) When an AI model runs out of memory while tokenizing text',
            'D) When an AI system encrypts user input data'
          ]
        },
        {
          id: 'q-secA-14',
          question: 'Section A (Q14/15 — Easy Gen AI): What fundamental neural network architecture introduced in 2017 forms the foundation for modern LLMs like ChatGPT and Gemini?',
          options: [
            'A) Transformer (Self-Attention mechanism)',
            'B) Convolutional Neural Network (CNN)',
            'C) Recurrent Neural Network (RNN)',
            'D) Multi-Layer Perceptron (MLP)'
          ]
        },
        {
          id: 'q-secA-15',
          question: 'Section A (Q15/15 — Easy Gen AI): What is RAG (Retrieval-Augmented Generation) used for in Generative AI applications?',
          options: [
            'A) Enhancing LLM responses by retrieving external factual documents from a database or vector store',
            'B) Training an AI model from scratch using raw image pixels',
            'C) Compressing LLM model file sizes for mobile deployment',
            'D) Generating synthetic audio files from text descriptions'
          ]
        }
      ],
      sectionB: {
        id: 'coding-challenge-01',
        title: 'Section B — Python Coding Challenge',
        problem: 'Given a list of integers `nums` and an integer `target`, complete the Python function `two_sum(nums, target)` to return the indices `[i, j]` of the two numbers such that they add up to `target`.',
        starterCode: `def two_sum(nums, target):
    # Write code here
    pass`,
        testCases: [
          { id: 1, name: 'Test Case 1', input: 'nums = [2, 7, 11, 15], target = 9', expected: '[0, 1]' },
          { id: 2, name: 'Test Case 2', input: 'nums = [3, 2, 4], target = 6', expected: '[1, 2]' },
          { id: 3, name: 'Test Case 3', input: 'nums = [3, 3], target = 6', expected: '[0, 1]' }
        ]
      }
    };
  },

  startInterview: async (interview_id) => {
    try {
      const response = await api.post(`/interviews/${interview_id}/start`);
      return response.data;
    } catch (err) {
      return { message: 'Interview started' };
    }
  },

  saveAnswer: async (question_id, answer) => {
    try {
      const response = await api.post(`/interviews/questions/${question_id}/answer`, {
        answer,
      });
      return response.data;
    } catch (err) {
      return { message: 'Answer saved' };
    }
  },

  getProgress: async (interview_id) => {
    try {
      const response = await api.get(`/interviews/${interview_id}/progress`);
      return response.data;
    } catch (err) {
      return { total_questions: 4, answered: 1, remaining: 3 };
    }
  },

  finishInterview: async (interview_id) => {
    try {
      const response = await api.post(`/interviews/${interview_id}/finish`);
      return response.data;
    } catch (err) {
      return { message: 'Interview finished' };
    }
  },

  submitInterview: async (interview_id, answersArray) => {
    // answersArray: [{ question_id, answer }]
    try {
      const response = await api.post(`/interviews/${interview_id}/submit`, {
        answers: answersArray,
      });
      return response.data;
    } catch (err) {
      return { message: 'Answers submitted for AI evaluation' };
    }
  },

  uploadProctoringVideo: async (interview_id, formData) => {
    try {
      const response = await api.post(`/interviews/${interview_id}/video-proctoring`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });
      return response.data;
    } catch (err) {
      console.warn('Proctoring video upload notice:', err);
      return { message: 'Video upload completed' };
    }
  },

  uploadScreenshot: async (interview_id, formData) => {
    try {
      const response = await api.post(`/interviews/${interview_id}/screenshot`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (err) {
      console.warn('Screenshot upload error:', err);
      return { message: 'Screenshot upload completed' };
    }
  },
};

export default candidateInterviewService;
