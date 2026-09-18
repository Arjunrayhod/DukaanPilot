"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const database_1 = require("@dukaanpilot/database");
class CategoryService {
    static async listCategories(shopId) {
        let list = Array.from(database_1.memoryStore.categories.values());
        if (shopId) {
            list = list.filter((c) => !c.shopId || c.shopId === shopId);
        }
        return list;
    }
    static async createCategory(data) {
        const id = 'cat_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const newCat = {
            id,
            shopId: data.shopId || 'shp_demomart',
            name: data.name,
            nameHindi: data.nameHindi || data.name,
            icon: data.icon || 'box',
            displayOrder: database_1.memoryStore.categories.size + 1,
        };
        database_1.memoryStore.categories.set(id, newCat);
        return newCat;
    }
}
exports.CategoryService = CategoryService;
