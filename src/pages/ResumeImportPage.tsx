import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { parseAndRedactResume } from '../lib/resume-parser';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { IconSparkles, IconShieldCheck, IconLock } from '../components/common/PixelIcons';

export const ResumeImportPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateCandidateProfile } = useAppStore();

  const [rawText, setRawText] = useState<string>(
    `สมชาย ประเสริฐดี (Somchai Prasertdee)
อีเมล: candidate@example.test | โทร: 081-234-5678
การศึกษา: ปริญญาตรี วิศวกรรมคอมพิวเตอร์ King Mongkut's University of Technology
ประสบการณ์ทำงาน: TechCo Innovations Thailand Co., Ltd. (Senior Backend Engineer)

ทักษะและความเชี่ยวชาญ:
- พัฒนา Backend Microservices ด้วย Node.js และ TypeScript รองรับผู้ใช้งาน 50k+ คนต่อวัน
- ออกแบบระบบ IoT Ingestion Pipeline ด้วย MQTT รับส่งข้อมูลเซ็นเซอร์ 2,000,000 events/วัน พร้อม uptime 99.95%
- ประสบการณ์ใช้งาน Redis และ BullMQ สำหรับ Distributed Queue ลดความหน่วง API เหลือ 45ms
- จัดการฐานข้อมูล PostgreSQL ปรับแต่ง Database Indexing และ Connection Pooling`
  );

  const [isProcessing, setIsProcessing] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');

  const handleProcessResume = () => {
    setIsProcessing(true);
    setScanStep('🔍 กำลังสแกนความปลอดภัย (Malware & Content Security)...');

    setTimeout(() => {
      setScanStep('🛡️ กำลังตรวจจับและปิดบังข้อมูล PII (Name, Email, Phone, School)...');
      setTimeout(() => {
        setScanStep('⚡ AI กำลังสกัดทักษะ (Must-have Skills) และหลักฐานผลงาน...');
        setTimeout(() => {
          const parsed = parseAndRedactResume(rawText);
          updateCandidateProfile({
            skills: parsed.extractedSkills,
            evidence: parsed.extractedEvidence,
            hiddenPiiData: parsed.detectedPii
          });
          navigate('/candidate/profile/review');
        }, 600);
      }, 600);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between text-xs font-display text-text-muted pb-2 border-b border-[#352C5E]">
            <span className="text-brand-cyan font-bold">ขั้นตอนที่ 2 จาก 3</span>
            <span>นำเข้า Resume & ทักษะผลงาน (Resume Import)</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text-primary flex items-center gap-3">
              <IconSparkles size={28} color="var(--brand-purple)" />
              <span>นำเข้าประวัติและทักษะเพื่อสร้าง Masked Profile</span>
            </h1>
            <p className="text-sm text-text-muted">
              เลือกนำเข้า Resume ตัวอย่างมาตรฐานสำหรับ Demo หรือวางข้อความประวัติของคุณ เพื่อให้ AI ปิดบังข้อมูลส่วนบุคคลและสกัดทักษะจริง
            </p>
          </div>

          {/* Quick 1-Click Sample Button */}
          <div className="p-4 rounded-xl bg-brand-purple/15 border border-brand-purple/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-display font-bold text-sm text-text-primary">
                ✨ ใช้ชุดข้อมูลมาตรฐาน Candidate #8F3A (แนะนำสำหรับการทดสอบ)
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                ประวัติสาย Backend / IoT / Distributed Systems ที่ตรงกับโจทย์ Cyber Orchard 92%
              </div>
            </div>
            <PixelButton
              variant="mango"
              size="md"
              className="flex-shrink-0"
              onClick={handleProcessResume}
              disabled={isProcessing}
            >
              1-Click นำเข้าทันที ⚡
            </PixelButton>
          </div>

          {/* Text Editor Box */}
          <div className="space-y-2">
            <label className="text-xs font-display font-semibold text-text-muted block">
              ข้อความ Resume / ประวัติการทำงาน:
            </label>
            <textarea
              rows={9}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#17162E] border border-[#352C5E] text-text-primary font-mono text-xs focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none leading-relaxed"
              placeholder="วางข้อความ Resume ที่นี่..."
            />
          </div>

          {/* Processing Status Dialog */}
          {isProcessing && (
            <div className="p-4 rounded-xl bg-[#262047] border border-brand-purple text-center space-y-3 animate-pulse">
              <div className="text-sm font-display font-bold text-brand-cyan">
                {scanStep}
              </div>
              <div className="w-full h-2 bg-[#17162E] rounded-full overflow-hidden">
                <div className="h-full bg-brand-purple animate-pulse w-3/4" />
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isProcessing && (
            <div className="flex gap-4">
              <PixelButton
                variant="primary"
                size="lg"
                className="w-full text-base font-bold"
                onClick={handleProcessResume}
              >
                ประมวลผลและปิดบังข้อมูล PII 🛡️
              </PixelButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
