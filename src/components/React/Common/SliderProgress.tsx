import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import clsx from 'clsx';

interface Props {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  unit?: string;
  displayValue?: number;
  displayUnit?: string;
  step?: number;
  className?: string;
  disabled?: boolean;
}

export default function SliderProgress({
  value,
  onChange,
  min = 0,
  max = 100,
  unit = '%',
  displayValue,
  displayUnit,
  step = 1,
  className = '',
  disabled = false,
}: Props) {
  return (
    <div className={clsx('flex w-full items-center gap-4', className)}>
      <span className="text-base-content w-10 shrink-0 text-sm font-bold">
        {value.toFixed(0)}
        {unit}
      </span>

      <Slider
        min={min}
        max={max}
        value={value}
        onChange={(val) => {
          if (disabled) return;
          if (typeof val === 'number') onChange(val);
        }}
        step={step}
        disabled={disabled}
        styles={{
          handle: {
            borderColor: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary)',
            height: 16,
            width: 16,
            marginTop: -5,
          },
          track: {
            backgroundColor: 'var(--color-primary)',
            height: 6,
          },
          rail: {
            backgroundColor: 'var(--color-base-200)',
            height: 6,
          },
        }}
      />

      {displayValue !== undefined && (
        <span className="text-base-content w-16 shrink-0 text-right text-sm font-bold">
          {displayUnit} {displayValue}
        </span>
      )}
    </div>
  );
}
