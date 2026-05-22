// =============================================
// Chat Controller — Voice Chat Processing Logic
// =============================================

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { openRouterService as aiService } from '../services/openrouter.service';
import { whisperService } from '../services/whisper.service';
import { ttsService } from '../services/tts.service';
import { supabaseService } from '../services/supabase.service';
import { ChatAudioResponse } from '../types/api.types';
import { AppError } from '../middleware/errorHandler';

// UUID v4 regex for validating user IDs before hitting Supabase
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const processAudioChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the uploaded audio file (via multer)
    const audioFile = req.file;
    if (!audioFile) {
      throw new AppError(400, 'Audio file is required');
    }

    const userId = req.body.userId as string;
    const sessionId = (req.body.sessionId as string) || uuidv4();
    const language = (req.body.language as 'en' | 'hi') || 'en';

    if (!userId) {
      throw new AppError(400, 'User ID is required');
    }

    const isValidUUID = UUID_REGEX.test(userId);
    const isValidSessionUUID = UUID_REGEX.test(sessionId);

    // Step 1: Transcribe audio using Local Whisper Model
    console.log(`[Chat] Transcribing audio with local Whisper (${language})...`);
    const transcribedText = await whisperService.transcribe(audioFile.buffer, language);

    if (!transcribedText || transcribedText.trim().length === 0) {
      throw new AppError(400, 'Could not understand the audio. Please try speaking more clearly.');
    }

    // Step 2: Fetch chat history for context (skip if session ID is not a valid UUID)
    const chatHistory = isValidSessionUUID
      ? await supabaseService.getChatHistory(sessionId, 10)
      : [];

    // Step 3: Get AI response with conversation context
    console.log(`[Chat] Getting AI response for: "${transcribedText}"`);
    const aiResponse = await aiService.getChatResponse(
      transcribedText,
      chatHistory.map(msg => ({ role: msg.role, content: msg.content }))
    );

    // Step 4: Generate TTS audio from the response
    console.log('[Chat] Generating audio response...');
    const audioBase64 = await ttsService.textToSpeech(aiResponse, language);

    // Step 5: Save both messages to chat history (skip if not valid UUIDs)
    if (isValidUUID && isValidSessionUUID) {
      await supabaseService.saveChatMessage(sessionId, userId, 'user', transcribedText);
      await supabaseService.saveChatMessage(sessionId, userId, 'model', aiResponse);
    }

    // Build response
    const response: ChatAudioResponse = {
      transcribedText,
      geminiResponse: aiResponse, // keeping the property name same to not break frontend
      audioBase64,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// ─── Text-based Chat (fallback for non-voice) ──

export const processTextChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { message, userId, sessionId: inputSessionId } = req.body;
    const sessionId = inputSessionId || uuidv4();

    if (!message || message.trim().length === 0) {
      throw new AppError(400, 'Message is required');
    }

    if (!userId) {
      throw new AppError(400, 'User ID is required');
    }

    const isValidUUID = UUID_REGEX.test(userId);
    const isValidSessionUUID = UUID_REGEX.test(sessionId);

    // Fetch chat history for context (skip if not valid UUID)
    const chatHistory = isValidSessionUUID
      ? await supabaseService.getChatHistory(sessionId, 10)
      : [];

    // Get AI response
    const aiResponse = await aiService.getChatResponse(
      message,
      chatHistory.map(msg => ({ role: msg.role, content: msg.content }))
    );

    // Save both messages (skip if not valid UUIDs)
    if (isValidUUID && isValidSessionUUID) {
      await supabaseService.saveChatMessage(sessionId, userId, 'user', message);
      await supabaseService.saveChatMessage(sessionId, userId, 'model', aiResponse);
    }

    res.json({
      sessionId,
      response: aiResponse,
    });
  } catch (error) {
    next(error);
  }
};
