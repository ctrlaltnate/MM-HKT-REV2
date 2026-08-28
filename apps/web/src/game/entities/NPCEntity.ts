import * as Phaser from "phaser";

export interface NPCConfig {
  name: string;
  role: "recruiter" | "info" | "visitor";
  hairColor?: string;
  shirtColor?: string;
  facing?: "down" | "left" | "right" | "up";
  dialogue?: string;
}

export class NPCEntity extends Phaser.GameObjects.Container {
  public config: NPCConfig;
  private characterSprite: Phaser.GameObjects.Sprite;
  private nameLabel: Phaser.GameObjects.Text;
  private speechBubble?: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number, config: NPCConfig) {
    super(scene, x, y);
    this.config = config;

    (scene.add as any).existing(this);
    this.setDepth(y);

    // Contact drop shadow directly under feet
    const shadowGfx = new Phaser.GameObjects.Graphics(scene);
    shadowGfx.fillStyle(0x000000, 0.45);
    shadowGfx.fillEllipse(0, 4, 18, 7);
    this.add(shadowGfx);

    // Create NPC visual sprite (using procedural or custom texture)
    const textureKey = config.role === "info" ? "npc_info" : "npc_recruiter";
    this.characterSprite = new Phaser.GameObjects.Sprite(scene, 0, 0, textureKey);
    this.characterSprite.setOrigin(0.5, 0.8);
    this.add(this.characterSprite);

    // Add Name Tag Badge above head
    this.nameLabel = new Phaser.GameObjects.Text(scene, 0, -36, config.name, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "11px",
      fontStyle: "bold",
      color: config.role === "info" ? "#78DBE6" : "#FFD84D",
      backgroundColor: "rgba(10, 20, 35, 0.9)",
      padding: { x: 5, y: 2 },
    });
    this.nameLabel.setOrigin(0.5, 0.5);
    this.nameLabel.setResolution(3);
    this.add(this.nameLabel);

    // Subtle Idle Breathing Tween
    scene.tweens.add({
      targets: this.characterSprite,
      scaleY: 1.05,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  public showSpeech(text: string, duration = 3500): void {
    if (this.speechBubble) {
      this.speechBubble.destroy();
    }

    const bubble = new Phaser.GameObjects.Container(this.scene, 0, -58);
    const bubbleBg = new Phaser.GameObjects.Graphics(this.scene);
    bubbleBg.fillStyle(0x0f172a, 0.95);
    bubbleBg.lineStyle(1.5, 0x78dbe6, 0.9);
    bubbleBg.fillRoundedRect(-80, -22, 160, 36, 6);
    bubbleBg.strokeRoundedRect(-80, -22, 160, 36, 6);

    const bubbleText = new Phaser.GameObjects.Text(this.scene, 0, -4, text, {
      fontFamily: '"Prompt", "Inter", sans-serif',
      fontSize: "10px",
      fontStyle: "bold",
      color: "#FFFFFF",
      align: "center",
      wordWrap: { width: 145 },
    });
    bubbleText.setOrigin(0.5, 0.5);
    bubbleText.setResolution(3);

    bubble.add([bubbleBg, bubbleText]);
    this.add(bubble);
    this.speechBubble = bubble;

    this.scene.time.delayedCall(duration, () => {
      if (this.speechBubble === bubble) {
        this.scene.tweens.add({
          targets: bubble,
          alpha: 0,
          y: -66,
          duration: 300,
          onComplete: () => bubble.destroy(),
        });
      }
    });
  }
}
