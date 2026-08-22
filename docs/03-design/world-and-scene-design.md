# Game Visual & World Specification — P0 Canonical

> **Document role:** Single Source of Truth สำหรับภาพและพฤติกรรมของ Phaser Career Hall
> **Version:** 3.0 · 22 August 2026
> **Normative requirements:** `FR-WORLD-014..039`, `AC-31..40`

เอกสารนี้เป็นเจ้าของข้อกำหนดเรื่องมุมมอง, มิติ, grid, scale, booth, props, character, animation, collision และ visual QA ของเกมทั้งหมด ไฟล์อื่นต้องอ้างถึงเอกสารนี้แทนการเขียนกฎชุดเดียวกันซ้ำ

> [!IMPORTANT]
> Current website/world มีหน้าที่ทำให้เห็น product direction เท่านั้น งาน art generation, atlas, map builder, character compositor, NPC และ scene expansion ในอนาคต **MUST** ใช้เอกสารนี้เป็น production contract แม้ current demo asset จะยังไม่ครบ ห้ามยึดข้อจำกัดหรือ shortcut ของ demo เป็นมาตรฐานถาวร

---

## 1. P0 Non-Negotiable Gates

งาน World จะถือว่า Done ได้เมื่อผ่านทุก gate ต่อไปนี้พร้อมกัน:

| Gate | ต้องผ่าน | ไม่ผ่านทันทีเมื่อ |
|---|---|---|
| **G1 — Real rendered elements** | booth, counter, display, kiosk, furniture, plant, player และ NPC เป็น original/licensed transparent pixel sprite หรือ authored tile แยกชิ้น | ใช้ rectangle/ellipse เป็น visual final, bake วัตถุลงภาพพื้น หรือใช้ hotspot ลอยทับภาพแบน |
| **G2 — One top-front camera** | asset ทุกชิ้นใช้ orthographic top-front 3/4, grid, scale และ material-light convention เดียวกัน | ผสม isometric, side elevation, front elevation หรือกลับ booth บางแถวคนละทิศ |
| **G3 — Physical game behavior** | entity มี stable ID, pivot, Y-depth, owner-linked collider และ sensor/approach point ที่เดินถึงได้ | actor ทะลุวัตถุ, hitbox เต็ม transparent frame, target อยู่กลางโต๊ะ หรือ depth ผิด |
| **G4 — Directional characters** | player/NPC มี front, back, left profile, right profile จริง และ animation frame ของแต่ละมุม | ใช้ front frame flip/rotate แทนด้านหลังหรือ side profile |
| **G5 — Sims-style customization** | skin, hair, top, bottom, shoes และ accessory แยก layer/สีได้ พร้อม preview/apply/persist | เปลี่ยนเพียง sprite สำเร็จรูปทั้งตัว หรือเสื้อ/กางเกงเปลี่ยนแยกกันไม่ได้ |
| **G6 — Modular booth variety** | booth ใช้ prefab ที่ประกอบจาก facade, counter, screen, sign, queue และ prop variants ครบจำนวนขั้นต่ำตาม 8.5 | ทุกบูธเป็น clone ตรงกัน หรือความหลากหลายเกิดจากการ scale/flip/recolor อย่างเดียวจน perspective ผิด |
| **G7 — Functional modes** | World, Navigator, booth detail, local queue, dialogue, Info Hub และ Character Studio ทำ primary action จริง | มี dead control, Canvas-only action หรือ DOM panel เปิดแล้วยังเดินต่อโดยไม่ตั้งใจ |
| **G8 — Runtime shadows + shared actors** | source texture ไม่มีเงาพื้น; Phaser render shadow แยก และ NPC compose จาก part library เดียวกับ player | มี baked contact/cast shadow หรือ NPC ใช้ prebuilt full-body atlas คนละระบบ |
| **G9 — Complete reusable orientation kit** | actor/layer และ directional prop มี authored orientation ครบ; floor/aisle/wall ใช้ autotile kit ที่ต่อฉากใหม่ได้ | มีเพียงมุมเดียวแล้ว rotate/flip หลอก, bake ห้องทั้งห้อง หรือขาด corner/junction/end tile |
| **G10 — Recolorable composition sources** | asset แยกชิ้น, transparent, palette-slot based, anchor-compatible และจัดเรียงใหม่ได้โดยไม่ redraw | สี/โลโก้/เงา/พื้น/วัตถุข้างเคียง bake รวมกัน หรือใช้ global hue shift ทำลาย material/skin ramp |

ลำดับการทำงานที่ถูกต้องคือ `camera/scale → asset silhouette → entity/pivot → collision/depth → interaction → lighting/polish` ห้ามเริ่มจาก glow หรือ HUD แล้วถือว่า scene สมจริง

---

## 2. Master References and IP Boundary

### 2.1 Priority references

1. [`00_MAIN_virtual_job_fair_map.jpg`](../ref_pics/00_MAIN_virtual_job_fair_map.jpg) — ใช้ศึกษา hall readability, aisle, booth density, furniture scale และ wayfinding
2. [`00_MAIN_spritesheet_booths_characters_props.png`](../ref_pics/00_MAIN_spritesheet_booths_characters_props.png) — ใช้ศึกษา sprite vocabulary, top-front silhouette, prop anatomy, character proportion และฐานสัมผัสพื้น; เงาใน reference เป็น observation เท่านั้นและห้าม bake ลง asset ใหม่
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
| Runtime shadow | Phaser สร้างแยกจาก texture, ยึด center-bottom/base footprint และไม่มี collider; source PNG ห้ามมี floor/contact/cast shadow |
| Outline | dark selective outline 1–2 logical px |
| Render | integer scale, `image-rendering: pixelated`, nearest-neighbor |
| Rotation | ห้ามหมุน/flip final prop เพื่อสร้าง variant ถ้าทำให้ light หรือ perspective กลับด้าน |

### 3.3 Dimensional construction by object

| Object | มิติที่ต้องมองเห็น |
|---|---|
| Booth facade | top cap, front panel, side posts, base thickness, sign fixture |
| Counter/desk | top surface, front fascia, side thickness, leg/base และฐานวางที่อ่านได้ |
| Monitor/kiosk | screen face, casing thickness, stand, base footprint |
| Chair/sofa | seat top, back rest, side/leg structure และฐานขาที่อ่านได้ |
| Plant/planter | canopy volume, trunk/stem, soil/top rim, container front face |
| Queue rail | post top, vertical post, belt/rail, weighted floor base |
| Character | head top plane, face/back/side anatomy, shoulders, torso, arms, separate legs and feet |

Asset ที่ดูดีเมื่อแยกชิ้นแต่ไม่เข้ากับ actor/grid/light เดียวกันยังถือว่าไม่ผ่าน

### 3.4 Canonical direction and orientation vocabulary

ห้ามใช้คำว่า `front/side/back` ลอยๆ ใน prompt หรือ metadata ทุก asset ใช้ชื่อทิศต่อไปนี้:

| ID | Actor reading | Object facing | Screen movement |
|---|---|---|---|
| `south/top-front` | เห็นหน้า + ด้านบนศีรษะ/ไหล่ | ด้านใช้งาน/ด้านหน้าหันลงจอ | ลง |
| `north/top-behind` | เห็นหลัง + ด้านบนศีรษะ/ไหล่ | ด้านหลังหันลงจอ | ขึ้น |
| `west/top-left-side` | profile ซ้ายและ top plane | ด้านใช้งานหันซ้าย | ซ้าย |
| `east/top-right-side` | profile ขวาและ top plane | ด้านใช้งานหันขวา | ขวา |

กฎ coverage:

- actor และ avatar layer ทุกชิ้นต้องมีทั้ง 4 directions และทุก animation frame ที่ layer นั้นสัมผัส
- prop ที่มีด้านใช้งาน เช่น chair, desk, counter, kiosk, monitor, sign, door, queue gate และ booth module ต้องมี authored `north/east/south/west`
- prop ที่สมมาตรรอบแกนจริง เช่น round stool หรือ round planter ใช้ orientation เดียวได้เมื่อ metadata ระบุ `orientationPolicy: radial-symmetric` และ reviewer ยืนยันว่าไม่มี front, text, cable, control หรือ asymmetric highlight
- left/right reuse ด้วย mirroring ทำได้เฉพาะ source ที่สมมาตรและต้องแก้ material highlight, text, cable, pocket, hair part และ accessory กลับให้ถูก; runtime ห้าม flip เพื่อทดแทน asset ที่ยังไม่วาด
- default R0 hall อาจวาง booth front ไปทาง south เพื่อความอ่านง่าย แต่ source library ต้องเก็บ orientation อื่นสำหรับ map layout ในอนาคต

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

### 4.3 Floor, aisle, road and wall tile system

พื้นไม่ใช่ภาพห้องสำเร็จรูป ต้องสร้างจาก tile families ที่ประกอบซ้ำได้:

| Family | Minimum reusable coverage | Collision |
|---|---|---|
| Hall floor | center, 4 edges, 4 outer corners, 4 inner corners, 2–3 material variations | none |
| Main aisle / road | horizontal, vertical, 4 turns, 4 T-junctions, cross, 4 endpoints, isolated tile, border/curb set | none; navigation metadata separate |
| Booth pad | center, 4 edges, 4 outer/inner corners, entrance transition, accent variants | none |
| Carpet/material transition | A→B edges 4 directions, inner/outer corners, diagonal-safe transition | none |
| Solid wall | horizontal/vertical straight, 4 outer corners, 4 inner corners, 4 T-junctions, cross, 4 end caps | owner-linked static body |
| Wall opening | door/open frame 4 orientations, glass opening, wide booth opening, accessible opening | collider split around opening |
| Wall structure | pillar, wall-post join, glass panel, low divider, railing, foreground top cap | ตาม footprint |
| Floor decal | directional marker, queue marker, zone boundary, accessibility route | none; semantic label separate |

ใช้ Wang/terrain metadata หรือ equivalent autotile rule; minimal visual set ต้องครอบคลุม topology ทั้งหมดข้างต้น แม้ atlas จะ normalize เป็น 47-tile blob set หรือ rule-based alternative ก็ตาม

- floor/road/wall tile ไม่มีคน, furniture, logo, text, shadow หรือ interactive hotspot bake อยู่ในภาพ
- dirt/wear/noise เป็น optional overlay variant แยก ไม่ bake pattern เดียวซ้ำจนเห็น tiling ชัด
- wall มี top cap + front/side face ตาม orientation เดียวกับ Camera Bible
- collision, navigation cost, zone ID และ material ID เป็น metadata ไม่อาศัยการอ่านสี pixel
- road/aisle สามารถ recolor ผ่าน semantic palette slots โดยรักษา border/value contrast

### 4.4 Booth partition wall and doorway kit

บูธที่ติดกันโดยไม่มีทางเดินคั่นต้องแยกพื้นที่ด้วย `BoothPartitionPrefab` ที่ประกอบจากชิ้นส่วนจริง ห้ามใช้เส้น CSS, rectangle ลอย หรือวาดผนังรวมลงพื้น:

```text
BoothPartitionPrefab
├── wall-left-end / left return
├── wall-center × N / repeatable middle span
├── wall-right-end / right return
├── inner-corner / outer-corner / T-join / cross-join
├── wall-post / column / cap
├── closed-panel / glass-panel / low-divider variants
├── door-left / door-center / door-right
├── open-entry / wide-accessible-entry
├── foreground-top-cap / side occluder
└── collider segments + doorway navigation portal
```

- ชุดขั้นต่ำต้องประกอบได้ทั้งผนังตรง `left + center×N + right`, ผนังเปิดด้านเดียว, รูปตัว L, รูปตัว U และผนังร่วมระหว่างบูธติดกัน
- ประตูและช่องเปิดต้องเลือกตำแหน่งซ้าย/กลาง/ขวาได้ ประตูมาตรฐานกว้างอย่างน้อย `64 logical px`; accessible/wide opening กว้างอย่างน้อย `96 px`
- collider แยกเป็น segments ซ้าย/ขวาของช่องเปิด ห้ามสร้าง collider ยาวชิ้นเดียวพาดผ่านประตู
- wall ownership ใช้ stable `partitionId`; ผนังร่วมอ้าง booth owners ทั้งสองฝั่งและห้าม instantiate collider ซ้อน
- top cap และ side face ต้องอ่านเป็น top-front 3/4; ส่วนสูงที่บัง actor แยกเข้า `ForegroundOccluder` เพื่อให้เดินหน้า/หลังผนังได้
- glass, solid, fabric/acoustic, low divider และ rail เป็น material/silhouette variants; การเปลี่ยนสีเพียงอย่างเดียวไม่นับเป็น variant ใหม่
- dynamic booth sign, company accent และ directional signage เป็น child layer ไม่ bake เข้า wall texture
- ทางเดินระหว่างผนัง, ประตูและ booth approach ต้องต่อกับ aisle/navigation graph โดยไม่มี dead end ที่มองไม่เห็น
- scene decoration รอบ partition ต้องมีหลายกลุ่ม เช่น planter, bench, waste/recycle station, brochure stand, cable cover, floor marker, light post และ accessibility clear-space marker แต่ต้องไม่ปิดช่องเปิดหรือทำ collider maze

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
| Facade | 4 | `portal-frame`, `open-backwall`, `corner-display`, `light-truss` |
| Counter | 4 | `straight-reception`, `compact-desk`, `demo-counter`, `accessible-low-counter` |
| Showcase | 4 | `dual-monitor`, `vertical-job-board`, `product-table`, `interactive-wall` |
| Info kiosk | 3 | `standing-terminal`, `low-accessible-terminal`, `dual-sided-terminal` |
| Queue setup | 4 | `straight-rail`, `short-zigzag`, `floor-marker-only`, `open-accessible-lane` |
| Decoration kit | 6 | ดู minimum environment catalog ใน 8.5 |
| Seating | 3 | `task-chair`, `two-seat-sofa`, `accessible-open-space` |
| Plants | 6 | silhouette/material variants; colorway ไม่นับเพิ่ม |

### 5.3 Repetition rules

- ใช้ variant ซ้ำได้เพื่อควบคุม texture budget แต่ booth ที่ติดกันห้ามใช้ combination เหมือนกันทุกหมวด
- เปลี่ยนความหลากหลายด้วย variant, approved palette, prop cluster และ dynamic sign ไม่ใช่ arbitrary scale/rotation
- ห้าม flip asset ถ้า material highlight, asymmetric detail หรือข้อความกลับด้าน
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

### 5.5 Orientation coverage for reusable scenery

| Asset class | Required authored views | Notes |
|---|---|---|
| Booth facade/backwall | N/E/S/W | sign/socket เป็น child layers; ไม่มี company color bake |
| Counter/reception desk | N/E/S/W | work side และ visitor side ต้องอ่านต่างกัน |
| Work desk/table | N/E/S/W | monitor/cable/seat เป็น child props ไม่ bake รวมถ้าเคลื่อนย้ายได้ |
| Chair/sofa | N/E/S/W | seat/back/arm orientation และ approach footprint ถูกต้อง |
| Kiosk/display/monitor | N/E/S/W | screen content เป็น dynamic layer |
| Queue rail/gate | horizontal + vertical + corner/end/T modules | belt color และ floor marker แยก layer |
| Sign/wayfinding | N/E/S/W | text/logo เป็น DOM/dynamic texture ไม่ bake |
| Plant/decor | 2–4 silhouette variants; 1 orientation เฉพาะ radial-symmetric | pot/material palette แยกจาก foliage palette |
| Door/glass/wall module | topology set ตาม 4.3 | foreground cap แยกเมื่อ actor ต้องเดินหลัง |

Asset ที่แสดงหลายวัตถุใน source sheet ยังต้องถูกตัดเป็น entity แยกก่อนเข้า runtime การรวม desk+monitor+chair เป็นก้อนเดียวทำได้เฉพาะ prefab assembly metadata ไม่ใช่ bake texture ก้อนเดียว

---

## 6. Scene Entity, Depth and Physics Contract

### 6.1 Required render layers

| Layer | Content | Physics/depth rule |
|---|---|---|
| `FloorBase` | plain tile/floor | ไม่มี solid collision |
| `FloorDecal` | aisle, pad, wayfinding | ไม่มี interactive object bake-in |
| `RuntimeShadow` | shadow sprite/ellipse ของ entity | owner-linked, no collider, อยู่ใต้ owner และไม่ bake ใน texture |
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

### 6.4 Runtime shadow contract

- Phaser สร้าง `ShadowEntity` แยกจาก owner ด้วย generated texture, ellipse หรือ approved soft pixel mask
- metadata ขั้นต่ำคือ `shadowId`, `ownerId`, `baseOffset`, `width`, `height`, `alpha`, `depthOffset` และ `visible`
- shadow ใช้ origin center, วางที่ base/footprint และ `depth = owner.baseY - 1`; ไม่มี collider, sensor หรือ interaction
- player/NPC shadow ปรับ width/alpha เล็กน้อยตาม idle/step/jump state โดยไม่ทำให้ดูเหมือนลอย
- prop shadow ใช้ footprint ของ collider เป็นจุดเริ่ม ไม่ใช้ขนาด transparent frame
- light direction สามารถมี down-right bias เล็กน้อย แต่ห้ามซ้ำกับเงาที่ bake ใน source
- Reduced Motion หยุด shadow animation แต่ยังคง static grounding cue
- debug toggle ต้องปิด shadow layer ได้ทั้งหมดเพื่อพิสูจน์ว่า texture ไม่มีเงาพื้นติดมา

---

## 7. Character System — True Directional Sims-style Customization

### 7.1 Anatomy and frame contract

- Chibi adult proportion `2.5–3 heads tall`; หัวโตพออ่านผม/ใบหน้าแต่ยังดูเป็นผู้ใหญ่ในบริบทงานอาชีพ
- 4 directional rows: `down/top-front`, `up/top-behind`, `left/top-left-side`, `right/top-right-side`
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

- NPC/recruiter ใช้ base body, skin palette, hair, top, bottom, shoes, accessory, camera, proportion, baseline และ directional compositor contract เดียวกับ player
- อย่างน้อย 5 role silhouettes และ 12 synthetic NPC ใน R0
- NPC configuration สุ่มแบบ seeded จาก allowed option IDs; seed เดิมต้อง reproduce NPC เดิมเพื่อ QA/reconnect
- role สามารถกำหนด allowed wardrobe set แต่ห้าม bake role เป็น full-body sprite และห้ามล็อก skin/hair ตามเพศหรืออาชีพ
- NPC ที่เดินต้องเปลี่ยน direction/frames จริง; NPC ที่ยืนต้องหันเข้าหา booth/task อย่างมีเหตุผล
- atlas NPC สำเร็จรูป v1 เป็น legacy compatibility asset เท่านั้น เป้าหมาย final ต้อง compose จาก part library; ห้ามใช้ภาพ front-facing เดียวให้ NPC ทุกตัวไม่ว่าหันหรือเดินไปทางใด
- diversity ครอบคลุม skin, hair, clothing, mobility representation และ professional roles โดยไม่ใช้ stereotype

### 7.6 Character generation completeness matrix

คำว่า “มีครบทุกด้าน” สำหรับ character หมายถึง Cartesian coverage ไม่ใช่เพียงมีภาพ turnaround ตัวอย่าง:

```text
required frames = directions × motion frames × compatible layers × variants
directions       = south/top-front, north/top-behind,
                   west/top-left-side, east/top-right-side
motion frames    = idle, step-left, step-right
layers           = body/skin, face, back-hair, bottom, shoes,
                   top/arms, front-hair, accessory, optional bag/badge
```

| Layer | Must contain | Must not contain |
|---|---|---|
| Base/body | 4 directions × 3 frames, body mask, face/ear/hand anchors, 6-tone palette map | hair, wardrobe, shoes, accessory, ground shadow |
| Hair | 5+ styles × 4 directions × compatible motion registration; back/front segments เมื่อจำเป็น | head/face/skin, baked hair color only |
| Top | 4+ styles × 4 directions × 3 frames; sleeve/arm occlusion data | skin/hands, bottom, badge/logo bake |
| Bottom | 3+ styles × 4 directions × 3 frames; leg occlusion data | torso, shoes, ground shadow |
| Shoes | 3+ styles × 4 directions × 3 frames; foot baseline metadata | leg/body, ground shadow |
| Face/accessory | 4 directions และ motion registration; explicit supported-direction mask | baked face/head/body |
| Bag/badge/headset | strap/body split เมื่อ layer order เปลี่ยนตามทิศ | job/company text/logo bake |

Generation source สามารถเริ่มด้วย idle turnaround เพื่อกำหนดทรง แต่จะผ่าน runtime admission ต่อเมื่อ authored/adjusted ครบ 3 motion frames และ registration test ทุก combination ไม่มี seam, gap หรือส่วนร่างกายโผล่ผิดชั้น

Skin/hair/cloth/shoe recolor ต้องใช้ semantic palette ramps ไม่ใช้ global hue rotation:

- `outline`
- `highlight`
- `base`
- `shade-1`
- `shade-2` เมื่อ material ต้องการ

สีผิวใช้ approved skin ramps แยกจาก cloth palette และต้องรักษาความต่างของใบหน้า/มือทุกทิศ

---

## 8. Asset Production and Runtime Packaging

### 8.1 Export rules

- PNG RGBA พร้อม alpha จริงสำหรับ object/actor; checkerboard ที่ถูก bake เป็น RGB ถือว่าไม่ผ่าน
- ไม่มี baked UI text, company logo, floor, contact shadow หรือ cast shadow หลัง object
- padding คงที่และมี metadata ของ visual bounds/base footprint
- generated source sheet ต้องถูก crop, background/alpha inspect, register กับ anchor, normalize cell, quantize และ review ก่อน pack เป็น runtime atlas
- atlas แยก `floor`, `booth`, `props`, `avatar-base`, `avatar-hair`, `avatar-top`, `avatar-bottom`, `avatar-shoes`, `avatar-accessory`, `shadows`, `fx`
- runtime ห้าม import `docs/ref_pics/`
- generated/third-party asset ทุกไฟล์มี prompt/source/tool/license/checksum/reviewer

### 8.2 Asset review sheet

ทุก variant ต้องส่งพร้อม:

1. isolated asset บน checker background
2. actor scale comparison
3. top-front camera/light check
4. pivot/base/collider overlay
5. alpha inspection และ screenshot เมื่อปิด `RuntimeShadow`
6. in-scene screenshot หน้าและหลัง actor
7. provenance entry

### 8.3 Mandatory generation brief contract

Prompt/brief สำหรับ object, character layer หรือ tile ทุกชุดต้องระบุครบ:

```text
Asset family and intended runtime role:
Logical grid/frame size:
Camera: orthographic top-front 3/4
Required directions/orientations:
Required animation frames/topology tiles:
Exact variants and minimum count:
Layer ownership and occlusion order:
Anchor/pivot/base footprint:
Semantic palette slots/material IDs:
Alpha: genuine RGBA
Shadow: none in source; Phaser runtime only
Forbidden baked content: floor, neighbor object, logo, text, glow, collider/debug art
Reference files and principles extracted:
Items explicitly not copied:
Normalization/QA owner:
```

หาก brief ไม่ระบุ direction/topology/layer/palette/shadow ให้ครบ ห้ามเริ่ม generation เพราะภาพที่สวยแต่ประกอบซ้ำไม่ได้ถือว่าไม่ตรง requirement

### 8.4 Reuse, recolor and assembly contract

- หนึ่งไฟล์ runtime frame เป็นหนึ่ง visual part หรือหนึ่ง non-separable prop เท่านั้น
- สิ่งที่ต้องเปลี่ยนบริษัท/สี/ข้อความได้ เช่น sign, logo plate, screen content, accent panel และ queue status เป็น child layer
- ใช้ `assetId + variantId + orientation + frame + paletteId` ระบุ frame ห้ามอ้างด้วย pixel coordinate กระจัดกระจายใน scene code
- metadata ต้องมี `origin`, `anchors`, `visualBounds`, `baseFootprint`, `orientationPolicy`, `paletteSlots`, `occlusionParts` และ `shadowProfileId`
- prefab เป็น data assembly จึงย้าย/สลับ/สุ่มชิ้นส่วนได้โดยไม่ redraw texture
- source asset ทุกชิ้นต้องวางเดี่ยวบน transparent canvas; ห้าม bake floor, wall, prop ข้างเคียง, company theme หรือ shadow เข้าไปเพื่อให้ภาพ preview ดูสวย
- recolor เปลี่ยนเฉพาะ semantic slot และ value ramp; outline/skin/screen emission/material highlight ไม่ถูก tint รวมกันโดยไม่ตั้งใจ

### 8.5 Minimum environment variety catalog

จำนวนขั้นต่ำของ production library ไม่รวม orientation frames:

| Category | Minimum variants |
|---|:---:|
| Booth facade/backwall | 4 |
| Counter/reception | 4 |
| Showcase/workstation | 4 |
| Kiosk/display terminal | 3 |
| Desk/table | 4 |
| Task chair | 4 |
| Lounge seating | 3 |
| Queue rail/gate kit | 4 visual families + topology modules |
| Plant/planter | 6 |
| Sign/wayfinding frame | 4 |
| Tech props | 6 |
| Utility/support props | 4 |
| Accessibility props/clear-space markers | 3 |
| Ambient decor kits | 6 |
| Floor material families | 4 |
| Wall material families | 3 |

Variant ต้องต่างที่ silhouette/anatomy/material ไม่ใช่เปลี่ยนสีอย่างเดียว การเปลี่ยน palette นับเป็น colorway ไม่ใช่ variant ใหม่

---

## 9. Visual and Interaction QA

### 9.1 Required test scenes

- **Camera lineup:** actor + facade 4 แบบ + counter 4 แบบ + kiosk 3 แบบ + plant 6 แบบอยู่บน baseline/grid เดียว
- **Character turnaround:** customization เดียวกันครบ front/back/left/right และ walk frames
- **Character combinatorial lineup:** อย่างน้อย 12 combinations ครอบคลุมทุก layer, direction, motion frame และ palette family
- **Object turntable:** directional prop อย่างละ N/E/S/W พร้อม pivot/base footprint เทียบกัน
- **Autotile maze:** floor/aisle/wall แสดง straight, turn, inner/outer corner, T, cross, end และ opening ครบโดยไม่มี seam
- **Collision lane:** player เดินรอบ counter, kiosk, planter, rail และ lounge ทั้งหน้า/หลัง
- **Booth variety:** 4 booths แสดง combination ไม่ซ้ำทั้งหมดและยังอ่าน anatomy เดียวกัน
- **Responsive overlay:** World ที่ 390 และ 1440 px โดย HUD ไม่บัง destination/interaction

### 9.2 Pass checklist

- [ ] asset ทุกชิ้นอยู่ใน top-front 3/4 และรับแสง top-left
- [ ] directional character/layer ครบ 4 directions × 3 frames; directional prop ครบ N/E/S/W
- [ ] floor/aisle/wall autotile ครบ edge/corner/junction/end/opening และต่อโดยไม่มี seam
- [ ] palette slot แยก skin/hair/top/bottom/shoes/material/accent และ recolor ไม่ทำลาย value ramp
- [ ] prefab rearrange/recolor ได้โดยไม่มี floor, neighbor, text, logo หรือ shadow bake รวมใน part
- [ ] source object/actor เป็น RGBA จริงและไม่มี baked floor/contact/cast shadow
- [ ] ปิด `RuntimeShadow` แล้วเงาพื้นหายทั้งหมดโดย sprite ไม่เปลี่ยน
- [ ] ไม่มี primitive placeholder เป็น final visual
- [ ] ไม่มี identical booth combination อยู่ติดกัน
- [ ] character เปลี่ยน front/back/left/right จริง
- [ ] skin, hair, top, bottom, shoes และ accessory เปลี่ยนได้ตาม contract
- [ ] NPC seed สร้าง configuration ซ้ำได้และใช้ compositor/layer library เดียวกับ player
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
| No-shadow environment source v2 | Generated RGBA source sheet | crop/register/normalize/pack ก่อน runtime; ยังไม่ใช่ approved atlas |
| All-angle environment coverage | Not complete | source v2 ส่วนใหญ่มี canonical south view เท่านั้น; ต้อง author N/E/S/W ตาม 3.4/5.5 |
| Floor/aisle/wall autotiles | Partial floor atlas only | เพิ่ม road topology, transitions, walls, corners, junctions, openings และ material variants ตาม 4.3 |
| 4 booth pads | Implemented | ขยาย production library ให้ครบ facade 4, counter 4, showcase 4, kiosk 3 และหมวดอื่นตาม 5.2/8.5 |
| Player direction | 4 directions × 3 frames implemented | เพิ่ม asymmetric layer QA |
| Layered avatar compositor | Implemented as Phaser Dynamic Texture: skin/hair/top/bottom/shoes/accessory แยก style/color และ migrate local legacy outfit ได้ | normalize generated source atlases, add palette-mask evidence และ exhaustive combination QA |
| Modular avatar source v2 | Base 4×3, hair 5×4, top 4×4, lower/shoes/accessory 10×4 generated as RGBA source sheets | normalize anchors, author per-step overlays, palette map และ pack compositor atlases |
| NPC actors | 12 synthetic NPC ใช้ seeded `AvatarAppearance` + shared player compositor; legacy full-body atlas ไม่ถูกโหลดใน current World | เพิ่ม directional movement schedules และ seed/combination browser evidence |
| Runtime shadow layer | Implemented owner-linked layer สำหรับ player, NPC, partition และหลัก props | เพิ่ม state-responsive shadow profile และ debug toggle ตาม 6.4 |
| Booth partition compositor | continuous L-corner/side-return ใช้ left/center/right, glass, door-left/center/right และ wide-opening พร้อม segmented colliders; A1/A2 วางติดกันและใช้ shared wall/collider ชุดเดียวที่มี ownerIds สองบูธ | เพิ่ม low-divider/material variants และ Chrome runtime doorway traversal/collider screenshot evidence |
| Collision/Y-depth | Implemented vertical slice | เพิ่ม automated collider/depth evidence scene |
| Browser visual QA | Pending browser session | เก็บ 390/1440 screenshots และ interaction evidence |
| Streamed/endless module | Not implemented | ห้ามอ้างว่า endless จนมี wrap/stream + navigation continuity |

ตารางนี้ต้องอัปเดตเมื่อ runtime เปลี่ยน เพื่อแยก target requirement ออกจากสิ่งที่ทำเสร็จจริง
