import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { FaceMaskVideoCanvas } from '../components/interview/FaceMaskVideoCanvas';
import { VoiceModulatorControl } from '../components/interview/VoiceModulatorControl';
import { AnimalMask } from '../types';
import { IconShieldCheck, IconCamera, IconMic, IconSparkles } from '../components/common/PixelIcons';

export const InterviewPreflightPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateInterviewState, updateAvatarConfig } = useAppStore();

  const [selectedMask, setSelectedMask] = useState<AnimalMask>(
    state.candidateProfile.avatarConfig.animalMask || 'fox'
  );
  const [isFailClosed, setIsFailClosed] = useState<boolean>(false);

  const handleEnterInterview = () => {
    updateAvatarConfig({
      ...state.candidateProfile.avatarConfig,
      animalMask: selectedMask
    });
    updateInterviewState('LIVE');
    navigate('/app/interviews/demo');
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
                เตรียมความพร้อมก่อนเข้าห้องสัมภาษณ์ (Privacy Preflight Check)
              </div>
              <h1 className="text-2xl font-display font-bold text-text-primary mt-0.5 flex items-center gap-2">
                <IconShieldCheck size={26} color="var(--brand-cyan)" />
                <span>Realtime Privacy & Hardware Check</span>
              </h1>
            </div>
            <div className="text-xs font-mono text-status-success bg-[#0D1025] px-3 py-1.5 rounded-lg border border-status-success/40">
              ● Network Latency: 24ms (Excellent)
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Real Camera + Face Tracking Canvas */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-display font-bold text-brand-purple flex items-center gap-1.5">
                  <IconCamera size={16} color="var(--brand-purple)" />
                  <span>กล้องจริง & REALTIME FACE MASK:</span>
                </span>
                <span className="text-[10px] font-mono text-brand-cyan">
                  MediaPipe WASM (60 FPS)
                </span>
              </div>

              <FaceMaskVideoCanvas
                mask={selectedMask}
                onFailClosedChange={setIsFailClosed}
              />

              {/* Mask Selector Switcher */}
              <div className="p-3.5 rounded-xl bg-[#17162E] border border-[#352C5E] space-y-2">
                <label className="text-xs text-text-muted font-display block">
                  เลือกหน้ากากสัตว์ที่คุณต้องการสวมใส่:
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {(['fox', 'cat', 'bear', 'owl', 'cyber_visor'] as AnimalMask[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setSelectedMask(m)}
                      className={`p-2 rounded text-center text-xs font-display font-semibold capitalize border transition-all ${
                        selectedMask === m
                          ? 'bg-brand-pink text-surface-1 border-brand-pink font-bold shadow-md shadow-pink-900/40'
                          : 'bg-[#0D1025] text-text-muted border-[#352C5E] hover:border-brand-pink/50'
                      }`}
                    >
                      {m === 'cyber_visor' ? 'Visor' : m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Real Voice DSP + Security Settings */}
            <div className="lg:col-span-6 space-y-6">
              <VoiceModulatorControl />

              {/* Security & Invariant Guarantee Card */}
              <div className="p-4 rounded-xl bg-[#17162E] border border-brand-cyan/40 space-y-3">
                <div className="text-xs font-display font-bold text-brand-cyan flex items-center gap-2">
                  <IconShieldCheck size={16} color="var(--brand-cyan)" />
                  <span>กฎเหล็กความปลอดภัย (Security Invariants Active):</span>
                </div>
                <div className="space-y-1.5 text-xs text-text-muted">
                  <div className="flex items-center gap-2">
                    <span className="text-status-success font-bold">✓</span>
                    <span><strong>Fail-Closed Policy:</strong> หากสูญเสีย Face Tracking จะตัดภาพเป็น Avatar ทันที</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-status-success font-bold">✓</span>
                    <span><strong>Client-Side Processing:</strong> เสียงและภาพดัดแปลงบนเครื่องของคุณ 100%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-status-success font-bold">✓</span>
                    <span><strong>Zero Raw Recording:</strong> ไม่มีการบันทึกวิดีโอหรือเสียงลงเซิร์ฟเวอร์</span>
                  </div>
                </div>
              </div>

              {/* Enter Interview Room CTA */}
              <div className="pt-2">
                <PixelButton
                  variant="accent"
                  size="lg"
                  className="w-full text-base font-bold shadow-xl shadow-cyan-950/60"
                  onClick={handleEnterInterview}
                  leftIcon={<IconSparkles size={18} color="var(--text-on-accent)" />}
                >
                  เข้าสู่ห้องสัมภาษณ์สด (Enter Speed Interview) ⚡
                </PixelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
