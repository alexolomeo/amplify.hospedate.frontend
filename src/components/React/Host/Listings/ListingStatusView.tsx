import React, { useState } from 'react';
import ListingStatusCard from '../EditListing/components/ListingStatusCard';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import ShowVerifyIdentityModal from '@/components/React/VerifyIdentity/ShowVerifyIdentityModal';
import { useToast } from '@/components/React/CreateListing/ToastContext';
import ConfirmUnpublishModal from '@/components/React/Host/EditListing/Content/YourPlace/ConfirmUnpublishModal';
import { updateListingStatus } from '@/services/host/edit-listing/editListing';
import ConfirmPublishModal from '@/components/React/Host/EditListing/Content/YourPlace/ConfirmPublishModal';

export type Status =
  | 'IN_PROGRESS'
  | 'CHANGES_REQUESTED'
  | 'PUBLISHED'
  | 'UNLISTED'
  | 'PENDING_APPROVAL'
  | 'APPROVED';

type Props = {
  lang?: SupportedLanguages;
  status: Status;
  accountVerified?: boolean;
  onContinueEditing?: () => void;
  onOpenRequestedChanges?: () => void;
  listingId: string;
  onRefresh?: () => Promise<void>;
  totalPhotos?: number;
};

export default function ListingStatusView({
  lang = 'es',
  status,
  accountVerified,
  onContinueEditing,
  onOpenRequestedChanges,
  listingId,
  onRefresh,
  totalPhotos = 0,
}: Props) {
  const t = getTranslation(lang);
  const { showToast } = useToast();
  const L = t.hostContent.listingState;

  const titleText = L?.listingStatus;
  const unPublished = L?.unPublished;
  const visibleAndBookable = L?.visibleAndBookable;
  const hiddenAndUnavailable = L?.hiddenAndUnavailable;

  const [showIdv, setShowIdv] = useState(false);
  const openIdv = () => setShowIdv(true);
  const closeIdv = () => setShowIdv(false);
  const handleIdvFinished = () => closeIdv();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const askUnpublish = (v: 'published' | 'unpublished') => {
    if (v === 'unpublished') setConfirmOpen(true);
  };

  const askPublish = (v: 'published' | 'unpublished') => {
    if (v === 'published') setConfirmPublishOpen(true);
  };

  const doUnpublish = async () => {
    try {
      setBusy(true);
      await updateListingStatus(listingId, 'UNLISTED');
      await onRefresh?.();
      showToast({
        type: 'success',
        message: t.hostContent?.editListing?.commonMessages?.unpublishedSuccess,
        autoClose: true,
      });
    } catch {
      showToast({
        type: 'error',
        message: t.hostContent?.editListing?.commonMessages?.unpublishedError,
      });
    } finally {
      setBusy(false);
      setConfirmOpen(false);
    }
  };

  const doPublish = async () => {
    const min = 5;
    const current = totalPhotos ?? 0;

    if (current < min) {
      const msg =
        t.hostContent?.editListing?.commonMessages?.publishMinPhotosRequired?.replace(
          '{min}',
          String(min)
        );

      showToast({ type: 'error', message: msg, autoClose: true });

      setConfirmPublishOpen(false);

      return;
    }

    try {
      setPublishing(true);
      await updateListingStatus(listingId, 'PUBLISHED');
      await onRefresh?.();
      showToast({
        type: 'success',
        message: t.hostContent?.editListing?.commonMessages?.publishSuccess,
        autoClose: true,
      });
    } catch {
      showToast({
        type: 'error',
        message: t.hostContent?.editListing?.commonMessages?.publishError,
      });
    } finally {
      setPublishing(false);
      setConfirmPublishOpen(false);
    }
  };

  const statusMap = t.hostContent.listings.status as Record<Status, string>;
  const statusLabel = statusMap[status] ?? status;

  if (accountVerified === false) {
    return (
      <>
        <ListingStatusCard
          title={titleText}
          badge={{
            label: statusLabel,
            variant: 'warning',
          }}
          message={L?.verifyAccountToPublish}
          cta={{ label: L?.verifyAccount, onClick: openIdv }}
          lang={lang}
        />
        <ShowVerifyIdentityModal
          isOpen={showIdv}
          onClose={closeIdv}
          onFinished={handleIdvFinished}
          initialStep="notice"
          lang={lang}
        />
      </>
    );
  }

  if (status === 'CHANGES_REQUESTED') {
    return (
      <ListingStatusCard
        title={titleText}
        badge={{
          label: t.hostContent.listingState.requiredChanges,
          variant: 'warning',
        }}
        message={t.hostContent.listingState.reviewChangesMessage}
        cta={{
          label: t.hostContent.listingState.reviewChanges,
          onClick: onOpenRequestedChanges ?? (() => {}),
        }}
      />
    );
  }

  switch (status) {
    case 'UNLISTED': {
      return (
        <>
          <ListingStatusCard
            title={titleText}
            badge={{
              label: ` ${unPublished}`,
              variant: 'warning',
            }}
            options={{
              selectedValue: 'unpublished',
              onChange: askPublish,
              items: [
                {
                  value: 'published',
                  title: t.hostContent.listings.status.PUBLISHED,
                  description: visibleAndBookable,
                },
                {
                  value: 'unpublished',
                  title: unPublished,
                  description: hiddenAndUnavailable,
                },
              ],
            }}
          />
          <ConfirmPublishModal
            open={confirmPublishOpen}
            lang={lang}
            onCancel={() => setConfirmPublishOpen(false)}
            onConfirm={doPublish}
            busy={publishing}
          />
        </>
      );
    }

    case 'PENDING_APPROVAL':
      return (
        <ListingStatusCard
          title={titleText}
          badge={{
            label: ` ${unPublished}`,
            variant: 'warning',
          }}
          messageParts={{
            prefix: L?.reviewingListing,
            highlight: L?.notifyStatus,
            highlightClassName: 'font-semibold',
          }}
        />
      );

    case 'APPROVED':
      return (
        <ListingStatusCard
          title={titleText}
          badge={{
            label: t.hostContent.listings.status.APPROVED,
            variant: 'brand',
          }}
          messageParts={{
            prefix: `${L?.approvedListing}`,
            highlight: `${L?.publishIn24h}`,
            suffix: L?.automatically,
            highlightClassName: 'font-semibold',
          }}
        />
      );

    case 'PUBLISHED':
      return (
        <>
          <ListingStatusCard
            title={titleText}
            badge={{
              label: t.hostContent.listings.status.PUBLISHED,
              variant: 'success',
            }}
            options={{
              selectedValue: 'published',
              onChange: askUnpublish,
              items: [
                {
                  value: 'published',
                  title: t.hostContent.listings.status.PUBLISHED,
                  description: visibleAndBookable,
                },
                {
                  value: 'unpublished',
                  title: unPublished,
                  description: hiddenAndUnavailable,
                },
              ],
            }}
          />
          <ConfirmUnpublishModal
            open={confirmOpen}
            lang={lang}
            onCancel={() => setConfirmOpen(false)}
            onConfirm={doUnpublish}
            busy={busy}
          />
        </>
      );

    case 'IN_PROGRESS':
      return (
        <ListingStatusCard
          title={titleText}
          badge={{
            label: ` ${unPublished}`,
            variant: 'warning',
          }}
          messageParts={{
            prefix: t.hostContent.listingState.verifyAccountToPublish,
            highlightClassName: 'font-semibold',
          }}
          cta={{
            label: t.hostContent.listingState.verifyAccount,
            onClick: onContinueEditing ?? (() => {}),
          }}
        />
      );

    default:
      return null;
  }
}
