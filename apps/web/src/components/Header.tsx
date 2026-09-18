import React from 'react';
import { Store, ShieldCheck, Languages, User, ArrowLeftRight, Sparkles } from 'lucide-react';
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
  userRole?: 'OWNER' | 'CUSTOMER';
  userName?: string;
  onQuickToggleRole?: () => void;
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
  userRole = 'OWNER',
  userName = 'Ramesh Ganesh',
  onQuickToggleRole,
}: HeaderProps) {
  const t = translations[lang];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_10px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto h-16 sm:h-20 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Store Title & Role Status */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-500/10 shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              <h1 className="font-extrabold text-base sm:text-lg text-slate-900 truncate tracking-tight font-display">
                {lang === 'hi' ? 'श्री गणेश किराना' : storeName}
              </h1>
              <span className="inline-flex items-center text-blue-600 shrink-0" title="Verified Merchant">
                <ShieldCheck className="w-4 h-4 fill-blue-50" />
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  {userRole === 'OWNER' ? t.posOnline : (lang === 'hi' ? 'ग्राहक पोर्टल' : 'Customer Portal')}
                </span>
              </div>
              <span className="text-slate-300">&bull;</span>
              <span className="font-bold text-slate-800 text-[11px] truncate">
                {userRole === 'OWNER' ? '🏪 ' + (lang === 'hi' ? 'दुकानदार' : 'Shopkeeper') : '👤 ' + userName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls & Capsule Switchers */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Role Switcher Pill */}
          {onQuickToggleRole && (
            <button
              onClick={onQuickToggleRole}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white backdrop-blur-xl border border-white/15 shadow-sm transition-all active:scale-95 cursor-pointer"
              title="Switch between Shopkeeper & Customer view"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-300" />
              <span className="hidden sm:inline">
                {userRole === 'OWNER' ? (lang === 'hi' ? 'ग्राहक दृश्य' : 'Customer Mode') : (lang === 'hi' ? 'दुकानदार OS' : 'Shopkeeper OS')}
              </span>
            </button>
          )}

          {/* Mobile / Counter POS Switcher (Shopkeeper Only) */}
          {userRole === 'OWNER' && (
            <div className="hidden md:flex bg-slate-100/90 p-1 rounded-full border border-slate-200/80 text-xs font-semibold">
              <button
                onClick={() => onToggleView('mobile')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeView === 'mobile'
                    ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.mobileView}
              </button>
              <button
                onClick={() => onToggleView('pos')}
                className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                  activeView === 'pos'
                    ? 'bg-white text-slate-900 shadow-sm font-bold border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.posView}
              </button>
            </div>
          )}

          {/* Language Toggle Pill */}
          <button
            onClick={onToggleLang}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="भाषा बदलें (Toggle Language)"
          >
            <Languages className="w-3.5 h-3.5 text-blue-700" />
            <span>{lang === 'hi' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Profile / Fast Login Button */}
          <button
            onClick={onOpenAuth}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
            title="Profile & PIN Login"
          >
            <User className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
