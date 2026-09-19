import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  INITIAL_INVENTORY_ITEMS,
  INITIAL_STOCK_LOGS,
  getDaysUntilExpiry,
  getExpiryStatus,
  decrementStockOnSale
} from '../utils/inventoryService.ts';

describe('Kirana Smart Inventory, Batch & Expiry OS Tests', () => {
  const refDate = new Date('2026-09-19');

  test('should accurately calculate remaining days until product expiry', () => {
    // 2 days remaining
    const days2 = getDaysUntilExpiry('2026-09-21', refDate);
    assert.strictEqual(days2, 2);

    // 6 days remaining
    const days6 = getDaysUntilExpiry('2026-09-25', refDate);
    assert.strictEqual(days6, 6);

    // Past date (expired 4 days ago)
    const expiredDays = getDaysUntilExpiry('2026-09-15', refDate);
    assert.strictEqual(expiredDays, -4);
  });

  test('should classify expiry status into SAFE, NEAR_EXPIRY, and EXPIRED', () => {
    // <= 7 days -> NEAR_EXPIRY
    assert.strictEqual(getExpiryStatus('2026-09-21', refDate), 'NEAR_EXPIRY');
    assert.strictEqual(getExpiryStatus('2026-09-26', refDate), 'NEAR_EXPIRY');

    // > 7 days -> SAFE
    assert.strictEqual(getExpiryStatus('2026-10-15', refDate), 'SAFE');
    assert.strictEqual(getExpiryStatus('2027-02-01', refDate), 'SAFE');

    // < 0 days -> EXPIRED
    assert.strictEqual(getExpiryStatus('2026-09-10', refDate), 'EXPIRED');
  });

  test('should automatically decrement inventory stock on POS bill sale and generate audit log', () => {
    const testInventory = [
      {
        id: 'inv_101',
        name: 'Amul Taaza Milk 500ml',
        hindi: 'अमूल ताजा दूध 500ml',
        category: 'Dairy & Bakery',
        currentStock: 14,
        minThreshold: 20,
        unit: 'packet',
        costPrice: 25,
        sellingPrice: 27,
        mrp: 27,
        batchNo: 'B2609A',
        expiryDate: '2026-09-21',
        supplierName: 'अमुल डेयरी डिस्ट्रीब्यूटर',
        barcode: '8901262010014'
      },
      {
        id: 'inv_105',
        name: 'Madhur Pure Refined Sugar 1kg',
        hindi: 'मधुर चीनी 1kg',
        category: 'Sugar & Sweeteners',
        currentStock: 20,
        minThreshold: 30,
        unit: 'packet',
        costPrice: 42,
        sellingPrice: 48,
        mrp: 55,
        batchNo: 'MDH0826',
        expiryDate: '2027-08-10',
        supplierName: 'रेणुका शुगर्स एजेंसी',
        barcode: '8901030825319'
      }
    ];

    const soldItems = [
      { id: 'inv_101', name: 'Amul Taaza Milk 500ml', qty: 4 },
      { id: '8901030825319', name: 'Madhur Pure Refined Sugar 1kg', qty: 5 }
    ];

    const { updatedInventory, logs } = decrementStockOnSale(testInventory, soldItems);

    // Milk: 14 - 4 = 10
    const updatedMilk = updatedInventory.find(i => i.id === 'inv_101');
    assert.ok(updatedMilk);
    assert.strictEqual(updatedMilk.currentStock, 10);

    // Sugar: 20 - 5 = 15
    const updatedSugar = updatedInventory.find(i => i.id === 'inv_105');
    assert.ok(updatedSugar);
    assert.strictEqual(updatedSugar.currentStock, 15);

    // Logs generated
    assert.strictEqual(logs.length, 2);
    assert.strictEqual(logs[0].type, 'SALE');
    assert.strictEqual(logs[0].quantityDelta, -4);
    assert.strictEqual(logs[0].finalStock, 10);
    assert.ok(logs[0].reason.includes('बिक्री'));
  });

  test('should not reduce stock below zero on excess sale', () => {
    const testInventory = [
      {
        id: 'inv_test',
        name: 'Britannia Bread',
        hindi: 'ब्रेड',
        category: 'Dairy',
        currentStock: 2,
        minThreshold: 5,
        unit: 'packet',
        costPrice: 30,
        sellingPrice: 40,
        mrp: 40,
        batchNo: 'B1',
        expiryDate: '2026-09-22',
        supplierName: 'Britannia'
      }
    ];

    const soldItems = [{ id: 'inv_test', name: 'Britannia Bread', qty: 5 }];
    const { updatedInventory } = decrementStockOnSale(testInventory, soldItems);
    assert.strictEqual(updatedInventory[0].currentStock, 0);
  });

  test('should have valid initial inventory mock items with batches & expiry dates', () => {
    assert.ok(INITIAL_INVENTORY_ITEMS.length >= 5);
    for (const item of INITIAL_INVENTORY_ITEMS) {
      assert.ok(item.id);
      assert.ok(item.name);
      assert.ok(item.hindi);
      assert.ok(item.batchNo);
      assert.ok(item.expiryDate);
      assert.ok(item.currentStock >= 0);
      assert.ok(item.sellingPrice > 0);
    }
  });

  test('should have initial stock adjustment logs audit trail', () => {
    assert.ok(INITIAL_STOCK_LOGS.length >= 2);
    for (const log of INITIAL_STOCK_LOGS) {
      assert.ok(log.id);
      assert.ok(log.itemName);
      assert.ok(log.type);
      assert.ok(log.reason);
      assert.ok(log.date);
    }
  });
});
