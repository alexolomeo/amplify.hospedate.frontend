import { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { formatBOB } from '@/utils/formatPrice';
import { useDebounce } from '@/components/React/Hooks/useDebounce';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

interface Props {
  value?: number;
  onUpdate: (price: number) => void;
  lang?: SupportedLanguages;
}

const parseBOB = (formatted: string): number => {
  return parseFloat(formatted.replace(/\./g, '')) || 0;
};

export default function PlaceSetupPricing({
  value = 0,
  onUpdate,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [inputValue, setInputValue] = useState<string>(formatBOB(value));
  const [error, setError] = useState<string>('');

  const isUserTyping = useRef(false);

  const debouncedInputValue = useDebounce(inputValue, 500);

  useEffect(() => {
    if (!isUserTyping.current) {
      setInputValue(formatBOB(value));
    }
  }, [value]);

  useEffect(() => {
    const numeric = parseBOB(debouncedInputValue);

    if (isUserTyping.current) {
      if (numeric < 50 || numeric > 10000) {
        setError(
          translate(
            t,
            'createListing.wizardStepContent.placeSetupPricing.error'
          )
        );
        onUpdate(numeric);
      } else {
        setError('');
        onUpdate(numeric);
        isUserTyping.current = false;
      }
    }
  }, [debouncedInputValue, onUpdate, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTyping.current = true;
    setInputValue(e.target.value);
  };

  const handleBlur = () => {
    const num = parseBOB(inputValue);
    if (!isNaN(num)) {
      setInputValue(formatBOB(num));
    }
  };

  const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const allowed = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'];
    const isNumber = /^[0-9]$/.test(e.key);
    if (!isNumber && !allowed.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <section className="bg-[var(--color-base-100)] px-4 py-6 pt-15 sm:px-6 md:px-16 md:py-0 md:pt-8 lg:px-24 xl:px-32 2xl:px-60">
      <div className="mx-auto flex max-w-[800px] flex-col items-start justify-center gap-5 md:gap-15">
        <div className="flex w-full flex-col items-start space-y-4">
          <h2 className="w-full text-[30px] leading-9 font-bold text-[var(--color-base-content)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeSetupPricing.title'
            )}
          </h2>
          <p className="w-full text-base leading-6 font-normal text-[var(--color-neutral)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeSetupPricing.description'
            )}
          </p>
        </div>

        <div className="flex w-full justify-center">
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-baseline gap-4">
              <span className="text-5xl font-bold text-[var(--color-base-content)] sm:text-6xl md:text-7xl lg:text-8xl">
                {translate(
                  t,
                  'createListing.wizardStepContent.placeSetupPricing.currencyLabel'
                )}
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder={translate(
                  t,
                  'createListing.wizardStepContent.placeSetupPricing.pricePlaceholder'
                )}
                onKeyDown={allowOnlyNumbers}
                className={clsx(
                  'w-full max-w-[8ch] bg-transparent text-center text-5xl font-bold text-[var(--color-base-content)] focus:outline-none sm:text-6xl md:text-7xl lg:text-8xl',
                  error && 'border-b-2 border-red-500'
                )}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            {error && (
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
