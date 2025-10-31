import { AppModal } from '../../Profile/components/AppModal';
import AlertIcon from '/src/icons/exclamation-triangle.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
  isOpen: boolean;
  onClose: () => void;
  deleteBankAccount: () => Promise<void>;
  isDeleting?: boolean;
}

export default function DeleteBankAccountModal({
  isOpen,
  onClose,
  lang = 'es',
  deleteBankAccount,
  isDeleting = false,
}: Props) {
  const t = getTranslation(lang);
  return (
    <AppModal
      id="delete-account"
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      maxWidth="max-w-[480px]"
      maxHeight="max-h-[80vh]"
      maxHeightBody="max-h-[70vh]"
      bgColor="bg-error-content"
    >
      <div className="flex flex-col items-center gap-6 pt-10">
        <div className="text-xl leading-7 font-semibold">
          {t.earnings.deleteAccountTitle}
        </div>
        <AlertIcon className="text-error h-10 w-10" />
        <p className="px-6 text-center text-sm leading-6">
          {t.earnings.deleteAccountDescription}
        </p>
        <div className="flex w-full justify-between px-6">
          <button
            className="text-error text-md cursor-pointer pt-4 text-left underline"
            onClick={() => deleteBankAccount()}
            disabled={isDeleting}
          >
            {isDeleting ? t.common.deleting : t.earnings.delete}
          </button>
          <button
            className="btn btn-primary rounded-full"
            onClick={onClose}
            disabled={isDeleting}
          >
            {t.earnings.cancel}
          </button>
        </div>
      </div>
    </AppModal>
  );
}
