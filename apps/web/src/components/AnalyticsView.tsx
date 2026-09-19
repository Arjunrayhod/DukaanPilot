import React, { useState } from 'react';
import { 
  TrendingUp, DollarSign, ShoppingCart, Users, Calendar, 
  ArrowUpRight, ArrowDownRight, Printer, MessageSquare, 
  Sparkles, Award, PieChart, BarChart3, Clock, Check, RotateCcw
} from 'lucide-react';
import { Lang } from '../i18n/translations';
import { TODAY_ANALYTICS_DATA, PERIOD_ANALYTICS_DATA } from '../utils/zReportService';
import { useTodaySales } from '../utils/salesService';
import { DailyZReportModal } from './DailyZReportModal';

interface AnalyticsViewProps {
  lang: Lang;
  shopName?: string;
  shopPhone?: string;
}

export function AnalyticsView({
  lang,
  shopName = 'श्री गणेश किराना स्टोर',
  shopPhone = '+91 98765 43210'
}: AnalyticsViewProps) {
  const isHi = lang === 'hi';
  const [timeRange, setTimeRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [isZReportOpen, setIsZReportOpen] = useState(false);
  const { summary: todaySummary, resetSales } = useTodaySales();

  const data = timeRange === 'today' ? todaySummary : (PERIOD_ANALYTICS_DATA[timeRange] || TODAY_ANALYTICS_DATA);

  const handleReset = () => {
    if (window.confirm(isHi ? 'क्या आप आज की सभी बिक्री व मुनाफे को ₹0 पर रीसेट करना चाहते हैं?' : 'Reset today sales and profit metrics to ₹0?')) {
      resetSales();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-3xl p-6 sm:p-7 border border-white/10 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shadow-inner">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                  {isHi ? 'स्मार्ट किराना बिजनेस एनालिटिक्स' : 'Kirana Business Analytics & Profit OS'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                  {isHi ? `लाइव ${data.profitMarginPercent}% मार्जिन` : `${data.profitMarginPercent}% Net Margin`}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
                {isHi 
                  ? 'दुकान का वास्तविक मुनाफा, टॉप बिकने वाले सामान और डेली क्लोजिंग Z-रिपोर्ट' 
                  : 'Realtime gross sales, product profit margins, and daily closing Z-Report'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {timeRange === 'today' && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border border-white/15 active:scale-95"
                title={isHi ? 'आज का हिसाब 0 करें' : 'Reset today sales to 0'}
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>{isHi ? 'रीसेट (0 करें)' : 'Reset to 0'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsZReportOpen(true)}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center gap-2 shadow-lg transition-all cursor-pointer active:scale-95 border border-white/20"
            >
              <BarChart3 className="w-4 h-4" />
              <span>{isHi ? 'डेली Z-रिपोर्ट खोलें' : 'Open Daily Z-Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Date Filter Strip */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl w-fit border border-slate-300/50">
        <button
          type="button"
          onClick={() => setTimeRange('today')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            timeRange === 'today' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isHi ? 'आज' : 'Today'}
        </button>
        <button
          type="button"
          onClick={() => setTimeRange('yesterday')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            timeRange === 'yesterday' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isHi ? 'कल' : 'Yesterday'}
        </button>
        <button
          type="button"
          onClick={() => setTimeRange('week')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            timeRange === 'week' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isHi ? '7 दिन' : '7 Days'}
        </button>
        <button
          type="button"
          onClick={() => setTimeRange('month')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
            timeRange === 'month' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {isHi ? 'इस महीने' : 'Month'}
        </button>
      </div>

      {/* Key Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {isHi ? 'कुल बिक्री' : 'Gross Sales'}
            </span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <DollarSign className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            ₹{data.totalSales.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-emerald-600 font-bold flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>
              {timeRange === 'today'
                ? (isHi ? '+14.2% कल की तुलना में' : '+14.2% vs yesterday')
                : timeRange === 'yesterday'
                ? (isHi ? 'पिछले दिन की क्लोजिंग' : 'Yesterday Close')
                : timeRange === 'week'
                ? (isHi ? '7 दिनों का कुल रिकॉर्ड' : 'Last 7 days record')
                : (isHi ? 'चालू माह का कुल रिकॉर्ड' : 'Current month record')}
            </span>
          </div>
        </div>

        {/* Estimated Profit */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {isHi ? 'शुद्ध अनुमानित मुनाफा' : 'Net Gross Profit'}
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight">
            ₹{data.grossProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            {isHi ? 'मार्जिन:' : 'Margin:'} <span className="font-bold text-emerald-700">{data.profitMarginPercent}%</span>
          </div>
        </div>

        {/* Total Bills */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {isHi ? 'कुल बिल व ग्राहक' : 'Total Bills'}
            </span>
            <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <ShoppingCart className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tracking-tight">
            {data.totalBills}
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            {isHi ? 'औसत बिल:' : 'Avg Bill:'} <span className="font-bold text-slate-800 font-mono">₹{data.avgBillValue.toFixed(0)}</span>
          </div>
        </div>

        {/* Digital UPI Share */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              {isHi ? 'डिजिटल UPI शेयर' : 'Digital UPI Share'}
            </span>
            <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-blue-900 font-mono tracking-tight">
            {data.totalSales > 0 ? ((data.upiCollected / data.totalSales) * 100).toFixed(1) : '0.0'}%
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            UPI: <span className="font-bold text-blue-700 font-mono">₹{data.upiCollected.toLocaleString('en-IN')}</span> &bull; Cash: <span className="font-bold font-mono">₹{data.cashCollected.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Analytics Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Selling Products (7 of 12) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-black text-slate-900">
                {isHi ? 'सबसे ज्यादा बिकने वाला सामान' : 'Top Selling Products'}
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">By Volume & Revenue</span>
          </div>

          <div className="space-y-3">
            {data.topSellingItems && data.topSellingItems.length > 0 ? (
              data.topSellingItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                      idx === 0 ? 'bg-amber-100 text-amber-900' : idx === 1 ? 'bg-slate-200 text-slate-800' : 'bg-blue-100 text-blue-900'
                    }`}>
                      #{idx + 1}
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-900 block truncate">
                        {isHi && item.hindiName ? item.hindiName : item.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {item.qtySold} {item.unit} {isHi ? 'बिके' : 'sold'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-black text-slate-900 font-mono">
                      ₹{item.revenue.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-bold font-mono">
                      +₹{item.profit} {isHi ? 'मुनाफा' : 'profit'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center space-y-2">
                <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">
                  {isHi ? 'आज अभी तक कोई सामान नहीं बिका है' : 'No items sold today yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isHi ? 'पीओएस बिलिंग रजिस्टर से सामान बेचें, यहाँ लाइव लिस्ट आ जाएगी।' : 'Sell items in POS billing to see top sellers.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Category Breakdown (5 of 12) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-black text-slate-900">
                {isHi ? 'श्रेणी-वार बिक्री शेयर' : 'Category Share'}
              </h3>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            {data.categoryBreakdown && data.categoryBreakdown.length > 0 ? (
              data.categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">
                      {isHi && cat.categoryHindi ? cat.categoryHindi : cat.category}
                    </span>
                    <span className="font-mono font-bold text-slate-900">
                      ₹{cat.sales.toLocaleString('en-IN')} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        idx === 0 ? 'bg-indigo-600' : idx === 1 ? 'bg-blue-500' : idx === 2 ? 'bg-emerald-500' : idx === 3 ? 'bg-amber-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-10 text-center space-y-2">
                <PieChart className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-600">
                  {isHi ? 'कोई श्रेणी डेटा नहीं' : 'No category data yet'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {isHi ? 'बिल बनते ही कैटेगरी शेयर का ग्राफ दिखेगा।' : 'Category breakdown will appear as sales happen.'}
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsZReportOpen(true)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-98"
            >
              <Printer className="w-4 h-4" />
              <span>{isHi ? 'डेली Z-क्लोजिंग रिपोर्ट प्रिंट करें' : 'Print Daily Z-Report'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Z-Report Modal */}
      {isZReportOpen && (
        <DailyZReportModal
          isOpen={isZReportOpen}
          onClose={() => setIsZReportOpen(false)}
          lang={lang}
          shopName={shopName}
          shopPhone={shopPhone}
        />
      )}
    </div>
  );
}