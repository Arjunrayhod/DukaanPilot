import React, { useState } from 'react';
import { AlertTriangle, Truck, Check } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface LowStockAlertsProps {
  lang: Lang;
}

export function LowStockAlerts({ lang }: LowStockAlertsProps) {
  const t = translations[lang];
  const [orderedItems, setOrderedItems] = useState<number[]>([]);

  const stockAlerts = [
    {
      id: 1,
      title: lang === 'hi' ? 'टाटा नमक (Tata Salt 1kg)' : 'Tata Salt 1kg',
      remaining: `4 ${t.packetsLeft}`,
      minThreshold: `(${t.minText} 25)`,
      supplier: `${t.supplier}: ${lang === 'hi' ? 'बालाजी एजेंसीज़' : 'Balaji Agencies'}`,
      orderQty: `50 ${t.packetsLeft}`,
    },
    {
      id: 2,
      title: lang === 'hi' ? 'फॉर्च्यून सनफ्लावर ऑयल 1L' : 'Fortune Sunflower Oil 1L',
      remaining: `2 ${t.bottlesLeft}`,
      minThreshold: `(${t.minText} 12)`,
      supplier: `${t.supplier}: ${lang === 'hi' ? 'मेट्रो होलसेल' : 'Metro Wholesale'}`,
      orderQty: `24 ${t.bottlesLeft}`,
    },
    {
      id: 3,
      title: lang === 'hi' ? 'आशीर्वाद चक्की आटा 5kg' : 'Aashirvaad Chakki Atta 5kg',
      remaining: `3 ${t.bagsLeft}`,
      minThreshold: `(${t.minText} 15)`,
      supplier: `${t.supplier}: ${lang === 'hi' ? 'आईटीसी डायरेक्ट' : 'ITC Direct'}`,
      orderQty: `20 ${t.bagsLeft}`,
    },
  ];

  const handleOrder = (id: number, title: string, qty: string) => {
    setOrderedItems((prev) => [...prev, id]);
    alert(lang === 'hi' ? `सप्लायर को ऑर्डर भेजा गया: ${title} (${qty})` : `Order sent to supplier: ${title} (${qty})`);
  };

  return (
    <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-extrabold text-slate-900 truncate font-display tracking-tight">{t.lowStockTitle}</h3>
            <span className="text-xs text-slate-400 font-medium">{t.lowStockSub}</span>
          </div>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black font-mono">
          {t.itemsLow}
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {stockAlerts.map((item) => {
          const isOrdered = orderedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-4 hover:bg-slate-50 transition-all shadow-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 truncate font-display">{item.title}</div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="text-rose-600 font-black font-mono">{item.remaining}</span>
                  <span className="text-slate-400">{item.minThreshold}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {item.supplier}
                </span>
              </div>

              <button
                onClick={() => handleOrder(item.id, item.title, item.orderQty)}
                className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer ${
                  isOrdered
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/15 active:scale-95'
                }`}
                type="button"
              >
                {isOrdered ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.orderedBtn}</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <Truck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{item.orderQty} {t.orderBtn}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
