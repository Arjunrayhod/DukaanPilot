"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("../services/product.service");
const zod_1 = require("zod");
const createProductSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Product name is required'),
    nameHindi: zod_1.z.string().optional(),
    categoryId: zod_1.z.string().optional(),
    supplierId: zod_1.z.string().optional(),
    barcode: zod_1.z.string().optional(),
    sku: zod_1.z.string().optional(),
    brand: zod_1.z.string().optional(),
    unit: zod_1.z.string().default('packet'),
    costPrice: zod_1.z.number().nonnegative().default(0),
    sellingPrice: zod_1.z.number().positive('Selling price must be greater than zero'),
    mrp: zod_1.z.number().nonnegative().optional(),
    gstRate: zod_1.z.number().nonnegative().default(0),
    currentStock: zod_1.z.number().nonnegative().default(0),
    minThreshold: zod_1.z.number().nonnegative().default(5),
    reorderQty: zod_1.z.number().positive().default(10),
    imageUrl: zod_1.z.string().optional(),
});
class ProductController {
    static async list(req, res, next) {
        try {
            const search = req.query.search;
            const categoryId = req.query.categoryId;
            const lowStockOnly = req.query.lowStock === 'true';
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 100;
            const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
            const shopId = req.user?.shopId || req.query.shopId;
            const result = await product_service_1.ProductService.listProducts({
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
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const product = await product_service_1.ProductService.getProductById(req.params.id);
            return res.status(200).json({
                success: true,
                data: product,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getByBarcode(req, res, next) {
        try {
            const barcode = req.params.barcode;
            const shopId = req.user?.shopId || req.query.shopId;
            const product = await product_service_1.ProductService.getProductByBarcode(barcode, shopId);
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
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const validated = createProductSchema.parse(req.body);
            const shopId = req.user?.shopId || req.body.shopId || 'shp_demomart';
            const product = await product_service_1.ProductService.createProduct({
                ...validated,
                shopId,
            });
            return res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async update(req, res, next) {
        try {
            const updated = await product_service_1.ProductService.updateProduct(req.params.id, req.body);
            return res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: updated,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async delete(req, res, next) {
        try {
            const result = await product_service_1.ProductService.deleteProduct(req.params.id);
            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
                data: result,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.ProductController = ProductController;
