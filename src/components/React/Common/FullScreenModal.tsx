import React, { useEffect } from 'react';
import ChevronIcon from '/src/icons/chevron-left-mini.svg?react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface FullScreenModalProps {
  isOpen: boolean;
  close: () => void;
  children: React.ReactNode;
  logo?: string | React.ReactNode;
  headerAction?: string | React.ReactNode;
  maxWidth?: string;
  lang?: SupportedLanguages;
}
export function FullScreenModal({
  isOpen,
  close,
  children,
  logo,
  headerAction,
  maxWidth = 'max-w-full',
  lang = 'es',
}: FullScreenModalProps) {
  const t = getTranslation(lang);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  });
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className={`mx-auto h-full ${maxWidth} bg-base-100 flex flex-col`}>
          <div className="bg-base-100 sticky top-0 z-10 mx-5 flex items-center justify-between py-4 lg:mx-20">
            <button
              onClick={close}
              className="flex cursor-pointer items-center gap-x-1 text-sm lg:text-base"
              aria-label="Close modal"
            >
              <ChevronIcon></ChevronIcon>
              {t.listingDetail.photo.goBack}
            </button>
            <div className="flex flex-1 justify-center">{logo}</div>
            <div className="flex justify-end">{headerAction}</div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">{children}</div>
        </div>
      </div>
    </>
  );
}
