// =============================================
// API Client — Axios Instance for Backend Comm
// =============================================

import axios from 'axios';
import { supabase } from '../lib/supabase';
import { 
  TriageResponse, 
  ChatAudioResponse, 
  InsightResponse, 
  EncyclopediaResponse,
  RadarResponse
} from '../types/models';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to get the current user ID from Supabase session
const getUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || 'anonymous';
};

// ─── Triage API ─────────────────────────────────

export const submitTriage = async (symptoms: string): Promise<TriageResponse> => {
  const userId = await getUserId();
  const { data } = await apiClient.post<TriageResponse>('/triage', { symptoms, userId });
  return data;
};

// ─── Radar API ─────────────────────────────────

export const getRadarAnalysis = async (city: string, state: string, symptoms?: string): Promise<RadarResponse> => {
  const userId = await getUserId();
  const { data } = await apiClient.post<RadarResponse>('/radar', { city, state, symptoms, userId });
  return data;
};

// ─── Chat APIs ─────────────────────────────────

export const sendTextChat = async (
  message: string,
  sessionId?: string
): Promise<{ sessionId: string; response: string }> => {
  const userId = await getUserId();
  const { data } = await apiClient.post('/chat/text', { message, userId, sessionId });
  return data;
};

export const sendAudioChat = async (
  audioBlob: Blob,
  sessionId: string,
  language: 'en' | 'hi' = 'en'
): Promise<ChatAudioResponse> => {
  const userId = await getUserId();
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice.webm');
  formData.append('userId', userId);
  formData.append('sessionId', sessionId);
  formData.append('language', language);

  const { data } = await apiClient.post<ChatAudioResponse>('/chat/audio', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

// ─── Insights API ───────────────────────────────

export const getDailyInsight = async (): Promise<InsightResponse> => {
  const userId = await getUserId();
  const { data } = await apiClient.get<InsightResponse>('/insights', {
    params: { userId },
  });
  return data;
};

// ─── Encyclopedia API ───────────────────────────

export const searchEncyclopedia = async (query: string): Promise<EncyclopediaResponse> => {
  const { data } = await apiClient.get<EncyclopediaResponse>(`/encyclopedia/${encodeURIComponent(query)}`);
  return data;
};

export default apiClient;
