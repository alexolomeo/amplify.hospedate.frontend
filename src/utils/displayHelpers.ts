export function getSafeText(
  value: string | null | undefined,
  lang: 'es' | 'en' = 'es'
): string {
  if (typeof value === 'string' && value.trim() !== '') {
    return value.trim();
  }
  const fallbackByLang: Record<'es' | 'en', string> = {
    es: 'Contenido no disponible',
    en: 'Content not available',
  };
  return fallbackByLang[lang] || fallbackByLang['es'];
}

export function getSafeArray<T>(
  array: T[] | null | undefined,
  fallback: T[] = []
): T[] {
  return Array.isArray(array) && array.length > 0 ? array : fallback;
}

export function getSafeUserImage(
  url: string | null | undefined
): { type: 'image'; value: string } | { type: 'icon'; value: string } {
  if (typeof url !== 'string') {
    return { type: 'icon', value: 'user' };
  }
  const trimmed = url.trim();
  const isValidUrl = /^https?:\/\//.test(trimmed);
  if (trimmed !== '' && isValidUrl) {
    return { type: 'image', value: trimmed };
  }
  return { type: 'icon', value: 'user' };
}

export function getFormattedLocalDate(
  dateString: string,
  lang: 'es' | 'en' = 'es'
): string {
  if (!dateString)
    return lang === 'es' ? 'Fecha no disponible' : 'Date not available';
  const date = new Date(dateString);
  const localeMap: Record<string, string> = {
    es: 'es-ES',
    en: 'en-US',
  };
  const locale = localeMap[lang] || 'es-ES';
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}
