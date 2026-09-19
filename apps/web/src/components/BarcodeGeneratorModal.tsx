import React, { useState } from 'react';
import {
  X,
  Printer,
  Sparkles,
  Tag,
  CheckCircle2,
  Layers,
  Scale,
  IndianRupee,
  Package
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import {
  generateLooseKiranaBarcode,
  generateBarcodeSvg,
  BarcodeProduct
} from '../utils/barcodeService';

interface BarcodeGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBarcodeCreated?: (product: BarcodeProduct) => void;
  lang: Lang;
}

const PRESET_LOOSE_ITEMS = [
  { name: 'Loose Sugar (खुली चीनी)', hindi: 'खुली रिफाइंड चीनी 1kg', price: 48, mrp: 52, unit: 'kg', cat: 'Sugar & Sweeteners' },
  { name: 'Chana Dal (चना दाल)', hindi: 'प्रीमियम चना दाल 1kg', price: 95, mrp: 105, unit: 'kg', cat: 'Pulses & Dals' },
  { name: 'Toor Dal (अरहर दाल)', hindi: 'देसी अरहर / तुअर दाल 1kg', price: 155, mrp: 170, unit: 'kg', cat: 'Pulses & Dals' },
  { name: 'Moong Dal (मूंग धुली दाल)', hindi: 'मूंग धुली दाल 1kg', price: 110, mrp: 125, unit: 'kg', cat: 'Pulses & Dals' },
  { name: 'Basmati Rice (बासमती चावल)', hindi: 'खुला बासमती चावल 1kg', price: 85, mrp: 95, unit: 'kg', cat: 'Atta, Flour & Grains' },
  { name: 'Jeera / Cumin (जीरा)', hindi: 'खुला साबुत जीरा 100g', price: 45, mrp: 50, unit: 'g', cat: 'Spices & Masalas' },
];

export function BarcodeGeneratorModal({
  isOpen,
  onClose,
  onBarcodeCreated,
  lang
}: BarcodeGeneratorModalProps) {
  const isHi = lang === 'hi';

  const [itemName, setItemName] = useState('खुली चीनी (Loose Sugar 1kg)');
  const [itemCategory, setItemCategory] = useState('Sugar & Sweeteners');
  const [itemPrice, setItemPrice] = useState('48');
  const [itemMrp, setItemMrp] = useState('52');
  const [itemUnit, setItemUnit] = useState('1 kg');
  const [labelCopies, setLabelCopies] = useState(6);
  const [generatedBarcode, setGeneratedBarcode] = useState<string>(() =>
    generateLooseKiranaBarcode(101, 48)
  );

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(itemPrice) || 40;
    const randomId = Math.floor(100 + Math.random() * 899);
    const barcode = generateLooseKiranaBarcode(randomId, priceNum);
    setGeneratedBarcode(barcode);

    if (onBarcodeCreated) {
      onBarcodeCreated({
        barcode,
        name: itemName,
        hindi: itemName,
        category: itemCategory,
        brand: 'श्री गणेश लूज किराना',
        price: priceNum,
        mrp: parseFloat(itemMrp) || priceNum,
        unit: itemUnit
      });
    }
  };

  const handleApplyPreset = (preset: typeof PRESET_LOOSE_ITEMS[0], idx: number) => {
    setItemName(preset.hindi);
    setItemCategory(preset.cat);
    setItemPrice(String(preset.price));
    setItemMrp(String(preset.mrp));
    setItemUnit(preset.unit === 'g' ? '100g' : '1 kg');
    const barcode = generateLooseKiranaBarcode(100 + idx, preset.price);
    setGeneratedBarcode(barcode);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const svgMarkup = generateBarcodeSvg(generatedBarcode, 220, 65);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-400/30 flex items-center justify-center">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <span>{isHi ? '🏷️ खुले किराना सामान का बारकोड जनरेटर' : '🏷️ Loose Item Barcode Generator'}</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {isHi ? 'खुली चीनी, दाल, चावल हेतु बारकोड स्टिकर प्रिंट करें' : 'Generate & print 50mmx30mm thermal stickers'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              {isHi ? '⚡ त्वरित उत्पाद चुनें (Presets):' : '⚡ Quick Presets:'}
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {PRESET_LOOSE_ITEMS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyPreset(preset, idx)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-xs font-semibold whitespace-nowrap transition-all active:scale-95 cursor-pointer"
                >
                  {preset.hindi} (₹{preset.price})
                </button>
              ))}
            </div>
          </div>

          {/* Form & Live Preview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            
            {/* Left Column (7 of 12): Form Inputs */}
            <form onSubmit={handleGenerate} className="md:col-span-7 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHi ? 'सामान का नाम (Product Name)' : 'Product Name'}
                </label>
                <input
                  type="text"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'बिक्री मूल्य (₹ Price)' : 'Selling Price (₹)'}
                  </label>
                  <input
                    type="number"
                    value={itemPrice}
                    onChange={e => setItemPrice(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'एमआरपी (MRP ₹)' : 'MRP (₹)'}
                  </label>
                  <input
                    type="number"
                    value={itemMrp}
                    onChange={e => setItemMrp(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'वजन / इकाई (Weight/Unit)' : 'Weight / Unit'}
                  </label>
                  <input
                    type="text"
                    value={itemUnit}
                    onChange={e => setItemUnit(e.target.value)}
                    placeholder="e.g. 1 kg, 500g"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'स्टिकर प्रतियों की संख्या' : 'Copies'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={labelCopies}
                    onChange={e => setLabelCopies(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isHi ? 'नया बारकोड री-जेनरेट करें' : 'Re-generate Barcode'}</span>
              </button>
            </form>

            {/* Right Column (5 of 12): Live Printable Label Preview */}
            <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block text-center">
                {isHi ? 'लाइव स्टिकर पूर्वावलोकन (50x30mm)' : 'Sticker Preview (50x30mm)'}
              </span>

              {/* Printable Sticker Card */}
              <div
                id="printable-barcode-card"
                className="w-60 bg-white border-2 border-dashed border-slate-300 rounded-xl p-3 shadow-md text-center space-y-1 text-slate-900"
              >
                <div className="text-[10px] font-black uppercase text-slate-700 truncate tracking-wide">
                  श्री गणेश किराना स्टोर
                </div>

                <div className="text-xs font-black text-slate-950 truncate">
                  {itemName}
                </div>

                <div className="flex items-center justify-center gap-2 text-xs font-black">
                  <span className="text-emerald-700 font-mono text-sm">₹{itemPrice}</span>
                  {itemMrp && parseFloat(itemMrp) > parseFloat(itemPrice) && (
                    <span className="text-[10px] text-slate-400 line-through font-mono">
                      MRP ₹{itemMrp}
                    </span>
                  )}
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-600">
                    {itemUnit}
                  </span>
                </div>

                {/* SVG Barcode Output */}
                <div
                  className="flex justify-center my-1"
                  dangerouslySetInnerHTML={{ __html: svgMarkup }}
                />

                <div className="text-[9px] text-slate-400 font-bold uppercase">
                  पैकिंग: {new Date().toLocaleDateString('en-IN')}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            {labelCopies} {isHi ? 'स्टिकर प्रिंट के लिए तैयार' : 'labels ready to print'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              {isHi ? 'रद्द करें' : 'Close'}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? 'स्टिकर प्रिंट करें' : 'Print Stickers'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
