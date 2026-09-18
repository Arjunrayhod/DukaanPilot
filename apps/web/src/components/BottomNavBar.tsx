import React from 'react';
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
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] h-12 px-2 transition-all relative group ${
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
              <span className="text-[11px] font-semibold mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
