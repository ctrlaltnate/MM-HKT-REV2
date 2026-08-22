import React, { useState, useEffect, useRef } from 'react';
import { RealtimeVoiceDSP, VoiceDSPConfig } from '../../media/voice-dsp';
import { requestUserMediaStream, stopMediaStream } from '../../media/camera-stream';
import { IconMic, IconSparkles } from '../common/PixelIcons';
import { PixelButton } from '../common/PixelButton';

interface VoiceModulatorControlProps {
  onVolumeChange?: (vol: number) => void;
}

export const VoiceModulatorControl: React.FC<VoiceModulatorControlProps> = ({
  onVolumeChange
}) => {
  const [pitchFactor, setPitchFactor] = useState<number>(0.75); // 0.75 deeper, 1.25 higher
  const [isMicActive, setIsMicActive] = useState<boolean>(false);
  const [volumeLevel, setVolumeLevel] = useState<number>(0);
  const dspRef = useRef<RealtimeVoiceDSP | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startMicDSP = async () => {
    try {
      const stream = await requestUserMediaStream(false, true);
      if (stream) {
        streamRef.current = stream;
        dspRef.current = new RealtimeVoiceDSP();
        await dspRef.current.setup(stream, {
          pitchShiftFactor: pitchFactor,
          formantShift: pitchFactor > 1 ? 1.2 : 0.8,
          noiseGate: true,
          gain: 1.2
        });
        setIsMicActive(true);
      }
    } catch (e) {
      console.error('DSP setup failed', e);
    }
  };

  const stopMicDSP = () => {
    if (dspRef.current) {
      dspRef.current.stop();
      dspRef.current = null;
    }
    if (streamRef.current) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }
    setIsMicActive(false);
    setVolumeLevel(0);
  };

  useEffect(() => {
    let animId: number;
    const pollVolume = () => {
      if (dspRef.current && isMicActive) {
        const vol = dspRef.current.getAudioVolumeLevel();
        setVolumeLevel(vol);
        if (onVolumeChange) onVolumeChange(vol);
      }
      animId = requestAnimationFrame(pollVolume);
    };

    if (isMicActive) {
      animId = requestAnimationFrame(pollVolume);
    }

    return () => cancelAnimationFrame(animId);
  }, [isMicActive, onVolumeChange]);

  const handlePitchChange = (newPitch: number) => {
    setPitchFactor(newPitch);
    if (dspRef.current) {
      dspRef.current.updateConfig({
        pitchShiftFactor: newPitch,
        formantShift: newPitch > 1 ? 1.2 : 0.8
      });
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#17162E] border border-brand-purple/50 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-brand-purple font-display font-bold text-sm">
          <IconMic size={18} color="var(--brand-purple)" />
          <span>ดัดแปลงโทนเสียงจริง (REALTIME VOICE DSP)</span>
        </div>
        <span className="text-[11px] font-mono text-status-success bg-status-success/15 px-2 py-0.5 rounded border border-status-success/30">
          LOW LATENCY (&lt;15ms)
        </span>
      </div>

      {/* Pitch Selector */}
      <div>
        <div className="flex justify-between text-xs text-text-muted font-display mb-1.5">
          <span>โทนเสียง: {pitchFactor < 1 ? 'โทนต่ำ / Cyber Deep (แนะนำ)' : pitchFactor > 1 ? 'โทนสูง / Cyber High' : 'เสียงธรรมชาติ'}</span>
          <span className="font-mono text-brand-cyan">{(pitchFactor * 100).toFixed(0)}%</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handlePitchChange(0.75)}
            className={`py-2 px-3 rounded text-xs font-display font-medium border transition-all ${
              pitchFactor === 0.75
                ? 'bg-brand-purple text-white border-brand-purple'
                : 'bg-[#262047] text-text-muted border-[#352C5E] hover:border-brand-purple'
            }`}
          >
            🔊 โทนทุ้มลึก (Deep)
          </button>
          <button
            onClick={() => handlePitchChange(1.0)}
            className={`py-2 px-3 rounded text-xs font-display font-medium border transition-all ${
              pitchFactor === 1.0
                ? 'bg-brand-purple text-white border-brand-purple'
                : 'bg-[#262047] text-text-muted border-[#352C5E] hover:border-brand-purple'
            }`}
          >
            เสียงธรรมชาติ
          </button>
          <button
            onClick={() => handlePitchChange(1.25)}
            className={`py-2 px-3 rounded text-xs font-display font-medium border transition-all ${
              pitchFactor === 1.25
                ? 'bg-brand-purple text-white border-brand-purple'
                : 'bg-[#262047] text-text-muted border-[#352C5E] hover:border-brand-purple'
            }`}
          >
            📻 โทนแหลม (High)
          </button>
        </div>
      </div>

      {/* Real Mic Test & Volume VU Meter */}
      <div className="p-3 rounded-lg bg-[#0D1025] border border-[#352C5E] flex items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-[11px] text-text-muted font-mono">
            <span>MIC LEVEL VU:</span>
            <span>{volumeLevel}%</span>
          </div>
          {/* VU Bar */}
          <div className="w-full h-2.5 bg-[#17162E] rounded-full overflow-hidden border border-[#352C5E]">
            <div
              className={`h-full transition-all duration-75 ${
                volumeLevel > 70 ? 'bg-status-danger' : volumeLevel > 30 ? 'bg-status-success' : 'bg-brand-cyan'
              }`}
              style={{ width: `${volumeLevel}%` }}
            />
          </div>
        </div>

        <div>
          {!isMicActive ? (
            <PixelButton
              variant="accent"
              size="sm"
              onClick={startMicDSP}
              leftIcon={<IconSparkles size={14} color="var(--text-on-accent)" />}
            >
              ทดสอบพูดไมค์ 🎙️
            </PixelButton>
          ) : (
            <PixelButton
              variant="danger"
              size="sm"
              onClick={stopMicDSP}
            >
              หยุดทดสอบไมค์
            </PixelButton>
          )}
        </div>
      </div>
    </div>
  );
};
