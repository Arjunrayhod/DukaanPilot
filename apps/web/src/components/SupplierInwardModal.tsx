import React, { useState } from 'react';
import { X, Package, Plus, Trash2, Check, ArrowRight, ShieldCheck, DollarSign, Calendar, Truck } from 'lucide-react';
import { Lang } from '../i18n/translations';
import { Supplier, INITIAL_SUPPLIERS } from '../utils/restockService';
import { InwardItem, recordPurchaseInward } from '../utils/inwardService';
import { InventoryItem } from '../utils/inventoryService';
import { speakHindi } from '../utils/voiceFeedback';

interface SupplierInwardModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang?: Lang;
  suppliers?: Supplier[];
  inventoryItems?: InventoryItem[];
  onInwardCompleted?: (result: { newEntry: any; updatedInventory: InventoryItem[] }) => void;
}

export function SupplierInwardModal({
  isOpen,
  onClose,
  lang = 'hi',
  suppliers = INITIAL_SUPPLIERS,
  inventoryItems = [],
  onInwardCompleted
}: SupplierInwardModalProps) {
  if (!isOpen) return null;

  const isHi = lang === 'hi' || lang === 'gu' || lang === 'mr';
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || '');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Date.now().toString().slice(-5)}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toLocaleDateString('en-IN'));
  const [paymentMode, setPaymentMode] = useState<'cash' | 'upi' | 'credit' | 'partial'>('cash');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Inward Items list
  const [items, setItems] = useState<InwardItem[]>([
    {
      itemId: 'inv_101',
      name: 'Amul Taaza Milk 500ml',
      nameHindi: 'अमूल ताजा दूध 500ml',
      qtyReceived: 20,
      unit: 'packet',
      costPrice: 25,
      sellingPrice: 27,
      mrp: 27,
      batchNo: 'B2609X',
      expiryDate: '2026-09-24'
    }
  ]);

  const selectedSupplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
  const totalAmount = items.reduce((sum, it) => sum + (it.qtyReceived * it.costPrice), 0);

  const handleAddItemRow = () => {
    const newItem: InwardItem = {
      itemId: `item_custom_${Date.now()}`,
      name: 'Aashirvaad Superior Sharbati Atta 10kg',
      nameHindi: 'आशीर्वाद शरबती आटा 10kg',
      qtyReceived: 10,
      unit: 'bag',
      costPrice: 480,
      sellingPrice: 535,
      mrp: 575,
      batchNo: 'ASH09',
      expiryDate: '2027-03-15'
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleUpdateItem = (index: number, field: keyof InwardItem, value: any) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      alert(isHi ? 'कृपया कम से कम एक सामान जोड़ें!' : 'Please add at least one item!');
      return;
    }

    const actualPaid = paymentMode === 'cash' || paymentMode === 'upi' ? totalAmount : (paymentMode === 'credit' ? 0 : paidAmount);

    const result = recordPurchaseInward({
      supplier: selectedSupplier,
      invoiceNumber,
      invoiceDate,
      items,
      paidAmount: actualPaid,
      paymentMode,
      notes,
      currentInventory: inventoryItems.length > 0 ? inventoryItems : undefined
    });

    if (onInwardCompleted) {
      onInwardCompleted(result);
    }

    setIsSuccess(true);
    speakHindi(isHi ? `सप्लायर खरीद इनवर्ड सफल। ${items.length} सामान का स्टॉक बढ़ गया है।` : 'Stock inward recorded successfully', lang);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-5 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black font-display tracking-tight">
                {isHi ? 'सप्लायर खरीद इनवर्ड (GRN / नया माल)' : 'Supplier Purchase Inward (GRN)'}
              </h2>
              <p className="text-xs text-slate-300">
                {isHi ? 'नया माल स्टॉक में जोड़ें और सप्लायर बिल दर्ज करें' : 'Receive goods shipment & update stock automatically'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              {isHi ? 'स्टॉक इनवर्ड सफलतापूर्वक दर्ज हुआ!' : 'Stock Inward Recorded!'}
            </h3>
            <p className="text-sm text-slate-600">
              {isHi 
                ? `सप्लायर ${selectedSupplier.name} का चालान #${invoiceNumber} सेव हो गया है और स्टॉक बढ़ गया है।`
                : `Invoice #${invoiceNumber} saved and stock incremented.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* Top Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHi ? 'सप्लायर / डिस्ट्रीब्यूटर' : 'Supplier'}
                </label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.company})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHi ? 'चालान / बिल नंबर' : 'Invoice/Challan No.'}
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {isHi ? 'बिल तारीख' : 'Invoice Date'}
                </label>
                <input
                  type="text"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Received Items Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  {isHi ? 'प्राप्त सामान सूची (Inward Items)' : 'Received Items'}
                </span>
                <button
                  type="button"
                  onClick={handleAddItemRow}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isHi ? '+ सामान जोड़ें' : '+ Add Item'}</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">सामान (Item)</th>
                        <th className="p-3 w-20">मात्रा (Qty)</th>
                        <th className="p-3 w-24">खरीद भाव (Cost)</th>
                        <th className="p-3 w-28">बैच व एक्सपायरी</th>
                        <th className="p-3 w-24 text-right">कुल (Total)</th>
                        <th className="p-3 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {items.map((item, idx) => (
                        <tr key={idx} className="bg-white hover:bg-slate-50">
                          <td className="p-3">
                            <input
                              type="text"
                              value={item.nameHindi || item.name}
                              onChange={(e) => handleUpdateItem(idx, 'name', e.target.value)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 text-xs focus:ring-1 focus:ring-blue-500"
                            />
                          </td>
                          <td className="p-3">
                            <input
                              type="number"
                              min="1"
                              value={item.qtyReceived}
                              onChange={(e) => handleUpdateItem(idx, 'qtyReceived', parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 text-xs font-mono"
                            />
                          </td>
                          <td className="p-3">
                            <div className="relative">
                              <span className="absolute left-2 top-1.5 text-slate-400 font-bold">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={item.costPrice}
                                onChange={(e) => handleUpdateItem(idx, 'costPrice', parseFloat(e.target.value) || 0)}
                                className="w-full pl-5 pr-2 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 text-xs font-mono"
                              />
                            </div>
                          </td>
                          <td className="p-3 space-y-1">
                            <input
                              type="text"
                              placeholder="Batch"
                              value={item.batchNo || ''}
                              onChange={(e) => handleUpdateItem(idx, 'batchNo', e.target.value)}
                              className="w-full px-2 py-1 rounded border border-slate-200 text-[10px] font-mono"
                            />
                            <input
                              type="date"
                              value={item.expiryDate || ''}
                              onChange={(e) => handleUpdateItem(idx, 'expiryDate', e.target.value)}
                              className="w-full px-1 py-1 rounded border border-slate-200 text-[10px]"
                            />
                          </td>
                          <td className="p-3 text-right font-black font-mono text-slate-900">
                            ₹{(item.qtyReceived * item.costPrice).toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-center">
                            {items.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveItem(idx)}
                                className="text-rose-500 hover:text-rose-700 cursor-pointer p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Payment Mode Strip */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-700 block">
                  {isHi ? 'भुगतान स्थिति (Payment Tender)' : 'Payment Mode'}
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['cash', 'upi', 'credit', 'partial'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                        paymentMode === mode
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {mode === 'cash' ? (isHi ? 'नकद भुगतान' : 'Cash Paid')
                        : mode === 'upi' ? (isHi ? 'UPI / बैंक' : 'UPI Paid')
                        : mode === 'credit' ? (isHi ? 'उधार देय (AP)' : 'Credit (AP)')
                        : (isHi ? 'आंशिक (Partial)' : 'Partial')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block font-mono">
                  {isHi ? 'कुल बिल राशि' : 'Total Invoice Amount'}
                </span>
                <span className="text-2xl font-black text-slate-900 font-mono">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-2xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black shadow-md transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{isHi ? 'स्टॉक इनवर्ड दर्ज करें' : 'Confirm Stock Inward'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
