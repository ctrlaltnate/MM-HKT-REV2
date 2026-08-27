import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

export function LandingJourneyMotion() {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    const context = gsap.context(() => {
      gsap.fromTo(".journey-line", { strokeDashoffset: 44 }, { strokeDashoffset: 0, duration: 1.8, repeat: -1, ease: "none" });
      gsap.to(".journey-pulse", { scale: 1.16, opacity: 0.45, transformOrigin: "center", duration: 0.9, repeat: -1, yoyo: true, stagger: 0.24, ease: "sine.inOut" });
      gsap.to(".journey-chip", { y: -5, duration: 1.25, repeat: -1, yoyo: true, stagger: 0.18, ease: "sine.inOut" });
    }, rootRef);
    return () => context.revert();
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="journey-motion" data-reveal>
      <div className="journey-copy">
        <span className="eyebrow">One profile, many opportunities</span>
        <h3>ทำข้อมูลครั้งเดียว แล้วพาโปรไฟล์ไปได้ทุกงาน</h3>
        <p>ระบบเชื่อม Resume, ผลวิเคราะห์ และสิทธิ์การแชร์ไว้เป็นเส้นทางเดียว ลดการกรอกข้อมูลซ้ำและทำให้ Recruiter อ่านจุดเด่นได้เร็วขึ้น</p>
        <div className="journey-benefits">
          <span className="journey-chip">ประหยัดเวลากรอกซ้ำ</span>
          <span className="journey-chip">เปรียบเทียบกับ JD ได้ง่าย</span>
          <span className="journey-chip">ผู้สมัครคุม consent เอง</span>
        </div>
      </div>
      <div className="journey-stage" role="img" aria-label="ภาพเคลื่อนไหวจากโปรไฟล์สู่การวิเคราะห์และงานแฟร์">
        <DotLottieReact
          className="journey-lottie"
          src="/assets/motion/profile-to-fair.json"
          loop
          autoplay={!reducedMotion}
        />
        <svg className="journey-overlay" viewBox="0 0 600 180" aria-hidden="true">
          <path className="journey-line" d="M92 90H286M314 90H508" pathLength="44" />
          <circle className="journey-pulse" cx="80" cy="90" r="36" />
          <circle className="journey-pulse" cx="300" cy="90" r="36" />
          <circle className="journey-pulse" cx="520" cy="90" r="36" />
          <text x="80" y="153" textAnchor="middle">PROFILE</text>
          <text x="300" y="153" textAnchor="middle">SKILL MAP</text>
          <text x="520" y="153" textAnchor="middle">JOB FAIR</text>
        </svg>
      </div>
    </div>
  );
}
