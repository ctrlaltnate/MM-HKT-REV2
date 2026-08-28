import * as Phaser from "phaser";
import { CharacterCompositor } from "../compositor/CharacterCompositor";
import { WorldPropsFactory } from "../compositor/WorldPropsFactory";
import { PreRenderedAssetLoader } from "../compositor/PreRenderedAssetLoader";
import type { GameInitPayload } from "../bridge";

export class BootScene extends Phaser.Scene {
  private initPayload?: GameInitPayload;

  constructor(payload?: GameInitPayload) {
    super({ key: "BootScene" });
    this.initPayload = payload;
  }

  init(data?: GameInitPayload): void {
    if (data) {
      this.initPayload = data;
    }
  }

  preload(): void {
    // Show Loading Text / Cyberpunk Progress Bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const loadingText = this.add.text(width / 2, height / 2 - 20, "⚡ กำลังเข้าสู่ Virtual Career Hall...", {
      fontFamily: '"Prompt", sans-serif',
      fontSize: "16px",
      color: "#78DBE6",
    });
    loadingText.setOrigin(0.5, 0.5);

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x0f172a, 0.8);
    progressBox.lineStyle(2, 0x1e3a5f, 1);
    progressBox.fillRoundedRect(width / 2 - 140, height / 2 + 10, 280, 16, 4);
    progressBox.strokeRoundedRect(width / 2 - 140, height / 2 + 10, 280, 16, 4);

    this.load.on("progress", (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x78dbe6, 1);
      progressBar.fillRoundedRect(width / 2 - 138, height / 2 + 12, 276 * value, 12, 3);
    });

    // Preload game reference map and sprite assets
    this.load.image("master_pokemon_hall", "/assets/game/master_pokemon_career_hall.jpg");
    this.load.image("map_bg", "/assets/game/00_MAIN_spritesheet_booths_characters_props.png");
    this.load.image("sprites_ref", "/assets/game/00_MAIN_virtual_job_fair_map.jpg");
    this.load.image("pokemon_furniture_pack", "/assets/game/pokemon_furniture_pack.jpg");
    this.load.image("pokemon_characters_pack", "/assets/game/pokemon_characters_pack.jpg");
    this.load.image("pokemon_booths_pack", "/assets/game/pokemon_booths_pack.jpg");
  }

  create(): void {
    // 1. Slice all Authentic Pre-rendered Sprites & Booth Facades from sprites_ref
    PreRenderedAssetLoader.sliceAllPreRenderedAssets(this);

    // 2. Create Procedural Props & Tilesets
    WorldPropsFactory.registerAllProps(this);

    // 3. Create Procedural NPC Textures if not present
    this.createProceduralNPCTextures();

    // 4. Register Player 4-Way Animated Texture via CharacterCompositor
    CharacterCompositor.registerPlayerToScene(this, this.initPayload?.playerAvatar, "player_custom");

    // 5. Transition to Main Career Hall Scene
    this.scene.start("CareerHallScene", this.initPayload);
  }

  private createProceduralNPCTextures(): void {
    // Create NPC Recruiter Texture (32x48)
    if (!this.textures.exists("npc_recruiter")) {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 48;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        // Body / Suit (Navy blue suit)
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(8, 20, 16, 14);
        // Tie (Gold)
        ctx.fillStyle = "#ffd84d";
        ctx.fillRect(15, 20, 2, 8);
        // Pants
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(10, 34, 5, 8);
        ctx.fillRect(17, 34, 5, 8);
        // Shoes
        ctx.fillStyle = "#334155";
        ctx.fillRect(9, 42, 6, 3);
        ctx.fillRect(17, 42, 6, 3);
        // Head / Skin
        ctx.fillStyle = "#f5d0b5";
        ctx.fillRect(10, 8, 12, 12);
        // Hair (Professional Brown)
        ctx.fillStyle = "#451a03";
        ctx.fillRect(9, 6, 14, 5);
        ctx.fillRect(8, 8, 3, 6);
        ctx.fillRect(21, 8, 3, 6);
        // Eyes
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(12, 13, 2, 2);
        ctx.fillRect(18, 13, 2, 2);
      }
      const t = this.textures.addCanvas("npc_recruiter", canvas);
      if (t && typeof t.refresh === "function") {
        t.refresh();
      }
    }

    // Create NPC Info Staff Texture (32x48)
    if (!this.textures.exists("npc_info")) {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 48;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        // Teal/Cyan Vest
        ctx.fillStyle = "#0891b2";
        ctx.fillRect(8, 20, 16, 14);
        // White shirt under
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(13, 20, 6, 6);
        // Pants
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(10, 34, 5, 8);
        ctx.fillRect(17, 34, 5, 8);
        // Head / Skin
        ctx.fillStyle = "#fed7aa";
        ctx.fillRect(10, 8, 12, 12);
        // Hair (Cyan Headband style)
        ctx.fillStyle = "#78dbe6";
        ctx.fillRect(9, 6, 14, 4);
        ctx.fillStyle = "#0e7490";
        ctx.fillRect(8, 10, 16, 2);
        // Eyes
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(12, 14, 2, 2);
        ctx.fillRect(18, 14, 2, 2);
      }
      const t = this.textures.addCanvas("npc_info", canvas);
      if (t && typeof t.refresh === "function") {
        t.refresh();
      }
    }
  }
}
