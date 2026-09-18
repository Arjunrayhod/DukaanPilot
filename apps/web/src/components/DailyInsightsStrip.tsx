import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface DailyInsightsStripProps {
  lang: Lang;
}

export function DailyInsightsStrip({ lang }: DailyInsightsStripProps) {
  const t = translations[lang];

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Top Seller Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-sm">
            <Award className="w-5 h-5" />
          </span>
          <span className="text-xs font-black text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 font-mono">
            {t.soldCount}
          </span>
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block font-mono">{t.topSellerLabel}</span>
          <span className="text-base font-black text-slate-900 truncate block mt-1 font-display">{t.topSellerItem}</span>
        </div>
      </div>

      {/* Footfall Card */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3">
        <div className="flex items-center justify-between">
          <span className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-sm">
            <Users className="w-5 h-5" />
          </span>
          <span className="inline-flex items-center gap-1 text-emerald-800 text-xs font-black bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            +8 vs Yesterday
          </span>
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block font-mono">{t.footfallLabel}</span>
          <span className="text-base font-black text-slate-900 block mt-1 font-display">{t.footfallCount}</span>
        </div>
      </div>
    </section>
  );
}
