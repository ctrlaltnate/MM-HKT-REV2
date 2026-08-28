import * as Phaser from "phaser";

export class PreRenderedAssetLoader {
  /**
   * Chroma-key removal for pure magenta background (#FF00FF)
   * Produces razor-sharp, crystal-clear transparent PNG sprites
   */
  private static extractTransparentSprite(
    sourceImg: CanvasImageSource,
    sx: number,
    sy: number,
    sw: number,
    sh: number
  ): HTMLCanvasElement {
    const canvas = document.createElement("canvas");
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return canvas;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(sourceImg, sx, sy, sw, sh, 0, 0, sw, sh);
    const imgData = ctx.getImageData(0, 0, sw, sh);
    const data = imgData.data;

    // Chroma-key removal for Magenta (#FF00FF) and JPEG compression fringe
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]!;
      const g = data[i + 1]!;
      const b = data[i + 2]!;

      // Pure Magenta: High Red, High Blue, Low Green
      const isMagenta = r > 170 && b > 170 && g < 120 && (r - g > 70) && (b - g > 70);
      const isBrightPink = r > 210 && b > 210 && g < 160;

      if (isMagenta || isBrightPink) {
        data[i + 3] = 0; // Set Alpha = 0 (100% Transparent)
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }

  public static sliceAllPreRenderedAssets(scene: Phaser.Scene): void {
    const registerFromPack = (
      packKey: string,
      spriteMap: Record<string, [number, number, number, number]>
    ) => {
      const textureObj = scene.textures.get(packKey);
      if (!textureObj) return;

      const sourceImg = textureObj.getSourceImage() as CanvasImageSource;
      if (!sourceImg) return;

      Object.entries(spriteMap).forEach(([key, [sx, sy, sw, sh]]) => {
        if (scene.textures.exists(key)) return;
        const cleanCanvas = this.extractTransparentSprite(sourceImg, sx, sy, sw, sh);
        const tex = scene.textures.addCanvas(key, cleanCanvas);
        if (tex && typeof tex.refresh === "function") {
          tex.refresh();
        }
      });
    };

    // 1. FURNITURE & PROPS PACK (`pokemon_furniture_pack`)
    registerFromPack("pokemon_furniture_pack", {
      prop_wooden_counter_large: [8, 8, 320, 180],
      prop_dual_monitors_station: [500, 15, 170, 175],
      prop_dual_monitors_compact: [830, 30, 165, 160],
      prop_small_wooden_desk: [5, 205, 165, 145],
      prop_laptop_workstation: [5, 410, 195, 220],
      prop_angled_laptop: [205, 400, 155, 230],
      prop_server_rack_led: [395, 385, 135, 245],
      prop_snack_coffee_shelf: [675, 375, 180, 255],
      prop_water_cooler_shelf: [870, 375, 115, 255],
      prop_bonsai_plant_hd: [55, 680, 210, 295],
      prop_office_chair_hd: [365, 695, 170, 280],
    });

    // 2. CHARACTERS & NPCS PACK (`pokemon_characters_pack`)
    registerFromPack("pokemon_characters_pack", {
      npc_recruiter_female_hd: [30, 15, 80, 165],
      npc_recruiter_female_walk: [315, 15, 80, 165],
      npc_recruiter_glasses_hd: [460, 15, 80, 165],
      npc_recruiter_laptop_hd: [25, 180, 85, 165],
      npc_recruiter_green_hd: [35, 345, 75, 160],
      npc_recruiter_green_walk: [318, 345, 80, 160],
      prop_info_circular_desk_hd: [45, 515, 220, 230],
      prop_info_front_desk_hd: [325, 518, 200, 225],
      group_visitors_talk_hd: [20, 765, 275, 225],
    });

    // 3. 6 EXPO BOOTH BACKWALL PACK (`pokemon_booths_pack`)
    registerFromPack("pokemon_booths_pack", {
      booth_backwall_fintech: [25, 95, 310, 265],
      booth_backwall_eco: [345, 95, 310, 265],
      booth_backwall_web3: [665, 95, 310, 265],
      booth_backwall_ecom: [510, 385, 400, 260],
      booth_backwall_game: [25, 665, 305, 255],
      booth_backwall_ai: [665, 665, 305, 255],
    });
  }
}
