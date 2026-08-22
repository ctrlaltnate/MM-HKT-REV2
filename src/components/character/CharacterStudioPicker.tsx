import React, { useState } from 'react';
import {
  AvatarCustomizationConfig,
  SkinTone,
  HairStyle,
  HairColor,
  OutfitStyle,
  OutfitColor,
  AnimalMask
} from '../../types';
import { PixelButton } from '../common/PixelButton';
import { IconDice } from '../common/PixelIcons';

interface CharacterStudioPickerProps {
  config: AvatarCustomizationConfig;
  onChange: (config: AvatarCustomizationConfig) => void;
}

export const CharacterStudioPicker: React.FC<CharacterStudioPickerProps> = ({
  config,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState<'skin' | 'hair' | 'outfit' | 'mask'>('skin');

  const skinTones: { id: SkinTone; label: string; color: string }[] = [
    { id: 'light', label: 'Light', color: '#F8D7B8' },
    { id: 'medium', label: 'Medium', color: '#E0AC69' },
    { id: 'warm_tan', label: 'Warm Tan', color: '#C68642' },
    { id: 'deep', label: 'Deep', color: '#8D5524' }
  ];

  const hairStyles: { id: HairStyle; label: string }[] = [
    { id: 'short', label: 'Short' },
    { id: 'spiky', label: 'Spiky Cyber' },
    { id: 'bob', label: 'Bob' },
    { id: 'curly', label: 'Curly' },
    { id: 'afro', label: 'Afro' },
    { id: 'ponytail', label: 'Ponytail' },
    { id: 'mohawk', label: 'Mohawk' },
    { id: 'bald', label: 'Bald' }
  ];

  const hairColors: { id: HairColor; label: string; color: string }[] = [
    { id: 'cyan', label: 'Cyan Neon', color: '#37E7FF' },
    { id: 'neon_pink', label: 'Pink Neon', color: '#FF4FD8' },
    { id: 'purple', label: 'Cyber Purple', color: '#8B5CF6' },
    { id: 'black', label: 'Midnight Black', color: '#1E1B2E' },
    { id: 'brown', label: 'Chestnut Brown', color: '#5A3825' },
    { id: 'blonde', label: 'Gold Blonde', color: '#F5D77F' },
    { id: 'silver', label: 'Platinum Silver', color: '#D1D5DB' },
    { id: 'green', label: 'Emerald Green', color: '#10B981' }
  ];

  const outfitStyles: { id: OutfitStyle; label: string; desc: string }[] = [
    { id: 'cyber_hoodie', label: 'Cyber Hoodie', desc: 'สตรีทแฟชั่นไซเบอร์ สบายๆ' },
    { id: 'business_suit', label: 'Business Suit', desc: 'สูททำงานทางการ พร้อมไท' },
    { id: 'retro_jacket', label: 'Retro Jacket', desc: 'แจ็กเก็ตเรโทร 80s' },
    { id: 'casual_shirt', label: 'Casual Shirt', desc: 'เสื้อเชิ้ตลำลองสบายๆ' },
    { id: 'tech_labcoat', label: 'Tech Lab Coat', desc: 'เสื้อกาวน์นักวิจัยเทคโนโลยี' }
  ];

  const outfitColors: { id: OutfitColor; label: string; color: string }[] = [
    { id: 'purple', label: 'Neon Purple', color: '#8B5CF6' },
    { id: 'cyan', label: 'Electric Cyan', color: '#37E7FF' },
    { id: 'pink', label: 'Vibrant Pink', color: '#FF4FD8' },
    { id: 'mango', label: 'Cyber Mango', color: '#FFD84D' },
    { id: 'emerald', label: 'Grid Emerald', color: '#10B981' },
    { id: 'crimson', label: 'Crimson Red', color: '#EF4444' },
    { id: 'slate', label: 'Stealth Slate', color: '#475569' },
    { id: 'gold', label: 'Solar Gold', color: '#F59E0B' }
  ];

  const animalMasks: { id: AnimalMask; label: string; badge: string }[] = [
    { id: 'fox', label: 'Kitsune Cyber Fox', badge: 'Popular' },
    { id: 'cat', label: 'Neon Neko Cat', badge: 'Agile' },
    { id: 'bear', label: 'Robo Bear', badge: 'Resilient' },
    { id: 'owl', label: 'Cyber Owl', badge: 'Analytical' },
    { id: 'cyber_visor', label: 'Holo Visor Strip', badge: 'Minimal' }
  ];

  const randomizeAll = () => {
    const rSkin = skinTones[Math.floor(Math.random() * skinTones.length)].id;
    const rHair = hairStyles[Math.floor(Math.random() * hairStyles.length)].id;
    const rHairColor = hairColors[Math.floor(Math.random() * hairColors.length)].id;
    const rOutfit = outfitStyles[Math.floor(Math.random() * outfitStyles.length)].id;
    const rOutfitColor = outfitColors[Math.floor(Math.random() * outfitColors.length)].id;
    const rMask = animalMasks[Math.floor(Math.random() * animalMasks.length)].id;

    onChange({
      skinTone: rSkin,
      hairStyle: rHair,
      hairColor: rHairColor,
      outfitStyle: rOutfit,
      outfitColor: rOutfitColor,
      animalMask: rMask
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-display font-bold text-text-primary">
          ปรับแต่งตัวละคร (Character Studio)
        </h3>
        <PixelButton
          variant="mango"
          size="sm"
          onClick={randomizeAll}
          leftIcon={<IconDice size={16} color="var(--text-on-accent)" />}
        >
          สุ่มตัวละคร 🎲
        </PixelButton>
      </div>

      {/* Category Tabs */}
      <div className="flex border-b border-[#352C5E] gap-1 overflow-x-auto pb-1">
        {[
          { id: 'skin', label: '1. ผิว' },
          { id: 'hair', label: '2. ทรงผม & สี' },
          { id: 'outfit', label: '3. เสื้อผ้า' },
          { id: 'mask', label: '4. หน้ากากสัตว์' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-2 text-xs font-display font-semibold rounded-t-md transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-[#262047] text-brand-cyan border-b-2 border-brand-cyan'
                : 'text-text-muted hover:text-text-primary hover:bg-[#17162E]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="p-4 bg-[#262047]/40 rounded-lg border border-[#352C5E] min-h-[220px]">
        {/* 1. Skin Tone */}
        {activeTab === 'skin' && (
          <div className="space-y-3">
            <label className="text-xs text-text-muted font-display">เลือกเฉดสีผิว (Skin Tone):</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skinTones.map((st) => (
                <button
                  key={st.id}
                  onClick={() => onChange({ ...config, skinTone: st.id })}
                  className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-all ${
                    config.skinTone === st.id
                      ? 'border-brand-purple bg-[#17162E] shadow-md shadow-purple-900/30 ring-2 ring-brand-purple'
                      : 'border-[#352C5E] bg-[#17162E]/60 hover:border-brand-purple/50'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full border border-black/40 shadow-inner flex-shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <span className="text-xs font-display font-medium text-text-primary">{st.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 2. Hair */}
        {activeTab === 'hair' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted font-display block mb-2">เลือกทรงผม (Hairstyle):</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {hairStyles.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => onChange({ ...config, hairStyle: hs.id })}
                    className={`px-3 py-2 rounded text-xs font-display font-medium text-left transition-all ${
                      config.hairStyle === hs.id
                        ? 'bg-brand-purple text-white shadow-md'
                        : 'bg-[#17162E] text-text-muted hover:text-text-primary border border-[#352C5E]'
                    }`}
                  >
                    {hs.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-display block mb-2">เลือกสีผม (Hair Color):</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {hairColors.map((hc) => (
                  <button
                    key={hc.id}
                    onClick={() => onChange({ ...config, hairColor: hc.id })}
                    title={hc.label}
                    className={`h-9 rounded border flex items-center justify-center transition-all ${
                      config.hairColor === hc.id
                        ? 'border-white ring-2 ring-brand-cyan scale-105'
                        : 'border-[#352C5E] hover:scale-105'
                    }`}
                    style={{ backgroundColor: hc.color }}
                  >
                    {config.hairColor === hc.id && <span className="text-black text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. Outfits */}
        {activeTab === 'outfit' && (
          <div className="space-y-4">
            <div>
              <label className="text-xs text-text-muted font-display block mb-2">เลือกสไตล์ชุด (Outfit Style):</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {outfitStyles.map((os) => (
                  <button
                    key={os.id}
                    onClick={() => onChange({ ...config, outfitStyle: os.id })}
                    className={`p-3 rounded text-left transition-all ${
                      config.outfitStyle === os.id
                        ? 'bg-brand-purple/20 border border-brand-purple text-text-primary ring-1 ring-brand-purple'
                        : 'bg-[#17162E] text-text-muted border border-[#352C5E] hover:border-brand-purple/50'
                    }`}
                  >
                    <div className="font-display font-bold text-xs text-text-primary">{os.label}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{os.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-text-muted font-display block mb-2">เลือกสีชุด (Outfit Color):</label>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {outfitColors.map((oc) => (
                  <button
                    key={oc.id}
                    onClick={() => onChange({ ...config, outfitColor: oc.id })}
                    title={oc.label}
                    className={`h-9 rounded border flex items-center justify-center transition-all ${
                      config.outfitColor === oc.id
                        ? 'border-white ring-2 ring-brand-purple scale-105'
                        : 'border-[#352C5E] hover:scale-105'
                    }`}
                    style={{ backgroundColor: oc.color }}
                  >
                    {config.outfitColor === oc.id && <span className="text-black text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. Animal Mask */}
        {activeTab === 'mask' && (
          <div className="space-y-3">
            <label className="text-xs text-text-muted font-display">
              เลือกหน้ากากสัตว์ปิดบังตัวตน (Animal Mask):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {animalMasks.map((am) => (
                <button
                  key={am.id}
                  onClick={() => onChange({ ...config, animalMask: am.id })}
                  className={`p-3 rounded-lg text-left flex items-center justify-between transition-all ${
                    config.animalMask === am.id
                      ? 'bg-brand-pink/15 border-2 border-brand-pink text-text-primary shadow-lg shadow-pink-900/20'
                      : 'bg-[#17162E] text-text-muted border border-[#352C5E] hover:border-brand-pink/50'
                  }`}
                >
                  <div>
                    <div className="font-display font-bold text-xs text-text-primary">{am.label}</div>
                    <div className="text-[11px] text-text-muted">ใช้ทั้งใน World และ Realtime Video Call</div>
                  </div>
                  <span className="text-[10px] font-mono bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded border border-brand-pink/30">
                    {am.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
