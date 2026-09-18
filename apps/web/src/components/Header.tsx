import React from 'react';
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
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeView === 'mobile' ? 'bg-white text-blue-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              मोबाइल (Mobile)
            </button>
            <button
              onClick={() => onToggleView('pos')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeView === 'pos' ? 'bg-white text-blue-800 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              काउंटर POS
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
            <span>{lang === 'hi' ? 'हिन्दी' : 'EN'}</span>
            <span className="mx-1 text-slate-300">|</span>
            <span className="text-slate-400 font-normal">{lang === 'hi' ? 'EN' : 'हिन्दी'}</span>
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
