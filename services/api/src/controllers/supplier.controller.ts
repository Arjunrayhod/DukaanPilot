import { Request, Response, NextFunction } from 'express';
import { SupplierService } from '../services/supplier.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const createSupplierSchema = z.object({
  name: z.string().min(2, 'Supplier name is required'),
  contactPerson: z.string().optional(),
  phone: z.string().min(10, 'Valid phone number required'),
  email: z.string().email().optional(),
  address: z.string().optional(),
  gstNumber: z.string().optional(),
  paymentTerms: z.string().optional(),
});

export class SupplierController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = req.user?.shopId || (req.query.shopId as string);
      const suppliers = await SupplierService.listSuppliers(shopId);

      return res.status(200).json({
        success: true,
        data: suppliers,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const supplier = await SupplierService.getSupplierById(req.params.id);
      return res.status(200).json({
        success: true,
        data: supplier,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = createSupplierSchema.parse(req.body);
      const shopId = req.user?.shopId || req.body.shopId || 'shp_demomart';

      const supplier = await SupplierService.createSupplier({
        ...validated,
        shopId,
      });

      return res.status(201).json({
        success: true,
        message: 'Supplier created successfully',
        data: supplier,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
