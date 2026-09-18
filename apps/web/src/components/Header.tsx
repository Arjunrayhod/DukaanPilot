import React from 'react';
import { Store, ShieldCheck, Languages, User, ArrowLeftRight } from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between gap-3">
        {/* Store Title & Role Status */}
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
              <span className="font-semibold text-slate-500 uppercase tracking-wider text-[11px]">
                {userRole === 'OWNER' ? t.posOnline : (lang === 'hi' ? 'ग्राहक पोर्टल' : 'Customer Portal')}
              </span>
              <span className="text-slate-300">&bull;</span>
              <span className="font-bold text-blue-700 text-[11px] truncate">
                {userRole === 'OWNER' ? '🏪 ' + (lang === 'hi' ? 'दुकानदार' : 'Shopkeeper') : '👤 ' + userName}
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher & Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Role Switcher Button */}
          {onQuickToggleRole && (
            <button
              onClick={onQuickToggleRole}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-700 hover:text-blue-900 shadow-xs cursor-pointer active:scale-95"
              title="Switch between Shopkeeper & Customer view"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-700" />
              <span className="hidden sm:inline">
                {userRole === 'OWNER' ? (lang === 'hi' ? 'ग्राहक मोड' : 'Customer Mode') : (lang === 'hi' ? 'दुकानदार मोड' : 'Shopkeeper Mode')}
              </span>
            </button>
          )}

          {/* Mobile / Counter POS Switcher (Shopkeeper Only) */}
          {userRole === 'OWNER' && (
            <div className="hidden sm:flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => onToggleView('mobile')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeView === 'mobile' ? 'bg-white text-blue-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.mobileView}
              </button>
              <button
                onClick={() => onToggleView('pos')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  activeView === 'pos' ? 'bg-white text-blue-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t.posView}
              </button>
            </div>
          )}

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
            className="h-9 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center gap-1.5 text-slate-700 transition-colors shadow-sm cursor-pointer"
            type="button"
            title="Switch User / Account"
          >
            <User className="w-4 h-4 text-blue-800" />
            <span className="hidden md:inline text-xs font-bold text-slate-800">
              {userRole === 'OWNER' ? 'Shop' : 'Customer'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
