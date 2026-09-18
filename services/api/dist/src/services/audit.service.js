"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const logger_1 = require("../utils/logger");
class AuditService {
    static async log(entry) {
        const timestamp = new Date().toISOString();
        logger_1.logger.info('AUDIT_EVENT', {
            ...entry,
            timestamp,
            audit: true,
        });
    }
}
exports.AuditService = AuditService;
