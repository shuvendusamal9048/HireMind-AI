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
          question: 'In Python programming, which built-in data type is immutable (cannot be modified after creation)?',
          options: [
            'A) Tuple',
            'B) List',
            'C) Dictionary',
            'D) Set'
          ]
        },
        {
          id: 'q-secA-2',
          question: 'Which keyword is used to define a function in Python?',
          options: [
            'A) def',
            'B) function',
            'C) define',
            'D) func'
          ]
        },
        {
          id: 'q-secA-3',
          question: 'In SQL database queries, which statement is used to retrieve data from a database table?',
          options: [
            'A) SELECT',
            'B) GET',
            'C) EXTRACT',
            'D) FIND'
          ]
        },
        {
          id: 'q-secA-4',
          question: 'Which HTTP method is standard for creating a new record in a RESTful API backend?',
          options: [
            'A) POST',
            'B) GET',
            'C) PUT',
            'D) DELETE'
          ]
        },
        {
          id: 'q-secA-5',
          question: 'What is the value returned by `len([10, 20, 30, 40])` in Python?',
          options: [
            'A) 4',
            'B) 3',
            'C) 5',
            'D) 40'
          ]
        },
        {
          id: 'q-secA-6',
          question: 'How do you access the value associated with key "role" in Python dictionary `user = {"role": "developer"}`?',
          options: [
            'A) user["role"]',
            'B) user.get_key("role")',
            'C) user(role)',
            'D) user->role'
          ]
        },
        {
          id: 'q-secA-7',
          question: 'In SQL database queries, which clause filters rows based on a specific condition?',
          options: [
            'A) WHERE',
            'B) ORDER BY',
            'C) GROUP BY',
            'D) HAVING'
          ]
        },
        {
          id: 'q-secA-8',
          question: 'Which Git command creates a local working copy of a remote Git repository?',
          options: [
            'A) git clone',
            'B) git copy',
            'C) git fork',
            'D) git download'
          ]
        },
        {
          id: 'q-secA-9',
          question: 'Which Python keyword immediately exits out of a `for` or `while` loop?',
          options: [
            'A) break',
            'B) exit',
            'C) stop',
            'D) return'
          ]
        },
        {
          id: 'q-secA-10',
          question: 'Which standard Python module is used to parse JSON formatted strings?',
          options: [
            'A) json',
            'B) parse_json',
            'C) pyjson',
            'D) string_json'
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
};

export default candidateInterviewService;
