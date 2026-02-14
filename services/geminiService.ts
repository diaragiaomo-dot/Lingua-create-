import { GoogleGenAI, Modality } from "@google/genai";
import { decodeAudioData, audioBufferToWav } from "./audioUtils";

const API_KEY = process.env.API_KEY || '';

export const generateSpeech = async (
  text: string,
  voiceName: string,
  languageName: string
): Promise<{ blob: Blob; duration: number }> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set the API_KEY environment variable.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Custom pronunciation rules based on language
  let pronunciationRules = "";
  
  if (languageName === "Italian") {
     // In Italian, 'W' often means 'Viva' (Long live) in exclamations, or 'V' in names, or 'U' in loanwords.
     pronunciationRules = `
     Pronunciation Rules for 'W':
     1. If 'W' appears as an isolated capital letter exclamation (e.g., 'W l'Italia', 'W la pizza'), pronounce it as the word 'Viva'.
     2. If 'W' is in a German/Italian name (e.g., 'Walter'), pronounce it as 'V'.
     3. If 'W' is in an English loanword (e.g., 'Web', 'Weekend'), pronounce it naturally as in English.
     `;
  } else if (languageName === "German") {
     pronunciationRules = "Pronounce the letter 'w' as 'v' (like in 'vet').";
  }

  // Prompt engineering to force the language
  const finalPrompt = `
    Task: Read the following text aloud in ${languageName}.
    
    Instructions:
    1. Only output the spoken audio of the text. Do not add introductory phrases like "Here is the text".
    2. ${pronunciationRules}
    3. Read the text with the tone matching the voice personality.

    Text to read: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: finalPrompt }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data returned from the model.");
    }

    // Decode PCM to AudioBuffer
    const audioBuffer = await decodeAudioData(base64Audio, 24000); // 24kHz is standard for Gemini TTS
    
    // Convert to WAV Blob
    const blob = audioBufferToWav(audioBuffer);

    return {
      blob,
      duration: audioBuffer.duration
    };

  } catch (error: any) {
    console.error("Error generating speech:", error);
    
    // Check for Quota Exceeded (429) or Resource Exhausted errors
    const isQuotaError = 
      error.status === 429 || 
      error.code === 429 || 
      error.error?.code === 429 ||
      error.message?.includes('429') || 
      error.message?.includes('RESOURCE_EXHAUSTED') ||
      JSON.stringify(error).includes('RESOURCE_EXHAUSTED');

    if (isQuotaError) {
      throw new Error("API Quota Exceeded. You have reached the limit for the free tier or your billing plan. Please check your Google Cloud Console.");
    }

    throw error;
  }
};