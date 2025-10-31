import { useEffect } from 'react';

type UseInfiniteScrollProps = {
  targetRef: React.RefObject<HTMLElement | null>;
  onIntersect: () => void;
  enabled?: boolean;
};

export const useInfiniteScroll = ({
  targetRef,
  onIntersect,
  enabled = true,
}: UseInfiniteScrollProps) => {
  useEffect(() => {
    if (!enabled || !targetRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      {
        rootMargin: '200px',
        threshold: 0,
      }
    );
    const current = targetRef.current;
    observer.observe(current);
    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [targetRef, onIntersect, enabled]);
};
