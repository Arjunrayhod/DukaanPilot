import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  formatSupplierWhatsAppPO, 
  generateSupplierWhatsAppUrl, 
  INITIAL_SUPPLIERS, 
  INITIAL_LOW_STOCK_ITEMS 
} from '../utils/restockService.ts';

describe('Supplier Restock & WhatsApp PO Tests', () => {
  it('should format clean Hindi WhatsApp PO message with items and shop details', () => {
    const text = formatSupplierWhatsAppPO(
      {
        poNumber: 'PO-4092',
        supplierName: 'आईटीसी डायरेक्ट एजेंसी',
        contactPerson: 'राकेश शर्मा',
        items: [
          {
            name: 'Aashirvaad Superior MP Sharbati Atta 10kg',
            nameHindi: 'आशीर्वाद शरबती आटा 10kg',
            qty: 20,
            unit: 'bag',
            costPrice: 480
          }
        ],
        totalEstimatedAmount: 9600,
        deliveryDate: 'कल दोपहर 12 बजे तक',
        notes: 'कृपया ताज़ा बैच भेजें।'
      },
      {
        name: 'श्री गणेश किराना स्टोर',
        phone: '+91 98765 43210',
        address: 'दुकान नं. 4, मेन मार्केट, नई दिल्ली'
      },
      'hi'
    );

    assert.ok(text.includes('नमस्ते *राकेश शर्मा जी*'));
    assert.ok(text.includes('#PO-4092'));
    assert.ok(text.includes('आशीर्वाद शरबती आटा 10kg'));
    assert.ok(text.includes('20 bag'));
    assert.ok(text.includes('₹9,600'));
    assert.ok(text.includes('श्री गणेश किराना स्टोर'));
    assert.ok(text.includes('कल दोपहर 12 बजे तक'));
  });

  it('should format English WhatsApp PO correctly', () => {
    const text = formatSupplierWhatsAppPO(
      {
        poNumber: 'PO-8812',
        supplierName: 'Fortune & Adani Wilmar',
        contactPerson: 'Sunil Agrawal',
        items: [
          {
            name: 'Fortune Kachi Ghani Mustard Oil 1L Pouch',
            nameHindi: 'फॉर्च्यून सरसों तेल 1L',
            qty: 24,
            unit: 'pouch',
            costPrice: 142
          }
        ],
        totalEstimatedAmount: 3408,
        deliveryDate: 'Tomorrow Morning',
        notes: 'Send long expiry stock.'
      },
      {
        name: 'Shree Ganesh Kirana Store',
        phone: '+91 98765 43210',
        address: 'Shop 4, Main Market, New Delhi'
      },
      'en'
    );

    assert.ok(text.includes('Hello *Sunil Agrawal*'));
    assert.ok(text.includes('Stock Purchase Order (#PO-8812)'));
    assert.ok(text.includes('Fortune Kachi Ghani Mustard Oil 1L Pouch'));
    assert.ok(text.includes('24 pouch'));
    assert.ok(text.includes('₹3,408'));
    assert.ok(text.includes('Shree Ganesh Kirana Store'));
  });

  it('should generate valid WhatsApp click-to-chat URL with country code prefix', () => {
    const url = generateSupplierWhatsAppUrl(
      {
        poNumber: 'PO-4092',
        supplierName: 'आईटीसी डायरेक्ट एजेंसी',
        supplierPhone: '9871100223',
        contactPerson: 'राकेश शर्मा',
        items: [
          {
            name: 'आशीर्वाद शरबती आटा 10kg',
            qty: 20,
            unit: 'bag'
          }
        ]
      },
      {
        name: 'श्री गणेश किराना स्टोर',
        phone: '+91 98765 43210',
        address: 'दुकान नं. 4, मेन मार्केट'
      },
      'hi'
    );

    assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=919871100223&text='));
    assert.ok(url.includes('PO-4092'));
  });

  it('should contain verified Indian FMCG suppliers with categories and brands', () => {
    assert.ok(INITIAL_SUPPLIERS.length >= 5);
    const itc = INITIAL_SUPPLIERS.find((s) => s.id === 'sup_itc');
    assert.ok(itc);
    assert.ok(itc?.brands.includes('Aashirvaad'));
    assert.ok(itc?.phone === '9871100223');
  });

  it('should have initial low stock items with thresholds and suggested quantities', () => {
    assert.ok(INITIAL_LOW_STOCK_ITEMS.length >= 5);
    const atta = INITIAL_LOW_STOCK_ITEMS[0];
    assert.ok(atta.currentStock < atta.minThreshold);
    assert.ok(atta.suggestedOrderQty > 0);
  });
});