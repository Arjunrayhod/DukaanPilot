import { memoryStore } from '@dukaanpilot/database';
import { SupplierDTO } from '@dukaanpilot/shared';

export class SupplierService {
  static async listSuppliers(shopId?: string) {
    let list = Array.from(memoryStore.suppliers.values());
    if (shopId) {
      list = list.filter((s) => s.shopId === shopId);
    }
    return list;
  }

  static async getSupplierById(id: string) {
    const supplier = memoryStore.suppliers.get(id);
    if (!supplier) {
      const err: any = new Error('Supplier not found');
      err.statusCode = 404;
      err.code = 'SUPPLIER_NOT_FOUND';
      throw err;
    }
    return supplier;
  }

  static async createSupplier(data: Partial<SupplierDTO> & { name: string; phone: string; shopId: string }) {
    const id = 'sup_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newSupplier: SupplierDTO = {
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

    memoryStore.suppliers.set(id, newSupplier);
    return newSupplier;
  }
}
