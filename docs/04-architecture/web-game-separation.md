# Web–Game Separation & Phaser 4 Direction

> **Status:** Implemented boundary · R0 Vertical Slice 1 · 22 August 2026
> **Implementation:** `apps/web`, `apps/game`, `packages/contracts`, `packages/domain`, `packages/assets`

## 1. Intent

MaskedMatch จะใช้แนวคิดของ [Hideout](https://gethideout.app/) และ [Gather](https://www.gather.town/features) เป็น **experience reference**: ผู้ใช้เห็นพื้นที่ร่วมกัน เดินสำรวจ พบคน/บูธตามบริบท และเริ่ม interaction ได้จากตำแหน่งในโลก แต่ผลิตภัณฑ์จะไม่ clone layout, artwork, copywriting หรือ proprietary behavior ของบริการเหล่านั้น

ทิศทางภาพของ MaskedMatch เป็น 8-bit/pixel art ของตนเอง โดยใช้ภาพใน [`docs/ref_pics/`](../ref_pics/) เพื่ออ้างอิง composition, palette, sprite scale, booth density และบรรยากาศเท่านั้น ไฟล์เหล่านี้ไม่ใช่ production asset และห้ามถูก import เข้า runtime โดยอัตโนมัติ

## 2. Engine Decision

เลือกและ pin **Phaser 4.2.1** สำหรับ Career Hall runtime ใน R0

เหตุผล:

- เหมาะกับ 2D top-down world, sprite animation, tilemap, camera, input และ collision ซึ่งเป็นแกนของ Career Hall
- Phaser 4 เป็น stable release line และ R0 pin exact version ที่ `4.2.1`; ห้ามใช้ floating range ใน Game workspace
- แยก game simulation ออกจาก product UI ได้ชัดเจน โดย React ไม่ต้องเป็น owner ของ game loop

ข้อควรระวัง:

- ตรวจสอบ public production payload และ Console banner เมื่อ 22 August 2026 แล้ว พบว่า Hideout ใช้ **Phaser 4.1.0 (WebGL/Web Audio)** จริง หลักฐานนี้ยืนยันความเป็นไปได้ของแนวทาง แต่การเลือก engine/version ของเรายังต้องยืนด้วย requirement และ spike ของ MaskedMatch เอง
- plugin/ตัวอย่างบางส่วนอาจยังไม่รองรับ Phaser 4 หรือยังอิง API รุ่นก่อน จึงต้องผ่าน compatibility gate ก่อนเพิ่มหรืออัปเกรด dependency
- ห้ามคัดลอก version `4.1.0` หรือ pin `latest` แบบลอยตัวโดยอัตโนมัติ; ต้องเลือก exact stable version ณ วันเริ่ม implementation และบันทึก migration policy

Primary references: [Phaser releases](https://github.com/phaserjs/phaser/releases), [Phaser API documentation](https://docs.phaser.io/api-documentation/namespace/phaser), [Gather spatial audio/video](https://support.gather.town/articles/4624155403-overview-of-spatial-audio-video)

## 3. Implemented Repository Boundary

โครงสร้าง implementation ปัจจุบันแยกเป็นคนละ workspace:

```text
apps/
├── site/                   # Optional lightweight public/marketing site
├── web/                    # React product shell; routes, forms, task UI, a11y
└── game/                   # Phaser 4 Career Hall runtime; no product forms/routes
packages/
├── contracts/              # Typed commands/events ระหว่าง Web กับ Game
├── domain/                 # Shared domain types/rules ที่ไม่ผูกกับ renderer
└── assets/                 # Approved runtime assets + manifests
    ├── game/               # Atlases, tilemaps, sprites, ambient audio
    └── media/              # Approved masks/overlays for Website media engine
docs/
└── ref_pics/               # Visual references only; never a runtime dependency
```

แต่ละ workspace ต้องมี dependency graph, build, tests และ performance budget ของตนเอง Game ห้าม import React UI และ Web ห้ามแก้ Phaser scene internals โดยตรง

## 4. Ownership Matrix

| Concern | Website (`apps/web`) | Game (`apps/game`) |
|---|---|---|
| Route, auth, consent, resume, queue, interview, recruiter/admin | Owner | ไม่เป็น owner |
| Semantic Navigator และ accessibility equivalent | Owner | ส่ง interaction metadata ให้ Web |
| World loop, tilemap, collision, actor movement, camera, depth | แสดง host surface | Owner |
| Booth detail, modal, form, live region, error recovery | Owner | ส่ง event เท่านั้น |
| Proximity/zone detection และ interactive object sensor | รับ event | Owner |
| Network/domain state | เรียก API และ normalize state | รับ snapshot/command ที่จำเป็นเท่านั้น |
| Runtime pixel asset | ไม่แก้ atlas โดยตรง | Owner ผ่าน `packages/assets/game` |

## 5. Integration Contract

Web เริ่ม/หยุด Game ผ่าน adapter ที่มี version และ typed contract; ห้ามเรียก Scene object จาก component โดยตรง

**Web → Game commands**

- `bootWorld({ eventId, player, accessibilityPrefs })`
- `setWorldSnapshot(snapshot)`
- `navigateTo({ targetId })`
- `setInputEnabled({ enabled })`
- `setAvatarAppearance({ appearance })`
- `suspendWorld()` / `destroyWorld()`

**Game → Web events**

- `worldReady`
- `boothSelected({ boothId })`
- `interactionRequested({ objectId, action })`
- `zoneEntered({ zoneId })` / `zoneExited({ zoneId })`
- `navigationCompleted({ targetId })`
- `avatarAppearanceApplied({ appearance })`
- `runtimeError({ code, recoverable })`

### Native scene ownership (mandatory)

`apps/game` ต้องสร้าง plain floor และ runtime entities ด้วย Phaser 4 โดยตรง: `Layer` แยก background/runtime-shadow/structure/actors/foreground/lighting, `Container` สำหรับ prefab ที่ประกอบหลายชิ้น, Arcade static/dynamic bodies บนวัตถุจริง และ `DynamicTexture` สำหรับ shared player/NPC compositor. Object/actor source ไม่มี baked shadow; Phaser สร้าง owner-linked shadow แยก Website รับเฉพาะ typed event และห้ามเป็นเจ้าของ visual object ในโลกเกม การโหลดภาพ hall สำเร็จรูปที่มี booth/คน/prop แล้วใช้ DOM/CSS/transparent hotspot ทับ ถือว่าละเมิด boundary นี้

Implementation note (22 August 2026): ตรวจ Phaser official API ผ่าน Context7 MCP ก่อนลงมือ โดยยืนยันการใช้ `setInteractive()` กับ Game Object/Container, `Layer` สำหรับจัดกลุ่ม scene graph, Arcade `collide`/`overlap` และ static body สำหรับ geometry/sensor รวมถึง `textures.addDynamicTexture()`, `DynamicTexture.draw()` และ `Texture.setFilter(NEAREST)` สำหรับ avatar compositor. MCP เป็นแหล่งตรวจ API ระหว่างพัฒนา ไม่ถูก bundle เป็น production dependency

Contract payload ต้องเป็น serializable data, มี version และไม่มี DOM node, Phaser object, token, PII ที่ไม่จำเป็น หรือ mutable shared state

## 6. Phaser 4 Compatibility Gate

R0 ผ่านการเลือก engine และ pin Phaser `4.2.1` แล้ว ทุก upgrade หรือการเปลี่ยน plugin ต้องรัน gate ต่อไปนี้ซ้ำ:

1. โหลด tilemap/atlas ที่มี floor, collision, foreground occlusion และ animated sprites ได้
2. รองรับ keyboard, pointer/tap และ virtual joystick โดยไม่ผูก input กับ DOM form
3. camera follow, Y-depth และ proximity sensors ทำงานด้วย frame time ที่ยอมรับได้บน target mobile/desktop
4. suspend/destroy runtime แล้วคืน CPU/GPU/Audio resources ก่อนเข้า WebRTC interview ได้
5. Web–Game adapter ส่ง commands/events ได้โดยไม่มี React dependency ใน Game
6. มี semantic Navigator ทำ action สำคัญเทียบเท่า Canvas
7. asset pipeline สร้าง runtime atlas ใหม่ใน `packages/assets/` จาก approved source โดยไม่ใช้ `docs/ref_pics/` เป็น runtime file

ถ้า spike ไม่ผ่าน ให้บันทึกผลใน ADR ก่อนพิจารณา engine อื่น ห้ามแก้ปัญหาด้วยการรวม Website และ Game กลับเป็น codebase ที่ไม่มี boundary

## 7. Experience Priorities from Hideout/Gather Direction

### สิ่งที่ตรวจพบจาก Public Client ของ Hideout

- Marketing site เป็น Astro ส่วน product shell เป็น Next.js/React และโหลด Phaser เป็น dynamic chunk เฉพาะเมื่อ world mount
- React/DOM เป็น owner ของ top bar, media dock, chat และเมนู ส่วน Phaser เป็น owner ของ map, actor, collision, camera และ spatial calculation
- Game config ใช้ pixel-art sampling, Arcade Physics แบบ zero gravity, resize-to-host และ lifecycle sleep/wake/destroy จาก Web shell
- แผนที่ใช้ Tiled TMX/TSX; ตัวละครประกอบจาก layered atlases และ cache texture ที่ compose แล้ว
- World/presence ใช้ authenticated WebSocket แยกจาก LiveKit media channel; Game คำนวณ spatial membership แต่ DOM/media layer เป็น owner ของ consent และ track subscription
- Public implementation เชื่อม Phaser กับ shared app stores/API ค่อนข้างแน่น MaskedMatch จึงคง typed adapter และ workspace boundary ที่เข้มกว่า

ข้อสรุปที่อนุญาตให้อ้างในโครงการอยู่ใน section นี้เท่านั้น; local capture/research file ภายนอก repository ไม่ใช่ canonical documentation ห้าม commit browser-save ที่มี session/account data หรือ proprietary bundle เข้า repository

รับมาเป็นหลักการ:

- การเคลื่อนที่มีจุดหมาย: discover booth, people, queue และ contextual action
- presence อ่านออกทันทีว่าใครว่าง/ไม่ว่าง โดยไม่บังคับเปิด media
- interaction เกิดจาก proximity หรือพื้นที่เฉพาะ แต่ต้องมี explicit consent สำหรับไมค์/กล้อง
- มี focused mode/List mode สำหรับผู้ใช้ที่ไม่ต้องการควบคุมตัวละคร
- world ต้องรู้สึกมีชีวิตด้วย landmark, NPC, signage และ ambient motion ไม่ใช่ background image กับ hotspot

ไม่รับมาโดยอัตโนมัติ:

- clone visual system หรือแผนที่ของผลิตภัณฑ์อ้างอิง
- proximity audio/video ที่เปิดเอง
- feature collaboration office ที่ไม่เกี่ยวกับ core job-fair loop
- การให้ Canvas เป็นทางเดียวในการสมัครงานหรือเข้าคิว
