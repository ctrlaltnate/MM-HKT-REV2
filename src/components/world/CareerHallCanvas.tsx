import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AvatarCustomizationConfig, ExhibitorBooth } from '../../types';
import { SYNTHETIC_NPCS } from '../../lib/fixtures';

interface CareerHallCanvasProps {
  avatarConfig: AvatarCustomizationConfig;
  booths: ExhibitorBooth[];
  onSelectBooth: (booth: ExhibitorBooth) => void;
  onTalkNpc?: (npc: (typeof SYNTHETIC_NPCS)[0]) => void;
}

export const CareerHallCanvas: React.FC<CareerHallCanvasProps> = ({
  avatarConfig,
  booths,
  onSelectBooth,
  onTalkNpc
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Player position in logical world space (1536 x 1024)
  const playerRef = useRef({
    x: 768,
    y: 860,
    targetX: 768,
    targetY: 860,
    direction: 'up' as 'down' | 'left' | 'right' | 'up',
    isMoving: false,
    speed: 4.5
  });

  const [nearbyBooth, setNearbyBooth] = useState<ExhibitorBooth | null>(null);
  const [nearbyNpc, setNearbyNpc] = useState<(typeof SYNTHETIC_NPCS)[0] | null>(null);
  const keysPressed = useRef<{ [key: string]: boolean }>({});

  const worldWidth = 1536;
  const worldHeight = 1024;

  // Keyboard handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (e.key.toLowerCase() === 'e') {
        if (nearbyBooth) {
          onSelectBooth(nearbyBooth);
        } else if (nearbyNpc && onTalkNpc) {
          onTalkNpc(nearbyNpc);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [nearbyBooth, nearbyNpc, onSelectBooth, onTalkNpc]);

  // Canvas Click / Tap to Move
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      let clientX = 0;
      let clientY = 0;

      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      const clickCanvasX = (clientX - rect.left) * (canvas.width / rect.width);
      const clickCanvasY = (clientY - rect.top) * (canvas.height / rect.height);

      // Convert Screen coords to World coords
      const camX = Math.max(0, Math.min(worldWidth - canvas.width, playerRef.current.x - canvas.width / 2));
      const camY = Math.max(0, Math.min(worldHeight - canvas.height, playerRef.current.y - canvas.height / 2));

      const targetWorldX = clickCanvasX + camX;
      const targetWorldY = clickCanvasY + camY;

      playerRef.current.targetX = Math.max(40, Math.min(worldWidth - 40, targetWorldX));
      playerRef.current.targetY = Math.max(60, Math.min(worldHeight - 60, targetWorldY));
    },
    [worldWidth, worldHeight]
  );

  // Preload Convention Hall Map Artwork (Primary Master Reference)
  const mapImageRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = '/assets/world/00_MAIN_virtual_job_fair_map.jpg';
    img.onload = () => {
      mapImageRef.current = img;
    };
    img.onerror = () => {
      img.src = '/assets/world/convention_hall_expo_map.jpg';
    };
  }, []);

  // Main Render & Game Loop
  useEffect(() => {
    let animId: number;
    let stepFrame = 0;

    const loop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      stepFrame++;

      // 1. Update Player Movement (WASD or Target)
      const p = playerRef.current;
      let dx = 0;
      let dy = 0;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) dy -= p.speed;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) dy += p.speed;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) dx -= p.speed;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) dx += p.speed;

      if (dx !== 0 || dy !== 0) {
        p.targetX = p.x + dx;
        p.targetY = p.y + dy;
      }

      const distTarget = Math.hypot(p.targetX - p.x, p.targetY - p.y);
      if (distTarget > 4) {
        const angle = Math.atan2(p.targetY - p.y, p.targetX - p.x);
        p.x += Math.cos(angle) * Math.min(distTarget, p.speed);
        p.y += Math.sin(angle) * Math.min(distTarget, p.speed);
        p.isMoving = true;

        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
          p.direction = Math.cos(angle) > 0 ? 'right' : 'left';
        } else {
          p.direction = Math.sin(angle) > 0 ? 'down' : 'up';
        }
      } else {
        p.isMoving = false;
      }

      // Clamp player within world boundaries
      p.x = Math.max(50, Math.min(worldWidth - 50, p.x));
      p.y = Math.max(60, Math.min(worldHeight - 60, p.y));

      // 2. Camera Viewport calculations
      const viewW = canvas.width;
      const viewH = canvas.height;
      const camX = Math.max(0, Math.min(worldWidth - viewW, p.x - viewW / 2));
      const camY = Math.max(0, Math.min(worldHeight - viewH, p.y - viewH / 2));

      // 3. Clear Screen & Draw World Background
      ctx.clearRect(0, 0, viewW, viewH);
      ctx.save();
      ctx.translate(-camX, -camY);

      // Render Convention Hall Background Art if loaded
      if (mapImageRef.current && mapImageRef.current.complete) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(mapImageRef.current, 0, 0, worldWidth, worldHeight);
      } else {
        // Fallback procedural floor
        ctx.fillStyle = '#0D1025';
        ctx.fillRect(0, 0, worldWidth, worldHeight);
      }

      // Grid line pattern
      ctx.strokeStyle = '#17162E';
      ctx.lineWidth = 1;
      const tileSize = 64;
      for (let x = 0; x < worldWidth; x += tileSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, worldHeight);
        ctx.stroke();
      }
      for (let y = 0; y < worldHeight; y += tileSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(worldWidth, y);
        ctx.stroke();
      }

      // Neon Main Hall Carpets & Pathways
      ctx.fillStyle = 'rgba(139, 92, 246, 0.08)';
      ctx.fillRect(worldWidth / 2 - 120, 0, 240, worldHeight);
      ctx.fillRect(0, worldHeight / 2 - 80, worldWidth, 160);

      // Center Hub Floor Ornament
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(worldWidth / 2, worldHeight / 2, 100, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#37E7FF';
      ctx.font = 'bold 14px Chakra Petch, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ NEON CAREER HALL — CENTRAL HUB', worldWidth / 2, worldHeight / 2 - 10);
      ctx.fillStyle = '#BBB6D5';
      ctx.font = '12px Chakra Petch, sans-serif';
      ctx.fillText('เดินเข้าใกล้บูธเพื่อดูงาน หรือใช้ [โหมดรายการ]', worldWidth / 2, worldHeight / 2 + 15);

      // 4. Draw 4 Exhibitor Booths
      let foundNearBooth: ExhibitorBooth | null = null;

      booths.forEach((booth) => {
        const { x, y, width, height } = booth.coordinates;

        // Proximity detection (within 70px)
        const isNear =
          p.x >= x - 50 && p.x <= x + width + 50 && p.y >= y - 50 && p.y <= y + height + 50;

        if (isNear) {
          foundNearBooth = booth;
        }

        // Booth Platform Base
        ctx.fillStyle = '#17162E';
        ctx.fillRect(x, y, width, height);

        // Neon Glow Boundary
        ctx.strokeStyle = isNear ? booth.accentColor : booth.themeColor;
        ctx.lineWidth = isNear ? 4 : 2;
        ctx.strokeRect(x, y, width, height);

        if (isNear) {
          ctx.fillStyle = 'rgba(55, 231, 255, 0.08)';
          ctx.fillRect(x - 10, y - 10, width + 20, height + 20);
        }

        // Dynamic Neon Header Plate
        ctx.fillStyle = booth.themeColor;
        ctx.fillRect(x, y, width, 36);
        ctx.fillStyle = '#070816';
        ctx.font = 'bold 13px Chakra Petch, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`ZONE ${booth.zone}: ${booth.companyName.toUpperCase()}`, x + 12, y + 23);

        // Sub industry
        ctx.fillStyle = '#BBB6D5';
        ctx.font = '11px Chakra Petch, sans-serif';
        ctx.fillText(booth.industry, x + 12, y + 58);

        // Queue Indicator Post
        ctx.fillStyle = '#262047';
        ctx.fillRect(x + 12, y + 70, 110, 48);
        ctx.strokeStyle = '#4ADE80';
        ctx.strokeRect(x + 12, y + 70, 110, 48);

        ctx.fillStyle = '#4ADE80';
        ctx.font = 'bold 11px Chakra Petch, sans-serif';
        ctx.fillText(`คิวรอ: ${booth.queueCount} คน`, x + 20, y + 90);
        ctx.fillStyle = '#BBB6D5';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`~${booth.avgWaitMinutes} นาที`, x + 20, y + 106);

        // Recruiter Desk & Station
        ctx.fillStyle = '#262047';
        ctx.fillRect(x + 140, y + 70, 128, 48);
        ctx.fillStyle = '#FFD84D';
        ctx.font = 'bold 11px Chakra Petch, sans-serif';
        ctx.fillText(booth.recruiter.codeName, x + 148, y + 90);
        ctx.fillStyle = booth.recruiter.status === 'ONLINE' ? '#4ADE80' : '#FBBF24';
        ctx.font = '10px Chakra Petch, sans-serif';
        ctx.fillText(`● ${booth.recruiter.status}`, x + 148, y + 106);

        // Tech Stack Tags
        ctx.fillStyle = '#37E7FF';
        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillText(`Tech: ${booth.techStack.slice(0, 3).join(', ')}`, x + 12, y + 145);

        // Jobs Count Pill
        ctx.fillStyle = '#8B5CF6';
        ctx.fillRect(x + 12, y + height - 36, width - 24, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 11px Chakra Petch, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`💼 รับสมัคร ${booth.activeJobs.length} ตำแหน่ง (กด E หรือแตะ)`, x + width / 2, y + height - 20);
      });

      setNearbyBooth(foundNearBooth);

      // 5. Draw NPCs
      let foundNearNpc: (typeof SYNTHETIC_NPCS)[0] | null = null;
      SYNTHETIC_NPCS.forEach((npc) => {
        const isNearNpc = Math.hypot(p.x - npc.x, p.y - npc.y) < 60;
        if (isNearNpc) foundNearNpc = npc;

        // Draw NPC Sprite
        ctx.fillStyle = '#FFD84D';
        ctx.beginPath();
        ctx.arc(npc.x, npc.y - 12, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#37E7FF';
        ctx.fillRect(npc.x - 8, npc.y - 2, 16, 20);

        // NPC Name Tag
        ctx.fillStyle = '#F8F7FF';
        ctx.font = 'bold 10px Chakra Petch, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name, npc.x, npc.y - 28);
        ctx.fillStyle = '#BBB6D5';
        ctx.font = '9px Chakra Petch, sans-serif';
        ctx.fillText(`[${npc.role}]`, npc.x, npc.y - 18);

        if (isNearNpc) {
          // Floating speech bubble
          ctx.fillStyle = '#17162E';
          ctx.fillRect(npc.x - 80, npc.y - 80, 160, 36);
          ctx.strokeStyle = '#FFD84D';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(npc.x - 80, npc.y - 80, 160, 36);
          ctx.fillStyle = '#FFD84D';
          ctx.font = '10px Chakra Petch, sans-serif';
          ctx.fillText('💬 กด [E] เพื่อคุย', npc.x, npc.y - 58);
        }
      });
      setNearbyNpc(foundNearNpc);

      // 6. Draw Player (Y-axis Depth Sorted)
      const bob = p.isMoving && Math.floor(stepFrame / 6) % 2 === 0 ? 2 : 0;
      const s = 1.6;

      // Player Shadow
      ctx.fillStyle = 'rgba(7, 8, 22, 0.5)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 16, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body & Outfit
      ctx.fillStyle = '#8B5CF6';
      ctx.fillRect(p.x - 8 * s, p.y - 8 * s - bob, 16 * s, 16 * s);

      // Head
      ctx.fillStyle = '#C68642';
      ctx.fillRect(p.x - 6 * s, p.y - 20 * s - bob, 12 * s, 12 * s);

      // Mask
      ctx.fillStyle = '#FF4FD8';
      ctx.fillRect(p.x - 6 * s, p.y - 18 * s - bob, 12 * s, 6 * s);
      ctx.fillStyle = '#37E7FF';
      ctx.fillRect(p.x - 4 * s, p.y - 16 * s - bob, 8 * s, 2 * s);

      // Player Label
      ctx.fillStyle = '#37E7FF';
      ctx.font = 'bold 11px Chakra Petch, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('YOU (Candidate #8F3A)', p.x, p.y - 38 * s);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [avatarConfig, booths, worldWidth, worldHeight]);

  return (
    <div className="relative w-full h-[640px] max-h-[75vh] bg-[#070816] rounded-xl overflow-hidden border-2 border-brand-purple shadow-2xl">
      <canvas
        ref={canvasRef}
        width={1024}
        height={640}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasClick}
        className="w-full h-full block cursor-crosshair pixelated"
      />

      {/* Proximity Action Dock */}
      {nearbyBooth && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-float">
          <button
            onClick={() => onSelectBooth(nearbyBooth)}
            className="flex items-center gap-3 px-6 py-3 bg-[#17162E] border-2 border-brand-cyan text-brand-cyan hover:bg-[#262047] shadow-xl shadow-cyan-950/60 rounded-full font-display font-bold text-sm transition-all"
          >
            <span className="w-3 h-3 rounded-full bg-brand-cyan animate-ping"></span>
            <span>[กด E หรือแตะ] สำรวจบูธ {nearbyBooth.companyName}</span>
          </button>
        </div>
      )}

      {nearbyNpc && !nearbyBooth && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 animate-float">
          <button
            onClick={() => onTalkNpc && onTalkNpc(nearbyNpc)}
            className="flex items-center gap-3 px-6 py-3 bg-[#17162E] border-2 border-brand-mango text-brand-mango hover:bg-[#262047] shadow-xl shadow-amber-950/60 rounded-full font-display font-bold text-sm transition-all"
          >
            <span>💬 คุยกับ {nearbyNpc.name} ({nearbyNpc.role})</span>
          </button>
        </div>
      )}

      {/* Top HUD Overlay */}
      <div className="absolute top-3 left-3 bg-[#17162E]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#352C5E] text-xs font-display flex items-center gap-3 text-text-muted">
        <span className="text-brand-cyan font-semibold">📍 GRAND CAREER HALL</span>
        <span>• การควบคุม: WASD / ลูกศร / คลิกบนแผนที่</span>
      </div>
    </div>
  );
};
