import React, { useState, useEffect } from 'react';
import { 
  Search, Barcode, AlertTriangle, ArrowUpDown, Package, Check, RefreshCw, 
  Plus, Truck, Filter, Trash2, Edit3, FolderPlus, Sparkles, X, Tag, DollarSign, Layers,
  Calendar, Clock, AlertCircle, ShieldAlert, History, ArrowDownRight, ArrowUpRight
} from 'lucide-react';
import { fetchProducts, adjustStock, createProduct, updateProduct, deleteProduct, fetchCategories, createCategory } from '../services/api';
import { Lang, translations } from '../i18n/translations';
import { formatProductTitle, getCleanHindiName } from '../utils/productFormat';
import { SupplierManagementView } from './SupplierManagementView';
import {
  InventoryItem,
  StockAdjustmentLog,
  INITIAL_INVENTORY_ITEMS,
  INITIAL_STOCK_LOGS,
  getInventoryItems,
  saveInventoryItems,
  getStockLogs,
  saveStockLogs,
  getDaysUntilExpiry,
  getExpiryStatus
} from '../utils/inventoryService';
import { speakHindi } from '../utils/voiceFeedback';

interface InventoryViewProps {
  lang?: Lang;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ lang = 'hi' }) => {
  const t = translations[lang];
  const isHi = lang === 'hi';

  const [inventorySubTab, setInventorySubTab] = useState<'catalog' | 'expiry' | 'logs' | 'suppliers'>('catalog');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // Expiry & Batch inventory state
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => getInventoryItems());
  const [stockLogs, setStockLogs] = useState<StockAdjustmentLog[]>(() => getStockLogs());
  const [expiryFilter, setExpiryFilter] = useState<'all' | 'near_expiry' | 'expired' | 'low_stock'>('all');

  // Modals state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [deletingItem, setDeletingItem] = useState<any | null>(null);
  const [adjustingItem, setAdjustingItem] = useState<any | null>(null);

  // Form states - Add/Edit Product
  const [formData, setFormData] = useState({
    name: '',
    nameHindi: '',
    categoryId: 'cat_atta',
    unit: 'packet',
    sellingPrice: '',
    costPrice: '',
    mrp: '',
    currentStock: '10',
    minThreshold: '5',
    barcode: '',
    brand: '',
    batchNo: 'B2609X',
    expiryDate: '2027-03-31',
    shelfLocation: 'Shelf A1'
  });

  // Form states - Add Category
  const [catFormData, setCatFormData] = useState({
    name: '',
    nameHindi: '',
    icon: 'package'
  });

  // Stock adjust state
  const [adjustDelta, setAdjustDelta] = useState('5');
  const [adjustType, setAdjustType] = useState<'RESTOCK' | 'DAMAGE' | 'EXPIRED' | 'CORRECTION'>('RESTOCK');
  const [adjustReason, setAdjustReason] = useState('ताजा सप्लायर रीस्टॉक');
  const [adjustExpiryDate, setAdjustExpiryDate] = useState('2027-03-31');
  const [adjustBatchNo, setAdjustBatchNo] = useState('');
  const [adjustShelfLocation, setAdjustShelfLocation] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Default fallback categories
  const defaultCategories = [
    { id: 'cat_atta', name: 'Atta, Flour & Grains', nameHindi: 'आटा, चावल व अनाज', icon: 'wheat' },
    { id: 'cat_oils', name: 'Edible Oils & Ghee', nameHindi: 'तेल व देसी घी', icon: 'droplet' },
    { id: 'cat_spices', name: 'Spices & Masalas', nameHindi: 'मसाले व नमक', icon: 'flame' },
    { id: 'cat_dals', name: 'Pulses & Dals', nameHindi: 'दालें व छोले', icon: 'box' },
    { id: 'cat_dairy', name: 'Dairy & Bakery', nameHindi: 'दूध, मक्खन व ब्रेड', icon: 'milk' },
    { id: 'cat_snacks', name: 'Snacks & Biscuits', nameHindi: 'नमकीन व बिस्कुट', icon: 'cookie' },
    { id: 'cat_beverages', name: 'Tea, Coffee & Drinks', nameHindi: 'चाय, कॉफी व पेय', icon: 'coffee' },
    { id: 'cat_sugar', name: 'Sugar & Sweeteners', nameHindi: 'चीनी, गुड़ व शहद', icon: 'archive' },
    { id: 'cat_personal', name: 'Personal & Oral Care', nameHindi: 'साबुन, पेस्ट व देखभाल', icon: 'heart' },
    { id: 'cat_cleaning', name: 'Cleaning & Household', nameHindi: 'सफाई व डिटर्जेंट', icon: 'sparkles' },
  ];

  async function loadCategories() {
    const res = await fetchCategories();
    if (res.success && res.data && res.data.length > 0) {
      setCategories(res.data);
    } else {
      setCategories(defaultCategories);
    }
  }

  async function loadCatalog() {
    setLoading(true);
    const res = await fetchProducts(search, selectedCategory);
    if (res.success && res.data) {
      setProducts(res.data.items || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [search, selectedCategory]);

  useEffect(() => {
    const handleInvUpdate = () => {
      setInventoryItems(getInventoryItems());
    };
    const handleLogsUpdate = () => {
      setStockLogs(getStockLogs());
    };

    window.addEventListener('dukaanpilot_inventory_updated', handleInvUpdate);
    window.addEventListener('dukaanpilot_stock_logs_updated', handleLogsUpdate);

    return () => {
      window.removeEventListener('dukaanpilot_inventory_updated', handleInvUpdate);
      window.removeEventListener('dukaanpilot_stock_logs_updated', handleLogsUpdate);
    };
  }, []);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setTimeout(() => setErrorMsg(''), 4000);
    } else {
      setSuccessMsg(msg);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catFormData.name.trim()) return;

    const res = await createCategory({
      name: catFormData.name.trim(),
      nameHindi: catFormData.nameHindi.trim() || catFormData.name.trim(),
      icon: catFormData.icon
    });

    if (res.success && res.data) {
      const newCatList = [...categories, res.data];
      setCategories(newCatList);
      setFormData(prev => ({ ...prev, categoryId: res.data.id }));
      setIsAddCategoryOpen(false);
      setCatFormData({ name: '', nameHindi: '', icon: 'package' });
      showNotification(isHi ? `नई श्रेणी जोड़ी गई: ${res.data.nameHindi || res.data.name}` : `New category added: ${res.data.name}`);
    } else {
      showNotification(res.error?.message || 'Failed to add category', true);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPrice) {
      showNotification(isHi ? 'कृपया सामान का नाम और सेलिंग प्राइस भरें' : 'Please provide product name and price', true);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      nameHindi: formData.nameHindi.trim() || formData.name.trim(),
      categoryId: formData.categoryId,
      unit: formData.unit,
      sellingPrice: parseFloat(formData.sellingPrice),
      costPrice: formData.costPrice ? parseFloat(formData.costPrice) : 0,
      mrp: formData.mrp ? parseFloat(formData.mrp) : parseFloat(formData.sellingPrice),
      currentStock: parseFloat(formData.currentStock) || 0,
      minThreshold: parseFloat(formData.minThreshold) || 5,
      barcode: formData.barcode.trim() || ('890' + Math.floor(1000000000 + Math.random() * 9000000000)),
      brand: formData.brand.trim() || undefined
    };

    if (editingItem) {
      const res = await updateProduct(editingItem.id, payload);
      if (res.success) {
        showNotification(isHi ? `सामान अपडेट हुआ: ${payload.name}` : `Product updated: ${payload.name}`);
        setEditingItem(null);
        setIsAddProductOpen(false);
        loadCatalog();
      } else {
        showNotification(res.error?.message || 'Update failed', true);
      }
    } else {
      const res = await createProduct(payload);
      if (res.success) {
        // Also add to smart batch inventory
        const newInv: InventoryItem = {
          id: `inv_${Date.now()}`,
          name: payload.name,
          hindi: payload.nameHindi,
          category: categories.find(c => c.id === payload.categoryId)?.name || 'General',
          currentStock: payload.currentStock,
          minThreshold: payload.minThreshold,
          unit: payload.unit,
          costPrice: payload.costPrice,
          sellingPrice: payload.sellingPrice,
          mrp: payload.mrp,
          batchNo: formData.batchNo || 'B2609X',
          expiryDate: formData.expiryDate || '2027-03-31',
          supplierName: 'श्री गणेश सप्लायर एजेंसी',
          barcode: payload.barcode,
          shelfLocation: formData.shelfLocation || 'Rack A1'
        };
        const updatedInv = [newInv, ...inventoryItems];
        saveInventoryItems(updatedInv);
        setInventoryItems(updatedInv);

        showNotification(isHi ? `नया सामान जोड़ा गया: ${payload.name}` : `New product added: ${payload.name}`);
        setIsAddProductOpen(false);
        setFormData({
          name: '',
          nameHindi: '',
          categoryId: categories[0]?.id || 'cat_atta',
          unit: 'packet',
          sellingPrice: '',
          costPrice: '',
          mrp: '',
          currentStock: '10',
          minThreshold: '5',
          barcode: '',
          brand: '',
          batchNo: 'B2609X',
          expiryDate: '2027-03-31',
          shelfLocation: 'Shelf A1'
        });
        loadCatalog();
      } else {
        showNotification(res.error?.message || 'Creation failed', true);
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (!deletingItem) return;
    const res = await deleteProduct(deletingItem.id);
    if (res.success) {
      showNotification(isHi ? `सामान हटाया गया: ${deletingItem.name}` : `Product removed: ${deletingItem.name}`);
      setDeletingItem(null);
      loadCatalog();
    } else {
      showNotification(res.error?.message || 'Delete failed', true);
    }
  };

  const openAdjustModal = (item: any, type: 'RESTOCK' | 'DAMAGE' | 'CORRECTION' = 'RESTOCK') => {
    setAdjustingItem(item);
    setAdjustType(type);
    setAdjustDelta(type === 'CORRECTION' ? String(item.currentStock || 0) : '5');
    setAdjustReason(
      type === 'RESTOCK'
        ? (isHi ? 'ताजा सप्लायर रीस्टॉक' : 'Supplier Restock')
        : type === 'DAMAGE'
        ? (isHi ? 'डैमेज / वेस्टेज' : 'Damaged Goods')
        : (isHi ? 'स्टॉक व एक्सपायरी अपडेट' : 'Stock & Expiry Update')
    );
    setAdjustExpiryDate(item.expiryDate || '2027-03-31');
    setAdjustBatchNo(item.batchNo || 'B2609X');
    setAdjustShelfLocation(item.shelfLocation || 'Rack A1');
  };

  const quickRenewExpiry = (item: InventoryItem) => {
    // Add 45 days fresh shelf life
    const now = new Date();
    now.setDate(now.getDate() + 45);
    const newExp = now.toISOString().split('T')[0];
    const newBatch = `B2609${Math.floor(10 + Math.random() * 90)}`;

    const updatedInventory = inventoryItems.map(inv => {
      if (inv.id === item.id || inv.name === item.name) {
        return { ...inv, expiryDate: newExp, batchNo: newBatch };
      }
      return inv;
    });

    saveInventoryItems(updatedInventory);
    setInventoryItems(updatedInventory);

    const log: StockAdjustmentLog = {
      id: `log_${Date.now()}`,
      itemId: item.id,
      itemName: item.hindi || item.name,
      type: 'RESTOCK',
      quantityDelta: 0,
      finalStock: item.currentStock,
      reason: `ताजा नया बैच रिन्यू (नई एक्सपायरी: ${newExp})`,
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    const updatedLogs = [log, ...stockLogs];
    saveStockLogs(updatedLogs);
    setStockLogs(updatedLogs);

    showNotification(isHi ? `ताजा बैच रिन्यू हुआ: ${item.hindi || item.name} (सुरक्षित - नई एक्सपायरी: ${newExp})` : `Fresh batch renewed for ${item.name}`);
    speakHindi(isHi ? `${item.hindi || item.name} का नया बैच अपडेट हो गया है` : `Fresh batch updated for ${item.name}`, lang);
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;

    const currentQty = typeof adjustingItem.currentStock === 'number' ? adjustingItem.currentStock : parseFloat(adjustingItem.currentStock) || 0;
    const inputVal = parseFloat(adjustDelta) || 0;
    let deltaNum = 0;
    let finalStock = currentQty;

    if (adjustType === 'RESTOCK') {
      deltaNum = Math.abs(inputVal);
      finalStock = currentQty + deltaNum;
    } else if (adjustType === 'DAMAGE' || adjustType === 'EXPIRED') {
      deltaNum = -Math.abs(inputVal);
      finalStock = Math.max(0, currentQty + deltaNum);
    } else if (adjustType === 'CORRECTION') {
      finalStock = Math.max(0, inputVal);
      deltaNum = finalStock - currentQty;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN');
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    // Update smart batch inventory & log
    const newLogs: StockAdjustmentLog[] = [];
    const updatedInventory = inventoryItems.map(item => {
      if (item.id === adjustingItem.id || item.name === adjustingItem.name || (adjustingItem.barcode && item.barcode === adjustingItem.barcode)) {
        const newLog: StockAdjustmentLog = {
          id: `log_${Date.now()}`,
          itemId: item.id,
          itemName: item.hindi || item.name,
          type: adjustType,
          quantityDelta: deltaNum,
          finalStock,
          reason: adjustReason || (adjustType === 'RESTOCK' ? 'सप्लायर रीस्टॉक' : adjustType === 'DAMAGE' ? 'डैमेज वेस्टेज' : 'स्टॉक सुधार'),
          date: dateStr,
          time: timeStr
        };
        newLogs.push(newLog);
        return { 
          ...item, 
          currentStock: finalStock,
          expiryDate: adjustExpiryDate || item.expiryDate,
          batchNo: adjustBatchNo || item.batchNo,
          shelfLocation: adjustShelfLocation || item.shelfLocation
        };
      }
      return item;
    });

    saveInventoryItems(updatedInventory);
    setInventoryItems(updatedInventory);

    if (newLogs.length > 0) {
      const updatedLogs = [...newLogs, ...stockLogs];
      saveStockLogs(updatedLogs);
      setStockLogs(updatedLogs);
    }

    // Also update catalog product list
    setProducts(prev => prev.map(p => {
      if (p.id === adjustingItem.id || p.name === adjustingItem.name || (adjustingItem.barcode && p.barcode === adjustingItem.barcode)) {
        return { ...p, currentStock: finalStock };
      }
      return p;
    }));

    const itemName = isHi ? (adjustingItem.hindi || adjustingItem.nameHindi || adjustingItem.name) : adjustingItem.name;
    showNotification(
      isHi 
        ? `स्टॉक सफलतापूर्वक बदला गया: ${itemName} (नया स्टॉक: ${finalStock} ${adjustingItem.unit || ''})` 
        : `Stock updated for ${itemName} (New stock: ${finalStock} ${adjustingItem.unit || ''})`
    );

    speakHindi(
      isHi 
        ? `${itemName} का स्टॉक ${finalStock} ${adjustingItem.unit || 'पैकेट'} हो गया है` 
        : `Stock updated to ${finalStock} for ${adjustingItem.name}`,
      lang
    );

    setAdjustingItem(null);

    // Call backend API asynchronously
    try {
      await adjustStock(adjustingItem.id, deltaNum, adjustReason);
    } catch (err) {
      console.warn('API adjustStock notice:', err);
    }
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      nameHindi: item.nameHindi || item.hindiName || '',
      categoryId: item.categoryId || 'cat_atta',
      unit: item.unit || 'packet',
      sellingPrice: item.sellingPrice?.toString() || '',
      costPrice: item.costPrice?.toString() || '',
      mrp: item.mrp?.toString() || '',
      currentStock: item.currentStock?.toString() || '0',
      minThreshold: item.minThreshold?.toString() || '5',
      barcode: item.barcode || '',
      brand: item.brand || '',
      batchNo: 'B2609X',
      expiryDate: '2027-03-31',
      shelfLocation: 'Shelf A1'
    });
    setIsAddProductOpen(true);
  };

  const generateBarcode = () => {
    setFormData(prev => ({
      ...prev,
      barcode: '890' + Math.floor(1000000000 + Math.random() * 9000000000)
    }));
  };

  // Filtered Expiry Items
  const filteredExpiryItems = inventoryItems.filter(item => {
    const days = getDaysUntilExpiry(item.expiryDate);
    const status = getExpiryStatus(item.expiryDate);
    const isLow = item.currentStock <= item.minThreshold;

    if (expiryFilter === 'near_expiry') return status === 'NEAR_EXPIRY';
    if (expiryFilter === 'expired') return status === 'EXPIRED';
    if (expiryFilter === 'low_stock') return isLow;
    return true;
  });

  const nearExpiryCount = inventoryItems.filter(i => getExpiryStatus(i.expiryDate) === 'NEAR_EXPIRY').length;
  const expiredCount = inventoryItems.filter(i => getExpiryStatus(i.expiryDate) === 'EXPIRED').length;
  const lowStockCount = inventoryItems.filter(i => i.currentStock <= i.minThreshold).length;

  return (
    <div className="space-y-4">
      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-200/70 border border-slate-300/50 overflow-x-auto">
        <button
          type="button"
          onClick={() => setInventorySubTab('catalog')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            inventorySubTab === 'catalog'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-blue-700" />
          <span>{isHi ? 'सामान व श्रेणी कैटलॉग' : 'Product Catalog'}</span>
        </button>

        <button
          type="button"
          onClick={() => setInventorySubTab('expiry')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap relative ${
            inventorySubTab === 'expiry'
              ? 'bg-white text-rose-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4 text-rose-600" />
          <span>{isHi ? 'बैच व एक्सपायरी ट्रैकिंग' : 'Batch & Expiry OS'}</span>
          {nearExpiryCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[9px] font-black">
              {nearExpiryCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setInventorySubTab('logs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            inventorySubTab === 'logs'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4 text-purple-600" />
          <span>{isHi ? 'स्टॉक मूवमेंट व वेस्टेज लॉग' : 'Stock Movement & Wastage'}</span>
        </button>

        <button
          type="button"
          onClick={() => setInventorySubTab('suppliers')}
          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            inventorySubTab === 'suppliers'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4 text-indigo-600" />
          <span>{isHi ? 'सप्लायर व री-स्टॉक PO' : 'Suppliers & PO'}</span>
        </button>
      </div>

      {/* RENDER ACTIVE SUB-TAB */}
      {inventorySubTab === 'suppliers' ? (
        <SupplierManagementView lang={lang} />
      ) : inventorySubTab === 'logs' ? (
        /* ================= STOCK MOVEMENT & WASTAGE LOGS TAB ================= */
        <div className="space-y-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <History className="w-5 h-5 text-purple-600" />
                <span>{isHi ? 'स्टॉक मूवमेंट, डैमेज व वेस्टेज ऑडिट लॉग' : 'Stock Movement & Wastage Audit Trail'}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isHi ? 'पीओएस बिलिंग, सप्लायर डिलीवरी और डैमेज वेस्टेज का पूरा टाइम-स्टैम्प्ड रिकॉर्ड' : 'Time-stamped audit logs for sales, restock, damages and audits'}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-bold text-xs">
              {stockLogs.length} {isHi ? 'प्रविष्टियां' : 'Logs'}
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">{isHi ? 'समय व दिनांक' : 'Date & Time'}</th>
                    <th className="py-3 px-4">{isHi ? 'सामान का नाम' : 'Item Name'}</th>
                    <th className="py-3 px-4">{isHi ? 'प्रकार (Type)' : 'Action Type'}</th>
                    <th className="py-3 px-4">{isHi ? 'मात्रा बदलाव' : 'Qty Delta'}</th>
                    <th className="py-3 px-4">{isHi ? 'अंतिम स्टॉक' : 'Final Stock'}</th>
                    <th className="py-3 px-4">{isHi ? 'कारण / विवरण' : 'Reason'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {stockLogs.map((log) => {
                    const isPositive = log.quantityDelta > 0;
                    return (
                      <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                          {log.date} at {log.time}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {log.itemName}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            log.type === 'RESTOCK'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.type === 'SALE'
                              ? 'bg-blue-100 text-blue-800'
                              : log.type === 'DAMAGE'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-black">
                          <span className={isPositive ? 'text-emerald-600' : 'text-rose-600'}>
                            {isPositive ? `+${log.quantityDelta}` : log.quantityDelta}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-800">
                          {log.finalStock}
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs">
                          {log.reason}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : inventorySubTab === 'expiry' ? (
        /* ================= BATCH & EXPIRY OS TRACKING TAB ================= */
        <div className="space-y-4">
          {/* Expiry KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-800">{isHi ? 'एक्सपायरी अलर्ट (<7 दिन)' : 'Near Expiry (<7d)'}</span>
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              </div>
              <span className="text-2xl font-black font-mono text-rose-900 mt-2 block">{nearExpiryCount} {isHi ? 'सामान' : 'items'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800">{isHi ? 'कम स्टॉक अलर्ट' : 'Low Stock'}</span>
                <Package className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-2xl font-black font-mono text-amber-900 mt-2 block">{lowStockCount} {isHi ? 'सामान' : 'items'}</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800">{isHi ? 'सुरक्षित स्टॉक' : 'Safe Stock'}</span>
                <Check className="w-4 h-4 text-emerald-600" />
              </div>
              <span className="text-2xl font-black font-mono text-emerald-900 mt-2 block">
                {inventoryItems.length - nearExpiryCount - expiredCount} {isHi ? 'सामान' : 'items'}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800">{isHi ? 'कुल SKU ट्रैकिंग' : 'Tracked SKUs'}</span>
                <Barcode className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-2xl font-black font-mono text-blue-900 mt-2 block">{inventoryItems.length} {isHi ? 'प्रॉडक्ट्स' : 'products'}</span>
            </div>
          </div>

          {/* Near Expiry Urgent Banner */}
          {nearExpiryCount > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-900 via-red-800 to-amber-900 text-white shadow-md flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/30 border border-rose-300/40 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-rose-200 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm">
                    {isHi ? 'चेतावनी: कुछ डेयरी व बेकरी सामानों की एक्सपायरी नजदीक है!' : 'Warning: Items nearing expiry within 7 days!'}
                  </h4>
                  <p className="text-xs text-rose-100">
                    {isHi ? 'इन्हें पहले बेचें (FIFO) या सप्लायर को रिटर्न/रिप्लेसमेंट के लिए मार्क करें' : 'Prioritize sales (FIFO) or mark for supplier return'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExpiryFilter('near_expiry')}
                className="px-3.5 py-1.5 rounded-full bg-white text-rose-950 font-black text-xs shadow-md cursor-pointer hover:bg-rose-50 shrink-0"
              >
                {isHi ? 'अलर्ट सामान देखें' : 'View Near Expiry'}
              </button>
            </div>
          )}

          {/* Expiry Quick Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setExpiryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                expiryFilter === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{isHi ? 'सभी सामान' : 'All Items'} ({inventoryItems.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setExpiryFilter('near_expiry')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                expiryFilter === 'near_expiry'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{isHi ? 'एक्सपायरी अलर्ट (<7 दिन)' : 'Near Expiry (<7d)'} ({nearExpiryCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setExpiryFilter('low_stock')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                expiryFilter === 'low_stock'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>{isHi ? 'कम स्टॉक' : 'Low Stock'} ({lowStockCount})</span>
            </button>
          </div>

          {/* Batch & Expiry Items Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">{isHi ? 'सामान व श्रेणी' : 'Item & Category'}</th>
                    <th className="py-3 px-4">{isHi ? 'बैच नंबर' : 'Batch No'}</th>
                    <th className="py-3 px-4">{isHi ? 'रैक / स्थान' : 'Shelf Rack'}</th>
                    <th className="py-3 px-4">{isHi ? 'स्टॉक' : 'Stock'}</th>
                    <th className="py-3 px-4">{isHi ? 'एक्सपायरी दिनांक' : 'Expiry Date'}</th>
                    <th className="py-3 px-4">{isHi ? 'स्थिति' : 'Status'}</th>
                    <th className="py-3 px-4 text-right">{isHi ? 'एडजस्ट' : 'Adjust'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {filteredExpiryItems.map((item) => {
                    const days = getDaysUntilExpiry(item.expiryDate);
                    const status = getExpiryStatus(item.expiryDate);
                    const isLow = item.currentStock <= item.minThreshold;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{item.hindi || item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            {item.supplierName} {item.barcode && `• ${item.barcode}`}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                          {item.batchNo}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 text-xs">
                          {item.shelfLocation || 'Rack A'}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <div className="flex items-center gap-1.5">
                            <span className={isLow ? 'text-amber-700 font-black' : 'text-slate-900'}>
                              {item.currentStock} {item.unit}
                            </span>
                            {isLow && (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[9px] font-black uppercase">
                                {isHi ? 'कम स्टॉक' : 'Low'}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold">
                          {item.expiryDate}
                        </td>
                        <td className="py-3.5 px-4">
                          {status === 'NEAR_EXPIRY' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 border border-rose-300 text-rose-800 text-[10px] font-extrabold animate-pulse">
                              <Clock className="w-3 h-3 text-rose-600" />
                              <span>{days} {isHi ? 'दिन शेष' : 'days left'}</span>
                            </span>
                          ) : status === 'EXPIRED' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold">
                              <span>{isHi ? 'एक्सपायर्ड' : 'Expired'}</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>{isHi ? 'सुरक्षित' : 'Safe'} ({days}d)</span>
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            {status === 'NEAR_EXPIRY' && (
                              <button
                                type="button"
                                onClick={() => quickRenewExpiry(item)}
                                title={isHi ? 'ताजा नया बैच सेट करें (+45 दिन)' : 'Renew Fresh Batch (+45d)'}
                                className="px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] cursor-pointer shadow-xs transition-colors flex items-center gap-1"
                              >
                                <RefreshCw className="w-2.5 h-2.5 text-emerald-600" />
                                <span>{isHi ? 'ताजा बैच' : 'Renew'}</span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => openAdjustModal(item, 'RESTOCK')}
                              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] cursor-pointer shadow-sm transition-all"
                            >
                              {isHi ? 'स्टॉक बदलें' : 'Adjust'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= STANDARD PRODUCT CATALOG TAB ================= */
        <>
          {/* Header with Search & Top Capsule Buttons */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-700" />
                  <span>{isHi ? 'सामान व श्रेणी कस्टमाइजेशन' : 'Product & Category OS'}</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {isHi ? 'दुकानदार नया सामान जोड़ सकते हैं, हटा सकते हैं और नई श्रेणियां बना सकते हैं' : 'Add, edit, remove products and create custom categories'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setEditingItem(null);
                    setFormData({
                      name: '',
                      nameHindi: '',
                      categoryId: categories[0]?.id || 'cat_atta',
                      unit: 'packet',
                      sellingPrice: '',
                      costPrice: '',
                      mrp: '',
                      currentStock: '10',
                      minThreshold: '5',
                      barcode: '',
                      brand: '',
                      batchNo: 'B2609X',
                      expiryDate: '2027-03-31',
                      shelfLocation: 'Shelf A1'
                    });
                    setIsAddProductOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <Plus className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{isHi ? '+ नया सामान जोड़ें' : '+ Add Product'}</span>
                </button>

                <button
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <FolderPlus className="w-3.5 h-3.5 text-blue-300" />
                  <span>{isHi ? '+ नई श्रेणी' : '+ Category'}</span>
                </button>

                <button
                  onClick={() => loadCatalog()}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/15 transition-all shadow-sm cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
                  <span>{isHi ? 'रिफ्रेश' : 'Refresh'}</span>
                </button>
              </div>
            </div>

            {/* Search Bar & Categories Horizontal Slider */}
            <div className="space-y-3 pt-1">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isHi ? 'सामान का नाम, हिंदी नाम या बारकोड से खोजें...' : 'Search by item name, hindi or barcode...'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>

              {/* Category Capsule Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedCategory === 'All'
                      ? 'bg-slate-900 text-white shadow-md border border-white/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {selectedCategory === 'All' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                  <span>{isHi ? 'सभी सामान' : 'All Items'}</span>
                </button>

                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-slate-900 text-white shadow-md border border-white/20'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    {selectedCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                    <span>{isHi && cat.nameHindi ? cat.nameHindi : cat.name}</span>
                  </button>
                ))}

                <button
                  onClick={() => setIsAddCategoryOpen(true)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3 text-emerald-600" />
                  <span>{isHi ? '+ श्रेणी बनाएं' : '+ Add Category'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {successMsg && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Products Catalog Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">{isHi ? 'सामान (Product)' : 'Product'}</th>
                    <th className="py-3 px-4">{isHi ? 'श्रेणी (Category)' : 'Category'}</th>
                    <th className="py-3 px-4">{isHi ? 'सेलिंग प्राइस' : 'Selling Price'}</th>
                    <th className="py-3 px-4">{isHi ? 'लागत (Cost)' : 'Cost Price'}</th>
                    <th className="py-3 px-4">{isHi ? 'स्टॉक (Stock)' : 'Stock'}</th>
                    <th className="py-3 px-4">{isHi ? 'स्थिति' : 'Status'}</th>
                    <th className="py-3 px-4 text-right">{isHi ? 'कार्रवाई (Actions)' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400">
                        {loading ? (
                          <div className="flex items-center justify-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                            <span>{isHi ? 'सामान लोड हो रहे हैं...' : 'Loading catalog...'}</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Package className="w-8 h-8 text-slate-300 mx-auto" />
                            <p>{isHi ? 'कोई सामान नहीं मिला' : 'No products found'}</p>
                            <button
                              onClick={() => setIsAddProductOpen(true)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm"
                            >
                              <Plus className="w-3 h-3 text-emerald-400" />
                              <span>{isHi ? '+ पहला सामान जोड़ें' : '+ Add First Item'}</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ) : (
                    products.map((item) => {
                      const isLow = item.currentStock <= item.minThreshold;
                      const catObj = categories.find(c => c.id === item.categoryId);
                      const categoryDisplay = catObj 
                        ? (isHi && catObj.nameHindi ? catObj.nameHindi : catObj.name)
                        : (item.categoryName || 'General');

                      return (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900">
                              {formatProductTitle(item, lang)}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                              <span>SKU: {item.sku || 'N/A'}</span>
                              {item.barcode && <span>&bull; {item.barcode}</span>}
                              {item.brand && <span className="text-blue-600 font-semibold">&bull; {item.brand}</span>}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                              {categoryDisplay}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold font-mono text-blue-900">₹{item.sellingPrice}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-500">₹{item.costPrice || 0}</td>
                          <td className="py-3.5 px-4 font-bold font-mono">
                            <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>
                              {item.currentStock} {item.unit}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {isLow ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-extrabold">
                                <AlertTriangle className="w-3 h-3" />
                                {isHi ? 'कम स्टॉक' : 'Low Stock'}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                                <Check className="w-3 h-3" />
                                {isHi ? 'पर्याप्त' : 'In Stock'}
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              {/* Stock adjust pill */}
                              <button
                                onClick={() => openAdjustModal(item, 'RESTOCK')}
                                title={isHi ? 'स्टॉक बदलें' : 'Adjust Stock'}
                                className="h-7 px-2.5 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-bold border border-white/15 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Truck className="w-3 h-3 text-blue-300" />
                                <span>{isHi ? 'स्टॉक' : 'Stock'}</span>
                              </button>

                              {/* Edit product */}
                              <button
                                onClick={() => openEditModal(item)}
                                title={isHi ? 'संपादित करें' : 'Edit Product'}
                                className="h-7 w-7 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>

                              {/* Delete product */}
                              <button
                                onClick={() => setDeletingItem(item)}
                                title={isHi ? 'सामान हटाएं' : 'Delete Product'}
                                className="h-7 w-7 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 flex items-center justify-center transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* 1. Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center border border-white/20">
                  <Package className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {editingItem
                      ? (isHi ? 'सामान संपादित करें' : 'Edit Product')
                      : (isHi ? 'नया सामान जोड़ें' : 'Add New Product')}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isHi ? 'किराना इन्वेंटरी व पीओएस कैटलॉग में शामिल होगा' : 'Will be visible in POS and inventory'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddProductOpen(false);
                  setEditingItem(null);
                }}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'सामान का नाम (English) *' : 'Product Name (English) *'}
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aashirvaad Atta 5kg"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'हिंदी नाम (Hindi Name)' : 'Hindi Name'}
                  </label>
                  <input
                    type="text"
                    value={formData.nameHindi}
                    onChange={(e) => setFormData({ ...formData, nameHindi: e.target.value })}
                    placeholder="उदा: आशीर्वाद आटा 5 किलो"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Category & Unit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {isHi ? 'श्रेणी (Category) *' : 'Category *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddCategoryOpen(true)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{isHi ? 'नई श्रेणी' : 'New'}</span>
                    </button>
                  </div>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {isHi && cat.nameHindi ? cat.nameHindi : cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'यूनिट (Unit)' : 'Unit'}
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    <option value="packet">पैकेट (Packet)</option>
                    <option value="kg">किलो (Kg)</option>
                    <option value="g">ग्राम (Gram)</option>
                    <option value="litre">लीटर (Litre)</option>
                    <option value="bottle">बोतल (Bottle)</option>
                    <option value="pouch">पाउच (Pouch)</option>
                    <option value="bag">बैग (Bag / बोरी)</option>
                    <option value="box">बॉक्स (Box)</option>
                    <option value="tin">टिन (Tin)</option>
                    <option value="piece">पीस (Piece)</option>
                  </select>
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'बिक्री मूल्य (₹) *' : 'Selling Price *'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'खरीद मूल्य (₹)' : 'Cost Price'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="0.00"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'MRP (₹)' : 'MRP'}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.mrp}
                    onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
                    placeholder="0.00"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Stock and Threshold */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'आरंभिक स्टॉक (Stock)' : 'Current Stock'}
                  </label>
                  <input
                    type="number"
                    value={formData.currentStock}
                    onChange={(e) => setFormData({ ...formData, currentStock: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'कम स्टॉक अलर्ट सीमा' : 'Min Alert Threshold'}
                  </label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Batch No & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'बैच नंबर (Batch No)' : 'Batch No'}
                  </label>
                  <input
                    type="text"
                    value={formData.batchNo}
                    onChange={(e) => setFormData({ ...formData, batchNo: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'एक्सपायरी दिनांक' : 'Expiry Date'}
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'रैक / शेल्फ' : 'Shelf Rack'}
                  </label>
                  <input
                    type="text"
                    value={formData.shelfLocation}
                    onChange={(e) => setFormData({ ...formData, shelfLocation: e.target.value })}
                    placeholder="Rack A1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Barcode & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {isHi ? 'बारकोड (Barcode)' : 'Barcode'}
                    </label>
                    <button
                      type="button"
                      onClick={generateBarcode}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {isHi ? 'ऑटो बनाएं' : 'Auto Generate'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="890..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHi ? 'ब्रांड (Brand)' : 'Brand'}
                  </label>
                  <input
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="e.g. Amul, ITC, Tata"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddProductOpen(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span>{editingItem ? (isHi ? 'अपडेट करें' : 'Update Item') : (isHi ? 'सामान सेव करें' : 'Save Product')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Custom Category Modal */}
      {isAddCategoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center border border-white/20">
                  <FolderPlus className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {isHi ? 'नई श्रेणी बनाएं' : 'Create New Category'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {isHi ? 'कैटलॉग और पीओएस में दिखाई देगी' : 'Visible across POS & Catalog'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddCategoryOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'श्रेणी का नाम (English) *' : 'Category Name (English) *'}
                </label>
                <input
                  type="text"
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  placeholder="e.g. Frozen Foods & Ice Creams"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'हिंदी नाम (Hindi Name)' : 'Hindi Name'}
                </label>
                <input
                  type="text"
                  value={catFormData.nameHindi}
                  onChange={(e) => setCatFormData({ ...catFormData, nameHindi: e.target.value })}
                  placeholder="उदा: फ्रोजन फूड व आइसक्रीम"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddCategoryOpen(false)}
                  className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span>{isHi ? 'श्रेणी बनाएं' : 'Create'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-slate-900 text-base">
                {isHi ? 'सामान हटाएं?' : 'Delete Product?'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi 
                  ? `क्या आप "${deletingItem.name}" को कैटलॉग से स्थायी रूप से हटाना चाहते हैं?` 
                  : `Are you sure you want to remove "${deletingItem.name}" from the catalog?`}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 h-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                {isHi ? 'हां, हटाएं' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Smart Stock Adjustment Modal with Wastage / Restock Type */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    {isHi ? 'स्टॉक एडजस्टमेंट' : 'Adjust Stock'}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {adjustingItem.hindi || adjustingItem.name}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center font-bold cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              {/* 3 Adjustment Mode Pills */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isHi ? 'एडजस्टमेंट का प्रकार चुनें:' : 'Select Adjustment Mode:'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustType('RESTOCK');
                      setAdjustDelta('5');
                      setAdjustReason(isHi ? 'सप्लायर से ताजा माल आया' : 'Supplier Restock');
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                      adjustType === 'RESTOCK'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">➕</span>
                    <span>{isHi ? 'री-स्टॉक (+)' : 'Restock (+)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdjustType('DAMAGE');
                      setAdjustDelta('1');
                      setAdjustReason(isHi ? 'खराब / डैमेज / वेस्टेज' : 'Damaged / Wastage');
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                      adjustType === 'DAMAGE'
                        ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">➖</span>
                    <span>{isHi ? 'डैमेज (-)' : 'Damage (-)'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAdjustType('CORRECTION');
                      setAdjustDelta(String(adjustingItem.currentStock));
                      setAdjustReason(isHi ? 'दुकान का भौतिक स्टॉक सुधार' : 'Inventory Audit Count');
                    }}
                    className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                      adjustType === 'CORRECTION'
                        ? 'bg-blue-50 border-blue-500 text-blue-900 ring-2 ring-blue-300 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-sm">✏️</span>
                    <span>{isHi ? 'सीधा सेट' : 'Set Exact'}</span>
                  </button>
                </div>
              </div>

              {/* Quantity Input with Quick Preset Chips */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700">
                    {adjustType === 'RESTOCK'
                      ? (isHi ? 'बढ़ाने की मात्रा (Add Qty):' : 'Quantity to Add:')
                      : adjustType === 'DAMAGE'
                      ? (isHi ? 'घटाने की मात्रा (Deduct Qty):' : 'Quantity to Deduct:')
                      : (isHi ? 'नया सटीक स्टॉक (New Exact Stock):' : 'Exact Count on Shelf:')}
                  </label>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {isHi ? 'इकाई' : 'Unit'}: {adjustingItem.unit || 'packet'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={adjustDelta}
                    onChange={(e) => setAdjustDelta(e.target.value)}
                    className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-base font-mono font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    required
                  />
                  {adjustType !== 'CORRECTION' && (
                    <div className="flex items-center gap-1">
                      {['1', '5', '10', '20'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setAdjustDelta(val)}
                          className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold cursor-pointer transition-colors"
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Live Preview Card */}
              {(() => {
                const current = typeof adjustingItem.currentStock === 'number' ? adjustingItem.currentStock : parseFloat(adjustingItem.currentStock) || 0;
                const val = parseFloat(adjustDelta) || 0;
                let calculated = current;
                if (adjustType === 'RESTOCK') calculated = current + Math.abs(val);
                else if (adjustType === 'DAMAGE') calculated = Math.max(0, current - Math.abs(val));
                else if (adjustType === 'CORRECTION') calculated = Math.max(0, val);

                return (
                  <div className="p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-950">
                      {isHi ? 'नया अनुमानित स्टॉक:' : 'Resulting Stock:'}
                    </span>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-500 line-through">{current} {adjustingItem.unit}</span>
                      <span className="font-black text-indigo-700 text-sm bg-white px-2 py-0.5 rounded-lg border border-indigo-200">
                        ➔ {calculated} {adjustingItem.unit}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Batch No, Shelf Location & Expiry Date (Editable on Restock / Adjustment) */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHi ? 'एक्सपायरी दिनांक (Expiry):' : 'Expiry Date:'}
                    </label>
                    <input
                      type="date"
                      value={adjustExpiryDate}
                      onChange={(e) => setAdjustExpiryDate(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 45);
                          setAdjustExpiryDate(d.toISOString().split('T')[0]);
                          setAdjustBatchNo(`B2609${Math.floor(10 + Math.random() * 90)}`);
                        }}
                        className="text-[10px] font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 transition-colors cursor-pointer"
                      >
                        {isHi ? '🔄 +45 दिन (ताजा बैच)' : '🔄 +45d Fresh'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setDate(d.getDate() + 180);
                          setAdjustExpiryDate(d.toISOString().split('T')[0]);
                        }}
                        className="text-[10px] font-bold text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200 transition-colors cursor-pointer"
                      >
                        {isHi ? '+6 माह' : '+6 Mos'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {isHi ? 'बैच नंबर (Batch No):' : 'Batch No:'}
                    </label>
                    <input
                      type="text"
                      value={adjustBatchNo}
                      onChange={(e) => setAdjustBatchNo(e.target.value)}
                      placeholder="B2609A"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />

                    <label className="block text-xs font-bold text-slate-700 mt-2 mb-1">
                      {isHi ? 'रैक / शेल्फ स्थान:' : 'Shelf / Rack Location:'}
                    </label>
                    <input
                      type="text"
                      value={adjustShelfLocation}
                      onChange={(e) => setAdjustShelfLocation(e.target.value)}
                      placeholder="Rack A1"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Reason Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHi ? 'कारण / नोट (वैकल्पिक):' : 'Reason / Note (Optional):'}
                </label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder={isHi ? 'उदा: नया माल आया, पैकेट डैमेज, आदि' : 'e.g. Fresh stock, packaging tear, etc.'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="flex-1 h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span>{isHi ? 'स्टॉक अपडेट करें' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
