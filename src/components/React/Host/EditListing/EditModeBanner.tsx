import InformationCircleIcon from '@/icons/information-circle-solid.svg?react';

export default function EditModeBanner({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={[
        'flex w-full flex-col items-center gap-3',
        'px-[clamp(1rem,8vw,120px)] py-2',
        'bg-[var(--d-color-status-warning-content,#F1FAE8)]',
        className ?? '',
      ].join(' ')}
    >
      <div className="flex w-full items-center justify-center gap-2">
        <InformationCircleIcon className="h-6 w-6 flex-shrink-0 text-[var(--color-warning)]" />
        <span className="text-sm leading-4 font-[var(--t-font-family-theme-primary,Outfit)] text-[var(--d-color-status-warning-bg,#F5761B)]">
          {children}
        </span>
      </div>
    </div>
  );
}
