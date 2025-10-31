import type { FileWithValidation } from '@/types/createListing';
import TrashOutline from '/src/icons/trash-outline.svg?react';
import OptimizedImage from '@/components/React/Common/OptimizedImage';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';

interface Props {
  files: FileWithValidation[];
  onDropFiles: (files: FileList | null) => void;
  onDeleteFile: (index: number) => void;
  lang?: SupportedLanguages;
  uploading?: boolean;
}

export default function PreviewUploadPhotos({
  files,
  onDeleteFile,
  onDropFiles,
  lang = 'es',
  uploading = false,
}: Props) {
  const t = getTranslation(lang);
  return (
    <div
      className="flex w-full flex-col rounded-lg"
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDropFiles(e.dataTransfer?.files);
      }}
    >
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-6">
        {files.map((entry, index) => (
          <div
            key={index}
            className="relative mx-auto aspect-square w-full max-w-[360px] overflow-hidden rounded-[40px]"
          >
            {/* delete button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                if (!uploading) onDeleteFile(index);
              }}
              disabled={uploading}
              aria-disabled={uploading}
              className={[
                'absolute top-4 right-4 z-10 inline-flex h-6 w-6 items-center justify-center rounded-[16px] px-2 shadow-sm',
                uploading
                  ? 'cursor-not-allowed bg-[var(--color-base-200)] opacity-50'
                  : 'cursor-pointer bg-[var(--color-base-200)]',
              ].join(' ')}
              aria-label={translate(
                t,
                'createListing.wizardStepContent.uploadPhotosModal.actions.delete'
              )}
              title={
                uploading
                  ? translate(
                      t,
                      'createListing.wizardStepContent.uploadPhotosModal.actions.disabledWhileUploading'
                    )
                  : translate(
                      t,
                      'createListing.wizardStepContent.uploadPhotosModal.actions.delete'
                    )
              }
            >
              <TrashOutline
                className="h-[14px] w-[14px] flex-shrink-0"
                aria-hidden="true"
              />
            </button>

            {/* image */}
            <OptimizedImage
              src={entry.previewUrl}
              alt={
                entry.file?.name
                  ? `preview-${entry.file.name}`
                  : `preview-${index}`
              }
              draggable={false}
              className="h-full w-full object-cover object-center"
            />

            {/* Overlay */}
            {entry.isUploading && !entry.error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 p-2">
                <span className="loading loading-spinner text-white" />
                <progress
                  className="progress progress-primary mt-2 w-[80%]"
                  value={entry.progress}
                  max={100}
                />
              </div>
            )}

            {/* error message */}
            {(entry.error ||
              (entry.isUploadComplete && !entry.isUploadSuccessful)) && (
              <div className="absolute bottom-4 left-1/2 w-[90%] max-w-[211px] -translate-x-1/2 rounded-[16px] border border-[var(--d-color-status-error-bg,#FF000E)] bg-[var(--d-color-status-error-content,#FFF0F1)] px-4 py-2 text-sm leading-5 text-[var(--d-color-status-error-bg,#FF000E)] shadow">
                {entry.error ||
                  translate(
                    t,
                    'createListing.wizardStepContent.uploadPhotosModal.validation.uploadFailed'
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
