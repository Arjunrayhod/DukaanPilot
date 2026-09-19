import React, { useState, useEffect } from 'react';
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
  Search,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import { Lang, translations } from '../i18n/translations';
import { getCleanHindiName } from '../utils/productFormat';
import { saveOnlineOrder, formatWhatsAppOrderText, OnlineCustomerOrder } from '../utils/orderService';
import { speakHindi } from '../utils/voiceFeedback';

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
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Fallback catalog
  const defaultCatalog = [
    { id: '1', name: 'Aashirvaad Shudh Chakki Atta 10kg', hindi: 'आशीर्वाद शुद्ध चक्की आटा 10kg', price: 420, unit: '10 kg bag', category: 'cat_atta' },
    { id: '2', name: 'Madhur Pure & Hygienic Sugar 1kg', hindi: 'मधुर शुद्ध चीनी 1kg', price: 48, unit: '1 kg packet', category: 'cat_sugar' },
    { id: '3', name: 'Amul Taaza Fresh Toned Milk 500ml', hindi: 'अमूल ताजा दूध 500ml', price: 27, unit: '500 ml pouch', category: 'cat_dairy' },
    { id: '4', name: 'Fortune Sunlite Refined Sunflower Oil 1L', hindi: 'फॉर्च्यून रिफाइंड तेल 1L', price: 138, unit: '1 L pouch', category: 'cat_oils' },
    { id: '5', name: 'Tata Salt Vacuum Evaporated 1kg', hindi: 'टाटा नमक 1kg', price: 28, unit: '1 kg packet', category: 'cat_spices' },
    { id: '6', name: 'Tata Tea Gold Premium Blend 500g', hindi: 'टाटा टी गोल्ड 500g', price: 280, unit: '500 g pack', category: 'cat_beverages' },
    { id: '7', name: 'Parle-G Gold Glucose Biscuits 1kg', hindi: 'पार्ले-जी गोल्ड बिस्कुट 1kg', price: 110, unit: '1 kg pack', category: 'cat_snacks' },
    { id: '8', name: 'Everest Garam Masala 100g', hindi: 'एवरेस्ट गरम मसाला 100g', price: 82, unit: '100 g box', category: 'cat_spices' },
  ];

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetchProducts(search, selectedCategory),
        fetchCategories()
      ]);
      if (cRes.success && cRes.data && cRes.data.length > 0) {
        setCategories([{ id: 'All', name: 'All Items', nameHindi: 'सभी सामान' }, ...cRes.data]);
      }
      if (pRes.success && pRes.data?.items && pRes.data.items.length > 0) {
        setProducts(pRes.data.items);
      } else {
        setProducts(defaultCatalog);
      }
      setLoading(false);
    }
    loadData();
  }, [search, selectedCategory]);

  const [cart, setCart] = useState<Record<string, number>>({});

  const addToCart = (id: string) => {
    const item = products.find((c) => String(c.id) === String(id));
    if (item) {
      const itemName = lang === 'hi' ? getCleanHindiName(item) : item.name;
      speakHindi(lang === 'hi' ? `${itemName} कार्ट में जोड़ा गया` : `${item.name} added to cart`, lang);
    }
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
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
    const item = products.find((c) => String(c.id) === String(id));
    const price = item ? (item.sellingPrice || item.price || 0) : 0;
    return sum + price * count;
  }, 0);

  const handleSendWhatsAppOrder = () => {
    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderItems = Object.entries(cart).map(([id, count]) => {
      const item = products.find((c) => String(c.id) === String(id));
      const hindiTitle = item ? (item.hindi || item.nameHindi) : undefined;
      const name = item ? item.name : 'Item';
      const price = item ? (item.sellingPrice || item.price || 0) : 0;
      const unit = item ? (item.unit || 'packet') : 'packet';
      return {
        id: String(id),
        name,
        hindiName: hindiTitle,
        qty: count,
        unit,
        price,
        total: price * count,
      };
    });

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const newOrder: OnlineCustomerOrder = {
      id: `ord_${Date.now()}`,
      orderNumber,
      customerName: customer.name,
      customerPhone: customer.phone,
      items: orderItems,
      itemCount: cartTotalCount,
      totalAmount: cartTotalPrice,
      status: 'NEW',
      paymentStatus: 'COD',
      createdAt: `आज, ${timeStr}`,
      timestamp: Date.now(),
      notes: 'कस्टमर पोर्टल से प्राप्त ऑनलाइन आर्डर'
    };

    saveOnlineOrder(newOrder);

    const message = encodeURIComponent(
      formatWhatsAppOrderText(
        {
          orderNumber,
          customerName: customer.name,
          customerPhone: customer.phone,
          items: orderItems,
          totalAmount: cartTotalPrice,
          notes: 'कस्टमर पोर्टल से प्राप्त ऑनलाइन आर्डर'
        },
        customer.shopName || 'श्री गणेश किराना स्टोर'
      )
    );

    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${message}`, '_blank');
    setCart({});
    speakHindi(lang === 'hi' ? 'ऑर्डर व्हाट्सएप पर भेजा गया और दुकानदार डैशबोर्ड पर दर्ज हो गया है' : 'Order sent to WhatsApp and registered on merchant dashboard');
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
      date: '12 Sep 2026, 08:15 PM',
      items: '1x Aashirvaad Atta 10kg, 1x Fortune Oil 1L, 2x Parle-G',
      total: 750,
      mode: 'Khata',
      status: 'due',
    },
    {
      id: 'INV-2026-0689',
      date: '05 Sep 2026, 07:00 PM',
      items: '1x Everest Masala, 1x Tata Tea Gold 500g, 2x Amul Milk',
      total: 500,
      mode: 'Khata',
      status: 'due',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* 1. Customer Hero Card */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-7 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सत्यापित ग्राहक खाता' : 'Verified Customer Profile'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
              {t.customerGreeting}, {customer.name}
            </h2>
            <p className="text-xs text-blue-200 mt-0.5">
              {t.customerSubtitle} &bull; {customer.phone} &bull; <span className="text-emerald-300 font-semibold">{customer.shopName}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:9876543210"
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900/80 hover:bg-slate-900 px-3 py-1.5 rounded-full border border-white/15 text-white transition-all shadow-sm cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              <Phone className="w-3 h-3 text-emerald-300" />
              <span>{t.callShop}</span>
            </a>
            <button
              onClick={onOpenQr}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-slate-900/80 hover:bg-slate-900 px-3 py-1.5 rounded-full border border-white/15 text-white transition-all shadow-sm cursor-pointer"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <QrCode className="w-3 h-3 text-blue-300" />
              <span>{lang === 'hi' ? 'दुकान QR' : 'Shop QR'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Customer Navigation Tabs - Dark Translucent Pill Container */}
      <div className="flex items-center gap-2 bg-slate-900/85 backdrop-blur-xl p-1.5 rounded-full border border-white/15 shadow-md">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-white/20 text-white shadow-sm border border-white/15'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {activeTab === 'overview' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
          <Receipt className="w-3.5 h-3.5 text-blue-300" />
          <span>{lang === 'hi' ? 'मेरा खाता' : 'My Khata'}</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-white/20 text-white shadow-sm border border-white/15'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {activeTab === 'catalog' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
          <ShoppingBag className="w-3.5 h-3.5 text-emerald-300" />
          <span>{lang === 'hi' ? 'सामान ऑर्डर' : 'Catalog'}</span>
          {cartTotalCount > 0 && (
            <span className="bg-emerald-500 text-slate-950 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-black">
              {cartTotalCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          className={`flex-1 py-2 px-3 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'bills'
              ? 'bg-white/20 text-white shadow-sm border border-white/15'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {activeTab === 'bills' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
          <Clock className="w-3.5 h-3.5 text-amber-300" />
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
                {lang === 'hi' ? 'हालिया लेन-देन' : 'Recent Ledger History'}
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
        <div className={`space-y-4 ${cartTotalCount > 0 ? 'pb-24' : ''}`}>
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">{t.customerCatalogTitle}</h3>
                <p className="text-xs text-slate-500">{t.customerCatalogSub}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                  <span>{products.length} {lang === 'hi' ? 'आइटम' : 'Items'}</span>
                </div>
                {cartTotalCount > 0 && (
                  <button
                    onClick={handleSendWhatsAppOrder}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{cartTotalCount} {t.itemsInCart} (₹{cartTotalPrice})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Customer Search & Category Filter Pills */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={lang === 'hi' ? 'सामान खोजें...' : 'Search items...'}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
                />
              </div>

              {categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white shadow-sm border border-white/20'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
                      }`}
                    >
                      {selectedCategory === cat.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
                      <span>{lang === 'hi' && cat.nameHindi ? cat.nameHindi : (cat.name || cat.label)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {products.map((item) => {
                const qtyInCart = cart[String(item.id)] || 0;
                const price = item.sellingPrice || item.price || 0;
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-slate-900 truncate">
                        {lang === 'hi' ? getCleanHindiName(item) : item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">{item.unit || 'packet'}</div>
                      <div className="text-sm font-black font-display text-blue-900 mt-1 font-mono">₹{price}</div>
                    </div>

                    <div className="shrink-0">
                      {qtyInCart === 0 ? (
                        <button
                          onClick={() => addToCart(String(item.id))}
                          className="h-8 px-3.5 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm border border-white/15 cursor-pointer active:scale-95"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          <Plus className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{lang === 'hi' ? 'जोड़ें' : 'Add'}</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-slate-900/90 text-white border border-white/15 p-1 rounded-full shadow-sm">
                          <button
                            onClick={() => removeFromCart(String(item.id))}
                            className="w-6 h-6 rounded-full bg-white/20 text-white font-bold flex items-center justify-center hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono font-bold text-xs text-emerald-300 px-1.5">{qtyInCart}</span>
                          <button
                            onClick={() => addToCart(String(item.id))}
                            className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center hover:bg-emerald-400 transition-colors cursor-pointer"
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

            {/* Permanent Floating Docked Cart Bar (Always visible without scrolling) */}
            {cartTotalCount > 0 && (
              <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-full sm:max-w-xl z-50 p-4 rounded-3xl bg-slate-950/95 backdrop-blur-2xl text-white flex items-center justify-between gap-4 shadow-[0_10px_35px_rgba(0,0,0,0.35)] border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span>{cartTotalCount} {t.itemsInCart}</span>
                  </div>
                  <div className="text-xl font-black font-mono text-white tracking-tight">
                    ₹{cartTotalPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={handleSendWhatsAppOrder}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
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
