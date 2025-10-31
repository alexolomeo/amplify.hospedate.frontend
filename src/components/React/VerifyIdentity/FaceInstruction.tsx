import React from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '@/components/React/Common/AppButton';

interface MobileFaceInstructionProps {
  onContinue: () => void;
  lang?: SupportedLanguages;
}

export default function FaceInstruction({
  onContinue,
  lang = 'es',
}: MobileFaceInstructionProps) {
  // Get translations
  const t = getTranslation(lang);

  return (
    <div className="bg-base-200 relative flex min-h-full flex-col items-center px-6 py-4">
      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center py-4 text-center">
        {/* Title */}
        <h2 className="text-primary mb-4 text-lg font-semibold">
          {t.profile.idv.faceInstructionTitle}
        </h2>

        {/* Image / Illustration */}
        <img
          src="/images/verify-identity/face-instructions.gif"
          alt="Face Instructions"
          className="mb-4 max-h-48 w-auto max-w-full object-contain sm:max-h-64"
        />
      </div>

      <div className="bg-primary-content mb-4 w-full max-w-sm rounded-3xl px-4 py-3">
        <div className="text-left">
          <p className="text-neutral mb-2 text-center text-base">
            {t.profile.idv.instructionsTitle}
          </p>
          <p className="pb-2 text-sm">{t.profile.idv.faceInstruction1}</p>
          <p className="pb-2 text-sm">{t.profile.idv.faceInstruction2}</p>
          <p className="text-sm">{t.profile.idv.faceInstructionTip}</p>
        </div>
      </div>

      <div className="pb-safe w-full max-w-sm flex-shrink-0 pt-2">
        <AppButton
          onClick={onContinue}
          label={t.profile.idv.next}
          className="w-full py-4 text-base sm:py-6 sm:text-lg"
        />
      </div>
    </div>
  );
}
