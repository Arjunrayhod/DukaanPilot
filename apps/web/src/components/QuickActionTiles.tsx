import React from 'react';
import { Receipt, QrCode, PlusCircle, FileSpreadsheet } from 'lucide-react';

interface QuickActionTilesProps {
  onNewBill: () => void;
  onScanBarcode: () => void;
  onShowQr: () => void;
  onAddProduct: () => void;
  onDailyReport: () => void;
}

export function QuickActionTiles({
  onNewBill,
  onScanBarcode,
  onShowQr,
  onAddProduct,
  onDailyReport,
}: QuickActionTilesProps) {
  return (
    <section className="flex flex-col space-y-3">
      {/* 2 Primary Action Cards */}
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
            <div className="text-base font-bold leading-tight">\u0928\u092f\u093e \u092c\u093f\u0932 \u092c\u0928\u093e\u090f\u0901</div>
            <div className="text-xs text-blue-200 font-medium">New Quick Bill</div>
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
              Live
            </span>
          </div>
          <div>
            <div className="text-base font-bold leading-tight text-slate-900">\u092c\u093e\u0930\u0915\u094b\u0921 \u0938\u094d\u0915\u0948\u0928</div>
            <div className="text-xs text-slate-500 font-medium">Instant Scan &amp; Add</div>
          </div>
        </button>
      </div>

      {/* Secondary Counter Shortcuts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <button
          onClick={onShowQr}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <QrCode className="w-4 h-4 text-blue-600" />
          <span>\u0926\u0941\u0915\u093e\u0928 QR \u0926\u093f\u0916\u093e\u090f\u0901</span>
        </button>

        <button
          onClick={onAddProduct}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>\u0928\u092f\u093e \u0938\u093e\u092e\u093e\u0928 \u091c\u094b\u0921\u093c\u0947\u0902</span>
        </button>

        <button
          onClick={onDailyReport}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>\u0921\u0947\u0932\u0940 Z-\u0930\u093f\u092a\u094b\u0930\u094d\u091f</span>
        </button>
      </div>
    </section>
  );
}
