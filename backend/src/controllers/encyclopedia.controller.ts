// =============================================
// Encyclopedia Controller — Disease Info Logic
// =============================================

import { Request, Response, NextFunction } from 'express';
import { openRouterService as aiService } from '../services/openrouter.service';
import { EncyclopediaResponse } from '../types/api.types';
import { AppError } from '../middleware/errorHandler';

export const getEncyclopediaEntry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.params.query as string;

    if (!query || query.trim().length === 0) {
      throw new AppError(400, 'Search query is required');
    }

    // Sanitize and limit query length
    const sanitizedQuery = query.trim().substring(0, 200);

    const entry: EncyclopediaResponse = await aiService.getEncyclopediaEntry(sanitizedQuery);

    res.json(entry);
  } catch (error) {
    next(error);
  }
};
