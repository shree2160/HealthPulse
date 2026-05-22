// =============================================
// Triage Controller — Symptom Analysis Logic
// =============================================

import { Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/gemini.service';
import { supabaseService } from '../services/supabase.service';
import { TriageRequest, TriageResponse } from '../types/api.types';
import { AppError } from '../middleware/errorHandler';

// UUID v4 regex for validating user IDs before hitting Supabase
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const analyzeTriage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { symptoms, userId } = req.body as TriageRequest;

    // Validate input
    if (!symptoms || symptoms.trim().length === 0) {
      throw new AppError(400, 'Symptoms description is required');
    }

    if (!userId) {
      throw new AppError(400, 'User ID is required');
    }

    const isValidUUID = UUID_REGEX.test(userId);

    // Fetch user profile for personalized analysis (skip if not a real UUID)
    const userProfile = isValidUUID
      ? await supabaseService.getUserProfile(userId)
      : null;

    // Analyze symptoms with Gemini
    const triageResult: TriageResponse = await geminiService.analyzeSymptoms(
      symptoms,
      userProfile
    );

    // Log the triage event in the database (skip if not a real UUID)
    if (isValidUUID) {
      await supabaseService.saveHealthLog(userId, symptoms, triageResult.riskLevel);
    }

    // Send response
    res.json(triageResult);
  } catch (error) {
    next(error);
  }
};
