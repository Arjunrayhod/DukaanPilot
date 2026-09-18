import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: any;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_ERROR';

  logger.error(`[${req.method}] ${req.originalUrl} - Error: ${message}`, {
    statusCode,
    code,
    stack: err.stack,
    details: err.details,
  });

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' ? { details: err.details, stack: err.stack } : {}),
    },
    timestamp: new Date().toISOString(),
  });
}
