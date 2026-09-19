import React, { useState } from 'react';
import {
  Printer,
  Barcode,
  Layers,
  Plus,
  Minus,
  Trash2,
  X,
  CheckCircle2,
  FileSpreadsheet,
  Grid
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import {
  BarcodeLabelItem,
  SHEET_PRESETS,
  expandLabelBatch,
  calculatePagesNeeded
} from '../utils/barcodeSheetService';
import { generateBarcodeSvg } from '../utils/barcodeService';
import { getInventoryItems } from '../utils/inventoryService';

interface BarcodeSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  shopName?: string;
}

export function BarcodeSheetModal({
  isOpen,
  onClose,
  lang,
  shopName = 'श्री गणेश किराना स्टोर'
}: BarcodeSheetModalProps) {
  const isHi = lang === 'hi';
  const inventory = getInventoryItems();
  const [layout, setLayout] = useState<'24_UP' | '30_UP'>('24_UP');

  // Selected items to print with counts
  const [selectedItems, setSelectedItems] = useState<Array<{ item: BarcodeLabelItem; count: number }>>([
    {
      item: {
        barcode: '8901030010014',
        name: 'Madhur Pure Sugar 1kg',
        hindiName: 'मधुर चीनी 1kg',
        price: 48,
        unit: 'kg',
        mrp: 48,
        storeName: shopName
      },
      count: 12
    },
    {
      item: {
        barcode: '8901262010014',
        name: 'Amul Taaza Milk 500ml',
        hindiName: 'अमूल ताजा दूध 500ml',
        price: 27,
        unit: 'packet',
        mrp: 27,
        storeName: shopName
      },
      count: 12
    }
  ]);

  const [selectedItemId, setSelectedItemId] = useState<string>('');

  if (!isOpen) return null;

  const totalLabels = selectedItems.reduce((s, it) => s + it.count, 0);
  const pagesNeeded = calculatePagesNeeded(totalLabels, layout);
  const expandedLabels = expandLabelBatch(selectedItems);

  const handleAddItem = (itemId: string) => {
    const inv = inventory.find((i) => i.id === itemId);
    if (!inv) return;

    const existingIdx = selectedItems.findIndex((it) => it.item.name === inv.name);
    if (existingIdx >= 0) {
      setSelectedItems((prev) =>
        prev.map((it, idx) => (idx === existingIdx ? { ...it, count: it.count + 6 } : it))
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          item: {
            barcode: inv.barcode || `890${Math.floor(1000000000 + Math.random() * 9000000000)}`,
            name: inv.name,
            hindiName: inv.hindi,
            price: inv.sellingPrice || inv.mrp,
            unit: inv.unit,
            mrp: inv.mrp,
            storeName: shopName
          },
          count: 6
        }
      ]);
    }
    setSelectedItemId('');
  };

  const handleUpdateCount = (idx: number, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((it, i) => (i === idx ? { ...it, count: Math.max(0, it.count + delta) } : it))
        .filter((it) => it.count > 0)
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-4 sm:p-6 shadow-2xl space-y-5 my-auto text-white">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{isHi ? 'A4 बारकोड स्टिकर शीट प्रिंटर' : 'A4 Barcode Sticker Sheet Printer'}</span>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                  {layout === '24_UP' ? '24 Labels / Page' : '30 Labels / Page'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {isHi ? 'किराना व लूज सामानों के 24 या 30 स्टिकर प्रति A4 शीट प्रिंट करें' : 'Batch print standard Indian 24-Up or 30-Up A4 sticker sheets'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Controls Strip */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950 rounded-2xl border border-white/10 text-xs font-bold">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Layout selector */}
            <div className="inline-flex bg-slate-900 rounded-xl p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setLayout('24_UP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  layout === '24_UP' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 (24 स्टिकर: 3x8)
              </button>
              <button
                type="button"
                onClick={() => setLayout('30_UP')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  layout === '30_UP' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                A4 (30 स्टिकर: 3x10)
              </button>
            </div>

            <div className="font-mono text-slate-300">
              <span>{isHi ? 'कुल स्टिकर:' : 'Total:'} </span>
              <span className="text-emerald-400 font-black">{totalLabels}</span>
              <span className="text-slate-500 ml-2">({pagesNeeded} {isHi ? 'पेज' : 'pages'})</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Add product dropdown */}
            <select
              value={selectedItemId}
              onChange={(e) => {
                if (e.target.value) handleAddItem(e.target.value);
              }}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 text-xs font-bold focus:outline-none flex-1 sm:flex-none cursor-pointer"
            >
              <option value="">+ {isHi ? 'सामान जोड़ें...' : 'Add Item...'}</option>
              {inventory.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.name} (₹{inv.sellingPrice})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-black flex items-center gap-1.5 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              <Printer className="w-4 h-4 text-slate-950" />
              <span>{isHi ? 'A4 शीट प्रिंट करें' : 'Print Sheet'}</span>
            </button>
          </div>
        </div>

        {/* Selected Items Stepper List */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 block">
            {isHi ? `चयनित सामान व स्टिकर मात्रा (${selectedItems.length}):` : 'Selected Items & Label Quantities:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {selectedItems.map((entry, idx) => (
              <div key={idx} className="p-2.5 bg-slate-950 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                <div className="min-w-0 flex-1 mr-2">
                  <div className="font-bold text-white truncate">{entry.item.name}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    ₹{entry.item.price}/{entry.item.unit} &bull; {entry.item.barcode}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleUpdateCount(idx, -6)}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-black cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-mono font-black text-amber-400">
                    {entry.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleUpdateCount(idx, 6)}
                    className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-black cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Printable A4 Sticker Sheet Preview */}
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-400 block">
            {isHi ? 'A4 स्टिकर शीट लाइव प्रिव्यू (Print Ready Grid):' : 'A4 Sheet Live Preview:'}
          </span>

          <div className="p-4 bg-white text-slate-900 rounded-2xl max-h-72 overflow-y-auto shadow-inner border border-slate-300 font-sans">
            <div
              className={`grid ${
                layout === '24_UP' ? 'grid-cols-3 gap-2' : 'grid-cols-3 gap-1.5'
              }`}
            >
              {expandedLabels.map((lbl, i) => (
                <div
                  key={i}
                  className="border border-dashed border-slate-300 rounded-lg p-2 flex flex-col items-center justify-between text-center bg-white shadow-xs"
                  style={{ minHeight: layout === '24_UP' ? '80px' : '65px' }}
                >
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full">
                    {lbl.storeName}
                  </div>
                  <div className="text-[11px] font-black text-slate-900 leading-tight truncate w-full">
                    {lbl.hindiName || lbl.name}
                  </div>
                  <div
                    className="my-0.5"
                    dangerouslySetInnerHTML={{
                      __html: generateBarcodeSvg(lbl.barcode, 120, 32)
                    }}
                  />
                  <div className="text-[11px] font-black font-mono text-slate-950">
                    MRP: ₹{lbl.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
