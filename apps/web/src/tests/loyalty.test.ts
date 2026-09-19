import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  FESTIVE_COUPONS,
  INITIAL_LOYALTY_ACCOUNTS,
  calculateEarnedPoints,
  formatPromoBroadcastMessage,
  generatePromoWhatsAppUrl
} from '../utils/loyaltyService.ts';

describe('Customer Loyalty Rewards & Festive Promotions Tests', () => {
  test('should calculate earned loyalty points at 1 pt per ₹100 of bill amount', () => {
    assert.strictEqual(calculateEarnedPoints(0), 0);
    assert.strictEqual(calculateEarnedPoints(50), 0);
    assert.strictEqual(calculateEarnedPoints(99), 0);
    assert.strictEqual(calculateEarnedPoints(100), 1);
    assert.strictEqual(calculateEarnedPoints(450), 4);
    assert.strictEqual(calculateEarnedPoints(1280), 12);
    assert.strictEqual(calculateEarnedPoints(3500), 35);
  });

  test('should format clean Hindi festive promotion broadcast message with coupon details', () => {
    const coupon = FESTIVE_COUPONS[0]; // FESTIVE10
    const msg = formatPromoBroadcastMessage(coupon, {
      name: 'श्री गणेश किराना स्टोर',
      phone: '+91 98765 43210'
    }, 'hi');

    assert.ok(msg.includes('श्री गणेश किराना स्टोर'));
    assert.ok(msg.includes('FESTIVE10'));
    assert.ok(msg.includes('त्योहारी स्पेशल 10% भारी छूट'));
    assert.ok(msg.includes('31/10/2026'));
    assert.ok(msg.includes('+91 98765 43210'));
  });

  test('should format English promo broadcast message correctly', () => {
    const coupon = FESTIVE_COUPONS[1]; // KIRANA50
    const msg = formatPromoBroadcastMessage(coupon, {
      name: 'Shree Ganesh Kirana',
      phone: '9876543210'
    }, 'en');

    assert.ok(msg.includes('Shree Ganesh Kirana'));
    assert.ok(msg.includes('KIRANA50'));
    assert.ok(msg.includes('Flat ₹50 Super Savings'));
    assert.ok(msg.includes('15/10/2026'));
  });

  test('should generate valid WhatsApp click-to-chat URL with country code prefix', () => {
    const coupon = FESTIVE_COUPONS[0];
    const url = generatePromoWhatsAppUrl('9841029862', coupon);

    assert.ok(url.startsWith('https://api.whatsapp.com/send?phone=919841029862&text='));
    assert.ok(url.includes(encodeURIComponent('FESTIVE10')));
  });

  test('should have initial mock loyalty accounts and active coupons', () => {
    assert.ok(FESTIVE_COUPONS.length >= 3);
    assert.ok(Object.keys(INITIAL_LOYALTY_ACCOUNTS).length >= 3);

    const arjun = INITIAL_LOYALTY_ACCOUNTS['9841029862'];
    assert.ok(arjun);
    assert.strictEqual(arjun.customerName, 'अर्जुन राठौड़');
    assert.strictEqual(arjun.points, 120);
    assert.strictEqual(arjun.totalEarned, 150);
    assert.strictEqual(arjun.totalRedeemed, 30);
  });
});
