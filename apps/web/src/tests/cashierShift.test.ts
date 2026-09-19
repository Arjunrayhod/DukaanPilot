import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  startShift,
  recordSaleInActiveShift,
  recordCashDrop,
  closeShift,
  formatWhatsAppShiftHandover,
  getActiveShift,
  saveActiveShift
} from '../utils/cashierShiftService.ts';

describe('Cashier Shifts & Drawer Float Reconciliation Tests', () => {
  it('should start a new shift with opening float and calculate expected cash', () => {
    saveActiveShift(null);

    const shift = startShift({
      cashierName: 'विक्रम सिंह',
      counterNumber: 'Counter #1',
      openingFloat: 2500,
      cashierPin: '5566'
    });

    assert.strictEqual(shift.status, 'OPEN');
    assert.strictEqual(shift.cashierName, 'विक्रम सिंह');
    assert.strictEqual(shift.openingFloat, 2500);
    assert.strictEqual(shift.expectedCash, 2500);
    assert.strictEqual(shift.cashSales, 0);
  });

  it('should accurately aggregate sales into active shift', () => {
    // Record Cash Sale
    const s1 = recordSaleInActiveShift({
      grandTotal: 850,
      paymentMode: 'cash'
    });
    assert.ok(s1);
    assert.strictEqual(s1.cashSales, 850);
    assert.strictEqual(s1.expectedCash, 2500 + 850); // 3350

    // Record UPI Sale (should increase totalSales but not drawer expected cash)
    const s2 = recordSaleInActiveShift({
      grandTotal: 1200,
      paymentMode: 'upi'
    });
    assert.ok(s2);
    assert.strictEqual(s2.upiSales, 1200);
    assert.strictEqual(s2.expectedCash, 3350); // unchanged drawer cash
    assert.strictEqual(s2.totalSales, 2050);
  });

  it('should record cash drops and reduce expected drawer cash', () => {
    const s = recordCashDrop({
      amount: 400,
      reason: 'सब्जी मंडी कैश पेमेंट',
      type: 'EXPENSE'
    });

    assert.ok(s);
    assert.strictEqual(s.cashDrops.length, 1);
    assert.strictEqual(s.totalCashDrops, 400);
    assert.strictEqual(s.expectedCash, 2500 + 850 - 400); // 2950
  });

  it('should close shift, record physical denominations and calculate variance', () => {
    const closed = closeShift({
      actualCash: 2950,
      denominations: { 500: 5, 200: 2, 50: 1 },
      closingNotes: 'पूरा हिसाब ठीक मिला'
    });

    assert.ok(closed);
    assert.strictEqual(closed.status, 'CLOSED');
    assert.strictEqual(closed.variance, 0);
    assert.strictEqual(getActiveShift(), null);
  });

  it('should format clean Hindi WhatsApp handover report', () => {
    const mockShift = {
      id: 'shift_test',
      counterNumber: 'Counter #1',
      cashierName: 'राजेश शर्मा',
      date: '19/09/2026',
      startTime: '08:00 AM',
      endTime: '03:00 PM',
      status: 'CLOSED' as const,
      openingFloat: 2000,
      cashSales: 10000,
      upiSales: 5000,
      khataSales: 1500,
      totalSales: 16500,
      totalBills: 32,
      cashDrops: [],
      totalCashDrops: 0,
      expectedCash: 12000,
      actualCashCounted: 12000,
      variance: 0
    };

    const text = formatWhatsAppShiftHandover(mockShift, 'श्री गणेश किराना स्टोर', 'hi');
    assert.ok(text.includes('कैशियर शिफ्ट हैंडओवर रिपोर्ट'));
    assert.ok(text.includes('राजेश शर्मा'));
    assert.ok(text.includes('₹12,000'));
  });
});
