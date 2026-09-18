import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface DailyInsightsStripProps {
  lang: Lang;
}

export function DailyInsightsStrip({ lang }: DailyInsightsStripProps) {
  const t = translations[lang];

  return (
    <section className="grid grid-cols-2 gap-3">
      {/* Top Seller Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Award className="w-4 h-4" />
          </span>
          <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {t.soldCount}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 block">{t.topSellerLabel}</span>
          <span className="text-sm font-extrabold text-slate-900 truncate block mt-0.5">{t.topSellerItem}</span>
        </div>
      </div>

      {/* Footfall Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Users className="w-4 h-4" />
          </span>
          <span className="inline-flex items-center gap-0.5 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5" />
            +8
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 block">{t.footfallLabel}</span>
          <span className="text-sm font-extrabold text-slate-900 block mt-0.5">{t.footfallCount}</span>
        </div>
      </div>
    </section>
  );
}
