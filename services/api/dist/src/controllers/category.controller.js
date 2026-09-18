"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const category_service_1 = require("../services/category.service");
class CategoryController {
    static async list(req, res, next) {
        try {
            const shopId = req.user?.shopId || req.query.shopId;
            const categories = await category_service_1.CategoryService.listCategories(shopId);
            return res.status(200).json({
                success: true,
                data: categories,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const { name, nameHindi, icon } = req.body;
            if (!name) {
                return res.status(400).json({ success: false, error: { message: 'Category name is required' } });
            }
            const shopId = req.user?.shopId || 'shp_demomart';
            const category = await category_service_1.CategoryService.createCategory({ name, nameHindi, icon, shopId });
            return res.status(201).json({
                success: true,
                message: 'Category created successfully',
                data: category,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.CategoryController = CategoryController;
