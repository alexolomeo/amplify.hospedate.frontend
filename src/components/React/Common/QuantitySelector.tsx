import React from 'react';
import clsx from 'clsx';
interface QuantitySelectorProps {
  title: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  titleClassName?: string;
  buttonSizeClass?: string;
  disabled?: boolean;
}
const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  title,
  value,
  onIncrement,
  onDecrement,
  min = 0,
  max,
  titleClassName = 'text-xs leading-3 font-normal',
  buttonSizeClass = 'btn-xs',
  disabled = false,
}) => {
  const decDisabled = disabled || value <= min;
  const incDisabled = disabled || (max !== undefined && value >= max);

  const safeDecrement = () => {
    if (!decDisabled) onDecrement();
  };
  const safeIncrement = () => {
    if (!incDisabled) onIncrement();
  };

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <p className={clsx(titleClassName)}>{title}</p>
      </div>
      <div>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            className={clsx(
              'btn btn-outline border-base-300 rounded-full font-semibold',
              buttonSizeClass,
              { 'cursor-not-allowed opacity-50': decDisabled }
            )}
            onClick={safeDecrement}
            disabled={decDisabled}
            aria-disabled={decDisabled}
          >
            -
          </button>
          <span className="w-[20px] text-center text-sm font-medium">
            {value}
          </span>
          <button
            type="button"
            className={clsx(
              'btn btn-outline border-base-300 rounded-full font-semibold',
              buttonSizeClass,
              { 'cursor-not-allowed opacity-50': incDisabled }
            )}
            onClick={safeIncrement}
            disabled={incDisabled}
            aria-disabled={incDisabled}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
export default QuantitySelector;
