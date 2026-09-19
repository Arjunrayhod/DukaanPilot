import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Check, Clock, Phone, MessageSquare, ArrowRight, 
  Sparkles, CheckCircle2, ChevronRight, PackageCheck, AlertCircle, Printer,
  Truck, MapPin
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import { 
  OnlineCustomerOrder, 
  getOnlineOrders, 
  updateOrderStatus 
} from '../utils/orderService';
import { speakHindi } from '../utils/voiceFeedback';

interface OnlineOrdersCardProps {
  lang: Lang;
  onConvertToPosBill?: (order: OnlineCustomerOrder) => void;
}

export function OnlineOrdersCard({ lang, onConvertToPosBill }: OnlineOrdersCardProps) {
  const isHi = lang === 'hi';
  const [orders, setOrders] = useState<OnlineCustomerOrder[]>([]);

  const loadOrders = () => {
    setOrders(getOnlineOrders());
  };

  useEffect(() => {
    loadOrders();

    const handleNewOrder = (e: any) => {
      loadOrders();
      if (e.detail?.customerName) {
        speakHindi(isHi ? `नया ऑनलाइन ऑर्डर आया है: ${e.detail.customerName}` : `New order from ${e.detail.customerName}`);
      }
    };

    const handleOrdersUpdated = () => {
      loadOrders();
    };

    window.addEventListener('dukaanpilot_new_order', handleNewOrder);
    window.addEventListener('dukaanpilot_orders_updated', handleOrdersUpdated);

    return () => {
      window.removeEventListener('dukaanpilot_new_order', handleNewOrder);
      window.removeEventListener('dukaanpilot_orders_updated', handleOrdersUpdated);
    };
  }, [lang, isHi]);

  const handleUpdateStatus = (orderId: string, status: OnlineCustomerOrder['status'], customerName: string) => {
    const updated = updateOrderStatus(orderId, status);
    setOrders(updated);

    if (status === 'ACCEPTED') {
      speakHindi(isHi ? `${customerName} का ऑर्डर स्वीकार किया गया` : `Order accepted for ${customerName}`);
    } else if (status === 'PACKED') {
      speakHindi(isHi ? `ऑर्डर पैक हो गया है` : `Order marked as packed`);
    } else if (status === 'DELIVERED') {
      speakHindi(isHi ? `ऑर्डर डिलीवर पूरा हुआ` : `Order marked as delivered`);
    }
  };

  const handleWhatsAppCustomer = (phone: string, orderNumber: string, customerName: string) => {
    const msg = encodeURIComponent(
      `नमस्ते ${customerName} जी! आपका ऑर्डर #${orderNumber} श्री गणेश किराना स्टोर द्वारा तैयार किया जा रहा है। धन्यवाद!`
    );
    window.open(`https://api.whatsapp.com/send?phone=91${phone}&text=${msg}`, '_blank');
  };

  const pendingOrders = orders.filter((o) => o.status === 'NEW' || o.status === 'ACCEPTED' || o.status === 'PACKED');
  const newCount = orders.filter((o) => o.status === 'NEW').length;

  if (pendingOrders.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5">
      {/* Card Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700 shrink-0 shadow-sm relative">
            <ShoppingBag className="w-5 h-5" />
            {newCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 border-2 border-white animate-ping"></span>
            )}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold text-slate-900 truncate font-display tracking-tight">
                {isHi ? 'लाइव ऑनलाइन ग्राहक ऑर्डर' : 'Live Online Customer Orders'}
              </h3>
              {newCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                  {newCount} {isHi ? 'नया' : 'NEW'}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400 font-medium">
              {isHi ? 'WhatsApp व कस्टमर पोर्टल से प्राप्त तुरंत आर्डर' : 'Incoming orders from Customer Portal & WhatsApp'}
            </span>
          </div>
        </div>

        <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-black font-mono">
          {pendingOrders.length} {isHi ? 'सक्रिय ऑर्डर' : 'Active Orders'}
        </span>
      </div>

      {/* Orders List */}
      <div className="space-y-3.5 pt-1">
        {pendingOrders.map((order) => {
          const isNew = order.status === 'NEW';
          const isAccepted = order.status === 'ACCEPTED';
          const isPacked = order.status === 'PACKED';

          return (
            <div
              key={order.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                isNew
                  ? 'bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border-blue-200 shadow-xs ring-1 ring-blue-400/30'
                  : 'bg-slate-50/70 border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 font-black text-xs flex items-center justify-center font-mono">
                    #{order.orderNumber.replace('ORD-', '')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900 font-display">
                        {order.customerName}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          isNew
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : isAccepted
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {isNew ? (isHi ? 'नया ऑर्डर' : 'NEW') : isAccepted ? (isHi ? 'स्वीकृत' : 'ACCEPTED') : (isHi ? 'पैक हुआ' : 'PACKED')}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          order.deliveryType === 'PICKUP'
                            ? 'bg-slate-100 text-slate-700 border border-slate-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {order.deliveryType === 'PICKUP' ? '🏬 पिकअप' : '🏠 होम डिलीवरी'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2 font-mono mt-0.5">
                      <span>📞 {order.customerPhone}</span>
                      <span>&bull;</span>
                      <span>🕒 {order.createdAt}</span>
                      {order.deliveryAddress && (
                        <>
                          <span>&bull;</span>
                          <span className="text-indigo-700 font-sans font-medium flex items-center gap-0.5 truncate max-w-[200px]">
                            <MapPin className="w-3 h-3 shrink-0" />
                            {order.deliveryAddress}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="text-right sm:shrink-0">
                  <div className="text-lg font-black font-mono text-indigo-950">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    {order.items.length} {isHi ? 'सामग्री' : 'items'}
                  </div>
                </div>
              </div>

              {/* Items Summary */}
              <div className="py-2.5 flex flex-wrap gap-2 text-xs">
                {order.items.map((it, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-xl bg-white border border-slate-200/80 text-slate-700 font-semibold shadow-2xs"
                  >
                    <span className="font-bold text-indigo-700 font-mono">{it.qty}x</span> {it.hindiName || it.name}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWhatsAppCustomer(order.customerPhone, order.orderNumber, order.customerName)}
                    className="h-8 px-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    type="button"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </button>

                  {onConvertToPosBill && (
                    <button
                      onClick={() => onConvertToPosBill(order)}
                      className="h-8 px-3.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                      type="button"
                    >
                      <Printer className="w-3.5 h-3.5 text-indigo-700" />
                      <span>{isHi ? 'POS बिल बनाएं' : 'Convert to Bill'}</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isNew && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'ACCEPTED', order.customerName)}
                      className="h-8 px-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      type="button"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>{isHi ? 'स्वीकार करें' : 'Accept'}</span>
                    </button>
                  )}

                  {isAccepted && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'PACKED', order.customerName)}
                      className="h-8 px-4 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      type="button"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>{isHi ? 'पैक हो गया' : 'Mark Packed'}</span>
                    </button>
                  )}

                  {isPacked && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, 'DELIVERED', order.customerName)}
                      className="h-8 px-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                      type="button"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isHi ? 'डिलीवर हुआ (Complete)' : 'Delivered'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}