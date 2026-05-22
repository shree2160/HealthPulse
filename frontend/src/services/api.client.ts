// =============================================
// API Client — Axios Instance for Backend Comm
// =============================================

// TODO: Your friend should install axios and configure this
// npm install axios

/*
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Triage ─────────────────────────────────

export const submitTriage = async (symptoms: string, userId: string) => {
  const { data } = await apiClient.post('/triage', { symptoms, userId });
  return data;
};

// ─── Chat (Text) ────────────────────────────

export const sendTextChat = async (message: string, userId: string, sessionId?: string) => {
  const { data } = await apiClient.post('/chat/text', { message, userId, sessionId });
  return data;
};

// ─── Chat (Audio) ───────────────────────────

export const sendAudioChat = async (audioBlob: Blob, userId: string, sessionId: string, language: string = 'en') => {
  const formData = new FormData();
  formData.append('audio', audioBlob);
  formData.append('userId', userId);
  formData.append('sessionId', sessionId);
  formData.append('language', language);

  const { data } = await apiClient.post('/chat/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ─── Insights ───────────────────────────────

export const getDailyInsight = async (userId?: string) => {
  const params = userId ? { userId } : {};
  const { data } = await apiClient.get('/insights', { params });
  return data;
};

// ─── Encyclopedia ───────────────────────────

export const searchEncyclopedia = async (query: string) => {
  const { data } = await apiClient.get(`/encyclopedia/${encodeURIComponent(query)}`);
  return data;
};

export default apiClient;
*/

// Placeholder — uncomment above after installing axios
export {};
