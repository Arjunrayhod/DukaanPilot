import React, { useState, useEffect } from 'react';
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
        setSystemHealth(`Online (v${res.data.version})`);
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
              onDailyReport={() => alert(lang === 'hi' ? 'डेली Z-रिपोर्ट: आज की कुल सेल ₹8,450 | 60 ट्रांजैक्शन' : 'Daily Z-Report: Today\'s Total Sale ₹8,450 | 60 Transactions')}
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
