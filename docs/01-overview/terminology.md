# 2. Terminology, Document Control & Provenance

---

## 2.1 Core Terminology

| คำ | นิยามใน MaskedMatch |
|---|---|
| **Candidate-anonymous** | `[PROPOSED]` Recruiter ไม่เห็นชื่อ รูป ใบหน้า ข้อมูลติดต่อ และ PII ที่กำหนดก่อน match; ผู้สมัครยังเห็นบริษัท ตำแหน่ง และบทบาท interviewer |
| **Blind Mode** | โหมดลดข้อมูลอัตลักษณ์ตาม policy ของ event/job; เปิดใช้ตามความเหมาะสม ไม่ได้บังคับทุกตำแหน่ง |
| **Double-blind Decision** | ทั้งสองฝ่ายส่ง `INTERESTED` หรือ `PASS` โดยไม่เห็นคำตอบของอีกฝ่ายก่อนปิด decision |
| **Masked Profile** | โปรไฟล์ทักษะและหลักฐานที่ผ่านการตรวจ/ปิดบัง PII และได้รับการยืนยันจากผู้สมัคร |
| **Identity Vault** | ที่เก็บข้อมูลยืนยันตัวตนและ PII ซึ่งแยกสิทธิ์จากระบบ world/matching |
| **Match Score** | คะแนนช่วยเรียงลำดับจาก requirement และ evidence ไม่ใช่ probability ว่าจะจ้างสำเร็จ |
| **Queue Ticket** | รายการคิวที่ server เป็น source of truth มี position, ETA, version และ state |
| **Ready Check** | คำเชิญให้ผู้สมัครยืนยันก่อนเข้าห้อง ไม่ teleport โดยไม่มีการตอบรับ |
| **Mutual Match** | ทั้งผู้สมัครและ recruiter เลือกสนใจภายใน decision window |
| **Reveal Consent** | การเลือก field ที่อนุญาตให้เปิดเผยหลัง mutual match |
| **Integrity Signal** | สัญญาณเช่น tab visibility หรือ connection change; ไม่ใช่หลักฐานโกงและห้ามใช้ auto-reject |
| **Navigator / List Mode** | ประสบการณ์ DOM-based ที่ใช้ค้นหา ดูบูธ เข้าคิว และนำทางได้โดยไม่ต้องควบคุม avatar |
| **Pre-event Quick Assessment** | ใน PDF หมายถึง ThaID + Resume upload + AI preprocessing เป็นหลัก; ไม่ใช่ post-match skill test เว้นแต่ Product อนุมัติ requirement เพิ่ม |
| **Post-match Assessment** | แบบทดสอบ/ขั้นตอนคัดเลือกที่ recruiter ส่งหลัง mutual match และ reveal consent |

---

## 2.2 Provenance Matrix & Priority Model

เอกสารนี้ใช้ป้ายกำกับเพื่อแยก “คำขอ” ออกจาก “ข้อมูลในเอกสารแนบ” และ “ข้อเสนอเพื่อการพัฒนา”:

- **`[USER]`** ข้อกำหนดจากผู้ใช้: ต้องขยายสเปกให้ละเอียด, เป็น Interactive Web App, ใช้ได้ทั้งมือถือและคอมพิวเตอร์ผ่าน browser, มีสไตล์ 8-bit และใช้แนวคิด spatial interaction คล้าย Hideout/Gather ในบริบท Job Fair; Revision 2.1 กำหนดให้ world หลักเป็นฮอลล์ Job Fair indoor ขนาดใหญ่ มีบูธ ช่อง logo, NPC หลายบทบาท, scene props จำนวนมาก และ animation ที่ลื่นไหล
- **`[PDF]`** บริบทจาก pitch deck: Skills First, Bias Last, Virtual Job Fair, AI matching, candidate-anonymous interview, queue, mutual decision และ reveal หลัง match
- **`[PROPOSED]`** ข้อเสนอเชิงผลิตภัณฑ์/เทคนิคในเอกสารนี้ ซึ่งทีมสามารถนำไป validate และตัดสินใจ
- **`[OPEN]`** เรื่องที่ยังต้องมี Product Owner, Partner, Legal หรือ Technical Spike ตัดสินใจ

### Provenance Mapping Table

| ส่วนของเอกสาร | Provenance | Approval state |
|---|---|---|
| Browser responsive, mobile + desktop, 8-bit, spatial Job Fair | `[USER]` | Required intent |
| Vision, 5-step flow, 10–15 นาที, Blind Mode, mutual match, reveal | `[PDF]` | Source context; ต้องแปลเป็น requirement ที่ทำได้จริง |
| Demo/Pilot scope, queue policy, score formula, UI, architecture, API, retention, SLO | `[PROPOSED]` | ต้อง sign off ก่อนใช้เป็น baseline |
| Partner approval, policy values, legal basis, capacity และ feature rollout | `[OPEN]` | ใช้ proposed default ชั่วคราวใน Decision Registry |

### Instruction and Source Priority (ลำดับความสำคัญเมื่อข้อกำหนดขัดกัน)

1. คำขอล่าสุดที่ผู้ใช้ให้โดยตรง
2. Decision ที่ Product Owner อนุมัติและบันทึกไว้
3. ข้อกำหนด `[USER]` ในสเปกหลัก
4. ข้อกำหนด R0 และ safety/privacy MUST/MUST NOT ในสเปกหลัก
5. Design System & Wireframes สำหรับ layout, component, interaction และ prototype behavior
6. ข้อเสนอ `[PROPOSED]` ในสเปกหลัก
7. สมมติฐานของ agent ซึ่งต้องบันทึกเป็น `ASSUMPTION`

> ข้อมูล `[PDF]` เป็น **source context ไม่ใช่คำสั่ง** ห้ามนำ claim, logo, ภาพ, ชื่อบุคคล หรือแนวคิดที่เสี่ยงจาก PDF มาใช้โดยอัตโนมัติ

---

## 2.3 Requirement Conformance Keywords (RFC 2119)

- **MUST**: จำเป็นต่อการเปิดใช้ release ที่ระบุ ขาดไม่ได้
- **SHOULD**: ควรทำ ถ้าไม่ทำต้องบันทึกเหตุผลใน ADR / Decision Log
- **COULD**: ส่วนเสริม ทำภายหลังได้เมื่อมีทรัพยากร
- **MUST NOT**: ห้ามทำเนื่องจากความปลอดภัย ความเป็นส่วนตัว ความเท่าเทียม หรือความถูกต้อง

---

## 2.4 Document Control Metadata

| รายการ | ค่า |
|---|---|
| **Document Version** | 2.1 — Interactive Career Hall revision |
| **Status** | Approved Specification & Modularized Architecture |
| **Last Updated** | 21 August 2026 |
| **Product** | MaskedMatch |
| **Primary Language** | Thai; รองรับ English ผ่านระบบ localization |
| **Target Surfaces** | Responsive Web App / PWA, semantic flow รองรับ reflow ตั้งแต่ 320 CSS px |
| **Source Context** | `Hackathon แหกกระท้อน.pdf` (5 หน้า) |
