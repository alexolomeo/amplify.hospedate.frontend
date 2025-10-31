import { navigate } from 'astro:transitions/client';
import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $userStore } from '@/stores/userStore';
import { fetchUserMe } from '@/services/users';

import ChevronLeftMiniIcon from '/src/icons/chevron-left-mini.svg?react';
import EyeIcon from '/src/icons/eye.svg?react';
import AdjustmentsHorizontalIcon from '/src/icons/adjusments-horizontal.svg?react';

import AppButton from '@/components/React/Common/AppButton';
import clsx from 'clsx';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

import { steps } from '@/components/React/Utils/edit-listing/yourPlaceSteps';
import { arrivalSteps } from '@/components/React/Utils/edit-listing/arrivalSteps';
import { preferenceSteps } from '../../Utils/edit-listing/preferenceSteps';
import type { Slug } from '../../Utils/edit-listing/slugs';
import { placeMetaBySlug } from '../../Utils/edit-listing/sidebarMetaBySlug';
import { renderSub } from '../../Utils/edit-listing/renderSubtext';
import type { ListingEditorValues } from '@/types/host/edit-listing/editListingValues';
import getPlaceSubtextsFromValues from '../../Helper/EditListing/getPaceSubtextFromValue';
import type { CatalogsSelectors } from '../../Hooks/Host/EditListing/useEditListing';
import { IconListing } from './components/IconListSideBar';
import { buildArrivalSubtexts } from '../../Helper/getArrivalSubtexts';
import StatusBadge from '@/components/React/Host/Listings/StatusBadge';
import type { Listing } from '@/types/host/listing';
import SidebarAttentionBadge from './SidebarAttentionBadge';

interface Props {
  lang: SupportedLanguages;
  currentSlug: Slug;
  onSelectStepSlug: (slug: Slug) => void;
  values?: ListingEditorValues;
  selectors: CatalogsSelectors;
}
type AmenityKV = { key: string; label: string };

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null;

const isAmenityKV = (v: unknown): v is AmenityKV => {
  if (!isObject(v)) return false;
  const key = (v as Record<string, unknown>)['key'];
  const label = (v as Record<string, unknown>)['label'];
  return typeof key === 'string' && typeof label === 'string';
};

function isListFormat(x: unknown): x is AmenityKV[] {
  return Array.isArray(x) && x.every(isAmenityKV);
}

export default function EditListingSidebar({
  lang,
  currentSlug,
  onSelectStepSlug,
  values,
  selectors,
}: Props) {
  const t = getTranslation(lang);
  type SubMapString = Partial<Record<Slug, string>>;

  const locale = lang;

  const placeSubtexts = useMemo(
    () => getPlaceSubtextsFromValues(locale, selectors, values),
    [values, locale, selectors]
  );

  const arrivalsText = useMemo(
    () => buildArrivalSubtexts(t, values),
    [values, t]
  );
  const subPreferens: SubMapString = (values ?? {}) as SubMapString;

  const [activeTab, setActiveTab] = useState<'place' | 'guide' | 'preference'>(
    steps.some((s) => s.slug === currentSlug)
      ? 'place'
      : arrivalSteps.some((s) => s.slug === currentSlug)
        ? 'guide'
        : preferenceSteps.some((s) => s.slug === currentSlug)
          ? 'preference'
          : 'place'
  );

  useEffect(() => {
    if (steps.some((s) => s.slug === currentSlug)) setActiveTab('place');
    else if (arrivalSteps.some((s) => s.slug === currentSlug))
      setActiveTab('guide');
    else if (preferenceSteps.some((s) => s.slug === currentSlug))
      setActiveTab('preference');
  }, [currentSlug]);

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    fetchUserMe().catch(() => {});
  }, []);

  const user = useStore($userStore);

  const canUseClientOnlyFlags = isMounted;

  const listingStatus = values?.setting?.statusSection?.status as
    | Listing['status']
    | undefined;

  const isChangesRequested =
    canUseClientOnlyFlags &&
    values?.setting?.statusSection?.status === 'CHANGES_REQUESTED';

  const hasPendingTaskSection =
    canUseClientOnlyFlags && Boolean(values?.yourPlace?.pendingTaskSection);

  const identityFlag =
    canUseClientOnlyFlags &&
    user?.identityVerified === false &&
    listingStatus !== undefined &&
    listingStatus !== 'PUBLISHED';

  const showRequestChanges =
    isChangesRequested || hasPendingTaskSection || identityFlag;

  const placeStepsToRender = useMemo(
    () =>
      showRequestChanges
        ? steps
        : steps.filter((s) => s.slug !== ('request-changes' as Slug)),
    [showRequestChanges]
  );

  const stepDisplayNames = t.hostContent.editListing.sidebar
    .stepDisplayNames as Record<string, string>;
  const getTitle = (slug: Slug) => stepDisplayNames[slug] ?? slug;

  const attentionVariant = useMemo<null | 'changes' | 'identity'>(() => {
    if (!canUseClientOnlyFlags) return null;
    if (isChangesRequested && hasPendingTaskSection) return 'changes';
    if (identityFlag) return 'identity';
    return null;
  }, [
    canUseClientOnlyFlags,
    isChangesRequested,
    hasPendingTaskSection,
    identityFlag,
  ]);

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 bg-[var(--color-base-150)] pb-4">
        <div className="flex w-full items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('/hosting/listings')}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[16px] transition"
            aria-label={t.hostContent.editListing.sidebar.backAriaLabel}
          >
            <ChevronLeftMiniIcon className="text-base-content h-4 w-4" />
          </button>

          <h2 className="text-base-content flex-1 text-xl leading-7 font-semibold">
            {t.hostContent.editListing.sidebar.title}
          </h2>

          <AppButton
            label={t.hostContent.editListing.sidebar.view}
            icon={EyeIcon}
            type="button"
            variant="default"
            size="sm"
            rounded
            fontSemibold
            className="h-8 w-[80px] justify-center text-sm leading-[14px]"
            aria-label={t.hostContent.editListing.sidebar.view}
            onClick={() => onSelectStepSlug('preview' as Slug)}
          />
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="border-base-300 flex border-b">
            <button
              onClick={() => setActiveTab('place')}
              className={clsx(
                'cursor-pointer border-b-2 px-4 pb-1 text-sm leading-5 font-normal transition',
                activeTab === 'place'
                  ? 'text-primary border-primary -mb-[1px]'
                  : 'text-neutral hover:text-base-content border-transparent'
              )}
            >
              {t.hostContent.editListing.sidebar.tab.place}
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={clsx(
                'cursor-pointer border-b-2 px-4 pb-1 text-sm leading-5 font-normal transition',
                activeTab === 'guide'
                  ? 'text-primary border-primary -mb-[1px]'
                  : 'text-neutral hover:text-base-content border-transparent'
              )}
            >
              {t.hostContent.editListing.sidebar.tab.guide}
            </button>
          </div>

          <button
            className={clsx(
              'flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border transition',
              activeTab === 'preference'
                ? 'bg-secondary border-secondary'
                : 'border-secondary'
            )}
            aria-label={t.hostContent.editListing.sidebar.optionsAriaLabel}
            onClick={() => setActiveTab('preference')}
          >
            <AdjustmentsHorizontalIcon
              className={clsx(
                'h-[14px] w-[14px]',
                activeTab === 'preference' ? 'text-white' : 'text-secondary'
              )}
            />
          </button>
        </div>
      </div>

      <div className="hide-scrollbar flex-1 overflow-y-auto pb-4">
        <div className="flex flex-col gap-4">
          {activeTab === 'place' &&
            placeStepsToRender
              .filter((step) => step.slug !== ('edit-profile' as Slug))
              .map((step) => {
                const title = getTitle(step.slug);

                const sub = isMounted ? placeSubtexts?.[step.slug] : undefined;

                const meta = placeMetaBySlug[step.slug];
                const Icon = meta?.icon;

                return (
                  <div
                    key={step.slug}
                    onClick={() => onSelectStepSlug(step.slug)}
                    className={clsx(
                      'border-base-200 cursor-pointer rounded-xl border p-4 transition hover:border-neutral-300 hover:bg-white',
                      currentSlug === step.slug &&
                        'border-primary bg-primary/5',
                      meta?.cardClassName
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {step.slug !== ('request-changes' as Slug) && (
                          <div
                            className={clsx(
                              'text-sm font-medium text-[var(--color-neutral)]',
                              meta?.titleClassName
                            )}
                          >
                            {title}
                          </div>
                        )}
                      </div>
                      {meta?.chip && (
                        <span
                          className={clsx(
                            'text-[10px] font-semibold',
                            meta.chip.className
                          )}
                        >
                          {meta.chip.text}
                        </span>
                      )}
                    </div>

                    {step.slug === 'amenities' && sub && isListFormat(sub) ? (
                      <div className="mt-1 flex flex-col gap-3">
                        <IconListing
                          items={sub}
                          folder="amenities"
                          hideIconForKey="more"
                        />
                      </div>
                    ) : step.slug === 'house-rules' &&
                      sub &&
                      isListFormat(sub) ? (
                      <div className="mt-1 flex flex-col gap-3">
                        <IconListing items={sub} folder="house-rules" />
                      </div>
                    ) : step.slug === 'guest-safety' &&
                      sub &&
                      isListFormat(sub) ? (
                      <div className="mt-1 flex flex-col gap-3">
                        <IconListing items={sub} folder="safety-property" />
                      </div>
                    ) : (
                      renderSub(sub, meta)
                    )}

                    {Icon && (
                      <Icon
                        aria-hidden="true"
                        focusable="false"
                        className={clsx(
                          'h-4 w-4 text-neutral-500',
                          meta?.iconClassName
                        )}
                      />
                    )}

                    {/* ✅ Mostrar imagen solo si NO hay subtexto (mantiene SSR=cliente en primer render) */}
                    {meta?.image && !sub && (
                      <img
                        src={meta.image}
                        alt={
                          t.createListing.wizardStepContent.uploadPhotosModal
                            .validation.couldNotLoad
                        }
                        loading="lazy"
                        className={clsx(
                          'h-36 w-full object-contain',
                          meta?.imageClassName
                        )}
                      />
                    )}

                    {step.slug === 'request-changes' && attentionVariant && (
                      <div className="mt-3 space-y-2">
                        <div
                          className={
                            attentionVariant === 'changes'
                              ? 'text-sm text-[var(--d-color-status-error-bg,#FF000E)]'
                              : 'text-sm text-[var(--d-color-status-warning-bg,#FF5F00)]'
                          }
                        >
                          {attentionVariant === 'changes'
                            ? t.hostContent.editListing.sidebar.requestChanges
                                .requestChangesTitle
                            : t.hostContent.editListing.sidebar.requestChanges
                                .identityTitle}
                        </div>

                        <SidebarAttentionBadge
                          variant={attentionVariant}
                          label={
                            attentionVariant === 'changes'
                              ? t.hostContent.editListing.sidebar.requestChanges
                                  .requestChangesBadge
                              : t.hostContent.editListing.sidebar.requestChanges
                                  .identityBadge
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              })}

          {activeTab === 'guide' &&
            arrivalSteps.map((step) => {
              const subArrival = arrivalsText?.[step.slug];
              return (
                <div
                  key={step.slug}
                  onClick={() => onSelectStepSlug(step.slug)}
                  className={clsx(
                    'border-base-200 cursor-pointer rounded-xl border p-4 transition hover:bg-white',
                    currentSlug === step.slug && 'border-primary bg-primary/5'
                  )}
                >
                  <div className="text-base-content text-sm font-medium capitalize">
                    {t.hostContent.editListing.sidebar.arrivalSteps[step.slug]}
                  </div>
                  <div className="text-neutral text-xs">{subArrival ?? ''}</div>
                </div>
              );
            })}

          {activeTab === 'preference' &&
            preferenceSteps.map((step) => {
              const subPreference = subPreferens?.[step.slug];
              const isActive = currentSlug === step.slug;

              return (
                <div
                  key={step.slug}
                  onClick={() => onSelectStepSlug(step.slug)}
                  className={clsx(
                    'border-base-200 cursor-pointer rounded-xl border p-4 transition hover:bg-white',
                    isActive && 'border-primary bg-primary/5'
                  )}
                >
                  <div className="text-base-content text-sm font-medium">
                    {
                      t.hostContent.editListing.sidebar.preferenceSteps[
                        step.slug
                      ]
                    }
                  </div>

                  {step.slug === 'listing-state' ? (
                    <div className="mt-2 flex items-center gap-2">
                      {isMounted && listingStatus ? (
                        <StatusBadge status={listingStatus} lang={lang} />
                      ) : (
                        <span className="text-neutral text-xs">
                          {t.hostContent.editListing.sidebar.statusUnavailable}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="text-neutral text-xs">{subPreference}</div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
