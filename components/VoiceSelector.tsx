import React from 'react';
import { VOICES, VoiceOption } from '../types';

interface VoiceSelectorProps {
  selected: VoiceOption;
  onChange: (voice: VoiceOption) => void;
}

export const VoiceSelector: React.FC<VoiceSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-400">Select Voice Model</label>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {VOICES.map((voice) => (
          <button
            key={voice.id}
            onClick={() => onChange(voice)}
            className={`relative flex flex-col items-center p-3 rounded-lg border transition-all duration-200 ${
              selected.id === voice.id
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/20 scale-[1.02]'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-500'
            }`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              selected.id === voice.id ? 'bg-white/20' : 'bg-slate-700'
            }`}>
              {voice.gender === 'Female' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <span className="font-semibold text-sm">{voice.name}</span>
            <span className={`text-xs mt-1 ${selected.id === voice.id ? 'text-blue-100' : 'text-slate-500'}`}>
              {voice.style}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};