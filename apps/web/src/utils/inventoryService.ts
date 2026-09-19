/**
 * DukaanPilot - Smart Inventory, Batch & Expiry Date Management Service
 */

export interface InventoryItem {
  id: string;
  name: string;
  hindi: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  mrp: number;
  batchNo: string;
  expiryDate: string; // YYYY-MM-DD
  supplierName: string;
  barcode?: string;
  shelfLocation?: string;
}

export interface StockAdjustmentLog {
  id: string;
  itemId: string;
  itemName: string;
  type: 'RESTOCK' | 'DAMAGE' | 'EXPIRED' | 'CORRECTION' | 'SALE';
  quantityDelta: number; // positive or negative
  finalStock: number;
  reason: string;
  date: string;
  time: string;
}

const INVENTORY_STORAGE_KEY = 'dukaanpilot_inventory_items';
const STOCK_LOGS_STORAGE_KEY = 'dukaanpilot_stock_logs';
let inMemoryInventory: InventoryItem[] | null = null;
let inMemoryLogs: StockAdjustmentLog[] | null = null;

export const INITIAL_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: 'inv_101',
    name: 'Amul Taaza Milk 500ml',
    hindi: 'अमूल ताजा दूध 500ml',
    category: 'Dairy & Bakery',
    currentStock: 19,
    minThreshold: 5,
    unit: 'packet',
    costPrice: 25,
    sellingPrice: 27,
    mrp: 27,
    batchNo: 'B2609A',
    expiryDate: '2026-09-21', // 2 days left (Nearing Expiry)
    supplierName: 'अमुल डेयरी डिस्ट्रीब्यूटर',
    barcode: '8901262010014',
    shelfLocation: 'Chiller Rack A1'
  },
  {
    id: 'inv_102',
    name: 'Britannia Daily Fresh Bread 400g',
    hindi: 'ब्रिटानिया ब्रेड 400g',
    category: 'Dairy & Bakery',
    currentStock: 6,
    minThreshold: 4,
    unit: 'packet',
    costPrice: 38,
    sellingPrice: 45,
    mrp: 45,
    batchNo: 'BRT0918',
    expiryDate: '2026-09-22', // 3 days left
    supplierName: 'ब्रिटानिया एजेंसी',
    barcode: '8901030045618',
    shelfLocation: 'Bakery Stand B1'
  },
  {
    id: 'inv_103',
    name: 'Aashirvaad Superior Sharbati Atta 10kg',
    hindi: 'आशीर्वाद शरबती आटा 10kg',
    category: 'Atta, Flour & Grains',
    currentStock: 4,
    minThreshold: 2,
    unit: 'bag',
    costPrice: 480,
    sellingPrice: 535,
    mrp: 575,
    batchNo: 'ASH0826',
    expiryDate: '2027-02-15',
    supplierName: 'ITC डिस्ट्रीब्यूटर्स',
    barcode: '8901725131012',
    shelfLocation: 'Grain Shelf G1'
  },
  {
    id: 'inv_104',
    name: 'Fortune Kachi Ghani Mustard Oil 1L',
    hindi: 'फॉर्च्यून सरसों तेल 1L',
    category: 'Edible Oils & Ghee',
    currentStock: 8,
    minThreshold: 3,
    unit: 'bottle',
    costPrice: 142,
    sellingPrice: 165,
    mrp: 180,
    batchNo: 'FTN0726',
    expiryDate: '2027-05-30',
    supplierName: 'अडानी विल्मर सप्लायर',
    barcode: '8901725181222',
    shelfLocation: 'Oil Rack O2'
  },
  {
    id: 'inv_105',
    name: 'Madhur Pure Refined Sugar 1kg',
    hindi: 'मधुर चीनी 1kg',
    category: 'Sugar & Sweeteners',
    currentStock: 22,
    minThreshold: 5,
    unit: 'packet',
    costPrice: 42,
    sellingPrice: 48,
    mrp: 55,
    batchNo: 'MDH0826',
    expiryDate: '2027-08-10',
    supplierName: 'रेणुका शुगर्स एजेंसी',
    barcode: '8901030825319',
    shelfLocation: 'Sugar Bin S1'
  },
  {
    id: 'inv_106',
    name: 'Haldiram Aloo Bhujia 200g',
    hindi: 'हल्दीराम आलू भुजिया 200g',
    category: 'Snacks & Biscuits',
    currentStock: 3,
    minThreshold: 5, // Low stock: 3 <= 5
    unit: 'packet',
    costPrice: 40,
    sellingPrice: 48,
    mrp: 50,
    batchNo: 'HLD0826',
    expiryDate: '2026-09-25', // 6 days left
    supplierName: 'हल्दीराम स्नैक्स डिपो',
    barcode: '8901030704416',
    shelfLocation: 'Snack Shelf N1'
  }
];

export const INITIAL_STOCK_LOGS: StockAdjustmentLog[] = [
  {
    id: 'log_001',
    itemId: 'inv_101',
    itemName: 'अमूल ताजा दूध 500ml',
    type: 'RESTOCK',
    quantityDelta: 20,
    finalStock: 19,
    reason: 'सुबह का सप्लायर रीस्टॉक',
    date: '19/09/2026',
    time: '07:30 AM'
  },
  {
    id: 'log_002',
    itemId: 'inv_102',
    itemName: 'ब्रिटानिया ब्रेड 400g',
    type: 'DAMAGE',
    quantityDelta: -2,
    finalStock: 6,
    reason: 'पैकेट फटने से डैमेज',
    date: '19/09/2026',
    time: '09:15 AM'
  }
];

export function getInventoryItems(): InventoryItem[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(INVENTORY_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } else if (inMemoryInventory !== null) {
      return inMemoryInventory;
    }
  } catch (e) {
    console.error('Failed to get inventory items:', e);
  }
  return INITIAL_INVENTORY_ITEMS;
}

export function saveInventoryItems(items: InventoryItem[]): InventoryItem[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
      window.dispatchEvent(new CustomEvent('dukaanpilot_inventory_updated', { detail: items }));
    } else {
      inMemoryInventory = items;
    }
  } catch (e) {
    console.error('Failed to save inventory items:', e);
  }
  return items;
}

export function getStockLogs(): StockAdjustmentLog[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(STOCK_LOGS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } else if (inMemoryLogs !== null) {
      return inMemoryLogs;
    }
  } catch (e) {
    console.error('Failed to get stock logs:', e);
  }
  return INITIAL_STOCK_LOGS;
}

export function saveStockLogs(logs: StockAdjustmentLog[]): StockAdjustmentLog[] {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(STOCK_LOGS_STORAGE_KEY, JSON.stringify(logs));
      window.dispatchEvent(new CustomEvent('dukaanpilot_stock_logs_updated', { detail: logs }));
    } else {
      inMemoryLogs = logs;
    }
  } catch (e) {
    console.error('Failed to save stock logs:', e);
  }
  return logs;
}

export type ExpiryStatus = 'SAFE' | 'NEAR_EXPIRY' | 'EXPIRED';

/**
 * Calculates days remaining until expiry date
 */
export function getDaysUntilExpiry(expiryDateStr: string, referenceDate = new Date('2026-09-19')): number {
  const expiry = new Date(expiryDateStr);
  const diffTime = expiry.getTime() - referenceDate.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Determines expiry status (Safe vs Near Expiry <= 7 days vs Expired)
 */
export function getExpiryStatus(expiryDateStr: string, referenceDate = new Date('2026-09-19')): ExpiryStatus {
  const days = getDaysUntilExpiry(expiryDateStr, referenceDate);
  if (days < 0) return 'EXPIRED';
  if (days <= 7) return 'NEAR_EXPIRY';
  return 'SAFE';
}

/**
 * Decrements inventory stock for cart items sold during POS billing or online orders
 */
export function decrementStockOnSale(
  inventory: InventoryItem[],
  soldItems: { id: string | number; name: string; qty: number }[]
): { updatedInventory: InventoryItem[]; logs: StockAdjustmentLog[] } {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN');
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  const newLogs: StockAdjustmentLog[] = [];
  const updated = inventory.map(item => {
    const sold = soldItems.find(
      s => String(s.id) === item.id ||
           String(s.id) === item.barcode ||
           s.name.toLowerCase().includes(item.name.toLowerCase()) ||
           item.name.toLowerCase().includes(s.name.toLowerCase())
    );

    if (sold && sold.qty > 0) {
      const finalStock = Math.max(0, item.currentStock - sold.qty);
      newLogs.push({
        id: `log_sale_${Date.now()}_${Math.random()}`,
        itemId: item.id,
        itemName: item.hindi || item.name,
        type: 'SALE',
        quantityDelta: -sold.qty,
        finalStock,
        reason: `POS बिलिंग बिक्री (${sold.qty} ${item.unit})`,
        date: dateStr,
        time: timeStr
      });
      return {
        ...item,
        currentStock: finalStock
      };
    }
    return item;
  });

  // Save to persistence
  saveInventoryItems(updated);
  if (newLogs.length > 0) {
    const existingLogs = getStockLogs();
    saveStockLogs([...newLogs, ...existingLogs]);
  }

  return { updatedInventory: updated, logs: newLogs };
}

