import api from './api';

export const reportService = {
  getReport: async (interviewId) => {
    try {
      const response = await api.get(`/interviews/${interviewId}/report`);
      return response.data;
    } catch (err) {
      console.warn('Backend report API error:', err);
      return null;
    }
  },

  getReportQuestions: async (interviewId) => {
    try {
      const response = await api.get(`/interviews/${interviewId}/questions`);
      return response.data;
    } catch (err) {
      console.warn('Backend report questions API error:', err);
      return [];
    }
  },
};

export default reportService;
