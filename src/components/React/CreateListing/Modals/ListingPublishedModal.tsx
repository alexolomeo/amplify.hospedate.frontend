import XMarkMini from '/src/icons/x-mark-mini.svg?react';
import AppButton from '@/components/React/Common/AppButton';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  data: {
    photoUrl: string;
  };
  onClose: (result: 'close' | 'verify' | 'viewSpaces') => void;
  lang?: SupportedLanguages;
}

export default function ListingPublishedModal({
  data,
  onClose,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  return (
    <div className="bg-base-100 flex w-full max-w-xs flex-col items-start gap-8 rounded-[40px] p-6 sm:w-[325px]">
      <div className="flex w-full items-start justify-between gap-6">
        <h2 className="text-base-content text-xl leading-7 font-semibold">
          {t.createListing.modal.published.welcome}
        </h2>
        <button
          onClick={() => onClose('close')}
          className="hover:bg-base-200 flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px] transition"
        >
          <XMarkMini className="text-base-content h-5 w-5" />
        </button>
      </div>

      <div className="flex w-full flex-col items-center gap-6">
        <div
          className="h-[173px] w-full rounded-[30.4px] bg-cover bg-center"
          style={{ backgroundImage: `url(${data.photoUrl})` }}
        ></div>

        <div className="flex w-full flex-col items-start gap-2">
          <p className="text-base-content w-full text-center text-base leading-6 font-bold">
            {t.createListing.modal.published.subtitle}
          </p>
          <p className="text-neutral w-full text-center text-sm leading-5 font-normal">
            {t.createListing.modal.published.verificationMessage}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-2">
        <AppButton
          label={t.createListing.modal.published.verifyButton}
          onClick={() => onClose('verify')}
          variant="default"
          size="sm"
          rounded
          fontSemibold
          className="h-12 w-full shadow-sm"
        />

        <AppButton
          label={t.createListing.modal.published.viewSpacesButton}
          onClick={() => onClose('viewSpaces')}
          variant="link"
          size="sm"
          className="w-full justify-center"
        />
      </div>
    </div>
  );
}
