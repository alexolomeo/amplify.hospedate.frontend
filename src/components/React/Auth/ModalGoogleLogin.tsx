import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import AppButton from '../Common/AppButton';
import type { Photo } from '@/types/listing/space';
import GoogleIcon from '/src/icons/google.svg?react';
import AvatarDisplay from '../Common/AvatarDisplay';
import { AppModal } from '../Common/AppModal';

interface Props {
  lang?: SupportedLanguages;
  email: string;
  name?: string;
  profilePicture?: Photo;
  errorMessageGoogle?: string | null;
  googleLogin: () => void;
  onUseOtherAccount: () => void;
  isGoogleLoggedIn: boolean;
  onClose?: () => void;
  isOpen: boolean;
}
const ModalGoogleLogin: React.FC<Props> = ({
  lang = 'es',
  email,
  name,
  profilePicture,
  errorMessageGoogle,
  googleLogin,
  onUseOtherAccount,
  isGoogleLoggedIn,
  onClose,
  isOpen,
}) => {
  const t = getTranslation(lang);
  function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    if (!local || !domain) return email;
    if (local.length === 1) {
      return `${local}•••@${domain}`;
    }
    if (local.length <= 4) {
      const first = local[0];
      const last = local.slice(-1);
      return `${first}•••${last}@${domain}`;
    }
    const firstTwo = local.slice(0, 2);
    const lastTwo = local.slice(-2);
    const masked = '•'.repeat(local.length - 4);
    return `${firstTwo}${masked}${lastTwo}@${domain}`;
  }

  return (
    <AppModal
      id="modal-google-login"
      showHeader={true}
      titleSize="text-lg"
      title={t.auth.google.title}
      maxWidth={'max-w-md'}
      bgColor={'bg-primary-content'}
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-center">
            <AvatarDisplay
              profilePicture={profilePicture!}
              username={name!}
              size="h-24 w-24"
              sizeText="text-4xl"
            />
          </div>
          <div className="text-center">
            {name && <p className="text-sm">{name}</p>}
            <p className="text-lg leading-tight font-semibold">
              {maskEmail(email)}
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {errorMessageGoogle && (
            <div className="alert alert-error mt-4">
              <span>{errorMessageGoogle}</span>
            </div>
          )}
          <button
            className="btn btn-bg-200 h-[48px] w-full rounded-full"
            onClick={googleLogin}
            data-testid="test-button-google-login"
            disabled={isGoogleLoggedIn}
          >
            <div className="flex items-center justify-center gap-x-2">
              <GoogleIcon />
              <span className="text-base-content">{t.auth.continueGoogle}</span>
            </div>
          </button>
          <AppButton
            label={t.auth.google.useOtherAccount}
            className="btn-ghost h-[48px] w-full"
            outline={false}
            onClick={onUseOtherAccount}
            data-testid="test-button-other-count"
            size="md"
          />
        </div>
      </div>
    </AppModal>
  );
};
export default ModalGoogleLogin;
