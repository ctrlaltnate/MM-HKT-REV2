import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { ApiSettingsModal } from '../components/common/ApiSettingsModal';
import { IconSettings, IconRefresh, IconSparkles, IconUser, IconBriefcase } from '../components/common/PixelIcons';

export const DemoControllerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    applyDemoPreset,
    resetAllDemoData,
    setUserRole
  } = useAppStore();

  const [resetMessage, setResetMessage] = useState<string | null>(null);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);

  const presets = [
    {
      name: 'Happy Match',
      desc: 'เข้าคิว Cyber Orchard -> รับ Ready Check ทันที -> สัมภาษณ์ -> เกิด Mutual Match -> เลือก Reveal ข้อมูล',
      tag: 'Recommended Demo'
    },
    {
      name: 'No Match',
      desc: 'ทั้งสองฝ่ายส่งคำตอบส่วนตัว -> เกิดผล No Match อย่างสุภาพ โดยไม่เปิดเผยว่าใครเลือก Pass',
      tag: 'Double-Blind Privacy'
    },
    {
      name: 'Queue Timeout',
      desc: 'จำลองกรณีผู้สมัครไม่ตอบรับ Ready Check ภายใน 60 วินาที -> แสดงปุ่มขอ Requeue',
      tag: 'Queue Resilience'
    }
  ];

  const handleApplyPreset = (presetName: string) => {
    applyDemoPreset(presetName);
    setResetMessage(`✓ ปรับใช้ Preset "${presetName}" เรียบร้อยแล้ว`);
    setTimeout(() => setResetMessage(null), 2500);
  };

  const handleReset = () => {
    resetAllDemoData();
    setResetMessage('✓ รีเซ็ตข้อมูลทั้งหมดกลับสู่ค่าเริ่มต้นแล้ว!');
    setTimeout(() => setResetMessage(null), 2500);
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        {/* Demo Controller Header */}
        <header className="w-full bg-[#17162E] border-b border-[#352C5E] px-4 py-3 shadow-lg">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-brand-mango/20 border border-brand-mango flex items-center justify-center text-brand-mango">
                <IconSettings size={18} color="var(--brand-mango)" />
              </div>
              <div>
                <div className="text-xs font-mono text-brand-mango">STAGE PRESENTER TOOL</div>
                <h1 className="text-sm font-display font-bold text-text-primary">
                  Demo Controller & Scenario Presets (SC-17)
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <PixelButton
                variant="secondary"
                size="sm"
                onClick={() => setIsApiSettingsOpen(true)}
                leftIcon={<IconSettings size={14} color="currentColor" />}
              >
                ตั้งค่า Cloud API
              </PixelButton>
              <PixelButton
                variant="danger"
                size="sm"
                onClick={handleReset}
                leftIcon={<IconRefresh size={14} color="currentColor" />}
              >
                Reset All Demo Data 🔄
              </PixelButton>
            </div>
          </div>
        </header>

        {/* Main Control Board */}
        <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
          {resetMessage && (
            <div className="p-3.5 rounded-xl bg-status-success/20 border border-status-success text-status-success text-xs font-display text-center animate-fade-in font-bold">
              {resetMessage}
            </div>
          )}

          {/* 1. Scenario Presets Selection */}
          <div className="p-6 rounded-2xl bg-[#17162E] border border-[#352C5E] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-brand-cyan flex items-center gap-2">
                <IconSparkles size={16} color="var(--brand-cyan)" />
                <span>1-Click Scenario Presets (สำหรับสาธิตบนเวที 5 นาที):</span>
              </h2>
              <span className="text-xs font-mono text-text-muted">
                Preset ปัจจุบัน: <strong className="text-brand-mango">{state.activePreset}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {presets.map((p) => (
                <div
                  key={p.name}
                  className={`p-4 rounded-xl border flex flex-col justify-between gap-4 transition-all ${
                    state.activePreset === p.name
                      ? 'bg-brand-purple/20 border-brand-purple ring-2 ring-brand-purple'
                      : 'bg-[#0D1025] border-[#352C5E] hover:border-brand-purple/40'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-sm text-text-primary">
                        {p.name}
                      </h3>
                      <span className="text-[10px] font-mono bg-brand-purple/30 text-brand-purple px-2 py-0.5 rounded">
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{p.desc}</p>
                  </div>

                  <PixelButton
                    variant={state.activePreset === p.name ? 'mango' : 'secondary'}
                    size="sm"
                    className="w-full font-bold"
                    onClick={() => handleApplyPreset(p.name)}
                  >
                    {state.activePreset === p.name ? 'กำลังใช้งาน ✓' : 'เปิดใช้งาน Preset ⚡'}
                  </PixelButton>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Direct Route Quick Jump Links */}
          <div className="p-6 rounded-2xl bg-[#17162E] border border-[#352C5E] space-y-4">
            <h2 className="text-sm font-display font-bold text-text-primary">
              ทางลัดเข้าสู่แต่ละหน้าจอ (Direct Screen Jump):
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <button
                onClick={() => {
                  setUserRole('candidate');
                  navigate('/event/demo');
                }}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-cyan text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-cyan">SC-01</div>
                <div className="font-bold font-display mt-0.5">Event Landing</div>
              </button>

              <button
                onClick={() => {
                  setUserRole('candidate');
                  navigate('/candidate/avatar');
                }}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-purple text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-purple">SC-05</div>
                <div className="font-bold font-display mt-0.5">Character Studio</div>
              </button>

              <button
                onClick={() => {
                  setUserRole('candidate');
                  navigate('/app/events/demo/world');
                }}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-pink text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-pink">SC-06</div>
                <div className="font-bold font-display mt-0.5">Career Hall World</div>
              </button>

              <button
                onClick={() => {
                  setUserRole('candidate');
                  navigate('/app/events/demo/navigator');
                }}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-mango text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-mango">SC-07</div>
                <div className="font-bold font-display mt-0.5">Navigator Mode</div>
              </button>

              <button
                onClick={() => navigate('/app/interviews/demo/preflight')}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-cyan text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-cyan">SC-10</div>
                <div className="font-bold font-display mt-0.5">Interview Preflight</div>
              </button>

              <button
                onClick={() => navigate('/app/interviews/demo')}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-purple text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-purple">SC-11</div>
                <div className="font-bold font-display mt-0.5">Speed Interview</div>
              </button>

              <button
                onClick={() => {
                  setUserRole('recruiter');
                  navigate('/recruiter/demo/dashboard');
                }}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-pink text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-pink">SC-15</div>
                <div className="font-bold font-display mt-0.5">Recruiter Desk</div>
              </button>

              <button
                onClick={() => {
                  setUserRole('admin');
                  navigate('/ops/events/demo/live');
                }}
                className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] hover:border-brand-mango text-left text-text-muted hover:text-text-primary"
              >
                <div className="font-mono text-brand-mango">SC-16</div>
                <div className="font-bold font-display mt-0.5">Admin Ops Portal</div>
              </button>
            </div>
          </div>
        </main>
      </div>

      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
      />
    </div>
  );
};
