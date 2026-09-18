import React, { useState } from 'react';
import { Plus, Slash, Sparkles, Mic, ArrowUp, ChevronDown, Check } from 'lucide-react';

interface FloatingGlassBarProps {
  onSubmitPrompt?: (prompt: string) => void;
  onQuickAdd?: () => void;
}

export function FloatingGlassBar({ onSubmitPrompt, onQuickAdd }: FloatingGlassBarProps) {
  const [inputVal, setInputVal] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'instant' | 'balanced' | 'pos'>('instant');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;
    if (onSubmitPrompt) onSubmitPrompt(inputVal);
    alert(`कमांड प्रोसेस हो रहा हूं: "${inputVal}"`);
    setInputVal('');
  };

  const handleMicToggle = () => {
    setIsListening(!isListening);
    if (!isListening) {
      setInputVal('रमेश कुमार 2 किलो चीनी और ₹150 उधार जोड़ो');
    }
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 inset-x-0 z-40 px-4 max-w-2xl mx-auto pointer-events-none">
      <div className="pointer-events-auto backdrop-blur-2xl bg-slate-950/85 text-white border border-white/20 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.45)] p-3 transition-all duration-300 ring-1 ring-white/10 hover:border-white/30">
        
        {/* Top Input Area */}
        <form onSubmit={handleSubmit} className="flex items-center w-full px-1">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="क्या बनाना या जोड़ना चाहते हैं? (What would you like to change or create?)"
            className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-none py-1"
          />
        </form>

        {/* Action Controls Toolbar inside the Glass Pill */}
        <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-white/10 text-xs">
          {/* Left Quick Action Pills */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onQuickAdd}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
              title="नया आइटम जोड़ें"
            >
              <Plus className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setInputVal('/')}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-slate-300 active:scale-90 transition-all font-mono font-bold"
              title="कमांड स्लैश"
            >
              /
            </button>
          </div>

          {/* Right Controls: Mode Selector + Mic + Submit */}
          <div className="flex items-center gap-2 relative">
            {/* Mode Pill Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="h-8 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/15 flex items-center gap-1.5 text-xs font-semibold text-white transition-all"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
                <span>{selectedMode === 'instant' ? 'Instant AI' : selectedMode === 'balanced' ? 'Balanced' : 'POS'}</span>
                <ChevronDown className="w-3 h-3 text-slate-300" />
              </button>

              {showModeDropdown && (
                <div className="absolute bottom-10 right-0 w-36 bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl p-1 z-50 text-xs">
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('instant'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>Instant AI</span>
                    {selectedMode === 'instant' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('balanced'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>Balanced</span>
                    {selectedMode === 'balanced' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedMode('pos'); setShowModeDropdown(false); }}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/15 text-left text-white"
                  >
                    <span>POS Mode</span>
                    {selectedMode === 'pos' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>
              )}
            </div>

            {/* Sparkle Voice Mic Pill */}
            <button
              type="button"
              onClick={handleMicToggle}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                isListening
                  ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 animate-bounce'
                  : 'bg-white/15 hover:bg-white/25 text-white border border-white/15'
              }`}
              title="बोलकर कहें (Voice Input)"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Submit Arrow Pill */}
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!inputVal.trim()}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                inputVal.trim()
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold active:scale-90 cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed'
              }`}
              title="भेजें (Submit)"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
