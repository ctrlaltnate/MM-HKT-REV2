import React, { useRef, useEffect, useState } from 'react';
import { AvatarCustomizationConfig, CharacterDirection } from '../../types';

interface SpritePreviewCanvasProps {
  config: AvatarCustomizationConfig;
  direction?: CharacterDirection;
  scale?: number;
  width?: number;
  height?: number;
  interactiveRotation?: boolean;
}

export const SpritePreviewCanvas: React.FC<SpritePreviewCanvasProps> = ({
  config,
  direction: initialDirection = 'down',
  scale = 4,
  width = 200,
  height = 240,
  interactiveRotation = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentDir, setCurrentDir] = useState<CharacterDirection>(initialDirection);
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    setCurrentDir(initialDirection);
  }, [initialDirection]);

  // Idle animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 4);
    }, 280);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2 + 10;
    const s = scale;

    // Palette lookup table
    const skinPalette: Record<string, string> = {
      light: '#F8D7B8',
      medium: '#E0AC69',
      warm_tan: '#C68642',
      deep: '#8D5524'
    };

    const hairPalette: Record<string, string> = {
      black: '#1E1B2E',
      brown: '#5A3825',
      blonde: '#F5D77F',
      cyan: '#37E7FF',
      neon_pink: '#FF4FD8',
      purple: '#8B5CF6',
      silver: '#D1D5DB',
      green: '#10B981'
    };

    const outfitPalette: Record<string, string> = {
      purple: '#8B5CF6',
      cyan: '#37E7FF',
      pink: '#FF4FD8',
      mango: '#FFD84D',
      emerald: '#10B981',
      crimson: '#EF4444',
      slate: '#475569',
      gold: '#F59E0B'
    };

    const currentSkin = skinPalette[config.skinTone] || '#C68642';
    const currentHair = hairPalette[config.hairColor] || '#37E7FF';
    const currentOutfit = outfitPalette[config.outfitColor] || '#8B5CF6';

    const bobOffset = frameIndex % 2 === 0 ? 0 : 2 * s;

    // Shadow on floor
    ctx.fillStyle = 'rgba(7, 8, 22, 0.45)';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 30 * s, 14 * s, 6 * s, 0, 0, Math.PI * 2);
    ctx.fill();

    // 1. Layer: Body (Legs & Shoes)
    ctx.fillStyle = '#17162E';
    ctx.fillRect(cx - 6 * s, cy + 16 * s - bobOffset, 4 * s, 12 * s);
    ctx.fillRect(cx + 2 * s, cy + 16 * s - bobOffset, 4 * s, 12 * s);

    // Shoes
    ctx.fillStyle = currentOutfit;
    ctx.fillRect(cx - 7 * s, cy + 26 * s - bobOffset, 5 * s, 4 * s);
    ctx.fillRect(cx + 2 * s, cy + 26 * s - bobOffset, 5 * s, 4 * s);

    // 2. Layer: Torso / Outfit
    ctx.fillStyle = currentOutfit;
    ctx.fillRect(cx - 9 * s, cy - 2 * s - bobOffset, 18 * s, 19 * s);

    // Outfit details (Cyber trim / tie)
    if (config.outfitStyle === 'business_suit') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx - 2 * s, cy - 2 * s - bobOffset, 4 * s, 10 * s);
      ctx.fillStyle = '#EF4444';
      ctx.fillRect(cx - 1 * s, cy - 1 * s - bobOffset, 2 * s, 8 * s);
    } else {
      // Cyber Hoodie Pocket & Stripes
      ctx.fillStyle = 'rgba(7, 8, 22, 0.3)';
      ctx.fillRect(cx - 6 * s, cy + 8 * s - bobOffset, 12 * s, 7 * s);
      ctx.fillStyle = '#37E7FF';
      ctx.fillRect(cx - 8 * s, cy + 2 * s - bobOffset, 2 * s, 10 * s);
      ctx.fillRect(cx + 6 * s, cy + 2 * s - bobOffset, 2 * s, 10 * s);
    }

    // 3. Layer: Arms & Hands
    ctx.fillStyle = currentSkin;
    ctx.fillRect(cx - 11 * s, cy + 8 * s - bobOffset, 3 * s, 5 * s);
    ctx.fillRect(cx + 8 * s, cy + 8 * s - bobOffset, 3 * s, 5 * s);

    // 4. Layer: Head & Skin Tone
    ctx.fillStyle = currentSkin;
    ctx.fillRect(cx - 8 * s, cy - 20 * s - bobOffset, 16 * s, 18 * s);

    // 5. Layer: Face Features (Directional)
    if (currentDir === 'down') {
      // Eyes
      ctx.fillStyle = '#17162E';
      ctx.fillRect(cx - 5 * s, cy - 12 * s - bobOffset, 3 * s, 4 * s);
      ctx.fillRect(cx + 2 * s, cy - 12 * s - bobOffset, 3 * s, 4 * s);
      // Highlights
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx - 5 * s, cy - 12 * s - bobOffset, 1 * s, 2 * s);
      ctx.fillRect(cx + 2 * s, cy - 12 * s - bobOffset, 1 * s, 2 * s);
    } else if (currentDir === 'left') {
      ctx.fillStyle = '#17162E';
      ctx.fillRect(cx - 6 * s, cy - 12 * s - bobOffset, 3 * s, 4 * s);
    } else if (currentDir === 'right') {
      ctx.fillStyle = '#17162E';
      ctx.fillRect(cx + 3 * s, cy - 12 * s - bobOffset, 3 * s, 4 * s);
    }

    // 6. Layer: Hairstyle
    ctx.fillStyle = currentHair;
    if (config.hairStyle === 'spiky') {
      ctx.fillRect(cx - 9 * s, cy - 26 * s - bobOffset, 18 * s, 8 * s);
      ctx.fillRect(cx - 7 * s, cy - 29 * s - bobOffset, 5 * s, 4 * s);
      ctx.fillRect(cx + 2 * s, cy - 29 * s - bobOffset, 5 * s, 4 * s);
    } else if (config.hairStyle === 'bob') {
      ctx.fillRect(cx - 10 * s, cy - 24 * s - bobOffset, 20 * s, 14 * s);
    } else if (config.hairStyle === 'curly') {
      ctx.fillRect(cx - 11 * s, cy - 26 * s - bobOffset, 22 * s, 10 * s);
      ctx.fillRect(cx - 10 * s, cy - 16 * s - bobOffset, 20 * s, 6 * s);
    } else {
      // Short default
      ctx.fillRect(cx - 9 * s, cy - 24 * s - bobOffset, 18 * s, 6 * s);
    }

    // 7. Layer: Animal Mask (if facing down, left, right)
    if (currentDir !== 'up' && config.animalMask) {
      if (config.animalMask === 'fox') {
        ctx.fillStyle = '#FF4FD8';
        ctx.fillRect(cx - 8 * s, cy - 16 * s - bobOffset, 16 * s, 10 * s);
        // Fox Ears
        ctx.fillStyle = '#8B5CF6';
        ctx.fillRect(cx - 8 * s, cy - 25 * s - bobOffset, 4 * s, 9 * s);
        ctx.fillRect(cx + 4 * s, cy - 25 * s - bobOffset, 4 * s, 9 * s);
        // Cyan Visor / Whiskers
        ctx.fillStyle = '#37E7FF';
        ctx.fillRect(cx - 6 * s, cy - 13 * s - bobOffset, 12 * s, 3 * s);
      } else if (config.animalMask === 'cat') {
        ctx.fillStyle = '#37E7FF';
        ctx.fillRect(cx - 8 * s, cy - 15 * s - bobOffset, 16 * s, 9 * s);
        ctx.fillStyle = '#FF4FD8';
        ctx.fillRect(cx - 7 * s, cy - 23 * s - bobOffset, 4 * s, 8 * s);
        ctx.fillRect(cx + 3 * s, cy - 23 * s - bobOffset, 4 * s, 8 * s);
      } else if (config.animalMask === 'cyber_visor') {
        ctx.fillStyle = '#17162E';
        ctx.fillRect(cx - 9 * s, cy - 15 * s - bobOffset, 18 * s, 7 * s);
        ctx.fillStyle = '#37E7FF';
        ctx.fillRect(cx - 8 * s, cy - 14 * s - bobOffset, 16 * s, 4 * s);
      }
    }
  }, [config, currentDir, frameIndex, scale, width, height]);

  const rotate = (dir: 'left' | 'right') => {
    const sequence: CharacterDirection[] = ['down', 'left', 'up', 'right'];
    const curIdx = sequence.indexOf(currentDir);
    if (dir === 'left') {
      const next = (curIdx + 1) % sequence.length;
      setCurrentDir(sequence[next]);
    } else {
      const next = (curIdx - 1 + sequence.length) % sequence.length;
      setCurrentDir(sequence[next]);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative p-4 rounded-xl bg-[#0D1025] border-2 border-brand-purple shadow-lg shadow-purple-950/40">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="pixelated block rounded"
        />
        <div className="absolute top-2 right-2 text-[10px] font-mono bg-[#17162E]/80 px-2 py-0.5 rounded text-brand-cyan border border-brand-cyan/40">
          8-BIT PHASER
        </div>
      </div>

      {interactiveRotation && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => rotate('left')}
            className="px-3 py-1 bg-[#17162E] hover:bg-[#262047] border border-brand-purple text-xs font-display font-semibold rounded text-text-primary transition-colors"
          >
            ◀ หมุนซ้าย
          </button>
          <span className="text-xs font-mono text-text-muted capitalize px-2">
            ทิศทาง: {currentDir}
          </span>
          <button
            onClick={() => rotate('right')}
            className="px-3 py-1 bg-[#17162E] hover:bg-[#262047] border border-brand-purple text-xs font-display font-semibold rounded text-text-primary transition-colors"
          >
            หมุนขวา ▶
          </button>
        </div>
      )}
    </div>
  );
};
