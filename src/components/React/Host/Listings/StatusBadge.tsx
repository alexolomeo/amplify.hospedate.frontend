import clsx from 'clsx';
import type { Listing } from '@/types/host/listing';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';

interface Props {
  status: Listing['status'];
  lang?: SupportedLanguages;
}

export default function StatusBadge({ status, lang = 'es' }: Props) {
  const t = getTranslation(lang);

  const statusMap: Record<
    Listing['status'],
    { label: string; badgeClass: string }
  > = {
    PUBLISHED: {
      label: t.hostContent.listings.status.PUBLISHED,
      badgeClass:
        'border bg-[var(--d-color-status-success-content,#F1FAE8)] ' +
        'border-[var(--d-color-status-success-bg,#00A928)] ' +
        'text-[var(--d-color-status-success-bg,#00A928)]',
    },
    CHANGES_REQUESTED: {
      label: t.hostContent.listings.status.CHANGES_REQUESTED,
      badgeClass:
        'border bg-[var(--d-color-status-error-content,#FFF0F1)] ' +
        'border-[var(--d-color-status-error-bg,#FF000E)] ' +
        'text-[var(--d-color-status-error-bg,#FF000E)]',
    },
    APPROVED: {
      label: t.hostContent.listings.status.CHANGES_REQUESTED,
      badgeClass:
        'border bg-[var(--d-color-status-error-content,#FFF0F1)] ' +
        'border-[var(--d-color-status-error-bg,#FF000E)] ' +
        'text-[var(--d-color-status-error-bg,#FF000E)]',
    },
    IN_PROGRESS: {
      label: t.hostContent.listings.status.IN_PROGRESS,
      badgeClass:
        'border bg-[var(--d-color-status-success-content,#F1FAE8)] ' +
        'border-[var(--d-color-status-warning-bg,#FF5F00)] ' +
        'text-[var(--d-color-status-warning-bg,#FF5F00)]',
    },
    UNLISTED: {
      label: t.hostContent.listings.status.UNLISTED,
      badgeClass:
        'border bg-[var(--d-color-status-warning-content,#F1FAE8)] ' +
        'border-[var(--d-color-status-error-bg,#FF000E)] ' +
        'text-[var(--d-color-status-error-bg,#FF000E)]',
    },
    PENDING_APPROVAL: {
      label: t.hostContent.listings.status.PENDING_APPROVAL,
      badgeClass:
        'border bg-[var(--d-color-status-info-content,#B9E2FB)] ' +
        'border-[var(--d-color-status-info-bg,#0067FD)] ' +
        'text-[var(--d-color-status-info-bg,#0067FD)]',
    },
    BLOCKED: {
      label: t.hostContent.listings.status.BLOCKED,
      badgeClass:
        'border bg-[var(--d-color-status-error-content,#FFF0F1)] ' +
        'border-[var(--d-color-status-error-bg,#FF000E)] ' +
        'text-[var(--d-color-status-error-bg,#FF000E)]',
    },
  };

  const { label, badgeClass } = statusMap[status];

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        'px-[var(--t-spacing-2,8px)] py-[var(--t-spacing-1,4px)]',
        'gap-[var(--t-spacing-2,8px)]',
        'rounded-[var(--d-borderRadius-badge,30.4px)]',
        'text-xs font-medium whitespace-nowrap',
        badgeClass
      )}
    >
      {label}
    </span>
  );
}
