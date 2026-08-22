# 4. Detailed Screen Blueprints, Wireframes & Production Media (SC-01 to SC-17)

> **Visual Standard:** ทุกหน้าจอต้องใช้ **Generated Elements / Vector SVGs / Pixel Art** ในการแสดงผล **ห้ามใช้อิโมจิ** ในวัตถุ ตัวละคร บูธ หรือปุ่มบนเว็บ

---

## 4.1 Screen Inventory Overview

| Screen ID | Screen Title | Primary User Role | Route Path |
|---|---|---|---|
| **SC-01** | Event Landing | Candidate / Visitor | `/events/:id` หรือ `/event/demo` |
| **SC-02** | Digital ID Verification & Consent | Candidate | `/app/onboarding/verify` |
| **SC-03** | Resume / Skill Import | Candidate | `/candidate/profile/import` |
| **SC-04** | Masked Profile Review | Candidate | `/candidate/profile/review` |
| **SC-05** | Avatar & Tutorial | Candidate | `/candidate/avatar` |
| **SC-06** | Neon Career Hall World | Candidate | `/app/events/:id/world` |
| **SC-07** | Navigator / List Mode | Candidate | `/app/events/:id/navigator` |
| **SC-08** | Booth & Job Detail (Realistic Showcase) | Candidate | `/app/booths/:id` |
| **SC-09** | Queue HUD & Ready Check | Candidate | `/app/queue` |
| **SC-10** | Interview Preflight (Real Cam & Voice DSP) | Candidate & Recruiter | `/app/interviews/:id/preflight` |
| **SC-11** | Private Speed Interview (Realtime Face Mask) | Candidate & Recruiter | `/app/interviews/:id` |
| **SC-12** | Private Decision | Candidate & Recruiter | `/app/interviews/:id/decision` |
| **SC-13** | Result Summary | Candidate & Recruiter | `/app/matches/:id/result` |
| **SC-14** | Field-level Reveal Consent | Candidate | `/matches/:id/reveal` |
| **SC-15** | Recruiter Dashboard | Recruiter | `/recruiter/demo/dashboard` |
| **SC-16** | Organizer Live Operations | Event Organizer | `/ops/events/:id/live` |
| **SC-17** | Demo Controller | Demo Presenter | `/demo/control` |

---

## 4.2 Detailed Screen Wireframes & Specifications

### SC-01 — Event Landing & Multi-Role Demo Login
- **Goal:** แนะนำงาน, อธิบายหลักการ Blind Mode, และให้ผู้ใช้เลือกเข้าสู่ระบบจริง หรือกด 1-Click Demo Login ตามบทบาท
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ [SVG LOGO] MASKEDMATCH            [เข้าสู่ระบบ] [ช่วยเหลือ] │
├────────────────────────────────────────────────────────────┤
│ [DEMO ROLE SWITCHER BAR]                                   │
│ เลือกบทบาทเข้าใช้งาน (1-Click Demo Access):              │
│ [ 👤 ผู้สมัคร (Candidate) ] [ 💼 ผู้สัมภาษณ์ (Recruiter) ] [ ⚙️ ผู้ดูแลระบบ (Admin) ] │
├────────────────────────────────────────────────────────────┤
│                    NEON CAREER CITY 2026                   │
│          “ให้โอกาสเริ่มต้นจากทักษะ ก่อนตัดสินจากตัวตน”     │
│                                                            │
│       [ เข้าสู่ Demo Job Fair ]    [ ดูรายชื่อตำแหน่งงาน ]  │
│                                                            │
│ ┌──────────────────────┐  ┌──────────────────────────────┐ │
│ │ [ICON] 4 บริษัทชั้นนำ │  │ [ICON] Blind Mode: ปิดบังข้อมูล │ │
│ │ คิวสัมภาษณ์ 10–15 นาที │  │ แสดงเฉพาะทักษะและผลงานจริง   │ │
│ └──────────────────────┘  └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### SC-02 — Digital ID Verification & Consent
- **Goal:** ยืนยันตัวตนผ่านระบบ Digital ID (ติดป้าย DEMO) และขอความยินยอมตาม PDPA
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ ขั้นตอนที่ 1 จาก 3 : ยืนยันตัวตนและการยินยอม               │
├────────────────────────────────────────────────────────────┤
│ [ALERT ICON] โหมดสาธิต — ไม่ได้เชื่อมต่อ ThaID จริง        │
│                                                            │
│ กรุณาเลือกวิธีการยืนยันตัวตนจำลอง:                         │
│ (o) ยืนยันผ่าน ThaID Digital ID                       │
│ ( ) ยืนยันผ่าน Email OTP สำรอง                             │
│                                                            │
│ ความยินยอมในการประมวลผลข้อมูล (PDPA):                       │
│ [x] ยินยอมให้ AI สกัดทักษะจาก Resume (จำเป็น)              │
│ [x] ยินยอมให้เปิดกล้องและดัดแปลงภาพ/เสียงแบบ Real-time     │
│ [ ] ยินยอมรับข้อมูลข่าวสารงานเพิ่มเติม (ทางเลือก)           │
│                                                            │
│                    [ ถัดไป: นำเข้า Resume ]                │
└────────────────────────────────────────────────────────────┘
```

### SC-03 — Resume / Skill Import
- **Goal:** อัปโหลด Resume ตัวอย่าง หรือกรอกทักษะเพื่อสร้าง Profile

### SC-04 — Masked Profile Review
- **Goal:** ผู้สมัครตรวจสอบผลการปิดบังข้อมูลส่วนบุคคล (Side-by-Side Review) และกดยืนยัน

### SC-05 — Character Studio

- **Goal:** สร้าง avatar แบบ The Sims ก่อนเข้า World โดยแยก `skin`, `hair`, `top`, `bottom/trousers`, `shoes` และ `accessory`
- **Primary action:** `บันทึกตัวละครและเข้าสู่งาน`
- **Required controls:** Randomize, front/back/left/right preview, picker ของทุก layer และ back/recovery
- **Required states:** default, changed/unsaved, saved, invalid combination และ Reduced Motion
- **Desktop:** preview และ controls วางสองคอลัมน์; controls scroll โดย preview ยังมองเห็น
- **Mobile:** preview อยู่บน, direction selector ต่อด้วย category controls; save เป็น sticky action แต่ไม่บัง option สุดท้าย
- **Game contract:** preview ใช้ Dynamic Texture/compositor เดียวกับ player และ apply/persist จริง
- **Canonical visual details:** ดู [Character System](./world-and-scene-design.md#7-character-system--true-directional-sims-style-customization)

### SC-06 — Career Hall World

- **Goal:** เดินสำรวจ Career Hall, พบ NPC, เปิด booth/kiosk และเห็นสถานะ interaction
- **Primary actions:** เดิน, เปิด Navigator, เปิด booth detail, สนทนา, เปิด Character Studio
- **Required states:** loading, ready, selected booth, dialogue, queued, suspended, recoverable error
- **Input:** WASD/arrow, click/tap-to-move, `E`, pointer/touch และ semantic Navigator
- **Boundary:** Phaser แสดงโลกและ physics; HUD/panel/dialogue เป็น React DOM
- **Truthful scope:** ใช้คำว่า seamless/endless เฉพาะเมื่อ wrap/stream ทำงานจริง
- **Canonical camera/entity/physics details:** ดู [Game Visual & World Specification](./world-and-scene-design.md)

### SC-07 — Navigator / List Mode

- **Goal:** ค้นหา เปิด booth/job นำทาง และจัดการคิวโดยไม่ต้องควบคุม Canvas
- **Parity:** action สำคัญทุกอย่างของ SC-06 ต้องมี semantic equivalent ที่นี่

### SC-08 — Booth & Job Detail

- **Goal:** แสดง company/job, match evidence, recruiter state, queue size/ETA และ actions โดยไม่เผย PII
- **Primary action:** `เข้าคิวสัมภาษณ์ตำแหน่งนี้`; secondary action คือ `นำทางไปบูธ`
- **Required states:** available, busy, queued, queue unavailable, selected/navigating และ error
- **Visual boundary:** DOM card ไม่จำลอง booth sprite; anatomy/variant ของ booth ใน Canvas ใช้ [Modular Booth System](./world-and-scene-design.md#5-modular-booth-system-and-repeatable-variety)

### SC-09 — Queue HUD & Ready Check Alert
- **Goal:** แจ้งเตือนเมื่อถึงคิวสัมภาษณ์ด้วย Alert Dialog ที่เข้าถึงได้ (60 วินาที)

### SC-10 — Interview Preflight Check (Real Cam & Real Voice DSP)
- **Goal:** เปิดกล้องจริงผ่าน WebRTC, ทดสอบ Face Tracking Engine, ทดสอบ Voice Pitch Shift และตรวจความเสถียรเน็ต
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ เตรียมความพร้อมก่อนเข้าห้องสัมภาษณ์ (Realtime Privacy Check)│
├──────────────────────────────┬─────────────────────────────┤
│ กล้องจริง & Face Tracking:   │ การตั้งค่าความเป็นส่วนตัว:  │
│ ┌──────────────────────────┐ │ ไมโครโฟน: [Built-in Mic ▼]  │
│ │                          │ │ กล้องจริง: [FaceTime Cam ▼] │
│ │   [ REAL CAMERA STREAM ] │ │                             │
│ │   [ + 3D FOX MASK ON ]   │ │ โหมดภาพและหน้ากาก:          │
│ │   Tracking: 60 FPS Lock  │ │ (o) Realtime Face Mask (สด) │
│ └──────────────────────────┘ │ ( ) Avatar-only (ไม่เปิดกล้อง)│
│ [STATUS] Face Landmarks OK  │                               │
├──────────────────────────────┼─────────────────────────────┤
│ ทดสอบการดัดเสียงจริง (DSP): │ สัญญาณเครือข่าย & WebRTC:   │
│ [▶ ทดสอบพูดไมค์]             │ [SIGNAL ICON] ดีมาก (24ms)   │
│ เสียงที่ได้ยิน: [ดัดโทนต่ำลง]│ Fail-Closed Protection: เปิด│
├──────────────────────────────┴─────────────────────────────┤
│                     [ เข้าสู่ห้องสัมภาษณ์ ]                │
└────────────────────────────────────────────────────────────┘
```

### SC-11 — Private Speed Interview Room (Realtime Face Mask Engine)
- **Goal:** สัมภาษณ์ 10–15 นาที โดยกล้องส่งสัญญาณวิดีโอที่ครอบหน้ากากเรียลไทม์ และไมค์ดัดเสียงจริง
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ PRIVATE INTERVIEW • Backend Developer • 09:24 • Mask: Real  │
├──────────────────────────────┬─────────────────────────────┤
│ ผู้สมัคร (Candidate #8F3A)   │ ผู้สัมภาษณ์ (Cyber Orchard) │
│ ┌──────────────────────────┐ │ ┌─────────────────────────┐ │
│ │ REAL CAMERA FEED         │ │ │ RECRUITER VIDEO STREAM  │ │
│ │ + REALTIME ANIMAL MASK   │ │ │ Recruiter #R12          │ │
│ │ (Landmark Tracking On)   │ │ │ Cyber Orchard Co.       │ │
│ └──────────────────────────┘ │ └─────────────────────────┘ │
│ [MIC ON] Voice Altered (DSP) │ [MIC ON] Hiring Team        │
│ [STATUS] Fail-Closed Active  │                             │
├──────────────────────────────┴─────────────────────────────┤
│ หัวข้อสนทนา: อธิบายแนวทางการออกแบบ High-Throughput Queue    │
├────────────────────────────────────────────────────────────┤
│ [ปิดไมค์] [ปิดกล้อง] [สลับ Avatar-only] [คำบรรยาย] [จบห้อง] │
└────────────────────────────────────────────────────────────┘
```

### SC-12 — Private Decision
- **Goal:** ส่งผลการตัดสินใจส่วนตัว (`สนใจไปต่อ` หรือ `ยังไม่ไปต่อ`) แบบเข้ารหัส

### SC-13 — Result Summary
- **Goal:** แสดงผลลัพธ์ Mutual Match หรือ No-match อย่างสุภาพ

### SC-14 — Field-Level Reveal Consent
- **Goal:** ยืนยันการแชร์ข้อมูลรายฟิลด์ที่เลือกไว้ (Email, Phone, Portfolio, Resume)

### SC-15 — Recruiter Live Desk & Candidate Pipeline
- **Goal:** จัดการคิวสด, สลับสถานะความพร้อม, ตรวจสอบผู้สมัครในคิว, กดเรียกคิวคนถัดไป, ประเมินรูบริก และดูผลการ Match
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ RECRUITER DESK • Cyber Orchard Co. • Recruiter #R12    [⚙] │
├──────────────────────────────┬─────────────────────────────┤
│ สถานะของคุณ:                 │ บูธ & ตำแหน่งที่รับผิดชอบ:  │
│ (o) ● พร้อมรับคิว (Online)   │ • บูธ: Cyber Orchard (A1)   │
│ ( ) ◑ พักชั่วคราว (Break)    │ • งาน: Backend Developer    │
│ ( ) ○ ออฟไลน์ (Offline)      │                             │
├──────────────────────────────┴─────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐ │
│ │ คิวรอสัมภาษณ์สด (3 คนรออยู่)   [▶ เรียกผู้สมัครคนถัดไป]│ │
│ ├────────────────────────────────────────────────────────┤ │
│ │ 1. Candidate #8F3A (รอ 4m) • Match 92% • Node/Redis/IoT│ │
│ │ 2. Candidate #4B19 (รอ 8m) • Match 85% • Python/Kafka   │ │
│ │ 3. Candidate #E281 (รอ 12m)• Match 78% • Go/Postgres    │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ ผู้สมัครที่เกิด MUTUAL MATCH แล้ว (2 คน)               │ │
│ ├────────────────────────────────────────────────────────┤ │
│ │ • Candidate #8F3A: candidate@example.test | github.com   │ │
│ │ • Candidate #7C22: portfolio.dev/dev7c                   │ │
│ └────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### SC-16 — Website Admin & Live Operations Portal
- **Goal:** ติดตามภาพรวมงานแฟร์แบบ Real-time, จัดการบูธ, สั่ง Pause/Resume งานเมื่อฉุกเฉิน, ส่งข้อความประกาศด่วน และตรวจสอบความปลอดภัย
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ ADMIN & LIVE OPERATIONS PORTAL • Neon Career City 2026 [⚙] │
├────────────────────────────────────────────────────────────┤
│ สถิติระบบสด (Real-time Live Metrics):                      │
│ • ออนไลน์ในงาน (CCU): 428 คน   • คิวกำลังรอรวม: 18 คิว     │
│ • สัมภาษณ์สด: 12 ห้อง         • เกิด Mutual Match: 45 คู่  │
│ • สถานะระบบ: [● ปกติ 99.9%]   • CPU Server: 18%            │
├────────────────────────────────────────────────────────────┤
│ การควบคุมสถานการณ์ฉุกเฉิน (Emergency Event Controls):      │
│ [ ⏸ พักงานชั่วคราว (Pause Event) ] [ ▶ เปิดงานปกติ (Resume) ]│
│                                                            │
│ ส่งข้อความประกาศด่วนทุกคนในงาน (Live Broadcast Message):   │
│ [ ยินดีต้อนรับสู่งาน! รอบสัมภาษณ์พิเศษจะเริ่มเวลา 14:00 น. ]│
│ [ 📢 ส่งประกาศทันที ]                                      │
├────────────────────────────────────────────────────────────┤
│ จัดการบูธในงาน (Booth & Job Management):                   │
│ [x] Cyber Orchard (A1) — 2 ตำแหน่ง — คิวเปิด               │
│ [x] Riverbyte Studio (A2) — 1 ตำแหน่ง — คิวเปิด            │
│ [x] Apex Cloud Tech (B1) — 3 ตำแหน่ง — คิวเปิด             │
│ [x] SolarPulse Energy (B2) — 1 ตำแหน่ง — คิวเปิด           │
├────────────────────────────────────────────────────────────┤
│ ตรวจสอบรายงานปัญหา (User Reports & Incidents):             │
│ • รายงานทั้งหมด: 0 รายการค้าง • Audit Log: [ ตรวจสอบ ]     │
└────────────────────────────────────────────────────────────┘
```

### SC-17 — Demo Controller (Hidden Screen)
- **Goal:** ควบคุมการสาธิตบนเวที, สลับ Scenario Presets, และ Reset Data ภายใน 10 วินาที
- **Route:** `/demo/control`
