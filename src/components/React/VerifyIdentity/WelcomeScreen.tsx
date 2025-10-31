import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '@/components/React/Common/AppButton';

interface WelcomeScreenProps {
  onContinue: () => void;
  lang?: SupportedLanguages;
}

function EmphasizePart({
  text,
  emphasize,
}: {
  text: string;
  emphasize: string;
}) {
  const i = text.indexOf(emphasize);
  if (i === -1) return <>{text}</>;
  const before = text.slice(0, i);
  const after = text.slice(i + emphasize.length);
  return (
    <>
      {before}
      <strong>{emphasize}</strong>
      {after}
    </>
  );
}

export default function WelcomeScreen({
  onContinue,
  lang = 'es',
}: WelcomeScreenProps) {
  const t = getTranslation(lang);
  return (
    <div className="relative flex min-h-full flex-col items-center bg-white px-6 py-4">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
        {/* Title */}
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {t.profile.idv.noticeTitle}
        </h2>

        {/* Image / Illustration */}
        <img
          src="/images/verify-identity/dni.webp"
          alt="DNI Verification"
          className="mb-4 h-auto w-32 sm:w-40"
        />

        {/* Description */}
        <div className="text-base-content max-w-md text-center leading-7">
          <EmphasizePart
            text={t.profile.idv.noticeMessage}
            emphasize={t.profile.idv.noticeRolesEmphasis}
          />
        </div>
      </div>

      <div className="pb-safe w-full max-w-sm flex-shrink-0 pt-4">
        <AppButton
          onClick={onContinue}
          label={t.profile.idv.startButton}
          className="w-full py-4 text-base sm:py-6 sm:text-lg"
        />
      </div>
    </div>
  );
}
