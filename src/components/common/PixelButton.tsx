import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'danger' | 'ghost' | 'mango';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-display font-bold tracking-wide transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 shadow-lg'
  }[size];

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white hover:from-[#7C3AED] hover:to-[#6D28D9] border border-[#A78BFA]/50 shadow-[0_0_15px_rgba(139,92,246,0.35)] hover:shadow-[0_0_25px_rgba(139,92,246,0.6)]',
    secondary:
      'bg-[#17162E] text-[#F8F7FF] hover:bg-[#262047] border border-[#352C5E] hover:border-[#8B5CF6]/60 shadow-md',
    accent:
      'bg-gradient-to-r from-[#37E7FF] to-[#06B6D4] text-[#070816] font-extrabold hover:brightness-110 border border-[#7DD3FC] shadow-[0_0_18px_rgba(55,231,255,0.45)] hover:shadow-[0_0_30px_rgba(55,231,255,0.7)]',
    mango:
      'bg-gradient-to-r from-[#FFD84D] to-[#F59E0B] text-[#070816] font-extrabold hover:brightness-110 border border-[#FDE68A] shadow-[0_0_18px_rgba(255,216,77,0.45)] hover:shadow-[0_0_30px_rgba(255,216,77,0.7)]',
    danger:
      'bg-gradient-to-r from-[#FF5A6F] to-[#DC2626] text-white hover:from-[#EF4444] hover:to-[#B91C1C] border border-[#FCA5A5]/40 shadow-[0_0_15px_rgba(255,90,111,0.35)]',
    ghost:
      'bg-transparent text-[#BBB6D5] hover:text-[#F8F7FF] hover:bg-[#17162E] border border-transparent hover:border-[#352C5E]'
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {!isLoading && leftIcon && <span className="inline-flex items-center flex-shrink-0">{leftIcon}</span>}
      <span className="leading-none">{children}</span>
      {!isLoading && rightIcon && <span className="inline-flex items-center flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
