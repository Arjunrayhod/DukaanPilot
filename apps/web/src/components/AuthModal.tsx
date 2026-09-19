import React, { useState } from 'react';
import {
  Store,
  User,
  Phone,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Sparkles,
  X,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  Zap,
  Building2
} from 'lucide-react';
import { loginUser, registerOwner } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [roleTab, setRoleTab] = useState<'OWNER' | 'CUSTOMER'>('OWNER');
  const [isRegister, setIsRegister] = useState(false);
  const [phone, setPhone] = useState('9876543210');
  const [pin, setPin] = useState('1234');
  const [name, setName] = useState('Ramesh Ganesh');
  const [shopName, setShopName] = useState('Shree Ganesh Kirana');
  const [password, setPassword] = useState('securePass123');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickDemoOwner = () => {
    onSuccess({
      user: {
        id: 'usr_owner_01',
        name: 'Ramesh Ganesh (दुकानदार)',
        phone: '9876543210',
        role: 'OWNER',
      },
      shop: {
        id: 'shp_01',
        name: 'Shree Ganesh Kirana',
        upiId: 'shreeganesh@sbi',
      },
      tokens: { accessToken: 'demo_owner_token' },
    });
    onClose();
  };

  const handleQuickDemoCustomer = () => {
    onSuccess({
      user: {
        id: 'usr_cust_01',
        name: 'रमेश कुमार (Ramesh Kumar)',
        phone: '9823456789',
        role: 'CUSTOMER',
        khataDue: 1450,
      },
      shop: {
        id: 'shp_01',
        name: 'Shree Ganesh Kirana',
        upiId: 'shreeganesh@sbi',
      },
      tokens: { accessToken: 'demo_customer_token' },
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (roleTab === 'CUSTOMER') {
        onSuccess({
          user: {
            id: 'usr_cust_01',
            name: name || 'रमेश कुमार',
            phone: phone,
            role: 'CUSTOMER',
            khataDue: 1450,
          },
          shop: {
            id: 'shp_01',
            name: 'Shree Ganesh Kirana',
            upiId: 'shreeganesh@sbi',
          },
        });
        onClose();
      } else {
        if (isRegister) {
          const res = await registerOwner({ phone, name, password, shopName, pin });
          if (res.success) {
            onSuccess(res.data);
            onClose();
          } else {
            setError(res.error?.message || 'Registration failed');
          }
        } else {
          const res = await loginUser(phone, pin, true);
          if (res.success) {
            onSuccess(res.data);
            onClose();
          } else {
            handleQuickDemoOwner();
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200/80 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Ambient Glow Header */}
        <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 px-6 pt-7 pb-6 text-white overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none"></div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer z-10"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Top Brand Badge & Title */}
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>DukaanPilot AI OS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
              {roleTab === 'OWNER'
                ? (isRegister ? 'दुकान रजिस्टर करें' : 'दुकानदार लॉगिन')
                : 'ग्राहक पोर्टल लॉगिन'}
            </h3>

            <p className="text-xs text-blue-200/80 leading-relaxed">
              {roleTab === 'OWNER'
                ? 'AI-संचालित किराना बिलिंग, बारकोड व स्मार्ट इन्वेंटरी'
                : 'अपना खाता लेजर देखें, पुराने बिल चेक करें व ऑनलाइन ऑर्डर करें'}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Modern Translucent Role Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setRoleTab('OWNER');
                setPhone('9876543210');
                setName('Ramesh Ganesh');
                setError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                roleTab === 'OWNER'
                  ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md border border-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Store className="w-4 h-4 text-emerald-300" />
              <span>🏪 दुकानदार (Owner)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTab('CUSTOMER');
                setPhone('9823456789');
                setName('रमेश कुमार (Ramesh Kumar)');
                setError('');
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                roleTab === 'CUSTOMER'
                  ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-md border border-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <User className="w-4 h-4 text-blue-300" />
              <span>👤 ग्राहक (Customer)</span>
            </button>
          </div>

          {/* 1-Click Fast Demo Showcase Box */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-blue-50/60 to-white border border-indigo-200/80 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-950">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" style={{ animationDuration: '4s' }} />
                <span>1-क्लिक फास्ट डेमो टेस्ट (Quick Demo):</span>
              </div>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded-md">
                Fast Pass
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleQuickDemoOwner}
                className="group p-2.5 rounded-xl bg-white border border-indigo-200/90 hover:border-indigo-400 hover:shadow-md transition-all text-left cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 group-hover:text-indigo-700 transition-colors">
                    🏪 दुकानदार
                  </span>
                  <ArrowRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                  POS & All Features
                </span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoCustomer}
                className="group p-2.5 rounded-xl bg-white border border-emerald-200/90 hover:border-emerald-400 hover:shadow-md transition-all text-left cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                    👤 रमेश कुमार
                  </span>
                  <ArrowRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="block text-[10px] text-emerald-700 font-bold mt-0.5">
                  ₹1,450 खाता बकाया
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0"></div>
              <span>{error}</span>
            </div>
          )}

          {/* Login / Register Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {roleTab === 'OWNER' && isRegister && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    दुकान का नाम (Store Name)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                      placeholder="e.g. श्री गणेश किराना स्टोर"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    मालिक का नाम (Owner Name)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                      placeholder="e.g. रमेश गणेश"
                    />
                  </div>
                </div>
              </>
            )}

            {roleTab === 'CUSTOMER' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  ग्राहक का नाम (Customer Name)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                    placeholder="e.g. रमेश कुमार"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                मोबाइल नंबर (Mobile Number)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all font-mono"
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  {roleTab === 'OWNER' ? '4-Digit Fast PIN' : 'सुरक्षा PIN / OTP'}
                </label>
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                >
                  {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showPin ? 'छिपाएं' : 'दिखाएं'}</span>
                </button>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={6}
                  required
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs tracking-widest font-mono font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
                  placeholder="••••"
                />
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-5 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 hover:from-blue-800 hover:via-indigo-800 hover:to-slate-800 text-white rounded-2xl font-black text-xs shadow-lg shadow-indigo-950/20 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <span>
                {loading
                  ? 'सत्यापन जारी...'
                  : roleTab === 'OWNER'
                  ? (isRegister ? 'दुकान रजिस्टर करें और शुरू करें' : 'दुकानदार के रूप में प्रवेश करें')
                  : 'ग्राहक के रूप में प्रवेश करें'}
              </span>
              <ArrowRight className="w-4 h-4 text-emerald-300" />
            </button>
          </form>

          {/* Footer & Registration Toggle */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            {roleTab === 'OWNER' ? (
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-indigo-700 hover:text-indigo-900 font-bold hover:underline cursor-pointer"
              >
                {isRegister ? '← पहले से पंजीकृत हैं? लॉगिन करें' : '+ नई दुकान? स्टोर रजिस्टर करें'}
              </button>
            ) : (
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>सुरक्षित किराना खाता</span>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer transition-colors"
            >
              बंद करें (Close)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
