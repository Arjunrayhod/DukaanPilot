import { recordCompletedBill } from './salesService.ts';
import { 
  getInventoryItems, 
  saveInventoryItems, 
  decrementStockOnSale, 
  getStockLogs, 
  saveStockLogs 
} from './inventoryService.ts';
import { recordKhataDebit, recordKhataCredit } from './khataService.ts';

export interface OrderItem {
  id: string;
  name: string;
  hindiName?: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
}

export interface OnlineCustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  status: 'NEW' | 'ACCEPTED' | 'PACKED' | 'DELIVERED' | 'REJECTED';
  paymentStatus: 'COD' | 'PAID_UPI' | 'KHATA_PENDING';
  deliveryType?: 'DELIVERY' | 'PICKUP';
  deliveryAddress?: string;
  createdAt: string;
  timestamp: number;
  notes?: string;
  isBilled?: boolean;
  billId?: string;
}

const STORAGE_KEY = 'dukaanpilot_online_orders';
let inMemoryOrders: OnlineCustomerOrder[] | null = null;

export const INITIAL_ONLINE_ORDERS: OnlineCustomerOrder[] = [
  {
    id: 'ord_101',
    orderNumber: 'ORD-1082',
    customerName: 'रमेश कुमार (Ramesh Kumar)',
    customerPhone: '9823456789',
    deliveryType: 'DELIVERY',
    deliveryAddress: 'मकान नं 42, गली नं 3, मेन मार्केट',
    items: [
      {
        id: 'prod_atta_01',
        name: 'Aashirvaad Superior MP Sharbati Atta 10kg',
        hindiName: 'आशीर्वाद शरबती आटा 10kg',
        qty: 1,
        unit: 'bag',
        price: 535,
        total: 535
      },
      {
        id: 'prod_sugar_01',
        name: 'Madhur Pure & Hygienic Sugar 1kg',
        hindiName: 'मधुर चीनी 1kg',
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
    createdAt: 'आज, 08:45 AM',
    timestamp: Date.now() - 1000 * 60 * 5,
    notes: 'कृपया शाम 5 बजे से पहले भेजें',
    isBilled: false
  }
];

export function getOnlineOrders(): OnlineCustomerOrder[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } else if (inMemoryOrders !== null) {
      return inMemoryOrders;
    }
  } catch (e) {
    console.error('Failed to load online orders:', e);
  }
  return INITIAL_ONLINE_ORDERS;
}

export function saveOnlineOrder(order: OnlineCustomerOrder): OnlineCustomerOrder[] {
  try {
    const existing = getOnlineOrders();
    const isNew = !existing.some((o) => o.id === order.id);
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];

    // If order was newly placed on Khata credit, record debit in Khata ledger immediately
    if (isNew && order.paymentStatus === 'KHATA_PENDING') {
      const itemsSummary = order.items.map((i) => `${i.qty}x ${i.hindiName || i.name}`).join(', ');
      recordKhataDebit({
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        amount: order.totalAmount,
        notes: `ऑनलाइन ऑर्डर #${order.orderNumber}${itemsSummary ? ` (${itemsSummary})` : ''}`,
        billNo: `#${order.orderNumber}`
      });
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('dukaanpilot_new_order', { detail: order }));
      window.dispatchEvent(new CustomEvent('dukaanpilot_orders_updated', { detail: updated }));
    } else {
      inMemoryOrders = updated;
    }
    return updated;
  } catch (e) {
    console.error('Failed to save order:', e);
    return [order];
  }
}

export function updateOrderStatus(orderId: string, status: OnlineCustomerOrder['status']): OnlineCustomerOrder[] {
  try {
    const existing = getOnlineOrders();
    let generatedBillId: string | undefined;

    // When status is DELIVERED and not yet billed, record the bill into salesService and decrement inventory
    if (status === 'DELIVERED') {
      const target = existing.find((o) => o.id === orderId);
      if (target && !target.isBilled) {
        const inventory = getInventoryItems();
        const billedItems = target.items.map((it) => {
          const inv = inventory.find((i) => i.id === it.id || i.name === it.name || i.barcode === it.id);
          return {
            id: it.id,
            name: it.name,
            hindi: it.hindiName,
            qty: it.qty,
            unit: it.unit || 'packet',
            price: it.price,
            costPrice: inv?.costPrice ?? Math.round(it.price * 0.78),
            category: inv?.category || 'Online Order',
            categoryHindi: 'ऑनलाइन ऑर्डर'
          };
        });

        const bill = recordCompletedBill({
          invoiceNo: `ORD-${target.orderNumber.replace('ORD-', '')}`,
          customerName: target.customerName,
          customerPhone: target.customerPhone,
          items: billedItems,
          subtotal: target.totalAmount,
          gstAmount: 0,
          grandTotal: target.totalAmount,
          paymentMode: target.paymentStatus === 'PAID_UPI' ? 'upi' : target.paymentStatus === 'KHATA_PENDING' ? 'khata' : 'cash'
        });
        generatedBillId = bill.id;

        // Decrement stock in inventory
        const { updatedInventory, logs } = decrementStockOnSale(
          inventory,
          target.items.map((it) => ({
            id: it.id,
            name: it.name,
            qty: it.qty
          }))
        );
        saveInventoryItems(updatedInventory);
        const existingLogs = getStockLogs();
        saveStockLogs([...logs, ...existingLogs]);
      }
    } else if (status === 'REJECTED') {
      const target = existing.find((o) => o.id === orderId);
      if (target && target.paymentStatus === 'KHATA_PENDING') {
        recordKhataCredit({
          customerName: target.customerName,
          customerPhone: target.customerPhone,
          amount: target.totalAmount,
          notes: `रद्द ऑनलाइन ऑर्डर रिफंड #${target.orderNumber}`,
          paymentMode: 'other'
        });
      }
    }

    const updated = existing.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          isBilled: status === 'DELIVERED' ? true : o.isBilled,
          billId: generatedBillId || o.billId
        };
      }
      return o;
    });

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('dukaanpilot_orders_updated', { detail: updated }));
    } else {
      inMemoryOrders = updated;
    }
    return updated;
  } catch (e) {
    console.error('Failed to update order status:', e);
    return [];
  }
}

export function formatWhatsAppOrderText(
  order: {
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    items: OrderItem[];
    totalAmount: number;
    deliveryType?: 'DELIVERY' | 'PICKUP';
    deliveryAddress?: string;
    paymentStatus?: 'COD' | 'PAID_UPI' | 'KHATA_PENDING' | 'KHATA';
    notes?: string;
  },
  shopName = 'श्री गणेश किराना स्टोर'
): string {
  let msg = `🛒 *नया ऑनलाइन ऑर्डर #${order.orderNumber}*\n\n`;
  msg += `👤 *ग्राहक:* ${order.customerName}\n`;
  msg += `📞 *फोन:* ${order.customerPhone}\n`;
  msg += `🏪 *दुकान:* ${shopName}\n`;
  
  if (order.deliveryType === 'DELIVERY') {
    msg += `🛵 *प्रकार:* 🏠 होम डिलीवरी (Home Delivery)\n`;
    if (order.deliveryAddress) {
      msg += `📍 *पता:* ${order.deliveryAddress}\n`;
    }
  } else if (order.deliveryType === 'PICKUP') {
    msg += `🛍️ *प्रकार:* 🏬 दुकान से पिकअप (Self-Pickup)\n`;
  }

  const paymentText = 
    order.paymentStatus === 'PAID_UPI' 
      ? '📲 ऑनलाइन UPI (Online UPI / QR)' 
      : order.paymentStatus === 'KHATA' || order.paymentStatus === 'KHATA_PENDING'
      ? '📖 खाता लेजर उधार (Khata Pay Later)'
      : '💵 कैश ऑन डिलीवरी (Cash on Delivery / COD)';
  msg += `💳 *भुगतान:* ${paymentText}\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *ऑर्डर सामान सूची:*\n`;

  order.items.forEach((it, idx) => {
    const title = it.hindiName || it.name;
    msg += `${idx + 1}. *${title}*\n`;
    msg += `   └ ${it.qty} ${it.unit} x ₹${it.price} = *₹${it.total}*\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *कुल बिल राशि: ₹${order.totalAmount.toLocaleString('en-IN')}*\n`;
  if (order.notes) {
    msg += `📝 *नोट:* ${order.notes}\n`;
  }
  msg += `\n🙏 *कृपया ऑर्डर तैयार करके डिलीवरी की पुष्टि करें।*`;

  return msg;
}

export function generateShareStoreMessage(shopName = 'श्री गणेश किराना स्टोर', storeUrl = 'https://dukaanpilot.app/shop'): string {
  return `🏪 *${shopName} का ऑनलाइन स्टोर*\n\n` +
    `नमस्ते! अब आप घर बैठे हमारी दुकान से ताज़ा किराना व राशन ऑनलाइन ऑर्डर कर सकते हैं।\n\n` +
    `🛒 *ऑनलाइन ऑर्डर करने के लिए लिंक पर क्लिक करें:*\n` +
    `👉 ${storeUrl}\n\n` +
    `⚡ तेज़ होम डिलीवरी व दुकान पिकअप उपलब्ध\n` +
    `धन्यवाद! 🙏`;
}