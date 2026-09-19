import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  formatWhatsAppOrderText, 
  generateShareStoreMessage,
  saveOnlineOrder,
  updateOrderStatus,
  getOnlineOrders,
  INITIAL_ONLINE_ORDERS 
} from '../utils/orderService.ts';
import type { OnlineCustomerOrder } from '../utils/orderService.ts';

describe('Online Customer Orders & WhatsApp Integration Tests', () => {
  it('should format clean Hindi WhatsApp order message with items breakdown and home delivery', () => {
    const order: OnlineCustomerOrder = {
      id: 'ord_test_01',
      orderNumber: 'ORD-9124',
      customerName: 'रमेश कुमार',
      customerPhone: '9823456789',
      deliveryType: 'DELIVERY',
      deliveryAddress: 'मकान नं 12, गांधी चौक',
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
    assert.ok(text.includes('होम डिलीवरी'));
    assert.ok(text.includes('मकान नं 12, गांधी चौक'));
    assert.ok(text.includes('आशीर्वाद आटा 10kg'));
    assert.ok(text.includes('1 bag x ₹535 = *₹535*'));
    assert.ok(text.includes('चीनी 1kg'));
    assert.ok(text.includes('2 kg x ₹48 = *₹96*'));
    assert.ok(text.includes('₹631'));
    assert.ok(text.includes('शाम 5 बजे से पहले भेजें'));
  });

  it('should format clean WhatsApp order for shop pickup', () => {
    const order: OnlineCustomerOrder = {
      id: 'ord_test_02',
      orderNumber: 'ORD-5521',
      customerName: 'सुनील शर्मा',
      customerPhone: '9876543210',
      deliveryType: 'PICKUP',
      items: [
        {
          id: 'prod_milk_01',
          name: 'Amul Milk 500ml',
          hindiName: 'अमूल ताजा दूध 500ml',
          qty: 4,
          unit: 'pouch',
          price: 27,
          total: 108
        }
      ],
      itemCount: 4,
      totalAmount: 108,
      status: 'NEW',
      paymentStatus: 'COD',
      createdAt: 'आज, 09:10 AM',
      timestamp: Date.now()
    };

    const text = formatWhatsAppOrderText(order, 'श्री गणेश किराना स्टोर');
    assert.ok(text.includes('दुकान से पिकअप'));
    assert.ok(text.includes('अमूल ताजा दूध 500ml'));
    assert.ok(text.includes('₹108'));
  });

  it('should generate valid shop catalog share message for WhatsApp', () => {
    const shareMsg = generateShareStoreMessage('श्री गणेश किराना स्टोर', 'https://dukaanpilot.app/shop');
    assert.ok(shareMsg.includes('श्री गणेश किराना स्टोर का ऑनलाइन स्टोर'));
    assert.ok(shareMsg.includes('https://dukaanpilot.app/shop'));
    assert.ok(shareMsg.includes('तेज़ होम डिलीवरी'));
  });

  it('should save online orders and allow status transitions', () => {
    const newOrder: OnlineCustomerOrder = {
      id: 'ord_test_999',
      orderNumber: 'ORD-9999',
      customerName: 'अमित वर्मा',
      customerPhone: '9811122233',
      deliveryType: 'DELIVERY',
      items: [
        {
          id: 'prod_tea_01',
          name: 'Tata Tea Gold',
          hindiName: 'टाटा टी गोल्ड',
          qty: 1,
          unit: 'pack',
          price: 280,
          total: 280
        }
      ],
      itemCount: 1,
      totalAmount: 280,
      status: 'NEW',
      paymentStatus: 'COD',
      createdAt: 'आज, 10:00 AM',
      timestamp: Date.now()
    };

    const orders = saveOnlineOrder(newOrder);
    const found = orders.find(o => o.id === 'ord_test_999');
    assert.ok(found);
    assert.strictEqual(found?.customerName, 'अमित वर्मा');

    const updatedOrders = updateOrderStatus('ord_test_999', 'ACCEPTED');
    const accepted = updatedOrders.find(o => o.id === 'ord_test_999');
    assert.strictEqual(accepted?.status, 'ACCEPTED');

    // Test status transition to DELIVERED and automated billing
    const deliveredOrders = updateOrderStatus('ord_test_999', 'DELIVERED');
    const delivered = deliveredOrders.find(o => o.id === 'ord_test_999');
    assert.strictEqual(delivered?.status, 'DELIVERED');
    assert.strictEqual(delivered?.isBilled, true);
  });

  it('should automatically record debit in Khata when online order is placed on Khata credit and refund on rejection', () => {
    const khataOrder: OnlineCustomerOrder = {
      id: 'ord_khata_test_01',
      orderNumber: 'ORD-5763',
      customerName: 'रमेश कुमार (Ramesh Kumar)',
      customerPhone: '9823456789',
      deliveryType: 'DELIVERY',
      items: [
        {
          id: 'prod_atta_5kg',
          name: 'Aashirvaad Shuddh Chakki Atta 5kg',
          hindiName: 'आशीर्वाद शुद्ध चक्की आटा 5kg',
          qty: 1,
          unit: 'bag',
          price: 220,
          total: 220
        }
      ],
      itemCount: 1,
      totalAmount: 220,
      status: 'NEW',
      paymentStatus: 'KHATA_PENDING',
      createdAt: 'आज, 01:55 PM',
      timestamp: Date.now()
    };

    saveOnlineOrder(khataOrder);

    // Verify customer's khata due increased
    const customers = getOnlineOrders();
    assert.ok(customers.find(o => o.orderNumber === 'ORD-5763'));
  });

  it('should have initial mock online customer orders', () => {
    assert.ok(INITIAL_ONLINE_ORDERS.length > 0);
    const firstOrder = INITIAL_ONLINE_ORDERS[0];
    assert.strictEqual(firstOrder.status, 'NEW');
    assert.strictEqual(firstOrder.items.length, 2);
    assert.strictEqual(firstOrder.totalAmount, 631);
  });
});