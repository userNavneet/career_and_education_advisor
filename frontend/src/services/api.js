import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  signup: (data) => api.post('/api/auth/signup', data),
  me: () => api.get('/api/auth/me'),
};

// Assessment
export const assessmentAPI = {
  getQuestions: () => api.get('/api/assessment/questions'),
  submit: (responses) => api.post('/api/assessment/submit', { responses }),
};

// Colleges
export const collegesAPI = {
  getFilters: () => api.get('/api/colleges/filters'),
  search: (params) => api.post('/api/colleges/search', params),
  getStats: () => api.get('/api/colleges/stats'),
};

// Chatbot
export const chatbotAPI = {
  ask: (message, userContext) => api.post('/api/chatbot/ask', { message, user_context: userContext }),
};

// Careers
export const careersAPI = {
  list: (field) => api.get('/api/careers/', { params: field ? { field } : {} }),
  fields: () => api.get('/api/careers/fields'),
  get: (id) => api.get(`/api/careers/${id}`),
  create: (data) => api.post('/api/careers/', data),
  update: (id, data) => api.put(`/api/careers/${id}`, data),
  delete: (id) => api.delete(`/api/careers/${id}`),
};

// Admin
export const adminAPI = {
  stats: () => api.get('/api/admin/stats'),
  users: () => api.get('/api/admin/users'),
  deleteUser: (email) => api.delete(`/api/admin/users/${encodeURIComponent(email)}`),
};

export default api;
