import { en, type Content } from '../content/en';
import { pt } from '../content/pt';
import type { DeepPartial } from './types';

export type LocaleCode = 'en' | 'pt';

export const locales: { code: LocaleCode; label: string; enabled: boolean; content: DeepPartial<Content> }[] = [
  { code: 'en', label: 'English', enabled: true, content: en },
  // Set enabled: true once content/pt.ts is translated.
  { code: 'pt', label: 'Português', enabled: false, content: pt },
];

export const defaultLocale: LocaleCode = 'en';

/** Overlay a partial translation on the English source; arrays are replaced whole when provided. */
export function merge<T>(base: T, over: DeepPartial<T> | undefined): T {
  if (over === undefined || over === null) return base;
  if (Array.isArray(base)) return (Array.isArray(over) && over.length ? over : base) as T;
  if (base && typeof base === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const k of Object.keys(base as object)) {
      out[k] = merge((base as Record<string, unknown>)[k], (over as Record<string, unknown>)[k] as never);
    }
    return out as T;
  }
  return (over as T) ?? base;
}
