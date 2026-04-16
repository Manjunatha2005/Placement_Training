import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  uploadResume: (formData) => api.post('/users/resume', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getLeaderboard: () => api.get('/users/leaderboard'),
  getAllUsers: () => api.get('/users/all'),
};

export const courseAPI = {
  getAll: (params) => api.get('/courses', { params }),
  getOne: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post('/courses', data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
};

export const testAPI = {
  getAll: (params) => api.get('/tests', { params }),
  getOne: (id) => api.get(`/tests/${id}`),
  submit: (id, data) => api.post(`/tests/${id}/submit`, data),
  create: (data) => api.post('/tests', data),
  getMyResults: () => api.get('/tests/my-results'),
};

export const codingAPI = {
  getAll: (params) => api.get('/coding', { params }),
  getOne: (id) => api.get(`/coding/${id}`),
  runCode: (data) => api.post('/coding/run', data),
  submit: (id, data) => api.post(`/coding/${id}/submit`, data),
  create: (data) => api.post('/coding', data),
  getMySubmissions: () => api.get('/coding/my-submissions'),
};

export const chatAPI = {
  send: (data) => api.post('/chat/send', data),
  getHistory: () => api.get('/chat/history'),
  getChat: (id) => api.get(`/chat/${id}`),
  delete: (id) => api.delete(`/chat/${id}`),
  reviewResume: (data) => api.post('/chat/review-resume', data),
  generateStudyPlan: (data) => api.post('/chat/study-plan', data),
};

export const companyAPI = {
  getAll: (params) => api.get('/companies', { params }),
  getOne: (id) => api.get(`/companies/${id}`),
  create: (data) => api.post('/companies', data),
};

export const dashboardAPI = {
  getStudent: () => api.get('/dashboard/student'),
  getAdmin: () => api.get('/dashboard/admin'),
};

export default api;
