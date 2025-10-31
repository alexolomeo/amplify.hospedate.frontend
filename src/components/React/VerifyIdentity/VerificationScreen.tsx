import React, { useState, useCallback, useEffect } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
// import { uploadDocumentsForManualReview } from '@/services/verify-identity/manualReview';
import { sessionService } from '@/services/SessionService';
import type {
  VerificationStep,
  RateLimitInfo,
} from '@/types/verify-identity/verification';

// Mobile-optimized components without modals
import WelcomeScreen from './WelcomeScreen';
import DocumentInstruction from './DocumentInstruction';
import CameraCapture from './CameraCapture';
import FaceInstruction from './FaceInstruction';
// import UploadingScreen from './UploadingScreen';
import DocumentsSubmitted from './DocumentsSubmitted';
import VerificationError from './VerificationError';
import { processVerification } from '@/services/verify-identity/kyc';
import { fetchUserMe } from '@/services/users';
import ProcessingScreen from './ProcessingScreen';
import VerificationSuccess from './VerificationSuccess';

type Props = {
  onFinished?: () => void;
  lang?: SupportedLanguages;
  sessionToken?: string; // For mobile QR flow
  isApp?: boolean; // Indicates if process was initiated from Flutter app
  redirectUri?: string; // URI to redirect to after successful verification (for web only)
};

export default function VerificationScreen({
  onFinished,
  lang = 'es',
  sessionToken,
  isApp = false,
  redirectUri,
}: Props) {
  // Get translations
  const t = getTranslation(lang);

  const [verificationStep, setVerificationStep] =
    useState<VerificationStep>('welcome');
  const [capturedPhotos, setCapturedPhotos] = useState<{
    front?: File;
    back?: File;
    selfie?: File;
  }>({});
  const [, setError] = useState<string | null>(null);
  const [shouldProcessVerification, setShouldProcessVerification] =
    useState(false);
  const [currentSessionToken, setCurrentSessionToken] = useState<
    string | undefined
  >(sessionToken);
  const [rateLimitInfo, setRateLimitInfo] = useState<
    RateLimitInfo | undefined
  >();
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const handleCapturePhoto = useCallback(
    (file: File, type: 'front' | 'back' | 'selfie') => {
      setCapturedPhotos((prev) => {
        const updated = { ...prev, [type]: file };
        return updated;
      });
    },
    []
  );

  const isUserAuthenticated = Boolean(sessionService.getAccessToken());

  const processFullVerification = useCallback(async () => {
    if (
      !capturedPhotos.front ||
      !capturedPhotos.back ||
      !capturedPhotos.selfie
    ) {
      setVerificationStep('error');
      return;
    }

    try {
      setVerificationStep('processing');
      const result = await processVerification(
        {
          documentFront: capturedPhotos.front,
          documentBack: capturedPhotos.back,
          selfie: capturedPhotos.selfie,
        },
        sessionToken
      );

      // Upload documents for manual review instead of automatic processing
      // await uploadDocumentsForManualReview(
      //   capturedPhotos.front,
      //   capturedPhotos.back,
      //   capturedPhotos.selfie,
      //   sessionToken
      // );

      // // Add a brief delay to show the uploading screen
      // setTimeout(() => {
      //   setVerificationStep('documentsSubmitted');
      // }, 2000);

      // Handle async processing response
      if (result.isAsync && result.sessionToken) {
        setCurrentSessionToken(result.sessionToken);
        // Stay in processing state - the ProcessingScreen will handle polling
        return;
      }

      // Handle immediate response (legacy or completed)
      if (result.verified) {
        setVerificationStep('success');
        // Only refresh user data if this is an authenticated flow (no sessionToken)
        if (isUserAuthenticated) {
          await fetchUserMe();
        }
      } else {
        setVerificationStep('error');
      }
    } catch (err) {
      console.error('Verification failed:', err);
      // console.error('Document upload failed:', err);
      setVerificationStep('error');
    }
  }, [
    capturedPhotos.back,
    capturedPhotos.front,
    capturedPhotos.selfie,
    isUserAuthenticated,
    sessionToken,
  ]); // Include capturedPhotos and sessionToken as dependencies

  const handleProcessingComplete = useCallback(
    (success: boolean, message?: string, rateLimitInfo?: RateLimitInfo) => {
      if (success) {
        setVerificationStep('success');
        // Only refresh user data if this is an authenticated flow (no sessionToken)
        if (!sessionToken) {
          fetchUserMe();
        }
      } else {
        console.warn('Verification failed:', message);
        setRateLimitInfo(rateLimitInfo);
        setErrorMessage(message);
        setVerificationStep('error');
      }
    },
    [sessionToken]
  );

  const handleProcessingError = useCallback(
    (error: string, rateLimitInfo?: RateLimitInfo) => {
      console.error('Processing error:', error);
      setRateLimitInfo(rateLimitInfo);
      setErrorMessage(error);
      setVerificationStep('error');
    },
    []
  );

  // Effect to trigger verification when all photos are ready
  useEffect(() => {
    if (
      shouldProcessVerification &&
      capturedPhotos.front &&
      capturedPhotos.back &&
      capturedPhotos.selfie
    ) {
      setShouldProcessVerification(false);
      processFullVerification();
    }
  }, [capturedPhotos, shouldProcessVerification, processFullVerification]);

  const handleNext = useCallback(() => {
    switch (verificationStep) {
      case 'welcome':
        setVerificationStep('instructions-front');
        break;
      case 'instructions-front':
        setVerificationStep('camera-front');
        break;
      case 'camera-front':
        setVerificationStep('instructions-back');
        break;
      case 'instructions-back':
        setVerificationStep('camera-back');
        break;
      case 'camera-back':
        setVerificationStep('face-instructions');
        break;
      case 'face-instructions':
        setVerificationStep('face-camera');
        break;
      case 'face-camera':
        // Trigger verification processing flag
        setShouldProcessVerification(true);
        break;
      default:
        break;
    }
  }, [verificationStep]);

  const resetVerification = useCallback(() => {
    setCapturedPhotos({});
    setVerificationStep('welcome');
    setError(null);
  }, []);

  const handleFinished = () => {
    // Navigate back to appropriate destination based on context
    try {
      if (typeof window !== 'undefined') {
        if (isApp) {
          // For Flutter app, create deep link to app
          const appScheme = import.meta.env.PUBLIC_APP_DEEP_LINK_BASE;
          const deepLink = `${appScheme}`; // Return to app
          window.location.assign(deepLink);
        } else {
          // For web platform, navigate within the web app
          // Check if user is authenticated and we have a custom redirect URI
          if (isUserAuthenticated && redirectUri) {
            // Authenticated user with custom redirect URI - redirect there
            window.location.assign(redirectUri);
          } else if (isUserAuthenticated) {
            // Authenticated user without custom redirect - redirect to profile
            window.location.assign('/users/profile');
          } else {
            // Not authenticated and no session token - redirect to home
            window.location.assign('/');
          }
        }
      }
    } catch (error) {
      console.error('Navigation failed:', error);
      // Fallback: call the onFinished callback if provided
      onFinished?.();
    }
  };

  // Render the appropriate screen based on current step
  const renderScreen = () => {
    switch (verificationStep) {
      case 'welcome':
        return <WelcomeScreen onContinue={handleNext} lang={lang} />;

      case 'instructions-front':
        return (
          <DocumentInstruction
            onContinue={handleNext}
            type="front"
            lang={lang}
          />
        );

      case 'camera-front':
        return (
          <CameraCapture
            title={t.profile.idv.documentFrontCameraTitle}
            instructions={t.profile.idv.documentCameraInstruction}
            suggestions={t.profile.idv.documentCameraSuggestion}
            facingMode="environment"
            onCapture={(file: File) => {
              handleCapturePhoto(file, 'front');
              // Add small delay to ensure state update completes
              setTimeout(() => handleNext(), 100);
            }}
            lang={lang}
          />
        );

      case 'instructions-back':
        return (
          <DocumentInstruction
            onContinue={handleNext}
            type="back"
            lang={lang}
          />
        );

      case 'camera-back':
        return (
          <CameraCapture
            title={t.profile.idv.documentBackCameraTitle}
            instructions={t.profile.idv.documentCameraInstruction}
            suggestions={t.profile.idv.documentCameraSuggestion}
            facingMode="environment"
            onCapture={(file: File) => {
              handleCapturePhoto(file, 'back');
              // Add small delay to ensure state update completes
              setTimeout(() => handleNext(), 100);
            }}
            lang={lang}
          />
        );

      case 'face-instructions':
        return <FaceInstruction onContinue={handleNext} lang={lang} />;

      case 'face-camera':
        return (
          <CameraCapture
            title={t.profile.idv.faceVerificationTitle}
            instructions={t.profile.idv.faceVerificationInstruction}
            suggestions={t.profile.idv.faceVerificationSuggestion}
            facingMode="user"
            onCapture={(file: File) => {
              handleCapturePhoto(file, 'selfie');
              // Add small delay to ensure state update completes
              setTimeout(() => handleNext(), 100);
            }}
            lang={lang}
          />
        );

      case 'processing':
        return (
          <ProcessingScreen
            lang={lang}
            sessionToken={currentSessionToken || sessionToken}
            onComplete={handleProcessingComplete}
            onError={handleProcessingError}
          />
        );

      // return <UploadingScreen lang={lang} />;
      case 'success':
        return <VerificationSuccess onClose={handleFinished} lang={lang} />;

      case 'documentsSubmitted':
        return <DocumentsSubmitted onClose={handleFinished} lang={lang} />;

      case 'error':
        return (
          <VerificationError
            onRetry={resetVerification}
            lang={lang}
            errorMessage={errorMessage}
            rateLimitInfo={rateLimitInfo}
          />
        );

      default:
        return <WelcomeScreen onContinue={handleNext} lang={lang} />;
    }
  };

  return <div className="h-full">{renderScreen()}</div>;
}
