const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

const headerContent = `import React from 'react';
import { Store, Bell, Globe, ShieldCheck, Activity } from 'lucide-react';

interface HeaderProps {
  storeName: string;
  isOnline: boolean;
  lang: 'hi' | 'en';
  onToggleLang: () => void;
  systemHealth: string;
  activeView: 'mobile' | 'pos';
  onToggleView: (view: 'mobile' | 'pos') => void;
}

export const Header: React.FC<HeaderProps> = ({
  storeName,
  isOnline,
  lang,
  onToggleLang,
  systemHealth,
  activeView,
  onToggleView,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Store Title & Status */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-display font-bold text-slate-900 text-lg leading-tight">
                {storeName}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                Verified
              </span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <span className={\`inline-block w-2 h-2 rounded-full \${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}\`} />
              <span>{isOnline ? 'POS & Online Active' : 'Offline Mode'}</span>
              <span className="text-slate-300">•</span>
              <span className="flex items-center text-slate-600 font-medium">
                <Activity className="w-3 h-3 mr-1 text-emerald-600" />
                API: {systemHealth}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & View Switcher */}
        <div className="flex items-center space-x-2">
          {/* View switcher: Mobile vs Desktop POS */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-semibold text-slate-700">
            <button
              onClick={() => onToggleView('mobile')}
              className={\`px-3 py-1.5 rounded-lg transition-colors \${
                activeView === 'mobile' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-900'
              }\`}
            >
              ?? Mobile App
            </button>
            <button
              onClick={() => onToggleView('pos')}
              className={\`px-3 py-1.5 rounded-lg transition-colors \${
                activeView === 'pos' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-900'
              }\`}
            >
              ?? Counter POS
            </button>
          </div>

          {/* Bilingual Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {lang === 'hi' ? '??????' : 'English'}
          </button>

          {/* Notification bell */}
          <button className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-amber-500 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
};
`;

const voiceFabContent = `import React, { useState } from 'react';
import { Mic, Sparkles, Volume2, ArrowRight } from 'lucide-react';

interface VoiceFabProps {
  onCommandTrigger?: (command: string) => void;
}

export const VoiceFab: React.FC<VoiceFabProps> = ({ onCommandTrigger }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const samplePrompts = [
    '5 kg Aata add karo',
    'Ramesh ka khata batao',
    'Aaj ki total sale kitni hui?',
    'Mustard oil ka stock check karo',
  ];

  const handleMicToggle = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      setTranscript('Listening... (?????, ??? ??? ??? ???)');
      setTimeout(() => {
        setTranscript('"5 kg Aashirvaad Aata added to inventory" (???-????? ???)');
      }, 2000);
    } else {
      setTranscript('');
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setTranscript(\`"\${prompt}"\`);
    if (onCommandTrigger) onCommandTrigger(prompt);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left info & Assistant Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
              AI Voice Copilot
            </span>
            {isListening && (
              <span className="flex items-center text-xs text-amber-300 font-medium animate-pulse">
                <Volume2 className="w-3 h-3 mr-1" />
                Listening...
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold font-display tracking-tight">
            ????? ????? ?? ??? ???? (Tap & Speak)
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-md">
            ?????? ??????, ??? ????? ?????, ?? ??????? ?????—???? ????? ?? Hinglish ??? ??????
          </p>
        </div>

        {/* Big Mic Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMicToggle}
            className={\`flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 \${
              isListening
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/40 animate-pulse'
                : 'bg-white text-emerald-900 hover:bg-emerald-50'
            }\`}
          >
            <Mic className={\`w-5 h-5 \${isListening ? 'animate-bounce text-slate-950' : 'text-emerald-700'}\`} />
            <span>{isListening ? 'Listening... ?????' : '??? ????? ??? ????'}</span>
          </button>
        </div>
      </div>

      {/* Live transcript or feedback if active */}
      {transcript && (
        <div className="mt-3 bg-emerald-900/60 border border-emerald-600/40 rounded-xl p-3 text-xs text-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-medium">{transcript}</span>
          </div>
          <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
            AI Intent Extracted
          </span>
        </div>
      )}

      {/* Quick sample chips */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-emerald-200 mr-1">Quick Prompts:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPrompt(prompt)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full flex items-center space-x-1 transition-colors"
          >
            <span>"{prompt}"</span>
            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>
    </div>
  );
};
`;

const salesContent = `import React from 'react';
import { TrendingUp, QrCode, Banknote, ReceiptText, PlusCircle } from 'lucide-react';

export const SalesSummaryCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Today's Business • ?? ?? ??? ??????
          </span>
          <div className="flex items-baseline space-x-3 mt-1">
            <h3 className="text-3xl font-extrabold font-display text-slate-900">
              ?8,450
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-3.5 h-3.5 mr-1 text-emerald-600" />
              +12% vs y'day
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">42 Bills Total</span>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">
            Avg Bill: ?201
          </span>
        </div>
      </div>

      {/* Payment Breakdowns (UPI vs Cash) */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">UPI / QR Online</span>
              <span className="text-sm font-bold text-slate-800">?6,200</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">73%</span>
        </div>

        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500 block">Cash in Drawer</span>
              <span className="text-sm font-bold text-slate-800">?2,250</span>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">27%</span>
        </div>
      </div>

      {/* Quick POS Action Buttons */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm transition-colors">
          <ReceiptText className="w-4 h-4" />
          <span>New Bill (F1)</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-3 rounded-xl font-semibold text-xs transition-colors">
          <PlusCircle className="w-4 h-4 text-slate-600" />
          <span>Add Stock Item</span>
        </button>
      </div>
    </div>
  );
};
`;

const lowStockContent = `import React from 'react';
import { AlertTriangle, Send } from 'lucide-react';

export const LowStockAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      name: 'Aashirvaad Shudh Chakki Atta 10kg',
      hindi: '???????? ????? ???',
      remaining: 2,
      minThreshold: 5,
      supplier: 'Bansal Wholesale Mart',
      reorderQty: '10 bags',
    },
    {
      id: 2,
      name: 'Fortune Kachi Ghani Mustard Oil 1L',
      hindi: '????????? ????? ???',
      remaining: 1,
      minThreshold: 6,
      supplier: 'Jindal Distributors',
      reorderQty: '12 bottles',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Low Stock Alerts • ?? ????? ???????
            </h3>
            <span className="text-xs text-amber-700 font-medium">2 items urgent reorder required</span>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
          High Urgency
        </span>
      </div>

      <div className="space-y-2.5">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="border border-amber-200/80 bg-amber-50/40 rounded-xl p-3 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-slate-900">{item.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">({item.hindi})</span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-600 mt-0.5">
                <span className="text-red-600 font-bold">Only {item.remaining} left</span>
                <span>•</span>
                <span>Supplier: {item.supplier}</span>
              </div>
            </div>
            <button className="flex items-center space-x-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-2.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all active:scale-95">
              <Send className="w-3 h-3" />
              <span>Auto PO</span>
            </button>
          </div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl font-bold text-xs shadow-sm transition-colors">
        <span>? 1-Click WhatsApp Purchase Order to All Distributors</span>
      </button>
    </div>
  );
};
`;

const khataContent = `import React from 'react';
import { BookOpen, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const KhataSummaryCard: React.FC = () => {
  const debtors = [
    { id: 1, name: 'Ramesh Kumar', phone: '+91 98234 56789', pending: '?1,450', days: '12 days ago' },
    { id: 2, name: 'Priya Sharma', phone: '+91 97112 34567', pending: '?820', days: '3 days ago' },
    { id: 3, name: 'Amit Verma', phone: '+91 99887 11223', pending: '?2,100', days: '15 days ago' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Digital Khata Ledger • ?????? ???? ???????
            </h3>
            <span className="text-xs text-slate-500">18 Customers with outstanding credit</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold font-display text-slate-900">?14,200</span>
          <span className="text-[10px] text-red-600 block font-semibold">?3,800 due today</span>
        </div>
      </div>

      {/* Debtor Snippets */}
      <div className="space-y-2">
        {debtors.map((debtor) => (
          <div
            key={debtor.id}
            className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <div>
              <span className="text-xs font-bold text-slate-800 block">{debtor.name}</span>
              <span className="text-[10px] text-slate-400">
                {debtor.phone} • {debtor.days}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-900">{debtor.pending}</span>
              <button className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors" title="Send WhatsApp Reminder">
                <MessageCircle className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ledger Actions */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white py-2 px-3 rounded-xl font-bold text-xs shadow-sm transition-colors">
          <Send className="w-3.5 h-3.5" />
          <span>Send Reminders to All</span>
        </button>
        <button className="flex-1 flex items-center justify-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-3 rounded-xl font-semibold text-xs transition-colors">
          <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />
          <span>Settle Khata Bill</span>
        </button>
      </div>
    </div>
  );
};
`;

const ordersContent = `import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';

export const ActiveOrdersFeed: React.FC = () => {
  const orders = [
    {
      id: '#1042',
      customer: 'Vikram Verma',
      items: '4 items (?420)',
      type: 'Delivery in 15 mins',
      status: 'Ready for Dispatch',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: '#1041',
      customer: 'Sunita Devi',
      items: '2 items (?180)',
      type: 'Self-Pickup',
      status: 'Packed',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: '#1040',
      customer: 'Amit Patel',
      items: '6 items (?1,150)',
      type: 'Home Delivery',
      status: 'Preparing',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Active Customer Orders • ?????? ???????
            </h3>
            <span className="text-xs text-slate-500">3 pending orders for store pickup & delivery</span>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          3 Active
        </span>
      </div>

      <div className="space-y-2.5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-slate-900">{order.id} • {order.customer}</span>
                <span className={\`text-[10px] font-bold px-2 py-0.5 rounded-full \${order.badgeColor}\`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <span>{order.items}</span>
                <span>•</span>
                <span className="flex items-center text-slate-700 font-medium">
                  <Clock className="w-3 h-3 mr-1 text-slate-400" />
                  {order.type}
                </span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
`;

const files = {
  'apps/web/src/components/Header.tsx': headerContent,
  'apps/web/src/components/VoiceFab.tsx': voiceFabContent,
  'apps/web/src/components/SalesSummaryCard.tsx': salesContent,
  'apps/web/src/components/LowStockAlerts.tsx': lowStockContent,
  'apps/web/src/components/KhataSummaryCard.tsx': khataContent,
  'apps/web/src/components/ActiveOrdersFeed.tsx': ordersContent,
};

for (const [rel, val] of Object.entries(files)) {
  fs.writeFileSync(path.join(root, rel), val, 'utf8');
  console.log('Successfully saved UTF-8:', rel);
}
