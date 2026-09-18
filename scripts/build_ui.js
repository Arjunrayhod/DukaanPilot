const fs = require('fs');

console.log('--- WIRING MULTI-LANGUAGE (HINDI / ENGLISH) ACROSS ALL COMPONENTS ---');

fs.mkdirSync('apps/web/src/i18n', { recursive: true });

const translationsCode = `export type Lang = 'hi' | 'en';

export const translations = {
  hi: {
    // Header
    storeName: 'श्री गणेश किराना',
    posOnline: 'पीओएस ऑनलाइन',
    dashboard: 'डैशबोर्ड',
    mobileView: 'मोबाइल',
    posView: 'काउंटर POS',
    account: 'खाता',
    
    // Voice Hero Banner
    instantVoicePos: 'Instant AI वॉइस POS',
    languagesSupported: '8 भाषाएँ समर्थित',
    voiceBillTitle: 'बोलकर बिल बनाएं',
    voiceBillSub: '/ Voice Bill',
    voicePlaceholder: 'उदा: "रमेश कुमार 2 किलो चीनी और ₹150 उधार जोड़ो"',
    listening: 'सुन रहा हूं... "रमेश कुमार 2 किलो चीनी और ₹150 उधार जोड़ो"',
    promptAtta: '+ 5kg आशीर्वाद आटा',
    promptCash: '+ ₹500 नकद जमा (सुरेश)',
    promptSales: 'आज की कुल बिक्री?',

    // Quick Actions
    newBill: 'नया बिल बनाएं',
    newBillSub: 'New Quick Bill',
    scanBarcode: 'बारकोड स्कैन',
    scanBarcodeSub: 'Instant Scan & Add',
    live: 'Live',
    showQr: 'दुकान QR दिखाएं',
    addProduct: 'नया सामान जोड़ें',
    dailyReport: 'डेली Z-रिपोर्ट',

    // Sales Summary
    totalCollection: 'आज की कुल बिक्री • TOTAL COLLECTION',
    bills: 'बिल',
    upiShare: 'UPI / QR (73%)',
    cashShare: 'नकद / Cash (27%)',
    transactions: 'ट्रांजैक्शन',
    autoSettles: 'Auto-settles tonight 11:59 PM • SBI A/c ••4291',
    settlement: 'सेटलमेंट',

    // Khata
    pendingKhata: 'बकाया ग्राहक खाता',
    pendingKhataSub: 'Pending Khata Ledger',
    totalDue: 'कुल: ₹18,650',
    due: 'बकाया',
    daysAgo: '2 दिन पहले लिया',
    dueToday: 'आज देय',
    weekLate: '1 हफ्ता लेट',
    remindBtn: 'तकादा',
    reminded: 'भेजा गया',
    viewAllLedger: 'सभी 14 खाते देखें (View All Ledger)',

    // Low Stock
    lowStockTitle: 'कम स्टॉक अलर्ट',
    lowStockSub: 'Smart Low Stock Watch',
    itemsLow: '3 आइटम्स कम',
    packetsLeft: 'पैकेट बचे',
    bottlesLeft: 'बोतल बची',
    bagsLeft: 'बैग बचे',
    minText: 'न्यूनतम',
    supplier: 'सप्लायर',
    orderBtn: 'ऑर्डर',
    orderedBtn: 'ऑर्डर भेजा',

    // Daily Insights
    soldCount: '34 बिके',
    topSellerLabel: 'सबसे ज्यादा बिका सामान',
    topSellerItem: 'अमूल बटर 500g',
    footfallLabel: 'दुकान पर कुल ग्राहक',
    footfallCount: '86 Footfall',

    // Floating Glass Bar
    glassPlaceholder: 'क्या बनाना या जोड़ना चाहते हैं? (बोलें या लिखें...)',
    instantAi: 'Instant AI',
    balanced: 'Balanced',
    posMode: 'POS Mode',
    voiceInput: 'बोलकर कहें',
    submit: 'भेजें',

    // Bottom Nav
    navHome: 'होम',
    navKhata: 'बहीखाता',
    navInventory: 'इन्वेंटरी',
    navSettings: 'सेटिंग्स',

    // QR Modal
    shopQrTitle: 'दुकान UPI QR कोड',
    download: 'डाउनलोड',
    shareQr: 'WhatsApp शेयर',
  },
  en: {
    // Header
    storeName: 'Shree Ganesh Kirana',
    posOnline: 'POS ONLINE',
    dashboard: 'Dashboard',
    mobileView: 'Mobile',
    posView: 'Counter POS',
    account: 'Account',
    
    // Voice Hero Banner
    instantVoicePos: 'Instant AI Voice POS',
    languagesSupported: '8 Languages Supported',
    voiceBillTitle: 'Create Voice Bill',
    voiceBillSub: '/ Voice Bill',
    voicePlaceholder: 'Ex: "Ramesh Kumar 2kg Sugar and add ₹150 Credit"',
    listening: 'Listening... "Ramesh Kumar 2kg Sugar and add ₹150 Credit"',
    promptAtta: '+ 5kg Aashirvaad Atta',
    promptCash: '+ ₹500 Cash Deposit (Suresh)',
    promptSales: "Today's Total Sales?",

    // Quick Actions
    newBill: 'New Quick Bill',
    newBillSub: 'Fast Checkout [F1]',
    scanBarcode: 'Barcode Scanner',
    scanBarcodeSub: 'Instant Scan & Add',
    live: 'Live',
    showQr: 'Show Store QR',
    addProduct: 'Add New Product',
    dailyReport: 'Daily Z-Report',

    // Sales Summary
    totalCollection: "TODAY'S TOTAL COLLECTION",
    bills: 'Bills',
    upiShare: 'UPI / QR (73%)',
    cashShare: 'Cash (27%)',
    transactions: 'Transactions',
    autoSettles: 'Auto-settles tonight 11:59 PM • SBI A/c ••4291',
    settlement: 'Settlement',

    // Khata
    pendingKhata: 'Pending Khata Ledger',
    pendingKhataSub: 'Customer Credit Book',
    totalDue: 'Total: ₹18,650',
    due: 'Due',
    daysAgo: '2 days ago',
    dueToday: 'Due Today',
    weekLate: '1 Week Overdue',
    remindBtn: 'Remind',
    reminded: 'Sent',
    viewAllLedger: 'View All 14 Accounts',

    // Low Stock
    lowStockTitle: 'Low Stock Alerts',
    lowStockSub: 'Smart Inventory Watch',
    itemsLow: '3 Items Low',
    packetsLeft: 'packets left',
    bottlesLeft: 'bottles left',
    bagsLeft: 'bags left',
    minText: 'Min',
    supplier: 'Supplier',
    orderBtn: 'Order',
    orderedBtn: 'Ordered',

    // Daily Insights
    soldCount: '34 Sold',
    topSellerLabel: 'Top Selling Item Today',
    topSellerItem: 'Amul Butter 500g',
    footfallLabel: 'Total Store Footfall',
    footfallCount: '86 Visitors',

    // Floating Glass Bar
    glassPlaceholder: 'What would you like to create or change? (Speak or type...)',
    instantAi: 'Instant AI',
    balanced: 'Balanced',
    posMode: 'POS Mode',
    voiceInput: 'Voice Input',
    submit: 'Submit',

    // Bottom Nav
    navHome: 'Home',
    navKhata: 'Khata',
    navInventory: 'Inventory',
    navSettings: 'Settings',

    // QR Modal
    shopQrTitle: 'Store UPI QR Code',
    download: 'Download',
    shareQr: 'Share WhatsApp',
  }
};
`;
fs.writeFileSync('apps/web/src/i18n/translations.ts', translationsCode, 'utf8');

// 1. Header.tsx
const headerCode = `import React from 'react';
import { Store, ShieldCheck, Languages, User } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface HeaderProps {
  storeName: string;
  isOnline: boolean;
  lang: Lang;
  onToggleLang: () => void;
  systemHealth: string;
  activeView: 'mobile' | 'pos';
  onToggleView: (view: 'mobile' | 'pos') => void;
  onOpenAuth: () => void;
}

export function Header({
  storeName,
  isOnline,
  lang,
  onToggleLang,
  systemHealth,
  activeView,
  onToggleView,
  onOpenAuth,
}: HeaderProps) {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
        {/* Store Title & Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-md shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="font-bold text-base text-slate-900 truncate">
                {lang === 'hi' ? 'श्री गणेश किराना' : storeName}
              </span>
              <span className="inline-flex items-center text-blue-600 shrink-0" title="Verified Merchant">
                <ShieldCheck className="w-4 h-4 fill-blue-100" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">{t.posOnline}</span>
              <span className="text-slate-300">&bull;</span>
              <span className="font-medium text-blue-700 text-[11px] truncate">{t.dashboard}</span>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mobile / Counter POS Switcher */}
          <div className="hidden sm:flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => onToggleView('mobile')}
              className={\`px-3 py-1.5 rounded-md transition-all \${
                activeView === 'mobile' ? 'bg-white text-blue-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              {t.mobileView}
            </button>
            <button
              onClick={() => onToggleView('pos')}
              className={\`px-3 py-1.5 rounded-md transition-all \${
                activeView === 'pos' ? 'bg-white text-blue-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              {t.posView}
            </button>
          </div>

          {/* Language Toggle Button */}
          <button
            onClick={onToggleLang}
            className="h-9 px-3 flex items-center justify-center rounded-lg bg-blue-50/90 border border-blue-200 text-blue-900 text-xs font-bold hover:bg-blue-100 transition-all shadow-sm active:scale-95 cursor-pointer"
            type="button"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
            <span className={lang === 'hi' ? 'text-blue-800 font-extrabold' : 'text-slate-400 font-normal'}>हिन्दी</span>
            <span className="mx-1 text-slate-300">|</span>
            <span className={lang === 'en' ? 'text-blue-800 font-extrabold' : 'text-slate-400 font-normal'}>EN</span>
          </button>

          {/* User Account / Login */}
          <button
            onClick={onOpenAuth}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 transition-colors shadow-sm"
            type="button"
            title="User Profile"
          >
            <User className="w-4 h-4 text-blue-800" />
          </button>
        </div>
      </div>
    </header>
  );
}
`;
fs.writeFileSync('apps/web/src/components/Header.tsx', headerCode, 'utf8');

// 2. VoiceHeroBanner.tsx
const voiceHeroCode = `import React, { useState } from 'react';
import { Zap, Globe, Mic } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface VoiceHeroBannerProps {
  lang: Lang;
  onCommandTrigger?: (cmd: string) => void;
}

export function VoiceHeroBanner({ lang, onCommandTrigger }: VoiceHeroBannerProps) {
  const t = translations[lang];
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  const quickPrompts = [t.promptAtta, t.promptCash, t.promptSales];

  const handleMicClick = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscribedText(t.listening);
    } else {
      setTranscribedText('');
    }
  };

  const handleChipClick = (prompt: string) => {
    setTranscribedText(prompt);
    if (onCommandTrigger) onCommandTrigger(prompt);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-700 text-white p-5 shadow-lg border border-blue-500/20">
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>
      <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-blue-300/15 blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col space-y-4">
        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold tracking-wide border border-white/20 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{t.instantVoicePos}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-blue-100 text-xs font-medium border border-white/10">
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.languagesSupported}</span>
          </span>
        </div>

        {/* Main Trigger & Mic Area */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight text-white flex items-center gap-2 flex-wrap">
              <span>{t.voiceBillTitle}</span>
              <span className="text-emerald-300 text-lg font-bold">{t.voiceBillSub}</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 font-medium">
              {transcribedText ? (
                <span className="text-amber-200 font-semibold animate-pulse">{transcribedText}</span>
              ) : (
                t.voicePlaceholder
              )}
            </p>
          </div>

          {/* Voice Mic Button */}
          <button
            onClick={handleMicClick}
            aria-label="Activate Voice Assistant"
            className={\`relative group shrink-0 w-14 h-14 rounded-full bg-white text-blue-900 flex items-center justify-center shadow-xl active:scale-95 transition-all \${
              isListening ? 'ring-4 ring-emerald-400 bg-emerald-50' : 'hover:scale-105'
            }\`}
            type="button"
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-30"></span>
            )}
            <Mic className={\`w-7 h-7 \${isListening ? 'text-emerald-600 animate-bounce' : 'text-blue-800'}\`} />
            
            <span className="absolute -bottom-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] shadow-sm">
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-75"></span>
              <span className="w-1 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
            </span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/10 text-white text-xs font-semibold backdrop-blur-sm transition-all active:scale-95 shadow-sm"
              type="button"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/VoiceHeroBanner.tsx', voiceHeroCode, 'utf8');

// 3. QuickActionTiles.tsx
const actionTilesCode = `import React from 'react';
import { Receipt, QrCode, PlusCircle, FileSpreadsheet } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface QuickActionTilesProps {
  lang: Lang;
  onNewBill: () => void;
  onScanBarcode: () => void;
  onShowQr: () => void;
  onAddProduct: () => void;
  onDailyReport: () => void;
}

export function QuickActionTiles({
  lang,
  onNewBill,
  onScanBarcode,
  onShowQr,
  onAddProduct,
  onDailyReport,
}: QuickActionTilesProps) {
  const t = translations[lang];

  return (
    <section className="flex flex-col space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {/* Quick Bill Card */}
        <button
          onClick={onNewBill}
          className="flex flex-col justify-between p-4 h-28 rounded-2xl bg-blue-900 text-white shadow-md hover:bg-blue-800 active:scale-[0.98] transition-all text-left group relative overflow-hidden"
          type="button"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5 text-white" />
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-xs font-bold font-mono">F1</span>
          </div>
          <div>
            <div className="text-base font-bold leading-tight">{t.newBill}</div>
            <div className="text-xs text-blue-200 font-medium">{t.newBillSub}</div>
          </div>
        </button>

        {/* Scan Barcode Card */}
        <button
          onClick={onScanBarcode}
          className="flex flex-col justify-between p-4 h-28 rounded-2xl bg-white border border-slate-200/90 text-slate-900 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all text-left group"
          type="button"
        >
          <div className="flex items-center justify-between w-full">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
              <QrCode className="w-5 h-5" />
            </div>
            <span className="inline-flex items-center gap-1 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              {t.live}
            </span>
          </div>
          <div>
            <div className="text-base font-bold leading-tight text-slate-900">{t.scanBarcode}</div>
            <div className="text-xs text-slate-500 font-medium">{t.scanBarcodeSub}</div>
          </div>
        </button>
      </div>

      {/* Secondary Counter Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <button
          onClick={onShowQr}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <QrCode className="w-4 h-4 text-blue-600" />
          <span>{t.showQr}</span>
        </button>

        <button
          onClick={onAddProduct}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>{t.addProduct}</span>
        </button>

        <button
          onClick={onDailyReport}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>{t.dailyReport}</span>
        </button>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/QuickActionTiles.tsx', actionTilesCode, 'utf8');

// 4. SalesSummaryCard.tsx
const salesSummaryCode = `import React from 'react';
import { TrendingUp, Landmark, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface SalesSummaryCardProps {
  lang: Lang;
}

export function SalesSummaryCard({ lang }: SalesSummaryCardProps) {
  const t = translations[lang];

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            {t.totalCollection}
          </span>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">₹8,450.00</span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
              <TrendingUp className="w-3.5 h-3.5" />
              +14%
            </span>
          </div>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shadow-sm">
          <Landmark className="w-5 h-5" />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-[#eff4ff] border border-blue-100/60 flex items-center justify-between gap-4">
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#dce9ff" strokeWidth="4.2"></circle>
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#00563a" strokeDasharray="27 73" strokeDashoffset="0" strokeWidth="4.2"></circle>
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#0051d5" strokeDasharray="73 27" strokeDashoffset="-27" strokeLinecap="round" strokeWidth="4.2"></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-extrabold text-slate-900 leading-none">60</span>
            <span className="text-[9px] font-bold text-slate-500 leading-none mt-0.5">{t.bills}</span>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-slate-600">{t.upiShare}</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">₹6,200</div>
            <span className="text-[11px] text-slate-500 font-medium">42 {t.transactions}</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              <span className="text-xs font-bold text-slate-600">{t.cashShare}</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">₹2,250</div>
            <span className="text-[11px] text-slate-500 font-medium">18 {t.transactions}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 truncate font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">{t.autoSettles}</span>
        </div>
        <button className="shrink-0 text-blue-700 font-bold hover:underline flex items-center gap-0.5" type="button">
          <span>{t.settlement}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/SalesSummaryCard.tsx', salesSummaryCode, 'utf8');

// 5. KhataSummaryCard.tsx
const khataSummaryCode = `import React, { useState } from 'react';
import { BookOpen, Send, ArrowRight, Check } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface KhataSummaryCardProps {
  lang: Lang;
}

export function KhataSummaryCard({ lang }: KhataSummaryCardProps) {
  const t = translations[lang];
  const [remindedList, setRemindedList] = useState<number[]>([]);

  const khataRows = [
    {
      id: 1,
      initials: 'RK',
      colorClass: 'bg-blue-100 text-blue-800',
      name: lang === 'hi' ? 'रमेश कुमार (Ramesh)' : 'Ramesh Kumar',
      amount: '₹1,450',
      status: t.daysAgo,
      statusClass: 'text-slate-500',
      phone: '9876543210',
    },
    {
      id: 2,
      initials: 'SV',
      colorClass: 'bg-emerald-100 text-emerald-800',
      name: lang === 'hi' ? 'सुनीता वर्मा (Sunita V.)' : 'Sunita Verma',
      amount: '₹820',
      status: t.dueToday,
      statusClass: 'text-amber-700 font-semibold',
      phone: '9876543211',
    },
    {
      id: 3,
      initials: 'MK',
      colorClass: 'bg-indigo-100 text-indigo-800',
      name: lang === 'hi' ? 'महेंद्र किराना (B2B)' : 'Mahendra Kirana (B2B)',
      amount: '₹3,100',
      status: t.weekLate,
      statusClass: 'text-rose-600 font-semibold',
      phone: '9876543212',
    },
  ];

  const handleSendReminder = (id: number, name: string, amount: string) => {
    setRemindedList((prev) => [...prev, id]);
    alert(\`WhatsApp reminder sent to: \${name} (\${amount})\`);
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">{t.pendingKhata}</h3>
            <span className="text-xs text-slate-500 font-medium">{t.pendingKhataSub}</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
          {t.totalDue}
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {khataRows.map((row) => {
          const isReminded = remindedList.includes(row.id);
          return (
            <div
              key={row.id}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={\`w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold shrink-0 \${row.colorClass}\`}
                >
                  {row.initials}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">{row.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="text-rose-600 font-bold">{row.amount} {t.due}</span>
                    <span>&bull;</span>
                    <span className={row.statusClass}>{row.status}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSendReminder(row.id, row.name, row.amount)}
                className={\`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 \${
                  isReminded
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-white border border-slate-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-200 active:scale-95'
                }\`}
                type="button"
              >
                {isReminded ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.reminded}</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.remindBtn}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <button
        className="w-full h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors active:scale-98"
        type="button"
      >
        <span>{t.viewAllLedger}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/KhataSummaryCard.tsx', khataSummaryCode, 'utf8');

// 6. LowStockAlerts.tsx
const lowStockCode = `import React, { useState } from 'react';
import { AlertTriangle, Truck, Check } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface LowStockAlertsProps {
  lang: Lang;
}

export function LowStockAlerts({ lang }: LowStockAlertsProps) {
  const t = translations[lang];
  const [orderedItems, setOrderedItems] = useState<number[]>([]);

  const stockAlerts = [
    {
      id: 1,
      title: lang === 'hi' ? 'टाटा नमक (Tata Salt 1kg)' : 'Tata Salt 1kg',
      remaining: \`4 \${t.packetsLeft}\`,
      minThreshold: \`(\${t.minText} 25)\`,
      supplier: \`\${t.supplier}: \${lang === 'hi' ? 'बालाजी एजेंसीज़' : 'Balaji Agencies'}\`,
      orderQty: \`50 \${t.packetsLeft} \${t.orderBtn}\`,
    },
    {
      id: 2,
      title: lang === 'hi' ? 'फॉर्च्यून सनफ्लावर ऑयल 1L' : 'Fortune Sunflower Oil 1L',
      remaining: \`2 \${t.bottlesLeft}\`,
      minThreshold: \`(\${t.minText} 12)\`,
      supplier: \`\${t.supplier}: \${lang === 'hi' ? 'मेट्रो होलसेल' : 'Metro Wholesale'}\`,
      orderQty: \`24 \${t.bottlesLeft} \${t.orderBtn}\`,
    },
    {
      id: 3,
      title: lang === 'hi' ? 'आशीर्वाद चक्की आटा 5kg' : 'Aashirvaad Chakki Atta 5kg',
      remaining: \`3 \${t.bagsLeft}\`,
      minThreshold: \`(\${t.minText} 15)\`,
      supplier: \`\${t.supplier}: \${lang === 'hi' ? 'आईटीसी डायरेक्ट' : 'ITC Direct'}\`,
      orderQty: \`20 \${t.bagsLeft} \${t.orderBtn}\`,
    },
  ];

  const handleOrder = (id: number, title: string, qty: string) => {
    setOrderedItems((prev) => [...prev, id]);
    alert(\`Order sent to supplier: \${title} (\${qty})\`);
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">{t.lowStockTitle}</h3>
            <span className="text-xs text-slate-500 font-medium">{t.lowStockSub}</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
          {t.itemsLow}
        </span>
      </div>

      <div className="space-y-2.5 pt-1">
        {stockAlerts.map((item) => {
          const isOrdered = orderedItems.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 truncate">{item.title}</div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="text-rose-600 font-bold">{item.remaining}</span>
                  <span>{item.minThreshold}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                  {item.supplier}
                </span>
              </div>

              <button
                onClick={() => handleOrder(item.id, item.title, item.orderQty)}
                className={\`h-9 px-3.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 \${
                  isOrdered
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-blue-900 hover:bg-blue-800 text-white active:scale-95'
                }\`}
                type="button"
              >
                {isOrdered ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{t.orderedBtn}</span>
                  </>
                ) : (
                  <>
                    <Truck className="w-3.5 h-3.5" />
                    <span>{item.orderQty}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/LowStockAlerts.tsx', lowStockCode, 'utf8');

// 7. DailyInsightsStrip.tsx
const dailyInsightsCode = `import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface DailyInsightsStripProps {
  lang: Lang;
}

export function DailyInsightsStrip({ lang }: DailyInsightsStripProps) {
  const t = translations[lang];

  return (
    <section className="grid grid-cols-2 gap-3">
      {/* Top Seller Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Award className="w-4 h-4" />
          </span>
          <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            {t.soldCount}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 block">{t.topSellerLabel}</span>
          <span className="text-sm font-extrabold text-slate-900 truncate block mt-0.5">{t.topSellerItem}</span>
        </div>
      </div>

      {/* Footfall Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
            <Users className="w-4 h-4" />
          </span>
          <span className="inline-flex items-center gap-0.5 text-emerald-700 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <TrendingUp className="w-3.5 h-3.5" />
            +8
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 block">{t.footfallLabel}</span>
          <span className="text-sm font-extrabold text-slate-900 block mt-0.5">{t.footfallCount}</span>
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/DailyInsightsStrip.tsx', dailyInsightsCode, 'utf8');

// 8. FloatingGlassBar.tsx
const floatingGlassCode = `import React, { useState } from 'react';
import { Plus, Slash, Sparkles, Mic, ArrowUp, ChevronDown, Check } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface FloatingGlassBarProps {
  lang: Lang;
  onSubmitPrompt?: (prompt: string) => void;
  onQuickAdd?: () => void;
}

export function FloatingGlassBar({ lang, onSubmitPrompt, onQuickAdd }: FloatingGlassBarProps) {
  const t = translations[lang];
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'instant' | 'balanced' | 'pos'>('instant');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    if (onSubmitPrompt) onSubmitPrompt(inputVal);
    alert(\`Command processed: "\${inputVal}"\`);
    setInputVal('');
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setInputVal(t.voicePlaceholder);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-40 px-4 max-w-2xl mx-auto pointer-events-none">
      <div className="pointer-events-auto backdrop-blur-2xl bg-slate-950/85 text-white border border-white/20 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] p-3 transition-all duration-300 ring-1 ring-white/10 hover:border-white/30">
        
        {/* Top Input Area */}
        <form onSubmit={handleSubmit} className="flex items-center w-full px-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.glassPlaceholder}
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-none py-1"
          />
        </form>

        {/* Action Controls Toolbar inside the Glass Pill */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onQuickAdd}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
              title={t.addProduct}
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setInputVal('/')}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 active:scale-90 transition-all font-mono font-bold"
              title="Slash Command"
            >
              /
            </button>
          </div>

          <div className="flex items-center gap-2 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 flex items-center gap-1.5 text-xs font-semibold text-white transition-all"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>{selectedMode === 'instant' ? t.instantAi : selectedMode === 'balanced' ? t.balanced : t.posMode}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {showModeDropdown && (
                <div className="absolute bottom-10 right-0 w-36 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-1 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('instant'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>{t.instantAi}</span>
                    {selectedMode === 'instant' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('balanced'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>{t.balanced}</span>
                    {selectedMode === 'balanced' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('pos'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>{t.posMode}</span>
                    {selectedMode === 'pos' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={handleMicToggle}
              className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 \${
                isListening
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/15'
              }\`}
              title={t.voiceInput}
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!inputVal.trim()}
              className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all \${
                inputVal.trim()
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold active:scale-90 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }\`}
              title={t.submit}
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('apps/web/src/components/FloatingGlassBar.tsx', floatingGlassCode, 'utf8');

// 9. BottomNavBar.tsx
const bottomNavCode = `import React from 'react';
import { Store, BookOpen, Package, Settings } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface BottomNavBarProps {
  lang: Lang;
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function BottomNavBar({ lang, activeTab, onSelectTab }: BottomNavBarProps) {
  const t = translations[lang];

  const tabs = [
    { id: 'home', label: t.navHome, icon: Store },
    { id: 'khata', label: t.navKhata, icon: BookOpen, badge: '4' },
    { id: 'inventory', label: t.navInventory, icon: Package },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(11,28,48,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={\`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 px-2 transition-all relative group \${
                isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }\`}
              type="button"
            >
              <div className="relative flex items-center justify-center">
                <Icon className={\`w-5 h-5 \${isActive ? 'text-blue-700 scale-110' : 'group-hover:scale-105'} transition-transform\`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] leading-4 flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-semibold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
`;
fs.writeFileSync('apps/web/src/components/BottomNavBar.tsx', bottomNavCode, 'utf8');

// 10. QrModal.tsx
const qrModalCode = `import React from 'react';
import { X, QrCode, Download, Share2 } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface QrModalProps {
  lang: Lang;
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  upiId: string;
}

export function QrModal({ lang, isOpen, onClose, shopName, upiId }: QrModalProps) {
  const t = translations[lang];
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

        <h3 className="text-lg font-bold text-slate-900">{t.shopQrTitle}</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{shopName}</p>

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
            onClick={() => alert('Downloading QR...')}
            className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>{t.download}</span>
          </button>
          <button
            onClick={() => alert('Sharing QR...')}
            className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.shareQr}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('apps/web/src/components/QrModal.tsx', qrModalCode, 'utf8');

// 11. App.tsx
const appCode = `import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceHeroBanner } from './components/VoiceHeroBanner';
import { QuickActionTiles } from './components/QuickActionTiles';
import { SalesSummaryCard } from './components/SalesSummaryCard';
import { KhataSummaryCard } from './components/KhataSummaryCard';
import { LowStockAlerts } from './components/LowStockAlerts';
import { DailyInsightsStrip } from './components/DailyInsightsStrip';
import { FloatingGlassBar } from './components/FloatingGlassBar';
import { BottomNavBar } from './components/BottomNavBar';
import { QrModal } from './components/QrModal';
import { PosBillingView } from './components/PosBillingView';
import { InventoryView } from './components/InventoryView';
import { AuthModal } from './components/AuthModal';
import { checkHealth } from './services/api';
import { Lang } from './i18n/translations';

export function App() {
  const [lang, setLang] = useState<Lang>('hi');
  const [activeView, setActiveView] = useState<'mobile' | 'pos'>('mobile');
  const [activeTab, setActiveTab] = useState('home');
  const [systemHealth, setSystemHealth] = useState('Checking...');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    name: 'Ramesh Ganesh',
    shopName: 'Shree Ganesh Kirana',
    phone: '9876543210',
    upiId: 'shreeganesh@sbi',
  });

  useEffect(() => {
    async function loadHealth() {
      const res = await checkHealth();
      if (res.success && res.data) {
        setSystemHealth(\`Online (v\${res.data.version})\`);
      } else {
        setSystemHealth('Online (Local Engine)');
      }
    }
    loadHealth();
  }, []);

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hi' ? 'en' : 'hi'));
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans pb-36 md:pb-24">
      {/* Top Universal Header */}
      <Header
        storeName={currentUser?.shopName || 'Shree Ganesh Kirana'}
        isOnline={true}
        lang={lang}
        onToggleLang={toggleLanguage}
        systemHealth={systemHealth}
        activeView={activeView}
        onToggleView={setActiveView}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Workspace */}
      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 py-4 w-full flex-1">
        {activeTab === 'inventory' ? (
          <InventoryView />
        ) : activeTab === 'khata' ? (
          <div className="space-y-4">
            <KhataSummaryCard lang={lang} />
          </div>
        ) : activeView === 'pos' ? (
          <PosBillingView />
        ) : (
          <div className="space-y-4">
            {/* 1. Voice AI POS Hero Banner */}
            <VoiceHeroBanner lang={lang} onCommandTrigger={(cmd) => console.log('Voice Command:', cmd)} />

            {/* 2. Dual Primary Fast Counter POS Actions & Shortcuts */}
            <QuickActionTiles
              lang={lang}
              onNewBill={() => setActiveView('pos')}
              onScanBarcode={() => alert(lang === 'hi' ? 'बारकोड कैमरा स्कैन शुरू किया गया' : 'Barcode scanner camera activated')}
              onShowQr={() => setIsQrOpen(true)}
              onAddProduct={() => setActiveTab('inventory')}
              onDailyReport={() => alert(lang === 'hi' ? 'डेली Z-रिपोर्ट: आज की कुल सेल ₹8,450 | 60 ट्रांजैक्शन' : 'Daily Z-Report: Today\\'s Total Sale ₹8,450 | 60 Transactions')}
            />

            {/* 3. Financial Overview: Today's Collection Card */}
            <SalesSummaryCard lang={lang} />

            {/* 4. Khata Credit Ledger Widget */}
            <KhataSummaryCard lang={lang} />

            {/* 5. Low Stock Watch */}
            <LowStockAlerts lang={lang} />

            {/* 6. Daily Kirana Insights Strip */}
            <DailyInsightsStrip lang={lang} />
          </div>
        )}
      </main>

      {/* Modern Frosted Translucent Glassmorphism Floating Action Bar */}
      <FloatingGlassBar
        lang={lang}
        onQuickAdd={() => setActiveTab('inventory')}
        onSubmitPrompt={(prompt) => console.log('Floating prompt:', prompt)}
      />

      {/* Docked Bottom Navigation Bar */}
      <BottomNavBar
        lang={lang}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') setActiveView('mobile');
        }}
      />

      {/* QR Code Modal */}
      <QrModal
        lang={lang}
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        shopName={currentUser?.shopName || 'Shree Ganesh Kirana'}
        upiId={currentUser?.upiId || 'shreeganesh@sbi'}
      />

      {/* Authentication & PIN Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(data) => {
          setCurrentUser({
            name: data.user.name,
            shopName: data.shop?.name || 'Shree Ganesh Kirana',
            phone: data.user.phone,
            upiId: 'shreeganesh@sbi',
          });
        }}
      />
    </div>
  );
}
`;
fs.writeFileSync('apps/web/src/App.tsx', appCode, 'utf8');

console.log('--- ALL COMPONENTS FULLY INTEGRATED WITH DYNAMIC HINDI / ENGLISH TOGGLE ---');