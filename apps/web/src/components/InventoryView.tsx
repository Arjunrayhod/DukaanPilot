import React, { useState, useEffect } from 'react';
import { 
  Search, Barcode, AlertTriangle, ArrowUpDown, Package, Check, RefreshCw, 
  Plus, Truck, Filter, Trash2, Edit3, FolderPlus, Sparkles, X, Tag, DollarSign, Layers
} from 'lucide-react';
import { fetchProducts, adjustStock, createProduct, updateProduct, deleteProduct, fetchCategories, createCategory } from '../services/api';
import { Lang, translations } from '../i18n/translations';
import { formatProductTitle, getCleanHindiName } from '../utils/productFormat';
import { SupplierManagementView } from './SupplierManagementView';

interface InventoryViewProps {
  lang?: Lang;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ lang = 'hi' }) => {
  const t = translations[lang];

  const [inventorySubTab, setInventorySubTab] = useState<'catalog' | 'suppliers'>('catalog');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);

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
    brand: ''
  });

  // Form states - Add Category
  const [catFormData, setCatFormData] = useState({
    name: '',
    nameHindi: '',
    icon: 'package'
  });

  // Stock adjust state
  const [adjustDelta, setAdjustDelta] = useState('5');
  const [adjustReason, setAdjustReason] = useState('Fresh Delivery Restock');
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
      showNotification(lang === 'hi' ? `नई श्रेणी जोड़ी गई: ${res.data.nameHindi || res.data.name}` : `New category added: ${res.data.name}`);
    } else {
      showNotification(res.error?.message || 'Failed to add category', true);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.sellingPrice) {
      showNotification(lang === 'hi' ? 'कृपया सामान का नाम और सेलिंग प्राइस भरें' : 'Please provide product name and price', true);
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
        showNotification(lang === 'hi' ? `सामान अपडेट हुआ: ${payload.name}` : `Product updated: ${payload.name}`);
        setEditingItem(null);
        setIsAddProductOpen(false);
        loadCatalog();
      } else {
        showNotification(res.error?.message || 'Update failed', true);
      }
    } else {
      const res = await createProduct(payload);
      if (res.success) {
        showNotification(lang === 'hi' ? `नया सामान जोड़ा गया: ${payload.name}` : `New product added: ${payload.name}`);
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
          brand: ''
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
      showNotification(lang === 'hi' ? `सामान हटाया गया: ${deletingItem.name}` : `Product removed: ${deletingItem.name}`);
      setDeletingItem(null);
      loadCatalog();
    } else {
      showNotification(res.error?.message || 'Delete failed', true);
    }
  };

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    const deltaNum = parseFloat(adjustDelta) || 0;
    const res = await adjustStock(adjustingItem.id, deltaNum, adjustReason);
    if (res.success) {
      showNotification(lang === 'hi' ? `स्टॉक अपडेट हुआ: ${adjustingItem.name} (${deltaNum > 0 ? '+' : ''}${deltaNum})` : `Stock updated for ${adjustingItem.name} (${deltaNum > 0 ? '+' : ''}${deltaNum})`);
      setAdjustingItem(null);
      loadCatalog();
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
      brand: item.brand || ''
    });
    setIsAddProductOpen(true);
  };

  const generateBarcode = () => {
    setFormData(prev => ({
      ...prev,
      barcode: '890' + Math.floor(1000000000 + Math.random() * 9000000000)
    }));
  };

  return (
    <div className="space-y-4">
      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-200/70 border border-slate-300/50 w-fit">
        <button
          type="button"
          onClick={() => setInventorySubTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            inventorySubTab === 'catalog'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4 text-blue-700" />
          <span>{lang === 'hi' ? 'सामान व श्रेणी कैटलॉग' : 'Product Catalog'}</span>
        </button>
        <button
          type="button"
          onClick={() => setInventorySubTab('suppliers')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            inventorySubTab === 'suppliers'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Truck className="w-4 h-4 text-indigo-600" />
          <span>{lang === 'hi' ? 'सप्लायर व री-स्टॉक PO (WhatsApp)' : 'Suppliers & Restock PO'}</span>
        </button>
      </div>

      {inventorySubTab === 'suppliers' ? (
        <SupplierManagementView lang={lang} />
      ) : (
        <>
          {/* Header with Search & Top Capsule Buttons */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-700" />
                  <span>{lang === 'hi' ? 'सामान व श्रेणी कस्टमाइजेशन' : 'Product & Category OS'}</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {lang === 'hi' ? 'दुकानदार नया सामान जोड़ सकते हैं, हटा सकते हैं और नई श्रेणियां बना सकते हैं' : 'Add, edit, remove products and create custom categories'}
                </p>
              </div>

          {/* Transparent Capsule Action Pills */}
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
                  brand: ''
                });
                setIsAddProductOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <Plus className="w-3.5 h-3.5 text-emerald-300" />
              <span>{lang === 'hi' ? '+ नया सामान जोड़ें' : '+ Add Product'}</span>
            </button>

            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <FolderPlus className="w-3.5 h-3.5 text-blue-300" />
              <span>{lang === 'hi' ? '+ नई श्रेणी' : '+ Category'}</span>
            </button>

            <button
              onClick={() => loadCatalog()}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-bold bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/15 transition-all shadow-sm cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-300 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{lang === 'hi' ? 'रिफ्रेश' : 'Refresh'}</span>
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
              placeholder={lang === 'hi' ? 'सामान का नाम, हिंदी नाम या बारकोड से खोजें...' : 'Search by item name, hindi or barcode...'}
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
              <span>{lang === 'hi' ? 'सभी सामान (All)' : 'All Items'}</span>
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
                <span>{lang === 'hi' && cat.nameHindi ? cat.nameHindi : cat.name}</span>
              </button>
            ))}

            <button
              onClick={() => setIsAddCategoryOpen(true)}
              className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3 text-emerald-600" />
              <span>{lang === 'hi' ? '+ श्रेणी बनाएं' : '+ Add Category'}</span>
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
                <th className="py-3 px-4">{lang === 'hi' ? 'सामान (Product)' : 'Product'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'श्रेणी (Category)' : 'Category'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'सेलिंग प्राइस' : 'Selling Price'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'लागत (Cost)' : 'Cost Price'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'स्टॉक (Stock)' : 'Stock'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{lang === 'hi' ? 'कार्रवाई (Actions)' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                        <span>{lang === 'hi' ? 'सामान लोड हो रहे हैं...' : 'Loading catalog...'}</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Package className="w-8 h-8 text-slate-300 mx-auto" />
                        <p>{lang === 'hi' ? 'कोई सामान नहीं मिला' : 'No products found'}</p>
                        <button
                          onClick={() => setIsAddProductOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-900 text-white shadow-sm"
                        >
                          <Plus className="w-3 h-3 text-emerald-400" />
                          <span>{lang === 'hi' ? '+ पहला सामान जोड़ें' : '+ Add First Item'}</span>
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
                    ? (lang === 'hi' && catObj.nameHindi ? catObj.nameHindi : catObj.name)
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
                            {lang === 'hi' ? 'कम स्टॉक' : 'Low Stock'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                            <Check className="w-3 h-3" />
                            {lang === 'hi' ? 'पर्याप्त' : 'In Stock'}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Stock adjust pill */}
                          <button
                            onClick={() => setAdjustingItem(item)}
                            title={lang === 'hi' ? 'स्टॉक बदलें' : 'Adjust Stock'}
                            className="h-7 px-2.5 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-[11px] font-bold border border-white/15 shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Truck className="w-3 h-3 text-blue-300" />
                            <span>{lang === 'hi' ? 'स्टॉक' : 'Stock'}</span>
                          </button>

                          {/* Edit product */}
                          <button
                            onClick={() => openEditModal(item)}
                            title={lang === 'hi' ? 'संपादित करें' : 'Edit Product'}
                            className="h-7 w-7 rounded-full bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>

                          {/* Delete product */}
                          <button
                            onClick={() => setDeletingItem(item)}
                            title={lang === 'hi' ? 'सामान हटाएं' : 'Delete Product'}
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
                      ? (lang === 'hi' ? 'सामान संपादित करें (Edit Product)' : 'Edit Product')
                      : (lang === 'hi' ? 'नया सामान जोड़ें (Add Product)' : 'Add New Product')}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {lang === 'hi' ? 'किराना इन्वेंटरी व पीओएस कैटलॉग में शामिल होगा' : 'Will be visible in POS and inventory'}
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
                    {lang === 'hi' ? 'सामान का नाम (English) *' : 'Product Name (English) *'}
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
                    {lang === 'hi' ? 'हिंदी नाम (Hindi Name)' : 'Hindi Name'}
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
                      {lang === 'hi' ? 'श्रेणी (Category) *' : 'Category *'}
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsAddCategoryOpen(true)}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5 cursor-pointer"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>{lang === 'hi' ? 'नई श्रेणी' : 'New'}</span>
                    </button>
                  </div>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {lang === 'hi' && cat.nameHindi ? cat.nameHindi : cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {lang === 'hi' ? 'यूनिट (Unit)' : 'Unit'}
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
                    {lang === 'hi' ? 'बिक्री मूल्य (₹) *' : 'Selling Price *'}
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
                    {lang === 'hi' ? 'खरीद मूल्य (₹)' : 'Cost Price'}
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
                    {lang === 'hi' ? 'MRP (₹)' : 'MRP'}
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
                    {lang === 'hi' ? 'आरंभिक स्टॉक (Stock)' : 'Current Stock'}
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
                    {lang === 'hi' ? 'कम स्टॉक अलर्ट सीमा' : 'Min Alert Threshold'}
                  </label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Barcode & Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-slate-700">
                      {lang === 'hi' ? 'बारकोड (Barcode)' : 'Barcode'}
                    </label>
                    <button
                      type="button"
                      onClick={generateBarcode}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
                    >
                      {lang === 'hi' ? 'ऑटो बनाएं' : 'Auto Generate'}
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
                    {lang === 'hi' ? 'ब्रांड (Brand)' : 'Brand'}
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
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span>{editingItem ? (lang === 'hi' ? 'अपडेट करें' : 'Update Item') : (lang === 'hi' ? 'सामान सेव करें' : 'Save Product')}</span>
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
                    {lang === 'hi' ? 'नई श्रेणी बनाएं' : 'Create New Category'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {lang === 'hi' ? 'कैटलॉग और पीओएस में दिखाई देगी' : 'Visible across POS & Catalog'}
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
                  {lang === 'hi' ? 'श्रेणी का नाम (English) *' : 'Category Name (English) *'}
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
                  {lang === 'hi' ? 'हिंदी नाम (Hindi Name)' : 'Hindi Name'}
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
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span>{lang === 'hi' ? 'श्रेणी बनाएं' : 'Create'}</span>
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
                {lang === 'hi' ? 'सामान हटाएं?' : 'Delete Product?'}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === 'hi' 
                  ? `क्या आप "${deletingItem.name}" को कैटलॉग से स्थायी रूप से हटाना चाहते हैं?` 
                  : `Are you sure you want to remove "${deletingItem.name}" from the catalog?`}
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingItem(null)}
                className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 h-10 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                {lang === 'hi' ? 'हां, हटाएं' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'स्टॉक स्तर बदलें' : 'Adjust Stock Level'}
                </h3>
                <span className="text-xs text-slate-500 font-medium">{adjustingItem.name} (वर्तमान: {adjustingItem.currentStock} {adjustingItem.unit})</span>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'मात्रा (Quantity Delta e.g. +10 or -5):' : 'Quantity (+/-):'}
                </label>
                <input
                  type="number"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {lang === 'hi' ? 'कारण (Reason):' : 'Reason:'}
                </label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="Fresh Delivery Restock">Fresh Delivery Restock (नई डिलीवरी)</option>
                  <option value="Physical Audit Correction">Physical Audit (स्टॉक मिलान)</option>
                  <option value="Damaged / Expired">Damaged / Expired (खराब/एक्सपायर्ड)</option>
                  <option value="Customer Return">Customer Return (ग्राहक वापसी)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                  <span>{lang === 'hi' ? 'सेव करें' : 'Save Stock'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
