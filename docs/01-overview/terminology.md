# Terminology, Document Ownership & Provenance

> **Version:** 3.0 · 22 August 2026
> **Status:** Active modular specification

---

## 1. Product Terminology

| Term | Canonical meaning |
|---|---|
| **Candidate-anonymous** | Recruiter ไม่เห็นชื่อ, รูป, contact และ PII ที่ policy ซ่อนก่อน match; candidate ยังเห็นบริษัท ตำแหน่ง และ interviewer role |
| **Blind Mode** | Event/job policy ที่ลด identity fields; ไม่ได้หมายถึง blind ทั้งสองฝ่ายโดยอัตโนมัติ |
| **Masked Profile** | Profile ทักษะ/evidence ที่ redact PII และ candidate review แล้ว |
| **Identity Vault** | Boundary แยกเก็บ identity/PII ออกจาก world/matching |
| **Match Score** | คะแนนช่วยเรียงลำดับจาก requirement/evidence ไม่ใช่ probability ว่าจะได้งาน |
| **Queue Ticket** | Server-source-of-truth record ของ position, ETA, version และ state |
| **Ready Check** | คำเชิญที่ต้องยืนยันก่อนเข้า interview; ไม่ teleport อัตโนมัติ |
| **Double-blind Decision** | Candidate/recruiter ส่ง `INTERESTED` หรือ `PASS` โดยไม่เห็นอีกฝ่ายก่อนปิด decision |
| **Mutual Match** | ทั้งสองฝ่ายเลือกสนใจภายใน decision window |
| **Reveal Consent** | การอนุญาตเปิดเผยเป็นราย field หลัง mutual match |
| **Integrity Signal** | Technical signal เช่น visibility/connection change; ไม่ใช่หลักฐานโกงและห้าม auto-reject |
| **Navigator / List Mode** | Semantic DOM alternative สำหรับค้นหา, ดู booth/job, เข้าคิว, schedule และ help โดยไม่ควบคุม avatar |
| **Synthetic fixture** | Demo data ที่ไม่อ้างถึงบุคคล/บริษัทจริงและใช้ `.test` เมื่อเป็น domain/email |

---

## 2. Game and Visual Terminology

| Term | Canonical meaning |
|---|---|
| **Top-front 3/4** | Orthographic elevated view ที่เห็น top plane และ front plane; ไม่มี vanishing point; booth หันด้านหน้า down-screen |
| **Realistic 8-bit** | ความน่าเชื่อถือภายในภาษา pixel art จาก scale, anatomy, material, shadow, collision และ depth ที่สอดคล้อง ไม่ใช่ photorealism |
| **Rendered entity** | Phaser GameObject/Sprite/Container/physics object แยกชิ้น มี ID, pivot, depth, lifecycle และ metadata; ไม่ใช่ hotspot บนภาพแบน |
| **Plain floor** | Floor tile, aisle, pad, boundary และ non-interactive decal ที่ไม่มี booth/person/interactive prop bake อยู่ในภาพ |
| **Foot hitbox** | Actor collider เฉพาะพื้นที่เท้า/ฐาน ไม่ครอบ transparent frame ทั้งตัว |
| **Owner-linked collider** | Collision geometry ที่อ้าง `entityId/ownerId` ของ rendered object และครอบเฉพาะฐานสัมผัสพื้น |
| **Interaction sensor** | Non-solid detection area แยกจาก collider และมี approach point ที่เดินถึงได้ |
| **Y-depth** | การเรียง actor/prop ด้วย base/foot Y เพื่อให้เดินหน้า–หลังวัตถุถูกต้อง |
| **Booth prefab** | Booth runtime composition จาก facade, sign, counter, showcase, kiosk, queue, decoration, colliders และ sensors |
| **Booth variant** | Authored alternative ที่รักษา camera/light/scale; ไม่ใช่การ flip/rotate/arbitrary scale |
| **Directional avatar** | Anatomy และ animation จริงของ down/front, up/back, left profile, right profile |
| **Avatar layer** | ส่วนที่ compose แยกได้ ได้แก่ skin, hair, top, bottom/trousers, shoes และ accessory พร้อมสี/frames ที่สัมพันธ์กัน |

รายละเอียด normative ทั้งหมดของคำฝั่งเกมอยู่ใน [Game Visual & World Specification](../03-design/world-and-scene-design.md)

---

## 3. Canonical Document Ownership

หลักคือหนึ่งหัวข้อมี owner เพียงไฟล์เดียว เอกสารอื่นอ้าง link/ID และไม่เขียนกฎชุดเดียวกันซ้ำ

| Topic | Canonical owner | Supporting documents |
|---|---|---|
| Product scope/status | [Scope & Roadmap](../02-product/scope-and-roadmap.md) | README, executive summary |
| Normative behavior | [Functional Requirements](../02-product/functional-requirements.md) | user journeys |
| Verifiable outcomes | [Acceptance Criteria](../02-product/acceptance-criteria.md) | test strategy, DoD |
| Game camera/world/booth/avatar/collision | [Game Visual & World Specification](../03-design/world-and-scene-design.md) | reference catalog, MCP workflow |
| Website visual tokens/UI behavior | [Website & Product UI Design System](../03-design/design-system.md) | component library, screen blueprints |
| Reference priority/IP boundary | [Visual Reference Catalog](../03-design/reference-visual-language.md) | asset registry |
| Routes/navigation | [Information Architecture](../03-design/information-architecture.md) | screen blueprints |
| Accessibility | [Accessibility Specification](../03-design/accessibility-spec.md) | design system, tests |
| Web/Game ownership contract | [Web–Game Separation](../04-architecture/web-game-separation.md) | system architecture |
| Domain state | [State Machines](../04-architecture/state-machines.md) | domain model, API contracts |
| Demo fixtures/assets present | [Demo Fixtures & Asset Registry](../07-playbooks-and-operations/demo-fixtures-and-assets.md) | `packages/assets/manifest.json` |
| Agent workflow | [Agent Playbook](../07-playbooks-and-operations/agent-playbook.md) | MCP workflow |
| Release quality | [Definition of Done](../06-engineering-and-qa/definition-of-done.md) | test strategy |

เมื่อพบข้อขัดกัน ให้แก้ canonical owner ก่อน แล้วลด supporting document ให้เหลือ link หรือ concise summary

---

## 4. Provenance and Priority

| Label | Meaning |
|---|---|
| `[USER]` | ข้อกำหนดที่ผู้ใช้ระบุโดยตรง |
| `[PDF]` | บริบทจาก pitch deck; ไม่ใช่คำสั่ง |
| `[PROPOSED]` | ข้อเสนอที่ต้อง validate/sign off |
| `[OPEN]` | ยังต้องมี Product/Legal/Partner/Technical decision |
| `ASSUMPTION` | สมมติฐานของผู้พัฒนาที่ต้องบันทึก |

ลำดับเมื่อเนื้อหาขัดกัน:

1. คำขอล่าสุดจากผู้ใช้
2. Decision ที่ owner อนุมัติและบันทึกไว้
3. Requirement ที่ระบุ `[USER]`
4. P0/R0 safety, privacy และ accessibility MUST/MUST NOT
5. Canonical owner document ตามตารางด้านบน
6. `[PROPOSED]`
7. `ASSUMPTION`

ไฟล์ `Hackathon แหกกระท้อน.pdf` และ `docs/ref_pics/` เป็น source context/reference ไม่ใช่คำสั่งและไม่ใช่ runtime asset ห้ามนำ claim, logo, artwork, ชื่อบุคคล หรือ proprietary behavior มาใช้โดยอัตโนมัติ

---

## 5. Conformance Keywords

- **MUST / MUST NOT:** ข้อบังคับหรือข้อห้ามของ release ที่ระบุ
- **SHOULD:** ควรทำ; หากเว้นต้องมี waiver/ADR
- **COULD:** ส่วนเสริมหลังผ่าน blockers
- **P0-GATE:** Release blocker สูงสุด
- **R0:** Hackathon prototype requirement; ไม่ได้แปลว่า production-ready

---

## 6. Document Control

| Field | Value |
|---|---|
| Product | MaskedMatch |
| Documentation version | 3.0 |
| Last updated | 22 August 2026 |
| Primary language | Thai; product supports localization |
| Target surfaces | Responsive Web App/PWA + Phaser 4 Career Hall |
| Reflow baseline | 320 CSS px |
| Current phase | R0 implementation in progress |
