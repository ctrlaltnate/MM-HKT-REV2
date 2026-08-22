# 2. Master Reference Visual Language & Modular Booth System

> 🌟 **PRIMARY MASTER REFERENCE (รูปหลักสูงสุด):**  
> รูปภาพอ้างอิงหลักทั้ง 2 ภาพถูกจัดเก็บไว้ใน `docs/ref_pics/00_MAIN_virtual_job_fair_map.jpg` และ `docs/ref_pics/00_MAIN_spritesheet_booths_characters_props.png`  
> **นี่คือเกณฑ์มาตรฐานอันดับ 1 ที่ต้องให้ความสำคัญสูงสุดในการออกแบบและสร้างฉากทั้งหมด**

---

## 2.1 Master Visual Reference Catalog

```text
docs/ref_pics/
├── 00_MAIN_virtual_job_fair_map.jpg                 # [★ MAIN 1] ผังรวม Virtual Job Fair 6 บูธ ทางเดินพรมน้ำเงิน ลูกศร และ Info Kiosk
├── 00_MAIN_spritesheet_booths_characters_props.png  # [★ MAIN 2] สไปรต์ชีตบูธแยกชิ้น ป้ายโลโก้ เฟอร์นิเจอร์ ตัวละคร และลูกศร
├── 01_top_down_hall_tileset_props.png               # ผังห้องประชุมและโต๊ะทำงาน
├── 02_pixel_office_32x32_tileset.png                 # อุปกรณ์สำนักงาน ตู้กดน้ำ เก้าอี้
├── 03_cyberpunk_neon_plaza.jpg                       # แสงไฟนีออนและเส้นทางเดิน
├── 04_office_cubicles_workstations.png               # พาร์ทิชันโต๊ะทำงาน
└── 05_grand_convention_exhibition_hall.jpg           # โครงสร้างฮอลล์เอ็กซ์โป
```

---

## 2.2 สถาปัตยกรรมฉากแบบ Modular & Endless Background (หัวใจสำคัญตามรูปหลัก)

เพื่อให้ระบบสามารถรองรับ **Endless Seamless World** ที่เดินวนได้ไม่รู้จบ และสามารถเพิ่ม/ลด/สลับตำแหน่งบูธของบริษัทต่างๆ ได้อย่างอิสระ สถาปัตยกรรมฉากต้องแบ่งออกเป็น **3 เลเยอร์แยกอิสระจากกัน (Decoupled Layers)**:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. FOREGROUND & INTERACTIVE PROPS LAYER                                      │
│    • NPC Characters & Recruiters (4-Direction Animated Sprites)             │
│    • Interior Props (Desks, Dual Monitors, Server Towers, Rolling Chairs)   │
│    • Potted Plants, Queue Poles, Yellow Directional Arrows (⬆️ ⬇️ ⬅️ ➡️)   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. MODULAR BOOTH PREFAB LAYER (บูธแยกชิ้นส่วนอิสระ)                         │
│    • Modular Booth Frame (โครงสร้างบูธสี่เหลี่ยมเปิดด้านหน้า)                 │
│    • Customizable Overhead Signboard (ป้ายชื่อบูธด้านบน):                   │
│      - [Custom Logo Slot] ไอคอน/โลโก้บริษัท (เช่น ชิป, โล่, จอยเกม, ใบไม้)   │
│      - [Company Name Text] ชื่อบริษัทเรืองแสง (เช่น CYBER ORCHARD CO.)       │
│      - [Theme Color Border] สีเส้นขอบนีออนเฉพาะของแต่ละบริษัท                 │
│    • Dynamic Backdrop Display (จอพรีเซนต์โค้ด, กราฟิก, โปสเตอร์)            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. ENDLESS BASE BACKGROUND LAYER (พื้นหลังเปล่าที่ต่อวนได้ไม่รู้จบ)         │
│    • Tileable Floor Grid (กระเบื้องตารางสีฟ้า-เทาอ่อน สะอาดตา)              │
│    • Main Walkway Blue Carpet (ทางเดินพรมน้ำเงินพร้อมลูกศรนำทาง)            │
│    • Seamless Repeating Module (1536×1024 px หรือ 2048×2048 px)             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.3 รายละเอียด Spritesheet Master Breakdown (`00_MAIN_spritesheet_booths_characters_props.png`)

### 1. Modular Booth Facades (โครงสร้างบูธและป้ายปรับแต่งได้):
- **Overhead Marquee Banner:** ป้ายด้านบนขนาด 64×16 / 128×24 px แบ่งเป็น 2 ส่วน:
  - ฝั่งซ้าย: กล่องใส่ **Company Logo Icon** (ขนาด 16×16 หรือ 24×24 px)
  - ฝั่งขวา: กล่องแสดง **Company Name Text** (ฟอนต์ Pixel / Chakra Petch คมชัด)
- **ตัวอย่างบูธสำเร็จรูปในระบบ:**
  1. `TECH INNOVATIONS`: ไอคอนไมโครชิป (`T-Chip`) • ธีมนีออนน้ำเงิน
  2. `CYBER SECURITY`: ไอคอนโล่ป้องกัน (`Shield`) • ธีมนีออนฟ้า
  3. `GREEN ENERGY`: ไอคอนใบไม้และดวงอาทิตย์ (`Leaf & Sun`) • ธีมนีออนเขียว
  4. `GAME DEV CRETE`: ไอคอนจอยเกมและเขาวงกต (`Gamepad & Maze`) • ธีมนีออนม่วง
  5. `AUTO FUTURE`: ไอคอนรถยนต์ไฟฟ้าไซเบอร์ (`EV Car`) • ธีมนีออนคราม
  6. `FOOD & CO.`: ไอคอนช้อนส้อมและเมล็ดกาแฟ (`Coffee & Cutlery`) • ธีมนีออนวอร์ม
- **Info Counter (เคาน์เตอร์ข้อมูลกลาง):** ป้าย `INFO` สีน้ำเงิน พร้อมเจ้าหน้าที่ต้อนรับ 2 ฝั่ง

### 2. Characters & NPCs (ตัวละคร 4 ทิศทาง):
- **Player-like Avatar:** สไปรต์เดิน 4 ทิศ (หน้า, หลัง, ซ้าย, ขวา)
- **Recruiter Characters:** ชุดสูททำงานมืออาชีพ สไปรต์ 4 ทิศ
- **Staff & Tech Guides:** เสื้อยืดประจำโซน สไปรต์ 4 ทิศ
- **Character Groupings:** สไปรต์กลุ่มคนคุยกัน (2-4 คน) สำหรับประดับบรรยากาศรอบงาน

### 3. Props & Environment (เฟอร์นิเจอร์และอุปกรณ์):
- **Desks & Tables:** โต๊ะทำงานไม้ขอบโค้ง, โต๊ะเคาน์เตอร์ต้อนรับ, โต๊ะประชุม
- **Office Chairs:** เก้าอี้ล้อเลื่อนสำนักงาน (Ergonomic Chairs) ปรับหมุนได้
- **Tech Equipment:** คอมพิวเตอร์เดสก์ท็อป, จอมอนิเตอร์คู่, คีย์บอร์ด, ตู้เซิร์ฟเวอร์, สายเชื่อมต่อข้อมูล (`Cables`)
- **Decorations:** กระถางต้นไม้ทรงพุ่มกลม, ไม้กระถางใบยาว, โคมไฟผนัง

### 4. UI, Wayfinding & Movement Arrows:
- **Yellow Directional Arrows:** ลูกศรสีส้ม-เหลืองเรืองแสง (`⬆️`, `⬇️`, `⬅️`, `➡️`) วาดบนพรมทางเดินเพื่อบอกทิศทางการเดินชมงาน
- **Mini Player HUD:** แผงสถิติผู้เล่นมุมขวาบน (Level, GP Coins, HP/MP หรือ Ready Status)
- **Contextual Action Bubbles:** ป้ายแจ้งเตือนการกดปุ่ม เช่น `[E] สนทนา / ดูข้อมูลบูธ`

---

## 2.4 ข้อได้เปรียบของการแยกชิ้นส่วนบูธออกจากพื้นหลัง (Decoupled Benefits)
1. **Endless Streaming:** พื้นหลังตารางเปล่าสามารถสร้างซ้ำ (Repeat / Wrap) ได้แบบไม่มีที่สิ้นสุด
2. **Dynamic Booth Placement:** ผู้จัดงาน (Organizer / Admin) สามารถเพิ่มบูธของบริษัทใหม่ เปลี่ยนตำแหน่งบูธ หรือเปลี่ยนโลโก้/ชื่อบริษัทได้แบบ Real-time ผ่าน Configuration JSON
3. **Optimized Rendering:** โหลด Asset สไปรต์ชีตเพียงภาพเดียว แต่สร้างฉากบูธและตัวละครได้นับสิบบูธพร้อมกันอย่างลื่นไหล 60 FPS
