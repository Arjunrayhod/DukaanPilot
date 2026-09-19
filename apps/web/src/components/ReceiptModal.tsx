import React, { useState } from 'react';
import {
  Printer,
  MessageSquare,
  X,
  CheckCircle2,
  Share2,
  Copy,
  ArrowRight,
  Sparkles,
  QrCode,
  Store,
  Phone,
  Calendar,
  CreditCard,
  Banknote,
  BookOpen
} from 'lucide-react';
import { Lang, translations } from '../i18n/translations';
import { ReceiptData, formatWhatsAppInvoice, generateWhatsAppLink } from '../utils/receiptGenerator';

interface ReceiptModalProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData | null;
  onNewBill: () => void;
}

export function ReceiptModal({
  lang,
  isOpen,
  onClose,
  receiptData,
  onNewBill
}: ReceiptModalProps) {
  if (!isOpen || !receiptData) return null;

  const t = translations[lang];
  const [paperWidth, setPaperWidth] = useState<'58mm' | '80mm'>('58mm');
  const [customerPhone, setCustomerPhone] = useState(receiptData.customerPhone || '9823456789');
  const [copied, setCopied] = useState(false);

  const isHi = lang === 'hi';
  const whatsAppText = formatWhatsAppInvoice({ ...receiptData, customerPhone }, lang);

  const handlePrint = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    const url = generateWhatsAppLink(customerPhone, whatsAppText);
    window.open(url, '_blank');
  };

  const handleCopyInvoice = () => {
    navigator.clipboard.writeText(whatsAppText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(
    `upi://pay?pa=${receiptData.shopUpiId}&pn=${receiptData.shopName}&am=${receiptData.grandTotal}&cu=INR&tn=Bill_${receiptData.invoiceNo}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-5 my-auto text-white">
        
        {/* Header Strip & Size Switcher */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{isHi ? 'डिजिटल व थर्मल रसीद' : 'Thermal & Digital Receipt'}</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  #{receiptData.invoiceNo}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {isHi ? '58mm / 80mm प्रिंटिंग व व्हाट्सएप शेयर' : '58mm / 80mm ESC/POS & WhatsApp Share'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 58mm vs 80mm toggle capsule */}
            <div className="inline-flex bg-slate-950 rounded-full p-1 border border-white/15 text-xs font-bold">
              <button
                type="button"
                onClick={() => setPaperWidth('58mm')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  paperWidth === '58mm' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                58mm (2")
              </button>
              <button
                type="button"
                onClick={() => setPaperWidth('80mm')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  paperWidth === '80mm' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                80mm (3")
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Content: Left = Thermal Receipt Preview, Right = Quick WhatsApp Actions */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          
          {/* Left Column (7 of 12): Realistic Thermal Receipt Paper Roll */}
          <div className="md:col-span-7 flex flex-col items-center">
            <div
              id="printable-thermal-receipt"
              className={`bg-white text-slate-900 p-5 rounded-xl shadow-2xl font-mono text-[11px] leading-relaxed transition-all ${
                paperWidth === '58mm' ? 'w-[280px] max-w-full' : 'w-[360px] max-w-full'
              }`}
              style={{
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                borderTop: '4px dashed #94a3b8',
                borderBottom: '4px dashed #94a3b8'
              }}
            >
              {/* Store Details Header */}
              <div className="text-center space-y-0.5 pb-2 border-b border-dashed border-slate-300">
                <h4 className="font-extrabold text-sm text-slate-950 uppercase tracking-tight">{receiptData.shopName}</h4>
                <p className="text-[10px] text-slate-600">{receiptData.shopAddress}</p>
                <p className="text-[10px] text-slate-600">Ph: {receiptData.shopPhone}</p>
                {receiptData.shopGst && <p className="text-[9px] text-slate-500 font-bold">GST: {receiptData.shopGst}</p>}
              </div>

              {/* Invoice Meta */}
              <div className="py-2 border-b border-dashed border-slate-300 text-[10px] flex justify-between">
                <div>
                  <div>Bill: <span className="font-bold">#{receiptData.invoiceNo}</span></div>
                  <div>Date: {receiptData.date}</div>
                </div>
                <div className="text-right">
                  <div>Time: {receiptData.time}</div>
                  <div>Mode: <span className="font-bold uppercase">{receiptData.paymentMode}</span></div>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-2 border-b border-dashed border-slate-300">
                <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-slate-200">
                  <span className="flex-1">Item</span>
                  <span className="w-10 text-center">Qty</span>
                  <span className="w-12 text-right">Rate</span>
                  <span className="w-14 text-right">Amt</span>
                </div>
                <div className="divide-y divide-slate-100 py-1">
                  {receiptData.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between py-1 text-[10px]">
                      <span className="flex-1 truncate pr-1 font-semibold">
                        {isHi && item.hindi ? item.hindi : item.name}
                      </span>
                      <span className="w-10 text-center">{item.qty}</span>
                      <span className="w-12 text-right">₹{item.price}</span>
                      <span className="w-14 text-right font-bold">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Summary Breakdown */}
              <div className="py-2 space-y-1 text-[10px] border-b border-dashed border-slate-300">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>₹{receiptData.subtotal}</span>
                </div>
                {receiptData.gstAmount > 0 && (
                  <div className="flex justify-between text-slate-600">
                    <span>GST (5%):</span>
                    <span>₹{receiptData.gstAmount}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm pt-1 border-t border-slate-200 text-slate-950">
                  <span>TOTAL:</span>
                  <span>₹{receiptData.grandTotal}</span>
                </div>

                {receiptData.paymentMode === 'split' && receiptData.splitBreakdown && (
                  <div className="pt-1 text-[9px] text-slate-500 bg-slate-50 p-1 rounded">
                    <span>Paid: Cash ₹{receiptData.splitBreakdown.cash} | UPI ₹{receiptData.splitBreakdown.upi} | Khata ₹{receiptData.splitBreakdown.khata}</span>
                  </div>
                )}
              </div>

              {/* Embedded UPI QR Code */}
              <div className="py-2 text-center flex flex-col items-center">
                <img
                  src={qrImageUrl}
                  alt="UPI QR Code"
                  className="w-24 h-24 border border-slate-300 p-1 rounded"
                />
                <span className="text-[9px] text-slate-500 font-bold mt-1">Scan to Pay via PhonePe / GPay / Paytm</span>
                <span className="text-[8px] text-slate-400 font-mono">{receiptData.shopUpiId}</span>
              </div>

              {/* Receipt Footer */}
              <div className="pt-2 text-center text-[9px] text-slate-500 border-t border-dashed border-slate-300">
                <p className="font-bold">*** धन्यवाद! फिर पधारें ***</p>
                <p className="text-[8px]">Powered by DukaanPilot Autonomous Retail OS</p>
              </div>
            </div>
          </div>

          {/* Right Column (5 of 12): Direct WhatsApp Share & Thermal Print Triggers */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Customer WhatsApp Phone Input */}
            <div className="bg-slate-950/70 border border-white/10 rounded-2xl p-4 space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                {isHi ? 'ग्राहक का व्हाट्सएप नंबर:' : 'Customer WhatsApp Phone:'}
              </label>
              
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="9823456789"
                  className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-white/20 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Quick Customer Selection Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setCustomerPhone('9823456789')}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white shrink-0 font-medium transition-colors"
                >
                  रमेश (9823456789)
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerPhone('9811012345')}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white shrink-0 font-medium transition-colors"
                >
                  सुनील (9811012345)
                </button>
              </div>

              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="w-full h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>{isHi ? 'व्हाट्सएप पर बिल भेजें' : 'Send Bill on WhatsApp'}</span>
              </button>
            </div>

            {/* Print and Copy Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handlePrint}
                className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{isHi ? `🖨️ थर्मल प्रिंटर से प्रिंट करें (${paperWidth})` : `Print Thermal Receipt (${paperWidth})`}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyInvoice}
                className="w-full h-10 rounded-2xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? (isHi ? 'बिल कॉपी हो गया!' : 'Invoice Copied!') : (isHi ? 'बिल टेक्स्ट कॉपी करें' : 'Copy Invoice Text')}</span>
              </button>
            </div>

            {/* Bottom New Bill Trigger */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNewBill();
                }}
                className="flex-1 h-11 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{isHi ? 'नया बिल शुरू करें' : 'Start Next Bill'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
