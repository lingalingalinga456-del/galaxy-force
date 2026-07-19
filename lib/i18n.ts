import en from '@/messages/en.json';
import bn from '@/messages/bn.json';

export type Locale = 'en' | 'bn';
export const DEFAULT_LOCALE: Locale = 'en';

// Merge dictionaries directly
const dictionaries = { en, bn } as Record<Locale, Record<string, any>>;

export function safeTranslate(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[locale] ?? dictionaries.en;
  let message = dict[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      message = message.replaceAll(`{${k}}`, String(v));
    }
  }
  return message;
}

export async function getLocale(): Promise<Locale> {
  try {
    const { cookies } = await import('next/headers');
    const store = await cookies();
    const raw = store.get('locale')?.value;
    if (raw === 'en' || raw === 'bn') return raw;
  } catch {
    // ignore
  }
  return DEFAULT_LOCALE;
}