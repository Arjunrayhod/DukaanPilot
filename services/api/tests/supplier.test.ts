import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../src/app';
import { seedDatabase } from '@dukaanpilot/database/src/seed';
import { AuthService } from '../src/services/auth.service';

describe('Supplier & Restock Management API Tests', () => {
  const app = createApp();
  let token = '';

  before(async () => {
    seedDatabase('shp_demomart');
    const auth = await AuthService.registerOwner({
      phone: '9988223344',
      name: 'Supplier Tester',
      password: 'password123',
      shopName: 'Supplier Kirana',
    });
    token = auth.tokens.accessToken;
  });

  it('GET /api/v1/suppliers should list registered distributors', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/suppliers`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.ok(body.data.length >= 5);
      assert.ok(body.data.some((s: any) => s.name.includes('Bansal Wholesale Mart')));
    } finally {
      server.close();
    }
  });

  it('POST /api/v1/suppliers should register a new distributor', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: 'Ganesh Dairy & Sweets Supply',
          contactPerson: 'Mukesh Sharma',
          phone: '+91 98990 11223',
          paymentTerms: 'Weekly',
        }),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 201);
      assert.strictEqual(body.data.name, 'Ganesh Dairy & Sweets Supply');
    } finally {
      server.close();
    }
  });
});
