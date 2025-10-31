import PlusMiniIcon from '/src/icons/plus-mini.svg?react';
import MinusMiniIcon from '/src/icons/minus-mini.svg?react';

interface CounterProps {
  label: string;
  caption?: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function Counter({
  label,
  caption,
  value,
  onIncrement,
  onDecrement,
}: CounterProps) {
  return (
    <div className="flex w-full items-center justify-between">
      {/* Label */}
      <div className="flex flex-col items-start gap-1">
        <span className="text-base leading-5 font-normal text-[var(--color-base-content)] md:text-base md:leading-6 xl:text-lg">
          {label}
        </span>
        {caption && (
          <span className="text-neutral text-xs leading-5 font-normal md:text-sm md:leading-6">
            {caption}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-1 md:gap-2">
        {/* Decrement */}
        <button
          onClick={onDecrement}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[16px] border border-[var(--color-base-300)] bg-white text-xs shadow-sm md:h-8 md:w-8 md:text-sm xl:h-10 xl:w-10 xl:text-base"
        >
          <MinusMiniIcon className="h-4 w-4" aria-hidden="true" />
        </button>

        {/* Value */}
        <span className="w-6 text-center text-xs leading-4 font-normal text-[var(--color-base-content)] md:w-8 md:text-sm xl:w-10 xl:text-base">
          {value}
        </span>

        {/* Increment */}
        <button
          onClick={onIncrement}
          className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-[16px] border border-[var(--color-base-300)] bg-white text-xs shadow-sm md:h-8 md:w-8 md:text-sm xl:h-10 xl:w-10 xl:text-base"
        >
          <PlusMiniIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
