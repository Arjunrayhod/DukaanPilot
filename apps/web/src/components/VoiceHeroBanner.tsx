import React, { useState } from 'react';
import { Zap, Globe, Mic, Sparkles } from 'lucide-react';
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
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 shadow-xl border border-white/10 transition-all">
      {/* Subtle background glow */}
      <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -left-12 -top-12 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col space-y-5">
        {/* Status Badges */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold tracking-wide border border-white/15 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{t.instantVoicePos}</span>
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 backdrop-blur-sm text-slate-300 text-xs font-medium border border-white/10">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.languagesSupported}</span>
          </span>
        </div>

        {/* Main Trigger & Mic Area */}
        <div className="flex items-center justify-between gap-5 pt-1">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-black leading-tight text-white flex items-center gap-2 flex-wrap font-display tracking-tight">
              <span>{t.voiceBillTitle}</span>
              <span className="text-emerald-400 text-lg font-bold">{t.voiceBillSub}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300/90 mt-1.5 font-medium leading-relaxed max-w-xl">
              {transcribedText ? (
                <span className="text-amber-300 font-bold animate-pulse">{transcribedText}</span>
              ) : (
                t.voicePlaceholder
              )}
            </p>
          </div>

          {/* Voice Mic Button */}
          <button
            onClick={handleMicClick}
            aria-label="Activate Voice Assistant"
            className={`relative group shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition-all cursor-pointer ${
              isListening
                ? 'bg-emerald-400 text-slate-950 ring-4 ring-emerald-300/50 scale-105'
                : 'bg-white text-slate-950 hover:bg-slate-100'
            }`}
            type="button"
          >
            {isListening && (
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30"></span>
            )}
            <Mic className={`w-7 h-7 sm:w-8 sm:h-8 ${isListening ? 'text-slate-950 animate-bounce' : 'text-slate-900'}`} />
            
            <span className="absolute -bottom-1.5 flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[9px] shadow-sm border border-white/15 font-bold">
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse delay-75"></span>
              <span className="w-1 h-1.5 bg-emerald-400 rounded-full animate-pulse delay-150"></span>
            </span>
          </button>
        </div>

        {/* Quick Suggestion Chips - Dark Translucent Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5 no-scrollbar">
          {quickPrompts.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="shrink-0 px-4 py-2 rounded-full bg-slate-900/80 hover:bg-slate-900 border border-white/15 text-slate-200 hover:text-white text-xs font-semibold backdrop-blur-xl transition-all active:scale-95 shadow-sm flex items-center gap-2 cursor-pointer"
              type="button"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
              <span>{chip}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
