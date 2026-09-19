import { useEffect, useRef, useCallback } from 'react';

interface UseBarcodeScannerOptions {
  onScan: (barcode: string) => void;
  minBarcodeLength?: number;
  maxKeyIntervalMs?: number;
  enabled?: boolean;
}

/**
 * Global Hardware Barcode Gun Listener Hook (USB / Bluetooth Scanners)
 * Distinguishes between manual human typing vs rapid scanner input
 */
export function useBarcodeScanner({
  onScan,
  minBarcodeLength = 5,
  maxKeyIntervalMs = 60,
  enabled = true
}: UseBarcodeScannerOptions) {
  const bufferRef = useRef<string>('');
  const lastKeyTimeRef = useRef<number>(0);
  const onScanRef = useRef(onScan);
  onScanRef.current = onScan;

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled) return;

    // Ignore modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) {
      return;
    }

    const now = Date.now();
    const interval = now - lastKeyTimeRef.current;
    lastKeyTimeRef.current = now;

    // Check for Enter key (terminator of barcode scanner)
    if (e.key === 'Enter') {
      const scannedCode = bufferRef.current.trim();
      bufferRef.current = '';

      if (scannedCode.length >= minBarcodeLength) {
        // Prevent default form submit if triggered by scanner
        e.preventDefault();
        onScanRef.current(scannedCode);
      }
      return;
    }

    // If typing speed is too slow (>maxKeyIntervalMs), reset buffer as it's human typing
    if (interval > maxKeyIntervalMs && bufferRef.current.length > 0) {
      bufferRef.current = '';
    }

    // Only accept printable single characters
    if (e.key.length === 1) {
      // Don't intercept if user is actively typing in a standard input, unless it's rapid scanner speed
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (!isInput || interval < maxKeyIntervalMs) {
        bufferRef.current += e.key;
      }
    }
  }, [enabled, minBarcodeLength, maxKeyIntervalMs]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, handleKeyDown]);
}
