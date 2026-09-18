import React from 'react';
import { X, QrCode, Download, Share2 } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  upiId: string;
}

export function QrModal({ isOpen, onClose, shopName, upiId }: QrModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
      <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 mb-3">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">\u0926\u0941\u0915\u093e\u0928 UPI QR \u0915\u094b\u0921</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{shopName}</p>

        {/* QR Display */}
        <div className="p-4 bg-white border-2 border-dashed border-blue-200 rounded-2xl my-4 shadow-sm">
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=ramesh.kirana@sbi%26pn=Shree%20Ganesh%20Kirana"
            alt="Shop UPI QR Code"
            className="w-44 h-44 rounded-lg"
          />
          <span className="text-[11px] font-mono font-bold text-slate-700 block mt-2">{upiId}</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 w-full">
          <button
            onClick={() => alert('\u0921\u093e\u0909\u0928\u0932\u094b\u0921 \u0936\u0941\u0930\u0942 \u0939\u094b \u0917\u092f\u093e')}
            className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={() => alert('\u0935\u094d\u0939\u093e\u091f\u094d\u0938\u090f\u092a \u092a\u0930 \u0936\u0947\u092f\u0930 \u0915\u0930\u0947\u0902')}
            className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
