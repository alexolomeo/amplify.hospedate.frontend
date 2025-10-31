import type { Space } from '@/types/listing/space';
import { useModalParam } from '../Hooks/useModalParam';
import { FullScreenModal } from '../Common/FullScreenModal';
import IsotipoIcon from '/src/icons/isotipo.svg?react';
import LogotipoIcon from '/src/icons/logotipo.svg?react';
import ListingGallery from './ListingGallery';
import type { SupportedLanguages } from '@/utils/i18n';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import ListingMasonry from './ListingMasonry';
import ListingSleepingArrangements from './ListingSleepingArrangements';
import React from 'react';
import Chevron from '/src/icons/chevron-left.svg?react';

interface Props {
  spaces?: Space[];
  lang?: SupportedLanguages;
  isOpen?: boolean;
  open?: () => void;
  close?: () => void;
  url?: string;
  labelButton?: string;
}

export const GalleryContainer: React.FC<Props> = ({
  spaces = [],
  lang = 'es',
  isOpen: isOpenProp,
  open: openProp,
  close: closeProp,
  url,
  labelButton,
}) => {
  const hasExternalControls =
    isOpenProp !== undefined ||
    openProp !== undefined ||
    closeProp !== undefined;

  const isControlled =
    typeof isOpenProp === 'boolean' &&
    typeof openProp === 'function' &&
    typeof closeProp === 'function';

  if (hasExternalControls && !isControlled) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        'GalleryContainer: If any of isOpen, open, or close is provided, all three must be provided with the correct types. Falling back to uncontrolled mode.'
      );
    }
  }

  const internalModal = useModalParam('modal', 'PHOTO_TOUR_SCROLLABLE', {
    disabled: isControlled,
  });

  const isOpen = isControlled ? (isOpenProp as boolean) : internalModal.isOpen;
  const open = isControlled ? (openProp as () => void) : internalModal.open;
  const close = isControlled ? (closeProp as () => void) : internalModal.close;

  const [sleepingPortal, setSleepingPortal] = useState<HTMLElement | null>(
    null
  );
  const [mansoryPortal, setMansoryPortal] = useState<HTMLElement | null>(null);
  const [initialSpace, setInitialSpace] = useState<string | undefined>();

  const openWithSpace = (spaceName?: string) => {
    setInitialSpace(spaceName);
    open();
  };

  useEffect(() => {
    setSleepingPortal(document.getElementById('sleeping-container'));
    const mansoryContainer = document.getElementById('mansory-container');
    if (mansoryContainer) {
      // Clear the server-rendered skeleton before React portal renders
      mansoryContainer.innerHTML = '';
      setMansoryPortal(mansoryContainer);
    }
  }, []);

  return (
    <>
      <FullScreenModal
        isOpen={isOpen}
        close={close}
        lang={lang}
        logo={
          <div className="flex items-center">
            <IsotipoIcon className="h-10 w-10" />
            <LogotipoIcon className="h-10" />
          </div>
        }
      >
        {url && labelButton && (
          <a
            href={url}
            role="button"
            className="text-primary flex items-center gap-2 justify-self-start text-sm font-medium hover:underline"
          >
            <span className="text-xl leading-none">
              <Chevron className="h-4" />
            </span>
            {labelButton}
          </a>
        )}
        {/* Only render gallery when modal is open to avoid loading images prematurely */}
        {isOpen && (
          <ListingGallery
            spaces={spaces}
            spacing={16}
            lang={lang}
            initialSpace={initialSpace}
          />
        )}
      </FullScreenModal>

      {sleepingPortal
        ? createPortal(
            <ListingSleepingArrangements
              spaces={spaces}
              lang={lang}
              open={openWithSpace}
            />,
            sleepingPortal
          )
        : null}

      {mansoryPortal &&
        createPortal(
          <ListingMasonry
            spaces={spaces}
            spacing={16}
            lang={lang}
            open={() => openWithSpace()}
          />,
          mansoryPortal
        )}
    </>
  );
};
