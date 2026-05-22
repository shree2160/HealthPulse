// =============================================
// TTS Service — Text-to-Speech Processing
// =============================================

class TtsService {
  // ─── Generate Audio from Text ─────────────

  async textToSpeech(
    text: string,
    language: string = 'en'
  ): Promise<string> {
    try {
      // Use google-tts-api to generate audio
      const googleTTS = require('google-tts-api');

      // google-tts-api has a 200 char limit per request
      // For longer texts, we need to split into chunks
      if (text.length <= 200) {
        const url: string = googleTTS.getAudioUrl(text, {
          lang: language,
          slow: false,
          host: 'https://translate.google.com',
        });

        // Fetch the audio and convert to base64
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        return buffer.toString('base64');
      }

      // Split long text into chunks
      const chunks = this.splitText(text, 200);
      const audioBuffers: Buffer[] = [];

      for (const chunk of chunks) {
        const url: string = googleTTS.getAudioUrl(chunk, {
          lang: language,
          slow: false,
          host: 'https://translate.google.com',
        });

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffers.push(Buffer.from(arrayBuffer));
      }

      // Concatenate all audio buffers
      const combinedBuffer = Buffer.concat(audioBuffers);
      return combinedBuffer.toString('base64');
    } catch (error) {
      console.error('[TTS] Text-to-speech error:', error);
      throw new Error('Failed to generate audio response.');
    }
  }

  // ─── Text Splitter ────────────────────────

  private splitText(text: string, maxLength: number): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length <= maxLength) {
        currentChunk += sentence;
      } else {
        if (currentChunk) chunks.push(currentChunk.trim());
        // If a single sentence exceeds maxLength, split by words
        if (sentence.length > maxLength) {
          const words = sentence.split(' ');
          currentChunk = '';
          for (const word of words) {
            if ((currentChunk + ' ' + word).length <= maxLength) {
              currentChunk += (currentChunk ? ' ' : '') + word;
            } else {
              if (currentChunk) chunks.push(currentChunk.trim());
              currentChunk = word;
            }
          }
        } else {
          currentChunk = sentence;
        }
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim());
    }

    return chunks;
  }
}

// Export singleton instance
export const ttsService = new TtsService();
