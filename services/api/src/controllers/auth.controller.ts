import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuditService } from '../services/audit.service';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middleware/auth';
import { memoryStore } from '@dukaanpilot/database';

const registerSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  name: z.string().min(2, 'Name is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  shopName: z.string().min(2, 'Shop name is required'),
  category: z.any().optional(),
  pin: z.string().length(4).optional(),
});

const loginSchema = z.object({
  phone: z.string().min(10, 'Valid 10-digit mobile number required'),
  password: z.string().optional(),
  pin: z.string().length(4).optional(),
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = registerSchema.parse(req.body);
      const result = await AuthService.registerOwner(validated);

      await AuditService.log({
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
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = loginSchema.parse(req.body);
      const result = await AuthService.login(validated);

      await AuditService.log({
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
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const user = memoryStore.users.get(req.user.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const shop = user.shopId ? memoryStore.shops.get(user.shopId) || null : null;
      const { passwordHash: _, pin: __, ...userDto } = user;

      return res.status(200).json({
        success: true,
        data: {
          user: userDto,
          shop,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
