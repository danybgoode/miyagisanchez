// Build-time translations. Every page renders twice: English at /path, Mexican Spanish at /es/path.
// The JSON files carry over from the old client-side i18n; site.json holds the strings added in the rebuild.
import enGlobal from './locales/en/global.json';
import esGlobal from './locales/es/global.json';
import enIndex from './locales/en/index.json';
import esIndex from './locales/es/index.json';
import enAcademy from './locales/en/bonsai-academy.json';
import esAcademy from './locales/es/bonsai-academy.json';
import enPrivacy from './locales/en/privacy.json';
import esPrivacy from './locales/es/privacy.json';
import enTerms from './locales/en/terms.json';
import esTerms from './locales/es/terms.json';
import enCookies from './locales/en/cookies.json';
import esCookies from './locales/es/cookies.json';
import enSite from './locales/en/site.json';
import esSite from './locales/es/site.json';

export const LANGS = ['en', 'es'] as const;
export type Lang = (typeof LANGS)[number];

const PAGES = {
  en: { global: enGlobal, index: enIndex, academy: enAcademy, privacy: enPrivacy, terms: enTerms, cookies: enCookies },
  es: { global: esGlobal, index: esIndex, academy: esAcademy, privacy: esPrivacy, terms: esTerms, cookies: esCookies },
} as const;
export type Page = keyof (typeof PAGES)['en'];

export const SITE = { en: enSite, es: esSite } as const;
export type SiteCopy = typeof enSite;

/** A translator for one page: its own keys first, then the shared global ones. Missing keys fail the build. */
export function useT(lang: Lang, page: Page) {
  const own = PAGES[lang][page] as Record<string, string>;
  const global = PAGES[lang].global as Record<string, string>;
  return (key: string): string => {
    const value = own[key] ?? global[key];
    if (value === undefined) throw new Error(`Missing ${lang} translation: ${page}.${key}`);
    return value;
  };
}

/** The same page in the given language. `path` is the English path, e.g. "/" or "/hire". */
export function localePath(lang: Lang, path: string): string {
  if (lang === 'en') return path;
  return path === '/' ? '/es' : `/es${path}`;
}
