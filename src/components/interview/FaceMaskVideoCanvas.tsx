import React, { useRef, useEffect, useState } from 'react';
import { AnimalMask } from '../../types';
import { RealtimeFaceMaskCompositor } from '../../media/face-tracker';
import { requestUserMediaStream, stopMediaStream } from '../../media/camera-stream';
import { IconCamera, IconAlert } from '../common/PixelIcons';

interface FaceMaskVideoCanvasProps {
  mask: AnimalMask;
  isFailClosedOverride?: boolean;
  onFailClosedChange?: (active: boolean) => void;
  width?: number;
  height?: number;
}

export const FaceMaskVideoCanvas: React.FC<FaceMaskVideoCanvasProps> = ({
  mask,
  isFailClosedOverride = false,
  onFailClosedChange,
  width = 640,
  height = 480
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const compositorRef = useRef<RealtimeFaceMaskCompositor | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isFailClosed, setIsFailClosed] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    async function initCamera() {
      const stream = await requestUserMediaStream(true, false);
      if (!active) {
        stopMediaStream(stream);
        return;
      }

      if (stream && videoRef.current) {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
        setHasCamera(true);

        if (canvasRef.current) {
          compositorRef.current = new RealtimeFaceMaskCompositor(
            videoRef.current,
            canvasRef.current,
            (activeFailClosed) => {
              setIsFailClosed(activeFailClosed);
              if (onFailClosedChange) onFailClosedChange(activeFailClosed);
            }
          );
          compositorRef.current.setMask(mask);
          compositorRef.current.start();
        }
      } else {
        setCameraError('ไม่สามารถเข้าถึงกล้องได้ หรือถูกปฏิเสธสิทธิ์ (สลับเป็น Avatar Fallback)');
        setIsFailClosed(true);
        if (onFailClosedChange) onFailClosedChange(true);
      }
    }

    initCamera();

    return () => {
      active = false;
      if (compositorRef.current) {
        compositorRef.current.stop();
        compositorRef.current = null;
      }
      if (streamRef.current) {
        stopMediaStream(streamRef.current);
        streamRef.current = null;
      }
    };
  }, [onFailClosedChange]);

  useEffect(() => {
    if (compositorRef.current) {
      compositorRef.current.setMask(mask);
    }
  }, [mask]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#070816] border-2 border-brand-purple shadow-xl">
      {/* Hidden Real Video Element for Stream Processing */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="hidden"
      />

      {/* Realtime Canvas Stream Output */}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="w-full h-auto aspect-[4/3] block bg-[#0D1025] pixelated"
      />

      {/* Top Overlay Badge */}
      <div className="absolute top-3 left-3 bg-[#17162E]/90 backdrop-blur-md px-3 py-1 rounded border border-brand-cyan/40 text-[11px] font-mono text-brand-cyan flex items-center gap-1.5">
        <IconCamera size={14} color="var(--brand-cyan)" />
        <span>REAL CAMERA + {mask.toUpperCase()} MASK</span>
      </div>

      {/* Fail-Closed Status */}
      {isFailClosed && (
        <div className="absolute bottom-3 left-3 right-3 bg-red-950/90 border border-status-danger p-2.5 rounded-lg text-xs text-red-250 flex items-center gap-2">
          <IconAlert size={16} color="var(--status-danger)" />
          <span>
            <strong>Fail-Closed ป้องกันภาพหลุด:</strong> กำลังส่งสัญญาณ Avatar-only แบบไม่เห็นหน้าจริง
          </span>
        </div>
      )}
    </div>
  );
};
