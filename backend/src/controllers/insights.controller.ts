// =============================================
// Insights Controller — Health Tips Logic
// =============================================

import { Request, Response, NextFunction } from 'express';
import { geminiService } from '../services/gemini.service';
import { supabaseService } from '../services/supabase.service';
import { InsightResponse } from '../types/api.types';

export const getDailyInsight = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.query.userId as string | undefined;

    // Optionally fetch user profile for personalized tips
    let userProfile = null;
    if (userId) {
      userProfile = await supabaseService.getUserProfile(userId);
    }

    const tip = await geminiService.getDailyInsight(userProfile);

    const response: InsightResponse = { tip };
    res.json(response);
  } catch (error) {
    next(error);
  }
};
