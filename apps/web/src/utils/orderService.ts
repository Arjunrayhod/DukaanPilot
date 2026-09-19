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
  createdAt: string;
  timestamp: number;
  notes?: string;
}

const STORAGE_KEY = 'dukaanpilot_online_orders';

export const INITIAL_ONLINE_ORDERS: OnlineCustomerOrder[] = [
  {
    id: 'ord_101',
    orderNumber: 'ORD-1082',
    customerName: 'रमेश कुमार (Ramesh Kumar)',
    customerPhone: '9823456789',
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
    notes: 'कृपया शाम 5 बजे से पहले भेजें'
  }
];

export function getOnlineOrders(): OnlineCustomerOrder[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to load online orders:', e);
  }
  return INITIAL_ONLINE_ORDERS;
}

export function saveOnlineOrder(order: OnlineCustomerOrder): OnlineCustomerOrder[] {
  try {
    const existing = getOnlineOrders();
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dukaanpilot_new_order', { detail: order }));
    return updated;
  } catch (e) {
    console.error('Failed to save order:', e);
    return [order];
  }
}

export function updateOrderStatus(orderId: string, status: OnlineCustomerOrder['status']): OnlineCustomerOrder[] {
  try {
    const existing = getOnlineOrders();
    const updated = existing.map((o) => (o.id === orderId ? { ...o, status } : o));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('dukaanpilot_orders_updated', { detail: updated }));
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
    notes?: string;
  },
  shopName = 'श्री गणेश किराना स्टोर (Shree Ganesh Kirana)'
): string {
  let msg = `🛒 *नया ऑनलाइन ऑर्डर #${order.orderNumber}*\n\n`;
  msg += `👤 *ग्राहक:* ${order.customerName}\n`;
  msg += `📞 *फोन:* ${order.customerPhone}\n`;
  msg += `🏪 *दुकान:* ${shopName}\n`;
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