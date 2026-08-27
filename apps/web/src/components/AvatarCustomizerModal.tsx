import {
  Check,
  Dices,
  Eye,
  Headphones,
  Palette,
  RotateCcw,
  Scissors,
  Shirt,
  Smile,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import type { AvatarConfig } from "../domain/types";
import { Modal } from "./Modal";
import { PixelButton, StatusPill } from "./PixelUI";
import { getDefaultAvatarConfig, ProfileAvatar } from "./ProfileAvatar";

const SKIN_TONES = [
  { label: "Fair Pale", value: "#ffd7ba" },
  { label: "Warm Tan", value: "#e0ac69" },
  { label: "Medium Bronze", value: "#c68642" },
  { label: "Deep Bronze", value: "#8d5524" },
  { label: "Obsidian", value: "#3d2314" },
  { label: "Cyber Cyan", value: "#5eead4" },
  { label: "Android Violet", value: "#c084fc" },
];

const HAIR_STYLES = [
  { label: "Classic Short", value: "short" },
  { label: "Spiky Anime", value: "spiky" },
  { label: "Sleek Bob", value: "bob" },
  { label: "Long Wave", value: "long" },
  { label: "Cyber Mohawk", value: "punk" },
  { label: "Afro Puff", value: "afro" },
  { label: "Cyber Dreads", value: "dreads" },
  { label: "Clean Bald", value: "bald" },
];

const HAIR_COLORS = [
  { label: "Neon Cyan", value: "#78dbe6" },
  { label: "Cyber Violet", value: "#9a72ff" },
  { label: "Amber Gold", value: "#ffd84d" },
  { label: "Hot Pink", value: "#ff5470" },
  { label: "Emerald Green", value: "#34d399" },
  { label: "Jet Black", value: "#18181b" },
  { label: "Silver White", value: "#f1f5f9" },
  { label: "Auburn Brown", value: "#78350f" },
];

const EYE_STYLES = [
  { label: "Classic Pixel", value: "normal" },
  { label: "Large Anime", value: "anime" },
  { label: "Playful Wink", value: "wink" },
  { label: "Cyber Visor", value: "cyber_visor" },
  { label: "Smart Glasses", value: "smart_glasses" },
  { label: "VR Goggles", value: "vr_goggles" },
];

const EYE_COLORS = [
  { label: "Deep Black", value: "#090d16" },
  { label: "Sky Blue", value: "#38bdf8" },
  { label: "Neon Emerald", value: "#34d399" },
  { label: "Ruby Laser", value: "#f43f5e" },
  { label: "Amber Gold", value: "#fbbf24" },
  { label: "Purple Neon", value: "#c084fc" },
];

const MOUTH_STYLES = [
  { label: "Warm Smile", value: "smile" },
  { label: "Neutral Line", value: "neutral" },
  { label: "Playful Smirk", value: "smirk" },
  { label: "Tech Mouthpiece", value: "cyber_mask" },
  { label: "Cyber Beard", value: "beard" },
];

const ACCESSORIES = [
  { label: "ไม่มี (None)", value: "none" },
  { label: "หูฟัง Neon Headphones", value: "headphones" },
  { label: "หน้ากาก Cyber Mask", value: "cyber_mask" },
  { label: "เสาสัญญาณ Netrunner Antenna", value: "antenna" },
  { label: "ต่างหูทอง (Gold Earring)", value: "earring" },
  { label: "ผ้าคาดหัว (Headband)", value: "headband" },
  { label: "แผ่นปิดตา (Eye Patch)", value: "patch" },
  { label: "Hologram Halo", value: "halo" },
];

const SHIRT_STYLES = [
  { label: "Cyber T-Shirt", value: "cyber_tee" },
  { label: "สูท & เนกไท (Suit & Tie)", value: "suit_tie" },
  { label: "สตรีทฮู้ด (Cyber Hoodie)", value: "hoodie" },
  { label: "ชุดเกราะ Combat Armor", value: "cyber_armor" },
  { label: "เสื้อกาวน์ Lab Coat", value: "lab_coat" },
  { label: "แจ็คเก็ตหนัง Biker", value: "leather_jacket" },
  { label: "เสื้อกล้าม Tank Top", value: "tank_top" },
  { label: "กิโมโนไซเบอร์ (Cyber Robe)", value: "kimono" },
];

const SHIRT_COLORS = [
  { label: "Cyber Violet", value: "#8b5cf6" },
  { label: "Neon Cyan", value: "#06b6d4" },
  { label: "Amber Gold", value: "#f59e0b" },
  { label: "Rose Pink", value: "#f43f5e" },
  { label: "Emerald Green", value: "#10b981" },
  { label: "Stealth Dark", value: "#1e293b" },
  { label: "Clean White", value: "#f8fafc" },
  { label: "Ruby Crimson", value: "#be123c" },
];

const SHIRT_ACCENT_COLORS = [
  { label: "Amber Gold", value: "#ffd84d" },
  { label: "Neon Cyan", value: "#78dbe6" },
  { label: "Hot Pink", value: "#ff5470" },
  { label: "Neon Green", value: "#34d399" },
  { label: "Pure White", value: "#f8fafc" },
  { label: "Dark Stealth", value: "#0f172a" },
  { label: "Laser Blue", value: "#3b82f6" },
  { label: "Cyber Violet", value: "#c084fc" },
];

export function AvatarCustomizerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { user, actions } = useApp();
  const { toast } = useToast();

  const [config, setConfig] = useState<AvatarConfig>(() => {
    if (user?.avatarConfig) return user.avatarConfig;
    return getDefaultAvatarConfig(user?.id ?? "default");
  });

  const [activeTab, setActiveTab] = useState<"skin" | "hair" | "eyes" | "face" | "accessory" | "outfit">("skin");

  useEffect(() => {
    if (user?.avatarConfig) {
      setConfig(user.avatarConfig);
    } else if (user) {
      setConfig(getDefaultAvatarConfig(user.id));
    }
  }, [user, open]);

  if (!user) return null;

  const handleRandomize = () => {
    const randomSkin = SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)]?.value ?? "#e0ac69";
    const randomHairStyle = HAIR_STYLES[Math.floor(Math.random() * HAIR_STYLES.length)]?.value ?? "short";
    const randomHairColor = HAIR_COLORS[Math.floor(Math.random() * HAIR_COLORS.length)]?.value ?? "#78dbe6";
    const randomEyeStyle = EYE_STYLES[Math.floor(Math.random() * EYE_STYLES.length)]?.value ?? "normal";
    const randomEyeColor = EYE_COLORS[Math.floor(Math.random() * EYE_COLORS.length)]?.value ?? "#090d16";
    const randomMouth = MOUTH_STYLES[Math.floor(Math.random() * MOUTH_STYLES.length)]?.value ?? "smile";
    const randomAcc = ACCESSORIES[Math.floor(Math.random() * ACCESSORIES.length)]?.value ?? "none";
    const randomShirtStyle = SHIRT_STYLES[Math.floor(Math.random() * SHIRT_STYLES.length)]?.value ?? "cyber_tee";
    const randomShirt = SHIRT_COLORS[Math.floor(Math.random() * SHIRT_COLORS.length)]?.value ?? "#8b5cf6";
    const randomAccent = SHIRT_ACCENT_COLORS[Math.floor(Math.random() * SHIRT_ACCENT_COLORS.length)]?.value ?? "#ffd84d";

    setConfig({
      skinTone: randomSkin,
      hairStyle: randomHairStyle,
      hairColor: randomHairColor,
      eyeStyle: randomEyeStyle,
      eyeColor: randomEyeColor,
      mouthStyle: randomMouth,
      accessory: randomAcc,
      shirtStyle: randomShirtStyle,
      shirtColor: randomShirt,
      shirtSecondaryColor: randomAccent,
      backgroundTone: "#07101a",
    });
    toast.info("🎲 สุ่มลุคใหม่เรียบร้อยแล้ว!");
  };

  const handleSave = () => {
    actions.updateUserAvatar(user.id, config);
    toast.success("บันทึก Avatar ตัวละครของคุณเรียบร้อยแล้ว!");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="สตูดิโอปรับแต่ง Avatar ตัวละคร"
      subtitle="ออกแบบสีผิว ทรงผม ดวงตา สีหน้า ชุดแต่งกาย และของตกแต่งสำหรับโปรไฟล์ของคุณ"
      maxWidth="920px"
    >
      <div className="avatar-customizer-layout">
        {/* LEFT COLUMN: LIVE AVATAR PREVIEW */}
        <div className="avatar-preview-box">
          <div className="avatar-preview-canvas">
            <ProfileAvatar config={config} size={150} />
          </div>

          <div className="avatar-preview-meta">
            <strong style={{ color: "var(--text)", fontSize: "1.1rem" }}>{user.displayName}</strong>
            <StatusPill tone={user.role === "candidate" ? "cyan" : user.role === "recruiter" ? "violet" : "mango"}>
              {user.role.toUpperCase()}
            </StatusPill>
          </div>

          <div className="avatar-preview-actions">
            <PixelButton type="button" tone="mango" onClick={handleRandomize} style={{ width: "100%" }}>
              <Dices aria-hidden="true" /> สุ่มสไตล์ (Randomize)
            </PixelButton>
            <PixelButton
              type="button"
              tone="neutral"
              onClick={() => setConfig(getDefaultAvatarConfig(user.id))}
              style={{ width: "100%" }}
            >
              <RotateCcw aria-hidden="true" /> รีเซ็ตเป็นค่าเริ่มต้น
            </PixelButton>
          </div>
        </div>

        {/* RIGHT COLUMN: CUSTOMIZATION CONTROLS */}
        <div className="avatar-controls-box">
          {/* Tabs - No scrollbar, all tabs clearly visible */}
          <div className="avatar-customizer-tabs" role="tablist">
            <button
              type="button"
              className={activeTab === "skin" ? "active" : ""}
              onClick={() => setActiveTab("skin")}
            >
              <Palette size={15} /> สีผิว
            </button>
            <button
              type="button"
              className={activeTab === "hair" ? "active" : ""}
              onClick={() => setActiveTab("hair")}
            >
              <Scissors size={15} /> ทรงผม
            </button>
            <button
              type="button"
              className={activeTab === "eyes" ? "active" : ""}
              onClick={() => setActiveTab("eyes")}
            >
              <Eye size={15} /> ตา/แว่น
            </button>
            <button
              type="button"
              className={activeTab === "face" ? "active" : ""}
              onClick={() => setActiveTab("face")}
            >
              <Smile size={15} /> สีหน้า
            </button>
            <button
              type="button"
              className={activeTab === "accessory" ? "active" : ""}
              onClick={() => setActiveTab("accessory")}
            >
              <Headphones size={15} /> ของตกแต่ง
            </button>
            <button
              type="button"
              className={activeTab === "outfit" ? "active" : ""}
              onClick={() => setActiveTab("outfit")}
            >
              <Shirt size={15} /> ชุดเสื้อผ้า
            </button>
          </div>

          {/* TAB 1: SKIN TONE */}
          {activeTab === "skin" && (
            <div className="avatar-tab-content">
              <h4>เลือกเฉดสีผิว (Skin Tone)</h4>
              <div className="avatar-options-grid color-grid">
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.value}
                    type="button"
                    className={`avatar-color-btn ${config.skinTone === tone.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, skinTone: tone.value })}
                  >
                    <span className="swatch" style={{ background: tone.value }} />
                    <span className="label">{tone.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: HAIR STYLE & COLOR */}
          {activeTab === "hair" && (
            <div className="avatar-tab-content">
              <h4>ทรงผม (Hair Style)</h4>
              <div className="avatar-options-grid">
                {HAIR_STYLES.map((hair) => (
                  <button
                    key={hair.value}
                    type="button"
                    className={`avatar-option-btn ${config.hairStyle === hair.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, hairStyle: hair.value })}
                  >
                    {hair.label}
                  </button>
                ))}
              </div>

              <h4 style={{ marginTop: 18 }}>สีผม (Hair Color)</h4>
              <div className="avatar-options-grid color-grid">
                {HAIR_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`avatar-color-btn ${config.hairColor === color.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, hairColor: color.value })}
                  >
                    <span className="swatch" style={{ background: color.value }} />
                    <span className="label">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EYES & EYEWEAR */}
          {activeTab === "eyes" && (
            <div className="avatar-tab-content">
              <h4>ทรงดวงตาและแว่นตา (Eye Style & Eyewear)</h4>
              <div className="avatar-options-grid">
                {EYE_STYLES.map((eye) => (
                  <button
                    key={eye.value}
                    type="button"
                    className={`avatar-option-btn ${config.eyeStyle === eye.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, eyeStyle: eye.value })}
                  >
                    {eye.label}
                  </button>
                ))}
              </div>

              <h4 style={{ marginTop: 18 }}>สีดวงตา / แสง Visor (Eye Color)</h4>
              <div className="avatar-options-grid color-grid">
                {EYE_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`avatar-color-btn ${config.eyeColor === color.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, eyeColor: color.value })}
                  >
                    <span className="swatch" style={{ background: color.value }} />
                    <span className="label">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FACE & EXPRESSION */}
          {activeTab === "face" && (
            <div className="avatar-tab-content">
              <h4>สีหน้าและรูปปาก (Facial Expression)</h4>
              <div className="avatar-options-grid">
                {MOUTH_STYLES.map((mouth) => (
                  <button
                    key={mouth.value}
                    type="button"
                    className={`avatar-option-btn ${config.mouthStyle === mouth.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, mouthStyle: mouth.value })}
                  >
                    {mouth.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ACCESSORIES */}
          {activeTab === "accessory" && (
            <div className="avatar-tab-content">
              <h4>ของตกแต่งหน้าและศีรษะ (Face & Head Accessories)</h4>
              <div className="avatar-options-grid">
                {ACCESSORIES.map((acc) => (
                  <button
                    key={acc.value}
                    type="button"
                    className={`avatar-option-btn ${config.accessory === acc.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, accessory: acc.value })}
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: OUTFIT & CLOTHING */}
          {activeTab === "outfit" && (
            <div className="avatar-tab-content">
              <h4>สไตล์ชุดและเครื่องแต่งกาย (Outfit Style)</h4>
              <div className="avatar-options-grid">
                {SHIRT_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    className={`avatar-option-btn ${config.shirtStyle === style.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, shirtStyle: style.value })}
                  >
                    {style.label}
                  </button>
                ))}
              </div>

              <h4 style={{ marginTop: 18 }}>สีเสื้อหลัก (Primary Outfit Color)</h4>
              <div className="avatar-options-grid color-grid">
                {SHIRT_COLORS.map((shirt) => (
                  <button
                    key={shirt.value}
                    type="button"
                    className={`avatar-color-btn ${config.shirtColor === shirt.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, shirtColor: shirt.value })}
                  >
                    <span className="swatch" style={{ background: shirt.value }} />
                    <span className="label">{shirt.label}</span>
                  </button>
                ))}
              </div>

              <h4 style={{ marginTop: 18 }}>สีเนกไท / ลาย / แสงไฮไลต์ (Accent & Detail Color)</h4>
              <div className="avatar-options-grid color-grid">
                {SHIRT_ACCENT_COLORS.map((accent) => (
                  <button
                    key={accent.value}
                    type="button"
                    className={`avatar-color-btn ${config.shirtSecondaryColor === accent.value ? "selected" : ""}`}
                    onClick={() => setConfig({ ...config, shirtSecondaryColor: accent.value })}
                  >
                    <span className="swatch" style={{ background: accent.value }} />
                    <span className="label">{accent.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="avatar-modal-footer">
        <PixelButton type="button" tone="neutral" onClick={onClose}>
          ยกเลิก
        </PixelButton>
        <PixelButton type="button" tone="cyan" onClick={handleSave}>
          <Check aria-hidden="true" /> บันทึก Avatar ของคุณ
        </PixelButton>
      </div>
    </Modal>
  );
}
