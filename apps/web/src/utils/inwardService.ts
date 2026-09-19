/**
 * DukaanPilot - Supplier Purchase Inward (GRN) & Accounts Payable (AP) Ledger Service
 * Handles receiving new stock from distributors, auto stock increments, purchase bills, and supplier ledger.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Lang } from '../i18n/translations.ts';
import { INITIAL_INVENTORY_ITEMS } from './inventoryService.ts';
import type { InventoryItem, StockAdjustmentLog } from './inventoryService.ts';
import { INITIAL_SUPPLIERS } from './restockService.ts';
import type { Supplier } from './restockService.ts';

export interface InwardItem {
  itemId: string;
  name: string;
  nameHindi?: string;
  qtyReceived: number;
  unit: string;
  costPrice: number;
  sellingPrice?: number;
  mrp?: number;
  batchNo?: string;
  expiryDate?: string; // YYYY-MM-DD
  barcode?: string;
  category?: string;
}

export interface PurchaseInwardEntry {
  id: string;
  grnNumber: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  invoiceNumber: string;
  invoiceDate: string;
  receivedDate: string;
  receivedTime: string;
  items: InwardItem[];
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  paymentMode: 'cash' | 'upi' | 'credit' | 'partial';
  notes?: string;
}

export interface SupplierPaymentRecord {
  id: string;
  supplierId: string;
  supplierName: string;
  date: string;
  time: string;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'bank';
  notes?: string;
}

const STORAGE_INWARD_KEY = 'dukaanpilot_inward_entries';
const STORAGE_PAYMENTS_KEY = 'dukaanpilot_supplier_payments';
const STORAGE_SUPPLIERS_KEY = 'dukaanpilot_suppliers_custom';
export const INWARD_UPDATED_EVENT = 'dukaanpilot_inward_updated';

export const INITIAL_INWARD_ENTRIES: PurchaseInwardEntry[] = [
  {
    id: 'grn_1001',
    grnNumber: 'GRN-2609-01',
    supplierId: 'sup_01',
    supplierName: 'अमुल डेयरी डिस्ट्रीब्यूटर',
    supplierPhone: '+91 98111 22334',
    invoiceNumber: 'AMUL-INV-8891',
    invoiceDate: '18/09/2026',
    receivedDate: '18/09/2026',
    receivedTime: '07:30 AM',
    items: [
      {
        itemId: 'inv_101',
        name: 'Amul Taaza Milk 500ml',
        nameHindi: 'अमूल ताजा दूध 500ml',
        qtyReceived: 30,
        unit: 'packet',
        costPrice: 25,
        sellingPrice: 27,
        mrp: 27,
        batchNo: 'B2609A',
        expiryDate: '2026-09-22',
        category: 'Dairy & Bakery'
      }
    ],
    totalAmount: 750,
    paidAmount: 750,
    pendingAmount: 0,
    paymentMode: 'cash',
    notes: 'सुबह की फ्रेश डिलीवरी'
  }
];

export function getStoredInwardEntries(): PurchaseInwardEntry[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return INITIAL_INWARD_ENTRIES;
  }
  try {
    const raw = localStorage.getItem(STORAGE_INWARD_KEY);
    return raw ? JSON.parse(raw) : INITIAL_INWARD_ENTRIES;
  } catch {
    return INITIAL_INWARD_ENTRIES;
  }
}

export function saveInwardEntries(entries: PurchaseInwardEntry[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_INWARD_KEY, JSON.stringify(entries));
    window.dispatchEvent(new CustomEvent(INWARD_UPDATED_EVENT));
  } catch (err) {
    console.error('Failed to save inward entries', err);
  }
}

export function getStoredSupplierPayments(): SupplierPaymentRecord[] {
  if (typeof window === 'undefined' || !window.localStorage) return [];
  try {
    const raw = localStorage.getItem(STORAGE_PAYMENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSupplierPayments(payments: SupplierPaymentRecord[]): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.setItem(STORAGE_PAYMENTS_KEY, JSON.stringify(payments));
    window.dispatchEvent(new CustomEvent(INWARD_UPDATED_EVENT));
  } catch (err) {
    console.error('Failed to save supplier payments', err);
  }
}

/**
 * Record a new Supplier Purchase Inward (GRN) & Auto Stock Increment
 */
export function recordPurchaseInward(params: {
  supplier: Supplier;
  invoiceNumber: string;
  invoiceDate: string;
  items: InwardItem[];
  paidAmount: number;
  paymentMode: 'cash' | 'upi' | 'credit' | 'partial';
  notes?: string;
  currentInventory?: InventoryItem[];
}): { newEntry: PurchaseInwardEntry; updatedInventory: InventoryItem[]; adjustmentLogs: StockAdjustmentLog[] } {
  const totalAmount = params.items.reduce((sum, it) => sum + (it.qtyReceived * it.costPrice), 0);
  const pendingAmount = Math.max(0, totalAmount - params.paidAmount);

  const dateObj = new Date();
  const dateFormatted = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeFormatted = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  const grnNumber = `GRN-${dateObj.toISOString().slice(2, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;

  const newEntry: PurchaseInwardEntry = {
    id: `grn_${Date.now()}`,
    grnNumber,
    supplierId: params.supplier.id,
    supplierName: params.supplier.name,
    supplierPhone: params.supplier.phone,
    invoiceNumber: params.invoiceNumber || `INV-${Date.now().toString().slice(-4)}`,
    invoiceDate: params.invoiceDate || dateFormatted,
    receivedDate: dateFormatted,
    receivedTime: timeFormatted,
    items: params.items,
    totalAmount,
    paidAmount: params.paidAmount,
    pendingAmount,
    paymentMode: params.paymentMode,
    notes: params.notes
  };

  // 1. Save GRN
  const existingEntries = getStoredInwardEntries();
  saveInwardEntries([newEntry, ...existingEntries]);

  // 2. Increment Stock
  const invBase = params.currentInventory || INITIAL_INVENTORY_ITEMS;
  const adjustmentLogs: StockAdjustmentLog[] = [];

  const updatedInventory = invBase.map((item) => {
    const inwardMatch = params.items.find(
      (inItem) => inItem.itemId === item.id || inItem.name.toLowerCase() === item.name.toLowerCase()
    );

    if (inwardMatch) {
      const newStock = item.currentStock + inwardMatch.qtyReceived;
      adjustmentLogs.push({
        id: `adj_grn_${Date.now()}_${item.id}`,
        itemId: item.id,
        itemName: item.name,
        type: 'RESTOCK',
        quantityDelta: inwardMatch.qtyReceived,
        finalStock: newStock,
        reason: `सप्लायर खरीद इनवर्ड (${grnNumber})`,
        date: dateFormatted,
        time: timeFormatted
      });

      return {
        ...item,
        currentStock: newStock,
        costPrice: inwardMatch.costPrice || item.costPrice,
        sellingPrice: inwardMatch.sellingPrice || item.sellingPrice,
        mrp: inwardMatch.mrp || item.mrp,
        batchNo: inwardMatch.batchNo || item.batchNo,
        expiryDate: inwardMatch.expiryDate || item.expiryDate
      };
    }
    return item;
  });

  return {
    newEntry,
    updatedInventory,
    adjustmentLogs
  };
}

/**
 * Record Payment made to Supplier and update Accounts Payable
 */
export function recordSupplierPayment(params: {
  supplier: Supplier;
  amount: number;
  paymentMode: 'cash' | 'upi' | 'bank';
  notes?: string;
}): SupplierPaymentRecord {
  const dateObj = new Date();
  const dateFormatted = dateObj.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeFormatted = dateObj.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const newPayment: SupplierPaymentRecord = {
    id: `sp_pay_${Date.now()}`,
    supplierId: params.supplier.id,
    supplierName: params.supplier.name,
    date: dateFormatted,
    time: timeFormatted,
    amount: params.amount,
    paymentMode: params.paymentMode,
    notes: params.notes
  };

  const existingPayments = getStoredSupplierPayments();
  saveSupplierPayments([newPayment, ...existingPayments]);

  return newPayment;
}

/**
 * Format Supplier Payment Confirmation WhatsApp message
 */
export function formatSupplierPaymentReceipt(
  supplier: Supplier,
  payment: SupplierPaymentRecord,
  shopInfo = {
    name: 'श्री गणेश किराना स्टोर',
    phone: '+91 98765 43210'
  },
  lang: Lang = 'hi'
): string {
  const isHi = lang === 'hi' || lang === 'gu' || lang === 'mr';

  let msg = isHi
    ? `नमस्ते *${supplier.contactPerson || supplier.name} जी* 🙏\n\n`
    : `Hello *${supplier.contactPerson || supplier.name}*,\n\n`;

  msg += isHi
    ? `*${shopInfo.name}* की ओर से सप्लायर भुगतान रसीद:\n`
    : `Supplier payment confirmation from *${shopInfo.name}*:\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💵 *${isHi ? 'भुगतान राशि' : 'Amount Paid'}: ₹${payment.amount.toLocaleString('en-IN')}*\n`;
  msg += `💳 *${isHi ? 'माध्यम' : 'Payment Mode'}: ${payment.paymentMode.toUpperCase()}*\n`;
  msg += `📅 *${isHi ? 'तारीख' : 'Date'}: ${payment.date} ${payment.time}*\n`;
  if (payment.notes) {
    msg += `📝 *${isHi ? 'विवरण' : 'Notes'}: ${payment.notes}*\n`;
  }
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🙏 *${isHi ? 'कृपया पेमेंट रसीद कन्फर्म करें। धन्यवाद!' : 'Please confirm payment receipt. Thank you!'}*`;

  return msg;
}

/**
 * Custom React Hook for Supplier Inward & AP Ledger
 */
export function useSupplierInward() {
  const [inwardEntries, setInwardEntries] = useState<PurchaseInwardEntry[]>(() => getStoredInwardEntries());
  const [payments, setPayments] = useState<SupplierPaymentRecord[]>(() => getStoredSupplierPayments());

  const reload = useCallback(() => {
    setInwardEntries(getStoredInwardEntries());
    setPayments(getStoredSupplierPayments());
  }, []);

  useEffect(() => {
    window.addEventListener(INWARD_UPDATED_EVENT, reload);
    return () => window.removeEventListener(INWARD_UPDATED_EVENT, reload);
  }, [reload]);

  return {
    inwardEntries,
    payments,
    recordInward: recordPurchaseInward,
    recordPayment: recordSupplierPayment,
    reload
  };
}
