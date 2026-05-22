// =============================================
// Gemini AI Service — LLM Interaction Layer
// =============================================

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { TriageResponse, EncyclopediaResponse, UserProfile } from '../types/api.types';

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;

  // Model fallback chain — if the primary model's quota is exhausted,
  // fall back to the next one automatically.
  private static readonly MODEL_CHAIN = [
    'Gemini 2.5 Flash',
    'Gemini 2.5 Flash Lite',
    'Gemini 3.1 Flash Lite',
  ];

  // Lazy initialization
  private getModel(): GenerativeModel {
    if (!this.model) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Missing GEMINI_API_KEY in environment variables');
      }

      this.genAI = new GoogleGenerativeAI(apiKey);

      // Use env override or default to the first in chain
      const modelName = process.env.GEMINI_MODEL || GeminiService.MODEL_CHAIN[0];
      this.model = this.genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          maxOutputTokens: 2048,
        },
      });
      console.log(`[Gemini] Service initialized with model: ${modelName}`);
    }
    return this.model;
  }

  // Retry wrapper with exponential backoff and model fallback
  private async generateWithRetry(prompt: string, maxRetries: number = 2): Promise<string> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const model = this.getModel();
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      } catch (error: any) {
        lastError = error;
        const is429 = error?.message?.includes('429') || error?.status === 429;

        if (is429 && attempt < maxRetries) {
          // Try switching to the next model in the fallback chain
          const currentModelName = process.env.GEMINI_MODEL || GeminiService.MODEL_CHAIN[0];
          const currentIdx = GeminiService.MODEL_CHAIN.indexOf(currentModelName);
          const nextIdx = currentIdx + 1 + attempt;

          if (nextIdx < GeminiService.MODEL_CHAIN.length && this.genAI) {
            const fallbackModel = GeminiService.MODEL_CHAIN[nextIdx];
            console.warn(`[Gemini] Rate limited on current model. Falling back to: ${fallbackModel}`);
            this.model = this.genAI.getGenerativeModel({
              model: fallbackModel,
              generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
            });
          }

          // Wait with exponential backoff
          const waitMs = Math.min(2000 * Math.pow(2, attempt), 15000);
          console.warn(`[Gemini] Retry ${attempt + 1}/${maxRetries} after ${waitMs}ms...`);
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }

  // ─── Triage Analysis ──────────────────────

  async analyzeSymptoms(
    symptoms: string,
    userProfile?: UserProfile | null
  ): Promise<TriageResponse> {
    const age = userProfile?.age ?? 'unknown';
    const gender = userProfile?.gender ?? 'unknown';

    const prompt = `You are a clinical triage assistant. Your role is to provide an initial risk assessment based on reported symptoms. You are NOT diagnosing. You are helping prioritize whether someone should seek immediate, soon, or routine care.

Analyze these symptoms: ${symptoms}
The patient is a ${age} year old ${gender}.

You must respond in valid JSON matching this exact schema:
{
  "riskLevel": "Low" | "Moderate" | "High",
  "primaryRecommendation": "A clear, jargon-free recommendation in 1-2 sentences",
  "possibleCategories": ["Array of 2-4 possible medical categories"]
}

Guidelines:
- "High" risk: symptoms suggesting emergency (chest pain, difficulty breathing, severe bleeding, stroke signs)
- "Moderate" risk: symptoms needing doctor visit within 24-48 hours
- "Low" risk: symptoms manageable with home care
- Always remind that this is AI guidance, not a medical diagnosis
- Keep recommendations simple and actionable

Respond ONLY with the JSON object, no additional text.`;

    const responseText = await this.generateWithRetry(prompt);

    // Parse JSON from Gemini response (handle potential markdown wrapping)
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed: TriageResponse = JSON.parse(jsonStr);

      // Validate the response structure
      if (!parsed.riskLevel || !parsed.primaryRecommendation || !parsed.possibleCategories) {
        throw new Error('Invalid response structure from Gemini');
      }

      return parsed;
    } catch (parseError) {
      console.error('[Gemini] Failed to parse triage response:', responseText);
      // Return a safe fallback
      return {
        riskLevel: 'Moderate',
        primaryRecommendation: 'We could not fully analyze your symptoms. Please consult a healthcare professional for a proper assessment.',
        possibleCategories: ['Unclassified'],
      };
    }
  }

  // ─── Chat Response ────────────────────────

  async getChatResponse(
    userMessage: string,
    chatHistory: Array<{ role: string; content: string }>
  ): Promise<string> {
    const systemPrompt = `You are Sahayak, a friendly and knowledgeable health assistant. You help users understand health topics in simple, jargon-free language. You support both English and Hindi.

Important rules:
- Never diagnose conditions. Always recommend consulting a doctor for specific medical concerns.
- Be empathetic and supportive in tone.
- Keep responses concise (2-4 sentences for simple queries, up to a paragraph for complex ones).
- If asked about emergencies, always advise calling emergency services immediately.
- Start with a disclaimer if discussing symptoms: "I'm an AI assistant, not a doctor."`;

    // Build conversation context
    const contextMessages = chatHistory.slice(-10).map(msg =>
      `${msg.role === 'user' ? 'User' : 'Sahayak'}: ${msg.content}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${contextMessages}\n\nUser: ${userMessage}\n\nSahayak:`;

    return await this.generateWithRetry(fullPrompt);
  }

  // ─── Daily Health Insight ─────────────────

  async getDailyInsight(userProfile?: UserProfile | null): Promise<string> {
    const context = userProfile
      ? `for a ${userProfile.age} year old ${userProfile.gender}`
      : 'for a general adult';

    const prompt = `Give a single, concise preventive health tip ${context}. 
The tip should be practical, actionable, and relevant to modern lifestyles.
Respond with just the tip text, no formatting or prefixes. Keep it under 2 sentences.`;

    return await this.generateWithRetry(prompt);
  }

  // ─── Disease Encyclopedia ─────────────────

  async getEncyclopediaEntry(query: string): Promise<EncyclopediaResponse> {
    const prompt = `You are a medical encyclopedia assistant. Provide a clear, easy-to-understand summary about: "${query}"

Respond in valid JSON matching this exact schema:
{
  "disease": "Official name of the condition",
  "summary": "A 2-3 sentence plain-language explanation of what this condition is",
  "symptoms": ["Array of 4-6 common symptoms"],
  "prevention": ["Array of 3-5 prevention tips"]
}

If the query is not a recognizable medical condition, still provide the best relevant health information you can.
Respond ONLY with the JSON object, no additional text.`;

    const responseText = await this.generateWithRetry(prompt);
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed: EncyclopediaResponse = JSON.parse(jsonStr);
      return parsed;
    } catch (parseError) {
      console.error('[Gemini] Failed to parse encyclopedia response:', responseText);
      return {
        disease: query,
        summary: 'We could not retrieve detailed information at this time. Please try again or consult a medical professional.',
        symptoms: [],
        prevention: [],
      };
    }
  }
}

// Export singleton — the class is lightweight; actual API client
// is only created on first method call (after dotenv has loaded).
export const geminiService = new GeminiService();
