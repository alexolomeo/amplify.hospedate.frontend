import { useEffect, useState, type ReactNode } from 'react';
import clsx from 'clsx';

interface Props {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  className?: string;
}

export default function CollapseCard({
  title,
  children,
  defaultOpen = false,
  forceOpen = false,
  className = '',
}: Props) {
  const [open, setOpen] = useState<boolean>(defaultOpen);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <div
      className={clsx(
        'border-base-200 bg-base-100 rounded-2xl border',
        className
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-base font-semibold">{title}</span>
        <span
          aria-hidden="true"
          className={clsx(
            'inline-block transition-transform',
            open ? 'rotate-180' : 'rotate-0'
          )}
        >
          ▾
        </span>
      </button>

      <div className={clsx('px-4 pb-4', open ? 'block' : 'hidden')}>
        {children}
      </div>
    </div>
  );
}
