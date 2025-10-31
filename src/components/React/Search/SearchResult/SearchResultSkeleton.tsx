import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import React from 'react';

export type CardsSkeletonProps = {
  lang?: SupportedLanguages;
  count?: number;
  layout?: 'flex' | 'grid';
  gridCols?: string;
  cardMaxWClass?: string;
  imgHeightClass?: string;
  imgAspectClass?: string;
};

export const CardsSkeleton: React.FC<CardsSkeletonProps> = ({
  count = 12,
  layout = 'grid',
  gridCols = 'grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 md:gap-4 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3 xl:gap-3 2xl:grid-cols-4 2xl:gap-3',
  cardMaxWClass = '',
  imgHeightClass = '',
  imgAspectClass = 'aspect-[10/11]',
}) => {
  const items = Array.from({ length: count });

  const CardSkeleton: React.FC = () => (
    <div
      className={`w-full ${cardMaxWClass} animate-pulse overflow-hidden rounded-[16px] pt-7`}
    >
      <div
        className={[
          'bg-base-300 relative w-full overflow-hidden rounded-[16px]',
          imgAspectClass ?? imgHeightClass,
        ].join(' ')}
      />

      <div className="space-y-2 p-3">
        <div className="bg-base-300 h-4 w-3/4 rounded" />
        <div className="bg-base-300 h-4 w-1/2 rounded" />
        <div className="bg-base-300 h-4 w-1/3 rounded" />
        <div className="bg-base-300 h-4 w-3/4 rounded" />
      </div>
    </div>
  );

  if (layout === 'grid') {
    return (
      <div className={gridCols}>
        {items.map((_, i) => (
          <div
            key={i}
            className="flex h-full w-full flex-col overflow-hidden rounded-[16px]"
          >
            <div
              className={[
                'bg-base-300 relative w-full overflow-hidden rounded-[16px]',
                imgAspectClass ?? imgHeightClass,
              ].join(' ')}
            />
            <div className="space-y-2 p-3">
              <div className="bg-base-300 h-4 w-3/4 animate-pulse rounded" />
              <div className="bg-base-300 h-4 w-1/2 animate-pulse rounded" />
              <div className="bg-base-300 h-4 w-1/3 animate-pulse rounded" />
              <div className="bg-base-300 h-4 w-3/4 animate-pulse rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-start gap-x-6 gap-y-6 sm:gap-6">
      {items.map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export const MapSkeletonInner: React.FC = () => (
  <div className="bg-base-200 relative h-full w-full animate-pulse overflow-hidden rounded-xl">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
    </div>
    <div className="bg-base-300 absolute top-6 left-6 h-6 w-20 rounded-full" />
  </div>
);

export const MapSkeleton: React.FC<{ lang?: SupportedLanguages }> = ({
  lang = 'es',
}) => {
  const t = getTranslation(lang);
  return (
    <div
      style={{ '--search-map-top-offset': '100px' } as React.CSSProperties}
      className="bg-base-200 relative sticky top-[var(--search-map-top-offset)] h-[calc(100vh-var(--search-map-top-offset))] w-full animate-pulse overflow-hidden rounded-xl"
    >
      <div className="pointer-events-none absolute top-6 left-1/2 -translate-x-1/2">
        <div
          role="status"
          aria-label={t.hostReservations.loading}
          className="border-base-200 bg-base-100/90 flex w-28 items-center justify-center rounded-full border px-3 py-1.5 shadow-md backdrop-blur"
        >
          <span className="loading loading-bars loading-xl text-primary [animation-duration:1.5s]" />
        </div>
      </div>
    </div>
  );
};

const SearchResultSkeletonDefault: React.FC<CardsSkeletonProps> = (props) => (
  <section className="w-full px-4 py-3 sm:px-8 md:px-12 lg:px-16 xl:px-20">
    <div className="flex w-full flex-col md:flex-row md:gap-[2%]">
      <div className="mt-6 w-full md:order-2 md:mt-0 md:w-[38%]">
        <MapSkeleton />
      </div>
      <div className="w-full md:order-1 md:w-[60%]">
        <CardsSkeleton
          {...props}
          layout="grid"
          gridCols="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-5 md:gap-4 lg:grid-cols-2 lg:gap-4 xl:grid-cols-3 xl:gap-3 2xl:grid-cols-4 2xl:gap-3"
        />
      </div>
    </div>
  </section>
);

export default SearchResultSkeletonDefault;
