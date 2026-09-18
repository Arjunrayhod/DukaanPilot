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
      orderQty: `50 ${t.packetsLeft} ${t.orderBtn}`,
    },
    {
      id: 2,
      title: lang === 'hi' ? 'फॉर्च्यून सनफ्लावर ऑयल 1L' : 'Fortune Sunflower Oil 1L',
      remaining: `2 ${t.bottlesLeft}`,
      minThreshold: `(${t.minText} 12)`,
      supplier: `${t.supplier}: ${lang === 'hi' ? 'मेट्रो होलसेल' : 'Metro Wholesale'}`,
      orderQty: `24 ${t.bottlesLeft} ${t.orderBtn}`,
    },
    {
      id: 3,
      title: lang === 'hi' ? 'आशीर्वाद चक्की आटा 5kg' : 'Aashirvaad Chakki Atta 5kg',
      remaining: `3 ${t.bagsLeft}`,
      minThreshold: `(${t.minText} 15)`,
      supplier: `${t.supplier}: ${lang === 'hi' ? 'आईटीसी डायरेक्ट' : 'ITC Direct'}`,
      orderQty: `20 ${t.bagsLeft} ${t.orderBtn}`,
    },
  ];

  const handleOrder = (id: number, title: string, qty: string) => {
    setOrderedItems((prev) => [...prev, id]);
    alert(`Order sent to supplier: ${title} (${qty})`);
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">{t.lowStockTitle}</h3>
            <span className="text-xs text-slate-500 font-medium">{t.lowStockSub}</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
          {t.itemsLow}
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {stockAlerts.map((item) => {
          const isOrdered = orderedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 truncate">{item.title}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="text-rose-600 font-bold">{item.remaining}</span>
                  <span>{item.minThreshold}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {item.supplier}
                </span>
              </div>

              <button
                onClick={() => handleOrder(item.id, item.title, item.orderQty)}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 ${
                  isOrdered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-900 hover:bg-blue-800 text-white active:scale-95'
                }`}
                type="button"
              >
                {isOrdered ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.orderedBtn}</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-3.5 h-3.5" />
                    <span>{item.orderQty}</span>
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
