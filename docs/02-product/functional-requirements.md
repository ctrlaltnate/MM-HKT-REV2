# 3. Functional Requirements Specification

> เว้นแต่ระบุเป็นอย่างอื่น Requirement ในเอกสารนี้ใช้เกณฑ์:
> - **P0** = Pilot / Core Blocker (จำเป็นต้องมี)
> - **P1** = Quality / Extended Feature (ควรมี หากเว้นต้องมี Waiver)
> - **P2** = Post-Pilot / Feature-flagged (ส่วนต่อขยาย)
> - **R0** = Hackathon Prototype Mandatory Requirement

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
| **FR-WORLD-001** | P0 | Top-down 2D map ใช้ server-authoritative zone/instance และ client-predicted movement |
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
| **FR-WORLD-015** | R0 | NPC crowd มีอย่างน้อย 12 ตัว/5 role silhouettes พร้อม synthetic dialogue; NPC ห้ามเปิด PII หรือแอบอ้างว่าเป็นผู้ใช้จริง |
| **FR-WORLD-016** | R0 | Camera-follow, click/tap movement และ NPC/prop animation ต้องใช้ time-based easing และรักษา input response; Reduced Motion ต้องมี stationary equivalent |
| **FR-WORLD-017** | R0 | Player/NPC/prop ต้องเป็น runtime layer แยกจาก environment และ depth-sort อย่างถูกต้องตามแกน Y |
| **FR-WORLD-018** | R0 | Generated/third-party world asset ทุกไฟล์ต้องมี provenance/allowed-use record และห้ามคัดลอก asset/trade dress จากภาพอ้างอิง |
| **FR-WORLD-019** | R0 | **Strict No-Emoji Policy:** ทุก Element ประกอบฉาก, พร็อพ, บูธ, ตัวละคร NPC, และ Web UI Icons ต้องเป็น **Generated Pixel Art / SVG Assets** ทั้งหมด ห้ามใช้อิโมจิ |
| **FR-WORLD-020** | R0 | **Realistic Booth Showcase:** ดีไซน์การเยี่ยมชมบูธต้องมีองค์ประกอบเสมือนจริง: เคาน์เตอร์ต้อนรับ, จอแสดง Tech Stack, สถานะคิวสด, และจุดประจำของ Recruiter |
| **FR-WORLD-021** | R0 | **8-Bit Character Studio (The Sims Customizer):** รองรับการเลือก/ปรับแต่งตัวละคร 8-bit (สีผิว, ทรงผม, เสื้อผ้า, หน้ากากสัตว์) พร้อมปุ่มสุ่ม (`Randomize 🎲`) และแสดงผล Live 8-Bit Animated Preview ใน Phaser Mini-Stage Canvas |

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
| **FR-REVEAL-001** | P0 | Mutual match ยังไม่ reveal อัตโนมัติ; ต้องผ่าน field-level consent |
| **FR-REVEAL-002** | P0 | Candidate เลือกเปิด email, phone, portfolio, full resume แยกกันได้ |
| **FR-REVEAL-003** | P0 | Recruiter เปิดเผยชื่อ/ตำแหน่ง/contact owner และ company next-step policy ตอบกลับ |
| **FR-REVEAL-004** | P0 | ทุก view/download/reveal ต้องมี audit event |
| **FR-REVEAL-005** | P0 | หากฝ่ายใดไม่ยืนยัน reveal ภายใน window ให้ match คงอยู่แบบ masked |
| **FR-REVEAL-006** | P1 | Candidate ถอน share สำหรับ future access ได้ โดยไม่ลบ audit ที่กฎหมายกำหนด |

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
| **FR-MOD-001** | P0 | ผู้ใช้ report harassment, impersonation, inappropriate content, privacy leak และ technical issue ได้ |
| **FR-MOD-002** | P0 | Moderator action: warn, mute world media, remove from zone, suspend event access; ทุก action มี reason/audit |
| **FR-MOD-003** | P0 | Break-glass access ต้องมี approval/reason, time limit (≤30 min) และ alert ถึง auditor |
| **FR-SUPPORT-001** | P0 | มี help route ที่ไม่ต้องควบคุม avatar และรองรับภาษาไทย/อังกฤษ |
| **FR-SUPPORT-002** | P1 | Accessibility request ติดต่อ support ก่อน event ได้โดยไม่เปิดเผย diagnosis เกินจำเป็น |

---

## 3.12 Notification System

| ID | Pri | Requirement Description |
|---|:---:|---|
| **FR-NOTIFY-001** | P0 | Critical in-app alert ต้องมี text, explicit action, deduplicated `message_id` และ accessible announcement |
| **FR-NOTIFY-002** | P0 | Notification payload/lock-screen preview ต้องไม่ใส่ PII, decision value หรือ reveal field |
| **FR-NOTIFY-003** | P0 | Channel preference, permission, unsubscribe และ read state ต้องเป็น user-controlled/idempotent |
| **FR-NOTIFY-004** | P0 | Web Push/email เป็น best-effort; missed delivery ต้องใช้ server resync + fair recovery ไม่ใช่ client heartbeat penalty |
