import React, { useState } from 'react';
import { BookOpen, Send, ArrowRight, Check } from 'lucide-react';

export function KhataSummaryCard() {
  const [remindedList, setRemindedList] = useState<number[]>([]);

  const khataRows = [
    {
      id: 1,
      initials: 'RK',
      colorClass: 'bg-blue-100 text-blue-800',
      name: '\u0930\u092e\u0947\u0936 \u0915\u0941\u092e\u093e\u0930 (Ramesh)',
      amount: '\u20B91,450',
      status: '2 \u0926\u093f\u0928 \u092a\u0939\u0932\u0947 \u0932\u093f\u092f\u093e',
      statusClass: 'text-slate-500',
      phone: '9876543210',
    },
    {
      id: 2,
      initials: 'SV',
      colorClass: 'bg-emerald-100 text-emerald-800',
      name: '\u0938\u0941\u0928\u0940\u0924\u093e \u0935\u0930\u094d\u092e\u093e (Sunita V.)',
      amount: '\u20B9820',
      status: '\u0906\u091c \u0926\u0947\u092f',
      statusClass: 'text-amber-700 font-semibold',
      phone: '9876543211',
    },
    {
      id: 3,
      initials: 'MK',
      colorClass: 'bg-indigo-100 text-indigo-800',
      name: '\u092e\u0939\u0947\u0902\u0926\u094d\u0930 \u0915\u093f\u0930\u093e\u0928\u093e (B2B)',
      amount: '\u20B93,100',
      status: '1 \u0939\u092b\u094d\u0924\u093e \u0932\u0947\u091f',
      statusClass: 'text-rose-600 font-semibold',
      phone: '9876543212',
    },
  ];

  const handleSendReminder = (id: number, name: string, amount: string) => {
    setRemindedList((prev) => [...prev, id]);
    alert(`\u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a \u0924\u0915\u093e\u0926\u093e \u092d\u0947\u091c \u0926\u093f\u092f\u093e \u0917\u092f\u093e: ${name} (${amount})`);
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">\u092c\u0915\u093e\u092f\u093e \u0917\u094d\u0930\u093e\u0939\u0915 \u0916\u093e\u0924\u093e</h3>
            <span className="text-xs text-slate-500 font-medium">Pending Khata Ledger</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
          \u0915\u0941\u0932: \u20B918,650
        </span>
      </div>

      {/* Customer Rows List */}
      <div className="space-y-2.5 pt-1">
        {khataRows.map((row) => {
          const isReminded = remindedList.includes(row.id);
          return (
            <div
              key={row.id}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 ${row.colorClass}`}
                >
                  {row.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{row.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="text-rose-600 font-bold">{row.amount} \u092c\u0915\u093e\u092f\u093e</span>
                    <span>&bull;</span>
                    <span className={row.statusClass}>{row.status}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSendReminder(row.id, row.name, row.amount)}
                className={`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 ${
                  isReminded
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white border border-slate-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 active:scale-95'
                }`}
                type="button"
              >
                {isReminded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>\u092d\u0947\u091c\u093e \u0917\u092f\u093e</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>\u0924\u0915\u093e\u0926\u093e</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* View All CTA */}
      <button
        className="w-full h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors active:scale-98"
        type="button"
      >
        <span>\u0938\u092d\u0940 14 \u0916\u093e\u0924\u0947 \u0926\u0947\u0916\u0947\u0902 (View All Ledger)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
