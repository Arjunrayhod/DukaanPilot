"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const database_1 = require("@dukaanpilot/database");
const config_1 = require("../config");
const startTime = Date.now();
class HealthController {
    static async getHealth(_req, res) {
        const dbStatus = await (0, database_1.checkDatabaseConnection)();
        const payload = {
            status: dbStatus.connected ? 'UP' : 'DEGRADED',
            version: '0.1.0',
            timestamp: new Date().toISOString(),
            uptime: Math.floor((Date.now() - startTime) / 1000),
            environment: config_1.config.env,
            database: {
                connected: dbStatus.connected,
                provider: dbStatus.provider,
                latencyMs: dbStatus.latencyMs,
            },
            storage: {
                budgetLimitGb: config_1.config.storageBudgetGb,
                estimatedUsedMb: 0.1,
            },
        };
        return res.status(200).json({
            success: true,
            data: payload,
            timestamp: new Date().toISOString(),
        });
    }
    static async getDbHealth(_req, res) {
        const dbStatus = await (0, database_1.checkDatabaseConnection)();
        return res.status(dbStatus.connected ? 200 : 503).json({
            success: dbStatus.connected,
            database: dbStatus,
            timestamp: new Date().toISOString(),
        });
    }
}
exports.HealthController = HealthController;
