const fs = require('fs');
const path = require('path');

console.log('--- Generating Stitch Kirana UI with Transparent Floating Glass Bar ---');

// 1. apps/web/index.html
const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230051d5'><path d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>DukaanPilot &bull; AI Local Business Operating System</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#f8f9ff] text-[#0b1c30] antialiased selection:bg-blue-100 selection:text-blue-900 font-sans">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
fs.writeFileSync('apps/web/index.html', indexHtml, 'utf8');

// 2. apps/web/tailwind.config.js
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00288e',
        'primary-container': '#1e40af',
        'on-primary': '#ffffff',
        'on-primary-container': '#a8b8ff',
        'secondary': '#0051d5',
        'secondary-container': '#316bf3',
        'tertiary': '#003d28',
        'tertiary-container': '#00563a',
        'tertiary-fixed': '#85f8c4',
        'tertiary-fixed-dim': '#68dba9',
        'on-tertiary': '#ffffff',
        'surface': '#f8f9ff',
        'surface-bright': '#f8f9ff',
        'surface-dim': '#cbdbf5',
        'surface-variant': '#d3e4fe',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#eff4ff',
        'surface-container': '#e5eeff',
        'surface-container-high': '#dce9ff',
        'surface-container-highest': '#d3e4fe',
        'on-surface': '#0b1c30',
        'on-surface-variant': '#444653',
        'outline': '#757684',
        'outline-variant': '#c4c5d5',
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',
        'on-error': '#ffffff',
      },
      fontFamily: {
        sans: ['Noto Sans', 'Plus Jakarta Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Noto Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
};`;
fs.writeFileSync('apps/web/tailwind.config.js', tailwindConfig, 'utf8');

// 3. apps/web/src/components/Header.tsx
const headerCode = `import React from 'react';
import { Store, ShieldCheck, Languages, User } from 'lucide-react';

interface HeaderProps {
  storeName: string;
  isOnline: boolean;
  lang: 'hi' | 'en';
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
              <span className="font-bold text-base text-slate-900 truncate">{storeName}</span>
              <span className="inline-flex items-center text-blue-600 shrink-0" title="Verified Merchant">
                <ShieldCheck className="w-4 h-4 fill-blue-100" />
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">POS Online</span>
              <span className="text-slate-300">&bull;</span>
              <span className="font-medium text-blue-700 text-[11px] truncate">{systemHealth}</span>
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
              \\u092e\\u094b\\u092c\\u093e\\u0907\\u0932 (Mobile)
            </button>
            <button
              onClick={() => onToggleView('pos')}
              className={\`px-3 py-1.5 rounded-md transition-all \${
                activeView === 'pos' ? 'bg-white text-blue-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }\`}
            >
              \\u0915\\u093e\\u0909\\u0902\\u091f\\u0930 POS
            </button>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="h-9 px-2.5 flex items-center justify-center rounded-lg bg-blue-50/80 border border-blue-100 text-blue-900 text-xs font-bold hover:bg-blue-100 transition-colors"
            type="button"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 mr-1 text-blue-700" />
            <span>{lang === 'hi' ? '\\u0939\\u093f\\u0928\\u094d\\u0926\\u0940' : 'EN'}</span>
            <span className="mx-1 text-slate-300">|</span>
            <span className="text-slate-400 font-normal">{lang === 'hi' ? 'EN' : '\\u0939\\u093f\\u0928\\u094d\\u0926\\u0940'}</span>
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

// 4. apps/web/src/components/VoiceHeroBanner.tsx
const voiceHeroCode = `import React, { useState } from 'react';
import { Zap, Globe, Mic } from 'lucide-react';

interface VoiceHeroBannerProps {
  onCommandTrigger?: (cmd: string) => void;
}

export function VoiceHeroBanner({ onCommandTrigger }: VoiceHeroBannerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  const quickPrompts = [
    '+ 5kg \\u0906\\u0936\\u0940\\u0930\\u094d\\u0935\\u093e\\u0926 \\u0906\\u091f\\u093e',
    '+ \\u20B9500 \\u0928\\u0915\\u0926 \\u091c\\u092e\\u093e (\\u0938\\u0941\\u0930\\u0947\\u0936)',
    '\\u0906\\u091c \\u0915\\u0940 \\u0915\\u0941\\u0932 \\u092c\\u093f\\u0915\\u094d\\u0930\\u0940?',
  ];

  const handleMicClick = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscribedText('\\u0938\\u0941\\u0928 \\u0930\\u0939\\u093e \\u0939\\u0942\\u0902... "\\u0930\\u092e\\u0947\\u0936 \\u0915\\u0941\\u092e\\u093e\\u0930 2 \\u0915\\u093f\\u0932\\u094b \\u091a\\u0940\\u0928\\u0940 \\u0914\\u0930 \\u20B9150 \\u0909\\u0927\\u093e\\u0930 \\u091c\\u094b\\u0921\\u093c\\u094b"');
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
      {/* Subtle Background Glow */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>
      <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-blue-300/15 blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col space-y-4">
        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold tracking-wide border border-white/20 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Instant AI Voice POS</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-blue-100 text-xs font-medium border border-white/10">
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>8 \\u092d\\u093e\\u0937\\u093e\\u090f\\u0901 \\u0938\\u092e\\u0930\\u094d\\u0925\\u093f\\u0924</span>
          </span>
        </div>

        {/* Main Trigger & Mic Area */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight text-white flex items-center gap-2 flex-wrap">
              <span>\\u092c\\u094b\\u0932\\u0915\\u0930 \\u092c\\u093f\\u0932 \\u092c\\u0928\\u093e\\u090f\\u0901</span>
              <span className="text-emerald-300 text-lg font-bold">/ Voice Bill</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 font-medium">
              {transcribedText ? (
                <span className="text-amber-200 font-semibold animate-pulse">{transcribedText}</span>
              ) : (
                '\\u0909\\u0926\\u093e: "\\u0930\\u092e\\u0947\\u0936 \\u0915\\u0941\\u092e\\u093e\\u0930 2 \\u0915\\u093f\\u0932\\u094b \\u091a\\u0940\\u0928\\u0940 \\u0914\\u0930 \\u20B9150 \\u0909\\u0927\\u093e\\u0930 \\u091c\\u094b\\u0921\\u093c\\u094b"'
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
            
            {/* Soundwave Indicator */}
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

// 5. apps/web/src/components/QuickActionTiles.tsx
const actionTilesCode = `import React from 'react';
import { Receipt, QrCode, PlusCircle, FileSpreadsheet } from 'lucide-react';

interface QuickActionTilesProps {
  onNewBill: () => void;
  onScanBarcode: () => void;
  onShowQr: () => void;
  onAddProduct: () => void;
  onDailyReport: () => void;
}

export function QuickActionTiles({
  onNewBill,
  onScanBarcode,
  onShowQr,
  onAddProduct,
  onDailyReport,
}: QuickActionTilesProps) {
  return (
    <section className="flex flex-col space-y-3">
      {/* 2 Primary Action Cards */}
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
            <div className="text-base font-bold leading-tight">\\u0928\\u092f\\u093e \\u092c\\u093f\\u0932 \\u092c\\u0928\\u093e\\u090f\\u0901</div>
            <div className="text-xs text-blue-200 font-medium">New Quick Bill</div>
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
              Live
            </span>
          </div>
          <div>
            <div className="text-base font-bold leading-tight text-slate-900">\\u092c\\u093e\\u0930\\u0915\\u094b\\u0921 \\u0938\\u094d\\u0915\\u0948\\u0928</div>
            <div className="text-xs text-slate-500 font-medium">Instant Scan &amp; Add</div>
          </div>
        </button>
      </div>

      {/* Secondary Counter Shortcuts Carousel */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
        <button
          onClick={onShowQr}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <QrCode className="w-4 h-4 text-blue-600" />
          <span>\\u0926\\u0941\\u0915\\u093e\\u0928 QR \\u0926\\u093f\\u0916\\u093e\\u090f\\u0901</span>
        </button>

        <button
          onClick={onAddProduct}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <PlusCircle className="w-4 h-4 text-emerald-600" />
          <span>\\u0928\\u092f\\u093e \\u0938\\u093e\\u092e\\u093e\\u0928 \\u091c\\u094b\\u0921\\u093c\\u0947\\u0902</span>
        </button>

        <button
          onClick={onDailyReport}
          className="h-11 px-4 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 shrink-0 shadow-sm hover:bg-slate-50 transition-colors active:scale-95"
          type="button"
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>\\u0921\\u0947\\u0932\\u0940 Z-\\u0930\\u093f\\u092a\\u094b\\u0930\\u094d\\u091f</span>
        </button>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/QuickActionTiles.tsx', actionTilesCode, 'utf8');

// 6. apps/web/src/components/SalesSummaryCard.tsx
const salesSummaryCode = `import React from 'react';
import { TrendingUp, Landmark, ArrowUpRight, CheckCircle2 } from 'lucide-react';

export function SalesSummaryCard() {
  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      {/* Header with Growth Pill */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            \\u0906\\u091c \\u0915\\u0940 \\u0915\\u0941\\u0932 \\u092c\\u093f\\u0915\\u094d\\u0930\\u0940 &bull; TOTAL COLLECTION
          </span>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">\\u20B98,450.00</span>
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

      {/* Collection Breakdown Matrix with SVG Gauge */}
      <div className="p-4 rounded-xl bg-[#eff4ff] border border-blue-100/60 flex items-center justify-between gap-4">
        {/* SVG Donut Chart */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#dce9ff" strokeWidth="4.2"></circle>
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#00563a" strokeDasharray="27 73" strokeDashoffset="0" strokeWidth="4.2"></circle>
            <circle cx="20" cy="20" fill="none" r="15.9" stroke="#0051d5" strokeDasharray="73 27" strokeDashoffset="-27" strokeLinecap="round" strokeWidth="4.2"></circle>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs font-extrabold text-slate-900 leading-none">60</span>
            <span className="text-[9px] font-bold text-slate-500 leading-none mt-0.5">\\u092c\\u093f\\u0932</span>
          </div>
        </div>

        {/* Breakdown Stats */}
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              <span className="text-xs font-bold text-slate-600">UPI / QR (73%)</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">\\u20B96,200</div>
            <span className="text-[11px] text-slate-500 font-medium">42 \\u091f\\u094d\\u0930\\u093e\\u0902\\u091c\\u0948\\u0915\\u094d\\u0936\\u0928</span>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
              <span className="text-xs font-bold text-slate-600">\\u0928\\u0915\\u0926 / Cash (27%)</span>
            </div>
            <div className="text-base font-extrabold text-slate-900">\\u20B92,250</div>
            <span className="text-[11px] text-slate-500 font-medium">18 \\u091f\\u094d\\u0930\\u093e\\u0902\\u091c\\u0948\\u0915\\u094d\\u0936\\u0928</span>
          </div>
        </div>
      </div>

      {/* Auto Settlement Banner */}
      <div className="flex items-center justify-between pt-1 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 truncate font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">Auto-settles tonight 11:59 PM &bull; SBI A/c &bull;&bull;4291</span>
        </div>
        <button className="shrink-0 text-blue-700 font-bold hover:underline flex items-center gap-0.5" type="button">
          <span>\\u0938\\u0947\\u091f\\u0932\\u092e\\u0947\\u0902\\u091f</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/SalesSummaryCard.tsx', salesSummaryCode, 'utf8');

// 7. apps/web/src/components/KhataSummaryCard.tsx
const khataSummaryCode = `import React, { useState } from 'react';
import { BookOpen, Send, ArrowRight, Check } from 'lucide-react';

export function KhataSummaryCard() {
  const [remindedList, setRemindedList] = useState<number[]>([]);

  const khataRows = [
    {
      id: 1,
      initials: 'RK',
      colorClass: 'bg-blue-100 text-blue-800',
      name: '\\u0930\\u092e\\u0947\\u0936 \\u0915\\u0941\\u092e\\u093e\\u0930 (Ramesh)',
      amount: '\\u20B91,450',
      status: '2 \\u0926\\u093f\\u0928 \\u092a\\u0939\\u0932\\u0947 \\u0932\\u093f\\u092f\\u093e',
      statusClass: 'text-slate-500',
      phone: '9876543210',
    },
    {
      id: 2,
      initials: 'SV',
      colorClass: 'bg-emerald-100 text-emerald-800',
      name: '\\u0938\\u0941\\u0928\\u0940\\u0924\\u093e \\u0935\\u0930\\u094d\\u092e\\u093e (Sunita V.)',
      amount: '\\u20B9820',
      status: '\\u0906\\u091c \\u0926\\u0947\\u092f',
      statusClass: 'text-amber-700 font-semibold',
      phone: '9876543211',
    },
    {
      id: 3,
      initials: 'MK',
      colorClass: 'bg-indigo-100 text-indigo-800',
      name: '\\u092e\\u0939\\u0947\\u0902\\u0926\\u094d\\u0930 \\u0915\\u093f\\u0930\\u093e\\u0928\\u093e (B2B)',
      amount: '\\u20B93,100',
      status: '1 \\u0939\\u092b\\u094d\\u0924\\u093e \\u0932\\u0947\\u091f',
      statusClass: 'text-rose-600 font-semibold',
      phone: '9876543212',
    },
  ];

  const handleSendReminder = (id: number, name: string, amount: string) => {
    setRemindedList((prev) => [...prev, id]);
    alert(\`\\u0935\\u094d\\u0939\\u093e\\u091f\\u094d\\u0938\\u090f\\u092a \\u0924\\u0915\\u093e\\u0926\\u093e \\u092d\\u0947\\u091c \\u0926\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e: \${name} (\${amount})\`);
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">\\u092c\\u0915\\u093e\\u092f\\u093e \\u0917\\u094d\\u0930\\u093e\\u0939\\u0915 \\u0916\\u093e\\u0924\\u093e</h3>
            <span className="text-xs text-slate-500 font-medium">Pending Khata Ledger</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
          \\u0915\\u0941\\u0932: \\u20B918,650
        </span>
      </div>

      {/* Customer Rows List */}
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
                    <span className="text-rose-600 font-bold">{row.amount} \\u092c\\u0915\\u093e\\u092f\\u093e</span>
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
                    <span>\\u092d\\u0947\\u091c\\u093e \\u0917\\u092f\\u093e</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-emerald-600" />
                    <span>\\u0924\\u0915\\u093e\\u0926\\u093e</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* View All CTA */}
      <button
        className="w-full h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-blue-100 transition-colors active:scale-98"
        type="button"
      >
        <span>\\u0938\\u092d\\u0940 14 \\u0916\\u093e\\u0924\\u0947 \\u0926\\u0947\\u0916\\u0947\\u0902 (View All Ledger)</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/KhataSummaryCard.tsx', khataSummaryCode, 'utf8');

// 8. apps/web/src/components/LowStockAlerts.tsx
const lowStockCode = `import React, { useState } from 'react';
import { AlertTriangle, Truck, Check } from 'lucide-react';

export function LowStockAlerts() {
  const [orderedItems, setOrderedItems] = useState<number[]>([]);

  const stockAlerts = [
    {
      id: 1,
      title: '\\u091f\\u093e\\u091f\\u093e \\u0928\\u092e\\u0915 (Tata Salt 1kg)',
      remaining: '4 \\u092a\\u0948\\u0915\\u0947\\u091f \\u092c\\u091a\\u0947',
      minThreshold: '(\\u0928\\u094d\\u092f\\u0942\\u0928\\u0924\\u092e 25)',
      supplier: '\\u0938\\u092a\\u094d\\u0932\\u093e\\u092f\\u0930: \\u092c\\u093e\\u0932\\u093e\\u091c\\u0940 \\u090f\\u091c\\u0947\\u0902\\u0938\\u0940\\u091c\\u093c',
      orderQty: '50 \\u092a\\u0948\\u0915\\u0947\\u091f \\u0911\\u0930\\u094d\\u0921\\u0930',
    },
    {
      id: 2,
      title: '\\u092b\\u0949\\u0930\\u094d\\u091a\\u094d\\u092f\\u0942\\u0928 \\u0938\\u0928\\u092b\\u094d\\u0932\\u093e\\u0935\\u0930 \\u0911\\u092f\\u0932 1L',
      remaining: '2 \\u092c\\u094b\\u0924\\u0932 \\u092c\\u091a\\u0940',
      minThreshold: '(\\u0928\\u094d\\u092f\\u0942\\u0928\\u0924\\u092e 12)',
      supplier: '\\u0938\\u092a\\u094d\\u0932\\u093e\\u092f\\u0930: \\u092e\\u0947\\u091f\\u094d\\u0930\\u094b \\u0939\\u094b\\u0932\\u0938\\u0947\\u0932',
      orderQty: '24 \\u092c\\u094b\\u0924\\u0932 \\u0911\\u0930\\u094d\\u0921\\u0930',
    },
    {
      id: 3,
      title: '\\u0906\\u0936\\u0940\\u0930\\u094d\\u0935\\u093e\\u0926 \\u091a\\u0915\\u094d\\u0915\\u0940 \\u0906\\u091f\\u093e 5kg',
      remaining: '3 \\u092c\\u0948\\u0917 \\u092c\\u091a\\u0947',
      minThreshold: '(\\u0928\\u094d\\u092f\\u0942\\u0928\\u0924\\u092e 15)',
      supplier: '\\u0938\\u092a\\u094d\\u0932\\u093e\\u092f\\u0930: \\u0906\\u0908\\u091f\\u0940\\u0938\\u0940 \\u0921\\u093e\\u092f\\u0930\\u0947\\u0915\\u094d\\u091f',
      orderQty: '20 \\u092c\\u0948\\u0917 \\u0911\\u0930\\u094d\\u0921\\u0930',
    },
  ];

  const handleOrder = (id: number, title: string, qty: string) => {
    setOrderedItems((prev) => [...prev, id]);
    alert(\`\\u0938\\u092a\\u094d\\u0932\\u093e\\u092f\\u0930 \\u0915\\u094b \\u0911\\u0930\\u094d\\u0921\\u0930 \\u092d\\u0947\\u091c \\u0926\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e: \${title} (\${qty})\`);
  };

  return (
    <section className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-bold text-slate-900 truncate">\\u0915\\u092e \\u0938\\u094d\\u091f\\u0949\\u0915 \\u0905\\u0932\\u0930\\u094d\\u091f</h3>
            <span className="text-xs text-slate-500 font-medium">Smart Low Stock Watch</span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-extrabold">
          3 \\u0906\\u0907\\u091f\\u092e\\u094d\\u0938 \\u0915\\u092e
        </span>
      </div>

      {/* Stock Alerts List */}
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
                    <span>\\u0911\\u0930\\u094d\\u0921\\u0930 \\u092d\\u0947\\u091c\\u093e</span>
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

// 9. apps/web/src/components/DailyInsightsStrip.tsx
const dailyInsightsCode = `import React from 'react';
import { Award, Users, TrendingUp } from 'lucide-react';

export function DailyInsightsStrip() {
  return (
    <section className="grid grid-cols-2 gap-3">
      {/* Top Seller Today Card */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-700">
            <Award className="w-4 h-4" />
          </span>
          <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            34 \\u092c\\u093f\\u0915\\u0947
          </span>
        </div>
        <div>
          <span className="text-[11px] font-bold text-slate-500 block">\\u0938\\u092c\\u0938\\u0947 \\u091c\\u094d\\u092f\\u093e\\u0926\\u093e \\u092c\\u093f\\u0915\\u093e \\u0938\\u093e\\u092e\\u093e\\u0928</span>
          <span className="text-sm font-extrabold text-slate-900 truncate block mt-0.5">\\u0905\\u092e\\u0942\\u0932 \\u092c\\u091f\\u0930 500g</span>
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
          <span className="text-[11px] font-bold text-slate-500 block">\\u0926\\u0941\\u0915\\u093e\\u0928 \\u092a\\u0930 \\u0915\\u0941\\u0932 \\u0917\\u094d\\u0930\\u093e\\u0939\\u0915</span>
          <span className="text-sm font-extrabold text-slate-900 block mt-0.5">86 Footfall</span>
        </div>
      </div>
    </section>
  );
}
`;
fs.writeFileSync('apps/web/src/components/DailyInsightsStrip.tsx', dailyInsightsCode, 'utf8');

// 10. apps/web/src/components/FloatingGlassBar.tsx (Frosted Glassmorphism Floating Bar)
const floatingGlassCode = `import React, { useState } from 'react';
import { Plus, Slash, Sparkles, Mic, ArrowUp, ChevronDown, Check } from 'lucide-react';

interface FloatingGlassBarProps {
  onSubmitPrompt?: (prompt: string) => void;
  onQuickAdd?: () => void;
}

export function FloatingGlassBar({ onSubmitPrompt, onQuickAdd }: FloatingGlassBarProps) {
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'instant' | 'balanced' | 'pos'>('instant');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    if (onSubmitPrompt) onSubmitPrompt(inputVal);
    alert(\`\\u0915\\u092e\\u093e\\u0902\\u0921 \\u092a\\u094d\\u0930\\u094b\\u0938\\u0947\\u0938 \\u0939\\u094b \\u0930\\u0939\\u093e \\u0939\\u0942\\u0902: "\${inputVal}"\`);
    setInputVal('');
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setInputVal('\\u0930\\u092e\\u0947\\u0936 \\u0915\\u0941\\u092e\\u093e\\u0930 2 \\u0915\\u093f\\u0932\\u094b \\u091a\\u0940\\u0928\\u0940 \\u0914\\u0930 \\u20B9150 \\u0909\\u0927\\u093e\\u0930 \\u091c\\u094b\\u0921\\u093c\\u094b');
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
            placeholder="\\u0915\\u094d\\u092f\\u093e \\u092c\\u0928\\u093e\\u0928\\u093e \\u092f\\u093e \\u091c\\u094b\\u0921\\u093c\\u0928\\u093e \\u091a\\u093e\\u0939\\u0924\\u0947 \\u0939\\u0948\\u0902? (What would you like to change or create?)"
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-none py-1"
          />
        </form>

        {/* Action Controls Toolbar inside the Glass Pill */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10 text-xs">
          {/* Left Quick Action Pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onQuickAdd}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
              title="\\u0928\\u092f\\u093e \\u0906\\u0907\\u091f\\u092e \\u091c\\u094b\\u0921\\u093c\\u0947\\u0902"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setInputVal('/')}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 active:scale-90 transition-all font-mono font-bold"
              title="\\u0915\\u092e\\u093e\\u0902\\u0921 \\u0938\\u094d\\u0932\\u0948\\u0936"
            >
              /
            </button>
          </div>

          {/* Right Controls: Mode Selector + Mic + Submit */}
          <div className="flex items-center gap-2 relative">
            {/* Mode Pill Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 flex items-center gap-1.5 text-xs font-semibold text-white transition-all"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>{selectedMode === 'instant' ? 'Instant AI' : selectedMode === 'balanced' ? 'Balanced' : 'POS'}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {showModeDropdown && (
                <div className="absolute bottom-10 right-0 w-36 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-1 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('instant'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>Instant AI</span>
                    {selectedMode === 'instant' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('balanced'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>Balanced</span>
                    {selectedMode === 'balanced' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('pos'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>POS Mode</span>
                    {selectedMode === 'pos' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Sparkle Voice Mic Pill */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 \${
                isListening
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/15'
              }\`}
              title="\\u092c\\u094b\\u0932\\u0915\\u0930 \\u0915\\u0939\\u0947\\u0902 (Voice Input)"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Submit Arrow Pill */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!inputVal.trim()}
              className={\`w-8 h-8 rounded-full flex items-center justify-center transition-all \${
                inputVal.trim()
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold active:scale-90 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }\`}
              title="\\u092d\\u0947\\u091c\\u0947\\u0902 (Submit)"
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

// 11. apps/web/src/components/BottomNavBar.tsx
const bottomNavCode = `import React from 'react';
import { Store, BookOpen, Package, Settings } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export function BottomNavBar({ activeTab, onSelectTab }: BottomNavBarProps) {
  const tabs = [
    { id: 'home', label: '\\u0939\\u094b\\u092e', subLabel: 'Home', icon: Store },
    { id: 'khata', label: '\\u092c\\u0939\\u0940\\u0916\\u093e\\u0924\\u093e', subLabel: 'Khata', icon: BookOpen, badge: '4' },
    { id: 'inventory', label: '\\u0907\\u0928\\u094d\\u0935\\u0947\\u0902\\u091f\\u0930\\u0940', subLabel: 'Stock', icon: Package },
    { id: 'settings', label: '\\u0938\\u0947\\u091f\\u093f\\u0902\\u0917\\u094d\\u0938', subLabel: 'Settings', icon: Settings },
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

// 12. apps/web/src/components/QrModal.tsx
const qrModalCode = `import React from 'react';
import { X, QrCode, Download, Share2 } from 'lucide-react';

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopName: string;
  upiId: string;
}

export function QrModal({ isOpen, onClose, shopName, upiId }: QrModalProps) {
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

        <h3 className="text-lg font-bold text-slate-900">\\u0926\\u0941\\u0915\\u093e\\u0928 UPI QR \\u0915\\u094b\\u0921</h3>
        <p className="text-xs text-slate-500 font-medium mt-0.5">{shopName}</p>

        {/* QR Display */}
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
            onClick={() => alert('\\u0921\\u093e\\u0909\\u0928\\u0932\\u094b\\u0921 \\u0936\\u0941\\u0930\\u0942 \\u0939\\u094b \\u0917\\u092f\\u093e')}
            className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
          <button
            onClick={() => alert('\\u0935\\u094d\\u0939\\u093e\\u091f\\u094d\\u0938\\u090f\\u092a \\u092a\\u0930 \\u0936\\u0947\\u092f\\u0930 \\u0915\\u0930\\u0947\\u0902')}
            className="h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            <span>Share QR</span>
          </button>
        </div>
      </div>
    </div>
  );
}
`;
fs.writeFileSync('apps/web/src/components/QrModal.tsx', qrModalCode, 'utf8');

// 13. apps/web/src/App.tsx
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

export function App() {
  const [lang, setLang] = useState<'hi' | 'en'>('hi');
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

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans pb-36 md:pb-24">
      {/* Top Universal Header */}
      <Header
        storeName={currentUser?.shopName || 'Shree Ganesh Kirana'}
        isOnline={true}
        lang={lang}
        onToggleLang={() => setLang(lang === 'hi' ? 'en' : 'hi')}
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
            <KhataSummaryCard />
          </div>
        ) : activeView === 'pos' ? (
          <PosBillingView />
        ) : (
          <div className="space-y-4">
            {/* 1. Voice AI POS Hero Banner */}
            <VoiceHeroBanner onCommandTrigger={(cmd) => console.log('Voice Command:', cmd)} />

            {/* 2. Dual Primary Fast Counter POS Actions & Shortcuts */}
            <QuickActionTiles
              onNewBill={() => setActiveView('pos')}
              onScanBarcode={() => alert('\\u092c\\u093e\\u0930\\u0915\\u094b\\u0921 \\u0915\\u0948\\u092e\\u0930\\u093e \\u0938\\u094d\\u0915\\u0948\\u0928 \\u0936\\u0941\\u0930\\u0942 \\u0915\\u093f\\u092f\\u093e \\u0917\\u092f\\u093e (Live Barcode Scanner Ready)')}
              onShowQr={() => setIsQrOpen(true)}
              onAddProduct={() => setActiveTab('inventory')}
              onDailyReport={() => alert('\\u0921\\u0947\\u0932\\u0940 Z-\\u0930\\u093f\\u092a\\u094b\\u0930\\u094d\\u091f: \\u0906\\u091c \\u0915\\u0940 \\u0915\\u0941\\u0932 \\u0938\\u0947\\u0932 \\u20B98,450 | 60 \\u091f\\u094d\\u0930\\u093e\\u0902\\u091c\\u0948\\u0915\\u094d\\u0936\\u0928 | UPI: 73%')}
            />

            {/* 3. Financial Overview: Today's Collection Card */}
            <SalesSummaryCard />

            {/* 4. Khata Credit Ledger Widget (\\u0909\\u0927\\u093e\\u0930 \\u092c\\u0939\\u0940\\u0916\\u093e\\u0924\\u093e) */}
            <KhataSummaryCard />

            {/* 5. Low Stock Watch (\\u0907\\u0928\\u094d\\u0935\\u0947\\u0902\\u091f\\u0930\\u0940 \\u0905\\u0932\\u0930\\u094d\\u091f) */}
            <LowStockAlerts />

            {/* 6. Daily Kirana Insights Strip */}
            <DailyInsightsStrip />
          </div>
        )}
      </main>

      {/* Modern Frosted Translucent Glassmorphism Floating Action Bar */}
      <FloatingGlassBar
        onQuickAdd={() => setActiveTab('inventory')}
        onSubmitPrompt={(prompt) => console.log('Floating prompt:', prompt)}
      />

      {/* Docked Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'home') setActiveView('mobile');
        }}
      />

      {/* QR Code Modal */}
      <QrModal
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

console.log('--- ALL STITCH KIRANA UI FILES GENERATED AND WRITTEN CLEANLY ---');