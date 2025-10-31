import { useEffect, useMemo, useState } from 'react';
import { useStore } from '@nanostores/react';
import { EditabilityProvider } from '@/components/React/Host/EditListing/EditabilityContext';
import { getEditModeForStatus } from '@/components/React/Utils/edit-listing/editability';
import EditListingShell from './EditListingShell';
import EditListingSidebar from './EditListingSidebar';
import EditListingContent from './EditListingContent';
import EditListingFooter from './EditListingFooter';
import {
  isValidSlug,
  type Slug,
} from '@/components/React/Utils/edit-listing/slugs';
import { getLayoutModeForSlug } from '@/components/React/Utils/edit-listing/edit-layout-rules';
import { LAYOUT_BY_MODE } from '@/components/React/Utils/edit-listing/edit-layout';
import { useEditListing } from '../../Hooks/Host/EditListing/useEditListing';
import LoadingSpinner from '../../Common/LoadingSpinner';
import { useEditListingOrchestrator } from '@/components/React/Hooks/Host/EditListing/useEditListingOrchestrator';
import { type SupportedLanguages, getTranslation } from '@/utils/i18n';
import { useConfirmDiscardDialog } from '@/components/React/Hooks/Host/EditListing/useConfirmDiscardDialog';
import EditModeBanner from './EditModeBanner';
import { $userStore } from '@/stores/userStore';
import { fetchUserMe } from '@/services/users';
import { $editListingSession } from '@/stores/host/editListing/editListingSession';
import { updateListingStatus } from '@/services/host/edit-listing/editListing';
import { useToast } from '@/components/React/CreateListing/ToastContext';
import { useConfirmSubmitReviewDialog } from '@/components/React/Hooks/Host/EditListing/useConfirmSubmitReviewDialog';

type NavOptions = { subpath?: string; replace?: boolean };

interface Props {
  lang?: SupportedLanguages;
  listingId: string;
  stepSlug: string;
}

export default function EditListingSection({
  lang = 'es',
  listingId,
  stepSlug,
}: Props) {
  const t = getTranslation(lang);
  const { showToast } = useToast();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    void fetchUserMe();
  }, []);

  const user = useStore($userStore);
  const session = useStore($editListingSession);

  const [currentSlug, setCurrentSlug] = useState<Slug>(
    isValidSlug(stepSlug) ? (stepSlug as Slug) : 'overview'
  );
  const [gallerySubpath, setGallerySubpath] = useState<string>('');

  const { status, error, selectors, refresh, values } =
    useEditListing(listingId);

  const listingStatus = values?.setting?.statusSection?.status;
  const restMessage =
    listingStatus === 'APPROVED'
      ? t.hostContent.editListing.content.editModeBanner.visitMode.restApproved
      : t.hostContent.editListing.content.editModeBanner.visitMode.rest;
  const editMode = getEditModeForStatus(listingStatus);
  const isReadOnly = editMode === 'readOnly';

  const navigateTo = (slug: Slug, options?: NavOptions) => {
    const encodedId = encodeURIComponent(listingId);
    const base = `/hosting/listing/edit/${encodedId}/${slug}`;

    if (slug === 'preview') {
      window.location.assign(base);
      return;
    }
    const url =
      slug === 'photo-gallery' && options?.subpath
        ? `${base}/${options.subpath}`
        : base;

    try {
      if (options?.replace) window.history.replaceState({}, '', url);
      else window.history.pushState({}, '', url);
    } finally {
      setCurrentSlug(slug);
      setGallerySubpath(
        slug === 'photo-gallery' ? (options?.subpath ?? '') : ''
      );
    }
  };

  const applyRoute = (slug: Slug, subpath: string) => {
    setCurrentSlug(slug);
    setGallerySubpath(slug === 'photo-gallery' ? subpath : '');
  };

  const { confirm, dialogNode } = useConfirmDiscardDialog(lang);

  const { confirm: confirmSubmitReview, dialogNode: submitReviewDialogNode } =
    useConfirmSubmitReviewDialog(lang);

  const { registerController, saveCurrent, canSave, saving, guardAndNavigate } =
    useEditListingOrchestrator({
      listingId,
      refresh,
      navigateTo,
      applyRoute,
      isReadOnly,
      confirmDiscard: () => confirm(),
    });

  useEffect(() => {
    if (!isValidSlug(stepSlug)) {
      applyRoute('overview', '');
      return;
    }
    const next = stepSlug as Slug;
    if (typeof window !== 'undefined' && next === 'photo-gallery') {
      const encodedId = encodeURIComponent(listingId);
      const base = `/hosting/listing/edit/${encodedId}/photo-gallery/`;

      const sub = window.location.pathname.startsWith(base)
        ? window.location.pathname.slice(base.length).replace(/\/+$/, '')
        : '';
      applyRoute(next, sub);
    } else {
      applyRoute(next, '');
    }
  }, [stepSlug, listingId]);

  const gallerySegments = useMemo(() => {
    if (currentSlug !== 'photo-gallery' || !gallerySubpath) return [];
    return gallerySubpath.split('/').filter(Boolean);
  }, [currentSlug, gallerySubpath]);

  const pendingDesc =
    values?.yourPlace?.pendingTaskSection?.description?.trim();
  const needsFullForChanges = Boolean(pendingDesc && pendingDesc.length > 0);
  const identityVerified = user?.identityVerified;

  const mode = useMemo(() => {
    if (currentSlug === 'request-changes') {
      if (needsFullForChanges) return 'FULL';
      if (identityVerified === false) return 'SIDEBAR_ONLY';
    }

    const baseMode = getLayoutModeForSlug(currentSlug);
    if (currentSlug !== 'photo-gallery') return baseMode;

    if (gallerySegments.length === 1 && gallerySegments[0] === 'photos')
      return 'FOOTER_ONLY';
    if (gallerySegments.length === 3 && gallerySegments[1] === 'space-photo')
      return 'FOOTER_ONLY';
    return 'SIDEBAR_ONLY';
  }, [currentSlug, gallerySegments, needsFullForChanges, identityVerified]);

  const { showSidebar, showFooter } = LAYOUT_BY_MODE[mode];

  const footerTitle = useMemo(() => {
    if (!showFooter) return undefined;
    const map = (t.hostContent.editListing.footer.stepTitles ?? {}) as Record<
      string,
      string
    >;
    return map[currentSlug] ?? t.hostContent.editListing.footer.title;
  }, [showFooter, currentSlug, t]);

  const footerSaveLabelOverride: string | undefined = useMemo(() => {
    if (!showFooter) return undefined;
    return currentSlug === 'request-changes'
      ? t.hostContent.editListing.footer.changesMade
      : undefined;
  }, [showFooter, currentSlug, t.hostContent.editListing.footer.changesMade]);

  const isRequestChanges = currentSlug === 'request-changes';

  const hasPatchedOnce: boolean = Boolean(
    session.valuesByListingId?.[listingId]?.hasPatchedOnce
  );

  const [submittingStatus, setSubmittingStatus] = useState(false);

  const canSaveBase = status === 'ready' && canSave && !isReadOnly;

  const canSaveForRequestChanges =
    status === 'ready' && !isReadOnly && hasPatchedOnce && !submittingStatus;

  const footerCanSave = isRequestChanges
    ? canSaveForRequestChanges
    : canSaveBase;

  const onSaveRequestChanges = async (): Promise<'ok' | 'error' | 'cancel'> => {
    if (!canSaveForRequestChanges) return 'error';

    const proceed = await confirmSubmitReview();
    if (!proceed) return 'cancel';

    try {
      setSubmittingStatus(true);
      await updateListingStatus(listingId, 'PENDING_APPROVAL');
      await refresh();
      return 'ok';
    } catch {
      return 'error';
    } finally {
      setSubmittingStatus(false);
    }
  };

  const footerOnSave = async (): Promise<'ok' | 'error' | 'cancel'> => {
    const res = isRequestChanges
      ? await onSaveRequestChanges()
      : await saveCurrent();

    if (res === 'ok') {
      showToast({
        type: 'success',
        message: t.hostContent.editListing?.commonMessages?.saveSuccess,
        autoClose: true,
        duration: 4000,
      });
    } else if (res === 'error') {
      showToast({
        type: 'error',
        message: t.hostContent.editListing?.commonMessages?.saveError,
      });
    }
    return res;
  };

  const loadingView = (
    <div className="px-[clamp(1rem,8vw,143px)] pt-16">
      <LoadingSpinner />
    </div>
  );

  const errorView = (
    <div className="px-[clamp(1rem,8vw,143px)] pt-16">
      <div className="text-error mb-4">{error}</div>
      <button className="btn btn-primary" onClick={refresh}>
        {t.hostContent.editListing.commonMessages.retry}
      </button>
    </div>
  );

  return (
    <EditabilityProvider status={listingStatus}>
      <EditListingShell
        banner={
          mounted && isReadOnly ? (
            <EditModeBanner>
              <strong className="font-bold">
                {
                  t.hostContent.editListing.content.editModeBanner.visitMode
                    .strong
                }
              </strong>{' '}
              {restMessage}
            </EditModeBanner>
          ) : null
        }
        showSidebar={showSidebar}
        showFooter={showFooter}
        sidebar={
          <EditListingSidebar
            lang={lang}
            currentSlug={currentSlug}
            onSelectStepSlug={(slug) => guardAndNavigate(slug)}
            values={values}
            selectors={selectors}
          />
        }
        content={
          <div className="hide-scrollbar flex h-full min-h-0 flex-col gap-8 overflow-y-auto px-[clamp(1rem,8vw,143px)] pt-16">
            {status === 'loading' && loadingView}
            {status === 'error' && errorView}
            {status === 'ready' && (
              <EditListingContent
                lang={lang}
                listingId={listingId}
                stepSlug={currentSlug}
                onNavigate={(slug, opts) => guardAndNavigate(slug, opts)}
                gallerySubpath={gallerySubpath}
                selectors={selectors}
                values={values}
                onRegisterController={registerController}
                onRefresh={refresh}
              />
            )}
          </div>
        }
        footer={
          <EditListingFooter
            lang={lang}
            title={footerTitle}
            canSave={footerCanSave}
            saving={saving || submittingStatus}
            onSave={footerOnSave}
            saveLabelOverride={footerSaveLabelOverride}
          />
        }
      />
      {dialogNode}
      {submitReviewDialogNode}
    </EditabilityProvider>
  );
}
