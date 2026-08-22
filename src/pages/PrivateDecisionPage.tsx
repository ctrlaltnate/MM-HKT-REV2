import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { IconLock, IconCheck, IconAlert } from '../components/common/PixelIcons';

export const PrivateDecisionPage: React.FC = () => {
  const navigate = useNavigate();
  const { state, submitPrivateDecision } = useAppStore();

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const decisionCase = state.activeDecisionCase || {
    id: 'case_demo',
    sessionId: 'sess_demo',
    jobId: 'job-backend-01',
    boothId: 'company-cyber-orchard',
    companyName: 'Cyber Orchard Co.',
    jobTitle: 'Backend Developer',
    candidateCode: state.candidateProfile.candidateCode,
    candidateDecision: null,
    recruiterDecision: null,
    state: 'AWAITING_DECISIONS',
    revealedFields: []
  };

  useEffect(() => {
    if (decisionCase.candidateDecision !== null) {
      setHasSubmitted(true);
    }
    if (decisionCase.state === 'MUTUAL_MATCH' || decisionCase.state === 'NO_MATCH') {
      navigate('/app/matches/demo/result');
    }
  }, [decisionCase, navigate]);

  const handleSubmit = (choice: 'INTERESTED' | 'PASS') => {
    submitPrivateDecision('candidate', choice);
    setHasSubmitted(true);

    // Auto-resolve demo flow if recruiter has not yet submitted
    setTimeout(() => {
      if (!state.activeDecisionCase?.recruiterDecision) {
        submitPrivateDecision('recruiter', 'INTERESTED');
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        <div className="max-w-xl mx-auto px-4 py-12 space-y-8">
          <div className="space-y-3 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 border-2 border-brand-purple mx-auto flex items-center justify-center text-brand-purple">
              <IconLock size={28} color="var(--brand-purple)" />
            </div>

            <h1 className="text-2xl font-display font-bold text-text-primary">
              ส่งผลการตัดสินใจส่วนตัว (Private Decision)
            </h1>

            <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
              Cyber Orchard Co. • Backend Developer
              <br />
              การเลือกของคุณจะถูกเข้ารหัสแบบ <strong>Double-Blind</strong> อีกฝ่ายจะไม่เห็นคำตอบของคุณจนกว่าจะส่งคำตอบครบทั้งคู่
            </p>
          </div>

          {!hasSubmitted ? (
            <div className="p-6 rounded-2xl bg-[#17162E] border border-[#352C5E] space-y-6">
              <div className="text-xs text-center text-text-muted">
                คุณต้องการไปต่อในการสัมภาษณ์รอบถัดไปกับตำแหน่งนี้หรือไม่?
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PixelButton
                  variant="accent"
                  size="lg"
                  className="font-bold text-base py-5 shadow-lg shadow-cyan-950/40"
                  onClick={() => handleSubmit('INTERESTED')}
                >
                  💚 สนใจไปต่อ (Interested)
                </PixelButton>

                <PixelButton
                  variant="ghost"
                  size="lg"
                  className="font-bold text-base py-5 hover:bg-red-950/20 text-status-danger border border-status-danger/40"
                  onClick={() => handleSubmit('PASS')}
                >
                  ✕ ยังไม่ไปต่อ (Pass)
                </PixelButton>
              </div>

              <div className="text-[11px] text-text-muted bg-[#0D1025] p-3 rounded border border-[#352C5E] text-center">
                🔒 หากเลือกไม่ไปต่อ ระบบจะแจ้งผลอย่างสุภาพ โดยไม่เปิดเผยว่าใครเป็นผู้เลือกปฏิเสธ
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-[#17162E] border-2 border-brand-purple text-center space-y-4 shadow-xl">
              <div className="w-10 h-10 border-4 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto" />
              <h3 className="text-base font-display font-bold text-text-primary">
                บันทึกคำตอบของคุณเรียบร้อยแล้ว
              </h3>
              <p className="text-xs text-text-muted">
                กำลังรอผลการตัดสินใจจากฝั่งผู้สัมภาษณ์ (Recruiter #R12)...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
