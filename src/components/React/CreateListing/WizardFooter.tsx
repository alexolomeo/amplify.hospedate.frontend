import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

interface WizardFooterProps {
  isValid: boolean;
  loading: boolean;
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  lang?: SupportedLanguages;
}

export default function WizardFooter({
  isValid,
  loading,
  currentStep,
  totalSteps,
  onPrev,
  onNext,
  lang = 'es',
}: WizardFooterProps) {
  const isLastStep = currentStep === totalSteps;
  const t = getTranslation(lang);

  return (
    <footer className="flex w-full flex-col items-start bg-[var(--color-base-100)]">
      <div className="flex w-full items-center justify-between px-4 py-6 md:px-[6%]">
        {currentStep > 0 && (
          <button
            className="text-primary flex h-8 cursor-pointer items-center justify-center gap-2 rounded-full bg-transparent px-3 text-sm leading-tight font-[var(--t-font-family-theme-primary)] underline md:h-10 md:px-5 md:text-base"
            onClick={onPrev}
          >
            {translate(t, 'createListing.wizardFooter.back')}
          </button>
        )}

        <button
          className="text-primary-content bg-primary disabled:bg-base-200 disabled:text-neutral-content mr-2 ml-auto flex h-14 min-w-[9rem] cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-base leading-tight font-[var(--t-font-family-theme-primary)] shadow-sm md:h-16 md:min-w-[10rem] md:px-6 md:text-lg"
          onClick={onNext}
          disabled={!isValid || loading}
        >
          {loading ? (
            <span className="loading loading-spinner loading-sm text-white" />
          ) : isLastStep ? (
            translate(t, 'createListing.wizardFooter.publish')
          ) : currentStep === 0 ? (
            translate(t, 'createListing.wizardFooter.start')
          ) : (
            translate(t, 'createListing.wizardFooter.next')
          )}
        </button>
      </div>
    </footer>
  );
}
