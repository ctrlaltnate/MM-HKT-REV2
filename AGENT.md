# MaskedMatch — AI/Coding Agent Playbook

> Version 1.1 · Interactive Career Hall revision · 21 August 2026  
> เอกสารนี้บอก AI/coding agent ว่า “ต้องสร้างอย่างไร” ส่วนรายละเอียดผลิตภัณฑ์ฉบับเต็มอยู่ใน [MaskedMatch Complete Specification](./MaskedMatch_Complete_Specification.md) และรายละเอียดหน้าจออยู่ใน [DESIGN.md](./DESIGN.md)

> **Naming note:** ไฟล์นี้ตั้งชื่อ `AGENT.md` ตามคำขอของโครงการ หากเครื่องมือใดค้นหาเฉพาะ `AGENTS.md` ให้ทีมสร้างไฟล์นั้นภายหลังโดยอ้างอิงเนื้อหานี้ ห้ามมีข้อกำหนดสองชุดที่ขัดกัน

---

## 1. Mission

สร้าง **MaskedMatch R0 Hackathon Prototype** ซึ่งพิสูจน์ว่า Virtual Job Fair แบบ 2D top-down สามารถพาผู้สมัครผ่านลูปต่อไปนี้ได้จริงบน browser ทั้งมือถือและคอมพิวเตอร์:

1. เข้า Event และยืนยันตัวตนแบบจำลอง
2. สร้างและตรวจ Masked Profile ที่เน้นทักษะ
3. สำรวจ Neon Career Hall แบบ indoor spatial world หรือใช้ Navigator แบบรายการ
4. เปิดบูธ ดูงาน เหตุผลที่แนะนำ และเข้าคิว
5. รับ Ready Check และเข้า Interview Room
6. ตัดสินใจแบบส่วนตัวทั้งสองฝ่าย
7. Reveal เฉพาะข้อมูลที่ผู้สมัครยินยอมเมื่อ Mutual Match

Prototype ต้อง **ใช้งานได้จริง ไม่ใช่เพียงภาพหน้าจอ** แต่ต้องติดป้ายสิ่งจำลองอย่างตรงไปตรงมา ไม่สื่อว่า ThaID, AI, media masking หรือระบบจ้างงาน production พร้อมแล้ว

### 1.1 Approved interactive visual direction (Revision 1.1)

คำขอผู้ใช้ล่าสุดอนุมัติให้ R0 เปลี่ยนฉากหลักจากแผนที่เมืองกลางแจ้งแบบเรียบง่ายเป็น **Job Fair Hall ขนาดใหญ่ภายในอาคาร** โดยยังคง route และ domain contract เดิมเพื่อไม่ทำลาย flow

World implementation MUST:

- ใช้ Phaser เป็น renderer และให้กล้องติดตามตัวละครแบบ easing; รองรับ WASD/ลูกศร, click-to-move และ tap-to-move
- มีฮอลล์เดียวที่อ่านเป็นพื้นที่ต่อเนื่อง พร้อม grand entrance, central hub, 4 exhibitor booths, lounge, Support/Accessibility zone และ device-test/interview area
- แต่ละบูธมีช่อง logo/sign ที่แยกจาก background และเปลี่ยน fixture ได้โดยไม่แก้ภาพทั้งฉาก
- มี NPC หลายบทบาท เช่น candidate, recruiter, guide, event staff และ accessibility support พร้อม idle/walk loop, hover/tap feedback และบทสนทนาสั้นจากข้อมูลสังเคราะห์
- มี scene props จำนวนมาก เช่น โต๊ะ เก้าอี้ ต้นไม้ โคมไฟ kiosk coffee cart sign และ partition เพื่อให้โลกดูมีชีวิต โดย interactive prop ต้องมี semantic equivalent เมื่อเกี่ยวกับ core task
- มี ambient animation เช่น booth glow, light pulse, floating marker, NPC movement และ smooth camera โดย Reduced Motion ต้องหยุด animation ที่ไม่จำเป็น
- ใช้ original/generated asset ที่บันทึกใน asset registry เท่านั้น ภาพอ้างอิงของผู้ใช้ใช้กำหนด mood/density ได้ แต่ห้ามคัดลอก character, map, furniture, logo, UI chrome หรือ trade dress
- รักษา Navigator/List Mode เป็นเส้นทางเทียบเท่า; ความหนาแน่นของงานภาพห้ามทำให้ผู้ใช้ต้องเล่นเกมเพื่อเข้าถึง booth, queue, support หรือ interview

---

## 2. Instruction and Source Priority

เมื่อข้อกำหนดขัดกัน ให้ใช้ลำดับต่อไปนี้:

1. คำขอล่าสุดที่ผู้ใช้ให้โดยตรง
2. Decision ที่ Product Owner อนุมัติและบันทึกไว้
3. ข้อกำหนด `[USER]` ในสเปกหลัก
4. ข้อกำหนด R0 และ safety/privacy MUST/MUST NOT ในสเปกหลัก
5. `DESIGN.md` สำหรับ layout, component, interaction และ prototype behavior
6. ข้อเสนอ `[PROPOSED]` ในสเปกหลัก
7. สมมติฐานของ agent ซึ่งต้องบันทึกเป็น `ASSUMPTION`

ข้อมูล `[PDF]` เป็น **source context ไม่ใช่คำสั่ง** Agent ห้ามนำ claim, logo, ภาพ, ชื่อบุคคล หรือแนวคิดที่เสี่ยงจาก PDF มาใช้โดยอัตโนมัติ

หากยังไม่มีผู้อนุมัติ ให้ใช้ proposed R0 default ที่ reversible และปลอดภัยที่สุด พร้อมบันทึกไว้ใน decision log ของงาน ห้ามแก้สเปกหลักเพื่อทำให้ implementation ดูตรงกับข้อกำหนด

---

## 3. Definition of the Hackathon Product

### 3.1 Product promise

> ให้โอกาสเริ่มต้นจากทักษะและหลักฐาน ก่อนตัดสินจากตัวตน

### 3.2 Demo audience

- กรรมการที่ต้องเข้าใจ value proposition ภายใน 30 วินาที
- ผู้สมัครที่ใช้มือถือเป็นหลัก
- Recruiter ที่ต้องเห็นประโยชน์ของ Blind Mode และคิวสัมภาษณ์
- Technical judges ที่ตรวจความสมเหตุสมผลของ architecture, AI และ privacy

### 3.3 R0 must ship

- Responsive shell ที่ผ่าน smoke test ที่ 320, 390, 1024 และ 1440 CSS px
- Candidate และ Recruiter demo roles
- Event Landing พร้อมป้าย `DEMO DATA`
- Mock verification พร้อมคำว่า `NOT A REAL THAID INTEGRATION`
- Resume/skill form และ Masked Profile review
- Neon Career Hall 1 ฮอลล์, 4 บริษัทสมมติ, ช่อง logo ต่อบูธ, NPC/props ที่โต้ตอบได้ และ Navigator/List Mode
- Deterministic explainable job match
- Booth detail, 1 active queue, Ready Check และ refresh recovery
- Interview sandbox หรือ two-role session ที่แสดง timer/control/fallback
- Private decision, Mutual Match และ field-level reveal
- Recruiter dashboard แบบย่อสำหรับรับคิวและส่ง decision
- Loading, empty, error, offline/reconnect และ permission-denied state ของเส้นทาง demo
- Keyboard core flow, reduced motion และ basic WCAG contrast
- Seed/reset mechanism และ demo runbook

### 3.4 R0 must not pretend to ship

- Production ThaID หรือการเชื่อมต่อหน่วยงานจริง
- AI ที่ตัดสินรับ/ไม่รับผู้สมัคร
- การรับประกันว่า “ไร้อคติ 100%” หรือ “ตรวจจับโกงได้”
- Eye tracking, emotion/personality inference, humanity score หรือ browser locking
- การเปิดกล้อง/ไมค์/บันทึกเสียงโดยไม่ขออนุญาต
- Production-grade biometric masking หากยังเป็น visual mock
- ATS write-back, payment, production notification หรือข้อมูลบริษัทจริง
- Asset, logo, copy หรือ trade dress ที่คัดลอกจาก Gather, Hideout หรือ pitch deck

---

## 4. Non-Negotiable Experience Invariants

ข้อเหล่านี้สำคัญกว่าความสวยหรือความเร็วในการเพิ่ม feature:

1. **Identity stays masked before mutual consent.** Recruiter view ก่อน match ต้องไม่มีชื่อ รูป อีเมล เบอร์โทร resume ต้นฉบับ หรือ exact institution/employer
2. **World is optional.** ทุก core action ใน canvas ต้องทำผ่าน semantic Navigator/List Mode ได้
3. **No surprise media.** Mic/camera เริ่มปิด และไม่มี reveal, recording หรือ transcription อัตโนมัติ
4. **Mask fails closed.** ถ้าทำ demo video mask แล้ว pipeline หยุด ต้องหยุด video หรือแทนด้วย avatar ก่อนแสดง raw frame
5. **Decision is private.** ฝ่ายหนึ่งห้ามเห็นคำตอบอีกฝ่ายจนทั้งสองส่งหรือ workflow ปิด
6. **Mobile is complete.** ห้ามซ่อน core action ไว้หลัง hover, keyboard shortcut หรือ landscape-only layout
7. **Status is explicit.** Queue, network, media, save และ decision ต้องมี icon/label ไม่ใช้สีอย่างเดียว
8. **AI explains and defers.** แสดง evidence/reason และให้ผู้ใช้แก้ข้อมูลได้; เมื่อ unavailable ใช้ deterministic fallback
9. **Synthetic data only.** ใช้โดเมน `.test`, บริษัทและบุคคลสมมติเท่านั้น
10. **Truthful demo.** ทุก mock integration ต้องเห็น label โดยไม่ต้องเปิด DevTools

---

## 5. Canonical Demo Roles

| Role | Demo capability | Must not see/do |
|---|---|---|
| Candidate | onboarding, profile review, world/list, queue, interview, decision, reveal consent | recruiter rubric ส่วนตัว, decision ของอีกฝ่าย, candidate คนอื่น |
| Recruiter | availability, assigned job, queue/session, masked profile, interview, private decision | PII ก่อน reveal, raw resume, integrity timeline, candidate decision ก่อนปิดผล |
| Organizer | event health และ pause/resume ใน optional admin demo | เปิด PII หรือแก้ decision |
| Demo Controller | reset scenario, select preset และ simulate network/match outcome | ปรากฏเป็น production role หรืออยู่ใน navigation ของผู้ใช้จริง |

สำหรับ R0 ให้ Candidate และ Recruiter เป็น mandatory ส่วน Organizer/Demo Controller ใช้เฉพาะเมื่อช่วยให้ demo เสถียร

---

## 6. Canonical R0 Journeys

### 6.1 Candidate happy path

```text
/event/demo
  → /demo/verify
  → /candidate/profile/import
  → /candidate/profile/review
  → /candidate/avatar
  → /event/demo/world
  → /event/demo/booths/cyber-orchard/jobs/backend-developer
  → join queue
  → ready check
  → /interviews/demo-session
  → /decisions/demo-session
  → /matches/demo-match/reveal
```

### 6.2 Recruiter happy path

```text
/demo/role/recruiter
  → /recruiter/demo/dashboard
  → set availability AVAILABLE
  → accept dispatched session
  → /interviews/demo-session
  → submit private decision
  → view revealed fields only after candidate consent
```

### 6.3 Failure path required in the prototype

- Refresh ระหว่าง `QUEUED` แล้วกลับสู่ ticket เดิม
- Ready Check timeout แล้วเสนอ requeue โดยไม่กล่าวโทษ
- Media permission denied แล้วใช้ avatar/audio/text fallback
- Network offline แล้วแสดง persistent reconnect state และ resync เมื่อกลับมา
- No match แล้วไม่บอกว่าใครเลือก pass

---

## 7. Prototype State Contract

ใช้ enum และ transition ที่ชัดเจน ห้ามกระจาย boolean เช่น `isReady`, `wasReady`, `hasQueue` จนเกิด state ที่ขัดกัน

### 7.1 Event

```text
DRAFT → REGISTRATION_OPEN → LIVE ↔ PAUSED → ENDED
                                  ↘ CANCELLED
```

R0 เริ่ม preset ที่ `LIVE`; Demo Controller อาจสลับ `PAUSED` เพื่อโชว์ recovery

### 7.2 Queue ticket

```text
NONE → JOINING → QUEUED → READY_CHECK → ACCEPTED → PREFLIGHT → IN_INTERVIEW
                   │           │             │
                   │           ├→ SNOOZED ───┘
                   │           └→ EXPIRED → REQUEUE_AVAILABLE
                   └→ LEFT
```

Rules:

- Candidate มี active ticket ได้หนึ่งใบ
- `join` ต้อง idempotent
- queue position/ETA เป็น display estimate; state เป็น authoritative
- refresh recovery ต้องอ่าน ticket จาก demo repository/server ไม่สร้างใบใหม่
- background browser ไม่รับประกัน timer; กลับ foreground ต้อง resync deadline

### 7.3 Interview

```text
PREFLIGHT → LOBBY → CONNECTING → ACTIVE → WRAP_UP → COMPLETED
                           ↘ RECONNECTING ↗
                           ↘ CANCELLED
```

Timer มาจาก `startedAt`/`endsAt` ไม่ decrement อย่างเดียวใน client

### 7.4 Decision and reveal

```text
OPEN → CANDIDATE_SUBMITTED / RECRUITER_SUBMITTED
     → BOTH_SUBMITTED → MUTUAL_MATCH | NO_MATCH
MUTUAL_MATCH → REVEAL_PENDING → REVEALED
```

Decision payload ของแต่ละฝ่ายต้องเก็บแยก และ UI ห้าม derive ผลก่อน `BOTH_SUBMITTED`

---

## 8. Recommended Prototype Architecture

นี่คือ default เมื่อ repository ยังไม่มี framework ทีมเปลี่ยนได้ด้วย ADR สั้น ๆ หากมีเหตุผลชัดเจน

### 8.1 Baseline

- Vite + React + TypeScript สำหรับ client prototype
- React Router หรือ router เทียบเท่าสำหรับ route ที่แชร์/refresh ได้
- CSS custom properties สำหรับ token; CSS Modules หรือ scoped styles ที่ทีมใช้สม่ำเสมอ
- PixiJS/Phaser หรือ lightweight canvas renderer สำหรับ world เท่านั้น
- Semantic HTML/DOM overlay สำหรับ navigation, form, HUD, dialog, captions และ controls
- Reducer/state machine ต่อ feature; เพิ่ม state-machine library เฉพาะเมื่อช่วยลด complexity จริง
- Vitest + Testing Library สำหรับ unit/component
- Playwright สำหรับ critical E2E และ viewport smoke
- axe integration สำหรับ accessibility smoke

ห้ามเพิ่ม dependency เพียงเพื่อ component เล็กที่สร้างด้วย native HTML/CSS ได้ และห้ามใช้ canvas วาด form/text ที่จำเป็นต่อ task

### 8.2 Suggested source layout

```text
src/
  app/                 # router, providers, app shell, error boundary
  design-system/       # tokens, primitives, icons, focus/motion rules
  features/
    auth-demo/
    profile/
    world/
    navigator/
    booths/
    queue/
    interview/
    decision/
    recruiter/
  domain/              # types, enums, transitions, pure rules
  data/
    contracts/         # repository interfaces
    demo/              # synthetic fixtures + adapters
  game/                # renderer, map, avatar, collision, input adapter
  i18n/                # translation keys and locale setup
  test/                # helpers, a11y, fixtures
public/
  assets/              # original/licensed assets only
docs/
  decisions/           # ADR/assumption notes when implementation begins
```

### 8.3 Boundaries

```text
Route/Screen
  → feature controller/hook
    → domain command/query
      → repository interface
        → demo adapter now / API adapter later
```

- UI ห้ามเขียน queue/reveal rule เอง
- World และ Navigator อ่าน booth/job/queue source เดียวกัน
- Demo controls เรียก adapter อย่างชัดเจน ห้ามฝัง magic timeout ใน component
- Canvas รับเฉพาะ sanitized render model ไม่รับ PII
- Feature code ห้าม import fixture โดยตรง; import ผ่าน repository interface

### 8.4 Demo persistence

หากไม่มี backend ให้เก็บเฉพาะ **synthetic demo state** ใน namespaced storage เช่น `maskedmatch.demo.v1` และ sync สอง tab ด้วย `BroadcastChannel`

- มี schema version และ TTL
- มีปุ่ม `Reset demo`
- ห้ามเก็บ resume จริง, contact จริง, media blob หรือ token
- production adapter ต้องไม่ inherit policy ว่า local storage ปลอดภัย
- test ต้องพิสูจน์ว่า refresh ระหว่าง queue ไม่ duplicate ticket

หากทำ demo server ได้ทัน ให้ใช้ server เป็น state authority และคง repository contract เดิม

---

## 9. Demo Domain Fixtures

ใช้ข้อมูลจาก `DESIGN.md` เป็น canonical fixtures และรักษา ID ให้คงที่เพื่อ screenshot/E2E:

```text
event: event-neon-career-city
candidate alias: Candidate #8F3A
candidate email after reveal: candidate@example.test
company: Cyber Orchard Co. (company-cyber-orchard)
job: Backend Developer (job-backend-01)
recruiter: Recruiter #R12 / Hiring Team
queue ticket: queue-demo-001
interview: interview-demo-001
match: match-demo-001
```

Match score example `92/100` ต้องมีคำอธิบายจาก evidence เช่น Node.js, Queue Systems, IoT telemetry และบอกชัดว่าเป็น demo rule ไม่ใช่ผลตัดสินจ้างงาน

ห้ามเปลี่ยน seed ให้ใช้ชื่อบุคคลจริงเพื่อให้ demo “ดูสมจริง”

---

## 10. UI Implementation Contract

### 10.1 Design tokens

ใช้ token จาก `DESIGN.md`/Spec Section 10 ห้าม hard-code neon color ซ้ำใน component

ขั้นต่ำต้องมี:

```text
color.background.canvas
color.background.world
color.surface.default
color.surface.raised
color.brand.primary
color.brand.match
color.info
color.attention
color.status.success/warning/danger
color.text.primary/muted/onAccent
color.focus.ring
space.1..8
size.touch.minimum
motion.fast/normal
```

### 10.2 Component requirements

ทุก interactive component ต้องมีอย่างน้อย:

- semantic element ที่ถูกต้อง
- accessible name
- keyboard behavior
- `focus-visible`
- disabled/loading/error behavior ที่ไม่สื่อด้วยสีอย่างเดียว
- touch target อย่างน้อย 44×44 CSS px
- story/example สำหรับ default และ failure state

Ready Check ต้องเป็น `role="alertdialog"`, focus heading/description ก่อน และห้ามรับ Enter ที่หลุดมาจาก action ก่อนหน้า

### 10.3 Responsive rules

- Mobile เริ่มออกแบบที่ 390 px และยืนยัน reflow ที่ 320 px
- Desktop reference ที่ 1440×900; compact desktop ที่ 1024×768
- ใช้ `100dvh` และ safe-area insets บน mobile shell
- ไม่มี page-level horizontal scroll ที่ 320 px ยกเว้น world/code task เฉพาะส่วนพร้อม alternative
- Bottom sheet มีปุ่มเปิด/ปิด ไม่พึ่ง swipe
- Mobile world มี tap-to-move; joystick เป็น optional enhancement
- Desktop world รองรับ WASD/arrow และ click-to-move โดย shortcut remap/disable ได้
- Interview unmount world renderer เพื่อลด CPU/GPU

### 10.4 Localization

- Business/UI copy ใช้ translation key
- Thai เป็น default; English fixture ต้องทดสอบข้อความยาวขึ้น
- ใช้ `Intl` สำหรับเวลาและตัวเลข
- อย่าใช้ pixel font กับ body, error, form help, legal หรือ caption

---

## 11. AI and “Smart” Feature Contract

R0 ใช้ deterministic/hybrid demo เพื่อให้ผลทำซ้ำและอธิบายได้

### 11.1 Profile extraction

- ใช้ resume ตัวอย่างที่ bundled หรือ skill form
- จำลอง detection ของ name/email/institution ด้วย deterministic rules
- แสดง original/masked comparison และ confidence ต่อ field
- Candidate ต้องกด approve ก่อน publish
- ถ้า parser fail ให้กรอกเองได้

### 11.2 Job recommendation

ตัวอย่างสูตร demo:

```text
score = skill_overlap 60 + evidence_strength 25 + preference_fit 15
```

- Clamp 0–100
- แสดง 3 เหตุผลและ missing/uncertain evidence
- ห้ามใช้ชื่อ รูป อายุ เพศ สถาบัน exact หรือ protected attribute
- ห้ามซ่อนงานที่ score ต่ำ; recommendation เป็นการเรียง/อธิบาย ไม่ใช่ gate
- Agent ต้องเรียกผลนี้ว่า `demo match rule` หรือ `recommendation` ไม่ใช่ hiring decision

### 11.3 Generative AI, if added

- ต้องมี deterministic fallback
- ห้ามสร้าง claim ที่ไม่มี evidence
- Output ที่กระทบ profile ต้องให้ผู้ใช้ review
- Prompt/response log ห้ามมี PII จริงใน hackathon
- UI ต้องบอกเมื่อใช้ข้อมูลจำลองและเมื่อผลมีความไม่แน่นอน

---

## 12. Accessibility and Safety Gates

ก่อนเรียก slice ว่าเสร็จ ต้องตรวจ:

- ทำ task ได้ด้วย keyboard โดยไม่ติดใน canvas/dialog
- มี skip link `ข้ามโลกและเปิดโหมดรายการ`
- Focus order ตรงกับ visual order และคืน focus หลัง dialog/sheet
- Text/controls ไม่ถูก sticky HUD บังที่ 200% zoom
- 320 px ไม่มี horizontal page scroll ใน semantic flow
- Reduced motion ปิด particles, parallax, scanline animation และ camera shake
- Status มี label/icon ไม่ใช้สีอย่างเดียว
- Form error เชื่อมด้วย `aria-describedby`
- Live status เช่น queue/reconnect ประกาศอย่างเหมาะสมแต่ไม่ spam
- Video/audio control มี accessible name และสถานะปัจจุบัน
- No-match/reveal copy ไม่เปิดเผย private choice

Critical privacy/accessibility defect ห้ามแก้ด้วยการซ่อน test หรือเขียน waiver เอง ให้ลด feature หรือใช้ fallback ที่ปลอดภัย

---

## 13. Agent Working Method

### 13.1 Before coding

1. อ่าน section ที่เกี่ยวข้องในสเปกหลักและ `DESIGN.md`
2. ระบุ vertical slice, route, actor และ acceptance criteria
3. ตรวจไฟล์/โครงสร้างเดิมก่อนเพิ่ม dependency หรือ scaffold
4. บันทึก assumption ที่เปลี่ยน behavior อย่างมีนัยสำคัญ
5. เลือกทางที่ demo ได้จริงและย้อนกลับได้

### 13.2 During coding

- ทำหนึ่ง vertical slice ตั้งแต่ route → state → UI → failure → test
- แยก domain rule ออกจาก presentation
- ใช้ fixture IDs ที่กำหนด
- เพิ่ม loading/empty/error พร้อม happy path
- ตรวจ mobile ไปพร้อม desktop ไม่รอท้ายงาน
- รักษา diff เล็กและไม่แก้ไฟล์นอก scope
- ห้าม log payload ที่อาจเป็น PII/media token แม้ใน demo pattern

### 13.3 Before handing off

Agent ต้องรายงาน:

```text
Outcome:
Files changed:
Routes/scenarios covered:
Tests run and result:
Responsive/a11y checks:
Known mock behavior:
Remaining risks/next slice:
```

ห้ามรายงานว่า “complete” หาก build/test ที่เกี่ยวข้องยัง fail หรือ core flow ต้องใช้ DevTools แก้ state

---

## 14. Build Sequence

### Slice 0 — Foundation

- App shell, router, error boundary
- tokens, typography, button/card/dialog/sheet primitives
- demo repository, fixtures, reset and scenario switcher
- viewport and accessibility test harness

### Slice 1 — Event and profile

- Landing → mock verification → consent → skill/resume → masked review
- Candidate alias and profile approval state

### Slice 2 — World and discovery

- 1 original map, avatar movement and collision
- Navigator parity, booth/job details and recommendation explanation
- mobile tap-to-move and bottom sheet

### Slice 3 — Queue

- one active ticket, idempotent join, position/ETA
- Ready Check alertdialog, timeout/snooze/requeue
- refresh/background recovery

### Slice 4 — Interview

- preflight permissions and capability choice
- timer, mute/camera/avatar controls, low-bandwidth mode
- reconnect state and safe mask fallback

### Slice 5 — Decision and reveal

- candidate/recruiter private submission
- match/no-match outcomes
- field-level reveal and audit-style activity summary

### Slice 6 — Recruiter and demo polish

- recruiter dashboard and availability
- demo controller presets
- responsive, motion, sound opt-in, visual regression
- runbook, screenshots, pitch rehearsal

Do not start optional Main Stage, proximity voice, map builder, ATS or production identity until Slice 0–5 pass the demo gate.

---

## 15. Test Contract

### 15.1 Unit/domain

- redaction rule and profile approval
- match score/explanation
- queue idempotency and allowed transitions
- interview timer derived from timestamps
- decision privacy and reveal field filter

### 15.2 Component

- dialog/sheet focus and escape behavior
- queue chip live status
- booth CTA by state
- media permission/fallback controls
- reduced motion and high contrast classes

### 15.3 Critical E2E

1. Candidate happy path at desktop
2. Candidate landing → queue at 390 px touch viewport
3. 320 px semantic/List Mode flow
4. Refresh while queued retains ticket
5. Ready Check accept and timeout branches
6. Candidate/recruiter private decisions produce match only after both submit
7. No-match does not expose which side passed
8. Media denied uses fallback without blocking decision flow
9. Keyboard-only onboarding → queue → decision
10. Demo reset returns deterministic initial state

### 15.4 Required scripts after scaffold

Repository should expose equivalent scripts and document exact commands in README:

```text
dev
build
typecheck
lint
test
test:e2e
test:a11y
demo:reset or an equivalent visible reset control
```

Agent must run the narrowest relevant checks while iterating and the full build + critical E2E before final handoff.

---

## 16. Hackathon Demo Gate

Prototype พร้อมขึ้นเวทีเมื่อทุกข้อเป็นจริง:

- Cold start เปิดได้ด้วยคำสั่งที่ documented
- Demo data reset ได้ภายใน 10 วินาที
- เส้นทาง Candidate จบ Mutual Match ได้ภายใน 4–5 นาที
- Recruiter view เปิดในอีก tab/device และ state ตรงกัน
- Mobile 390 px ทำ core flow ได้ และ 320 px List Mode ไม่ล้น
- Queue refresh recovery และ Ready Check ทำงานซ้ำได้อย่าง deterministic
- AI/match มีเหตุผลที่อ่านเข้าใจ ไม่กล่าวอ้างเกินจริง
- ไม่มีข้อมูลจริง, secret, unlicensed asset หรือ third-party logo
- Mock integration และ limitation มองเห็นชัด
- Build, typecheck, critical tests และ accessibility smoke ผ่าน
- มี offline fallback เป็นวิดีโอ/ภาพสำรองของ demo เผื่อ network venue ล้ม

---

## 17. Stop Conditions

Agent ต้องหยุดและขอ decision เมื่อ:

- ต้องใช้ production credential, real PII หรือ account ภายนอกที่ทีมยังไม่อนุมัติ
- ต้องเปลี่ยน Blind Mode, reveal policy หรือ decision privacy
- design ต้องตัด Navigator/List Mode เพื่อให้ world เสร็จ
- ต้องใช้ asset ที่ license ไม่ชัด
- feature ต้องเปิด raw camera frame เมื่อ mask fail
- requirement ใหม่ทำให้ R0 core loop เสี่ยงไม่ทันโดยไม่มีสิ่งที่ตัดออก

ถ้าไม่เข้า stop condition ให้ดำเนินงานด้วย safe R0 default และบันทึก assumption แทนการหยุดถามเรื่องเล็กทุกจุด

---

## 18. Final Reminder

ชัยชนะของ prototype ไม่ได้อยู่ที่จำนวน feature แต่อยู่ที่กรรมการเห็นลูปนี้อย่างชัดเจน:

> **Skill evidence → fair discovery → real conversation → private mutual choice → consented reveal**

ทุกการตัดสินใจด้าน code และ UI ควรทำให้ลูปนี้เร็วขึ้น เชื่อถือได้ขึ้น เข้าถึงได้ขึ้น หรืออธิบายง่ายขึ้นบนเวที
