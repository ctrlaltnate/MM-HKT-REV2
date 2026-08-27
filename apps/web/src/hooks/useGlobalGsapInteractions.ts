import gsap from "gsap";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useGlobalGsapInteractions() {
  const location = useLocation();

  // Route transition enhancement
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });

    const main = document.getElementById("main-content");
    if (main) {
      gsap.fromTo(
        main,
        { opacity: 0.82, y: 12 },
        { opacity: 1, y: 0, duration: 0.38, ease: "power2.out", clearProps: "transform" },
      );
    }
  }, [location.pathname]);

  // Global click micro-interaction & bouncy feedback
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "button:not(:disabled), .pixel-button:not(:disabled), a.pixel-link, .interactive-skill-chip, .tab-item, .showcase-stat-btn",
      );

      if (target) {
        gsap.killTweensOf(target);
        gsap.fromTo(
          target,
          { scale: 0.94 },
          { scale: 1, duration: 0.3, ease: "back.out(2.5)", clearProps: "scale,transform" },
        );
      }
    };

    document.addEventListener("click", handleClick, { passive: true });
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);
}
