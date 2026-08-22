# Game Visual & World Specification — P0 Canonical

> **Document role:** Single Source of Truth สำหรับภาพและพฤติกรรมของ Phaser Career Hall
> **Version:** 3.0 · 22 August 2026
> **Normative requirements:** `FR-WORLD-014..036`, `AC-31..37`

เอกสารนี้เป็นเจ้าของข้อกำหนดเรื่องมุมมอง, มิติ, grid, scale, booth, props, character, animation, collision และ visual QA ของเกมทั้งหมด ไฟล์อื่นต้องอ้างถึงเอกสารนี้แทนการเขียนกฎชุดเดียวกันซ้ำ

---

## 1. P0 Non-Negotiable Gates

งาน World จะถือว่า Done ได้เมื่อผ่านทุก gate ต่อไปนี้พร้อมกัน:

| Gate | ต้องผ่าน | ไม่ผ่านทันทีเมื่อ |
|---|---|---|
| **G1 — Real rendered elements** | booth, counter, display, kiosk, furniture, plant, player และ NPC เป็น original/licensed pixel sprite หรือ authored tile แยกชิ้น | ใช้ rectangle/ellipse เป็น visual final, bake วัตถุลงภาพพื้น หรือใช้ hotspot ลอยทับภาพแบน |
| **G2 — One top-front camera** | asset ทุกชิ้นใช้ orthographic top-front 3/4, grid, scale, light และ shadow convention เดียวกัน | ผสม isometric, side elevation, front elevation หรือกลับ booth บางแถวคนละทิศ |
| **G3 — Physical game behavior** | entity มี stable ID, pivot, Y-depth, owner-linked collider และ sensor/approach point ที่เดินถึงได้ | actor ทะลุวัตถุ, hitbox เต็ม transparent frame, target อยู่กลางโต๊ะ หรือ depth ผิด |
| **G4 — Directional characters** | player/NPC มี front, back, left profile, right profile จริง และ animation frame ของแต่ละมุม | ใช้ front frame flip/rotate แทนด้านหลังหรือ side profile |
| **G5 — Sims-style customization** | skin, hair, top, bottom, shoes และ accessory แยก layer/สีได้ พร้อม preview/apply/persist | เปลี่ยนเพียง sprite สำเร็จรูปทั้งตัว หรือเสื้อ/กางเกงเปลี่ยนแยกกันไม่ได้ |
| **G6 — Modular booth variety** | booth ใช้ prefab ที่ประกอบจาก facade, counter, screen, sign, queue และ prop variants อย่างน้อย 2–3 แบบต่อหมวด | ทุกบูธเป็น clone ตรงกัน หรือความหลากหลายเกิดจากการ scale/flip จน perspective ผิด |
| **G7 — Functional modes** | World, Navigator, booth detail, local queue, dialogue, Info Hub และ Character Studio ทำ primary action จริง | มี dead control, Canvas-only action หรือ DOM panel เปิดแล้วยังเดินต่อโดยไม่ตั้งใจ |

ลำดับการทำงานที่ถูกต้องคือ `camera/scale → asset silhouette → entity/pivot → collision/depth → interaction → lighting/polish` ห้ามเริ่มจาก glow หรือ HUD แล้วถือว่า scene สมจริง

---

## 2. Master References and IP Boundary

### 2.1 Priority references

1. [`00_MAIN_virtual_job_fair_map.jpg`](../ref_pics/00_MAIN_virtual_job_fair_map.jpg) — ใช้ศึกษา hall readability, aisle, booth density, furniture scale และ wayfinding
2. [`00_MAIN_spritesheet_booths_characters_props.png`](../ref_pics/00_MAIN_spritesheet_booths_characters_props.png) — ใช้ศึกษา sprite vocabulary, top-front silhouette, prop anatomy, character proportion และ grounded shadow
3. ไฟล์ `01..05` ใน [`ref_pics/`](../ref_pics/) — ใช้เป็น secondary references เฉพาะรายละเอียดที่ master references ไม่ตอบ

### 2.2 สิ่งที่นำมาใช้ได้

- หลักการของมุมกล้อง, scale relationship, density และ visual readability
- anatomy ทั่วไปของ booth, counter, kiosk, workstation, chair, queue rail และ planter
- mood ของ convention hall, professional job fair และ readable pixel art

### 2.3 สิ่งที่ห้ามคัดลอก

- map layout, sprite, character, company, logo, sign, palette หรือ object arrangement แบบ one-to-one
- trademark, trade dress, copywriting, sound, proprietary interaction และ source/bundle ของผลิตภัณฑ์อื่น
- reference image ใดๆ เป็น runtime texture โดยตรง

Production asset ต้องเป็นต้นฉบับใหม่และมี provenance ใน [Asset Registry](../07-playbooks-and-operations/demo-fixtures-and-assets.md)

---

## 3. Camera Bible — Realistic Orthographic Top-Front

### 3.1 Definition

**Top-front 3/4** ในโครงการนี้หมายถึงกล้อง orthographic ที่มองลงจากด้านบนและยังเห็นด้านหน้าของวัตถุ:

```text
                TOP / BACK OF SCREEN
                       ↑
             light ↘  │  camera looks down
                      │
       visible top plane + visible front plane
                      │
                       ↓
              FRONT / PLAYER APPROACH
```

- ไม่มี vanishing point และเส้นตั้งไม่บรรจบ
- วัตถุแนวเดียวกันมี scale เท่ากันไม่ว่าตำแหน่งอยู่บนหรือล่างของจอ
- facade/counter/kiosk ทุกชิ้นหันด้านหน้าไปทาง `down-screen`
- booth ทุกแถวใช้ทิศเดียวกัน ห้ามหมุนแถวล่างกลับขึ้นจอ
- actor ที่เดินขึ้นจอเห็นด้านหลัง (`up/back`) และเดินลงจอเห็นด้านหน้า (`down/front`)

### 3.2 Fixed technical rules

| Property | Required value/rule |
|---|---|
| Base grid | `16 × 16 logical px`; major placement snap ที่ `32 px` |
| Character frame | `32 × 48 logical px`; foot baseline ที่แถวล่างสุด |
| Object pivot | center-bottom ของฐานที่สัมผัสพื้น ไม่ใช่ center ของ transparent frame |
| Light | top-left key light สำหรับทุก asset |
| Material shade | ด้านขวาและด้านล่างเข้มกว่าด้านบน/ซ้าย |
| Contact shadow | สั้น, ติดฐาน, ทอดไป down-right; ห้ามลอยออกจากวัตถุ |
| Outline | dark selective outline 1–2 logical px |
| Render | integer scale, `image-rendering: pixelated`, nearest-neighbor |
| Rotation | ห้ามหมุน/flip final prop เพื่อสร้าง variant ถ้าทำให้ light หรือ perspective กลับด้าน |

### 3.3 Dimensional construction by object

| Object | มิติที่ต้องมองเห็น |
|---|---|
| Booth facade | top cap, front panel, side posts, base thickness, sign fixture |
| Counter/desk | top surface, front fascia, side thickness, leg/base, grounded shadow |
| Monitor/kiosk | screen face, casing thickness, stand, base footprint |
| Chair/sofa | seat top, back rest, side/leg structure, contact shadow |
| Plant/planter | canopy volume, trunk/stem, soil/top rim, container front face |
| Queue rail | post top, vertical post, belt/rail, weighted floor base |
| Character | head top plane, face/back/side anatomy, shoulders, torso, arms, separate legs and feet |

Asset ที่ดูดีเมื่อแยกชิ้นแต่ไม่เข้ากับ actor/grid/light เดียวกันยังถือว่าไม่ผ่าน

---

## 4. World Layout and Scene Composition

### 4.1 Current R0 module

- Logical world: `1536 × 1400 px`
- พื้นเป็น plain modular floor เท่านั้น: tile, aisle, booth pad, boundary และ non-interactive decal
- 4 synthetic booths บน BoothPad สองแถว
- vertical main aisle + horizontal cross aisle ที่กว้างพอให้ player/NPC สวนกัน
- Central Info Hub, lounge, support landmark และ arrival area ต้องไม่บังทางเข้าบูธ

R0 target ต้องต่อ module ด้วย streamed/repeating modules หรือ toroidal wrap โดยคง landmark, collision และ navigation continuity ตาม `FR-WORLD-022`; current finite vertical slice ยังไม่ผ่านข้อนี้และห้ามอ้างว่า endless จน runtime ทำจริง

### 4.2 Composition rules

1. วาง gameplay landmark ก่อน decoration
2. เว้น clear path อย่างน้อย `96 logical px` ใน main route และ `64 px` รอบ interaction approach
3. props ต้องรวมเป็น purposeful cluster เช่น lounge, workstation หรือ queue lane ไม่โปรยสุ่มทั่วพื้น
4. ห้ามวาง object silhouette ซ้อนกันจนแยกฐาน/collider ไม่ได้
5. ใช้ negative space เพื่อให้ผู้เล่นเห็นทาง, booth entrance และ destination
6. ไม่มี decorative prop ใดขวาง semantic action หรือ mobile HUD
7. object density ของ zone ข้างเคียงต้องต่างกันเล็กน้อยแต่ยังอยู่ใน grid/scale เดียวกัน

---

## 5. Modular Booth System and Repeatable Variety

Booth เป็น prefab ที่ประกอบจากชิ้นส่วน ไม่ใช่ภาพก้อนเดียว ทุกบริษัทใช้ anatomy หลักร่วมกันเพื่อความเข้าใจง่าย แต่ต้องมี variant เพียงพอให้ไม่ดู copy-paste

### 5.1 Mandatory anatomy

```text
BoothPrefab
├── BoothPad / floor boundary
├── FacadeVariant
├── DynamicSign / company name layer
├── CounterVariant + recruiter position
├── ShowcaseVariant / job-tech display
├── InfoKioskVariant
├── QueueVariant + approach points
├── DecorationKit
├── SolidColliders
└── InteractionSensors
```

### 5.2 Minimum variant library

| Category | Minimum | Suggested variants |
|---|:---:|---|
| Facade | 3 | `portal-frame`, `open-backwall`, `corner-display` |
| Counter | 3 | `straight-reception`, `compact-desk`, `demo-counter` |
| Showcase | 3 | `dual-monitor`, `vertical-job-board`, `product-table` |
| Info kiosk | 2 | `standing-terminal`, `low-accessible-terminal` |
| Queue setup | 3 | `straight-rail`, `short-zigzag`, `floor-marker-only` |
| Decoration kit | 3 | `tech-workstation`, `green-lounge`, `professional-minimal` |
| Seating | 3 | `task-chair`, `two-seat-sofa`, `accessible-open-space` |
| Plants | 3 | `tree-planter`, `low-planter`, `single-pot` |

### 5.3 Repetition rules

- ใช้ variant ซ้ำได้เพื่อควบคุม texture budget แต่ booth ที่ติดกันห้ามใช้ combination เหมือนกันทุกหมวด
- เปลี่ยนความหลากหลายด้วย variant, approved palette, prop cluster และ dynamic sign ไม่ใช่ arbitrary scale/rotation
- ห้าม flip asset ถ้า highlight/shadow หรือข้อความกลับด้าน
- counter, kiosk และ queue approach ต้องอยู่ตำแหน่งที่เดินถึงได้เสมอ
- palette ของบริษัทเปลี่ยนเฉพาะ accent/material token; outline, light และ value range ต้องยังสอดคล้องทั้ง hall
- ใช้ prop ซ้ำแบบมี rhythm เช่นต้นไม้คู่หรือ rail sequence ได้ แต่ต้องไม่สร้าง visual noise หรือ collider maze

### 5.4 Realistic booth behavior

ทุก booth ต้องมี:

- recruiter position ที่อ่านได้และไม่ใช่ NPC ลอยกลางทาง
- active job/showcase display
- queue status และ wait-time ใน Semantic DOM
- info kiosk ที่ใช้ `E`, click และ tap ได้
- visible interaction feedback + sensor แยกจาก solid collider
- Navigator equivalent สำหรับทุก action

---

## 6. Scene Entity, Depth and Physics Contract

### 6.1 Required render layers

| Layer | Content | Physics/depth rule |
|---|---|---|
| `FloorBase` | plain tile/floor | ไม่มี solid collision |
| `FloorDecal` | aisle, pad, wayfinding | ไม่มี interactive object bake-in |
| `CollisionGeometry` | wall/base footprints | invisible, owner-linked static bodies |
| `PropMid` | desk, kiosk, planter, furniture | `depth = footY/baseY` |
| `Actor` | player/NPC/recruiter | foot hitbox, directional state |
| `ForegroundOccluder` | truss/sign/tall canopy | บัง actor เฉพาะเมื่อ actor เดินหลังวัตถุ |
| `LightingFX` | glow/ambient | Reduced Motion equivalent |
| `Semantic DOM` | HUD/panel/dialogue | keyboard/focus accessible; ไม่ทำหน้าที่เป็น world object |

### 6.2 Entity metadata

ทุก rendered entity ต้องมี:

- `entityId`
- `assetId` / texture frame
- `position`, `origin`, `baseY`
- `depthPolicy`
- `collider` หรือ explicit `nonSolid: true`
- `interactionSensor` และ `approachPoint` เมื่อ interactive
- `visible/active/destroy` lifecycle

### 6.3 Collision rules

- actor ใช้ foot hitbox ไม่เกินช่วงรองเท้า/ฐานขา
- collider ของ prop ครอบเฉพาะฐานสัมผัสพื้น ไม่ใช้ full sprite frame
- sensor ใหญ่กว่า collider และไม่ผลัก player
- navigation target ต้องเป็น approach point นอก collider
- actor ต้องเดินหน้า/หลัง object ตาม Y-depth โดยไม่เปลี่ยน scale หลอก perspective

---

## 7. Character System — True Directional Sims-style Customization

### 7.1 Anatomy and frame contract

- Chibi adult proportion `2.5–3 heads tall`; หัวโตพออ่านผม/ใบหน้าแต่ยังดูเป็นผู้ใหญ่ในบริบทงานอาชีพ
- 4 directional rows: `down/front`, `up/back`, `left profile`, `right profile`
- อย่างน้อย 3 frames ต่อทิศ: `idle`, `step-left`, `step-right`
- back view ต้องเห็น hair back, shoulder/back garment, trouser back และ heel
- side view ต้องมี profile forehead/nose/chin, ear, shoulder, arm, torso depth และเท้าซ้อนตามทิศจริง
- left/right สามารถ share authored geometry ผ่าน controlled mirroring ได้เฉพาะเมื่อ light, asymmetric hair/accessory และ clothing detail ถูกแก้กลับให้ถูกต้อง; ห้าม flip front frame

### 7.2 Customization layers

```text
AvatarAppearance
├── body / skinTone (อย่างน้อย 6 โทนธรรมชาติ)
├── face / eye detail
├── hairStyle + hairColor
├── topStyle + topColor
├── bottomStyle + bottomColor
├── shoeStyle + shoeColor
├── accessory / mask / glasses / headset
└── optional badge or bag
```

ขั้นต่ำที่ต้องเลือกได้จริง:

| Layer | Minimum variants | Color behavior |
|---|:---:|---|
| Skin | 6 tones | palette ที่รักษา highlight/shadow ไม่ใช่ flat fill |
| Hair | 5 styles | อย่างน้อย 5 colors |
| Top | 4 styles | เปลี่ยนสีแยกจากกางเกง |
| Bottom | 3 styles: trousers, skirt/straight silhouette, shorts/utility | เปลี่ยนสีแยกจากเสื้อ |
| Shoes | 3 styles | เปลี่ยนสีแยกได้หรือใช้ approved neutral palettes |
| Accessory | 4+ รวม `none` | ต้องมี frame ครบทุกทิศที่รองรับ |

Option ห้ามล็อกตามเพศ ตัวละครทุกคนเลือก skin/hair/top/bottom/shoes/accessory ได้อย่างอิสระ

### 7.3 Layer order by direction

Layer order เปลี่ยนตามทิศเพื่อให้มีมิติ เช่น:

- `down/front`: back hair → body → bottom/shoes → top/arms → front hair → face accessory
- `up/back`: face hidden → front body → top/back seam → back hair/accessory strap
- `left/right`: far arm/leg → torso → near leg/arm → profile head/hair → accessory

ทุก layer ต้องใช้ frame index เดียวกันเพื่อไม่ให้ผม เสื้อ กางเกง หรือรองเท้าเหลื่อมขณะเดิน

### 7.4 Character Studio behavior

- Phaser mini-stage ใช้ compositor/texture เดียวกับ World
- มีปุ่มหน้า, หลัง, ซ้าย, ขวาพร้อม text label
- การเปลี่ยน option อัปเดต preview ภายในหนึ่ง render frame
- Randomize เปลี่ยนทุก layer โดยยังได้ combination ที่ valid
- Save ต้อง apply กับ player ทันทีและ persist ตาม demo/production policy
- Reduced Motion แสดง idle frame โดยยังตรวจครบ 4 ทิศได้

### 7.5 NPC and recruiter rules

- NPC/recruiter ใช้ camera, proportion, baseline และ directional contract เดียวกับ player
- อย่างน้อย 5 role silhouettes และ 12 synthetic NPC ใน R0
- NPC ที่เดินต้องเปลี่ยน direction/frames จริง; NPC ที่ยืนต้องหันเข้าหา booth/task อย่างมีเหตุผล
- ห้ามใช้ภาพ front-facing เดียวให้ NPC ทุกตัวไม่ว่าหันหรือเดินไปทางใด
- diversity ครอบคลุม skin, hair, clothing, mobility representation และ professional roles โดยไม่ใช้ stereotype

---

## 8. Asset Production and Runtime Packaging

### 8.1 Export rules

- PNG RGBA, transparent background สำหรับ object/actor
- ไม่มี baked UI text, company logo หรือ floor หลัง object
- padding คงที่และมี metadata ของ visual bounds/base footprint
- atlas แยก `floor`, `booth`, `props`, `characters`, `fx`
- runtime ห้าม import `docs/ref_pics/`
- generated/third-party asset ทุกไฟล์มี prompt/source/tool/license/checksum/reviewer

### 8.2 Asset review sheet

ทุก variant ต้องส่งพร้อม:

1. isolated asset บน checker background
2. actor scale comparison
3. top-front camera/light check
4. pivot/base/collider overlay
5. in-scene screenshot หน้าและหลัง actor
6. provenance entry

---

## 9. Visual and Interaction QA

### 9.1 Required test scenes

- **Camera lineup:** actor + facade 3 แบบ + counter 3 แบบ + kiosk 2 แบบ + plant 3 แบบอยู่บน baseline/grid เดียว
- **Character turnaround:** customization เดียวกันครบ front/back/left/right และ walk frames
- **Collision lane:** player เดินรอบ counter, kiosk, planter, rail และ lounge ทั้งหน้า/หลัง
- **Booth variety:** 4 booths แสดง combination ไม่ซ้ำทั้งหมดและยังอ่าน anatomy เดียวกัน
- **Responsive overlay:** World ที่ 390 และ 1440 px โดย HUD ไม่บัง destination/interaction

### 9.2 Pass checklist

- [ ] asset ทุกชิ้นอยู่ใน top-front 3/4 และรับแสง top-left
- [ ] ไม่มี primitive placeholder เป็น final visual
- [ ] ไม่มี identical booth combination อยู่ติดกัน
- [ ] character เปลี่ยน front/back/left/right จริง
- [ ] skin, hair, top, bottom, shoes และ accessory เปลี่ยนได้ตาม contract
- [ ] player/NPC มี foot hitbox และ correct Y-depth
- [ ] collider/sensor/approach point ผูก owner ID
- [ ] scene ไม่มี baked booth/person/hotspot architecture
- [ ] Navigator ทำ action สำคัญได้เท่า World
- [ ] Reduced Motion, keyboard และ touch path ผ่าน
- [ ] asset provenance ครบ

Screenshot สวยหนึ่งภาพไม่ถือว่าผ่าน ต้องมี runtime interaction evidence อย่างน้อย desktop และ mobile

---

## 10. Current Implementation Status and Gaps

| Capability | Current R0 status | Required next gap |
|---|---|---|
| Plain floor + entity props | Implemented vertical slice | เพิ่ม variant atlas และ camera lineup QA |
| 4 booth pads | Implemented | เพิ่ม facade/counter/showcase combinations 2–3 แบบต่อหมวด |
| Player direction | 4 directions × 3 frames implemented | เพิ่ม asymmetric layer QA |
| Skin/hair/combined outfit/accessory | Implemented แบบรวม outfit | แยก `top`, `bottom/trousers`, `shoes` และสีของแต่ละ layer ตาม G5 |
| NPC atlas | 12 synthetic NPC implemented | เพิ่ม directional walk/back/side frames ตาม G4 |
| Collision/Y-depth | Implemented vertical slice | เพิ่ม automated collider/depth evidence scene |
| Browser visual QA | Pending browser session | เก็บ 390/1440 screenshots และ interaction evidence |
| Streamed/endless module | Not implemented | ห้ามอ้างว่า endless จนมี wrap/stream + navigation continuity |

ตารางนี้ต้องอัปเดตเมื่อ runtime เปลี่ยน เพื่อแยก target requirement ออกจากสิ่งที่ทำเสร็จจริง
