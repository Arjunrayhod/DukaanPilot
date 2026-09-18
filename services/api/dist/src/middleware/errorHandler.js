"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const logger_1 = require("../utils/logger");
function errorHandler(err, req, res, _next) {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || 'INTERNAL_ERROR';
    logger_1.logger.error(`[${req.method}] ${req.originalUrl} - Error: ${message}`, {
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
