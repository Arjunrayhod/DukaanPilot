import React from 'react';
import { Receipt, QrCode, PlusCircle, FileSpreadsheet, Sparkles, Zap } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface QuickActionTilesProps {
  lang: Lang;
  onNewBill: () => void;
  onScanBarcode: () => void;
  onShowQr: () => void;
  onAddProduct: () => void;
  onDailyReport: () => void;
  onPromotions?: () => void;
}

export function QuickActionTiles({
  lang,
  onNewBill,
  onScanBarcode,
  onShowQr,
  onAddProduct,
  onDailyReport,
  onPromotions,
}: QuickActionTilesProps) {
  const t = translations[lang];

  return (
    <section className="flex flex-col space-y-4">
      {/* 2 Primary Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Quick Bill Card */}
        <button
          onClick={onNewBill}
          className="flex flex-col justify-between p-5 h-32 rounded-3xl bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white shadow-lg shadow-blue-900/10 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all text-left group relative overflow-hidden border border-blue-700/30 cursor-pointer"
          type="button"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold font-mono border border-white/20">
              F1 Hotkey
            </span>
          </div>
          <div>
            <div className="text-lg font-black leading-tight font-display tracking-tight">{t.newBill}</div>
            <div className="text-xs text-blue-200 font-medium mt-0.5">{t.newBillSub}</div>
          </div>
        </button>

        {/* Scan Barcode Card */}
        <button
          onClick={onScanBarcode}
          className="flex flex-col justify-between p-5 h-32 rounded-3xl bg-white border border-slate-200/90 text-slate-900 shadow-sm hover:shadow-md hover:border-blue-400 hover:scale-[1.01] active:scale-[0.99] transition-all text-left group cursor-pointer"
          type="button"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{t.live}</span>
            </span>
          </div>
          <div>
            <div className="text-lg font-black leading-tight text-slate-900 font-display tracking-tight">{t.scanBarcode}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">{t.scanBarcodeSub}</div>
          </div>
        </button>
      </div>

      {/* Secondary Counter Shortcuts - Dark Translucent Capsule Pills */}
      <div className="flex items-center gap-2.5 overflow-x-auto py-1 no-scrollbar">
        <button
          onClick={onShowQr}
          className="h-10 px-4 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 text-xs font-bold flex items-center gap-2 shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
          type="button"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
          <QrCode className="w-4 h-4 text-blue-300" />
          <span>{t.showQr}</span>
        </button>

        <button
          onClick={onAddProduct}
          className="h-10 px-4 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 text-xs font-bold flex items-center gap-2 shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
          type="button"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <PlusCircle className="w-4 h-4 text-emerald-300" />
          <span>{t.addProduct}</span>
        </button>

        <button
          onClick={onDailyReport}
          className="h-10 px-4 rounded-full bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/20 text-xs font-bold flex items-center gap-2 shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
          type="button"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
          <FileSpreadsheet className="w-4 h-4 text-indigo-300" />
          <span>{t.dailyReport}</span>
        </button>

        {onPromotions && (
          <button
            onClick={onPromotions}
            className="h-10 px-4 rounded-full bg-purple-900/90 hover:bg-purple-900 text-white backdrop-blur-xl border border-purple-400/30 text-xs font-bold flex items-center gap-2 shrink-0 shadow-md transition-all active:scale-95 cursor-pointer"
            type="button"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{lang === 'hi' ? 'त्योहारी ऑफर्स & कूपन' : 'Festive Offers'}</span>
          </button>
        )}
      </div>
    </section>
  );
}
