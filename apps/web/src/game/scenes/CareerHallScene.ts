import * as Phaser from "phaser";
import { Player } from "../entities/Player";
import { BoothEntity } from "../entities/BoothEntity";
import { NPCEntity } from "../entities/NPCEntity";
import { gameBridge, type GameBoothData, type GameInitPayload } from "../bridge";

export class CareerHallScene extends Phaser.Scene {
  private player!: Player;
  private booths: BoothEntity[] = [];
  private infoNpc?: NPCEntity;
  private crowdNpcs: { npc: NPCEntity; x: number; y: number; dialogue: string }[] = [];
  private initPayload?: GameInitPayload;

  private worldWidth = 1024;
  private worldHeight = 576;

  constructor() {
    super({ key: "CareerHallScene" });
  }

  init(data?: GameInitPayload): void {
    if (data) {
      this.initPayload = data;
    }
  }

  create(): void {
    // Set Scene Bounds & Physics World Bounds
    this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

    // 1. MASTER POKEMON GBA CONVENTION MAP (Cohesive 16-bit lighting & shadows)
    if (this.textures.exists("master_pokemon_hall")) {
      const mapImg = this.add.image(this.worldWidth / 2, this.worldHeight / 2, "master_pokemon_hall");
      mapImg.setOrigin(0.5, 0.5);
      mapImg.setDisplaySize(this.worldWidth, this.worldHeight);
      mapImg.setDepth(0);
    } else {
      const bg = this.add.graphics();
      bg.fillStyle(0x0a1424, 1);
      bg.fillRect(0, 0, this.worldWidth, this.worldHeight);
      bg.setDepth(0);
    }

    // 2. 5 DYNAMIC COMPANY BOOTHS (Brand Wall + Recruiter + Props + Top Canopy)
    this.createModularCompanyBooths();

    // 3. CENTER INFO DESK INTERACTION
    this.createCenterInfoDesk();

    // 4. LIVING VISITOR CROWD (With Contact Drop Shadows & Dialogues)
    this.createCrowdVisitors();

    // 5. PLAYER AVATAR (Spawned on Grand Walkway)
    this.player = new Player(this, 500, 350, "player_custom");

    // 6. GLOBAL INTERACTION KEYS [ E ] & [ Space ]
    this.setupInteractions();

    // 7. CAMERA SETUP (Smooth follow & sharp pixel zoom)
    this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

    // 8. EVENT LISTENERS FROM REACT HOST
    this.setupBridgeEventListeners();

    // Signal to React that Phaser Scene is Ready
    gameBridge.emit("GAME_READY", {
      fairId: this.initPayload?.fairId,
      boothCount: this.booths.length,
    });
  }

  private createModularCompanyBooths(): void {
    const boothsData = this.initPayload?.booths || [];

    const defaultCompanies = [
      { name: "SCB TechX", industry: "Fintech & AI", jobs: 3 },
      { name: "True Digital", industry: "Telecom & Cloud", jobs: 2 },
      { name: "Agoda", industry: "Travel Tech", jobs: 4 },
      { name: "Bitkub", industry: "Web3 Solutions", jobs: 5 },
      { name: "Shopee Tech", industry: "E-Commerce AI", jobs: 3 },
    ];

    // 5 Master Booth Positions matching the Master Map Layout
    const mapBoothPositions = [
      { x: 265, y: 140 }, // Top-Left (Booth 1)
      { x: 500, y: 140 }, // Top-Middle (Booth 2)
      { x: 735, y: 140 }, // Top-Right (Booth 3)
      { x: 265, y: 440 }, // Bottom-Left (Booth 4)
      { x: 735, y: 440 }, // Bottom-Right (Booth 5)
    ];

    for (let i = 0; i < 5; i++) {
      const pos = mapBoothPositions[i]!;
      const existing = boothsData[i];
      const fallback = defaultCompanies[i]!;

      const boothData: GameBoothData = existing || {
        id: `booth_fallback_${i + 1}`,
        fairId: this.initPayload?.fairId || "fair_tech_2026",
        companyId: `comp_fallback_${i + 1}`,
        companyName: fallback.name,
        companyIndustry: fallback.industry,
        tableNumber: i + 1,
        boothName: `${fallback.name} Booth`,
        assignedJobIds: [],
        jobCount: fallback.jobs,
      };

      const booth = new BoothEntity(this, pos.x, pos.y, boothData);
      this.booths.push(booth);
    }
  }

  private createCenterInfoDesk(): void {
    const deskX = 500;
    const deskY = 288;

    // Info Staff NPC (Positioned inside the circular desk with drop shadow)
    this.infoNpc = new NPCEntity(this, deskX, deskY - 14, {
      name: "Info Staff",
      role: "info",
    });
  }

  private createCrowdVisitors(): void {
    const visitorLocations = [
      { x: 170, y: 288, name: "Job Seeker A", dialogue: "บูธฟินเทคทางซ้ายเปิดรับตำแหน่งเยอะมาก!" },
      { x: 830, y: 288, name: "Job Seeker B", dialogue: "ยื่นใบสมัครที่บูธ Agoda เรียบร้อยแล้ว!" },
      { x: 380, y: 440, name: "Visitor C", dialogue: "งานแฟร์ปีนี้น่าสนใจมาก มีบริษัทชั้นนำเพียบ" },
      { x: 620, y: 440, name: "Visitor D", dialogue: "อย่าลืมแวะไปคุยกับพี่ๆ Recruiter นะครับ" },
    ];

    visitorLocations.forEach((v) => {
      const npc = new NPCEntity(this, v.x, v.y, {
        name: v.name,
        role: "visitor",
        dialogue: v.dialogue,
      });
      this.crowdNpcs.push({ npc, x: v.x, y: v.y, dialogue: v.dialogue });
    });

    // High-Detail Animated Visitor Group
    if (this.textures.exists("group_visitors_talk_hd")) {
      const talkGroup = this.add.sprite(500, 485, "group_visitors_talk_hd");
      talkGroup.setOrigin(0.5, 0.8);
      talkGroup.setDepth(485);
      talkGroup.setScale(0.34);
    }
  }

  private setupInteractions(): void {
    this.input.keyboard?.on("keydown-E", () => {
      this.handlePlayerInteraction();
    });
    this.input.keyboard?.on("keydown-SPACE", () => {
      this.handlePlayerInteraction();
    });
  }

  private handlePlayerInteraction(): void {
    // Find nearest booth within interaction range
    for (const booth of this.booths) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, booth.x, booth.y);
      if (dist < 90) {
        booth.triggerInteraction();
        return;
      }
    }
  }

  private setupBridgeEventListeners(): void {
    // Teleport to Booth
    gameBridge.on("TELEPORT_TO_BOOTH", (payload: { tableNumber: number }) => {
      const target = this.booths.find((b) => b.boothData.tableNumber === payload.tableNumber);
      if (target) {
        this.player.setPosition(target.x, target.y + 35);
        this.cameras.main.pan(target.x, target.y, 400, "Power2");
        target.triggerInteraction();
      }
    });

    // Virtual Joystick Movement
    gameBridge.on("VIRTUAL_JOYSTICK_MOVE", (payload: { x: number; y: number }) => {
      if (this.player && typeof (this.player as any).handleVirtualJoystick === "function") {
        (this.player as any).handleVirtualJoystick(payload.x, payload.y);
      }
    });
  }

  override update(): void {
    // Dynamic 2.5D Y-Depth Sorting for Player
    if (this.player) {
      this.player.setDepth(this.player.y);

      // Simple map boundaries constraint
      this.player.x = Phaser.Math.Clamp(this.player.x, 30, this.worldWidth - 30);
      this.player.y = Phaser.Math.Clamp(this.player.y, 50, this.worldHeight - 30);
    }

    // Check player proximity to all booths
    this.booths.forEach((booth) => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, booth.x, booth.y);
      if (dist < 85) {
        booth.onPlayerEnter();
        gameBridge.emit("PLAYER_NEAR_BOOTH", booth.boothData);
      } else if (dist > 95) {
        booth.onPlayerLeave();
      }
    });

    // Check Info Desk Proximity
    if (this.infoNpc && this.player) {
      const distInfo = Phaser.Math.Distance.Between(this.player.x, this.player.y, 500, 288);
      if (distInfo < 65) {
        this.infoNpc.showSpeech("ยินดีต้อนรับสู่ Virtual Career Expo 2026! กด [ E ] เพื่อสมัครงานได้เลยค่ะ");
      }
    }

    // Check Visitor NPCs Proximity
    if (this.player) {
      this.crowdNpcs.forEach((item) => {
        const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
        if (dist < 45) {
          item.npc.showSpeech(item.dialogue);
        }
      });
    }
  }
}
