/**
 * DukaanPilot - A4 Sticky Sheet Barcode Label Printing Service
 * Generates exact millimeter-accurate layouts for standard Indian 24-Up & 30-Up A4 sticker sheets.
 */

import { generateBarcodeSvg } from './barcodeService.ts';

export interface BarcodeLabelItem {
  barcode: string;
  name: string;
  hindiName?: string;
  price: number;
  unit: string;
  mrp?: number;
  packedDate?: string;
  storeName?: string;
}

export interface SheetConfig {
  layout: '24_UP' | '30_UP'; // 24-up (3x8) or 30-up (3x10)
  labelsPerPage: number;
  columns: number;
  rows: number;
  labelWidthMm: number;
  labelHeightMm: number;
}

export const SHEET_PRESETS: Record<'24_UP' | '30_UP', SheetConfig> = {
  '24_UP': {
    layout: '24_UP',
    labelsPerPage: 24,
    columns: 3,
    rows: 8,
    labelWidthMm: 63.5,
    labelHeightMm: 33.9
  },
  '30_UP': {
    layout: '30_UP',
    labelsPerPage: 30,
    columns: 3,
    rows: 10,
    labelWidthMm: 63.5,
    labelHeightMm: 25.4
  }
};

/**
 * Expand a list of items with their requested quantities into an array of individual sticker labels
 */
export function expandLabelBatch(
  items: Array<{ item: BarcodeLabelItem; count: number }>
): BarcodeLabelItem[] {
  const result: BarcodeLabelItem[] = [];
  for (const entry of items) {
    const qty = Math.max(0, entry.count || 0);
    for (let i = 0; i < qty; i++) {
      result.push(entry.item);
    }
  }
  return result;
}

/**
 * Calculates number of A4 pages needed
 */
export function calculatePagesNeeded(totalLabels: number, layout: '24_UP' | '30_UP' = '24_UP'): number {
  if (totalLabels <= 0) return 0;
  const perPage = SHEET_PRESETS[layout].labelsPerPage;
  return Math.ceil(totalLabels / perPage);
}
