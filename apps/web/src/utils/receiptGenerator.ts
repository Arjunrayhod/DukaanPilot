import type { Lang } from '../i18n/translations.ts';

export interface ReceiptItem {
  id: string | number;
  name: string;
  hindi?: string;
  qty: number;
  price: number;
  unit?: string;
}

export interface ReceiptData {
  invoiceNo: string;
  date: string;
  time: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  shopGst?: string;
  shopUpiId: string;
  customerName?: string;
  customerPhone?: string;
  items: ReceiptItem[];
  subtotal: number;
  gstAmount: number;
  roundOff: number;
  grandTotal: number;
  paymentMode: 'cash' | 'upi' | 'khata' | 'split';
  splitBreakdown?: {
    cash: number;
    upi: number;
    khata: number;
  };
}

/**
 * Formats a clean, readable WhatsApp invoice text in Hindi/English
 */
export function formatWhatsAppInvoice(data: ReceiptData, lang: Lang = 'hi'): string {
  const isHi = lang === 'hi' || lang === 'gu' || lang === 'mr';

  let msg = `🏪 *${data.shopName}*\n`;
  msg += `📍 ${data.shopAddress} | 📞 ${data.shopPhone}\n`;
  if (data.shopGst) {
    msg += `🔖 GST: ${data.shopGst}\n`;
  }
  msg += `--------------------------------\n`;
  msg += `🧾 *${isHi ? 'डिजिटल बिल' : 'Digital Invoice'} #${data.invoiceNo}*\n`;
  msg += `📅 ${isHi ? 'तारीख' : 'Date'}: ${data.date} ${data.time}\n`;
  if (data.customerName) {
    msg += `👤 ${isHi ? 'ग्राहक' : 'Customer'}: ${data.customerName} (${data.customerPhone || ''})\n`;
  }
  msg += `--------------------------------\n`;
  msg += `*${isHi ? 'सामान विवरण (Items)' : 'Item Details'}*:\n`;

  data.items.forEach((item, idx) => {
    const itemTotal = item.price * item.qty;
    const itemName = isHi && item.hindi ? item.hindi : item.name;
    msg += `${idx + 1}. ${itemName}\n   ↳ ${item.qty} ${item.unit || ''} x ₹${item.price} = *₹${itemTotal}*\n`;
  });

  msg += `--------------------------------\n`;
  msg += `🛒 ${isHi ? 'कुल योग (Subtotal)' : 'Subtotal'}: ₹${data.subtotal}\n`;
  if (data.gstAmount > 0) {
    msg += `📊 GST (5%): ₹${data.gstAmount}\n`;
  }
  msg += `💰 *${isHi ? 'कुल देय राशि (Grand Total)' : 'Grand Total'}: ₹${data.grandTotal}*\n`;
  msg += `💳 ${isHi ? 'भुगतान माध्यम' : 'Payment Mode'}: *${formatPaymentMode(data.paymentMode, isHi)}*\n`;

  if (data.paymentMode === 'split' && data.splitBreakdown) {
    msg += `   ↳ नकद: ₹${data.splitBreakdown.cash} | UPI: ₹${data.splitBreakdown.upi} | खाता: ₹${data.splitBreakdown.khata}\n`;
  }

  if (data.shopUpiId) {
    const upiPayLink = `upi://pay?pa=${encodeURIComponent(data.shopUpiId)}&pn=${encodeURIComponent(data.shopName)}&am=${data.grandTotal}&cu=INR&tn=Bill_${data.invoiceNo}`;
    msg += `\n📲 *${isHi ? 'ऑनलाइन भुगतान लिंक' : 'Pay Online (UPI)'}*:\n${upiPayLink}\n`;
  }

  msg += `--------------------------------\n`;
  msg += `🙏 *${isHi ? 'धन्यवाद! आपकी सेवा में सदैव तत्पर।' : 'Thank you! Visit again.'}*`;

  return msg;
}

/**
 * Creates a direct WhatsApp click-to-chat URL
 */
export function generateWhatsAppLink(phone: string, text: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedText}`;
}

function formatPaymentMode(mode: string, isHi: boolean): string {
  switch (mode) {
    case 'cash':
      return isHi ? 'नकद (Cash)' : 'Cash';
    case 'upi':
      return isHi ? 'UPI ऑनलाइन (QR)' : 'UPI Online';
    case 'khata':
      return isHi ? 'खाता / उधार (Khata Udhaar)' : 'Khata Udhaar';
    case 'split':
      return isHi ? 'स्प्लिट पेमेंट (Split)' : 'Split Payment';
    default:
      return mode;
  }
}
