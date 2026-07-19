'use client';

import { useCallback } from 'react';
import en from '@/messages/en.json';
import bn from '@/messages/bn.json';
import { createTranslatorFrom, type Locale, type TFallbacks } from '@/lib/i18n/server';

const dictionaries = { en, bn } as Record<Locale, Record<string, any>>;

export function getClientLocale(): Locale {
  if (typeof document === 'undefined') return 'en';
  const match = document.cookie.match(/(?:^|; )locale=([^;]+)/);
  const raw = match?.[1];
  return raw === 'bn' ? 'bn' : 'en';
}

export function useLocale(): Locale {
  // locale is set at request time via cookie; client reads current cookie
  return getClientLocale();
}

export function useTranslation() {
  const locale = useLocale();
  const dict = dictionaries[locale] ?? dictionaries.en;
  const t = useCallback(
    (key: string, fallbacks?: TFallbacks): string => createTranslatorFrom(locale, dict)(key, fallbacks),
    [locale, dict]
  );
  return { t, locale };
}
