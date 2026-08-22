import React, { useState, useEffect } from 'react';
import { QueueTicket } from '../../types';
import { DialogWindow } from '../common/DialogWindow';
import { PixelButton } from '../common/PixelButton';
import { IconClock, IconAlert } from '../common/PixelIcons';

interface ReadyCheckAlertDialogProps {
  ticket: QueueTicket | null;
  isOpen: boolean;
  onAccept: () => void;
  onSnooze: () => void;
  onDecline: () => void;
}

export const ReadyCheckAlertDialog: React.FC<ReadyCheckAlertDialogProps> = ({
  ticket,
  isOpen,
  onAccept,
  onSnooze,
  onDecline
}) => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!isOpen || !ticket) return;

    const expiresAt = ticket.readyCheckExpiresAt
      ? new Date(ticket.readyCheckExpiresAt).getTime()
      : Date.now() + 60000;

    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.round((expiresAt - Date.now()) / 1000));
      setCountdown(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        onDecline();
      }
    }, 500);

    return () => clearInterval(timer);
  }, [isOpen, ticket, onDecline]);

  if (!isOpen || !ticket) return null;

  return (
    <DialogWindow
      isOpen={isOpen}
      onClose={onDecline}
      headerColor="mango"
      title={
        <div className="flex items-center gap-2 text-brand-mango font-display">
          <IconAlert size={20} color="var(--brand-mango)" />
          <span>ถึงคิวสัมภาษณ์ของคุณแล้ว! (READY CHECK)</span>
        </div>
      }
    >
      <div className="space-y-6 text-center">
        {/* Countdown Visual Timer */}
        <div className="p-6 rounded-2xl bg-[#0D1025] border-2 border-brand-mango/60 flex flex-col items-center justify-center shadow-lg shadow-amber-950/40">
          <div className="w-20 h-20 rounded-full border-4 border-brand-mango flex items-center justify-center font-mono font-bold text-3xl text-brand-mango animate-pulse">
            {countdown}s
          </div>
          <div className="text-xs text-text-muted mt-3 font-display">
            เวลานับถอยหลังในการตอบรับ (60 วินาที)
          </div>
        </div>

        {/* Company & Job Info */}
        <div className="p-4 rounded-xl bg-[#17162E] border border-[#352C5E] text-left">
          <div className="text-xs font-mono text-brand-cyan">{ticket.companyName}</div>
          <div className="text-base font-display font-bold text-text-primary mt-0.5">
            {ticket.jobTitle}
          </div>
          <div className="text-xs text-text-muted mt-1">
            ผู้สัมภาษณ์: <strong className="text-brand-mango">Recruiter #R12</strong> กำลังรอคุณอยู่ในห้องสัมภาษณ์
          </div>
        </div>

        {/* Privacy Assurance */}
        <div className="text-xs text-text-muted bg-[#262047]/40 p-3 rounded-lg border border-[#352C5E]">
          🔒 กล้องจะเปิดพร้อมระบบ Realtime Face Mask และดัดเสียง (DSP) อัตโนมัติ โดยไม่เปิดเผยใบหน้าจริง
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <PixelButton
            variant="mango"
            size="lg"
            className="flex-1 text-base font-bold"
            onClick={onAccept}
          >
            พร้อมเข้าสัมภาษณ์ทันที ⚡
          </PixelButton>

          {ticket.snoozeCount < 1 && (
            <PixelButton
              variant="secondary"
              size="lg"
              className="sm:w-1/3"
              onClick={onSnooze}
            >
              ขอเลื่อน 1 ครั้ง
            </PixelButton>
          )}

          <PixelButton
            variant="ghost"
            size="lg"
            className="text-status-danger hover:bg-red-950/30"
            onClick={onDecline}
          >
            สละสิทธิ์
          </PixelButton>
        </div>
      </div>
    </DialogWindow>
  );
};
