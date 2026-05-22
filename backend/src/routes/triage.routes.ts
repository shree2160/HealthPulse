// =============================================
// Triage Routes — POST /api/v1/triage
// =============================================

import { Router } from 'express';
import { analyzeTriage } from '../controllers/triage.controller';

export const triageRouter = Router();

// POST /api/v1/triage
// Body: { symptoms: string, userId: string }
triageRouter.post('/', analyzeTriage);
