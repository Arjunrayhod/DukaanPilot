import React, { useState } from 'react';
import { AlertTriangle, Truck, Check, ArrowRight, MessageSquare } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';
import { 
  Supplier, 
  RestockItem, 
  INITIAL_SUPPLIERS, 
  INITIAL_LOW_STOCK_ITEMS,
  PurchaseOrder 
} from '../utils/restockService';
import { SupplierOrderModal } from './SupplierOrderModal';

interface LowStockAlertsProps {
  lang: Lang;
  onOpenSupplierManager?: () => void;
}

export function LowStockAlerts({ lang, onOpenSupplierManager }: LowStockAlertsProps) {
  const t = translations[lang];
  const isHi = lang === 'hi';

  const [orderedItemIds, setOrderedItemIds] = useState<string[]>([]);
  const [selectedSupplierForPO, setSelectedSupplierForPO] = useState<Supplier | null>(null);
  const [selectedPOItems, setSelectedPOItems] = useState<RestockItem[]>([]);

  const handleOpenPO = (item: RestockItem) => {
    const supplier = INITIAL_SUPPLIERS.find((s) => s.id === item.supplierId) || INITIAL_SUPPLIERS[0];
    setSelectedSupplierForPO(supplier);
    setSelectedPOItems([item]);
  };

  return (
    <section className="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-all space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-600 shrink-0 shadow-sm">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-base font-extrabold text-slate-900 truncate font-display tracking-tight">{t.lowStockTitle}</h3>
            <span className="text-xs text-slate-400 font-medium">{t.lowStockSub}</span>
          </div>
        </div>
        <span className="px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-black font-mono">
          {INITIAL_LOW_STOCK_ITEMS.length} {t.itemsLow}
        </span>
      </div>

      <div className="space-y-3 pt-1">
        {INITIAL_LOW_STOCK_ITEMS.slice(0, 3).map((item) => {
          const isOrdered = orderedItemIds.includes(item.id);
          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-4 hover:bg-slate-50 transition-all shadow-xs"
            >
              <div className="min-w-0 flex-1">
                <div className="text-sm font-bold text-slate-900 truncate font-display">
                  {isHi && item.nameHindi ? item.nameHindi : item.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                  <span className="text-rose-600 font-black font-mono">{item.currentStock} {item.unit} {t.packetsLeft}</span>
                  <span className="text-slate-400">({t.minText} {item.minThreshold})</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-0.5 truncate">
                  {t.supplier}: <span className="text-slate-700 font-semibold">{item.supplierName}</span>
                </span>
              </div>

              <button
                onClick={() => handleOpenPO(item)}
                className={`h-9 px-4 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer ${
                  isOrdered
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                    : 'bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-xl border border-white/15 active:scale-95'
                }`}
                type="button"
              >
                {isOrdered ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.orderedBtn}</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                    <span>+{item.suggestedOrderQty} {t.orderBtn}</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={() => {
          if (onOpenSupplierManager) {
            onOpenSupplierManager();
          }
        }}
        className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        type="button"
      >
        <span>{isHi ? 'सभी सप्लायर व री-स्टॉक देखें (Manage All Suppliers & Restock)' : 'Manage All Suppliers & Restock'}</span>
        <ArrowRight className="w-4 h-4 text-slate-500" />
      </button>

      {/* Interactive PO Modal */}
      {selectedSupplierForPO && (
        <SupplierOrderModal
          isOpen={!!selectedSupplierForPO}
          onClose={() => setSelectedSupplierForPO(null)}
          supplier={selectedSupplierForPO}
          items={selectedPOItems}
          lang={lang}
          onOrderPlaced={() => {
            setOrderedItemIds((prev) => [...prev, ...selectedPOItems.map((i) => i.id)]);
            setSelectedSupplierForPO(null);
          }}
        />
      )}
    </section>
  );
}