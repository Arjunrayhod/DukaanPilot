import { describe, it } from 'node:test';
import assert from 'node:assert';
import { getSoundboxMessage, DEFAULT_SOUNDBOX_SETTINGS } from '../utils/soundboxService.ts';

describe('Smart Soundbox Audio Alert Engine Tests', () => {
  it('should format clean Hindi soundbox payment announcements', () => {
    const upiMsg = getSoundboxMessage(250, 'upi', 'hi');
    assert.strictEqual(upiMsg, 'दुकानपायलट पर ₹250 UPI प्राप्त हुए!');

    const cashMsg = getSoundboxMessage(500, 'cash', 'hi');
    assert.strictEqual(cashMsg, 'दुकानपायलट पर ₹500 नकद प्राप्त हुए!');

    const khataMsg = getSoundboxMessage(120, 'khata', 'hi');
    assert.strictEqual(khataMsg, '₹120 खाता उधार में दर्ज किए गए!');
  });

  it('should format English soundbox announcements accurately', () => {
    const upiMsg = getSoundboxMessage(350, 'upi', 'en');
    assert.strictEqual(upiMsg, 'Received ₹350 on DukaanPilot via UPI!');

    const cashMsg = getSoundboxMessage(100, 'cash', 'en');
    assert.strictEqual(cashMsg, 'Received ₹100 cash on DukaanPilot!');
  });

  it('should format Gujarati soundbox announcements', () => {
    const upiMsg = getSoundboxMessage(450, 'upi', 'gu');
    assert.strictEqual(upiMsg, 'દુકાનપાયલટ પર ₹450 UPI મળ્યા!');
  });

  it('should format Marathi soundbox announcements', () => {
    const upiMsg = getSoundboxMessage(600, 'upi', 'mr');
    assert.strictEqual(upiMsg, 'दुकानपायलट वर ₹600 UPI मिळाले!');
  });

  it('should have enabled soundbox by default with full volume', () => {
    assert.strictEqual(DEFAULT_SOUNDBOX_SETTINGS.enabled, true);
    assert.strictEqual(DEFAULT_SOUNDBOX_SETTINGS.volume, 1.0);
    assert.strictEqual(DEFAULT_SOUNDBOX_SETTINGS.playChime, true);
  });
});
