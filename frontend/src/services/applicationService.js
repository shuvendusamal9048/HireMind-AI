import api from './api';

export const applicationService = {
  getApplications: async () => {
    try {
      const response = await api.get('/applications/');
      return response.data;
    } catch (err) {
      console.warn('Applications API error, returning initial candidate records:', err);
      return [];
    }
  },

  getApplication: async (id) => {
    try {
      const response = await api.get(`/applications/${id}`);
      return response.data;
    } catch (err) {
      console.warn('Get application error:', err);
      throw err;
    }
  },

  getApplicationById: async (id) => {
    return applicationService.getApplication(id);
  },

  getApplicationsByJob: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  shortlist: async (id) => {
    const response = await api.patch(`/applications/${id}/shortlist`);
    return response.data;
  },

  shortlistCandidate: async (id) => {
    return applicationService.shortlist(id);
  },

  reject: async (id) => {
    const response = await api.patch(`/applications/${id}/reject`);
    return response.data;
  },

  rejectCandidate: async (id) => {
    return applicationService.reject(id);
  },

  scheduleInterview: async (id, scheduleData) => {
    // scheduleData: { interview_date, interviewer_name }
    const response = await api.patch(`/applications/${id}/schedule`, {
      interview_date: scheduleData.interview_date,
      interviewer_name: scheduleData.interviewer_name,
    });
    return response.data;
  },

  generateInterview: async (id) => {
    const response = await api.post(`/applications/${id}/generate-interview`);
    return response.data;
  },
};

export default applicationService;

