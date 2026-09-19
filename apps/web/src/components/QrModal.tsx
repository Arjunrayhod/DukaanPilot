import React, { useState, useRef, useEffect } from 'react';
import { 
  X, QrCode, Download, Share2, Upload, Image as ImageIcon, 
  Check, Trash2, Sparkles, Printer, RefreshCw, ShieldCheck, Edit2
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import { speakHindi } from '../utils/voiceFeedback';

interface QrModalProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  upiId: string;
  customQrImage?: string;
  onUpdateQr?: (newUpiId: string, newCustomQrImage?: string) => void;
}

export function QrModal({ 
  lang, 
  isOpen, 
  onClose, 
  shopName, 
  upiId: initialUpiId,
  customQrImage: initialCustomQrImage,
  onUpdateQr 
}: QrModalProps) {
  if (!isOpen) return null;

  const isHi = lang === 'hi';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'upload' | 'dynamic'>(
    initialCustomQrImage ? 'upload' : 'dynamic'
  );
  const [upiId, setUpiId] = useState(initialUpiId || 'shreeganesh@sbi');
  const [customQrImage, setCustomQrImage] = useState<string | undefined>(
    initialCustomQrImage || localStorage.getItem('dukaanpilot_custom_qr') || undefined
  );
  const [isEditingUpi, setIsEditingUpi] = useState(false);
  const [tempUpi, setTempUpi] = useState(upiId);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const savedQr = localStorage.getItem('dukaanpilot_custom_qr');
    if (savedQr) {
      setCustomQrImage(savedQr);
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Read as Base64 Data URL
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCustomQrImage(result);
      setActiveTab('upload');
      try {
        localStorage.setItem('dukaanpilot_custom_qr', result);
      } catch (err) {
        console.warn('Storage quota limit, keeping in memory');
      }
      if (onUpdateQr) {
        onUpdateQr(upiId, result);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      speakHindi(isHi ? 'आपका QR कोड सफलतापूर्वक अपलोड हो गया' : 'QR code uploaded successfully');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomQr = () => {
    setCustomQrImage(undefined);
    setActiveTab('dynamic');
    localStorage.removeItem('dukaanpilot_custom_qr');
    if (onUpdateQr) {
      onUpdateQr(upiId, undefined);
    }
    speakHindi(isHi ? 'अपलोड किया हुआ QR हटा दिया गया है' : 'Custom QR removed');
  };

  const handleSaveUpiId = () => {
    if (!tempUpi.trim()) return;
    setUpiId(tempUpi.trim());
    setIsEditingUpi(false);
    localStorage.setItem('dukaanpilot_shop_upi', tempUpi.trim());
    if (onUpdateQr) {
      onUpdateQr(tempUpi.trim(), customQrImage);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    speakHindi(isHi ? `नया UPI ID ${tempUpi.trim()} सेव हो गया` : `UPI ID saved`);
  };

  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
    `upi://pay?pa=${upiId}&pn=${encodeURIComponent(shopName)}&cu=INR`
  )}`;

  const currentDisplayQr = activeTab === 'upload' && customQrImage ? customQrImage : dynamicQrUrl;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentDisplayQr;
    link.download = `${shopName.replace(/\s+/g, '_')}_UPI_QR.png`;
    link.target = '_blank';
    link.click();
  };

  const handleShare = () => {
    const text = encodeURIComponent(
      `नमस्ते! *${shopName}* पर ऑनलाइन भुगतान करने के लिए हमारा UPI ID: *${upiId}*\nसीधा UPI पेमेंट लिंक:\nupi://pay?pa=${encodeURIComponent(
        upiId
      )}&pn=${encodeURIComponent(shopName)}&cu=INR`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 flex flex-col items-center text-center relative animate-in fade-in zoom-in-95 my-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 mb-2.5 shadow-sm">
          <QrCode className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-black text-slate-900 tracking-tight">
          {isHi ? 'दुकान UPI पेमेंट QR कोड' : 'Shop Payment QR Code'}
        </h3>
        <p className="text-xs text-slate-500 font-semibold">{shopName}</p>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl my-3.5 w-full border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isHi ? 'अपना QR अपलोड करें' : 'Upload Own QR'}</span>
            {customQrImage && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dynamic')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'dynamic'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHi ? 'ऑटो UPI QR' : 'Auto Dynamic QR'}</span>
          </button>
        </div>

        {/* Upload Action Strip (When in Upload mode) */}
        {activeTab === 'upload' && (
          <div className="w-full mb-3 space-y-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {!customQrImage ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-5 border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/50 hover:bg-indigo-50 rounded-2xl cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
              >
                <div className="w-10 h-10 rounded-2xl bg-white text-indigo-600 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-black text-indigo-950 block">
                    {isHi ? 'PhonePe / GPay / Paytm QR फोटो चुनें' : 'Choose / Upload QR Photo'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isHi ? 'गैलरी या कैमरे से इमेज सेलेक्ट करें (PNG, JPG)' : 'Select image from gallery or camera'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2 min-w-0 text-left">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="font-bold text-slate-800 truncate">
                    {isHi ? 'कस्टम QR सक्रिय है' : 'Custom QR Active'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 rounded-lg bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-[11px] cursor-pointer"
                  >
                    {isHi ? 'बदलें' : 'Change'}
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveCustomQr}
                    className="p-1 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title={isHi ? 'हटाएं' : 'Remove'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QR Code Display Canvas */}
        <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl mb-3 shadow-inner relative flex flex-col items-center">
          <div className="relative w-48 h-48 flex items-center justify-center bg-white rounded-xl overflow-hidden">
            <img
              src={currentDisplayQr}
              alt="Shop UPI QR Code"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>

          {/* UPI ID Badge & Inline Editor */}
          <div className="mt-3 w-full pt-2.5 border-t border-slate-100 flex items-center justify-center gap-2">
            {isEditingUpi ? (
              <div className="flex items-center gap-1.5 w-full">
                <input
                  type="text"
                  value={tempUpi}
                  onChange={(e) => setTempUpi(e.target.value)}
                  placeholder="उदा: 9876543210@paytm"
                  className="flex-1 px-2.5 py-1.5 rounded-lg border border-indigo-400 text-xs font-mono font-bold text-slate-900 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveUpiId}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs cursor-pointer"
                >
                  {isHi ? 'सेव' : 'Save'}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {upiId}
                </span>
                <button
                  type="button"
                  onClick={() => { setTempUpi(upiId); setIsEditingUpi(true); }}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 cursor-pointer"
                  title={isHi ? 'UPI ID बदलें' : 'Edit UPI ID'}
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {saveSuccess && (
            <div className="mt-2 text-[11px] text-emerald-700 font-bold flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{isHi ? 'QR सेटिंग्स सेव हो गईं!' : 'QR Settings Saved!'}</span>
            </div>
          )}
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 w-full pt-1">
          <button
            type="button"
            onClick={handleDownload}
            className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isHi ? 'डाउनलोड' : 'Download'}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>{isHi ? 'WhatsApp शेयर' : 'Share QR'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}