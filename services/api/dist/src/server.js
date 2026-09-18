"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const config_1 = require("./config");
const logger_1 = require("./utils/logger");
const app = (0, app_1.createApp)();
const server = app.listen(config_1.config.port, () => {
    logger_1.logger.info(`?? DukaanPilot API Server started successfully on port ${config_1.config.port} [env: ${config_1.config.env}]`);
    logger_1.logger.info(`?? Health check: http://localhost:${config_1.config.port}/api/v1/health`);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        logger_1.logger.info('Process terminated.');
    });
});
