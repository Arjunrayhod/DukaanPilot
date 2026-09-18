"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const auth_service_1 = require("../services/auth.service");
function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: {
                code: 'UNAUTHORIZED',
                message: 'Authorization token required in Bearer format',
            },
            timestamp: new Date().toISOString(),
        });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = auth_service_1.AuthService.verifyToken(token);
        req.user = payload;
        next();
    }
    catch (err) {
        return res.status(err.statusCode || 401).json({
            success: false,
            error: {
                code: err.code || 'UNAUTHORIZED',
                message: err.message || 'Invalid token',
            },
            timestamp: new Date().toISOString(),
        });
    }
}
function requireRole(allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
                timestamp: new Date().toISOString(),
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: {
                    code: 'FORBIDDEN',
                    message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]`,
                },
                timestamp: new Date().toISOString(),
            });
        }
        next();
    };
}
