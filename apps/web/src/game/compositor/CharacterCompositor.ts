import type { PlayerAvatarConfig } from "../bridge";

export class CharacterCompositor {
  private static parseHexColor(hex: string | undefined, defaultHex: string): string {
    if (!hex || typeof hex !== "string") return defaultHex;
    return hex.startsWith("#") ? hex : `#${hex}`;
  }

  private static hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace("#", "");
    if (clean.length === 3) {
      const c0 = clean[0] || "0";
      const c1 = clean[1] || "0";
      const c2 = clean[2] || "0";
      const r = parseInt(c0 + c0, 16);
      const g = parseInt(c1 + c1, 16);
      const b = parseInt(c2 + c2, 16);
      return [r, g, b];
    }
    const num = parseInt(clean, 16) || 0;
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  private static adjustColor(hex: string, amount: number): string {
    const [r, g, b] = this.hexToRgb(hex);
    const clamp = (val: number) => Math.max(0, Math.min(255, val));
    const nr = clamp(r + amount);
    const ng = clamp(g + amount);
    const nb = clamp(b + amount);
    return `rgb(${nr}, ${ng}, ${nb})`;
  }

  public static renderAllFrames(ctx: CanvasRenderingContext2D, config?: PlayerAvatarConfig): void {
    ctx.imageSmoothingEnabled = false;

    // Resolve color tokens from avatar config
    const skinTone = this.parseHexColor(config?.skinTone, "#D4956A");
    const skinDark = this.adjustColor(skinTone, -25);
    const skinHighlight = this.adjustColor(skinTone, 15);

    const hairColor = this.parseHexColor(config?.hairColor, "#4A2E18");
    const hairDark = this.adjustColor(hairColor, -30);
    const hairLight = this.adjustColor(hairColor, 25);

    const shirtColor = this.parseHexColor(config?.shirtColor, "#2563EB");
    const shirtDark = this.adjustColor(shirtColor, -35);
    const shirtLight = this.adjustColor(shirtColor, 25);

    const pantsColor = this.parseHexColor(config?.pantsColor, "#1E293B");
    const pantsDark = this.adjustColor(pantsColor, -25);

    const hairStyle = config?.hairStyle || "short";
    const accessory = config?.accessory || "backpack";

    const frameW = 32;
    const frameH = 48;

    // Draw all 16 frames (4 directions x 4 walk frames)
    for (let dir = 0; dir < 4; dir++) {
      // dir 0: Down, dir 1: Left, dir 2: Right, dir 3: Up
      for (let frame = 0; frame < 4; frame++) {
        const ox = frame * frameW;
        const oy = dir * frameH;

        this.drawSingleFrame({
          ctx,
          ox,
          oy,
          dir,
          frame,
          skinTone,
          skinDark,
          skinHighlight,
          hairColor,
          hairDark,
          hairLight,
          shirtColor,
          shirtDark,
          shirtLight,
          pantsColor,
          pantsDark,
          hairStyle,
          accessory,
        });
      }
    }
  }

  public static generateCharacterCanvas(config?: PlayerAvatarConfig): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 192;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      this.renderAllFrames(ctx, config);
    }
    return canvas;
  }

  private static drawSingleFrame(params: {
    ctx: CanvasRenderingContext2D;
    ox: number;
    oy: number;
    dir: number; // 0=down, 1=left, 2=right, 3=up
    frame: number; // 0=stand, 1=walk1, 2=stand, 3=walk2
    skinTone: string;
    skinDark: string;
    skinHighlight: string;
    hairColor: string;
    hairDark: string;
    hairLight: string;
    shirtColor: string;
    shirtDark: string;
    shirtLight: string;
    pantsColor: string;
    pantsDark: string;
    hairStyle: string;
    accessory: string;
  }) {
    const { ctx, ox, oy, dir, frame } = params;

    const bob = frame % 2 === 1 ? -1 : 0;
    const legOffset = frame === 1 ? 2 : frame === 3 ? -2 : 0;

    // 1. SHADOW (Soft oval under feet)
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(ox + 16, oy + 44, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. BACKPACK (Facing UP)
    if (params.accessory === "backpack" || params.accessory === "all") {
      if (dir === 3) {
        ctx.fillStyle = "#A855F7";
        ctx.fillRect(ox + 10, oy + 21 + bob, 12, 11);
        ctx.fillStyle = "#7E22CE";
        ctx.fillRect(ox + 11, oy + 23 + bob, 10, 8);
        ctx.fillStyle = "#D8B4FE";
        ctx.fillRect(ox + 13, oy + 25 + bob, 6, 2);
      }
    }

    // 3. LEGS & SHOES
    if (dir === 0 || dir === 3) {
      ctx.fillStyle = params.pantsColor;
      ctx.fillRect(ox + 10, oy + 32 + bob + (frame === 1 ? -1 : 0), 4, 8 + (frame === 1 ? 1 : 0));
      ctx.fillRect(ox + 18, oy + 32 + bob + (frame === 3 ? -1 : 0), 4, 8 + (frame === 3 ? 1 : 0));

      ctx.fillStyle = "#334155";
      ctx.fillRect(ox + 9, oy + 40 + bob + (frame === 1 ? -1 : 0), 5, 4);
      ctx.fillRect(ox + 18, oy + 40 + bob + (frame === 3 ? -1 : 0), 5, 4);
    } else {
      const legX = dir === 1 ? ox + 14 : ox + 14;
      ctx.fillStyle = params.pantsColor;
      ctx.fillRect(legX - legOffset, oy + 32 + bob, 5, 8);
      ctx.fillStyle = params.pantsDark;
      ctx.fillRect(legX + legOffset, oy + 32 + bob, 4, 8);

      ctx.fillStyle = "#334155";
      ctx.fillRect(legX - legOffset - (dir === 1 ? 2 : 0), oy + 40 + bob, 6, 4);
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(legX + legOffset - (dir === 1 ? 2 : 0), oy + 40 + bob, 5, 4);
    }

    // 4. TORSO & SHIRT
    if (dir === 0) {
      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(ox + 9, oy + 19 + bob, 14, 14);
      ctx.fillStyle = params.shirtLight;
      ctx.fillRect(ox + 11, oy + 20 + bob, 4, 8);
      ctx.fillStyle = params.shirtDark;
      ctx.fillRect(ox + 21, oy + 20 + bob, 2, 13);
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(ox + 14, oy + 18 + bob, 4, 3);
    } else if (dir === 3) {
      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(ox + 9, oy + 19 + bob, 14, 14);
      ctx.fillStyle = params.shirtDark;
      ctx.fillRect(ox + 9, oy + 31 + bob, 14, 2);
    } else {
      const isLeft = dir === 1;
      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(ox + 11, oy + 19 + bob, 10, 14);
      ctx.fillStyle = isLeft ? params.shirtLight : params.shirtDark;
      ctx.fillRect(isLeft ? ox + 11 : ox + 19, oy + 19 + bob, 2, 14);
    }

    // 5. ARMS & HANDS
    if (dir === 0) {
      const armSwing = frame === 1 ? 2 : frame === 3 ? -2 : 0;
      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(ox + 6, oy + 20 + bob - armSwing, 3, 7);
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(ox + 6, oy + 27 + bob - armSwing, 3, 3);

      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(ox + 23, oy + 20 + bob + armSwing, 3, 7);
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(ox + 23, oy + 27 + bob + armSwing, 3, 3);
    } else if (dir === 3) {
      const armSwing = frame === 1 ? 2 : frame === 3 ? -2 : 0;
      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(ox + 6, oy + 20 + bob + armSwing, 3, 7);
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(ox + 6, oy + 27 + bob + armSwing, 3, 3);

      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(ox + 23, oy + 20 + bob - armSwing, 3, 7);
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(ox + 23, oy + 27 + bob - armSwing, 3, 3);
    } else {
      const isLeft = dir === 1;
      const armSwing = frame === 1 ? 4 : frame === 3 ? -4 : 0;
      const armX = isLeft ? ox + 14 + armSwing : ox + 14 - armSwing;
      ctx.fillStyle = params.shirtColor;
      ctx.fillRect(armX, oy + 21 + bob, 4, 7);
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(armX, oy + 28 + bob, 4, 3);
    }

    // 6. HEAD & SKIN BASE
    if (dir === 0 || dir === 3) {
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(ox + 9, oy + 6 + bob, 14, 13);
      ctx.fillStyle = params.skinDark;
      ctx.fillRect(ox + 9, oy + 17 + bob, 14, 2);
    } else {
      const isLeft = dir === 1;
      ctx.fillStyle = params.skinTone;
      ctx.fillRect(isLeft ? ox + 8 : ox + 10, oy + 6 + bob, 14, 13);
      ctx.fillRect(isLeft ? ox + 6 : ox + 22, oy + 12 + bob, 3, 3);
    }

    // 7. FACE & EYES
    if (dir === 0) {
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(ox + 12, oy + 11 + bob, 2, 3);
      ctx.fillRect(ox + 18, oy + 11 + bob, 2, 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(ox + 12, oy + 11 + bob, 1, 1);
      ctx.fillRect(ox + 18, oy + 11 + bob, 1, 1);

      ctx.fillStyle = "#831843";
      ctx.fillRect(ox + 14, oy + 15 + bob, 4, 1);

      if (params.accessory === "glasses" || params.accessory === "all") {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(ox + 11, oy + 10 + bob, 4, 4);
        ctx.strokeRect(ox + 17, oy + 10 + bob, 4, 4);
        ctx.beginPath();
        ctx.moveTo(ox + 15, oy + 12 + bob);
        ctx.lineTo(ox + 17, oy + 12 + bob);
        ctx.stroke();
      }
    } else if (dir === 1 || dir === 2) {
      const isLeft = dir === 1;
      const eyeX = isLeft ? ox + 9 : ox + 20;
      ctx.fillStyle = "#1E293B";
      ctx.fillRect(eyeX, oy + 11 + bob, 2, 3);
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(eyeX, oy + 11 + bob, 1, 1);

      if (params.accessory === "glasses" || params.accessory === "all") {
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;
        ctx.strokeRect(eyeX - 1, oy + 10 + bob, 4, 4);
      }
    }

    // 8. HAIRSTYLE
    ctx.fillStyle = params.hairColor;
    if (params.hairStyle === "bald") {
      if (dir === 3) {
        ctx.fillStyle = params.hairDark;
        ctx.fillRect(ox + 10, oy + 5 + bob, 12, 3);
      }
    } else if (params.hairStyle === "long" || params.hairStyle === "ponytail") {
      if (dir === 0) {
        ctx.fillRect(ox + 8, oy + 3 + bob, 16, 6);
        ctx.fillRect(ox + 7, oy + 6 + bob, 3, 15);
        ctx.fillRect(ox + 22, oy + 6 + bob, 3, 15);
        ctx.fillStyle = params.hairLight;
        ctx.fillRect(ox + 11, oy + 4 + bob, 6, 2);
      } else if (dir === 3) {
        ctx.fillRect(ox + 8, oy + 3 + bob, 16, 18);
        ctx.fillStyle = params.hairDark;
        ctx.fillRect(ox + 9, oy + 16 + bob, 14, 5);
      } else {
        const isLeft = dir === 1;
        ctx.fillRect(ox + 8, oy + 3 + bob, 15, 6);
        ctx.fillRect(isLeft ? ox + 15 : ox + 8, oy + 6 + bob, 6, 16);
      }
    } else if (params.hairStyle === "curly") {
      if (dir === 0 || dir === 3) {
        ctx.fillRect(ox + 7, oy + 2 + bob, 18, 9);
        ctx.fillRect(ox + 6, oy + 6 + bob, 3, 8);
        ctx.fillRect(ox + 23, oy + 6 + bob, 3, 8);
        ctx.fillStyle = params.hairLight;
        ctx.fillRect(ox + 9, oy + 3 + bob, 3, 2);
        ctx.fillRect(ox + 15, oy + 3 + bob, 3, 2);
      } else {
        ctx.fillRect(ox + 7, oy + 2 + bob, 18, 9);
        ctx.fillRect(ox + 8, oy + 7 + bob, 14, 6);
      }
    } else {
      if (dir === 0) {
        ctx.fillRect(ox + 8, oy + 3 + bob, 16, 6);
        ctx.fillRect(ox + 7, oy + 6 + bob, 3, 7);
        ctx.fillRect(ox + 22, oy + 6 + bob, 3, 7);
        ctx.fillRect(ox + 10, oy + 2 + bob, 4, 2);
        ctx.fillRect(ox + 17, oy + 1 + bob, 4, 3);
        ctx.fillStyle = params.hairLight;
        ctx.fillRect(ox + 11, oy + 4 + bob, 6, 2);
      } else if (dir === 3) {
        ctx.fillRect(ox + 8, oy + 3 + bob, 16, 12);
        ctx.fillRect(ox + 9, oy + 12 + bob, 14, 4);
        ctx.fillStyle = params.hairDark;
        ctx.fillRect(ox + 10, oy + 13 + bob, 12, 3);
      } else {
        const isLeft = dir === 1;
        ctx.fillRect(ox + 7, oy + 3 + bob, 17, 7);
        ctx.fillRect(isLeft ? ox + 15 : ox + 8, oy + 7 + bob, 7, 7);
        ctx.fillRect(isLeft ? ox + 18 : ox + 6, oy + 3 + bob, 4, 3);
      }
    }
  }

  public static registerPlayerToScene(scene: any, avatarConfig?: PlayerAvatarConfig, textureKey = "player_custom"): void {
    if (scene.textures.exists(textureKey)) {
      const existing = scene.textures.get(textureKey) as any;
      if (existing && existing.canvas) {
        const ctx = existing.context || existing.canvas.getContext("2d");
        if (ctx) {
          ctx.clearRect(0, 0, existing.canvas.width, existing.canvas.height);
          this.renderAllFrames(ctx, avatarConfig);
          if (typeof existing.refresh === "function") {
            existing.refresh();
          }
        }
        return;
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 192;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      this.renderAllFrames(ctx, avatarConfig);
    }

    const texture = scene.textures.addCanvas(textureKey, canvas);

    if (texture) {
      let frameIdx = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          texture.add(`frame_${frameIdx}`, 0, col * 32, row * 48, 32, 48);
          frameIdx++;
        }
      }
      if (typeof texture.refresh === "function") {
        texture.refresh();
      }
    }

    const anims = scene.anims;

    const ensureAnim = (key: string, frameIndices: number[], frameRate = 8) => {
      if (!anims.exists(key)) {
        anims.create({
          key,
          frames: frameIndices.map((idx) => ({ key: textureKey, frame: `frame_${idx}` })),
          frameRate,
          repeat: -1,
        });
      }
    };

    const ensureIdle = (key: string, frameIndex: number) => {
      if (!anims.exists(key)) {
        anims.create({
          key,
          frames: [{ key: textureKey, frame: `frame_${frameIndex}` }],
          frameRate: 1,
        });
      }
    };

    // 4 Walk Cycles
    ensureAnim("player-walk-down", [0, 1, 2, 3], 8);
    ensureAnim("player-walk-left", [4, 5, 6, 7], 8);
    ensureAnim("player-walk-right", [8, 9, 10, 11], 8);
    ensureAnim("player-walk-up", [12, 13, 14, 15], 8);

    // 4 Idle Stances
    ensureIdle("player-idle-down", 0);
    ensureIdle("player-idle-left", 4);
    ensureIdle("player-idle-right", 8);
    ensureIdle("player-idle-up", 12);
  }
}
