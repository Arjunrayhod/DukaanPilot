import React, { useState } from 'react';
import {
  Search,
  Barcode,
  Mic,
  Plus,
  Minus,
  Trash2,
  Printer,
  MessageSquare,
  CreditCard,
  Banknote,
  QrCode,
  BookOpen,
  User,
} from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  hindi: string;
  price: number;
  qty: number;
  unit: string;
}

export const PosBillingView: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([
    { id: 1, name: 'Amul Taaza Milk 500ml', hindi: '???? ???? ???', price: 27, qty: 3, unit: 'pkts' },
    { id: 2, name: 'Madhur Pure Sugar 1kg', hindi: '???? ????', price: 48, qty: 2, unit: 'kg' },
    { id: 3, name: 'Britannia Daily Bread 400g', hindi: '?????????? ?????', price: 45, qty: 1, unit: 'pkt' },
    { id: 4, name: 'Aashirvaad Atta 10kg', hindi: '???????? ???', price: 420, qty: 1, unit: 'bag' },
    { id: 5, name: 'Fortune Mustard Oil 1L', hindi: '????????? ????? ???', price: 138, qty: 1, unit: 'btl' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [voiceInput, setVoiceInput] = useState('3 packet doodh, 2 kg cheeni, 1 bread add karo');

  const categories = ['All', 'Atta & Flour', 'Edible Oil', 'Spices & Masala', 'Dairy & Eggs', 'Snacks & Namkeen'];

  const catalog = [
    { id: 1, name: 'Aashirvaad Shudh Atta 10kg', price: 420, stock: 4, category: 'Atta & Flour', unit: 'bag' },
    { id: 2, name: 'Fortune Mustard Oil 1L', price: 145, stock: 12, category: 'Edible Oil', unit: 'btl' },
    { id: 3, name: 'Amul Taaza Fresh Milk 500ml', price: 27, stock: 35, category: 'Dairy & Eggs', unit: 'pkt' },
    { id: 4, name: 'Madhur Pure Sugar 1kg', price: 48, stock: 50, category: 'All', unit: 'kg' },
    { id: 5, name: 'Parle-G Gold Biscuits 1kg', price: 110, stock: 24, category: 'Snacks & Namkeen', unit: 'pack' },
    { id: 6, name: 'Tata Salt Vacuum Evaporated 1kg', price: 28, stock: 40, category: 'Spices & Masala', unit: 'pkt' },
  ];

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const addItemToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.id === item.id);
      if (existing) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      }
      return [...prev, { id: item.id, name: item.name, hindi: '', price: item.price, qty: 1, unit: item.unit }];
    });
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-2">
      {/* Center 8 Columns: Catalog & Voice POS Command */}
      <div className="lg:col-span-8 space-y-4">
        {/* Top Voice POS Command Bar */}
        <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="p-3 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-amber-300 shadow-inner animate-pulse">
              <Mic className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-300">
                  AI Voice POS Active (Spacebar to Speak)
                </span>
                <span className="bg-emerald-800 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                  3 items auto-detected
                </span>
              </div>
              <p className="text-sm font-semibold text-emerald-50 mt-0.5">"{voiceInput}"</p>
            </div>
          </div>
          <button className="bg-amber-400 hover:bg-amber-500 text-slate-950 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
            Process Voice
          </button>
        </div>

        {/* Search & Barcode Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search item by name, brand or barcode... (Press /)"
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition-all"
              />
            </div>
            <button className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl text-xs font-bold shadow-sm transition-colors">
              <Barcode className="w-4 h-4" />
              <span>F2: Barcode</span>
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {catalog.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:border-emerald-500 transition-colors flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-900 block line-clamp-2">{item.name}</span>
                <span className="text-[11px] text-slate-500 font-medium">{item.category}</span>
              </div>
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                <span className="text-sm font-extrabold text-slate-900 font-display">?{item.price}</span>
                <button
                  onClick={() => addItemToCart(item)}
                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-all active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 4 Columns: Active Cart & Checkout Panel */}
      <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
        <div>
          {/* Bill Header & Customer Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Current Bill #2048</span>
              <span className="text-[10px] text-slate-400">Counter #1 • Fast POS</span>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              Cart Active
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl p-2.5 my-3 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Ramesh Kumar</span>
                <span className="text-[10px] text-amber-700 font-semibold">Khata: ?1,450 Pending</span>
              </div>
            </div>
            <button className="text-[11px] font-bold text-emerald-700 hover:underline">Change</button>
          </div>

          {/* Itemized Cart Table */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-slate-100 text-xs">
                <div className="flex-1 pr-2">
                  <span className="font-semibold text-slate-900 block truncate">{item.name}</span>
                  <span className="text-[10px] text-slate-400">
                    ?{item.price} / {item.unit}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 bg-slate-100 rounded-lg p-0.5">
                    <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-slate-200 rounded">
                      <Minus className="w-3 h-3 text-slate-600" />
                    </button>
                    <span className="px-1.5 font-bold text-slate-900 text-xs">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-slate-200 rounded">
                      <Plus className="w-3 h-3 text-slate-600" />
                    </button>
                  </div>
                  <span className="font-bold text-slate-900 w-12 text-right">?{item.price * item.qty}</span>
                  <button onClick={() => removeItem(item.id)} className="text-slate-400 hover:text-red-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Summary & Tender Actions */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <div className="flex justify-between items-baseline">
            <span className="text-xs text-slate-500 font-medium">Total Payable (??? ??? ????)</span>
            <span className="text-2xl font-extrabold font-display text-emerald-800">?{subtotal}</span>
          </div>

          {/* Payment Method Quick Grid */}
          <div className="grid grid-cols-3 gap-2">
            <button className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-500 transition-colors">
              <Banknote className="w-4 h-4 text-emerald-700 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Cash (F4)</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-500 transition-colors">
              <QrCode className="w-4 h-4 text-blue-700 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">UPI QR (F8)</span>
            </button>
            <button className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-500 transition-colors">
              <BookOpen className="w-4 h-4 text-amber-700 mb-1" />
              <span className="text-[11px] font-bold text-slate-800">Khata (F9)</span>
            </button>
          </div>

          {/* Checkout Triggers */}
          <button className="w-full flex items-center justify-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-bold text-sm shadow-md transition-colors">
            <Printer className="w-4 h-4" />
            <span>Complete & Print Bill (Enter)</span>
          </button>
          <button className="w-full flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-800 py-2 rounded-xl font-bold text-xs transition-colors">
            <MessageSquare className="w-3.5 h-3.5 text-green-700" />
            <span>Send Bill on WhatsApp (Alt+W)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
