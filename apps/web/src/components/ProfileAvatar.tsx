import type { AvatarConfig } from "../domain/types";

export interface ProfileAvatarProps {
  seed?: string;
  config?: AvatarConfig | null;
  size?: number;
  ariaHidden?: boolean;
  className?: string;
}

// Generate default configuration from user ID / string seed
export function getDefaultAvatarConfig(seed: string): AvatarConfig {
  const code = [...seed].reduce((total, character, i) => total + character.charCodeAt(0) * (i + 1), 0);

  const skinTones = ["#ffd7ba", "#e0ac69", "#c68642", "#8d5524", "#5eead4", "#c084fc"];
  const hairStyles = ["short", "spiky", "bob", "long", "punk", "afro"];
  const hairColors = ["#78dbe6", "#9a72ff", "#ffd84d", "#ff5470", "#34d399", "#18181b", "#f1f5f9"];
  const eyeStyles = ["normal", "cyber_visor", "smart_glasses", "anime", "wink"];
  const eyeColors = ["#090d16", "#38bdf8", "#34d399", "#f43f5e", "#fbbf24"];
  const mouthStyles = ["smile", "neutral", "smirk", "cyber_mask"];
  const accessories = ["none", "headphones", "cyber_mask", "antenna", "earring"];
  const shirtStyles = ["cyber_tee", "suit_tie", "hoodie", "cyber_armor", "lab_coat", "leather_jacket", "tank_top"];
  const shirtColors = ["#8b5cf6", "#06b6d4", "#f59e0b", "#f43f5e", "#10b981", "#1e293b", "#f8fafc"];
  const shirtSecondaryColors = ["#ffd84d", "#78dbe6", "#ff5470", "#34d399", "#f8fafc", "#1e293b"];

  return {
    skinTone: skinTones[code % skinTones.length] ?? "#e0ac69",
    hairStyle: hairStyles[(code >> 2) % hairStyles.length] ?? "short",
    hairColor: hairColors[(code >> 4) % hairColors.length] ?? "#78dbe6",
    eyeStyle: eyeStyles[(code >> 6) % eyeStyles.length] ?? "normal",
    eyeColor: eyeColors[(code >> 8) % eyeColors.length] ?? "#090d16",
    mouthStyle: mouthStyles[(code >> 10) % mouthStyles.length] ?? "smile",
    accessory: accessories[(code >> 12) % accessories.length] ?? "none",
    shirtStyle: shirtStyles[(code >> 14) % shirtStyles.length] ?? "cyber_tee",
    shirtColor: shirtColors[(code >> 16) % shirtColors.length] ?? "#8b5cf6",
    shirtSecondaryColor: shirtSecondaryColors[(code >> 18) % shirtSecondaryColors.length] ?? "#ffd84d",
    backgroundTone: "#07101a",
  };
}

export function ProfileAvatar({
  seed = "default",
  config,
  size = 44,
  ariaHidden = false,
  className = "",
}: ProfileAvatarProps) {
  const avatar = config || getDefaultAvatarConfig(seed);

  const {
    skinTone = "#e0ac69",
    hairStyle = "short",
    hairColor = "#78dbe6",
    eyeStyle = "normal",
    eyeColor = "#090d16",
    mouthStyle = "smile",
    accessory = "none",
    shirtStyle = "cyber_tee",
    shirtColor = "#8b5cf6",
    shirtSecondaryColor = "#ffd84d",
    backgroundTone = "#07101a",
  } = avatar;

  return (
    <svg
      className={`profile-avatar ${className}`.trim()}
      width={size}
      height={size}
      viewBox="0 0 48 48"
      role={ariaHidden ? "presentation" : "img"}
      aria-hidden={ariaHidden}
      aria-label={ariaHidden ? undefined : "อวตารพิกเซลของคุณ"}
      shapeRendering="crispEdges"
      style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
    >
      {/* 1. Background Box */}
      <rect x="0" y="0" width="48" height="48" fill={backgroundTone} />
      <rect x="2" y="2" width="44" height="44" fill={backgroundTone} stroke="rgba(120, 219, 230, 0.2)" strokeWidth="1" />

      {/* 2. Cyber Halo (if accessory is halo) */}
      {accessory === "halo" && (
        <path fill="#ffd84d" d="M16 4h16v2H16zm-2 2h2v2h-2zm18 0h2v2h-2zm-16 2h16v2H16z" opacity="0.9" />
      )}

      {/* 3. Hair Back (for long hairstyles) */}
      {(hairStyle === "long" || hairStyle === "afro") && (
        <path
          fill={hairColor}
          d={
            hairStyle === "long"
              ? "M10 14h28v22H10z"
              : "M6 10h36v20H6z"
          }
        />
      )}

      {/* 4. Head & Face Base (Skin Tone) */}
      <rect x="12" y="14" width="24" height="20" fill={skinTone} />
      {/* Neck */}
      <rect x="20" y="32" width="8" height="6" fill={skinTone} opacity="0.9" />

      {/* 5. Hair Layer */}
      {hairStyle === "short" && (
        <path fill={hairColor} d="M12 10h24v6H12zm-2 6h4v8h-4zm24 0h4v8h-4zm-20-4h16v4H14z" />
      )}
      {hairStyle === "spiky" && (
        <path fill={hairColor} d="M12 6h6v6h-6zm8-2h8v8h-8zm10 2h6v6h-6zm-18 6h24v6H12zm-2 6h4v6h-4zm24 0h4v6h-4z" />
      )}
      {hairStyle === "bob" && (
        <path fill={hairColor} d="M10 10h28v6H10zm-2 6h6v14H8zm26 0h6v14h-6zm-20-4h16v4H14z" />
      )}
      {hairStyle === "long" && (
        <path fill={hairColor} d="M10 10h28v6H10zm-2 6h6v20H8zm26 0h6v20h-6zm-20-4h16v4H14z" />
      )}
      {hairStyle === "punk" && (
        <path fill={hairColor} d="M20 4h8v16h-8zm-2 4h2v8h-2zm10 0h2v8h-2z" />
      )}
      {hairStyle === "afro" && (
        <path fill={hairColor} d="M8 8h32v12H8zm-4 6h4v14H4zm36 0h4v14h-4z" />
      )}
      {hairStyle === "dreads" && (
        <path fill={hairColor} d="M10 8h28v8H10zm-2 8h4v18H8zm6 0h4v16h-4zm16 0h4v16h-4zm6 0h4v18h-4z" />
      )}

      {/* 6. Eyes & Eyewear */}
      {eyeStyle === "normal" && (
        <>
          <rect x="16" y="20" width="4" height="4" fill={eyeColor} />
          <rect x="28" y="20" width="4" height="4" fill={eyeColor} />
          <rect x="18" y="20" width="2" height="2" fill="#ffffff" />
          <rect x="30" y="20" width="2" height="2" fill="#ffffff" />
        </>
      )}
      {eyeStyle === "anime" && (
        <>
          <rect x="15" y="18" width="6" height="6" fill={eyeColor} />
          <rect x="27" y="18" width="6" height="6" fill={eyeColor} />
          <rect x="16" y="19" width="2" height="2" fill="#ffffff" />
          <rect x="28" y="19" width="2" height="2" fill="#ffffff" />
          <rect x="18" y="22" width="2" height="2" fill="#ffffff" opacity="0.7" />
          <rect x="30" y="22" width="2" height="2" fill="#ffffff" opacity="0.7" />
        </>
      )}
      {eyeStyle === "wink" && (
        <>
          <rect x="16" y="20" width="4" height="4" fill={eyeColor} />
          <rect x="18" y="20" width="2" height="2" fill="#ffffff" />
          <path fill={eyeColor} d="M28 22h6v2h-6z" />
        </>
      )}
      {eyeStyle === "cyber_visor" && (
        <>
          <rect x="12" y="19" width="24" height="6" fill="#07101a" />
          <rect x="14" y="20" width="20" height="4" fill={eyeColor === "#090d16" ? "#78dbe6" : eyeColor} />
          <rect x="18" y="21" width="8" height="2" fill="#ffffff" />
        </>
      )}
      {eyeStyle === "smart_glasses" && (
        <>
          <rect x="14" y="18" width="8" height="8" fill="none" stroke="#78dbe6" strokeWidth="2" />
          <rect x="26" y="18" width="8" height="8" fill="none" stroke="#78dbe6" strokeWidth="2" />
          <rect x="22" y="21" width="4" height="2" fill="#78dbe6" />
          <rect x="16" y="20" width="4" height="4" fill={eyeColor} />
          <rect x="28" y="20" width="4" height="4" fill={eyeColor} />
        </>
      )}
      {eyeStyle === "vr_goggles" && (
        <>
          <rect x="10" y="17" width="28" height="10" fill="#1e1b4b" stroke="#9a72ff" strokeWidth="1" />
          <rect x="14" y="20" width="8" height="4" fill="#ff5470" />
          <rect x="26" y="20" width="8" height="4" fill="#78dbe6" />
          <rect x="10" y="21" width="4" height="2" fill="#9a72ff" />
          <rect x="34" y="21" width="4" height="2" fill="#9a72ff" />
        </>
      )}

      {/* 7. Nose (Subtle Pixel) */}
      <rect x="23" y="24" width="2" height="2" fill="#07101a" opacity="0.25" />

      {/* 8. Mouth & Facial Feature */}
      {mouthStyle === "smile" && (
        <path fill="#07101a" d="M20 28h2v2h4v-2h2v4H20z" />
      )}
      {mouthStyle === "neutral" && (
        <rect x="21" y="28" width="6" height="2" fill="#07101a" />
      )}
      {mouthStyle === "smirk" && (
        <path fill="#07101a" d="M21 29h6v2h-2v-2z" />
      )}
      {mouthStyle === "cyber_mask" && (
        <path fill="#0f172a" stroke="#78dbe6" strokeWidth="1" d="M16 26h16v8H16zm4 2h8v4h-8z" />
      )}
      {mouthStyle === "beard" && (
        <>
          <path fill={hairColor} d="M16 27h16v7H16zm-2-2h4v4h-4zm16 0h4v4h-4z" opacity="0.85" />
          <rect x="22" y="28" width="4" height="2" fill="#07101a" />
        </>
      )}

      {/* 9. SHIRT & OUTFIT LAYER */}
      {/* 9.1 Classic Cyber T-Shirt */}
      {shirtStyle === "cyber_tee" && (
        <>
          <path fill={shirtColor} d="M8 36h32v12H8z" />
          <polygon points="24,36 18,44 30,44" fill="#07101a" opacity="0.25" />
          <rect x="18" y="41" width="12" height="2" fill={shirtSecondaryColor} />
          <path fill="rgba(255,255,255,0.2)" d="M20 36h8v2h-8z" />
        </>
      )}

      {/* 9.2 Formal Suit & Necktie */}
      {shirtStyle === "suit_tie" && (
        <>
          <path fill={shirtColor} d="M8 36h32v12H8z" />
          {/* White Shirt Collar & V-Shape */}
          <polygon points="24,46 16,36 32,36" fill="#f8fafc" />
          {/* Necktie */}
          <path fill={shirtSecondaryColor} d="M23 37h2v7h-2zm-1 7h4v3h-4z" />
          {/* Suit Lapels */}
          <path fill={shirtColor} d="M14 36h4v12h-4zm16 0h4v12h-4z" />
          <path fill="rgba(0,0,0,0.3)" d="M18 36h1v12h-1zm11 0h1v12h-1z" />
        </>
      )}

      {/* 9.3 Streetwear Cyber Hoodie */}
      {shirtStyle === "hoodie" && (
        <>
          <path fill={shirtColor} d="M6 35h36v13H6z" />
          {/* Hood Collar Ring */}
          <path fill={shirtColor} stroke="rgba(0,0,0,0.3)" strokeWidth="1" d="M16 34h16v4H16z" />
          {/* Drawstrings */}
          <rect x="20" y="37" width="2" height="7" fill={shirtSecondaryColor} />
          <rect x="26" y="37" width="2" height="7" fill={shirtSecondaryColor} />
          {/* Kangaroo Pocket */}
          <path fill="rgba(0,0,0,0.18)" d="M14 43h20v5H14z" />
        </>
      )}

      {/* 9.4 Cyber Armor / Tactical Combat Vest */}
      {shirtStyle === "cyber_armor" && (
        <>
          {/* Undersuit */}
          <path fill="#0f172a" d="M8 36h32v12H8z" />
          {/* Shoulder Pads */}
          <rect x="6" y="35" width="6" height="5" fill={shirtColor} />
          <rect x="36" y="35" width="6" height="5" fill={shirtColor} />
          {/* Chest Armor Plate */}
          <rect x="14" y="36" width="20" height="12" fill={shirtColor} />
          <path fill="rgba(0,0,0,0.25)" d="M14 42h20v2H14z" />
          {/* Glowing Power Core / Chevron */}
          <polygon points="24,38 20,41 28,41" fill={shirtSecondaryColor} />
          <rect x="23" y="41" width="2" height="3" fill={shirtSecondaryColor} />
        </>
      )}

      {/* 9.5 Scientist Lab Coat / Doctor Coat */}
      {shirtStyle === "lab_coat" && (
        <>
          {/* Inner Shirt */}
          <rect x="16" y="36" width="16" height="12" fill={shirtSecondaryColor} />
          {/* Lab Coat Panels */}
          <path fill={shirtColor} d="M8 36h8v12H8zm24 0h8v12h-8z" />
          {/* Pen / Badge in pocket */}
          <rect x="10" y="40" width="2" height="4" fill="#ff5470" />
          <path fill="rgba(0,0,0,0.2)" d="M15 36h1v12h-1zm17 0h1v12h-1z" />
        </>
      )}

      {/* 9.6 Biker / Cyber Leather Jacket */}
      {shirtStyle === "leather_jacket" && (
        <>
          {/* Inner Graphic Tee */}
          <rect x="18" y="36" width="12" height="12" fill={shirtSecondaryColor} />
          <polygon points="24,39 21,43 27,43" fill="#ffd84d" />
          {/* Open Leather Jacket */}
          <path fill={shirtColor} d="M8 36h10v12H8zm22 0h10v12H30z" />
          {/* Silver Zipper & Studs */}
          <line x1="18" y1="36" x2="18" y2="48" stroke="#cbd5e1" strokeWidth="1" />
          <line x1="30" y1="36" x2="30" y2="48" stroke="#cbd5e1" strokeWidth="1" />
          <rect x="10" y="37" width="2" height="2" fill="#ffd84d" />
          <rect x="36" y="37" width="2" height="2" fill="#ffd84d" />
        </>
      )}

      {/* 9.7 Netrunner Tank Top (Bare Arms) */}
      {shirtStyle === "tank_top" && (
        <>
          {/* Bare Arms (Skin Tone) */}
          <rect x="8" y="36" width="6" height="12" fill={skinTone} />
          <rect x="34" y="36" width="6" height="12" fill={skinTone} />
          {/* Tank Top Body */}
          <rect x="14" y="36" width="20" height="12" fill={shirtColor} />
          {/* Chest Graphic */}
          <rect x="21" y="40" width="6" height="4" fill={shirtSecondaryColor} />
        </>
      )}

      {/* 9.8 Cyber Robe / Haori */}
      {shirtStyle === "kimono" && (
        <>
          <path fill={shirtColor} d="M6 35h36v13H6z" />
          {/* Crossed Lapels */}
          <polygon points="24,44 16,35 20,35 24,41 28,35 32,35" fill={shirtSecondaryColor} />
          {/* Sash / Obi */}
          <rect x="12" y="44" width="24" height="4" fill={shirtSecondaryColor} />
        </>
      )}

      {/* 10. Accessories */}
      {accessory === "cyber_mask" && (
        <path fill="#090d16" stroke="#78dbe6" strokeWidth="1" d="M14 24h20v10H14zm6 2h8v4h-8z" />
      )}
      {accessory === "headphones" && (
        <>
          <path fill="#3b82f6" d="M10 8h28v4H10z" />
          <rect x="6" y="16" width="6" height="12" fill="#ef4444" rx="2" />
          <rect x="36" y="16" width="6" height="12" fill="#ef4444" rx="2" />
          <rect x="7" y="18" width="4" height="8" fill="#ffd84d" />
          <rect x="37" y="18" width="4" height="8" fill="#ffd84d" />
        </>
      )}
      {accessory === "antenna" && (
        <>
          <rect x="34" y="6" width="2" height="10" fill="#78dbe6" />
          <circle cx="35" cy="5" r="2.5" fill="#ff5470" />
        </>
      )}
      {accessory === "earring" && (
        <circle cx="10" cy="26" r="2" fill="#ffd84d" />
      )}
      {accessory === "headband" && (
        <rect x="10" y="12" width="28" height="4" fill="#ff5470" />
      )}
      {accessory === "patch" && (
        <>
          <rect x="14" y="18" width="8" height="8" fill="#090d16" stroke="#ff5470" strokeWidth="1" />
          <line x1="8" y1="12" x2="28" y2="28" stroke="#090d16" strokeWidth="2" />
        </>
      )}
    </svg>
  );
}
