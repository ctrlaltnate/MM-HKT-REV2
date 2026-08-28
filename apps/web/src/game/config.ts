import * as Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { CareerHallScene } from "./scenes/CareerHallScene";
import type { GameInitPayload } from "./bridge";

export function createGameConfig(parent: HTMLElement, payload: GameInitPayload): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 1024,
    height: 576,
    pixelArt: true,
    roundPixels: true,
    backgroundColor: "#0a1424",
    render: {
      antialias: false,
      pixelArt: true,
      roundPixels: true,
    },
    input: {
      keyboard: {
        target: window,
      },
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1024,
      height: 576,
    },
    scene: [
      new BootScene(payload),
      new CareerHallScene(),
    ],
  };
}
