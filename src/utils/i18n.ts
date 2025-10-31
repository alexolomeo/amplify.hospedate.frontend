import en from '@/locales/en';
import es from '@/locales/es';

const translations = { en, es };

export type SupportedLanguages = keyof typeof translations;

// TODO(i18n): Temporarily force Spanish.
// - Reason: Ensure consistent UX while full multilingual strategy is pending.
// - Current state (2025-09-23): detectLanguage ignores query/cookies/Accept-Language and always returns 'es'.
// - How to revert: Uncomment the query/cookie/Accept-Language logic and make sure the 'lang' cookie
//   has a persistent Max-Age/Expires.
export const detectLanguage = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  headers: Headers,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  url: URL
): SupportedLanguages => {
  const defaultLang: SupportedLanguages = 'es';
  // const queryLang = url.searchParams.get('lang') as SupportedLanguages;

  // if (queryLang && queryLang in translations) {
  //   return queryLang;
  // }

  // const cookieLang = headers
  //   .get('cookie')
  //   ?.match(/lang=(\w{2})/)?.[1] as SupportedLanguages;
  // if (cookieLang && cookieLang in translations) {
  //   return cookieLang;
  // }

  // const acceptLang = headers.get('accept-language');
  // if (acceptLang) {
  //   const lang = acceptLang.split(',')[0].slice(0, 2) as SupportedLanguages;
  //   return lang in translations ? (lang as SupportedLanguages) : defaultLang;
  // }

  return defaultLang;
};

export const getTranslation = (lang: SupportedLanguages) => {
  return translations[lang];
};

export const translate = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>,
  key: string,
  args?: Record<string, string | number>
) => {
  const keys = key.split('.');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let text: any = t;
  for (const k of keys) {
    if (text && typeof text === 'object') {
      text = text[k];
    } else {
      text = undefined;
      break;
    }
  }
  if (typeof text !== 'string') {
    return key;
  }
  if (args) {
    for (const arg in args) {
      const regex = new RegExp(`{${arg}}`, 'g');
      text = text.replace(regex, String(args[arg]));
    }
  }

  return text;
};

export const translatePlural = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: Record<string, any>,
  baseKey: string,
  count: number,
  args: Record<string, string | number> = {}
) => {
  const key = count === 1 ? baseKey : `${baseKey}_plural`;
  return translate(t, key, { count, ...args });
};
