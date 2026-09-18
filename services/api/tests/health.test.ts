import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createApp } from '../src/app';

describe('Health Endpoints Integration Tests', () => {
  const app = createApp();

  it('GET / should return online status', async () => {
    // Start local ephemeral listener for test
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.name, 'DukaanPilot API');
      assert.strictEqual(body.status, 'ONLINE');
    } finally {
      server.close();
    }
  });

  it('GET /api/v1/health should return system status UP and storage metrics', async () => {
    const server = app.listen(0);
    const port = (server.address() as any).port;
    try {
      const res = await fetch(`http://127.0.0.1:${port}/api/v1/health`);
      const body = await res.json();
      assert.strictEqual(res.status, 200);
      assert.strictEqual(body.success, true);
      assert.strictEqual(body.data.status, 'UP');
      assert.strictEqual(body.data.storage.budgetLimitGb, 15);
    } finally {
      server.close();
    }
  });
});
