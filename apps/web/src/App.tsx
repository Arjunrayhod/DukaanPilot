import React, { useState, useEffect } from 'react';
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
        setSystemHealth(`Online (v${res.data.version})`);
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
                className={`flex flex-col items-center relative py-1 px-2 transition-colors ${
                  isActive ? 'text-emerald-800 font-bold' : 'text-slate-400 hover:text-slate-600'
                }`}
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
