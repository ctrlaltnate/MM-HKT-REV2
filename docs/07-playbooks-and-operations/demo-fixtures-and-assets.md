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

### Browser-visible role fixtures

| Role | Demo route | Local state | Working R0 actions |
|---|---|---|---|
| Job seeker | `/event/demo` → `/event/demo/world` | `maskedmatch.demo.journey.v1`, `maskedmatch.avatar` | verify, profile, avatar, world, booth/Navigator, one active queue chip |
| Recruiter/company | `/recruiter/demo` | `maskedmatch.demo.recruiter.v1` | edit/publish company and job, call synthetic queue, media readiness, decide, select/send field request |
| Operations/support | `/operations/demo` | component-local deterministic fixture | inspect health, open/resolve support tickets, jump to Recruiter or World |

ทุกหน้าต้องติดป้าย local/demo adapter และบอก API boundary อย่างชัดเจน ห้ามแสดง `CONNECTED` สำหรับ media, backend หรือ production monitoring ที่ยังไม่ได้ต่อจริง

---

## 2. Runtime Asset Source of Truth

Repository `HEAD` ปัจจุบันยังไม่มี `packages/assets/manifest.json` และไม่มี runtime/source asset ที่ผ่าน admission ดังนั้น runtime inventory ว่าง ภาพเจ็ดไฟล์ใน `docs/ref_pics/` เป็น reference only

เมื่อ `AST-001..009` ใน [Implementation Execution Plan](./implementation-execution-plan.md) เสร็จ ให้สร้าง `packages/assets/manifest.json` เป็น machine-readable source of truth และเพิ่มรายการในเอกสารนี้พร้อมไฟล์/provenance/checksum ใน change เดียวกัน Planned asset ห้ามใส่ใน runtime registry ก่อนมีไฟล์จริง

---

## 3. Admission Rules

Asset จะเข้า runtime ได้เมื่อผ่านทุกข้อ:

1. เป็น original หรือมี license ที่อนุญาต และไม่ import จาก `docs/ref_pics/`
2. มี `assetId`, path, kind, dimensions, source/tool, brief, reference policy, generated date, allowed use, byte size และ SHA-256
3. ผ่าน camera, scale, pivot, collider, depth, alpha และ runtime-shadow review ตาม [Game Visual & World Specification](../03-design/world-and-scene-design.md)
4. object/actor ใช้ transparent RGBA จริง; ไม่มี checkerboard/floor/contact/cast shadow bake อยู่ในไฟล์; ไม่มี embedded UI text
5. atlas แบ่ง `floor`, `wall`, `booth`, `props`, `avatar-base`, `avatar-hair`, `avatar-top`, `avatar-bottom`, `avatar-shoes`, `avatar-accessory`, `shadow`, `fx` และผ่าน texture/download budget
6. งานที่ใช้ MCP/tool มี evidence ตาม [MCP-Assisted Workflow](./mcp-assisted-workflow.md)

Emoji, copied sprite, copied logo, unauthorized reference และภาพ hall แบนที่ทำหน้าที่แทน runtime entities ไม่ผ่าน admission

### 3.1 Production manifest and sidecar contract

Provenance record ระดับไฟล์ใน `packages/assets/manifest.json` อย่างเดียวไม่พอสำหรับ atlas production ทุก source cell/runtime frame ต้องมี manifest entry หรือ sidecar metadata ที่ machine อ่านได้ โดยใช้ field ขั้นต่ำดังนี้:

| Field | Required meaning |
|---|---|
| `assetId`, `partId`, `variantId` | stable identity ของ family, ชิ้นส่วน และ silhouette/material variant |
| `kind`, `runtimePolicy`, `sourceAssetId` | source/runtime role และสายการ derive ย้อนกลับไปยัง source sheet |
| `orientation` | `north`, `east`, `south`, `west` หรือ reviewed `radial-symmetric` |
| `animation`, `frameIndex` | `idle`, `step-left`, `step-right` หรือ prop/tile frame ที่ประกาศชัด |
| `origin`, `anchors`, `visualBounds`, `baseFootprint` | จุดประกอบ layer, pivot, ขอบภาพ และฐานสำหรับ collider/shadow |
| `paletteSlots` | semantic ramps เช่น skin, hair, cloth, material, accent; ระบุ highlight/base/shade แยกกัน |
| `occlusionParts`, `layerOrder` | ชิ้นหน้า/หลังและลำดับซ้อนที่เปลี่ยนตามทิศ |
| `collisionProfileId`, `shadowProfileId` | อ้าง runtime metadata; shadow ไม่อยู่ใน source texture |
| `topology` | สำหรับ tile: center/edge/corner/turn/T/cross/end/transition/opening และ neighbor rule |
| `alphaPolicy`, `bakedContent` | ต้องเป็น RGBA และประกาศ `bakedContent: []`; ห้าม floor/text/logo/neighbor/shadow |
| `reviewStatus`, `reviewEvidence` | camera/alpha/turnaround/autotile/palette/rearrange evidence ที่ผ่านแล้ว |

กฎความครบถ้วน:

- character part หนึ่ง variant จะเป็น `runtime-ready` ได้เมื่อ matrix `4 directions × 3 motion frames` ครบทุก cell ที่รองรับและ anchor registration ผ่าน
- directional prop หนึ่ง variant จะเป็น `runtime-ready` ได้เมื่อ authored N/E/S/W ครบ หรือมี radial-symmetry exception ที่ review แล้ว
- tile family จะเป็น `runtime-ready` ได้เมื่อ topology coverage ตาม section 4.3 ของ Game Visual & World Specification ครบและ autotile test map ไม่มี seam
- source sheet ที่มีหลายชิ้นเป็นเพียง container; runtime อ้างแต่ละ part/cell ด้วย ID ห้ามอ้าง crop coordinate กระจัดกระจายใน scene code
- manifest ปัจจุบันเป็น provenance inventory ระดับไฟล์ของ R0; ห้ามตีความว่าคำว่า `source-sheet` หมายถึง coverage ภายในครบแล้ว

---

## 4. Current Asset Gaps

| Gap | Required outcome |
|---|---|
| Booth/prop variety | สร้าง original source, normalize, เพิ่ม variant ให้ครบขั้นต่ำ และ author N/E/S/W สำหรับ directional prop ตาม `FR-WORLD-036/038` |
| Avatar wardrobe | สร้าง/crop/register ทุก layer × 4 directions × 3 frames, palette masks และ pack runtime atlases |
| Directional NPC | สร้าง shared seeded compositor, movement schedule, atlas normalization และ browser evidence |
| Runtime shadow | สร้าง owner-linked Phaser shadow layer, debug toggle และ state profiles ตาม `FR-WORLD-037` |
| Floor/road/wall tiles | สร้าง reusable autotile families ครบ topology, transition, opening และ collision metadata ตาม `FR-WORLD-038` |
| Booth partition kit | สร้าง straight/L/U/shared-wall + glass/low-divider + door left/center/right + wide opening พร้อม segmented colliders และ traversal evidence |
| Recolor/rearrange | เพิ่ม semantic palette slots, anchors, occlusion parts และ prefab metadata ตาม `FR-WORLD-039` |
| Evidence | เพิ่ม camera lineup, collider/depth capture และ screenshots ที่ 390/1440 px |

สถานะนี้ต้องอัปเดตพร้อม manifest และ runtime; ห้ามเปลี่ยนคำว่า planned เป็น implemented จากภาพ concept เพียงอย่างเดียว
