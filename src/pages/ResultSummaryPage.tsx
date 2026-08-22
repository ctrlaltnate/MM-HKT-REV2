import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { IconSparkles, IconCheck, IconArrowRight, IconShieldCheck } from '../components/common/PixelIcons';

export const ResultSummaryPage: React.FC = () => {
  const navigate = useNavigate();
  const { state } = useAppStore();
  const decisionCase = state.activeDecisionCase;

  const isMutualMatch = decisionCase?.state === 'MUTUAL_MATCH';

  useEffect(() => {
    if (isMutualMatch) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#8B5CF6', '#37E7FF', '#FF4FD8', '#FFD84D']
      });
    }
  }, [isMutualMatch]);

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        <div className="max-w-xl mx-auto px-4 py-12 space-y-8 text-center">
          {isMutualMatch ? (
            <div className="p-8 rounded-3xl bg-[#17162E] border-2 border-brand-pink shadow-2xl shadow-pink-950/40 space-y-6 animate-scale-up">
              <div className="w-16 h-16 rounded-2xl bg-brand-pink/20 border-2 border-brand-pink mx-auto flex items-center justify-center text-3xl">
                🎉
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono text-brand-cyan bg-[#0D1025] px-3 py-1 rounded-full border border-brand-cyan/40">
                  MUTUAL MATCH CONFIRMED
                </span>
                <h1 className="text-3xl font-display font-black text-text-primary">
                  ยินดีด้วย! เกิด <span className="text-brand-pink">MUTUAL MATCH</span>
                </h1>
                <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                  ทั้งคุณและทีมผู้สัมภาษณ์จาก <strong>Cyber Orchard Co.</strong> สนใจที่จะร่วมงานกันในตำแหน่ง Backend Developer
                </p>
              </div>

              {/* Next step notice */}
              <div className="p-4 rounded-xl bg-[#0D1025] border border-[#352C5E] text-left text-xs text-text-muted space-y-1.5 font-display">
                <div className="text-brand-mango font-bold flex items-center gap-1.5">
                  <IconShieldCheck size={14} color="var(--brand-mango)" />
                  <span>ขั้นตอนถัดไป (Consented Reveal):</span>
                </div>
                <p>
                  กรุณาเลือกข้อมูลติดต่อที่คุณยินยอมเปิดเผยให้บริษัท เพื่อให้ทีมงานติดต่อกลับเพื่อนัดหมายการทำแบบทดสอบทางเทคนิค
                </p>
              </div>

              <PixelButton
                variant="accent"
                size="lg"
                className="w-full text-base font-bold shadow-xl shadow-cyan-950/60"
                onClick={() => navigate('/matches/demo/reveal')}
                rightIcon={<IconArrowRight size={18} color="var(--text-on-accent)" />}
              >
                ไปยังหน้ายินยอมเปิดเผยข้อมูล (Consented Reveal) ⚡
              </PixelButton>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-[#17162E] border border-[#352C5E] space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-[#262047] border border-[#352C5E] mx-auto flex items-center justify-center text-3xl">
                🤝
              </div>

              <div className="space-y-2">
                <h1 className="text-2xl font-display font-bold text-text-primary">
                  ขอบคุณที่เข้าร่วมการสัมภาษณ์
                </h1>
                <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                  Cyber Orchard Co. • Backend Developer
                  <br />
                  ในรอบนี้ยังไม่เกิดการจับคู่ที่ตรงกัน ข้อมูลส่วนตัวของคุณยังคงได้รับการปกป้อง 100%
                </p>
              </div>

              <div className="pt-2">
                <PixelButton
                  variant="primary"
                  size="lg"
                  className="w-full text-base font-bold"
                  onClick={() => navigate('/app/events/demo/world')}
                >
                  กลับสู่ Career Hall เพื่อดูตำแหน่งงานอื่น 🌐
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
