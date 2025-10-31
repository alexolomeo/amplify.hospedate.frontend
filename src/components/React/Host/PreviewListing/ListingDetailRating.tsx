import * as React from 'react';
import clsx from 'clsx';

import RatingCategory from '@/components/React/Listing/RatingCategory';
import type { OverallRating, Rating } from '@/types/listing/rating';
import { getSafeArray } from '@/utils/displayHelpers';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

// Reemplazo del <Icon name="star" /> de astro-icon
function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

type Props = {
  rating?: Rating;
  lang?: SupportedLanguages;

  /** clases de layout (compatibles con las del .astro) */
  flex?: string;
  flexContent?: string;

  /** Soportamos ambos nombres por compatibilidad ('progresWidth' estaba mal escrito en Astro) */
  progressWidth?: string;
  progresWidth?: string;

  isModal?: boolean;
  scoreSize?: string;
  starSize?: string;
  description?: string;

  /** Botón opcional para cerrar el modal si quieres inyectar uno propio */
  closeButtonSlot?: React.ReactNode;
};

export default function ListingDetailRating({
  rating,
  lang = 'es',
  flex = 'flex flex-col lg:flex-row lg:pr-96',
  flexContent = 'hidden lg:flex',
  progressWidth,
  progresWidth,
  isModal = false,
  scoreSize = 'text-8xl',
  starSize = 'h-20 w-20',
  description = 'py-4 text-base',
  closeButtonSlot,
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  if (!rating) {
    return (
      <div className="rounded-lg bg-gray-100 p-8 text-center">
        {t.listingDetail.rating.notAvailable}
      </div>
    );
  }

  const overallRating = getSafeArray(rating.overallRating) as OverallRating[];
  const progressWidthClass = progressWidth ?? progresWidth ?? 'w-30';
  const safeScore =
    typeof rating.score === 'number' && Number.isFinite(rating.score)
      ? rating.score
      : 0;

  return (
    <div className={isModal ? 'space-y-6' : 'space-y-6 py-10'}>
      {/* Botón de cierre (solo modal, mobile) */}
      {isModal && (
        <div className="block md:hidden lg:hidden">
          {closeButtonSlot ? (
            closeButtonSlot
          ) : (
            // Mantiene la semántica del <form method="dialog">, por si lo usas dentro de <dialog>
            <form method="dialog">
              <button
                type="submit"
                className="btn btn-circle btn-ghost text-xl"
                aria-label="Close"
              >
                ✕
              </button>
            </form>
          )}
        </div>
      )}

      <div
        className={clsx(
          'items-center justify-center gap-6 lg:items-start lg:justify-start',
          flex
        )}
      >
        <div className="flex items-center gap-4">
          <span className={clsx('text-primary font-bold', scoreSize)}>
            {safeScore.toFixed(1)}
          </span>
          <StarIcon className={clsx('text-accent', starSize)} />
        </div>

        <div className="flex-1 flex-col text-center lg:text-left">
          <h1 className="justify-center text-2xl font-medium">
            {t.listingDetail.rating.title}
          </h1>
          <p className={clsx(description)}>
            {t.listingDetail.rating.description}
          </p>
        </div>
      </div>

      <div className={clsx('gap-6', flexContent)}>
        {overallRating.length > 0 && (
          <div className="space-y-4 text-xs">
            <h2>{t.listingDetail.rating.overall}</h2>
            <ul>
              {[...overallRating].reverse().map((item, i) => (
                <li key={i} className="flex flex-nowrap items-center">
                  <span className="pr-2">{item.score}</span>
                  <progress
                    className={clsx(
                      'progress text-secondary h-1',
                      progressWidthClass
                    )}
                    value={item.count}
                    max={100}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        <RatingCategory rating={rating} isModal={isModal} lang={lang} />
      </div>
    </div>
  );
}
