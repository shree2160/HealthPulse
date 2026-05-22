import { pipeline, env } from '@xenova/transformers';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { WaveFile } from 'wavefile';

// Ensure transformers uses remote models if not cached
env.allowLocalModels = false;

// Configure ffmpeg to use the static binary
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

class WhisperService {
  private transcriber: any = null;

  async initialize() {
    if (!this.transcriber) {
      console.log('[Whisper] Downloading/Loading local Whisper model (this may take a minute on first run)...');
      // Using whisper-tiny for faster local CPU transcription
      this.transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
      console.log('[Whisper] Model loaded successfully');
    }
  }

  async transcribe(audioBuffer: Buffer, language: 'en' | 'hi' = 'en'): Promise<string> {
    await this.initialize();

    console.log(`[Whisper] Converting audio to 16kHz WAV...`);
    const wavBuffer = await this.convertToWav(audioBuffer);
    
    // Read the WAV header to find the raw PCM data
    const wav = new WaveFile(wavBuffer);
    
    // Whisper expects Float32Array at 16000Hz
    wav.toBitDepth('32f');
    wav.toSampleRate(16000);
    
    let audioData = wav.getSamples();
    if (Array.isArray(audioData)) {
      if (audioData.length > 1) {
        // Merge channels if stereo
        const SC = audioData[0].length;
        const result = new Float32Array(SC);
        for (let i = 0; i < SC; i++) {
          result[i] = (audioData[0][i] + audioData[1][i]) / 2;
        }
        audioData = result;
      } else {
        audioData = audioData[0];
      }
    } else {
      audioData = audioData as Float32Array;
    }

    console.log(`[Whisper] Transcribing with local model (${language})...`);
    // Pass to whisper
    const result = await this.transcriber(audioData, {
      language: language === 'hi' ? 'hindi' : 'english',
      task: 'transcribe'
    });

    return result.text || '';
  }

  private convertToWav(inputBuffer: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      // Create a temporary file since fluent-ffmpeg prefers streams/files
      const tempId = uuidv4();
      const inputPath = path.join(process.cwd(), `${tempId}.webm`);
      const outputPath = path.join(process.cwd(), `${tempId}.wav`);
      
      fs.writeFileSync(inputPath, inputBuffer);

      ffmpeg(inputPath)
        .toFormat('wav')
        .audioFrequency(16000)
        .audioChannels(1)
        .on('end', () => {
          const outBuffer = fs.readFileSync(outputPath);
          // Cleanup
          fs.unlinkSync(inputPath);
          fs.unlinkSync(outputPath);
          resolve(outBuffer);
        })
        .on('error', (err) => {
          // Cleanup
          if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
          if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          reject(err);
        })
        .save(outputPath);
    });
  }
}

export const whisperService = new WhisperService();
