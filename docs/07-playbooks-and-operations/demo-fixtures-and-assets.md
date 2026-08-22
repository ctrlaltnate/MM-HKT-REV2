# Demo Fixtures & Asset Registry

> **Document role:** Canonical synthetic demo data and factual asset inventory
> **Version:** 3.0 · 22 August 2026

ไฟล์นี้เก็บเฉพาะ fixture ที่ใช้ซ้ำและสถานะ asset ที่มีจริง ไม่ทำซ้ำกฎมุมกล้อง, booth anatomy, avatar layers หรือ visual QA ซึ่งอยู่ใน [Game Visual & World Specification](../03-design/world-and-scene-design.md)

---

## 1. Canonical Synthetic Fixtures

ข้อมูลทุกชุดเป็นข้อมูลสังเคราะห์ ใช้โดเมน `.test` และต้องติดป้าย `DEMO DATA` ใน UI

### Event

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

### Candidate

```yaml
candidate_id: cand_demo_8f3a
alias: "Candidate #8F3A"
email: candidate@example.test
skills: [Node.js, MQTT, Redis, Queue Systems]
evidence:
  - Built an IoT telemetry pipeline handling 2M synthetic events/day
hidden_fields_pre_match:
  - legal_name
  - email
  - phone_number
  - institution
  - exact_employer
```

### Primary job

```yaml
job_id: job-backend-01
company_id: company-cyber-orchard
company_name: Cyber Orchard Co.
title: Backend Developer
work_mode: Hybrid
salary: Demo range 45,000–70,000 THB
interview_minutes: 12
match_score: 92
match_confidence: Demo rule
match_reasons:
  - ทักษะ Node.js ตรงกับความต้องการหลักของตำแหน่ง
  - มีหลักฐานผลงานด้าน Queue Systems และ Redis
  - ประสบการณ์ด้าน IoT / MQTT สอดคล้องกับผลิตภัณฑ์ของบริษัท
uncertain_reasons:
  - ยังไม่มีหลักฐานทักษะ Observability ใน Profile
```

---

## 2. Runtime Asset Source of Truth

`packages/assets/manifest.json` เป็น machine-readable source of truth หากตารางนี้ต่างจาก manifest ให้แก้ทั้งสองจุดใน change เดียวกัน

| Asset ID | Path | Runtime status | Purpose |
|---|---|---|---|
| `world.hall.v1` | `packages/assets/game/world/neon-career-hall-v1.png` | Reference only | archived composition study; ห้ามโหลดเป็น flat world |
| `world.hall.study.v2` | `packages/assets/game/world/neon-career-hall-v2.png` | Reference only | brightness/readability study; ห้ามโหลดเป็น flat world |
| `world.floor.atlas.v1` | `packages/assets/game/generated/mm-career-floor-v1.png` | Runtime | floor surfaces เท่านั้น |
| `world.props.atlas.v1` | `packages/assets/game/generated/mm-career-props-v1.png` | Runtime | modular prop atlas; solid instance ต้องมี owner-linked collider |
| `world.npcs.atlas.v1` | `packages/assets/game/generated/mm-career-npcs-v1.png` | Runtime | synthetic NPC atlas; instance ต้องมี entity ID และ foot hitbox |

ไฟล์ `packages/assets/game/generated/mm-avatar-direction-reference-v1.png` เป็น process reference ที่มีอยู่จริงแต่ยังไม่อยู่ใน manifest จึงห้ามถือเป็น approved runtime asset จนกว่าจะมี provenance, checksum, frame metadata และ reviewer approval ครบ

Planned asset ต้องอยู่ใน roadmap หรือ backlog ไม่ใส่ปนใน registry นี้จนกว่าไฟล์และ provenance จะมีจริง

---

## 3. Admission Rules

Asset จะเข้า runtime ได้เมื่อผ่านทุกข้อ:

1. เป็น original หรือมี license ที่อนุญาต และไม่ import จาก `docs/ref_pics/`
2. มี `assetId`, path, kind, dimensions, source/tool, brief, reference policy, generated date, allowed use, byte size และ SHA-256
3. ผ่าน camera, scale, pivot, collider, depth และ in-scene review ตาม [Game Visual & World Specification](../03-design/world-and-scene-design.md)
4. object/actor ใช้ transparent PNG; floor atlas ไม่มี baked interactive object; ไม่มี embedded UI text
5. atlas แบ่ง `floor`, `booth`, `props`, `characters`, `fx` และผ่าน texture/download budget
6. งานที่ใช้ MCP/tool มี evidence ตาม [MCP-Assisted Workflow](./mcp-assisted-workflow.md)

Emoji, copied sprite, copied logo, unauthorized reference และภาพ hall แบนที่ทำหน้าที่แทน runtime entities ไม่ผ่าน admission

---

## 4. Current Asset Gaps

| Gap | Required outcome |
|---|---|
| Booth variety | เพิ่ม facade/counter/showcase/queue/deco library ให้ครบขั้นต่ำตาม `FR-WORLD-036` |
| Avatar wardrobe | แยก top, bottom/trousers และ shoes พร้อมสีและ frame ครบ 4 ทิศ |
| Directional NPC | เพิ่ม front/back/left/right และ movement frames สำหรับ NPC ที่เดิน |
| Evidence | เพิ่ม camera lineup, collider/depth capture และ screenshots ที่ 390/1440 px |

สถานะนี้ต้องอัปเดตพร้อม manifest และ runtime; ห้ามเปลี่ยนคำว่า planned เป็น implemented จากภาพ concept เพียงอย่างเดียว
