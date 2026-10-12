import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { en, type Content } from '../content/en';
import { defaultLocale, locales, merge, type LocaleCode } from './locales';

type Ctx = { c: Content; locale: LocaleCode; setLocale: (l: LocaleCode) => void; available: typeof locales };

const I18nContext = createContext<Ctx | null>(null);
const KEY = 'jwc.locale';

function initial(): LocaleCode {
  try {
    const saved = localStorage.getItem(KEY) as LocaleCode | null;
    if (saved && locales.some((l) => l.code === saved && l.enabled)) return saved;
  } catch {
    /* storage unavailable */
  }
  return defaultLocale;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>(initial);
  const value = useMemo<Ctx>(() => {
    const entry = locales.find((l) => l.code === locale) ?? locales[0];
    return {
      c: entry.code === 'en' ? en : merge(en, entry.content),
      locale,
      available: locales.filter((l) => l.enabled),
      setLocale: (l) => {
        setLocaleState(l);
        try {
          localStorage.setItem(KEY, l);
        } catch {
          /* ignore */
        }
      },
    };
  }, [locale]);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}
