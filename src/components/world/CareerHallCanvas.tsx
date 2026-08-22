import React, { useRef, useEffect, useState, useCallback } from 'react';
import { AvatarCustomizationConfig, ExhibitorBooth } from '../../types';
import { SYNTHETIC_NPCS } from '../../lib/fixtures';

interface CareerHallCanvasProps {
  avatarConfig: AvatarCustomizationConfig;
  booths: ExhibitorBooth[];
  onSelectBooth: (booth: ExhibitorBooth) => void;
  onTalkNpc?: (npc: (typeof SYNTHETIC_NPCS)[0]) => void;
}

interface AnimatedNpc {
  id: string;
  name: string;
  role: string;
  x: number;
  y: number;
  originX: number;
  originY: number;
  targetX: number;
  targetY: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  speed: number;
  wanderTimer: number;
  walkFrame: number;
  dialogue: string;
  hairColor: string;
  outfitColor: string;
  skinTone: string;
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
    y: 820,
    targetX: 768,
    targetY: 820,
    direction: 'up' as 'down' | 'left' | 'right' | 'up',
    isMoving: false,
    speed: 4.5,
    walkFrame: 0
  });

  // Animated NPCs state (Moving and interacting)
  const npcsRef = useRef<AnimatedNpc[]>([
    {
      id: 'npc-guide-1',
      name: 'Staff P\'Mew (Event Guide)',
      role: 'Event Guide',
      x: 768,
      y: 520,
      originX: 768,
      originY: 520,
      targetX: 768,
      targetY: 520,
      direction: 'down',
      isMoving: false,
      speed: 1.2,
      wanderTimer: 60,
      walkFrame: 0,
      dialogue: 'ยินดีต้อนรับสู่ Neon Career Hall! คุณสามารถเดินสำรวจบูธ หรือกด "โหมดรายการ (Navigator)" เพื่อเข้าคิวได้ทันทีครับ',
      hairColor: '#37E7FF',
      outfitColor: '#8B5CF6',
      skinTone: '#F3D2B8'
    },
    {
      id: 'npc-a11y',
      name: 'K. Grace (A11y Lead)',
      role: 'Accessibility Lead',
      x: 480,
      y: 520,
      originX: 480,
      originY: 520,
      targetX: 480,
      targetY: 520,
      direction: 'right',
      isMoving: false,
      speed: 1.0,
      wanderTimer: 90,
      walkFrame: 0,
      dialogue: 'หากคุณต้องการใช้งานแบบคีย์บอร์ด 100% สามารถสลับไปที่ "โหมดรายการ (Navigator)" ได้ตลอดเวลาค่ะ',
      hairColor: '#FF4FD8',
      outfitColor: '#37E7FF',
      skinTone: '#FCE7D6'
    },
    {
      id: 'npc-tech-support',
      name: 'Engineer Bank (Tech Pod)',
      role: 'Tech Support',
      x: 1056,
      y: 520,
      originX: 1056,
      originY: 520,
      targetX: 1056,
      targetY: 520,
      direction: 'left',
      isMoving: false,
      speed: 1.1,
      wanderTimer: 75,
      walkFrame: 0,
      dialogue: 'ระบบ Realtime Face Mask & Voice DSP ของเราประมวลผลบนเครื่องคุณ 100% ปลอดภัย ไร้กังวลแน่นอนครับ!',
      hairColor: '#FFD84D',
      outfitColor: '#10B981',
      skinTone: '#E4B693'
    },
    {
      id: 'npc-candidate-1',
      name: 'Candidate #Foxie',
      role: 'Job Seeker',
      x: 600,
      y: 820,
      originX: 600,
      originY: 820,
      targetX: 600,
      targetY: 820,
      direction: 'up',
      isMoving: false,
      speed: 1.3,
      wanderTimer: 45,
      walkFrame: 0,
      dialogue: 'ผมเพิ่งสัมภาษณ์กับทีม Cyber Orchard เสร็จ บรรยากาศเป็นกันเองมาก ได้คุยเรื่องงานจริงๆ โดยไม่ต้องกังวลเรื่องโปรไฟล์ส่วนตัวเลย!',
      hairColor: '#F97316',
      outfitColor: '#3B82F6',
      skinTone: '#F3D2B8'
    },
    {
      id: 'npc-candidate-2',
      name: 'Candidate #CyberOwl',
      role: 'Job Seeker',
      x: 936,
      y: 820,
      originX: 936,
      originY: 820,
      targetX: 936,
      targetY: 820,
      direction: 'left',
      isMoving: false,
      speed: 1.2,
      wanderTimer: 110,
      walkFrame: 0,
      dialogue: 'คะแนน AI Match 92% มีคำอธิบายชัดเจนว่าตรงกับ Must-have ข้อไหน ทำให้เตรียมตัวสัมภาษณ์ได้ตรงจุดมากๆ ครับ',
      hairColor: '#A855F7',
      outfitColor: '#EC4899',
      skinTone: '#C68642'
    }
  ]);

  const [nearbyBooth, setNearbyBooth] = useState<ExhibitorBooth | null>(null);
  const [nearbyNpc, setNearbyNpc] = useState<AnimatedNpc | null>(null);
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
          onTalkNpc(nearbyNpc as any);
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

      // 1. Update Player Movement
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
        p.walkFrame = (p.walkFrame + 0.2) % 4;

        if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
          p.direction = Math.cos(angle) > 0 ? 'right' : 'left';
        } else {
          p.direction = Math.sin(angle) > 0 ? 'down' : 'up';
        }
      } else {
        p.isMoving = false;
        p.walkFrame = 0;
      }

      // Clamp player within world boundaries
      p.x = Math.max(50, Math.min(worldWidth - 50, p.x));
      p.y = Math.max(60, Math.min(worldHeight - 60, p.y));

      // 2. Update NPCs (Active Wandering & Animation)
      npcsRef.current.forEach((npc) => {
        const distToPlayer = Math.hypot(p.x - npc.x, p.y - npc.y);

        // If player is close, face the player and stop wandering
        if (distToPlayer < 75) {
          npc.isMoving = false;
          const angle = Math.atan2(p.y - npc.y, p.x - npc.x);
          if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
            npc.direction = Math.cos(angle) > 0 ? 'right' : 'left';
          } else {
            npc.direction = Math.sin(angle) > 0 ? 'down' : 'up';
          }
          return;
        }

        // Active Autonomous Patrol / Wander
        npc.wanderTimer--;
        if (npc.wanderTimer <= 0) {
          npc.wanderTimer = 80 + Math.floor(Math.random() * 80);
          const wanderRange = 60;
          npc.targetX = npc.originX + (Math.random() * (wanderRange * 2) - wanderRange);
          npc.targetY = npc.originY + (Math.random() * (wanderRange * 2) - wanderRange);
        }

        const distNpcTarget = Math.hypot(npc.targetX - npc.x, npc.targetY - npc.y);
        if (distNpcTarget > 3) {
          const angle = Math.atan2(npc.targetY - npc.y, npc.targetX - npc.x);
          npc.x += Math.cos(angle) * npc.speed;
          npc.y += Math.sin(angle) * npc.speed;
          npc.isMoving = true;
          npc.walkFrame = (npc.walkFrame + 0.15) % 4;

          if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
            npc.direction = Math.cos(angle) > 0 ? 'right' : 'left';
          } else {
            npc.direction = Math.sin(angle) > 0 ? 'down' : 'up';
          }
        } else {
          npc.isMoving = false;
          npc.walkFrame = 0;
        }
      });

      // 3. Proximity detection (Nearest Booth and NPC)
      let foundBooth: ExhibitorBooth | null = null;
      booths.forEach((b) => {
        const { x, y, width, height } = b.coordinates;
        if (
          p.x >= x - 40 &&
          p.x <= x + width + 40 &&
          p.y >= y - 30 &&
          p.y <= y + height + 50
        ) {
          foundBooth = b;
        }
      });
      setNearbyBooth(foundBooth);

      let foundNpc: AnimatedNpc | null = null;
      npcsRef.current.forEach((npc) => {
        const dist = Math.hypot(p.x - npc.x, p.y - npc.y);
        if (dist < 65) {
          foundNpc = npc;
        }
      });
      setNearbyNpc(foundNpc);

      // 4. Camera Viewport calculations
      const viewW = canvas.width;
      const viewH = canvas.height;
      const camX = Math.max(0, Math.min(worldWidth - viewW, p.x - viewW / 2));
      const camY = Math.max(0, Math.min(worldHeight - viewH, p.y - viewH / 2));

      // 5. Clear Screen & Draw World
      ctx.clearRect(0, 0, viewW, viewH);
      ctx.save();
      ctx.translate(-camX, -camY);

      // ==========================================
      // LAYER 1: TILEABLE ENDLESS FLOOR & CORRIDORS
      // ==========================================
      ctx.fillStyle = '#090A1A';
      ctx.fillRect(0, 0, worldWidth, worldHeight);

      // Checkered Floor Grid (32x32 Tiles)
      const tileSize = 32;
      for (let tx = 0; tx < worldWidth; tx += tileSize) {
        for (let ty = 0; ty < worldHeight; ty += tileSize) {
          const isEven = ((tx / tileSize) + (ty / tileSize)) % 2 === 0;
          ctx.fillStyle = isEven ? '#0D1025' : '#11142E';
          ctx.fillRect(tx, ty, tileSize, tileSize);

          ctx.strokeStyle = '#181D3D';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(tx, ty, tileSize, tileSize);
        }
      }

      // Blue Carpet Main Walkways
      // Vertical Center Corridor
      ctx.fillStyle = '#172B5E';
      ctx.fillRect(worldWidth / 2 - 100, 0, 200, worldHeight);
      ctx.strokeStyle = '#37E7FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(worldWidth / 2 - 100, 0, 200, worldHeight);

      // Horizontal Middle Corridor
      ctx.fillStyle = '#172B5E';
      ctx.fillRect(0, worldHeight / 2 - 60, worldWidth, 120);
      ctx.strokeRect(0, worldHeight / 2 - 60, worldWidth, 120);

      // Directional Movement Arrows (Yellow ⬆️ ⬇️ ⬅️ ➡️)
      const drawArrow = (ax: number, ay: number, dir: 'up' | 'down' | 'left' | 'right') => {
        ctx.save();
        ctx.translate(ax, ay);
        if (dir === 'down') ctx.rotate(Math.PI);
        if (dir === 'left') ctx.rotate(-Math.PI / 2);
        if (dir === 'right') ctx.rotate(Math.PI / 2);

        // Arrow shape
        ctx.fillStyle = '#FFD84D';
        ctx.shadowColor = '#FFD84D';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(0, -14);
        ctx.lineTo(12, 0);
        ctx.lineTo(5, 0);
        ctx.lineTo(5, 12);
        ctx.lineTo(-5, 12);
        ctx.lineTo(-5, 0);
        ctx.lineTo(-12, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      };

      // Draw Walkway Arrows
      drawArrow(worldWidth / 2, 220, 'up');
      drawArrow(worldWidth / 2, 860, 'down');
      drawArrow(380, worldHeight / 2, 'right');
      drawArrow(1156, worldHeight / 2, 'left');

      // Central Information Kiosk (INFO Counter)
      const infoX = worldWidth / 2;
      const infoY = worldHeight / 2;
      ctx.fillStyle = '#17162E';
      ctx.strokeStyle = '#37E7FF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(infoX - 60, infoY - 25, 120, 50, 8);
      ctx.fill();
      ctx.stroke();

      // Info Signboard
      ctx.fillStyle = '#37E7FF';
      ctx.font = 'bold 13px "Chakra Petch", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('ℹ️ INFO DESK', infoX, infoY + 5);

      // ==========================================
      // LAYER 2: MODULAR DECOUPLED BOOTHS
      // ==========================================
      booths.forEach((b) => {
        const { x, y, width, height } = b.coordinates;
        const isNear = nearbyBooth?.id === b.id;

        // 1. Booth Floor Pad
        ctx.fillStyle = '#121329';
        ctx.fillRect(x, y, width, height);

        // Booth Border (Glows when player is near)
        ctx.strokeStyle = isNear ? b.themeColor : '#2A284D';
        ctx.lineWidth = isNear ? 3 : 1.5;
        if (isNear) {
          ctx.shadowColor = b.themeColor;
          ctx.shadowBlur = 15;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.strokeRect(x, y, width, height);
        ctx.shadowBlur = 0;

        // 2. Overhead Customizable Marquee Signboard
        ctx.fillStyle = '#17162E';
        ctx.strokeStyle = b.themeColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x + 10, y + 10, width - 20, 42, 6);
        ctx.fill();
        ctx.stroke();

        // Company Logo Icon & Name Text
        ctx.fillStyle = b.themeColor;
        ctx.font = 'bold 14px "Chakra Petch", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`🏢 ${b.companyName.toUpperCase()}`, x + 24, y + 36);

        // Zone Tag
        ctx.fillStyle = '#BBB6D5';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`ZONE ${b.zone}`, x + width - 24, y + 36);

        // 3. Interior Props (Desks, Dual Monitors, Server Racks)
        // Workstation Desk
        ctx.fillStyle = '#262047';
        ctx.strokeStyle = '#352C5E';
        ctx.lineWidth = 1;
        ctx.fillRect(x + 25, y + 70, 110, 40);
        ctx.strokeRect(x + 25, y + 70, 110, 40);

        // Dual Monitors on Desk (Animated Code)
        ctx.fillStyle = '#070816';
        ctx.fillRect(x + 35, y + 74, 38, 22);
        ctx.fillRect(x + 85, y + 74, 38, 22);

        // Monitor Screens with Green/Cyan Matrix Lines
        ctx.fillStyle = b.themeColor;
        ctx.fillRect(x + 37, y + 76, 34, 18);
        ctx.fillRect(x + 87, y + 76, 34, 18);

        // Server Hub Rack with Blinking LEDs
        ctx.fillStyle = '#0A0B14';
        ctx.strokeStyle = '#352C5E';
        ctx.fillRect(x + width - 65, y + 70, 40, 75);
        ctx.strokeRect(x + width - 65, y + 70, 40, 75);

        // Server LEDs
        const blink = Math.floor(stepFrame / 15) % 2 === 0;
        ctx.fillStyle = blink ? '#4ADE80' : '#FF5A6F';
        ctx.fillRect(x + width - 58, y + 78, 5, 5);
        ctx.fillStyle = !blink ? '#37E7FF' : '#FFD84D';
        ctx.fillRect(x + width - 48, y + 78, 5, 5);

        // Water Cooler Dispenser
        ctx.fillStyle = '#38BDF8';
        ctx.beginPath();
        ctx.arc(x + width - 90, y + 85, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#E2E8F0';
        ctx.fillRect(x + width - 96, y + 93, 12, 18);

        // Potted Plant
        ctx.fillStyle = '#10B981';
        ctx.beginPath();
        ctx.arc(x + 35, y + height - 35, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#92400E';
        ctx.fillRect(x + 29, y + height - 25, 12, 12);

        // Recruiter Desk & Chair
        ctx.fillStyle = '#262047';
        ctx.fillRect(x + 90, y + 130, 90, 35);
        ctx.strokeRect(x + 90, y + 130, 90, 35);

        // NPC Recruiter behind desk
        ctx.fillStyle = '#FFD84D';
        ctx.beginPath();
        ctx.arc(x + 135, y + 125, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#8B5CF6';
        ctx.fillRect(x + 126, y + 134, 18, 12);

        // Queue Indicator Terminal
        ctx.fillStyle = '#17162E';
        ctx.strokeStyle = '#4ADE80';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(x + width - 110, y + height - 40, 90, 24, 4);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#4ADE80';
        ctx.font = 'bold 10px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`คิว: ${b.queueCount} คน`, x + width - 65, y + height - 24);
      });

      // ==========================================
      // LAYER 3: DYNAMIC NPCS (ACTUALLY ANIMATING & WALKING)
      // ==========================================
      npcsRef.current.forEach((npc) => {
        const bob = npc.isMoving ? Math.sin(npc.walkFrame * Math.PI) * 2 : 0;

        // Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(npc.x, npc.y + 12, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs (Walking animation)
        ctx.fillStyle = '#1E293B';
        const legOffset = npc.isMoving ? Math.sin(npc.walkFrame * Math.PI) * 3 : 0;
        ctx.fillRect(npc.x - 5 + legOffset, npc.y + 5, 4, 7);
        ctx.fillRect(npc.x + 1 - legOffset, npc.y + 5, 4, 7);

        // Body / Outfit
        ctx.fillStyle = npc.outfitColor;
        ctx.fillRect(npc.x - 7, npc.y - 6 + bob, 14, 12);

        // Head
        ctx.fillStyle = npc.skinTone;
        ctx.beginPath();
        ctx.arc(npc.x, npc.y - 12 + bob, 8, 0, Math.PI * 2);
        ctx.fill();

        // Hair
        ctx.fillStyle = npc.hairColor;
        ctx.fillRect(npc.x - 8, npc.y - 20 + bob, 16, 7);

        // Role / Name Tag Above Head
        ctx.fillStyle = '#BBB6D5';
        ctx.font = 'bold 10px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(npc.name, npc.x, npc.y - 26 + bob);

        // Speech Bubble Icon when Nearby
        if (nearbyNpc?.id === npc.id) {
          ctx.fillStyle = '#FFD84D';
          ctx.font = '14px sans-serif';
          ctx.fillText('💬', npc.x, npc.y - 40 + bob);
        }
      });

      // ==========================================
      // LAYER 4: PLAYER AVATAR (LIVE 8-BIT SPRITE)
      // ==========================================
      const pBob = p.isMoving ? Math.sin(p.walkFrame * Math.PI) * 2.5 : 0;

      // Player Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y + 14, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Player Legs
      ctx.fillStyle = '#0F172A';
      const pLegOffset = p.isMoving ? Math.sin(p.walkFrame * Math.PI) * 4 : 0;
      ctx.fillRect(p.x - 6 + pLegOffset, p.y + 6, 5, 8);
      ctx.fillRect(p.x + 1 - pLegOffset, p.y + 6, 5, 8);

      // Player Body / Cyber Hoodie
      ctx.fillStyle = avatarConfig.outfitColor === 'purple' ? '#8B5CF6' : avatarConfig.outfitColor === 'cyan' ? '#37E7FF' : '#FF4FD8';
      ctx.fillRect(p.x - 9, p.y - 8 + pBob, 18, 15);

      // Player Head
      ctx.fillStyle = avatarConfig.skinTone === 'warm_tan' ? '#F3D2B8' : '#FCE7D6';
      ctx.beginPath();
      ctx.arc(p.x, p.y - 15 + pBob, 10, 0, Math.PI * 2);
      ctx.fill();

      // Hair
      const hairColorMap: Record<string, string> = {
        cyan: '#37E7FF',
        neon_pink: '#FF4FD8',
        purple: '#8B5CF6',
        blonde: '#FFD84D',
        silver: '#E2E8F0',
        green: '#10B981',
        black: '#1E293B',
        brown: '#78350F'
      };
      ctx.fillStyle = hairColorMap[avatarConfig.hairColor] || '#37E7FF';
      ctx.fillRect(p.x - 10, p.y - 25 + pBob, 20, 9);

      // Animal Mask / Visor
      ctx.fillStyle = '#FF4FD8';
      ctx.fillRect(p.x - 6, p.y - 18 + pBob, 12, 6);

      // Player Alias Badge (Candidate #8F3A)
      ctx.fillStyle = '#37E7FF';
      ctx.font = 'bold 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('YOU (Candidate #8F3A)', p.x, p.y - 32 + pBob);

      ctx.restore();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [avatarConfig, booths, nearbyBooth, nearbyNpc, onTalkNpc, worldWidth, worldHeight]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-[#070816] border-2 border-[#352C5E] shadow-2xl">
      {/* 2D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        width={960}
        height={600}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasClick}
        className="w-full h-auto aspect-[16/10] block cursor-pointer bg-[#0D1025] pixelated"
      />

      {/* Proximity Interaction Dock (Bottom Action Prompt) */}
      {nearbyBooth && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#17162E]/95 backdrop-blur-md p-4 rounded-xl border-2 border-[#37E7FF] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: `${nearbyBooth.themeColor}33`, color: nearbyBooth.themeColor }}
            >
              🏢
            </div>
            <div>
              <div className="text-xs font-mono text-[#37E7FF]">
                ZONE {nearbyBooth.zone} • {nearbyBooth.industry}
              </div>
              <div className="text-sm font-display font-bold text-white">
                {nearbyBooth.companyName}
              </div>
            </div>
          </div>

          <button
            onClick={() => onSelectBooth(nearbyBooth)}
            className="px-5 py-2 bg-gradient-to-r from-[#37E7FF] to-[#0284C7] text-black font-display font-extrabold text-xs rounded-lg shadow-lg hover:brightness-110 flex items-center gap-2"
          >
            <span>[E] ดูตำแหน่งงาน & เข้าคิวสัมภาษณ์ ⚡</span>
          </button>
        </div>
      )}

      {/* NPC Dialogue Prompt */}
      {!nearbyBooth && nearbyNpc && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#17162E]/95 backdrop-blur-md p-3.5 rounded-xl border-2 border-[#FFD84D] shadow-2xl flex items-center justify-between gap-3 animate-slide-up">
          <div className="flex items-center gap-2 text-xs font-display">
            <span className="text-lg">💬</span>
            <span className="text-[#FFD84D] font-bold">{nearbyNpc.name}:</span>
            <span className="text-[#BBB6D5] truncate">"{nearbyNpc.dialogue}"</span>
          </div>

          <button
            onClick={() => onTalkNpc && onTalkNpc(nearbyNpc as any)}
            className="px-4 py-1.5 bg-[#FFD84D] text-black font-display font-bold text-xs rounded-lg shadow hover:brightness-110 flex-shrink-0"
          >
            [E] สนทนา 💬
          </button>
        </div>
      )}

      {/* Movement Controls Help Badge */}
      <div className="absolute top-3 left-3 bg-[#17162E]/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#352C5E] text-[11px] font-mono text-[#BBB6D5] hidden sm:flex items-center gap-2">
        <span>🎮 WASD / ลูกศร หรือ คลิกบนจอเพื่อเดิน</span>
      </div>
    </div>
  );
};
