export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  style: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export interface GeneratedAudio {
  id: string;
  text: string;
  language: string;
  voiceName: string;
  audioUrl: string; // Blob URL
  createdAt: number;
  duration: number; // in seconds
}

export const VOICES: VoiceOption[] = [
  { id: 'Kore', name: 'Kore', gender: 'Female', style: 'Soothing' },
  { id: 'Puck', name: 'Puck', gender: 'Male', style: 'Low & Calm' },
  { id: 'Charon', name: 'Charon', gender: 'Male', style: 'Deep' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Male', style: 'Intense' },
  { id: 'Orpheus', name: 'Orpheus', gender: 'Male', style: 'Confident' },
  { id: 'Zephyr', name: 'Zephyr', gender: 'Female', style: 'Bright' },
];

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
];