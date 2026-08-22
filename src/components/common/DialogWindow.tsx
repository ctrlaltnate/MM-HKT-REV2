import React, { useEffect } from 'react';

interface DialogWindowProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  headerColor?: 'purple' | 'cyan' | 'pink' | 'mango';
}

export const DialogWindow: React.FC<DialogWindowProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  headerColor = 'purple'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }[maxWidth];

  const headerBorder = {
    purple: 'border-brand-purple text-brand-purple',
    cyan: 'border-brand-cyan text-brand-cyan',
    pink: 'border-brand-pink text-brand-pink',
    mango: 'border-brand-mango text-brand-mango'
  }[headerColor];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className={`w-full ${maxWidthClass} bg-[#17162E] border-2 rounded-xl shadow-2xl overflow-hidden animate-scale-up`}
        style={{ borderColor: `var(--brand-${headerColor})` }}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b bg-[#262047]/60 ${headerBorder}`}
        >
          <div className="text-lg font-display font-bold flex items-center gap-2">
            {title}
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 flex items-center justify-center rounded-md bg-[#17162E] hover:bg-red-500/20 hover:text-red-400 text-text-muted transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};
