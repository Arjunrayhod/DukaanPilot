import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config';
import { UserRole, UserDTO, ShopDTO, AuthResponse, ShopCategory } from '@dukaanpilot/shared';
import { memoryStore } from '@dukaanpilot/database';

export class AuthService {
  static async registerOwner(data: {
    phone: string;
    name: string;
    password: string;
    shopName: string;
    category?: ShopCategory;
    pin?: string;
  }): Promise<AuthResponse> {
    // Check if phone already exists
    for (const user of memoryStore.users.values()) {
      if (user.phone === data.phone) {
        const err: any = new Error('User with this mobile number already exists');
        err.statusCode = 400;
        err.code = 'USER_ALREADY_EXISTS';
        throw err;
      }
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const userId = 'usr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const shopId = 'shp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);

    const newUser: UserDTO & { passwordHash: string; pin?: string } = {
      id: userId,
      phone: data.phone,
      name: data.name,
      role: UserRole.OWNER,
      shopId,
      passwordHash,
      pin: data.pin || '1234',
      createdAt: new Date().toISOString(),
    };

    const newShop: ShopDTO = {
      id: shopId,
      name: data.shopName,
      ownerId: userId,
      category: data.category || ShopCategory.KIRANA_GROCERY,
      phone: data.phone,
      currency: 'INR',
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    memoryStore.users.set(userId, newUser);
    memoryStore.shops.set(shopId, newShop);

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

  static async login(data: { phone: string; password?: string; pin?: string }): Promise<AuthResponse> {
    let matchedUser: any = null;
    for (const user of memoryStore.users.values()) {
      if (user.phone === data.phone) {
        matchedUser = user;
        break;
      }
    }

    if (!matchedUser) {
      const err: any = new Error('Invalid mobile number or credentials');
      err.statusCode = 401;
      err.code = 'INVALID_CREDENTIALS';
      throw err;
    }

    if (data.password) {
      const isValid = await bcrypt.compare(data.password, matchedUser.passwordHash);
      if (!isValid) {
        const err: any = new Error('Invalid credentials');
        err.statusCode = 401;
        err.code = 'INVALID_CREDENTIALS';
        throw err;
      }
    } else if (data.pin) {
      if (matchedUser.pin !== data.pin) {
        const err: any = new Error('Invalid quick login PIN');
        err.statusCode = 401;
        err.code = 'INVALID_PIN';
        throw err;
      }
    } else {
      const err: any = new Error('Either password or PIN must be provided');
      err.statusCode = 400;
      err.code = 'MISSING_CREDENTIALS';
      throw err;
    }

    const shop = matchedUser.shopId ? memoryStore.shops.get(matchedUser.shopId) || null : null;

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

  static generateTokens(payload: { userId: string; phone: string; role: UserRole; shopId?: string }) {
    const accessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as any,
    });
    return {
      accessToken,
      expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    };
  }

  static verifyToken(token: string) {
    try {
      return jwt.verify(token, config.jwtSecret) as {
        userId: string;
        phone: string;
        role: UserRole;
        shopId?: string;
      };
    } catch (err) {
      const error: any = new Error('Invalid or expired authentication token');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      throw error;
    }
  }
}
