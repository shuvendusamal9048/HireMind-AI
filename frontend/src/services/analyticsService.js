import api from './api';

export const analyticsService = {
  getFunnelData: async () => {
    try {
      const response = await api.get('/analytics/funnel');
      return response.data;
    } catch (err) {
      console.warn('Analytics funnel API fallback mode:', err);
      return [
        { stage: 'Applied', count: 240, percentage: 100, fill: '#3B82F6' },
        { stage: 'Screened', count: 180, percentage: 75, fill: '#60A5FA' },
        { stage: 'Shortlisted', count: 96, percentage: 40, fill: '#10B981' },
        { stage: 'Interviewed', count: 42, percentage: 17, fill: '#F59E0B' },
        { stage: 'Offered', count: 12, percentage: 5, fill: '#8B5CF6' },
      ];
    }
  },

  getStatusData: async () => {
    try {
      const response = await api.get('/analytics/status');
      return response.data;
    } catch (err) {
      console.warn('Analytics status API fallback mode:', err);
      return [
        { name: 'Applied', value: 98, color: '#3B82F6' },
        { name: 'Shortlisted', value: 42, color: '#10B981' },
        { name: 'Interview Scheduled', value: 18, color: '#F59E0B' },
        { name: 'Interview Completed', value: 24, color: '#8B5CF6' },
        { name: 'Rejected', value: 58, color: '#EF4444' },
      ];
    }
  },

  getResultsData: async () => {
    try {
      const response = await api.get('/analytics/results');
      return response.data;
    } catch (err) {
      console.warn('Analytics results API fallback mode:', err);
      return [
        { skill: 'React & Frontend', average: 88, benchmark: 75 },
        { skill: 'FastAPI Backend', average: 82, benchmark: 70 },
        { skill: 'AI & Machine Learning', average: 78, benchmark: 65 },
        { skill: 'Database & SQL', average: 85, benchmark: 72 },
        { skill: 'DevOps & MinIO', average: 74, benchmark: 68 },
      ];
    }
  },
};

export default analyticsService;
