/**
 * DukaanPilot - Cashier Shifts & Cash Drawer Float Reconciliation Service
 * Manages counter opening cash float, active shift sales, mid-day cash drops,
 * denominations counting, and shift-end handover audits.
 */

export interface CashDropRecord {
  id: string;
  time: string;
  amount: number;
  reason: string;
  type: 'EXPENSE' | 'SAFE_DROP';
}

export interface CashierShift {
  id: string;
  counterNumber: string;
  cashierName: string;
  cashierPin?: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: 'OPEN' | 'CLOSED';
  openingFloat: number; // Cash in drawer at start (e.g. ₹2,000 for change)
  cashSales: number;
  upiSales: number;
  khataSales: number;
  totalSales: number;
  totalBills: number;
  cashDrops: CashDropRecord[];
  totalCashDrops: number;
  expectedCash: number; // openingFloat + cashSales - totalCashDrops
  actualCashCounted?: number;
  denominations?: Record<number, number>;
  variance?: number; // actual - expected (positive = surplus/excess, negative = shortage)
  closingNotes?: string;
}

const STORAGE_ACTIVE_SHIFT_KEY = 'dukaanpilot_active_shift';
const STORAGE_SHIFT_HISTORY_KEY = 'dukaanpilot_shift_history';
export const SHIFT_UPDATED_EVENT = 'dukaanpilot_shift_updated';

let inMemoryActiveShift: CashierShift | null = null;
let inMemoryHistory: CashierShift[] | null = null;

export const INITIAL_MOCK_SHIFTS: CashierShift[] = [
  {
    id: 'shift_20260918_01',
    counterNumber: 'Counter #1 (मेन काउंटर)',
    cashierName: 'राजेश शर्मा (Rajesh Sharma)',
    cashierPin: '1234',
    date: '18/09/2026',
    startTime: '08:00 AM',
    endTime: '02:30 PM',
    status: 'CLOSED',
    openingFloat: 2000,
    cashSales: 12450,
    upiSales: 8900,
    khataSales: 2150,
    totalSales: 23500,
    totalBills: 48,
    cashDrops: [
      {
        id: 'drop_1',
        time: '11:30 AM',
        amount: 500,
        reason: 'दूध व ब्रेड सप्लायर को नकद भुगतान',
        type: 'EXPENSE'
      },
      {
        id: 'drop_2',
        time: '01:15 PM',
        amount: 5000,
        reason: 'गल्ले से सेफ लॉकर में जमा (Safe Drop)',
        type: 'SAFE_DROP'
      }
    ],
    totalCashDrops: 5500,
    expectedCash: 8950,
    actualCashCounted: 8950,
    denominations: { 500: 14, 200: 6, 100: 6, 50: 2, 20: 2, 10: 1 },
    variance: 0,
    closingNotes: 'शिफ्ट का गल्ला एकदम सही मिला।'
  }
];

export function getActiveShift(): CashierShift | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return inMemoryActiveShift;
  }
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_SHIFT_KEY);
    return raw ? JSON.parse(raw) : inMemoryActiveShift;
  } catch {
    return inMemoryActiveShift;
  }
}

export function saveActiveShift(shift: CashierShift | null): void {
  inMemoryActiveShift = shift;
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    if (shift) {
      localStorage.setItem(STORAGE_ACTIVE_SHIFT_KEY, JSON.stringify(shift));
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_SHIFT_KEY);
    }
    window.dispatchEvent(new CustomEvent(SHIFT_UPDATED_EVENT));
  } catch (e) {
    console.error('Failed to save active shift:', e);
  }
}

export function getShiftHistory(): CashierShift[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return inMemoryHistory || INITIAL_MOCK_SHIFTS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_SHIFT_HISTORY_KEY);
    return raw ? JSON.parse(raw) : inMemoryHistory || INITIAL_MOCK_SHIFTS;
  } catch {
    return inMemoryHistory || INITIAL_MOCK_SHIFTS;
  }
}

export function saveShiftHistory(history: CashierShift[]): void {
  inMemoryHistory = history;
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_SHIFT_HISTORY_KEY, JSON.stringify(history));
    window.dispatchEvent(new CustomEvent(SHIFT_UPDATED_EVENT));
  } catch (e) {
    console.error('Failed to save shift history:', e);
  }
}

/**
 * Start a new counter shift with an opening cash float
 */
export function startShift(params: {
  cashierName: string;
  counterNumber?: string;
  openingFloat: number;
  cashierPin?: string;
}): CashierShift {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN');
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const newShift: CashierShift = {
    id: `shift_${Date.now()}`,
    counterNumber: params.counterNumber || 'Counter #1 (मुख्य काउंटर)',
    cashierName: params.cashierName || 'कैशियर 1',
    cashierPin: params.cashierPin,
    date: dateStr,
    startTime: timeStr,
    status: 'OPEN',
    openingFloat: Math.max(0, params.openingFloat || 0),
    cashSales: 0,
    upiSales: 0,
    khataSales: 0,
    totalSales: 0,
    totalBills: 0,
    cashDrops: [],
    totalCashDrops: 0,
    expectedCash: Math.max(0, params.openingFloat || 0),
  };

  saveActiveShift(newShift);
  return newShift;
}

/**
 * Record a sale into the currently active shift
 */
export function recordSaleInActiveShift(sale: {
  grandTotal: number;
  paymentMode: string;
  splitBreakdown?: { cash: number; upi: number; khata: number };
}): CashierShift | null {
  const active = getActiveShift();
  if (!active || active.status !== 'OPEN') return null;

  let cashAdd = 0;
  let upiAdd = 0;
  let khataAdd = 0;

  if (sale.paymentMode === 'cash') {
    cashAdd = sale.grandTotal;
  } else if (sale.paymentMode === 'upi') {
    upiAdd = sale.grandTotal;
  } else if (sale.paymentMode === 'khata') {
    khataAdd = sale.grandTotal;
  } else if (sale.paymentMode === 'split' && sale.splitBreakdown) {
    cashAdd = sale.splitBreakdown.cash || 0;
    upiAdd = sale.splitBreakdown.upi || 0;
    khataAdd = sale.splitBreakdown.khata || 0;
  }

  const updated: CashierShift = {
    ...active,
    cashSales: active.cashSales + cashAdd,
    upiSales: active.upiSales + upiAdd,
    khataSales: active.khataSales + khataAdd,
    totalSales: active.totalSales + sale.grandTotal,
    totalBills: active.totalBills + 1,
    expectedCash: active.openingFloat + (active.cashSales + cashAdd) - active.totalCashDrops
  };

  saveActiveShift(updated);
  return updated;
}

/**
 * Record a mid-shift cash drop or petty expense from drawer
 */
export function recordCashDrop(params: {
  amount: number;
  reason: string;
  type: 'EXPENSE' | 'SAFE_DROP';
}): CashierShift | null {
  const active = getActiveShift();
  if (!active || active.status !== 'OPEN') return null;

  const drop: CashDropRecord = {
    id: `drop_${Date.now()}`,
    time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    amount: Math.max(0, params.amount),
    reason: params.reason || (params.type === 'SAFE_DROP' ? 'सेफ लॉकर ट्रांसफर' : 'दुकान खर्च'),
    type: params.type
  };

  const newDrops = [...active.cashDrops, drop];
  const newTotalDrops = newDrops.reduce((sum, d) => sum + d.amount, 0);

  const updated: CashierShift = {
    ...active,
    cashDrops: newDrops,
    totalCashDrops: newTotalDrops,
    expectedCash: active.openingFloat + active.cashSales - newTotalDrops
  };

  saveActiveShift(updated);
  return updated;
}

/**
 * Close and reconcile active shift with physical denominations
 */
export function closeShift(params: {
  actualCash: number;
  denominations?: Record<number, number>;
  closingNotes?: string;
}): CashierShift | null {
  const active = getActiveShift();
  if (!active || active.status !== 'OPEN') return null;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const variance = params.actualCash - active.expectedCash;

  const closedShift: CashierShift = {
    ...active,
    endTime: timeStr,
    status: 'CLOSED',
    actualCashCounted: params.actualCash,
    denominations: params.denominations,
    variance,
    closingNotes: params.closingNotes || ''
  };

  saveActiveShift(null); // No longer active

  const history = getShiftHistory();
  saveShiftHistory([closedShift, ...history]);

  return closedShift;
}

/**
 * Format clean WhatsApp Shift Handover Report
 */
export function formatWhatsAppShiftHandover(
  shift: CashierShift,
  shopName = 'श्री गणेश किराना स्टोर',
  lang: 'hi' | 'en' = 'hi'
): string {
  const isHi = lang === 'hi';
  const varianceText =
    (shift.variance || 0) === 0
      ? '✓ 0 (बिल्कुल सही मिलान)'
      : (shift.variance || 0) > 0
      ? `+ ₹${shift.variance} (अधिशेष / Excess)`
      : `- ₹${Math.abs(shift.variance || 0)} (कमी / Shortage)`;

  if (isHi) {
    return (
      `🏪 *${shopName} - कैशियर शिफ्ट हैंडओवर रिपोर्ट*\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 *कैशियर:* ${shift.cashierName}\n` +
      `🖥️ *काउंटर:* ${shift.counterNumber}\n` +
      `📅 *दिनांक:* ${shift.date} (${shift.startTime} - ${shift.endTime || 'वर्तमान'})\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `💵 *शुरुआती कैश (Opening Float):* ₹${shift.openingFloat.toLocaleString('en-IN')}\n` +
      `🛒 *नकद बिक्री (Cash Sales):* ₹${shift.cashSales.toLocaleString('en-IN')}\n` +
      `📱 *UPI बिक्री:* ₹${shift.upiSales.toLocaleString('en-IN')}\n` +
      `📖 *खाता उधार बिक्री:* ₹${shift.khataSales.toLocaleString('en-IN')}\n` +
      `🧾 *कुल बिल:* ${shift.totalBills} | *कुल टर्नओवर:* ₹${shift.totalSales.toLocaleString('en-IN')}\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🔻 *गल्ले से नकद निकासी / खर्च (${shift.cashDrops.length}):* ₹${shift.totalCashDrops.toLocaleString('en-IN')}\n` +
      `💰 *गल्ले में अपेक्षित कैश (Expected):* ₹${shift.expectedCash.toLocaleString('en-IN')}\n` +
      `💵 *गिना गया वास्तविक कैश (Actual):* ₹${(shift.actualCashCounted ?? shift.expectedCash).toLocaleString('en-IN')}\n` +
      `⚖️ *अंतर (Variance):* ${varianceText}\n` +
      (shift.closingNotes ? `📝 *टिप्पणी:* ${shift.closingNotes}\n` : '') +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `_DukaanPilot POS द्वारा ऑटोमैटिक जनरेटेड_`
    );
  }

  return (
    `🏪 *${shopName} - Cashier Shift Handover Report*\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `👤 *Cashier:* ${shift.cashierName}\n` +
    `🖥️ *Counter:* ${shift.counterNumber}\n` +
    `📅 *Date:* ${shift.date} (${shift.startTime} - ${shift.endTime || 'Active'})\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `💵 *Opening Float:* ₹${shift.openingFloat.toLocaleString('en-IN')}\n` +
    `🛒 *Cash Sales:* ₹${shift.cashSales.toLocaleString('en-IN')}\n` +
    `📱 *UPI Sales:* ₹${shift.upiSales.toLocaleString('en-IN')}\n` +
    `📖 *Khata Sales:* ₹${shift.khataSales.toLocaleString('en-IN')}\n` +
    `🧾 *Total Bills:* ${shift.totalBills} | *Turnover:* ₹${shift.totalSales.toLocaleString('en-IN')}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `🔻 *Cash Drops/Expenses (${shift.cashDrops.length}):* ₹${shift.totalCashDrops.toLocaleString('en-IN')}\n` +
    `💰 *Expected Drawer Cash:* ₹${shift.expectedCash.toLocaleString('en-IN')}\n` +
    `💵 *Actual Cash Counted:* ₹${(shift.actualCashCounted ?? shift.expectedCash).toLocaleString('en-IN')}\n` +
    `⚖️ *Variance:* ${varianceText}\n` +
    `━━━━━━━━━━━━━━━━━━━━\n` +
    `_Generated by DukaanPilot Retail Engine_`
  );
}
