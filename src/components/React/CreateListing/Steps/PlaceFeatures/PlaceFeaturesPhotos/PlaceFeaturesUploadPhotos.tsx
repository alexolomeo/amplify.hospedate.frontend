import { useState } from 'react';
import UploadPhotosModal from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/UploadPhotosModal';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import PlusMiniIcon from '/src/icons/plus-mini.svg?react';

interface PlaceFeaturesUploadPhotosProps {
  onUploadWithProgress: (
    files: File[],
    onProgressByIndex: (index: number, progress: number) => void
  ) => Promise<void>;
  lang?: SupportedLanguages;
}

export default function PlaceFeaturesUploadPhotos({
  onUploadWithProgress,
  lang = 'es',
}: PlaceFeaturesUploadPhotosProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = getTranslation(lang);

  return (
    <section className="bg-[var(--color-base-100)] px-4 py-6 sm:px-6 md:px-16 md:py-0 lg:px-24 xl:px-32 2xl:px-60">
      <div className="mx-auto flex max-w-[800px] flex-col items-start justify-center gap-5 md:gap-10">
        {/* title and description */}
        <div className="flex w-full flex-col items-start space-y-4">
          <h2
            className="w-full text-[30px] leading-9 text-[var(--color-base-content)]"
            dangerouslySetInnerHTML={{
              __html: translate(
                t,
                'createListing.wizardStepContent.placeFeaturesUploadPhotos.title'
              ),
            }}
          />
          <p className="w-full text-base leading-6 font-normal text-[var(--color-neutral)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeFeaturesUploadPhotos.description'
            )}
          </p>
        </div>

        {/* open modal button */}
        <div className="flex w-full items-center justify-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-[245px] w-full flex-col items-center justify-center gap-4 rounded-[40px] bg-[var(--color-base-150)] px-10"
          >
            {/* image */}
            <div
              className="h-[111px] w-[107px] bg-[url('/images/create-listing/place-features/open-upload-photos.webp')] bg-contain bg-center bg-no-repeat"
              role="presentation"
            />

            {/* customized button */}
            <div className="flex h-8 cursor-pointer items-center justify-center gap-2 rounded-full border border-[var(--color-secondary)] px-3 shadow-sm">
              <span className="text-sm leading-[14px] font-semibold text-[var(--color-secondary)]">
                {translate(
                  t,
                  'createListing.wizardStepContent.placeFeaturesUploadPhotos.addPhotosButton'
                )}
              </span>
              <PlusMiniIcon
                className="h-[14px] w-[14px] text-[var(--color-secondary)]"
                aria-hidden="true"
              />
            </div>
          </button>
        </div>

        {/* open modal button */}
        <UploadPhotosModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUploadWithProgress={onUploadWithProgress}
          lang={lang}
        />
      </div>
    </section>
  );
}
