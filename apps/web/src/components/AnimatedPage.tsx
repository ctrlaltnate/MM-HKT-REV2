import gsap from "gsap";
import type { PropsWithChildren } from "react";
import { useLayoutEffect, useRef } from "react";

export function AnimatedPage({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from("[data-reveal]", {
        y: 18,
        duration: 0.55,
        stagger: 0.07,
        ease: "power3.out",
      });
      gsap.to("[data-float]", {
        y: -8,
        duration: 2.2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, pageRef);
    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className={className}>
      {children}
    </div>
  );
}
