import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../src/app';
import { seedDatabase } from '@dukaanpilot/database/src/seed';
import { AuthService } from '../src/services/auth.service';

describe('Inventory & Stock Movement API Tests', () => {
  const app = createApp();
  let token = '';

  before(async () => {
    seedDatabase('shp_demomart');
    const auth = await AuthService.registerOwner({
      phone: '9988112233',
      name: 'Inventory Tester',
      password: 'password123',
      shopName: 'Stock Kirana',
    });
    token = auth.tokens.accessToken;
  });

  it('GET /api/v1/inventory/alerts should return low stock alerts', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/inventory/alerts`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.ok(body.data.totalAlerts >= 1);
      assert.ok(body.data.items.some((i: any) => i.name.includes('Atta') || i.name.includes('Oil')));
    } finally {
      server.close();
    }
  });

  it('POST /api/v1/inventory/adjust should update stock and record audit movement', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      // Find a product
      const pRes = await fetch(`http://127.0.0.1:${port}/api/v1/products?limit=1`);
      const pBody = await pRes.json();
      const product = pBody.data.items[0];
      const initialStock = product.currentStock;

      const res = await fetch(`http://127.0.0.1:${port}/api/v1/inventory/adjust`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          delta: 10,
          type: 'PURCHASE_IN',
          reason: 'Supplier Delivery Invoice #BANSAL-104',
        }),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.data.quantityBefore, initialStock);
      assert.strictEqual(body.data.currentStock, initialStock + 10);
      assert.strictEqual(body.data.movement.type, 'PURCHASE_IN');
    } finally {
      server.close();
    }
  });

  it('GET /api/v1/inventory/movements should return stock movement audit trail', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/inventory/movements`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.ok(body.data.length > 0);
    } finally {
      server.close();
    }
  });
});
