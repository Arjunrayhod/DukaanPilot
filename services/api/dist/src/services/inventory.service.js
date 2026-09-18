"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const database_1 = require("@dukaanpilot/database");
class InventoryService {
    static async recordMovement(data) {
        const id = 'mov_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const movement = {
            id,
            shopId: data.shopId,
            productId: data.productId,
            productName: data.productName,
            quantityBefore: data.quantityBefore,
            deltaQuantity: data.deltaQuantity,
            quantityAfter: data.quantityAfter,
            type: data.type,
            referenceId: data.referenceId || null,
            reason: data.reason || null,
            userId: data.userId || null,
            createdAt: new Date().toISOString(),
        };
        database_1.memoryStore.stockMovements.unshift(movement);
        return movement;
    }
    static async adjustStock(params) {
        const product = database_1.memoryStore.products.get(params.productId);
        if (!product) {
            const err = new Error('Product not found for stock adjustment');
            err.statusCode = 404;
            err.code = 'PRODUCT_NOT_FOUND';
            throw err;
        }
        const quantityBefore = product.currentStock;
        const quantityAfter = Math.max(0, quantityBefore + params.delta);
        product.currentStock = quantityAfter;
        database_1.memoryStore.products.set(params.productId, product);
        const movement = await this.recordMovement({
            shopId: params.shopId,
            productId: params.productId,
            productName: product.name,
            quantityBefore,
            deltaQuantity: params.delta,
            quantityAfter,
            type: params.type,
            reason: params.reason,
            userId: params.userId,
        });
        return {
            productId: product.id,
            productName: product.name,
            quantityBefore,
            delta: params.delta,
            currentStock: quantityAfter,
            isLowStock: quantityAfter <= product.minThreshold,
            movement,
        };
    }
    static async getLowStockAlerts(shopId) {
        let list = Array.from(database_1.memoryStore.products.values());
        if (shopId) {
            list = list.filter((p) => p.shopId === shopId);
        }
        const lowStockItems = list.filter((p) => p.currentStock <= p.minThreshold);
        return {
            totalAlerts: lowStockItems.length,
            items: lowStockItems.map((p) => ({
                id: p.id,
                name: p.name,
                nameHindi: p.nameHindi,
                currentStock: p.currentStock,
                minThreshold: p.minThreshold,
                reorderQty: p.reorderQty,
                unit: p.unit,
                supplierId: p.supplierId,
                supplierName: p.supplierName,
                estimatedCost: p.costPrice * p.reorderQty,
            })),
        };
    }
    static async getStockMovements(filter) {
        let list = database_1.memoryStore.stockMovements;
        if (filter.shopId) {
            list = list.filter((m) => m.shopId === filter.shopId);
        }
        if (filter.productId) {
            list = list.filter((m) => m.productId === filter.productId);
        }
        return list.slice(0, filter.limit || 50);
    }
}
exports.InventoryService = InventoryService;
