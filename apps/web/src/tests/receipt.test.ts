import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatWhatsAppInvoice, generateWhatsAppLink } from '../utils/receiptGenerator.ts';
import type { ReceiptData } from '../utils/receiptGenerator.ts';

const mockReceipt: ReceiptData = {
  invoiceNo: '2048',
  date: '19/09/2026',
  time: '08:30 AM',
  shopName: 'Shree Ganesh Kirana Store',
  shopAddress: 'Main Market, Delhi',
  shopPhone: '+91 98765 43210',
  shopGst: '07AAAAA0000A1Z5',
  shopUpiId: 'shreeganesh@sbi',
  customerName: 'Ramesh Kumar',
  customerPhone: '9823456789',
  items: [
    { id: '1', name: 'Amul Taaza Milk 500ml', hindi: 'अमूल ताजा दूध 500ml', qty: 2, price: 27, unit: 'packet' },
    { id: '2', name: 'Madhur Pure Sugar 1kg', hindi: 'मधुर चीनी 1kg', qty: 1, price: 48, unit: 'kg' },
  ],
  subtotal: 102,
  gstAmount: 5,
  roundOff: 0,
  grandTotal: 107,
  paymentMode: 'upi'
};

describe('Thermal Receipt & WhatsApp Generator Tests', () => {
  it('should format clean Hindi WhatsApp message', () => {
    const text = formatWhatsAppInvoice(mockReceipt, 'hi');
    assert.ok(text.includes('Shree Ganesh Kirana Store'));
    assert.ok(text.includes('#2048'));
    assert.ok(text.includes('अमूल ताजा दूध 500ml'));
    assert.ok(text.includes('₹107'));
    assert.ok(text.includes('upi://pay?pa=shreeganesh%40sbi'));
  });

  it('should format split payment breakdown when tender is split', () => {
    const splitReceipt: ReceiptData = {
      ...mockReceipt,
      paymentMode: 'split',
      splitBreakdown: {
        cash: 50,
        upi: 57,
        khata: 0
      }
    };
    const text = formatWhatsAppInvoice(splitReceipt, 'hi');
    assert.ok(text.includes('स्प्लिट'));
    assert.ok(text.includes('नकद: ₹50'));
    assert.ok(text.includes('UPI: ₹57'));
  });

  it('should generate valid WhatsApp click-to-chat URL with country code', () => {
    const text = formatWhatsAppInvoice(mockReceipt, 'hi');
    const url = generateWhatsAppLink('9823456789', text);
    assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=919823456789&text='));
    assert.ok(url.includes('Shree%20Ganesh%20Kirana'));
  });
});
