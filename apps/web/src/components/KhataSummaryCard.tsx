import React from 'react';
import { BookOpen, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const KhataSummaryCard: React.FC = () => {
  const debtors = [
    { id: 1, name: 'Ramesh Kumar', phone: '+91 98234 56789', pending: '?1,450', days: '12 days ago' },
    { id: 2, name: 'Priya Sharma', phone: '+91 97112 34567', pending: '?820', days: '3 days ago' },
    { id: 3, name: 'Amit Verma', phone: '+91 99887 11223', pending: '?2,100', days: '15 days ago' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Digital Khata Ledger • ?????? ???? ???????
            </h3>
            <span className="text-xs text-slate-500">18 Customers with outstanding credit</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold font-display text-slate-900">?14,200</span>
          <span className="text-[10px] text-red-600 block font-semibold">?3,800 due today</span>
        </div>
      </div>

      {/* Debtor Snippets */}
      <div className="space-y-2">
        {debtors.map((debtor) => (
          <div
            key={debtor.id}
            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div>
              <span className="text-xs font-bold text-slate-800 block">{debtor.name}</span>
              <span className="text-[10px] text-slate-400">
                {debtor.phone} • {debtor.days}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">{debtor.pending}</span>
              <button className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors title='Send WhatsApp Reminder'">
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ledger Actions */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2 px-3 rounded-xl font-bold text-xs shadow-sm transition-colors">
          <Send className="w-3.5 h-3.5" />
          <span>Send Reminders to All</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-3 rounded-xl font-semibold text-xs transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Settle Khata Bill</span>
        </button>
      </div>
    </div>
  );
};
