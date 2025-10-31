import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ResponsiveImage } from '@/components/React/Common/ResponsiveImage';
import AvatarDisplay from '@/components/React/Common/AvatarDisplay';
import { mediaPictureToPhoto } from '@/adapters/image';
import type { MediaPicture } from '@/types/message';

interface Props {
  open: boolean;
  onClose: () => void;
  sender: { username: string | null; photo: MediaPicture | null } | null;
  photo?: MediaPicture;
  objectUrl?: string | null;
}

const ImageViewer: React.FC<Props> = ({
  open,
  onClose,
  sender,
  photo,
  objectUrl,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev || '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="image-viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex h-[100dvh] w-[100dvw] items-center justify-center overscroll-contain bg-black/95"
        >
          <div
            className="relative h-full w-full p-0 sm:p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-black hover:bg-white"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>

            <div className="flex h-screen w-screen items-center justify-center">
              {objectUrl ? (
                <img
                  src={objectUrl}
                  alt="Image"
                  className="h-auto max-h-[90vh] w-auto max-w-[90vw] object-contain select-none"
                />
              ) : photo ? (
                <ResponsiveImage
                  photo={photo}
                  alt="Image"
                  className="mx-auto h-full max-h-[90vh] w-full max-w-[90vw] object-contain select-none"
                  loading="lazy"
                  pictureClassName="h-full w-full"
                  sizes="90vw"
                />
              ) : null}
            </div>

            {sender && (
              <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-sm text-black shadow">
                <AvatarDisplay
                  profilePicture={
                    sender.photo ? mediaPictureToPhoto(sender.photo) : null
                  }
                  username={sender.username}
                  size="h-6 w-6"
                  sizeText="text-xs"
                />
                <span className="max-w-[40vw] truncate">{sender.username}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImageViewer;
