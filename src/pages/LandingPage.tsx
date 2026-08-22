import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { ApiSettingsModal } from '../components/common/ApiSettingsModal';
import { IconUser, IconBriefcase, IconSettings, IconShieldCheck, IconLock, IconSparkles, IconCompass, IconArrowRight } from '../components/common/PixelIcons';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, setUserRole } = useAppStore();
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);

  const handleRoleSelect = (role: 'candidate' | 'recruiter' | 'admin') => {
    setUserRole(role);
    if (role === 'candidate') {
      navigate('/app/onboarding/verify');
    } else if (role === 'recruiter') {
      navigate('/recruiter/demo/dashboard');
    } else if (role === 'admin') {
      navigate('/ops/events/demo/live');
    }
  };

  return (
    <div className="min-h-screen bg-[#070816] text-[#F8F7FF] flex flex-col justify-between selection:bg-[#8B5CF6] selection:text-white">
      <div>
        <DemoBanner />

        {/* 1-Click Multi-Role Demo Switcher Navigation Bar */}
        <div className="w-full bg-[#17162E]/90 backdrop-blur-md border-b border-[#352C5E] py-3.5 px-4 shadow-xl sticky top-0 z-30">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-display">
              <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></span>
              <span className="text-[#FFD84D] font-bold tracking-wider uppercase">1-CLICK DEMO ACCESS:</span>
              <span className="text-[#BBB6D5]">เลือกบทบาทเพื่อเริ่มทดสอบทันที:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <PixelButton
                variant={state.userRole === 'candidate' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleRoleSelect('candidate')}
                leftIcon={<IconUser size={15} color="currentColor" />}
              >
                👤 ผู้สมัคร (Candidate)
              </PixelButton>
              <PixelButton
                variant={state.userRole === 'recruiter' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleRoleSelect('recruiter')}
                leftIcon={<IconBriefcase size={15} color="currentColor" />}
              >
                💼 ผู้สัมภาษณ์ (Recruiter)
              </PixelButton>
              <PixelButton
                variant={state.userRole === 'admin' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => handleRoleSelect('admin')}
                leftIcon={<IconSettings size={15} color="currentColor" />}
              >
                ⚙️ ผู้ดูแลระบบ (Admin Ops)
              </PixelButton>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <main className="max-w-5xl mx-auto px-4 py-16 sm:py-24 text-center space-y-10">
          {/* Top Tag Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 text-[#A78BFA] font-display text-xs font-semibold shadow-lg shadow-purple-950/40">
            <IconSparkles size={15} color="var(--brand-purple)" />
            <span>INTERACTIVE 8-BIT VIRTUAL JOB FAIR & ANONYMOUS SPEED INTERVIEW</span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black tracking-tight text-white leading-none">
              SKILLS FIRST. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4FD8] via-[#FF88EC] to-[#37E7FF]">BIAS LAST.</span>
            </h1>
            <p className="text-lg sm:text-2xl text-[#BBB6D5] max-w-3xl mx-auto font-display font-medium leading-relaxed">
              “ปฏิวัติวงการหางาน เปลี่ยนศักยภาพที่แท้จริง ให้มีค่ากว่าหน้ากระดาษ”
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-[#BBB6D5]/90 max-w-2xl mx-auto leading-relaxed font-body">
            เดินสำรวจ <strong className="text-[#37E7FF] font-semibold">Neon Career Hall</strong> ด้วยตัวละคร 8-bit, 
            เข้าคิวสัมภาษณ์ Speed Interview ด้วย <strong className="text-[#FF4FD8] font-semibold">กล้องจริง + Realtime Face Mask</strong> และ 
            <strong className="text-[#FFD84D] font-semibold"> ระบบดัดเสียงจริง (DSP)</strong> บนเบราว์เซอร์ของคุณ 100%
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <PixelButton
              variant="accent"
              size="lg"
              className="w-full sm:w-auto text-base font-extrabold px-8 py-4 shadow-xl shadow-cyan-950/80 hover:scale-105"
              onClick={() => handleRoleSelect('candidate')}
              rightIcon={<IconArrowRight size={18} color="currentColor" />}
            >
              เข้าสู่งานเสมือนจริง (Demo Job Fair) ⚡
            </PixelButton>
            <PixelButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-base px-6 py-4 hover:scale-105"
              onClick={() => navigate('/app/events/demo/navigator')}
              leftIcon={<IconCompass size={20} color="var(--brand-cyan)" />}
            >
              ดูรายชื่อตำแหน่งงานทั้งหมด (Navigator)
            </PixelButton>
          </div>

          {/* 3 Core Experience Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
            <div className="p-6 rounded-2xl bg-[#17162E]/90 border border-[#352C5E] hover:border-[#8B5CF6] transition-all duration-300 shadow-xl hover:shadow-purple-950/50 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6]">
                <IconLock size={24} color="var(--brand-purple)" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Blind Candidate Profile
              </h3>
              <p className="text-xs text-[#BBB6D5] leading-relaxed">
                ซ่อนชื่อจริง รูปถ่าย เพศ สถาบัน และข้อมูลส่วนบุคคล เพื่อให้การประเมินรอบแรกวัดจากทักษะและผลงานจริง 100%
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#17162E]/90 border border-[#352C5E] hover:border-[#37E7FF] transition-all duration-300 shadow-xl hover:shadow-cyan-950/50 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#37E7FF]/20 border border-[#37E7FF]/40 flex items-center justify-center text-[#37E7FF]">
                <IconShieldCheck size={24} color="var(--brand-cyan)" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Realtime Face Mask & DSP
              </h3>
              <p className="text-xs text-[#BBB6D5] leading-relaxed">
                กล้องจริงจับการขยับใบหน้าครอบทับหน้ากากสัตว์ พร้อมดัดเสียงสดผ่าน Web Audio API ประมวลผลบนเครื่องผู้ใช้ ปลอดภัย ไร้กังวล
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#17162E]/90 border border-[#352C5E] hover:border-[#FF4FD8] transition-all duration-300 shadow-xl hover:shadow-pink-950/50 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#FF4FD8]/20 border border-[#FF4FD8]/40 flex items-center justify-center text-[#FF4FD8]">
                <IconSparkles size={24} color="var(--brand-pink)" />
              </div>
              <h3 className="text-base font-display font-bold text-white">
                Double-Blind & Consented Reveal
              </h3>
              <p className="text-xs text-[#BBB6D5] leading-relaxed">
                การตัดสินใจสัมภาษณ์เป็นความลับทั้งสองฝ่าย ข้อมูลติดต่อจะเปิดเผยเฉพาะเมื่อเกิด Mutual Match และผู้สมัครยินยอมเท่านั้น
              </p>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#17162E] border-t border-[#352C5E] py-6 px-4 text-center text-xs text-[#BBB6D5]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-display font-semibold text-white">
            MaskedMatch v2.1 • Skills First. Bias Last.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsApiSettingsOpen(true)}
              className="hover:text-[#37E7FF] text-[#37E7FF] font-mono flex items-center gap-1 transition-colors"
            >
              <IconSettings size={14} color="var(--brand-cyan)" />
              <span>[⚙️ API Settings]</span>
            </button>
            <button
              onClick={() => navigate('/demo/control')}
              className="hover:text-[#FFD84D] text-[#FFD84D] font-mono transition-colors"
            >
              [⚙️ Demo Controller]
            </button>
            <span>PDPA & WCAG 2.2 AA Compliant</span>
          </div>
        </div>
      </footer>

      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
      />
    </div>
  );
};
