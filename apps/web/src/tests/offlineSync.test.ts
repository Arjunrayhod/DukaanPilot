import { describe, it } from 'node:test';
import assert from 'node:assert';
import { 
  enqueueOfflineAction, 
  processSyncQueue, 
  getOfflineQueue, 
  isOnline 
} from '../utils/offlineSyncService.ts';

describe('Offline-First Sync Engine Tests', () => {
  it('should enqueue offline bill and stock actions', () => {
    const item = enqueueOfflineAction('BILL_CREATED', {
      invoiceNo: '9901',
      grandTotal: 450,
      paymentMode: 'cash'
    });

    assert.ok(item.id.startsWith('sync_'));
    assert.strictEqual(item.type, 'BILL_CREATED');
    assert.strictEqual(item.synced, false);
    assert.strictEqual(item.payload.grandTotal, 450);
  });

  it('should process pending queue and mark actions as synced', async () => {
    enqueueOfflineAction('KHATA_UPDATED', { customerId: 'cust_01', amount: 500 });

    const result = await processSyncQueue();
    assert.ok(result.syncedCount >= 1);
    assert.strictEqual(result.errors, 0);

    const queue = getOfflineQueue();
    assert.ok(queue.every((it) => it.synced));
  });

  it('should safely return online status boolean', () => {
    const status = isOnline();
    assert.strictEqual(typeof status, 'boolean');
  });
});
