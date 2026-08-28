import * as Phaser from "phaser";
import { gameBridge, type GameBoothData } from "../bridge";

export class BoothEntity extends Phaser.GameObjects.Container {
  public boothData: GameBoothData;
  private promptBubble: Phaser.GameObjects.Container;
  private isPlayerNearby = false;
  private recruiterSprite: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene, x: number, y: number, data: GameBoothData) {
    super(scene, x, y);
    this.boothData = data;

    (scene.add as any).existing(this);
    this.setDepth(y);

    const boothW = 120;
    const tableNum = data.tableNumber || 1;

    // Theme color palette per booth (Blue, Emerald, Purple, Orange, Crimson, Amber)
    const themeColors = [0x0284c7, 0x10b981, 0x8b5cf6, 0xf97316, 0xef4444, 0xeab308];
    const themeHexes = ["#38BDF8", "#34D399", "#A78BFA", "#FB923C", "#F87171", "#FDE047"];
    const themeColor = themeColors[(tableNum - 1) % themeColors.length] || 0x0284c7;
    const themeHex = themeHexes[(tableNum - 1) % themeHexes.length] || "#38BDF8";

    // 1. DYNAMIC ILLUMINATED BRAND WALL DISPLAY (Fitted on the backwall screen)
    const screenW = 96;
    const screenH = 46;
    const screenX = -screenW / 2;
    const screenY = -52;

    const brandGfx = new Phaser.GameObjects.Graphics(scene);

    // Inner Glowing Screen Background
    brandGfx.fillStyle(0x0a192c, 0.96);
    brandGfx.fillRoundedRect(screenX, screenY, screenW, screenH, 4);

    // Glowing Theme Neon Border
    brandGfx.lineStyle(1.5, themeColor, 0.95);
    brandGfx.strokeRoundedRect(screenX, screenY, screenW, screenH, 4);

    // Scanline details
    brandGfx.fillStyle(themeColor, 0.12);
    for (let sy = screenY + 4; sy < screenY + screenH - 2; sy += 4) {
      brandGfx.fillRect(screenX + 2, sy, screenW - 4, 1.5);
    }
    this.add(brandGfx);

    // Dynamic Company Logo / Initial Badge
    const initials = data.companyName
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 3)
      .toUpperCase();

    const logoBadgeGfx = new Phaser.GameObjects.Graphics(scene);
    logoBadgeGfx.fillStyle(themeColor, 0.35);
    logoBadgeGfx.lineStyle(1, themeColor, 1);
    logoBadgeGfx.fillRoundedRect(-screenW / 2 + 5, screenY + 6, 20, 20, 3);
    logoBadgeGfx.strokeRoundedRect(-screenW / 2 + 5, screenY + 6, 20, 20, 3);

    const logoText = new Phaser.GameObjects.Text(scene, -screenW / 2 + 15, screenY + 16, initials, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "9px",
      fontStyle: "bold",
      color: "#FFFFFF",
    });
    logoText.setOrigin(0.5, 0.5);
    logoText.setResolution(3);

    // Dynamic Company Name on Brand Screen (High-DPI)
    const maxScreenTitleLen = 10;
    const screenTitle =
      data.companyName.length > maxScreenTitleLen
        ? `${data.companyName.slice(0, maxScreenTitleLen)}...`
        : data.companyName;

    const brandName = new Phaser.GameObjects.Text(scene, -screenW / 2 + 28, screenY + 7, screenTitle, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "10px",
      fontStyle: "bold",
      color: "#FFFFFF",
    });
    brandName.setResolution(3);

    // Dynamic Industry Subtitle on Brand Screen (High-DPI)
    const industryText = (data.companyIndustry || "TECH").toUpperCase();
    const displayIndustry = industryText.length > 11 ? `${industryText.slice(0, 11)}...` : industryText;

    const brandIndustry = new Phaser.GameObjects.Text(scene, -screenW / 2 + 28, screenY + 20, displayIndustry, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "7px",
      fontStyle: "bold",
      color: themeHex,
    });
    brandIndustry.setResolution(3);

    this.add([logoBadgeGfx, logoText, brandName, brandIndustry]);

    // 2. RECRUITER NPC (Standing Behind the Front Desk with Contact Drop Shadow)
    const recruiterKeys = [
      "npc_recruiter_female_hd",
      "npc_recruiter_glasses_hd",
      "npc_recruiter_female_hd",
      "npc_recruiter_laptop_hd",
      "npc_recruiter_green_hd",
      "npc_recruiter_female_hd",
    ];
    const recKey = recruiterKeys[(tableNum - 1) % recruiterKeys.length] || "npc_recruiter_female_hd";

    const recX = 22;
    const recY = 12;

    // Contact drop shadow directly under recruiter's feet
    const shadowGfx = new Phaser.GameObjects.Graphics(scene);
    shadowGfx.fillStyle(0x000000, 0.45);
    shadowGfx.fillEllipse(recX, recY + 16, 16, 6);
    this.add(shadowGfx);

    if (scene.textures.exists(recKey)) {
      this.recruiterSprite = new Phaser.GameObjects.Sprite(scene, recX, recY, recKey);
      this.recruiterSprite.setOrigin(0.5, 0.85);
      this.recruiterSprite.setScale(0.32);
      this.add(this.recruiterSprite);
    } else {
      this.recruiterSprite = new Phaser.GameObjects.Sprite(scene, recX, recY, "npc_recruiter");
      this.recruiterSprite.setOrigin(0.5, 0.85);
      this.add(this.recruiterSprite);
    }

    // Recruiter Tag (High-DPI)
    const recruiterTag = new Phaser.GameObjects.Text(scene, recX, recY - 26, `Staff`, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "9px",
      fontStyle: "bold",
      color: "#FFD84D",
      backgroundColor: "rgba(10, 20, 35, 0.9)",
      padding: { x: 4, y: 1 },
    });
    recruiterTag.setOrigin(0.5, 0.5);
    recruiterTag.setResolution(3);
    this.add(recruiterTag);

    // Idle breathing animation
    scene.tweens.add({
      targets: this.recruiterSprite,
      scaleY: this.recruiterSprite.scaleY * 1.04,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // 3. DESK PROPS (Glowing Laptop / PC on counter)
    if (scene.textures.exists("prop_laptop_workstation")) {
      const laptop = new Phaser.GameObjects.Sprite(scene, -22, 14, "prop_laptop_workstation");
      laptop.setOrigin(0.5, 0.5);
      laptop.setScale(0.18);
      this.add(laptop);
    }

    // 4. TOP CANOPY BANNER (Sleek Floating Cyberpunk Canopy Header)
    const canopyW = 160;
    const bannerGfx = new Phaser.GameObjects.Graphics(scene);
    bannerGfx.fillStyle(0x07111e, 0.95);
    bannerGfx.lineStyle(1.5, themeColor, 1);
    bannerGfx.fillRoundedRect(-canopyW / 2, -88, canopyW, 26, 5);
    bannerGfx.strokeRoundedRect(-canopyW / 2, -88, canopyW, 26, 5);

    // Neon Glow Strip
    bannerGfx.fillStyle(themeColor, 1);
    bannerGfx.fillRect(-canopyW / 2 + 6, -87, canopyW - 12, 2);
    this.add(bannerGfx);

    // Table Badge (High-DPI)
    const tableBadge = new Phaser.GameObjects.Text(scene, -canopyW / 2 + 8, -82, `B${tableNum}`, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "10px",
      fontStyle: "bold",
      color: "#FFD84D",
    });
    tableBadge.setResolution(3);

    // Company Name in Banner (High-DPI)
    const maxBannerTitle = 12;
    const bannerTitle =
      data.companyName.length > maxBannerTitle ? `${data.companyName.slice(0, maxBannerTitle)}...` : data.companyName;

    const companyTitle = new Phaser.GameObjects.Text(scene, -canopyW / 2 + 32, -82, bannerTitle, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "10px",
      fontStyle: "bold",
      color: "#FFFFFF",
    });
    companyTitle.setResolution(3);

    // Job Count Pill (High-DPI)
    const jobPillGfx = new Phaser.GameObjects.Graphics(scene);
    jobPillGfx.fillStyle(0x22c55e, 0.25);
    jobPillGfx.lineStyle(1, 0x22c55e, 0.85);
    jobPillGfx.fillRoundedRect(canopyW / 2 - 50, -83, 44, 15, 3);
    jobPillGfx.strokeRoundedRect(canopyW / 2 - 50, -83, 44, 15, 3);

    const jobCountText = new Phaser.GameObjects.Text(scene, canopyW / 2 - 28, -82, `${data.jobCount} งาน`, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "8px",
      fontStyle: "bold",
      color: "#4ADE80",
    });
    jobCountText.setOrigin(0.5, 0);
    jobCountText.setResolution(3);

    this.add([tableBadge, companyTitle, jobPillGfx, jobCountText]);

    // 5. PROXIMITY PROMPT BUBBLE (High-DPI Crisp Text)
    this.promptBubble = new Phaser.GameObjects.Container(scene, 0, 52);
    const bubbleBg = new Phaser.GameObjects.Graphics(scene);
    bubbleBg.fillStyle(0x0f172a, 0.95);
    bubbleBg.lineStyle(2, 0xffd84d, 0.95);
    bubbleBg.fillRoundedRect(-85, -14, 170, 28, 6);
    bubbleBg.strokeRoundedRect(-85, -14, 170, 28, 6);

    const bubbleLabel = new Phaser.GameObjects.Text(scene, 0, 0, "💬 กด [ E ] หรือแตะ เพื่อคุย", {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "11px",
      fontStyle: "bold",
      color: "#FFD84D",
    });
    bubbleLabel.setOrigin(0.5, 0.5);
    bubbleLabel.setResolution(3);

    this.promptBubble.add([bubbleBg, bubbleLabel]);
    this.promptBubble.setAlpha(0);
    this.add(this.promptBubble);

    // Pulsing prompt animation
    scene.tweens.add({
      targets: this.promptBubble,
      y: 50,
      duration: 700,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // 6. CLICK HITBOX
    this.setSize(boothW, 110);
    this.setInteractive(new Phaser.Geom.Rectangle(-boothW / 2, -55, boothW, 110), Phaser.Geom.Rectangle.Contains);

    this.on("pointerdown", () => {
      this.triggerInteraction();
    });
    this.on("pointerover", () => {
      scene.input.setDefaultCursor("pointer");
    });
    this.on("pointerout", () => {
      scene.input.setDefaultCursor("default");
    });
  }

  public onPlayerEnter(): void {
    if (this.isPlayerNearby) return;
    this.isPlayerNearby = true;

    this.scene.tweens.add({
      targets: this.promptBubble,
      alpha: 1,
      scale: 1.05,
      duration: 200,
      ease: "Back.easeOut",
    });
  }

  public onPlayerLeave(): void {
    if (!this.isPlayerNearby) return;
    this.isPlayerNearby = false;

    this.scene.tweens.add({
      targets: this.promptBubble,
      alpha: 0,
      scale: 0.9,
      duration: 200,
    });
  }

  public triggerInteraction(): void {
    gameBridge.emit("BOOTH_INTERACT", this.boothData);
  }
}
