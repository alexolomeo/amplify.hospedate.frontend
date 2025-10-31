import { useEffect, useRef, useState, useCallback } from 'react';
import type { ListingPhoto } from '@/types/listing/display-map/searchListingMarker';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import LoadingSpinner from '@/components/React/Common/LoadingSpinner';
import clsx from 'clsx';
import ChevronRightIcon from '/src/icons/chevron-right.svg?react';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';

function Carousel({ images = [] }: { images: ListingPhoto[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const dotsContainerRef = useRef<HTMLDivElement>(null);
  const activeDotRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < images.length) {
        setCurrentIndex(index);
      }
    },
    [images.length]
  );

  const goToPrev = useCallback(() => {
    goToSlide((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, goToSlide]);

  useEffect(() => {
    if (activeDotRef.current && dotsContainerRef.current) {
      const dot = activeDotRef.current;
      const container = dotsContainerRef.current;

      const dotLeft = dot.offsetLeft;
      const dotWidth = dot.offsetWidth;
      const containerWidth = container.offsetWidth;

      const scrollTo = dotLeft - containerWidth / 2 + dotWidth / 2;
      container.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  }, [currentIndex]);

  return (
    <div className="group relative h-full w-full overflow-hidden rounded-t-2xl">
      {images.length === 0 && (
        <div className="absolute inset-0 z-30 flex items-center justify-center">
          <LoadingSpinner size="md" message="" />
        </div>
      )}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((photo, idx) => (
          <div key={idx} className="h-full w-full flex-shrink-0">
            <ResponsiveImage
              photo={photo}
              alt={`Foto ${idx + 1}`}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <div className="absolute top-1/2 right-3 left-3 z-20 flex -translate-y-1/2 justify-between opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100">
          {currentIndex > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrev();
              }}
              className="btn btn-sm btn-circle border-0 bg-[var(--color-base-200)] shadow"
              aria-label="Previous slide"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
          ) : (
            <span className="w-8" />
          )}
          {currentIndex < images.length - 1 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="btn btn-sm btn-circle border-0 bg-[var(--color-base-200)] shadow"
              aria-label="Next slide"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          ) : (
            <span className="w-8" />
          )}
        </div>
      )}

      <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 justify-center">
        <div
          className={clsx(
            'relative flex h-4 max-w-[36px] overflow-hidden',
            images.length <= 3 && 'justify-center'
          )}
          ref={dotsContainerRef}
        >
          <div className="flex gap-[5px] transition-transform duration-300 ease-in-out">
            {images.map((_, idx) => (
              <div
                key={idx}
                ref={idx === currentIndex ? activeDotRef : null}
                className={clsx(
                  'h-2 w-2 shrink-0 rounded-full',
                  idx === currentIndex
                    ? 'bg-[var(--color-base-300)]'
                    : 'bg-[var(--color-base-150)]'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
