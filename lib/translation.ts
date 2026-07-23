'use client';

type TranslationResult = {
  text: string;
  detectedLanguage: string;
  simplifiedText: string;
  hipHop: string;
  lint: { hasChanges: boolean; matches: { index: number; score: number }[] }[];
};

async function translateText(text: string, sourceLang: string = 'auto', targetLang: string = 'en'): Promise<string> {
  if (!text || text.trim().length === 0) {
    throw new Error('No text provided for translation');
  }

  try {
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text',
        alternatives: 2,
      }),
    });

    if (!response.ok) {
      console.error(`Translation API error: ${response.status}`);
      return text; // Fallback to original text
    }

    const data = (await response.json()) as TranslationResult;
    return data.text;
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Fallback
  }
}

// Example usage functions for Bangla (Bengali) translation
export async function translateToBangla(text: string): Promise<string> {
  return translateText(text, 'en', 'bn'); // English to Bangla
}

export async function translateFromBangla(text: string): Promise<string> {
  return translateText(text, 'bn', 'en'); // Bangla to English
}

// For integration with i18n system
export function createBilingualTFunction() {
  return async (key: string, options: { en: string; bn: string }) => {
    const userLang = navigator.language.startsWith('bn') ? 'bn' : 'en';
    
    if (userLang === 'bn') {
      // If Bangla preferred, use Bangla text directly or translate if needed
      return options.bn;
    } else {
      // If English preferred, return English text directly
      return options.en;
    }
  };
}