import LiquidGlass from "liquid-glass-react";
import type { PropsWithChildren } from "react";

export function GlassPanel({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`glass-panel ${className}`}>
      <LiquidGlass
        displacementScale={28}
        blurAmount={0.08}
        saturation={118}
        aberrationIntensity={0.7}
        elasticity={0.12}
        cornerRadius={18}
        padding="1px"
      >
        <div className="glass-panel-content">{children}</div>
      </LiquidGlass>
    </div>
  );
}
