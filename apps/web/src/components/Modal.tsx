import gsap from "gsap";
import { X } from "lucide-react";
import { type KeyboardEvent, type PropsWithChildren, useId, useLayoutEffect, useRef } from "react";
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
  ariaLabelledBy,
  children,
}: PropsWithChildren<ModalProps>) {
  const panelRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();
  const titleId = ariaLabelledBy ?? `${generatedId}-title`;
  const subtitleId = `${generatedId}-subtitle`;

  useLayoutEffect(() => {
    if (!open) return;

    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;
    const focusFrame = window.requestAnimationFrame(() => {
      const preferredFocus = panel?.querySelector<HTMLElement>(
        "[data-autofocus]:not([disabled]), [autofocus]:not([disabled]), input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled])",
      );
      const firstFocusable = panel?.querySelector<HTMLElement>(
        "button:not([disabled]), input:not([type='hidden']):not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])",
      );
      (preferredFocus ?? firstFocusable ?? panel)?.focus();
    });

    if (!reducedMotion && panel) {
      gsap.fromTo(
        panel,
        { y: 28, opacity: 0, scale: 0.92 },
        { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)" },
      );
    }
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousOverflow;
      if (opener?.isConnected) {
        opener.focus();
      }
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
      panelRef.current?.querySelectorAll<HTMLElement>(
        "button, input:not([type='hidden']), select, textarea, a[href], [tabindex]:not([tabindex='-1'])",
      ) ?? [],
    ).filter(
      (item) => !item.hasAttribute("disabled") && item.getAttribute("aria-hidden") !== "true" && item.tabIndex >= 0,
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) {
      event.preventDefault();
      panelRef.current?.focus();
      return;
    }
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
        aria-labelledby={titleId}
        aria-describedby={subtitle ? subtitleId : undefined}
        tabIndex={-1}
        onKeyDown={handleKeys}
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">MaskedMatch Interactive</span>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p id={subtitleId}>{subtitle}</p>}
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
