import { describe, it } from 'node:test';
import assert from 'node:assert';
import { parseVoiceInput } from '../utils/nlpParser.ts';

const mockCatalog = [
  { id: '1', name: 'Amul Taaza Milk 500ml', nameHindi: 'अमूल ताजा दूध 500ml', sellingPrice: 27, unit: 'packet' },
  { id: '2', name: 'Madhur Pure & Hygienic Sugar 1kg', nameHindi: 'मधुर शुद्ध चीनी 1kg', sellingPrice: 48, unit: 'kg' },
  { id: '3', name: 'Aashirvaad Shudh Chakki Atta 10kg', nameHindi: 'आशीर्वाद शुद्ध चक्की आटा 10kg', sellingPrice: 420, unit: 'bag' },
  { id: '4', name: 'Fortune Kachi Ghani Mustard Oil 1L', nameHindi: 'फॉर्च्यून कच्ची घानी सरसों तेल 1L', sellingPrice: 145, unit: 'bottle' },
  { id: '5', name: 'Rajdhani Besan 500g', nameHindi: 'राजधानी बेसन 500g', sellingPrice: 55, unit: 'packet' },
];

describe('Kirana NLP Voice Parser Tests', () => {
  it('should parse multi-item Hindi voice sentence', () => {
    const result = parseVoiceInput('2 पैकेट दूध और 1 किलो चीनी', mockCatalog);
    assert.strictEqual(result.intent, 'ADD_ITEMS');
    assert.strictEqual(result.items.length, 2);
    assert.strictEqual(result.items[0].quantity, 2);
    assert.strictEqual(result.items[0].matchedProduct?.id, '1');
    assert.strictEqual(result.items[1].quantity, 1);
    assert.strictEqual(result.items[1].matchedProduct?.id, '2');
  });

  it('should parse Hinglish words like "ek", "do", "aur"', () => {
    const result = parseVoiceInput('ek fortune tel aur do besan add karo', mockCatalog);
    assert.strictEqual(result.intent, 'ADD_ITEMS');
    assert.strictEqual(result.items.length, 2);
    assert.strictEqual(result.items[0].quantity, 1);
    assert.strictEqual(result.items[0].matchedProduct?.id, '4');
    assert.strictEqual(result.items[1].quantity, 2);
    assert.strictEqual(result.items[1].matchedProduct?.id, '5');
  });

  it('should recognize clear bill intent', () => {
    const result = parseVoiceInput('bill khali karo');
    assert.strictEqual(result.intent, 'CLEAR_CART');
  });

  it('should recognize khata payment intent', () => {
    const result = parseVoiceInput('Ramesh Kumar ka 500 rupay jama karo');
    assert.strictEqual(result.intent, 'RECORD_KHATA');
    assert.strictEqual(result.khataPayload?.amount, 500);
    assert.strictEqual(result.khataPayload?.type, 'JAMA');
  });

  it('should parse fractional quantities like aadha (half) and dedh (1.5)', () => {
    const result = parseVoiceInput('aadha kilo cheeni aur dedh kilo atta', mockCatalog);
    assert.strictEqual(result.intent, 'ADD_ITEMS');
    assert.strictEqual(result.items.length, 2);
    assert.strictEqual(result.items[0].quantity, 0.5);
    assert.strictEqual(result.items[1].quantity, 1.5);
  });
});
