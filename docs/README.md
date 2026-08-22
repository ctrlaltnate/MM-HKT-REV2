# MaskedMatch — Master Documentation Index

> **Skills First. Bias Last.**
> **Interactive 8-bit Virtual Job Fair Documentation Hub**
> Version 2.2 · Docs-only Architecture Revision · August 2026

> [!IMPORTANT]
> **สถานะปัจจุบัน: Documentation only** — repository นี้ยังไม่มี website, game runtime, backend หรือ deployment configuration ที่พร้อมรัน การเริ่ม scaffold/implementation ต้องได้รับคำสั่งแยกต่างหากหลังเอกสารและขอบเขตได้รับการอนุมัติ

เอกสารทั้งหมดของโครงการ MaskedMatch ถูกจัดแบ่งออกเป็น **8 หมวดหมู่หลัก (35+ เอกสารย่อย)** อย่างเป็นระบบ ครอบคลุมทั้งด้านผลิตภัณฑ์ (Product), ประสบการณ์และการออกแบบ (UX/UI), สถาปัตยกรรมระบบ (Architecture), ความปลอดภัยและธรรมาภิบาล (Security & Governance), วิศวกรรมและการประกันคุณภาพ (Engineering & QA), คู่มือการปฏิบัติการ (Playbooks & Operations) ตลอดจนคู่มือการดีพลอยสู่ระดับ Production จริง (Production & Publish)

---

## 📚 Documentation Categories & Sitemap

```text
docs/
├── README.md                                 # Master Index & Guide (ไฟล์นี้)
│
├── 01-overview/                              # ภาพรวม วิสัยทัศน์ และบทบาทผู้ใช้งาน
│   ├── executive-summary.md                  # สรุปภาพรวม วิสัยทัศน์ และเป้าหมายของผลิตภัณฑ์
│   ├── terminology.md                        # ศัพท์เทคนิค ลำดับความสำคัญ และ Document Control
│   └── personas-and-permissions.md           # บทบาทผู้ใช้ (Personas) และตารางสิทธิ์ (RBAC Matrix)
│
├── 02-product/                               # ข้อกำหนดเชิงผลิตภัณฑ์และเส้นทางผู้ใช้
│   ├── scope-and-roadmap.md                  # ขอบเขตการพัฒนา (R0 ถึง R4) และฟังก์ชันที่เลื่อนออกไป
│   ├── user-journeys.md                      # เส้นทางการใช้งาน (Candidate, Recruiter, Organizer, Recovery)
│   ├── functional-requirements.md            # ข้อกำหนดการทำงานทั้งหมด (FR-AUTH ถึง FR-NOTIFY)
│   └── acceptance-criteria.md                # เกณฑ์การยอมรับ (AC-01 ถึง AC-31) และ Traceability Matrix
│
├── 03-design/                                # ระบบการออกแบบ UX/UI และฉากเสมือน
│   ├── design-system.md                      # 8-Bit Design Tokens, Strict No-Emoji, Real Media Engines
│   ├── information-architecture.md           # โครงสร้าง Sitemap, เส้นทาง (Routes) และ Responsive Grid
│   ├── world-and-scene-design.md             # ฉาก Neon Career Hall, Realistic Booths, 8-Bit Character Compositor
│   ├── screen-blueprints.md                  # พิมพ์เขียวและ Wireframes ทุกหน้าจอ (SC-01 ถึง SC-17)
│   ├── component-library.md                  # แคตตาล็อก UI Components, Primitives, Studio & Media Canvas
│   ├── content-and-microcopy.md              # โทนเสียง (Voice & Tone) และชุดข้อความภาษาไทย/อังกฤษ
│   └── accessibility-spec.md                 # ข้อกำหนดการเข้าถึงตามมาตรฐาน WCAG 2.2 AA
│
├── 04-architecture/                          # สถาปัตยกรรมทางเทคนิคและสัญญาข้อมูล
│   ├── system-architecture.md                # สถาปัตยกรรมระบบหลัก (Component Diagram, Media Pipeline, Stack)
│   ├── web-game-separation.md                # ขอบเขต Website/Game, Phaser 4 decision และ integration contract
│   ├── state-machines.md                     # แผนภาพ State Machines (Event, Queue, Interview, Decision)
│   ├── domain-model-and-data.md              # Domain Entities, AvatarConfig, Identity Vault และ Retention
│   └── api-and-realtime-contracts.md         # สัญญา REST API, WebSocket Protocols, Error Codes
│
├── 05-security-and-governance/               # ความปลอดภัย ความเป็นส่วนตัว และ AI
│   ├── security-and-pdpa.md                  # การปฏิบัติตาม PDPA, On-Device Face Mesh, Fail-Closed, Threat Model
│   ├── ai-governance.md                      # จริยธรรม AI, Model Card, Guardrails, Integrity Signals
│   └── identity-and-thaid.md                 # สถาปัตยกรรม Digital ID และการเชื่อมต่อ ThaID
│
├── 06-engineering-and-qa/                    # ประสิทธิภาพ การทดสอบ และการประเมินความเสี่ยง
│   ├── performance-and-reliability.md        # งบประมาณประสิทธิภาพ (SLOs), CI Profile, ความน่าเชื่อถือ
│   ├── observability-and-analytics.md        # การบันทึก Logs, Metrics, Tracing และ Funnel Analytics
│   ├── test-strategy-and-gates.md            # กลยุทธ์การทดสอบ, QA Viewport Matrix, Release Gates
│   ├── risks-and-decisions.md                # ตารางความเสี่ยง, ข้อสมมติ, Dependencies, Decision Registry
│   └── definition-of-done.md                 # เกณฑ์การส่งมอบงาน (DoD) ฝั่ง Engineering และ Design
│
├── 07-playbooks-and-operations/              # คู่มือสำหรับ Agent และการนำเสนองาน
│   ├── agent-playbook.md                     # คู่มือ AI Coding Agent (Invariants, Slices 0-6, Workflows)
│   ├── mcp-assisted-workflow.md               # กติกาใช้ MCP เพื่อ research, asset iteration และ visual QA
│   ├── demo-runbook-and-storyboard.md        # แผนการนำเสนอ 5 นาทีบนเวที, สคริปต์, Scenario Presets
│   ├── demo-fixtures-and-assets.md           # ชุดชุดข้อมูลมาตรฐานมาตรฐาน (Fixtures) และ Asset Registry
│   └── architecture-decision-records.md      # บันทึกการตัดสินใจทางสถาปัตยกรรม (ADR-001 ถึง ADR-013)
│
└── 08-production-and-publish/                # คู่มือการติดตั้งและปล่อยใช้งานจริง (Production & Scale)
    ├── production-deployment-guide.md        # แผนผังและขั้นตอนการ Deploy (Cloud, Docker, Compose, SSL)
    ├── cloud-and-tech-stack.md               # สถาปัตยกรรม Tech Stack เต็มรูปแบบ, Isolation, Connection Pooling
    ├── api-and-ai-integrations.md            # การตั้งค่า AI (LLM, Prompts), On-device Vision, LiveKit SFU
    ├── scaling-and-infrastructure.md         # การสเกลรองรับ 10,000+ ผู้ใช้พร้อมกัน, WebRTC Sizing, Redis Grid
    └── env-and-secrets-configuration.md      # ไฟล์ `.env.production.example`, Secret Manager และ Go-Live Checklist
```

---

## 🧭 Quick Navigation by Role

- 👨‍💻 **สำหรับ AI Coding Agents & Developers:**
  1. เริ่มต้นที่ [07-playbooks-and-operations/agent-playbook.md](./07-playbooks-and-operations/agent-playbook.md) เพื่อดูข้อห้ามในช่วง Docs-only และ Build Sequence ในอนาคต
  2. ศึกษา [04-architecture/web-game-separation.md](./04-architecture/web-game-separation.md), [04-architecture/system-architecture.md](./04-architecture/system-architecture.md) และ [04-architecture/state-machines.md](./04-architecture/state-machines.md)
  3. ตรวจสอบข้อกำหนดใน [02-product/functional-requirements.md](./02-product/functional-requirements.md) และ [02-product/acceptance-criteria.md](./02-product/acceptance-criteria.md)

- 🚀 **สำหรับ DevOps / Platform Engineers (Deploy สู่ Production):**
  1. ศึกษาคู่มือการ Deploy ใน [08-production-and-publish/production-deployment-guide.md](./08-production-and-publish/production-deployment-guide.md)
  2. ดูสถาปัตยกรรมคลาวด์และฐานข้อมูลใน [08-production-and-publish/cloud-and-tech-stack.md](./08-production-and-publish/cloud-and-tech-stack.md)
  3. ตั้งค่า AI API Keys, WebRTC SFU ใน [08-production-and-publish/api-and-ai-integrations.md](./08-production-and-publish/api-and-ai-integrations.md)
  4. จัดการ Environment Variables ตาม [08-production-and-publish/env-and-secrets-configuration.md](./08-production-and-publish/env-and-secrets-configuration.md)
  5. วางแผนรองรับผู้ใช้ 10,000+ คนตาม [08-production-and-publish/scaling-and-infrastructure.md](./08-production-and-publish/scaling-and-infrastructure.md)

- 🎨 **สำหรับ UX/UI Designers & Frontend Engineers:**
  1. ศึกษา [03-design/design-system.md](./03-design/design-system.md) และ [03-design/world-and-scene-design.md](./03-design/world-and-scene-design.md)
  2. ดูพิมพ์เขียวและ Wireframes ใน [03-design/screen-blueprints.md](./03-design/screen-blueprints.md) และ [03-design/component-library.md](./03-design/component-library.md)
  3. ตรวจสอบเกณฑ์การเข้าถึงใน [03-design/accessibility-spec.md](./03-design/accessibility-spec.md)

- 🛡️ **สำหรับ Security, Privacy & DPO Roles:**
  1. ตรวจสอบสถาปัตยกรรมความปลอดภัยใน [05-security-and-governance/security-and-pdpa.md](./05-security-and-governance/security-and-pdpa.md)
  2. ตรวจสอบการแยกข้อมูลส่วนบุคคลใน [04-architecture/domain-model-and-data.md](./04-architecture/domain-model-and-data.md)
  3. ศึกษาธรรมาภิบาล AI ใน [05-security-and-governance/ai-governance.md](./05-security-and-governance/ai-governance.md)

- 🎤 **สำหรับ Demo Presenters & Event Operators:**
  1. อ่าน [07-playbooks-and-operations/demo-runbook-and-storyboard.md](./07-playbooks-and-operations/demo-runbook-and-storyboard.md) สำหรับสคริปต์ 5 นาทีและวิธีใช้งาน `/demo/control`
  2. ตรวจสอบชุดข้อมูลมาตรฐานใน [07-playbooks-and-operations/demo-fixtures-and-assets.md](./07-playbooks-and-operations/demo-fixtures-and-assets.md)

---

## Current Working Mode

- อ่านและปรับปรุงข้อกำหนดใน `docs/` เท่านั้น
- ใช้ภาพใน [`ref_pics/`](./ref_pics/) เป็น **visual reference** สำหรับกำหนดทิศทาง 8-bit; ห้ามนำไฟล์ reference ไปใช้เป็น runtime asset โดยอัตโนมัติ
- งาน world/visual ในอนาคตต้องใช้ MCP-assisted workflow เพื่อเก็บหลักฐาน reference, ปรับ asset และตรวจภาพจริงตาม [MCP-Assisted Workflow](./07-playbooks-and-operations/mcp-assisted-workflow.md); MCP เป็น development/QA tooling ไม่ใช่ runtime dependency
- ยังไม่มีคำสั่งติดตั้งหรือรัน local app เพราะ implementation เดิมถูกถอดออกจาก repository แล้ว
- เมื่อเริ่มพัฒนาในอนาคต ให้สร้าง Website และ Game เป็นคนละ workspace ตาม [Web–Game Separation](./04-architecture/web-game-separation.md) และสร้าง production asset library แยกจาก `docs/ref_pics/`
