import type { Lang } from '../i18n/translations.ts';

export interface Supplier {
  id: string;
  name: string;
  company: string;
  phone: string;
  contactPerson: string;
  email?: string;
  categories: string[];
  brands: string[];
  deliveryDays: string[];
  leadTimeDays: number;
  minOrderValue: number;
  pendingCredit: number;
  address: string;
}

export interface RestockItem {
  id: string;
  productId: string;
  name: string;
  nameHindi: string;
  sku: string;
  barcode?: string;
  currentStock: number;
  minThreshold: number;
  suggestedOrderQty: number;
  unit: string;
  costPrice: number;
  sellingPrice: number;
  supplierId: string;
  supplierName: string;
  category: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  supplierPhone: string;
  items: {
    productId: string;
    name: string;
    nameHindi?: string;
    qty: number;
    unit: string;
    costPrice: number;
    totalAmount: number;
  }[];
  totalAmount: number;
  status: 'DRAFT' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  createdAt: string;
  deliveryDate?: string;
  notes?: string;
}

export const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup_itc',
    name: 'आईटीसी डायरेक्ट एजेंसी (ITC Direct)',
    company: 'ITC Limited Distributors',
    phone: '9871100223',
    contactPerson: 'राकेश शर्मा (Rakesh Sharma)',
    categories: ['Atta, Flour & Grains', 'Snacks & Biscuits', 'Personal & Oral Care'],
    brands: ['Aashirvaad', 'Sunfeast', 'Bingo', 'Yippee', 'Savlon'],
    deliveryDays: ['Mon', 'Wed', 'Fri'],
    leadTimeDays: 1,
    minOrderValue: 2000,
    pendingCredit: 4500,
    address: 'Warehouse No 12, Transport Nagar, New Delhi'
  },
  {
    id: 'sup_hul',
    name: 'हिंदुस्तान यूनिलीवर एजेंसी (HUL Agency)',
    company: 'Hindustan Unilever Distribution',
    phone: '9810099881',
    contactPerson: 'विकास गुप्ता (Vikas Gupta)',
    categories: ['Cleaning & Household', 'Personal & Oral Care', 'Tea, Coffee & Drinks'],
    brands: ['Surf Excel', 'Rin', 'Vim', 'Lifebuoy', 'Red Label', 'Taj Mahal', 'Horlicks'],
    deliveryDays: ['Tue', 'Thu', 'Sat'],
    leadTimeDays: 2,
    minOrderValue: 3000,
    pendingCredit: 1200,
    address: 'Plot 45, Okhla Phase 3, New Delhi'
  },
  {
    id: 'sup_adani',
    name: 'फॉर्च्यून व खाद्य तेल एजेंसी (Fortune & Adani Wilmar)',
    company: 'Adani Wilmar Supply Co.',
    phone: '9899123450',
    contactPerson: 'सुनील अग्रवाल (Sunil Agrawal)',
    categories: ['Edible Oils & Ghee', 'Sugar & Sweeteners', 'Pulses & Dals'],
    brands: ['Fortune', 'Dhara', 'Kohinoor', 'Madhur'],
    deliveryDays: ['Daily', 'Mon', 'Wed', 'Sat'],
    leadTimeDays: 1,
    minOrderValue: 5000,
    pendingCredit: 0,
    address: 'Shop 8, Khari Baoli Wholesale Market, Old Delhi'
  },
  {
    id: 'sup_tata',
    name: 'टाटा कंज्यूमर डिस्ट्रीब्यूशन (Tata Consumer Agencies)',
    company: 'Tata Consumer Products Ltd.',
    phone: '9873322114',
    contactPerson: 'अमित मिश्रा (Amit Mishra)',
    categories: ['Spices & Masalas', 'Pulses & Dals', 'Tea, Coffee & Drinks'],
    brands: ['Tata Salt', 'Tata Sampann', 'Tata Tea Gold', 'Tetley'],
    deliveryDays: ['Tue', 'Fri'],
    leadTimeDays: 2,
    minOrderValue: 2500,
    pendingCredit: 2800,
    address: 'Godown 19, Najafgarh Road Industrial Area, Delhi'
  },
  {
    id: 'sup_dairy',
    name: 'अमूल व मदर डेयरी डिपो (Amul Fresh Dairy Depot)',
    company: 'Gujarat Cooperative Milk Marketing Federation',
    phone: '9818877665',
    contactPerson: 'नरेश यादव (Naresh Yadav)',
    categories: ['Dairy & Bakery'],
    brands: ['Amul', 'Mother Dairy'],
    deliveryDays: ['Daily Morning 6:00 AM'],
    leadTimeDays: 0,
    minOrderValue: 1000,
    pendingCredit: 800,
    address: 'Milk Chilling Center, Sector 4, Rohini, Delhi'
  }
];

export const INITIAL_LOW_STOCK_ITEMS: RestockItem[] = [
  {
    id: 'rstk_1',
    productId: 'prod_atta_01',
    name: 'Aashirvaad Superior MP Sharbati Atta 10kg',
    nameHindi: 'आशीर्वाद शरबती आटा 10kg',
    sku: 'SKU-0001',
    barcode: '8901030381011',
    currentStock: 3,
    minThreshold: 15,
    suggestedOrderQty: 20,
    unit: 'bag',
    costPrice: 480,
    sellingPrice: 535,
    supplierId: 'sup_itc',
    supplierName: 'आईटीसी डायरेक्ट एजेंसी (ITC Direct)',
    category: 'Atta, Flour & Grains'
  },
  {
    id: 'rstk_2',
    productId: 'prod_oil_01',
    name: 'Fortune Kachi Ghani Mustard Oil 1L Pouch',
    nameHindi: 'फॉर्च्यून कच्ची घानी सरसों तेल 1L',
    sku: 'SKU-0013',
    barcode: '8906007282012',
    currentStock: 2,
    minThreshold: 12,
    suggestedOrderQty: 24,
    unit: 'pouch',
    costPrice: 142,
    sellingPrice: 165,
    supplierId: 'sup_adani',
    supplierName: 'फॉर्च्यून व खाद्य तेल एजेंसी (Fortune & Adani Wilmar)',
    category: 'Edible Oils & Ghee'
  },
  {
    id: 'rstk_3',
    productId: 'prod_salt_01',
    name: 'Tata Salt Vacuum Evaporated 1kg',
    nameHindi: 'टाटा नमक 1kg',
    sku: 'SKU-0021',
    barcode: '8901058852011',
    currentStock: 4,
    minThreshold: 25,
    suggestedOrderQty: 50,
    unit: 'packet',
    costPrice: 22,
    sellingPrice: 28,
    supplierId: 'sup_tata',
    supplierName: 'टाटा कंज्यूमर डिस्ट्रीब्यूशन (Tata Consumer Agencies)',
    category: 'Spices & Masalas'
  },
  {
    id: 'rstk_4',
    productId: 'prod_surf_01',
    name: 'Surf Excel Quick Wash Detergent Powder 1kg',
    nameHindi: 'सर्फ एक्सेल डिटर्जेंट पाउडर 1kg',
    sku: 'SKU-0081',
    barcode: '8901030700012',
    currentStock: 2,
    minThreshold: 10,
    suggestedOrderQty: 15,
    unit: 'packet',
    costPrice: 130,
    sellingPrice: 150,
    supplierId: 'sup_hul',
    supplierName: 'हिंदुस्तान यूनिलीवर एजेंसी (HUL Agency)',
    category: 'Cleaning & Household'
  },
  {
    id: 'rstk_5',
    productId: 'prod_milk_01',
    name: 'Amul Taaza Homogenised Toned Milk 500ml',
    nameHindi: 'अमूल ताजा टोंड दूध 500ml',
    sku: 'SKU-0041',
    barcode: '8901262010051',
    currentStock: 6,
    minThreshold: 30,
    suggestedOrderQty: 40,
    unit: 'packet',
    costPrice: 25,
    sellingPrice: 27,
    supplierId: 'sup_dairy',
    supplierName: 'अमूल व मदर डेयरी डिपो (Amul Fresh Dairy Depot)',
    category: 'Dairy & Bakery'
  }
];

/**
 * Formats a clean, professional WhatsApp Purchase Order (PO) message for Distributors
 */
export function formatSupplierWhatsAppPO(
  po: {
    poNumber: string;
    supplierName: string;
    contactPerson?: string;
    items: {
      name: string;
      nameHindi?: string;
      qty: number;
      unit: string;
      costPrice?: number;
    }[];
    totalEstimatedAmount?: number;
    deliveryDate?: string;
    notes?: string;
  },
  shopInfo = {
    name: 'श्री गणेश किराना स्टोर (Shree Ganesh Kirana)',
    phone: '+91 98765 43210',
    address: 'दुकान नं. 4, मेन मार्केट, नई दिल्ली'
  },
  lang: Lang = 'hi'
): string {
  const isHi = lang === 'hi' || lang === 'gu' || lang === 'mr';

  let msg = isHi
    ? `नमस्ते *${po.contactPerson || po.supplierName} जी* 🙏\n\n`
    : `Hello *${po.contactPerson || po.supplierName}*,\n\n`;

  msg += isHi
    ? `*${shopInfo.name}* की तरफ से नया *स्टॉक सप्लाई ऑर्डर (#${po.poNumber})*:\n`
    : `New *Stock Purchase Order (#${po.poNumber})* from *${shopInfo.name}*:\n`;

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📦 *${isHi ? 'ऑर्डर सामग्री सूची (Order Items):' : 'Order Item List:'}*\n\n`;

  po.items.forEach((item, index) => {
    const itemTitle = isHi && item.nameHindi ? item.nameHindi : item.name;
    const itemTotal = item.costPrice ? ` (~₹${(item.qty * item.costPrice).toLocaleString('en-IN')})` : '';
    msg += `${index + 1}. *${itemTitle}*\n`;
    msg += `   └ मात्रा (Qty): *${item.qty} ${item.unit}*${itemTotal}\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━\n`;
  if (po.totalEstimatedAmount) {
    msg += `💰 *${isHi ? 'अनुमानित बिल राशि' : 'Estimated Amount'}: ₹${po.totalEstimatedAmount.toLocaleString('en-IN')}*\n`;
  }
  if (po.deliveryDate) {
    msg += `🚚 *${isHi ? 'अपेक्षित डिलीवरी समय' : 'Requested Delivery'}: ${po.deliveryDate}*\n`;
  }
  if (po.notes) {
    msg += `📝 *${isHi ? 'विशेष नोट' : 'Note'}: ${po.notes}*\n`;
  }
  msg += `📍 *${isHi ? 'डिलीवरी पता' : 'Delivery Address'}: ${shopInfo.address}*\n`;
  msg += `📞 *${isHi ? 'संपर्क नंबर' : 'Contact Phone'}: ${shopInfo.phone}*\n\n`;
  msg += `🙏 *${isHi ? 'कृपया ऑर्डर कन्फर्म करके बिल व गाड़ी भेजें। धन्यवाद!' : 'Please confirm order and dispatch invoice. Thank you!'}*`;

  return msg;
}

/**
 * Generates WhatsApp click-to-chat URL for Supplier Restock Order
 */
export function generateSupplierWhatsAppUrl(
  po: {
    poNumber: string;
    supplierName: string;
    supplierPhone: string;
    contactPerson?: string;
    items: {
      name: string;
      nameHindi?: string;
      qty: number;
      unit: string;
      costPrice?: number;
    }[];
    totalEstimatedAmount?: number;
    deliveryDate?: string;
    notes?: string;
  },
  shopInfo?: {
    name: string;
    phone: string;
    address: string;
  },
  lang: Lang = 'hi'
): string {
  const text = formatSupplierWhatsAppPO(po, shopInfo, lang);
  const cleanPhone = (po.supplierPhone || '').replace(/[^\d]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`;
}
