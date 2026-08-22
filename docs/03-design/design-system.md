# 1. 8-Bit Visual Design System & Tokens

---

## 1.1 Creative Direction: “Neon Career City”

ภาพรวมของ MaskedMatch คือ **ฮอลล์งานแฟร์อนาคตแบบ Pixel Art ผสมผสาน Neon Aesthetics**:
- **บรรยากาศ:** Professional Convention Hall ผสมผสานกับ Modern Coworking Space, Exhibitor Booths, Recruiter Tables, Indoor Lounge, Support Desk, และ Device Test Pods
- **อารมณ์:** ฉลาด เป็นมิตร มีความหวัง ไม่ดูเด็กเกินไป (Retro-futuristic แต่ชัดเจน อ่านง่ายเหมือน Modern SaaS)
- **Top-Down Perspective:** World เป็นภาพ 2D Top-Down แบบ Full-bleed ในขณะที่ Form, HUD, และ Navigation เป็น Semantic DOM Overlay ที่คมชัดและเข้าถึงได้ (Accessible)

### Inspiration Boundary (ความแตกต่างจาก Hideout / Gather)

MaskedMatch นำเฉพาะแนวคิด **Spatial Presence, Contextual Interaction, Event Wayfinding, และ Customizable Booths** มาปรับใช้

**MUST NOT** คัดลอก:
- ✕ Sprite, Tileset, Map Layout, Furniture, หรือ Character Avatar
- ✕ Exact Color Palette, Typography, Navigation Chrome หรือ Component Composition
- ✕ Copywriting, Sound Effect, Logo, Trademark หรือ Trade Dress

---

## 1.2 Design Tokens & Color System

### Base Color Tokens

| Token Name | Hex Code | Purpose & Semantic Meaning |
|---|---|---|
| `bg.canvas` | `#070816` | พื้นหลังหลักของแอปพลิเคชัน |
| `bg.world-night` | `#0D1025` | พื้นหลังของโลกจำลอง / พื้นผิวแผนที่ |
| `surface.1` | `#17162E` | Card, Panel, Floating HUD พื้นฐาน |
| `surface.2` | `#262047` | Elevated Modal, Active Panel, Dropdown |
| `brand.purple` | `#8B5CF6` | Primary Action, Selected State |
| `brand.pink` | `#FF4FD8` | Match Highlight, Celebration, Accent |
| `brand.cyan` | `#37E7FF` | Navigation, Information, Interactive Links |
| `brand.mango` | `#FFD84D` | Attention, CTA, Ready Check Alert |
| `status.success` | `#4ADE80` | สถานะสำเร็จ, รับคิว, Online |
| `status.warning` | `#FBBF24` | สถานะเตือน, คิวใกล้ถึง, Reconnecting |
| `status.danger` | `#FF5A6F` | สถานะอันตราย, Offline, ปฏิเสธ, ลบคิว |
| `text.primary` | `#F8F7FF` | ข้อความหลักบน Dark Surface |
| `text.muted` | `#BBB6D5` | ข้อความรอง, คำอธิบายประกอบ |
| `text.on-accent` | `#070816` | ข้อความ/ไอคอนเข้ม บนปุ่ม Neon / Status |
| `text.on-dark` | `#F8F7FF` | ข้อความสว่าง บนพื้นหลังเข้ม |
| `focus.ring` | `#FFFFFF` | เส้น Focus Ring ภายนอกเพื่อการเข้าถึง |

### Approved Contrast Recipes (WCAG 2.2 AA Compliance)

| Background Token | Foreground Token | Contrast Ratio | Approved Usage |
|---|---|:---:|---|
| `brand.purple` (`#8B5CF6`) | `text.on-accent` (`#070816`) | **4.70:1** | Primary Button / Active Badge |
| `brand.pink` (`#FF4FD8`) | `text.on-accent` (`#070816`) | **6.98:1** | Match Highlight Banner |
| `brand.cyan` (`#37E7FF`) | `text.on-accent` (`#070816`) | **13.30:1** | Info Chip / Navigation Links |
| `brand.mango` (`#FFD84D`) | `text.on-accent` (`#070816`) | **14.39:1** | Ready Check CTA / Attention Alert |
| `status.success` (`#4ADE80`) | `text.on-accent` (`#070816`) | **11.42:1** | Success Status Badge |
| `status.warning` (`#FBBF24`) | `text.on-accent` (`#070816`) | **11.92:1** | Warning Chip |
| `status.danger` (`#FF5A6F`) | `text.on-accent` (`#070816`) | **6.58:1** | Danger Button / Reject Action |

> **กฎการใช้สี:** **MUST NOT** ใช้ `text.primary` (สีขาว) บนปุ่ม Purple, Pink, Cyan, Mango, Success หรือ Danger สำหรับตัวหนังสือขนาดปกติ เพราะคอนทราสต์ไม่ผ่านเกณฑ์ 4.5:1

---

## 1.3 Typography

| Role | Font Family / Spec | Size & Line-Height Rules |
|---|---|---|
| **Logo / Latin Display** | Pixel Display Font (Licensed) | ขนาด ≥20 px ใช้เฉพาะ Header สั้นๆ |
| **Thai Display** | `Chakra Petch` หรือ Thai Display Font | หัวข้อใหญ่, Title Bar, Hero Text |
| **Thai/English Body** | `Noto Sans Thai`, System Sans Fallback | ขนาดขั้นต่ำ 16 CSS px, Line-height 1.5–1.7 |
| **Numbers & Timers** | Monospace Font with Tabular Numerals | ตัวเลขนับถอยหลัง, เวลาคิว, รหัสผู้สมัคร |
| **Captions** | Readable Sans-serif | 16–18 CSS px ปรับขนาดได้ |

> **ข้อห้าม:** **MUST NOT** ใช้ Pixel Font กับ Paragraph ยาว, ข้อกำหนดกฎหมาย, Help Text, Error Message หรือ Form Input

---

## 1.4 Pixel Geometry & Art Production

- **Base Tile Grid:** `16 × 16 logical px`
- **Integer Render Scale:** `2x` หรือ `3x` (หลีกเลี่ยง Fractional Scaling เพื่อไม่ให้ Sprite เบลอ)
- **Character Sprites:** `24 × 32 logical px`, 4 ทิศทาง (Walk loop 4–6 frames, Idle 2 frames)
- **Animation FPS:** 8–10 fps สำหรับตัวละคร; UI Transitions แยกเป็น 150–220 ms
- **Collision Footprint:** กล่องชนที่ฐานตัวละคร มีขนาดเล็กกว่าภาพ Sprite เพื่อให้เดินในทางแคบได้สะดวก
- **Texture Atlas:** จัดกลุ่ม Sprite Atlas เป็น `core`, `district`, `booth`, `props`
- **Image Rendering:** ใช้ `image-rendering: pixelated` หรือ `crisp-edges` สำหรับ Canvas/Pixel Assets

---

## 1.5 Spacing, Shape & Elevation

- **Base Rhythm Grid:** 4 px (Primary step: 8 px, 16 px, 24 px, 32 px)
- **Touch Target:** ขนาดขั้นต่ำ `44 × 44 CSS px` (Critical Mobile Action: `48 × 48 CSS px`)
- **Border & Shadow:** ขอบ 2 px Solid สไตล์ Retro Shadow 2 px
- **Corner Radius:** 0–4 px เพื่อคงเอกลักษณ์ Pixel Art (Modal ขนาดใหญ่ใช้ไม่เกิน 8 px)
- **Focus Rings:** 2 px Inner Dark + 2 px Outer White/Cyan

---

## 1.6 Motion, Sound & Haptics

- **Reduced Motion Support:** เคารพการตั้งค่า `prefers-reduced-motion`; ปิด Camera Shake, Parallax, Particle Effects, และ Floating Bob
- **Sound Opt-in:** ปิดเสียงเป็นค่าเริ่มต้น (Muted by default) ผู้ใช้ต้องเปิดเอง
- **Haptics:** รองรับ Haptic Feedback ในจังหวะ Ready Check บนอุปกรณ์มือถือ (โดยมี Visual Alert ควบคู่เสมอ)

---

## 1.7 Final Design Test (5 คำถามประเมินก่อนอนุมัติ Frame)

1. ผู้สมัครรู้หรือไม่ว่าตอนนี้ Recruiter มองเห็นข้อมูลอะไรจากตนเองบ้าง?
2. ถ้าไม่ใช้ Canvas, กล้อง หรือเน็ตความเร็วต่ำ ผู้ใช้ยังทำ Task หลักสำเร็จหรือไม่?
3. Primary Action ของหน้าจอนี้ชัดเจนเพียงหนึ่งอย่างหรือไม่?
4. เมื่อเกิด Refresh, Timeout หรือ Permission Fail ผู้ใช้รู้ว่าต้องทำอะไรต่อหรือไม่?
5. หน้าจอนี้ช่วยเล่า Core Loop บนเวที หรือกำลังเพิ่ม Feature ที่ไม่จำเป็น?
