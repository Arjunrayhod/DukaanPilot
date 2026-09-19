import React, { useState } from 'react';
import {
  X,
  Gift,
  MessageSquare,
  Award,
  Copy,
  Check,
  Phone,
  Tag,
  Send,
  Plus
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import {
  FESTIVE_COUPONS,
  INITIAL_LOYALTY_ACCOUNTS,
  PromoCoupon,
  LoyaltyAccount,
  formatPromoBroadcastMessage,
  generatePromoWhatsAppUrl
} from '../utils/loyaltyService';
import { speakHindi } from '../utils/voiceFeedback';

interface PromotionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Lang;
  shopInfo?: {
    name: string;
    phone: string;
  };
}

export const PromotionsModal: React.FC<PromotionsModalProps> = ({
  isOpen,
  onClose,
  lang,
  shopInfo = { name: 'श्री गणेश किराना स्टोर', phone: '+91 98765 43210' }
}) => {
  const isHi = lang === 'hi';

  const [activeTab, setActiveTab] = useState<'coupons' | 'loyalty' | 'broadcast'>('coupons');
  const [coupons, setCoupons] = useState<PromoCoupon[]>(FESTIVE_COUPONS);
  const [selectedCoupon, setSelectedCoupon] = useState<PromoCoupon>(FESTIVE_COUPONS[0]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  // Loyalty search
  const [searchPhone, setSearchPhone] = useState('9841029862');
  const [searchedAccount, setSearchedAccount] = useState<LoyaltyAccount | null>(
    INITIAL_LOYALTY_ACCOUNTS['9841029862'] || null
  );

  // Broadcast state
  const [broadcastPhone, setBroadcastPhone] = useState('9841029862');
  const [customMsgSent, setCustomMsgSent] = useState(false);

  // New coupon form
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newTitleHindi, setNewTitleHindi] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newDiscount, setNewDiscount] = useState('10');
  const [newMinOrder, setNewMinOrder] = useState('499');

  if (!isOpen) return null;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
    speakHindi(isHi ? `कूपन कोड ${code} कॉपी हुआ` : `Coupon code ${code} copied`);
  };

  const handleSearchLoyalty = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchPhone.replace(/[^\d]/g, '');
    const found = INITIAL_LOYALTY_ACCOUNTS[clean] || null;
    setSearchedAccount(found);
    if (!found) {
      speakHindi(isHi ? 'कोई लॉयल्टी खाता नहीं मिला' : 'No loyalty account found');
    } else {
      speakHindi(isHi ? `${found.customerName} के पास ${found.points} रिवॉर्ड पॉइंट्स हैं` : `${found.points} points found`);
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;

    const created: PromoCoupon = {
      code: newCode.trim().toUpperCase(),
      title: newTitleHindi || newCode,
      titleHindi: newTitleHindi || newCode,
      description: newDesc || `₹${newMinOrder} पर विशेष छूट`,
      discountType: 'PERCENTAGE',
      discountValue: parseFloat(newDiscount) || 10,
      minOrderValue: parseFloat(newMinOrder) || 0,
      validTill: '31/10/2026'
    };

    setCoupons(prev => [created, ...prev]);
    setSelectedCoupon(created);
    setIsAddingCoupon(false);
    setNewCode('');
    setNewTitleHindi('');
    setNewDesc('');
    speakHindi(isHi ? 'नया त्योहारी कूपन सक्रिय किया गया' : 'New promo coupon created');
  };

  const handleSendWhatsAppBroadcast = () => {
    const url = generatePromoWhatsAppUrl(broadcastPhone, selectedCoupon, shopInfo, lang);
    window.open(url, '_blank');
    setCustomMsgSent(true);
    setTimeout(() => setCustomMsgSent(false), 3000);
    speakHindi(isHi ? 'WhatsApp ऑफर संदेश भेजा गया' : 'WhatsApp promo broadcast sent');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 font-black flex items-center justify-center shadow-md">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {isHi ? 'त्योहारी कूपन, लॉयल्टी व WhatsApp प्रचार' : 'Festive Offers & Loyalty Rewards'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] font-bold">
                  {isHi ? 'फेस्टिव सीजन' : 'Festive Season'}
                </span>
              </div>
              <p className="text-xs text-purple-200 mt-0.5">
                {isHi ? 'ग्राहकों को 1-क्लिक WhatsApp ऑफर भेजें और रिवॉर्ड पॉइंट्स ट्रैक करें' : 'Send 1-click WhatsApp promos and track customer loyalty'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher Strip */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex items-center gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-white text-purple-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-3.5 h-3.5 text-purple-600" />
            <span>{isHi ? 'त्योहारी कूपन कोड' : 'Festive Coupons'} ({coupons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('loyalty')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'loyalty'
                ? 'bg-white text-purple-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHi ? 'ग्राहक लॉयल्टी रिवॉर्ड्स' : 'Customer Loyalty Points'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'broadcast'
                ? 'bg-white text-purple-900 shadow-sm border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isHi ? 'WhatsApp ब्रॉडकास्ट' : 'WhatsApp Broadcast'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* TAB 1: FESTIVE COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  {isHi ? 'सक्रिय त्योहारी डिस्काउंट कूपन' : 'Active Festive Coupons'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsAddingCoupon(!isAddingCoupon)}
                  className="px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>{isHi ? '+ नया कूपन' : '+ New Coupon'}</span>
                </button>
              </div>

              {/* Add Coupon Inline Form */}
              {isAddingCoupon && (
                <form onSubmit={handleCreateCoupon} className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-3 text-xs">
                  <span className="font-bold text-purple-950 block">
                    {isHi ? 'नया डिस्काउंट कूपन बनाएं:' : 'Create New Festive Coupon:'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-600 font-bold block mb-0.5">
                        {isHi ? 'कूपन कोड (उदा. DIWALI20):' : 'Coupon Code:'}
                      </label>
                      <input
                        type="text"
                        value={newCode}
                        onChange={e => setNewCode(e.target.value)}
                        placeholder="DIWALI20"
                        className="w-full p-2 bg-white border border-purple-300 rounded-xl font-mono font-bold uppercase text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-bold block mb-0.5">
                        {isHi ? 'ऑफर शीर्षक (हिंदी):' : 'Offer Title:'}
                      </label>
                      <input
                        type="text"
                        value={newTitleHindi}
                        onChange={e => setNewTitleHindi(e.target.value)}
                        placeholder="दिवाली स्पेशल 20% छूट"
                        className="w-full p-2 bg-white border border-purple-300 rounded-xl font-semibold text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-bold block mb-0.5">
                        {isHi ? 'छूट (% या ₹):' : 'Discount Value:'}
                      </label>
                      <input
                        type="number"
                        value={newDiscount}
                        onChange={e => setNewDiscount(e.target.value)}
                        placeholder="10"
                        className="w-full p-2 bg-white border border-purple-300 rounded-xl font-bold font-mono text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-600 font-bold block mb-0.5">
                        {isHi ? 'न्यूनतम ऑर्डर मूल्य (₹):' : 'Min Order Value (₹):'}
                      </label>
                      <input
                        type="number"
                        value={newMinOrder}
                        onChange={e => setNewMinOrder(e.target.value)}
                        placeholder="499"
                        className="w-full p-2 bg-white border border-purple-300 rounded-xl font-bold font-mono text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingCoupon(false)}
                      className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                    >
                      {isHi ? 'रद्द करें' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs shadow-md cursor-pointer"
                    >
                      {isHi ? 'कूपन सेव करें' : 'Save Coupon'}
                    </button>
                  </div>
                </form>
              )}

              {/* Coupons List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {coupons.map((c) => {
                  const isCopied = copiedCode === c.code;
                  return (
                    <div
                      key={c.code}
                      className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 via-white to-slate-50 border border-purple-200 shadow-sm relative space-y-2.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-purple-900 text-white font-mono font-black text-xs tracking-wider">
                            {c.code}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {isHi ? 'वैध' : 'Valid'}: {c.validTill}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-sm mt-2">
                          {isHi ? c.titleHindi : c.title}
                        </h5>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {c.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-purple-100">
                        <button
                          type="button"
                          onClick={() => handleCopyCode(c.code)}
                          className="flex-1 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">{isHi ? 'कॉपी हुआ' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>{isHi ? 'कोड कॉपी करें' : 'Copy Code'}</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCoupon(c);
                            setActiveTab('broadcast');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 shadow-sm cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{isHi ? 'WhatsApp प्रचार' : 'Broadcast'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: LOYALTY REWARDS LOOKUP */}
          {activeTab === 'loyalty' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
                <Award className="w-8 h-8 text-amber-600 shrink-0" />
                <div>
                  <h5 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                    {isHi ? 'किराना लॉयल्टी प्रोग्राम नियम' : 'Loyalty Reward Rules'}
                  </h5>
                  <p className="text-xs text-slate-600">
                    {isHi
                      ? 'प्रत्येक ₹100 की खरीदारी पर ग्राहक को 1 रिवॉर्ड पॉइंट मिलता है (1 पॉइंट = ₹1 नकद छूट)'
                      : 'Earn 1 Loyalty Point per ₹100 spent (1 point = ₹1 direct discount on next POS bill)'}
                  </p>
                </div>
              </div>

              {/* Phone Search Form */}
              <form onSubmit={handleSearchLoyalty} className="flex gap-2">
                <div className="relative flex-1">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchPhone}
                    onChange={e => setSearchPhone(e.target.value)}
                    placeholder={isHi ? 'ग्राहक का 10-अंकीय मोबाइल नंबर...' : 'Enter customer mobile number...'}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-600"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-md cursor-pointer hover:bg-slate-800"
                >
                  {isHi ? 'पॉइंट्स जांचें' : 'Check Points'}
                </button>
              </form>

              {/* Searched Account Card */}
              {searchedAccount ? (
                <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">
                        {searchedAccount.customerName}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        {searchedAccount.phone}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        {isHi ? 'उपलब्ध पॉइंट्स (छूट)' : 'Available Points'}
                      </span>
                      <span className="text-2xl font-black font-mono text-amber-600">
                        {searchedAccount.points} pts (₹{searchedAccount.points})
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {isHi ? 'कुल अर्जित' : 'Total Earned'}
                      </span>
                      <span className="text-sm font-black font-mono text-slate-900">
                        {searchedAccount.totalEarned} pts
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {isHi ? 'रिडीम किए गए' : 'Redeemed'}
                      </span>
                      <span className="text-sm font-black font-mono text-emerald-600">
                        ₹{searchedAccount.totalRedeemed}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-[10px] text-slate-500 font-bold block">
                        {isHi ? 'अंतिम सक्रियता' : 'Last Active'}
                      </span>
                      <span className="text-xs font-bold font-mono text-slate-700">
                        {searchedAccount.lastActive}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-200">
                  {isHi ? 'इस मोबाइल नंबर पर कोई पुराना लॉयल्टी खाता नहीं मिला।' : 'No loyalty account found for this number.'}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WHATSAPP PROMO BROADCAST */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Settings */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {isHi ? 'ऑफर कूपन चुनें:' : 'Select Promo Offer:'}
                    </label>
                    <select
                      value={selectedCoupon.code}
                      onChange={e => {
                        const found = coupons.find(c => c.code === e.target.value);
                        if (found) setSelectedCoupon(found);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-purple-600"
                    >
                      {coupons.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.code} - {isHi ? c.titleHindi : c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {isHi ? 'ग्राहक का व्हाट्सएप नंबर:' : 'Customer WhatsApp Phone:'}
                    </label>
                    <input
                      type="text"
                      value={broadcastPhone}
                      onChange={e => setBroadcastPhone(e.target.value)}
                      placeholder="9841029862"
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-purple-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendWhatsAppBroadcast}
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isHi ? 'WhatsApp पर ऑफर संदेश भेजें' : 'Send WhatsApp Promo Now'}</span>
                  </button>

                  {customMsgSent && (
                    <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{isHi ? 'WhatsApp चैट खुल रही है...' : 'Opening WhatsApp chat...'}</span>
                    </div>
                  )}
                </div>

                {/* Right: Message Preview Bubble */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {isHi ? 'व्हाट्सएप संदेश पूर्वावलोकन:' : 'WhatsApp Message Preview:'}
                  </label>
                  <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 font-mono text-xs text-slate-800 whitespace-pre-line shadow-inner max-h-[260px] overflow-y-auto leading-relaxed">
                    {formatPromoBroadcastMessage(selectedCoupon, shopInfo, lang)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-[11px] text-slate-500 font-medium">
            {isHi ? '100% स्वच्छ हिंदी व पारदर्शी लॉयल्टी इंजन' : '100% clean localization & loyalty engine'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            {isHi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
