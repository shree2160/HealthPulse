// =============================================
// HealthPulse — Shared Type Definitions (Frontend)
// =============================================

export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface TriageRequest {
  symptoms: string;
  userId: string;
}

export interface TriageResponse {
  riskLevel: RiskLevel;
  primaryRecommendation: string;
  possibleCategories: string[];
}

export interface ChatAudioResponse {
  transcribedText: string;
  geminiResponse: string;
  audioBase64: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'model';
  content: string;
  createdAt?: string;
}

export interface InsightResponse {
  tip: string;
}

export interface EncyclopediaResponse {
  disease: string;
  summary: string;
  symptoms: string[];
  prevention: string[];
}

export interface UserProfile {
  id: string;
  age: number;
  gender: string;
}
