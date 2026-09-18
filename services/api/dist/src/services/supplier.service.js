"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierService = void 0;
const database_1 = require("@dukaanpilot/database");
class SupplierService {
    static async listSuppliers(shopId) {
        let list = Array.from(database_1.memoryStore.suppliers.values());
        if (shopId) {
            list = list.filter((s) => s.shopId === shopId);
        }
        return list;
    }
    static async getSupplierById(id) {
        const supplier = database_1.memoryStore.suppliers.get(id);
        if (!supplier) {
            const err = new Error('Supplier not found');
            err.statusCode = 404;
            err.code = 'SUPPLIER_NOT_FOUND';
            throw err;
        }
        return supplier;
    }
    static async createSupplier(data) {
        const id = 'sup_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const newSupplier = {
            id,
            shopId: data.shopId,
            name: data.name,
            contactPerson: data.contactPerson || null,
            phone: data.phone,
            email: data.email || null,
            address: data.address || null,
            gstNumber: data.gstNumber || null,
            paymentTerms: data.paymentTerms || 'Net 15',
            isActive: true,
            createdAt: new Date().toISOString(),
        };
        database_1.memoryStore.suppliers.set(id, newSupplier);
        return newSupplier;
    }
}
exports.SupplierService = SupplierService;
