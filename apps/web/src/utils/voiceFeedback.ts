import { Lang } from '../i18n/translations';

let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function speakHindi(text: string, lang: Lang = 'hi'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    // Unpause or resume if speech synthesis is paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    window.speechSynthesis.cancel(); // Stop any previous utterance

    const utterance = new SpeechSynthesisUtterance(text);
    if (lang === 'hi') utterance.lang = 'hi-IN';
    else if (lang === 'gu') utterance.lang = 'gu-IN';
    else if (lang === 'mr') utterance.lang = 'mr-IN';
    else utterance.lang = 'en-IN';

    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    
    // Pick the most natural voice for the locale
    const voice = voices.find(v => v.lang.toLowerCase().includes(utterance.lang.toLowerCase())) ||
                  voices.find(v => v.lang.toLowerCase().includes('hi')) ||
                  voices.find(v => v.lang.toLowerCase().includes('en-in') || v.name.toLowerCase().includes('india')) ||
                  voices[0];
    
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}
