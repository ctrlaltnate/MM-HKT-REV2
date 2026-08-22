# 3. Users, Personas & Permission Matrix

---

## 3.1 Primary Personas & Design Jobs

### A. Candidate / Job Seeker
- **Goals & Needs:**
  - ค้นหาตำแหน่งงานที่ตรงทักษะและพิสูจน์ตนเองผ่านผลงานและบทสนทนาจริง
  - ต้องการความเท่าเทียม โดยไม่ถูกคัดออกจากอคติเรื่องเพศ อายุ สถาบัน หรือรูปลักษณ์
  - ควบคุมข้อมูลส่วนตัว (PII), กล้อง, เสียง และเลือก field ที่จะเปิดเผยหลัง match ได้
  - เห็นเหตุผลของคำแนะนำ AI และสามารถตรวจสอบ/แก้ไขข้อมูลที่ถูกสกัดผิดพลาดได้
- **Device Context:** สมาร์ทโฟนมือถือเป็นอุปกรณ์หลัก (Touch-first, 320–390 CSS px) หรือคอมพิวเตอร์/แท็บเล็ตที่มีความเสถียรของอินเทอร์เน็ตหลากหลาย
- **Key Design Jobs:**
  1. ยืนยันตัวตนผ่านระบบ Digital IDและตั้งค่าความเป็นส่วนตัว
  2. อัปโหลด/กรอก Resume และตรวจสอบ Masked Profile
  3. สำรวจบูธผ่าน Interactive World หรือ Navigator
  4. เข้าคิวสัมภาษณ์และรับ Ready Check
  5. สัมภาษณ์แบบ Speed Interview 10–15 นาทีพร้อม Privacy Fallback (Avatar-only)
  6. ส่งผลการตัดสินใจส่วนตัว ตรวจคำขอ field จาก Recruiter และ grant บางส่วน/ทั้งหมดหรือ deny

### B. Recruiter / Interviewer
- **Goals & Needs:**
  - ค้นพบผู้สมัครที่มีทักษะและหลักฐานผลงานตรงตาม Requirement ที่แท้จริง
  - จัดการเวลา availability, รับคิว, ทำการสัมภาษณ์ด้วย Structured Rubric
  - ส่งผลการตัดสินใจอย่างเป็นอิสระ โดยไม่เห็นผลของผู้สมัครก่อน
- **Safety Invariant:** **MUST NOT** เข้าถึง Original Resume, ชื่อ, รูป, เบอร์โทร หรือ PII ใดๆ ก่อนเกิด Mutual Match เมื่อ Job นั้นเปิด Blind Mode
- **Key Design Jobs:**
  1. ตั้งสถานะความพร้อม (`รับคิว`, `พัก`, `ออฟไลน์`)
  2. ดู Masked Profile และ Evidence-based Match Explanation
  3. สัมภาษณ์ผู้สมัครและจดบันทึก Rubric ส่วนตัว
  4. ส่งผลการตัดสินใจแบบ Private
  5. หลัง Mutual Match ส่ง `RevealRequest` ระบุ field + purpose แล้วรับเฉพาะข้อมูลที่ Candidate grant

### C. Company Admin
- **Goals & Needs:**
  - ยืนยันตัวตนองค์กร (Organization Verification)
  - สร้างและจัดการบูธ (Booth CRUD) และตำแหน่งงาน (Job Posting)
  - เชิญและจัดการสิทธิ์ของทีม Recruiter
  - ติดตาม Aggregate Funnel ของบริษัทโดยไม่ละเมิดสิทธิ์ข้อมูลส่วนบุคคล

### D. Event Organizer
- **Goals & Needs:**
  - สร้างและกำหนดค่า Event, แผนที่, โซน, กำหนดการ และนโยบาย (EventPolicy)
  - จัดสรรพื้นที่บูธของบริษัท และบริหารจัดการ Capacity
  - ดูแลสถานการณ์สด (Live Operations): Pause/Resume โซนหรือคิวเมื่อเกิดเหตุขัดข้อง
  - ประกาศข้อความฉุกเฉิน (Broadcast Message)

### E. Moderator / Support
- **Goals & Needs:**
  - รับเรื่องร้องเรียน (User Reports: Harassment, Impersonation, Leak, Technical)
  - ให้ความช่วยเหลือด้าน Accessibility และจัดการปัญหาเทคนิค
  - ย้ายหรือระงับผู้ใช้งานที่ทำผิดกฎ
- **Safety Invariant:** ไม่มีสิทธิ์ดู PII โดยปริยาย การเปิดดูข้อมูลต้องผ่านกระบวนการ **Break-Glass Access** ที่มี Approval และ Audit บันทึกเสมอ

### F. Auditor / Data Protection Officer (DPO)
- **Goals & Needs:**
  - ตรวจสอบ Consent Record, Reveal Log, Retention/Deletion Purge และ Access Log
  - ตรวจสอบรายงานความเป็นธรรม (Fairness & Disparity Report)
  - สิทธิ์ Read-only ตามขอบเขต และใช้ข้อมูล Pseudonymous/Aggregate เสมอ

---

## 3.2 Canonical Demo Roles (R0 Hackathon Prototype)

| Role | Demo capability | Must not see / do |
|---|---|---|
| **Candidate** | Onboarding, profile review, world/list, queue, interview, decision, reveal consent | Recruiter rubric ส่วนตัว, decision ของอีกฝ่าย, ข้อมูล candidate คนอื่น |
| **Recruiter/Company** | Company/job/booth/showcase publication, availability, queue/session, masked profile, interview, private decision, reveal request/follow-up | PII ก่อน grant, raw resume, integrity timeline, candidate decision ก่อนปิดผล |
| **Organizer/Support** | Aggregate event/integration health, pause/resume/broadcast, moderation and support recovery | เปิด PII/private decision โดยไม่มี scoped break-glass หรือแก้ decision |
| **Demo Controller** | Reset scenario, select deterministic preset and speed scenario clock | ปรากฏเป็น production role, อยู่ใน navigation ผู้ใช้จริง หรือแก้ private state ผ่าน role UI |

---

## 3.3 RBAC Permission Matrix

| Capability | Candidate | Recruiter | Company Admin | Organizer | Moderator | Auditor |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **แก้ Candidate Profile ของตน** | ✓ (Own) | — | — | — | — | Read by policy |
| **ดู Masked Profile ก่อน match** | ✓ (Own) | Assigned only | Aggregate | — | Incident only | Controlled |
| **ดู Candidate PII ก่อน match** | ✓ (Own) | ✕ | ✕ | ✕ | ✕ | Legal scope only |
| **จัดการ Job / Booth** | — | Limited | ✓ | Approve | — | Read |
| **จัดการ Queue availability** | — | Own booth | Company | Override | Support | Read |
| **ส่ง interview decision** | ✓ (Own) | Assigned | ✕ | ✕ | ✕ | Read audit |
| **เปิดเผย contact หลัง consent** | ✓ (Controls) | Matched only | Matched pipeline | ✕ | ✕ | Read audit |
| **Pause event / zone** | — | — | Own booth request | ✓ | Emergency | — |
| **เปิด break-glass PII** | — | — | — | — | Approved only | Approved only |

### Security Principles:
1. **Deny by default** — ทุก Request ต้องถูกปฏิเสธจนกว่าจะมี Policy อนุญาต
2. **Least privilege** — ผู้ใช้และ Service เข้าถึงเฉพาะข้อมูลที่จำเป็นต่อ Role นั้นๆ
3. **Tenant isolation** — ข้อมูลของแต่ละบริษัท/องค์กรถูกแยกขาดจากกัน
4. **Field-level authorization** — การเข้าถึง Profile แยกสิทธิ์ราย Field ชัดเจน (เช่น ทักษะ vs ข้อมูลติดต่อ)

---

## 3.4 Target Multi-Role Demo and Three Production Workspaces

ส่วนนี้คือ completion target ตาม AC-41..44 ไม่ใช่คำกล่าวอ้างสถานะปัจจุบัน Demo ใช้ synthetic role entry และ shared scenario; connected mode ใช้ authentication/capability จริงผ่าน backend โดยหน้าจอและ canonical state เหมือนกัน ดูสถานะจริงที่ [Information Architecture](../03-design/information-architecture.md#f-r0-website-implementation-status-22-august-2026)

```mermaid
flowchart TD
    DEMO_BAR["Multi-Role Demo Login Bar (1-Click Switcher)"]
    
    DEMO_BAR -->|"1. เข้าเป็น Candidate"| JOBSEEKER["Job Seeker Workspace (/event/demo)\nMock verify + consent\nCV sample/upload/manual + masked review\nCharacter Studio + Hall/Navigator\nSingle queue + interview preflight\nPrivate decision\nReview recruiter request + grant subset"]

    DEMO_BAR -->|"2. เข้าเป็น Recruiter/Company"| RECRUITER["Recruiter/Company Workspace\nCompany + job/JD/salary/rubric\nBooth/showcase validate + publish\nAvailability + atomic queue claim\nInterview + private decision\nReveal request + follow-up"]

    DEMO_BAR -->|"3. เข้าเป็น Organizer/Support"| ADMIN["Organizer/Support Workspace\nAggregate event/queue/interview health\nSanitized integration health\nPause/resume/broadcast\nCompany moderation\nSupport/incident recovery + audit"]
```

### 1. ฝั่งผู้สมัครงาน (Jobseeker / Candidate Workspace)
- **Demo Login:** เข้าเป็น synthetic `Candidate #8F3A`; connected mode ใช้ identity adapter ที่ได้รับอนุมัติ
- **Completion flow:**
  1. Mock Verify ที่ไม่อ้างว่าเชื่อม ThaID จริง หรือ connected verification ตาม provider/policy
  2. นำเข้า Resume ให้ AI สกัดทักษะ พร้อมหน้าจอ Side-by-Side Review
  3. สตูดิโอสร้างตัวละคร 8-Bit (สุ่มเสื้อผ้า ทรงผม สีผิว หน้ากากสัตว์)
  4. เดินในฮอลล์งานแฟร์ Phaser 4 หรือเปิดโหมดรายการ Navigator
  5. ดูรายละเอียดบูธและคะแนนความตรงกัน 0–100 พร้อมคำอธิบาย AI
  6. กดเข้าคิวสัมภาษณ์สด และรับการแจ้งเตือน Ready Check (60s)
  7. ผ่าน Media Preflight แล้วใช้ provider จริงหรือ fallback ที่ติดป้ายตาม health/capability
  8. ส่งผลส่วนตัว รอผลทันทีเมื่อครบสองฝ่าย แล้วตอบ `RevealRequest` เป็นราย field

### 2. ฝั่งผู้สัมภาษณ์และบริษัท (Recruiter Workspace)
- **Demo Login:** เข้าเป็น synthetic `Recruiter #R12`; connected mode ตรวจ organization role จาก server
- **Completion flow:**
  1. กรอก company, job/JD/salary/rubric, booth และ showcase แล้ว Draft/Preview/Validate/Publish
  2. สลับสถานะ `AVAILABLE`, `BUSY`, `BREAK`, `OFFLINE`
  3. Live Queue Board แสดง alias/job/wait/masked summary และ claim แบบ atomic
  4. เข้าห้องเดียวกับ Candidate ผ่าน configured media mode และใช้ rubric ส่วนตัว
  5. ส่ง Private Decision โดยไม่เห็นคำตอบ Candidate ล่วงหน้า
  6. หลัง Mutual Match ส่ง field request + purpose (default name/email/phone/resume)
  7. ดูเฉพาะ subset ที่ Candidate grant และส่ง follow-up

### 3. ฝั่งผู้ดูแลระบบและผู้จัดงาน (Website Admin & Operations Workspace)
- **Demo Login:** เข้าเป็น synthetic `Event Lead / Support`; connected mode ใช้ scoped operations role
- **Completion flow:**
  1. **Live Event Operations Dashboard:** ตรวจสอบผู้ใช้งานออนไลน์สด (CCU), ปริมาณคิวสะสม, สถานะเซิร์ฟเวอร์ และสถิติการเกิด Mutual Match
  2. **Company Moderation:** ตรวจ verification/publication/provenance และ pause invalid content; Company Admin เป็นผู้แก้รายละเอียด
  3. **Emergency Controls:** สั่ง **Pause / Resume Event** หรือระงับการรับคิวชั่วคราว
  4. **Live Broadcast Banner:** ส่งข้อความประกาศด่วนแจ้งเตือนทุกคนในงานแบบ Real-time
  5. **Moderation & Incident Desk:** ตรวจสอบข้อร้องเรียน รายงานปัญหา และระงับผู้ใช้ที่ทำผิดกฎ
  6. **Support & Maintenance:** assign/resolve ticket, ดู sanitized integration/worker health และตรวจ audited action โดยไม่มี PII/private decision เป็นค่าเริ่มต้น
