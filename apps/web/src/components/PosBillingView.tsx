import React, { useState, useEffect } from 'react';
import {
  Search,
  Barcode,
  Mic,
  Plus,
  Minus,
  Trash2,
  Printer,
  MessageSquare,
  Banknote,
  QrCode,
  BookOpen,
  User,
  Zap,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Receipt,
  PauseCircle,
  HelpCircle,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import { Lang, translations } from '../i18n/translations';
import { getCleanHindiName } from '../utils/productFormat';

interface CartItem {
  id: string | number;
  name: string;
  hindi: string;
  price: number;
  qty: number;
  unit: string;
}

interface PosBillingViewProps {
  lang?: Lang;
}

export const PosBillingView: React.FC<PosBillingViewProps> = ({ lang = 'hi' }) => {
  const t = translations[lang];

  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'Amul Taaza Milk 500ml', hindi: 'अमूल ताजा दूध 500ml', price: 27, qty: 3, unit: 'packet' },
    { id: '2', name: 'Madhur Pure Sugar 1kg', hindi: 'मधुर चीनी 1kg', price: 48, qty: 2, unit: 'kg' },
    { id: '3', name: 'Britannia Daily Bread 400g', hindi: 'ब्रिटानिया ब्रेड 400g', price: 45, qty: 1, unit: 'packet' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'upi' | 'khata'>('upi');
  const [voiceInput, setVoiceInput] = useState('3 packet doodh, 2 kg cheeni, 1 bread add karo');
  const [isListening, setIsListening] = useState(false);
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const defaultCategories = [
    { id: 'All', name: 'All Items', nameHindi: 'सभी सामान (All)' },
    { id: 'cat_atta', name: 'Atta & Flour', nameHindi: 'आटा व दाल (Atta/Dal)' },
    { id: 'cat_oils', name: 'Edible Oil', nameHindi: 'तेल व घी (Edible Oils)' },
    { id: 'cat_spices', name: 'Spices & Masala', nameHindi: 'मसाले (Spices)' },
    { id: 'cat_dairy', name: 'Dairy & Bakery', nameHindi: 'डेयरी व दूध (Dairy)' },
    { id: 'cat_snacks', name: 'Snacks & Namkeen', nameHindi: 'नमकीन व बिस्कुट (Snacks)' },
  ];

  useEffect(() => {
    async function initData() {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetchProducts(barcodeQuery, selectedCategory),
        fetchCategories()
      ]);

      if (cRes.success && cRes.data && cRes.data.length > 0) {
        setCategories([{ id: 'All', name: 'All Items', nameHindi: 'सभी सामान (All)' }, ...cRes.data]);
      } else {
        setCategories(defaultCategories);
      }

      if (pRes.success && pRes.data?.items) {
        setProducts(pRes.data.items);
      }
      setLoading(false);
    }
    initData();
  }, [barcodeQuery, selectedCategory]);

  const updateQty = (id: string | number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: string | number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const addItemToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          hindi: item.nameHindi || item.hindi || '',
          price: item.sellingPrice || item.price,
          qty: 1,
          unit: item.unit || 'packet',
        },
      ];
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstAmount = Math.round(subtotal * 0.05);
  const grandTotal = subtotal + gstAmount;

  const handleCompleteBill = () => {
    alert(lang === 'hi' ? `बिल प्रिंट हो रहा है! कुल राशि: ₹${grandTotal}` : `Bill Printing! Total: ₹${grandTotal}`);
  };

  return (
    <div className="space-y-4">
      {/* 1. Desktop POS Hotkeys & Function Header Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-md border border-white/10 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 bg-slate-800 text-white px-3 py-1.5 rounded-full border border-white/15 font-bold shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
            <Receipt className="w-3.5 h-3.5 text-blue-300" />
            <span>F1: {lang === 'hi' ? 'नया बिल' : 'New Bill'}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-full border border-white/10 font-semibold">
            <Barcode className="w-3.5 h-3.5 text-slate-300" />
            <span>F2: {lang === 'hi' ? 'बारकोड' : 'Barcode'}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-full border border-white/10 font-semibold">
            <PauseCircle className="w-3.5 h-3.5 text-slate-300" />
            <span>F3: {lang === 'hi' ? 'होल्ड बिल' : 'Hold Cart'}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-full border border-white/10 font-semibold">
            <Banknote className="w-3.5 h-3.5 text-emerald-400" />
            <span>F4: {lang === 'hi' ? 'नकद' : 'Cash'}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-full border border-white/10 font-semibold">
            <QrCode className="w-3.5 h-3.5 text-blue-400" />
            <span>F8: {lang === 'hi' ? 'UPI QR' : 'UPI QR'}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 text-slate-200 px-3 py-1.5 rounded-full border border-white/10 font-semibold">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>F9: {lang === 'hi' ? 'खाता' : 'Khata'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 font-bold text-[11px] flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
            <span>{lang === 'hi' ? 'काउंटर #1 सक्रिय' : 'Counter #1 Online'}</span>
          </span>
        </div>
      </div>

      {/* 2. Main 2-Column POS Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column (8 of 12): Voice AI Input, Quick Search & Catalog Grid */}
        <div className="lg:col-span-8 space-y-4">
          {/* AI Voice Billing Action Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-2xl p-4 shadow-md border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setIsListening(!isListening)}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 ${
                  isListening
                    ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-300 animate-bounce'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/20'
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-300" />
                    {lang === 'hi' ? 'AI वॉइस बिलिंग (बोलकर तुरंत जोड़ें)' : 'AI Voice POS (Spacebar to Speak)'}
                  </span>
                  <span className="bg-white/15 text-blue-100 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                    {lang === 'hi' ? '3 सामान डिटेक्टेड' : '3 Items Auto-Detected'}
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-100 truncate mt-0.5">
                  {isListening
                    ? (lang === 'hi' ? 'सुन रहा हूं... "5kg आटा, 2L तेल और 1 bread जोड़ो"' : 'Listening... "5kg Atta, 2L Oil and 1 Bread"')
                    : `"${voiceInput}"`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                if (products.length > 0) {
                  addItemToCart(products[0]);
                  if (products[1]) addItemToCart(products[1]);
                }
              }}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-4 py-2 rounded-full text-xs font-black shadow-md shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{lang === 'hi' ? 'वॉइस जोड़ें' : 'Process Voice'}</span>
            </button>
          </div>

          {/* Search & Barcode Quick Input Bar */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={barcodeQuery}
                  onChange={(e) => setBarcodeQuery(e.target.value)}
                  placeholder={lang === 'hi' ? 'सामान का नाम, ब्रांड या बारकोड स्कैन करें... (Press /)' : 'Search item by name, brand or barcode... (Press /)'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>
              <button
                onClick={() => alert(lang === 'hi' ? 'बारकोड स्कैनर चालू है!' : 'Barcode Scanner Ready!')}
                className="flex items-center gap-1.5 bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 px-4 py-2.5 rounded-full text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                <Barcode className="w-4 h-4 text-slate-200" />
                <span>{lang === 'hi' ? 'F2: बारकोड स्कैन' : 'F2: Scan Barcode'}</span>
              </button>
            </div>

            {/* Category Quick Filter Chips - Transparent Capsule Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white shadow-md border border-white/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {selectedCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                  <span>{lang === 'hi' && cat.nameHindi ? cat.nameHindi : (cat.name || cat.label)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product Catalog Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products.length === 0 ? (
              <div className="col-span-4 py-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
                {loading ? (lang === 'hi' ? 'कैटलॉग लोड हो रहा है...' : 'Loading catalog...') : (lang === 'hi' ? 'कोई सामान नहीं मिला' : 'No products found')}
              </div>
            ) : (
              products.map((item) => (
                <div
                  key={item.id}
                  onClick={() => addItemToCart(item)}
                  className="bg-white border border-slate-200/90 hover:border-blue-500 rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group active:scale-[0.98]"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                      {lang === 'hi' ? getCleanHindiName(item) : item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-1">
                      {lang === 'hi' ? `स्टॉक: ${item.currentStock || item.stock || 0} ${item.unit}` : `Stock: ${item.currentStock || item.stock || 0} ${item.unit}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                    <span className="text-base font-extrabold text-blue-900 font-mono">₹{item.sellingPrice || item.price}</span>
                    <div className="w-7 h-7 rounded-full bg-slate-900/80 group-hover:bg-slate-900 text-white flex items-center justify-center transition-all border border-white/15">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column (4 of 12): Active Cart & Checkout Panel */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            {/* Bill Header & Customer Selector */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {lang === 'hi' ? 'चालू बिल #2048' : 'Current Bill #2048'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'फास्ट बिलिंग काउंटर' : 'Fast Checkout Counter'}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {cart.length} {lang === 'hi' ? 'आइटम्स' : 'Items'}
              </span>
            </div>

            {/* Customer Pill Selector */}
            <div className="bg-[#eff4ff] border border-blue-100 rounded-xl p-3 my-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-blue-200 text-blue-900 flex items-center justify-center font-bold text-xs shrink-0">
                  RK
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {lang === 'hi' ? 'रमेश कुमार (Ramesh)' : 'Ramesh Kumar'}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold block">
                    {lang === 'hi' ? 'खाता: ₹1,450 बकाया' : 'Khata: ₹1,450 Pending'}
                  </span>
                </div>
              </div>
              <button className="text-xs font-bold text-blue-700 hover:underline shrink-0">
                {lang === 'hi' ? 'बदलें' : 'Change'}
              </button>
            </div>

            {/* Cart Items Table */}
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs hover:bg-slate-100/70 transition-colors"
                >
                  <div className="flex-1 pr-2 min-w-0">
                    <span className="font-bold text-slate-900 block truncate">
                      {lang === 'hi' && item.hindi ? item.hindi : item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ₹{item.price} &times; {item.qty} {item.unit}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Qty +/- stepper */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 active:scale-90"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-slate-900 text-xs font-mono">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600 active:scale-90"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-extrabold text-slate-900 w-12 text-right font-mono">
                      ₹{item.price * item.qty}
                    </span>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Calculation & Checkout Triggers */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            {/* Subtotal & GST rows */}
            <div className="space-y-1 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{lang === 'hi' ? 'उप-कुल (Subtotal):' : 'Subtotal:'}</span>
                <span className="font-bold font-mono">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>{lang === 'hi' ? 'जीएसटी / GST (5%):' : 'GST (5%):'}</span>
                <span className="font-bold font-mono">₹{gstAmount}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  {lang === 'hi' ? 'कुल देय राशि (Grand Total)' : 'Grand Total'}
                </span>
                <span className="text-2xl font-extrabold text-blue-900 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setSelectedPayment('cash')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-xs font-bold ${
                  selectedPayment === 'cash'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600 mb-1" />
                <span>{lang === 'hi' ? 'नकद (F4)' : 'Cash (F4)'}</span>
              </button>

              <button
                onClick={() => setSelectedPayment('upi')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-xs font-bold ${
                  selectedPayment === 'upi'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-2 ring-blue-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600 mb-1" />
                <span>{lang === 'hi' ? 'UPI QR (F8)' : 'UPI QR (F8)'}</span>
              </button>

              <button
                onClick={() => setSelectedPayment('khata')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-xs font-bold ${
                  selectedPayment === 'khata'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm ring-2 ring-amber-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600 mb-1" />
                <span>{lang === 'hi' ? 'उधार (F9)' : 'Khata (F9)'}</span>
              </button>
            </div>

            {/* Big Action Buttons */}
            <button
              onClick={handleCompleteBill}
              className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'hi' ? 'प्रिंट & बिल पूरा करें (Enter)' : 'Complete & Print Bill (Enter)'}</span>
            </button>

            <button
              onClick={() => alert(lang === 'hi' ? 'WhatsApp पर रसीद भेजी गई!' : 'WhatsApp receipt sent!')}
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-2.5 rounded-xl font-bold text-xs transition-colors active:scale-95"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'hi' ? 'WhatsApp पर बिल भेजें (Alt+W)' : 'Send Bill on WhatsApp (Alt+W)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
