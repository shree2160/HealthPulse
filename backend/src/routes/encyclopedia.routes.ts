// =============================================
// Encyclopedia Routes — GET /api/v1/encyclopedia/:query
// =============================================

import { Router } from 'express';
import { getEncyclopediaEntry } from '../controllers/encyclopedia.controller';

export const encyclopediaRouter = Router();

// GET /api/v1/encyclopedia/:query
// Param: query — the disease or health topic to search
encyclopediaRouter.get('/:query', getEncyclopediaEntry);
