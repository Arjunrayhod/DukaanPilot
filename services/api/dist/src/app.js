"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = require("./routes");
const errorHandler_1 = require("./middleware/errorHandler");
const requestLogger_1 = require("./middleware/requestLogger");
function createApp() {
    const app = (0, express_1.default)();
    // Security & Utility Middlewares
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)());
    app.use(express_1.default.json({ limit: '5mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '5mb' }));
    // Request Logging
    app.use(requestLogger_1.requestLogger);
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
    app.use('/api/v1', routes_1.apiRouter);
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
    app.use(errorHandler_1.errorHandler);
    return app;
}
