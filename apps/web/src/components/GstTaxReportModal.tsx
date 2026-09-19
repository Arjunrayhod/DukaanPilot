import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  X,
  ShieldCheck,
  Building2,
  Calendar,
  CheckCircle2,
  Search,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Receipt
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import {
  HSN_CATALOG,
  computeGstForCart,
  generateGstr1Csv,
  HsnMasterEntry
} from '../utils/gstTaxService';
import { getStoredTodayBills, CompletedBill } from '../utils/salesService';

interface GstTaxReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  shopName?: string;
  shopPhone?: string;
  shopInfo?: {
    name?: string;
    phone?: string;
    gstin?: string;
    state?: string;
  };
}

export function GstTaxReportModal({
  isOpen,
  onClose,
  lang,
  shopName,
  shopPhone,
  shopInfo
}: GstTaxReportModalProps) {
  const isHi = lang === 'hi';
  const [activeTab, setActiveTab] = useState<'SUMMARY' | 'INVOICES' | 'HSN_MASTER'>('SUMMARY');
  const [hsnSearch, setHsnSearch] = useState('');

  const activeShopName = shopInfo?.name || shopName || 'श्री गणेश किराना स्टोर';
  const activeGstin = shopInfo?.gstin || '07AAAAA0000A1Z5';
  const bills: CompletedBill[] = getStoredTodayBills();

  if (!isOpen) return null;

  // Calculate aggregated GST stats
  let totalTaxable = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalGst = 0;
  let totalGross = 0;

  const rateAggregation: Record<number, { taxable: number; cgst: number; sgst: number; totalGst: number }> = {
    0: { taxable: 0, cgst: 0, sgst: 0, totalGst: 0 },
    5: { taxable: 0, cgst: 0, sgst: 0, totalGst: 0 },
    12: { taxable: 0, cgst: 0, sgst: 0, totalGst: 0 },
    18: { taxable: 0, cgst: 0, sgst: 0, totalGst: 0 },
  };

  const invoiceTaxList = bills.map((bill: CompletedBill) => {
    const calc = computeGstForCart(
      (bill.items || []).map((it: any) => ({
        id: String(it.id || 'it'),
        name: it.name || 'Item',
        qty: it.qty || 1,
        price: it.price || 0,
      }))
    );

    totalTaxable += calc.totalTaxableAmount;
    totalCgst += calc.totalCgst;
    totalSgst += calc.totalSgst;
    totalGst += calc.totalGst;
    totalGross += calc.grandTotal;

    for (const [r, sum] of Object.entries(calc.rateSummary)) {
      const rate = Number(r);
      if (rateAggregation[rate]) {
        rateAggregation[rate].taxable += sum.taxable;
        rateAggregation[rate].cgst += sum.cgst;
        rateAggregation[rate].sgst += sum.sgst;
        rateAggregation[rate].totalGst += sum.totalGst;
      }
    }

    return {
      bill,
      calc,
    };
  });

  const handleDownloadCsv = () => {
    const csvContent = generateGstr1Csv(bills);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GSTR-1_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredHsn = HSN_CATALOG.filter(
    (h) =>
      h.hsn.includes(hsnSearch) ||
      h.category.toLowerCase().includes(hsnSearch.toLowerCase()) ||
      h.categoryHindi.includes(hsnSearch) ||
      h.description.toLowerCase().includes(hsnSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
                <FileSpreadsheet className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  <span>GST Act & HSN Compliant</span>
                </div>
                <h3 className="text-xl font-black font-display tracking-tight text-white mt-0.5">
                  {isHi ? 'जीएसटी इनवॉइसिंग व GSTR टैक्स रिपोर्ट' : 'GST Invoicing & GSTR-1 Tax Reports'}
                </h3>
                <p className="text-xs text-blue-200/80 mt-0.5">
                  {shopName} &bull; GSTIN: 07AAAAA0000A1Z5 &bull; {bills.length} {isHi ? 'बिल दर्ज' : 'Billed Orders'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black shadow-md flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>{isHi ? 'GSTR-1 CSV डाउनलोड' : 'Export GSTR-1 CSV'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveTab('SUMMARY')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SUMMARY'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHi ? 'टैक्स स्लैब सारांश' : 'Tax Slab Summary'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('INVOICES')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'INVOICES'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <Receipt className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHi ? 'इनवॉइस वार विवरण' : 'Invoice-wise Breakdown'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('HSN_MASTER')}
              className={`py-2 px-3.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'HSN_MASTER'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isHi ? 'HSN कोड मास्टर सूची' : 'HSN Code Master'}</span>
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'SUMMARY' && (
            <div className="space-y-5">
              {/* Grand Total Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    {isHi ? 'कुल कर-योग्य बिक्री' : 'Taxable Value'}
                  </span>
                  <span className="text-lg font-black font-mono text-slate-900 mt-1 block">
                    ₹{totalTaxable.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-700 uppercase block">
                    {isHi ? 'कुल CGST (Central)' : 'Total CGST'}
                  </span>
                  <span className="text-lg font-black font-mono text-blue-900 mt-1 block">
                    ₹{totalCgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <span className="text-[11px] font-bold text-indigo-700 uppercase block">
                    {isHi ? 'कुल SGST (State)' : 'Total SGST'}
                  </span>
                  <span className="text-lg font-black font-mono text-indigo-900 mt-1 block">
                    ₹{totalSgst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase block">
                    {isHi ? 'कुल टैक्स एकत्र' : 'Total GST Collected'}
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-900 mt-1 block">
                    ₹{totalGst.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* GST Slab Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {isHi ? 'GST दर अनुसार बिक्री व टैक्स स्लैब' : 'GST Rate-wise Summary Breakdown'}
                </h4>

                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                  <div className="bg-slate-50 p-3 font-bold text-slate-600 grid grid-cols-5 text-center">
                    <span className="text-left">{isHi ? 'टैक्स दर' : 'Rate'}</span>
                    <span>{isHi ? 'कर-योग्य मूल्य' : 'Taxable Value'}</span>
                    <span>CGST</span>
                    <span>SGST</span>
                    <span className="text-right">{isHi ? 'कुल टैक्स' : 'Total Tax'}</span>
                  </div>

                  {Object.entries(rateAggregation).map(([rate, val]) => (
                    <div key={rate} className="p-3 grid grid-cols-5 text-center items-center font-medium">
                      <span className="text-left font-bold text-slate-900">
                        {rate === '0' ? (isHi ? '0% (कर मुक्त)' : '0% (Exempt)') : `${rate}% GST`}
                      </span>
                      <span className="font-mono">₹{val.taxable.toFixed(2)}</span>
                      <span className="font-mono text-blue-700">₹{val.cgst.toFixed(2)}</span>
                      <span className="font-mono text-indigo-700">₹{val.sgst.toFixed(2)}</span>
                      <span className="text-right font-black font-mono text-emerald-700">₹{val.totalGst.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'INVOICES' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase">
                  {isHi ? `बिल सूची (${invoiceTaxList.length})` : `Invoice Entries (${invoiceTaxList.length})`}
                </span>
              </div>

              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs">
                {invoiceTaxList.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    {isHi ? 'कोई बिल उपलब्ध नहीं है।' : 'No billed invoices found.'}
                  </div>
                ) : (
                  invoiceTaxList.map(({ bill, calc }: { bill: CompletedBill; calc: any }, i: number) => (
                    <div key={i} className="p-3.5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900">#{bill.invoiceNo}</span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-700 font-mono">
                            {bill.dateFormatted || bill.timeFormatted}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-blue-50 text-blue-700 uppercase">
                            {bill.paymentMode}
                          </span>
                        </div>
                        <div className="text-slate-600 text-xs mt-1">
                          {bill.customerName || (isHi ? 'ग्राहक' : 'Customer')} &bull; {calc.items.length} {isHi ? 'सामान' : 'items'}
                        </div>
                      </div>

                      <div className="text-left sm:text-right font-mono">
                        <div className="text-sm font-black text-slate-950">₹{bill.grandTotal}</div>
                        <div className="text-[11px] text-slate-500">
                          टैक्स: ₹{calc.totalGst.toFixed(2)} (CGST: ₹{calc.totalCgst.toFixed(2)} + SGST: ₹{calc.totalSgst.toFixed(2)})
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'HSN_MASTER' && (
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={hsnSearch}
                  onChange={(e) => setHsnSearch(e.target.value)}
                  placeholder={isHi ? 'HSN कोड या श्रेणी खोजें (e.g. 0401, दूध, आटा, तेल)...' : 'Search HSN or category...'}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden text-xs">
                {filteredHsn.map((h, i) => (
                  <div key={i} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-xs">
                          HSN {h.hsn}
                        </span>
                        <span className="font-bold text-slate-900">
                          {isHi ? h.categoryHindi : h.category}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-1 truncate max-w-lg">
                        {h.description}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span
                        className={`font-black font-mono text-xs px-2.5 py-1 rounded-full ${
                          h.rate === 0
                            ? 'bg-emerald-100 text-emerald-800'
                            : h.rate === 5
                            ? 'bg-blue-100 text-blue-800'
                            : h.rate === 12
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {h.rate}% GST
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
