import { Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventory.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { MovementType } from '@dukaanpilot/shared';
import { z } from 'zod';

const adjustStockSchema = z.object({
  productId: z.string().min(1, 'Product ID required'),
  delta: z.number(),
  type: z.nativeEnum(MovementType).default(MovementType.ADJUSTMENT),
  reason: z.string().min(2, 'Reason for adjustment required'),
});

export class InventoryController {
  static async adjust(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = adjustStockSchema.parse(req.body);
      const shopId = req.user?.shopId || req.body.shopId || 'shp_demomart';

      const result = await InventoryService.adjustStock({
        shopId,
        productId: validated.productId,
        delta: validated.delta,
        type: validated.type,
        reason: validated.reason,
        userId: req.user?.userId,
      });

      return res.status(200).json({
        success: true,
        message: 'Stock adjusted successfully',
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getLowStockAlerts(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = req.user?.shopId || (req.query.shopId as string);
      const alerts = await InventoryService.getLowStockAlerts(shopId);

      return res.status(200).json({
        success: true,
        data: alerts,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getMovements(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = req.user?.shopId || (req.query.shopId as string);
      const productId = req.query.productId as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;

      const movements = await InventoryService.getStockMovements({ shopId, productId, limit });

      return res.status(200).json({
        success: true,
        data: movements,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
