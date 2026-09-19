/**
 * GST Tax Engine & HSN Master for Indian Kirana Retailers
 * Compliant with GST Act (CGST + SGST / IGST) & HSN Coding Standards
 */

export interface HsnMasterEntry {
  hsn: string;
  category: string;
  categoryHindi: string;
  rate: number; // e.g. 0, 5, 12, 18, 28
  description: string;
}

export const HSN_CATALOG: HsnMasterEntry[] = [
  { hsn: '0401', category: 'Dairy', categoryHindi: 'डेयरी व दूध', rate: 5, description: 'दूध, दही, पनीर व पाश्चुरीकृत डेयरी उत्पाद' },
  { hsn: '1006', category: 'Grains & Rice', categoryHindi: 'अनाज व चावल', rate: 0, description: 'चावल, गेहूं व बिना ब्रांड खुला अनाज (Exempt)' },
  { hsn: '1101', category: 'Atta & Flour', categoryHindi: 'आटा व मैदा', rate: 5, description: 'पैक्ड व ब्रांडेड गेहूं का आटा (Aashirvaad, etc.)' },
  { hsn: '1514', category: 'Edible Oil', categoryHindi: 'खाद्य तेल व घी', rate: 5, description: 'सरसों का तेल, रिफाइंड व देशी घी' },
  { hsn: '1701', category: 'Sugar & Jaggery', categoryHindi: 'चीनी व गुड़', rate: 5, description: 'रिफाइंड चीनी व गुड़' },
  { hsn: '0902', category: 'Tea & Coffee', categoryHindi: 'चाय व कॉफी', rate: 5, description: 'चाय पत्ती, ग्रीन टी व कॉफी पाउडर' },
  { hsn: '0910', category: 'Spices & Masala', categoryHindi: 'मसाले', rate: 5, description: 'हल्दी, मिर्च, धनिया व गरम मसाला' },
  { hsn: '1905', category: 'Bakery & Biscuits', categoryHindi: 'बेकरी व बिस्कुट', rate: 18, description: 'पारले-जी, ब्रिटानिया बिस्कुट, कुकीज व ब्रेड' },
  { hsn: '2106', category: 'Namkeen & Snacks', categoryHindi: 'नमकीन व स्नैक्स', rate: 12, description: 'हल्दीराम नमकीन, चिप्स व इंस्टेंट नूडल्स' },
  { hsn: '3306', category: 'Personal Care', categoryHindi: 'व्यक्तिगत देखभाल', rate: 18, description: 'टूथपेस्ट, ब्रश, साबुन व शैम्पू' },
  { hsn: '3402', category: 'Cleaning & Detergent', categoryHindi: 'डिटर्जेंट व सफाई', rate: 18, description: 'सर्फ एक्सेल, विम बार व फिनाइल' },
  { hsn: '2501', category: 'Salt', categoryHindi: 'नमक', rate: 0, description: 'टाटा आयोडाइज्ड नमक (Nil GST)' },
];

export interface GstTaxBreakdownItem {
  id: string;
  name: string;
  hindiName?: string;
  hsn: string;
  qty: number;
  unitPrice: number;
  taxableAmount: number;
  gstRate: number;
  cgstRate: number;
  cgstAmount: number;
  sgstRate: number;
  sgstAmount: number;
  igstRate: number;
  igstAmount: number;
  totalAmount: number;
}

export interface GstInvoiceCalculation {
  isInterState: boolean;
  isB2B: boolean;
  buyerGstin?: string;
  buyerState?: string;
  items: GstTaxBreakdownItem[];
  totalTaxableAmount: number;
  totalCgst: number;
  totalSgst: number;
  totalIgst: number;
  totalGst: number;
  grandTotal: number;
  rateSummary: Record<number, { taxable: number; cgst: number; sgst: number; igst: number; totalGst: number }>;
}

/**
 * Finds HSN and GST rate for a product based on category or name
 */
export function lookupProductHsn(product: { category?: string; name?: string; barcode?: string }): { hsn: string; rate: number } {
  const cat = (product.category || '').toLowerCase();
  const name = (product.name || '').toLowerCase();

  if (cat.includes('dairy') || cat.includes('milk') || name.includes('milk') || name.includes('doodh') || name.includes('dahi')) {
    return { hsn: '0401', rate: 5 };
  }
  if (cat.includes('atta') || cat.includes('flour') || name.includes('atta') || name.includes('aata')) {
    return { hsn: '1101', rate: 5 };
  }
  if (cat.includes('rice') || cat.includes('grain') || name.includes('rice') || name.includes('chawal')) {
    return { hsn: '1006', rate: 0 };
  }
  if (cat.includes('oil') || cat.includes('ghee') || name.includes('oil') || name.includes('tel') || name.includes('ghee')) {
    return { hsn: '1514', rate: 5 };
  }
  if (cat.includes('sugar') || name.includes('sugar') || name.includes('cheeni')) {
    return { hsn: '1701', rate: 5 };
  }
  if (cat.includes('tea') || cat.includes('coffee') || name.includes('tea') || name.includes('chai')) {
    return { hsn: '0902', rate: 5 };
  }
  if (cat.includes('masala') || cat.includes('spice') || name.includes('masala') || name.includes('mirch')) {
    return { hsn: '0910', rate: 5 };
  }
  if (cat.includes('bakery') || cat.includes('biscuit') || name.includes('biscuit') || name.includes('parle') || name.includes('bread')) {
    return { hsn: '1905', rate: 18 };
  }
  if (cat.includes('namkeen') || cat.includes('snack') || name.includes('bhujia') || name.includes('chips') || name.includes('maggie')) {
    return { hsn: '2106', rate: 12 };
  }
  if (cat.includes('personal') || name.includes('colgate') || name.includes('soap') || name.includes('shampoo')) {
    return { hsn: '3306', rate: 18 };
  }
  if (cat.includes('clean') || cat.includes('detergent') || name.includes('surf') || name.includes('vim')) {
    return { hsn: '3402', rate: 18 };
  }
  if (name.includes('salt') || name.includes('namak')) {
    return { hsn: '2501', rate: 0 };
  }

  return { hsn: '2106', rate: 5 };
}

/**
 * Calculates GST components (inclusive pricing model standard for Kirana)
 */
export function computeGstForCart(
  items: Array<{ id: string; name: string; hindi?: string; category?: string; qty: number; price: number }>,
  options: { isInterState?: boolean; isB2B?: boolean; buyerGstin?: string; buyerState?: string } = {}
): GstInvoiceCalculation {
  const isInterState = Boolean(options.isInterState);
  const isB2B = Boolean(options.isB2B);

  const rateSummary: Record<number, { taxable: number; cgst: number; sgst: number; igst: number; totalGst: number }> = {
    0: { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 },
    5: { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 },
    12: { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 },
    18: { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 },
    28: { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 },
  };

  let totalTaxableAmount = 0;
  let totalCgst = 0;
  let totalSgst = 0;
  let totalIgst = 0;
  let grandTotal = 0;

  const calculatedItems: GstTaxBreakdownItem[] = items.map((item) => {
    const { hsn, rate } = lookupProductHsn(item);
    const lineGross = item.price * item.qty;
    grandTotal += lineGross;

    const taxable = Math.round((lineGross / (1 + rate / 100)) * 100) / 100;
    const gstTotal = Math.round((lineGross - taxable) * 100) / 100;
    totalTaxableAmount += taxable;

    let cgstRate = 0;
    let cgstAmount = 0;
    let sgstRate = 0;
    let sgstAmount = 0;
    let igstRate = 0;
    let igstAmount = 0;

    if (isInterState) {
      igstRate = rate;
      igstAmount = gstTotal;
      totalIgst += igstAmount;
    } else {
      cgstRate = rate / 2;
      cgstAmount = Math.round((gstTotal / 2) * 100) / 100;
      sgstRate = rate / 2;
      sgstAmount = cgstAmount;
      totalCgst += cgstAmount;
      totalSgst += sgstAmount;
    }

    if (!rateSummary[rate]) {
      rateSummary[rate] = { taxable: 0, cgst: 0, sgst: 0, igst: 0, totalGst: 0 };
    }

    rateSummary[rate].taxable = Math.round((rateSummary[rate].taxable + taxable) * 100) / 100;
    rateSummary[rate].cgst = Math.round((rateSummary[rate].cgst + cgstAmount) * 100) / 100;
    rateSummary[rate].sgst = Math.round((rateSummary[rate].sgst + sgstAmount) * 100) / 100;
    rateSummary[rate].igst = Math.round((rateSummary[rate].igst + igstAmount) * 100) / 100;
    rateSummary[rate].totalGst = Math.round((rateSummary[rate].totalGst + gstTotal) * 100) / 100;

    return {
      id: item.id,
      name: item.name,
      hindiName: item.hindi,
      hsn,
      qty: item.qty,
      unitPrice: item.price,
      taxableAmount: taxable,
      gstRate: rate,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      igstRate,
      igstAmount,
      totalAmount: lineGross,
    };
  });

  const totalGst = isInterState ? totalIgst : totalCgst + totalSgst;

  return {
    isInterState,
    isB2B,
    buyerGstin: options.buyerGstin,
    buyerState: options.buyerState || '07-Delhi',
    items: calculatedItems,
    totalTaxableAmount: Math.round(totalTaxableAmount * 100) / 100,
    totalCgst: Math.round(totalCgst * 100) / 100,
    totalSgst: Math.round(totalSgst * 100) / 100,
    totalIgst: Math.round(totalIgst * 100) / 100,
    totalGst: Math.round(totalGst * 100) / 100,
    grandTotal: Math.round(grandTotal),
    rateSummary,
  };
}

/**
 * Generates GSTR-1 Sales Report in CSV format for CA and GST Portal upload
 */
export function generateGstr1Csv(
  bills: Array<{
    invoiceNo?: string;
    createdAt?: string;
    customerName?: string;
    customerPhone?: string;
    grandTotal?: number;
    subtotal?: number;
    paymentMode?: string;
    items?: any[];
  }>
): string {
  const headers = [
    'Invoice Number',
    'Invoice Date',
    'Invoice Value (INR)',
    'Place Of Supply',
    'Reverse Charge',
    'Invoice Type',
    'Rate (%)',
    'Taxable Value (INR)',
    'Cess Amount (INR)',
    'Payment Mode'
  ];

  const rows: string[] = [headers.join(',')];

  for (const bill of bills) {
    const calc = computeGstForCart(
      (bill.items || []).map((it) => ({
        id: it.id || 'item',
        name: it.name || 'Kirana Item',
        qty: it.qty || 1,
        price: it.price || it.sellingPrice || 0,
      }))
    );

    const dateStr = bill.createdAt ? String(bill.createdAt).split(',')[0] : new Date().toLocaleDateString('en-IN');

    for (const [rateStr, sum] of Object.entries(calc.rateSummary)) {
      const rate = Number(rateStr);
      if (sum.taxable > 0 || rate === 0) {
        rows.push(
          [
            `"${bill.invoiceNo || 'INV'}"`,
            `"${dateStr}"`,
            bill.grandTotal || calc.grandTotal,
            '"07-Delhi"',
            '"N"',
            '"Regular B2C"',
            rate,
            sum.taxable,
            0,
            `"${(bill.paymentMode || 'CASH').toUpperCase()}"`
          ].join(',')
        );
      }
    }
  }

  return rows.join('\n');
}

/**
 * Formats Amount in Words for Official GST Invoices
 */
export function amountInWordsHindi(amount: number): string {
  const ones = ['', 'एक', 'दो', 'तीन', 'चार', 'पांच', 'छह', 'सात', 'आठ', 'नौ', 'दस', 'ग्यारह', 'बारह', 'तेरह', 'चौदह', 'पंद्रह', 'सोलह', 'सत्रह', 'अठारह', 'उन्नीस'];
  const tens = ['', '', 'बीस', 'तीस', 'चालीस', 'पचास', 'साठ', 'सत्तर', 'अस्सी', 'नब्बे'];

  const convertTwoDigits = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n];
    const rem = n % 10;
    return `${tens[Math.floor(n / 10)]}${rem > 0 ? ' ' + ones[rem] : ''}`.trim();
  };

  const convertThreeDigits = (n: number): string => {
    if (n === 0) return '';
    const h = Math.floor(n / 100);
    const rem = n % 100;
    const hundredPart = h > 0 ? `${ones[h]} सौ` : '';
    const remPart = convertTwoDigits(rem);
    return `${hundredPart} ${remPart}`.trim();
  };

  if (amount === 0) return 'शून्य रुपये मात्र';

  const num = Math.floor(amount);
  const thousands = Math.floor(num / 1000);
  const remainder = num % 1000;

  let result = '';
  if (thousands > 0) {
    result += `${convertThreeDigits(thousands)} हज़ार `;
  }
  if (remainder > 0) {
    result += convertThreeDigits(remainder);
  }

  return `${result.trim()} रुपये मात्र`;
}
