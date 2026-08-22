import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { BlindModeBadge } from '../components/common/BlindModeBadge';
import { IconBriefcase, IconUser, IconClock, IconCheck, IconShieldCheck, IconMail, IconPhone, IconCode, IconLock } from '../components/common/PixelIcons';

export const RecruiterDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    recruiterCallNextCandidate,
    recruiterSetAvailability,
    submitPrivateDecision
  } = useAppStore();

  const cyberBooth = state.booths.find((b) => b.id === 'company-cyber-orchard');
  const recruiter = cyberBooth?.recruiter || {
    id: 'rec_cyber_r12',
    codeName: 'Recruiter #R12 (Ploy)',
    title: 'Head of Backend Engineering',
    status: 'ONLINE' as const
  };

  const isQueued = state.activeTicket && state.activeTicket.jobId === 'job-backend-01';
  const isReady = state.activeTicket?.state === 'READY_CHECK';
  const isInSession = state.activeTicket?.state === 'IN_SESSION' || state.activeInterview?.state === 'LIVE';
  const isMutualMatched = state.activeDecisionCase?.state === 'MUTUAL_MATCH' || state.activeDecisionCase?.state === 'REVEALED';

  const [rubricNotes, setRubricNotes] = useState(
    'ผู้สมัครมีความเชี่ยวชาญด้าน Distributed Queue และ IoT Telemetry เป็นอย่างดี อธิบาย System Architecture ได้ชัดเจน'
  );

  const handleCallNext = () => {
    recruiterCallNextCandidate('job-backend-01');
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        {/* Recruiter Desk Header */}
        <header className="w-full bg-[#17162E] border-b border-[#352C5E] px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-brand-purple/20 border border-brand-purple flex items-center justify-center text-brand-purple">
                <IconBriefcase size={18} color="var(--brand-purple)" />
              </div>
              <div>
                <div className="text-xs font-mono text-brand-cyan">RECRUITER LIVE DESK</div>
                <h1 className="text-sm font-display font-bold text-text-primary">
                  Cyber Orchard Co. • {recruiter.codeName}
                </h1>
              </div>
            </div>

            {/* Recruiter Status Switcher */}
            <div className="flex items-center gap-2">
              <div className="flex bg-[#0D1025] p-1 rounded-lg border border-[#352C5E]">
                {(['ONLINE', 'BREAK', 'OFFLINE'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => recruiterSetAvailability('company-cyber-orchard', st)}
                    className={`px-3 py-1 text-xs font-display font-semibold rounded-md transition-colors ${
                      recruiter.status === st
                        ? st === 'ONLINE'
                          ? 'bg-status-success text-black'
                          : st === 'BREAK'
                          ? 'bg-status-warning text-black'
                          : 'bg-status-danger text-white'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    ● {st}
                  </button>
                ))}
              </div>
              <BlindModeBadge />
            </div>
          </div>
        </header>

        {/* Main Recruiter Work Area */}
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Booth & Current Assignment */}
          <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-brand-purple">ZONE A1 • IoT & Cloud Systems</span>
              <h2 className="text-base font-display font-bold text-text-primary mt-0.5">
                ตำแหน่งที่รับผิดชอบ: Backend Developer (Distributed Systems)
              </h2>
              <div className="text-xs text-text-muted mt-0.5">
                ช่วงเงินเดือน: 45,000 – 70,000 บาท • เวลาสัมภาษณ์: 12 นาที/คน
              </div>
            </div>

            <div className="flex items-center gap-3">
              <PixelButton
                variant="accent"
                size="md"
                className="font-bold"
                disabled={!isQueued || isReady}
                onClick={handleCallNext}
              >
                {isReady ? 'กำลังรอผู้สมัครตอบรับ (60s)...' : '▶ เรียกผู้สมัครคนถัดไป (Call Next)'}
              </PixelButton>
              <PixelButton
                variant="secondary"
                size="md"
                onClick={() => navigate('/app/interviews/demo')}
              >
                📹 เข้าห้องสัมภาษณ์สด
              </PixelButton>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Realtime Queue Board */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-bold text-brand-cyan flex items-center gap-2">
                  <IconClock size={16} color="var(--brand-cyan)" />
                  <span>คิวรอสัมภาษณ์สด (Live Queue Board):</span>
                </h3>
                <span className="text-xs font-mono text-text-muted">
                  รออยู่ {cyberBooth?.queueCount || 0} คน
                </span>
              </div>

              <div className="space-y-3">
                {/* Active Waiting Ticket */}
                {isQueued && state.activeTicket && (
                  <div className="p-4 rounded-xl bg-[#17162E] border-2 border-brand-cyan shadow-lg shadow-cyan-950/30 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-status-success animate-ping"></span>
                        <span className="text-sm font-display font-bold text-text-primary">
                          {state.activeTicket.candidateCode}
                        </span>
                      </div>
                      <span className="text-xs font-mono text-brand-cyan bg-brand-cyan/15 px-2.5 py-0.5 rounded border border-brand-cyan/40">
                        Match 92% (High)
                      </span>
                    </div>

                    <div className="text-xs text-text-muted">
                      ทักษะเด่น: <strong className="text-brand-purple">Node.js, MQTT, Redis, Queue Systems</strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0D1025] border border-[#352C5E] text-[11px] text-text-muted">
                      ผลงาน: ออกแบบ IoT Telemetry Ingestion รองรับ 2,000,000 events/วัน
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-brand-mango font-mono">
                        สถานะ: {state.activeTicket.state}
                      </span>
                      <PixelButton
                        variant={isReady ? 'mango' : 'accent'}
                        size="sm"
                        disabled={isReady}
                        onClick={handleCallNext}
                      >
                        {isReady ? 'กำลังส่งเสียงเตือน...' : 'ส่ง Ready Check ⚡'}
                      </PixelButton>
                    </div>
                  </div>
                )}

                {/* Synthetic Secondary Queue Items */}
                <div className="p-3.5 rounded-xl bg-[#17162E]/70 border border-[#352C5E] space-y-1.5 opacity-80">
                  <div className="flex items-center justify-between text-xs font-display">
                    <span className="text-text-primary font-bold">2. Candidate #4B19</span>
                    <span className="text-brand-mango font-mono">Match 85%</span>
                  </div>
                  <div className="text-[11px] text-text-muted">
                    ทักษะ: Python, Kafka, PostgreSQL • รอมาแล้ว 6 นาที
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#17162E]/70 border border-[#352C5E] space-y-1.5 opacity-60">
                  <div className="flex items-center justify-between text-xs font-display">
                    <span className="text-text-primary font-bold">3. Candidate #E281</span>
                    <span className="text-brand-cyan font-mono">Match 78%</span>
                  </div>
                  <div className="text-[11px] text-text-muted">
                    ทักษะ: Go, TimescaleDB, Docker • รอมาแล้ว 11 นาที
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Mutual Matched Candidates Pipeline */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-display font-bold text-brand-pink flex items-center gap-2">
                  <IconShieldCheck size={16} color="var(--brand-pink)" />
                  <span>ผู้สมัครที่เกิด MUTUAL MATCH (Candidate Pipeline):</span>
                </h3>
                <span className="text-xs font-mono text-status-success">
                  {isMutualMatched ? '1 คนใหม่' : '0 คน'}
                </span>
              </div>

              {isMutualMatched ? (
                <div className="p-5 rounded-2xl bg-[#17162E] border-2 border-brand-pink shadow-xl shadow-pink-950/40 space-y-4 animate-scale-up">
                  <div className="flex items-center justify-between border-b border-[#352C5E] pb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-display font-bold text-text-primary">
                        {state.candidateProfile.candidateCode}
                      </span>
                      <span className="text-[10px] font-mono bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded border border-brand-pink/40">
                        MUTUAL MATCH
                      </span>
                    </div>
                    <span className="text-xs font-mono text-brand-cyan">Backend Developer</span>
                  </div>

                  {/* Consented Revealed Fields Display */}
                  <div className="space-y-2 text-xs">
                    <span className="font-display font-semibold text-text-muted block">
                      ข้อมูลติดต่อที่ผู้สมัครยินยอมเปิดเผย (Consented Fields):
                    </span>

                    {state.activeDecisionCase?.revealedFields.includes('email') ? (
                      <div className="p-2.5 rounded bg-[#0D1025] border border-brand-cyan/40 flex items-center justify-between font-mono">
                        <span className="text-text-muted flex items-center gap-1.5">
                          <IconMail size={14} color="var(--brand-cyan)" /> อีเมล:
                        </span>
                        <span className="text-brand-cyan font-bold">
                          {state.candidateProfile.hiddenPiiData.email}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2 rounded bg-[#0D1025] text-text-muted line-through">
                        อีเมล: [ผู้สมัครยังไม่ได้เปิดเผย]
                      </div>
                    )}

                    {state.activeDecisionCase?.revealedFields.includes('phone') ? (
                      <div className="p-2.5 rounded bg-[#0D1025] border border-brand-mango/40 flex items-center justify-between font-mono">
                        <span className="text-text-muted flex items-center gap-1.5">
                          <IconPhone size={14} color="var(--brand-mango)" /> เบอร์โทร:
                        </span>
                        <span className="text-brand-mango font-bold">
                          {state.candidateProfile.hiddenPiiData.phone}
                        </span>
                      </div>
                    ) : null}

                    {state.activeDecisionCase?.revealedFields.includes('portfolio') ? (
                      <div className="p-2.5 rounded bg-[#0D1025] border border-brand-pink/40 flex items-center justify-between font-mono">
                        <span className="text-text-muted flex items-center gap-1.5">
                          <IconCode size={14} color="var(--brand-pink)" /> Portfolio:
                        </span>
                        <span className="text-brand-pink font-bold">
                          github.com/synthetic-demo/iot-pipeline
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Rubric Evaluation Note */}
                  <div className="space-y-1.5 pt-2 border-t border-[#352C5E]">
                    <span className="text-xs font-display font-semibold text-text-muted block">
                      บันทึกการประเมิน (Rubric Notes):
                    </span>
                    <textarea
                      rows={3}
                      value={rubricNotes}
                      onChange={(e) => setRubricNotes(e.target.value)}
                      className="w-full p-2.5 rounded-lg bg-[#0D1025] border border-[#352C5E] text-xs font-display text-text-primary outline-none focus:border-brand-purple"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-[#17162E] border border-[#352C5E] text-center text-xs text-text-muted space-y-2">
                  <div className="w-12 h-12 rounded-xl bg-[#262047] mx-auto flex items-center justify-center text-2xl">
                    📁
                  </div>
                  <div>ยังไม่มีผู้สมัครที่เกิด Mutual Match ในขณะนี้</div>
                  <div className="text-[11px] text-text-muted/70">
                    เมื่อคุณและ Candidate ต่างกด "สนใจไปต่อ" ข้อมูลติดต่อจะปรากฏขึ้นที่นี่อัตโนมัติ
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
