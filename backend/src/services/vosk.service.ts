// =============================================
// VOSK Service — Speech-to-Text Processing
// =============================================
// Note: VOSK requires downloading offline models.
// Place them in backend/models_data/
//   - vosk-model-en-us (English)
//   - vosk-model-hi    (Hindi)
// Download from: https://alphacephei.com/vosk/models

import path from 'path';

// VOSK types (the vosk npm package doesn't have great TS types)
interface VoskModel {
  free(): void;
}

interface VoskRecognizer {
  acceptWaveform(buffer: Buffer): boolean;
  result(): { text: string };
  finalResult(): { text: string };
  free(): void;
}

class VoskService {
  private models: Map<string, VoskModel> = new Map();
  private initialized: boolean = false;

  // ─── Initialize Models ────────────────────

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Dynamic import since vosk may not be installed in all environments
      const vosk = require('vosk');

      // Set log level (0 = silent, higher = more verbose)
      vosk.setLogLevel(0);

      const enModelPath = path.resolve(
        process.env.VOSK_MODEL_EN || 'models_data/vosk-model-en-us'
      );
      const hiModelPath = path.resolve(
        process.env.VOSK_MODEL_HI || 'models_data/vosk-model-hi'
      );

      // Load English model
      try {
        const enModel = new vosk.Model(enModelPath);
        this.models.set('en', enModel);
        console.log('[VOSK] English model loaded successfully');
      } catch (e) {
        console.warn(`[VOSK] English model not found at ${enModelPath}. Speech-to-text for English will be unavailable.`);
      }

      // Load Hindi model
      try {
        const hiModel = new vosk.Model(hiModelPath);
        this.models.set('hi', hiModel);
        console.log('[VOSK] Hindi model loaded successfully');
      } catch (e) {
        console.warn(`[VOSK] Hindi model not found at ${hiModelPath}. Speech-to-text for Hindi will be unavailable.`);
      }

      this.initialized = true;
    } catch (e) {
      console.warn('[VOSK] vosk package not available. Speech-to-text functionality disabled.');
      console.warn('[VOSK] Install with: npm install vosk');
      this.initialized = true; // Mark as initialized to prevent repeated attempts
    }
  }

  // ─── Transcribe Audio Buffer ──────────────

  async transcribe(
    audioBuffer: Buffer,
    language: 'en' | 'hi' = 'en',
    sampleRate: number = 16000
  ): Promise<string> {
    await this.initialize();

    const model = this.models.get(language);
    if (!model) {
      throw new Error(
        `VOSK model for language "${language}" is not loaded. ` +
        `Please download the model and place it in the models_data/ directory.`
      );
    }

    try {
      const vosk = require('vosk');
      const recognizer: VoskRecognizer = new vosk.Recognizer({
        model,
        sampleRate,
      });

      // Process audio in chunks for better memory management
      const chunkSize = 4096;
      for (let i = 0; i < audioBuffer.length; i += chunkSize) {
        const chunk = audioBuffer.subarray(i, i + chunkSize);
        recognizer.acceptWaveform(chunk);
      }

      const result = recognizer.finalResult();
      recognizer.free();

      return result.text || '';
    } catch (error) {
      console.error('[VOSK] Transcription error:', error);
      throw new Error('Failed to transcribe audio. Please try again.');
    }
  }

  // ─── Check Model Availability ─────────────

  isLanguageAvailable(language: 'en' | 'hi'): boolean {
    return this.models.has(language);
  }

  // ─── Cleanup ──────────────────────────────

  cleanup(): void {
    for (const [lang, model] of this.models) {
      try {
        model.free();
        console.log(`[VOSK] ${lang} model freed`);
      } catch (e) {
        // ignore cleanup errors
      }
    }
    this.models.clear();
  }
}

// Export singleton instance
export const voskService = new VoskService();
