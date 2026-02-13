import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { VoiceSelector } from './components/VoiceSelector';
import { LanguageSelector } from './components/LanguageSelector';
import { Button } from './components/Button';
import { HistoryList } from './components/HistoryList';
import { VOICES, LANGUAGES, GeneratedAudio, VoiceOption, LanguageOption } from './types';
import { generateSpeech } from './services/geminiService';

const App: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(VOICES[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption>(LANGUAGES[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedAudio[]>([]);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleEnded = () => {
      setCurrentPlayingId(undefined);
    };

    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const { blob, duration } = await generateSpeech(text, selectedVoice.name, selectedLanguage.name);
      const url = URL.createObjectURL(blob);

      const newItem: GeneratedAudio = {
        id: Date.now().toString(),
        text: text.trim(),
        language: selectedLanguage.name,
        voiceName: selectedVoice.name,
        audioUrl: url,
        createdAt: Date.now(),
        duration,
      };

      setHistory((prev) => [newItem, ...prev]);
      
      // Auto play the new item
      playAudio(newItem);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to generate speech. Please check your API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const playAudio = (item: GeneratedAudio) => {
    if (audioRef.current) {
      // If clicking the same playing item, pause it (toggle)
      if (currentPlayingId === item.id && !audioRef.current.paused) {
        audioRef.current.pause();
        setCurrentPlayingId(undefined);
      } else {
        audioRef.current.src = item.audioUrl;
        audioRef.current.play();
        setCurrentPlayingId(item.id);
      }
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter(item => item.id !== id);
      // Clean up blob URL to avoid memory leaks
      const item = prev.find(i => i.id === id);
      if (item) {
        URL.revokeObjectURL(item.audioUrl);
      }
      return newHistory;
    });
    if (currentPlayingId === id) {
      audioRef.current?.pause();
      setCurrentPlayingId(undefined);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-5 space-y-8">
            <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-xl backdrop-blur-sm">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Configuration
              </h2>
              
              <div className="space-y-6">
                <LanguageSelector 
                  selected={selectedLanguage} 
                  onChange={setSelectedLanguage} 
                />

                <VoiceSelector 
                  selected={selectedVoice} 
                  onChange={setSelectedVoice} 
                />

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-400">
                    Text to Speech
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder={`Enter text to speak in ${selectedLanguage.name}...`}
                    className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  />
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{text.length} characters</span>
                    <span>Gemini 2.5 Flash TTS</span>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <Button 
                  onClick={handleGenerate} 
                  isLoading={isGenerating} 
                  disabled={!text.trim()}
                  className="w-full h-12 text-lg"
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  Generate Speech
                </Button>
              </div>
            </section>
          </div>

          {/* Right Column: History & Results */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 shadow-xl backdrop-blur-sm min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Generation History
                </h2>
                {history.length > 0 && (
                   <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-slate-700 text-slate-300">
                     {history.length} items
                   </span>
                )}
              </div>

              <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-2 overflow-hidden">
                <HistoryList 
                  items={history} 
                  onPlay={playAudio} 
                  onDelete={deleteHistoryItem}
                  activeId={currentPlayingId}
                />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;