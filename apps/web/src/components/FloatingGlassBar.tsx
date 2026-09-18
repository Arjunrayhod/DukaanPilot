import React, { useState } from 'react';
import { Plus, Slash, Sparkles, Mic, ArrowUp, ChevronDown, Check } from 'lucide-react';
import { Lang, translations } from '../i18n/translations';

interface FloatingGlassBarProps {
  lang: Lang;
  onSubmitPrompt?: (prompt: string) => void;
  onQuickAdd?: () => void;
}

export function FloatingGlassBar({ lang, onSubmitPrompt, onQuickAdd }: FloatingGlassBarProps) {
  const t = translations[lang];
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'instant' | 'balanced' | 'pos'>('instant');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    if (onSubmitPrompt) onSubmitPrompt(inputVal);
    alert(`Command processed: "${inputVal}"`);
    setInputVal('');
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setInputVal(t.voicePlaceholder);
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-5 inset-x-0 z-40 px-4 max-w-xl mx-auto pointer-events-none">
      <div className="pointer-events-auto backdrop-blur-2xl bg-slate-950/90 text-white border border-white/20 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.5)] p-2 px-3.5 transition-all duration-300 ring-1 ring-white/10 hover:border-white/30 flex items-center justify-between gap-3">
        {/* Left Quick Add */}
        <button
          type="button"
          onClick={onQuickAdd}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white active:scale-90 transition-all shrink-0 cursor-pointer"
          title={t.addProduct}
        >
          <Plus className="w-4 h-4 text-emerald-400" />
        </button>

        {/* Center Input Form */}
        <form onSubmit={handleSubmit} className="flex-1 min-w-0">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={t.glassPlaceholder}
            className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm font-medium focus:outline-none"
          />
        </form>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleMicToggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
              isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white'
            }`}
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!inputVal.trim()}
            className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-30 disabled:hover:bg-emerald-500 text-slate-950 flex items-center justify-center font-bold transition-all active:scale-95 cursor-pointer shadow-md"
          >
            <ArrowUp className="w-4 h-4 text-slate-950 stroke-[3]" />
          </button>
        </div>
      </div>
    </div>
  );
}
