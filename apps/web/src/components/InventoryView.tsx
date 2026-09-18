import React, { useState, useEffect } from 'react';
import { Search, Barcode, AlertTriangle, ArrowUpDown, Package, Check, RefreshCw, Plus, Truck, Filter } from 'lucide-react';
import { fetchProducts, adjustStock } from '../services/api';
import { Lang, translations } from '../i18n/translations';

interface InventoryViewProps {
  lang?: Lang;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ lang = 'hi' }) => {
  const t = translations[lang];

  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<any | null>(null);
  const [adjustDelta, setAdjustDelta] = useState('5');
  const [adjustReason, setAdjustReason] = useState('Fresh Delivery Restock');
  const [successMsg, setSuccessMsg] = useState('');

  const categories = [
    { id: 'All', name: lang === 'hi' ? 'सभी सामान (All)' : 'All Items' },
    { id: 'cat_atta', name: lang === 'hi' ? 'आटा व चावल (Atta/Rice)' : 'Atta & Rice' },
    { id: 'cat_oils', name: lang === 'hi' ? 'तेल व घी (Oils)' : 'Edible Oils' },
    { id: 'cat_spices', name: lang === 'hi' ? 'मसाले (Spices)' : 'Spices' },
    { id: 'cat_dals', name: lang === 'hi' ? 'दालें (Pulses)' : 'Pulses' },
    { id: 'cat_dairy', name: lang === 'hi' ? 'डेयरी व ब्रेड (Dairy)' : 'Dairy & Bread' },
    { id: 'cat_snacks', name: lang === 'hi' ? 'नमकीन व बिस्कुट (Snacks)' : 'Snacks' },
    { id: 'cat_beverages', name: lang === 'hi' ? 'चाय व कॉफी (Tea/Coffee)' : 'Tea & Coffee' },
  ];

  async function loadCatalog() {
    setLoading(true);
    const res = await fetchProducts(search, selectedCategory);
    if (res.success && res.data) {
      setProducts(res.data.items || []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadCatalog();
  }, [search, selectedCategory]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingItem) return;
    const deltaNum = parseFloat(adjustDelta) || 0;
    const res = await adjustStock(adjustingItem.id, deltaNum, adjustReason);
    if (res.success) {
      setSuccessMsg(lang === 'hi' ? `स्टॉक अपडेट हुआ: ${adjustingItem.name} (${deltaNum > 0 ? '+' : ''}${deltaNum})` : `Stock updated for ${adjustingItem.name} (${deltaNum > 0 ? '+' : ''}${deltaNum})`);
      setAdjustingItem(null);
      loadCatalog();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Search & Stats */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-700" />
              <span>{lang === 'hi' ? 'इन्वेंटरी व स्टॉक मैनेजमेंट' : 'Inventory & Stock Management'}</span>
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              {lang === 'hi' ? 'लाइव स्टॉक लेजर, कम स्टॉक अलर्ट और 1-क्लिक रीस्टॉक' : 'Live stock ledger, low stock alerts and 1-click restock'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadCatalog()}
              className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              <span>{lang === 'hi' ? 'रिफ्रेश' : 'Refresh'}</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Categories */}
        <div className="space-y-3 pt-1">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={lang === 'hi' ? 'सामान का नाम या बारकोड से खोजें (Search by item name, hindi or barcode)...' : 'Search by item name or barcode...'}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-sm active:scale-95 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stock Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">{lang === 'hi' ? 'सामान (Product)' : 'Product'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'श्रेणी (Category)' : 'Category'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'MRP / मूल्य' : 'Price'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'स्टॉक (Stock)' : 'Stock'}</th>
                <th className="py-3 px-4">{lang === 'hi' ? 'स्थिति (Status)' : 'Status'}</th>
                <th className="py-3 px-4 text-right">{lang === 'hi' ? 'एक्शन' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-900">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {loading ? (lang === 'hi' ? 'सामान लोड हो रहे हैं...' : 'Loading catalog...') : (lang === 'hi' ? 'कोई सामान नहीं मिला' : 'No products found')}
                  </td>
                </tr>
              ) : (
                products.map((item) => {
                  const isLow = item.currentStock <= item.minThreshold;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {lang === 'hi' && item.hindiName ? `${item.hindiName} (${item.name})` : item.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">SKU: {item.sku} &bull; {item.barcode}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.category?.name || 'Kirana'}</td>
                      <td className="py-3 px-4 font-bold font-mono text-blue-900">₹{item.sellingPrice}</td>
                      <td className="py-3 px-4 font-bold font-mono">
                        <span className={isLow ? 'text-rose-600' : 'text-slate-900'}>
                          {item.currentStock} {item.unit}
                        </span>
                      </td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setAdjustingItem(item)}
                          className="h-8 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 font-bold text-xs transition-colors"
                        >
                          {lang === 'hi' ? 'स्टॉक बदलें' : 'Adjust'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  {lang === 'hi' ? 'स्टॉक अपडेट' : 'Adjust Stock Level'}
                </h3>
                <span className="text-xs text-slate-500 font-medium">{adjustingItem.name}</span>
              </div>
              <button
                onClick={() => setAdjustingItem(null)}
                className="text-slate-400 hover:text-slate-600 font-bold"
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
                  className="flex-1 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-colors"
                >
                  {lang === 'hi' ? 'सेव करें' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
