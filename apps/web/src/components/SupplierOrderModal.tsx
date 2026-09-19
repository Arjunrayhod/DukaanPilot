import React, { useState } from 'react';
import { 
  X, Truck, Phone, MessageSquare, Copy, Check, Calendar, 
  AlertTriangle, Plus, Minus, Building2, Package, Sparkles
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import { 
  Supplier, 
  RestockItem, 
  PurchaseOrder, 
  formatSupplierWhatsAppPO, 
  generateSupplierWhatsAppUrl 
} from '../utils/restockService';
import { speakHindi } from '../utils/voiceFeedback';

interface SupplierOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier;
  items: RestockItem[];
  lang: Lang;
  onOrderPlaced?: (po: PurchaseOrder) => void;
}

export function SupplierOrderModal({
  isOpen,
  onClose,
  supplier,
  items: initialItems,
  lang,
  onOrderPlaced
}: SupplierOrderModalProps) {
  if (!isOpen || !supplier) return null;

  const isHi = lang === 'hi';
  const [orderItems, setOrderItems] = useState(
    initialItems.map((item) => ({
      productId: item.productId,
      name: item.name,
      nameHindi: item.nameHindi,
      qty: item.suggestedOrderQty,
      unit: item.unit,
      costPrice: item.costPrice,
      totalAmount: item.suggestedOrderQty * item.costPrice
    }))
  );

  const [deliveryDate, setDeliveryDate] = useState('कल दोपहर 12 बजे तक (Tomorrow 12 PM)');
  const [notes, setNotes] = useState('कृपया ताज़ा बैच व लंबी एक्सपायरी वाला माल भेजें।');
  const [isCopied, setIsCopied] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const totalEstimate = orderItems.reduce((sum, it) => sum + (it.qty * (it.costPrice || 0)), 0);
  const poNumber = `PO-${Math.floor(1000 + Math.random() * 9000)}`;

  const updateQty = (index: number, delta: number) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const newQty = Math.max(1, item.qty + delta);
        return {
          ...item,
          qty: newQty,
          totalAmount: newQty * (item.costPrice || 0)
        };
      })
    );
  };

  const handleSendWhatsApp = () => {
    const po: PurchaseOrder = {
      id: `po_${Date.now()}`,
      poNumber,
      supplierId: supplier.id,
      supplierName: supplier.name,
      supplierPhone: supplier.phone,
      items: orderItems,
      totalAmount: totalEstimate,
      status: 'ORDERED',
      createdAt: new Date().toLocaleDateString('en-IN'),
      deliveryDate,
      notes
    };

    const shopName = localStorage.getItem('dukaanpilot_shop_name') || 'श्री गणेश किराना स्टोर';
    const shopPhone = localStorage.getItem('dukaanpilot_shop_phone') || '+91 98765 43210';

    const url = generateSupplierWhatsAppUrl(
      {
        poNumber,
        supplierName: supplier.name,
        supplierPhone: supplier.phone,
        contactPerson: supplier.contactPerson,
        items: orderItems,
        totalEstimatedAmount: totalEstimate,
        deliveryDate,
        notes
      },
      {
        name: shopName,
        phone: shopPhone,
        address: 'दुकान नं. 4, मेन मार्केट'
      },
      lang
    );

    window.open(url, '_blank');
    setIsSent(true);
    speakHindi(isHi ? `${supplier.name} को व्हाट्सएप ऑर्डर भेजा गया` : `Order sent to ${supplier.name}`);

    if (onOrderPlaced) {
      onOrderPlaced(po);
    }
  };

  const handleCopyText = () => {
    const shopName = localStorage.getItem('dukaanpilot_shop_name') || 'श्री गणेश किराना स्टोर';
    const shopPhone = localStorage.getItem('dukaanpilot_shop_phone') || '+91 98765 43210';

    const text = formatSupplierWhatsAppPO(
      {
        poNumber,
        supplierName: supplier.name,
        contactPerson: supplier.contactPerson,
        items: orderItems,
        totalEstimatedAmount: totalEstimate,
        deliveryDate,
        notes
      },
      {
        name: shopName,
        phone: shopPhone,
        address: 'दुकान नं. 4, मेन मार्केट'
      },
      lang
    );

    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-blue-300 shadow-inner">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {isHi ? 'सप्लायर री-स्टॉक ऑर्डर' : 'Supplier Restock Order (PO)'}
              </h3>
              <p className="text-xs text-blue-200 font-mono mt-0.5">
                #{poNumber} &bull; {supplier.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Supplier Info Badge */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-black text-slate-900">{supplier.company}</div>
              <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-slate-700">{supplier.contactPerson}</span>
                <span>&bull;</span>
                <span className="font-mono text-blue-600 font-bold">📞 {supplier.phone}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">
                {isHi ? 'डिलीवरी दिन' : 'Delivery Days'}
              </div>
              <div className="text-xs font-bold text-slate-800">
                {supplier.deliveryDays.join(', ')}
              </div>
            </div>
          </div>

          {/* Items to Restock List */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Package className="w-4 h-4 text-indigo-600" />
                <span>{isHi ? 'ऑर्डर की जाने वाली सामग्री' : 'Items to Restock'}</span>
                <span className="text-slate-400">({orderItems.length})</span>
              </label>
              <span className="text-xs text-slate-500 font-medium">
                {isHi ? 'मात्रा बदलें (+ / -)' : 'Adjust Qty'}
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {orderItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3.5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-slate-900 truncate">
                      {isHi && item.nameHindi ? item.nameHindi : item.name}
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      ₹{item.costPrice} / {item.unit} &bull; कुल: <span className="font-bold text-slate-900">₹{(item.qty * (item.costPrice || 0)).toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => updateQty(index, -1)}
                      className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-black transition-all cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-black text-sm font-mono text-slate-900">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQty(index, 1)}
                      className="w-8 h-8 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 flex items-center justify-center font-black transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>{isHi ? 'डिलीवरी समय' : 'Requested Delivery'}</span>
              </label>
              <input
                type="text"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1.5">
                {isHi ? 'विशेष निर्देश / नोट' : 'Order Note'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Estimated Total Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                {isHi ? 'कुल अनुमानित बिल राशि' : 'Estimated PO Total'}
              </div>
              <div className="text-xs text-indigo-700 mt-0.5">
                {orderItems.length} {isHi ? 'सामग्री ऑर्डर में शामिल' : 'items in order'}
              </div>
            </div>
            <div className="text-2xl font-black text-indigo-950 font-mono">
              ₹{totalEstimate.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleCopyText}
            className="px-4 py-3 rounded-2xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
            <span>{isCopied ? (isHi ? 'कॉपी हो गया' : 'Copied') : (isHi ? 'PO कॉपी करें' : 'Copy PO Text')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              {isHi ? 'बंद करें' : 'Close'}
            </button>
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{isHi ? 'WhatsApp पर ऑर्डर भेजें' : 'Send Order on WhatsApp'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
