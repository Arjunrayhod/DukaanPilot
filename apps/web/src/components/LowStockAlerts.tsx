import React from 'react';
import { AlertTriangle, Send, PackageX, CheckCircle } from 'lucide-react';

export const LowStockAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      name: 'Aashirvaad Shudh Chakki Atta 10kg',
      hindi: '???????? ????? ???',
      remaining: 2,
      minThreshold: 5,
      supplier: 'Bansal Wholesale Mart',
      reorderQty: '10 bags',
    },
    {
      id: 2,
      name: 'Fortune Kachi Ghani Mustard Oil 1L',
      hindi: '????????? ????? ???',
      remaining: 1,
      minThreshold: 6,
      supplier: 'Jindal Distributors',
      reorderQty: '12 bottles',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Low Stock Alerts • ?? ????? ???????
            </h3>
            <span className="text-xs text-amber-700 font-medium">2 items urgent reorder required</span>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
          High Urgency
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="border border-amber-200/80 bg-amber-50/40 rounded-xl p-3 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-slate-900">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">({item.hindi})</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-600 mt-0.5">
                <span className="text-red-600 font-bold">Only {item.remaining} left</span>
                <span>•</span>
                <span>Supplier: {item.supplier}</span>
              </div>
            </div>
            <button className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95">
              <Send className="w-3 h-3" />
              <span>Auto PO</span>
            </button>
          </div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors">
        <span>? 1-Click WhatsApp Purchase Order to All Distributors</span>
      </button>
    </div>
  );
};
