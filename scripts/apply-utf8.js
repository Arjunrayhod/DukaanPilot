const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

// Devanagari Hindi and Rupee Unicode Constants:
const RS = '\u20B9'; // ₹
const H_SPEAK_WORK = '\u092C\u094B\u0932\u0915\u0930 \u0915\u093E\u092E \u0915\u0930\u0947\u0902'; // बोलकर काम करें
const H_SPEAK_SHOP = '\u092C\u094B\u0932\u0915\u0930 \u0926\u0941\u0915\u093E\u0928 \u0915\u093E \u0915\u093E\u092E \u0915\u0930\u0947\u0902'; // बोलकर दुकान का काम करें
const H_SPEAK_DESC = '\u0915\u093F\u0930\u093E\u0928\u093E \u092C\u093F\u0932\u093F\u0902\u0917, \u0928\u092F\u093E \u0938\u093E\u092E\u093E\u0928 \u091C\u094B\u0958\u0928\u093E, \u092F\u093E \u092C\u0939\u0940\u0916\u093E\u0924\u093E \u0939\u093F\u0938\u093E\u092C\u2014\u0938\u0940\u0927\u0947 \u0939\u093F\u0902\u0926\u0940 \u092F\u093E Hinglish \u092E\u0947\u0902 \u092C\u094B\u0932\u0947\u0902\u0964';
const H_LISTEN_PROMPT = '\u092C\u094B\u0932\u093F\u090F, \u092E\u0948\u0902 \u0938\u0941\u0928 \u0930\u0939\u093E \u0939\u0942\u0901';
const H_AUTO_SUCCESS = '\u0911\u091F\u094B-\u0905\u092A\u0921\u0947\u091F \u0938\u092B\u0932';
const H_STOP = '\u0930\u094B\u0915\u0947\u0902';
const H_HINDI = '\u0939\u093F\u0928\u094D\u0926\u0940';
const H_TODAYS_SALE = '\u0906\u091C \u0915\u0940 \u0915\u0941\u0932 \u092C\u093F\u0915\u094D\u0930\u0940';
const H_LOW_STOCK = '\u0915\u092E \u0938\u094D\u091F\u0949\u0915 \u091A\u0947\u0924\u093E\u0935\u0928\u0940';
const H_KHATA = '\u0921\u093F\u091C\u093F\u091F\u0932 \u0909\u0927\u093E\u0930 \u092C\u0939\u0940\u0916\u093E\u0924\u093E';
const H_ACTIVE_ORDERS = '\u0938\u0915\u094D\u0930\u093F\u092F \u0911\u0930\u094D\u0921\u0930\u094D\u0938';
const H_TOTAL_PAYABLE = '\u0915\u0941\u0932 \u0926\u0947\u092F \u0930\u093E\u0938\u093F';

const headerCode = `import React from 'react';
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
              📱 Mobile App
            </button>
            <button
              onClick={() => onToggleView('pos')}
              className={\`px-3 py-1.5 rounded-lg transition-colors \${
                activeView === 'pos' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-900'
              }\`}
            >
              💻 Counter POS
            </button>
          </div>

          {/* Bilingual Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 mr-1 text-slate-500" />
            {lang === 'hi' ? '${H_HINDI}' : 'English'}
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

const voiceFabCode = `import React, { useState } from 'react';
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
      setTranscript('Listening... (${H_LISTEN_PROMPT})');
      setTimeout(() => {
        setTranscript('"5 kg Aashirvaad Aata added to inventory" (${H_AUTO_SUCCESS})');
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
            ${H_SPEAK_SHOP} (Tap & Speak)
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-md">
            ${H_SPEAK_DESC}
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
            <span>{isListening ? 'Listening... ${H_STOP}' : '🎙️ ${H_SPEAK_WORK}'}</span>
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

const salesCode = `import React from 'react';
import { TrendingUp, QrCode, Banknote, ReceiptText, PlusCircle } from 'lucide-react';

export const SalesSummaryCard: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Today's Business • ${H_TODAYS_SALE}
          </span>
          <div className="flex items-baseline space-x-3 mt-1">
            <h3 className="text-3xl font-extrabold font-display text-slate-900">
              ${RS}8,450
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
            Avg Bill: ${RS}201
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
              <span className="text-sm font-bold text-slate-800">${RS}6,200</span>
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
              <span className="text-sm font-bold text-slate-800">${RS}2,250</span>
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

const lowStockCode = `import React from 'react';
import { AlertTriangle, Send } from 'lucide-react';

export const LowStockAlerts: React.FC = () => {
  const alerts = [
    {
      id: 1,
      name: 'Aashirvaad Shudh Chakki Atta 10kg',
      hindi: 'आशीर्वाद चक्की आटा',
      remaining: 2,
      minThreshold: 5,
      supplier: 'Bansal Wholesale Mart',
      reorderQty: '10 bags',
    },
    {
      id: 2,
      name: 'Fortune Kachi Ghani Mustard Oil 1L',
      hindi: 'फॉर्च्यून सरसों तेल',
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
              Low Stock Alerts • ${H_LOW_STOCK}
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
        <span>⚡ 1-Click WhatsApp Purchase Order to All Distributors</span>
      </button>
    </div>
  );
};
`;

const khataCode = `import React from 'react';
import { BookOpen, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

export const KhataSummaryCard: React.FC = () => {
  const debtors = [
    { id: 1, name: 'Ramesh Kumar', phone: '+91 98234 56789', pending: '${RS}1,450', days: '12 days ago' },
    { id: 2, name: 'Priya Sharma', phone: '+91 97112 34567', pending: '${RS}820', days: '3 days ago' },
    { id: 3, name: 'Amit Verma', phone: '+91 99887 11223', pending: '${RS}2,100', days: '15 days ago' },
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
              Digital Khata Ledger • ${H_KHATA}
            </h3>
            <span className="text-xs text-slate-500">18 Customers with outstanding credit</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold font-display text-slate-900">${RS}14,200</span>
          <span className="text-[10px] text-red-600 block font-semibold">${RS}3,800 due today</span>
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

const ordersCode = `import React from 'react';
import { ShoppingBag, Clock } from 'lucide-react';

export const ActiveOrdersFeed: React.FC = () => {
  const orders = [
    {
      id: '#1042',
      customer: 'Vikram Verma',
      items: '4 items (${RS}420)',
      type: 'Delivery in 15 mins',
      status: 'Ready for Dispatch',
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: '#1041',
      customer: 'Sunita Devi',
      items: '2 items (${RS}180)',
      type: 'Self-Pickup',
      status: 'Packed',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: '#1040',
      customer: 'Amit Patel',
      items: '6 items (${RS}1,150)',
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
              Active Customer Orders • ${H_ACTIVE_ORDERS}
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

const appCode = `import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceFab } from './components/VoiceFab';
import { SalesSummaryCard } from './components/SalesSummaryCard';
import { LowStockAlerts } from './components/LowStockAlerts';
import { KhataSummaryCard } from './components/KhataSummaryCard';
import { ActiveOrdersFeed } from './components/ActiveOrdersFeed';
import { PosBillingView } from './components/PosBillingView';
import { InventoryView } from './components/InventoryView';
import { AuthModal } from './components/AuthModal';
import { checkHealth } from './services/api';
import { Home, Package, ShoppingCart, BookOpen, Bot, User } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
  const [activeView, setActiveView] = useState<'mobile' | 'pos'>('mobile');
  const [activeTab, setActiveTab] = useState('home');
  const [systemHealth, setSystemHealth] = useState('Checking...');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    name: 'Ramesh Ganesh',
    shopName: 'Shree Ganesh Kirana Store',
    phone: '9876543210',
  });

  useEffect(() => {
    async function loadHealth() {
      const res = await checkHealth();
      if (res.success && res.data) {
        setSystemHealth(\`Online (v\${res.data.version})\`);
      } else {
        setSystemHealth('Online (Local Fallback)');
      }
    }
    loadHealth();
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'inventory', label: 'Inventory', icon: Package, badge: 'Alerts' },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, isCenter: true },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: '3' },
    { id: 'khata', label: 'Khata', icon: BookOpen, badge: '18' },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 md:pb-8 flex flex-col font-sans">
      {/* Top Universal Header */}
      <Header
        storeName={currentUser?.shopName || 'Shree Ganesh Kirana Store'}
        isOnline={true}
        lang={lang}
        onToggleLang={() => setLang(lang === 'hi' ? 'en' : 'hi')}
        systemHealth={systemHealth}
        activeView={activeView}
        onToggleView={setActiveView}
      />

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 py-4 w-full flex-1">
        {activeTab === 'inventory' ? (
          <InventoryView />
        ) : activeView === 'pos' ? (
          <PosBillingView />
        ) : (
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Hero Voice Copilot Section */}
            <VoiceFab onCommandTrigger={(cmd) => console.log('Voice Command:', cmd)} />

            {/* Daily Sales & Revenue Breakdown */}
            <SalesSummaryCard />

            {/* Low Stock Alerts & Smart Reorder */}
            <LowStockAlerts />

            {/* Digital Khata Ledger */}
            <KhataSummaryCard />

            {/* Active Customer Orders */}
            <ActiveOrdersFeed />
          </div>
        )}
      </main>

      {/* Auth Modal Trigger / Profile Button */}
      <div className="fixed top-4 right-4 z-40 hidden sm:block">
        <button
          onClick={() => setIsAuthOpen(true)}
          className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <User className="w-3.5 h-3.5 text-emerald-700" />
          <span>{currentUser?.name || 'Account'}</span>
        </button>
      </div>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(data) => {
          setCurrentUser({
            name: data.user.name,
            shopName: data.shop?.name,
            phone: data.user.phone,
          });
        }}
      />

      {/* Mobile Docked Bottom Navigation Bar (Shown on Mobile screens only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-3 shadow-lg max-w-md mx-auto sm:rounded-t-2xl md:hidden">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            if (item.isCenter) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="relative -top-5 flex flex-col items-center"
                >
                  <div className="w-13 h-13 p-3 bg-emerald-700 text-white rounded-full shadow-lg ring-4 ring-white flex items-center justify-center hover:bg-emerald-800 transition-transform active:scale-95">
                    <Icon className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="text-[10px] font-bold text-emerald-900 mt-1">AI Copilot</span>
                </button>
              );
            }
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={\`flex flex-col items-center relative py-1 px-2 transition-colors \${
                  isActive ? 'text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-600'
                }\`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5">{item.label}</span>
                {item.badge && (
                  <span className="absolute top-0 right-1 px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-extrabold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
`;

const components = {
  'apps/web/src/components/Header.tsx': headerCode,
  'apps/web/src/components/VoiceFab.tsx': voiceFabCode,
  'apps/web/src/components/SalesSummaryCard.tsx': salesCode,
  'apps/web/src/components/LowStockAlerts.tsx': lowStockCode,
  'apps/web/src/components/KhataSummaryCard.tsx': khataCode,
  'apps/web/src/components/ActiveOrdersFeed.tsx': ordersCode,
  'apps/web/src/App.tsx': appCode,
};

for (const [relPath, content] of Object.entries(components)) {
  const full = path.join(root, relPath);
  fs.writeFileSync(full, content, { encoding: 'utf8' });
  console.log('Unicode UTF-8 written successfully:', relPath);
}
