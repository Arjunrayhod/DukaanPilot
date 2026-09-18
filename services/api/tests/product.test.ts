import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../src/app';
import { seedDatabase } from '@dukaanpilot/database/src/seed';
import { AuthService } from '../src/services/auth.service';

describe('Product & Catalog API Tests', () => {
  const app = createApp();
  let token = '';

  before(async () => {
    seedDatabase('shp_demomart');
    const auth = await AuthService.registerOwner({
      phone: '9988776655',
      name: 'Tester Shopkeeper',
      password: 'password123',
      shopName: 'Test Kirana',
    });
    token = auth.tokens.accessToken;
  });

  it('GET /api/v1/products should return seeded catalog with 90+ items', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/products?limit=100`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.ok(body.data.total >= 50);
      assert.ok(body.data.items.length >= 50);
    } finally {
      server.close();
    }
  });

  it('GET /api/v1/products?search=Atta should filter products by name or Hindi translation', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/products?search=Atta`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.ok(body.data.items.length > 0);
      assert.ok(body.data.items.some((i: any) => i.name.includes('Atta')));
    } finally {
      server.close();
    }
  });

  it('GET /api/v1/products/barcode/8901030381011 should lookup Aashirvaad Atta 10kg', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/products/barcode/8901030381011`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.data.barcode, '8901030381011');
      assert.strictEqual(body.data.sellingPrice, 420);
    } finally {
      server.close();
    }
  });

  it('POST /api/v1/products should create a new product when authenticated', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: 'Haldiram Soan Papdi 500g',
          nameHindi: 'हल्दीराम सोन पापड़ी 500g',
          sellingPrice: 160,
          costPrice: 125,
          currentStock: 15,
          minThreshold: 4,
          unit: 'box',
          barcode: '8904004499999',
        }),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 201);
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.data.name, 'Haldiram Soan Papdi 500g');
      assert.strictEqual(body.data.currentStock, 15);
    } finally {
      server.close();
    }
  });
});
