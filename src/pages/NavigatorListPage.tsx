import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { ExhibitorBooth, JobPosting } from '../types';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { MatchScoreCard } from '../components/booth/MatchScoreCard';
import { BoothDetailModal } from '../components/booth/BoothDetailModal';
import { QueueChipHUD } from '../components/queue/QueueChipHUD';
import { ReadyCheckAlertDialog } from '../components/queue/ReadyCheckAlertDialog';
import { BlindModeBadge } from '../components/common/BlindModeBadge';
import { IconSearch, IconCompass, IconClock, IconCode, IconCheck, IconUser } from '../components/common/PixelIcons';

export const NavigatorListPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    joinQueue,
    leaveQueue,
    respondReadyCheck
  } = useAppStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('ALL');
  const [selectedBooth, setSelectedBooth] = useState<ExhibitorBooth | null>(null);
  const [isReadyCheckOpen, setIsReadyCheckOpen] = useState(false);

  React.useEffect(() => {
    if (state.activeTicket?.state === 'READY_CHECK') {
      setIsReadyCheckOpen(true);
    }
  }, [state.activeTicket?.state]);

  const handleAcceptReadyCheck = () => {
    respondReadyCheck('ACCEPT');
    setIsReadyCheckOpen(false);
    navigate('/app/interviews/demo/preflight');
  };

  // Filter booths and jobs
  const allJobs: { booth: ExhibitorBooth; job: JobPosting }[] = [];
  state.booths.forEach((b) => {
    if (selectedZone === 'ALL' || b.zone === selectedZone) {
      b.activeJobs.forEach((j) => {
        const matchesSearch =
          j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          j.mustHaveSkills.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

        if (matchesSearch) {
          allJobs.push({ booth: b, job: j });
        }
      });
    }
  });

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        {/* Top Navigator Header */}
        <header className="w-full bg-[#17162E] border-b border-[#352C5E] px-4 py-3 shadow-lg">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-lg tracking-wider text-text-primary">
                MASKED<span className="text-brand-purple">MATCH</span>
              </span>
              <span className="text-xs font-mono text-brand-cyan bg-[#0D1025] px-2.5 py-0.5 rounded border border-brand-cyan/40">
                NAVIGATOR / LIST MODE
              </span>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-3">
              <div className="flex bg-[#0D1025] p-1 rounded-lg border border-[#352C5E]">
                <button
                  onClick={() => navigate('/app/events/demo/world')}
                  className="px-3 py-1 text-text-muted hover:text-text-primary text-xs font-display transition-colors"
                >
                  🌐 แผนที่เสมือน (World)
                </button>
                <button
                  className="px-3 py-1 bg-brand-purple text-white text-xs font-display font-semibold rounded-md shadow flex items-center gap-1"
                >
                  <IconCompass size={12} color="currentColor" />
                  <span>📋 โหมดรายการ (Navigator)</span>
                </button>
              </div>

              <BlindModeBadge />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          {/* Search & Zone Filter Bar */}
          <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Box */}
            <div className="relative w-full md:w-96">
              <IconSearch size={16} color="var(--text-muted)" className="absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อตำแหน่ง, บริษัท หรือทักษะ (เช่น Node.js)..."
                className="w-full pl-9 pr-4 py-2 bg-[#0D1025] border border-[#352C5E] rounded-lg text-xs font-display text-text-primary focus:border-brand-purple outline-none"
              />
            </div>

            {/* Zone Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
              <span className="text-xs text-text-muted font-display mr-1">โซน:</span>
              {['ALL', 'A1', 'A2', 'B1', 'B2'].map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-colors ${
                    selectedZone === zone
                      ? 'bg-brand-purple text-white'
                      : 'bg-[#0D1025] text-text-muted hover:text-text-primary border border-[#352C5E]'
                  }`}
                >
                  {zone === 'ALL' ? 'ทุกโซน' : `Zone ${zone}`}
                </button>
              ))}
            </div>
          </div>

          {/* Jobs & Booths Results List */}
          <div className="space-y-4">
            <div className="text-xs font-display text-text-muted flex justify-between">
              <span>พบตำแหน่งงานที่ตรงตามเงื่อนไข: {allJobs.length} รายการ</span>
              <span>เรียงตามคะแนนความตรงกัน (Match Score)</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {allJobs
                .sort((a, b) => b.job.matchScore - a.job.matchScore)
                .map(({ booth, job }) => {
                  const isQueued = state.activeTicket?.jobId === job.id;

                  return (
                    <div
                      key={job.id}
                      className="p-5 rounded-xl bg-[#17162E] border border-[#352C5E] hover:border-brand-purple/60 transition-all shadow-md space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono bg-brand-purple/20 text-brand-purple px-2 py-0.5 rounded border border-brand-purple/40">
                              ZONE {booth.zone}
                            </span>
                            <span className="text-xs font-mono text-brand-cyan">{booth.companyName}</span>
                          </div>
                          <h3 className="text-base font-display font-bold text-text-primary mt-1">
                            {job.title}
                          </h3>
                          <div className="text-xs text-brand-mango font-mono mt-0.5">
                            {job.salaryRange} • {job.workMode} • {job.location}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <PixelButton
                            variant={isQueued ? 'secondary' : 'accent'}
                            size="md"
                            disabled={isQueued}
                            onClick={() => joinQueue(job.id, booth.id)}
                          >
                            {isQueued ? 'อยู่ในคิวแล้ว ⚡' : 'เข้าคิวสัมภาษณ์ ⚡'}
                          </PixelButton>
                          <button
                            onClick={() => setSelectedBooth(booth)}
                            className="px-3 py-2 text-xs font-display text-brand-cyan hover:underline bg-[#0D1025] rounded-md border border-[#352C5E]"
                          >
                            ดูรายละเอียดบูธ
                          </button>
                        </div>
                      </div>

                      {/* Explainable Match Card */}
                      <MatchScoreCard job={job} />

                      {/* Must-have skills badges */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#352C5E]/60 text-xs">
                        <span className="text-text-muted">Must-have:</span>
                        {job.mustHaveSkills.map((m) => (
                          <span
                            key={m}
                            className="px-2 py-0.5 bg-[#262047] text-text-primary rounded font-mono text-[11px]"
                          >
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      </div>

      {/* Floating Queue HUD */}
      <QueueChipHUD
        ticket={state.activeTicket}
        onOpenReadyCheck={() => setIsReadyCheckOpen(true)}
        onLeaveQueue={leaveQueue}
      />

      {/* Booth Detail Modal */}
      <BoothDetailModal
        booth={selectedBooth}
        isOpen={!!selectedBooth}
        onClose={() => setSelectedBooth(null)}
        onJoinQueue={joinQueue}
        isQueuedForThisBooth={state.activeTicket?.boothId === selectedBooth?.id}
      />

      {/* Ready Check Alert Dialog */}
      <ReadyCheckAlertDialog
        ticket={state.activeTicket}
        isOpen={isReadyCheckOpen}
        onAccept={handleAcceptReadyCheck}
        onSnooze={() => {
          respondReadyCheck('SNOOZE');
          setIsReadyCheckOpen(false);
        }}
        onDecline={() => {
          respondReadyCheck('DECLINE');
          setIsReadyCheckOpen(false);
        }}
      />
    </div>
  );
};
