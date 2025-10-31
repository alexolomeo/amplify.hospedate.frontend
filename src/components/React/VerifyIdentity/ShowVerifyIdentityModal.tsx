import React, { useEffect, useState, useCallback } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import WelcomeVerifyIdentityModal from '@/components/React/VerifyIdentity/WelcomeVerifyIdentityModal';
import VerifyIdentityQrModal from '@/components/React/VerifyIdentity/VerifyIdentityQrModal';
import { createKycSession } from '@/services/verify-identity/kyc';
import {
  type KycSession,
  isSessionValid,
  toDataUrl,
} from '@/types/verify-identity/kyc';
import { fetchUserMe } from '@/services/users';

export type IdvStep = 'notice' | 'qr';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onFinished?: () => void;
  initialStep?: IdvStep;
  lang?: SupportedLanguages;
};

export default function ShowVerifyIdentityModal({
  isOpen,
  onClose,
  onFinished,
  initialStep = 'notice',
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [step, setStep] = useState<IdvStep>(initialStep);

  // QR verification state
  const [session, setSession] = useState<KycSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(initialStep);
      setError(null);
    } else {
      setSession(null);
      setLoading(false);
      setError(null);
    }
  }, [isOpen, initialStep]);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Create session and get token for QR URL
      const sessionData = await createKycSession();
      setSession(sessionData);
    } catch (e) {
      setError(t.profile.idv.qrError);
      console.error('Error creating IDV session', e);
    } finally {
      setLoading(false);
    }
  }, [t.profile.idv.qrError]);

  const goQr = async () => {
    setStep('qr');
    if (isSessionValid(session)) return;
    await fetchSession();
  };

  const handleContinueFromWelcome = () => {
    // Desktop users get QR code for mobile scanning
    // Mobile users are handled by MobileVerificationScreen
    goQr();
  };

  const handleRetry = async () => {
    await fetchSession();
  };

  const handleDone = async () => {
    try {
      await fetchUserMe();
    } catch (e) {
      console.error('Failed to refresh user me after IDV confirm', e);
    } finally {
      onFinished?.();
      onClose();
    }
  };

  const qrImgSrc = session?.qrCode ? toDataUrl(session.qrCode) : undefined;
  const expiresAt = session?.expiresAt;

  return (
    <>
      <WelcomeVerifyIdentityModal
        open={isOpen && step === 'notice'}
        lang={lang}
        onClose={onClose}
        onContinue={handleContinueFromWelcome}
      />

      <VerifyIdentityQrModal
        open={isOpen && step === 'qr'}
        lang={lang}
        onClose={onClose}
        onConfirmDone={handleDone}
        qrSrc={qrImgSrc}
        loading={loading}
        error={error}
        onRetry={handleRetry}
        expiresAt={expiresAt}
      />
    </>
  );
}
