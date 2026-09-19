/**
 * DukaanPilot - Customer Loyalty Points, Rewards & Festive WhatsApp Promotions
 */

export interface LoyaltyAccount {
  phone: string;
  customerName: string;
  points: number; // 1 point = ₹1
  totalEarned: number;
  totalRedeemed: number;
  lastActive: string;
}

export interface PromoCoupon {
  code: string;
  title: string;
  titleHindi: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FLAT' | 'FREE_DELIVERY';
  discountValue: number; // e.g. 10% or ₹50
  minOrderValue: number;
  validTill: string;
}

export const FESTIVE_COUPONS: PromoCoupon[] = [
  {
    code: 'FESTIVE10',
    title: 'Festive Season 10% OFF',
    titleHindi: 'त्योहारी स्पेशल 10% भारी छूट',
    description: '₹499 से अधिक के राशन ऑर्डर पर तुरंत 10% छूट पाएं (अधिकतम ₹100)',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderValue: 499,
    validTill: '31/10/2026'
  },
  {
    code: 'KIRANA50',
    title: 'Flat ₹50 Super Savings',
    titleHindi: 'सीधे ₹50 की बचत',
    description: '₹999 से अधिक के मासिक राशन बिल पर फ्लैट ₹50 की छूट',
    discountType: 'FLAT',
    discountValue: 50,
    minOrderValue: 999,
    validTill: '15/10/2026'
  },
  {
    code: 'FREEDELIVERY',
    title: 'Free Home Delivery',
    titleHindi: 'फ्री होम डिलीवरी',
    description: 'घर बैठे मंगवाएं, डिलीवरी शुल्क ₹0 (न्यूनतम ₹299 ऑर्डर)',
    discountType: 'FREE_DELIVERY',
    discountValue: 0,
    minOrderValue: 299,
    validTill: '30/09/2026'
  }
];

export const INITIAL_LOYALTY_ACCOUNTS: Record<string, LoyaltyAccount> = {
  '9841029862': {
    phone: '9841029862',
    customerName: 'अर्जुन राठौड़',
    points: 120,
    totalEarned: 150,
    totalRedeemed: 30,
    lastActive: '19/09/2026'
  },
  '9823456789': {
    phone: '9823456789',
    customerName: 'रमेश कुमार',
    points: 85,
    totalEarned: 110,
    totalRedeemed: 25,
    lastActive: '12/09/2026'
  },
  '9811012345': {
    phone: '9811012345',
    customerName: 'सुनील बंसल',
    points: 210,
    totalEarned: 260,
    totalRedeemed: 50,
    lastActive: '15/09/2026'
  }
};

/**
 * Calculates Loyalty points earned on a bill (1 point per ₹100 spent)
 */
export function calculateEarnedPoints(billAmount: number): number {
  if (billAmount <= 0) return 0;
  return Math.floor(billAmount / 100);
}

/**
 * Generates WhatsApp Festive Promotion Message for broadcast
 */
export function formatPromoBroadcastMessage(
  coupon: PromoCoupon,
  shopInfo = {
    name: 'श्री गणेश किराना स्टोर',
    phone: '+91 98765 43210'
  },
  lang: 'hi' | 'en' = 'hi'
): string {
  const isHi = lang === 'hi';

  let msg = isHi
    ? `🎉 *${shopInfo.name}* की ओर से त्योहारी महा-बचत ऑफर! 🛍️✨\n\n`
    : `🎉 Festive Special Super Savings from *${shopInfo.name}*! 🛍️✨\n\n`;

  msg += isHi
    ? `प्रिय ग्राहक जी 🙏, आपके लिए खास ऑफर:\n\n`
    : `Dear Customer 🙏, special offer for you:\n\n`;

  msg += `🏷️ *कूपन कोड (Coupon Code): ${coupon.code}*\n`;
  msg += `🎁 *${isHi ? coupon.titleHindi : coupon.title}*\n`;
  msg += `📝 ${coupon.description}\n`;
  msg += `📅 *${isHi ? 'वैधता (Valid Till)' : 'Valid Till'}: ${coupon.validTill}*\n`;
  msg += `--------------------------------\n`;
  msg += `📲 ${isHi ? 'घर बैठे तुरंत ऑर्डर करने के लिए कॉल/व्हाट्सएप करें:' : 'Order online or call now:'} ${shopInfo.phone}\n\n`;
  msg += `🙏 *${isHi ? 'जल्दी करें! ऑफर सीमित समय के लिए है।' : 'Hurry! Limited period offer.'}*`;

  return msg;
}

/**
 * Generates WhatsApp click-to-chat URL for promo broadcast
 */
export function generatePromoWhatsAppUrl(
  phone: string,
  coupon: PromoCoupon,
  shopInfo?: { name: string; phone: string },
  lang: 'hi' | 'en' = 'hi'
): string {
  const text = formatPromoBroadcastMessage(coupon, shopInfo, lang);
  const cleanPhone = (phone || '').replace(/[^\d]/g, '');
  const formatted = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://api.whatsapp.com/send?phone=${formatted}&text=${encodeURIComponent(text)}`;
}
