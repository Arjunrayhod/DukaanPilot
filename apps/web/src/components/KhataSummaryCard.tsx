import React, { useState } from 'react';
import { BookOpen, ArrowRight, Check, MessageSquare } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';
import { generateKhataWhatsAppUrl } from '../utils/khataService';

interface KhataSummaryCardProps {
  lang: Lang;
  onOpenKhata?: () => void;
}

export function KhataSummaryCard({ lang, onOpenKhata }: KhataSummaryCardProps) {
  const t = translations[lang];
  const [remindedList, setRemindedList] = useState<number[]>([]);

  const khataRows = [
    {
      id: 1,
      initials: 'RK',
      colorClass: 'bg-blue-100 text-blue-800',
      name: lang === 'hi' ? 'रमेश कुमार (Ramesh)' : 'Ramesh Kumar',
      amount: '₹1,450',
      amountNum: 1450,
      status: t.daysAgo,
      statusClass: 'text-slate-500',
      phone: '9876543210',
    },
    {
      id: 2,
      initials: 'SV',
      colorClass: 'bg-emerald-100 text-emerald-800',
      name: lang === 'hi' ? 'सुनीता वर्मा (Sunita V.)' : 'Sunita Verma',
      amount: '₹820',
      amountNum: 820,
      status: t.dueToday,
      statusClass: 'text-amber-700 font-semibold',
      phone: '9876543211',
    },
    {
      id: 3,
      initials: 'MK',
      colorClass: 'bg-indigo-100 text-indigo-800',
      name: lang === 'hi' ? 'महेंद्र किराना (B2B)' : 'Mahendra Kirana (B2B)',
      amount: '₹3,100',
      amountNum: 3100,
      status: t.weekLate,
      statusClass: 'text-rose-600 font-semibold',
      phone: '9876543212',
    },
  ];

  const handleSendReminder = (id: number, name: string, phone: string, amountNum: number) => {
    setRemindedList((prev) => [...prev, id]);
    const url = generateKhataWhatsAppUrl(
      {
        phone,
        name,
        currentDue: amountNum,
      },
      {
        name: 'श्री गणेश किराना स्टोर (Shree Ganesh Kirana)',
        phone: '+91 98765 43210',
        upiId: 'shreeganesh@sbi',
      },
      lang
    );
    window.open(url, '_blank');
  };

  return (
    <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200/70 flex items-center justify-center text-amber-700 shrink-0 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-extrabold text-slate-900 truncate font-display tracking-tight">{t.pendingKhata}</h3>
            <span className="text-xs text-slate-400 font-medium">{t.pendingKhataSub}</span>
          </div>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black font-mono">
          {t.totalDue}
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {khataRows.map((row) => {
          const isReminded = remindedList.includes(row.id);
          return (
            <div
              key={row.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-4 hover:bg-slate-50 transition-all shadow-xs"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black shrink-0 ${row.colorClass}`}
                >
                  {row.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate font-display">{row.name}</div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                    <span className="text-rose-600 font-black font-mono">{row.amount} {t.due}</span>
                    <span>&bull;</span>
                    <span className={row.statusClass}>{row.status}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSendReminder(row.id, row.name, row.phone, row.amountNum)}
                className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer ${
                  isReminded
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/15 active:scale-95'
                }`}
                type="button"
              >
                {isReminded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.reminded}</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                    <span>{t.remindBtn}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (onOpenKhata) {
            onOpenKhata();
          } else {
            alert(lang === 'hi' ? 'सभी खाते लोड किए जा रहे हैं...' : 'Loading all accounts...');
          }
        }}
        className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        type="button"
      >
        <span>{t.viewAllLedger}</span>
        <ArrowRight className="w-4 h-4 text-slate-500" />
      </button>
    </section>
  );
}
