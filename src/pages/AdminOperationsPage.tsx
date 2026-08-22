import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../lib/store';
import { DemoBanner } from '../components/common/DemoBanner';
import { PixelButton } from '../components/common/PixelButton';
import { IconSettings, IconBroadcast, IconAlert, IconCheck, IconShieldCheck } from '../components/common/PixelIcons';

export const AdminOperationsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    adminPauseEvent,
    adminResumeEvent,
    adminBroadcast
  } = useAppStore();

  const [broadcastInput, setBroadcastInput] = useState(
    'ยินดีต้อนรับสู่งาน Neon Career City 2026! คิวสัมภาษณ์รอบพิเศษกำลังเปิดรับสมัคร'
  );
  const [broadcastLevel, setBroadcastLevel] = useState<'info' | 'warning' | 'urgent'>('info');
  const [justSent, setJustSent] = useState(false);

  const isPaused = state.eventState.status === 'PAUSED';

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastInput.trim()) return;

    adminBroadcast(broadcastInput, broadcastLevel);
    setJustSent(true);
    setTimeout(() => setJustSent(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#070816] flex flex-col justify-between">
      <div>
        <DemoBanner />

        {/* Admin Portal Header */}
        <header className="w-full bg-[#17162E] border-b border-[#352C5E] px-4 py-3 shadow-lg">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-brand-mango/20 border border-brand-mango flex items-center justify-center text-brand-mango">
                <IconSettings size={18} color="var(--brand-mango)" />
              </div>
              <div>
                <div className="text-xs font-mono text-brand-mango">LIVE OPERATIONS & ADMIN PORTAL</div>
                <h1 className="text-sm font-display font-bold text-text-primary">
                  Neon Career City 2026 • Live Monitoring
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold ${
                  isPaused
                    ? 'bg-status-danger/20 text-status-danger border-status-danger'
                    : 'bg-status-success/20 text-status-success border-status-success'
                }`}
              >
                สถานะงาน: {state.eventState.status}
              </span>
            </div>
          </div>
        </header>

        {/* Main Admin View */}
        <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] space-y-1">
              <span className="text-xs text-text-muted font-display">ผู้ใช้งานในงาน (CCU):</span>
              <div className="text-2xl font-mono font-bold text-brand-cyan">
                {state.eventState.totalCcu} คน
              </div>
              <div className="text-[11px] text-status-success">● ปกติ (Peak 10k Ready)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] space-y-1">
              <span className="text-xs text-text-muted font-display">คิวกำลังรอรวม:</span>
              <div className="text-2xl font-mono font-bold text-brand-purple">
                {state.eventState.activeQueues} คิว
              </div>
              <div className="text-[11px] text-text-muted">4 บูธบริษัทจัดแสดง</div>
            </div>

            <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] space-y-1">
              <span className="text-xs text-text-muted font-display">ห้องสัมภาษณ์สด:</span>
              <div className="text-2xl font-mono font-bold text-brand-mango">
                {state.eventState.liveInterviews} ห้อง
              </div>
              <div className="text-[11px] text-text-muted">WebRTC SFU Active</div>
            </div>

            <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] space-y-1">
              <span className="text-xs text-text-muted font-display">เกิด Mutual Match:</span>
              <div className="text-2xl font-mono font-bold text-brand-pink">
                {state.eventState.mutualMatches} คู่
              </div>
              <div className="text-[11px] text-status-success">🎉 Success Rate 42%</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Emergency Controls & Live Broadcast */}
            <div className="lg:col-span-6 space-y-6">
              {/* Emergency Controls */}
              <div className="p-5 rounded-2xl bg-[#17162E] border border-[#352C5E] space-y-4">
                <h3 className="text-sm font-display font-bold text-text-primary flex items-center gap-2">
                  <IconAlert size={16} color="var(--status-danger)" />
                  <span>การควบคุมสถานการณ์ฉุกเฉิน (Emergency Event Controls):</span>
                </h3>

                <div className="flex gap-3">
                  {!isPaused ? (
                    <PixelButton
                      variant="danger"
                      size="md"
                      className="font-bold flex-1"
                      onClick={() => adminPauseEvent('ระบบปรับปรุงคิวชั่วคราว 5 นาที')}
                    >
                      ⏸ พักงานชั่วคราว (Pause Event)
                    </PixelButton>
                  ) : (
                    <PixelButton
                      variant="accent"
                      size="md"
                      className="font-bold flex-1"
                      onClick={adminResumeEvent}
                    >
                      ▶ เปิดงานตามปกติ (Resume Event)
                    </PixelButton>
                  )}
                </div>

                {isPaused && (
                  <div className="p-3 rounded bg-red-950/30 border border-status-danger text-xs text-status-danger">
                    เหตุผลการระงับ: {state.eventState.pauseReason}
                  </div>
                )}
              </div>

              {/* Live Broadcast Message Sender */}
              <form
                onSubmit={handleSendBroadcast}
                className="p-5 rounded-2xl bg-[#17162E] border-2 border-brand-purple shadow-lg shadow-purple-950/30 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-bold text-brand-purple flex items-center gap-2">
                    <IconBroadcast size={16} color="var(--brand-purple)" />
                    <span>ส่งข้อความประกาศด่วน (Live Broadcast Announcement):</span>
                  </h3>
                  {justSent && (
                    <span className="text-xs font-mono text-status-success">
                      ✓ ส่งประกาศแล้ว!
                    </span>
                  )}
                </div>

                <textarea
                  rows={3}
                  value={broadcastInput}
                  onChange={(e) => setBroadcastInput(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#0D1025] border border-[#352C5E] text-xs font-display text-text-primary outline-none focus:border-brand-purple"
                  placeholder="พิมพ์ข้อความประกาศถึงทุกคนในงาน..."
                />

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-text-muted">ระดับ:</span>
                    {(['info', 'warning', 'urgent'] as const).map((lvl) => (
                      <button
                        type="button"
                        key={lvl}
                        onClick={() => setBroadcastLevel(lvl)}
                        className={`px-2 py-0.5 rounded text-[11px] font-mono capitalize ${
                          broadcastLevel === lvl
                            ? 'bg-brand-purple text-white'
                            : 'bg-[#0D1025] text-text-muted border border-[#352C5E]'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <PixelButton
                    variant="accent"
                    size="sm"
                    className="font-bold"
                    type="submit"
                    leftIcon={<IconBroadcast size={14} color="var(--text-on-accent)" />}
                  >
                    📢 ส่งประกาศทันที
                  </PixelButton>
                </div>
              </form>
            </div>

            {/* Right: Booths & Safety Logs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Booth Status List */}
              <div className="p-5 rounded-2xl bg-[#17162E] border border-[#352C5E] space-y-3">
                <h3 className="text-sm font-display font-bold text-text-primary">
                  จัดการบูธในงาน (Booth Management):
                </h3>

                <div className="space-y-2">
                  {state.booths.map((booth) => (
                    <div
                      key={booth.id}
                      className="p-3 rounded-xl bg-[#0D1025] border border-[#352C5E] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-display font-bold text-text-primary flex items-center gap-2">
                          <span className="text-brand-purple font-mono">[{booth.zone}]</span>
                          <span>{booth.companyName}</span>
                        </div>
                        <div className="text-[11px] text-text-muted">
                          {booth.industry} • คิวรอ: {booth.queueCount} คน
                        </div>
                      </div>

                      <span className="text-xs font-mono text-status-success bg-status-success/15 px-2.5 py-0.5 rounded border border-status-success/30">
                        ● คิวเปิดปกติ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
