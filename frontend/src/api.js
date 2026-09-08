import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users`, userData);
  return response.data;
};

export const startSession = async (userId) => {
  const response = await axios.post(`${API_URL}/sessions`, { user_id: userId });
  return response.data;
};

export const getQuestions = async () => {
  const response = await axios.get(`${API_URL}/questions`);
  return response.data;
};

export const submitAnswers = async (sessionId, answers) => {
  const response = await axios.post(`${API_URL}/sessions/${sessionId}/submit`, { answers });
  return response.data;
};

export const getResults = async (sessionId) => {
  const response = await axios.get(`${API_URL}/sessions/${sessionId}/results`);
  return response.data;
};
