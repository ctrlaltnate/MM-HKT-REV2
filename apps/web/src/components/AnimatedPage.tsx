import gsap from "gsap";
import type { PropsWithChildren } from "react";
import { useLayoutEffect, useRef } from "react";

export function AnimatedPage({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.fromTo(
        "[data-reveal]",
        { opacity: 0, y: 16, scale: 0.985 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
        },
      );
      const floatElements = pageRef.current?.querySelectorAll("[data-float]");
      if (floatElements && floatElements.length > 0) {
        gsap.to(floatElements, {
          y: -8,
          duration: 2.4,
          yoyo: true,
          repeat: -1,
          ease: "sine.inOut",
        });
      }
    }, pageRef);
    return () => context.revert();
  }, []);

  return (
    <div ref={pageRef} className={className}>
      {children}
    </div>
  );
}
