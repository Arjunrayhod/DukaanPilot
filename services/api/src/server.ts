import { createApp } from './app';
import { config } from './config';
import { logger } from './utils/logger';

// Seed demo catalog and categories
try {
  const { seedDatabase } = require('@dukaanpilot/database/src/seed');
  if (typeof seedDatabase === 'function') {
    seedDatabase();
    logger.info('Seeded in-memory store with categories and demo catalog');
  }
} catch (e) {
  logger.warn('Seed database fallback: ' + (e as any).message);
}

const app = createApp();

const server = app.listen(config.port, () => {
  logger.info(`DukaanPilot API Server started successfully on port ${config.port} [env: ${config.env}]`);
  logger.info(`Health check: http://localhost:${config.port}/api/v1/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    logger.info('Process terminated.');
  });
});
