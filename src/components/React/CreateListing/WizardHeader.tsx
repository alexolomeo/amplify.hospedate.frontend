import { useCallback } from 'react';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import IsotipoIcon from '/src/icons/isotipo.svg?react';
import LogotipoIcon from '/src/icons/logotipo.svg?react';

interface Props {
  lang: SupportedLanguages;
  currentStep: number;
  loading: boolean;
  onSaveAndExit: () => Promise<void>;
  invalidSaveAttempt: boolean;
}

export default function WizardHeader({
  lang,
  currentStep,
  loading,
  onSaveAndExit,
}: Props) {
  const t = getTranslation(lang);
  const isFirstStep = currentStep === 0;
  const label = isFirstStep
    ? translate(t, 'createListing.wizardHeader.quit')
    : translate(t, 'createListing.wizardHeader.save');

  const handleClick = useCallback(() => {
    if (!loading) {
      onSaveAndExit();
    }
  }, [loading, onSaveAndExit]);

  return (
    <header className="sticky top-0 z-50 w-full bg-[var(--color-base-100)]">
      <div className="flex items-center justify-between px-4 py-5 md:px-[120px]">
        <div className="flex items-center gap-2">
          <div className="isotipo-only lg:block">
            <IsotipoIcon className="h-9 w-12" />
          </div>
          <div className="logo-condensed hidden lg:block">
            <LogotipoIcon className="h-7 w-24" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClick}
            disabled={loading}
            className="flex h-8 cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-secondary)] bg-transparent px-3 text-sm leading-4 font-semibold text-[var(--color-neutral)] shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              label
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
