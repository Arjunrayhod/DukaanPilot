import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import { AuthenticatedRequest } from '../middleware/auth';

export class CategoryController {
  static async list(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const shopId = req.user?.shopId || (req.query.shopId as string);
      const categories = await CategoryService.listCategories(shopId);
      return res.status(200).json({
        success: true,
        data: categories,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  static async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { name, nameHindi, icon } = req.body;
      if (!name) {
        return res.status(400).json({ success: false, error: { message: 'Category name is required' } });
      }
      const shopId = req.user?.shopId || 'shp_demomart';
      const category = await CategoryService.createCategory({ name, nameHindi, icon, shopId });
      return res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}
