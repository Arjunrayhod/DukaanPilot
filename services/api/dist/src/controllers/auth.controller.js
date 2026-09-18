"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const audit_service_1 = require("../services/audit.service");
const zod_1 = require("zod");
const database_1 = require("@dukaanpilot/database");
const registerSchema = zod_1.z.object({
    phone: zod_1.z.string().min(10, 'Valid 10-digit mobile number required'),
    name: zod_1.z.string().min(2, 'Name is required'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    shopName: zod_1.z.string().min(2, 'Shop name is required'),
    category: zod_1.z.any().optional(),
    pin: zod_1.z.string().length(4).optional(),
});
const loginSchema = zod_1.z.object({
    phone: zod_1.z.string().min(10, 'Valid 10-digit mobile number required'),
    password: zod_1.z.string().optional(),
    pin: zod_1.z.string().length(4).optional(),
});
class AuthController {
    static async register(req, res, next) {
        try {
            const validated = registerSchema.parse(req.body);
            const result = await auth_service_1.AuthService.registerOwner(validated);
            await audit_service_1.AuditService.log({
                shopId: result.shop?.id,
                userId: result.user.id,
                action: 'USER_REGISTERED',
                entity: 'User',
                entityId: result.user.id,
                metadata: { shopName: result.shop?.name },
                ipAddress: req.ip,
            });
            return res.status(201).json({
                success: true,
                message: 'Shop owner registered successfully',
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async login(req, res, next) {
        try {
            const validated = loginSchema.parse(req.body);
            const result = await auth_service_1.AuthService.login(validated);
            await audit_service_1.AuditService.log({
                shopId: result.shop?.id,
                userId: result.user.id,
                action: 'USER_LOGIN',
                entity: 'User',
                entityId: result.user.id,
                ipAddress: req.ip,
            });
            return res.status(200).json({
                success: true,
                message: 'Login successful',
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getMe(req, res, next) {
        try {
            if (!req.user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            const user = database_1.memoryStore.users.get(req.user.userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            const shop = user.shopId ? database_1.memoryStore.shops.get(user.shopId) || null : null;
            const { passwordHash: _, pin: __, ...userDto } = user;
            return res.status(200).json({
                success: true,
                data: {
                    user: userDto,
                    shop,
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.AuthController = AuthController;
