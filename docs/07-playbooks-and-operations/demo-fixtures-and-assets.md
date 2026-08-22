# 3. Synthetic Domain Fixtures & Asset Registry

---

## 3.1 Canonical Synthetic Domain Fixtures

เพื่อความสม่ำเสมอในการรัน Automated E2E Tests และการนำเสนอบนเวที ระบบกำหนดค่าคงที่ของ Fixture IDs ไว้ดังนี้:

### Event Fixture
```yaml
id: event-neon-career-city
name_th: Neon Career City Demo Job Fair
state: LIVE
timezone: Asia/Bangkok
demo: true
blind_mode: candidate_anonymous
active_queue_limit: 1
ready_check_seconds: 60
interview_duration_seconds: 720
recording_enabled: false
transcription_enabled: false
```

### Candidate Fixture
```yaml
candidate_id: cand_demo_8f3a
alias: "Candidate #8F3A"
email: candidate@example.test
skills:
  - Node.js
  - MQTT
  - Redis
  - Queue Systems
evidence:
  - "Built an IoT telemetry pipeline handling 2M synthetic events/day"
hidden_fields_pre_match:
  - legal_name
  - email
  - phone_number
  - institution
  - exact_employer
```

### Primary Job Fixture (Cyber Orchard Co.)
```yaml
job_id: job-backend-01
company_id: company-cyber-orchard
company_name: Cyber Orchard Co.
title: Backend Developer
work_mode: Hybrid
salary: "Demo range 45,000–70,000 THB"
interview_minutes: 12
match_score: 92
match_confidence: Demo rule
match_reasons:
  - "ทักษะ Node.js ตรงกับความต้องการหลักของตำแหน่ง"
  - "มีหลักฐานผลงานด้าน Queue Systems และ Redis"
  - "ประสบการณ์ด้าน IoT / MQTT สอดคล้องกับผลิตภัณฑ์ของบริษัท"
uncertain_reasons:
  - "ยังไม่มีหลักฐานทักษะ Observability ใน Profile"
```

### Queue, Interview & Match IDs
```text
queue_ticket_id: queue-demo-001
interview_session_id: interview-demo-001
match_id: match-demo-001
recruiter_id: recruiter-r12
```

---

## 3.2 Demo Data Hygiene Rules

- **Synthetic Domains:** ใช้โดเมนอีเมล `.test` เท่านั้น เช่น `candidate@example.test`
- **Fictional Entities:** ใช้ชื่อบริษัทและบุคคลสมมติ เช่น `Cyber Orchard Co.`, `Riverbyte Studio`, `Apex Cloud Tech`, `SolarPulse Energy`
- **No Production Secrets:** ห้ามใช้ Production API Keys, Private Tokens หรือหมายเลขบัตรประชาชนจริงในการทดสอบ
- **Banner Requirement:** ทุกหน้าจอที่มีการแสดงข้อมูลจำลองต้องมีป้าย `DEMO DATA` กำกับอย่างชัดเจน

---

## 3.3 R0 Generated Asset Registry (Revision 1.1)

| Asset ID | File Path | Role & Logical Dimensions | Provenance & Allowed Use |
|---|---|---|---|
| **`world.hall.v3`** | `public/assets/world/neon-career-hall-v3.png` | Indoor Hall Environment (1536×1024 px) | Original generated project asset; licensed for MaskedMatch project use |
| **`world.atlas.source.v1`** | `public/assets/world/career-hall-atlas-v1.png` | Source 4×4 Character/Prop Atlas | Source raw generated atlas; retained for archive; not loaded at runtime |
| **`world.atlas.runtime.v3`**| `public/assets/world/career-hall-atlas-v3.png` | Normalized 1280×1280 Phaser Atlas | Mechanically derived transparent atlas; runtime game asset |

---

## 3.4 Asset Production Specifications & Constraints

- **Original or Licensed Only:** ห้ามนำภาพจาก Pitch Deck หรือภาพที่มีลิขสิทธิ์ของบุคคลภายนอกมาใช้งานโดยไม่ได้รับอนุญาต
- **Pixel Art Rules:** ใช้อัตราส่วน Integer Scale (2x/3x) และตั้งค่า `image-rendering: pixelated`
- **No Embedded UI Text:** ห้ามเรนเดอร์ตัวหนังสือลงในรูปภาพโดยตรง เพื่อรักษาความสามารถในการเข้าถึงผ่าน Screen Reader
- **Asset Chunking:** แยกกลุ่ม Texture Atlas เป็น `core`, `booth`, และ `props` เพื่อจำกัดขนาดการดาวน์โหลดเริ่มต้นไม่ให้เกิน 2.0 MB
