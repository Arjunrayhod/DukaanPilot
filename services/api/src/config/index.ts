import dotenv from 'dotenv';
import path from 'path';

// Load .env from root or local api directory
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dukaanpilot-dev-super-secure-secret-2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  databaseUrl: process.env.DATABASE_URL || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  storageBudgetGb: 15.0,
  logLevel: process.env.LOG_LEVEL || 'info',
  logMaxSize: '10m',
  logMaxFiles: '7d',
};
