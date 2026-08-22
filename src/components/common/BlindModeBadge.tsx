import React, { useState } from 'react';
import { IconLock } from './PixelIcons';

export const BlindModeBadge: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className="flex items-center gap-1.5 px-3 py-1 bg-brand-purple/15 text-brand-purple hover:bg-brand-purple/25 border border-brand-purple/40 rounded-full text-xs font-display font-medium transition-colors"
      >
        <IconLock size={14} color="var(--brand-purple)" />
        <span>BLIND MODE ACTIVE</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-72 p-3 bg-[#17162E] border border-brand-purple rounded-lg shadow-xl text-xs z-50 text-text-muted space-y-1.5 animate-fade-in">
          <div className="font-display font-bold text-text-primary flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-purple"></span>
            <span>Blind Candidate Profile</span>
          </div>
          <p>
            ผู้สัมภาษณ์จะเห็นเฉพาะ <strong className="text-brand-cyan">รหัสผู้สมัคร, ทักษะ และหลักฐานผลงาน</strong>
          </p>
          <div className="pt-1 border-t border-[#352C5E] text-[11px] text-[#FF5A6F]">
            ✕ ซ่อน: ชื่อจริง, รูปถ่าย, สถาบัน, เบอร์โทร, อีเมล
          </div>
        </div>
      )}
    </div>
  );
};
