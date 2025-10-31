import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import GoogleIcon from '/src/icons/google.svg?react';
import UserPlusIcon from '/src/icons/user-plus-mini.svg?react';
import AvatarDisplay from '../../Common/AvatarDisplay';
import type { Photo } from '@/types/listing/space';

interface Props {
  lang?: SupportedLanguages;
  email: string;
  googleLogin: () => void;
  name?: string;
  profilePicture?: Photo;
  onUseOtherAccount: () => void;
  errorMessageGoogle?: string | null;
  isGoogleLoggedIn: boolean;
}

const GoogleLoginStep: React.FC<Props> = ({
  lang = 'es',
  email,
  googleLogin,
  name,
  profilePicture,
  onUseOtherAccount,
  errorMessageGoogle,
  isGoogleLoggedIn,
}) => {
  const t = getTranslation(lang);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-base-content mb-2 text-2xl font-semibold">
          {t.auth.continueGoogle}
        </h1>
        <p className="text-neutral text-sm">{email}</p>
        {name && <p className="text-neutral mt-2 text-sm">{name}</p>}
      </div>

      {/* Profile Picture */}
      {profilePicture && (
        <div className="flex justify-center">
          <AvatarDisplay
            profilePicture={profilePicture!}
            username={name!}
            size="h-16 w-16"
            sizeText="text-4xl"
          />
        </div>
      )}

      {/* Error Message */}
      {errorMessageGoogle && (
        <div className="alert alert-error">
          <span>{errorMessageGoogle}</span>
        </div>
      )}

      {/* Google Login Button */}
      <button
        onClick={googleLogin}
        disabled={isGoogleLoggedIn}
        className="btn btn-bg-200 h-[48px] w-full rounded-full"
      >
        <div className="flex items-center justify-center gap-x-2">
          <GoogleIcon />
          <span className="text-base-content">
            {isGoogleLoggedIn ? t.auth.loading : t.auth.continueGoogle}
          </span>
        </div>
      </button>

      {/* Divider */}
      <div className="divider text-neutral py-2 text-xs">{t.auth.maybe}</div>

      {/* Use Other Account */}
      <button
        type="button"
        onClick={onUseOtherAccount}
        className="btn btn-bg-200 h-[48px] w-full rounded-full"
      >
        <div className="flex items-center justify-center gap-x-2">
          <UserPlusIcon />
          <span className="text-base-content">{t.auth.createAccount}</span>
        </div>
      </button>
    </div>
  );
};

export default GoogleLoginStep;
