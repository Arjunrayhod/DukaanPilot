import React, { useState } from 'react';
import { Store, User, Phone, KeyRound, ShieldCheck, ArrowRight, UserCheck } from 'lucide-react';
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
        khataDue: 1250,
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
        // Customer login
        onSuccess({
          user: {
            id: 'usr_cust_01',
            name: name || 'रमेश कुमार',
            phone: phone,
            role: 'CUSTOMER',
            khataDue: 1250,
          },
          shop: {
            id: 'shp_01',
            name: 'Shree Ganesh Kirana',
            upiId: 'shreeganesh@sbi',
          },
        });
        onClose();
      } else {
        // Owner login
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
            // Fallback for fast demo login
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
        {/* Role Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setRoleTab('OWNER');
              setPhone('9876543210');
              setName('Ramesh Ganesh');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'OWNER'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>🏪 दुकानदार (Shopkeeper)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setRoleTab('CUSTOMER');
              setPhone('9823456789');
              setName('रमेश कुमार (Ramesh Kumar)');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              roleTab === 'CUSTOMER'
                ? 'bg-blue-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>👤 ग्राहक (Customer)</span>
          </button>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold font-display text-slate-900">
            {roleTab === 'OWNER'
              ? (isRegister ? 'Register Store (दुकानदार नया खाता)' : 'Merchant Fast Login (दुकानदार लॉगिन)')
              : 'Customer Fast Login (ग्राहक लॉगिन)'}
          </h3>
          <p className="text-xs text-slate-500">
            {roleTab === 'OWNER'
              ? 'AI-Powered Business OS for Kirana & Counter POS'
              : 'View your personal Khata ledger, bills, and order from Shree Ganesh Kirana'}
          </p>
        </div>

        {/* 1-Tap Demo Quick Buttons */}
        <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-2 text-xs">
          <div className="font-bold text-blue-950 flex items-center gap-1.5">
            <UserCheck className="w-4 h-4 text-blue-700" />
            <span>1-क्लिक फास्ट डेमो लॉगिन (Quick Demo):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoOwner}
              className="p-2 rounded-xl bg-white border border-blue-200 text-blue-900 hover:bg-blue-100 text-[11px] font-bold shadow-xs text-left cursor-pointer"
            >
              🏪 दुकानदार (Owner)
              <span className="block text-[10px] text-slate-500 font-normal">Full POS & OS</span>
            </button>
            <button
              type="button"
              onClick={handleQuickDemoCustomer}
              className="p-2 rounded-xl bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-50 text-[11px] font-bold shadow-xs text-left cursor-pointer"
            >
              👤 ग्राहक (Ramesh Kumar)
              <span className="block text-[10px] text-slate-500 font-normal">₹1,250 Khata Due</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {roleTab === 'OWNER' && isRegister && (
            <>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Store Name (दुकान का नाम)</label>
                <input
                  type="text"
                  required
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="e.g. Shree Ganesh Kirana"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Owner Name (नाम)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  placeholder="e.g. Ramesh Ganesh"
                />
              </div>
            </>
          )}

          {roleTab === 'CUSTOMER' && (
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Customer Name (ग्राहक का नाम)</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                placeholder="e.g. Ramesh Kumar"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mobile Number (मोबाइल नंबर)</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                placeholder="10-digit number"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {roleTab === 'OWNER' ? '4-Digit Fast PIN' : 'OTP / PIN'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                maxLength={6}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs tracking-widest font-mono font-bold"
                placeholder="••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? 'Authenticating...' : roleTab === 'OWNER' ? (isRegister ? 'Register & Setup Shop' : 'Login as Shopkeeper') : 'Login as Customer'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
          {roleTab === 'OWNER' ? (
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-700 hover:underline font-bold"
            >
              {isRegister ? 'Already registered? Login here' : 'New shop? Register Store'}
            </button>
          ) : (
            <span className="text-slate-400">Customer Mode &bull; Connected to Shree Ganesh Kirana</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
