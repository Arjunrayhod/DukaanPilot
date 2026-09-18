"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const database_1 = require("@dukaanpilot/database");
const shared_1 = require("@dukaanpilot/shared");
const inventory_service_1 = require("./inventory.service");
class ProductService {
    static async listProducts(filter) {
        let list = Array.from(database_1.memoryStore.products.values());
        if (filter.shopId) {
            list = list.filter((p) => p.shopId === filter.shopId);
        }
        if (filter.categoryId && filter.categoryId !== 'All') {
            list = list.filter((p) => p.categoryId === filter.categoryId);
        }
        if (filter.lowStockOnly) {
            list = list.filter((p) => p.currentStock <= p.minThreshold);
        }
        if (filter.search) {
            const q = filter.search.toLowerCase().trim();
            list = list.filter((p) => p.name.toLowerCase().includes(q) ||
                (p.nameHindi && p.nameHindi.includes(q)) ||
                (p.barcode && p.barcode.includes(q)) ||
                (p.sku && p.sku.toLowerCase().includes(q)) ||
                (p.brand && p.brand.toLowerCase().includes(q)));
        }
        const total = list.length;
        const offset = filter.offset || 0;
        const limit = filter.limit || 100;
        const items = list.slice(offset, offset + limit);
        return { total, items, limit, offset };
    }
    static async getProductById(id) {
        const product = database_1.memoryStore.products.get(id);
        if (!product) {
            const err = new Error('Product not found');
            err.statusCode = 404;
            err.code = 'PRODUCT_NOT_FOUND';
            throw err;
        }
        return product;
    }
    static async getProductByBarcode(barcode, shopId) {
        for (const prod of database_1.memoryStore.products.values()) {
            if (prod.barcode === barcode && (!shopId || prod.shopId === shopId)) {
                return prod;
            }
        }
        return null;
    }
    static async createProduct(data) {
        const id = 'prod_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const category = data.categoryId ? database_1.memoryStore.categories.get(data.categoryId) : null;
        const supplier = data.supplierId ? database_1.memoryStore.suppliers.get(data.supplierId) : null;
        const initialStock = data.currentStock || 0;
        const newProduct = {
            id,
            shopId: data.shopId,
            name: data.name,
            nameHindi: data.nameHindi || null,
            categoryId: data.categoryId || null,
            categoryName: category ? category.name : null,
            supplierId: data.supplierId || null,
            supplierName: supplier ? supplier.name : null,
            barcode: data.barcode || null,
            sku: data.sku || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
            brand: data.brand || null,
            unit: data.unit || 'packet',
            costPrice: data.costPrice || 0,
            sellingPrice: data.sellingPrice,
            mrp: data.mrp || data.sellingPrice,
            gstRate: data.gstRate || 0,
            currentStock: initialStock,
            minThreshold: data.minThreshold || 5,
            reorderQty: data.reorderQty || 10,
            imageUrl: data.imageUrl || null,
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        database_1.memoryStore.products.set(id, newProduct);
        if (initialStock > 0) {
            await inventory_service_1.InventoryService.recordMovement({
                shopId: data.shopId,
                productId: id,
                productName: newProduct.name,
                quantityBefore: 0,
                deltaQuantity: initialStock,
                quantityAfter: initialStock,
                type: shared_1.MovementType.PURCHASE_IN,
                reason: 'Initial Product Stock Setup',
            });
        }
        return newProduct;
    }
    static async updateProduct(id, updates) {
        const existing = await this.getProductById(id);
        const updated = {
            ...existing,
            ...updates,
            updatedAt: new Date().toISOString(),
        };
        database_1.memoryStore.products.set(id, updated);
        return updated;
    }
    static async deleteProduct(id) {
        const existing = await this.getProductById(id);
        database_1.memoryStore.products.delete(id);
        return { id, name: existing.name, deleted: true };
    }
}
exports.ProductService = ProductService;
