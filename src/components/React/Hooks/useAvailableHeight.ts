import { useEffect, useState } from 'react';

const DEFAULT_HEADER_HEIGHT = 64;

/**
 * Calculates the available height of the screen by subtracting fixed elements (header/footer).
 * @param headerSelector - Header CSS selector (default: 'header')
 * @param footerSelector - Footer CSS selector (optional)
 * @returns Available height in px (number) or undefined if the calculation was not made correctly
 */
export function useAvailableHeight(
  headerSelector: string = 'header',
  footerSelector?: string
): number | undefined {
  const [height, setHeight] = useState<number | undefined>();

  useEffect(() => {
    function update() {
      const header = document.querySelector(headerSelector);
      const headerHeight = header
        ? header.getBoundingClientRect().height
        : DEFAULT_HEADER_HEIGHT;

      let footerHeight = 0;
      if (footerSelector && footerSelector.trim()) {
        const footer = document.querySelector(footerSelector);
        footerHeight = footer ? footer.getBoundingClientRect().height : 0;
      }

      const total = headerHeight + footerHeight;
      setHeight(Math.round(window.innerHeight - total));
    }

    update();
    window.addEventListener('resize', update);

    return () => {
      window.removeEventListener('resize', update);
    };
  }, [headerSelector, footerSelector]);

  return height;
}
