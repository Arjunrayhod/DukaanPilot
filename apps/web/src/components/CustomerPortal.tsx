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
  Share2,
  Truck,
  MapPin,
  Package,
  PackageCheck,
  RotateCcw,
  Check,
  X,
  CreditCard,
  Banknote,
  BookOpen,
  Send,
  ExternalLink
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import { Lang, translations } from '../i18n/translations';
import { getCleanHindiName } from '../utils/productFormat';
import { 
  saveOnlineOrder, 
  getOnlineOrders,
  formatWhatsAppOrderText, 
  generateShareStoreMessage,
  OnlineCustomerOrder,
  OrderItem
} from '../utils/orderService';
import { getKhataCustomers, KhataCustomer } from '../utils/khataService';
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
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'orders' | 'bills'>('overview');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMode, setPaymentMode] = useState<'COD' | 'PAID_UPI' | 'KHATA_PENDING'>('COD');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [hasPaidOnline, setHasPaidOnline] = useState(false);
  const [orderNotes, setOrderNotes] = useState('');
  const [customerOrders, setCustomerOrders] = useState<OnlineCustomerOrder[]>(() => getOnlineOrders());
  const [khataCustomers, setKhataCustomers] = useState<KhataCustomer[]>(() => getKhataCustomers());

  useEffect(() => {
    const handleKhataUpdate = () => {
      setKhataCustomers(getKhataCustomers());
    };
    window.addEventListener('dukaanpilot_khata_updated', handleKhataUpdate);
    return () => {
      window.removeEventListener('dukaanpilot_khata_updated', handleKhataUpdate);
    };
  }, []);

  const cleanCustomerPhone = (customer.phone || '').replace(/[^\d]/g, '');
  const matchedKhataCust = khataCustomers.find((c) => {
    const cPhone = c.phone.replace(/[^\d]/g, '');
    if (cleanCustomerPhone && cPhone && (cPhone.includes(cleanCustomerPhone) || cleanCustomerPhone.includes(cPhone))) {
      return true;
    }
    const cName = c.name.toLowerCase();
    const custName = (customer.name || '').toLowerCase();
    return cName.includes(custName) || custName.includes(cName.replace(/\(.*?\)/g, '').trim());
  });
  const liveKhataDue = matchedKhataCust ? matchedKhataCust.currentDue : (customer.khataDue || 0);

  useEffect(() => {
    const handleOrdersUpdate = () => {
      setCustomerOrders(getOnlineOrders());
    };
    window.addEventListener('dukaanpilot_orders_updated', handleOrdersUpdate);
    window.addEventListener('dukaanpilot_new_order', handleOrdersUpdate);
    return () => {
      window.removeEventListener('dukaanpilot_orders_updated', handleOrdersUpdate);
      window.removeEventListener('dukaanpilot_new_order', handleOrdersUpdate);
    };
  }, []);

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

  const cartTotalCount: number = Object.values(cart).reduce((sum: number, count: number) => sum + count, 0);
  const cartTotalPrice: number = Object.entries(cart).reduce((sum: number, [id, count]: [string, number]) => {
    const item = products.find((c: any) => String(c.id) === String(id));
    const price = item ? (item.sellingPrice || item.price || 0) : 0;
    return sum + price * count;
  }, 0);

  const handleShareStore = () => {
    const msg = encodeURIComponent(
      generateShareStoreMessage(customer.shopName || 'श्री गणेश किराना स्टोर', window.location.href)
    );
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  };

  const handleOpenCheckout = () => {
    if (cartTotalCount === 0) return;
    setIsCheckoutModalOpen(true);
  };

  const handleConfirmAndPlaceOrder = () => {
    if (cartTotalCount === 0) return;

    const orderNumber = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderItems: OrderItem[] = Object.entries(cart).map(([id, count]: [string, number]) => {
      const item = products.find((c: any) => String(c.id) === String(id));
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
      deliveryType,
      deliveryAddress: deliveryType === 'DELIVERY' ? (deliveryAddress || 'दिए गए फोन पर संपर्क करें') : undefined,
      status: 'NEW',
      paymentStatus: paymentMode,
      createdAt: `आज, ${timeStr}`,
      timestamp: Date.now(),
      notes: orderNotes || (deliveryType === 'DELIVERY' ? 'होम डिलीवरी आर्डर' : 'दुकान से सेल्फ-पिकअप आर्डर')
    };

    saveOnlineOrder(newOrder);
    setCustomerOrders(getOnlineOrders());
    setCart({});
    setIsCheckoutModalOpen(false);
    setActiveTab('orders'); // Auto navigate to My Orders for live tracking!

    const message = encodeURIComponent(
      formatWhatsAppOrderText(
        {
          orderNumber,
          customerName: customer.name,
          customerPhone: customer.phone,
          items: orderItems,
          totalAmount: cartTotalPrice,
          deliveryType,
          deliveryAddress: deliveryType === 'DELIVERY' ? deliveryAddress : undefined,
          paymentStatus: paymentMode,
          notes: newOrder.notes
        },
        customer.shopName || 'श्री गणेश किराना स्टोर'
      )
    );

    window.open(`https://api.whatsapp.com/send?phone=919876543210&text=${message}`, '_blank');
    speakHindi(lang === 'hi' ? 'ऑर्डर सफलतापूर्वक दर्ज हो गया है' : 'Order successfully placed');
  };

  const handleReorder = (order: OnlineCustomerOrder) => {
    const newCart: Record<string, number> = {};
    for (const it of order.items) {
      newCart[it.id] = (newCart[it.id] || 0) + it.qty;
    }
    setCart(newCart);
    setActiveTab('catalog');
    speakHindi(lang === 'hi' ? 'सामान कार्ट में जोड़ दिए गए हैं' : 'Items added back to cart', lang);
  };

  const activeOrders = customerOrders.filter((o) => o.status !== 'DELIVERED' && o.status !== 'REJECTED');
  const activeOrdersCount = activeOrders.length;

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

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShareStore}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600/80 hover:bg-emerald-600 px-3 py-1.5 rounded-full border border-emerald-400/30 text-white transition-all shadow-sm cursor-pointer"
            >
              <Share2 className="w-3 h-3 text-emerald-200" />
              <span>{lang === 'hi' ? 'स्टोर शेयर करें' : 'Share Store'}</span>
            </button>
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
      <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-900/85 backdrop-blur-xl p-1.5 rounded-full border border-white/15 shadow-md overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-2.5 sm:px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
          className={`flex-1 py-2 px-2.5 sm:px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-2 px-2.5 sm:px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'orders'
              ? 'bg-white/20 text-white shadow-sm border border-white/15'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {activeTab === 'orders' && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>}
          <Truck className="w-3.5 h-3.5 text-indigo-300" />
          <span>{lang === 'hi' ? 'मेरे ऑर्डर्स' : 'My Orders'}</span>
          {activeOrdersCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full flex items-center justify-center font-black animate-pulse">
              {activeOrdersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          className={`flex-1 py-2 px-2.5 sm:px-3 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
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
          {/* Active Order Alert Banner if any running order exists */}
          {activeOrdersCount > 0 && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center shadow-inner shrink-0">
                  <Truck className="w-5 h-5 animate-pulse text-emerald-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black font-display text-white">
                      {lang === 'hi' ? 'लाइव सक्रिय ऑनलाइन ऑर्डर' : 'Live Active Order'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                      {activeOrders[0].status === 'NEW'
                        ? (lang === 'hi' ? 'नया ऑर्डर' : 'NEW')
                        : activeOrders[0].status === 'ACCEPTED'
                        ? (lang === 'hi' ? 'स्वीकृत' : 'ACCEPTED')
                        : (lang === 'hi' ? 'पैक हो रहा है' : 'PACKED')}
                    </span>
                  </div>
                  <p className="text-xs text-blue-200 mt-0.5">
                    #{activeOrders[0].orderNumber} &bull; ₹{activeOrders[0].totalAmount.toLocaleString('en-IN')} &bull; {activeOrders[0].items.length} {lang === 'hi' ? 'सामान' : 'items'} ({activeOrders[0].deliveryType === 'PICKUP' ? (lang === 'hi' ? 'दुकान पिकअप' : 'Pickup') : (lang === 'hi' ? 'होम डिलीवरी' : 'Home Delivery')})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2 rounded-full bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto flex items-center gap-1.5 shrink-0"
              >
                <span>{lang === 'hi' ? 'लाइव स्टेटस देखें' : 'Track Order'}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Khata Balance Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {t.myKhataBalance}
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black font-display text-rose-600">
                    ₹{liveKhataDue.toLocaleString('en-IN')}
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
                <span className="font-bold text-slate-900 text-sm">{customerOrders.length + bills.length} {lang === 'hi' ? 'ऑर्डर्स' : 'orders'}</span>
              </div>
            </div>
          </div>

          {/* Recent Ledger History Preview */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                {lang === 'hi' ? 'हालिया लेन-देन व उधारी' : 'Recent Ledger & Khata History'}
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
              {matchedKhataCust && matchedKhataCust.transactions && matchedKhataCust.transactions.length > 0 ? (
                matchedKhataCust.transactions.slice(0, 4).map((tx) => (
                  <div key={tx.id} className="py-3 flex items-center justify-between gap-2 text-xs">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5 flex-wrap">
                        <span>{tx.notes}</span>
                        {tx.billNo && (
                          <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                            {tx.billNo}
                          </span>
                        )}
                      </div>
                      <div className="text-slate-400 text-[10px] mt-0.5">{tx.date} at {tx.time}</div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`font-mono font-bold text-sm ${tx.type === 'DEBIT' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {tx.type === 'DEBIT' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
                      </div>
                      <span
                        className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          tx.type === 'CREDIT'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {tx.type === 'CREDIT' ? (isHi ? 'जमा भुगतान' : 'Paid') : (isHi ? 'उधार बकाया' : 'Due')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                bills.map((b) => (
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
                ))
              )}
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
                    onClick={handleOpenCheckout}
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

            {/* Delivery Type & Address Selector when cart has items */}
            {cartTotalCount > 0 && (
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-indigo-700" />
                    <span>{lang === 'hi' ? 'डिलीवरी का प्रकार चुनें' : 'Select Delivery Mode'}</span>
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-indigo-200">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('DELIVERY')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        deliveryType === 'DELIVERY'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🏠</span>
                      <span>{lang === 'hi' ? 'होम डिलीवरी' : 'Delivery'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('PICKUP')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        deliveryType === 'PICKUP'
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span>🏬</span>
                      <span>{lang === 'hi' ? 'दुकान पिकअप' : 'Pickup'}</span>
                    </button>
                  </div>
                </div>

                {deliveryType === 'DELIVERY' && (
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-indigo-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder={lang === 'hi' ? 'डिलीवरी का पता (मकान नं, गली, लैंडमार्क)...' : 'Delivery address (House no, Street, Landmark)...'}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-indigo-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Permanent Floating Docked Cart Bar (Always visible without scrolling) */}
            {cartTotalCount > 0 && (
              <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 w-auto sm:w-full sm:max-w-xl z-50 p-4 rounded-3xl bg-slate-950/95 backdrop-blur-2xl text-white flex items-center justify-between gap-4 shadow-[0_10px_35px_rgba(0,0,0,0.35)] border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    <span>{cartTotalCount} {t.itemsInCart} ({deliveryType === 'DELIVERY' ? (lang === 'hi' ? 'होम डिलीवरी' : 'Delivery') : (lang === 'hi' ? 'दुकान पिकअप' : 'Pickup')})</span>
                  </div>
                  <div className="text-xl font-black font-mono text-white tracking-tight">
                    ₹{cartTotalPrice.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={handleOpenCheckout}
                  className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{lang === 'hi' ? '🛍️ चेकआउट व ऑर्डर करें' : 'Checkout & Order'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. TAB 3: My Orders & Realtime Live Status Tracker */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
                    {lang === 'hi' ? 'मेरे ऑनलाइन ऑर्डर्स व लाइव ट्रैकिंग' : 'My Orders & Live Tracking'}
                  </h3>
                  {activeOrdersCount > 0 ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                      {activeOrdersCount} {lang === 'hi' ? 'प्रगति पर (In Progress)' : 'In Progress'}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                      {customerOrders.length} {lang === 'hi' ? 'कुल ऑर्डर्स' : 'Total Orders'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {lang === 'hi'
                    ? 'दुकानदार द्वारा स्वीकार, पैकिंग व डिलीवरी की रियल-टाइम स्थिति देखें'
                    : 'Realtime tracking of order acceptance, packing, and delivery status'}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {customerOrders.some(o => o.status === 'DELIVERED' || o.status === 'REJECTED') && (
                  <button
                    type="button"
                    onClick={() => {
                      const activeOnly = customerOrders.filter(o => o.status !== 'DELIVERED' && o.status !== 'REJECTED');
                      localStorage.setItem('dukaanpilot_online_orders', JSON.stringify(activeOnly));
                      setCustomerOrders(activeOnly);
                      window.dispatchEvent(new CustomEvent('dukaanpilot_orders_updated', { detail: activeOnly }));
                      speakHindi(lang === 'hi' ? 'पुराने पूर्ण ऑर्डर्स साफ कर दिए गए हैं' : 'Completed orders cleared', lang);
                    }}
                    className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-[11px] font-bold border border-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
                    title={lang === 'hi' ? 'पूर्ण हो चुके पुराने ऑर्डर्स हटाएं' : 'Clear completed test orders'}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{lang === 'hi' ? 'पूर्ण ऑर्डर्स साफ करें' : 'Clear Completed'}</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'hi' ? '+ नया ऑर्डर' : '+ New Order'}</span>
                </button>
              </div>
            </div>

            {customerOrders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-14 h-14 rounded-3xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{lang === 'hi' ? 'अभी कोई ऑनलाइन ऑर्डर नहीं है' : 'No online orders yet'}</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {lang === 'hi' ? 'कैटलॉग से अपनी पसंद का सामान चुनें और आसानी से व्हाट्सएप पर ऑर्डर भेजें।' : 'Browse catalog and place your first order easily via WhatsApp.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  {lang === 'hi' ? 'कैटलॉग देखें' : 'Browse Catalog'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map((ord) => {
                  const isNew = ord.status === 'NEW';
                  const isAccepted = ord.status === 'ACCEPTED';
                  const isPacked = ord.status === 'PACKED';
                  const isDelivered = ord.status === 'DELIVERED';
                  const isRejected = ord.status === 'REJECTED';

                  // Step calculation: 1 (NEW), 2 (ACCEPTED), 3 (PACKED), 4 (DELIVERED)
                  const currentStep = isDelivered ? 4 : isPacked ? 3 : isAccepted ? 2 : 1;

                  return (
                    <div
                      key={ord.id}
                      className={`p-5 rounded-3xl border transition-all space-y-4 ${
                        isNew
                          ? 'bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-white border-blue-300 shadow-md ring-2 ring-blue-500/20'
                          : isAccepted
                          ? 'bg-gradient-to-br from-amber-50/70 via-yellow-50/30 to-white border-amber-300 shadow-md ring-2 ring-amber-500/20'
                          : isPacked
                          ? 'bg-gradient-to-br from-purple-50/70 via-indigo-50/30 to-white border-purple-300 shadow-md ring-2 ring-purple-500/20'
                          : 'bg-slate-50/60 border-slate-200'
                      }`}
                    >
                      {/* Order Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200/70">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl font-black text-xs flex items-center justify-center font-mono shadow-xs ${
                            isNew ? 'bg-blue-600 text-white animate-pulse' : isAccepted ? 'bg-amber-600 text-white' : isPacked ? 'bg-purple-600 text-white' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            #{ord.orderNumber.replace('ORD-', '')}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-slate-900 text-sm font-display">
                                #{ord.orderNumber}
                              </span>
                              <span
                                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                  isNew
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300 animate-pulse'
                                    : isAccepted
                                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : isPacked
                                    ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                    : isDelivered
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                                }`}
                              >
                                {isNew
                                  ? (lang === 'hi' ? '🔵 1. नया ऑर्डर दर्ज (स्वीकृति बाकी)' : '🔵 1. Placed (Pending Acceptance)')
                                  : isAccepted
                                  ? (lang === 'hi' ? '🟡 2. स्वीकृत (सामान निकाला जा रहा है)' : '🟡 2. Accepted (Preparing)')
                                  : isPacked
                                  ? (lang === 'hi' ? '🟣 3. पैक व तैयार (डिलीवरी/पिकअप)' : '🟣 3. Packed & Ready')
                                  : isDelivered
                                  ? (lang === 'hi' ? '🟢 ✓ डिलीवर पूरा (Completed)' : '🟢 ✓ Delivered')
                                  : (lang === 'hi' ? 'रद्द' : 'Cancelled')}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                              <span>🕒 {ord.createdAt}</span>
                              <span>&bull;</span>
                              <span className="font-sans font-bold text-indigo-700">
                                {ord.deliveryType === 'PICKUP'
                                  ? (lang === 'hi' ? '🏬 दुकान पिकअप' : '🏬 Self-Pickup')
                                  : (lang === 'hi' ? '🏠 होम डिलीवरी' : '🏠 Home Delivery')}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-xl font-black font-mono text-slate-950">
                            ₹{ord.totalAmount.toLocaleString('en-IN')}
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            {ord.paymentStatus === 'PAID_UPI'
                              ? (lang === 'hi' ? '📲 UPI द्वारा भुगतान' : '📲 UPI Paid')
                              : ord.paymentStatus === 'KHATA_PENDING'
                              ? (lang === 'hi' ? '📖 खाता लेजर उधार' : '📖 Khata Credit')
                              : (lang === 'hi' ? '💵 कैश ऑन डिलीवरी (COD)' : '💵 Cash on Delivery')}
                          </span>
                        </div>
                      </div>

                      {/* 4-Step Visual Progress Stepper */}
                      {!isRejected && (
                        <div className="p-3.5 bg-white rounded-2xl border border-slate-200/80">
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] sm:text-[11px] font-bold">
                            {/* Step 1: Placed */}
                            <div className="space-y-1">
                              <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-mono text-xs font-black ${
                                currentStep >= 1 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {currentStep > 1 ? '✓' : '1'}
                              </div>
                              <span className={currentStep >= 1 ? 'text-blue-950 font-black' : 'text-slate-400'}>
                                {lang === 'hi' ? '1. ऑर्डर दर्ज' : 'Placed'}
                              </span>
                            </div>

                            {/* Step 2: Accepted */}
                            <div className="space-y-1">
                              <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-mono text-xs font-black ${
                                currentStep >= 2 ? 'bg-amber-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {currentStep > 2 ? '✓' : currentStep === 2 ? '2' : '⏳'}
                              </div>
                              <span className={currentStep >= 2 ? 'text-amber-950 font-black' : 'text-slate-400'}>
                                {lang === 'hi' ? (currentStep >= 2 ? '2. स्वीकृत' : 'स्वीकृति') : 'Accepted'}
                              </span>
                            </div>

                            {/* Step 3: Packed */}
                            <div className="space-y-1">
                              <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-mono text-xs font-black ${
                                currentStep >= 3 ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {currentStep > 3 ? '✓' : currentStep === 3 ? '3' : '⏳'}
                              </div>
                              <span className={currentStep >= 3 ? 'text-purple-950 font-black' : 'text-slate-400'}>
                                {lang === 'hi' ? (currentStep >= 3 ? '3. पैक तैयार' : 'पैकिंग') : 'Packed'}
                              </span>
                            </div>

                            {/* Step 4: Delivered */}
                            <div className="space-y-1">
                              <div className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center font-mono text-xs font-black ${
                                currentStep >= 4 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
                              }`}>
                                {currentStep >= 4 ? '✓' : '⏳'}
                              </div>
                              <span className={currentStep >= 4 ? 'text-emerald-950 font-black' : 'text-slate-400'}>
                                {lang === 'hi' ? (currentStep >= 4 ? '4. डिलीवर' : 'डिलीवरी') : 'Delivered'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Delivery Address if Home Delivery */}
                      {ord.deliveryAddress && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-start gap-2 text-slate-700">
                          <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-slate-900 block">{lang === 'hi' ? 'डिलीवरी का पता:' : 'Delivery Address:'}</span>
                            <span>{ord.deliveryAddress}</span>
                          </div>
                        </div>
                      )}

                      {/* Items Breakdown Table / Chips */}
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                          {lang === 'hi' ? 'ऑर्डर किए गए सामान' : 'Ordered Items'} ({ord.items.length}):
                        </span>
                        <div className="divide-y divide-slate-100 bg-white rounded-2xl p-3 border border-slate-200/80">
                          {ord.items.map((it, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between text-xs font-medium">
                              <div>
                                <span className="font-bold text-slate-900">{it.hindiName || it.name}</span>
                                <span className="text-slate-400 font-mono text-[11px] ml-2">({it.qty} {it.unit} x ₹{it.price})</span>
                              </div>
                              <span className="font-mono font-bold text-slate-900">₹{it.total}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Footer Actions */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/70">
                        <div className="flex items-center gap-2">
                          <a
                            href={`https://api.whatsapp.com/send?phone=919876543210&text=${encodeURIComponent(`नमस्ते, मैं ऑर्डर #${ord.orderNumber} की स्थिति के बारे में जानना चाहता हूँ।`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="h-8 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{lang === 'hi' ? 'WhatsApp पर पूछें' : 'Chat on WhatsApp'}</span>
                          </a>

                          <a
                            href="tel:9876543210"
                            className="h-8 px-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 text-slate-600" />
                            <span>{lang === 'hi' ? 'कॉल करें' : 'Call Shop'}</span>
                          </a>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleReorder(ord)}
                          className="h-8 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                        >
                          <RotateCcw className="w-3 h-3 text-emerald-400" />
                          <span>{lang === 'hi' ? '🔄 दोबारा ऑर्डर करें' : 'Reorder'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. TAB 4: My Bills & Khata History */}
      {activeTab === 'bills' && (
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isHi ? 'मेरे बिल व खाता लेन-देन इतिहास' : t.myBillsTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {isHi ? 'दुकान से की गई खरीदारी और खाता बही का पूरा विवरण' : t.myBillsSub}
              </p>
            </div>

            <div className="space-y-3">
              {matchedKhataCust && matchedKhataCust.transactions && matchedKhataCust.transactions.length > 0 ? (
                matchedKhataCust.transactions.map((tx) => (
                  <div key={tx.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-black text-slate-900">{tx.billNo || tx.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            tx.type === 'CREDIT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {tx.type === 'CREDIT' ? (isHi ? '✓ जमा भुगतान' : 'Credit / Paid') : (isHi ? '📖 उधार खरीद' : 'Debit / Due')}
                        </span>
                      </div>
                      <span className={`font-mono font-black text-base ${tx.type === 'DEBIT' ? 'text-rose-600' : 'text-emerald-600'}`}>
                        {tx.type === 'DEBIT' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
                      </span>
                    </div>

                    <div className="text-slate-700 text-xs font-medium">{tx.notes}</div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-mono">
                      <span>{tx.date} at {tx.time}</span>
                      <span className="font-bold text-slate-800">
                        {isHi ? `बैलेंस: ₹${tx.balanceAfter}` : `Balance: ₹${tx.balanceAfter}`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                bills.map((b) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. ORDER CHECKOUT MODAL (Cash vs Online UPI vs Khata) */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center shadow-xs">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 font-display">
                    {lang === 'hi' ? '🛍️ ऑर्डर चेकआउट व पुष्टि' : '🛍️ Order Checkout & Confirm'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {customer.shopName || 'श्री गणेश किराना स्टोर'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsCheckoutModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items Summary */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>{lang === 'hi' ? 'सामान सूची (Items List):' : 'Items List:'}</span>
                <span className="font-mono text-indigo-700">{cartTotalCount} {lang === 'hi' ? 'सामान' : 'items'}</span>
              </div>
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 bg-slate-50/70 rounded-2xl p-3 border border-slate-200/80">
                {Object.entries(cart).map(([id, count]) => {
                  const item = products.find((c) => String(c.id) === String(id));
                  const title = lang === 'hi' ? getCleanHindiName(item) : (item?.name || 'Item');
                  const price = item ? (item.sellingPrice || item.price || 0) : 0;
                  return (
                    <div key={id} className="py-1.5 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <span className="font-bold text-slate-900">{title}</span>
                        <span className="text-slate-400 font-mono text-[11px] ml-1.5">({count} {item?.unit || 'pk'} x ₹{price})</span>
                      </div>
                      <span className="font-mono font-bold text-slate-900 shrink-0">₹{price * count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Delivery Mode */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-indigo-700" />
                <span>{lang === 'hi' ? '1. डिलीवरी का माध्यम चुनें:' : '1. Select Delivery Mode:'}</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryType('DELIVERY')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliveryType === 'DELIVERY'
                      ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🏠</span>
                    {deliveryType === 'DELIVERY' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900 mt-1">
                    {lang === 'hi' ? 'होम डिलीवरी' : 'Home Delivery'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lang === 'hi' ? 'घर पर पहुंचाएं' : 'Deliver to address'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryType('PICKUP')}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    deliveryType === 'PICKUP'
                      ? 'bg-indigo-50 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg">🏬</span>
                    {deliveryType === 'PICKUP' && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                  </div>
                  <div className="font-bold text-xs text-slate-900 mt-1">
                    {lang === 'hi' ? 'दुकान से पिकअप' : 'Self Pickup'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {lang === 'hi' ? 'दुकान से खुद लें' : 'Pick from shop'}
                  </div>
                </button>
              </div>

              {deliveryType === 'DELIVERY' && (
                <div className="relative pt-1">
                  <MapPin className="w-4 h-4 text-indigo-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={lang === 'hi' ? 'पूरा पता व लैंडमार्क (मकान नं, गली)...' : 'Full address and landmark...'}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Payment Mode (Cash vs UPI vs Khata) */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Banknote className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'hi' ? '2. भुगतान का तरीका चुनें (Payment Mode):' : '2. Select Payment Mode:'}</span>
              </label>

              <div className="space-y-2">
                {/* 1. Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMode('COD')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    paymentMode === 'COD'
                      ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0">
                      💵
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {lang === 'hi' ? 'कैश ऑन डिलीवरी (COD)' : 'Cash on Delivery (COD)'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lang === 'hi' ? 'सामान मिलने पर नकद भुगतान करें' : 'Pay cash upon delivery / pickup'}
                      </div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMode === 'COD' ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {paymentMode === 'COD' && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* 2. Online UPI Payment */}
                <div
                  onClick={() => setPaymentMode('PAID_UPI')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2.5 ${
                    paymentMode === 'PAID_UPI'
                      ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-base shrink-0">
                        📲
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>{lang === 'hi' ? 'ऑनलाइन UPI / QR भुगतान' : 'Online UPI / QR Payment'}</span>
                          <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[9px] font-mono font-bold">Fast</span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lang === 'hi' ? 'GPay, PhonePe, Paytm, BHIM द्वारा तुरंत भुगतान' : 'Pay instantly via GPay, PhonePe, Paytm'}
                        </div>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      paymentMode === 'PAID_UPI' ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                    }`}>
                      {paymentMode === 'PAID_UPI' && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  {paymentMode === 'PAID_UPI' && (
                    <div className="p-3 bg-white rounded-xl border border-indigo-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between bg-indigo-50/60 p-2 rounded-lg">
                        <span className="text-slate-600 font-medium">{lang === 'hi' ? 'दुकान UPI आईडी:' : 'Shop UPI ID:'}</span>
                        <span className="font-mono font-bold text-indigo-950">{customer.upiId || 'shreeganesh@sbi'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`upi://pay?pa=${encodeURIComponent(customer.upiId || 'shreeganesh@sbi')}&pn=${encodeURIComponent(customer.shopName || 'Kirana')}&am=${cartTotalPrice}&cu=INR`}
                          className="flex-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>{lang === 'hi' ? `₹${cartTotalPrice} UPI ऐप से भरें` : `Pay ₹${cartTotalPrice} via UPI`}</span>
                        </a>

                        <button
                          type="button"
                          onClick={onOpenQr}
                          className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1 border border-slate-200 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>QR</span>
                        </button>
                      </div>

                      <label className="flex items-center gap-2 pt-1 text-[11px] text-slate-600 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={hasPaidOnline}
                          onChange={(e) => setHasPaidOnline(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                        />
                        <span>{lang === 'hi' ? 'मैंने UPI से भुगतान कर दिया है / डिलीवरी पर ऑनलाइन दूंगा' : 'I will pay / have paid via UPI'}</span>
                      </label>
                    </div>
                  )}
                </div>

                {/* 3. Khata Pay Later (if khata exists) */}
                <div
                  onClick={() => setPaymentMode('KHATA_PENDING')}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    paymentMode === 'KHATA_PENDING'
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-500/20 shadow-xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-base shrink-0">
                      📖
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">
                        {lang === 'hi' ? 'खाता लेजर (उधार / बाद में दें)' : 'Khata Credit (Pay Later)'}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {lang === 'hi' ? `मौजूदा खाता बकाया: ₹${liveKhataDue.toLocaleString('en-IN')} • बिल खाते में जुड़ेगा` : `Current due: ₹${liveKhataDue.toLocaleString('en-IN')} • Add to khata`}
                      </div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMode === 'KHATA_PENDING' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-300'
                  }`}>
                    {paymentMode === 'KHATA_PENDING' && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Order Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-600">
                {lang === 'hi' ? 'विशेष निर्देश / नोट (वैकल्पिक):' : 'Special Instructions / Notes (Optional):'}
              </label>
              <input
                type="text"
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder={lang === 'hi' ? 'जैसे: शाम 5 बजे भेजें, ताज़ा पैकेट देना...' : 'e.g. deliver after 5pm, fresh packet...'}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Total & Confirm Button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 block">{lang === 'hi' ? 'कुल देय राशि' : 'Total Amount'}</span>
                <span className="text-xl font-black font-mono text-slate-950">₹{cartTotalPrice.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>

                <button
                  type="button"
                  onClick={handleConfirmAndPlaceOrder}
                  className="px-6 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'hi' ? '🚀 ऑर्डर तुरंत दर्ज करें' : '🚀 Place Order Now'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
