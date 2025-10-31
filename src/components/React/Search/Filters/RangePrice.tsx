import React, { useEffect, useMemo, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { formatCurrency } from '@/utils/formatCurrency';

interface Props {
  minAllowedPrice: number;
  maxAllowedPrice: number;
  currentMinPrice: number;
  currentMaxPrice: number;
  lang?: SupportedLanguages;
  currency: string;
  onUpdatePrices: (min: number, max: number) => void;
}

const RangePrice: React.FC<Props> = ({
  minAllowedPrice,
  maxAllowedPrice,
  currentMinPrice,
  currentMaxPrice,
  onUpdatePrices,
  lang = 'es',
  currency,
}) => {
  const t = getTranslation(lang);
  const newRange: [number, number] = useMemo(() => {
    const clampedMin = Math.max(currentMinPrice, minAllowedPrice);
    const clampedMax = Math.min(currentMaxPrice, maxAllowedPrice);
    return clampedMin <= clampedMax
      ? [clampedMin, clampedMax]
      : [minAllowedPrice, maxAllowedPrice];
  }, [currentMinPrice, currentMaxPrice, minAllowedPrice, maxAllowedPrice]);
  const [currentRange, setCurrentRange] = useState<[number, number]>(newRange);

  useEffect(() => {
    setCurrentRange(newRange);
  }, [newRange]);

  const handlePriceChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      setCurrentRange([value[0], value[1]]);
    }
  };

  const handleAfterChange = (value: number | number[]) => {
    if (Array.isArray(value)) {
      onUpdatePrices(value[0], value[1]);
    }
  };

  const getTailwindColor = (className: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.className = `${className} invisible absolute`;
    tempDiv.style.pointerEvents = 'none';
    document.body.appendChild(tempDiv);
    const color = getComputedStyle(tempDiv).backgroundColor;
    document.body.removeChild(tempDiv);
    return color;
  };

  const backgroundColor = useMemo(() => getTailwindColor('bg-primary'), []);
  const borderColor = useMemo(() => getTailwindColor('bg-secondary'), []);

  return (
    <div className="mx-auto w-full max-w-md space-y-4">
      <p className="text-sm font-bold" data-testid="test-range-title">
        {t.filter.priceRange}
      </p>
      <div className="px-2">
        <Slider
          range
          min={minAllowedPrice}
          max={maxAllowedPrice}
          value={currentRange}
          onChange={handlePriceChange} // Updates while dragging
          onChangeComplete={handleAfterChange} // Updates on release
          allowCross={false}
          styles={{
            track: { backgroundColor: backgroundColor, height: 5 },
            handle: { borderColor: borderColor },
          }}
        />
      </div>
      <div className="flex justify-between">
        <div>
          <p
            className="text-neutral text-center text-sm"
            data-testid="test-range-title-price-min"
          >
            {t.filter.min}
          </p>
          <div className="outline-base-300 rounded-full px-2 py-1 text-sm outline">
            {formatCurrency(currentRange[0], currency, lang)}
          </div>
        </div>
        <div>
          <p
            className="text-neutral text-center text-sm"
            data-testid="test-range-title-price-max"
          >
            {t.filter.max}
          </p>
          <div className="outline-base-300 rounded-full px-2 py-1 text-sm outline">
            {formatCurrency(currentRange[1], currency, lang)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangePrice;
