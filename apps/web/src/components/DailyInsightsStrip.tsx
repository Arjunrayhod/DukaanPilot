import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';

export function DailyInsightsStrip() {
  return (
    <section className="grid grid-cols-2 gap-3">
      {/* Top Seller Today Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Award className="w-4 h-4" />
          </span>
          <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            34 \u092c\u093f\u0915\u0947
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 block">\u0938\u092c\u0938\u0947 \u091c\u094d\u092f\u093e\u0926\u093e \u092c\u093f\u0915\u093e \u0938\u093e\u092e\u093e\u0928</span>
          <span className="text-sm font-extrabold text-slate-900 truncate block mt-0.5">\u0905\u092e\u0942\u0932 \u092c\u091f\u0930 500g</span>
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
          <span className="text-[11px] font-bold text-slate-500 block">\u0926\u0941\u0915\u093e\u0928 \u092a\u0930 \u0915\u0941\u0932 \u0917\u094d\u0930\u093e\u0939\u0915</span>
          <span className="text-sm font-extrabold text-slate-900 block mt-0.5">86 Footfall</span>
        </div>
      </div>
    </section>
  );
}
