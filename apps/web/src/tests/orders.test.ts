import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  formatWhatsAppOrderText, 
  INITIAL_ONLINE_ORDERS 
} from '../utils/orderService.ts';
import type { OnlineCustomerOrder } from '../utils/orderService.ts';

describe('Online Customer Orders & WhatsApp Integration Tests', () => {
  it('should format clean Hindi WhatsApp order message with items breakdown', () => {
    const order: OnlineCustomerOrder = {
      id: 'ord_test_01',
      orderNumber: 'ORD-9124',
      customerName: 'रमेश कुमार',
      customerPhone: '9823456789',
      items: [
        {
          id: 'prod_atta_01',
          name: 'Aashirvaad Atta 10kg',
          hindiName: 'आशीर्वाद आटा 10kg',
          qty: 1,
          unit: 'bag',
          price: 535,
          total: 535
        },
        {
          id: 'prod_sugar_01',
          name: 'Sugar 1kg',
          hindiName: 'चीनी 1kg',
          qty: 2,
          unit: 'kg',
          price: 48,
          total: 96
        }
      ],
      itemCount: 3,
      totalAmount: 631,
      status: 'NEW',
      paymentStatus: 'COD',
      createdAt: 'आज, 08:50 AM',
      timestamp: Date.now(),
      notes: 'शाम 5 बजे से पहले भेजें'
    };

    const text = formatWhatsAppOrderText(order, 'श्री गणेश किराना स्टोर');

    assert.ok(text.includes('नया ऑनलाइन ऑर्डर #ORD-9124'));
    assert.ok(text.includes('रमेश कुमार'));
    assert.ok(text.includes('9823456789'));
    assert.ok(text.includes('आशीर्वाद आटा 10kg'));
    assert.ok(text.includes('1 bag x ₹535 = *₹535*'));
    assert.ok(text.includes('चीनी 1kg'));
    assert.ok(text.includes('2 kg x ₹48 = *₹96*'));
    assert.ok(text.includes('₹631'));
    assert.ok(text.includes('शाम 5 बजे से पहले भेजें'));
  });

  it('should have initial mock online customer orders', () => {
    assert.ok(INITIAL_ONLINE_ORDERS.length > 0);
    const firstOrder = INITIAL_ONLINE_ORDERS[0];
    assert.strictEqual(firstOrder.status, 'NEW');
    assert.strictEqual(firstOrder.items.length, 2);
    assert.strictEqual(firstOrder.totalAmount, 631);
  });
});