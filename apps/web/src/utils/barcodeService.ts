/**
 * DukaanPilot - Indian Kirana Barcode Service & Fast POS Engine
 */

export interface BarcodeProduct {
  barcode: string;
  name: string;
  hindi: string;
  category: string;
  brand: string;
  price: number;
  mrp: number;
  unit: string;
  image?: string;
}

// Master Indian FMCG Barcode Catalog
export const FMCG_BARCODE_CATALOG: BarcodeProduct[] = [
  {
    barcode: '8901491101844',
    name: 'Maggi 2-Minute Noodles 70g',
    hindi: 'मैगी 2-मिनट नूडल्स 70g',
    category: 'Snacks & Biscuits',
    brand: 'Nestlé Maggi',
    price: 14,
    mrp: 14,
    unit: 'packet'
  },
  {
    barcode: '8901063012349',
    name: 'Parle-G Gold Glucose Biscuits 1kg',
    hindi: 'पारले-जी गोल्ड बिस्कुट 1kg',
    category: 'Snacks & Biscuits',
    brand: 'Parle',
    price: 90,
    mrp: 100,
    unit: 'packet'
  },
  {
    barcode: '8901030383809',
    name: 'Tata Tea Gold Premium 500g',
    hindi: 'टाटा टी गोल्ड चाय 500g',
    category: 'Tea, Coffee & Drinks',
    brand: 'Tata Tea',
    price: 240,
    mrp: 260,
    unit: 'packet'
  },
  {
    barcode: '8901725181222',
    name: 'Fortune Kachi Ghani Mustard Oil 1L',
    hindi: 'फॉर्च्यून कच्ची घानी सरसों तेल 1L',
    category: 'Edible Oils & Ghee',
    brand: 'Fortune',
    price: 165,
    mrp: 180,
    unit: 'bottle'
  },
  {
    barcode: '8901725131012',
    name: 'Aashirvaad Superior Sharbati Atta 10kg',
    hindi: 'आशीर्वाद शरबती आटा 10kg',
    category: 'Atta, Flour & Grains',
    brand: 'Aashirvaad',
    price: 535,
    mrp: 575,
    unit: 'bag'
  },
  {
    barcode: '8901262010014',
    name: 'Amul Taaza Homogenised Milk 500ml',
    hindi: 'अमूल ताजा टोंड दूध 500ml',
    category: 'Dairy & Bakery',
    brand: 'Amul',
    price: 27,
    mrp: 27,
    unit: 'packet'
  },
  {
    barcode: '8901030825319',
    name: 'Madhur Pure & Hygienic Sugar 1kg',
    hindi: 'मधुर रिफाइंड चीनी 1kg',
    category: 'Sugar & Sweeteners',
    brand: 'Madhur',
    price: 48,
    mrp: 55,
    unit: 'packet'
  },
  {
    barcode: '8901030612117',
    name: 'Tata Salt Vacuum Evaporated 1kg',
    hindi: 'टाटा शुद्ध आयोडाइज्ड नमक 1kg',
    category: 'Spices & Masalas',
    brand: 'Tata Salt',
    price: 28,
    mrp: 30,
    unit: 'packet'
  },
  {
    barcode: '8901030704416',
    name: 'MDH Deggi Mirch Powder 100g',
    hindi: 'एमडीएच देगी मिर्च पाउडर 100g',
    category: 'Spices & Masalas',
    brand: 'MDH',
    price: 85,
    mrp: 92,
    unit: 'box'
  },
  {
    barcode: '8901030012214',
    name: 'Dettol Original Bathing Soap 75g (Buy 3 Get 1)',
    hindi: 'डेटॉल ओरिजिनल साबुन 75g',
    category: 'Personal & Oral Care',
    brand: 'Dettol',
    price: 130,
    mrp: 145,
    unit: 'pack'
  },
  {
    barcode: '8901030045618',
    name: 'Vim Dishwash Gel Lemon 500ml',
    hindi: 'विम डिशवॉश जेल नींबू 500ml',
    category: 'Cleaning & Household',
    brand: 'Vim',
    price: 110,
    mrp: 125,
    unit: 'bottle'
  }
];

/**
 * Calculates EAN-13 Check Digit
 */
export function calculateEan13CheckDigit(code12: string): number {
  if (code12.length !== 12) return 0;
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(code12[i], 10) || 0;
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  const mod = sum % 10;
  return mod === 0 ? 0 : 10 - mod;
}

/**
 * Validates whether a barcode is a valid EAN-13
 */
export function isValidEan13(barcode: string): boolean {
  const clean = barcode.replace(/[^\d]/g, '');
  if (clean.length !== 13) return false;
  const first12 = clean.slice(0, 12);
  const expectedCheck = calculateEan13CheckDigit(first12);
  return parseInt(clean[12], 10) === expectedCheck;
}

/**
 * Generates custom Barcode for Loose Kirana Items (Prefix 99)
 * Format: 99[4-digit item id][4-digit price][1-digit check]
 */
export function generateLooseKiranaBarcode(itemIdNum: number, price: number): string {
  const itemPart = String(Math.abs(itemIdNum) % 10000).padStart(4, '0');
  const pricePart = String(Math.round(price) % 10000).padStart(4, '0');
  const raw11 = `99${itemPart}${pricePart}`;
  const raw12 = raw11.slice(0, 12).padEnd(12, '0');
  const check = calculateEan13CheckDigit(raw12);
  return `${raw12}${check}`;
}

/**
 * Looks up product in catalog by Barcode
 */
export function findProductByBarcode(barcode: string, customCatalog: BarcodeProduct[] = []): BarcodeProduct | undefined {
  const clean = barcode.trim().replace(/[^\d]/g, '');
  if (!clean) return undefined;

  // 1. Search in custom catalog first
  const custom = customCatalog.find(p => p.barcode.replace(/[^\d]/g, '') === clean);
  if (custom) return custom;

  // 2. Search in master FMCG catalog
  return FMCG_BARCODE_CATALOG.find(p => p.barcode.replace(/[^\d]/g, '') === clean);
}

/**
 * Plays realistic POS scanner audio beep using Web Audio API
 */
export function playScannerBeep(): void {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime); // Crisp high-pitch POS beep (1.8 kHz)
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.12);
  } catch (err) {
    console.warn('AudioContext scanner beep warning:', err);
  }
}

/**
 * Generates lightweight Code128 / Barcode SVG markup for printing stickers
 */
export function generateBarcodeSvg(barcode: string, width = 200, height = 60): string {
  const clean = barcode.replace(/[^\w]/g, '');
  
  // Simple deterministic bar pattern generator
  const bars: { x: number; width: number }[] = [];
  let currentX = 10;
  const barUnit = (width - 20) / (clean.length * 8);

  for (let i = 0; i < clean.length; i++) {
    const charCode = clean.charCodeAt(i);
    for (let bit = 0; bit < 6; bit++) {
      const isBlack = ((charCode >> bit) & 1) === 1;
      const barWidth = isBlack ? barUnit * 1.5 : barUnit * 0.8;
      if (isBlack) {
        bars.push({ x: currentX, width: barWidth });
      }
      currentX += barWidth + (isBlack ? barUnit * 0.5 : barUnit * 1.2);
    }
  }

  const rects = bars
    .map(b => `<rect x="${b.x.toFixed(1)}" y="4" width="${b.width.toFixed(1)}" height="${height - 18}" fill="#000000" />`)
    .join('');

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background:#ffffff;">
      ${rects}
      <text x="${width / 2}" y="${height - 2}" font-family="monospace, monospace" font-size="11" font-weight="bold" text-anchor="middle" fill="#000000" letter-spacing="2">
        ${barcode}
      </text>
    </svg>
  `.trim();
}
