import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  RotateCcw,
  Zap,
  ZapOff,
  Search,
  CheckCircle2,
  AlertCircle,
  Scan,
  Package,
  Plus,
  Volume2
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import {
  findProductByBarcode,
  playScannerBeep,
  FMCG_BARCODE_CATALOG,
  BarcodeProduct
} from '../utils/barcodeService';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductScanned: (product: BarcodeProduct) => void;
  lang: Lang;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  onProductScanned,
  lang
}: BarcodeScannerModalProps) {
  const isHi = lang === 'hi';

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [scanStatus, setScanStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [recentScanned, setRecentScanned] = useState<BarcodeProduct[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<any>(null);

  // Initialize Camera Stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError(isHi ? 'कैमरा सपोर्ट उपलब्ध नहीं है।' : 'Camera not supported in this browser.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }

      // Check for torch capability
      const track = stream.getVideoTracks()[0];
      const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
      setHasTorch(Boolean(capabilities.torch));

      // Start Barcode Detection Loop
      startBarcodeDetection(stream);
    } catch (err: any) {
      console.warn('Camera start error:', err);
      setCameraError(
        isHi
          ? 'कैमरा शुरू नहीं हो सका। कृपया कैमरा परमिशन चेक करें या नीचे बारकोड नंबर दर्ज करें।'
          : 'Could not access camera. Please check permissions or enter barcode manually.'
      );
    }
  };

  const stopCamera = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchOn(false);
  };

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      await (track as any).applyConstraints({
        advanced: [{ torch: !torchOn }]
      });
      setTorchOn(!torchOn);
    } catch (err) {
      console.warn('Torch toggle warning:', err);
    }
  };

  const startBarcodeDetection = (stream: MediaStream) => {
    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    const BarcodeDetectorAPI = (window as any).BarcodeDetector;
    if (BarcodeDetectorAPI) {
      const detector = new BarcodeDetectorAPI({
        formats: ['ean_13', 'ean_8', 'code_128', 'qr_code', 'upc_a', 'upc_e']
      });

      scanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) return;
        try {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            const code = barcodes[0].rawValue;
            handleBarcodeScanned(code);
          }
        } catch (_) {}
      }, 300);
    }
  };

  const handleBarcodeScanned = (barcodeString: string) => {
    const clean = barcodeString.trim().replace(/[^\d]/g, '');
    if (!clean) return;

    const product = findProductByBarcode(clean);
    playScannerBeep();

    if (product) {
      setScanStatus({
        type: 'success',
        message: `${isHi ? product.hindi : product.name} - ₹${product.price}`
      });
      setRecentScanned(prev => [product, ...prev.slice(0, 4)]);
      onProductScanned(product);
    } else {
      setScanStatus({
        type: 'error',
        message: isHi ? `अज्ञात बारकोड: ${clean} (कैटलॉग में नहीं मिला)` : `Unrecognized barcode: ${clean}`
      });
    }

    setTimeout(() => {
      setScanStatus(null);
    }, 2800);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCode.trim()) return;
    handleBarcodeScanned(manualCode.trim());
    setManualCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col text-white max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base text-white flex items-center gap-2">
                <span>{isHi ? '📷 बारकोड स्कैनर POS' : '📷 Live Barcode Scanner'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-[10px] font-black">
                  LIVE
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {isHi ? 'सामान का बारकोड कैमरे के सामने लाएं' : 'Point camera at product barcode to auto-bill'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Video Stream Panel */}
        <div className="relative bg-black min-h-[260px] sm:min-h-[300px] flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 max-w-sm">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <p className="text-xs text-slate-300 font-medium">{cameraError}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-full object-cover min-h-[260px] sm:min-h-[300px]"
              />

              {/* Viewfinder Overlay Targeting Box */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                <div className="w-64 h-40 sm:w-72 sm:h-44 border-2 border-emerald-400/80 rounded-2xl relative shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  {/* Corner Targets */}
                  <span className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-emerald-400 rounded-tl" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-emerald-400 rounded-tr" />
                  <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-emerald-400 rounded-bl" />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-emerald-400 rounded-br" />

                  {/* Red/Green Laser Guide Animation */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent absolute top-1/2 -translate-y-1/2 animate-pulse shadow-[0_0_8px_red]" />

                  <span className="absolute bottom-2 inset-x-0 text-center text-[10px] font-bold text-emerald-300 tracking-wider uppercase drop-shadow">
                    {isHi ? 'बारकोड फ्रेम में रखें' : 'Align Barcode Inside Box'}
                  </span>
                </div>
              </div>

              {/* Camera Controls Overlay */}
              <div className="absolute top-3 right-3 flex items-center gap-2">
                {hasTorch && (
                  <button
                    type="button"
                    onClick={toggleTorch}
                    className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition-all cursor-pointer ${
                      torchOn
                        ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg'
                        : 'bg-slate-900/80 text-white border-white/20'
                    }`}
                    title={torchOn ? 'Flashlight Off' : 'Flashlight On'}
                  >
                    {torchOn ? <Zap className="w-4 h-4 fill-slate-950" /> : <ZapOff className="w-4 h-4" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
                  className="p-2 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold hover:bg-slate-800 transition-all cursor-pointer"
                  title="Switch Camera"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </>
          )}

          {/* Live Scan Notification Pill */}
          {scanStatus && (
            <div className={`absolute bottom-3 inset-x-4 p-3 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl animate-in slide-in-from-bottom-2 ${
              scanStatus.type === 'success'
                ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                : 'bg-rose-600 text-white'
            }`}>
              {scanStatus.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">{scanStatus.message}</span>
            </div>
          )}
        </div>

        {/* Manual Barcode Entry Form */}
        <div className="p-4 bg-slate-900 space-y-3.5 border-t border-slate-800">
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={manualCode}
                onChange={e => setManualCode(e.target.value)}
                placeholder={isHi ? 'मैन्युअल बारकोड नंबर दर्ज करें...' : 'Type or paste barcode number...'}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={!manualCode.trim()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isHi ? 'जोड़ें' : 'Add'}</span>
            </button>
          </form>

          {/* Quick Demo Test Chips */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>{isHi ? '⚡ त्वरित टेस्ट हेतु क्लिक करें:' : '⚡ Quick Test Barcodes:'}</span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {FMCG_BARCODE_CATALOG.slice(0, 5).map((prod) => (
                <button
                  key={prod.barcode}
                  type="button"
                  onClick={() => handleBarcodeScanned(prod.barcode)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-semibold text-slate-200 hover:text-white whitespace-nowrap transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <Package className="w-3 h-3 text-amber-400" />
                  <span>{isHi ? prod.hindi : prod.name} (₹{prod.price})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isHi ? 'ऑडियो बीप व ऑटो-ऐड चालू' : 'Audio Beep & Auto-Cart On'}</span>
          </div>
          <span className="font-mono text-[10px] text-slate-500">USB Gun & Camera</span>
        </div>

      </div>
    </div>
  );
}
