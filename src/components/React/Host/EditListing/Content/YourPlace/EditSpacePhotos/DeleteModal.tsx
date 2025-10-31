import Modal from '@/components/React/Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import XMarkMini from '/src/icons/x-mark-mini.svg?react';

interface UploadPhotosModalProps {
  open: boolean;
  onClose: () => void;
  lang?: SupportedLanguages;
  handleDelete: () => void;
  title: string;
  description: string;
}
export default function DeleteModal({
  open,
  onClose,
  lang = 'es',
  title,
  description,
  handleDelete,
}: UploadPhotosModalProps) {
  const t = getTranslation(lang);
  return (
    <Modal
      open={open}
      title={title}
      backgroundColorClass="bg-error-content"
      titleTextColorClass="text-error"
      onClose={() => onClose()}
      footer={
        <button
          onClick={() => handleDelete()}
          className="btn btn-error w-full rounded-full text-sm font-medium"
        >
          {t.hostContent.editListing.content.gallery.confirmDelete}
        </button>
      }
      TitleSubtitleContentClass={'flex-col items-start mt-2'}
      topLeftButton={false}
      topRightAction={
        <button
          onClick={onClose}
          className="mt-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px]"
        >
          <XMarkMini className="h-5 w-5 flex-shrink-0" />
        </button>
      }
      lang={lang}
    >
      <div className="text-neutral text-start font-normal">{description}</div>
    </Modal>
  );
}
