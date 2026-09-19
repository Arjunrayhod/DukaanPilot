import React, { useState } from 'react';
import { 
  X, Printer, MessageSquare, Download, Check, AlertTriangle, 
  TrendingUp, Banknote, QrCode, BookOpen, ShieldCheck, DollarSign, Calendar
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import { 
  ZReportData, 
  formatDailyZReportText, 
  generateDailyZReportWhatsAppUrl 
} from '../utils/zReportService';
import { speakHindi } from '../utils/voiceFeedback';

interface DailyZReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  shopName?: string;
  shopPhone?: string;
}

export function DailyZReportModal({
  isOpen,
  onClose,
  lang,
  shopName = 'श्री गणेश किराना स्टोर (Shree Ganesh Kirana)',
  shopPhone = '+91 98765 43210'
}: DailyZReportModalProps) {
  if (!isOpen) return null;

  const isHi = lang === 'hi';

  const [openingCash, setOpeningCash] = useState('2000');
  const [actualCash, setActualCash] = useState('4730');
  const [supplierCashPaid, setSupplierCashPaid] = useState('0');
  const [reportPaperWidth, setReportPaperWidth] = useState<'58mm' | '80mm'>('80mm');
  const [closingConfirmed, setClosingConfirmed] = useState(false);

  const cashSales = 2280;
  const upiSales = 5170;
  const khataGiven = 1000;
  const khataRecovered = 450;
  const totalSales = 8450;
  const totalProfit = 1820;
  const totalBills = 60;

  const openingCashNum = parseFloat(openingCash) || 0;
  const supplierPaidNum = parseFloat(supplierCashPaid) || 0;
  const expectedClosingCash = openingCashNum + cashSales + khataRecovered - supplierPaidNum;
  const actualCashNum = parseFloat(actualCash) || 0;
  const discrepancy = actualCashNum - expectedClosingCash;

  const reportNumber = `ZR-${new Date().toISOString().slice(2, 10).replace(/-/g, '')}-01`;
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const zReportData: ZReportData = {
    reportNumber,
    generatedAt: reportDate,
    shopName,
    shopPhone,
    openingCash: openingCashNum,
    cashSales,
    cashRecoveredKhata: khataRecovered,
    cashPaidSuppliers: supplierPaidNum,
    expectedClosingCash,
    actualClosingCash: actualCashNum,
    upiSales,
    totalKhataGiven: khataGiven,
    totalNetSales: totalSales,
    totalProfit,
    totalBills,
    topItemName: 'अमूल ताजा दूध 500ml (34 पैकेट)',
    notes: discrepancy === 0 ? 'कैश दराज पूरी तरह संतुलित' : `कैश अंतर: ₹${discrepancy}`
  };

  const handleSendWhatsApp = () => {
    const url = generateDailyZReportWhatsAppUrl(zReportData, '9876543210', lang);
    window.open(url, '_blank');
    speakHindi(isHi ? 'व्हाट्सएप पर डेली Z-रिपोर्ट भेज दी गई है' : 'Daily Z-Report sent to WhatsApp');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmClose = () => {
    setClosingConfirmed(true);
    speakHindi(isHi ? 'आज की डेली क्लोजिंग सफलतापूर्वक दर्ज हो गई है' : 'Daily closing completed');
    setTimeout(() => {
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[95vh] flex flex-col animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">
                {isHi ? 'डेली क्लोजिंग Z-रिपोर्ट (Daily Z-Report)' : 'Daily Closing Z-Report'}
              </h3>
              <p className="text-xs text-blue-200 font-mono mt-0.5">
                #{reportNumber} &bull; {reportDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/10 rounded-xl p-0.5 border border-white/15 text-xs font-bold">
              <button
                type="button"
                onClick={() => setReportPaperWidth('58mm')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  reportPaperWidth === '58mm' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300'
                }`}
              >
                58mm
              </button>
              <button
                type="button"
                onClick={() => setReportPaperWidth('80mm')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  reportPaperWidth === '80mm' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-300'
                }`}
              >
                80mm
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-slate-50/50">
          {/* Top Quick Sales Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {isHi ? 'आज की कुल सेल' : 'Total Sales'}
              </span>
              <span className="text-xl font-black text-slate-900 font-mono">
                ₹{totalSales.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                {totalBills} {isHi ? 'बिल' : 'bills'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {isHi ? 'शुद्ध मुनाफा' : 'Net Profit'}
              </span>
              <span className="text-xl font-black text-emerald-600 font-mono">
                ₹{totalProfit.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                21.5% {isHi ? 'मार्जिन' : 'margin'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {isHi ? 'UPI / QR सेल' : 'UPI QR Sales'}
              </span>
              <span className="text-xl font-black text-blue-700 font-mono">
                ₹{upiSales.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-blue-600 font-bold block mt-0.5">
                61.2% {isHi ? 'डिजिटल' : 'digital'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[11px] font-bold text-slate-400 block uppercase">
                {isHi ? 'नया उधार दिया' : 'Khata Given'}
              </span>
              <span className="text-xl font-black text-rose-600 font-mono">
                ₹{khataGiven.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-rose-600 font-bold block mt-0.5">
                +₹{khataRecovered} {isHi ? 'वसूली' : 'recovered'}
              </span>
            </div>
          </div>

          {/* Cash Drawer Reconciliation Audit */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="w-5 h-5 text-emerald-600" />
                <h4 className="text-sm font-black text-slate-900">
                  {isHi ? 'शाम का कैश दराज मिलान (Cash Drawer Audit)' : 'Cash Drawer Reconciliation'}
                </h4>
              </div>
              <span className="text-xs font-bold text-slate-400">EOD Audit</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {isHi ? 'सुबह का ओपनिंग कैश ₹' : 'Opening Cash ₹'}
                </label>
                <input
                  type="number"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {isHi ? 'सप्लायर नकद भुगतान ₹' : 'Supplier Cash Paid ₹'}
                </label>
                <input
                  type="number"
                  value={supplierCashPaid}
                  onChange={(e) => setSupplierCashPaid(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">
                  {isHi ? 'दराज में गिना हुआ कैश ₹' : 'Actual Counted Cash ₹'}
                </label>
                <input
                  type="number"
                  value={actualCash}
                  onChange={(e) => setActualCash(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-indigo-400 bg-indigo-50/40 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Reconciliation Math Bar */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">
                  {isHi ? 'दराज में होना चाहिए (Expected)' : 'Expected in Drawer'}
                </span>
                <span className="font-mono font-black text-slate-900 text-sm">
                  ₹{expectedClosingCash.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <span className="text-slate-500 block font-medium">
                  {isHi ? 'अंतर / मिलान स्थिति' : 'Discrepancy Status'}
                </span>
                {discrepancy === 0 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{isHi ? 'कैश 100% सही मिला (No Discrepancy)' : 'Balanced'}</span>
                  </span>
                ) : discrepancy > 0 ? (
                  <span className="text-blue-700 font-bold">
                    +₹{discrepancy} {isHi ? 'अतिरिक्त (Surplus)' : 'Surplus'}
                  </span>
                ) : (
                  <span className="text-rose-700 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    <span>-₹{Math.abs(discrepancy)} {isHi ? 'कम (Shortage)' : 'Shortage'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Printable Thermal Receipt Layout Preview */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              {isHi ? 'थर्मल Z-रिपोर्ट प्रिव्यू' : 'Thermal Z-Report Layout'} ({reportPaperWidth})
            </div>

            <div 
              id="printable-thermal-zreport"
              className={`mx-auto bg-white p-4 border border-slate-300 rounded-xl font-mono text-[11px] text-slate-900 space-y-2 shadow-inner ${
                reportPaperWidth === '58mm' ? 'max-w-[240px]' : 'max-w-[320px]'
              }`}
            >
              <div className="text-center pb-2 border-b border-dashed border-slate-400">
                <div className="font-bold text-xs">{shopName}</div>
                <div className="text-[10px]">{shopPhone}</div>
                <div className="font-bold text-[10px] mt-1">*** DAILY Z-REPORT ***</div>
                <div className="text-[9px] text-slate-500">#{reportNumber} &bull; {reportDate}</div>
              </div>

              <div className="space-y-1 text-[10px] py-1 border-b border-dashed border-slate-400">
                <div className="flex justify-between">
                  <span>TOTAL GROSS SALES:</span>
                  <span className="font-bold">₹{totalSales}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>NET PROFIT (Est):</span>
                  <span className="font-bold">₹{totalProfit}</span>
                </div>
                <div className="flex justify-between">
                  <span>TOTAL BILLS COUNT:</span>
                  <span>{totalBills}</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px] py-1 border-b border-dashed border-slate-400">
                <div className="font-bold text-[10px]">TENDER BREAKDOWN:</div>
                <div className="flex justify-between">
                  <span>- CASH SALES:</span>
                  <span>₹{cashSales}</span>
                </div>
                <div className="flex justify-between">
                  <span>- UPI / QR SALES:</span>
                  <span>₹{upiSales}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>- KHATA GIVEN:</span>
                  <span>₹{khataGiven}</span>
                </div>
              </div>

              <div className="space-y-1 text-[10px] py-1 border-b border-dashed border-slate-400">
                <div className="font-bold text-[10px]">DRAWER AUDIT:</div>
                <div className="flex justify-between">
                  <span>OPENING CASH:</span>
                  <span>₹{openingCashNum}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>EXPECTED CASH:</span>
                  <span>₹{expectedClosingCash}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>ACTUAL CASH:</span>
                  <span>₹{actualCashNum}</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-500">
                  <span>STATUS:</span>
                  <span>{discrepancy === 0 ? 'BALANCED' : discrepancy > 0 ? '+SURPLUS' : '-SHORT'}</span>
                </div>
              </div>

              <div className="text-center pt-1 text-[9px] text-slate-500">
                *** END OF DAY CLOSE ***
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleSendWhatsApp}
            className="px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? 'WhatsApp पर Z-रिपोर्ट भेजें' : 'Send WhatsApp Report'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>{isHi ? 'प्रिंट' : 'Print'}</span>
            </button>

            <button
              type="button"
              onClick={handleConfirmClose}
              className="px-6 py-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              {closingConfirmed ? <Check className="w-4 h-4 text-emerald-400" /> : <ShieldCheck className="w-4 h-4 text-blue-300" />}
              <span>{closingConfirmed ? (isHi ? 'क्लोजिंग दर्ज हो गई!' : 'Closed!') : (isHi ? 'डेली क्लोजिंग कन्फर्म करें' : 'Confirm Daily Close')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}