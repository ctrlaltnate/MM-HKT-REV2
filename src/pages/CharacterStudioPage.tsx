import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { SpritePreviewCanvas } from '../components/character/SpritePreviewCanvas';
import { CharacterStudioPicker } from '../components/character/CharacterStudioPicker';
import { IconSparkles, IconCompass } from '../components/common/PixelIcons';

export const CharacterStudioPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateAvatarConfig } = useAppStore();
  const [avatarConfig, setAvatarConfig] = useState(state.candidateProfile.avatarConfig);

  const handleSaveAndEnter = () => {
    updateAvatarConfig(avatarConfig);
    navigate('/app/events/demo/world');
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#352C5E]">
            <div>
              <div className="text-xs font-display text-text-muted">
                ขั้นตอนที่ 3 จาก 3 : สร้างตัวละคร & วิธีการควบคุม
              </div>
              <h1 className="text-2xl font-display font-bold text-text-primary mt-0.5">
                8-Bit Character Creator Studio
              </h1>
            </div>
            <div className="text-xs font-mono text-brand-cyan bg-[#17162E] px-3 py-1.5 rounded-lg border border-brand-cyan/40">
              {state.candidateProfile.candidateCode}
            </div>
          </div>

          {/* Main Studio Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: 8-Bit Live Phaser Preview Canvas */}
            <div className="lg:col-span-5 flex flex-col items-center p-6 rounded-2xl bg-[#17162E] border-2 border-brand-purple shadow-xl shadow-purple-950/40 space-y-4">
              <span className="text-xs font-display font-bold text-brand-cyan tracking-wider">
                8-BIT LIVE PREVIEW
              </span>

              <SpritePreviewCanvas
                config={avatarConfig}
                scale={4.5}
                width={220}
                height={260}
                interactiveRotation={true}
              />

              {/* Style Specs */}
              <div className="w-full text-xs text-text-muted bg-[#0D1025] p-3.5 rounded-xl border border-[#352C5E] space-y-1 font-mono">
                <div className="flex justify-between">
                  <span>สไตล์ชุด:</span>
                  <span className="text-brand-purple capitalize">{avatarConfig.outfitStyle.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span>หน้ากากสัตว์:</span>
                  <span className="text-brand-pink capitalize">{avatarConfig.animalMask}</span>
                </div>
                <div className="flex justify-between">
                  <span>ทรงผม & สี:</span>
                  <span className="text-brand-cyan capitalize">{avatarConfig.hairStyle} ({avatarConfig.hairColor})</span>
                </div>
              </div>
            </div>

            {/* Right: The Sims Customizer Tabs & Dice */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#17162E] border border-[#352C5E] space-y-6">
              <CharacterStudioPicker
                config={avatarConfig}
                onChange={setAvatarConfig}
              />

              {/* World Controls Tutorial Card */}
              <div className="p-4 rounded-xl bg-[#0D1025] border border-[#352C5E] space-y-2">
                <div className="text-xs font-display font-bold text-brand-mango flex items-center gap-2">
                  <IconCompass size={16} color="var(--brand-mango)" />
                  <span>วิธีการเคลื่อนที่ใน Neon Career Hall:</span>
                </div>
                <ul className="text-xs text-text-muted space-y-1 list-disc list-inside leading-relaxed">
                  <li><strong className="text-text-primary">คอมพิวเตอร์:</strong> ใช้ปุ่ม WASD, ลูกศร หรือคลิกเมาส์บนจุดหมาย</li>
                  <li><strong className="text-text-primary">มือถือ / แท็บเล็ต:</strong> แตะจุดที่ต้องการเดินไปบนจอได้ทันที</li>
                  <li><strong className="text-brand-cyan">โหมดรายการ (Navigator):</strong> สลับดูข้อมูลงานและเข้าคิวได้ 100% โดยไม่ต้องเดิน</li>
                </ul>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <PixelButton
                  variant="accent"
                  size="lg"
                  className="w-full text-base font-bold shadow-xl shadow-cyan-950/60"
                  onClick={handleSaveAndEnter}
                  leftIcon={<IconSparkles size={18} color="var(--text-on-accent)" />}
                >
                  บันทึกตัวละครและเข้าสู่งาน (Enter Career Hall) ⚡
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
