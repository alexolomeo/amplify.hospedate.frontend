import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import ChevronDownIcon from '/src/icons/chevron-down.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  buttonHeight?: string;
  labelFontSize?: string;
  lang?: SupportedLanguages;
  disabled?: boolean;
}

export default function Dropdown(props: DropdownProps) {
  const {
    options,
    value,
    onChange,
    className,
    buttonClassName,
    dropdownClassName,
    buttonHeight = 'h-8',
    labelFontSize = 'text-base',
    lang = 'es',
    disabled = false,
  } = props;

  const t = getTranslation(lang);
  const placeholder =
    props.placeholder ??
    t.hostContent.editListing.commonComponents.dropdown.placeholder;

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: string) => {
    onChange(option);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (disabled && open) setOpen(false);
  }, [disabled, open]);

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((v) => !v);
  };

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
          {value || placeholder}
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
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                onClick={() => handleSelect(option)}
                className="text-base-content hover:bg-base-200 w-full px-4 py-2 text-center text-sm transition-colors hover:rounded-full"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
