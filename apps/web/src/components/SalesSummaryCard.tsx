import React from 'react';
import { TrendingUp, Landmark, ArrowUpRight, CheckCircle2, Wallet, CreditCard, Sparkles } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';
import { useTodaySales } from '../utils/salesService';

interface SalesSummaryCardProps {
  lang: Lang;
}

export function SalesSummaryCard({ lang }: SalesSummaryCardProps) {
  const t = translations[lang];
  const { summary, bills } = useTodaySales();

  const totalBills = summary.totalBills;
  const totalSales = summary.totalSales;
  const upiCollected = summary.upiCollected;
  const cashCollected = summary.cashCollected;

  // Calculate bill counts for UPI and Cash
  const upiCount = bills.filter((b) => b.paymentMode === 'upi' || (b.paymentMode === 'split' && (b.splitBreakdown?.upi || 0) > 0)).length;
  const cashCount = bills.filter((b) => b.paymentMode === 'cash' || (b.paymentMode === 'split' && (b.splitBreakdown?.cash || 0) > 0)).length;

  const upiPct = totalSales > 0 ? Math.round((upiCollected / totalSales) * 100) : 0;
  const cashPct = totalSales > 0 ? 100 - upiPct : 0;

  return (
    <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 font-mono">
            {t.totalCollection}
          </span>
          <div className="flex items-baseline gap-3 mt-1.5 flex-wrap">
            <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight font-display font-mono">
              ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            {totalSales > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>{summary.profitMarginPercent}% {lang === 'hi' ? 'मुनाफा' : 'Margin'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-slate-500" />
                <span>{lang === 'hi' ? 'नया दिन शुरू' : 'Fresh Day'}</span>
              </span>
            )}
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-700 shadow-sm shrink-0">
          <Landmark className="w-6 h-6" />
        </div>
      </div>

      {/* Breakdown Strip with Smooth Doughnut & Stats */}
      <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col sm:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" fill="none" r="15.9" stroke="#e2e8f0" strokeWidth="4.2"></circle>
              {totalSales > 0 && (
                <>
                  <circle 
                    cx="20" 
                    cy="20" 
                    fill="none" 
                    r="15.9" 
                    stroke="#10b981" 
                    strokeDasharray={`${cashPct} ${100 - cashPct}`} 
                    strokeDashoffset="0" 
                    strokeWidth="4.2"
                  ></circle>
                  <circle 
                    cx="20" 
                    cy="20" 
                    fill="none" 
                    r="15.9" 
                    stroke="#2563eb" 
                    strokeDasharray={`${upiPct} ${100 - upiPct}`} 
                    strokeDashoffset={`-${cashPct}`} 
                    strokeLinecap="round" 
                    strokeWidth="4.2"
                  ></circle>
                </>
              )}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-sm font-black text-slate-900 leading-none font-mono">{totalBills}</span>
              <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">{t.bills}</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span className="font-bold text-slate-900 block text-sm">{totalBills} {lang === 'hi' ? 'कुल बिल' : 'Total Bills'}</span>
            <span>{totalBills > 0 ? (lang === 'hi' ? 'आज की लाइव बिक्री' : 'Today live sales') : (lang === 'hi' ? 'आज 0 बिल कटे हैं' : 'No bills today yet')}</span>
          </div>
        </div>

        <div className="w-full sm:w-auto flex-1 grid grid-cols-2 gap-4 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-4 sm:pt-0 sm:pl-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-slate-700">{t.upiShare}</span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">₹{upiCollected.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-400 font-medium">{upiCount} {t.transactions}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold text-slate-700">{t.cashShare}</span>
            </div>
            <div className="text-lg font-black text-slate-900 font-mono">₹{cashCollected.toLocaleString('en-IN')}</div>
            <span className="text-[11px] text-slate-400 font-medium">{cashCount} {t.transactions}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
        <div className="flex items-center gap-2 truncate font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">{t.autoSettles}</span>
        </div>
        <button className="shrink-0 text-blue-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer" type="button">
          <span>{t.settlement}</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
}

