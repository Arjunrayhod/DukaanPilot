import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  HSN_CATALOG,
  lookupProductHsn,
  computeGstForCart,
  generateGstr1Csv,
  amountInWordsHindi
} from '../utils/gstTaxService.ts';
import {
  parseWhatsAppGroceryList,
  askKiranaAiCopilot
} from '../utils/aiCopilotService.ts';

describe('GST Tax Calculation & HSN Lookup Tests', () => {
  it('should correctly lookup HSN code and GST rate for various grocery categories', () => {
    const milkHsn = lookupProductHsn({ category: 'Dairy & Milk', name: 'Amul Taaza Milk 500ml' });
    assert.strictEqual(milkHsn.hsn, '0401');
    assert.strictEqual(milkHsn.rate, 5);

    const riceHsn = lookupProductHsn({ category: 'Grains', name: 'India Gate Basmati Rice 5kg' });
    assert.strictEqual(riceHsn.hsn, '1006');
    assert.strictEqual(riceHsn.rate, 0);

    const attaHsn = lookupProductHsn({ category: 'Atta & Flour', name: 'Aashirvaad Shudh Chakki Atta 5kg' });
    assert.strictEqual(attaHsn.hsn, '1101');
    assert.strictEqual(attaHsn.rate, 5);

    const biscuitHsn = lookupProductHsn({ category: 'Bakery', name: 'Parle-G Gold Biscuits' });
    assert.strictEqual(biscuitHsn.hsn, '1905');
    assert.strictEqual(biscuitHsn.rate, 18);

    const namkeenHsn = lookupProductHsn({ category: 'Snacks', name: 'Haldiram Aloo Bhujia 200g' });
    assert.strictEqual(namkeenHsn.hsn, '2106');
    assert.strictEqual(namkeenHsn.rate, 12);
  });

  it('should accurately calculate intra-state GST (CGST + SGST) for mixed cart items', () => {
    const mockCart = [
      { id: '1', name: 'Amul Taaza Milk 500ml', price: 54, qty: 1, category: 'Dairy' },
      { id: '2', name: 'Basmati Rice 1kg', price: 100, qty: 1, category: 'Grains' },
      { id: '3', name: 'Parle-G Biscuit', price: 118, qty: 1, category: 'Bakery' },
    ];

    const result = computeGstForCart(mockCart, { isInterState: false, isB2B: false });

    assert.strictEqual(result.items.length, 3);
    assert.strictEqual(result.grandTotal, 272);
    assert.strictEqual(result.isInterState, false);
    assert.ok(result.totalGst > 0);
    assert.strictEqual(result.totalCgst, result.totalSgst);
    assert.strictEqual(result.totalIgst, 0);

    assert.ok(result.rateSummary[0]);
    assert.ok(result.rateSummary[5]);
    assert.ok(result.rateSummary[18]);
    assert.strictEqual(result.rateSummary[0].taxable, 100);
    assert.strictEqual(result.rateSummary[18].taxable, 100);
    assert.strictEqual(result.rateSummary[18].totalGst, 18);
  });

  it('should calculate IGST for inter-state B2B transactions with Buyer GSTIN', () => {
    const mockCart = [
      { id: '1', name: 'Haldiram Namkeen 200g', price: 112, qty: 2, category: 'Snacks' },
    ];

    const result = computeGstForCart(mockCart, {
      isInterState: true,
      isB2B: true,
      buyerGstin: '08ABCDE1234F1Z5',
      buyerState: 'Rajasthan (08)'
    });

    assert.strictEqual(result.isInterState, true);
    assert.strictEqual(result.isB2B, true);
    assert.strictEqual(result.buyerGstin, '08ABCDE1234F1Z5');
    assert.strictEqual(result.totalCgst, 0);
    assert.strictEqual(result.totalSgst, 0);
    assert.strictEqual(result.totalIgst, result.totalGst);
  });

  it('should generate valid GSTR-1 formatted CSV export', () => {
    const mockBills = [
      {
        invoiceNo: '1001',
        createdAt: '2026-09-19',
        customerName: 'रमेश कुमार',
        grandTotal: 108,
        subtotal: 100,
        paymentMode: 'CASH',
        items: [{ id: '1', name: 'Amul Milk', price: 54, qty: 2, category: 'Dairy' }]
      }
    ];

    const csvContent = generateGstr1Csv(mockBills);
    assert.ok(csvContent.includes('Invoice Number,Invoice Date,Invoice Value (INR)'));
    assert.ok(csvContent.includes('"1001"'));
    assert.ok(csvContent.includes('"07-Delhi"'));
  });

  it('should convert rupee numbers into Hindi currency words', () => {
    const words1 = amountInWordsHindi(1450);
    assert.strictEqual(words1, 'एक हज़ार चार सौ पचास रुपये मात्र');

    const words2 = amountInWordsHindi(100);
    assert.strictEqual(words2, 'एक सौ रुपये मात्र');
  });
});

describe('AI Kirana Copilot & WhatsApp List Parsing Tests', () => {
  const mockCatalog = [
    { id: '1', name: 'Amul Taaza Milk 500ml', nameHindi: 'अमूल ताजा दूध 500ml', price: 27, unit: 'packet' },
    { id: '2', name: 'Madhur Sugar 1kg', nameHindi: 'मधुर चीनी 1kg', price: 48, unit: 'kg' },
    { id: '3', name: 'Tata Tea Gold 250g', nameHindi: 'टाटा टी गोल्ड चाय पत्ती 250g', price: 140, unit: 'packet' },
    { id: '4', name: 'Aashirvaad Atta 5kg', nameHindi: 'आशीर्वाद आटा 5kg', price: 220, unit: 'bag' },
    { id: '5', name: 'Britannia Bread 400g', nameHindi: 'ब्रिटानिया ब्रेड 400g', price: 40, unit: 'packet' },
  ];

  it('should parse raw WhatsApp Hindi & Hinglish grocery list into structured items', () => {
    const rawWhatsappText = 'Bhaiya ye saman bhej do:\n1. 2 packet doodh\n2. 1 kg cheeni\n3. 1 chai patti\n4. 1 bread';

    const result = parseWhatsAppGroceryList(rawWhatsappText, mockCatalog);

    assert.strictEqual(result.matchedItems.length, 4);
    assert.strictEqual(result.totalEstimatedAmount, 2 * 27 + 48 + 140 + 40);
    assert.strictEqual(result.unmatchedLines.length, 0);

    assert.strictEqual(result.matchedItems[0].name, 'Amul Taaza Milk 500ml');
    assert.strictEqual(result.matchedItems[0].qty, 2);
    assert.strictEqual(result.matchedItems[0].unit, 'packet');
  });

  it('should handle colloquial Hindi quantity words (aadha, dedh, dhai)', () => {
    const rawText = 'aadha kilo cheeni\n2 doodh';

    const result = parseWhatsAppGroceryList(rawText, mockCatalog);
    assert.strictEqual(result.matchedItems.length, 2);
    assert.strictEqual(result.matchedItems[0].qty, 0.5);
  });

  it('should answer Kirana business queries accurately via Kirana AI Copilot', () => {
    const context = {
      todaySales: 15420,
      todayBills: 42,
      totalProfit: 2380,
      totalKhataDue: 18500,
      lowStockCount: 3,
      nearExpiryCount: 2,
      supplierPendingDue: 5000,
      shopName: 'श्री गणेश किराना स्टोर',
    };

    const answerSales = askKiranaAiCopilot('aaj ki bikri kitni hui?', context, 'hi');
    assert.ok(answerSales.reply.includes('15,420') || answerSales.reply.includes('15420'));

    const answerKhata = askKiranaAiCopilot('khata me kitna paisa baki hai?', context, 'hi');
    assert.ok(answerKhata.reply.includes('18,500') || answerKhata.reply.includes('18500'));

    const answerStock = askKiranaAiCopilot('kaunsa saman kam hai?', context, 'hi');
    assert.ok(answerStock.reply.includes('3 सामान'));
  });
});
