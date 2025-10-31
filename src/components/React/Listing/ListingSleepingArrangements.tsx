import React, { useRef } from 'react';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import OptimizedImage from '@/components/React/Common/OptimizedImage';
import { getSafeArray } from '@/utils/displayHelpers';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import type { Space } from '@/types/listing/space';
import AppButton from '../Common/AppButton';
interface Props {
  spaces?: Space[];
  lang?: SupportedLanguages;
  open: (spaceName?: string) => void;
}
const ListingSleepingArrangements: React.FC<Props> = ({
  spaces = [],
  lang = 'es',
  open,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const safeSpaces = getSafeArray(spaces);
  const spacesArrangements = React.useMemo(
    () =>
      safeSpaces.filter(
        (space) =>
          Array.isArray(space.sleepingArrangements) &&
          space.sleepingArrangements.length > 0
      ),
    [safeSpaces]
  );
  const t = getTranslation(lang);
  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.offsetWidth / 2;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  return (
    <div>
      {spacesArrangements && spacesArrangements.length > 0 && (
        <div className="space-y-6 py-8">
          <div className="flex justify-between">
            <h1 className="title-listing">
              {t.listingDetail.sleepingArrangements.title}
            </h1>
            {spacesArrangements.length > 2 && (
              <div className="hidden md:block lg:block">
                <AppButton
                  label="‹"
                  variant="circle"
                  type="button"
                  aria-label="Scroll carousel right"
                  onClick={() => scrollCarousel('left')}
                ></AppButton>
                <AppButton
                  label=" ›"
                  variant="circle"
                  type="button"
                  aria-label="Scroll carousel right"
                  onClick={() => scrollCarousel('right')}
                ></AppButton>
              </div>
            )}
          </div>
          <div className="card">
            <div
              className="carousel flex overflow-x-scroll scroll-smooth"
              ref={carouselRef}
            >
              {spacesArrangements.map((item) => (
                <div
                  className={`carousel-item group flex-shrink-0 md:w-1/2 lg:w-1/2 ${item.photos.length !== 0 ? 'cursor-pointer' : ''}`}
                  key={item.id}
                >
                  <div
                    className="p-2"
                    data-testid="space-arragement-test"
                    onClick={() => {
                      if (item.photos.length !== 0) {
                        open(item.name);
                      }
                    }}
                  >
                    {item.photos.length === 0 ? (
                      <OptimizedImage
                        src="/images/bed.webp"
                        srcSet="/images/bed-320w.webp 320w, /images/bed-640w.webp 640w, /images/bed-1024w.webp 1024w, /images/bed.webp 1606w"
                        sizes="(min-width: 1024px) 320px, (min-width: 768px) 224px, 192px"
                        alt="step1"
                        className="h-32 w-48 rounded-[40px] object-cover md:h-36 md:w-56 lg:h-54 lg:w-80"
                      />
                    ) : (
                      <ResponsiveImage
                        photo={item.photos[0]}
                        alt={item.name || 'Sleeping arrangement image'}
                        className="h-32 w-48 rounded-[40px] object-cover md:h-36 md:w-56 lg:h-54 lg:w-80"
                      />
                    )}
                    <div className="p-2 text-start">
                      <p
                        className="description-listing group-hover:text-secondary group-hover:font-extrabold"
                        data-testid="section-name"
                      >
                        {item.name}
                      </p>
                      {item.sleepingArrangements &&
                        item.sleepingArrangements?.length > 0 && (
                          <p className="text-neutral group-hover:text-base-content line-clamp-2 max-w-48 text-sm font-normal md:max-w-56 lg:max-w-80">
                            {item.sleepingArrangements
                              .map((arrangement) => {
                                const translatedType =
                                  t.listingDetail.sleepingArrangements.types[
                                    arrangement.type
                                  ] || arrangement.type;
                                return `${arrangement.quantity} ${translatedType}`;
                              })
                              .join(', ')}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingSleepingArrangements;
