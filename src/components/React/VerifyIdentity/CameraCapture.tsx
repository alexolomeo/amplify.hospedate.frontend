import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import AppButton from '@/components/React/Common/AppButton';
import CameraIcon from '/src/icons/camera.svg?react';
import ArrowPathIcon from '/src/icons/arrow-path.svg?react';

interface CameraCaptureProps {
  onCapture: (file: File) => void;
  title: string;
  instructions: string;
  suggestions?: string;
  facingMode?: 'user' | 'environment';
  showPreview?: boolean;
  lang?: SupportedLanguages;
}

export default function CameraCapture({
  onCapture,
  title,
  instructions,
  suggestions,
  facingMode = 'environment',
  showPreview = true,
  lang = 'es',
}: CameraCaptureProps) {
  // Get translations
  const t = getTranslation(lang);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError(
        'No se pudo acceder a la cámara. Por favor, verifica los permisos.'
      );
    }
  }, [facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Ensure video is playing and has dimensions
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      console.error('Video not ready for capture');
      setError('Video no está listo. Intenta de nuevo.');
      return;
    }

    // Capture full screen - no cropping, backend gets complete image
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the entire video frame
    context.drawImage(video, 0, 0);

    // Convert canvas to blob and create file
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], 'captured-photo.jpg', {
            type: 'image/jpeg',
          });

          // Show preview if enabled
          if (showPreview) {
            const imageUrl = URL.createObjectURL(blob);
            setCapturedImage(imageUrl);
            stopCamera();
          } else {
            // Directly proceed with the captured file
            onCapture(file);
          }
        } else {
          console.error('Failed to create blob from canvas');
          setError('Error capturando la imagen. Intenta de nuevo.');
        }
      },
      'image/jpeg',
      0.8
    );
  }, [onCapture, showPreview, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    if (capturedImage) {
      URL.revokeObjectURL(capturedImage);
    }
    startCamera();
  }, [capturedImage, startCamera]);

  const confirmCapture = useCallback(() => {
    if (!capturedImage) {
      console.error('No captured image to confirm');
      return;
    }

    // Convert the captured image back to a file
    fetch(capturedImage)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], 'captured-photo.jpg', {
          type: 'image/jpeg',
        });
        onCapture(file);
      })
      .catch((err) => {
        console.error('Error converting image to file:', err);
        setError('Error procesando la imagen');
      });
  }, [capturedImage, onCapture]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (capturedImage) {
        URL.revokeObjectURL(capturedImage);
      }
    };
  }, [capturedImage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="fixed inset-0 bg-black">
      {/* Title overlay at top */}
      <div className="absolute top-0 right-0 left-0 z-10 p-4">
        <h2 className="text-center text-lg font-semibold text-white">
          {title}
        </h2>
      </div>

      {/* Full screen camera/preview area */}
      <div className="absolute inset-0 h-full w-full">
        {error ? (
          <div className="p-6 text-center text-white">
            <p className="mb-4">{error}</p>
            <AppButton
              onClick={startCamera}
              label={t.profile.idv.retryProcess}
            />
          </div>
        ) : capturedImage ? (
          // Preview captured image - fullscreen with frame overlay
          <div className="relative h-full w-full">
            <img
              src={capturedImage}
              alt="Captured"
              className="h-full w-full object-cover"
            />

            {/* Frame overlay - same as camera view */}
            <div className="absolute inset-0 -mt-50 flex items-center justify-center">
              {facingMode === 'user' ? (
                // Circular frame for selfie
                <div className="border-success relative h-72 w-72 rounded-full border-8">
                  {/* Success indicator - centered on TOP edge of frame */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-success flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-lg">
                      <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ) : (
                // Rectangular frame for documents
                <div className="border-success relative h-48 w-80 rounded-lg border-8">
                  {/* Success indicator - centered on TOP edge of frame */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-success flex h-16 w-16 items-center justify-center rounded-full border-4 border-white shadow-lg">
                      <svg
                        className="h-10 w-10 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Fullscreen live camera feed
          <div className="relative h-full w-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="h-full w-full object-cover"
            />

            {/* Camera overlay frame */}
            <div className="absolute inset-0 -mt-50 flex items-center justify-center">
              {facingMode === 'user' ? (
                // Circular frame for selfie
                <div className="h-72 w-72 rounded-full border-8 border-white/80" />
              ) : (
                // Rectangular frame for documents
                <div className="h-48 w-80 rounded-lg border-8 border-white/80" />
              )}
            </div>

            {/* Camera controls overlay */}
            {isStreaming && (
              <div
                className="absolute right-0 left-0 z-20 flex justify-center"
                style={{
                  bottom:
                    'max(180px, calc(180px + env(safe-area-inset-bottom)))',
                }}
              >
                <button
                  onClick={capturePhoto}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-white hover:bg-gray-100"
                >
                  <CameraIcon className="h-8 w-8 text-gray-800" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Instructions banner at bottom */}
      {!capturedImage && (
        <div
          className="absolute right-0 left-0 z-10 p-4"
          style={{
            bottom: 'max(20px, calc(20px + env(safe-area-inset-bottom)))',
          }}
        >
          <div className="mx-auto max-w-sm rounded-2xl bg-white/90 px-4 py-3">
            <p className="text-center text-sm text-gray-800">{instructions}</p>
          </div>
        </div>
      )}

      {/* Bottom controls for preview */}
      {capturedImage && (
        <>
          {suggestions && (
            <div
              className="absolute right-0 left-0 z-10 p-4"
              style={{
                bottom: 'max(80px, calc(80px + env(safe-area-inset-bottom)))',
              }}
            >
              <div className="mx-auto max-w-sm rounded-2xl bg-white/90 px-4 py-3">
                <p className="text-center text-sm text-gray-800">
                  {suggestions}
                </p>
              </div>
            </div>
          )}
          <div
            className="absolute right-0 left-0 z-1 p-6"
            style={{
              bottom: 'max(20px, calc(20px + env(safe-area-inset-bottom)))',
            }}
          >
            <div className="flex gap-4">
              <AppButton
                onClick={retakePhoto}
                label={t.profile.idv.retakePhoto}
                outline={true}
                className="border-secondary text-secondary flex-1 bg-white"
                icon={ArrowPathIcon}
                iconPosition="left"
              />
              <AppButton
                onClick={confirmCapture}
                label={t.profile.idv.confirmPhoto}
                className="flex-1"
              />
            </div>
          </div>
        </>
      )}

      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
