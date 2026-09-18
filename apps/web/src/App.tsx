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
        setSystemHealth(`Online (v${res.data.version})`);
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
              onScanBarcode={() => alert('\u092c\u093e\u0930\u0915\u094b\u0921 \u0915\u0948\u092e\u0930\u093e \u0938\u094d\u0915\u0948\u0928 \u0936\u0941\u0930\u0942 \u0915\u093f\u092f\u093e \u0917\u092f\u093e (Live Barcode Scanner Ready)')}
              onShowQr={() => setIsQrOpen(true)}
              onAddProduct={() => setActiveTab('inventory')}
              onDailyReport={() => alert('\u0921\u0947\u0932\u0940 Z-\u0930\u093f\u092a\u094b\u0930\u094d\u091f: \u0906\u091c \u0915\u0940 \u0915\u0941\u0932 \u0938\u0947\u0932 \u20B98,450 | 60 \u091f\u094d\u0930\u093e\u0902\u091c\u0948\u0915\u094d\u0936\u0928 | UPI: 73%')}
            />

            {/* 3. Financial Overview: Today's Collection Card */}
            <SalesSummaryCard />

            {/* 4. Khata Credit Ledger Widget (\u0909\u0927\u093e\u0930 \u092c\u0939\u0940\u0916\u093e\u0924\u093e) */}
            <KhataSummaryCard />

            {/* 5. Low Stock Watch (\u0907\u0928\u094d\u0935\u0947\u0902\u091f\u0930\u0940 \u0905\u0932\u0930\u094d\u091f) */}
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
