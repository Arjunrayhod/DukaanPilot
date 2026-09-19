import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  formatKhataReminderMessage,
  generateKhataWhatsAppUrl,
  INITIAL_KHATA_CUSTOMERS,
  parseVoiceKhataCommand
} from '../utils/khataService.ts';
import type { KhataCustomer } from '../utils/khataService.ts';

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
    assert.ok(INITIAL_KHATA_CUSTOMERS.length >= 4);
    const ramesh = INITIAL_KHATA_CUSTOMERS.find(c => c.name.includes('रमेश'))!;
    assert.ok(ramesh);
    assert.strictEqual(ramesh.currentDue, 1450);
    assert.ok(ramesh.transactions.length > 0);
  });

  it('should smartly match customer and transaction type from Hindi sentences', () => {
    const customCustomer: KhataCustomer = {
      id: 'cust_arjun',
      name: 'अर्जुन राठौड़',
      phone: '9841029862',
      currentDue: 0,
      creditLimit: 5000,
      overdueDays: 0,
      transactions: []
    };
    const list = [customCustomer, ...INITIAL_KHATA_CUSTOMERS];

    // Case 1: Payment sentence with name
    const res1 = parseVoiceKhataCommand('अर्जुन राठौड़ ने 500 रुपए जमा करवाए', list);
    assert.strictEqual(res1.type, 'CREDIT');
    assert.strictEqual(res1.amount, 500);
    assert.strictEqual(res1.matchedCustomer?.id, 'cust_arjun');

    // Case 2: Credit purchase sentence with item name
    const res2 = parseVoiceKhataCommand('अर्जुन राठौड़ ने 50 रुपए का धनिया लिया', list);
    assert.strictEqual(res2.type, 'DEBIT');
    assert.strictEqual(res2.amount, 50);
    assert.strictEqual(res2.matchedCustomer?.id, 'cust_arjun');
    assert.strictEqual(res2.notes, 'धनिया');

    // Case 3: Match Ramesh Kumar with "रमेश 500 उधार"
    const res3 = parseVoiceKhataCommand('रमेश कुमार 500 रुपये उधार लिखो', list);
    assert.strictEqual(res3.type, 'DEBIT');
    assert.strictEqual(res3.amount, 500);
    assert.strictEqual(res3.matchedCustomer?.name.includes('रमेश'), true);

    // Case 4: Extract clean name when customer does not exist
    const res4 = parseVoiceKhataCommand('राहुल शर्मा ने 300 रुपये उधार लिए', list);
    assert.strictEqual(res4.type, 'DEBIT');
    assert.strictEqual(res4.amount, 300);
    assert.strictEqual(res4.matchedCustomer, undefined);
    assert.strictEqual(res4.extractedNewCustomerName, 'राहुल शर्मा');

    // Case 5: Speech variations like "अर्जुन आईएस करवाए" or "अर्जुन राठौड़ आता"
    const res5 = parseVoiceKhataCommand('अर्जुन आईएस करवाएं 1000', INITIAL_KHATA_CUSTOMERS);
    assert.strictEqual(res5.matchedCustomer?.name.includes('अर्जुन'), true);
    assert.strictEqual(res5.type, 'CREDIT');
    assert.strictEqual(res5.amount, 1000);

    const res6 = parseVoiceKhataCommand('अर्जुन राठौड़ आता 500', INITIAL_KHATA_CUSTOMERS);
    assert.strictEqual(res6.matchedCustomer?.name.includes('अर्जुन'), true);
    assert.strictEqual(res6.amount, 500);
    assert.strictEqual(res6.notes, 'आटा');
  });
});
