import clsx from 'clsx';

interface Props {
  variant: 'changes' | 'identity';
  label: string;
}

export default function SidebarAttentionBadge({ variant, label }: Props) {
  const base =
    'inline-flex items-center justify-center ' +
    'gap-[var(--t-spacing-2,8px)] ' +
    'py-[var(--t-spacing-1,4px)] px-[var(--t-spacing-2,8px)] ' +
    'rounded-[var(--d-borderRadius-badge,30.4px)] border ' +
    'text-xs font-medium whitespace-nowrap';

  const styles =
    variant === 'changes'
      ? clsx(
          'border-[var(--d-color-status-error-bg,#FF000E)]',
          'bg-[var(--d-color-status-error-content,#FFF0F1)]',
          'text-[var(--d-color-status-error-bg,#FF000E)]'
        )
      : clsx(
          'border-[var(--d-color-status-warning-bg,#FF5F00)]',
          'bg-[var(--d-color-status-success-content,#F1FAE8)]',
          'text-[var(--d-color-status-warning-bg,#FF5F00)]'
        );

  return <span className={clsx(base, styles)}>{label}</span>;
}
