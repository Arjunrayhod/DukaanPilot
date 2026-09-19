/**
 * DukaanPilot - Smart Soundbox Voice & Audio Alert Service
 * Simulates commercial UPI Soundbox devices (Paytm / PhonePe style)
 * using Web Audio API chime synthesis and multilingual text-to-speech.
 */

import { useState, useEffect, useCallback } from 'react';
import type { Lang } from '../i18n/translations.ts';

export interface SoundboxSettings {
  enabled: boolean;
  volume: number; // 0 to 1
  playChime: boolean;
  soundboxLang: Lang;
}

const STORAGE_SOUNDBOX_KEY = 'dukaanpilot_soundbox_settings';
export const SOUNDBOX_EVENT = 'dukaanpilot_soundbox_updated';

export const DEFAULT_SOUNDBOX_SETTINGS: SoundboxSettings = {
  enabled: true,
  volume: 1.0,
  playChime: true,
  soundboxLang: 'hi'
};

export function getSoundboxSettings(): SoundboxSettings {
  if (typeof window === 'undefined' || !window.localStorage) {
    return DEFAULT_SOUNDBOX_SETTINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_SOUNDBOX_KEY);
    return raw ? { ...DEFAULT_SOUNDBOX_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SOUNDBOX_SETTINGS;
  } catch {
    return DEFAULT_SOUNDBOX_SETTINGS;
  }
}

export function saveSoundboxSettings(settings: Partial<SoundboxSettings>): SoundboxSettings {
  const current = getSoundboxSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(STORAGE_SOUNDBOX_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(SOUNDBOX_EVENT, { detail: updated }));
  }
  return updated;
}

/**
 * Play realistic Soundbox Chime tone using Web Audio API
 */
export function playSoundboxChime(volume = 1.0): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }

      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Play 3 melodic ascending notes: C5 (523Hz), E5 (659Hz), G5 (784Hz)
      const notes = [
        { freq: 523.25, time: 0.00, dur: 0.12 },
        { freq: 659.25, time: 0.10, dur: 0.14 },
        { freq: 783.99, time: 0.22, dur: 0.28 },
      ];

      notes.forEach(({ freq, time, dur }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + time);

        gain.gain.setValueAtTime(0, now + time);
        gain.gain.linearRampToValueAtTime(0.35 * volume, now + time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + time);
        osc.stop(now + time + dur);
      });

      setTimeout(() => {
        ctx.close().catch(() => {});
        resolve();
      }, 550);
    } catch (e) {
      console.warn('Web Audio playback error', e);
      resolve();
    }
  });
}

/**
 * Formats the payment announcement sentence in chosen language
 */
export function getSoundboxMessage(amount: number, mode: 'upi' | 'cash' | 'khata' | 'split', lang: Lang = 'hi'): string {
  const roundedAmount = Math.round(amount);

  if (lang === 'hi') {
    if (mode === 'upi') return `दुकानपायलट पर ₹${roundedAmount} UPI प्राप्त हुए!`;
    if (mode === 'cash') return `दुकानपायलट पर ₹${roundedAmount} नकद प्राप्त हुए!`;
    if (mode === 'khata') return `₹${roundedAmount} खाता उधार में दर्ज किए गए!`;
    return `दुकानपायलट पर ₹${roundedAmount} भुगतान सफल हुआ!`;
  }

  if (lang === 'gu') {
    if (mode === 'upi') return `દુકાનપાયલટ પર ₹${roundedAmount} UPI મળ્યા!`;
    if (mode === 'cash') return `દુકાનપાયલટ પર ₹${roundedAmount} રોકડા મળ્યા!`;
    if (mode === 'khata') return `₹${roundedAmount} ખાતામાં ઉધાર નોંધાયા!`;
    return `દુકાનપાયલટ પર ₹${roundedAmount} ચુકવણી સફળ થઈ!`;
  }

  if (lang === 'mr') {
    if (mode === 'upi') return `दुकानपायलट वर ₹${roundedAmount} UPI मिळाले!`;
    if (mode === 'cash') return `दुकानपायलट वर ₹${roundedAmount} रोख प्राप्त झाले!`;
    if (mode === 'khata') return `₹${roundedAmount} खात्यात उधार नोंदवले!`;
    return `दुकानपायलट वर ₹${roundedAmount} पेमेंट यशस्वी झाले!`;
  }

  // English fallback
  if (mode === 'upi') return `Received ₹${roundedAmount} on DukaanPilot via UPI!`;
  if (mode === 'cash') return `Received ₹${roundedAmount} cash on DukaanPilot!`;
  if (mode === 'khata') return `₹${roundedAmount} added to customer ledger!`;
  return `Received ₹${roundedAmount} on DukaanPilot!`;
}

/**
 * Full Soundbox Voice Announcement trigger: plays chime then speaks loud confirmation
 */
export async function announceSoundboxPayment(params: {
  amount: number;
  mode: 'upi' | 'cash' | 'khata' | 'split';
  lang?: Lang;
}): Promise<void> {
  const settings = getSoundboxSettings();
  if (!settings.enabled) return;

  const targetLang = params.lang || settings.soundboxLang || 'hi';
  const message = getSoundboxMessage(params.amount, params.mode, targetLang);

  if (settings.playChime) {
    await playSoundboxChime(settings.volume);
  }

  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.volume = settings.volume;
    utterance.rate = 0.95; // Clear natural Indian accent pace
    utterance.pitch = 1.05;

    // Pick voice locale
    if (targetLang === 'hi') utterance.lang = 'hi-IN';
    else if (targetLang === 'gu') utterance.lang = 'gu-IN';
    else if (targetLang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Speech synthesis error', e);
  }
}

/**
 * React Hook for managing Soundbox settings in UI
 */
export function useSoundbox() {
  const [settings, setSettings] = useState<SoundboxSettings>(() => getSoundboxSettings());

  const updateSettings = useCallback((newSettings: Partial<SoundboxSettings>) => {
    const updated = saveSoundboxSettings(newSettings);
    setSettings(updated);
  }, []);

  useEffect(() => {
    const handleUpdate = () => {
      setSettings(getSoundboxSettings());
    };
    window.addEventListener(SOUNDBOX_EVENT, handleUpdate);
    return () => window.removeEventListener(SOUNDBOX_EVENT, handleUpdate);
  }, []);

  const toggleSoundbox = useCallback(() => {
    updateSettings({ enabled: !settings.enabled });
  }, [settings.enabled, updateSettings]);

  const testAnnouncement = useCallback((amount = 150) => {
    announceSoundboxPayment({ amount, mode: 'upi', lang: settings.soundboxLang });
  }, [settings.soundboxLang]);

  return {
    settings,
    updateSettings,
    toggleSoundbox,
    testAnnouncement,
    announcePayment: announceSoundboxPayment
  };
}
