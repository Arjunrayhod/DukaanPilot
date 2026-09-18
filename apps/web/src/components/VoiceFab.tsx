import React, { useState } from 'react';
import { Mic, Sparkles, Volume2, ArrowRight } from 'lucide-react';

interface VoiceFabProps {
  onCommandTrigger?: (command: string) => void;
}

export const VoiceFab: React.FC<VoiceFabProps> = ({ onCommandTrigger }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');

  const samplePrompts = [
    '5 kg Aata add karo',
    'Ramesh ka khata batao',
    'Aaj ki total sale kitni hui?',
    'Mustard oil ka stock check karo',
  ];

  const handleMicToggle = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      setTranscript('Listening... (?????, ??? ??? ??? ???)');
      setTimeout(() => {
        setTranscript('"5 kg Aashirvaad Aata added to inventory" (???-????? ???)');
      }, 2000);
    } else {
      setTranscript('');
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setTranscript(`"${prompt}"`);
    if (onCommandTrigger) onCommandTrigger(prompt);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left info & Assistant Header */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-200 border border-emerald-500/30">
              <Sparkles className="w-3 h-3 mr-1 text-amber-300" />
              AI Voice Copilot
            </span>
            {isListening && (
              <span className="flex items-center text-xs text-amber-300 font-medium animate-pulse">
                <Volume2 className="w-3 h-3 mr-1" />
                Listening...
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold font-display tracking-tight">
            ????? ????? ?? ??? ???? (Tap & Speak)
          </h2>
          <p className="text-xs text-emerald-100/90 max-w-md">
            ?????? ??????, ??? ????? ?????, ?? ??????? ?????�???? ????? ?? Hinglish ??? ??????
          </p>
        </div>

        {/* Big Mic Action Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleMicToggle}
            className={`flex items-center justify-center space-x-2 px-5 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all active:scale-95 ${
              isListening
                ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-300/40 animate-pulse'
                : 'bg-white text-emerald-900 hover:bg-emerald-50'
            }`}
          >
            <Mic className={`w-5 h-5 ${isListening ? 'animate-bounce text-slate-950' : 'text-emerald-700'}`} />
            <span>{isListening ? 'Listening... ?????' : '??? ????? ??? ????'}</span>
          </button>
        </div>
      </div>

      {/* Live transcript or feedback if active */}
      {transcript && (
        <div className="mt-3 bg-emerald-900/60 border border-emerald-600/40 rounded-xl p-3 text-xs text-emerald-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span className="font-medium">{transcript}</span>
          </div>
          <span className="text-[10px] text-emerald-300 uppercase tracking-wider font-semibold">
            AI Intent Extracted
          </span>
        </div>
      )}

      {/* Quick sample chips */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold text-emerald-200 mr-1">Quick Prompts:</span>
        {samplePrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectPrompt(prompt)}
            className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full flex items-center space-x-1 transition-colors"
          >
            <span>"{prompt}"</span>
            <ArrowRight className="w-2.5 h-2.5 opacity-60" />
          </button>
        ))}
      </div>
    </div>
  );
};
