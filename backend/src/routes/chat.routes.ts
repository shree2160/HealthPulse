// =============================================
// Chat Routes — POST /api/v1/chat/*
// =============================================

import { Router } from 'express';
import multer from 'multer';
import { processAudioChat, processTextChat } from '../controllers/chat.controller';

export const chatRouter = Router();

// Configure multer for audio file uploads (in-memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max audio file
  },
  fileFilter: (_req, file, cb) => {
    // Accept common audio formats
    const allowedMimes = [
      'audio/webm',
      'audio/wav',
      'audio/mpeg',
      'audio/ogg',
      'audio/mp4',
      'audio/x-wav',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  },
});

// POST /api/v1/chat/audio
// Body: multipart/form-data with 'audio' file, userId, sessionId, language
chatRouter.post('/audio', upload.single('audio'), processAudioChat);

// POST /api/v1/chat/text
// Body: { message: string, userId: string, sessionId?: string }
chatRouter.post('/text', processTextChat);
