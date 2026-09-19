/**
 * DukaanPilot - Realtime Sales, Profit & Analytics Service
 * Dynamically tracks sales, item profits, payment modes, and daily trends.
 */

import { useState, useEffect, useCallback } from 'react';
import type { DailySalesSummary } from './zReportService.ts';

export interface SoldItem {
  id: string | number;
  name: string;
  hindi?: string;
  qty: number;
  unit: string;
  price: number; // selling price per unit
  costPrice?: number; // wholesale cost per unit
  category?: string;
  categoryHindi?: string;
}

export interface CompletedBill {
  id: string;
  invoiceNo: string;
  timestamp: string; // ISO string
  timeFormatted: string; // e.g. "10:15 AM"
  dateFormatted: string; // e.g. "19 Sep 2026"
  customerName?: string;
  customerPhone?: string;
  items: SoldItem[];
  subtotal: number;
  gstAmount: number;
  discount: number;
  grandTotal: number;
  paymentMode: 'cash' | 'upi' | 'khata' | 'split';
  splitBreakdown?: {
    cash: number;
    upi: number;
    khata: number;
  };
  totalCost: number;
  grossProfit: number;
  cashCollected: number;
  upiCollected: number;
  khataGiven: number;
}

const STORAGE_BILLS_KEY = 'dukaanpilot_today_bills';
const STORAGE_DATE_KEY = 'dukaanpilot_today_date';
export const SALES_UPDATED_EVENT = 'dukaanpilot_sales_updated';

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

/**
 * Get stored bills for today. If date has rolled over, resets for the new day.
 */
export function getStoredTodayBills(): CompletedBill[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const today = getTodayDateString();
    const savedDate = localStorage.getItem(STORAGE_DATE_KEY);

    if (savedDate !== today) {
      // New day detected - auto reset today's active register
      localStorage.setItem(STORAGE_DATE_KEY, today);
      localStorage.setItem(STORAGE_BILLS_KEY, JSON.stringify([]));
      return [];
    }

    const data = localStorage.getItem(STORAGE_BILLS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Failed to load today bills from storage', err);
    return [];
  }
}

/**
 * Persist today's bills to storage.
 */
export function saveTodayBills(bills: CompletedBill[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const today = getTodayDateString();
    localStorage.setItem(STORAGE_DATE_KEY, today);
    localStorage.setItem(STORAGE_BILLS_KEY, JSON.stringify(bills));
    window.dispatchEvent(new CustomEvent(SALES_UPDATED_EVENT));
  } catch (err) {
    console.error('Failed to save today bills', err);
  }
}

/**
 * Reset today's register to 0.
 */
export function resetTodaySales(): void {
  saveTodayBills([]);
}

/**
 * Calculate full sales, profit, margins, top items, and categories summary from bills.
 */
export function calculateSalesSummary(bills: CompletedBill[], dateLabel?: string): DailySalesSummary {
  const currentDateLabel = dateLabel || new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  if (!bills || bills.length === 0) {
    return {
      date: currentDateLabel,
      totalSales: 0,
      totalCost: 0,
      grossProfit: 0,
      profitMarginPercent: 0,
      totalBills: 0,
      avgBillValue: 0,
      cashCollected: 0,
      upiCollected: 0,
      khataGiven: 0,
      khataRecovered: 0,
      topSellingItems: [],
      categoryBreakdown: [],
      hourlyTrend: []
    };
  }

  let totalSales = 0;
  let totalCost = 0;
  let grossProfit = 0;
  let cashCollected = 0;
  let upiCollected = 0;
  let khataGiven = 0;

  const itemMap = new Map<string, {
    name: string;
    hindiName?: string;
    qtySold: number;
    unit: string;
    revenue: number;
    profit: number;
  }>();

  const categoryMap = new Map<string, {
    category: string;
    categoryHindi?: string;
    sales: number;
  }>();

  const hourlyMap = new Map<string, {
    hour: string;
    sales: number;
    bills: number;
  }>();

  for (const bill of bills) {
    totalSales += bill.grandTotal;
    totalCost += bill.totalCost;
    grossProfit += bill.grossProfit;
    cashCollected += bill.cashCollected;
    upiCollected += bill.upiCollected;
    khataGiven += bill.khataGiven;

    // Items aggregation
    for (const item of bill.items) {
      const key = item.name;
      const itemCost = item.costPrice !== undefined ? item.costPrice : Math.round(item.price * 0.78);
      const itemRev = item.price * item.qty;
      const itemProf = (item.price - itemCost) * item.qty;

      const existing = itemMap.get(key);
      if (existing) {
        existing.qtySold += item.qty;
        existing.revenue += itemRev;
        existing.profit += itemProf;
      } else {
        itemMap.set(key, {
          name: item.name,
          hindiName: item.hindi || item.name,
          qtySold: item.qty,
          unit: item.unit || 'piece',
          revenue: itemRev,
          profit: itemProf
        });
      }

      // Category breakdown
      const cat = item.category || 'General Kirana';
      const catHindi = item.categoryHindi || 'सामान्य किराना';
      const catExisting = categoryMap.get(cat);
      if (catExisting) {
        catExisting.sales += itemRev;
      } else {
        categoryMap.set(cat, {
          category: cat,
          categoryHindi: catHindi,
          sales: itemRev
        });
      }
    }

    // Hourly aggregation
    const hourLabel = bill.timeFormatted.split(':')[0] + ':00 ' + (bill.timeFormatted.includes('PM') ? 'PM' : 'AM');
    const hourExisting = hourlyMap.get(hourLabel);
    if (hourExisting) {
      hourExisting.sales += bill.grandTotal;
      hourExisting.bills += 1;
    } else {
      hourlyMap.set(hourLabel, {
        hour: hourLabel,
        sales: bill.grandTotal,
        bills: 1
      });
    }
  }

  const profitMarginPercent = totalSales > 0 ? Number(((grossProfit / totalSales) * 100).toFixed(1)) : 0;
  const avgBillValue = totalSales > 0 ? Number((totalSales / bills.length).toFixed(1)) : 0;

  const topSellingItems = Array.from(itemMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 10);

  const categoryBreakdown = Array.from(categoryMap.values())
    .map((cat) => ({
      ...cat,
      percentage: totalSales > 0 ? Number(((cat.sales / totalSales) * 100).toFixed(1)) : 0
    }))
    .sort((a, b) => b.sales - a.sales);

  const hourlyTrend = Array.from(hourlyMap.values());

  return {
    date: currentDateLabel,
    totalSales,
    totalCost,
    grossProfit,
    profitMarginPercent,
    totalBills: bills.length,
    avgBillValue,
    cashCollected,
    upiCollected,
    khataGiven,
    khataRecovered: 0,
    topSellingItems,
    categoryBreakdown,
    hourlyTrend
  };
}

/**
 * Get the live sales summary for today.
 */
export function getTodaySalesSummary(): DailySalesSummary {
  const bills = getStoredTodayBills();
  return calculateSalesSummary(bills);
}

/**
 * Record a new completed bill into today's register.
 */
export function recordCompletedBill(params: {
  invoiceNo: string;
  customerName?: string;
  customerPhone?: string;
  items: SoldItem[];
  subtotal: number;
  gstAmount: number;
  discount?: number;
  grandTotal: number;
  paymentMode: 'cash' | 'upi' | 'khata' | 'split';
  splitBreakdown?: {
    cash: number;
    upi: number;
    khata: number;
  };
}): CompletedBill {
  const dateObj = new Date();
  const timeFormatted = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const dateFormatted = dateObj.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  let totalCost = 0;
  let grossProfit = 0;

  for (const item of params.items) {
    const unitCost = item.costPrice !== undefined ? item.costPrice : Math.round(item.price * 0.78);
    const lineCost = unitCost * item.qty;
    const lineProfit = (item.price - unitCost) * item.qty;
    totalCost += lineCost;
    grossProfit += lineProfit;
  }

  let cashCollected = 0;
  let upiCollected = 0;
  let khataGiven = 0;

  if (params.paymentMode === 'cash') {
    cashCollected = params.grandTotal;
  } else if (params.paymentMode === 'upi') {
    upiCollected = params.grandTotal;
  } else if (params.paymentMode === 'khata') {
    khataGiven = params.grandTotal;
  } else if (params.paymentMode === 'split' && params.splitBreakdown) {
    cashCollected = params.splitBreakdown.cash || 0;
    upiCollected = params.splitBreakdown.upi || 0;
    khataGiven = params.splitBreakdown.khata || 0;
  }

  const newBill: CompletedBill = {
    id: `BILL-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
    invoiceNo: params.invoiceNo,
    timestamp: dateObj.toISOString(),
    timeFormatted,
    dateFormatted,
    customerName: params.customerName || '',
    customerPhone: params.customerPhone || '',
    items: params.items,
    subtotal: params.subtotal,
    gstAmount: params.gstAmount,
    discount: params.discount || 0,
    grandTotal: params.grandTotal,
    paymentMode: params.paymentMode,
    splitBreakdown: params.splitBreakdown,
    totalCost,
    grossProfit,
    cashCollected,
    upiCollected,
    khataGiven
  };

  const existingBills = getStoredTodayBills();
  const updatedBills = [newBill, ...existingBills];
  saveTodayBills(updatedBills);

  return newBill;
}

/**
 * Custom React Hook to subscribe to live today's sales and bills
 */
export function useTodaySales() {
  const [bills, setBills] = useState<CompletedBill[]>(() => getStoredTodayBills());
  const [summary, setSummary] = useState<DailySalesSummary>(() => calculateSalesSummary(getStoredTodayBills()));

  const reloadData = useCallback(() => {
    const currentBills = getStoredTodayBills();
    setBills(currentBills);
    setSummary(calculateSalesSummary(currentBills));
  }, []);

  useEffect(() => {
    reloadData();

    const handleCustomEvent = () => reloadData();
    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === STORAGE_BILLS_KEY || e.key === STORAGE_DATE_KEY) {
        reloadData();
      }
    };

    window.addEventListener(SALES_UPDATED_EVENT, handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener(SALES_UPDATED_EVENT, handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [reloadData]);

  return {
    bills,
    summary,
    recordBill: recordCompletedBill,
    resetSales: resetTodaySales,
    reload: reloadData
  };
}
