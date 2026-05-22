// =============================================
// Insights Routes — GET /api/v1/insights
// =============================================

import { Router } from 'express';
import { getDailyInsight } from '../controllers/insights.controller';

export const insightsRouter = Router();

// GET /api/v1/insights?userId=optional
insightsRouter.get('/', getDailyInsight);
