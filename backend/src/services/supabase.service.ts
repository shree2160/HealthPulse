// =============================================
// Supabase Service — Database Access Layer
// =============================================

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { UserProfile, ChatHistoryRow, HealthLogRow, RiskLevel } from '../types/api.types';

class SupabaseService {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables');
    }

    this.client = createClient(url, key);
  }

  // ─── User Operations ───────────────────────

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await this.client
      .from('users')
      .select('id, age, gender')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[Supabase] getUserProfile error:', error.message);
      return null;
    }

    return data as UserProfile;
  }

  // ─── Chat History Operations ────────────────

  async getChatHistory(sessionId: string, limit: number = 20): Promise<ChatHistoryRow[]> {
    const { data, error } = await this.client
      .from('chat_history')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('[Supabase] getChatHistory error:', error.message);
      return [];
    }

    return data as ChatHistoryRow[];
  }

  async saveChatMessage(
    sessionId: string,
    userId: string,
    role: 'user' | 'model',
    content: string
  ): Promise<void> {
    const { error } = await this.client
      .from('chat_history')
      .insert({
        session_id: sessionId,
        user_id: userId,
        role,
        content,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[Supabase] saveChatMessage error:', error.message);
    }
  }

  // ─── Health Log Operations ──────────────────

  async saveHealthLog(
    userId: string,
    symptoms: string,
    riskLevel: RiskLevel
  ): Promise<void> {
    const { error } = await this.client
      .from('health_logs')
      .insert({
        user_id: userId,
        symptoms,
        risk_level: riskLevel,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error('[Supabase] saveHealthLog error:', error.message);
    }
  }

  async getHealthLogs(userId: string, limit: number = 10): Promise<HealthLogRow[]> {
    const { data, error } = await this.client
      .from('health_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[Supabase] getHealthLogs error:', error.message);
      return [];
    }

    return data as HealthLogRow[];
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
