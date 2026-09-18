"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupplierController = void 0;
const supplier_service_1 = require("../services/supplier.service");
const zod_1 = require("zod");
const createSupplierSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Supplier name is required'),
    contactPerson: zod_1.z.string().optional(),
    phone: zod_1.z.string().min(10, 'Valid phone number required'),
    email: zod_1.z.string().email().optional(),
    address: zod_1.z.string().optional(),
    gstNumber: zod_1.z.string().optional(),
    paymentTerms: zod_1.z.string().optional(),
});
class SupplierController {
    static async list(req, res, next) {
        try {
            const shopId = req.user?.shopId || req.query.shopId;
            const suppliers = await supplier_service_1.SupplierService.listSuppliers(shopId);
            return res.status(200).json({
                success: true,
                data: suppliers,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async getById(req, res, next) {
        try {
            const supplier = await supplier_service_1.SupplierService.getSupplierById(req.params.id);
            return res.status(200).json({
                success: true,
                data: supplier,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const validated = createSupplierSchema.parse(req.body);
            const shopId = req.user?.shopId || req.body.shopId || 'shp_demomart';
            const supplier = await supplier_service_1.SupplierService.createSupplier({
                ...validated,
                shopId,
            });
            return res.status(201).json({
                success: true,
                message: 'Supplier created successfully',
                data: supplier,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
exports.SupplierController = SupplierController;
