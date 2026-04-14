import api from './api';

export const testService = {
  getTests: async () => {
    const response = await api.get('/tests');
    return response.data;
  },

  getTestById: async (testId) => {
    const response = await api.get(`/tests/${testId}`);
    return response.data;
  },

  submitTest: async (testId, answers) => {
    const response = await api.post(`/tests/${testId}/submit`, { answers });
    return response.data;
  },

  getTestResults: async (testId) => {
    const response = await api.get(`/tests/${testId}/results`);
    return response.data;
  },
};
