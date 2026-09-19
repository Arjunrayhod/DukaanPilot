import React, { useState, useEffect } from 'react';
import {
  Users,
  Banknote,
  Clock,
  ArrowRight,
  Printer,
  Share2,
  X,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  Coins,
  History,
  MinusCircle,
  PlusCircle,
  ChevronRight
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import {
  getActiveShift,
  getShiftHistory,
  startShift,
  recordCashDrop,
  closeShift,
  formatWhatsAppShiftHandover,
  CashierShift,
  SHIFT_UPDATED_EVENT
} from '../utils/cashierShiftService';
import { generateWhatsAppLink } from '../utils/receiptGenerator';
import { speakHindi } from '../utils/voiceFeedback';

interface CashierShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  shopName?: string;
  shopPhone?: string;
}

export function CashierShiftModal({
  isOpen,
  onClose,
  lang,
  shopName = 'श्री गणेश किराना स्टोर',
  shopPhone = '+91 98765 43210'
}: CashierShiftModalProps) {
  const isHi = lang === 'hi';
  const [activeShift, setActiveShift] = useState<CashierShift | null>(() => getActiveShift());
  const [history, setHistory] = useState<CashierShift[]>(() => getShiftHistory());
  const [activeTab, setActiveTab] = useState<'LIVE' | 'CASH_DROP' | 'CLOSE_SHIFT' | 'HISTORY'>('LIVE');

  // Start Shift Form State
  const [cashierName, setCashierName] = useState('राजेश शर्मा');
  const [counterNumber, setCounterNumber] = useState('Counter #1 (मेन काउंटर)');
  const [openingFloat, setOpeningFloat] = useState<number>(2000);

  // Cash Drop Form State
  const [dropAmount, setDropAmount] = useState<number>(500);
  const [dropReason, setDropReason] = useState('दूध व ब्रेड सप्लायर नकद भुगतान');
  const [dropType, setDropType] = useState<'EXPENSE' | 'SAFE_DROP'>('EXPENSE');

  // Close Shift Denominations State
  const [denoms, setDenoms] = useState<Record<number, number>>({
    500: 0,
    200: 0,
    100: 0,
    50: 0,
    20: 0,
    10: 0,
    5: 0,
    2: 0,
    1: 0
  });
  const [manualCountedCash, setManualCountedCash] = useState<number>(0);
  const [useDenomMode, setUseDenomMode] = useState<boolean>(true);
  const [closingNotes, setClosingNotes] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setActiveShift(getActiveShift());
      setHistory(getShiftHistory());
    };
    window.addEventListener(SHIFT_UPDATED_EVENT, handleUpdate);
    return () => window.removeEventListener(SHIFT_UPDATED_EVENT, handleUpdate);
  }, []);

  if (!isOpen) return null;

  // Calculate total from denominations
  const denomTotal = Object.entries(denoms).reduce((sum, [noteVal, count]) => {
    return sum + Number(noteVal) * (Number(count) || 0);
  }, 0);

  const actualCashToUse = useDenomMode ? denomTotal : manualCountedCash;
  const expectedCash = activeShift?.expectedCash || 0;
  const variance = actualCashToUse - expectedCash;

  const handleStartShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newShift = startShift({
      cashierName,
      counterNumber,
      openingFloat: Number(openingFloat) || 0
    });
    setActiveShift(newShift);
    speakHindi(isHi ? `${cashierName} की शिफ्ट शुरू हो गई है` : 'Shift started');
  };

  const handleRecordDropSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dropAmount <= 0) return;
    const updated = recordCashDrop({
      amount: Number(dropAmount),
      reason: dropReason,
      type: dropType
    });
    if (updated) {
      setActiveShift(updated);
      speakHindi(isHi ? `₹${dropAmount} गल्ले से निकासी दर्ज हुई` : 'Cash drop recorded');
      setActiveTab('LIVE');
    }
  };

  const handleCloseShiftSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const closed = closeShift({
      actualCash: actualCashToUse,
      denominations: useDenomMode ? denoms : undefined,
      closingNotes
    });
    if (closed) {
      setActiveShift(null);
      setHistory(getShiftHistory());
      speakHindi(isHi ? 'शिफ्ट समाप्त व गल्ला हैंडओवर पूर्ण हुआ' : 'Shift closed successfully');
      setActiveTab('HISTORY');
    }
  };

  const handleSendWhatsAppSummary = (shift: CashierShift) => {
    const msg = formatWhatsAppShiftHandover(shift, shopName, lang === 'hi' ? 'hi' : 'en');
    const url = generateWhatsAppLink(shopPhone, msg);
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl space-y-5 my-auto text-white">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-400/30 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{isHi ? 'कैशियर शिफ्ट व गल्ला हैंडओवर' : 'Cashier Shifts & Cash Drawer'}</span>
                {activeShift ? (
                  <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full animate-pulse">
                    {isHi ? 'शिफ्ट चालू (Active)' : 'Shift Active'}
                  </span>
                ) : (
                  <span className="text-[10px] bg-slate-700 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                    {isHi ? 'शिफ्ट बंद (Closed)' : 'Closed'}
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {isHi ? 'शुरुआती छुट्टे (Float), गल्ला निकासी व शिफ्ट-एंड हिसाब' : 'Opening float, cash drops & shift reconciliation'}
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

        {/* Tab Navigation Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-2xl border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('LIVE')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'LIVE' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isHi ? 'वर्तमान शिफ्ट' : 'Active Shift'}</span>
          </button>

          {activeShift && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('CASH_DROP')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'CASH_DROP' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MinusCircle className="w-3.5 h-3.5" />
                <span>{isHi ? 'गल्ला निकासी/खर्च' : 'Cash Drop'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('CLOSE_SHIFT')}
                className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'CLOSE_SHIFT' ? 'bg-red-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isHi ? 'शिफ्ट समाप्त (Close)' : 'Close Shift'}</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'HISTORY' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{isHi ? 'पुराना इतिहास' : 'History'}</span>
          </button>
        </div>

        {/* 1. Active Shift Dashboard OR Start Shift Form */}
        {activeTab === 'LIVE' && (
          <div>
            {!activeShift ? (
              /* Start Shift Form */
              <form onSubmit={handleStartShiftSubmit} className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center gap-2 text-indigo-400 text-sm font-black">
                  <Unlock className="w-4 h-4" />
                  <span>{isHi ? 'नई काउंटर शिफ्ट शुरू करें' : 'Open New Counter Shift'}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {isHi ? 'कैशियर का नाम' : 'Cashier Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={cashierName}
                      onChange={(e) => setCashierName(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">
                      {isHi ? 'काउंटर नंबर' : 'Counter ID'}
                    </label>
                    <input
                      type="text"
                      value={counterNumber}
                      onChange={(e) => setCounterNumber(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {isHi ? 'शुरुआती छुट्टे / कैश फ्लोट (₹)' : 'Opening Cash Float (₹)'}
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={openingFloat}
                    onChange={(e) => setOpeningFloat(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 bg-slate-900 border border-indigo-500/40 rounded-xl text-emerald-400 text-lg font-black font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="2000"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isHi ? 'गल्ले में सुबह रखे गए छुट्टे नोट व सिक्के।' : 'Cash float kept in drawer for customer change.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99]"
                >
                  <Unlock className="w-4 h-4" />
                  <span>{isHi ? 'गल्ला खोलें व शिफ्ट शुरू करें' : 'Open Drawer & Start Shift'}</span>
                </button>
              </form>
            ) : (
              /* Live Active Shift Summary Cards */
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 p-4 rounded-2xl border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">
                      {activeShift.counterNumber}
                    </span>
                    <h4 className="font-extrabold text-base text-white">{activeShift.cashierName}</h4>
                    <p className="text-xs text-slate-400">
                      {isHi ? 'शिफ्ट शुरू:' : 'Started:'} {activeShift.startTime} ({activeShift.date})
                    </p>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-[10px] text-slate-400 block">{isHi ? 'गल्ले में अपेक्षित कैश' : 'Expected Drawer Cash'}</span>
                    <span className="text-2xl font-black text-emerald-400">₹{activeShift.expectedCash.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* 4 Financial Metric Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-white/5">
                    <span className="text-slate-400 block text-[11px]">{isHi ? 'शुरुआती कैश' : 'Opening Float'}</span>
                    <span className="font-mono font-black text-white text-sm">₹{activeShift.openingFloat.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/20">
                    <span className="text-emerald-400 block text-[11px]">{isHi ? 'नकद बिक्री' : 'Cash Sales'}</span>
                    <span className="font-mono font-black text-emerald-300 text-sm">₹{activeShift.cashSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-blue-500/20">
                    <span className="text-blue-400 block text-[11px]">UPI बिक्री</span>
                    <span className="font-mono font-black text-blue-300 text-sm">₹{activeShift.upiSales.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/20">
                    <span className="text-amber-400 block text-[11px]">{isHi ? 'गल्ला निकासी' : 'Cash Drops'}</span>
                    <span className="font-mono font-black text-amber-300 text-sm">- ₹{activeShift.totalCashDrops.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Cash Drops list */}
                {activeShift.cashDrops.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-400 block">
                      {isHi ? `गल्ला निकासी रिकॉर्ड्स (${activeShift.cashDrops.length}):` : 'Cash Drops:'}
                    </span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {activeShift.cashDrops.map((d) => (
                        <div key={d.id} className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-200">{d.reason}</span>
                            <span className="text-[10px] text-slate-400 ml-2 font-mono">{d.time}</span>
                          </div>
                          <span className="font-mono font-bold text-amber-400">- ₹{d.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('CASH_DROP')}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <MinusCircle className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isHi ? 'गल्ले से खर्च/ड्रॉप दर्ज करें' : 'Record Cash Drop'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('CLOSE_SHIFT')}
                    className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isHi ? 'शिफ्ट समाप्त व हैंडओवर' : 'Close Shift & Handover'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Record Cash Drop / Expense Form */}
        {activeTab === 'CASH_DROP' && activeShift && (
          <form onSubmit={handleRecordDropSubmit} className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-amber-500/30">
            <div className="flex items-center gap-2 text-amber-400 text-sm font-black">
              <MinusCircle className="w-4 h-4" />
              <span>{isHi ? 'गल्ले से नकद निकासी / दुकान खर्च' : 'Record Cash Drop / Petty Expense'}</span>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isHi ? 'निकासी का प्रकार' : 'Drop Type'}
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setDropType('EXPENSE')}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    dropType === 'EXPENSE' ? 'bg-amber-600 border-amber-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {isHi ? 'दुकान खर्च / सप्लायर भुगतान' : 'Store Expense / Vendor'}
                </button>
                <button
                  type="button"
                  onClick={() => setDropType('SAFE_DROP')}
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    dropType === 'SAFE_DROP' ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {isHi ? 'सेफ लॉकर में जमा (Safe Drop)' : 'Safe Locker Drop'}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isHi ? 'निकासी राशि (₹)' : 'Amount (₹)'}
              </label>
              <input
                type="number"
                required
                min="1"
                value={dropAmount}
                onChange={(e) => setDropAmount(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 bg-slate-900 border border-amber-500/40 rounded-xl text-amber-400 text-base font-black font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isHi ? 'कारण / विवरण' : 'Reason / Note'}
              </label>
              <input
                type="text"
                required
                value={dropReason}
                onChange={(e) => setDropReason(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold focus:ring-2 focus:ring-amber-500 focus:outline-none"
                placeholder="उदा: दूध वाले को कैश दिया"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('LIVE')}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isHi ? 'निकासी दर्ज करें' : 'Save Drop'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. Close Shift & Denominations Counter Form */}
        {activeTab === 'CLOSE_SHIFT' && activeShift && (
          <form onSubmit={handleCloseShiftSubmit} className="space-y-4 bg-slate-950/70 p-5 rounded-2xl border border-red-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-red-400 text-sm font-black">
                <Lock className="w-4 h-4" />
                <span>{isHi ? 'शिफ्ट समाप्त व गल्ला मिलान (Reconciliation)' : 'Shift Close & Cash Count'}</span>
              </div>

              <div className="inline-flex bg-slate-900 rounded-full p-0.5 border border-white/10 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setUseDenomMode(true)}
                  className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                    useDenomMode ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {isHi ? 'नोट अनुसार' : 'Denominations'}
                </button>
                <button
                  type="button"
                  onClick={() => setUseDenomMode(false)}
                  className={`px-3 py-1 rounded-full cursor-pointer transition-all ${
                    !useDenomMode ? 'bg-indigo-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {isHi ? 'सीधी राशि' : 'Direct Total'}
                </button>
              </div>
            </div>

            {useDenomMode ? (
              /* Note-by-note Denominations Counter Grid */
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">
                  {isHi ? 'गल्ले में नोटों की गिनती करें:' : 'Count Notes in Drawer:'}
                </span>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[500, 200, 100, 50, 20, 10, 5, 2, 1].map((denom) => (
                    <div key={denom} className="bg-slate-900 p-2 rounded-xl border border-slate-800 flex items-center justify-between">
                      <span className="font-mono font-black text-slate-300">₹{denom} x</span>
                      <input
                        type="number"
                        min="0"
                        value={denoms[denom] || ''}
                        onChange={(e) =>
                          setDenoms({ ...denoms, [denom]: parseInt(e.target.value) || 0 })
                        }
                        className="w-14 p-1 bg-slate-950 border border-slate-700 rounded text-center text-white font-mono font-bold text-xs"
                        placeholder="0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {isHi ? 'गिना गया कुल वास्तविक कैश (₹)' : 'Total Actual Cash Counted (₹)'}
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={manualCountedCash}
                  onChange={(e) => setManualCountedCash(parseFloat(e.target.value) || 0)}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 text-xl font-mono font-black focus:outline-none"
                />
              </div>
            )}

            {/* Reconciliation Comparison Card */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[11px]">{isHi ? 'गल्ले में अपेक्षित:' : 'Expected:'}</span>
                <span className="text-sm font-bold text-white">₹{expectedCash.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-center">
                <span className="text-slate-400 block text-[11px]">{isHi ? 'गिना गया कैश:' : 'Counted:'}</span>
                <span className="text-sm font-bold text-emerald-400">₹{actualCashToUse.toLocaleString('en-IN')}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[11px]">{isHi ? 'अंतर (Variance):' : 'Variance:'}</span>
                <span
                  className={`text-sm font-black ${
                    variance === 0
                      ? 'text-emerald-400'
                      : variance > 0
                      ? 'text-blue-400'
                      : 'text-red-400'
                  }`}
                >
                  {variance === 0 ? '✓ ₹0' : variance > 0 ? `+ ₹${variance}` : `- ₹${Math.abs(variance)}`}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {isHi ? 'शिफ्ट क्लोजिंग टिप्पणी' : 'Closing Remarks'}
              </label>
              <input
                type="text"
                value={closingNotes}
                onChange={(e) => setClosingNotes(e.target.value)}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs font-bold"
                placeholder={isHi ? 'गल्ला सही मिला' : 'Drawer reconciled'}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('LIVE')}
                className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>

              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.99]"
              >
                <Lock className="w-4 h-4" />
                <span>{isHi ? 'शिफ्ट लॉक व हैंडओवर पूरा करें' : 'Close & Lock Shift'}</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. Shift History & WhatsApp Share */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 block">
              {isHi ? `पिछली शिफ्ट्स (${history.length}):` : 'Past Shifts:'}
            </span>

            <div className="space-y-2 max-h-72 overflow-y-auto">
              {history.map((s) => (
                <div key={s.id} className="p-3.5 rounded-2xl bg-slate-950 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{s.cashierName}</span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {s.date} ({s.startTime} - {s.endTime})
                      </span>
                    </div>
                    <div className="text-slate-400 text-[11px] mt-1">
                      {s.counterNumber} &bull; {s.totalBills} बिल &bull; बिक्री: ₹{s.totalSales.toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono">
                      <span className="text-white font-black text-sm">₹{s.expectedCash.toLocaleString('en-IN')}</span>
                      <span className={`block text-[10px] ${s.variance === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {s.variance === 0 ? '✓ संतुलित' : `अंतर: ₹${s.variance}`}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSendWhatsAppSummary(s)}
                      className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 transition-all cursor-pointer"
                      title={isHi ? 'व्हाट्सएप पर रिपोर्ट भेजें' : 'Send WhatsApp Report'}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
