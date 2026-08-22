import React, { useState, useEffect } from 'react';
import { QueueTicket } from '../../types';
import { IconClock } from '../common/PixelIcons';

interface QueueChipHUDProps {
  ticket: QueueTicket | null;
  onOpenReadyCheck?: () => void;
  onLeaveQueue: () => void;
}

export const QueueChipHUD: React.FC<QueueChipHUDProps> = ({
  ticket,
  onOpenReadyCheck,
  onLeaveQueue
}) => {
  const [countdown, setCountdown] = useState<number>(0);

  useEffect(() => {
    if (!ticket) return;

    if (ticket.state === 'READY_CHECK' && ticket.readyCheckExpiresAt) {
      const targetTime = new Date(ticket.readyCheckExpiresAt).getTime();
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.round((targetTime - Date.now()) / 1000));
        setCountdown(remaining);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [ticket]);

  if (!ticket || ticket.state === 'COMPLETED') return null;

  const isReady = ticket.state === 'READY_CHECK';

  return (
    <div className="fixed top-20 right-4 z-40 animate-slide-left max-w-sm">
      <div
        className={`p-3.5 rounded-xl border-2 shadow-2xl backdrop-blur-lg flex items-center justify-between gap-3 ${
          isReady
            ? 'bg-[#17162E] border-brand-mango shadow-amber-950/60 animate-bounce-subtle'
            : 'bg-[#17162E]/95 border-brand-purple shadow-purple-950/40'
        }`}
      >
        {/* Status Icon */}
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isReady ? 'bg-brand-mango text-surface-1 font-bold animate-pulse' : 'bg-brand-purple/20 text-brand-purple'
          }`}
        >
          {isReady ? '⚡' : <IconClock size={20} color="var(--brand-purple)" />}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-mono text-brand-cyan truncate">
              {ticket.companyName}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                isReady ? 'bg-brand-mango text-black' : 'bg-status-success/20 text-status-success'
              }`}
            >
              {isReady ? `READY (${countdown}s)` : `คิวที่ ${ticket.position}`}
            </span>
          </div>

          <div className="text-xs font-display font-bold text-text-primary truncate">
            {ticket.jobTitle}
          </div>

          <div className="text-[11px] text-text-muted">
            {isReady ? 'กรุณากดตอบรับเพื่อเข้าห้อง' : `รอประมาณ ~${Math.round(ticket.estimatedWaitSeconds / 60)} นาที`}
          </div>
        </div>

        {/* Action Button */}
        {isReady ? (
          <button
            onClick={onOpenReadyCheck}
            className="px-3 py-1.5 bg-brand-mango text-black font-display font-bold text-xs rounded-md shadow hover:brightness-110 flex-shrink-0"
          >
            เข้าห้อง ⚡
          </button>
        ) : (
          <button
            onClick={onLeaveQueue}
            title="ออกจากคิว"
            className="text-text-muted hover:text-status-danger text-xs p-1 rounded"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
