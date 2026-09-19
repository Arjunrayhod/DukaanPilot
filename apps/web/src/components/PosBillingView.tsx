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
  Tag,
  Camera,
  Gift,
  Award,
  ArrowLeft,
} from 'lucide-react';
import { fetchProducts, fetchCategories } from '../services/api';
import { Lang, translations } from '../i18n/translations';
import { getCleanHindiName } from '../utils/productFormat';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { parseVoiceInput, ParsedVoiceCommand } from '../utils/nlpParser';
import { speakHindi } from '../utils/voiceFeedback';
import { ReceiptModal } from './ReceiptModal';
import { ReceiptData } from '../utils/receiptGenerator';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { BarcodeGeneratorModal } from './BarcodeGeneratorModal';
import { PromotionsModal } from './PromotionsModal';
import { useBarcodeScanner } from '../hooks/useBarcodeScanner';
import { findProductByBarcode, playScannerBeep, BarcodeProduct } from '../utils/barcodeService';
import { INITIAL_INVENTORY_ITEMS, decrementStockOnSale, InventoryItem } from '../utils/inventoryService';
import { INITIAL_LOYALTY_ACCOUNTS, calculateEarnedPoints, LoyaltyAccount } from '../utils/loyaltyService';

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
  initialVoiceText?: string;
  onBackToDashboard?: () => void;
}

export const PosBillingView: React.FC<PosBillingViewProps> = ({
  lang = 'hi',
  initialVoiceText = '',
  onBackToDashboard
}) => {
  const t = translations[lang];

  const [cart, setCart] = useState<CartItem[]>([
    { id: '1', name: 'Amul Taaza Milk 500ml', hindi: 'अमूल ताजा दूध 500ml', price: 27, qty: 3, unit: 'packet' },
    { id: '2', name: 'Madhur Pure Sugar 1kg', hindi: 'मधुर चीनी 1kg', price: 48, qty: 2, unit: 'kg' },
    { id: '3', name: 'Britannia Daily Bread 400g', hindi: 'ब्रिटानिया ब्रेड 400g', price: 45, qty: 1, unit: 'packet' },
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPayment, setSelectedPayment] = useState<'cash' | 'upi' | 'khata' | 'split'>('cash');
  const [splitCash, setSplitCash] = useState<number>(0);
  const [splitUpi, setSplitUpi] = useState<number>(0);
  const [splitKhata, setSplitKhata] = useState<number>(0);
  const [customerName, setCustomerName] = useState('रमेश कुमार');
  const [customerPhone, setCustomerPhone] = useState('9823456789');
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState<ReceiptData | null>(null);
  const [voiceInput, setVoiceInput] = useState('3 packet doodh, 2 kg cheeni, 1 bread add karo');
  const [barcodeQuery, setBarcodeQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastVoiceResult, setLastVoiceResult] = useState('');
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const [isBarcodeGeneratorOpen, setIsBarcodeGeneratorOpen] = useState(false);
  const [isPromotionsModalOpen, setIsPromotionsModalOpen] = useState(false);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(INITIAL_INVENTORY_ITEMS);
  const [loyaltyAccounts, setLoyaltyAccounts] = useState<Record<string, LoyaltyAccount>>(INITIAL_LOYALTY_ACCOUNTS);
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);

  // Handle Barcode Scanned (Camera or USB Scanner)
  const handleProductBarcodeScanned = (product: BarcodeProduct) => {
    const prodName = product.name;
    const prodHindi = product.hindi;
    const prodPrice = product.price;
    const prodUnit = product.unit;

    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (p) => String(p.id) === String(product.barcode) || p.name === prodName
      );
      if (existingIdx >= 0) {
        return prev.map((p, idx) => (idx === existingIdx ? { ...p, qty: p.qty + 1 } : p));
      } else {
        return [
          ...prev,
          {
            id: product.barcode,
            name: prodName,
            hindi: prodHindi,
            price: prodPrice,
            qty: 1,
            unit: prodUnit,
          },
        ];
      }
    });

    const speechMsg = `${prodHindi || prodName} ₹${prodPrice}`;
    speakHindi(speechMsg);
  };

  // Global Hardware USB / Bluetooth Barcode Gun Listener
  useBarcodeScanner({
    onScan: (scannedCode) => {
      const product = findProductByBarcode(scannedCode);
      playScannerBeep();
      if (product) {
        handleProductBarcodeScanned(product);
      } else {
        speakHindi(lang === 'hi' ? `बारकोड ${scannedCode} नहीं मिला` : `Barcode not found`);
      }
    },
    enabled: true
  });

  const defaultCategories = [
    { id: 'All', name: 'All Items', nameHindi: 'सभी सामान' },
    { id: 'cat_atta', name: 'Atta & Flour', nameHindi: 'आटा व दाल' },
    { id: 'cat_oils', name: 'Edible Oil', nameHindi: 'तेल व घी' },
    { id: 'cat_spices', name: 'Spices & Masala', nameHindi: 'मसाले' },
    { id: 'cat_dairy', name: 'Dairy & Bakery', nameHindi: 'डेयरी व दूध' },
    { id: 'cat_snacks', name: 'Snacks & Namkeen', nameHindi: 'नमकीन व बिस्कुट' },
  ];

  const handleProcessVoiceInput = (rawSpoken: string) => {
    if (!rawSpoken.trim()) return;
    setLastVoiceResult(rawSpoken);
    const parsed = parseVoiceInput(rawSpoken, products);

    if (parsed.intent === 'CLEAR_CART') {
      setCart([]);
      speakHindi(lang === 'hi' ? 'बिल खाली कर दिया गया है' : 'Bill cleared');
      return;
    }

    if (parsed.intent === 'ADD_ITEMS' && parsed.items.length > 0) {
      const addedNames: string[] = [];
      setCart((prev) => {
        let updated = [...prev];
        for (const item of parsed.items) {
          const prod = item.matchedProduct;
          const prodId = prod ? prod.id : `voice_${Date.now()}_${Math.random()}`;
          const prodName = prod ? prod.name : item.productQuery;
          const prodHindi = prod ? getCleanHindiName(prod) : item.productQuery;
          const prodPrice = prod ? (prod.sellingPrice || prod.price || 40) : 40;
          const prodUnit = prod ? (prod.unit || 'packet') : item.unit;

          const existingIdx = updated.findIndex((p) => String(p.id) === String(prodId));
          if (existingIdx >= 0) {
            updated[existingIdx] = {
              ...updated[existingIdx],
              qty: updated[existingIdx].qty + item.quantity
            };
          } else {
            updated.push({
              id: prodId,
              name: prodName,
              hindi: prodHindi,
              price: prodPrice,
              qty: item.quantity,
              unit: prodUnit,
            });
          }
          addedNames.push(`${item.quantity} ${prodUnit} ${prodHindi || prodName}`);
        }
        return updated;
      });

      const speechMsg = `${addedNames.join(', ')} बिल में जोड़े गए`;
      speakHindi(speechMsg);
    }
  };

  const {
    isListening,
    transcript,
    interimTranscript,
    toggleListening,
    setTranscript
  } = useVoiceRecognition({
    lang: 'hi-IN',
    onResult: (res, isFinal) => {
      if (isFinal) {
        handleProcessVoiceInput(res);
      }
    }
  });

  const processedVoiceRef = React.useRef<string>('');

  useEffect(() => {
    async function initData() {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        fetchProducts(barcodeQuery, selectedCategory),
        fetchCategories()
      ]);

      if (cRes.success && cRes.data && cRes.data.length > 0) {
        setCategories([{ id: 'All', name: 'All Items', nameHindi: 'सभी सामान' }, ...cRes.data]);
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

  useEffect(() => {
    if (initialVoiceText && initialVoiceText !== processedVoiceRef.current && products.length > 0) {
      processedVoiceRef.current = initialVoiceText;
      handleProcessVoiceInput(initialVoiceText);
    }
  }, [initialVoiceText, products]);

  const updateQty = (id: string | number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = Math.max(1, item.qty + delta);
            if (delta > 0) {
              const itemName = lang === 'hi' && item.hindi ? item.hindi : item.name;
              speakHindi(lang === 'hi' ? `${newQty} ${itemName}` : `${newQty} ${item.name}`, lang);
            }
            return { ...item, qty: newQty };
          }
          return item;
        })
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id: string | number) => {
    const target = cart.find((c) => c.id === id);
    if (target) {
      const itemName = lang === 'hi' && target.hindi ? target.hindi : target.name;
      speakHindi(lang === 'hi' ? `${itemName} हटाया गया` : `${target.name} removed`, lang);
    }
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const addItemToCart = (item: any) => {
    const itemName = lang === 'hi' ? getCleanHindiName(item) : item.name;
    speakHindi(lang === 'hi' ? `${itemName} बिल में जोड़ा गया` : `${item.name} added to bill`, lang);

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
          hindi: getCleanHindiName(item) || item.nameHindi || item.hindi || '',
          price: item.sellingPrice || item.price,
          qty: 1,
          unit: item.unit || 'packet',
        },
      ];
    });
  };

  const cleanPhone = customerPhone.replace(/[^\d]/g, '');
  const customerLoyalty = loyaltyAccounts[cleanPhone];
  const availablePoints = customerLoyalty?.points || 0;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gstAmount = Math.round(subtotal * 0.05);
  const discountFromPoints = Math.min(redeemedPoints, availablePoints, subtotal + gstAmount);
  const grandTotal = Math.max(0, subtotal + gstAmount - discountFromPoints);

  const handleCompleteBill = () => {
    if (cart.length === 0) {
      alert(lang === 'hi' ? 'कृपया पहले कार्ट में सामान जोड़ें!' : 'Please add items to cart first!');
      return;
    }

    // 1. Real-time Automatic Stock Decrement
    const { updatedInventory } = decrementStockOnSale(inventoryItems, cart);
    setInventoryItems(updatedInventory);

    // 2. Customer Loyalty Points Calculation & Ledger update
    const earned = calculateEarnedPoints(grandTotal);
    if (cleanPhone) {
      setLoyaltyAccounts((prev) => {
        const existing = prev[cleanPhone] || {
          phone: cleanPhone,
          customerName,
          points: 0,
          totalEarned: 0,
          totalRedeemed: 0,
          lastActive: new Date().toLocaleDateString('en-IN')
        };
        return {
          ...prev,
          [cleanPhone]: {
            ...existing,
            customerName: customerName || existing.customerName,
            points: Math.max(0, existing.points - discountFromPoints + earned),
            totalEarned: existing.totalEarned + earned,
            totalRedeemed: existing.totalRedeemed + discountFromPoints,
            lastActive: new Date().toLocaleDateString('en-IN')
          }
        };
      });
    }

    const receipt: ReceiptData = {
      invoiceNo: `${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      shopName: 'श्री गणेश किराना स्टोर (Shree Ganesh Kirana)',
      shopAddress: 'दुकान नं. 4, मुख्य बाजार, दिल्ली',
      shopPhone: '+91 98765 43210',
      shopGst: '07AAAAA0000A1Z5',
      shopUpiId: 'shreeganesh@sbi',
      customerName,
      customerPhone,
      items: cart.map((c) => ({
        id: c.id,
        name: c.name,
        hindi: c.hindi,
        qty: c.qty,
        price: c.price,
        unit: c.unit,
      })),
      subtotal,
      gstAmount,
      roundOff: 0,
      grandTotal,
      paymentMode: selectedPayment,
      splitBreakdown:
        selectedPayment === 'split'
          ? {
              cash: splitCash || 0,
              upi: splitUpi || 0,
              khata: splitKhata || Math.max(0, grandTotal - (splitCash || 0) - (splitUpi || 0)),
            }
          : undefined,
    };

    setCurrentReceipt(receipt);
    setIsReceiptModalOpen(true);
    setRedeemedPoints(0);

    const voiceAnnounce = lang === 'hi'
      ? `बिल पूरा हुआ, कुल ₹${grandTotal}${earned > 0 ? `। ${earned} लॉयल्टी पॉइंट्स जुड़े` : ''}`
      : `Bill completed, total ₹${grandTotal}`;
    speakHindi(voiceAnnounce, lang);
  };

  return (
    <div className="space-y-4">
      {/* 1. Desktop POS Hotkeys & Function Header Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-3 shadow-md border border-white/10 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        <div className="flex items-center gap-2 shrink-0">
          {onBackToDashboard && (
            <button
              type="button"
              onClick={onBackToDashboard}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-full border border-white/15 font-bold transition-all cursor-pointer mr-1"
              title={lang === 'hi' ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}
            >
              <ArrowLeft className="w-3.5 h-3.5 text-blue-300" />
              <span>{lang === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}</span>
            </button>
          )}
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
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                type="button"
                onClick={toggleListening}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 shrink-0 cursor-pointer ${
                  isListening
                    ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-300 animate-bounce'
                    : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/20'
                }`}
              >
                <Mic className="w-6 h-6" />
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-amber-300 flex items-center gap-1">
                    <Zap className="w-3 h-3 fill-amber-300" />
                    {lang === 'hi' ? 'AI लाइव वॉइस बिलिंग' : 'AI Live Voice POS'}
                  </span>
                  {isListening && (
                    <span className="bg-red-500/30 text-red-200 border border-red-400/40 text-[10px] px-2.5 py-0.5 rounded-full font-bold animate-pulse">
                      {lang === 'hi' ? 'बोलें... (Listening)' : 'Speak now...'}
                    </span>
                  )}
                </div>
                <p className="text-sm font-semibold text-blue-100 truncate mt-0.5">
                  {isListening
                    ? (interimTranscript || transcript || (lang === 'hi' ? 'सुन रहा हूं... "2 पैकेट दूध और 1 चीनी"' : 'Listening live...'))
                    : (lastVoiceResult ? `"${lastVoiceResult}"` : `"${voiceInput}"`)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleProcessVoiceInput(voiceInput)}
              className="bg-emerald-400 hover:bg-emerald-300 text-slate-950 px-4 py-2 rounded-full text-xs font-black shadow-md shrink-0 transition-transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>{lang === 'hi' ? 'वॉइस प्रोसेस' : 'Process Voice'}</span>
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
                type="button"
                onClick={() => setIsBarcodeScannerOpen(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all shrink-0 cursor-pointer active:scale-95"
                title={lang === 'hi' ? 'कैमरा बारकोड स्कैनर खोलें' : 'Open Camera Barcode Scanner'}
              >
                <Camera className="w-4 h-4 text-white" />
                <span>{lang === 'hi' ? 'कैमरा स्कैन' : 'Scan'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsBarcodeGeneratorOpen(true)}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer active:scale-95"
                title={lang === 'hi' ? 'खुले सामान का बारकोड लेबल बनाएं' : 'Generate Loose Item Barcode'}
              >
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">{lang === 'hi' ? 'लेबल बनाएं' : 'Label'}</span>
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
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3 lg:sticky lg:top-4 h-fit max-h-[calc(100vh-2rem)]">
          <div>
            {/* Bill Header & Customer Selector */}
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <span className="text-xs font-black text-slate-900 block">
                  {lang === 'hi' ? 'चालू बिल #2048' : 'Current Bill #2048'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang === 'hi' ? 'फास्ट बिलिंग काउंटर' : 'Fast Checkout Counter'}
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full font-mono">
                {cart.length} {lang === 'hi' ? 'सामान' : 'Items'}
              </span>
            </div>

            {/* Customer Pill Selector */}
            <div className="bg-[#eff4ff] border border-blue-100 rounded-xl p-2.5 my-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-blue-200 text-blue-900 flex items-center justify-center font-bold text-xs shrink-0">
                  RK
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-slate-900 block truncate">
                    {customerName || (lang === 'hi' ? 'रमेश कुमार (Ramesh)' : 'Ramesh Kumar')}
                  </span>
                  <span className="text-[10px] text-amber-700 font-semibold block">
                    {lang === 'hi' ? 'खाता: ₹1,450 बकाया' : 'Khata: ₹1,450 Pending'}
                  </span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => {
                  const newName = prompt(lang === 'hi' ? 'ग्राहक का नाम दर्ज करें:' : 'Enter customer name:', customerName);
                  if (newName) setCustomerName(newName);
                }}
                className="text-xs font-bold text-blue-700 hover:underline shrink-0 cursor-pointer"
              >
                {lang === 'hi' ? 'बदलें' : 'Change'}
              </button>
            </div>

            {/* Cart Items Table */}
            <div className="space-y-1.5 max-h-36 sm:max-h-44 overflow-y-auto pr-1 no-scrollbar">
              {cart.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  {lang === 'hi' ? 'कार्ट खाली है (आइटम जोड़ें या बोलें)' : 'Cart is empty'}
                </div>
              ) : (
                cart.map((item) => (
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

                    <div className="flex items-center gap-1.5 shrink-0">
                      {/* Qty +/- stepper */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 active:scale-90 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-1.5 font-bold text-slate-900 text-xs font-mono">{item.qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="p-1 hover:bg-slate-100 rounded text-slate-600 active:scale-90 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-black text-slate-900 w-12 text-right font-mono">
                        ₹{item.price * item.qty}
                      </span>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bill Calculation & Checkout Triggers */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            {/* Festive Promotions & Loyalty Points Strip */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-2xl bg-purple-50/80 border border-purple-200">
              <div className="flex items-center gap-2 min-w-0">
                <Gift className="w-4 h-4 text-purple-700 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-extrabold text-purple-950 truncate">
                    {availablePoints > 0
                      ? (lang === 'hi' ? `${availablePoints} लॉयल्टी पॉइंट्स उपलब्ध` : `${availablePoints} Loyalty Pts Available`)
                      : (lang === 'hi' ? 'त्योहारी कूपन व डिस्काउंट' : 'Festive Offers & Coupons')}
                  </div>
                  <div className="text-[10px] text-purple-700">
                    {availablePoints > 0
                      ? (lang === 'hi' ? `1 pt = ₹1 छूट (कुल ₹${availablePoints} तक)` : `1 pt = ₹1 discount`)
                      : (lang === 'hi' ? '10% व ₹50 कूपन लागू करें' : 'Apply 10% or flat ₹50')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {availablePoints > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (redeemedPoints > 0) {
                        setRedeemedPoints(0);
                        speakHindi(lang === 'hi' ? 'पॉइंट्स छूट हटाई गई' : 'Points removed');
                      } else {
                        const toRedeem = Math.min(availablePoints, subtotal + gstAmount);
                        setRedeemedPoints(toRedeem);
                        speakHindi(lang === 'hi' ? `₹${toRedeem} की लॉयल्टी छूट लागू हुई` : `₹${toRedeem} discount applied`);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                      redeemedPoints > 0
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'bg-white text-purple-900 border border-purple-300 hover:bg-purple-100'
                    }`}
                  >
                    {redeemedPoints > 0 ? (lang === 'hi' ? 'हटाएं (₹' + redeemedPoints + ')' : 'Remove') : (lang === 'hi' ? 'रिडीम करें' : 'Redeem')}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsPromotionsModalOpen(true)}
                  className="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                  title={lang === 'hi' ? 'त्योहारी ऑफर्स व कूपन' : 'Festive Offers'}
                >
                  <Tag className="w-3 h-3 text-slate-950" />
                  <span>{lang === 'hi' ? 'कूपन' : 'Offers'}</span>
                </button>
              </div>
            </div>

            {/* Subtotal, Discount & GST rows */}
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between items-center py-0.5">
                <span>{lang === 'hi' ? 'उप-कुल:' : 'Subtotal:'}</span>
                <span className="font-bold font-mono text-slate-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between items-center py-0.5">
                <span>{lang === 'hi' ? 'जीएसटी (5%):' : 'GST (5%):'}</span>
                <span className="font-bold font-mono text-slate-800">₹{gstAmount}</span>
              </div>
              {discountFromPoints > 0 && (
                <div className="flex justify-between items-center py-0.5 text-purple-700 font-bold">
                  <span>{lang === 'hi' ? 'लॉयल्टी डिस्काउंट:' : 'Loyalty Discount:'}</span>
                  <span className="font-mono">- ₹{discountFromPoints}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                <span className="text-xs font-black text-slate-900 uppercase">
                  {lang === 'hi' ? 'कुल देय राशि:' : 'Grand Total:'}
                </span>
                <span className="text-2xl font-black text-blue-900 font-mono">₹{grandTotal}</span>
              </div>
            </div>

            {/* Payment Method Selector Grid */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedPayment('cash')}
                className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  selectedPayment === 'cash'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm ring-2 ring-emerald-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-4 h-4 text-emerald-600 mb-1" />
                <span>{lang === 'hi' ? 'नकद' : 'Cash'}</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPayment('upi')}
                className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  selectedPayment === 'upi'
                    ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-sm ring-2 ring-blue-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <QrCode className="w-4 h-4 text-blue-600 mb-1" />
                <span>UPI QR</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedPayment('khata')}
                className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  selectedPayment === 'khata'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm ring-2 ring-amber-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-600 mb-1" />
                <span>{lang === 'hi' ? 'खाता' : 'Khata'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPayment('split');
                  setSplitCash(Math.floor(grandTotal / 2));
                  setSplitUpi(grandTotal - Math.floor(grandTotal / 2));
                }}
                className={`flex flex-col items-center justify-center py-2.5 px-1.5 rounded-xl border transition-all text-xs font-bold cursor-pointer ${
                  selectedPayment === 'split'
                    ? 'bg-purple-50 border-purple-600 text-purple-900 shadow-sm ring-2 ring-purple-200'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Zap className="w-4 h-4 text-purple-600 mb-1" />
                <span>{lang === 'hi' ? 'स्प्लिट' : 'Split'}</span>
              </button>
            </div>

            {/* Split Payment Detailed Inputs (Only when Split is selected) */}
            {selectedPayment === 'split' && (
              <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 space-y-2 text-xs">
                <span className="font-bold text-purple-950 block text-xs">
                  {lang === 'hi' ? `स्प्लिट भुगतान (कुल: ₹${grandTotal}):` : `Split Breakdown (Total: ₹${grandTotal}):`}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-[11px] text-slate-600 font-bold block mb-0.5">{lang === 'hi' ? 'नकद ₹:' : 'Cash ₹:'}</label>
                    <input
                      type="number"
                      value={splitCash}
                      onChange={(e) => setSplitCash(parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-bold block mb-0.5">UPI ₹:</label>
                    <input
                      type="number"
                      value={splitUpi}
                      onChange={(e) => setSplitUpi(parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 font-bold block mb-0.5">{lang === 'hi' ? 'खाता ₹:' : 'Khata ₹:'}</label>
                    <input
                      type="number"
                      value={splitKhata}
                      onChange={(e) => setSplitKhata(parseFloat(e.target.value) || 0)}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded-lg font-mono font-bold text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Big Action Buttons */}
            <button
              type="button"
              onClick={handleCompleteBill}
              className="w-full flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white py-3 rounded-xl font-black text-sm shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{lang === 'hi' ? 'प्रिंट & डिजिटल बिल पूरा करें' : 'Complete & Print Bill'}</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteBill}
              className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 py-2 rounded-xl font-bold text-xs transition-colors active:scale-95 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'hi' ? 'व्हाट्सएप रसीद भेजें' : 'Send WhatsApp Receipt'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Floating Sticky Quick POS Checkout Bar (Always visible on mobile without scrolling) */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-3 inset-x-3 z-40 p-3 rounded-2xl bg-slate-950/95 backdrop-blur-xl text-white shadow-2xl border border-white/20 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
          <div className="min-w-0">
            <div className="text-[10px] text-slate-400 font-bold uppercase truncate">
              {cart.length} {lang === 'hi' ? 'सामान' : 'items'} &bull; {selectedPayment.toUpperCase()}
            </div>
            <div className="text-xl font-black font-mono text-emerald-400">
              ₹{grandTotal}
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => { setSelectedPayment('cash'); handleCompleteBill(); }}
              className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'नकद' : 'Cash'}</span>
            </button>

            <button
              type="button"
              onClick={() => { setSelectedPayment('upi'); handleCompleteBill(); }}
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI</span>
            </button>

            <button
              type="button"
              onClick={handleCompleteBill}
              className="px-3.5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
            >
              <Printer className="w-3.5 h-3.5 text-blue-900" />
              <span>{lang === 'hi' ? 'प्रिंट' : 'Print'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Thermal & Digital Receipt Modal */}
      <ReceiptModal
        lang={lang}
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        receiptData={currentReceipt}
        onNewBill={() => {
          setCart([]);
          setIsReceiptModalOpen(false);
          speakHindi(lang === 'hi' ? 'नया बिल शुरू किया गया' : 'New bill started');
        }}
      />

      {/* Live Camera Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={isBarcodeScannerOpen}
        onClose={() => setIsBarcodeScannerOpen(false)}
        onProductScanned={handleProductBarcodeScanned}
        lang={lang}
      />

      {/* Loose Kirana Barcode Generator Modal */}
      <BarcodeGeneratorModal
        isOpen={isBarcodeGeneratorOpen}
        onClose={() => setIsBarcodeGeneratorOpen(false)}
        onBarcodeCreated={handleProductBarcodeScanned}
        lang={lang}
      />

      {/* Festive Offers & Loyalty Promotions Modal */}
      <PromotionsModal
        isOpen={isPromotionsModalOpen}
        onClose={() => setIsPromotionsModalOpen(false)}
        lang={lang}
      />
    </div>
  );
};
