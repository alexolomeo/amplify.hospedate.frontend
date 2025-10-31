import * as React from 'react';
import clsx from 'clsx';

import type { Review as ReviewType } from '@/types/listing/review';
import type { Rating } from '@/types/listing/rating';
import { getSafeArray } from '@/utils/displayHelpers';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

import ListingDetailRating from './ListingDetailRating';
import ListingReview from '@/components/React/Listing/ListingReview';
import ReviewItem from '@/components/React/Common/ReviewItem';

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11l-2.88 2.88a1 1 0 1 0 1.41 1.41l3.59-3.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z" />
    </svg>
  );
}

function SimpleModal({
  open,
  onClose,
  children,
  maxWidth = 'max-w-3xl',
  maxHeight = 'max-h-[100vh]',
  bodyMaxHeight = 'max-h-full lg:md:max-h-[90vh]',
  bgClass = 'bg-[var(--color-base-150)]',
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  bodyMaxHeight?: string;
  bgClass?: string;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={clsx(
          'w-full overflow-hidden rounded-2xl p-0 shadow-xl',
          maxWidth
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={clsx('p-0', bgClass, maxHeight)}>
          <div className={clsx('overflow-auto p-4 sm:p-6', bodyMaxHeight)}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

type Props = {
  reviews: ReviewType;
  rating: Rating;
  listingId: number;
  lang?: SupportedLanguages;
  previewCount?: number;
  showAllThreshold?: number;
};

export default function ListingDetailReview({
  reviews,
  rating,
  listingId,
  lang = 'es',
  previewCount = 6,
  showAllThreshold = 4,
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);

  const safeReviews = React.useMemo(
    () => getSafeArray(reviews?.recentReviews),
    [reviews]
  );
  const firstN = React.useMemo(
    () => safeReviews.slice(0, previewCount),
    [safeReviews, previewCount]
  );

  const [open, setOpen] = React.useState(false);

  return (
    <div>
      <div className="space-y-6 py-8">
        <h1 className="title-listing">{t.listingDetail.review.title}</h1>

        {safeReviews.length === 0 ? (
          <p>{t.listingDetail.review.noReviews}</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {firstN.map((review, idx) => (
                <ReviewItem
                  key={idx}
                  review={review}
                  truncateComment={true}
                  lang={lang}
                />
              ))}
            </div>

            {safeReviews.length > showAllThreshold && (
              <button
                type="button"
                className="btn btn-outline btn-secondary btn-sm inline-flex items-center gap-1"
                onClick={() => setOpen(true)}
              >
                {t.listingDetail.review.showAll}
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            )}
          </>
        )}
      </div>

      <SimpleModal
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="max-w-3xl"
        maxHeight="max-h-[100vh]"
        bodyMaxHeight="max-h-full lg:md:max-h-[90vh]"
        bgClass="bg-[var(--color-base-150)]"
      >
        <div className="grid grid-cols-7">
          <div className="col-span-7 px-1 lg:col-span-3 lg:px-5">
            <ListingDetailRating
              rating={rating}
              flex="flex flex-col lg:pr-5"
              flexContent="flex lg:flex-col flex-nowrap overflow-x-auto whitespace-nowrap"
              progresWidth="w-full"
              scoreSize="text-6xl"
              starSize="w-16 h-14"
              description="text-xs py-1 text-neutral"
              isModal={true}
              lang={lang}
            />
          </div>

          <div className="col-span-7 px-1 lg:col-span-4">
            <div className="flex flex-col gap-6">
              <ListingReview
                numberReviews={reviews.totalReviews}
                lang={lang}
                id={listingId}
              />
            </div>
          </div>
        </div>
      </SimpleModal>
    </div>
  );
}
