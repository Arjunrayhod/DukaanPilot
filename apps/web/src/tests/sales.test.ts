import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateSalesSummary } from '../utils/salesService.ts';
import type { CompletedBill } from '../utils/salesService.ts';

describe('Realtime Sales & Profit Calculation Tests', () => {
  it('should return exactly zero metrics when there are no bills', () => {
    const summary = calculateSalesSummary([]);

    assert.strictEqual(summary.totalSales, 0);
    assert.strictEqual(summary.totalCost, 0);
    assert.strictEqual(summary.grossProfit, 0);
    assert.strictEqual(summary.profitMarginPercent, 0);
    assert.strictEqual(summary.totalBills, 0);
    assert.strictEqual(summary.avgBillValue, 0);
    assert.strictEqual(summary.cashCollected, 0);
    assert.strictEqual(summary.upiCollected, 0);
    assert.strictEqual(summary.khataGiven, 0);
    assert.strictEqual(summary.topSellingItems.length, 0);
    assert.strictEqual(summary.categoryBreakdown.length, 0);
    assert.strictEqual(summary.hourlyTrend.length, 0);
  });

  it('should dynamically aggregate multiple bills with accurate profit and payment breakdowns', () => {
    const mockBills: CompletedBill[] = [
      {
        id: 'BILL-1',
        invoiceNo: '1001',
        timestamp: '2026-09-19T09:30:00.000Z',
        timeFormatted: '09:30 AM',
        dateFormatted: '19 Sep 2026',
        customerName: 'रमेश कुमार',
        customerPhone: '9823456789',
        items: [
          {
            id: '1',
            name: 'Amul Taaza Milk 500ml',
            hindi: 'अमूल ताजा दूध 500ml',
            qty: 2,
            unit: 'packet',
            price: 27,
            costPrice: 25,
            category: 'Dairy & Bakery',
            categoryHindi: 'डेयरी व बेकरी'
          },
          {
            id: '2',
            name: 'Madhur Pure Sugar 1kg',
            hindi: 'मधुर चीनी 1kg',
            qty: 1,
            unit: 'kg',
            price: 48,
            costPrice: 40,
            category: 'Sugar & Sweeteners',
            categoryHindi: 'चीनी व गुड़'
          }
        ],
        subtotal: 102,
        gstAmount: 0,
        discount: 0,
        grandTotal: 102,
        paymentMode: 'cash',
        totalCost: 90, // (25*2) + (40*1)
        grossProfit: 12, // (27-25)*2 + (48-40)*1 = 4 + 8 = 12
        cashCollected: 102,
        upiCollected: 0,
        khataGiven: 0
      },
      {
        id: 'BILL-2',
        invoiceNo: '1002',
        timestamp: '2026-09-19T10:15:00.000Z',
        timeFormatted: '10:15 AM',
        dateFormatted: '19 Sep 2026',
        customerName: 'सुनील शर्मा',
        customerPhone: '9845012345',
        items: [
          {
            id: '1',
            name: 'Amul Taaza Milk 500ml',
            hindi: 'अमूल ताजा दूध 500ml',
            qty: 4,
            unit: 'packet',
            price: 27,
            costPrice: 25,
            category: 'Dairy & Bakery',
            categoryHindi: 'डेयरी व बेकरी'
          }
        ],
        subtotal: 108,
        gstAmount: 0,
        discount: 0,
        grandTotal: 108,
        paymentMode: 'upi',
        totalCost: 100, // 25*4
        grossProfit: 8, // (27-25)*4
        cashCollected: 0,
        upiCollected: 108,
        khataGiven: 0
      }
    ];

    const summary = calculateSalesSummary(mockBills);

    assert.strictEqual(summary.totalSales, 210); // 102 + 108
    assert.strictEqual(summary.totalCost, 190); // 90 + 100
    assert.strictEqual(summary.grossProfit, 20); // 12 + 8
    assert.strictEqual(summary.totalBills, 2);
    assert.strictEqual(summary.avgBillValue, 105); // 210 / 2
    assert.strictEqual(summary.cashCollected, 102);
    assert.strictEqual(summary.upiCollected, 108);
    assert.strictEqual(summary.khataGiven, 0);

    // Margin: 20 / 210 * 100 = 9.5%
    assert.strictEqual(summary.profitMarginPercent, 9.5);

    // Top Selling Items check
    assert.strictEqual(summary.topSellingItems.length, 2);
    assert.strictEqual(summary.topSellingItems[0].name, 'Amul Taaza Milk 500ml');
    assert.strictEqual(summary.topSellingItems[0].qtySold, 6); // 2 + 4
    assert.strictEqual(summary.topSellingItems[0].revenue, 162); // 6 * 27

    // Categories
    assert.strictEqual(summary.categoryBreakdown.length, 2);
  });
});
