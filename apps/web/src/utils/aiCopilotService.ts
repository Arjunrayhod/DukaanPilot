/**
 * AI Kirana Copilot & Smart WhatsApp Grocery List Engine
 * Parses raw unformatted customer chat messages into structured POS cart orders
 * & provides natural Hindi business intelligence queries.
 */

import { getCleanHindiName } from './productFormat.ts';

export interface ParsedGroceryItem {
  id: string;
  name: string;
  hindiName?: string;
  qty: number;
  unit: string;
  price: number;
  total: number;
  matchedCategory?: string;
  matchScore: number;
}

export interface WhatsAppListParseResult {
  customerNotes?: string;
  matchedItems: ParsedGroceryItem[];
  unmatchedLines: string[];
  totalItemCount: number;
  totalEstimatedAmount: number;
}

const HINGLISH_SYNONYMS: Record<string, string[]> = {
  doodh: ['milk', 'दूध', 'doodh', 'dairy', 'taaza', 'amul'],
  cheeni: ['sugar', 'चीनी', 'cheeni', 'shakkar', 'madhur'],
  chini: ['sugar', 'चीनी', 'cheeni', 'shakkar', 'madhur'],
  chai: ['tea', 'चाय', 'chai', 'patti', 'gold'],
  patti: ['tea', 'चाय', 'chai', 'patti'],
  atta: ['atta', 'aata', 'आटा', 'flour', 'aashirvaad', 'chakki'],
  aata: ['atta', 'aata', 'आटा', 'flour', 'aashirvaad', 'chakki'],
  chawal: ['rice', 'चावल', 'chawal', 'basmati'],
  tel: ['oil', 'तेल', 'tel', 'mustard', 'refined', 'ghee'],
  ghee: ['ghee', 'घी', 'oil', 'amul'],
  bread: ['bread', 'ब्रेड', 'britannia', 'harvest'],
  biscuit: ['biscuit', 'बिस्कुट', 'biskut', 'parle', 'britannia', 'cookies'],
  biskut: ['biscuit', 'बिस्कुट', 'biskut', 'parle', 'britannia'],
  namkeen: ['namkeen', 'नमकीन', 'bhujia', 'haldiram', 'sev'],
  bhujia: ['namkeen', 'नमकीन', 'bhujia', 'haldiram'],
  soap: ['soap', 'साबुन', 'sabun', 'dettol', 'lifebuoy', 'lux'],
  sabun: ['soap', 'साबुन', 'sabun', 'dettol', 'lifebuoy'],
  surf: ['surf', 'detergent', 'सर्फ', 'excel', 'tide', 'ariel', 'detergent'],
  paste: ['toothpaste', 'टूथपेस्ट', 'colgate', 'close up', 'pepsodent'],
  colgate: ['toothpaste', 'टूथपेस्ट', 'colgate'],
  namak: ['salt', 'नमक', 'namak', 'tata'],
  salt: ['salt', 'नमक', 'namak', 'tata'],
};

export function parseWhatsAppGroceryList(
  rawText: string,
  catalog: Array<{ id: string | number; name: string; nameHindi?: string; hindi?: string; sellingPrice?: number; price?: number; category?: string; unit?: string }>
): WhatsAppListParseResult {
  const lines = rawText
    .split(/[\n,\r]+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.toLowerCase().startsWith('namaste') && !l.toLowerCase().startsWith('bhaiya') && !l.toLowerCase().includes('bhej do') && !l.toLowerCase().includes('order:'));

  const matchedItems: ParsedGroceryItem[] = [];
  const unmatchedLines: string[] = [];

  for (const line of lines) {
    // Strip bullet markers only (e.g. "1.", "1)", "1-", "*", "-", "•")
    let cleanLine = line
      .replace(/^\s*(?:\d+[\.\)\-:]|[-*•])\s*/, '')
      .replace(/(kripya|please|jaldi|bhejo)/gi, ' ')
      .trim();

    if (!cleanLine || cleanLine.length < 2) continue;

    // Extract quantity and unit
    let qty = 1;
    let unit = 'packet';

    const qtyNumMatch = cleanLine.match(/(\d+(?:\.\d+)?)\s*(kg|kilo|litre|liter|packet|pkt|bottle|bag|pouch|piece|pc|gm|g|ml)?/i);
    if (qtyNumMatch) {
      qty = parseFloat(qtyNumMatch[1]) || 1;
      if (qtyNumMatch[2]) unit = qtyNumMatch[2].toLowerCase();
      cleanLine = cleanLine.replace(qtyNumMatch[0], ' ').trim();
    } else if (/आधा|aadha|half/i.test(cleanLine)) {
      qty = 0.5;
      cleanLine = cleanLine.replace(/आधा|aadha|half/gi, ' ').trim();
    } else if (/डेढ़|dedh/i.test(cleanLine)) {
      qty = 1.5;
      cleanLine = cleanLine.replace(/डेढ़|dedh/gi, ' ').trim();
    } else if (/ढाई|dhai/i.test(cleanLine)) {
      qty = 2.5;
      cleanLine = cleanLine.replace(/ढाई|dhai/gi, ' ').trim();
    } else if (/एक|ek/i.test(cleanLine)) {
      qty = 1;
      cleanLine = cleanLine.replace(/एक|ek/gi, ' ').trim();
    } else if (/दो|do/i.test(cleanLine)) {
      qty = 2;
      cleanLine = cleanLine.replace(/दो|do/gi, ' ').trim();
    } else if (/तीन|teen/i.test(cleanLine)) {
      qty = 3;
      cleanLine = cleanLine.replace(/तीन|teen/gi, ' ').trim();
    }

    // Clean up residual words like 'kilo', 'packet', 'liter', 'kg'
    cleanLine = cleanLine.replace(/\b(kilo|packet|pkt|litre|liter|kg|bag|bottle|gm|g|ml|wala|wali|ka|ki|ke)\b/gi, ' ').trim();

    const rawTokens = cleanLine.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    const expandedTokens = new Set<string>();

    for (const tok of rawTokens) {
      expandedTokens.add(tok);
      if (HINGLISH_SYNONYMS[tok]) {
        for (const syn of HINGLISH_SYNONYMS[tok]) {
          expandedTokens.add(syn);
        }
      }
    }

    let bestMatch: any = null;
    let highestScore = 0;

    for (const prod of catalog) {
      const pName = prod.name.toLowerCase();
      const pHindi = (prod.nameHindi || prod.hindi || '').toLowerCase();
      const pCat = (prod.category || '').toLowerCase();

      let score = 0;
      for (const tok of expandedTokens) {
        if (pName.includes(tok)) score += 3;
        if (pHindi.includes(tok)) score += 4;
        if (pCat.includes(tok)) score += 2;
      }

      if (score > highestScore && score >= 3) {
        highestScore = score;
        bestMatch = prod;
      }
    }

    if (bestMatch) {
      const price = bestMatch.sellingPrice ?? bestMatch.price ?? 50;
      matchedItems.push({
        id: String(bestMatch.id),
        name: bestMatch.name,
        hindiName: bestMatch.hindi || bestMatch.nameHindi,
        qty,
        unit: bestMatch.unit || unit,
        price,
        total: Math.round(price * qty),
        matchedCategory: bestMatch.category,
        matchScore: highestScore
      });
    } else {
      unmatchedLines.push(line);
    }
  }

  const totalItemCount = matchedItems.reduce((s, it) => s + it.qty, 0);
  const totalEstimatedAmount = matchedItems.reduce((s, it) => s + it.total, 0);

  return {
    matchedItems,
    unmatchedLines,
    totalItemCount,
    totalEstimatedAmount
  };
}

export interface AiCopilotContext {
  todaySales: number;
  todayBills: number;
  totalProfit: number;
  totalKhataDue: number;
  topOverdueCustomer?: { name: string; due: number };
  lowStockCount: number;
  nearExpiryCount: number;
  supplierPendingDue: number;
  shopName: string;
}

export function askKiranaAiCopilot(query: string, ctx: AiCopilotContext, lang: 'hi' | 'en' = 'hi'): {
  reply: string;
  actionTitle?: string;
  actionTab?: string;
} {
  const q = query.toLowerCase().trim();

  // 1. Sales & Revenue & Bikri
  if (q.includes('बिक्री') || q.includes('bikri') || q.includes('sales') || q.includes('sale') || q.includes('कमाई') || q.includes('kamai') || q.includes('revenue')) {
    if (lang === 'hi') {
      return {
        reply: `📊 आज की कुल बिक्री ₹${ctx.todaySales.toLocaleString('en-IN')} है (${ctx.todayBills} बिल)। अनुमानित मुनाफा ₹${ctx.totalProfit.toLocaleString('en-IN')} है।`,
        actionTitle: 'एनालिटिक्स व Z-रिपोर्ट देखें',
        actionTab: 'analytics'
      };
    }
    return {
      reply: `📊 Today's total sales: ₹${ctx.todaySales.toLocaleString('en-IN')} across ${ctx.todayBills} bills with ₹${ctx.totalProfit.toLocaleString('en-IN')} net profit.`,
      actionTitle: 'View Sales Analytics',
      actionTab: 'analytics'
    };
  }

  // 2. Khata & Udhar
  if (q.includes('उधार') || q.includes('udhar') || q.includes('khata') || q.includes('बाकी') || q.includes('baki') || q.includes('due') || q.includes('recovery')) {
    const custInfo = ctx.topOverdueCustomer
      ? ` सबसे बड़ा बकाया ${ctx.topOverdueCustomer.name} पर (₹${ctx.topOverdueCustomer.due.toLocaleString('en-IN')}) है।`
      : '';
    if (lang === 'hi') {
      return {
        reply: `📖 दुकान का कुल उधार बकाया ₹${ctx.totalKhataDue.toLocaleString('en-IN')} है।${custInfo} आप WhatsApp पर 1-क्लिक पेमेंट लिंक भेज सकते हैं।`,
        actionTitle: 'खाता बही खोलें',
        actionTab: 'khata'
      };
    }
    return {
      reply: `📖 Total outstanding khata due is ₹${ctx.totalKhataDue.toLocaleString('en-IN')}.${custInfo} Send 1-click WhatsApp reminders now.`,
      actionTitle: 'Open Khata Ledger',
      actionTab: 'khata'
    };
  }

  // 3. Expiry & FIFO
  if (q.includes('expiry') || q.includes('एक्सपायरी') || q.includes('खराब') || q.includes('kharab') || q.includes('date')) {
    if (lang === 'hi') {
      return {
        reply: `⚠️ ${ctx.nearExpiryCount} सामान 7 दिनों के भीतर एक्सपायर होने वाले हैं (जैसे दूध व ब्रेड)। इन्हें FIFO के तहत पहले काउंटर पर रखें या सप्लायर को रिटर्न मार्क करें।`,
        actionTitle: 'इन्वेंटरी एक्सपायरी अलर्ट्स देखें',
        actionTab: 'inventory'
      };
    }
    return {
      reply: `⚠️ ${ctx.nearExpiryCount} items near expiry (< 7 days). Prioritize FIFO sales or mark return to distributor.`,
      actionTitle: 'View Expiry Watch',
      actionTab: 'inventory'
    };
  }

  // 4. Low stock & Supplier PO
  if (q.includes('स्टॉक') || q.includes('stock') || q.includes('kam') || q.includes('कम') || q.includes('order') || q.includes('supplier') || q.includes('माल')) {
    if (lang === 'hi') {
      return {
        reply: `📦 ${ctx.lowStockCount} सामान री-ऑर्डर लेवल से नीचे हैं। सप्लायर को कुल ₹${ctx.supplierPendingDue.toLocaleString('en-IN')} का भुगतान बाकी है। तुरंत WhatsApp PO भेजें।`,
        actionTitle: 'सप्लायर मैनेजमेंट व PO भेजें',
        actionTab: 'suppliers'
      };
    }
    return {
      reply: `📦 ${ctx.lowStockCount} items below threshold. Supplier AP due: ₹${ctx.supplierPendingDue.toLocaleString('en-IN')}. Generate restock PO now.`,
      actionTitle: 'Manage Suppliers & PO',
      actionTab: 'suppliers'
    };
  }

  // General Helper
  if (lang === 'hi') {
    return {
      reply: `🤖 नमस्ते! मैं ${ctx.shopName} का AI कोपायलट हूँ। आप मुझसे आज की बिक्री, खाता वसूली, एक्सपायरी अलर्ट या WhatsApp लिस्ट से तुरंत बिलिंग के बारे में पूछ सकते हैं।`,
      actionTitle: 'POS बिलिंग शुरू करें',
      actionTab: 'pos'
    };
  }
  return {
    reply: `🤖 Hello! I am the AI Copilot for ${ctx.shopName}. Ask me about sales, overdue khata, expiry alerts, or convert WhatsApp grocery lists into POS bills.`,
    actionTitle: 'Start POS Billing',
    actionTab: 'pos'
  };
}
