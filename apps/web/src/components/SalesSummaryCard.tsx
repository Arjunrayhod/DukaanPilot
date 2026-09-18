import React from 'react';
import { TrendingUp, QrCode, Banknote, ReceiptText, PlusCircle } from 'lucide-react';

export const SalesSummaryCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Today's Business � ?? ?? ??? ??????
          </span>
          <div className="flex items-baseline space-x-3 mt-1">
            <h3 className="text-3xl font-extrabold font-display text-slate-900">
              ?8,450
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              +12% vs y'day
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">42 Bills Total</span>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">
            Avg Bill: ?201
          </span>
        </div>
      </div>

      {/* Payment Breakdowns (UPI vs Cash) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">UPI / QR Online</span>
              <span className="text-sm font-bold text-slate-800">?6,200</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">73%</span>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Cash in Drawer</span>
              <span className="text-sm font-bold text-slate-800">?2,250</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">27%</span>
        </div>
      </div>

      {/* Quick POS Action Buttons */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm transition-colors">
          <ReceiptText className="w-4 h-4" />
          <span>New Bill (F1)</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors">
          <PlusCircle className="w-4 h-4 text-slate-600" />
          <span>Add Stock Item</span>
        </button>
      </div>
    </div>
  );
};
