import * as React from 'react';
import { getSafeText } from '@/utils/displayHelpers';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import clsx from 'clsx';

function ChevronRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M9.29 6.71a1 1 0 0 0 0 1.41L12.17 11l-2.88 2.88a1 1 0 0 0 1.41 1.41l3.59-3.59a1 1 0 0 0 0-1.41L10.7 6.7a1 1 0 0 0-1.41.01Z" />
    </svg>
  );
}

function SimpleModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
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
        className="w-full max-w-lg rounded-2xl bg-[var(--color-base-150)] p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <h3 className="self-stretch text-xl leading-9 font-bold md:text-2xl lg:text-3xl">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="btn btn-circle btn-ghost"
            aria-label="Close"
            type="button"
          >
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}

type Props = {
  description: string;
  lang?: SupportedLanguages;
  className?: string;
  maxCharacters?: number;
  modalTitleOverride?: string;
};

export default function ListingDetailDescription({
  description,
  lang = 'es',
  className,
  maxCharacters = 200,
  modalTitleOverride,
}: Props) {
  const t = React.useMemo(() => getTranslation(lang), [lang]);
  const safeDescription = getSafeText(description ?? '', lang);
  const isLong = safeDescription.length > maxCharacters;
  const previewText = isLong
    ? `${safeDescription.slice(0, maxCharacters)}...`
    : safeDescription;

  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className={clsx('space-y-6 py-8', className)}>
        <h2 className="title-listing">{t.listingDetail.description.title}</h2>

        <p className="description-listing">{previewText}</p>

        {isLong && (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="btn btn-outline btn-secondary btn-sm inline-flex items-center gap-1 rounded-full"
          >
            {t.listingDetail.description.showMore}
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      <SimpleModal
        open={open}
        onClose={() => setOpen(false)}
        title={modalTitleOverride ?? t.listingDetail.description.aboutSpace}
      >
        <p className="text-base whitespace-pre-line">{safeDescription}</p>
      </SimpleModal>
    </>
  );
}
