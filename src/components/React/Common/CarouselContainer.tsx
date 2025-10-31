import React, { useCallback, useEffect, useRef, useState } from 'react';
import AppButton from '../Common/AppButton';
interface Props {
  scrollAmount?: number;
  title?: string;
  children: React.ReactNode;
}

const CarouselContainer: React.FC<Props> = ({
  scrollAmount = 0.5,
  title,
  children,
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const checkOverflow = () => {
    if (!carouselRef.current) return false;
    return carouselRef.current.scrollWidth > carouselRef.current.clientWidth;
  };

  useEffect(() => {
    const carouselElement = carouselRef.current;
    if (!carouselElement) return;
    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = carouselElement;
      setIsAtStart(scrollLeft === 0);
      setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
    };
    const updateOverflow = () => {
      setHasOverflow(checkOverflow());
    };
    carouselElement.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', updateOverflow);
    handleScroll();
    updateOverflow();
    return () => {
      carouselElement.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateOverflow);
    };
  }, []);

  const scrollCarousel = useCallback(
    (direction: 'left' | 'right') => {
      if (carouselRef.current) {
        const scrollDistance = carouselRef.current.offsetWidth * scrollAmount;
        carouselRef.current.scrollBy({
          left: direction === 'left' ? -scrollDistance : scrollDistance,
          behavior: 'smooth',
        });
      }
    },
    [scrollAmount]
  );

  return (
    <>
      <div className="flex justify-between">
        {title && <p className="text-xl leading-7 font-bold">{title}</p>}
        {hasOverflow && (
          <div className="mb-4 flex gap-4">
            <AppButton
              label="‹"
              variant="circle"
              type="button"
              aria-label="Scroll carousel left"
              onClick={() => scrollCarousel('left')}
              disabled={isAtStart}
            />
            <AppButton
              label="›"
              variant="circle"
              type="button"
              aria-label="Scroll carousel right"
              onClick={() => scrollCarousel('right')}
              disabled={isAtEnd}
            />
          </div>
        )}
      </div>
      <div
        ref={carouselRef}
        className="carousel flex w-full space-x-5 overflow-x-auto scroll-smooth"
      >
        {children}
      </div>
    </>
  );
};

export default CarouselContainer;
