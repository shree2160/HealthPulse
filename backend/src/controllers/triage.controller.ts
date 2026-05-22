// =============================================
// Triage Controller — Symptom Analysis Logic
// =============================================

import { Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/gemini.service';
import { supabaseService } from '../services/supabase.service';
import { TriageRequest, TriageResponse } from '../types/api.types';
import { AppError } from '../middleware/errorHandler';

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

    // Fetch user profile for personalized analysis
    const userProfile = await supabaseService.getUserProfile(userId);

    // Analyze symptoms with Gemini
    const triageResult: TriageResponse = await geminiService.analyzeSymptoms(
      symptoms,
      userProfile
    );

    // Log the triage event in the database
    await supabaseService.saveHealthLog(userId, symptoms, triageResult.riskLevel);

    // Send response
    res.json(triageResult);
  } catch (error) {
    next(error);
  }
};
