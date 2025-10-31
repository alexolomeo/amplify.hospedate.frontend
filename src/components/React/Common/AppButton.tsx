import React from 'react';

type ButtonVariant = 'default' | 'link' | 'circle' | 'dangerGhost';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps {
  label?: React.ReactNode;
  icon?: React.ElementType;
  iconPosition?: 'left' | 'right';
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  rounded?: boolean;
  outline?: boolean;
  fontSemibold?: boolean;
  modalId?: string;
  disabled?: boolean;
}

const AppButton: React.FC<ButtonProps> = ({
  label = '',
  icon: IconComponent,
  iconPosition = 'right',
  onClick,
  type,
  className = '',
  variant = 'default',
  size = 'sm',
  rounded = true,
  outline = false,
  fontSemibold = false,
  disabled = false,
  ...props
}) => {
  let baseClass = '';

  if (variant === 'default') {
    baseClass = `btn btn-primary ${outline ? 'btn-outline' : ''} btn-${size}`;
    if (rounded) baseClass += ' rounded-full';
    if (fontSemibold) baseClass += ' font-semibold';
  } else if (variant === 'link') {
    baseClass = `text-primary flex cursor-pointer items-center underline underline-offset-2 gap-x-1 text-${size}`;
  } else if (variant === 'circle') {
    baseClass = 'btn btn-sm btn-circle btn-soft btn-primary';
  } else if (variant === 'dangerGhost') {
    baseClass = `btn btn-${size}`;
    if (rounded) baseClass += ' rounded-full';
    if (fontSemibold) baseClass += ' font-semibold';

    baseClass += `
    border-0
    bg-transparent
    text-[var(--color-error)]
    shadow-none
    hover:bg-transparent
    hover:shadow-none
    focus:shadow-none
    active:shadow-none
  `;
  }

  return (
    <button
      type={type}
      className={`${baseClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {IconComponent && iconPosition === 'left' && (
        <IconComponent className="mr-2 h-4 w-4" />
      )}
      {label}
      {IconComponent && iconPosition === 'right' && (
        <IconComponent className="ml-2 h-4 w-4" />
      )}
    </button>
  );
};

export default AppButton;
