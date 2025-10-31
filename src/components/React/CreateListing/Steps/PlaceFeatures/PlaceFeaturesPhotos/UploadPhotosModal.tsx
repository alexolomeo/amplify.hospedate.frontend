import { useMemo, useRef, useState, useCallback } from 'react';
import Modal from '@/components/React/Common/Modal';
import { validateImage } from '@/utils/validateImage';
import EmptyUploadPhotos from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/EmptyUploadPhotos';
import PreviewUploadPhotos from '@/components/React/CreateListing/Steps/PlaceFeatures/PlaceFeaturesPhotos/PreviewUploadPhotos';
import type { FileWithValidation } from '@/types/createListing';
import CheckBadgeSolidIcon from '/src/icons/check-badge-solid.svg?react';
import InformationCircleIcon from '/src/icons/information-circle.svg?react';
import ExclamationTriangleIcon from '/src/icons/exclamation-triangle.svg?react';
import CheckCircleIcon from '/src/icons/check-circle.svg?react';
import { getUploadSubtitleMetaParams } from '@/components/React/Utils/create-listing/uploadSubtitle';

import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import AddIcon from '/src/icons/add.svg?react';

interface UploadPhotosModalProps {
  open: boolean;
  onClose: () => void;
  onUploadWithProgress: (
    files: File[],
    onProgressByIndex: (index: number, progress: number) => void
  ) => Promise<void>;
  lang?: SupportedLanguages;
}

export default function UploadPhotosModal({
  open,
  onClose,
  onUploadWithProgress,
  lang = 'es',
}: UploadPhotosModalProps) {
  const t = getTranslation(lang);
  const [selectedFiles, setSelectedFiles] = useState<FileWithValidation[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadResultModal, setUploadResultModal] = useState<
    'success' | 'partial' | 'error' | null
  >(null);
  const [successfulCount, setSuccessfulCount] = useState(0);
  const [failedFiles, setFailedFiles] = useState<string[]>([]);

  const validFiles = useMemo(
    () => selectedFiles.filter((f) => !f.error),
    [selectedFiles]
  );

  function resetUploadStateForValidFiles(
    files: FileWithValidation[]
  ): FileWithValidation[] {
    return files.map((file) => {
      if (!file.error && !file.isUploadSuccessful) {
        return {
          ...file,
          isUploading: false,
          isUploadComplete: false,
          isUploadSuccessful: false,
          progress: 0,
        };
      }
      return file;
    });
  }

  const handleUpload = async () => {
    setUploading(true);

    const updatedFiles = resetUploadStateForValidFiles([...selectedFiles]);

    setSelectedFiles(updatedFiles);

    const validSelectedFiles = updatedFiles.filter((f) => !f.error);
    const validIndexes = getValidIndexes(updatedFiles);

    await onUploadWithProgress(
      validSelectedFiles.map((f) => f.file),
      (index, percent) => {
        const realIndex = validIndexes[index];
        updatedFiles[realIndex] = updateUploadStateForFile(
          updatedFiles[realIndex],
          percent
        );
        setSelectedFiles([...updatedFiles]);

        const completed = updatedFiles.filter((f) => f.isUploadComplete).length;
        setProgress(Math.round((completed / validSelectedFiles.length) * 100));
      }
    );

    setUploading(false);

    const hasInvalidFiles = updatedFiles.some((f) => f.error);
    const remaining = updatedFiles.filter(
      (f) => f.error || !f.isUploadSuccessful
    );
    setSelectedFiles(remaining);

    const successfulCount = updatedFiles.filter(
      (f) => f.isUploadSuccessful
    ).length;
    setSuccessfulCount(successfulCount);

    const failed = updatedFiles
      .filter((f) => f.error || !f.isUploadSuccessful)
      .map((f) => f.file.name);

    setFailedFiles(failed);

    if (successfulCount === validSelectedFiles.length && !hasInvalidFiles) {
      setSuccessfulCount(successfulCount);
      setUploadResultModal('success');
      resetFilesState();
      onClose();
    } else if (successfulCount > 0) {
      setSuccessfulCount(successfulCount);
      setUploadResultModal('partial');
    } else {
      setSuccessfulCount(successfulCount);
      setUploadResultModal('error');
    }
  };

  const addFiles = useCallback(
    async (files: FileList | null) => {
      if (!files) return;
      const newEntries: FileWithValidation[] = await Promise.all(
        Array.from(files).map(async (file) => {
          const error = await validateImage(file, translate.bind(null, t));
          return {
            file,
            previewUrl: URL.createObjectURL(file),
            error,
            isUploading: false,
            isUploadComplete: false,
            isUploadSuccessful: false,
            progress: 0,
          };
        })
      );
      setSelectedFiles((prev) => [...prev, ...newEntries]);
      if (fileInputRef.current) fileInputRef.current.value = '';
    },
    [t]
  );

  const handleDeleteFile = useCallback((index: number) => {
    setSelectedFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const updateUploadStateForFile = (
    file: FileWithValidation,
    percent: number
  ): FileWithValidation => {
    const updated = { ...file };
    if (percent === -1) {
      updated.isUploading = false;
      updated.isUploadComplete = true;
      updated.isUploadSuccessful = false;
    } else {
      updated.isUploading = true;
      updated.progress = percent;
      if (percent === 100) {
        updated.isUploading = false;
        updated.isUploadComplete = true;
        updated.isUploadSuccessful = true;
      }
    }
    return updated;
  };

  const getValidIndexes = (files: FileWithValidation[]) => {
    const validIndexes: number[] = [];
    files.forEach((file, index) => {
      if (!file.error) {
        validIndexes.push(index);
      }
    });
    return validIndexes;
  };

  const resetFilesState = useCallback(() => {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onClose();
  }, [selectedFiles, onClose]);

  const subtitleText = useMemo(() => {
    const intro = translate(
      t,
      'createListing.wizardStepContent.uploadPhotosModal.subtitle_intro'
    );
    const meta = translate(
      t,
      'createListing.wizardStepContent.uploadPhotosModal.subtitle_meta',
      getUploadSubtitleMetaParams()
    );
    return `${intro}\n${meta}`;
  }, [t]);

  return (
    <div>
      <Modal
        open={open}
        closeDisabled={uploading}
        title={translate(
          t,
          'createListing.wizardStepContent.uploadPhotosModal.title'
        )}
        titleClass="text-center text-xl font-semibold leading-7 md:leading-8"
        subtitle={subtitleText}
        heightClass="max-h-[95vh]"
        contentClassName="flex-1 w-full overflow-y-auto px-5 py-2 md:px-8 md:py-4 flex-col gap-6"
        TitleSubtitleContentClass="mx-0 w-full md:max-w-none text-left items-start"
        subtitleClass="text-base-content text-[15px] md:text-base leading-6 md:leading-7 font-normal w-full whitespace-pre-line"
        footerPaddingClass="px-5 pt-3 pb-6 md:px-8 md:pt-4 md:pb-8"
        onClose={resetFilesState}
        footer={
          <button
            className={`flex h-12 w-full max-w-[280px] cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-4 text-sm text-white shadow-sm transition-opacity disabled:opacity-50 md:max-w-none md:px-6 md:text-base`}
            disabled={validFiles.length < 1 || uploading}
            onClick={handleUpload}
          >
            {translate(
              t,
              'createListing.wizardStepContent.uploadPhotosModal.uploadButton',
              {
                count: validFiles.length,
              }
            )}
          </button>
        }
        topRightAction={
          <button
            type="button"
            className="btn btn-sm btn-ghost p-2 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={uploading}
            onClick={() => !uploading && fileInputRef.current?.click()}
            aria-disabled={uploading}
            aria-label={translate(
              t,
              'createListing.wizardStepContent.uploadPhotosModal.actions.add'
            )}
          >
            <AddIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        }
        lang={lang}
      >
        {selectedFiles.length === 0 ? (
          <EmptyUploadPhotos onDropFiles={addFiles} lang={lang} />
        ) : (
          <PreviewUploadPhotos
            files={selectedFiles}
            onDropFiles={addFiles}
            onDeleteFile={handleDeleteFile}
            lang={lang}
            uploading={uploading}
          />
        )}

        <input
          id="hidden-file-input"
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => addFiles(e.target.files)}
        />

        {uploading && (
          <div className="order-last w-full">
            <progress
              className="progress progress-primary w-full"
              value={progress}
              max={100}
            />
          </div>
        )}
      </Modal>
      {uploadResultModal === 'success' && (
        <Modal
          open={true}
          centerContent
          showCancelButton={false}
          widthClass="md:max-w-[300px]"
          heightClass="md:max-h-[300px]"
          onClose={() => setUploadResultModal(null)}
          footer={
            <button
              onClick={() => setUploadResultModal(null)}
              className="w-full cursor-pointer rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white shadow-sm"
            >
              {translate(
                t,
                'createListing.wizardStepContent.uploadPhotosModal.okButton'
              )}
            </button>
          }
          lang={lang}
        >
          <div className="flex flex-col items-center gap-2">
            <CheckBadgeSolidIcon className="h-10 w-10 text-[var(--color-success)]" />
            <p className="text-center font-medium">
              {translate(
                t,
                `createListing.wizardStepContent.uploadPhotosModal.successMessage_${
                  successfulCount === 1 ? 'one' : 'other'
                }`,
                { count: successfulCount }
              )}
            </p>
          </div>
        </Modal>
      )}

      {uploadResultModal === 'partial' && (
        <Modal
          open={true}
          centerContent
          showCancelButton={false}
          widthClass="md:max-w-[400px]"
          heightClass="md:max-h-[400px]"
          onClose={() => setUploadResultModal(null)}
          footer={
            <button
              onClick={() => setUploadResultModal(null)}
              className="w-full cursor-pointer px-4 py-3 text-sm font-medium text-white shadow-sm"
              style={{
                borderRadius: '1000px',
                background: 'color(display-p3 0.2118 0.4549 0.8078)',
                boxShadow: '0px 1px 2px 0px color(display-p3 0 0 0 / 0.05)',
              }}
            >
              {translate(
                t,
                'createListing.wizardStepContent.uploadPhotosModal.failedButton'
              )}
            </button>
          }
          lang={lang}
        >
          <div className="flex w-full flex-col items-center gap-4">
            {/* icon */}
            <InformationCircleIcon className="h-10 w-10 text-[var(--color-info-bg)]" />

            {/* text */}
            <p className="text-center text-sm font-medium">
              {translate(
                t,
                'createListing.wizardStepContent.uploadPhotosModal.uploadResultExplanation'
              )}
            </p>

            {/* left content */}
            <div className="flex w-full flex-col gap-3 text-left">
              {/* success */}
              <div className="flex items-start gap-2">
                <CheckCircleIcon
                  className="h-6 min-h-6 w-6 min-w-6 text-[var(--color-success)]"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium">
                  {translate(
                    t,
                    `createListing.wizardStepContent.uploadPhotosModal.uploadResultMessage_partial_${
                      successfulCount === 1 ? 'one' : 'other'
                    }`,
                    { count: successfulCount }
                  )}
                </p>
              </div>

              {/* errors */}
              {failedFiles.length > 0 && (
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-start gap-2">
                    <ExclamationTriangleIcon
                      className="h-6 min-h-6 w-6 min-w-6 text-[var(--color-warning)]"
                      aria-hidden="true"
                    />
                    <p className="text-sm font-medium">
                      {translate(
                        t,
                        `createListing.wizardStepContent.uploadPhotosModal.uploadResultMessage_partialFailed_${
                          failedFiles.length === 1 ? 'one' : 'other'
                        }`,
                        { count: failedFiles.length }
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {uploadResultModal === 'error' && (
        <Modal
          open={true}
          centerContent
          showCancelButton={false}
          widthClass="md:max-w-[320px]"
          heightClass="md:max-h-[300px]"
          onClose={() => setUploadResultModal(null)}
          footer={
            <button
              onClick={() => setUploadResultModal(null)}
              className="w-full cursor-pointer rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white shadow-sm"
            >
              {translate(
                t,
                'createListing.wizardStepContent.uploadPhotosModal.failedButton'
              )}
            </button>
          }
          lang={lang}
        >
          <div className="flex flex-col items-center gap-2">
            <ExclamationTriangleIcon className="h-10 w-10 text-[var(--color-warning)]" />
            <p className="text-center font-medium">
              {translate(
                t,
                `createListing.wizardStepContent.uploadPhotosModal.uploadResultMessage_error_${
                  failedFiles.length === 1 ? 'one' : 'other'
                }`,
                { count: failedFiles.length }
              )}
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
