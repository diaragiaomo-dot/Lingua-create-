import React from 'react';
import { LANGUAGES, LanguageOption } from '../types';

interface LanguageSelectorProps {
  selected: LanguageOption;
  onChange: (lang: LanguageOption) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selected, onChange }) => {
  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-400 mb-2">Target Language</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm transition-all ${
              selected.code === lang.code
                ? 'bg-blue-600/10 border-blue-500 text-blue-400 ring-1 ring-blue-500'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};