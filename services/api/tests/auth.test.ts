import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../src/app';

describe('Authentication & Authorization Tests', () => {
  const app = createApp();

  const testUser = {
    phone: '9876543210',
    name: 'Ramesh Ganesh',
    password: 'securePassword123',
    shopName: 'Shree Ganesh Kirana Store',
    pin: '1234',
  };

  it('POST /api/v1/auth/register should register a new shop owner and return JWT', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 201);
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.data.user.phone, testUser.phone);
      assert.strictEqual(body.data.user.role, 'OWNER');
      assert.strictEqual(body.data.shop.name, testUser.shopName);
      assert.ok(body.data.tokens.accessToken);
    } finally {
      server.close();
    }
  });

  it('POST /api/v1/auth/login should allow password authentication', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testUser.phone,
          password: testUser.password,
        }),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.data.user.name, testUser.name);
      assert.ok(body.data.tokens.accessToken);
    } finally {
      server.close();
    }
  });

  it('POST /api/v1/auth/login should allow quick PIN authentication', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: testUser.phone,
          pin: '1234',
        }),
      });

      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.ok(body.data.tokens.accessToken);
    } finally {
      server.close();
    }
  });

  it('GET /api/v1/auth/me should reject requests with no token', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/auth/me`);
      assert.strictEqual(res.status, 401);
    } finally {
      server.close();
    }
  });
});
