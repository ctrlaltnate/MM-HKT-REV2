# 5. Component Library, UI Primitives & Media Engines

> **Visual Guideline:** ทุก Component และ Icon ในระบบสร้างขึ้นด้วย **Custom Vector SVGs และ Pixel Art** โดยเฉพาะ **ห้ามใช้อิโมจิ** เป็นตัวแทนของไอคอน ปุ่ม หรือสถานะ

---

## 5.1 Design System Primitives

ทุก Primitive Component ในระบบจะต้องรองรับสถานะพื้นฐานครบถ้วน: `default`, `hover`, `focus-visible`, `pressed`, `selected`, `disabled`, `loading`, และ `error`

| Component Name | Variants & Styles | Required States & Behaviors |
|---|---|---|
| **`PixelButton`** | `primary`, `secondary`, `danger`, `quiet` | รองรับ Focus-visible 4px ring, ขนาดขั้นต่ำ 44×44px, Loading spinner |
| **`IconButton`** | `standard`, `compact`, `floating` | ใช้ Custom SVG Icons (No Emoji), มี Accessible Name เสมอ |
| **`TextField`** | `text`, `search`, `textarea`, `OTP` | Valid, Invalid พร้อม `aria-describedby` เชื่อม Error Text |
| **`Checkbox / Radio`** | `standard`, `consent-card` | Checked, Unchecked, Indeterminate, Error State |
| **`Select / Dropdown`** | `standard`, `menu-popup` | รองรับ Keyboard Navigation (Arrow up/down, Enter, Esc) |
| **`Card`** | `flat`, `raised`, `interactive-glow` | Hover feedback, Selected border, Accessible container |
| **`DialogWindow`** | `modal`, `alertdialog` | Trap focus ภายใน, คืน Focus ให้ Trigger เมื่อปิด, Esc เพื่อปิด |
| **`BottomSheet`** | `snap-50dvh`, `snap-90dvh` | มีปุ่มขยายเต็มจอ/ปิดชัดเจน ไม่พึ่งพาการ Swipe เพียงอย่างเดียว |
| **`Tabs`** | `line-tabs`, `pixel-segmented` | Arrow key switching, `aria-selected` status |
| **`Toast`** | `info`, `success`, `warning`, `danger` | Live Region Announcement, ข้อความสำคัญไม่หายเองอัตโนมัติ |
| **`Skeleton`** | `card-skeleton`, `list-skeleton` | แสดงโครงสร้างชั่วคราว, หยุดการกระพริบเมื่อ Reduced Motion |

---

## 5.2 Domain Product Components & Media Canvas

| Component Name | Description & Essential Content |
|---|---|
| **`CharacterStudioPicker`** | แผงเลือกหมวดหมู่แต่งตัว (ผิว, ทรงผม, เสื้อผ้า, หน้ากาก) พร้อมรายการ Style Grid |
| **`PaletteSwatch`** | จานสี 8-Bit สำหรับเลือกเฉดสีผิว สีผม และสีเสื้อผ้า |
| **`DiceRandomizerButton`** | ปุ่มกดสุ่มสไตล์ตัวละครแบบ The Sims (`[🎲 สุ่มตัวละคร]`) พร้อม Sound/Haptic |
| **`SpritePreviewStage`** | Canvas Phaser ขนาดย่อม แสดง Live 8-Bit Animation และปุ่มหมุนตัวละคร 360° |
| **`FaceMaskCanvas`** | Canvas เรนเดอร์กล้องจริง + Realtime Face Tracking Avatar Overlay (Fail-Closed Active) |
| **`VoiceModulatorDock`** | ตัวควบคุม Web Audio API DSP Pitch / Formant Shift พร้อม Visual Level Meter |
| **`DemoBanner`** | ป้ายสถานะความปลอดภัย (`DEMO DATA / OFFICIAL DIGITAL ID COMPLIANT`) |
| **`BlindModeBadge`** | ป้ายระบุสถานะการปิดบังข้อมูลตัวตน พร้อม Tooltip อธิบายสิ่งที่ซ่อน |
| **`CandidateAlias`** | ป้ายรหัสประจำตัวผู้สมัคร (เช่น `Candidate #8F3A`) พร้อม Generated Animal Avatar |
| **`VisibilityTable`** | ตารางแสดงรายการข้อมูลที่ถูกปิดบัง vs ข้อมูลที่เปิดเผยให้ Recruiter เห็น |
| **`MatchScoreCard`** | การ์ดแสดงคะแนนความตรงกัน (0–100), ระดับความมั่นใจ, และเหตุผล 3–5 ข้อ |
| **`BoothCard`** | การ์ดข้อมูลบูธสมจริง: โลโก้, รายการตำแหน่งงาน, สถานะคิวสด, โต๊ะ Recruiter |
| **`JobCard`** | การ์ดรายละเอียดงาน: คุณสมบัติหลัก (Must-have), โหมดการทำงาน, และปุ่มเข้าคิว |
| **`QueueChip`** | ชิปแสดงสถานะคิวบน Floating HUD: บูธ, ลำดับคิว, เวลานับถอยหลัง, ปุ่มขยาย |
| **`ReadyCheckDialog`** | กล่องแจ้งเตือนเมื่อถึงคิวสัมภาษณ์: เวลาถอยหลัง 60s, ปุ่มพร้อม, ปุ่มขอเลื่อน |
| **`NetworkBadge`** | ป้ายแสดงคุณภาพสัญญาณเน็ต: `ดีมาก`, `ไม่เสถียร`, `กำลังเชื่อมต่อใหม่`, `ออฟไลน์` |
| **`MediaControlDock`** | แถบควบคุมมัลติมีเดียในห้องสัมภาษณ์: ปุ่มไมค์, กล้อง, สลับ Avatar, ออกจากห้อง |
| **`PrivacyStatusBar`** | แถบสถานะความปลอดภัย: แสดงสถานะ Face Mask, Recording Off, End-to-End |
| **`DecisionCard`** | การ์ดส่งผลการตัดสินใจส่วนตัว: ข้อความเตือนความลับ และปุ่ม `สนใจ` / `ยังไม่ไปต่อ` |
| **`RevealFieldPicker`** | แบบฟอร์มเลือก Checkbox ข้อมูลที่จะเปิดเผย (Email, Phone, Portfolio, Resume) |
| **`SupportEntry`** | เมนูลัดสำหรับขอความช่วยเหลือฉุกเฉิน หรือแจ้งเรื่องร้องเรียน |

---

## 5.3 Component Naming & Hierarchy in Design Tool

ใช้โครงสร้าง Slash Naming Hierarchy เพื่อให้สอดคล้องระหว่าง Figma / UI Kit และ Code:

```text
Button/Primary/Default
Button/Primary/Hover
Button/Primary/Loading
Media/FaceMaskCanvas/TrackingActive
Media/VoiceModulator/PitchShifted
Status/Network/Reconnecting
Queue/Chip/ReadyCheck
Dialog/ReadyCheck/Mobile
Card/Job/Recommended
Media/Control/Mic/Muted
```
