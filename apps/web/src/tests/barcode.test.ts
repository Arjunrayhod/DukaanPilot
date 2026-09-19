import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  calculateEan13CheckDigit,
  isValidEan13,
  generateLooseKiranaBarcode,
  findProductByBarcode,
  generateBarcodeSvg,
  FMCG_BARCODE_CATALOG
} from '../utils/barcodeService.ts';

describe('Kirana Barcode & Fast POS Engine Tests', () => {
  it('should correctly calculate EAN-13 check digits for Indian FMCG products', () => {
    // Maggi: 890149110184 -> check digit should be 4
    const maggiCheck = calculateEan13CheckDigit('890149110184');
    assert.strictEqual(maggiCheck, 4);

    // Parle-G: 890106301234 -> check digit should be 9
    const parleCheck = calculateEan13CheckDigit('890106301234');
    assert.strictEqual(parleCheck, 9);

    // Tata Tea: 890103038380 -> check digit should be 9
    const tataCheck = calculateEan13CheckDigit('890103038380');
    assert.strictEqual(tataCheck, 9);
  });

  it('should validate valid vs invalid EAN-13 barcodes', () => {
    assert.strictEqual(isValidEan13('8901491101844'), true); // Maggi
    assert.strictEqual(isValidEan13('8901063012349'), true); // Parle-G
    assert.strictEqual(isValidEan13('8901030383809'), true); // Tata Tea

    // Invalid check digits
    assert.strictEqual(isValidEan13('8901491101849'), false);
    assert.strictEqual(isValidEan13('12345'), false); // Too short
  });

  it('should generate valid 13-digit EAN barcodes for loose Kirana items', () => {
    const looseSugarBarcode = generateLooseKiranaBarcode(101, 48);
    assert.strictEqual(looseSugarBarcode.length, 13);
    assert.ok(looseSugarBarcode.startsWith('99')); // Indian retailer in-store prefix
    assert.strictEqual(isValidEan13(looseSugarBarcode), true);

    const looseDalBarcode = generateLooseKiranaBarcode(205, 155);
    assert.strictEqual(looseDalBarcode.length, 13);
    assert.ok(looseDalBarcode.startsWith('99'));
    assert.strictEqual(isValidEan13(looseDalBarcode), true);
  });

  it('should find products in master FMCG catalog by barcode string', () => {
    const maggi = findProductByBarcode('8901491101844');
    assert.ok(maggi);
    assert.ok(maggi.name.includes('Maggi'));
    assert.strictEqual(maggi.price, 14);

    const fortune = findProductByBarcode('8901725181222');
    assert.ok(fortune);
    assert.ok(fortune.hindi.includes('सरसों तेल'));
    assert.strictEqual(fortune.price, 165);

    // Handle formatted/whitespace input
    const amulFormatted = findProductByBarcode(' 8901-2620-10014 ');
    assert.ok(amulFormatted);
    assert.ok(amulFormatted.name.includes('Amul'));

    // Non-existent barcode
    const notFound = findProductByBarcode('9999999999999');
    assert.strictEqual(notFound, undefined);
  });

  it('should generate crisp SVG markup for barcode labels', () => {
    const svg = generateBarcodeSvg('8901491101844', 200, 60);
    assert.ok(svg.includes('<svg'));
    assert.ok(svg.includes('</svg>'));
    assert.ok(svg.includes('<rect'));
    assert.ok(svg.includes('8901491101844'));
  });

  it('should contain verified Indian FMCG products with MRP and Hindi names', () => {
    assert.ok(FMCG_BARCODE_CATALOG.length >= 8);
    for (const prod of FMCG_BARCODE_CATALOG) {
      assert.ok(prod.barcode.length >= 12);
      assert.ok(prod.name.length > 0);
      assert.ok(prod.hindi.length > 0);
      assert.ok(prod.price > 0);
      assert.ok(prod.mrp >= prod.price);
    }
  });
});
