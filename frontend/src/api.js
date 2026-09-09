import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mmpi_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);
  
  const response = await api.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const getMySessions = async () => {
  const response = await api.get('/users/me/sessions');
  return response.data;
};

export const startSession = async () => {
  const response = await api.post('/sessions');
  return response.data;
};

export const getQuestions = async () => {
  const response = await api.get('/questions');
  return response.data;
};

export const submitAnswers = async (sessionId, answers) => {
  const response = await api.post(`/sessions/${sessionId}/submit`, { answers });
  return response.data;
};

export const getResults = async (sessionId) => {
  const response = await api.get(`/sessions/${sessionId}/results`);
  return response.data;
};
