import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  recordPurchaseInward, 
  formatSupplierPaymentReceipt,
  INITIAL_INWARD_ENTRIES
} from '../utils/inwardService.ts';
import { INITIAL_SUPPLIERS } from '../utils/restockService.ts';
import { INITIAL_INVENTORY_ITEMS } from '../utils/inventoryService.ts';

describe('Supplier Purchase Inward & AP Ledger Tests', () => {
  it('should have initial mock purchase inward entries', () => {
    assert.ok(INITIAL_INWARD_ENTRIES.length >= 1);
    assert.strictEqual(INITIAL_INWARD_ENTRIES[0].supplierName, 'अमुल डेयरी डिस्ट्रीब्यूटर');
    assert.strictEqual(INITIAL_INWARD_ENTRIES[0].totalAmount, 750);
  });

  it('should automatically increment inventory stock upon purchase inward and create stock adjustment log', () => {
    const supplier = INITIAL_SUPPLIERS[0];
    const initialItem = INITIAL_INVENTORY_ITEMS.find((i) => i.id === 'inv_101')!;
    const initialStock = initialItem.currentStock; // e.g. 14

    const result = recordPurchaseInward({
      supplier,
      invoiceNumber: 'AMUL-INV-9901',
      invoiceDate: '19/09/2026',
      items: [
        {
          itemId: 'inv_101',
          name: 'Amul Taaza Milk 500ml',
          nameHindi: 'अमूल ताजा दूध 500ml',
          qtyReceived: 20,
          unit: 'packet',
          costPrice: 25,
          sellingPrice: 27
        }
      ],
      paidAmount: 500,
      paymentMode: 'cash',
      currentInventory: INITIAL_INVENTORY_ITEMS
    });

    const updatedItem = result.updatedInventory.find((i) => i.id === 'inv_101')!;
    assert.strictEqual(updatedItem.currentStock, initialStock + 20);
    assert.strictEqual(result.adjustmentLogs.length, 1);
    assert.strictEqual(result.adjustmentLogs[0].type, 'RESTOCK');
    assert.strictEqual(result.adjustmentLogs[0].quantityDelta, 20);
    assert.strictEqual(result.newEntry.totalAmount, 500); // 20 * 25
    assert.strictEqual(result.newEntry.paidAmount, 500);
    assert.strictEqual(result.newEntry.pendingAmount, 0);
  });

  it('should correctly calculate pending credit when purchase is on partial payment', () => {
    const supplier = INITIAL_SUPPLIERS[1]; // Britannia

    const result = recordPurchaseInward({
      supplier,
      invoiceNumber: 'BRT-INV-4412',
      invoiceDate: '19/09/2026',
      items: [
        {
          itemId: 'inv_102',
          name: 'Britannia Daily Fresh Bread 400g',
          qtyReceived: 50,
          unit: 'packet',
          costPrice: 38,
          sellingPrice: 45
        }
      ],
      paidAmount: 1000,
      paymentMode: 'partial',
      currentInventory: INITIAL_INVENTORY_ITEMS
    });

    assert.strictEqual(result.newEntry.totalAmount, 1900); // 50 * 38
    assert.strictEqual(result.newEntry.paidAmount, 1000);
    assert.strictEqual(result.newEntry.pendingAmount, 900); // 1900 - 1000
  });

  it('should format clean Hindi supplier payment WhatsApp receipt', () => {
    const supplier = INITIAL_SUPPLIERS[0];
    const payment = {
      id: 'sp_pay_1',
      supplierId: supplier.id,
      supplierName: supplier.name,
      date: '19/09/2026',
      time: '02:30 PM',
      amount: 5000,
      paymentMode: 'upi' as const,
      notes: 'पुराने बिल का भुगतान'
    };

    const text = formatSupplierPaymentReceipt(supplier, payment, undefined, 'hi');
    assert.ok(text.includes('सप्लायर भुगतान रसीद'));
    assert.ok(text.includes('₹5,000'));
    assert.ok(text.includes('UPI'));
    assert.ok(text.includes('पुराने बिल का भुगतान'));
  });
});
