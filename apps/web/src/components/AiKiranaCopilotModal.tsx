import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  MessageSquare,
  ShoppingCart,
  Send,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  X,
  Plus,
  Trash2,
  ListPlus,
  HelpCircle
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import {
  parseWhatsAppGroceryList,
  askKiranaAiCopilot,
  ParsedGroceryItem
} from '../utils/aiCopilotService';
import { useTodaySales } from '../utils/salesService';
import { getKhataCustomers } from '../utils/khataService';
import { getInventoryItems, getExpiryStatus, InventoryItem } from '../utils/inventoryService';
import { getStoredInwardEntries, PurchaseInwardEntry } from '../utils/inwardService';
import { speakHindi } from '../utils/voiceFeedback';

interface AiKiranaCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  products?: any[];
  onLoadCartItems?: (items: Array<{ id: string; name: string; hindi?: string; qty: number; price: number; unit: string }>) => void;
  onNavigateTab?: (tab: string) => void;
  shopName?: string;
}

export function AiKiranaCopilotModal({
  isOpen,
  onClose,
  lang,
  products = [],
  onLoadCartItems,
  onNavigateTab,
  shopName = 'श्री गणेश किराना स्टोर'
}: AiKiranaCopilotModalProps) {
  const isHi = lang === 'hi';
  const [activeMode, setActiveMode] = useState<'CHAT' | 'WHATSAPP_LIST'>('WHATSAPP_LIST');

  // WhatsApp List State
  const [rawListText, setRawListText] = useState(
    `Bhaiya ye saman bhej do:\n- 2 packet amul milk\n- 1kg madhur cheeni\n- 1 bag aashirvaad atta\n- 1 bottle fortune tel\n- 2 packet parle g`
  );
  const [parsedItems, setParsedItems] = useState<ParsedGroceryItem[]>([]);
  const [unmatched, setUnmatched] = useState<string[]>([]);
  const [isParsed, setIsParsed] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; actionTitle?: string; actionTab?: string }>>([
    {
      sender: 'bot',
      text: isHi
        ? `🤖 नमस्ते! मैं आपका AI किराना कोपायलट हूँ। मुझसे आज की बिक्री, उधारी, या व्हाट्सएप सामान लिस्ट से बिल बनाने के बारे में कुछ भी पूछें।`
        : `🤖 Hello! I am your AI Kirana Copilot. Ask me about today's sales, khata collection, or convert WhatsApp grocery lists into POS bills.`
    }
  ]);

  const { summary } = useTodaySales();
  const customers = getKhataCustomers();
  const inventory = getInventoryItems();
  const purchases = getStoredInwardEntries();
  const activeCatalog = products.length > 0 ? products : inventory;

  if (!isOpen) return null;

  const handleParseList = () => {
    if (!rawListText.trim()) return;
    const result = parseWhatsAppGroceryList(rawListText, activeCatalog);
    setParsedItems(result.matchedItems);
    setUnmatched(result.unmatchedLines);
    setIsParsed(true);
    speakHindi(
      isHi
        ? `${result.matchedItems.length} सामान की पहचान हो गई है`
        : `Identified ${result.matchedItems.length} items from list`
    );
  };

  const handleApplyToPos = () => {
    if (parsedItems.length === 0 || !onLoadCartItems) return;
    onLoadCartItems(
      parsedItems.map((p) => ({
        id: p.id,
        name: p.name,
        hindi: p.hindiName,
        qty: p.qty,
        price: p.price,
        unit: p.unit
      }))
    );
    speakHindi(isHi ? 'सामान सीधे POS कार्ट में लोड हो गए हैं' : 'Items loaded into POS cart');
    onClose();
    if (onNavigateTab) onNavigateTab('pos');
  };

  const handleSendChat = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const overdueSorted = [...customers].sort((a, b) => b.currentDue - a.currentDue);
    const topOverdue = overdueSorted.length > 0 && overdueSorted[0].currentDue > 0
      ? { name: overdueSorted[0].name, due: overdueSorted[0].currentDue }
      : undefined;

    const totalKhataDue = customers.reduce((s, c) => s + c.currentDue, 0);
    const lowStockCount = inventory.filter((i) => i.currentStock <= i.minThreshold).length;
    const nearExpiryCount = inventory.filter((i) => {
      const status = getExpiryStatus(i.expiryDate);
      return status === 'NEAR_EXPIRY' || status === 'EXPIRED';
    }).length;
    const supplierPendingDue = purchases.reduce((s: number, p: PurchaseInwardEntry) => s + (p.pendingAmount || 0), 0);

    const botResponse = askKiranaAiCopilot(
      query,
      {
        todaySales: summary.totalSales,
        todayBills: summary.totalBills,
        totalProfit: summary.grossProfit,
        totalKhataDue,
        topOverdueCustomer: topOverdue,
        lowStockCount,
        nearExpiryCount,
        supplierPendingDue,
        shopName
      },
      lang === 'hi' ? 'hi' : 'en'
    );

    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: query },
      {
        sender: 'bot',
        text: botResponse.reply,
        actionTitle: botResponse.actionTitle,
        actionTab: botResponse.actionTab
      }
    ]);

    setChatInput('');
    speakHindi(botResponse.reply);
  };

  const quickQuestions = [
    { label: isHi ? '📊 आज की कुल बिक्री व मुनाफा?' : "Today's sales & profit?", query: 'aaj ka sale kitna hai' },
    { label: isHi ? '📖 किसका उधार बकाया है?' : 'Who owes khata due?', query: 'udhar ka kitna baki hai' },
    { label: isHi ? '⚠️ कौन सा सामान एक्सपायर होगा?' : 'Near expiry stock?', query: 'expiry kab hai' },
    { label: isHi ? '📦 किस सामान का स्टॉक कम है?' : 'Low stock items?', query: 'kam stock kiska hai' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
                <Sparkles className="w-6 h-6 text-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold">
                  <Zap className="w-3 h-3 text-amber-400" />
                  <span>DukaanPilot AI Copilot</span>
                </div>
                <h3 className="text-lg font-black font-display tracking-tight text-white mt-0.5">
                  {isHi ? 'AI किराना कोपायलट व स्मार्ट WhatsApp पार्सर' : 'AI Kirana Copilot & WhatsApp Parser'}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-white/10 rounded-2xl mt-4 border border-white/15">
            <button
              type="button"
              onClick={() => setActiveMode('WHATSAPP_LIST')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'WHATSAPP_LIST'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ListPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isHi ? '📋 WhatsApp लिस्ट से बिल' : 'WhatsApp List to Bill'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('CHAT')}
              className={`py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeMode === 'CHAT'
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-blue-600" />
              <span>{isHi ? '💬 AI बिजनेस असिस्टेंट' : 'AI Business Assistant'}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {activeMode === 'WHATSAPP_LIST' ? (
            <div className="space-y-4">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl text-xs text-indigo-950 flex items-start gap-2.5">
                <MessageSquare className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">{isHi ? 'WhatsApp से सीधा बिल बनाएं:' : 'Direct WhatsApp Bill Conversion:'}</span>
                  <span className="text-slate-600">
                    {isHi
                      ? 'ग्राहक द्वारा WhatsApp पर भेजी गई किराने की लिस्ट यहाँ पेस्ट करें। AI इसे तुरंत POS बिल में बदल देगा।'
                      : 'Paste raw customer grocery lists received on WhatsApp. AI will match catalog & prepare POS cart.'}
                  </span>
                </div>
              </div>

              {/* Textarea Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {isHi ? 'ग्राहक का WhatsApp मैसेज / सामान लिस्ट:' : 'Customer WhatsApp Message / Item List:'}
                </label>
                <textarea
                  rows={4}
                  value={rawListText}
                  onChange={(e) => setRawListText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all resize-none"
                  placeholder="e.g. 2 packet doodh, 1kg cheeni, 10kg atta..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleParseList}
                  className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-black shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{isHi ? '⚡ AI से सामान की पहचान करें (Identify Items)' : '⚡ Parse & Match Items'}</span>
                </button>
              </div>

              {/* Parsed Result Preview */}
              {isParsed && (
                <div className="space-y-3 pt-2 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>{isHi ? `पहचाने गए सामान (${parsedItems.length})` : `Matched Products (${parsedItems.length})`}</span>
                    </span>
                    <span className="text-sm font-black font-mono text-slate-900">
                      ₹{parsedItems.reduce((s, i) => s + i.total, 0).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {parsedItems.length === 0 ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium text-center">
                      {isHi ? 'दिए गए मैसेज में किसी सामान का मिलान नहीं हो सका।' : 'No catalog items could be matched.'}
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 max-h-56 overflow-y-auto">
                      {parsedItems.map((item, idx) => (
                        <div key={idx} className="p-2.5 flex items-center justify-between gap-2 text-xs">
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {item.hindiName || item.name}
                            </div>
                            <div className="text-slate-500 text-[11px] font-mono">
                              {item.qty} {item.unit} x ₹{item.price}
                            </div>
                          </div>

                          <div className="text-right font-black font-mono text-slate-900 shrink-0">
                            ₹{item.total}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {unmatched.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                      <span className="font-bold block flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        {isHi ? 'अपुष्ट लाइनें (Manual Review):' : 'Unmatched Lines:'}
                      </span>
                      <ul className="list-disc pl-4 text-[11px] text-amber-800 space-y-0.5 font-mono">
                        {unmatched.map((u, i) => (
                          <li key={i}>{u}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {parsedItems.length > 0 && (
                    <button
                      type="button"
                      onClick={handleApplyToPos}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                    >
                      <ShoppingCart className="w-4 h-4 text-slate-950" />
                      <span>{isHi ? '🛒 सीधे POS काउंटर कार्ट में लोड करें' : '🛒 Load into POS Billing Cart'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* AI Business Chatbot View */
            <div className="space-y-4 flex flex-col h-full min-h-[320px]">
              {/* Quick Question Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSendChat(q.query)}
                    className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-bold whitespace-nowrap border border-indigo-200/80 transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Chat Thread */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl text-xs space-y-2 shadow-xs ${
                        msg.sender === 'user'
                          ? 'bg-blue-900 text-white rounded-br-none'
                          : 'bg-slate-100 text-slate-900 border border-slate-200 rounded-bl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      {msg.actionTitle && msg.actionTab && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            if (onNavigateTab) onNavigateTab(msg.actionTab!);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors cursor-pointer mt-1"
                        >
                          <span>{msg.actionTitle}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendChat();
                  }}
                  placeholder={isHi ? 'किराना AI से पूछें...' : 'Ask Kirana Copilot...'}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => handleSendChat()}
                  className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
