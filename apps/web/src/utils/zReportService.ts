import type { Lang } from '../i18n/translations.ts';

export interface DailySalesSummary {
  date: string;
  totalSales: number;
  totalCost: number;
  grossProfit: number;
  profitMarginPercent: number;
  totalBills: number;
  avgBillValue: number;
  cashCollected: number;
  upiCollected: number;
  khataGiven: number;
  khataRecovered: number;
  topSellingItems: {
    name: string;
    hindiName?: string;
    qtySold: number;
    unit: string;
    revenue: number;
    profit: number;
  }[];
  categoryBreakdown: {
    category: string;
    categoryHindi?: string;
    sales: number;
    percentage: number;
  }[];
  hourlyTrend: {
    hour: string;
    sales: number;
    bills: number;
  }[];
}

export interface ZReportData {
  reportNumber: string;
  generatedAt: string;
  shopName: string;
  shopPhone: string;
  openingCash: number;
  cashSales: number;
  cashRecoveredKhata: number;
  cashPaidSuppliers: number;
  expectedClosingCash: number;
  actualClosingCash?: number;
  upiSales: number;
  totalKhataGiven: number;
  totalNetSales: number;
  totalProfit: number;
  totalBills: number;
  topItemName: string;
  notes?: string;
}

export const TODAY_ANALYTICS_DATA: DailySalesSummary = {
  date: '19 Sep 2026',
  totalSales: 8450,
  totalCost: 6630,
  grossProfit: 1820,
  profitMarginPercent: 21.5,
  totalBills: 60,
  avgBillValue: 140.83,
  cashCollected: 2280,
  upiCollected: 5170,
  khataGiven: 1000,
  khataRecovered: 450,
  topSellingItems: [
    {
      name: 'Amul Taaza Milk 500ml',
      hindiName: 'अमूल ताजा दूध 500ml',
      qtySold: 34,
      unit: 'packet',
      revenue: 918,
      profit: 68
    },
    {
      name: 'Aashirvaad Sharbati Atta 10kg',
      hindiName: 'आशीर्वाद शरबती आटा 10kg',
      qtySold: 6,
      unit: 'bag',
      revenue: 3210,
      profit: 330
    },
    {
      name: 'Madhur Pure Sugar 1kg',
      hindiName: 'मधुर चीनी 1kg',
      qtySold: 18,
      unit: 'kg',
      revenue: 864,
      profit: 144
    },
    {
      name: 'Fortune Mustard Oil 1L',
      hindiName: 'फॉर्च्यून सरसों तेल 1L',
      qtySold: 8,
      unit: 'bottle',
      revenue: 1320,
      profit: 184
    },
    {
      name: 'Tata Salt 1kg',
      hindiName: 'टाटा नमक 1kg',
      qtySold: 15,
      unit: 'packet',
      revenue: 420,
      profit: 90
    }
  ],
  categoryBreakdown: [
    { category: 'Atta & Grains', categoryHindi: 'आटा, चावल व दालें', sales: 3450, percentage: 40.8 },
    { category: 'Edible Oils & Ghee', categoryHindi: 'खाद्य तेल व घी', sales: 1820, percentage: 21.5 },
    { category: 'Dairy & Bakery', categoryHindi: 'डेयरी व दूध', sales: 1480, percentage: 17.5 },
    { category: 'Sugar & Sweeteners', categoryHindi: 'चीनी व गुड़', sales: 960, percentage: 11.4 },
    { category: 'Spices & Cleaning', categoryHindi: 'मसाले व डिटर्जेंट', sales: 740, percentage: 8.8 }
  ],
  hourlyTrend: [
    { hour: '07:00 AM', sales: 650, bills: 6 },
    { hour: '09:00 AM', sales: 1420, bills: 12 },
    { hour: '11:00 AM', sales: 980, bills: 8 },
    { hour: '01:00 PM', sales: 540, bills: 4 },
    { hour: '04:00 PM', sales: 1120, bills: 9 },
    { hour: '06:00 PM', sales: 2100, bills: 14 },
    { hour: '08:00 PM', sales: 1640, bills: 7 }
  ]
};

export const PERIOD_ANALYTICS_DATA: Record<'today' | 'yesterday' | 'week' | 'month', DailySalesSummary> = {
  today: TODAY_ANALYTICS_DATA,
  yesterday: {
    date: '18 Sep 2026',
    totalSales: 7400,
    totalCost: 5820,
    grossProfit: 1580,
    profitMarginPercent: 21.3,
    totalBills: 52,
    avgBillValue: 142.3,
    cashCollected: 2100,
    upiCollected: 4500,
    khataGiven: 800,
    khataRecovered: 350,
    topSellingItems: TODAY_ANALYTICS_DATA.topSellingItems,
    categoryBreakdown: TODAY_ANALYTICS_DATA.categoryBreakdown,
    hourlyTrend: TODAY_ANALYTICS_DATA.hourlyTrend
  },
  week: {
    date: '13-19 Sep 2026',
    totalSales: 56200,
    totalCost: 44100,
    grossProfit: 12100,
    profitMarginPercent: 21.5,
    totalBills: 395,
    avgBillValue: 142.27,
    cashCollected: 16800,
    upiCollected: 34200,
    khataGiven: 5200,
    khataRecovered: 4100,
    topSellingItems: TODAY_ANALYTICS_DATA.topSellingItems,
    categoryBreakdown: TODAY_ANALYTICS_DATA.categoryBreakdown,
    hourlyTrend: TODAY_ANALYTICS_DATA.hourlyTrend
  },
  month: {
    date: 'Sep 2026',
    totalSales: 238500,
    totalCost: 187300,
    grossProfit: 51200,
    profitMarginPercent: 21.46,
    totalBills: 1680,
    avgBillValue: 141.96,
    cashCollected: 71500,
    upiCollected: 145000,
    khataGiven: 22000,
    khataRecovered: 18500,
    topSellingItems: TODAY_ANALYTICS_DATA.topSellingItems,
    categoryBreakdown: TODAY_ANALYTICS_DATA.categoryBreakdown,
    hourlyTrend: TODAY_ANALYTICS_DATA.hourlyTrend
  }
};

/**
 * Formats a clean Daily Z-Report text for WhatsApp dispatch
 */
export function formatDailyZReportText(
  zReport: ZReportData,
  lang: Lang = 'hi'
): string {
  const isHi = lang === 'hi' || lang === 'gu' || lang === 'mr';

  let msg = `📊 *${isHi ? 'दुकान डेली क्लोजिंग Z-रिपोर्ट' : 'Daily Z-Closing Report'}*\n`;
  msg += `🏪 *${zReport.shopName}*\n`;
  msg += `📅 ${zReport.generatedAt} | #ZR-${zReport.reportNumber}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *${isHi ? 'कुल बिक्री (Net Sales)' : 'Total Net Sales'}: ₹${zReport.totalNetSales.toLocaleString('en-IN')}*\n`;
  msg += `📈 *${isHi ? 'शुद्ध अनुमानित मुनाफा (Profit)' : 'Estimated Net Profit'}: ₹${zReport.totalProfit.toLocaleString('en-IN')}*\n`;
  msg += `🧾 *${isHi ? 'कुल बिल ट्रांजैक्शन' : 'Total Bills'}: ${zReport.totalBills}*\n\n`;

  msg += `💳 *${isHi ? 'पेमेंट मोड कलेक्शन ब्रेकडाउन:' : 'Payment Tender Breakdown:'}*\n`;
  msg += `├ 💵 ${isHi ? 'नकद बिक्री (Cash Sales)' : 'Cash Sales'}: ₹${zReport.cashSales.toLocaleString('en-IN')}\n`;
  msg += `├ 📱 ${isHi ? 'UPI / QR कलेक्शन' : 'UPI QR Sales'}: ₹${zReport.upiSales.toLocaleString('en-IN')}\n`;
  msg += `└ 📒 ${isHi ? 'नया उधारी खाता (Khata Given)' : 'Khata Given'}: ₹${zReport.totalKhataGiven.toLocaleString('en-IN')}\n\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💼 *${isHi ? 'कैश दराज मिलान (Cash Drawer Audit):' : 'Cash Drawer Audit:'}*\n`;
  msg += `• ${isHi ? 'सुबह का ओपनिंग कैश' : 'Opening Cash'}: ₹${zReport.openingCash.toLocaleString('en-IN')}\n`;
  msg += `• ${isHi ? 'आज का कुल नकद इनफ्लो' : 'Cash Inflow'}: +₹${(zReport.cashSales + zReport.cashRecoveredKhata).toLocaleString('en-IN')}\n`;
  if (zReport.cashPaidSuppliers > 0) {
    msg += `• ${isHi ? 'सप्लायर भुगतान (नकद)' : 'Supplier Paid (Cash)'}: -₹${zReport.cashPaidSuppliers.toLocaleString('en-IN')}\n`;
  }
  msg += `💰 *${isHi ? 'दराज में होना चाहिए (Expected Cash)' : 'Expected Cash'}: ₹${zReport.expectedClosingCash.toLocaleString('en-IN')}*\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `⭐ ${isHi ? 'आज का टॉप बिकने वाला सामान' : 'Top Selling Item'}: *${zReport.topItemName}*\n`;
  if (zReport.notes) {
    msg += `📝 ${isHi ? 'नोट' : 'Note'}: ${zReport.notes}\n`;
  }
  msg += `\n🙏 *DukaanPilot OS द्वारा प्रमाणित क्लोजिंग रिपोर्ट।*`;

  return msg;
}

/**
 * Generates WhatsApp click-to-chat URL for Daily Z-Report
 */
export function generateDailyZReportWhatsAppUrl(
  zReport: ZReportData,
  ownerPhone = '9876543210',
  lang: Lang = 'hi'
): string {
  const text = formatDailyZReportText(zReport, lang);
  const cleanPhone = ownerPhone.replace(/[^\d]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`;
}