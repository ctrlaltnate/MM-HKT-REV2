# 1. Security, Privacy & PDPA Compliance

> **หมายเหตุ:** ส่วนนี้เป็นข้อกำหนดทางวิศวกรรมและความปลอดภัยของระบบ ไม่ใช่คำปรึกษาทางกฎหมายโดยตรง ระบบก่อนเปิดใช้งานในระดับ Production ต้องผ่านการตรวจสอบจาก Data Protection Officer (DPO) และฝ่ายกฎหมาย

---

## 1.1 Data Protection & PDPA Controls

- **Record of Processing Activities (RoPA):** มีการบันทึกรายการกิจกรรมประมวลผลข้อมูลส่วนบุคคลอย่างละเอียด
- **Purpose Limitation & Data Minimization:** เก็บและประมวลผลเฉพาะข้อมูลที่จำเป็นต่อวัตถุประสงค์การสมัครงานและการประเมินทักษะ
- **Separate Identity Vault:** แยกการจัดเก็บข้อมูล PII และหมายเลขประจำตัวประชาชน ออกจากฐานข้อมูล World และ Matching โดยใช้ Encryption Key และ Credential คนละชุด
- **Field-Level Access Control:** การเข้าถึงข้อมูลผู้สมัครในแต่ละขั้นตอนถูกจำกัดอย่างเข้มงวด (Recruiter ไม่สามารถเข้าถึงข้อมูลติดต่อได้ก่อน Mutual Match)
- **Data Subject Rights (DSAR):** มี Workflow รองรับการขอเข้าถึง, ขอแก้ไข, ขอถอนความยินยอม, และขอลบข้อมูลส่วนบุคคล (Right to be Forgotten)

---

## 1.2 Consent Withdrawal Workflow

การถอนความยินยอม (Consent Withdrawal) ต้องมีผลทันทีผ่านกระบวนการที่เป็นรูปธรรม:

| วัตถุประสงค์ที่ถูกถอน | ผลกระทบต่อระบบในทันที | ผลลัพธ์ที่ผู้ใช้มองเห็น |
|---|---|---|
| **บัญชี / การเข้าร่วมงาน** | ยกเลิก Auth, Realtime และ Media Token; ยกเลิกคิวที่ค้างอยู่; ออกจากห้องอย่างปลอดภัย | แสดงหน้าจอยืนยันผลกระทบ และส่งสถานะคำขอลบข้อมูล |
| **การประมวลผล Resume / Profile** | หยุด Worker, ยกเลิกการ Publish Profile, ยกเลิกผลการ Match | แสดงผลว่าตำแหน่งงานหรือคิวใดได้รับผลกระทบ |
| **กล้อง / หน้ากาก / เสียง** | ระงับ Video Track และสลับเป็นโหมด `AVATAR_ONLY` หรือ `AUDIO_ONLY` | การสัมภาษณ์ดำเนินต่อได้ตามปกติโดยไม่มีบทลงโทษ |
| **การบันทึกเสียง / ถอดความ** | หยุดการบันทึกทันที, ยกเลิก Background Processing Job | ไอคอนสถานะการบันทึกหายไป และขึ้นข้อความยืนยัน |
| **การเปิดเผยข้อมูล (Reveal Grant)**| เพิกถอน Token การเข้าถึงในอนาคตทันที และบันทึก Audit | แจ้งผู้ใช้ว่าไฟล์ที่บริษัทดาวน์โหลดไปก่อนหน้าไม่สามารถดึงกลับได้ |

---

## 1.3 Break-Glass Access Workflow

กระบวนการเข้าถึงข้อมูลฉุกเฉินสำหรับ Moderator / Support (`REQUESTED → APPROVED → ACTIVE → EXPIRED/REVOKED`):

```text
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│ 1. Request Break-Glass │ ───►  │ 2. Independent Approval│ ───►  │ 3. Time-bounded Access │
│ (Reason + Fields + TTL)│       │ (DPO / Incident Lead)  │       │ (Read-only Token ≤30m) │
└────────────────────────┘       └────────────────────────┘       └───────────┬────────────┘
                                                                              │
                                 ┌────────────────────────┐                   ▼
                                 │ 5. Notify Auditor & DPO│ ◄───  ┌────────────────────────┐
                                 │ (Tamper-evident log)   │       │ 4. Auto Expire/Revoke  │
                                 └────────────────────────┘       └────────────────────────┘
```

- **Two-Person Rule:** ผู้ยื่นคำขอ **ห้าม** เป็นผู้อนุมัติคำขอตนเอง
- **Strict Scope & TTL:** กำหนดระยะเวลาใช้งานสูงสุดไม่เกิน 30 นาที และเข้าถึงได้เฉพาะฟิลด์ที่จำเป็นต่อ Incident นั้นๆ
- **Immutable Audit:** ทุกการเรียกดูข้อมูลจะถูกบันทึกใน Audit Log และส่งการแจ้งเตือนไปยัง Auditor ทันที

---

## 1.4 Security Threat Model Shortlist

| ภัยคุกคาม (Threat) | มาตรการควบคุมและป้องกัน (Security Control) |
|---|---|
| **Resume รั่วไหล PII ผ่าน Metadata / Links** | Strip Document Properties, EXIF, ใช้ Privacy Preview Proxy สำหรับลิงก์ภายนอก |
| **Recruiter สุ่มหา ID ผู้สมัคร (Enumeration)** | ใช้ Opaque Random Identifier ร่วมกับ Rate Limiting และสิทธิ์ตาม Tenant |
| **การแย่งคิว / แทรกคิว (Queue Tampering)** | Server-Authoritative Timestamp, FIFO Queue DB Transaction, Idempotency Keys |
| **ผลการตัดสินใจรั่วไหลก่อนส่งครบ** | เข้ารหัสคำตอบของแต่ละฝ่าย และประมวลผลพร้อมกันเฉพาะใน Resolver Transaction |
| **การเข้าถึงข้อมูลติดต่อโดยไม่ได้รับอนุญาต** | Field-Scoped Short-Lived Access Token พร้อม Consent Verification |
| **การคุกคามในงาน (Harassment / Abuse)** | ระบบรายงานปัญหา (Report), พักการใช้งานชั่วคราว, Mute เสียง, และบันทึก Audit |
| **Client ปลอมแปลงตำแหน่งในโลกจำลอง** | Server-Authoritative Movement Resolution พร้อม Speed & Collision Clamping |
| **การแทรกซึมห้องสัมภาษณ์ (Room Hijack)** | Short-lived Room-Scoped WebRTC Token ที่ผูกกับรหัส Session โดยเฉพาะ |
| **Prompt Injection ผ่านไฟล์ Resume / JD** | แยก Parser Sandbox, จำกัดสิทธิ์การเรียก Tool, ตรวจสอบ Schema ของผลลัพธ์ |
| **ความลับรั่วไหลใน Log / Telemetry** | Structured Allowlist Logging ห้ามบันทึก Resume Text, Contact, Media, Decision |

---

## 1.5 Media Privacy, Face Tracking & Trust Design

- **On-Device Face Landmark Engine:** การประมวลผล Face Mesh / Landmark Detection จากกล้องจริงทำงานบนอุปกรณ์ของผู้ใช้ (Client-Side) 100% โดย **ห้ามส่งภาพใบหน้าจริงหรือพิกัด Landmark ดิบขึ้นเซิร์ฟเวอร์**
- **Fail-Closed Principle:** หาก Face Tracking หรือ Mask Compositor ทำงานล้มเหลว (เช่น หันหน้าหลุดเฟรม หรือกล้องกระตุกเกิน 3 เฟรม) ระบบจะระงับการส่งสัญญาณภาพวิดีโอทันที เพื่อป้องกันไม่ให้ใบหน้าจริงหลุดออกไป
- **Zero Recording by Default:** ปิดการบันทึกวิดีโอและเสียงในทุกกรณี เว้นแต่จะมีความยินยอมชัดเจน
- **Persistent Trust Signals:** แสดงสถานะ Blind Mode, สถานะกล้อง/ไมค์, สถานะหน้ากาก, และป้ายเตือนโหมดจำลองตลอดเวลา
- **Prohibited UI Dark Patterns:**
  - ✕ ห้ามทำ Pre-checked Checkbox สำหรับการเปิดเผยข้อมูลติดต่อ
  - ✕ ห้ามใช้อิโมจิในองค์ประกอบ UI หรือหลอกลวงว่าเป็นฟังก์ชันความปลอดภัย
  - ✕ ห้ามใช้ปุ่มหลอกตาที่ทำให้ปุ่ม `สนใจไปต่อ` เด่นจนเหมือนบังคับ
  - ✕ ห้ามส่งข้อมูล PII ใน Error Toast, URL Parameters, หรือ Debug Panel
