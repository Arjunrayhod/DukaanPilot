import React, { useState, useRef } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  MessageSquare,
  Clock,
  Phone,
  User,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  X,
  CreditCard,
  Banknote,
  Sparkles,
  ChevronRight,
  TrendingDown,
  Filter,
  Mic,
  Volume2,
  Zap,
  Trash2,
  FileText
} from 'lucide-react';
import { Lang, translations } from '../i18n/translations';
import {
  KhataCustomer,
  KhataTransaction,
  INITIAL_KHATA_CUSTOMERS,
  generateKhataWhatsAppUrl,
  formatKhataReminderMessage,
  parseVoiceKhataCommand
} from '../utils/khataService';
import { speakHindi } from '../utils/voiceFeedback';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { KhataStatementModal } from './KhataStatementModal';

interface KhataViewProps {
  lang: Lang;
}

export function KhataView({ lang }: KhataViewProps) {
  const t = translations[lang];
  const isHi = lang === 'hi';

  const [customers, setCustomers] = useState<KhataCustomer[]>(INITIAL_KHATA_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(INITIAL_KHATA_CUSTOMERS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'overdue' | 'high' | 'settled'>('all');

  const customersRef = useRef(customers);
  customersRef.current = customers;

  const selectedCustomerIdRef = useRef(selectedCustomerId);
  selectedCustomerIdRef.current = selectedCustomerId;

  // Modals state
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txType, setTxType] = useState<'DEBIT' | 'CREDIT'>('DEBIT');
  const [txAmount, setTxAmount] = useState('');
  const [txNotes, setTxNotes] = useState('');
  const [txPaymentMode, setTxPaymentMode] = useState<'cash' | 'upi'>('cash');
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustLimit, setNewCustLimit] = useState('5000');
  const [notificationMsg, setNotificationMsg] = useState('');
  const [lastVoiceResult, setLastVoiceResult] = useState('');

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  // Calculations
  const totalReceivable = customers.reduce((sum, c) => sum + c.currentDue, 0);
  const overdueCustomersCount = customers.filter((c) => c.overdueDays >= 7 && c.currentDue > 0).length;

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterMode === 'overdue') return c.overdueDays >= 7 && c.currentDue > 0;
    if (filterMode === 'high') return c.currentDue >= 1500;
    if (filterMode === 'settled') return c.currentDue === 0;
    return true;
  });

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  const handleDeleteCustomer = (customerId: string) => {
    const cust = customers.find(c => c.id === customerId);
    if (!cust) return;
    if (window.confirm(isHi ? `क्या आप सचमुच "${cust.name}" का खाता हटाना चाहते हैं?` : `Are you sure you want to delete khata for "${cust.name}"?`)) {
      const remaining = customers.filter(c => c.id !== customerId);
      setCustomers(remaining);
      if (remaining.length > 0) {
        setSelectedCustomerId(remaining[0].id);
      }
      showNotification(isHi ? `${cust.name} का खाता हटा दिया गया` : `Deleted khata for ${cust.name}`);
    }
  };

  // Process Natural Voice Khata Command (Speak to Entry)
  const handleProcessVoiceKhata = (rawSpoken: string) => {
    if (!rawSpoken.trim()) return;
    setLastVoiceResult(rawSpoken);

    const currentCustomerList = customersRef.current;
    const parsed = parseVoiceKhataCommand(rawSpoken, currentCustomerList);

    if (parsed.amount <= 0) {
      const err = isHi ? 'कृपया राशि बोलें (जैसे: अर्जुन 500 रुपये जमा)' : 'Please specify an amount (e.g. Arjun 500 payment)';
      speakHindi(err, lang);
      showNotification(err);
      return;
    }

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN');
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    let targetCustomer = parsed.matchedCustomer;

    if (!targetCustomer) {
      // If customer is not found by name, create clean new customer if name was spoken
      if (parsed.extractedNewCustomerName && parsed.extractedNewCustomerName.length >= 2) {
        const newCust: KhataCustomer = {
          id: `khata_cust_${Date.now()}`,
          name: parsed.extractedNewCustomerName,
          phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          currentDue: parsed.type === 'DEBIT' ? parsed.amount : 0,
          creditLimit: 5000,
          overdueDays: 0,
          transactions: []
        };

        const newTx: KhataTransaction = {
          id: `tx_${Date.now()}`,
          date: dateStr,
          time: timeStr,
          type: parsed.type,
          amount: parsed.amount,
          balanceAfter: parsed.type === 'DEBIT' ? parsed.amount : 0,
          notes: parsed.notes,
          paymentMode: parsed.type === 'CREDIT' ? 'cash' : undefined,
          billNo: parsed.type === 'DEBIT' ? `Bill #${Math.floor(2000 + Math.random() * 900)}` : undefined
        };
        newCust.transactions = [newTx];

        setCustomers(prev => [newCust, ...prev]);
        setSelectedCustomerId(newCust.id);

        const speech = isHi 
          ? `नया खाता ${parsed.extractedNewCustomerName} बना दिया गया और ₹${parsed.amount} ${parsed.type === 'CREDIT' ? 'जमा' : 'उधार'} दर्ज हुआ`
          : `New Khata ${parsed.extractedNewCustomerName} created with ₹${parsed.amount} ${parsed.type === 'CREDIT' ? 'payment' : 'credit'}`;
        speakHindi(speech, lang);
        showNotification(speech);
        return;
      } else {
        targetCustomer = currentCustomerList.find(c => c.id === selectedCustomerIdRef.current) || currentCustomerList[0];
      }
    }

    if (!targetCustomer) return;

    const targetId = targetCustomer.id;
    setSelectedCustomerId(targetId);

    let finalCalculatedDue = 0;
    let targetCustName = targetCustomer.name;

    setCustomers(prev =>
      prev.map(c => {
        if (c.id === targetId) {
          targetCustName = c.name;
          let newDue = c.currentDue;
          if (parsed.type === 'DEBIT') {
            newDue += parsed.amount;
          } else {
            newDue = Math.max(0, newDue - parsed.amount);
          }
          finalCalculatedDue = newDue;

          const newTx: KhataTransaction = {
            id: `tx_${Date.now()}`,
            date: dateStr,
            time: timeStr,
            type: parsed.type,
            amount: parsed.amount,
            balanceAfter: newDue,
            notes: parsed.notes,
            paymentMode: parsed.type === 'CREDIT' ? 'cash' : undefined,
            billNo: parsed.type === 'DEBIT' ? `Bill #${Math.floor(2000 + Math.random() * 900)}` : undefined
          };

          return {
            ...c,
            currentDue: newDue,
            overdueDays: parsed.type === 'DEBIT' ? (c.overdueDays || 1) : (newDue === 0 ? 0 : c.overdueDays),
            lastDebitDate: parsed.type === 'DEBIT' ? dateStr : c.lastDebitDate,
            lastPaymentDate: parsed.type === 'CREDIT' ? dateStr : c.lastPaymentDate,
            transactions: [newTx, ...c.transactions]
          };
        }
        return c;
      })
    );

    const calculatedSpeechDue = parsed.type === 'DEBIT'
      ? targetCustomer.currentDue + parsed.amount
      : Math.max(0, targetCustomer.currentDue - parsed.amount);

    const confirmationMsg = isHi
      ? (parsed.type === 'DEBIT'
          ? `${targetCustName} का ₹${parsed.amount} उधार दर्ज हो गया। नया बकाया ₹${calculatedSpeechDue} है।`
          : `${targetCustName} से ₹${parsed.amount} जमा प्राप्त हुआ। नया बकाया ₹${calculatedSpeechDue} है।`)
      : `Recorded ₹${parsed.amount} ${parsed.type === 'DEBIT' ? 'credit' : 'payment'} for ${targetCustName}. New Balance: ₹${calculatedSpeechDue}`;

    speakHindi(confirmationMsg, lang);
    showNotification(confirmationMsg);
  };

  const {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    toggleListening,
    setTranscript
  } = useVoiceRecognition({
    lang: 'hi-IN',
    onResult: (res, isFinal) => {
      if (isFinal) {
        handleProcessVoiceKhata(res);
      }
    }
  });

  // 1. Add Udhaar / Jama Transaction (Manual Modal Form)
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseFloat(txAmount) || 0;
    if (amountNum <= 0 || !selectedCustomer) return;

    const targetId = selectedCustomer.id;
    const newTxId = `tx_${Date.now()}`;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN');
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    let finalDue = 0;

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === targetId) {
          let newDue = c.currentDue;
          if (txType === 'DEBIT') {
            newDue += amountNum;
          } else {
            newDue = Math.max(0, newDue - amountNum);
          }
          finalDue = newDue;

          const newTx: KhataTransaction = {
            id: newTxId,
            date: dateStr,
            time: timeStr,
            type: txType,
            amount: amountNum,
            balanceAfter: newDue,
            notes: txNotes || (txType === 'DEBIT' ? 'सामान उधारी' : 'भुगतान प्राप्ति'),
            paymentMode: txType === 'CREDIT' ? txPaymentMode : undefined,
            billNo: txType === 'DEBIT' ? `Bill #${Math.floor(2000 + Math.random() * 900)}` : undefined
          };

          return {
            ...c,
            currentDue: newDue,
            overdueDays: txType === 'DEBIT' ? c.overdueDays : (newDue === 0 ? 0 : c.overdueDays),
            lastDebitDate: txType === 'DEBIT' ? dateStr : c.lastDebitDate,
            lastPaymentDate: txType === 'CREDIT' ? dateStr : c.lastPaymentDate,
            transactions: [newTx, ...c.transactions]
          };
        }
        return c;
      })
    );

    const speechText = txType === 'DEBIT'
      ? `${selectedCustomer.name} का ₹${amountNum} उधार दर्ज हुआ`
      : `${selectedCustomer.name} से ₹${amountNum} जमा प्राप्त हुआ`;
    
    speakHindi(speechText);
    showNotification(isHi ? speechText : `Transaction recorded for ${selectedCustomer.name}: ₹${amountNum}`);
    
    setIsAddTxOpen(false);
    setTxAmount('');
    setTxNotes('');
  };

  // 2. Add New Customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName.trim() || !newCustPhone.trim()) return;

    const newCust: KhataCustomer = {
      id: `khata_cust_${Date.now()}`,
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      address: newCustAddress.trim() || undefined,
      currentDue: 0,
      creditLimit: parseFloat(newCustLimit) || 5000,
      overdueDays: 0,
      transactions: []
    };

    setCustomers((prev) => [newCust, ...prev]);
    setSelectedCustomerId(newCust.id);
    setIsAddCustomerOpen(false);
    setNewCustName('');
    setNewCustPhone('');
    setNewCustAddress('');

    const msg = isHi ? `नया खाता बनाया गया: ${newCust.name}` : `New Khata created: ${newCust.name}`;
    speakHindi(msg);
    showNotification(msg);
  };

  // 3. Trigger WhatsApp Reminder
  const handleWhatsAppReminder = (customer: KhataCustomer) => {
    const url = generateKhataWhatsAppUrl(customer, undefined, lang);
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Top Header Metrics & Action Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-white">
                {isHi ? 'डिजिटल खाता बही' : 'Digital Khata Ledger'}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                {isHi ? 'उधार-जमा का सटीक हिसाब व ऑटोमैटिक व्हाट्सएप तगादा' : 'Track credit, payments & send WhatsApp reminders with UPI link'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Stats & Action Pills */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 px-4 py-2 rounded-2xl">
            <span className="text-[10px] text-slate-300 uppercase font-bold block">{isHi ? 'कुल बाजार बकाया' : 'Total Due'}</span>
            <span className="text-lg font-black text-amber-400 font-mono">₹{totalReceivable.toLocaleString('en-IN')}</span>
          </div>

          {isSupported && (
            <button
              type="button"
              onClick={toggleListening}
              className={`h-11 px-4 rounded-full text-xs font-black shadow-lg transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white ring-4 ring-red-400/50 animate-pulse'
                  : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 border border-amber-300'
              }`}
              title={isHi ? 'बोलकर खाता एंट्री करें' : 'Speak to record Khata entry'}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce text-white' : 'text-slate-950'}`} />
              <span>{isListening ? (isHi ? 'सुन रहा हूं... बोलें' : 'Listening...') : (isHi ? '🎙️ बोलकर खाता एंट्री' : '🎙️ Speak Entry')}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAddCustomerOpen(true)}
            className="h-11 px-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black shadow-lg transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-slate-950 stroke-[3]" />
            <span>{isHi ? '+ नया खाता' : '+ Add Customer'}</span>
          </button>
        </div>
      </div>

      {/* AI Voice Assistant Bar */}
      {isSupported && (
        <div className={`p-4 rounded-3xl border transition-all duration-300 ${
          isListening 
            ? 'bg-amber-500/10 border-amber-400/50 shadow-md ring-2 ring-amber-400/20' 
            : 'bg-white border-slate-200/90 shadow-sm'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
                isListening ? 'bg-amber-500 text-slate-950 animate-pulse' : 'bg-slate-100 text-slate-700'
              }`}>
                {isListening ? <Mic className="w-5 h-5 animate-bounce" /> : <Zap className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">
                    {isHi ? 'AI बोलकर खाता एंट्री (Speak to Entry)' : 'AI Voice Khata Ledger Entry'}
                  </span>
                  {isListening && (
                    <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-black animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  {isListening
                    ? (interimTranscript || transcript || (isHi ? 'बोलिए... जैसे: "रमेश 500 रुपये उधार" या "सुनीता 300 रुपये जमा"' : 'Say: "Ramesh 500 udhaar" or "Sunita 300 jama"'))
                    : (lastVoiceResult 
                        ? (isHi ? `पिछली वॉइस कमांड: "${lastVoiceResult}"` : `Last voice input: "${lastVoiceResult}"`)
                        : (isHi ? 'माइक दबाकर बोलें: "[ग्राहक नाम] [रुपये] उधार/जमा"' : 'Click mic & speak: "[Customer Name] [Amount] credit/payment"'))
                  }
                </p>
              </div>
            </div>

            {/* Quick Voice Demo Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider hidden sm:inline">
                {isHi ? 'उदाहरण:' : 'Try:'}
              </span>
              {[
                { label: isHi ? 'रमेश 500 उधार' : 'Ramesh 500 udhaar', text: 'रमेश 500 उधार' },
                { label: isHi ? 'सुनीता 300 जमा' : 'Sunita 300 jama', text: 'सुनीता 300 जमा' },
                { label: isHi ? 'महेंद्र 1000 जमा' : 'Mahendra 1000 jama', text: 'महेंद्र 1000 जमा' },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleProcessVoiceKhata(chip.text)}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 text-[11px] font-semibold transition-all active:scale-95 cursor-pointer"
                >
                  ⚡ {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main 2-Panel Layout: Left = Customer List, Right = Customer Ledger Statement */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column (5 of 12): Search, Filter Chips & Customer Cards */}
        <div className="lg:col-span-5 space-y-3">
          
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isHi ? 'ग्राहक का नाम या मोबाइल खोजें...' : 'Search customer by name or phone...'}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-medium"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {isHi ? 'सभी खाते' : 'All'} ({customers.length})
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('overdue')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ${
                  filterMode === 'overdue'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                }`}
              >
                <AlertTriangle className="w-3 h-3" />
                <span>{isHi ? 'अति-बकाया (>7 दिन)' : 'Overdue (>7d)'} ({overdueCustomersCount})</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('high')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'high'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                }`}
              >
                <span>{isHi ? '> ₹1,500 बकाया' : '> ₹1.5k Due'}</span>
              </button>

              <button
                type="button"
                onClick={() => setFilterMode('settled')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                  filterMode === 'settled'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                }`}
              >
                <span>{isHi ? 'क्लियर (₹0)' : 'Settled'}</span>
              </button>
            </div>
          </div>

          {/* Customer Cards List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
            {filteredCustomers.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 space-y-2">
                <User className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs">{isHi ? 'कोई खाता नहीं मिला' : 'No customers found'}</p>
              </div>
            ) : (
              filteredCustomers.map((cust) => {
                const isSelected = cust.id === selectedCustomerId;
                const isOverdue = cust.overdueDays >= 7 && cust.currentDue > 0;

                return (
                  <div
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-200'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-10 h-10 rounded-2xl font-black text-sm flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {cust.name.substring(0, 2).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-slate-900 truncate">{cust.name}</span>
                          {isOverdue && (
                            <span className="px-2 py-0.2 rounded-full bg-rose-100 text-rose-700 font-extrabold text-[9px] flex items-center gap-0.5">
                              <Clock className="w-2.5 h-2.5" />
                              <span>{cust.overdueDays}d</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 font-mono block">{cust.phone}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end">
                      <span className={`text-sm font-black font-mono ${
                        cust.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                      }`}>
                        ₹{cust.currentDue.toLocaleString('en-IN')}
                      </span>
                      
                      {cust.currentDue > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppReminder(cust);
                          }}
                          className="mt-1 px-2.5 py-1 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                          title="WhatsApp Reminder"
                        >
                          <MessageSquare className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                          <span>{isHi ? 'तगादा' : 'Remind'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column (7 of 12): Detailed Customer Ledger Statement */}
        <div className="lg:col-span-7">
          {selectedCustomer ? (
            <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Customer Statement Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-black text-base flex items-center justify-center shadow-md">
                    {selectedCustomer.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 text-base">
                        {selectedCustomer.name}
                      </h3>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomer(selectedCustomer.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={isHi ? 'खाता हटाएं' : 'Delete Customer Khata'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="text-xs text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{selectedCustomer.phone}</span>
                      </span>
                      {selectedCustomer.address && (
                        <span>&bull; {selectedCustomer.address}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Net Balance Box */}
                <div className="bg-slate-50 border border-slate-200 p-3 rounded-2xl text-right shrink-0">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    {isHi ? 'वर्तमान बकाया' : 'Current Balance'}
                  </span>
                  <span className={`text-xl font-black font-mono ${
                    selectedCustomer.currentDue > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }`}>
                    ₹{selectedCustomer.currentDue.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons Strip: Udhaar vs Jama vs WhatsApp vs Statement */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setTxType('DEBIT');
                    setTxNotes('');
                    setTxAmount('');
                    setIsAddTxOpen(true);
                  }}
                  className="h-11 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isHi ? '- उधार दिया' : '- Give Credit'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTxType('CREDIT');
                    setTxNotes('');
                    setTxAmount('');
                    setIsAddTxOpen(true);
                  }}
                  className="h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isHi ? '+ जमा मिला' : '+ Receive'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleWhatsAppReminder(selectedCustomer)}
                  disabled={selectedCustomer.currentDue === 0}
                  className="h-11 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white text-xs font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
                  <span>{isHi ? 'तगादा' : 'Reminder'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsStatementModalOpen(true)}
                  className="h-11 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-700" />
                  <span>{isHi ? 'PDF लेजर' : 'Statement'}</span>
                </button>
              </div>

              {/* Transactions Timeline Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                    {isHi ? 'लेन-देन इतिहास' : 'Transaction History'}
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {selectedCustomer.transactions.length} {isHi ? 'प्रविष्टियां' : 'Entries'}
                  </span>
                </div>

                <div className="border border-slate-100 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {selectedCustomer.transactions.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      {isHi ? 'कोई पुराना लेन-देन दर्ज नहीं है।' : 'No transaction history recorded yet.'}
                    </div>
                  ) : (
                    selectedCustomer.transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              tx.type === 'DEBIT'
                                ? 'bg-rose-100 text-rose-600'
                                : 'bg-emerald-100 text-emerald-600'
                            }`}
                          >
                            {tx.type === 'DEBIT' ? (
                              <ArrowUpRight className="w-4 h-4 stroke-[3]" />
                            ) : (
                              <ArrowDownLeft className="w-4 h-4 stroke-[3]" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 flex items-center gap-2 flex-wrap">
                              <span>{tx.notes}</span>
                              {tx.billNo && (
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.2 rounded-md font-mono">
                                  {tx.billNo}
                                </span>
                              )}
                              {tx.paymentMode && (
                                <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.2 rounded-md font-bold uppercase">
                                  {tx.paymentMode}
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {tx.date} at {tx.time}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`text-sm font-black font-mono block ${
                              tx.type === 'DEBIT' ? 'text-rose-600' : 'text-emerald-600'
                            }`}
                          >
                            {tx.type === 'DEBIT' ? `+ ₹${tx.amount}` : `- ₹${tx.amount}`}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {isHi ? 'बैलेंस:' : 'Bal:'} ₹{tx.balanceAfter}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          ) : null}
        </div>
      </div>

      {/* 1. Modal: Add Transaction (Udhaar or Jama) */}
      {isAddTxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold ${
                  txType === 'DEBIT' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}>
                  {txType === 'DEBIT' ? <ArrowUpRight className="w-4 h-4 stroke-[3]" /> : <ArrowDownLeft className="w-4 h-4 stroke-[3]" />}
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {txType === 'DEBIT'
                    ? (isHi ? 'उधार जोड़ें' : 'Give Credit (Udhaar)')
                    : (isHi ? 'जमा प्राप्त करें' : 'Record Payment (Jama)')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTxOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHi ? 'ग्राहक:' : 'Customer:'}
                </label>
                <input
                  type="text"
                  value={selectedCustomer.name}
                  disabled
                  className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHi ? 'राशि (₹):' : 'Amount (₹):'} *
                </label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  placeholder="500"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                  autoFocus
                />
              </div>

              {txType === 'CREDIT' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {isHi ? 'भुगतान माध्यम:' : 'Payment Mode:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTxPaymentMode('cash')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        txPaymentMode === 'cash'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-200'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isHi ? 'नकद' : 'Cash'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTxPaymentMode('upi')}
                      className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        txPaymentMode === 'upi'
                          ? 'bg-blue-50 border-blue-500 text-blue-800 ring-2 ring-blue-200'
                          : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isHi ? 'UPI QR' : 'UPI Online'}</span>
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHi ? 'विवरण या सामान:' : 'Notes / Details:'}
                </label>
                <input
                  type="text"
                  value={txNotes}
                  onChange={(e) => setTxNotes(e.target.value)}
                  placeholder={txType === 'DEBIT' ? 'उदा: 2 आटा, 1 तेल' : 'उदा: नकद भुगतान'}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddTxOpen(false)}
                  className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className={`flex-1 h-10 rounded-2xl text-white font-bold shadow-md transition-all cursor-pointer ${
                    txType === 'DEBIT' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  {isHi ? 'सेव करें' : 'Save Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal: Add New Customer Account */}
      {isAddCustomerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                <span>{isHi ? 'नया ग्राहक खाता जोड़ें' : 'Add New Customer Khata'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCustomerOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHi ? 'ग्राहक का नाम:' : 'Customer Name:'} *
                </label>
                <input
                  type="text"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="उदा: राजेश शर्मा"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHi ? 'मोबाइल नंबर:' : 'Mobile Phone:'} *
                </label>
                <input
                  type="tel"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHi ? 'पता / गली:' : 'Address:'}
                </label>
                <input
                  type="text"
                  value={newCustAddress}
                  onChange={(e) => setNewCustAddress(e.target.value)}
                  placeholder="मकान नं, गली या कॉलोनी"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {isHi ? 'उधार सीमा (₹):' : 'Credit Limit (₹):'}
                </label>
                <input
                  type="number"
                  value={newCustLimit}
                  onChange={(e) => setNewCustLimit(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCustomerOpen(false)}
                  className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 h-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all cursor-pointer"
                >
                  {isHi ? 'खाता बनाएं' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable A4 PDF Khata Statement Modal */}
      <KhataStatementModal
        isOpen={isStatementModalOpen}
        onClose={() => setIsStatementModalOpen(false)}
        customer={selectedCustomer}
        lang={lang}
      />
    </div>
  );
}
