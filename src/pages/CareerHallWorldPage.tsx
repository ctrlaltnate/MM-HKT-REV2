import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { ExhibitorBooth } from '../types';
import { SYNTHETIC_NPCS } from '../lib/fixtures';
import { CareerHallCanvas } from '../components/world/CareerHallCanvas';
import { BoothDetailModal } from '../components/booth/BoothDetailModal';
import { QueueChipHUD } from '../components/queue/QueueChipHUD';
import { ReadyCheckAlertDialog } from '../components/queue/ReadyCheckAlertDialog';
import { BlindModeBadge } from '../components/common/BlindModeBadge';
import { DialogWindow } from '../components/common/DialogWindow';
import { ApiSettingsModal } from '../components/common/ApiSettingsModal';
import { IconCompass, IconUser, IconSettings } from '../components/common/PixelIcons';

export const CareerHallWorldPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    joinQueue,
    leaveQueue,
    respondReadyCheck
  } = useAppStore();

  const [selectedBooth, setSelectedBooth] = useState<ExhibitorBooth | null>(null);
  const [activeNpc, setActiveNpc] = useState<(typeof SYNTHETIC_NPCS)[0] | null>(null);
  const [isReadyCheckOpen, setIsReadyCheckOpen] = useState(false);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState(false);

  // Trigger ready check modal if state transition happened
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

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        {/* Top Career Hall Navbar */}
        <header className="w-full bg-[#17162E] border-b border-[#352C5E] px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-display font-black text-lg tracking-wider text-text-primary">
                MASKED<span className="text-brand-purple">MATCH</span>
              </span>
              <span className="text-xs font-mono text-brand-cyan bg-[#0D1025] px-2.5 py-0.5 rounded border border-brand-cyan/40">
                NEON CAREER HALL
              </span>
            </div>

            {/* Mode Switcher & Candidate Code */}
            <div className="flex items-center gap-3">
              <div className="flex bg-[#0D1025] p-1 rounded-lg border border-[#352C5E]">
                <button
                  className="px-3 py-1 bg-brand-purple text-white text-xs font-display font-semibold rounded-md shadow"
                >
                  🌐 แผนที่เสมือน (World)
                </button>
                <button
                  onClick={() => navigate('/app/events/demo/navigator')}
                  className="px-3 py-1 text-text-muted hover:text-text-primary text-xs font-display transition-colors flex items-center gap-1"
                >
                  <IconCompass size={12} color="currentColor" />
                  <span>📋 โหมดรายการ (Navigator)</span>
                </button>
              </div>

              <div className="flex items-center gap-2 bg-[#262047] px-3 py-1.5 rounded-lg border border-brand-purple/40 text-xs">
                <IconUser size={14} color="var(--brand-cyan)" />
                <span className="font-mono font-bold text-text-primary">
                  {state.candidateProfile.candidateCode}
                </span>
              </div>

              <button
                onClick={() => setIsApiSettingsOpen(true)}
                title="ตั้งค่า API"
                className="p-2 rounded-lg bg-[#262047] hover:bg-[#352C5E] text-text-muted hover:text-brand-cyan border border-[#352C5E]"
              >
                <IconSettings size={16} color="currentColor" />
              </button>

              <BlindModeBadge />
            </div>
          </div>
        </header>

        {/* Live Broadcast Notice (if any) */}
        {state.eventState.broadcasts.length > 0 && (
          <div className="w-full bg-brand-purple/20 border-b border-brand-purple py-2 px-4 text-xs text-center font-display text-text-primary flex items-center justify-center gap-2">
            <span className="text-brand-mango font-bold">📢 ประกาศสด:</span>
            <span>{state.eventState.broadcasts[0].message}</span>
          </div>
        )}

        {/* Main 2D World Canvas Viewport */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <CareerHallCanvas
            avatarConfig={state.candidateProfile.avatarConfig}
            booths={state.booths}
            onSelectBooth={(b) => setSelectedBooth(b)}
            onTalkNpc={(npc) => setActiveNpc(npc)}
          />
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

      {/* NPC Dialogue Dialog */}
      <DialogWindow
        isOpen={!!activeNpc}
        onClose={() => setActiveNpc(null)}
        headerColor="mango"
        title={
          <div className="flex items-center gap-2 text-brand-mango font-display">
            <span>💬 บทสนทนากับ {activeNpc?.name}</span>
          </div>
        }
      >
        {activeNpc && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0D1025] border border-brand-mango/40 text-sm text-text-primary leading-relaxed font-display">
              "{activeNpc.dialogue}"
            </div>
            <div className="text-xs text-text-muted flex justify-between">
              <span>ตำแหน่ง: {activeNpc.role}</span>
              <button
                onClick={() => setActiveNpc(null)}
                className="text-brand-cyan hover:underline"
              >
                [ ปิดหน้าต่างสนทนา ]
              </button>
            </div>
          </div>
        )}
      </DialogWindow>

      {/* Ready Check Alert Dialog (60s countdown) */}
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

      {/* API Settings Modal */}
      <ApiSettingsModal
        isOpen={isApiSettingsOpen}
        onClose={() => setIsApiSettingsOpen(false)}
      />
    </div>
  );
};
