import clsx from 'clsx';
import type { ReactNode } from 'react';

export type Position = 'left' | 'center' | 'right';

interface FloatingActionButtonProps {
  label: string;
  icon: ReactNode;
  colorClass?: string;
  position?: Position;
  className?: string;
  onClick?: () => void;
}

const positionClasses: Record<Position, string> = {
  left: 'left-6',
  center: 'left-1/2 transform -translate-x-1/2',
  right: 'right-6',
};

export default function FloatingActionButton({
  label,
  icon,
  colorClass = 'bg-primary',
  position = 'right',
  className,
  onClick,
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'fixed bottom-6 flex cursor-pointer items-center space-x-2 rounded-full px-4 py-2 text-white shadow-lg transition hover:shadow-xl',
        colorClass,
        positionClasses[position],
        className
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="h-6 w-6" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
