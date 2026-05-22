// =============================================
// OpenRouter AI Service — LLM Interaction Layer
// =============================================

import OpenAI from 'openai';
import { TriageResponse, EncyclopediaResponse, UserProfile } from '../types/api.types';

class OpenRouterService {
  private openai: OpenAI | null = null;
  private readonly modelName = 'google/gemma-4-26b-a4b-it:free';

  // Lazy initialization
  private getClient(): OpenAI {
    if (!this.openai) {
      // Use GEMINI_API_KEY as fallback if OPENROUTER_API_KEY is not defined since user just switched
      const apiKey = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Missing OPENROUTER_API_KEY in environment variables');
      }

      this.openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
        defaultHeaders: {
          'HTTP-Referer': 'http://localhost:5173', // Recommended for OpenRouter
          'X-Title': 'HealthPulse', // Recommended for OpenRouter
        }
      });
      console.log(`[OpenRouter] Service initialized with model: ${this.modelName}`);
    }
    return this.openai;
  }

  private readonly MODEL_CHAIN = [
    'google/gemma-4-26b-a4b-it:free',
    'deepseek/deepseek-v4-flash:free',
    'nvidia/nemotron-3-super-120b-a12b:free'
  ];

  // Helper method to make API calls to OpenRouter with automatic fallback for rate limits
  private async generateContent(prompt: string, maxRetries: number = 2): Promise<string> {
    let lastError: any;
    const client = this.getClient();

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      const currentModel = this.MODEL_CHAIN[Math.min(attempt, this.MODEL_CHAIN.length - 1)];

      try {
        const response = await client.chat.completions.create({
          model: currentModel,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
          temperature: 0.7,
          top_p: 0.9,
        });

        return response.choices[0]?.message?.content?.trim() || '';
      } catch (error: any) {
        lastError = error;
        const isRateLimit = error.status === 429 || error.message?.includes('429');

        if (isRateLimit && attempt < maxRetries) {
          const nextModel = this.MODEL_CHAIN[Math.min(attempt + 1, this.MODEL_CHAIN.length - 1)];
          console.warn(`[OpenRouter] Model ${currentModel} rate limited. Falling back to: ${nextModel}`);
          continue;
        }

        console.error('[OpenRouter] Generation Error:', error);
        // Do not throw here if we want to fallback to Z.ai, break loop instead
        break;
      }
    }

    // ─── Z.AI Fallback ──────────────────────────────────
    const zAiKey = process.env.Z_AI_API_KEY;
    if (zAiKey) {
      console.warn(`[Z.ai] OpenRouter failed. Falling back to Z.ai...`);
      try {
        const zAiClient = new OpenAI({
          baseURL: process.env.Z_AI_BASE_URL || 'https://api.z.ai/v1',
          apiKey: zAiKey,
        });
        const zAiModel = process.env.Z_AI_MODEL || 'default-model'; // User should set this in .env
        
        const response = await zAiClient.chat.completions.create({
          model: zAiModel,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 2048,
          temperature: 0.7,
        });
        
        return response.choices[0]?.message?.content?.trim() || '';
      } catch (zError: any) {
        console.error('[Z.ai] Generation Error:', zError);
        throw new Error(`Both OpenRouter and Z.ai failed. Z.ai error: ${zError.message}`);
      }
    }

    throw new Error(`Failed to generate content: ${lastError?.message || 'Unknown error'}`);
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

Respond ONLY with the JSON object, no additional text or markdown formatting.`;

    const responseText = await this.generateContent(prompt);

    // Parse JSON (handle potential markdown wrapping)
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed: TriageResponse = JSON.parse(jsonStr);

      if (!parsed.riskLevel || !parsed.primaryRecommendation || !parsed.possibleCategories) {
        throw new Error('Invalid response structure from AI');
      }

      return parsed;
    } catch (parseError) {
      console.error('[OpenRouter] Failed to parse triage response:', responseText);
      return {
        riskLevel: 'Moderate',
        primaryRecommendation: 'We could not fully analyze your symptoms. Please consult a healthcare professional for a proper assessment.',
        possibleCategories: ['Unclassified'],
      };
    }
  }

  // ─── Hyper-Local Epidemic Radar ───────────

  async analyzeLocalRisk(
    symptoms: string,
    userProfile: UserProfile | null,
    city: string,
    state: string,
    temperature: string,
    humidity: string,
    localNewsHeadlines: string
  ): Promise<any> {
    const age = userProfile?.age ?? 'unknown';
    const gender = userProfile?.gender ?? 'unknown';

    const prompt = `You are a hyper-local clinical triage assistant. Analyze the patient's symptoms alongside their environmental context.

Patient Data:
- Age/Gender: ${age}, ${gender}
- Symptoms: ${symptoms}

Hyper-Local Context:
- Location: ${city}, ${state}
- Current Weather: ${temperature}°C, ${humidity}% humidity.
- Recent Local Health Headlines: ${localNewsHeadlines}

Task:
Evaluate the risk. If the symptoms align with the active local health headlines or the weather conditions (e.g., mosquito-borne diseases thrive in high humidity), you MUST elevate the risk score and explicitly mention the local threat.

Return ONLY valid JSON matching this structure: 
{ 
  "riskLevel": "Low" | "Moderate" | "High", 
  "primaryRecommendation": "string", 
  "suspectedLocalThreat": "string or null" 
}`;

    const responseText = await this.generateContent(prompt);
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed = JSON.parse(jsonStr);
      // Validate structure loosely
      if (!parsed.riskLevel || !parsed.primaryRecommendation || parsed.suspectedLocalThreat === undefined) {
        throw new Error('Invalid response structure from AI');
      }
      return parsed;
    } catch (parseError) {
      console.error('[OpenRouter] Failed to parse radar response:', responseText);
      return {
        riskLevel: 'Moderate',
        primaryRecommendation: 'We could not fully analyze local threats at this time. Please consult a doctor.',
        suspectedLocalThreat: null,
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

    const contextMessages = chatHistory.slice(-10).map(msg =>
      `${msg.role === 'user' ? 'User' : 'Sahayak'}: ${msg.content}`
    ).join('\n');

    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${contextMessages}\n\nUser: ${userMessage}\n\nSahayak:`;

    return await this.generateContent(fullPrompt);
  }

  // ─── Daily Health Insight ─────────────────

  async getDailyInsight(userProfile?: UserProfile | null): Promise<string> {
    const context = userProfile
      ? `for a ${userProfile.age} year old ${userProfile.gender}`
      : 'for a general adult';

    const prompt = `Give a single, concise preventive health tip ${context}. 
The tip should be practical, actionable, and relevant to modern lifestyles.
Respond with just the tip text, no formatting or prefixes. Keep it under 2 sentences.`;

    return await this.generateContent(prompt);
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
Respond ONLY with the JSON object, no additional text or markdown formatting.`;

    const responseText = await this.generateContent(prompt);
    const jsonStr = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      const parsed: EncyclopediaResponse = JSON.parse(jsonStr);
      return parsed;
    } catch (parseError) {
      console.error('[OpenRouter] Failed to parse encyclopedia response:', responseText);
      return {
        disease: query,
        summary: 'We could not retrieve detailed information at this time. Please try again or consult a medical professional.',
        symptoms: [],
        prevention: [],
      };
    }
  }
}

export const openRouterService = new OpenRouterService();
