import React, { useState } from 'react';
import { AlertTriangle, Truck, Check } from 'lucide-react';

export function LowStockAlerts() {
  const [orderedItems, setOrderedItems] = useState<number[]>([]);

  const stockAlerts = [
    {
      id: 1,
      title: '\u091f\u093e\u091f\u093e \u0928\u092e\u0915 (Tata Salt 1kg)',
      remaining: '4 \u092a\u0948\u0915\u0947\u091f \u092c\u091a\u0947',
      minThreshold: '(\u0928\u094d\u092f\u0942\u0928\u0924\u092e 25)',
      supplier: '\u0938\u092a\u094d\u0932\u093e\u092f\u0930: \u092c\u093e\u0932\u093e\u091c\u0940 \u090f\u091c\u0947\u0902\u0938\u0940\u091c\u093c',
      orderQty: '50 \u092a\u0948\u0915\u0947\u091f \u0911\u0930\u094d\u0921\u0930',
    },
    {
      id: 2,
      title: '\u092b\u0949\u0930\u094d\u091a\u094d\u092f\u0942\u0928 \u0938\u0928\u092b\u094d\u0932\u093e\u0935\u0930 \u0911\u092f\u0932 1L',
      remaining: '2 \u092c\u094b\u0924\u0932 \u092c\u091a\u0940',
      minThreshold: '(\u0928\u094d\u092f\u0942\u0928\u0924\u092e 12)',
      supplier: '\u0938\u092a\u094d\u0932\u093e\u092f\u0930: \u092e\u0947\u091f\u094d\u0930\u094b \u0939\u094b\u0932\u0938\u0947\u0932',
      orderQty: '24 \u092c\u094b\u0924\u0932 \u0911\u0930\u094d\u0921\u0930',
    },
    {
      id: 3,
      title: '\u0906\u0936\u0940\u0930\u094d\u0935\u093e\u0926 \u091a\u0915\u094d\u0915\u0940 \u0906\u091f\u093e 5kg',
      remaining: '3 \u092c\u0948\u0917 \u092c\u091a\u0947',
      minThreshold: '(\u0928\u094d\u092f\u0942\u0928\u0924\u092e 15)',
      supplier: '\u0938\u092a\u094d\u0932\u093e\u092f\u0930: \u0906\u0908\u091f\u0940\u0938\u0940 \u0921\u093e\u092f\u0930\u0947\u0915\u094d\u091f',
      orderQty: '20 \u092c\u0948\u0917 \u0911\u0930\u094d\u0921\u0930',
    },
  ];

  const handleOrder = (id: number, title: string, qty: string) => {
    setOrderedItems((prev) => [...prev, id]);
    alert(`\u0938\u092a\u094d\u0932\u093e\u092f\u0930 \u0915\u094b \u0911\u0930\u094d\u0921\u0930 \u092d\u0947\u091c \u0926\u093f\u092f\u093e \u0917\u092f\u093e: ${title} (${qty})`);
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">\u0915\u092e \u0938\u094d\u091f\u0949\u0915 \u0905\u0932\u0930\u094d\u091f</h3>
            <span className="text-xs text-slate-500 font-medium">Smart Low Stock Watch</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
          3 \u0906\u0907\u091f\u092e\u094d\u0938 \u0915\u092e
        </span>
      </div>

      {/* Stock Alerts List */}
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
                    <span>\u0911\u0930\u094d\u0921\u0930 \u092d\u0947\u091c\u093e</span>
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
