import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

export function createApp() {
  const app = express();

  // Security & Utility Middlewares
  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '5mb' }));
  app.use(express.urlencoded({ extended: true, limit: '5mb' }));

  // Request Logging
  app.use(requestLogger);

  // Root welcome route
  app.get('/', (_req, res) => {
    res.json({
      name: 'DukaanPilot API',
      version: '0.1.0',
      description: 'AI-Powered Autonomous Local Business Operating System',
      status: 'ONLINE',
      docs: '/api/v1/health',
    });
  });

  // API v1 Router
  app.use('/api/v1', apiRouter);

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.originalUrl} not found`,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
