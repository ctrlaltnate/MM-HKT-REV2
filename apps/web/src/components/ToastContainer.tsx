import gsap from "gsap";
import { CheckCircle2, AlertCircle, Info, Loader2, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useToast, type ToastItem } from "../context/ToastContext";

function ToastMessageItem({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;

    gsap.fromTo(
      el,
      { y: -20, opacity: 0, scale: 0.92 },
      { y: 0, opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2)" },
    );
  }, []);

  const getIcon = () => {
    switch (item.type) {
      case "success":
        return <CheckCircle2 className="toast-icon success" aria-hidden="true" />;
      case "error":
        return <AlertCircle className="toast-icon error" aria-hidden="true" />;
      case "loading":
        return <Loader2 className="toast-icon loading spin" aria-hidden="true" />;
      default:
        return <Info className="toast-icon info" aria-hidden="true" />;
    }
  };

  return (
    <div ref={ref} className={`global-toast-pill toast-${item.type}`} role="status">
      <div className="toast-content">
        {getIcon()}
        <span>{item.message}</span>
      </div>
      <button
        type="button"
        className="toast-close-btn"
        onClick={() => onDismiss(item.id)}
        aria-label="ปิดการแจ้งเตือน"
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="global-toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((item) => (
        <ToastMessageItem key={item.id} item={item} onDismiss={dismissToast} />
      ))}
    </div>
  );
}
