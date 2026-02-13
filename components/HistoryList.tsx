import React from 'react';
import { GeneratedAudio } from '../types';

interface HistoryListProps {
  items: GeneratedAudio[];
  onPlay: (item: GeneratedAudio) => void;
  onDelete: (id: string) => void;
  activeId?: string;
}

export const HistoryList: React.FC<HistoryListProps> = ({ items, onPlay, onDelete, activeId }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-10 text-slate-500">
        <p>No generation history yet.</p>
        <p className="text-sm">Create your first speech!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div 
          key={item.id} 
          className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
            activeId === item.id 
              ? 'bg-slate-800/80 border-blue-500/50 shadow-md shadow-blue-500/10' 
              : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600'
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              onClick={() => onPlay(item)}
              className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                activeId === item.id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 group-hover:bg-slate-600 group-hover:text-white'
              }`}
            >
              {activeId === item.id ? (
                <span className="animate-pulse">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate pr-4" title={item.text}>
                {item.text}
              </p>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  {item.language}
                </span>
                <span>•</span>
                <span>{item.voiceName}</span>
                <span>•</span>
                <span>{item.duration.toFixed(1)}s</span>
                <span>•</span>
                <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a 
              href={item.audioUrl} 
              download={`linguavox-${item.id}.wav`}
              className="p-2 text-slate-400 hover:text-blue-400 rounded-lg hover:bg-slate-700 transition-colors"
              title="Download"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="p-2 text-slate-400 hover:text-red-400 rounded-lg hover:bg-slate-700 transition-colors"
              title="Delete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};