import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { IconShieldCheck, IconAlert, IconCheck, IconLock } from '../components/common/PixelIcons';

export const DigitalIdVerifyPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateCandidateProfile } = useAppStore();

  const [verifyMethod, setVerifyMethod] = useState<'thaid' | 'email_otp'>('thaid');
  const [consents, setConsents] = useState({
    resumeProcessing: true,
    realtimeMediaTransform: true,
    integritySignals: true,
    marketing: false
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const handleProceed = () => {
    setIsVerifying(true);
    setTimeout(() => {
      updateCandidateProfile({
        isVerified: true,
        verificationMethod: verifyMethod,
        assuranceLevel: verifyMethod === 'thaid' ? 'IAL2.3' : 'IAL1.0',
        consents
      });
      navigate('/candidate/profile/import');
    }, 600);
  };

  const isFormValid = consents.resumeProcessing && consents.realtimeMediaTransform;

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-display text-text-muted pb-2 border-b border-[#352C5E]">
            <span className="text-brand-cyan font-bold">ขั้นตอนที่ 1 จาก 3</span>
            <span>ยืนยันตัวตน (Digital ID) & ความยินยอม PDPA</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary flex items-center gap-3">
              <IconShieldCheck size={28} color="var(--brand-cyan)" />
              <span>ยืนยันตัวตนและการยินยอมตามมาตรฐาน PDPA</span>
            </h1>
            <p className="text-sm text-text-muted">
              เพื่อความปลอดภัยและการคุ้มครองข้อมูลส่วนบุคคล ระบบจะแยกจัดเก็บข้อมูลตัวตนจริงใน Identity Vault และสร้างรหัสจำลอง <strong className="text-brand-purple">Candidate #8F3A</strong> สำหรับใช้งานในงานแฟร์
            </p>
          </div>

          {/* Demo Mode Badge */}
          <div className="p-3.5 rounded-xl bg-brand-mango/10 border border-brand-mango/40 flex items-start gap-3">
            <IconAlert size={20} color="var(--brand-mango)" />
            <div className="text-xs text-brand-mango">
              <strong>โหมดสาธิต (Demo Simulation):</strong> การยืนยันตัวตนในขั้นตอนนี้เป็นการจำลองตามมาตรฐาน DOPA ThaID IAL 2.3 โดยไม่มีการเก็บเลขบัตรประชาชนจริง
            </div>
          </div>

          {/* Verification Method Selector */}
          <div className="space-y-3">
            <label className="text-xs font-display font-semibold text-text-muted block">
              เลือกวิธีการยืนยันตัวตน:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setVerifyMethod('thaid')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  verifyMethod === 'thaid'
                    ? 'bg-brand-purple/20 border-brand-purple ring-2 ring-brand-purple'
                    : 'bg-[#17162E] border-[#352C5E] hover:border-brand-purple/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-text-primary">
                    ThaID Digital ID
                  </span>
                  <span className="text-[10px] font-mono bg-brand-purple/30 text-brand-purple px-2 py-0.5 rounded">
                    IAL 2.3
                  </span>
                </div>
                <div className="text-xs text-text-muted mt-1">
                  ยืนยันผ่านแอปพลิเคชัน ThaID (จำลองผลสำเร็จทันที)
                </div>
              </button>

              <button
                type="button"
                onClick={() => setVerifyMethod('email_otp')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  verifyMethod === 'email_otp'
                    ? 'bg-brand-purple/20 border-brand-purple ring-2 ring-brand-purple'
                    : 'bg-[#17162E] border-[#352C5E] hover:border-brand-purple/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-sm text-text-primary">
                    Email OTP (สำรอง)
                  </span>
                  <span className="text-[10px] font-mono bg-[#262047] text-text-muted px-2 py-0.5 rounded">
                    IAL 1.0
                  </span>
                </div>
                <div className="text-xs text-text-muted mt-1">
                  สำหรับผู้สมัครต่างชาติ หรือผู้ไม่มี ThaID
                </div>
              </button>
            </div>
          </div>

          {/* Granular PDPA Consent Checkboxes */}
          <div className="p-5 rounded-xl bg-[#17162E] border border-[#352C5E] space-y-4">
            <h3 className="text-xs font-display font-bold text-brand-cyan flex items-center gap-2">
              <IconLock size={16} color="var(--brand-cyan)" />
              <span>ความยินยอมในการประมวลผลข้อมูลส่วนบุคคล (PDPA Consent):</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.resumeProcessing}
                  onChange={(e) =>
                    setConsents({ ...consents, resumeProcessing: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 accent-brand-purple"
                />
                <div className="text-xs">
                  <span className="font-bold text-text-primary">
                    ยินยอมให้ AI สกัดทักษะและปิดบังข้อมูลตัวตนจาก Resume (จำเป็น)
                  </span>
                  <p className="text-text-muted mt-0.5">
                    ระบบจะตัดชื่อ รูปถ่าย และข้อมูลติดต่อออกทั้งหมดเพื่อสร้าง Masked Profile
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.realtimeMediaTransform}
                  onChange={(e) =>
                    setConsents({ ...consents, realtimeMediaTransform: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 accent-brand-purple"
                />
                <div className="text-xs">
                  <span className="font-bold text-text-primary">
                    ยินยอมให้ประมวลผลกล้องและไมค์เพื่อใส่หน้ากากสัตว์และดัดเสียงจริง (จำเป็น)
                  </span>
                  <p className="text-text-muted mt-0.5">
                    ประมวลผลบนเครื่องของคุณ (Client-Side) 100% ไม่มีการบันทึกภาพหน้าจริงลงเซิร์ฟเวอร์
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consents.marketing}
                  onChange={(e) =>
                    setConsents({ ...consents, marketing: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 accent-brand-purple"
                />
                <div className="text-xs">
                  <span className="text-text-primary">
                    ยินยอมรับการแจ้งเตือนตำแหน่งงานและกิจกรรม Job Fair ในอนาคต (ทางเลือก)
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <PixelButton
              variant="accent"
              size="lg"
              className="w-full text-base font-bold"
              disabled={!isFormValid || isVerifying}
              isLoading={isVerifying}
              onClick={handleProceed}
            >
              ยืนยันตัวตนและดำเนินการต่อ ⚡
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
};
