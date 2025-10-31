import type { Listing } from '@/types/host/listing';
import CalendarIcon from '@/icons/calendar.svg?react';
import StatusBadge from './StatusBadge';
import { ResponsiveImage } from '../../Common/ResponsiveImage';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { parseISO, format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

interface Props {
  data: Listing;
  lang?: SupportedLanguages;
}

export default function ListingCard({ data, lang = 'es' }: Props) {
  const t = getTranslation(lang);
  const { title, location, createdAt, photo, status } = data;

  const showTitle = title?.trim();
  const showLocation = location?.address && location?.city;

  const date = createdAt ? parseISO(createdAt) : null;
  const formattedDate =
    date && !isNaN(date.getTime())
      ? format(date, 'dd/MM/yyyy', { locale: lang === 'en' ? enUS : es })
      : '';

  const fallbackPhoto = {
    original: '/images/host/listings/fallback-card-image.webp',
    srcsetWebp: '',
    srcsetAvif: '',
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl">
        <ResponsiveImage
          photo={photo || fallbackPhoto}
          alt="image"
          className="h-full w-full object-cover"
          sizes="240px"
        />
        <div className="absolute top-6 left-6">
          <StatusBadge status={status} lang={lang} />
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-1">
        <div className="flex w-full items-center justify-between gap-2">
          <h2 className="text-base-content truncate text-base leading-6 font-normal">
            {showTitle}
          </h2>
        </div>

        {showLocation && (
          <p className="text-neutral text-xs leading-4 font-normal">
            {`${location?.address}, ${location?.city}`}
          </p>
        )}

        <div className="text-base-content flex items-center gap-2 text-xs leading-4">
          <CalendarIcon className="text-secondary h-4 w-4" />
          <span>
            {formattedDate || t.hostContent.listings.table.noInformation}
          </span>
        </div>
      </div>
    </div>
  );
}
