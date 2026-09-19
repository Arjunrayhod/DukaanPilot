import React from 'react';
import { Store, Zap, BookOpen, Package, BarChart3 } from 'lucide-react';
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
    { id: 'pos', label: t.navPos, icon: Zap, isPrimary: true },
    { id: 'khata', label: t.navKhata, icon: BookOpen, badge: '4' },
    { id: 'inventory', label: t.navInventory, icon: Package },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-2px_12px_rgba(11,28,48,0.05)]">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="flex flex-col items-center justify-center -mt-4 group cursor-pointer"
                type="button"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 active:scale-95 ${
                  isActive
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-blue-500/30'
                    : 'bg-slate-900 text-white shadow-slate-900/20'
                }`}>
                  <Zap className="w-6 h-6 fill-amber-300 text-amber-300" />
                </div>
                <span className={`text-[10px] font-black mt-1 ${isActive ? 'text-blue-700 font-extrabold' : 'text-slate-700'}`}>
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[50px] h-12 px-1.5 transition-all relative group cursor-pointer ${
                isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
              type="button"
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700 scale-110' : 'group-hover:scale-105'} transition-transform`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-white font-extrabold text-[10px] leading-4 flex items-center justify-center shadow-sm">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
