// =============================================
// HealthPulse API — Shared Type Definitions
// =============================================
// This file is the CONTRACT between frontend and backend.
// Any changes here must be mirrored in frontend/src/types/models.ts

// ─── Triage Types ────────────────────────────

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

// ─── Radar Types ─────────────────────────────

export interface RadarRequest {
  city: string;
  state: string;
  symptoms?: string;
  userId?: string;
}

export interface RadarResponse {
  riskLevel: RiskLevel;
  primaryRecommendation: string;
  suspectedLocalThreat: string | null;
}

// ─── Chat / Audio Types ─────────────────────

export interface ChatAudioResponse {
  transcribedText: string;
  geminiResponse: string;
  audioBase64: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

// ─── Insights Types ─────────────────────────

export interface InsightResponse {
  tip: string;
}

// ─── Encyclopedia Types ─────────────────────

export interface EncyclopediaResponse {
  disease: string;
  summary: string;
  symptoms: string[];
  prevention: string[];
}

// ─── User Types ─────────────────────────────

export interface UserProfile {
  id: string;
  age: number;
  gender: string;
}

// ─── Database Row Types ─────────────────────

export interface ChatHistoryRow {
  session_id: string;
  user_id: string;
  role: 'user' | 'model';
  content: string;
  created_at: string;
}

export interface HealthLogRow {
  log_id: string;
  user_id: string;
  symptoms: string;
  risk_level: RiskLevel;
  created_at: string;
}

// ─── API Error Types ────────────────────────

export interface ApiError {
  statusCode: number;
  message: string;
  details?: string;
}
