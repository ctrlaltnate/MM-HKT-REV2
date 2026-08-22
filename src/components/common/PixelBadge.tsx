import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'cyan' | 'mango';

interface PixelBadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export const PixelBadge: React.FC<PixelBadgeProps> = ({
  children,
  variant = 'purple',
  size = 'md',
  icon,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1'
  }[size];

  const variantStyles = {
    success: 'bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/40',
    warning: 'bg-[#FBBF24]/15 text-[#FBBF24] border-[#FBBF24]/40',
    danger: 'bg-[#FF5A6F]/15 text-[#FF5A6F] border-[#FF5A6F]/40',
    info: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/40',
    purple: 'bg-[#8B5CF6]/20 text-[#8B5CF6] border-[#8B5CF6]/50',
    cyan: 'bg-[#37E7FF]/20 text-[#37E7FF] border-[#37E7FF]/50',
    mango: 'bg-[#FFD84D]/20 text-[#FFD84D] border-[#FFD84D]/50'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-display font-medium rounded border ${sizeStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="inline-flex items-center">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
