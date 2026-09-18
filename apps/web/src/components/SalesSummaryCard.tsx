import React from 'react';
import { TrendingUp, Landmark, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface SalesSummaryCardProps {
  lang: Lang;
}

export function SalesSummaryCard({ lang }: SalesSummaryCardProps) {
  const t = translations[lang];

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.totalCollection}
          </span>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">₹8,450.00</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              +14%
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-sm">
          <Landmark className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#eff4ff] border border-blue-100/60 flex items-center justify-between gap-4">
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#dce9ff" strokeWidth="4.2"></circle>
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#00563a" strokeDasharray="27 73" strokeDashoffset="0" strokeWidth="4.2"></circle>
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#0051d5" strokeDasharray="73 27" strokeDashoffset="-27" strokeLinecap="round" strokeWidth="4.2"></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-extrabold text-slate-900 leading-none">60</span>
            <span className="text-[9px] font-bold text-slate-500 leading-none mt-0.5">{t.bills}</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-slate-600">{t.upiShare}</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">₹6,200</div>
            <span className="text-[11px] text-slate-500 font-medium">42 {t.transactions}</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              <span className="text-xs font-bold text-slate-600">{t.cashShare}</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">₹2,250</div>
            <span className="text-[11px] text-slate-500 font-medium">18 {t.transactions}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 truncate font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">{t.autoSettles}</span>
        </div>
        <button className="shrink-0 text-blue-700 font-bold hover:underline flex items-center gap-0.5" type="button">
          <span>{t.settlement}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
