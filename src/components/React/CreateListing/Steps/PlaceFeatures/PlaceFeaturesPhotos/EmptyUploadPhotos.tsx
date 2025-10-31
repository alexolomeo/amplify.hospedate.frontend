import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import PlusMiniIcon from '/src/icons/plus-mini.svg?react';

interface Props {
  onDropFiles: (files: FileList | null) => void;
  lang?: SupportedLanguages;
}

export default function EmptyUploadPhotos({ onDropFiles, lang = 'es' }: Props) {
  const t = getTranslation(lang);

  return (
    <div className="flex w-full items-center justify-center">
      <label
        htmlFor="hidden-file-input"
        className="bg-base-150 hover:bg-base-200 flex h-[245px] w-full max-w-xl cursor-pointer flex-col items-center justify-center gap-4 rounded-[40px] border-2 border-dashed border-[var(--color-base-300)] p-6 transition-colors duration-150 md:p-10"
        onDragEnter={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onDropFiles(e.dataTransfer?.files);
        }}
      >
        {/* image*/}
        <div
          className="h-[111px] w-[107px] flex-shrink-0 bg-[url('/images/create-listing/place-features/open-upload-photos.webp')] bg-contain bg-center bg-no-repeat"
          role="presentation"
        />

        {/* customized button */}
        <div className="flex h-12 w-[217px] items-center justify-center gap-2 rounded-full border border-[var(--color-secondary)] px-4 shadow-sm">
          <span className="text-sm leading-[14px] font-semibold text-[var(--color-secondary)]">
            {translate(
              t,
              'createListing.wizardStepContent.placeFeaturesUploadPhotos.addPhotosButton'
            )}
          </span>
          <PlusMiniIcon
            className="h-4 w-4 text-[var(--color-secondary)]"
            aria-hidden="true"
          />
        </div>
      </label>
    </div>
  );
}
