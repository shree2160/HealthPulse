import { Router } from 'express';
import { analyzeRadar } from '../controllers/radar.controller';

export const radarRouter = Router();

radarRouter.post('/', analyzeRadar);
