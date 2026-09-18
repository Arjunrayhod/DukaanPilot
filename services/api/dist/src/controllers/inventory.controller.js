"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryController = void 0;
const inventory_service_1 = require("../services/inventory.service");
const shared_1 = require("@dukaanpilot/shared");
const zod_1 = require("zod");
const adjustStockSchema = zod_1.z.object({
    productId: zod_1.z.string().min(1, 'Product ID required'),
    delta: zod_1.z.number(),
    type: zod_1.z.nativeEnum(shared_1.MovementType).default(shared_1.MovementType.ADJUSTMENT),
    reason: zod_1.z.string().min(2, 'Reason for adjustment required'),
});
class InventoryController {
    static async adjust(req, res, next) {
        try {
            const validated = adjustStockSchema.parse(req.body);
            const shopId = req.user?.shopId || req.body.shopId || 'shp_demomart';
            const result = await inventory_service_1.InventoryService.adjustStock({
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
        }
        catch (err) {
            next(err);
        }
    }
    static async getLowStockAlerts(req, res, next) {
        try {
            const shopId = req.user?.shopId || req.query.shopId;
            const alerts = await inventory_service_1.InventoryService.getLowStockAlerts(shopId);
            return res.status(200).json({
                success: true,
                data: alerts,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getMovements(req, res, next) {
        try {
            const shopId = req.user?.shopId || req.query.shopId;
            const productId = req.query.productId;
            const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
            const movements = await inventory_service_1.InventoryService.getStockMovements({ shopId, productId, limit });
            return res.status(200).json({
                success: true,
                data: movements,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.InventoryController = InventoryController;
