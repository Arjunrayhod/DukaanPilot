/**
 * DukaanPilot - Kirana Hinglish & Hindi Conversational NLP Parser
 */

export interface ParsedItem {
  rawText: string;
  matchedProduct: any | null;
  productQuery: string;
  quantity: number;
  unit: string;
  confidence: number;
}

export interface ParsedVoiceCommand {
  intent: 'ADD_ITEMS' | 'CLEAR_CART' | 'PRINT_BILL' | 'RECORD_KHATA' | 'UNKNOWN';
  items: ParsedItem[];
  khataPayload?: {
    customerName: string;
    amount: number;
    type: 'JAMA' | 'UDHAAR';
  };
  originalText: string;
}

// Hindi & Hinglish number dictionary
const NUMBER_WORDS: Record<string, number> = {
  'ek': 1, 'एक': 1, 'one': 1, '1': 1,
  'do': 2, 'दो': 2, 'two': 2, '2': 2,
  'teen': 3, 'तीन': 3, 'three': 3, '3': 3,
  'chaar': 4, 'char': 4, 'चार': 4, 'four': 4, '4': 4,
  'paanch': 5, 'panch': 5, 'पांच': 5, 'पाँच': 5, 'five': 5, '5': 5,
  'chhe': 6, 'che': 6, 'छह': 6, 'six': 6, '6': 6,
  'saat': 7, 'sat': 7, 'सात': 7, 'seven': 7, '7': 7,
  'aath': 8, 'ath': 8, 'आठ': 8, 'eight': 8, '8': 8,
  'nau': 9, 'no': 9, 'नौ': 9, 'nine': 9, '9': 9,
  'das': 10, 'दस': 10, 'ten': 10, '10': 10,
  'aadha': 0.5, 'adha': 0.5, 'आधा': 0.5, 'half': 0.5,
  'paav': 0.25, 'पाव': 0.25, 'quarter': 0.25,
  'dedh': 1.5, 'डेढ़': 1.5,
  'dhai': 2.5, 'ढाई': 2.5,
};

// Unit dictionary
const UNIT_WORDS: Record<string, string> = {
  'kilo': 'kg', 'kg': 'kg', 'किलो': 'kg', 'kgs': 'kg',
  'gram': 'g', 'gm': 'g', 'ग्राम': 'g', 'g': 'g', 'gms': 'g',
  'packet': 'packet', 'pkt': 'packet', 'पैकेट': 'packet', 'pack': 'packet', 'packets': 'packet',
  'litre': 'litre', 'liter': 'litre', 'लीटर': 'litre', 'l': 'litre', 'ltr': 'litre',
  'bottle': 'bottle', 'बोतल': 'bottle', 'bottles': 'bottle',
  'dabba': 'box', 'डिब्बा': 'box', 'box': 'box', 'boxes': 'box',
  'pouch': 'pouch', 'पाउच': 'pouch', 'pouches': 'pouch',
  'piece': 'piece', 'pc': 'piece', 'पीस': 'piece', 'pcs': 'piece',
  'bag': 'bag', 'बोरी': 'bag', 'थैली': 'bag',
  'tin': 'tin', 'टिन': 'tin',
  'darjan': 'dozen', 'दर्जन': 'dozen', 'dozen': 'dozen',
};

// Common grocery synonyms & slang map
const SYNONYM_MAP: Record<string, string> = {
  'doodh': 'milk', 'dudh': 'milk', 'दूध': 'milk',
  'cheeni': 'sugar', 'chini': 'sugar', 'चीनी': 'sugar', 'shakkar': 'sugar',
  'tel': 'oil', 'tail': 'oil', 'तेल': 'oil', 'sarson': 'mustard', 'sarso': 'mustard',
  'atta': 'atta', 'aata': 'atta', 'आटा': 'atta',
  'chawal': 'rice', 'चावल': 'rice', 'basmati': 'basmati',
  'namak': 'salt', 'नमक': 'salt', 'tata salt': 'tata salt',
  'chai': 'tea', 'chay': 'tea', 'चाय': 'tea', 'chaye': 'tea',
  'makkhan': 'butter', 'makhan': 'butter', 'मक्खन': 'butter',
  'dahi': 'curd', 'दही': 'curd',
  'ghee': 'ghee', 'घी': 'ghee',
  'bread': 'bread', 'ब्रेड': 'bread',
  'besan': 'besan', 'बेसन': 'besan',
  'sooji': 'sooji', 'suji': 'sooji', 'सूजी': 'sooji', 'rawa': 'sooji',
  'maggi': 'maggi', 'मैगी': 'maggi', 'noodles': 'noodles',
  'biscuit': 'biscuit', 'बिस्कुट': 'biscuit', 'parle': 'parle',
  'sabun': 'soap', 'साबुन': 'soap', 'surf': 'surf',
};

/**
 * Normalizes text: removes filler words and punctuations
 */
function cleanTranscript(text: string): string {
  return text
    .toLowerCase()
    .replace(/[,\.।\?!:;\-\+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Parses user speech into intent and items
 */
export function parseVoiceInput(rawText: string, catalog: any[] = []): ParsedVoiceCommand {
  const cleaned = cleanTranscript(rawText);

  if (!cleaned) {
    return { intent: 'UNKNOWN', items: [], originalText: rawText };
  }

  // 1. Check for Clear Cart intent
  if (
    cleaned.includes('clear bill') ||
    cleaned.includes('bill khali') ||
    cleaned.includes('bill saaf') ||
    cleaned.includes('cancel bill') ||
    cleaned.includes('कार्ट खाली') ||
    cleaned.includes('बिल खाली')
  ) {
    return { intent: 'CLEAR_CART', items: [], originalText: rawText };
  }

  // 2. Check for Print / Checkout intent
  if (
    cleaned.includes('print bill') ||
    cleaned.includes('bill print') ||
    cleaned.includes('parchi nikalo') ||
    cleaned.includes('रसीद निकालो') ||
    cleaned.includes('बिल प्रिंट')
  ) {
    return { intent: 'PRINT_BILL', items: [], originalText: rawText };
  }

  // 3. Check for Khata Payment intent
  // e.g. "Ramesh ka 500 rupay jama karo" or "Suresh udhaar 200"
  if (
    cleaned.includes('jama') ||
    cleaned.includes('जमा') ||
    cleaned.includes('udhaar') ||
    cleaned.includes('उधार')
  ) {
    const isJama = cleaned.includes('jama') || cleaned.includes('जमा');
    const amountMatch = cleaned.match(/(\d+)/);
    const amount = amountMatch ? parseInt(amountMatch[1], 10) : 0;
    
    // Extract customer name by removing common words
    const words = cleaned
      .replace(/(jama|udhaar|karo|rupay|rupee|rs|ka|ki|ke|ko|se|₹|\d+)/gi, '')
      .trim();

    return {
      intent: 'RECORD_KHATA',
      items: [],
      khataPayload: {
        customerName: words || 'Customer',
        amount,
        type: isJama ? 'JAMA' : 'UDHAAR'
      },
      originalText: rawText
    };
  }

  // 4. Default: Add Items to POS Cart
  // Split phrases by conjunctions like 'aur', 'और', 'and', 'or', 'tatha', 'तथा', 'plus'
  const segments = cleaned
    .split(/\s+(?:aur|और|and|tatha|तथा|or|या|evam|एवं|plus|\+|aur ek|और एक|aur bhi|और भी|va|व)\s+/i)
    .map(s => s.trim())
    .filter(Boolean);

  const parsedItems: ParsedItem[] = [];

  for (const seg of segments) {
    const item = parseSingleItemSegment(seg, catalog);
    if (item) {
      parsedItems.push(item);
    }
  }

  return {
    intent: parsedItems.length > 0 ? 'ADD_ITEMS' : 'UNKNOWN',
    items: parsedItems,
    originalText: rawText
  };
}

/**
 * Parses a single item segment like "2 packet amul doodh" or "1 kg cheeni"
 */
function parseSingleItemSegment(segment: string, catalog: any[]): ParsedItem | null {
  // Remove trailing action words like 'add karo', 'daalo', 'bill me dalo', 'jodo', 'जोड़ो', 'डालो'
  const text = segment
    .replace(/(?:add karo|dalo|daalo|jodo|le lo|bhi dalo|likho|bill karo|bill me dalo|जोड़ो|डालो|लिखो|करो|बिल में डालो|ले लो)/gi, '')
    .trim();

  if (!text) return null;

  const tokens = text.split(/\s+/);
  let quantity = 1;
  let unit = 'packet';
  let productTokens: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Check if token is a number
    if (NUMBER_WORDS[token] !== undefined) {
      quantity = NUMBER_WORDS[token];
      continue;
    }

    if (/^\d+(\.\d+)?$/.test(token)) {
      quantity = parseFloat(token);
      continue;
    }

    // Check if token is a unit
    if (UNIT_WORDS[token] !== undefined) {
      unit = UNIT_WORDS[token];
      continue;
    }

    // Otherwise it belongs to product name
    productTokens.push(token);
  }

  const productQuery = productTokens.join(' ').trim();
  if (!productQuery && !catalog.length) {
    return null;
  }

  // Fuzzy match with catalog
  const matchedProduct = matchProductFromCatalog(productQuery, catalog);

  return {
    rawText: segment,
    productQuery,
    quantity: quantity > 0 ? quantity : 1,
    unit: matchedProduct?.unit || unit,
    matchedProduct,
    confidence: matchedProduct ? 0.9 : 0.4
  };
}

/**
 * Fuzzy matches a product query string against the catalog items
 */
export function matchProductFromCatalog(query: string, catalog: any[]): any | null {
  if (!query || !catalog || catalog.length === 0) return null;

  const cleanQuery = query.toLowerCase();

  // 1. Direct exact or substring match in name or Hindi name
  for (const item of catalog) {
    const name = (item.name || '').toLowerCase();
    const hindi = (item.nameHindi || item.hindi || '').toLowerCase();
    if (name.includes(cleanQuery) || hindi.includes(cleanQuery)) {
      return item;
    }
  }

  // 2. Token overlap score matching
  const queryWords = cleanQuery.split(/\s+/).map(w => SYNONYM_MAP[w] || w);
  let bestMatch: any = null;
  let highestScore = 0;

  for (const item of catalog) {
    const itemWords = `${item.name || ''} ${item.nameHindi || ''} ${item.categoryName || ''}`.toLowerCase();
    let score = 0;

    for (const qWord of queryWords) {
      if (itemWords.includes(qWord)) {
        score += 2;
      }
      // Check synonyms
      for (const [synKey, synVal] of Object.entries(SYNONYM_MAP)) {
        if (qWord === synKey && itemWords.includes(synVal)) {
          score += 3;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = item;
    }
  }

  return highestScore >= 2 ? bestMatch : null;
}
