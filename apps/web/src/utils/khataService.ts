/**
 * DukaanPilot - Digital Khata Ledger & Automated WhatsApp Reminder Service
 */

export interface KhataTransaction {
  id: string;
  date: string;
  time: string;
  type: 'DEBIT' | 'CREDIT'; // DEBIT = उधार दिया (Give Credit), CREDIT = जमा मिला (Receive Payment)
  amount: number;
  balanceAfter: number;
  notes: string;
  paymentMode?: 'cash' | 'upi' | 'other';
  billNo?: string;
}

export interface KhataCustomer {
  id: string;
  name: string;
  phone: string;
  address?: string;
  currentDue: number;
  creditLimit: number;
  lastPaymentDate?: string;
  lastDebitDate?: string;
  overdueDays: number;
  transactions: KhataTransaction[];
}

export const INITIAL_KHATA_CUSTOMERS: KhataCustomer[] = [
  {
    id: 'khata_cust_01',
    name: 'रमेश कुमार (Ramesh Kumar)',
    phone: '9823456789',
    address: 'मकान नं. 12, गली नं. 2, मेन बाजार',
    currentDue: 1450,
    creditLimit: 5000,
    lastDebitDate: '12/09/2026',
    lastPaymentDate: '01/09/2026',
    overdueDays: 7,
    transactions: [
      {
        id: 'tx_101',
        date: '01/09/2026',
        time: '10:15 AM',
        type: 'CREDIT',
        amount: 500,
        balanceAfter: 0,
        notes: 'पुरानी उधारी का भुगतान',
        paymentMode: 'cash'
      },
      {
        id: 'tx_102',
        date: '05/09/2026',
        time: '04:30 PM',
        type: 'DEBIT',
        amount: 850,
        balanceAfter: 850,
        notes: '2 बैग आशीर्वाद आटा और 1L तेल',
        billNo: 'Bill #2014'
      },
      {
        id: 'tx_103',
        date: '12/09/2026',
        time: '07:20 PM',
        type: 'DEBIT',
        amount: 600,
        balanceAfter: 1450,
        notes: 'चीनी, चाय पत्ती व घी',
        billNo: 'Bill #2031'
      }
    ]
  },
  {
    id: 'khata_cust_02',
    name: 'सुनील बंसल (Sunil Bansal)',
    phone: '9811012345',
    address: 'दुकान नं. 5, अनाज मंडी',
    currentDue: 2150,
    creditLimit: 10000,
    lastDebitDate: '04/09/2026',
    lastPaymentDate: '28/08/2026',
    overdueDays: 15,
    transactions: [
      {
        id: 'tx_201',
        date: '28/08/2026',
        time: '11:00 AM',
        type: 'CREDIT',
        amount: 1000,
        balanceAfter: 0,
        notes: 'UPI द्वारा भुगतान',
        paymentMode: 'upi'
      },
      {
        id: 'tx_202',
        date: '04/09/2026',
        time: '06:45 PM',
        type: 'DEBIT',
        amount: 2150,
        balanceAfter: 2150,
        notes: 'मासिक राशन सामग्री',
        billNo: 'Bill #2008'
      }
    ]
  },
  {
    id: 'khata_cust_03',
    name: 'अमित वर्मा (Amit Verma)',
    phone: '9845011223',
    address: 'फ्लैट नं. 402, शांति निकेतन',
    currentDue: 620,
    creditLimit: 3000,
    lastDebitDate: '15/09/2026',
    lastPaymentDate: '10/09/2026',
    overdueDays: 4,
    transactions: [
      {
        id: 'tx_301',
        date: '15/09/2026',
        time: '08:10 PM',
        type: 'DEBIT',
        amount: 620,
        balanceAfter: 620,
        notes: 'दूध, मक्खन व ब्रेड',
        billNo: 'Bill #2040'
      }
    ]
  },
  {
    id: 'khata_cust_04',
    name: 'विकास जिंदल (Vikas Jindal)',
    phone: '9822023456',
    address: 'सेक्टर 14, ब्लॉक बी',
    currentDue: 0,
    creditLimit: 5000,
    lastPaymentDate: '17/09/2026',
    overdueDays: 0,
    transactions: [
      {
        id: 'tx_401',
        date: '10/09/2026',
        time: '02:00 PM',
        type: 'DEBIT',
        amount: 1200,
        balanceAfter: 1200,
        notes: 'रिफाइंड तेल व मसाले',
        billNo: 'Bill #2022'
      },
      {
        id: 'tx_402',
        date: '17/09/2026',
        time: '05:30 PM',
        type: 'CREDIT',
        amount: 1200,
        balanceAfter: 0,
        notes: 'UPI द्वारा पूर्ण भुगतान',
        paymentMode: 'upi'
      }
    ]
  }
];

/**
 * Formats a polite and effective WhatsApp Payment Reminder Message
 */
export function formatKhataReminderMessage(
  customer: {
    name: string;
    phone: string;
    currentDue: number;
    lastDebitDate?: string;
    overdueDays?: number;
  },
  shopInfo = {
    name: 'श्री गणेश किराना स्टोर (Shree Ganesh Kirana)',
    phone: '+91 98765 43210',
    upiId: 'shreeganesh@sbi'
  },
  lang: 'hi' | 'en' = 'hi'
): string {
  const isHi = lang === 'hi';

  let msg = isHi
    ? `नमस्ते *${customer.name} जी* 🙏\n\n`
    : `Dear *${customer.name}* 🙏\n\n`;

  msg += isHi
    ? `*${shopInfo.name}* की ओर से आपका कुल बकाया खाता:\n`
    : `Payment reminder from *${shopInfo.name}* for your pending khata balance:\n`;

  msg += `💰 *${isHi ? 'कुल बकाया राशि' : 'Total Outstanding Balance'}: ₹${customer.currentDue.toLocaleString('en-IN')}*\n`;
  if (customer.lastDebitDate) {
    msg += `📅 ${isHi ? 'अंतिम उधारी तारीख' : 'Last Purchase Date'}: ${customer.lastDebitDate} (${customer.overdueDays || 0} ${isHi ? 'दिन पहले' : 'days ago'})\n`;
  }
  msg += `--------------------------------\n`;
  msg += `💳 ${isHi ? 'घर बैठे सीधे UPI (PhonePe / GPay / Paytm) से भुगतान करने के लिए नीचे दिए गए लिंक पर क्लिक करें:' : 'Pay directly via UPI (PhonePe / GPay / Paytm) by clicking the link below:'}\n\n`;

  const upiPayLink = `upi://pay?pa=${encodeURIComponent(shopInfo.upiId)}&pn=${encodeURIComponent(shopInfo.name)}&am=${customer.currentDue}&cu=INR&tn=Khata_Due_${encodeURIComponent(customer.name)}`;
  msg += `🔗 ${upiPayLink}\n\n`;
  msg += `--------------------------------\n`;
  msg += `📞 ${isHi ? 'किसी भी प्रश्न के लिए संपर्क करें' : 'For any queries contact'}: ${shopInfo.phone}\n`;
  msg += `🙏 *${isHi ? 'धन्यवाद! आपका दिन शुभ हो।' : 'Thank you! Have a great day.'}*`;

  return msg;
}

/**
 * Generates WhatsApp click-to-chat URL for Khata Reminder
 */
export function generateKhataWhatsAppUrl(
  customer: {
    name: string;
    phone: string;
    currentDue: number;
    lastDebitDate?: string;
    overdueDays?: number;
  },
  shopInfo?: {
    name: string;
    phone: string;
    upiId: string;
  },
  lang: 'hi' | 'en' = 'hi'
): string {
  const text = formatKhataReminderMessage(customer, shopInfo, lang);
  const cleanPhone = (customer.phone || '').replace(/[^\d]/g, '');
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(text)}`;
}

export interface ParsedVoiceKhataResult {
  amount: number;
  type: 'DEBIT' | 'CREDIT';
  matchedCustomer?: KhataCustomer;
  extractedNewCustomerName?: string;
  notes: string;
}

/**
 * Smart NLP parser for Voice Khata Commands
 * Handles sentences like:
 * - "अर्जुन राठौड़ ने 500 रुपए जमा करवाए" -> Match Arjun Rathore, Amount 500, CREDIT
 * - "अर्जुन राठौड़ ने 50 रुपए का धनिया लिया" -> Match Arjun Rathore, Amount 50, DEBIT, Note: धनिया
 * - "रमेश कुमार 500 रुपये उधार लिखो" -> Match Ramesh Kumar, Amount 500, DEBIT
 */
export function parseVoiceKhataCommand(
  rawSpoken: string,
  existingCustomers: KhataCustomer[] = []
): ParsedVoiceKhataResult {
  const trimmed = rawSpoken.trim();
  if (!trimmed) {
    return { amount: 0, type: 'DEBIT', notes: '' };
  }

  const lower = trimmed.toLowerCase();
  const normalized = lower
    .replace(/[,\.।\?!:;\-\+_\/\\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // 1. Transaction Type (CREDIT / जमा vs DEBIT / उधार)
  const isJama =
    /\b(jama|paid|payment|mila|mili|mile|diya|diye|bheja|bhara|pay|received)\b/i.test(normalized) ||
    /(जमा|भुगतान|पेमेंट|मिला|मिली|मिले|दिए|दिया|दी|भेजा|भरा|जमा करवाए|जमा करवाया|जमा करवाई|जमा करवाये)/.test(normalized);

  const type: 'DEBIT' | 'CREDIT' = isJama ? 'CREDIT' : 'DEBIT';

  // 2. Amount Extraction
  const numMatch = normalized.match(/(\d+)/);
  const amount = numMatch ? parseInt(numMatch[1], 10) : 0;

  // 3. Match against existing customers
  let bestCustomer: KhataCustomer | undefined;
  let bestScore = 0;

  for (const cust of existingCustomers) {
    // Extract base names (clean out English translation in parens like "रमेश कुमार (Ramesh Kumar)")
    const cleanName = cust.name.replace(/\(.*?\)/g, '').trim().toLowerCase();
    const englishPartMatch = cust.name.match(/\((.*?)\)/);
    const englishName = englishPartMatch ? englishPartMatch[1].toLowerCase().trim() : '';

    const nameParts = cleanName.split(/\s+/).filter(p => p.length >= 2);
    const engParts = englishName.split(/\s+/).filter(p => p.length >= 2);

    let score = 0;

    // Full name match
    if (cleanName && normalized.includes(cleanName)) {
      score += 100 + cleanName.length;
    }
    if (englishName && normalized.includes(englishName)) {
      score += 100 + englishName.length;
    }

    // Partial word matches (First name, Last name)
    for (const part of nameParts) {
      if (normalized.includes(part)) {
        score += 20 + part.length;
      }
    }
    for (const part of engParts) {
      if (normalized.includes(part)) {
        score += 20 + part.length;
      }
    }

    // Phone match
    if (cust.phone && normalized.includes(cust.phone)) {
      score += 150;
    }

    if (score > bestScore) {
      bestScore = score;
      bestCustomer = cust;
    }
  }

  // If score is at least a word match (>= 20), we found the customer!
  if (bestScore >= 20 && bestCustomer) {
    // Extract notes if items were mentioned
    let notes = isJama ? 'वॉइस जमा एंट्री' : 'वॉइस सामान उधारी';
    if (/धनिया|dhaniya/i.test(normalized)) notes = 'धनिया';
    else if (/आटा|atta/i.test(normalized)) notes = 'आटा';
    else if (/तेल|oil|tel/i.test(normalized)) notes = 'तेल';
    else if (/दूध|milk|doodh/i.test(normalized)) notes = 'दूध';
    else if (/चीनी|sugar|chini/i.test(normalized)) notes = 'चीनी';
    else if (/दाल|dal/i.test(normalized)) notes = 'दाल';

    return {
      amount,
      type,
      matchedCustomer: bestCustomer,
      notes
    };
  }

  // 4. No existing customer matched: Clean out all stopwords to get clean new customer name
  const words = normalized.split(/\s+/);
  const stopWords = new Set([
    // Particles / Prepositions
    'ne', 'ko', 'se', 'ka', 'ki', 'ke', 'me', 'mein', 'par', 'pe', 'aur', 'bhi', 'wala', 'wale', 'wali', 'gaya', 'gaye', 'gayi', 'tha', 'thi', 'the', 'hai', 'hain', 'na', 'ji',
    'ने', 'को', 'से', 'का', 'की', 'के', 'में', 'पर', 'पे', 'और', 'भी', 'वाला', 'वाले', 'वाली', 'गया', 'गए', 'गयी', 'था', 'थी', 'थे', 'है', 'हैं', 'ना', 'जी',
    // Actions & Verbs
    'jama', 'udhaar', 'udhari', 'paid', 'payment', 'credit', 'debit', 'likho', 'likhna', 'likh', 'jodo', 'karo', 'kare', 'karein', 'karwaye', 'karwaya', 'karvaye', 'karvaya', 'kiya', 'kiye', 'diye', 'diya', 'di', 'liye', 'liya', 'lee', 'kharida', 'chuka', 'chukaya', 'mila', 'mili', 'mile', 'bheja', 'bhara', 'kar', 'karen',
    'जमा', 'उधार', 'उधारी', 'लिखो', 'लिखना', 'लिख', 'जोड़ो', 'करो', 'करें', 'करवाए', 'करवाया', 'करवाई', 'करवाये', 'करवाये', 'किया', 'किये', 'दिए', 'दिया', 'दी', 'लिए', 'लिया', 'ली', 'खरीदा', 'चुकाया', 'मिला', 'मिली', 'मिले', 'भेजा', 'भरा', 'कर',
    // Currency & Units
    'rupay', 'rupaye', 'rupee', 'rupees', 'rs', 'inr', 'paisa', 'paise', 'hazar', 'sau', 'kg', 'kilo', 'gram', 'liter', 'litre', 'l', 'packet', 'pouch', 'bar', 'bag',
    'रुपए', 'रुपया', 'रपए', 'रुपये', 'रु', '₹', 'पैसा', 'पैसे', 'हजार', 'सौ', 'किलो', 'ग्राम', 'लीटर', 'पैकेट', 'बैग',
    // Grocery items
    'dhaniya', 'atta', 'tel', 'dhal', 'dal', 'chini', 'doodh', 'sabun', 'chay', 'mirch', 'haldi', 'ghee', 'biscuit', 'saman', 'samaan', 'grocery',
    'धनिया', 'आटा', 'तेल', 'दाल', 'चीनी', 'दूध', 'साबुन', 'चाय', 'मिर्च', 'हल्दी', 'घी', 'बिस्कुट', 'सामान'
  ]);

  const cleanTokens = words.filter(w => {
    if (/^\d+$/.test(w)) return false; // filter numbers
    if (stopWords.has(w)) return false;
    return w.length >= 2;
  });

  let extractedName = cleanTokens.slice(0, 3).join(' ').trim();
  if (extractedName) {
    extractedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
  }

  let notes = isJama ? 'वॉइस जमा एंट्री' : 'वॉइस सामान उधारी';
  if (/धनिया|dhaniya/i.test(normalized)) notes = 'धनिया';
  else if (/आटा|atta/i.test(normalized)) notes = 'आटा';
  else if (/तेल|oil|tel/i.test(normalized)) notes = 'तेल';
  else if (/दूध|milk|doodh/i.test(normalized)) notes = 'दूध';
  else if (/चीनी|sugar|chini/i.test(normalized)) notes = 'चीनी';
  else if (/दाल|dal/i.test(normalized)) notes = 'दाल';

  return {
    amount,
    type,
    matchedCustomer: undefined,
    extractedNewCustomerName: extractedName || undefined,
    notes
  };
}
