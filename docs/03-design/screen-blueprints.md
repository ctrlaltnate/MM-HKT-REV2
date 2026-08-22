# 4. Detailed Screen Blueprints & Wireframes (SC-01 to SC-17)

---

## 4.1 Screen Inventory Overview

| Screen ID | Screen Title | Primary User Role | Route Path |
|---|---|---|---|
| **SC-01** | Event Landing | Candidate / Visitor | `/events/:id` หรือ `/event/demo` |
| **SC-02** | Mock Verification & Consent | Candidate | `/app/onboarding/verify` |
| **SC-03** | Resume / Skill Import | Candidate | `/candidate/profile/import` |
| **SC-04** | Masked Profile Review | Candidate | `/candidate/profile/review` |
| **SC-05** | Avatar & Tutorial | Candidate | `/candidate/avatar` |
| **SC-06** | Neon Career Hall World | Candidate | `/app/events/:id/world` |
| **SC-07** | Navigator / List Mode | Candidate | `/app/events/:id/navigator` |
| **SC-08** | Booth & Job Detail | Candidate | `/app/booths/:id` |
| **SC-09** | Queue HUD & Ready Check | Candidate | `/app/queue` |
| **SC-10** | Interview Preflight | Candidate & Recruiter | `/app/interviews/:id/preflight` |
| **SC-11** | Private Speed Interview | Candidate & Recruiter | `/app/interviews/:id` |
| **SC-12** | Private Decision | Candidate & Recruiter | `/app/interviews/:id/decision` |
| **SC-13** | Result Summary | Candidate & Recruiter | `/app/matches/:id/result` |
| **SC-14** | Field-level Reveal Consent | Candidate | `/matches/:id/reveal` |
| **SC-15** | Recruiter Dashboard | Recruiter | `/recruiter/demo/dashboard` |
| **SC-16** | Organizer Live Operations | Event Organizer | `/ops/events/:id/live` |
| **SC-17** | Demo Controller | Demo Presenter | `/demo/control` |

---

## 4.2 Detailed Screen Wireframes & Specifications

### SC-01 — Event Landing
- **Goal:** แนะนำงาน, อธิบายหลักการ Blind Mode, และให้ผู้ใช้เข้าสู่ระบบ
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ MASKEDMATCH                     [เข้าสู่ระบบ] [ช่วยเหลือ] │
├────────────────────────────────────────────────────────────┤
│                    NEON CAREER CITY 2026                   │
│          “ให้โอกาสเริ่มต้นจากทักษะ ก่อนตัดสินจากตัวตน”     │
│                                                            │
│       [ เข้าสู่ Demo Job Fair ]    [ ดูรายชื่อตำแหน่งงาน ]  │
│                                                            │
│ ┌──────────────────────┐  ┌──────────────────────────────┐ │
│ │  4 บริษัทชั้นนำเปิดรับ │  │  Blind Mode: ปิดบังประวัติ  │ │
│ │  คิวสัมภาษณ์ 10–15 นาที │  │  แสดงเฉพาะทักษะและผลงานจริง │ │
│ └──────────────────────┘  └──────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

### SC-02 — Mock Verification & Consent
- **Goal:** ยืนยันตัวตนแบบจำลอง (ติดป้าย DEMO) และขอความยินยอมตาม PDPA
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ ขั้นตอนที่ 1 จาก 3 : ยืนยันตัวตนและการยินยอม               │
├────────────────────────────────────────────────────────────┤
│ [!] โหมดสาธิต — ไม่ได้เชื่อมต่อ ThaID จริง                 │
│                                                            │
│ กรุณาเลือกวิธีการยืนยันตัวตนจำลอง:                         │
│ (o) จำลองยืนยันผ่าน ThaID Digital ID                       │
│ ( ) ยืนยันผ่าน Email OTP สำรอง                             │
│                                                            │
│ ความยินยอมในการประมวลผลข้อมูล (PDPA):                       │
│ [x] ยินยอมให้ AI สกัดทักษะจาก Resume (จำเป็น)              │
│ [x] ยินยอมให้สตรีมเสียง/วิดีโอแบบ Anonymized (จำเป็น)      │
│ [ ] ยินยอมรับข้อมูลข่าวสารงานเพิ่มเติม (ทางเลือก)           │
│                                                            │
│                    [ ถัดไป: นำเข้า Resume ]                │
└────────────────────────────────────────────────────────────┘
```

### SC-03 — Resume / Skill Import
- **Goal:** อัปโหลด Resume ตัวอย่าง หรือกรอกทักษะเพื่อสร้าง Profile
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ ขั้นตอนที่ 2 จาก 3 : นำเข้าข้อมูลทักษะและผลงาน             │
├────────────────────────────────────────────────────────────┤
│ [ ใช้ Resume ตัวอย่างสำหรับการทดสอบ ]                      │
│                                                            │
│ หรืออัปโหลดไฟล์ (PDF, DOCX ขนาดไม่เกิน 5MB):               │
│ ┌────────────────────────────────────────────────────────┐ │
│ │  ลากไฟล์มาวางที่นี่ หรือ [เลือกไฟล์จากเครื่อง]          │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│                      [ ประมวลผลและปิดบังข้อมูล ]            │
└────────────────────────────────────────────────────────────┘
```

### SC-04 — Masked Profile Review
- **Goal:** ผู้สมัครตรวจสอบผลการปิดบังข้อมูลส่วนบุคคล (Side-by-Side Review) และกดยืนยัน
- **Wireframe:**
```text
┌──────────────────────── Original ────────────────────────┐
│ Candidate Demo • candidate@example.test • University X │
│ Built an IoT telemetry pipeline handling 2M events/day  │
└───────────────────────────────────────────────────────────┘
                         ↓
┌──────────────────── Masked Profile Preview ───────────────┐
│ Candidate #8F3A • [Contact Hidden] • [Institution Hidden] │
│ ทักษะ: Node.js, MQTT, Redis, Queue Systems                │
│ หลักฐาน: Built an IoT telemetry pipeline (2M events/day)  │
│                                                           │
│ [ ข้อมูลถูกต้องและอนุมัติ ]    [ แก้ไขข้อมูล ]            │
└───────────────────────────────────────────────────────────┘
```

### SC-05 — Avatar & Tutorial
- **Goal:** เลือกตัวละครสัตว์และเรียนรู้วิธีควบคุม (WASD/ลูกศร หรือ Tap-to-move)
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ ขั้นตอนที่ 3 จาก 3 : เลือก Avatar และวิธีควบคุม             │
├────────────────────────────────────────────────────────────┤
│ เลือก Avatar ของคุณ:                                       │
│ [ (Fox) จิ้งจอก ]  [ (Cat) แมว ]  [ (Bear) หมี ]  [ (Owl) ] │
│                                                            │
│ วิธีการเดินในงาน:                                          │
│ • คอมพิวเตอร์: ใช้ปุ่ม WASD, ลูกศร หรือคลิกบนแผนที่        │
│ • มือถือ: แตะจุดหมายปลายทางที่ต้องการเดินไป                │
│ • ไม่ต้องการเดิน? สามารถเปิด [โหมดรายการ (Navigator)] ได้ │
│                                                            │
│                    [ เข้าสู่งาน Neon Career Hall ]         │
└────────────────────────────────────────────────────────────┘
```

### SC-06 — Neon Career Hall World
- **Goal:** เดินสำรวจบูธ, พบปะ NPC, และเข้าใกล้บูธเพื่อดูงานที่แนะนำ
- **Wireframe:** แสดงผลตามโครงสร้าง 2.3 และ 2.4 ใน Information Architecture

### SC-07 — Navigator / List Mode
- **Goal:** สำรวจและเข้าถึงทุกฟังก์ชันในงานโดยไม่ต้องควบคุม Canvas
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ NAVIGATOR / LIST MODE                     [กลับโหมดแผนที่] │
├────────────────────────────────────────────────────────────┤
│ [ ค้นหาตำแหน่งงานหรือชื่อบริษัท...                       ] │
│                                                            │
│ ★ งานที่แนะนำสำหรับคุณ (ตรงกับทักษะ 92%):                   │
│ ┌────────────────────────────────────────────────────────┐ │
│ │ Cyber Orchard Co. — Backend Developer                  │ │
│ │ • Node.js, Queue Systems, IoT Telemetry                │ │
│ │ • รอสัมภาษณ์ประมาณ 8–12 นาที (คิวว่าง 3 คน)             │ │
│ │ [ ดูรายละเอียดงาน ]    [ เข้าคิวสัมภาษณ์ทันที ]        │ │
│ └────────────────────────────────────────────────────────┘ │
│                                                            │
│ บูธทั้งหมดในงาน (4 บูธ):                                   │
│ 1. Cyber Orchard Co. (IoT & Cloud)                         │
│ 2. Riverbyte Studio (Creative Tech)                        │
│ 3. Apex Cloud Tech (Infra & Security)                      │
│ 4. SolarPulse Energy (GreenTech)                           │
└────────────────────────────────────────────────────────────┘
```

### SC-08 — Booth & Job Detail
- **Goal:** ดูรายละเอียดงาน, คะแนน Skill Match พร้อมคำอธิบาย, และกดเข้าคิว
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ Cyber Orchard Co. • บูธหมายเลข A1                      [×] │
├────────────────────────────────────────────────────────────┤
│ ตำแหน่ง: Backend Developer (Hybrid / กทม.)                 │
│ เงินเดือนจำลอง: 45,000 – 70,000 บาท                        │
│                                                            │
│ ความตรงกันของทักษะ: 92/100 (คำนวณจากหลักฐานใน Profile)    │
│ • เหตุผล: มีทักษะ Node.js ตรงกับความต้องการหลัก            │
│ • มีประสบการณ์ระบบ Queue และ Redis                         │
│ • มีผลงานด้าน IoT ตรงกับผลิตภัณฑ์ของบริษัท                │
│                                                            │
│ สถานะคิว: รอ 3 คน (~8–12 นาที) • เวลาสัมภาษณ์: 12 นาที     │
│                                                            │
│                 [ เข้าคิวสัมภาษณ์ตำแหน่งนี้ ]              │
└────────────────────────────────────────────────────────────┘
```

### SC-09 — Queue HUD & Ready Check Alert
- **Goal:** แจ้งเตือนเมื่อถึงคิวสัมภาษณ์ด้วย Alert Dialog ที่เข้าถึงได้ (60 วินาที)
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ [!] ถึงคิวสัมภาษณ์ของคุณแล้ว! (Cyber Orchard Co.)          │
├────────────────────────────────────────────────────────────┤
│ ตำแหน่ง: Backend Developer                                 │
│ กรุณากดยืนยันความพร้อมภายใน: 00:48 วินาที                  │
│                                                            │
│         [ พร้อมสัมภาษณ์ทันที ]    [ ขอเลื่อน 1 ครั้ง ]     │
│                                                            │
│ ต้องการความช่วยเหลือด้านอุปกรณ์? [ติดต่อ Support]           │
└────────────────────────────────────────────────────────────┘
```

### SC-10 — Interview Preflight Check
- **Goal:** ตรวจสอบความพร้อมของไมค์ กล้อง โหมดหน้ากาก และสัญญาณเน็ต
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ เตรียมความพร้อมก่อนเข้าห้องสัมภาษณ์                        │
├──────────────────────────────┬─────────────────────────────┤
│ ตัวอย่างภาพของคุณ:           │ การตั้งค่าความเป็นส่วนตัว:  │
│ ┌──────────────────────────┐ │ ไมโครโฟน: [Default Mic ▼]   │
│ │                          │ │ กล้อง: [FaceTime Cam ▼]     │
│ │   [ Animal Mask Active ] │ │                             │
│ │   (หน้ากากจิ้งจอกจำลอง)  │ │ โหมดภาพ:                    │
│ │                          │ │ (o) หน้ากากสัตว์จำลอง       │
│ └──────────────────────────┘ │ ( ) Avatar-only (ไม่เปิดกล้อง)│
├──────────────────────────────┴─────────────────────────────┤
│ สัญญาณเครือข่าย: ดีมาก (Ping 24ms)                         │
│                     [ เข้าสู่ห้องสัมภาษณ์ ]                │
└────────────────────────────────────────────────────────────┘
```

### SC-11 — Private Speed Interview Room
- **Goal:** สัมภาษณ์ 10–15 นาที โดยทั้งสองฝ่ายมองเห็นเฉพาะข้อมูล Masked
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ PRIVATE INTERVIEW • Backend Developer • 09:24 • Mask: Active│
├──────────────────────────────┬─────────────────────────────┤
│ ผู้สมัคร (Candidate #8F3A)   │ ผู้สัมภาษณ์ (Cyber Orchard) │
│ ┌──────────────────────────┐ │ ┌─────────────────────────┐ │
│ │                          │ │ │                         │ │
│ │   [ Masked Video Cam ]   │ │ │   [ Recruiter Video ]   │ │
│ │                          │ │ │                         │ │
│ └──────────────────────────┘ │ └─────────────────────────┘ │
│ ไมค์: เปิด • เสียง: ปกติ     │ ไมค์: เปิด                  │
├──────────────────────────────┴─────────────────────────────┤
│ หัวข้อสนทนา: ออกแบบสถาปัตยกรรม IoT Pipeline ที่รองรับ High Load│
├────────────────────────────────────────────────────────────┤
│ [ปิดไมค์] [ปิดกล้อง] [โหมด Avatar] [คำบรรยายสด] [ออกจากห้อง]│
└────────────────────────────────────────────────────────────┘
```

### SC-12 — Private Decision
- **Goal:** ส่งผลการตัดสินใจส่วนตัว (`สนใจไปต่อ` หรือ `ยังไม่ไปต่อ`)
- **Wireframe:**
```text
┌────────────────────────────────────────────────────────────┐
│ สิ้นสุดการสัมภาษณ์ — กรุณาส่งผลการตัดสินใจ                │
├────────────────────────────────────────────────────────────┤
│ การตัดสินใจนี้เป็นความลับ อีกฝ่ายจะไม่เห็นคำตอบของคุณ       │
│ จนกว่าทั้งสองฝ่ายจะส่งคำตอบครบ                             │
│                                                            │
│ คุณสนใจที่จะไปต่อในขั้นตอนถัดไปกับตำแหน่งนี้หรือไม่?        │
│                                                            │
│           [ ยังไม่สนใจไปต่อ ]    [ สนใจไปต่อ ]             │
└────────────────────────────────────────────────────────────┘
```

### SC-13 — Result Summary
- **Goal:** แสดงผลลัพธ์ Mutual Match หรือ No-match อย่างสุภาพ
- **Wireframe (กรณี Mutual Match):**
```text
┌────────────────────────────────────────────────────────────┐
│                       🎉 MUTUAL MATCH!                     │
│                  ทั้งสองฝ่ายให้ความสนใจตรงกัน!             │
├────────────────────────────────────────────────────────────┤
│ Cyber Orchard Co. ต้องการนัดหมายสัมภาษณ์รอบถัดไปกับคุณ     │
│                                                            │
│ กรุณาเลือกข้อมูลติดต่อที่คุณยินยอมเปิดเผยให้บริษัท:         │
│ [x] อีเมล (candidate@example.test)                         │
│ [x] ลิงก์ Portfolio / Github                               │
│ [ ] เบอร์โทรศัพท์มือถือ                                    │
│ [ ] Resume ฉบับเต็ม                                        │
│                                                            │
│                   [ ยืนยันการแชร์ข้อมูล ]                  │
└────────────────────────────────────────────────────────────┘
```

### SC-14 — Field-Level Reveal Consent
- **Goal:** ยืนยันการแชร์ข้อมูลรายฟิลด์ที่เลือกไว้ และรับข้อมูลติดต่อผู้รับผิดชอบฝั่งบริษัท

### SC-15 — Recruiter Dashboard
- **Goal:** จัดการคิว, ตรวจสอบผู้สมัคร, ประเมิน Rubric, และส่งผลการตัดสินใจ

### SC-16 — Organizer Live Operations
- **Goal:** ติดตามภาพรวม Event, Capacity, จัดการ Incident, และ Broadcast ประกาศ

### SC-17 — Demo Controller (Hidden Screen)
- **Goal:** ควบคุมการสาธิตบนเวที, สลับ Scenario Presets, และ Reset Data ภายใน 10 วินาที

---

## 4.3 Interaction Naming Standard & Transition Map

### Interaction Naming Convention
- **Action Trigger:** `ACT/JOIN_QUEUE`, `ACT/ACCEPT_READY_CHECK`, `ACT/ENABLE_AVATAR_ONLY`, `ACT/SUBMIT_DECISION`, `ACT/CONFIRM_REVEAL`
- **System Event:** `SYS/QUEUE_POSITION_UPDATED`, `SYS/NETWORK_RECONNECTING`, `SYS/MUTUAL_MATCHED`

### Demo Prototype Transition Flow
```text
SC-01 (Landing CTA)
  → SC-02 (Verify Success)
  → SC-03 (Use Sample Resume)
  → SC-04 (Approve Masked Profile)
  → SC-05 (Choose Avatar)
  → SC-06 (Enter World / Follow Marker)
  → SC-08 (Inspect Job Details)
  → SC-09 (Join Queue & Receive Ready Check)
  → SC-10 (Preflight Check)
  → SC-11 (Complete Interview)
  → SC-12 (Submit Candidate Decision)
  → SC-15 (Recruiter Submits Decision)
  → SC-13 (Mutual Match Celebrated)
  → SC-14 (Select Email + Portfolio to Reveal)
  → Next-Step Success
```
