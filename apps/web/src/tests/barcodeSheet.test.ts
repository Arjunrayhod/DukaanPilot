import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  SHEET_PRESETS,
  expandLabelBatch,
  calculatePagesNeeded
} from '../utils/barcodeSheetService.ts';

describe('A4 Barcode Sticker Sheet Printing Engine Tests', () => {
  it('should have standard Indian 24-Up and 30-Up A4 dimensions', () => {
    assert.strictEqual(SHEET_PRESETS['24_UP'].labelsPerPage, 24);
    assert.strictEqual(SHEET_PRESETS['24_UP'].columns, 3);
    assert.strictEqual(SHEET_PRESETS['24_UP'].rows, 8);

    assert.strictEqual(SHEET_PRESETS['30_UP'].labelsPerPage, 30);
    assert.strictEqual(SHEET_PRESETS['30_UP'].columns, 3);
    assert.strictEqual(SHEET_PRESETS['30_UP'].rows, 10);
  });

  it('should expand requested product quantities into individual sticker labels', () => {
    const items = [
      {
        item: {
          barcode: '8901030010014',
          name: 'Sugar 1kg',
          price: 48,
          unit: 'kg'
        },
        count: 12
      },
      {
        item: {
          barcode: '8901262010014',
          name: 'Milk 500ml',
          price: 27,
          unit: 'packet'
        },
        count: 12
      }
    ];

    const expanded = expandLabelBatch(items);
    assert.strictEqual(expanded.length, 24);
    assert.strictEqual(expanded[0].name, 'Sugar 1kg');
    assert.strictEqual(expanded[23].name, 'Milk 500ml');
  });

  it('should calculate accurate number of A4 pages needed', () => {
    assert.strictEqual(calculatePagesNeeded(24, '24_UP'), 1);
    assert.strictEqual(calculatePagesNeeded(25, '24_UP'), 2);
    assert.strictEqual(calculatePagesNeeded(60, '30_UP'), 2);
    assert.strictEqual(calculatePagesNeeded(0, '24_UP'), 0);
  });
});
