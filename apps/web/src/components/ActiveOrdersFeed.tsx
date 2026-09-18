import React from 'react';
import { ShoppingBag, Clock, CheckCircle, Truck, Package } from 'lucide-react';

export const ActiveOrdersFeed: React.FC = () => {
  const orders = [
    {
      id: '#1042',
      customer: 'Vikram Verma',
      items: '4 items (?420)',
      type: 'Delivery in 15 mins',
      status: 'Ready for Dispatch',
      badgeColor: 'bg-green-100 text-green-800',
    },
    {
      id: '#1041',
      customer: 'Sunita Devi',
      items: '2 items (?180)',
      type: 'Self-Pickup',
      status: 'Packed',
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: '#1040',
      customer: 'Amit Patel',
      items: '6 items (?1,150)',
      type: 'Home Delivery',
      status: 'Preparing',
      badgeColor: 'bg-amber-100 text-amber-800',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">
              Active Customer Orders • ?????? ???????
            </h3>
            <span className="text-xs text-slate-500">3 pending orders for store pickup & delivery</span>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
          3 Active
        </span>
      </div>

      <div className="space-y-2.5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50"
          >
            <div className="space-y-0.5">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-slate-900">{order.id} • {order.customer}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${order.badgeColor}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                <span>{order.items}</span>
                <span>•</span>
                <span className="flex items-center text-slate-700 font-medium">
                  <Clock className="w-3 h-3 mr-1 text-slate-400" />
                  {order.type}
                </span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              Update
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
