"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = require("../config");
const shared_1 = require("@dukaanpilot/shared");
const database_1 = require("@dukaanpilot/database");
class AuthService {
    static async registerOwner(data) {
        // Check if phone already exists
        for (const user of database_1.memoryStore.users.values()) {
            if (user.phone === data.phone) {
                const err = new Error('User with this mobile number already exists');
                err.statusCode = 400;
                err.code = 'USER_ALREADY_EXISTS';
                throw err;
            }
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const passwordHash = await bcryptjs_1.default.hash(data.password, salt);
        const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const shopId = 'shp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const newUser = {
            id: userId,
            phone: data.phone,
            name: data.name,
            role: shared_1.UserRole.OWNER,
            shopId,
            passwordHash,
            pin: data.pin || '1234',
            createdAt: new Date().toISOString(),
        };
        const newShop = {
            id: shopId,
            name: data.shopName,
            ownerId: userId,
            category: data.category || shared_1.ShopCategory.KIRANA_GROCERY,
            phone: data.phone,
            currency: 'INR',
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        database_1.memoryStore.users.set(userId, newUser);
        database_1.memoryStore.shops.set(shopId, newShop);
        const tokens = this.generateTokens({
            userId: newUser.id,
            phone: newUser.phone,
            role: newUser.role,
            shopId: newUser.shopId || undefined,
        });
        const { passwordHash: _, pin: __, ...userDto } = newUser;
        return {
            user: userDto,
            shop: newShop,
            tokens,
        };
    }
    static async login(data) {
        let matchedUser = null;
        for (const user of database_1.memoryStore.users.values()) {
            if (user.phone === data.phone) {
                matchedUser = user;
                break;
            }
        }
        if (!matchedUser) {
            const err = new Error('Invalid mobile number or credentials');
            err.statusCode = 401;
            err.code = 'INVALID_CREDENTIALS';
            throw err;
        }
        if (data.password) {
            const isValid = await bcryptjs_1.default.compare(data.password, matchedUser.passwordHash);
            if (!isValid) {
                const err = new Error('Invalid credentials');
                err.statusCode = 401;
                err.code = 'INVALID_CREDENTIALS';
                throw err;
            }
        }
        else if (data.pin) {
            if (matchedUser.pin !== data.pin) {
                const err = new Error('Invalid quick login PIN');
                err.statusCode = 401;
                err.code = 'INVALID_PIN';
                throw err;
            }
        }
        else {
            const err = new Error('Either password or PIN must be provided');
            err.statusCode = 400;
            err.code = 'MISSING_CREDENTIALS';
            throw err;
        }
        const shop = matchedUser.shopId ? database_1.memoryStore.shops.get(matchedUser.shopId) || null : null;
        const tokens = this.generateTokens({
            userId: matchedUser.id,
            phone: matchedUser.phone,
            role: matchedUser.role,
            shopId: matchedUser.shopId || undefined,
        });
        const { passwordHash: _, pin: __, ...userDto } = matchedUser;
        return {
            user: userDto,
            shop,
            tokens,
        };
    }
    static generateTokens(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, config_1.config.jwtSecret, {
            expiresIn: config_1.config.jwtExpiresIn,
        });
        return {
            accessToken,
            expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
        };
    }
    static verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, config_1.config.jwtSecret);
        }
        catch (err) {
            const error = new Error('Invalid or expired authentication token');
            error.statusCode = 401;
            error.code = 'UNAUTHORIZED';
            throw error;
        }
    }
}
exports.AuthService = AuthService;
