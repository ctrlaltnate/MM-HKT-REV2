import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { FaceMaskVideoCanvas } from '../components/interview/FaceMaskVideoCanvas';
import { VoiceModulatorControl } from '../components/interview/VoiceModulatorControl';
import { IconCamera, IconMic, IconClock, IconShieldCheck, IconAlert } from '../components/common/PixelIcons';

export const SpeedInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateInterviewState } = useAppStore();

  const [remainingSeconds, setRemainingSeconds] = useState(12 * 60); // 12 minutes
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isWrapUpAlert, setIsWrapUpAlert] = useState(false);

  // Authoritative Interview Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishInterview();
          return 0;
        }
        if (prev === 61) {
          setIsWrapUpAlert(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleFinishInterview = () => {
    updateInterviewState('COMPLETED');
    navigate('/app/interviews/demo/decision');
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        {/* Room Status Top Header */}
        <header className="w-full bg-[#17162E] border-b border-[#352C5E] px-4 py-3 shadow-lg">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono bg-brand-purple/20 text-brand-purple px-2.5 py-1 rounded border border-brand-purple/40 font-bold">
                SPEED INTERVIEW (12 MIN)
              </span>
              <span className="font-display font-bold text-text-primary text-sm">
                Cyber Orchard Co. • Backend Developer
              </span>
            </div>

            {/* Timer & Security Seal */}
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1.5 rounded-lg border font-mono font-bold text-sm flex items-center gap-1.5 ${
                  remainingSeconds <= 60
                    ? 'bg-status-danger/20 text-status-danger border-status-danger animate-pulse'
                    : 'bg-[#0D1025] text-brand-cyan border-brand-cyan/40'
                }`}
              >
                <IconClock size={16} color="currentColor" />
                <span>{formatTimer(remainingSeconds)}</span>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-xs text-status-success font-mono bg-[#0D1025] px-2.5 py-1.5 rounded border border-status-success/30">
                <IconShieldCheck size={14} color="var(--status-success)" />
                <span>MASK ACTIVE • ZERO RECORDING</span>
              </div>
            </div>
          </div>
        </header>

        {/* Wrap Up Banner */}
        {isWrapUpAlert && (
          <div className="w-full bg-brand-mango/20 border-b border-brand-mango py-2 px-4 text-xs font-display text-brand-mango text-center animate-pulse">
            ⚠️ เหลือเวลา 1 นาทีสุดท้าย (Wrap-up Time) กรุณาสรุปประเด็นการสนทนา
          </div>
        )}

        {/* Video Call Grid */}
        <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Candidate Feed (Real Camera + Realtime Face Mask + Voice DSP) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-display text-text-muted">
                <span className="text-brand-cyan font-bold">
                  {state.candidateProfile.candidateCode} (ผู้สมัคร — คุณ)
                </span>
                <span className="text-status-success font-mono">● Realtime Masking On</span>
              </div>

              <FaceMaskVideoCanvas
                mask={state.candidateProfile.avatarConfig.animalMask}
              />

              <div className="flex items-center justify-between bg-[#17162E] p-2.5 rounded-lg border border-[#352C5E] text-xs">
                <span className="text-text-muted">เสียง: ดัดโทนต่ำ (DSP Active)</span>
                <span className="text-brand-cyan font-mono">Identity Shield: 100%</span>
              </div>
            </div>

            {/* 2. Recruiter Feed (Cyber Orchard Recruiter Station) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-display text-text-muted">
                <span className="text-brand-purple font-bold">
                  Recruiter #R12 (Ploy - Head of Backend)
                </span>
                <span className="text-status-success font-mono">● Online Stream</span>
              </div>

              {/* Recruiter Video Stream Simulation */}
              <div className="relative rounded-xl overflow-hidden bg-[#0D1025] border-2 border-[#352C5E] aspect-[4/3] flex flex-col items-center justify-center p-6 space-y-4">
                <div className="w-24 h-24 rounded-full bg-brand-purple/20 border-2 border-brand-purple flex items-center justify-center text-4xl shadow-inner">
                  💼
                </div>
                <div className="text-center space-y-1">
                  <div className="text-base font-display font-bold text-text-primary">
                    Recruiter #R12 (Hiring Team)
                  </div>
                  <div className="text-xs text-text-muted font-mono">
                    Cyber Orchard Co. • Engineering Team
                  </div>
                </div>

                {/* Recruiter Speaking Indicator */}
                <div className="flex items-center gap-2 text-xs text-status-success bg-status-success/15 px-3 py-1 rounded-full border border-status-success/30 font-mono">
                  <span className="w-2 h-2 rounded-full bg-status-success animate-ping"></span>
                  <span>กำลังรับฟังการอธิบายของ Candidate #8F3A</span>
                </div>
              </div>

              <div className="bg-[#17162E] p-2.5 rounded-lg border border-[#352C5E] text-xs text-text-muted">
                หัวข้อ: High-Throughput Event Queues & IoT Ingestion Pipeline
              </div>
            </div>
          </div>

          {/* Topic Guide & Controls */}
          <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs text-text-muted">
              💡 <strong>คำแนะนำ:</strong> อธิบายแนวคิดทางเทคนิค การแก้ปัญหาคอขวดของระบบ และผลงานเด่นที่ผ่านมา
            </div>

            <div className="flex items-center gap-3">
              <PixelButton
                variant="danger"
                size="md"
                className="font-bold"
                onClick={handleFinishInterview}
              >
                จบการสัมภาษณ์และส่งผล (Finish Interview) 🏁
              </PixelButton>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
