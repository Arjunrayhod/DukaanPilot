import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  formatDailyZReportText, 
  generateDailyZReportWhatsAppUrl, 
  TODAY_ANALYTICS_DATA 
} from '../utils/zReportService.ts';
import type { ZReportData } from '../utils/zReportService.ts';

describe('Kirana Analytics & Daily Z-Report Tests', () => {
  it('should format clean Hindi WhatsApp Daily Z-Report message', () => {
    const mockZReport: ZReportData = {
      reportNumber: 'ZR-20260919-01',
      generatedAt: '19 Sep 2026, 09:10 PM',
      shopName: 'श्री गणेश किराना स्टोर',
      shopPhone: '+91 98765 43210',
      openingCash: 2000,
      cashSales: 2280,
      cashRecoveredKhata: 450,
      cashPaidSuppliers: 0,
      expectedClosingCash: 4730,
      actualClosingCash: 4730,
      upiSales: 5170,
      totalKhataGiven: 1000,
      totalNetSales: 8450,
      totalProfit: 1820,
      totalBills: 60,
      topItemName: 'अमूल ताजा दूध 500ml',
      notes: 'दराज पूर्ण संतुलित'
    };

    const text = formatDailyZReportText(mockZReport, 'hi');

    assert.ok(text.includes('दुकान डेली क्लोजिंग Z-रिपोर्ट'));
    assert.ok(text.includes('श्री गणेश किराना स्टोर'));
    assert.ok(text.includes('₹8,450'));
    assert.ok(text.includes('₹1,820'));
    assert.ok(text.includes('60'));
    assert.ok(text.includes('₹2,280'));
    assert.ok(text.includes('₹5,170'));
    assert.ok(text.includes('₹4,730'));
    assert.ok(text.includes('अमूल ताजा दूध 500ml'));
  });

  it('should format English Daily Z-Report correctly', () => {
    const mockZReport: ZReportData = {
      reportNumber: 'ZR-20260919-01',
      generatedAt: '19 Sep 2026, 09:10 PM',
      shopName: 'Shree Ganesh Kirana',
      shopPhone: '+91 98765 43210',
      openingCash: 2000,
      cashSales: 2280,
      cashRecoveredKhata: 450,
      cashPaidSuppliers: 0,
      expectedClosingCash: 4730,
      actualClosingCash: 4730,
      upiSales: 5170,
      totalKhataGiven: 1000,
      totalNetSales: 8450,
      totalProfit: 1820,
      totalBills: 60,
      topItemName: 'Amul Milk 500ml'
    };

    const text = formatDailyZReportText(mockZReport, 'en');

    assert.ok(text.includes('Daily Z-Closing Report'));
    assert.ok(text.includes('Total Net Sales: ₹8,450'));
    assert.ok(text.includes('Estimated Net Profit: ₹1,820'));
    assert.ok(text.includes('Total Bills: 60'));
    assert.ok(text.includes('Cash Drawer Audit'));
  });

  it('should generate valid WhatsApp click-to-chat URL with encoded report text', () => {
    const mockZReport: ZReportData = {
      reportNumber: 'ZR-20260919-01',
      generatedAt: '19 Sep 2026',
      shopName: 'Shree Ganesh Kirana',
      shopPhone: '9876543210',
      openingCash: 2000,
      cashSales: 2280,
      cashRecoveredKhata: 0,
      cashPaidSuppliers: 0,
      expectedClosingCash: 4280,
      upiSales: 5000,
      totalKhataGiven: 0,
      totalNetSales: 7280,
      totalProfit: 1500,
      totalBills: 50,
      topItemName: 'Milk'
    };

    const url = generateDailyZReportWhatsAppUrl(mockZReport, '9876543210', 'hi');
    assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=919876543210&text='));
    assert.ok(url.includes('ZR-20260919-01'));
  });

  it('should have consistent analytics mock calculations', () => {
    assert.strictEqual(TODAY_ANALYTICS_DATA.totalSales, 8450);
    assert.strictEqual(TODAY_ANALYTICS_DATA.grossProfit, 1820);
    assert.ok(TODAY_ANALYTICS_DATA.topSellingItems.length >= 5);
    assert.ok(TODAY_ANALYTICS_DATA.categoryBreakdown.length >= 5);
  });
});