import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../Common/AppButton';
import IsotipoIcon from '/src/icons/isotipo.svg?react';
import { AppModal } from '../Common/AppModal';

interface Props {
  isOpen: boolean;
  onClose?: () => void;
  lang?: SupportedLanguages;
}
const ModalConfirmationRegister: React.FC<Props> = ({
  lang = 'es',
  isOpen,
  onClose,
}) => {
  const t = getTranslation(lang);
  return (
    <AppModal
      id="modal-confirmation-register"
      showHeader={true}
      title={t.auth.welcomeTitle}
      maxWidth={'max-w-md'}
      bgColor={'bg-primary-content'}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-8 pt-4">
        <div className="flex flex-col items-center justify-center gap-y-6">
          <div className="relative">
            <img
              src="/images/success-login.webp"
              alt="step2"
              className="h-28 w-40 object-cover"
            />
            <IsotipoIcon className="absolute top-1/2 left-1/2 h-15 w-18 -translate-x-1/2 -translate-y-1/2"></IsotipoIcon>
          </div>
          <div className="space-y-2 text-center">
            <p className="font-bold">{t.auth.welcomeHeadline} </p>
            <p className="text-neutral text-sm">{t.auth.welcomeSubtitle}</p>
          </div>
        </div>
        <form method="dialog" className="py-1">
          <AppButton label={t.auth.continue} className="h-[48px] w-full" />
        </form>
      </div>
    </AppModal>
  );
};
export default ModalConfirmationRegister;
