import { useCreateListing } from '@/components/React/Hooks/useCreateListing';
import WizardHeader from '@/components/React/CreateListing/WizardHeader';
import WizardStepContent from '@/components/React/CreateListing/WizardStepContent';
import WizardFooter from '@/components/React/CreateListing/WizardFooter';
import WizardProgressBar from '@/components/React/CreateListing/WizardProgressBar';
import type { SupportedLanguages } from '@/utils/i18n';

interface Props {
  listingId?: string;
  lang: SupportedLanguages;
  stepSlug?: string;
}

export default function CreateListingWizard({
  listingId,
  lang,
  stepSlug,
}: Props) {
  const wizard = useCreateListing(listingId, stepSlug, lang);

  return (
    <div>
      <WizardHeader
        lang={lang}
        currentStep={wizard.currentStep}
        loading={wizard.loading}
        onSaveAndExit={wizard.handleSaveAndExit}
        invalidSaveAttempt={wizard.invalidSaveAttempt}
      />
      <div className="min-h-content-area flex flex-col bg-[var(--color-base-100)]">
        <main className="xl:20 2xl:25 bg-[var(--color-base-100)] md:mx-[120px] md:mt-5 lg:mt-6">
          <WizardStepContent
            initialListingIdLoading={wizard.initialListingIdLoading}
            currentStep={wizard.currentStep}
            listingData={wizard.listingData}
            updateData={wizard.updateData}
            creationOptions={wizard.creationOptions}
            onDeletePhoto={wizard.deletePhoto}
            onReorderPhotos={wizard.reorderPhotos}
            onUpdateCaption={wizard.updatePhotoCaption}
            onUploadWithProgress={wizard.uploadPhotosWithProgress}
            lang={lang}
          />
        </main>
      </div>
      <div className="sticky bottom-0 z-10 w-full">
        <WizardProgressBar currentStep={wizard.currentStep} />
        <WizardFooter
          isValid={wizard.isValid}
          loading={wizard.loading}
          currentStep={wizard.currentStep}
          totalSteps={wizard.totalSteps}
          onPrev={wizard.goToPrevStep}
          onNext={wizard.handleStepSubmit}
          lang={lang}
        />
      </div>
    </div>
  );
}
