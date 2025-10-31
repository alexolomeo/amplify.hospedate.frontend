import * as React from 'react';
import clsx from 'clsx';
import { useUiIcon } from '@/utils/ui-icons.client';

type Variant = 'default' | 'link' | 'circle';
type Size = 'xs' | 'sm' | 'md' | 'lg';

export type AppButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'color'
> & {
  label?: React.ReactNode;
  icon?: string | null;
  variant?: Variant;
  size?: Size;
  rounded?: boolean;
  outline?: boolean;
  fontSemibold?: boolean;
  modalId?: string;
  color?: string;
  colorText?: string;
};

export default function AppButton({
  label = '',
  icon = null,
  onClick,
  type = 'button',
  className = '',
  variant = 'default',
  size = 'sm',
  rounded = true,
  outline = false,
  fontSemibold = false,
  modalId = '',
  color = 'primary',
  colorText = 'primary',
  ...rest
}: AppButtonProps) {
  const textSizeMap: Record<Size, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const IconComp = useUiIcon(icon ?? undefined);

  let baseClass = '';
  if (variant === 'default') {
    baseClass = clsx(
      'btn',
      `btn-${color}`,
      outline && 'btn-outline',
      `btn-${size}`,
      rounded && 'rounded-full',
      fontSemibold && 'font-semibold'
    );
  } else if (variant === 'link') {
    baseClass = clsx(
      `text-${colorText}`,
      'flex cursor-pointer items-center underline underline-offset-2 gap-x-1',
      textSizeMap[size]
    );
  } else if (variant === 'circle') {
    baseClass = clsx(
      'btn',
      `btn-${color}`,
      `btn-${size}`,
      'btn-circle',
      'btn-soft'
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e);
      return;
    }
    if (modalId) {
      const el = document.getElementById(modalId) as HTMLDialogElement | null;
      if (el && typeof el.showModal === 'function') {
        el.showModal();
      }
    }
  };

  return (
    <button
      type={type}
      className={clsx(baseClass, className)}
      onClick={handleClick}
      {...rest}
    >
      {label}
      {IconComp ? <IconComp className="h-4 w-4" /> : null}
    </button>
  );
}
