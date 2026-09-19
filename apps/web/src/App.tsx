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
import { OnlineOrdersCard } from './components/OnlineOrdersCard';
import { AnalyticsView } from './components/AnalyticsView';
import { DailyZReportModal } from './components/DailyZReportModal';
import { CustomerPortal } from './components/CustomerPortal';
import { AuthModal } from './components/AuthModal';
import { PromotionsModal } from './components/PromotionsModal';
import { AiKiranaCopilotModal } from './components/AiKiranaCopilotModal';
import { GstTaxReportModal } from './components/GstTaxReportModal';
import { CashierShiftModal } from './components/CashierShiftModal';
import { BarcodeSheetModal } from './components/BarcodeSheetModal';
import { checkHealth } from './services/api';
import { Lang } from './i18n/translations';

import { useOfflineSync } from './utils/offlineSyncService';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';

export function App() {
  const [lang, setLang] = useState<Lang>('hi');
  const [activeTab, setActiveTab] = useState('home');
  const [systemHealth, setSystemHealth] = useState('Checking...');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isZReportOpen, setIsZReportOpen] = useState(false);
  const [isPromotionsOpen, setIsPromotionsOpen] = useState(false);
  const [isAiCopilotOpen, setIsAiCopilotOpen] = useState(false);
  const [isGstTaxOpen, setIsGstTaxOpen] = useState(false);
  const [isCashierShiftOpen, setIsCashierShiftOpen] = useState(false);
  const [isBarcodeSheetOpen, setIsBarcodeSheetOpen] = useState(false);
  const [posVoiceTrigger, setPosVoiceTrigger] = useState('');
  const [pendingOrderToBill, setPendingOrderToBill] = useState<any>(null);
  const { isOnline, pendingCount, isSyncing, syncNow } = useOfflineSync();
  
  // Dual User State: Shopkeeper vs Customer with Persistent Storage
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const savedUser = localStorage.getItem('dukaanpilot_current_user');
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {}

    const savedShopName = localStorage.getItem('dukaanpilot_shop_name') || 'श्री गणेश किराना स्टोर';
    const savedUpi = localStorage.getItem('dukaanpilot_shop_upi') || 'shreeganesh@sbi';
    const savedQr = localStorage.getItem('dukaanpilot_custom_qr') || undefined;
    const savedPhone = localStorage.getItem('dukaanpilot_shop_phone') || '9876543210';
    return {
      id: 'usr_owner_01',
      name: 'Ramesh Ganesh',
      shopName: savedShopName,
      phone: savedPhone,
      upiId: savedUpi,
      customQrImage: savedQr,
      role: 'OWNER', // 'OWNER' | 'CUSTOMER'
      khataDue: 0,
    };
  });

  const updateCurrentUser = (userObj: any) => {
    setCurrentUser(userObj);
    try {
      localStorage.setItem('dukaanpilot_current_user', JSON.stringify(userObj));
      if (userObj.shopName) localStorage.setItem('dukaanpilot_shop_name', userObj.shopName);
      if (userObj.upiId) localStorage.setItem('dukaanpilot_shop_upi', userObj.upiId);
      if (userObj.phone && userObj.role === 'OWNER') localStorage.setItem('dukaanpilot_shop_phone', userObj.phone);
    } catch (e) {}
  };

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
    setLang((prev) => {
      if (prev === 'hi') return 'en';
      if (prev === 'en') return 'gu';
      if (prev === 'gu') return 'mr';
      return 'hi';
    });
  };

  const handleQuickToggleRole = () => {
    const currentShopName = localStorage.getItem('dukaanpilot_shop_name') || currentUser.shopName || 'श्री गणेश किराना स्टोर';
    const currentShopUpi = localStorage.getItem('dukaanpilot_shop_upi') || currentUser.upiId || 'shreeganesh@sbi';
    const currentShopQr = localStorage.getItem('dukaanpilot_custom_qr') || currentUser.customQrImage;
    const currentShopPhone = localStorage.getItem('dukaanpilot_shop_phone') || '9876543210';

    if (currentUser.role === 'OWNER') {
      // Switch to Customer mode
      updateCurrentUser({
        id: 'usr_cust_01',
        name: 'रमेश कुमार (Ramesh Kumar)',
        shopName: currentShopName,
        phone: '9823456789',
        upiId: currentShopUpi,
        customQrImage: currentShopQr,
        role: 'CUSTOMER',
        khataDue: 1450,
      });
    } else {
      // Switch to Shopkeeper mode
      updateCurrentUser({
        id: 'usr_owner_01',
        name: 'Ramesh Ganesh',
        shopName: currentShopName,
        phone: currentShopPhone,
        upiId: currentShopUpi,
        customQrImage: currentShopQr,
        role: 'OWNER',
        khataDue: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans pb-20 md:pb-12">
      {/* Top Universal Header */}
      <Header
        storeName={currentUser?.shopName || 'श्री गणेश किराना स्टोर'}
        isOnline={isOnline}
        lang={lang}
        onToggleLang={toggleLanguage}
        systemHealth={systemHealth}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        userRole={currentUser.role}
        userName={currentUser.name}
        onQuickToggleRole={handleQuickToggleRole}
      />

      {/* Offline Status & Cloud Sync Banner */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-xs font-bold py-2 px-4 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <WifiOff className="w-4 h-4 text-amber-200 shrink-0" />
            <span>
              {lang === 'hi'
                ? '📡 ऑफलाइन मोड (Offline Active): इंटरनेट बंद है, लेकिन आपकी बिलिंग, बारकोड व स्टॉक अपडेट बिना रुके चल रहे हैं।'
                : '📡 Offline Mode Active: Internet disconnected. Local POS billing and inventory continue working seamlessly.'}
            </span>
            {pendingCount > 0 && (
              <span className="bg-amber-800/80 px-2 py-0.5 rounded-full text-[11px] font-mono">
                {pendingCount} {lang === 'hi' ? 'लेन-देन पेंडिंग' : 'pending sync'}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Background Cloud Syncing Toast */}
      {isOnline && pendingCount > 0 && (
        <div className="bg-indigo-900 text-white text-xs font-bold py-1.5 px-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-3.5 h-3.5 text-indigo-300 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>
                {lang === 'hi'
                  ? `इंटरनेट वापस आ गया! ${pendingCount} ऑफलाइन रिकॉर्ड्स क्लाउड से सिंक हो रहे हैं...`
                  : `Back Online! Syncing ${pendingCount} offline records with cloud...`}
              </span>
            </div>
            <button
              onClick={syncNow}
              disabled={isSyncing}
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold cursor-pointer transition-colors"
            >
              {isSyncing ? (lang === 'hi' ? 'सिंक जारी...' : 'Syncing...') : (lang === 'hi' ? 'अभी सिंक करें' : 'Sync Now')}
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-3.5 sm:px-6 py-4 w-full flex-1">
        {currentUser.role === 'CUSTOMER' ? (
          /* ================= CUSTOMER PORTAL ================= */
          <CustomerPortal
            lang={lang}
            customer={{
              name: currentUser.name,
              phone: currentUser.phone,
              khataDue: currentUser.khataDue || 1450,
              shopName: currentUser.shopName || 'श्री गणेश किराना स्टोर',
              upiId: currentUser.upiId || 'shreeganesh@sbi',
            }}
            onOpenQr={() => setIsQrOpen(true)}
          />
        ) : (
          /* ================= UNIFIED SHOPKEEPER MERCHANT OS ================= */
          activeTab === 'pos' ? (
            <PosBillingView
              lang={lang}
              storeName={currentUser?.shopName}
              storePhone={currentUser?.phone}
              storeUpiId={currentUser?.upiId}
              initialVoiceText={posVoiceTrigger}
              onClearVoiceTrigger={() => setPosVoiceTrigger('')}
              pendingOrderToBill={pendingOrderToBill}
              onClearPendingOrder={() => setPendingOrderToBill(null)}
              onBackToDashboard={() => setActiveTab('home')}
            />
          ) : activeTab === 'inventory' ? (
            <InventoryView lang={lang} />
          ) : activeTab === 'khata' ? (
            <KhataView lang={lang} />
          ) : activeTab === 'suppliers' ? (
            <SupplierManagementView lang={lang} />
          ) : activeTab === 'analytics' || activeTab === 'settings' ? (
            <AnalyticsView lang={lang} shopName={currentUser?.shopName} shopPhone={currentUser?.phone} />
          ) : (
            /* Home / Overview Dashboard */
            <div className="max-w-4xl mx-auto space-y-4">
              {/* 1. Voice AI POS Hero Banner */}
              <VoiceHeroBanner
                lang={lang}
                onCommandTrigger={(cmd) => {
                  setPosVoiceTrigger(cmd);
                  setActiveTab('pos');
                }}
              />

              {/* 2. Fast Counter POS Actions & Shortcuts */}
              <QuickActionTiles
                lang={lang}
                onNewBill={() => {
                  setPosVoiceTrigger('');
                  setPendingOrderToBill(null);
                  setActiveTab('pos');
                }}
                onScanBarcode={() => {
                  setPosVoiceTrigger('');
                  setPendingOrderToBill(null);
                  setActiveTab('pos');
                }}
                onShowQr={() => setIsQrOpen(true)}
                onAddProduct={() => setActiveTab('inventory')}
                onDailyReport={() => setIsZReportOpen(true)}
                onPromotions={() => setIsPromotionsOpen(true)}
                onOpenAiCopilot={() => setIsAiCopilotOpen(true)}
                onOpenGstTax={() => setIsGstTaxOpen(true)}
                onOpenCashierShift={() => setIsCashierShiftOpen(true)}
                onOpenBarcodeSheet={() => setIsBarcodeSheetOpen(true)}
              />

              {/* 3. Live Incoming Online Customer Orders */}
              <OnlineOrdersCard
                lang={lang}
                onConvertToPosBill={(order) => {
                  setPendingOrderToBill(order);
                  setActiveTab('pos');
                }}
              />

              {/* 4. Financial Overview: Today's Collection Card */}
              <SalesSummaryCard lang={lang} />

              {/* 5. Khata Credit Ledger Widget */}
              <KhataSummaryCard lang={lang} onOpenKhata={() => setActiveTab('khata')} />

              {/* 6. Low Stock Watch with WhatsApp PO */}
              <LowStockAlerts lang={lang} onOpenSupplierManager={() => setActiveTab('suppliers')} />

              {/* 7. Daily Kirana Insights Strip */}
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
          onSelectTab={setActiveTab}
        />
      )}

      {/* QR Code Modal */}
      <QrModal
        lang={lang}
        userRole={currentUser?.role}
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        shopName={currentUser?.shopName || 'श्री गणेश किराना स्टोर'}
        upiId={currentUser?.upiId || 'shreeganesh@sbi'}
        customQrImage={currentUser?.customQrImage}
        onUpdateQr={(newUpi, newImg) => {
          updateCurrentUser({
            ...currentUser,
            upiId: newUpi,
            customQrImage: newImg,
          });
        }}
      />

      {/* Authentication & PIN Login Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(data) => {
          const userObj = {
            id: data.user.id,
            name: data.user.name,
            shopName: data.shop?.name || currentUser?.shopName || 'श्री गणेश किराना स्टोर',
            phone: data.user.phone,
            upiId: data.shop?.upiId || currentUser?.upiId || 'shreeganesh@sbi',
            role: data.user.role || 'OWNER',
            khataDue: data.user.khataDue || 0,
          };
          updateCurrentUser(userObj);
        }}
      />

      {/* Daily Z-Report Modal */}
      <DailyZReportModal
        isOpen={isZReportOpen}
        onClose={() => setIsZReportOpen(false)}
        lang={lang}
        shopName={currentUser?.shopName || 'श्री गणेश किराना स्टोर'}
        shopPhone={currentUser?.phone || '+91 98765 43210'}
      />

      {/* Festive Offers & Customer Loyalty Modal */}
      <PromotionsModal
        isOpen={isPromotionsOpen}
        onClose={() => setIsPromotionsOpen(false)}
        lang={lang}
        shopInfo={{
          name: currentUser?.shopName || 'श्री गणेश किराना स्टोर',
          phone: currentUser?.phone || '+91 98765 43210'
        }}
      />

      {/* AI Kirana Copilot & WhatsApp Grocery List Parser */}
      <AiKiranaCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        lang={lang}
        onLoadCartItems={(items) => {
          setPendingOrderToBill({
            customerName: 'WhatsApp ग्राहक',
            customerPhone: '9876543210',
            paymentStatus: 'PENDING_CASH',
            items: items.map((it: any) => ({
              id: it.id,
              name: it.name,
              hindiName: it.nameHindi || it.name,
              price: it.price,
              qty: it.qty,
              unit: it.unit || 'packet',
            }))
          });
          setActiveTab('pos');
        }}
      />

      {/* GST Tax Report & GSTR-1 Invoicing Modal */}
      <GstTaxReportModal
        isOpen={isGstTaxOpen}
        onClose={() => setIsGstTaxOpen(false)}
        lang={lang}
        shopInfo={{
          name: currentUser?.shopName || 'श्री गणेश किराना स्टोर',
          gstin: '07AAAAA0000A1Z5',
          state: 'Delhi (07)',
        }}
      />

      {/* Cashier Shifts & Cash Drawer Reconciliation Modal */}
      <CashierShiftModal
        isOpen={isCashierShiftOpen}
        onClose={() => setIsCashierShiftOpen(false)}
        lang={lang}
        shopName={currentUser?.shopName || 'श्री गणेश किराना स्टोर'}
        shopPhone={currentUser?.phone || '+91 98765 43210'}
      />

      {/* A4 Barcode Sticker Sheet Batch Printing Modal */}
      <BarcodeSheetModal
        isOpen={isBarcodeSheetOpen}
        onClose={() => setIsBarcodeSheetOpen(false)}
        lang={lang}
        shopName={currentUser?.shopName || 'श्री गणेश किराना स्टोर'}
      />
    </div>
  );
}
