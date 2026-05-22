// =============================================
// HealthPulse API — Express Entry Point
// =============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { triageRouter } from './routes/triage.routes';
import { chatRouter } from './routes/chat.routes';
import { insightsRouter } from './routes/insights.routes';
import { encyclopediaRouter } from './routes/encyclopedia.routes';
import { radarRouter } from './routes/radar.routes';
import { errorHandler } from './middleware/errorHandler';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Global Middleware ──────────────────────

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ───────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'HealthPulse API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ─────────────────────────────

app.use('/api/v1/triage', triageRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/insights', insightsRouter);
app.use('/api/v1/encyclopedia', encyclopediaRouter);
app.use('/api/v1/radar', radarRouter);

// ─── 404 Handler ────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Endpoint not found',
  });
});

// ─── Global Error Handler ───────────────────

app.use(errorHandler);

// ─── Start Server ───────────────────────────

app.listen(PORT, () => {
  console.log(`\n🏥 HealthPulse API running on http://localhost:${PORT}`);
  console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Triage:       POST /api/v1/triage`);
  console.log(`🎤 Chat Audio:   POST /api/v1/chat/audio`);
  console.log(`💡 Insights:     GET  /api/v1/insights`);
  console.log(`📚 Encyclopedia: GET  /api/v1/encyclopedia/:query\n`);
});

export default app;
