import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/components/React/Hooks/useDebounce';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

interface Props {
  value?: string;
  onUpdate: (newTitle: string) => void;
  lang?: SupportedLanguages;
}

const MAX_CHARS = 50;

export default function PlaceFeaturesTitle({
  value = '',
  onUpdate,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [title, setTitle] = useState(value);

  useEffect(() => {
    setTitle(value);
  }, [value]);

  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    if (debouncedTitle !== value) {
      onUpdate(debouncedTitle);
    }
  }, [debouncedTitle, value, onUpdate]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= MAX_CHARS) {
        setTitle(newValue);
      }
    },
    []
  );

  return (
    <section className="flex flex-col items-start justify-center gap-5 bg-[var(--color-base-100)] px-4 py-6 sm:px-6 md:gap-10 md:px-16 md:py-0 lg:px-24 xl:px-32 2xl:px-60">
      {/* Title and description */}
      <div className="flex w-full flex-col items-start gap-2">
        <h2 className="text-[30px] leading-9 font-bold text-[var(--color-base-content)]">
          {translate(
            t,
            'createListing.wizardStepContent.placeFeaturesTitle.title'
          )}
        </h2>
        <p className="text-base leading-6 font-normal text-[var(--color-neutral)]">
          {translate(
            t,
            'createListing.wizardStepContent.placeFeaturesTitle.description'
          )}
        </p>
      </div>

      {/* Textarea */}
      <div className="flex w-full flex-col items-start">
        <textarea
          className="focus:ring-primary flex min-h-[100px] w-full items-center rounded-[16px] border border-[var(--color-neutral)] bg-white px-6 py-4 text-base leading-6 font-normal text-[var(--color-base-content)] placeholder:text-[var(--color-placeholder)] focus:ring-2 focus:outline-none md:text-lg"
          placeholder={translate(
            t,
            'createListing.wizardStepContent.placeFeaturesTitle.placeholder'
          )}
          value={title}
          onChange={handleChange}
          maxLength={MAX_CHARS}
        />

        <p className="mt-2 text-sm text-[var(--color-neutral)]">
          {translate(
            t,
            'createListing.wizardStepContent.placeFeaturesTitle.characterCount',
            {
              count: title.length,
              max: MAX_CHARS,
            }
          )}
        </p>
      </div>
    </section>
  );
}
