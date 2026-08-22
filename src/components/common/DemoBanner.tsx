import React from 'react';
import { IconShieldCheck, IconAlert } from './PixelIcons';

export const DemoBanner: React.FC = () => {
  return (
    <div className="w-full bg-[#0D1025] border-b border-[#352C5E] px-4 py-2 text-xs font-mono text-[#BBB6D5]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-left">
          <IconShieldCheck size={16} color="var(--status-success)" />
          <span>
            <strong className="text-[#F8F7FF]">OFFICIAL DIGITAL ID COMPLIANT</strong> • ข้อมูลส่วนบุคคลถูกเข้ารหัสและแยกจัดเก็บใน Identity Vault
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[#FFD84D] bg-[#FFD84D]/10 px-2.5 py-0.5 rounded-full border border-[#FFD84D]/30 font-display text-[11px] font-bold">
          <IconAlert size={14} color="var(--brand-mango)" />
          <span>โหมดสาธิต (SYNTHETIC DATA)</span>
        </div>
      </div>
    </div>
  );
};
