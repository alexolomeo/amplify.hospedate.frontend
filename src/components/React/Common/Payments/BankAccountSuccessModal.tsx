import AppButton from '@/components/React/Common/AppButton';
import { AppModal } from '../../Profile/components/AppModal';
import Verifield from '/src/icons/verified.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  lang?: SupportedLanguages;
  isOpen: boolean;
  onClose: () => void;
}

export default function BankAccountSuccessModal({
  isOpen,
  onClose,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  return (
    <AppModal
      id="bank-account-success"
      isOpen={isOpen}
      onClose={onClose}
      showHeader={false}
      maxWidth="max-w-[480px]"
      maxHeight="max-h-[80vh]"
      maxHeightBody="max-h-[70vh]"
      bgColor="bg-[#EAF3FF]"
    >
      <div className="flex flex-col items-center gap-6 py-10">
        <span className="grid h-12 w-12 place-items-center">
          <Verifield className="text-secondary h-12 w-12 rounded-full" />
        </span>

        <p className="text-base-content px-6 text-center text-lg font-semibold">
          {t.earnings.addedSuccess}
        </p>

        <AppButton
          label={t.hostContent.editListing.content.gallery.done}
          onClick={onClose}
          size="md"
          rounded
          fontSemibold
          className="mt-2"
        />
      </div>
    </AppModal>
  );
}
