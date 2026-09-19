import React from 'react';
import {
  X,
  Printer,
  Download,
  MessageSquare,
  BookOpen,
  Calendar,
  Phone,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Building2,
  FileText
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import { KhataCustomer, generateKhataWhatsAppUrl } from '../utils/khataService';

interface KhataStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: KhataCustomer | null;
  lang: Lang;
}

export function KhataStatementModal({
  isOpen,
  onClose,
  customer,
  lang
}: KhataStatementModalProps) {
  const isHi = lang === 'hi';

  if (!isOpen || !customer) return null;

  const totalDebited = customer.transactions
    .filter(tx => tx.type === 'DEBIT')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalCredited = customer.transactions
    .filter(tx => tx.type === 'CREDIT')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const url = generateKhataWhatsAppUrl(customer, undefined, lang);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        
        {/* Top Action Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 text-blue-600 border border-blue-500/20 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>{isHi ? '📄 ग्राहक खाता विवरण (Khata Statement)' : '📄 Customer Khata Statement'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {customer.name} &bull; {customer.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-emerald-600" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isHi ? 'प्रिंट / PDF' : 'Print / PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Statement Document */}
        <div id="printable-statement" className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-900 font-sans">
          
          {/* Statement Header / Letterhead */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-slate-900">
            <div>
              <span className="text-[11px] font-black uppercase text-blue-600 tracking-wider block">
                आधिकारिक खाता बही विवरणी (OFFICIAL LEDGER STATEMENT)
              </span>
              <h2 className="text-2xl font-black text-slate-950 mt-0.5">
                {localStorage.getItem('dukaanpilot_shop_name') || 'श्री गणेश किराना स्टोर'}
              </h2>
              <p className="text-xs text-slate-600 font-medium mt-1">
                मेन बाजार &bull; डिजिटल किराना खाता रिकॉर्ड
              </p>
              <p className="text-xs text-slate-600 font-mono">
                हेल्पलाइन / फोन: {localStorage.getItem('dukaanpilot_shop_phone') || '+91 98765 43210'} &bull; UPI ID: {localStorage.getItem('dukaanpilot_shop_upi') || 'shreeganesh@sbi'}
              </p>
            </div>

            <div className="text-right sm:border-l-2 sm:border-slate-200 sm:pl-6 shrink-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">स्टेटमेंट तारीख</span>
              <span className="text-xs font-black font-mono text-slate-900 block">
                {new Date().toLocaleDateString('en-IN')}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 block mt-1">खाता आईडी</span>
              <span className="text-xs font-bold font-mono text-blue-700 block">
                #{customer.id}
              </span>
            </div>
          </div>

          {/* Customer Profile & Net Balance Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="sm:col-span-7 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">ग्राहक का विवरण</span>
              <h4 className="text-base font-extrabold text-slate-950">{customer.name}</h4>
              <p className="text-xs text-slate-600 font-mono flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 {customer.phone}</span>
              </p>
              {customer.address && (
                <p className="text-xs text-slate-500">{customer.address}</p>
              )}
            </div>

            <div className="sm:col-span-5 grid grid-cols-2 gap-2 text-right">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">कुल सामान उधार</span>
                <span className="text-xs font-black text-rose-600 font-mono">₹{totalDebited.toLocaleString('en-IN')}</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                <span className="text-[9px] uppercase font-bold text-slate-400 block">कुल जमा प्राप्त</span>
                <span className="text-xs font-black text-emerald-600 font-mono">₹{totalCredited.toLocaleString('en-IN')}</span>
              </div>
              <div className="col-span-2 bg-slate-900 text-white p-2.5 rounded-xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-300 block">वर्तमान कुल देय बकाया (Net Due)</span>
                <span className="text-lg font-black text-amber-400 font-mono">₹{customer.currentDue.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="space-y-2">
            <h5 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
              {isHi ? 'विस्तृत लेन-देन प्रविष्टियां' : 'Itemized Transaction Entries'}
            </h5>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200 text-[11px] font-black text-slate-700">
                    <th className="p-3">तारीख व समय</th>
                    <th className="p-3">विवरण / बिल सं.</th>
                    <th className="p-3">माध्यम</th>
                    <th className="p-3 text-right">उधार (+)</th>
                    <th className="p-3 text-right">जमा (-)</th>
                    <th className="p-3 text-right">शेष बकाया</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {customer.transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono text-slate-600">
                        {tx.date} <span className="text-[10px] text-slate-400 block">{tx.time}</span>
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        {tx.notes}
                        {tx.billNo && (
                          <span className="text-[10px] text-blue-600 font-mono block">{tx.billNo}</span>
                        )}
                      </td>
                      <td className="p-3 uppercase text-[10px] font-bold text-slate-500">
                        {tx.paymentMode || '-'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-rose-600">
                        {tx.type === 'DEBIT' ? `₹${tx.amount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-600">
                        {tx.type === 'CREDIT' ? `₹${tx.amount.toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="p-3 text-right font-mono font-black text-slate-900">
                        ₹{tx.balanceAfter.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Statement Footer / Authorization & UPI */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-slate-900 block">UPI द्वारा घर बैठे भुगतान हेतु:</span>
              <p className="font-mono text-blue-700 font-bold text-[11px]">shreeganesh@sbi</p>
              <p className="text-[10px] text-slate-400">PhonePe / GPay / Paytm से सीधे भुगतान कर सकते हैं।</p>
            </div>

            <div className="text-center sm:text-right space-y-4">
              <div className="w-36 border-b border-slate-400 pb-1 font-serif text-[11px] italic text-slate-500">
                (हस्ताक्षर / मोहर)
              </div>
              <span className="text-[10px] font-bold text-slate-400 block uppercase">
                श्री गणेश किराना स्टोर
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
