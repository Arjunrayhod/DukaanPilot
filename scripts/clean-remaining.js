const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const RS = '\u20B9'; // ₹

// 1. AuthModal.tsx
const authModalCode = `import React, { useState } from 'react';
import { Lock, Phone, Store, User, KeyRound, ArrowRight } from 'lucide-react';
import { loginUser, registerOwner } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [pin, setPin] = useState('1234');
  const [name, setName] = useState('Ramesh Ganesh');
  const [shopName, setShopName] = useState('Shree Ganesh Kirana Store');
  const [password, setPassword] = useState('securePass123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const res = await registerOwner({ phone, name, password, shopName, pin });
        if (res.success) {
          onSuccess(res.data);
          onClose();
        } else {
          setError(res.error?.message || 'Registration failed');
        }
      } else {
        const res = await loginUser(phone, pin, true);
        if (res.success) {
          onSuccess(res.data);
          onClose();
        } else {
          setError(res.error?.message || 'Login failed. Please check your credentials.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white flex items-center justify-center mx-auto mb-2 shadow-sm">
            <Store className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-display text-slate-900">
            {isRegister ? 'Register New Store (नया खाता)' : 'Merchant Fast Login (दुकानदार लॉगिन)'}
          </h3>
          <p className="text-xs text-slate-500">
            {isRegister
              ? 'AI-Powered Autonomous Local Business OS setup'
              : 'Enter your 10-digit mobile number and 4-digit PIN'}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Name (दुकान का नाम)</label>
                <div className="relative">
                  <Store className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. Shree Ganesh Kirana Store"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Owner Name (दुकानदार का नाम)</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    placeholder="e.g. Ramesh Ganesh"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (मोबाइल नंबर)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="10-digit number"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">4-Digit Quick PIN (पिन)</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs tracking-widest font-mono"
                placeholder="••••"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Password (पासवर्ड)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="Min 6 characters"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-xs shadow-md transition-colors disabled:opacity-50"
          >
            <span>{loading ? 'Processing...' : isRegister ? 'Register Store' : 'Login Securely'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="font-bold text-emerald-700 hover:underline"
          >
            {isRegister ? 'Already registered? Login' : 'New store? Create account'}
          </button>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
`;

// 2. InventoryView.tsx
const inventoryViewCode = `import React, { useState, useEffect } from 'react';
import { Search, Barcode, AlertTriangle, ArrowUpDown, Package, Check, RefreshCw } from 'lucide-react';
import { fetchProducts, adjustStock } from '../services/api';

export const InventoryView: React.FC = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<any | null>(null);
  const [adjustDelta, setAdjustDelta] = useState('5');
  const [adjustReason, setAdjustReason] = useState('Fresh Delivery Restock');
  const [successMsg, setSuccessMsg] = useState('');

  const categories = [
    { id: 'All', name: 'All Items (सभी सामान)' },
    { id: 'cat_atta', name: 'Atta & Rice (आटा-चावल)' },
    { id: 'cat_oils', name: 'Edible Oils (तेल-घी)' },
    { id: 'cat_spices', name: 'Spices (मसाले)' },
    { id: 'cat_dals', name: 'Pulses (दालें)' },
    { id: 'cat_dairy', name: 'Dairy & Bread (दूध-ब्रेड)' },
    { id: 'cat_snacks', name: 'Snacks & Biscuits (नमकीन)' },
    { id: 'cat_beverages', name: 'Tea & Coffee (चाय-कॉफी)' },
    { id: 'cat_cleaning', name: 'Cleaning & Household' },
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
      setSuccessMsg(\`Stock updated for \${adjustingItem.name} (\${deltaNum > 0 ? '+' : ''}\${deltaNum})\`);
      setAdjustingItem(null);
      loadCatalog();
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Search & Stats */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold font-display text-slate-900 flex items-center space-x-2">
              <Package className="w-5 h-5 text-emerald-700" />
              <span>Smart Inventory Management • स्टॉक एवं माल प्रबंधन</span>
            </h2>
            <p className="text-xs text-slate-500">
              {products.length} Products registered in catalog • Real-time stock tracking
            </p>
          </div>
          <button
            onClick={loadCatalog}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold self-start sm:self-auto"
          >
            <RefreshCw className={\`w-3.5 h-3.5 \${loading ? 'animate-spin' : ''}\`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Search & Barcode Quick Input */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product by name, brand, or barcode... (उदा. आटा, तेल, Parle-G)"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={\`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors \${
                selectedCategory === cat.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }\`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Product Catalog Table / Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((item) => {
          const isLow = item.currentStock <= item.minThreshold;
          return (
            <div
              key={item.id}
              className={\`bg-white border rounded-2xl p-4 shadow-sm flex flex-col justify-between transition-all \${
                isLow ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 hover:border-emerald-500'
              }\`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{item.name}</h4>
                    {item.nameHindi && (
                      <span className="text-xs text-slate-500 font-medium block">{item.nameHindi}</span>
                    )}
                  </div>
                  {isLow ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                      <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
                      Low Stock
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 shrink-0">
                      In Stock
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-50/80 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Selling Price</span>
                    <span className="font-extrabold text-slate-900 font-display">₹{item.sellingPrice}</span>
                    <span className="text-[10px] text-slate-400 ml-1">/ {item.unit}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">Current Stock</span>
                    <span className={\`font-extrabold font-display \${isLow ? 'text-red-600' : 'text-emerald-800'}\`}>
                      {item.currentStock} {item.unit}s
                    </span>
                    <span className="text-[10px] text-slate-400 block">Min: {item.minThreshold}</span>
                  </div>
                </div>

                {item.barcode && (
                  <div className="flex items-center text-[10px] text-slate-400 space-x-1 font-mono">
                    <Barcode className="w-3 h-3" />
                    <span>{item.barcode}</span>
                  </div>
                )}
              </div>

              {/* Adjust Stock Trigger */}
              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 truncate max-w-[150px]">
                  {item.supplierName || 'Direct Wholesale'}
                </span>
                <button
                  onClick={() => setAdjustingItem(item)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  <span>Update Stock</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Adjustment Modal */}
      {adjustingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block">
                Stock Adjustment Audit
              </span>
              <h3 className="text-lg font-bold font-display text-slate-900">{adjustingItem.name}</h3>
              <p className="text-xs text-slate-500">
                Current Stock: {adjustingItem.currentStock} {adjustingItem.unit}s
              </p>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Stock Change Delta (+ to Add, - to Deduct)
                </label>
                <input
                  type="number"
                  step="any"
                  required
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold font-mono"
                  placeholder="+10 or -2"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Adjustment Reason (कारण)</label>
                <select
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                >
                  <option value="Fresh Delivery Restock">Fresh Delivery Restock (नया माल आया)</option>
                  <option value="Damaged / Wastage">Damaged / Wastage (खराब / एक्सपायरी)</option>
                  <option value="Manual Physical Count Correction">Physical Count Correction (गिनती सुधार)</option>
                  <option value="Customer Return">Customer Return (वापसी)</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-md transition-colors"
                >
                  Confirm & Log Stock Change
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustingItem(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
`;

const files = {
  'apps/web/src/components/AuthModal.tsx': authModalCode,
  'apps/web/src/components/InventoryView.tsx': inventoryViewCode,
};

for (const [rel, val] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, rel), val, { encoding: 'utf8' });
  console.log('Cleaned file written:', rel);
}
