import { useState, useEffect, useRef, type ReactNode } from 'react';
import clsx from 'clsx';
import ChevronDownIcon from '/src/icons/chevron-down.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

export type Option<V extends string | number> = {
  value: V;
  label: string;
  disabled?: boolean;
};

interface DropdownV2Props<V extends string | number> {
  options: Option<V>[];
  value: V | null;
  onChange: (value: V | null) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string | ((opt: Option<V>) => string);
  selectedOptionClassName?: string;
  buttonHeight?: string;
  labelFontSize?: string;
  lang?: SupportedLanguages;
  disabled?: boolean;
  renderValue?: (opt: Option<V> | null) => ReactNode;
}

export default function DropdownV2<V extends string | number>({
  options,
  value,
  onChange,
  placeholder,
  className,
  buttonClassName,
  dropdownClassName,
  optionClassName,
  selectedOptionClassName,
  buttonHeight = 'h-8',
  labelFontSize = 'text-base',
  lang = 'es',
  disabled = false,
  renderValue,
}: DropdownV2Props<V>) {
  const t = getTranslation(lang);
  const ph =
    placeholder ??
    t.hostContent.editListing.commonComponents.dropdown.placeholder;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedBtnRef = useRef<HTMLButtonElement | null>(null);

  const selected = options.find((o) => o.value === value) ?? null;

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((v) => !v);
  };

  const handleSelect = (opt: Option<V>) => {
    if (opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (ev: MouseEvent) => {
      if (
        rootRef.current &&
        ev.target &&
        !rootRef.current.contains(ev.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);

  const prevValueRef = useRef<V | null>(value);

  useEffect(() => {
    if (open && selectedBtnRef.current) {
      selectedBtnRef.current.scrollIntoView({ block: 'nearest' });
    }
  }, [open]);

  useEffect(() => {
    if (!open) {
      prevValueRef.current = value;
      return;
    }
    if (prevValueRef.current !== value && selectedBtnRef.current) {
      selectedBtnRef.current.scrollIntoView({ block: 'nearest' });
    }
    prevValueRef.current = value;
  }, [value, open]);

  const baseOptionCls =
    'text-base-content w-full px-4 py-2 text-center text-sm transition-colors hover:rounded-full hover:bg-base-200';

  const selectedCls =
    selectedOptionClassName ?? 'bg-base-300 font-semibold hover:bg-base-300';

  return (
    <div ref={rootRef} className={clsx('relative', className)}>
      <button
        type="button"
        onClick={toggleOpen}
        disabled={disabled}
        aria-disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={clsx(
          'flex w-full items-center justify-between rounded-full border px-4 text-lg font-semibold transition-colors',
          buttonHeight,
          disabled
            ? 'bg-base-100 border-base-200 text-base-content/50 cursor-not-allowed'
            : 'cursor-pointer ' +
                (open
                  ? 'bg-base-200 border-base-200 text-base-content'
                  : 'bg-base-100 border-base-200 text-base-content'),
          buttonClassName
        )}
      >
        <span className={clsx('truncate text-center', labelFontSize)}>
          {renderValue ? renderValue(selected) : (selected?.label ?? ph)}
        </span>
        <ChevronDownIcon
          className={clsx(
            'h-4 w-4',
            disabled
              ? 'text-[var(--color-base-content)]/50'
              : 'text-[var(--color-base-content)]'
          )}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className={clsx(
            'absolute right-0 left-0 z-[9999] mt-2 w-full rounded-2xl bg-[var(--color-primary-content)] shadow-xl',
            'max-h-[50vh] overflow-auto',
            dropdownClassName
          )}
        >
          {options.map((opt) => {
            const isSelected = selected?.value === opt.value;
            return (
              <li key={String(opt.value)}>
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  ref={isSelected ? selectedBtnRef : null}
                  onClick={() => handleSelect(opt)}
                  disabled={opt.disabled}
                  className={clsx(
                    baseOptionCls,
                    typeof optionClassName === 'function'
                      ? optionClassName(opt)
                      : optionClassName,
                    isSelected && selectedCls,
                    opt.disabled && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
