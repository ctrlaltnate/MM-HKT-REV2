import gsap from "gsap";
import { Info, X } from "lucide-react";
import { type KeyboardEvent, useLayoutEffect, useRef } from "react";

import type { AuthMode } from "../context/AuthModalContext";
import { AuthForm } from "./AuthForm";

export function AuthModal({
  open,
  initialMode,
  onClose,
  onComplete,
}: {
  open: boolean;
  initialMode: AuthMode;
  onClose: () => void;
  onComplete: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;
    const firstInput = panel?.querySelector<HTMLInputElement>("input");
    firstInput?.focus();
    if (!reducedMotion && panel) {
      gsap.fromTo(panel, { y: 28, opacity: 0, scale: 0.97 }, { y: 0, opacity: 1, scale: 1, duration: 0.32, ease: "power3.out" });
    }
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open, initialMode]);

  if (!open) return null;

  const handleKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      onClose();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>("button, input, select, a[href]") ?? []).filter((item) => !item.hasAttribute("disabled"));
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

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div ref={panelRef} className="auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title" onKeyDown={handleKeys}>
        <div className="modal-heading">
          <div>
            <span className="eyebrow">MaskedMatch membership</span>
            <h2 id="auth-modal-title">บัญชีเดียวสำหรับทุกงานแฟร์</h2>
          </div>
          <button className="icon-button" type="button" aria-label="ปิดหน้าต่างเข้าสู่ระบบ" onClick={onClose}><X aria-hidden="true" /></button>
        </div>
        <div className="notice auth-modal-notice"><Info aria-hidden="true" /><span>Local identity เก็บข้อมูลใน browser เครื่องนี้ ยังไม่ใช่ ThaID, OTP หรือบัญชีส่วนกลาง</span></div>
        <AuthForm initialMode={initialMode} onComplete={onComplete} />
      </div>
    </div>
  );
}
