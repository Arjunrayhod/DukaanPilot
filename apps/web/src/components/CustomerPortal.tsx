import React, { useState } from 'react';
import {
  Store,
  QrCode,
  Receipt,
  ShoppingCart,
  Phone,
  MessageSquare,
  ChevronRight,
  Plus,
  Minus,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  ShoppingBag,
  Info,
} from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface CustomerPortalProps {
  lang: Lang;
  customer: {
    name: string;
    phone: string;
    khataDue: number;
    shopName: string;
    upiId: string;
  };
  onOpenQr: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  lang,
  customer,
  onOpenQr,
}) => {
  const t = translations[lang];
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'bills'>('overview');

  // Customer Catalog
  const [catalog, setCatalog] = useState([
    { id: 1, name: 'Aashirvaad Shudh Chakki Atta 10kg', hindi: 'आशीर्वाद शुद्ध चक्की आटा 10kg', price: 420, unit: '10 kg bag', category: 'Atta' },
    { id: 2, name: 'Madhur Pure & Hygienic Sugar 1kg', hindi: 'मधुर शुद्ध चीनी 1kg', price: 48, unit: '1 kg packet', category: 'Grocery' },
    { id: 3, name: 'Amul Taaza Fresh Toned Milk 500ml', hindi: 'अमूल ताजा दूध 500ml', price: 27, unit: '500 ml pouch', category: 'Dairy' },
    { id: 4, name: 'Fortune Sunlite Refined Sunflower Oil 1L', hindi: 'फॉर्च्यून रिफाइंड तेल 1L', price: 138, unit: '1 L pouch', category: 'Oils' },
    { id: 5, name: 'Tata Salt Vacuum Evaporated 1kg', hindi: 'टाटा नमक 1kg', price: 28, unit: '1 kg packet', category: 'Grocery' },
    { id: 6, name: 'Tata Tea Gold Premium Blend 500g', hindi: 'टाटा टी गोल्ड 500g', price: 280, unit: '500 g pack', category: 'Beverages' },
    { id: 7, name: 'Parle-G Gold Glucose Biscuits 1kg', hindi: 'पार्ले-जी गोल्ड बिस्कुट 1kg', price: 110, unit: '1 kg family pack', category: 'Snacks' },
    { id: 8, name: 'Everest Garam Masala 100g', hindi: 'एवरेस्ट गरम मसाला 100g', price: 82, unit: '100 g box', category: 'Spices' },
  ]);

  const [cart, setCart] = useState<Record<number, number>>({});

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) {
        updated[id] -= 1;
      } else {
        delete updated[id];
      }
      return updated;
    });
  };

  const cartTotalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const cartTotalPrice = Object.entries(cart).reduce((sum, [id, count]) => {
    const item = catalog.find((c) => c.id === Number(id));
    return sum + (item ? item.price * count : 0);
  }, 0);

  const handleSendWhatsAppOrder = () => {
    const itemsList = Object.entries(cart)
      .map(([id, count]) => {
        const item = catalog.find((c) => c.id === Number(id));
        return `- ${count}x ${item?.name} (₹${(item?.price || 0) * count})`;
      })
      .join('\n');

    const message = encodeURIComponent(
      `नमस्ते! मैं ${customer.name} (Phone: ${customer.phone}) श्री गणेश किराना से यह सामान ऑर्डर करना चाहता हूँ:\n\n${itemsList}\n\nकुल राशि: ₹${cartTotalPrice}\nकृपया तैयार रखें या डिलीवर करें। धन्यवाद!`
    );

    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

  // Previous bills
  const bills = [
    {
      id: 'INV-2026-0842',
      date: '16 Sep 2026, 06:30 PM',
      items: '2x Amul Milk, 1x Madhur Sugar 1kg, 1x Tata Salt',
      total: 130,
      mode: 'UPI',
      status: 'paid',
    },
    {
      id: 'INV-2026-0791',
      date: '12 Sep 2026, 11:15 AM',
      items: '1x Aashirvaad Atta 10kg, 1x Fortune Oil 1L',
      total: 558,
      mode: 'Khata Credit (उधार)',
      status: 'due',
    },
    {
      id: 'INV-2026-0610',
      date: '04 Sep 2026, 08:45 PM',
      items: '1x Tata Tea Gold 500g, 2x Parle-G Gold',
      total: 500,
      mode: 'Cash (नकद)',
      status: 'paid',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Customer Welcome & Shop Connected Card */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold text-blue-200 mb-2 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'hi' ? 'सत्यापित ग्राहक खाता' : 'Verified Customer Profile'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
              {t.customerGreeting}, {customer.name}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              {t.customerSubtitle} &bull; {customer.phone}
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0 shadow-inner">
            <Store className="w-6 h-6 text-blue-300" />
          </div>
        </div>

        {/* Connected Shop Strip */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-blue-300 font-medium">{lang === 'hi' ? 'दुकान:' : 'Shop:'}</span>
            <span className="font-bold text-white">{customer.shopName}</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              Open Now
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:9876543210"
              className="inline-flex items-center gap-1 text-[11px] font-bold bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-lg transition-colors"
            >
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>{t.callShop}</span>
            </a>
            <button
              onClick={onOpenQr}
              className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg hover:bg-emerald-400 transition-colors shadow-sm cursor-pointer"
            >
              <QrCode className="w-3 h-3" />
              <span>{lang === 'hi' ? 'दुकान QR' : 'Shop QR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Customer Navigation Tabs */}
      <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-blue-600" />
          <span>{lang === 'hi' ? 'मेरा खाता व समरी' : 'My Khata & Ledger'}</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>{lang === 'hi' ? 'दुकान का सामान' : 'Store Catalog'}</span>
          {cartTotalCount > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              {cartTotalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'bills'
              ? 'bg-white text-blue-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>{lang === 'hi' ? 'पुराने बिल' : 'My Bills'}</span>
        </button>
      </div>

      {/* 3. TAB 1: Overview & Personal Khata Balance */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Khata Balance Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.myKhataBalance}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-display text-rose-600">
                    ₹{customer.khataDue.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                    {lang === 'hi' ? 'देय बकाया' : 'Outstanding Due'}
                  </span>
                </div>
              </div>

              <button
                onClick={onOpenQr}
                className="flex items-center gap-1.5 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-emerald-300" />
                <span>{t.payNowViaUpi}</span>
              </button>
            </div>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{t.khataDueNotice}</span>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block text-[11px]">{lang === 'hi' ? 'अंतिम बिल' : 'Last Bill'}</span>
                <span className="font-bold text-slate-900 text-sm">₹130 (16 Sep)</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="text-slate-500 block text-[11px]">{lang === 'hi' ? 'कुल बिल काउंट' : 'Total Orders'}</span>
                <span className="font-bold text-slate-900 text-sm">8 {lang === 'hi' ? 'बिल' : 'bills'}</span>
              </div>
            </div>
          </div>

          {/* Recent Ledger History Preview */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'hi' ? 'हालिया लेन-देन (Recent Ledger History)' : 'Recent Ledger History'}
              </h3>
              <button
                onClick={() => setActiveTab('bills')}
                className="text-xs text-blue-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>{lang === 'hi' ? 'सभी देखें' : 'View All'}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {bills.map((b) => (
                <div key={b.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-bold text-slate-900">{b.id}</div>
                    <div className="text-slate-500 text-[11px] truncate max-w-[200px] sm:max-w-md">{b.items}</div>
                    <div className="text-slate-400 text-[10px]">{b.date}</div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono font-bold text-slate-900 text-sm">₹{b.total}</div>
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        b.status === 'paid'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {b.status === 'paid' ? t.paidStatus : t.dueStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB 2: Store Catalog & WhatsApp Order */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.customerCatalogTitle}</h3>
                <p className="text-xs text-slate-500">{t.customerCatalogSub}</p>
              </div>
              <div className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
                {catalog.length} {lang === 'hi' ? 'आइटम उपलब्ध' : 'Items Available'}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {catalog.map((item) => {
                const qtyInCart = cart[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {lang === 'hi' ? item.hindi : item.name}
                      </div>
                      <div className="text-[11px] text-slate-500">{item.unit}</div>
                      <div className="text-sm font-black font-display text-blue-900 mt-1">₹{item.price}</div>
                    </div>

                    <div className="shrink-0">
                      {qtyInCart === 0 ? (
                        <button
                          onClick={() => addToCart(item.id)}
                          className="h-8 px-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? 'जोड़ें' : 'Add'}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 p-1 rounded-xl">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-6 h-6 rounded-lg bg-white text-blue-900 font-bold flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 shadow-xs cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs text-blue-950 px-1">{qtyInCart}</span>
                          <button
                            onClick={() => addToCart(item.id)}
                            className="w-6 h-6 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center hover:bg-blue-800 shadow-xs cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Floating / Docked Strip */}
            {cartTotalCount > 0 && (
              <div className="mt-5 p-4 rounded-2xl bg-emerald-950 text-white flex items-center justify-between gap-3 shadow-xl animate-in slide-in-from-bottom-2">
                <div>
                  <div className="text-xs font-bold text-emerald-300">
                    {cartTotalCount} {t.itemsInCart}
                  </div>
                  <div className="text-lg font-black font-display text-white">
                    ₹{cartTotalPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={handleSendWhatsAppOrder}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-slate-950 fill-slate-950" />
                  <span>{t.sendOrderWhatsApp}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 3: My Bills */}
      {activeTab === 'bills' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">{t.myBillsTitle}</h3>
              <p className="text-xs text-slate-500">{t.myBillsSub}</p>
            </div>

            <div className="space-y-3">
              {bills.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{b.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {b.status === 'paid' ? t.paidStatus : t.dueStatus}
                      </span>
                    </div>
                    <span className="font-mono font-black text-base text-slate-900">₹{b.total}</span>
                  </div>

                  <div className="text-slate-600 text-xs">{b.items}</div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-400">
                    <span>{b.date} &bull; Mode: {b.mode}</span>
                    <button
                      onClick={() => alert(`Receipt for ${b.id}\nTotal: ₹${b.total}\nItems: ${b.items}`)}
                      className="text-blue-700 font-bold hover:underline cursor-pointer"
                    >
                      {t.billReceipt}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
