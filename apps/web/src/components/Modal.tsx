import gsap from "gsap";
import { X } from "lucide-react";
import { type KeyboardEvent, type PropsWithChildren, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  ariaLabelledBy?: string;
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  maxWidth = "640px",
  ariaLabelledBy = "modal-title",
  children,
}: PropsWithChildren<ModalProps>) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;

    if (!reducedMotion && panel) {
      gsap.fromTo(
        panel,
        { y: 28, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)" },
      );
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]") ?? [],
    ).filter((item) => !item.hasAttribute("disabled"));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const modalContent = (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className="auth-modal modal-custom-panel"
        style={{ maxWidth, width: "100%" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        onKeyDown={handleKeys}
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">MaskedMatch Interactive</span>
            <h2 id={ariaLabelledBy}>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label={`ปิดหน้าต่าง ${title}`}
          >
            <X aria-hidden="true" />
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
