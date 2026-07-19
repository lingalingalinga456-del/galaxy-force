import en from '@/messages/en.json';
import bn from '@/messages/bn.json';

export type Locale = 'en' | 'bn';
export const DEFAULT_LOCALE: Locale = 'en';

const dictionaries = { en, bn } as Record<Locale, Record<string, any>>;

export type TParams = Record<string, string | number>;
export type TFallbacks = { en: string; bn: string } & TParams;

function substitute(message: string, params?: TParams): string {
  if (!params) return message;
  let out = message;
  for (const [k, v] of Object.entries(params)) {
    out = out.split(`{${k}}`).join(String(v));
  }
  return out;
}

export function getDictionary(locale: Locale): Record<string, any> {
  return dictionaries[locale] ?? dictionaries.en;
}

// Server-safe translator factory
export function createTranslator(locale: Locale) {
  const dict = getDictionary(locale);
  return function t(key: string, fallbacks?: TFallbacks): string {
    let message: string | undefined = dict[key];
    if (message === undefined && fallbacks) {
      message = locale === 'bn' ? fallbacks.bn : fallbacks.en;
    }
    if (message === undefined) message = key;
    const params: TParams | undefined = fallbacks
      ? Object.fromEntries(
          Object.entries(fallbacks).filter(([k]) => k !== 'en' && k !== 'bn')
        )
      : undefined;
    return substitute(message, params);
  };
}

// Client-safe translator factory (no server-only imports)
export function createTranslatorFrom(locale: Locale, dict: Record<string, any>) {
  return function t(key: string, fallbacks?: TFallbacks): string {
    let message: string | undefined = dict[key];
    if (message === undefined && fallbacks) {
      message = locale === 'bn' ? fallbacks.bn : fallbacks.en;
    }
    if (message === undefined) message = key;
    const params: TParams | undefined = fallbacks
      ? Object.fromEntries(
          Object.entries(fallbacks).filter(([k]) => k !== 'en' && k !== 'bn')
        )
      : undefined;
    return substitute(message, params);
  };
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
