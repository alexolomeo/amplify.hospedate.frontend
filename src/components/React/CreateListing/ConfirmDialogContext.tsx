import React, { createContext, useContext, useState, useCallback } from 'react';
import ConfirmQuitModal from './Modals/ConfirmQuitModal';
import RegisteredUserModal from './Modals/RegisteredUserModal';
import UnregisteredUserModal from './Modals/UnregisteredUserModal';
import ShowVerifyIdentityModal from '@/components/React/VerifyIdentity/ShowVerifyIdentityModal';
import { KycSessionManager } from '@/utils/kycSession';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

type DefaultResult = boolean;
export type RegisteredResult = 'submitForReview' | 'close';
export type UnregisteredResult = 'verifyNow' | 'verifyLater' | 'close';
export type ConfirmResult =
  | DefaultResult
  | RegisteredResult
  | UnregisteredResult;

export type ConfirmOptions =
  | { type: 'default' }
  | { type: 'listingPublishedRegistered'; data: { photoUrl: string } }
  | { type: 'listingPublishedUnregistered'; data: { photoUrl: string } };

type DialogQueueItem = {
  options: ConfirmOptions;
  resolve: (res: ConfirmResult) => void;
};

type ConfirmContextType = {
  confirm: (opts: ConfirmOptions) => Promise<ConfirmResult>;
};

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

function ConfirmDialogRenderer({
  dialog,
  onClose,
  lang,
}: {
  dialog?: DialogQueueItem;
  onClose: (res: ConfirmResult) => void;
  lang: SupportedLanguages;
}) {
  const t = getTranslation(lang);

  const [showVerifyIdentity, setShowVerifyIdentity] = React.useState(false);

  // This function is used in the conditional rendering logic below

  if (!dialog) return null;

  // ————— ConfirmQuit —————
  if (dialog.options.type === 'default') {
    return (
      <AlertDialog open onOpenChange={(open) => !open && onClose(false)}>
        <AlertDialogContent className="overflow-hidden rounded-[40px] border border-none bg-transparent p-0 shadow-none">
          <VisuallyHidden>
            <AlertDialogTitle>
              {t.createListing.modal.confirmQuit.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.createListing.modal.confirmQuit.description}
            </AlertDialogDescription>
          </VisuallyHidden>

          <ConfirmQuitModal
            onCancel={() => onClose(false)}
            onConfirm={() => onClose(true)}
            lang={lang}
          />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // ————— Registered user —————
  if (dialog.options.type === 'listingPublishedRegistered') {
    return (
      <AlertDialog open onOpenChange={(open) => !open && onClose('close')}>
        <AlertDialogContent className="overflow-hidden rounded-2xl border border-none bg-transparent p-0 shadow-none">
          <VisuallyHidden>
            <AlertDialogTitle>
              {t.createListing.modal.registeredUserModal.title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t.createListing.modal.registeredUserModal.reviewIntro}
            </AlertDialogDescription>
          </VisuallyHidden>

          <RegisteredUserModal
            photoUrl={dialog.options.data.photoUrl}
            onClose={(result: RegisteredResult) => onClose(result)}
            lang={lang}
          />
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // ————— Unregistered user —————
  if (dialog.options.type === 'listingPublishedUnregistered') {
    return (
      <>
        <AlertDialog open onOpenChange={(open) => !open && onClose('close')}>
          <AlertDialogContent className="overflow-hidden rounded-2xl border border-none bg-transparent p-0 shadow-none">
            <VisuallyHidden>
              <AlertDialogTitle>
                {t.createListing.modal.unregisteredUserModal.title}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t.createListing.modal.unregisteredUserModal.description}
              </AlertDialogDescription>
            </VisuallyHidden>

            <UnregisteredUserModal
              photoUrl={dialog.options.data.photoUrl}
              lang={lang}
              onVerifyNow={async () => {
                try {
                  await KycSessionManager.handleVerification(() => {
                    // Desktop: Show modal with QR code
                    setShowVerifyIdentity(true);
                  });
                } catch (error) {
                  console.error(
                    'Failed to initiate identity verification:',
                    error
                  );
                }
              }}
              onVerifyLater={() => onClose('verifyLater')}
              onClose={() => onClose('close')}
            />
          </AlertDialogContent>
        </AlertDialog>

        {/* IDV Modal - Only for desktop users */}
        <ShowVerifyIdentityModal
          isOpen={showVerifyIdentity}
          lang={lang}
          onClose={() => setShowVerifyIdentity(false)}
          onFinished={() => onClose('verifyNow')}
        />
      </>
    );
  }

  return null;
}

ConfirmDialogRenderer.displayName = 'ConfirmDialogRenderer';

export function ConfirmDialogProvider({
  children,
  lang = 'es',
}: {
  children: React.ReactNode;
  lang?: SupportedLanguages;
}) {
  const [queue, setQueue] = useState<DialogQueueItem[]>([]);

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<ConfirmResult>((resolve) => {
      setQueue((q) => [...q, { options, resolve }]);
    });
  }, []);

  const currentDialog = queue[0];

  const handleClose = useCallback((result: ConfirmResult) => {
    setQueue((q) => {
      const [current, ...rest] = q;
      current?.resolve(result);
      return rest;
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmDialogRenderer
        dialog={currentDialog}
        onClose={handleClose}
        lang={lang}
      />
    </ConfirmContext.Provider>
  );
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx)
    throw new Error('useConfirm must be used within ConfirmDialogProvider');
  return ctx.confirm;
}
