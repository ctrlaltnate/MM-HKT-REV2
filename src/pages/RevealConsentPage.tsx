import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { IconLock, IconCheck, IconMail, IconPhone, IconCode, IconShieldCheck } from '../components/common/PixelIcons';

export const RevealConsentPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, updateRevealConsent } = useAppStore();
  const profile = state.candidateProfile;
  const decisionCase = state.activeDecisionCase;

  const [selectedFields, setSelectedFields] = useState<Array<'email' | 'phone' | 'portfolio' | 'fullResume'>>([
    'email',
    'portfolio'
  ]);
  const [isSaved, setIsSaved] = useState(false);

  const toggleField = (field: 'email' | 'phone' | 'portfolio' | 'fullResume') => {
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter((f) => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  const handleSave = () => {
    updateRevealConsent(selectedFields);
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
          <div className="space-y-2 text-center">
            <span className="text-xs font-mono text-brand-pink bg-brand-pink/15 px-3 py-1 rounded-full border border-brand-pink/40">
              CONSENSED FIELD-LEVEL REVEAL
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary">
              ยินยอมเปิดเผยข้อมูลติดต่อ (Field Reveal)
            </h1>
            <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
              Cyber Orchard Co. • Backend Developer
              <br />
              คุณเป็นผู้ควบคุม 100% ว่าจะเปิดเผยช่องทางติดต่อใดให้บริษัทเพื่อประสานงานรอบต่อไป
            </p>
          </div>

          {!isSaved ? (
            <div className="p-6 rounded-2xl bg-[#17162E] border border-[#352C5E] space-y-6">
              <span className="text-xs font-display font-bold text-text-muted block">
                เลือกข้อมูลที่คุณยินยอมเปิดเผย (Check to Reveal):
              </span>

              <div className="space-y-3">
                {/* 1. Email */}
                <label
                  onClick={() => toggleField('email')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedFields.includes('email')
                      ? 'bg-brand-purple/20 border-brand-purple ring-1 ring-brand-purple'
                      : 'bg-[#0D1025] border-[#352C5E] hover:border-brand-purple/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconMail size={20} color="var(--brand-cyan)" />
                    <div>
                      <div className="font-display font-bold text-xs text-text-primary">
                        อีเมลติดต่อ (Email Address)
                      </div>
                      <div className="text-[11px] font-mono text-text-muted">
                        {profile.hiddenPiiData.email}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes('email')}
                    readOnly
                    className="w-4 h-4 accent-brand-purple"
                  />
                </label>

                {/* 2. Phone */}
                <label
                  onClick={() => toggleField('phone')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedFields.includes('phone')
                      ? 'bg-brand-purple/20 border-brand-purple ring-1 ring-brand-purple'
                      : 'bg-[#0D1025] border-[#352C5E] hover:border-brand-purple/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconPhone size={20} color="var(--brand-mango)" />
                    <div>
                      <div className="font-display font-bold text-xs text-text-primary">
                        เบอร์โทรศัพท์ (Phone Number)
                      </div>
                      <div className="text-[11px] font-mono text-text-muted">
                        {profile.hiddenPiiData.phone}
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes('phone')}
                    readOnly
                    className="w-4 h-4 accent-brand-purple"
                  />
                </label>

                {/* 3. Portfolio */}
                <label
                  onClick={() => toggleField('portfolio')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedFields.includes('portfolio')
                      ? 'bg-brand-purple/20 border-brand-purple ring-1 ring-brand-purple'
                      : 'bg-[#0D1025] border-[#352C5E] hover:border-brand-purple/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconCode size={20} color="var(--brand-pink)" />
                    <div>
                      <div className="font-display font-bold text-xs text-text-primary">
                        ผลงานเด่น & ลิงก์ GitHub (Portfolio Link)
                      </div>
                      <div className="text-[11px] font-mono text-text-muted">
                        github.com/synthetic-demo/iot-pipeline
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes('portfolio')}
                    readOnly
                    className="w-4 h-4 accent-brand-purple"
                  />
                </label>

                {/* 4. Full Resume */}
                <label
                  onClick={() => toggleField('fullResume')}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    selectedFields.includes('fullResume')
                      ? 'bg-brand-purple/20 border-brand-purple ring-1 ring-brand-purple'
                      : 'bg-[#0D1025] border-[#352C5E] hover:border-brand-purple/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconLock size={20} color="var(--status-success)" />
                    <div>
                      <div className="font-display font-bold text-xs text-text-primary">
                        Resume ฉบับเต็ม (Full Unmasked Resume)
                      </div>
                      <div className="text-[11px] text-text-muted">
                        เปิดเผยชื่อจริง, สถาบันการศึกษา และประวัติต้นฉบับ
                      </div>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedFields.includes('fullResume')}
                    readOnly
                    className="w-4 h-4 accent-brand-purple"
                  />
                </label>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <PixelButton
                  variant="accent"
                  size="lg"
                  className="w-full text-base font-bold shadow-xl shadow-cyan-950/60"
                  disabled={selectedFields.length === 0}
                  onClick={handleSave}
                >
                  ยืนยันการเปิดเผยข้อมูล ({selectedFields.length} รายการ) ⚡
                </PixelButton>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#17162E] border-2 border-brand-purple shadow-xl space-y-6">
              <div className="flex items-center gap-3 text-status-success font-display font-bold text-base">
                <IconShieldCheck size={24} color="var(--status-success)" />
                <span>บันทึกความยินยอมเปิดเผยข้อมูลเรียบร้อยแล้ว</span>
              </div>

              {/* Recruiter Reciprocal Contact Card */}
              {decisionCase?.recruiterContactGrant && (
                <div className="p-5 rounded-xl bg-[#0D1025] border border-brand-purple/50 space-y-3">
                  <span className="text-xs font-mono text-brand-cyan block">
                    ข้อมูลติดต่อกลับจากทีมผู้สัมภาษณ์ (Recruiter Reciprocal Grant):
                  </span>
                  <div className="space-y-1 text-xs">
                    <div className="font-display font-bold text-text-primary text-sm">
                      {decisionCase.recruiterContactGrant.recruiterName}
                    </div>
                    <div className="text-text-muted">
                      {decisionCase.recruiterContactGrant.recruiterRole}
                    </div>
                    <div className="font-mono text-brand-purple">
                      อีเมล: {decisionCase.recruiterContactGrant.recruiterEmail}
                    </div>
                  </div>

                  <div className="p-3 rounded bg-[#17162E] border border-[#352C5E] text-xs text-text-muted leading-relaxed">
                    📝 <strong>คำแนะนำขั้นตอนถัดไป:</strong> {decisionCase.recruiterContactGrant.nextStepsGuide}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <PixelButton
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold"
                  onClick={() => navigate('/app/events/demo/world')}
                >
                  กลับสู่ Career Hall 🌐
                </PixelButton>
                <PixelButton
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => navigate('/recruiter/demo/dashboard')}
                >
                  สลับไปดูฝั่ง Recruiter Desk 💼
                </PixelButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
