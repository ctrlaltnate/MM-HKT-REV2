# Website & Product UI Design System

> **Document role:** Single Source of Truth สำหรับ Website, Landing, form, panel, HUD และ Semantic DOM UI
> **Version:** 3.0 · 22 August 2026
> **Game visual owner:** [Game Visual & World Specification](./world-and-scene-design.md)

เอกสารนี้ไม่กำหนด anatomy ของ booth/props/character ซ้ำ งานภาพภายใน Phaser ต้องใช้เอกสาร Game Visual & World Specification เท่านั้น

---

## 1. Creative Direction

MaskedMatch ใช้ภาษา **professional retro-future career platform**:

- จริงจังพอสำหรับงานอาชีพ แต่เป็นมิตรและชวนสำรวจ
- 8-bit แสดงผ่าน grid, pixel edge, icon และ rhythm ไม่ใช่การทำข้อความทุกอย่างเป็น pixel font
- ใช้ cyan/violet/mango เป็น functional accent ไม่กระจาย neon ทุก surface
- มี negative space และ visual hierarchy ชัดก่อนเพิ่ม glow, blur หรือ animation
- Website และ World HUD ดูเป็นผลิตภัณฑ์เดียวกัน แต่ DOM ไม่เลียนแบบวัตถุในเกม

### Inspiration boundary

นำหลัก spatial presence, contextual interaction และ event wayfinding ของผลิตภัณฑ์อ้างอิงมาศึกษาได้ แต่ห้ามคัดลอก sprite, map, UI chrome, typography, palette, copywriting, sound, component composition หรือ trade dress

---

## 2. Surface Ownership

| Surface | Owner | Content |
|---|---|---|
| Product Landing / Event Landing | React Semantic DOM | value proposition, event information, CTA, schedule, booth preview |
| Candidate / Recruiter / Ops tasks | React Semantic DOM | form, profile, queue, interview controls, decision, admin |
| Navigator / Booth Detail | React Semantic DOM | accessible equivalent ของ Canvas actions |
| World HUD / Dialogue / Panel | React Semantic DOM | status, mission, context, focusable controls |
| Career Hall | Phaser 4 | floor, entities, actors, physics, camera, animation, interaction sensor |

ข้อกำหนด boundary เต็มอยู่ใน [Web–Game Separation](../04-architecture/web-game-separation.md)

---

## 3. Core Tokens

### 3.1 Color

| Token | Value | Use |
|---|---|---|
| `bg.page` | `#0B1724` | Website page background |
| `bg.app` | `#0D1830` | Application shell |
| `surface.1` | `#142F41` | Card/panel |
| `surface.2` | `#172B4D` | Elevated panel/dialog |
| `surface.deep` | `#08141F` | Header/dock |
| `accent.cyan` | `#78DBE6` | navigation, focus-adjacent info |
| `accent.violet` | `#8B5CF6` | selection/avatar |
| `accent.pink` | `#FF4FD8` | match accent only |
| `accent.mango` | `#FFD84D` | attention/ready check |
| `status.success` | `#4ADE80` | successful/online |
| `status.warning` | `#FBBF24` | warning/reconnecting |
| `status.danger` | `#FF5A6F` | destructive/error |
| `text.primary` | `#F8F7FF` | main text on dark |
| `text.muted` | `#C7D3E9` | secondary text |
| `text.onAccent` | `#071426` | text on bright accent |
| `focus.ring` | `#FFFFFF` | keyboard focus |

Color ต้องไม่เป็นตัวสื่อสถานะเพียงอย่างเดียว ทุก status มี icon/shape + text

### 3.2 Spacing and geometry

- Base spacing: `4 px`; standard rhythm: `8, 12, 16, 24, 32, 48, 64`
- Pixel border: `1–2 px`; offset shadow: `4–7 px`
- Touch target: อย่างน้อย `44 × 44 CSS px`
- Container max width: `1440 px`; body copy max width: `70ch`
- ใช้ square/notched corner เป็น accent; หลีกเลี่ยง corner style หลายแบบในหน้าเดียว
- card ต้องอยู่บน explicit grid และมี alignment ร่วมกัน ห้ามวางแบบลอยกระจัดกระจาย

### 3.3 Typography

| Role | Rule |
|---|---|
| Thai/English body | system sans / `Noto Sans Thai`, ขั้นต่ำ 16 px ใน flow หลัก, line-height 1.5–1.7 |
| Display | monospace/pixel-inspired ใช้เฉพาะ heading สั้นและ Latin label |
| Numeric/status | monospace + tabular numerals |
| Caption | readable sans/mono, ไม่ต่ำกว่า 12 px เมื่อเป็นข้อมูลที่ต้องอ่าน |

Pixel font ห้ามใช้กับย่อหน้าไทยยาว, privacy notice, form help หรือ error message

---

## 4. UI Hierarchy

หนึ่ง state มี primary action เด่นหนึ่งรายการ ส่วน action อื่นเรียงตามลำดับ:

1. **Primary:** เดิน flow ต่อหรือยืนยันผลหลัก
2. **Secondary:** ทางเลือกที่ไม่ทำลายข้อมูล
3. **Tertiary:** navigation/context action
4. **Danger:** reset/cancel/delete แยกตำแหน่งและต้องไม่ติด primary

ทุกหน้าต้องมี:

- page/route identity
- current state หรือ progress เมื่อเป็น multi-step flow
- primary action ที่เห็นโดยไม่ต้องเดา
- back/recovery path
- loading, empty, validation, permission, offline และ server-error state ตามบริบท

Glow, gradient และ glass เป็น accent เท่านั้น ไม่ใช้แทน border, grouping หรือ text hierarchy

---

## 5. Component States

ทุก interactive component ต้องกำหนดอย่างน้อย:

| State | Required behavior |
|---|---|
| Default | label ชัดและ hit target ครบ |
| Hover | enhancement เท่านั้น ไม่ซ่อนข้อมูลสำคัญไว้หลัง hover |
| Focus visible | white 3 px ring หรือ equivalent ที่ contrast ผ่าน |
| Pressed/Selected | มี shape/text/state change ไม่ใช้สีอย่างเดียว |
| Disabled | อธิบายเหตุผลเมื่อผู้ใช้อาจไม่เข้าใจ |
| Loading | ป้องกัน duplicate submit และประกาศสถานะ |
| Error | มีข้อความ factual + recovery action |

ห้ามมี dead button, decorative fake input หรือ control ที่ label ไม่ตรงกับ action

---

## 6. Responsive Layout

| Width | Behavior |
|---|---|
| `320–359` | single-column, no horizontal scroll, semantic flow มาก่อน Canvas |
| `360–479` | mobile navigation, full-width action, bottom sheet ที่ปิด/ขยายได้ |
| `480–767` | mobile-wide; grid สูงสุด 2 columns เมื่ออ่านได้ |
| `768–1023` | Canvas + one drawer หรือ content split |
| `1024–1439` | desktop shell; panel widths capped |
| `≥1440` | full composition พร้อม generous margins |

Mobile ต้องมี navigation จริง ไม่ใช่ซ่อน desktop nav แล้วเหลือเพียง brand label

---

## 7. World HUD Rules

- HUD แสดงเฉพาะ mission/status/action ที่จำเป็นต่อ state ปัจจุบัน
- Navigator และ panel เปิดเมื่อผู้ใช้เรียก ไม่บัง World ถาวร
- panel เปิดแล้วต้อง pause/disable game input ที่เกี่ยวข้อง
- desktop panel มี capped width; mobile ใช้ bottom sheet หรือ dedicated semantic view
- queue/network/media status มี text label เสมอ
- Canvas action ทุกอย่างมี Navigator equivalent
- DOM ห้ามใช้เป็น facade, actor, prop หรือ hotspot หลอกใน World

งานมุมกล้อง, booth, props และ character ใช้ [Game Visual & World Specification](./world-and-scene-design.md)

---

## 8. Icons, Images and No-Emoji Rule

- UI icon ใช้ project SVG/pixel icon พร้อม consistent stroke/fill
- emoji ห้ามใช้แทน icon, object, character, booth หรือ status
- decorative image มี empty alt; informative image มี meaningful alt
- ห้ามฝังข้อความสำคัญลง raster asset
- reference image ห้าม import เป็น runtime UI/game asset

---

## 9. Motion and Feedback

- UI transition: `120–220 ms`
- motion ต้องอธิบาย state/relationship ไม่ใช่เคลื่อนไหวตลอดเวลาเพื่อความสวย
- เคารพ `prefers-reduced-motion`; static state ต้องมีข้อมูลเท่ากัน
- sound/haptic เป็น opt-in และไม่เป็นช่องทาง feedback เดียว
- destructive/important result ใช้ text confirmation หรือ persistent status ไม่พึ่ง toast ที่หายเอง

---

## 10. Privacy and Media UI Ownership

รายละเอียด camera, face masking, voice DSP และ fail-closed ไม่อยู่ใน Design System:

- functional behavior: [Functional Requirements](../02-product/functional-requirements.md)
- technical pipeline: [System Architecture](../04-architecture/system-architecture.md)
- privacy/safety: [Security & PDPA](../05-security-and-governance/security-and-pdpa.md)
- screen layout: [Screen Blueprints](./screen-blueprints.md)

Design System กำหนดเพียงว่า media state/consent/fallback ต้องมองเห็น, keyboard accessible และไม่เปิดสื่อโดยไม่ยินยอม

---

## 11. UI Approval Checklist

- [ ] primary action และ recovery path ชัด
- [ ] spacing/type/surface อยู่ใน token system
- [ ] ไม่มี raw browser control หรือ dead action
- [ ] keyboard focus, touch target และ responsive reflow ผ่าน
- [ ] status ใช้ text + visual cue
- [ ] mobile มี navigation และไม่ล้น 320 px
- [ ] World HUD ไม่บัง interaction และมี Navigator parity
- [ ] ไม่มี emoji หรือ baked important text
- [ ] mock/demo capability ติดป้ายตรงความจริง
- [ ] Reduced Motion ยังใช้งาน flow ได้ครบ
