import React from 'react';
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
              <span className={`inline-block w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span>{isOnline ? 'POS & Online Active' : 'Offline Mode'}</span>
              <span className="text-slate-300">�</span>
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
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'mobile' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
            >
              ?? Mobile App
            </button>
            <button
              onClick={() => onToggleView('pos')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeView === 'pos' ? 'bg-white text-emerald-800 shadow-sm font-bold' : 'hover:text-slate-900'
              }`}
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
