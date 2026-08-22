# 3. Functional Requirements Specification

> เว้นแต่ระบุเป็นอย่างอื่น Requirement ในเอกสารนี้ใช้เกณฑ์:
> - **P0** = Pilot / Core Blocker (จำเป็นต้องมี)
> - **P1** = Quality / Extended Feature (ควรมี หากเว้นต้องมี Waiver)
> - **P2** = Post-Pilot / Feature-flagged (ส่วนต่อขยาย)
> - **R0** = Hackathon Prototype Mandatory Requirement

---

## 3.0 Website, Landing Page & End-to-End Journey

> [!IMPORTANT]
> **P0 WEBSITE GATE — สำคัญเท่ากับ P0 WORLD GATE:** MaskedMatch ต้องเป็นผลิตภัณฑ์เว็บที่มี Website, Product Landing, Event Landing และ Virtual Job Fair เชื่อมเป็น journey เดียวกัน ไม่ใช่มีเฉพาะหน้าเกมหรือ Canvas แยกเดี่ยว งาน World ห้ามถือว่าเสร็จหากผู้ใช้ยังเข้า Event, เตรียม Profile, เลือก Avatar, กลับ/รีโหลดหน้า หรือใช้เส้นทาง Semantic DOM ไม่ได้จริง

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-WEB-001** | **P0-GATE** | **Complete Website Surface:** Website workspace ต้องเป็น owner ของ global shell, Product Landing, Event Landing, candidate preparation flow, legal/status pages และ error/recovery UI; Phaser workspace เป็น owner เฉพาะ interactive Career Hall runtime |
| **FR-WEB-002** | **P0-GATE** | **Functional Product Landing:** `/` ต้องสื่อ value proposition, วิธีทำงาน, privacy/accessibility principles, World/List parity และมี CTA ที่นำไป Event จริง ห้ามมีปุ่มหรือลิงก์ที่กดแล้วไม่เกิด action ตาม label |
| **FR-WEB-003** | **P0-GATE** | **Functional Event Landing:** `/event/demo` และ canonical event route ต้องแสดงสถานะ Demo, schedule, participating booths/jobs, accessibility, privacy, journey progress และ Resume/Start/Guest World action ที่ทำงานจริง |
| **FR-WEB-004** | **P0-GATE** | **Executable Candidate Preparation:** Mock Verify/Consent → Profile Import → Masked Review → Avatar Setup → Career Hall ต้องเดินหน้า ย้อนกลับ validation และ recover เมื่อเข้า direct URL ได้ โดยใช้ synthetic data และติดป้าย mock อย่างเห็นได้ชัด |
| **FR-WEB-005** | **P0-GATE** | **Route & State Reliability:** browser back/forward, direct URL, reload และ local demo resume/reset ต้องคงหรือกู้ state ได้ตาม policy; route ที่ไม่รู้จักต้องแสดง 404 พร้อมทางกลับ ไม่ render หน้าว่าง |
| **FR-WEB-006** | **P0-GATE** | **Real Controls Only:** ทุก primary/secondary control ใน Website, Landing, Event และ flow ต้อง navigate, submit, validate, scroll, reset หรือเปลี่ยน state จริง; ห้ามใช้ dead control, decorative fake form หรือ label ที่อ้าง capability เกิน implementation |
| **FR-WEB-007** | **P0-GATE** | **Responsive & Semantic Website:** ทุก route P0 ต้อง reflow ที่ 320, 390, 768, 1024 และ 1440 CSS px, ไม่มี horizontal overflow ใน core flow, ใช้ semantic DOM, keyboard-visible focus, skip link และ text alternative ที่เหมาะสม |
| **FR-WEB-008** | **P0-GATE** | **World Lifecycle Boundary:** เข้า World แล้ว Website ต้อง mount Phaser 4 runtime เพียงหนึ่ง instance; เมื่อออกจาก World ต้อง destroy/unmount runtime และกลับ Event/Landing ได้ โดยไม่มี duplicated canvas, listener หรือ game input ค้าง |
| **FR-WEB-009** | **P0-GATE** | **Truthful Completeness:** สิ่งที่เป็น frontend fixture, mock identity, local persistence หรือยังไม่มี backend/media engine ต้องติดป้ายชัดเจนบน UI และเอกสาร ห้ามใช้คำว่า production-ready จนผ่าน server, security, media, accessibility และ operational gates ที่เกี่ยวข้อง |
| **FR-WEB-010** | **P0-GATE** | **Cohesive Product UI:** Website, Landing, Event, candidate flow และ World HUD ต้องใช้ design language เดียวกัน มี hierarchy, spacing, type scale, surface, focus/hover/pressed/disabled state และ responsive navigation ที่ตั้งใจออกแบบ; ห้ามใช้ raw browser control, card ที่กระจายไร้ grid, overlay ที่บัง world โดยไม่จำเป็น หรือเอฟเฟกต์ neon/glass จำนวนมากแทน information hierarchy |
| **FR-WEB-011** | **P0-GATE** | **Three Executable Role Surfaces:** ต้องมี Job Seeker, Recruiter/Company และ Organizer/Support workspace ที่เข้าได้จาก route/role guard จริง มี loading/empty/error/recovery state และไม่ใช่ dashboard mockup ที่มี control กดไม่ได้ |
| **FR-WEB-012** | **P0-GATE** | **Complete Job Seeker Loop:** Sign in/Mock Verify → Consent → CV upload/demo/manual → Process/Review → Character Studio → Hall/Booth/Job → single active queue → Ready Check → Media Preflight → Interview → private decision → result → consent reveal/return to hall ต้องเดินครบได้ใน demo ด้วย visible controls |
| **FR-WEB-013** | **P0-GATE** | **Complete Recruiter Loop:** Recruiter ต้องสร้าง/แก้ company, job, JD, salary, rubric, booth และ showcase; preview/validate/publish; ตั้ง availability; รับคิว; สัมภาษณ์; ตัดสินใจ; ขอข้อมูลหลัง mutual match และส่ง follow-up ได้ครบใน demo |
| **FR-WEB-014** | **P0-GATE** | **Executable Organizer/Support Overview:** Organizer/Support ต้องเห็น event/queue/interview/integration health, pause/resume/broadcast, company moderation และ support ticket recovery ผ่าน aggregate/scoped data โดยไม่เห็น decision/PII ที่ไม่มีสิทธิ์ |
| **FR-WEB-015** | **P0-GATE** | **Demo/Connected Contract Parity:** `demo` และ `connected` mode ต้องใช้ typed gateway และ canonical state/validation/error envelope ชุดเดียวกัน; connected mode ห้าม fallback เป็น fixture อย่างเงียบ และ provider secrets ห้ามอยู่ใน frontend bundle |

---

## 3.1 Authentication, Identity & Consent

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-AUTH-001** | P0 | ผู้ใช้ MUST ลงชื่อเข้าใช้ด้วยวิธีที่ event รองรับและกลับ route เดิมได้หลัง callback |
| **FR-AUTH-002** | P0 | Candidate MUST มี stable pseudonymous `candidate_code` ต่อ event โดย code ต้องเดา identity ไม่ได้ |
| **FR-AUTH-003** | P0 | ThaID integration MUST ใช้เฉพาะหลังได้รับอนุญาต/credentials จาก DOPA; demo MUST ใช้ mock ที่ติดป้ายชัด |
| **FR-AUTH-004** | P0 | ระบบ MUST ไม่เก็บเลขบัตรประชาชน raw หากไม่จำเป็น; เก็บ minimal verification claim, assurance level และ verified timestamp |
| **FR-AUTH-005** | P0 | ต้องมี fallback/assisted verification สำหรับชาวต่างชาติ ผู้ไม่มี ThaID ผู้ไม่มี smartphone หรือ provider outage ตาม event policy |
| **FR-CONSENT-001** | P0 | Consent ต้องแยกตาม purpose: account, resume processing, optional media transform, optional transcription, integrity signal และ reveal |
| **FR-CONSENT-002** | P0 | ทุก consent เก็บ policy version, locale, timestamp, source และ withdrawal status |
| **FR-CONSENT-003** | P0 | การปฏิเสธ optional processing MUST ไม่ปิด core flow หากมี accessible alternative |
| **FR-CONSENT-004** | P0 | ก่อนเปิดกล้อง/ไมค์ browser ต้องมี plain-language pre-prompt อธิบาย purpose และ fallback |

---

## 3.2 Resume, Portfolio & Masked Profile

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-PROFILE-001** | P0 | รองรับ PDF/DOCX ตาม allowlist, จำกัดขนาด, malware scan และ reject active content |
| **FR-PROFILE-002** | P0 | Parser MUST แยก raw document, extracted facts, redaction span และ candidate-approved profile |
| **FR-PROFILE-003** | P0 | ปิดบังชื่อ, รูป, contact, exact address, full birth date, gender marker, national ID และ metadata ที่เปิดเผย identity |
| **FR-PROFILE-004** | P0 | Policy ของ Blind Mode SHOULD ซ่อนชื่อสถาบัน/นายจ้างเดิม แต่คง degree/field/industry/role/evidence ตามความจำเป็น |
| **FR-PROFILE-005** | P0 | ตรวจ filename, embedded URL, document properties, EXIF และ free text ไม่ใช่เฉพาะข้อความที่มองเห็น |
| **FR-PROFILE-006** | P0 | Candidate MUST เห็น side-by-side review พร้อม highlight สิ่งที่ถูกซ่อน/อาจตกหล่นก่อน publish |
| **FR-PROFILE-007** | P0 | Candidate แก้ extracted skill/evidence ได้ โดยระบบเก็บ provenance ว่า `parsed`, `candidate_confirmed` หรือ `verified` |
| **FR-PROFILE-008** | P0 | AI MUST NOT แต่งประสบการณ์หรือเติม skill ที่ไม่มีหลักฐาน |
| **FR-PROFILE-009** | P1 | Portfolio link ใช้ privacy proxy/preview หรือ warning เพราะ username/domain อาจเปิดเผย identity |
| **FR-PROFILE-010** | P1 | Candidate ดาวน์โหลด Masked Profile ที่ recruiter เห็นได้ |

---

## 3.3 Organization, Booth & Job Setup

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-ORG-001** | P0 | Company Admin ต้องผ่าน organization verification ก่อน publish booth/job |
| **FR-JOB-001** | P0 | Job ต้องมี title, summary, responsibilities, must-have, nice-to-have, evidence accepted, location/work mode, employment type และ interview duration |
| **FR-JOB-002** | P0 | Must-have แต่ละข้อระบุ `required`, `weight`, `minimum level` และเหตุผลทางงาน |
| **FR-JOB-003** | P0 | ห้ามใช้ protected attribute หรือ proxy ที่ไม่จำเป็นเป็น filter/ranking input |
| **FR-JOB-004** | P1 | แสดง salary range/benefit ตาม event policy เพื่อช่วย candidate ตัดสินใจก่อนเข้าคิว |
| **FR-BOOTH-001** | P0 | Booth มี overview, active jobs, tech/skill tags, queue state, recruiter availability และ accessibility note |
| **FR-BOOTH-002** | P0 | บริษัทแก้ visual theme ได้เฉพาะ template/token ที่ผ่าน contrast/asset/license validation |
| **FR-BOOTH-003** | P0 | ทุก logo, sprite, video และ sound ต้องมี asset owner/license record |
| **FR-BOOTH-004** | P0 | Company Editor ต้อง Save Draft, Preview, Validate, Publish และ Unpublish company/job/booth ได้ พร้อม salary range, rubric และ optimistic version-conflict recovery |
| **FR-BOOTH-005** | P0 | Showcase/Hall of Fame รองรับ product, project, award, case study, culture และ benefit โดยทุก item มี provenance, display order, moderation และ publish status; ห้ามเผยบุคคลจริงโดยไม่มีสิทธิ์ |

---

## 3.4 Skill Matching & Recommendation

```text
Eligibility Gate:
  pass = all required legal/work constraints satisfied
         AND candidate confirmed minimum must-have evidence

Score (0–100):
  45% Skill coverage
  25% Evidence strength
  15% Role level / recency alignment
  15% Candidate preference alignment
```

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-MATCH-001** | P0 | Matching input ใช้เฉพาะ approved structured profile/job fields |
| **FR-MATCH-002** | P0 | ทุกผลลัพธ์เก็บ model/rule version, feature version, score, confidence และ explanation |
| **FR-MATCH-003** | P0 | มี deterministic fallback เมื่อ model unavailable |
| **FR-MATCH-004** | P0 | Candidate แก้ข้อมูลต้นทางและสั่ง recompute ได้ |
| **FR-MATCH-005** | P1 | ทีมต้องวัด precision/recall จาก human-reviewed sample และ disparity guardrails ก่อน scale |
| **FR-MATCH-006** | P1 | Sensitive demographic ที่ผู้ใช้สมัครใจให้เพื่อ fairness audit ต้องเก็บแยก ไม่เข้า ranking และรายงานแบบ aggregate เท่านั้น |
| **FR-MATCH-007** | P0 | Resume/JD content ต้องถือเป็น untrusted data; ห้ามให้ embedded instruction เปลี่ยน system policy หรือ tool behavior |

---

## 3.5 Interactive Neon Career Hall World & Generated Assets

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-WORLD-001** | P0 | Orthographic top-front 2D world ใช้ server-authoritative zone/instance และ client-predicted movement |
| **FR-WORLD-002** | P0 | Desktop รองรับ WASD, arrow, point-and-click และ remappable controls |
| **FR-WORLD-003** | P0 | Mobile ใช้ tap-to-move เป็น default; optional joystick ต้องไม่บัง action/UI |
| **FR-WORLD-004** | P0 | ทุก interactive object มี outline, label, context prompt และ semantic DOM equivalent |
| **FR-WORLD-005** | P0 | ผู้ใช้ค้น booth/job แล้วเลือก `นำทางให้` หรือ `เปิดรายละเอียด` ได้โดยไม่ต้องเดินเอง |
| **FR-WORLD-006** | P0 | Navigator/List Mode ทำ explore, booth view, queue และ schedule ได้ครบ 100% |
| **FR-WORLD-007** | P0 | World mic/camera off by default; proximity ไม่เปิด media อัตโนมัติ |
| **FR-WORLD-008** | P0 | Presence ที่ public เห็นมีเฉพาะ pseudonym/avatar/status ที่จำเป็น |
| **FR-WORLD-009** | P2 | Private zone แสดง boundary, participant count, media state และปุ่ม Join/Leave ชัด |
| **FR-WORLD-010** | P2 | Mini-quest ให้ cosmetic/reward เท่านั้นและ MUST NOT เปลี่ยน ranking โดยไม่ประกาศ |
| **FR-WORLD-011** | P0 | เมื่อ tab hidden ให้ลด render tick/pause animation; queue/deadline อยู่ที่ server และ client ต้อง resync snapshot/cursor เมื่อ foreground กลับมา |
| **FR-WORLD-012** | P0 | Asset โหลดเป็น lobby/zone chunk; ห้าม preload ทั้ง event โดย default |
| **FR-WORLD-013** | P2 | ถ้าเปิด Main Stage live broadcast ต้องมี live captions ที่ระบุ speaker, text fallback และ accessibility owner sign-off |
| **FR-WORLD-014** | R0 | Indoor hall ต้องมี 4 booth zone พร้อม dynamic logo/sign layer, interaction radius และ click/tap/keyboard action |
| **FR-WORLD-015** | R0 | NPC crowd มีอย่างน้อย 12 ตัว/5 role silhouettes พร้อม synthetic dialogue โดยสร้างจาก base body และ customization layer library เดียวกับ player ผ่าน seeded random configuration; ห้ามใช้ระบบ NPC สำเร็จรูปคนละ anatomy/compositor, เปิด PII หรือแอบอ้างว่าเป็นผู้ใช้จริง |
| **FR-WORLD-016** | R0 | Camera-follow, click/tap movement และ NPC/prop animation ต้องใช้ time-based easing และรักษา input response; Reduced Motion ต้องมี stationary equivalent |
| **FR-WORLD-017** | R0 | Player/NPC/prop ต้องเป็น runtime layer แยกจาก environment และ depth-sort อย่างถูกต้องตามแกน Y |
| **FR-WORLD-018** | R0 | Generated/third-party world asset ทุกไฟล์ต้องมี provenance/allowed-use record และห้ามคัดลอก asset/trade dress จากภาพอ้างอิง |
| **FR-WORLD-019** | R0 | **Strict No-Emoji Policy:** ทุก Element ประกอบฉาก, พร็อพ, บูธ, ตัวละคร NPC, และ Web UI Icons ต้องเป็น **Generated Pixel Art / SVG Assets** ทั้งหมด ห้ามใช้อิโมจิ |
| **FR-WORLD-020** | R0 | **Realistic Booth Showcase:** ดีไซน์การเยี่ยมชมบูธต้องมีองค์ประกอบเสมือนจริง: เคาน์เตอร์ต้อนรับ, จอแสดง Tech Stack, สถานะคิวสด, และจุดประจำของ Recruiter |
| **FR-WORLD-021** | R0 | **8-Bit Character Studio (The Sims Customizer):** รองรับการเลือก/ปรับแต่งตัวละคร 8-bit โดยแยกสีผิว, ทรง/สีผม, เสื้อ, กางเกง/ท่อนล่าง, รองเท้า และ accessory พร้อมปุ่มสุ่มที่ใช้ Custom SVG/Pixel Icon และแสดงผล Live 4-direction Animated Preview ใน Phaser Mini-Stage Canvas |
| **FR-WORLD-022** | R0 | **Seamless Endless Hall:** World ใช้ hall module ที่เดินวนกลับได้ด้วย toroidal wrap หรือ streamed repeating modules; corridor, collision และ navigation graph ต้องต่อเนื่อง และ UI ต้องสื่อว่าเป็น Seamless Career Hall อย่างตรงไปตรงมา |
| **FR-WORLD-023** | R0 | **Open Booth Pads:** Hall ต้องมีพื้นที่โล่งและ BoothPad แบบ modular สำหรับวาง/ย้าย booth โดยไม่ต้อง redraw map; ทุก active booth ยังต้องค้นหาและเข้าถึงได้จาก Navigator/List Mode 100% |
| **FR-WORLD-024** | R0 | **Booth Sign & Info Kiosk:** ทุก booth ต้องมีชื่อหรือโลโก้บริษัทเป็น dynamic sign layer และมีจอประกาศ/Info Kiosk ที่กดด้วย keyboard, click หรือ tap เพื่อเปิดข้อมูล booth/job แบบ Semantic DOM ได้ |
| **FR-WORLD-025** | R0 | **Physics-backed Interaction:** Player, NPC และ solid prop ต้องมี collision body / collision metadata; interaction ต้องใช้ sensor แยกจาก solid collision; hitbox ต้องสะท้อนฐานวัตถุจริง ไม่ใช่ใช้ภาพหรือ CSS hotspot เพียงอย่างเดียว |
| **FR-WORLD-026** | R0 | **Layered Game Rendering:** World ต้องแยก `FloorBase`, `FloorDecal`, `CollisionGeometry`, `Actor`, `PropMid`, `ForegroundOccluder`, `LightingFX` และ Semantic DOM Overlay พร้อม dynamic Y-depth เพื่อให้การเดินหน้า/หลังวัตถุสมจริง |
| **FR-WORLD-027** | R0 | **Native Phaser Entity Standard:** Booth, wall, counter, display, kiosk, queue marker, planter, NPC, player, sign และ light ต้องถูก instantiate เป็น Phaser 4 `GameObject`, `Container`, `Sprite`, `Layer` หรือ physics object จริงใน scene graph มี lifecycle/state ของตัวเอง ห้ามใช้ภาพฉากแบนแล้ววาง transparent hotspot หรือ DOM element ให้ดูเหมือนเป็นวัตถุในเกม |
| **FR-WORLD-028** | R0 | **Plain World Base:** Background มีหน้าที่เป็นเพียงพื้นโล่ง, tile/grid, aisle และ boundary ที่ Phaser render; องค์ประกอบฉากที่สื่อความหมายหรือโต้ตอบได้ต้องวางเป็น runtime entity ภายหลัง จึงสามารถย้าย, ซ่อน, เปลี่ยน state, depth-sort และชนได้โดยไม่ redraw ภาพพื้นหลัง |
| **FR-WORLD-029** | R0 | **Functional Mode Completeness:** World, Navigator/List Mode, Booth Detail, Queue join/cancel, NPC Dialogue, Info Hub และ Character Studio ต้องเปิด-ปิดและทำ primary action ได้จริง; ห้ามมีปุ่มโหมดหรือ control ที่ไม่เปลี่ยน state/ไม่ส่ง command ตามที่ label ระบุ และเมื่อ DOM panel/dialogue เปิดต้องหยุด Game input เพื่อไม่ให้ตัวละครเดินโดยไม่ตั้งใจ |
| **FR-WORLD-030** | R0 | **Runtime Avatar Composition:** การเลือก skin, hair style/color, top style/color, bottom/trousers style/color, shoes style/color และ accessory ต้อง compose เป็น Phaser Dynamic Texture จริง, preview ใน Phaser mini-scene, apply กับ player ทันที และ persist local preference; ห้ามสลับภาพตัวละครสำเร็จรูปทั้งตัวเพื่อจำลอง customization |

> [!IMPORTANT]
> **P0 WORLD GATE — ลำดับความสำคัญสูงสุด:** `FR-WORLD-025`, `FR-WORLD-027` และ `FR-WORLD-031..039` เป็น release blockers ที่อยู่เหนือ glow, HUD polish, animation และ feature เพิ่มทั้งหมด ห้ามยอมรับ scene ที่ “ทำงานได้แต่ยังใช้กล่องแบน”, วัตถุคนละมุม/มุมไม่ครบ, baked shadow, avatar หน้าเดียวแล้ว flip, tile kit ต่อฉากไม่ได้ หรือ booth clone ทั้งหมดเป็น Done

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-WORLD-031** | **P0-GATE** | **Authentic Rendered Element:** Visual final ของ booth, facade, counter, desk, monitor, kiosk, plant, queue rail, truss, lounge, player และ NPC ต้องใช้ original/licensed pre-rendered pixel asset หรือ authored sprite/tile ที่มี silhouette, ด้านหน้า/ด้านข้าง, material detail และมุมมอง top-front 3/4 สอดคล้องกัน โดย source/object texture ต้องเป็น transparent RGBA และไม่มี baked floor/contact/cast shadow; Primitive rectangle/ellipse ใช้ได้เฉพาะ floor geometry, runtime shadow, collision, sensor, debug หรือ FX ห้ามใช้เป็นตัวแทนวัตถุ final |
| **FR-WORLD-032** | **P0-GATE** | **Master Reference Fidelity:** Art direction และการตกแต่งต้องอิง `00_MAIN_virtual_job_fair_map.jpg` และ `00_MAIN_spritesheet_booths_characters_props.png` เป็น master references สูงสุดด้าน scale, density, booth anatomy, furniture vocabulary, palette และ readability โดยสร้าง asset ต้นฉบับใหม่ ห้ามคัดลอก company, logo, character หรือ map layout จาก reference |
| **FR-WORLD-033** | **P0-GATE** | **Game-Grade Movement & Collision:** ทุก solid rendered prop ต้องมี collision geometry ที่ผูก `ownerId/entityId`, ตรงกับฐานวัตถุ ไม่ใช้ full transparent frame; player/NPC ใช้ foot hitbox, sensor แยกจาก solid body, navigation ต้องหยุดที่ approach point ที่เดินถึงได้ และ actor ต้องเดินหน้า/หลัง prop ตาม Y-depth โดยไม่ทะลุหรือค้างชนเป้าหมาย |
| **FR-WORLD-034** | **P0-GATE** | **True Directional Sims-style Avatar:** Player avatar และทุก compatible layer ต้องมี authored/composed sprite จริง 4 ทิศ `down/top-front`, `up/top-behind`, `left/top-left-side`, `right/top-right-side` × อย่างน้อย 3 เฟรม `idle`, `step-left`, `step-right`; body, hair, เสื้อ, กางเกง/ท่อนล่าง, รองเท้า และ accessory ต้องมี anatomy/occlusion/anchor ของมุมนั้นจริง ห้ามใช้ front frame, horizontal flip หรือ rotation หลอกเป็นด้านหลัง ผู้ใช้ต้องปรับ skin tone, hair style/color, top style/color, bottom/trousers style/color, shoe style/color และ accessory ได้แยกกันโดยไม่ล็อกตามเพศ พร้อม preview 4 ด้านและ apply/persist ใน World |
| **FR-WORLD-035** | **P0-GATE** | **Single Top-Front Camera Convention:** Floor, booth facade, desk, monitor, kiosk, chair, plant, queue rail, NPC และ player ต้องใช้ orthographic top-front 3/4 view เดียวกัน เห็น top plane + front plane ตามชนิดวัตถุ, เส้นตั้งไม่บรรจบ, baseline/grid scale คงที่, material highlight มาจาก top-left และ runtime shadow มี down-right bias; ห้ามกลับ booth แถวล่างให้เปิดคนละทิศ, ผสม isometric/side/front camera หรือย่อขยายวัตถุจนสัดส่วนเทียบ actor ผิด |
| **FR-WORLD-036** | **P0-GATE** | **Modular Booth Variant Library:** Booth ต้องประกอบจาก runtime entities แยกชิ้นและมีอย่างน้อย facade/backwall 4 แบบ, counter 4 แบบ, showcase/workstation 4 แบบ, kiosk 3 แบบ, queue family 4 แบบ, seating 3 แบบ, plant 6 แบบ และ decor kit 6 แบบ; booth ที่ติดกันห้ามใช้ combination เหมือนกันทุกหมวด ความหลากหลายต้องมาจาก authored silhouette/material variant, approved palette, prop cluster และ dynamic sign ห้ามใช้ arbitrary scale/flip/rotation ที่ทำให้ top-front perspective, light หรือ collider ผิด และ colorway ไม่นับเป็น variant ใหม่ |
| **FR-WORLD-037** | **P0-GATE** | **Runtime Shadow & Shared Actor Compositor:** Object, player และ NPC texture ห้ามมี baked contact/cast shadow; Phaser ต้องสร้าง shadow GameObject/texture แยก ผูก `ownerId`, วางที่ฐาน, depth-sort และปรับ scale/alpha ตาม entity state โดยไม่มี collider NPC ทุกตัวต้องสุ่ม `AvatarAppearance` แบบ seeded จาก base/skin/hair/top/bottom/shoes/accessory library และ render ด้วย compositor/atlas contract เดียวกับ player เพื่อให้ทิศ, animation, palette และ wardrobe ใช้กฎเดียวกัน |
| **FR-WORLD-038** | **P0-GATE** | **Complete Orientation, Partition & Autotile Coverage:** Directional prop เช่น booth module, counter, desk, chair, sofa, kiosk, display, sign, door และ queue gate ต้องมี authored `north/east/south/west` ใน top-front camera เดียวกัน เว้นแต่ผ่าน radial-symmetry review; floor/aisle/road/booth-pad/wall kit ต้องมี center, edges, inner/outer corners, horizontal/vertical, turns, T-junctions, cross, endpoints, transitions, openings และ wall caps/pillars ที่จำเป็นเพื่อประกอบ map ใหม่โดยไม่มี seam ชุดกั้นบูธต้องมี left/center/right ends, repeatable middle, corner/join, solid/glass/low-divider variants และประตู/ช่องเปิดตำแหน่งซ้าย–กลาง–ขวาพร้อม collider segments ที่ไม่ปิดทางเดิน ห้าม runtime rotate/flip มุมเดียวเพื่อแทน coverage ที่ขาด |
| **FR-WORLD-039** | **P0-GATE** | **Reusable Palette-Slot Asset Contract:** Source/runtime part ต้องเป็น transparent RGBA แยกจาก floor, neighbor, logo, text, company color และ shadow พร้อม metadata `assetId`, `variantId`, `orientation`, `frame`, `origin`, `anchors`, `baseFootprint`, `paletteSlots`, `occlusionParts`, `shadowProfileId`; recolor ต้องเปลี่ยน semantic highlight/base/shade ramps แยก skin/hair/top/bottom/shoes/material/accent และ prefab ต้อง rearrange/recombine ได้โดยไม่ redraw texture |

---

## 3.6 Booth Discovery & Queue Management

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-QUEUE-001** | P0 | Join ใช้ idempotency key ป้องกัน duplicate ticket |
| **FR-QUEUE-002** | P0 | Durable DB เป็น source of truth; Redis ใช้ scheduling/cache โดย transition สำคัญต้อง persist |
| **FR-QUEUE-003** | P0 | Atomic claim ป้องกัน recruiter สองคนเรียก candidate เดียวกัน |
| **FR-QUEUE-004** | P0 | Queue Chip แสดงบริษัท/job, position, ETA range, state และ action ถัดไป |
| **FR-QUEUE-005** | P0 | Position update ผ่าน WebSocket พร้อม polling fallback |
| **FR-QUEUE-006** | P0 | Ready check default 60 วินาที; server timestamp เป็นตัวตัดสิน |
| **FR-QUEUE-007** | P0 | Refresh/reconnect ต้อง resume ticket เดิมโดยไม่ join ซ้ำ |
| **FR-QUEUE-008** | P0 | Recruiter availability/heartbeat หยุด dispatch เมื่อไม่มี interviewer |
| **FR-QUEUE-009** | P0 | Recruiter disconnect ก่อน interview ต้องคืน ticket ตาม policy โดยไม่ลงโทษ candidate |
| **FR-QUEUE-010** | P1 | Notify ที่ 5 นาทีและ ready check ผ่าน in-app; web push/email เป็น opt-in |
| **FR-QUEUE-011** | P0 | Organizer pause queue พร้อม reason และ next update ได้ |
| **FR-QUEUE-012** | P0 | Queue logs เก็บ transition actor, time, reason และ version |
| **FR-QUEUE-013** | P0 | Candidate มี active queue ticket ได้ไม่เกินหนึ่งใบต่อ event; join ซ้ำหรือ join booth อื่นต้องคืน ticket เดิมและให้ผู้ใช้ยกเลิกอย่างชัดเจนก่อนสร้างใบใหม่ |

---

## 3.7 Interview Preflight & Real Media Privacy Engines

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-INT-001** | P0 | Duration ตั้งที่ job/session เป็น 10, 12 หรือ 15 นาที; server clock เป็น source of truth |
| **FR-INT-002** | P0 | Session duration รวม final wrap-up minute; แจ้งเตือน 5 นาทีก่อนหมด และเปลี่ยนสถานะเป็น `WRAP_UP` เมื่อเหลือ 60 วินาที |
| **FR-INT-003** | P0 | Candidate video แสดงผ่าน mask/blur/avatar ตาม capability โดยไม่เผย raw preview ให้ recruiter ก่อน transform สำเร็จ |
| **FR-INT-004** | P0 | หาก mask fail ต้องหยุดส่ง video และให้เลือก retry, avatar-only หรือ audio-only; ห้ามเผลอส่ง raw face (**Fail-Closed Policy**) |
| **FR-INT-005** | P0 | Voice transform เป็น optional และต้องรักษาความเข้าใจ; fallback เป็น original audio โดยมี consent หรือ text/caption |
| **FR-INT-006** | P0 | Recruiter เห็น company/job/role แต่ candidate identity ยัง masked |
| **FR-INT-007** | P0 | Recording/transcription off by default และต้องแสดงสถานะตลอด session |
| **FR-INT-008** | P0 | Media reconnect grace period 60 วินาที; timer policy ต้องบอกว่าหยุดหรือเดินต่อก่อนเริ่ม |
| **FR-INT-009** | P0 | ผู้ใช้ report/block/leave ได้; emergency leave ไม่ต้องผ่าน modal หลายขั้น |
| **FR-INT-010** | P0 | Rubric notes เป็น recruiter-private และห้ามมี inferred protected attributes |
| **FR-INT-011** | P1 | Collaborative task ต้องมี permission, save state, language/runtime sandbox และ mobile full-screen mode |
| **FR-INT-012** | P0 | บน mobile ต้องใช้ dedicated interview view และไม่ render world เบื้องหลัง |
| **FR-INT-013** | P0 | Text-assisted/interpreter accommodation ต้องเป็น operational path ที่ทดสอบได้ ไม่ใช่เพียง toggle |
| **FR-INT-014** | R0 | **Real Camera & Face Landmark Engine:** รองรับการเปิดกล้องจริง (`getUserMedia`) และประมวลผล Face Landmark Detection (MediaPipe/WASM) เพื่อ Render หน้ากากสัตว์ครอบทับใบหน้าเรียลไทม์ |
| **FR-INT-015** | R0 | **Real Voice Alteration DSP:** ใช้ Web Audio API AudioWorklet สำหรับดัดแปลงเสียง (Pitch & Formant Shift) แบบ Real-time บน Client ด้วยความหน่วงต่ำ (<20ms) |

---

## 3.8 Integrity Signals (Browser Reality & Safeguards)

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-INTEGRITY-001** | P0 | เรียกฟีเจอร์ว่า `Integrity Signals` ไม่ใช้ข้อความ `[LOCKED]` หรืออ้างว่าล็อกเบราว์เซอร์ได้ |
| **FR-INTEGRITY-002** | P0 | ก่อนเก็บ signal ต้องอธิบาย purpose, limitation, retention และ accommodation ชัดเจน |
| **FR-INTEGRITY-003** | P0 | Signal เดี่ยว/รวม MUST NOT auto-reject, lower match score, กล่าวหาว่าโกง หรือเป็นเหตุหลักของการตัดสิทธิ์ |
| **FR-INTEGRITY-004** | P0 | Interviewer/Recruiter ห้ามเห็น raw signal หรือ timeline ระหว่าง session/decision; หากมีกรณีตรวจสอบให้ Integrity Reviewer อิสระเป็นผู้ตรวจ |
| **FR-INTEGRITY-005** | P0 | Eye/gaze behavior MUST NEVER เป็น proxy ของ attention, honesty หรือ cheating |
| **FR-INTEGRITY-006** | P0 | ผู้ใช้ assistive technology หรือ neurodivergent ต้องมี alternative ที่ไม่เสียโอกาส |
| **FR-INTEGRITY-007** | P1 | False alert rate และ outcome disparity เป็น release guardrail |
| **FR-INTEGRITY-008** | P0 | เก็บเฉพาะ signal ที่จำเป็น, จำกัดการเข้าถึง และลบตาม retention (ไม่เกิน 7 วัน) |

---

## 3.9 Private Decision, Mutual Match & Reveal

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-DEC-001** | P0 | ปุ่มต้องมี label ชัด ไม่พึ่ง swipe gesture; swipe เป็น enhancement เท่านั้น |
| **FR-DEC-002** | P0 | Decision ใช้ idempotent submit และเข้ารหัสระหว่างส่ง/เก็บ |
| **FR-DEC-003** | P0 | หลัง submit แก้ไม่ได้ เว้นแต่ event policy มี short undo window ที่เท่ากันทั้งสองฝ่าย |
| **FR-DEC-004** | P0 | No-match copy สุภาพ ไม่เปิด decision ของอีกฝ่าย และไม่ลด ranking |
| **FR-DEC-005** | P0 | Resolver ต้องส่งผลทันทีเมื่อ decision ของทั้งสองฝ่ายครบ; ระหว่างมีเพียงหนึ่ง decision ต้องซ่อนค่าคำตอบจากอีกฝ่ายและ operator ที่ไม่เกี่ยวข้อง |
| **FR-REVEAL-001** | P0 | Mutual match ยังไม่ reveal อัตโนมัติ; ต้องผ่าน field-level consent |
| **FR-REVEAL-002** | P0 | Candidate เลือกเปิด legal name, email, phone, portfolio, education credential และ resume file แยกกันได้ และอนุญาตเพียง subset ของคำขอได้ |
| **FR-REVEAL-003** | P0 | Recruiter เปิดเผยชื่อ/ตำแหน่ง/contact owner และ company next-step policy ตอบกลับ |
| **FR-REVEAL-004** | P0 | ทุก view/download/reveal ต้องมี audit event |
| **FR-REVEAL-005** | P0 | หากฝ่ายใดไม่ยืนยัน reveal ภายใน window ให้ match คงอยู่แบบ masked |
| **FR-REVEAL-006** | P1 | Candidate ถอน share สำหรับ future access ได้ โดยไม่ลบ audit ที่กฎหมายกำหนด |
| **FR-REVEAL-007** | P0 | หลัง Mutual Match Recruiter ต้องสร้าง `RevealRequest` ระบุ field + purpose ก่อน Candidate grant/deny; default template มี `legal_name`, `email`, `phone`, `resume_file` ส่วน `postal_address` ห้ามเป็น default และต้องมี job-specific justification/policy allowance |
| **FR-REVEAL-008** | P0 | Recruiter อ่าน/ดาวน์โหลดได้เฉพาะ field ที่อยู่ใน request เดิมและ Candidate grant แล้ว; request เพิ่มต้องเป็น version ใหม่และขอ consent ใหม่ ห้ามใช้คำยินยอมแบบเหมารวม |

---

## 3.10 Post-Match Assessment

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-ASSESS-001** | P0 | Invite ต้องระบุ objective, time, deadline, data use, accessibility contact และ external destination ก่อน accept |
| **FR-ASSESS-002** | P0 | Transition ใช้ canonical state machine, idempotency และ actor authorization |
| **FR-ASSESS-003** | P0 | Expired/declined/technical failure แสดง factual status; ห้ามแปลงเป็น integrity/misconduct label อัตโนมัติ |

---

## 3.11 Organizer Operations, Moderation & Support

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-OPS-001** | P0 | Dashboard แสดง concurrent users, instance capacity, queue depth, recruiter availability, call health และ incident |
| **FR-OPS-002** | P0 | Organizer pause entry/queue/zone และ broadcast message ได้ |
| **FR-OPS-003** | P0 | Integration Health ต้องแสดง Auth, Profile Worker, Object Storage, Realtime, Media, Notification และ Audit แบบไม่เปิด secret พร้อม timestamp และ degraded-mode action |
| **FR-MOD-001** | P0 | ผู้ใช้ report harassment, impersonation, inappropriate content, privacy leak และ technical issue ได้ |
| **FR-MOD-002** | P0 | Moderator action: warn, mute world media, remove from zone, suspend event access; ทุก action มี reason/audit |
| **FR-MOD-003** | P0 | Break-glass access ต้องมี approval/reason, time limit (≤30 min) และ alert ถึง auditor |
| **FR-SUPPORT-001** | P0 | มี help route ที่ไม่ต้องควบคุม avatar และรองรับภาษาไทย/อังกฤษ |
| **FR-SUPPORT-002** | P1 | Accessibility request ติดต่อ support ก่อน event ได้โดยไม่เปิดเผย diagnosis เกินจำเป็น |
| **FR-SUPPORT-003** | P0 | Support ticket ต้อง create/assign/update/resolve, ผูก event/session แบบ pseudonymous และเก็บ operator action audit; support ห้ามอ่าน private decision หรือ contact field หากไม่ได้รับ scoped break-glass approval |

---

## 3.12 Notification System

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-NOTIFY-001** | P0 | Critical in-app alert ต้องมี text, explicit action, deduplicated `message_id` และ accessible announcement |
| **FR-NOTIFY-002** | P0 | Notification payload/lock-screen preview ต้องไม่ใส่ PII, decision value หรือ reveal field |
| **FR-NOTIFY-003** | P0 | Channel preference, permission, unsubscribe และ read state ต้องเป็น user-controlled/idempotent |
| **FR-NOTIFY-004** | P0 | Web Push/email เป็น best-effort; missed delivery ต้องใช้ server resync + fair recovery ไม่ใช่ client heartbeat penalty |
