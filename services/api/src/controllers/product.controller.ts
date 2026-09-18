import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { AuthenticatedRequest } from '../middleware/auth';
import { z } from 'zod';

const createProductSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  nameHindi: z.string().optional(),
  categoryId: z.string().optional(),
  supplierId: z.string().optional(),
  barcode: z.string().optional(),
  sku: z.string().optional(),
  brand: z.string().optional(),
  unit: z.string().default('packet'),
  costPrice: z.number().nonnegative().default(0),
  sellingPrice: z.number().positive('Selling price must be greater than zero'),
  mrp: z.number().nonnegative().optional(),
  gstRate: z.number().nonnegative().default(0),
  currentStock: z.number().nonnegative().default(0),
  minThreshold: z.number().nonnegative().default(5),
  reorderQty: z.number().positive().default(10),
  imageUrl: z.string().optional(),
});

export class ProductController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const search = req.query.search as string;
      const categoryId = req.query.categoryId as string;
      const lowStockOnly = req.query.lowStock === 'true';
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 100;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      const shopId = req.user?.shopId || (req.query.shopId as string);

      const result = await ProductService.listProducts({
        shopId,
        search,
        categoryId,
        lowStockOnly,
        limit,
        offset,
      });

      return res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductById(req.params.id);
      return res.status(200).json({
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async getByBarcode(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const barcode = req.params.barcode;
      const shopId = req.user?.shopId || (req.query.shopId as string);
      const product = await ProductService.getProductByBarcode(barcode, shopId);

      if (!product) {
        return res.status(404).json({
          success: false,
          error: { code: 'PRODUCT_NOT_FOUND', message: `No product found with barcode ${barcode}` },
          timestamp: new Date().toISOString(),
        });
      }

      return res.status(200).json({
        success: true,
        data: product,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const validated = createProductSchema.parse(req.body);
      const shopId = req.user?.shopId || req.body.shopId || 'shp_demomart';

      const product = await ProductService.createProduct({
        ...validated,
        shopId,
      });

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const updated = await ProductService.updateProduct(req.params.id, req.body);
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await ProductService.deleteProduct(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
