import {
  differenceInCalendarDays,
  format,
  formatDistanceToNowStrict,
  isValid,
  parseISO,
} from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';

export function formatDateRange(
  startDate: string,
  endDate: string,
  lang: 'es' | 'en' = 'es'
): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  const formatter = new Intl.DateTimeFormat(lang, {
    day: 'numeric',
    month: 'short',
  });

  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

export function formatDateLiteral(
  dateString: string,
  lang: 'es' | 'en' = 'es',
  hour: boolean = false
) {
  const date = parseISO(dateString);
  const locale = lang === 'es' ? es : enUS;
  if (hour) {
    return format(date, 'd MMM hh:mm aaaa', { locale });
  } else {
    return format(date, 'd MMM', { locale });
  }
}

export function formatTimeReadable(time: string, lowercase = true): string {
  try {
    const date = parseISO(`2000-01-01T${time}`);
    const formatted = format(date, 'hh:mm a');
    return lowercase ? formatted.toLowerCase() : formatted;
  } catch {
    console.warn('Invalid time format:', time);
    return time;
  }
}

export function formatDateFull(
  dateString: string,
  lang: 'es' | 'en' = 'es'
): string {
  const date = parseISO(dateString);
  const locale = lang === 'es' ? es : enUS;

  const result = format(date, 'EEE, d MMMM, yyyy', { locale });
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export function formatDateWithYear(
  dateString: string,
  lang: 'es' | 'en' = 'es'
): string {
  const date = parseISO(dateString);
  const locale = lang === 'es' ? es : enUS;
  return format(date, 'dd MMM yyyy', { locale });
}

export function formatDateRangeWithYear(
  startDate: string,
  endDate: string,
  lang: 'es' | 'en' = 'es'
): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const locale = lang === 'es' ? es : enUS;

  return `${format(start, 'dd MMM yyyy', { locale })} - ${format(end, 'dd MMM yyyy', { locale })}`;
}

export function getHourWithAmPm(
  dateString: string,
  lang: 'es' | 'en' = 'en'
): string {
  try {
    const date = parseISO(dateString);
    const locale = lang === 'es' ? es : enUS;
    return format(date, 'h a', { locale }); // e.g., "02 PM"
  } catch (error) {
    console.warn('Invalid date format:', error);
    return '';
  }
}

export function formatDate(date: Date, lang: string = 'es') {
  const locale = lang === 'en' ? enUS : es;
  return format(date, 'd MMM yyyy', { locale });
}

export function formatDayMonth(date: Date, lang: string = 'es') {
  const locale = lang === 'en' ? enUS : es;
  return format(date, 'd  MMM', { locale });
}

const localeMap: Record<SupportedLanguages, string> = {
  es: 'es-BO',
  en: 'en-US',
};

export function formatFriendlyDateRange(
  checkIn?: string | null,
  checkOut?: string | null,
  lang: SupportedLanguages = 'es'
): string | null {
  if (!checkIn || !checkOut) return null;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return null;

  const nowYear = new Date().getFullYear();
  const sYear = start.getFullYear();
  const eYear = end.getFullYear();

  const locale = localeMap[lang] || 'es-BO';
  const fmt = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
  });

  const clean = (s: string) => s.replace(/\./g, '');
  const adjustCase = (s: string) => (lang === 'es' ? s.toLowerCase() : s);

  const startBase = adjustCase(clean(fmt.format(start)));
  const endBase = adjustCase(clean(fmt.format(end)));

  const startPart = sYear === nowYear ? startBase : `${startBase} ${sYear}`;
  const endPart = eYear === nowYear ? endBase : `${endBase} ${eYear}`;

  return `${startPart} ~ ${endPart}`;
}

export const getDurationText = (
  startDateStr: string,
  lang: SupportedLanguages = 'es',
  withSuffix = false // true => "hace X meses" / "in X months"
): string => {
  const t = getTranslation(lang);
  const d = parseISO(startDateStr);
  if (!isValid(d)) return '';

  const locale = lang === 'es' ? es : enUS;
  const today = new Date();

  const diffDays = differenceInCalendarDays(today, d);

  if (diffDays === 0) {
    return t.dateUtils.fromToday;
  }

  const absDays = Math.abs(diffDays);

  let unit: 'day' | 'month' | 'year';
  if (absDays >= 365) unit = 'year';
  else if (absDays >= 30) unit = 'month';
  else unit = 'day';

  return formatDistanceToNowStrict(d, {
    unit,
    roundingMethod: 'floor',
    addSuffix: withSuffix,
    locale,
  });
};

const toIsoString = (d: unknown): string => {
  if (!d) return '';
  if (d instanceof Date) return d.toISOString();
  if (typeof d === 'string') return d;
  return '';
};

export const safeFormatDate = (
  d: unknown,
  langParam: SupportedLanguages = 'es',
  hour = false
): string => {
  const s = toIsoString(d);
  if (!s) return '';
  try {
    return formatDateLiteral(s, langParam, hour);
  } catch (e) {
    console.error('Error formatting date:', e);
    // malformed date string
    return '';
  }
};
