import api from './api';

export const publicJobService = {
  getJobByCode: async (code) => {
    const response = await api.get(`/public/jobs/${code}`);
    return response.data;
  },

  applyToJob: async (code, data) => {
    // data: { candidate_name, email, phone, resume: File }
    const formData = new FormData();
    formData.append('candidate_name', data.candidate_name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('resume', data.resume);

    const response = await api.post(`/public/jobs/${code}/apply`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default publicJobService;
