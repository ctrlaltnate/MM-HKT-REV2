import React from 'react';

interface PixelCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: 'purple' | 'cyan' | 'pink' | 'mango' | 'none';
  variant?: 'surface1' | 'surface2' | 'elevated';
}

export const PixelCard: React.FC<PixelCardProps> = ({
  children,
  glow = 'none',
  variant = 'surface1',
  className = '',
  style,
  ...props
}) => {
  const bgStyles = {
    surface1: 'bg-[#17162E] border border-[#352C5E]',
    surface2: 'bg-[#262047] border border-[#4B3E7A]',
    elevated: 'bg-[#1D1B3A] border-2 border-brand-purple'
  }[variant];

  const glowStyles = {
    purple: 'shadow-[0_0_16px_rgba(139,92,246,0.25)] border-[#8B5CF6]',
    cyan: 'shadow-[0_0_16px_rgba(55,231,255,0.25)] border-[#37E7FF]',
    pink: 'shadow-[0_0_16px_rgba(255,79,216,0.25)] border-[#FF4FD8]',
    mango: 'shadow-[0_0_16px_rgba(255,216,77,0.25)] border-[#FFD84D]',
    none: ''
  }[glow];

  return (
    <div
      className={`rounded-lg p-4 sm:p-6 transition-all duration-200 ${bgStyles} ${glowStyles} ${className}`}
      style={{
        backgroundColor: variant === 'surface2' ? 'var(--surface-2)' : 'var(--surface-1)',
        borderColor: glow !== 'none' ? undefined : 'var(--surface-3)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};
