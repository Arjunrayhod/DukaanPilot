import React, { useState } from 'react';
import { 
  Truck, Search, Plus, Phone, Building2, Package, Check, 
  AlertTriangle, Calendar, MessageSquare, ArrowRight, Sparkles, X, ChevronRight,
  FileText, Banknote, ShieldCheck
} from 'lucide-react';
import { Lang, translations } from '../i18n/translations';
import { 
  Supplier, 
  RestockItem, 
  INITIAL_SUPPLIERS, 
  INITIAL_LOW_STOCK_ITEMS,
  PurchaseOrder
} from '../utils/restockService';
import { SupplierOrderModal } from './SupplierOrderModal';
import { SupplierInwardModal } from './SupplierInwardModal';
import { useSupplierInward, formatSupplierPaymentReceipt } from '../utils/inwardService';
import { speakHindi } from '../utils/voiceFeedback';

interface SupplierManagementViewProps {
  lang?: Lang;
}

export function SupplierManagementView({ lang = 'hi' }: SupplierManagementViewProps) {
  const isHi = lang === 'hi' || lang === 'gu' || lang === 'mr';
  const t = translations[lang];

  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [lowStockItems, setLowStockItems] = useState<RestockItem[]>(INITIAL_LOW_STOCK_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSupplierForPO, setSelectedSupplierForPO] = useState<Supplier | null>(null);
  const [poItems, setPoItems] = useState<RestockItem[]>([]);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isInwardModalOpen, setIsInwardModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'lowstock' | 'suppliers' | 'inward'>('lowstock');
  const [recentOrders, setRecentOrders] = useState<PurchaseOrder[]>([]);
  const { inwardEntries, recordPayment } = useSupplierInward();

  // Add Supplier Form
  const [newSupName, setNewSupName] = useState('');
  const [newSupCompany, setNewSupCompany] = useState('');
  const [newSupPhone, setNewSupPhone] = useState('');
  const [newSupContact, setNewSupContact] = useState('');
  const [newSupBrands, setNewSupBrands] = useState('');
  const [newSupAddress, setNewSupAddress] = useState('');

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.brands.some((b) => b.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenPOForSupplier = (supplier: Supplier) => {
    const itemsForSupplier = lowStockItems.filter((it) => it.supplierId === supplier.id);
    setSelectedSupplierForPO(supplier);
    setPoItems(itemsForSupplier.length > 0 ? itemsForSupplier : [
      {
        id: `rstk_manual_${Date.now()}`,
        productId: 'prod_custom',
        name: `${supplier.brands[0] || supplier.name} Standard Case`,
        nameHindi: `${supplier.brands[0] || supplier.name} सप्लाई पैकेट`,
        sku: 'SKU-RESTOCK',
        currentStock: 2,
        minThreshold: 10,
        suggestedOrderQty: 10,
        unit: 'case',
        costPrice: 500,
        sellingPrice: 550,
        supplierId: supplier.id,
        supplierName: supplier.name,
        category: supplier.categories[0] || 'General'
      }
    ]);
  };

  const handleOpenSingleItemPO = (item: RestockItem) => {
    const sup = suppliers.find((s) => s.id === item.supplierId) || suppliers[0];
    setSelectedSupplierForPO(sup);
    setPoItems([item]);
  };

  const handleSaveNewSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupName.trim() || !newSupPhone.trim()) return;

    const newSupplier: Supplier = {
      id: `sup_${Date.now()}`,
      name: newSupName,
      company: newSupCompany || newSupName,
      phone: newSupPhone,
      contactPerson: newSupContact || newSupName,
      categories: ['General Kirana'],
      brands: newSupBrands.split(',').map((b) => b.trim()).filter(Boolean),
      deliveryDays: ['Mon', 'Wed', 'Fri'],
      leadTimeDays: 1,
      minOrderValue: 2000,
      pendingCredit: 0,
      address: newSupAddress || 'Main Market'
    };

    setSuppliers((prev) => [newSupplier, ...prev]);
    setIsAddSupplierOpen(false);
    setNewSupName('');
    setNewSupCompany('');
    setNewSupPhone('');
    setNewSupContact('');
    setNewSupBrands('');
    setNewSupAddress('');

    speakHindi(isHi ? `नया सप्लायर ${newSupplier.name} जोड़ा गया` : `Supplier ${newSupplier.name} added`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                  {isHi ? 'सप्लायर व री-स्टॉक ऑटोमेशन' : 'Supplier & Restock Automation'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  {isHi ? '1-क्लिक WhatsApp PO' : '1-Click WhatsApp PO'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {isHi 
                  ? 'कम स्टॉक वाले सामानों का सप्लायर-वार ऑटोमैटिक व्हाट्सएप ऑर्डर तैयार करें'
                  : 'Automatically generate supplier-grouped purchase orders with instant WhatsApp dispatch'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsInwardModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 border border-white/20"
            >
              <Package className="w-4 h-4" />
              <span>{isHi ? '📦 नया माल इनवर्ड करें (GRN)' : '📦 Receive Stock (GRN)'}</span>
            </button>

            <button
              onClick={() => setIsAddSupplierOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{isHi ? 'नया सप्लायर जोड़ें' : 'Add Distributor'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Strip */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveTab('lowstock')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'lowstock'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            <span>{isHi ? 'कम स्टॉक सामग्री' : 'Low Stock Items'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono">{lowStockItems.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'suppliers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>{isHi ? 'सप्लायर व उधारी लेजर' : 'Distributors & AP'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono">{suppliers.length}</span>
          </button>

          <button
            onClick={() => setActiveTab('inward')}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'inward'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{isHi ? 'खरीद चालान व इनवर्ड' : 'Purchase Inward (GRN)'}</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono">{inwardEntries.length}</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isHi ? 'सप्लायर या ब्रांड खोजें...' : 'Search supplier or brand...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* View: Low Stock Tab */}
      {activeTab === 'lowstock' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-black font-mono">
                        {isHi ? 'स्टॉक कम' : 'Low Stock'}
                      </span>
                      <h4 className="text-sm font-black text-slate-900 mt-1.5 truncate">
                        {isHi && item.nameHindi ? item.nameHindi : item.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        {item.sku} &bull; {item.category}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">{isHi ? 'बचा हुआ स्टॉक' : 'Current'}</span>
                      <span className="text-rose-600 font-black font-mono text-sm">{item.currentStock} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">{isHi ? 'न्यूनतम सीमा' : 'Min Level'}</span>
                      <span className="text-slate-700 font-bold font-mono">{item.minThreshold} {item.unit}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">{isHi ? 'सुझाई गई मात्रा' : 'Order Qty'}</span>
                      <span className="text-indigo-600 font-black font-mono text-sm">+{item.suggestedOrderQty} {item.unit}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-700 truncate">{item.supplierName}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenSingleItemPO(item)}
                  className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{isHi ? `व्हाट्सएप पर ऑर्डर भेजें (+${item.suggestedOrderQty})` : `Order via WhatsApp (+${item.suggestedOrderQty})`}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View: Suppliers List Tab */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((sup) => {
            const lowStockCountForSup = lowStockItems.filter((it) => it.supplierId === sup.id).length;
            return (
              <div
                key={sup.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-base font-black text-slate-900 truncate font-display">
                        {sup.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold">{sup.company}</p>
                    </div>
                    {lowStockCountForSup > 0 && (
                      <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-black shrink-0">
                        {lowStockCountForSup} {isHi ? 'सामान कम' : 'Low'}
                      </span>
                    )}
                  </div>

                  {/* Brands tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sup.brands.map((b, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  {/* Contact and schedule */}
                  <div className="mt-3.5 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800">👤 {sup.contactPerson}</span>
                      <span>&bull;</span>
                      <span className="font-mono text-indigo-600 font-bold">📞 {sup.phone}</span>
                    </div>
                    <div className="text-slate-400 font-medium">
                      🚚 {isHi ? 'डिलीवरी' : 'Delivery'}: <span className="text-slate-700 font-bold">{sup.deliveryDays.join(', ')}</span>
                    </div>
                    {sup.pendingCredit > 0 && (
                      <div className="text-rose-600 font-bold font-mono">
                        ⚠️ {isHi ? 'सप्लायर का बकाया' : 'Credit Due'}: ₹{sup.pendingCredit.toLocaleString('en-IN')}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleOpenPOForSupplier(sup)}
                  className="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <Truck className="w-4 h-4" />
                  <span>{isHi ? '1-क्लिक री-स्टॉक PO बनाएं' : 'Create 1-Click Restock PO'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* View: Inward / GRN Bills Tab */}
      {activeTab === 'inward' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">
              {isHi ? 'सप्लायर खरीद चालान व इनवर्ड इतिहास (GRN Records)' : 'Purchase Inward & GRN History'}
            </h3>
            <button
              onClick={() => setIsInwardModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isHi ? 'नया इनवर्ड दर्ज करें' : 'New Inward'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {inwardEntries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-black font-mono">
                        {entry.grnNumber}
                      </span>
                      <span className="text-xs text-slate-500 font-bold font-mono">
                        {isHi ? 'चालान:' : 'Inv:'} #{entry.invoiceNumber}
                      </span>
                      <span className="text-slate-300">&bull;</span>
                      <span className="text-xs text-slate-500 font-medium">
                        {entry.receivedDate} {entry.receivedTime}
                      </span>
                    </div>
                    <h4 className="text-base font-black text-slate-900 mt-1 font-display">
                      {entry.supplierName}
                    </h4>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
                      ₹{entry.totalAmount.toLocaleString('en-IN')}
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      entry.pendingAmount === 0
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {entry.pendingAmount === 0 
                        ? (isHi ? 'पूर्ण भुगतान' : 'Fully Paid')
                        : (isHi ? `बकाया: ₹${entry.pendingAmount}` : `Due: ₹${entry.pendingAmount}`)}
                    </span>
                  </div>
                </div>

                {/* Items preview */}
                <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex flex-wrap gap-3 text-xs">
                  {entry.items.map((it, i) => (
                    <div key={i} className="flex items-center gap-1.5 font-medium text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span className="font-bold">{it.nameHindi || it.name}</span>
                      <span className="text-slate-500 font-mono">({it.qtyReceived} {it.unit} @ ₹{it.costPrice})</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supplier Inward Modal */}
      <SupplierInwardModal
        isOpen={isInwardModalOpen}
        onClose={() => setIsInwardModalOpen(false)}
        lang={lang}
        suppliers={suppliers}
      />

      {/* PO Order Modal */}
      {selectedSupplierForPO && (
        <SupplierOrderModal
          isOpen={!!selectedSupplierForPO}
          onClose={() => setSelectedSupplierForPO(null)}
          supplier={selectedSupplierForPO}
          items={poItems}
          lang={lang}
          onOrderPlaced={(po) => {
            setRecentOrders((prev) => [po, ...prev]);
            setSelectedSupplierForPO(null);
          }}
        />
      )}

      {/* Add Supplier Modal */}
      {isAddSupplierOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-slate-200 shadow-2xl overflow-hidden my-auto">
            <div className="px-6 py-5 bg-gradient-to-r from-indigo-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-indigo-300" />
                <h3 className="text-base font-black">
                  {isHi ? 'नया सप्लायर / डिस्ट्रीब्यूटर जोड़ें' : 'Add New Supplier / Agency'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddSupplierOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewSupplier} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  {isHi ? 'एजेंसी / सप्लायर का नाम *' : 'Distributor Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={newSupName}
                  onChange={(e) => setNewSupName(e.target.value)}
                  placeholder="उदा: बालाजी ट्रेडर्स"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    {isHi ? 'कंपनी का नाम' : 'Company Name'}
                  </label>
                  <input
                    type="text"
                    value={newSupCompany}
                    onChange={(e) => setNewSupCompany(e.target.value)}
                    placeholder="उदा: Parle Products"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    {isHi ? 'मोबाइल नंबर (WhatsApp) *' : 'WhatsApp Phone *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={newSupPhone}
                    onChange={(e) => setNewSupPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    {isHi ? 'संपर्क व्यक्ति' : 'Contact Person'}
                  </label>
                  <input
                    type="text"
                    value={newSupContact}
                    onChange={(e) => setNewSupContact(e.target.value)}
                    placeholder="राकेश जी"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-700 block mb-1">
                    {isHi ? 'सप्लाई ब्रांड्स (कॉमा लगाकर)' : 'Brands (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={newSupBrands}
                    onChange={(e) => setNewSupBrands(e.target.value)}
                    placeholder="Parle-G, 20-20, Monaco"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-700 block mb-1">
                  {isHi ? 'गोदाम / ऑफिस का पता' : 'Warehouse / Office Address'}
                </label>
                <input
                  type="text"
                  value={newSupAddress}
                  onChange={(e) => setNewSupAddress(e.target.value)}
                  placeholder="दुकान 15, ट्रांसपोर्ट नगर"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddSupplierOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold cursor-pointer"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  {isHi ? 'सप्लायर सेव करें' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
