import { describe, it } from 'node:test';
import assert from 'node:assert';
import { formatKhataReminderMessage, generateKhataWhatsAppUrl, INITIAL_KHATA_CUSTOMERS } from '../utils/khataService.ts';

describe('Khata Ledger & WhatsApp Reminder Tests', () => {
  it('should format polite Hindi WhatsApp reminder with UPI paylink', () => {
    const text = formatKhataReminderMessage(
      {
        phone: '9876543210',
        name: 'रमेश कुमार',
        currentDue: 1450,
        lastDebitDate: '12/09/2026',
        overdueDays: 7
      },
      {
        name: 'श्री गणेश किराना स्टोर',
        phone: '+91 98765 43210',
        upiId: 'shreeganesh@sbi'
      },
      'hi'
    );

    assert.ok(text.includes('श्री गणेश किराना स्टोर'));
    assert.ok(text.includes('रमेश कुमार'));
    assert.ok(text.includes('₹1,450'));
    assert.ok(text.includes('upi://pay?pa=shreeganesh%40sbi'));
    assert.ok(text.includes('am=1450'));
  });

  it('should format English reminder correctly', () => {
    const text = formatKhataReminderMessage(
      {
        phone: '9876543210',
        name: 'Sunita Verma',
        currentDue: 820,
        lastDebitDate: '19/09/2026',
        overdueDays: 0
      },
      {
        name: 'Shree Ganesh Kirana',
        phone: '+91 98765 43210',
        upiId: 'shreeganesh@sbi'
      },
      'en'
    );

    assert.ok(text.includes('Dear *Sunita Verma*'));
    assert.ok(text.includes('₹820'));
    assert.ok(text.includes('Shree Ganesh Kirana'));
    assert.ok(text.includes('PhonePe / GPay / Paytm'));
  });

  it('should generate valid WhatsApp click-to-chat URL with encoded payload', () => {
    const url = generateKhataWhatsAppUrl(
      {
        phone: '9876543210',
        name: 'रमेश कुमार',
        currentDue: 1450
      },
      {
        name: 'श्री गणेश किराना स्टोर',
        phone: '+91 98765 43210',
        upiId: 'shreeganesh@sbi'
      },
      'hi'
    );

    assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=919876543210&text='));
    assert.ok(url.includes('upi%3A%2F%2Fpay%3Fpa%3Dshreeganesh'));
  });

  it('should have initial mock customers with transaction histories', () => {
    assert.ok(INITIAL_KHATA_CUSTOMERS.length >= 3);
    const ramesh = INITIAL_KHATA_CUSTOMERS[0];
    assert.strictEqual(ramesh.currentDue, 1450);
    assert.ok(ramesh.transactions.length > 0);
  });
});
