import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceRecognitionOptions {
  lang?: 'hi-IN' | 'en-IN';
  continuous?: boolean;
  onResult?: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const {
    lang = 'hi-IN',
    continuous = false,
    onResult,
    onError
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;

  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;

  // Buffer to capture interim speech in case isFinal never fires before onend
  const latestTranscriptRef = useRef<string>('');
  const hasProcessedFinalRef = useRef<boolean>(false);
  const silenceTimerRef = useRef<any>(null);

  const commitTranscript = useCallback((text: string) => {
    const cleanText = text.trim();
    if (!cleanText || hasProcessedFinalRef.current) return;
    hasProcessedFinalRef.current = true;
    setTranscript(cleanText);
    setInterimTranscript('');
    if (onResultRef.current) {
      onResultRef.current(cleanText, true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.lang = lang;
    recognition.maxAlternatives = 5;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      hasProcessedFinalRef.current = false;
      latestTranscriptRef.current = '';
    };

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let currentFinal = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          currentFinal += item[0].transcript;
        } else {
          currentInterim += item[0].transcript;
        }
      }

      const activeText = currentFinal || currentInterim;
      if (activeText) {
        latestTranscriptRef.current = activeText.trim();
      }

      if (currentFinal) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        commitTranscript(currentFinal);
      } else {
        setInterimTranscript(currentInterim.trim());
        if (onResultRef.current) {
          onResultRef.current(currentInterim.trim(), false);
        }

        // Auto-commit on 1.4s of silence after speech is detected
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        if (currentInterim.trim().length >= 2) {
          silenceTimerRef.current = setTimeout(() => {
            if (latestTranscriptRef.current && !hasProcessedFinalRef.current) {
              commitTranscript(latestTranscriptRef.current);
            }
          }, 1400);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.warn('Speech recognition event:', event.error);
      if (event.error === 'no-speech') {
        // Soft warning, do not block subsequent interactions
      } else if (event.error === 'not-allowed') {
        setError('माइक्रोफ़ोन की अनुमति दें (Mic permission denied)');
      } else if (event.error !== 'aborted') {
        setError(`वॉइस एरर: ${event.error}`);
      }
      setIsListening(false);
      if (onErrorRef.current) onErrorRef.current(event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

      // Fallback: If session ended and we have buffered spoken words that weren't finalized, commit them now
      if (latestTranscriptRef.current && !hasProcessedFinalRef.current) {
        commitTranscript(latestTranscriptRef.current);
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (_) {}
      }
    };
  }, [lang, continuous, commitTranscript]);

  const startListening = useCallback(() => {
    // Stop ongoing speech synthesis immediately so it doesn't feed into microphone
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }

    if (!recognitionRef.current) {
      setIsListening(true);
      return;
    }

    try {
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      hasProcessedFinalRef.current = false;
      latestTranscriptRef.current = '';
      setTranscript('');
      setInterimTranscript('');
      setError(null);
      recognitionRef.current.start();
    } catch (err: any) {
      // If already started, restart cleanly
      try {
        recognitionRef.current.stop();
        setTimeout(() => {
          try {
            recognitionRef.current.start();
          } catch (_) {}
        }, 150);
      } catch (_) {}
    }
  }, []);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }
    // If we have buffered text, commit it on manual stop
    if (latestTranscriptRef.current && !hasProcessedFinalRef.current) {
      commitTranscript(latestTranscriptRef.current);
    }
    setIsListening(false);
  }, [commitTranscript]);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    interimTranscript,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
    setTranscript
  };
}
