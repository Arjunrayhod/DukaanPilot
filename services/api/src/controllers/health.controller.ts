import { Request, Response } from 'express';
import { checkDatabaseConnection } from '@dukaanpilot/database';
import { HealthStatus } from '@dukaanpilot/shared';
import { config } from '../config';

const startTime = Date.now();

export class HealthController {
  static async getHealth(_req: Request, res: Response) {
    const dbStatus = await checkDatabaseConnection();

    const payload: HealthStatus = {
      status: dbStatus.connected ? 'UP' : 'DEGRADED',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startTime) / 1000),
      environment: config.env,
      database: {
        connected: dbStatus.connected,
        provider: dbStatus.provider as any,
        latencyMs: dbStatus.latencyMs,
      },
      storage: {
        budgetLimitGb: config.storageBudgetGb,
        estimatedUsedMb: 0.1,
      },
    };

    return res.status(200).json({
      success: true,
      data: payload,
      timestamp: new Date().toISOString(),
    });
  }

  static async getDbHealth(_req: Request, res: Response) {
    const dbStatus = await checkDatabaseConnection();
    return res.status(dbStatus.connected ? 200 : 503).json({
      success: dbStatus.connected,
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  }
}
