import React, { useMemo, useState, useCallback } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import VectorIcon from '/src/icons/vector.svg?react';
import ShowVerifyIdentityModal from '@/components/React/VerifyIdentity/ShowVerifyIdentityModal';

type Props = {
  lang?: SupportedLanguages;
  description?: string | null;
  identityVerified?: boolean;
  onVerifyAccount?: () => void;
};

export default function RequestedChanges({
  lang = 'es',
  description,
  identityVerified,
  onVerifyAccount,
}: Props) {
  const t = getTranslation(lang);
  const L = t.hostContent.editListing.content.changesRequested;

  const [showIdvModal, setShowIdvModal] = useState(false);
  const openIdv = useCallback(() => {
    if (onVerifyAccount) onVerifyAccount();
    setShowIdvModal(true);
  }, [onVerifyAccount]);
  const closeIdv = useCallback(() => setShowIdvModal(false), []);

  const hasChanges = Boolean(description && description.trim().length > 0);
  const needIdentity = identityVerified === false;

  const lines = useMemo(() => {
    if (!hasChanges || !description) return null;
    const parts = description
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length > 1 ? parts : null;
  }, [hasChanges, description]);

  return (
    <>
      {/* Verify Identity Modal */}
      <ShowVerifyIdentityModal
        isOpen={showIdvModal}
        onClose={closeIdv}
        onFinished={undefined}
        initialStep="notice"
        lang={lang}
      />

      <section className="flex flex-col gap-6 py-2">
        {/* Título */}
        <h2 className="text-lg leading-7 font-bold text-[var(--color-base-content)]">
          {L.title}
        </h2>

        {/* Step: Verify Identity */}
        {needIdentity && (
          <section
            className="flex items-center gap-3 rounded-xl bg-[var(--color-base-200)] p-2 md:gap-4 md:p-3"
            role="note"
            aria-label={L.verificationRequired}
          >
            <div className="flex flex-col justify-center self-stretch pt-[2px]">
              <div className="h-6 w-6">
                <VectorIcon
                  className="h-[19.5px] w-[19.5px] shrink-0"
                  style={{ fill: 'var(--color-base-content)' }}
                  aria-hidden="true"
                  focusable="false"
                />
              </div>
            </div>

            <div className="flex-1">
              <p
                className="mt-1 text-sm leading-5 text-[var(--color-base-content)] md:text-base md:leading-6"
                style={{
                  fontFamily: 'var(--t-font-family-theme-primary, Outfit)',
                }}
              >
                {L.dniVerification}
              </p>
            </div>

            <button
              type="button"
              onClick={openIdv}
              className="ml-auto inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[var(--color-warning)] px-4 text-[var(--color-primary-content)] shadow-sm transition-opacity hover:opacity-95 active:opacity-90"
            >
              {L.verifyAccount}
            </button>
          </section>
        )}

        {/* Step: Required Changes */}
        {hasChanges && (
          <>
            <section
              className="flex items-center gap-3 rounded-xl bg-[var(--color-base-200)] p-2 md:gap-4 md:p-3"
              role="note"
              aria-label={L.changes}
            >
              <div className="flex flex-col justify-center self-stretch pt-[2px]">
                <div className="h-6 w-6">
                  <VectorIcon
                    className="h-[19.5px] w-[19.5px] shrink-0"
                    style={{ fill: 'var(--color-base-content)' }}
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
              </div>

              <div className="flex-1">
                <p
                  className="mt-1 text-sm leading-5 text-[var(--color-base-content)] md:text-base md:leading-6"
                  style={{
                    fontFamily: 'var(--t-font-family-theme-primary, Outfit)',
                  }}
                >
                  {L.titleDescription}
                </p>
              </div>
            </section>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-base leading-6 whitespace-pre-line text-[var(--color-neutral)]">
                {L.labelDescription}
              </p>

              {lines && lines.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-base leading-6 text-[var(--color-neutral)]">
                  {lines.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-base leading-6 whitespace-pre-line text-[var(--color-neutral)]">
                  {description}
                </p>
              )}
            </div>
          </>
        )}

        {/* Final step */}
        {hasChanges && (
          <>
            <section
              className="flex items-center gap-3 rounded-xl bg-[var(--color-base-200)] p-2 md:gap-4 md:p-3"
              role="note"
              aria-label={L.publishAgain}
            >
              <div className="flex flex-col justify-center self-stretch pt-[2px]">
                <div className="h-6 w-6">
                  <VectorIcon
                    className="h-[19.5px] w-[19.5px] shrink-0"
                    style={{ fill: 'var(--color-base-content)' }}
                    aria-hidden="true"
                    focusable="false"
                  />
                </div>
              </div>

              <div className="flex-1">
                <p
                  className="mt-1 text-sm leading-5 text-[var(--color-base-content)] md:text-base md:leading-6"
                  style={{
                    fontFamily: 'var(--t-font-family-theme-primary, Outfit)',
                  }}
                >
                  {L.finalNote}
                </p>
              </div>
            </section>
          </>
        )}
      </section>
    </>
  );
}
