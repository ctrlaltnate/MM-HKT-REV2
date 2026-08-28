import * as Phaser from "phaser";
import { gameBridge } from "../bridge";

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed = 150;
  private currentDir: "down" | "left" | "right" | "up" = "down";
  private targetPoint: Phaser.Math.Vector2 | null = null;
  private shadowGfx: Phaser.GameObjects.Graphics;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys?: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
  };
  private isInteracting = false;
  private virtualJoystickVector: { x: number; y: number } | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey = "player_custom") {
    super(scene, x, y, textureKey, "frame_0");

    // Contact drop shadow directly under feet
    this.shadowGfx = scene.add.graphics();
    this.shadowGfx.fillStyle(0x000000, 0.45);
    this.shadowGfx.fillEllipse(0, 0, 18, 7);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Depth sorting for 2.5D Pokemon top-down feel
    this.setDepth(y);

    // Physics body bounds (compact box at the feet for smooth collision)
    this.setSize(16, 12);
    this.setOffset(8, 36);
    this.setCollideWorldBounds(true);

    this.setupInputs();
    if (this.anims) {
      this.play("player-idle-down", true);
    }
  }

  private setupInputs(): void {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }

    // Click or Hold-to-Move
    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (!this.isInteracting) {
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.targetPoint = new Phaser.Math.Vector2(worldPoint.x, worldPoint.y);
      }
    });

    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && !this.isInteracting) {
        const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
        this.targetPoint = new Phaser.Math.Vector2(worldPoint.x, worldPoint.y);
      }
    });

    // Listen for virtual joystick / mobile touch input from React overlay
    gameBridge.on("VIRTUAL_JOYSTICK_MOVE", (vector: { x: number; y: number }) => {
      this.handleVirtualJoystick(vector);
    });

    gameBridge.on("SET_INTERACTING", (state: boolean) => {
      this.isInteracting = state;
      if (state) {
        this.setVelocity(0, 0);
        this.playIdle();
        this.targetPoint = null;
        this.virtualJoystickVector = null;
      }
    });
  }

  public isPlayerInteracting(): boolean {
    return this.isInteracting;
  }

  public handleVirtualJoystick(vec: { x: number; y: number }): void {
    if (this.isInteracting) return;
    if (Math.abs(vec.x) < 0.1 && Math.abs(vec.y) < 0.1) {
      this.virtualJoystickVector = null;
    } else {
      this.targetPoint = null;
      this.virtualJoystickVector = vec;
    }
  }

  public handleMovement(): void {
    if (this.isInteracting) {
      this.setVelocity(0, 0);
      return;
    }

    // Dynamic depth based on Y coordinate (Y-sorting)
    this.setDepth(this.y);

    let vx = 0;
    let vy = 0;

    const left = this.cursors?.left?.isDown || this.wasdKeys?.A?.isDown;
    const right = this.cursors?.right?.isDown || this.wasdKeys?.D?.isDown;
    const up = this.cursors?.up?.isDown || this.wasdKeys?.W?.isDown;
    const down = this.cursors?.down?.isDown || this.wasdKeys?.S?.isDown;

    if (left || right || up || down) {
      // Cancel click-to-move and virtual joystick when keyboard is active
      this.targetPoint = null;
      this.virtualJoystickVector = null;

      if (left) vx = -this.speed;
      else if (right) vx = this.speed;

      if (up) vy = -this.speed;
      else if (down) vy = this.speed;

      // Normalize diagonal speed
      if (vx !== 0 && vy !== 0) {
        vx *= 0.7071;
        vy *= 0.7071;
      }

      this.setVelocity(vx, vy);
      this.updateFacingDirection(vx, vy);
    } else if (this.virtualJoystickVector) {
      vx = this.virtualJoystickVector.x * this.speed;
      vy = this.virtualJoystickVector.y * this.speed;

      this.setVelocity(vx, vy);
      this.updateFacingDirection(vx, vy);
    } else if (this.targetPoint) {
      // Process Click-To-Move
      const dist = Phaser.Math.Distance.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);

      if (dist < 8) {
        this.targetPoint = null;
        this.setVelocity(0, 0);
        this.playIdle();
      } else {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, this.targetPoint.x, this.targetPoint.y);
        vx = Math.cos(angle) * this.speed;
        vy = Math.sin(angle) * this.speed;

        this.setVelocity(vx, vy);
        this.updateFacingDirection(vx, vy);
      }
    } else {
      this.setVelocity(0, 0);
      this.playIdle();
    }
  }

  private updateFacingDirection(vx: number, vy: number): void {
    if (Math.abs(vx) > Math.abs(vy)) {
      if (vx < 0) {
        this.currentDir = "left";
        this.playWalk("player-walk-left");
      } else {
        this.currentDir = "right";
        this.playWalk("player-walk-right");
      }
    } else {
      if (vy < 0) {
        this.currentDir = "up";
        this.playWalk("player-walk-up");
      } else {
        this.currentDir = "down";
        this.playWalk("player-walk-down");
      }
    }
  }

  private playWalk(animKey: string): void {
    if (this.anims?.currentAnim?.key !== animKey) {
      this.play(animKey, true);
    }
  }

  private playIdle(): void {
    const idleKey = `player-idle-${this.currentDir}`;
    if (this.anims?.currentAnim?.key !== idleKey) {
      this.play(idleKey, true);
    }
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    this.handleMovement();
    if (this.shadowGfx) {
      this.shadowGfx.setPosition(this.x, this.y + 18);
      this.shadowGfx.setDepth(Math.max(1, this.y - 1));
    }
  }

  override destroy(fromScene?: boolean): void {
    if (this.shadowGfx) {
      this.shadowGfx.destroy();
    }
    super.destroy(fromScene);
  }

  public getFacing(): "down" | "left" | "right" | "up" {
    return this.currentDir;
  }
}
