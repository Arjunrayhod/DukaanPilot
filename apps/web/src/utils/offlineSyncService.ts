/**
 * DukaanPilot - Offline-First Sync & Local Resilience Service
 * Ensures POS billing, khata updates, and inventory continue seamlessly without internet,
 * automatically syncing with cloud when network connection restores.
 */

import { useState, useEffect, useCallback } from 'react';

export interface SyncQueueItem {
  id: string;
  type: 'BILL_CREATED' | 'KHATA_UPDATED' | 'INWARD_RECEIVED' | 'PAYMENT_RECORDED' | 'STOCK_ADJUSTED';
  payload: any;
  timestamp: string;
  synced: boolean;
  retryCount: number;
}

const STORAGE_QUEUE_KEY = 'dukaanpilot_offline_sync_queue';
const STORAGE_LAST_SYNC_KEY = 'dukaanpilot_last_sync_timestamp';
export const OFFLINE_SYNC_EVENT = 'dukaanpilot_offline_sync_event';

let memoryQueue: SyncQueueItem[] = [];
let memoryLastSync: string | null = null;

export function isOnline(): boolean {
  if (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean') {
    return navigator.onLine;
  }
  return true;
}

export function getOfflineQueue(): SyncQueueItem[] {
  if (typeof window === 'undefined' || !window.localStorage) {
    return memoryQueue;
  }
  try {
    const raw = localStorage.getItem(STORAGE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(queue: SyncQueueItem[]): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    memoryQueue = queue;
    return;
  }
  try {
    localStorage.setItem(STORAGE_QUEUE_KEY, JSON.stringify(queue));
    window.dispatchEvent(new CustomEvent(OFFLINE_SYNC_EVENT));
  } catch (e) {
    console.error('Failed to save offline queue', e);
  }
}

export function enqueueOfflineAction(
  type: SyncQueueItem['type'],
  payload: any
): SyncQueueItem {
  const item: SyncQueueItem = {
    id: `sync_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`,
    type,
    payload,
    timestamp: new Date().toISOString(),
    synced: false,
    retryCount: 0
  };

  const queue = getOfflineQueue();
  saveOfflineQueue([...queue, item]);
  return item;
}

export async function processSyncQueue(): Promise<{ syncedCount: number; errors: number }> {
  const queue = getOfflineQueue();
  const pending = queue.filter((item) => !item.synced);

  if (pending.length === 0) {
    return { syncedCount: 0, errors: 0 };
  }

  // Simulate cloud background upload
  await new Promise((resolve) => setTimeout(resolve, 800));

  const updatedQueue = queue.map((item) => ({ ...item, synced: true }));
  saveOfflineQueue(updatedQueue);

  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(STORAGE_LAST_SYNC_KEY, new Date().toISOString());
  }

  return { syncedCount: pending.length, errors: 0 };
}

export function getLastSyncTimeFormatted(): string {
  if (typeof window === 'undefined' || !window.localStorage) return 'Just now';
  try {
    const raw = localStorage.getItem(STORAGE_LAST_SYNC_KEY);
    if (!raw) return 'Just now';
    const date = new Date(raw);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'Just now';
  }
}

/**
 * Custom React Hook for Offline-First status & auto-sync
 */
export function useOfflineSync() {
  const [online, setOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [pendingItems, setPendingItems] = useState<SyncQueueItem[]>(() => getOfflineQueue().filter((i) => !i.synced));
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => getLastSyncTimeFormatted());

  const refreshState = useCallback(() => {
    setOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    setPendingItems(getOfflineQueue().filter((i) => !i.synced));
    setLastSyncTime(getLastSyncTimeFormatted());
  }, []);

  const triggerSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await processSyncQueue();
      refreshState();
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshState]);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      // Auto background sync when internet returns
      triggerSync();
    };

    const handleOffline = () => {
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener(OFFLINE_SYNC_EVENT, refreshState);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener(OFFLINE_SYNC_EVENT, refreshState);
    };
  }, [refreshState, triggerSync]);

  return {
    isOnline: online,
    pendingCount: pendingItems.length,
    pendingItems,
    isSyncing,
    lastSyncTime,
    syncNow: triggerSync,
    enqueue: enqueueOfflineAction
  };
}
