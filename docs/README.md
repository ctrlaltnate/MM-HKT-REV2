# MaskedMatch Documentation

> **Version:** 3.2 · 26 August 2026
> **Phase:** Website-first local foundation in progress
> **Product:** Responsive Website + Landing + Virtual Job Fair

เอกสารชุดนี้ใช้หลัก **one topic, one canonical owner** เพื่อให้ข้อกำหนดครบแต่ไม่ซ้ำ หากข้อความใน supporting document ขัดกับ owner ให้แก้ owner ก่อนแล้วอ้าง link/requirement ID จากไฟล์อื่น

Repository ปัจจุบันมี React/Vite website และ Express local API ที่รันได้แล้ว ส่วน Phaser game และ runtime asset pipeline ยังไม่เริ่ม การพัฒนาต่อให้ใช้ [Implementation Execution Plan](./07-playbooks-and-operations/implementation-execution-plan.md) และยึด [Game Visual & World Specification](./03-design/world-and-scene-design.md) เป็น visual/runtime contract

---

## Start Here

| Need | Read first |
|---|---|
| ภาพรวมและสถานะ | [Scope & Roadmap](./02-product/scope-and-roadmap.md) |
| ศัพท์, provenance, owner ของเอกสาร | [Terminology & Document Ownership](./01-overview/terminology.md) |
| ระบบต้องทำอะไร | [Functional Requirements](./02-product/functional-requirements.md) |
| Flow Job Seeker / Recruiter / Organizer | [End-to-End Role Journeys](./02-product/user-journeys.md) |
| ตรวจรับอย่างไร | [Acceptance Criteria](./02-product/acceptance-criteria.md) |
| ออกแบบเกม/ฉาก/ตัวละคร | [Game Visual & World Specification](./03-design/world-and-scene-design.md) |
| ออกแบบ Website/UI | [Website & Product UI Design System](./03-design/design-system.md) |
| แยก Website กับ Phaser | [Web–Game Separation](./04-architecture/web-game-separation.md) |
| ลงมือพัฒนา | [Agent Playbook](./07-playbooks-and-operations/agent-playbook.md) |
| ทำ implementation ทีละส่วน | [Implementation Execution Plan](./07-playbooks-and-operations/implementation-execution-plan.md) |
| ดูสถานะล่าสุด/รับช่วงงานต่อ | [Current Progress and Handoff](./07-playbooks-and-operations/current-progress-and-handoff.md) |
| ทำ demo ครบสามบทบาท | [Three-Role Demo Runbook](./07-playbooks-and-operations/demo-runbook-and-storyboard.md) |
| ต่อ API/provider/key อย่างปลอดภัย | [API, AI and Media Integration Plan](./08-production-and-publish/api-and-ai-integrations.md) |
| ตรวจคุณภาพก่อนส่ง | [Definition of Done](./06-engineering-and-qa/definition-of-done.md) |

---

## P0 Game Direction

ข้อกำหนดละเอียดและตัวเลขทั้งหมดอยู่ใน [Game Visual & World Specification](./03-design/world-and-scene-design.md) เพียงแห่งเดียว สรุป blocker คือ:

- เกมใช้ **orthographic top-front 3/4** มุมเดียวทั้ง floor, booth, props, NPC และ player
- พื้นหลังเป็น plain modular floor; วัตถุจริงเป็น Phaser entities แยกชิ้น มี pivot, depth, lifecycle และ owner-linked collision
- ภาพ final ต้องเป็น original/licensed transparent pixel elements ที่มี silhouette/material ชัดและไม่มี baked shadow; Phaser สร้าง owner-linked shadow แยกต่างหาก
- ตัวละครมี top-front, top-behind, top-left-side, top-right-side จริงอย่างน้อย 3 frames ต่อทิศ
- Character Studio แยก skin, hair, เสื้อ, กางเกง/ท่อนล่าง, รองเท้า และ accessory พร้อมสี, 4-direction preview, apply และ persistence
- Booth เป็น prefab ประกอบชิ้นส่วนและผ่าน minimum environment variety catalog: facade/counter/showcase อย่างละ 4, kiosk 3, queue family 4, plant/decor อย่างละ 6 โดย colorway ไม่นับเป็น variant ใหม่
- NPC สุ่มแบบ seeded จาก base/skin/hair/top/bottom/shoes/accessory library และ compositor เดียวกับ player
- Directional prop ต้องมี N/E/S/W จริง; floor/road/aisle/wall ต้องมี edge/corner/turn/T/cross/end/transition/opening ครบเพื่อสร้าง map ใหม่ได้
- Asset ทุกชิ้นใช้ semantic palette slots และ metadata เพื่อ recolor/rearrange/recombine โดยไม่ redraw หรือ bake floor/text/logo/shadow รวมกัน
- ทุกโหมดหลักทำงานจริงและมี Navigator/List Mode equivalent

ไฟล์หลักใน [`ref_pics/`](./ref_pics/) ใช้ศึกษาความอ่านง่าย, scale, density, booth anatomy และภาษา top-front เท่านั้น ห้าม import เป็น runtime texture หรือคัดลอก layout/branding/sprite

---

## Current Truthful Status

| Area | Current state | Next required work |
|---|---|---|
| Repository | npm workspaces, web/API apps, tests และ seven reference images | เพิ่ม E2E/a11y gates และ shared contracts |
| Website | `IN_PROGRESS`; responsive shell, local membership, Candidate/Admin/Recruiter preparation และ fair directory ใช้งานได้ | masked-review approval, server auth, legal/status และ production accessibility evidence |
| Game | `NOT_STARTED` | Phaser host, movement lab, collision/depth and typed bridge |
| Runtime assets | `NOT_STARTED`; references are not runtime assets | source/metadata pipeline, manifest, atlas and admission evidence |
| Multi-role preparation | `LOCAL_FOUNDATION`; Admin สร้าง fair, Recruiter สร้าง booth/job, Candidate เข้าร่วมหลาย fair | server authorization, moderation, tenant/event scope และ durable storage |
| Connected services | Gemini Resume analysis ต่อผ่าน server-side local API; บริการอื่น `NOT_STARTED` | backend, durable state, realtime, media, audit and deployment |

ห้ามเรียก concept, fixture, mock, planned service หรือ static screenshot ว่า production implementation

---

## Documentation Map

### 01 — Overview

- [Executive Summary](./01-overview/executive-summary.md) — vision, problem, evidence limits
- [Terminology & Document Ownership](./01-overview/terminology.md) — terms, provenance, conflict priority, canonical owners
- [Personas & Permissions](./01-overview/personas-and-permissions.md) — personas and RBAC intent

### 02 — Product

- [Scope & Roadmap](./02-product/scope-and-roadmap.md) — R0–R4 scope and current status
- [User Journeys](./02-product/user-journeys.md) — demo-executable/API-ready Job Seeker, Recruiter/Company, Organizer/Support and recovery flows
- [Functional Requirements](./02-product/functional-requirements.md) — normative FR catalog including `FR-WORLD-036`
- [Acceptance Criteria](./02-product/acceptance-criteria.md) — AC-01 through AC-44 and traceability

### 03 — Design

- [Website & Product UI Design System](./03-design/design-system.md) — DOM UI tokens, hierarchy, states, responsive rules
- [Information Architecture](./03-design/information-architecture.md) — routes, sitemap, navigation
- [Game Visual & World Specification](./03-design/world-and-scene-design.md) — canonical game camera/world/booth/avatar/physics spec
- [Visual Reference Catalog](./03-design/reference-visual-language.md) — reference priority and IP boundary
- [Screen Blueprints](./03-design/screen-blueprints.md) — screen contracts and responsive states
- [Product Component Library](./03-design/component-library.md) — DOM component contracts
- [Content & Microcopy](./03-design/content-and-microcopy.md) — Thai/English voice and status copy
- [Accessibility Specification](./03-design/accessibility-spec.md) — WCAG 2.2 AA behavior

### 04 — Architecture

- [System Architecture](./04-architecture/system-architecture.md) — system boundaries and current/future stack
- [Web–Game Separation](./04-architecture/web-game-separation.md) — workspace ownership and typed bridge
- [State Machines](./04-architecture/state-machines.md) — canonical domain transitions
- [Domain Model & Data](./04-architecture/domain-model-and-data.md) — entities, privacy boundaries, retention
- [API & Realtime Contracts](./04-architecture/api-and-realtime-contracts.md) — API/event contracts

### 05 — Security and Governance

- [Security & PDPA](./05-security-and-governance/security-and-pdpa.md)
- [AI Governance](./05-security-and-governance/ai-governance.md)
- [Identity & ThaID](./05-security-and-governance/identity-and-thaid.md)

### 06 — Engineering and QA

- [Performance & Reliability](./06-engineering-and-qa/performance-and-reliability.md)
- [Observability & Analytics](./06-engineering-and-qa/observability-and-analytics.md)
- [Test Strategy & Gates](./06-engineering-and-qa/test-strategy-and-gates.md)
- [Risks & Decisions](./06-engineering-and-qa/risks-and-decisions.md)
- [Definition of Done](./06-engineering-and-qa/definition-of-done.md)

### 07 — Playbooks and Operations

- [Agent Playbook](./07-playbooks-and-operations/agent-playbook.md)
- [Implementation Execution Plan](./07-playbooks-and-operations/implementation-execution-plan.md)
- [Current Progress and Handoff](./07-playbooks-and-operations/current-progress-and-handoff.md)
- [MCP-Assisted Workflow](./07-playbooks-and-operations/mcp-assisted-workflow.md)
- [Demo Fixtures & Asset Registry](./07-playbooks-and-operations/demo-fixtures-and-assets.md)
- [Demo Runbook & Storyboard](./07-playbooks-and-operations/demo-runbook-and-storyboard.md)
- [Architecture Decision Records](./07-playbooks-and-operations/architecture-decision-records.md)

### 08 — Production and Publish

- [Production Deployment Guide](./08-production-and-publish/production-deployment-guide.md)
- [Cloud & Tech Stack](./08-production-and-publish/cloud-and-tech-stack.md)
- [API & AI Integrations](./08-production-and-publish/api-and-ai-integrations.md)
- [Scaling & Infrastructure](./08-production-and-publish/scaling-and-infrastructure.md)
- [Environment & Secrets](./08-production-and-publish/env-and-secrets-configuration.md)

---

## Run Status

เริ่ม local website และ API ด้วย `npm run dev`; ตรวจด้วย `npm run typecheck`, `npm test` และ `npm run build` จาก repository root ดูวิธีตั้งค่า Gemini และข้อจำกัดของ Local identity ที่ [root README](../README.md)

`npm run test:e2e` และ `npm run assets:validate` ยังไม่ถูกสร้าง และต้องเพิ่มก่อนอ้างระดับ L1 ตาม plan ส่วน `docs/ref_pics/` ยังคงเป็น visual reference only และห้าม import เข้า runtime
