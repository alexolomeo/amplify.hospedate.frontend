import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import React from 'react';

type Props = {
  count?: number;
  columnsClass?: string;
  containerClassName?: string;
  cardWrapperClass?: string;
  imageWrapperClass?: string;
  cardRadiusClass?: string;
  showHeader?: boolean;
  lang?: SupportedLanguages;
};

const ListingsGridSkeleton: React.FC<Props> = ({
  count = 16,
  columnsClass = 'grid gap-5 sm:gap-5 md:gap-4 lg:gap-4 xl:gap-3 2xl:gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
  containerClassName = 'w-full px-4 py-10 sm:px-8 md:px-12 lg:px-16 xl:px-20',
  cardWrapperClass = 'flex w-full h-full flex-col',
  imageWrapperClass = 'relative w-full overflow-hidden aspect-[10/11]',
  cardRadiusClass = 'rounded-[16px]',
  showHeader = false,
  lang = 'es',
}) => {
  const t = getTranslation(lang);
  const items = Array.from({ length: count });

  return (
    <section
      aria-busy="true"
      aria-label={t.listings.loading}
      className={containerClassName}
    >
      {showHeader && <div className="bg-base-300 mb-5 h-5 w-56 rounded" />}

      <div className={columnsClass}>
        {items.map((_, i) => (
          <div key={i} className={`animate-pulse ${cardWrapperClass}`}>
            <div
              className={`${imageWrapperClass} ${cardRadiusClass} bg-base-300`}
            />

            <div className="mt-3 space-y-2 px-0 py-3">
              <div className="bg-base-300 h-5 w-4/5 rounded" />
              <div className="bg-base-300 h-4 w-3/5 rounded" />
              <div className="bg-base-300 h-4 w-2/5 rounded" />
              <div className="bg-base-300 h-4 w-3/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ListingsGridSkeleton;
