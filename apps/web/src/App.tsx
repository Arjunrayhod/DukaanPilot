import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceHeroBanner } from './components/VoiceHeroBanner';
import { QuickActionTiles } from './components/QuickActionTiles';
import { SalesSummaryCard } from './components/SalesSummaryCard';
import { KhataSummaryCard } from './components/KhataSummaryCard';
import { LowStockAlerts } from './components/LowStockAlerts';
import { DailyInsightsStrip } from './components/DailyInsightsStrip';
import { BottomNavBar } from './components/BottomNavBar';
import { QrModal } from './components/QrModal';
import { PosBillingView } from './components/PosBillingView';
import { InventoryView } from './components/InventoryView';
import { KhataView } from './components/KhataView';
import { SupplierManagementView } from './components/SupplierManagementView';
import { CustomerPortal } from './components/CustomerPortal';
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
  const [posVoiceTrigger, setPosVoiceTrigger] = useState('');
  
  // Dual User State: Shopkeeper vs Customer
  const [currentUser, setCurrentUser] = useState<any>({
    id: 'usr_owner_01',
    name: 'Ramesh Ganesh',
    shopName: 'Shree Ganesh Kirana',
    phone: '9876543210',
    upiId: 'shreeganesh@sbi',
    role: 'OWNER', // 'OWNER' | 'CUSTOMER'
    khataDue: 0,
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

  const handleQuickToggleRole = () => {
    if (currentUser.role === 'OWNER') {
      // Switch to Customer mode
      setCurrentUser({
        id: 'usr_cust_01',
        name: 'रमेश कुमार (Ramesh Kumar)',
        shopName: 'Shree Ganesh Kirana',
        phone: '9823456789',
        upiId: 'shreeganesh@sbi',
        role: 'CUSTOMER',
        khataDue: 1250,
      });
    } else {
      // Switch to Shopkeeper mode
      setCurrentUser({
        id: 'usr_owner_01',
        name: 'Ramesh Ganesh',
        shopName: 'Shree Ganesh Kirana',
        phone: '9876543210',
        upiId: 'shreeganesh@sbi',
        role: 'OWNER',
        khataDue: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans pb-20 md:pb-12">
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
        userRole={currentUser.role}
        userName={currentUser.name}
        onQuickToggleRole={handleQuickToggleRole}
      />

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 w-full flex-1">
        {currentUser.role === 'CUSTOMER' ? (
          /* ================= CUSTOMER PORTAL ================= */
          <CustomerPortal
            lang={lang}
            customer={{
              name: currentUser.name,
              phone: currentUser.phone,
              khataDue: currentUser.khataDue || 1250,
              shopName: currentUser.shopName || 'Shree Ganesh Kirana',
              upiId: currentUser.upiId || 'shreeganesh@sbi',
            }}
            onOpenQr={() => setIsQrOpen(true)}
          />
        ) : (
          /* ================= SHOPKEEPER MERCHANT OS ================= */
          activeTab === 'inventory' ? (
            <InventoryView lang={lang} />
          ) : activeTab === 'khata' ? (
            <KhataView lang={lang} />
          ) : activeTab === 'suppliers' ? (
            <SupplierManagementView lang={lang} />
          ) : activeView === 'pos' ? (
            <PosBillingView lang={lang} initialVoiceText={posVoiceTrigger} />
          ) : (
            <div className="max-w-4xl mx-auto space-y-4">
              {/* 1. Voice AI POS Hero Banner */}
              <VoiceHeroBanner
                lang={lang}
                onCommandTrigger={(cmd) => {
                  setPosVoiceTrigger(cmd);
                  setActiveView('pos');
                }}
              />

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
              <KhataSummaryCard lang={lang} onOpenKhata={() => setActiveTab('khata')} />

              {/* 5. Low Stock Watch with WhatsApp PO */}
              <LowStockAlerts lang={lang} onOpenSupplierManager={() => setActiveTab('suppliers')} />

              {/* 6. Daily Kirana Insights Strip */}
              <DailyInsightsStrip lang={lang} />
            </div>
          )
        )}
      </main>

      {/* Docked Bottom Navigation Bar (Shopkeeper Only) */}
      {currentUser.role === 'OWNER' && (
        <BottomNavBar
          lang={lang}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'home') setActiveView('mobile');
          }}
        />
      )}

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
            id: data.user.id,
            name: data.user.name,
            shopName: data.shop?.name || 'Shree Ganesh Kirana',
            phone: data.user.phone,
            upiId: data.shop?.upiId || 'shreeganesh@sbi',
            role: data.user.role || 'OWNER',
            khataDue: data.user.khataDue || 0,
          });
        }}
      />
    </div>
  );
}
