import React, { useState } from 'react';
import { Zap, Globe, Mic } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface VoiceHeroBannerProps {
  lang: Lang;
  onCommandTrigger?: (cmd: string) => void;
}

export function VoiceHeroBanner({ lang, onCommandTrigger }: VoiceHeroBannerProps) {
  const t = translations[lang];
  const [isListening, setIsListening] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');

  const quickPrompts = [t.promptAtta, t.promptCash, t.promptSales];

  const handleMicClick = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setTranscribedText(t.listening);
    } else {
      setTranscribedText('');
    }
  };

  const handleChipClick = (prompt: string) => {
    setTranscribedText(prompt);
    if (onCommandTrigger) onCommandTrigger(prompt);
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-700 text-white p-5 shadow-lg border border-blue-500/20">
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none"></div>
      <div className="absolute -left-10 -top-10 w-36 h-36 rounded-full bg-blue-300/15 blur-xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col space-y-4">
        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold tracking-wide border border-white/20 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{t.instantVoicePos}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm text-blue-100 text-xs font-medium border border-white/10">
            <Globe className="w-3.5 h-3.5 text-emerald-300" />
            <span>{t.languagesSupported}</span>
          </span>
        </div>

        {/* Main Trigger & Mic Area */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight text-white flex items-center gap-2 flex-wrap">
              <span>{t.voiceBillTitle}</span>
              <span className="text-emerald-300 text-lg font-bold">{t.voiceBillSub}</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 font-medium">
              {transcribedText ? (
                <span className="text-amber-200 font-semibold animate-pulse">{transcribedText}</span>
              ) : (
                t.voicePlaceholder
              )}
            </p>
          </div>

          {/* Voice Mic Button */}
          <button
            onClick={handleMicClick}
            aria-label="Activate Voice Assistant"
            className={`relative group shrink-0 w-14 h-14 rounded-full bg-white text-blue-900 flex items-center justify-center shadow-xl active:scale-95 transition-all ${
              isListening ? 'ring-4 ring-emerald-400 bg-emerald-50' : 'hover:scale-105'
            }`}
            type="button"
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full bg-white animate-ping opacity-30"></span>
            )}
            <Mic className={`w-7 h-7 ${isListening ? 'text-emerald-600 animate-bounce' : 'text-blue-800'}`} />
            
            <span className="absolute -bottom-1 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] shadow-sm">
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-75"></span>
              <span className="w-1 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
            </span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 no-scrollbar">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/10 text-white text-xs font-semibold backdrop-blur-sm transition-all active:scale-95 shadow-sm"
              type="button"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
