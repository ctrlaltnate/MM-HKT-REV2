import * as Phaser from "phaser";

export class WorldPropsFactory {
  public static registerAllProps(scene: Phaser.Scene): void {
    this.createCounterDeskTexture(scene);
    this.createInfoDeskTexture(scene);
    this.createLaptopTexture(scene);
    this.createMonitorTexture(scene);
    this.createPlantTexture(scene);
    this.createServerRackTexture(scene);
    this.createRollupBannerTexture(scene);
    this.createFloorTilesTexture(scene);
  }

  // 1. Counter Desk (Front Booth Table) 140x36 px
  private static createCounterDeskTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("prop_counter_desk")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 140;
    canvas.height = 36;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Drop shadow under desk
      ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
      ctx.fillRect(4, 28, 132, 8);

      // Desk Top Surface (Isometric front lip)
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(4, 4, 132, 12);
      // Top Edge Highlight (Teal accent strip)
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(4, 4, 132, 2);
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(4, 15, 132, 1);

      // Desk Front Panel (Dark metallic)
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(4, 16, 132, 14);
      // Panel dividing insets
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(20, 18, 45, 10);
      ctx.fillRect(75, 18, 45, 10);

      // Table legs
      ctx.fillStyle = "#334155";
      ctx.fillRect(6, 28, 6, 6);
      ctx.fillRect(128, 28, 6, 6);
    }

    const t = scene.textures.addCanvas("prop_counter_desk", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }

  // 2. Info Desk Circular Console (Center Reception) 120x44 px
  private static createInfoDeskTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("prop_info_desk")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 120;
    canvas.height = 44;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Drop Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.beginPath();
      ctx.ellipse(60, 36, 56, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Rounded Front Counter
      ctx.fillStyle = "#0891b2";
      ctx.beginPath();
      ctx.roundRect(10, 14, 100, 22, [0, 0, 16, 16]);
      ctx.fill();

      // Front Neon Emblem (Info Icon / Circle)
      ctx.fillStyle = "#0e7490";
      ctx.fillRect(12, 16, 96, 18);
      ctx.fillStyle = "#78dbe6";
      ctx.beginPath();
      ctx.arc(60, 25, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#083344";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("i", 60, 25);

      // Top Counter Surface (Light Cyan Gloss)
      ctx.fillStyle = "#155e75";
      ctx.beginPath();
      ctx.roundRect(8, 4, 104, 14, 6);
      ctx.fill();
      ctx.fillStyle = "#67e8f9";
      ctx.fillRect(10, 4, 100, 2);
    }

    const t = scene.textures.addCanvas("prop_info_desk", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }

  // 3. Glowing Laptop 24x18 px
  private static createLaptopTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("prop_laptop")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 18;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Base / Keyboard (Bottom)
      ctx.fillStyle = "#475569";
      ctx.fillRect(2, 12, 20, 4);
      ctx.fillStyle = "#64748b";
      ctx.fillRect(4, 13, 16, 2);

      // Screen (Angled Up)
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(4, 2, 16, 11);
      // Glowing Screen Matrix (Cyan code display)
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(6, 4, 12, 7);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(7, 5, 4, 1);
      ctx.fillRect(7, 7, 7, 1);
      ctx.fillRect(7, 9, 5, 1);
    }

    const t = scene.textures.addCanvas("prop_laptop", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }

  // 4. Dual Monitor Setup 36x24 px
  private static createMonitorTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("prop_monitor")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 36;
    canvas.height = 24;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Monitor Stand
      ctx.fillStyle = "#334155";
      ctx.fillRect(16, 16, 4, 6);
      ctx.fillRect(12, 21, 12, 2);

      // Left Screen
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(2, 4, 15, 12);
      ctx.fillStyle = "#a855f7"; // Purple IDE
      ctx.fillRect(3, 5, 13, 10);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(5, 7, 6, 1);
      ctx.fillRect(5, 9, 8, 1);
      ctx.fillRect(5, 11, 4, 1);

      // Right Screen
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(19, 4, 15, 12);
      ctx.fillStyle = "#22c55e"; // Green Analytics Chart
      ctx.fillRect(20, 5, 13, 10);
      ctx.fillStyle = "#bbf7d0";
      ctx.fillRect(22, 11, 2, 3);
      ctx.fillRect(25, 9, 2, 5);
      ctx.fillRect(28, 7, 2, 7);
    }

    const t = scene.textures.addCanvas("prop_monitor", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }

  // 5. Potted Plant (Ficus / Cyber Bonsai) 28x36 px
  private static createPlantTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("prop_plant")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 28;
    canvas.height = 36;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Pot Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.beginPath();
      ctx.ellipse(14, 33, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cyber Ceramic Pot (Hexagonal White & Copper)
      ctx.fillStyle = "#cbd5e1";
      ctx.beginPath();
      ctx.moveTo(6, 22);
      ctx.lineTo(22, 22);
      ctx.lineTo(20, 33);
      ctx.lineTo(8, 33);
      ctx.closePath();
      ctx.fill();
      // Pot Accent line
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(7, 25, 14, 2);

      // Lush Leaves (Layered Green Spheres)
      ctx.fillStyle = "#15803d";
      ctx.beginPath();
      ctx.arc(14, 14, 9, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(11, 10, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#4ade80";
      ctx.beginPath();
      ctx.arc(16, 8, 6, 0, Math.PI * 2);
      ctx.fill();

      // Leaf highlights
      ctx.fillStyle = "#86efac";
      ctx.fillRect(15, 6, 3, 2);
      ctx.fillRect(9, 8, 2, 2);
    }

    const t = scene.textures.addCanvas("prop_plant", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }

  // 6. Server Rack with Blinking LEDs 26x48 px
  private static createServerRackTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("prop_server")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 26;
    canvas.height = 48;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      ctx.fillRect(2, 44, 22, 4);

      // Server Cabinet Frame
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(2, 4, 22, 41);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 1;
      ctx.strokeRect(2.5, 4.5, 21, 40);

      // Server Units (4 Slots)
      for (let i = 0; i < 4; i++) {
        const slotY = 8 + i * 9;
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(4, slotY, 18, 7);

        // Blinking LEDs
        ctx.fillStyle = i % 2 === 0 ? "#22c55e" : "#38bdf8";
        ctx.fillRect(6, slotY + 2, 2, 2);
        ctx.fillStyle = "#f59e0b";
        ctx.fillRect(9, slotY + 2, 2, 2);

        // Vent slits
        ctx.fillStyle = "#0f172a";
        ctx.fillRect(13, slotY + 2, 7, 1);
        ctx.fillRect(13, slotY + 4, 7, 1);
      }
    }

    const t = scene.textures.addCanvas("prop_server", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }

  // 7. Rollup Stand Banner 24x48 px
  private static createRollupBannerTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("prop_rollup")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 24;
    canvas.height = 48;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Stand Base
      ctx.fillStyle = "#334155";
      ctx.fillRect(2, 43, 20, 4);

      // Banner Canvas
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(4, 6, 16, 37);
      ctx.fillStyle = "#38bdf8";
      ctx.fillRect(4, 6, 16, 4);

      // Company Logo Graphic
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(8, 14, 8, 8);
      ctx.fillStyle = "#0284c7";
      ctx.fillRect(10, 16, 4, 4);

      // Typography bars
      ctx.fillStyle = "#e0f2fe";
      ctx.fillRect(6, 26, 12, 2);
      ctx.fillRect(6, 30, 9, 2);
      ctx.fillRect(6, 34, 11, 2);
    }

    const t = scene.textures.addCanvas("prop_rollup", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }

  // 8. Tiled Convention Floor Texture (64x64 Seamless Tile)
  private static createFloorTilesTexture(scene: Phaser.Scene): void {
    if (scene.textures.exists("tile_expo_floor")) return;

    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.imageSmoothingEnabled = false;

      // Base Floor Color (Deep Convention Tech Navy)
      ctx.fillStyle = "#0a1526";
      ctx.fillRect(0, 0, 64, 64);

      // 32x32 Grid Checker
      ctx.fillStyle = "#0f1d36";
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillRect(32, 32, 32, 32);

      // Fine Grid Seams
      ctx.strokeStyle = "#162847";
      ctx.lineWidth = 1;
      ctx.strokeRect(0.5, 0.5, 31, 31);
      ctx.strokeRect(32.5, 0.5, 31, 31);
      ctx.strokeRect(0.5, 32.5, 31, 31);
      ctx.strokeRect(32.5, 32.5, 31, 31);

      // Micro Tech Dot Insets
      ctx.fillStyle = "#1e3a5f";
      ctx.fillRect(15, 15, 2, 2);
      ctx.fillRect(47, 15, 2, 2);
      ctx.fillRect(15, 47, 2, 2);
      ctx.fillRect(47, 47, 2, 2);
    }

    const t = scene.textures.addCanvas("tile_expo_floor", canvas);
    if (t && typeof t.refresh === "function") t.refresh();
  }
}
