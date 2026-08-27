import { Info } from "lucide-react";
import { useState } from "react";

interface InfoTooltipProps {
  text: string;
  className?: string;
}

export function InfoTooltip({ text, className = "" }: InfoTooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className={`info-tooltip-wrapper ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
      role="tooltip"
      aria-label={text}
    >
      <Info className="tooltip-info-icon" aria-hidden="true" />
      {visible && <span className="tooltip-bubble">{text}</span>}
    </span>
  );
}
