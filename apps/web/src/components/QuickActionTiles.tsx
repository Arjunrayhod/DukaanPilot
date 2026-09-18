import React from 'react';
import { Receipt, QrCode, PlusCircle, FileSpreadsheet } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface QuickActionTilesProps {
  lang: Lang;
  onNewBill: () => void;
  onScanBarcode: () => void;
  onShowQr: () => void;
  onAddProduct: () => void;
  onDailyReport: () => void;
}

export function QuickActionTiles({
  lang,
  onNewBill,
  onScanBarcode,
  onShowQr,
  onAddProduct,
  onDailyReport,
}: QuickActionTilesProps) {
  const t = translations[lang];

  return (
    <section className="flex flex-col space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Quick Bill Card */}
        <button
          onClick={onNewBill}
          className="flex flex-col justify-between p-4 h-28 rounded-2xl bg-blue-900 text-white shadow-md hover:bg-blue-800 active:scale-[0.98] transition-all text-left group relative overflow-hidden"
          type="button"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold font-mono">F1</span>
          </div>
          <div>
            <div className="text-base font-bold leading-tight">{t.newBill}</div>
            <div className="text-xs text-blue-200 font-medium">{t.newBillSub}</div>
          </div>
        </button>

        {/* Scan Barcode Card */}
        <button
          onClick={onScanBarcode}
          className="flex flex-col justify-between p-4 h-28 rounded-2xl bg-white border border-slate-200/90 text-slate-900 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all text-left group"
          type="button"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              {t.live}
            </span>
          </div>
          <div>
            <div className="text-base font-bold leading-tight text-slate-900">{t.scanBarcode}</div>
            <div className="text-xs text-slate-500 font-medium">{t.scanBarcodeSub}</div>
          </div>
        </button>
      </div>

      {/* Secondary Counter Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <button
          onClick={onShowQr}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <QrCode className="w-4 h-4 text-blue-600" />
          <span>{t.showQr}</span>
        </button>

        <button
          onClick={onAddProduct}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>{t.addProduct}</span>
        </button>

        <button
          onClick={onDailyReport}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>{t.dailyReport}</span>
        </button>
      </div>
    </section>
  );
}
