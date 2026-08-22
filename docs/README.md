# MaskedMatch — Master Documentation Index

> **Skills First. Bias Last.**  
> **Interactive 8-bit Virtual Job Fair Documentation Hub**  
> Version 2.1 · Interactive Career Hall Revision · August 2026

เอกสารทั้งหมดของโครงการ MaskedMatch ถูกจัดแบ่งออกเป็น 7 หมวดหมู่หลักอย่างเป็นระบบ ครอบคลุมทั้งด้านผลิตภัณฑ์ (Product), ประสบการณ์และการออกแบบ (UX/UI), สถาปัตยกรรมระบบ (Architecture), ความปลอดภัยและธรรมาภิบาล (Security & Governance), วิศวกรรมและการประกันคุณภาพ (Engineering & QA), ตลอดจนคู่มือการปฏิบัติการ (Playbooks & Operations)

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
│   ├── design-system.md                      # 8-Bit Design Tokens, Typography, Geometry, Contrast Recipes
│   ├── information-architecture.md           # โครงสร้าง Sitemap, เส้นทาง (Routes) และ Responsive Grid
│   ├── world-and-scene-design.md             # ฉาก Neon Career Hall (Phaser, Zones, Props, NPCs, Camera)
│   ├── screen-blueprints.md                  # พิมพ์เขียวและ Wireframes ทุกหน้าจอ (SC-01 ถึง SC-17)
│   ├── component-library.md                  # แคตตาล็อก UI Components, Primitives และสถานะต่างๆ
│   ├── content-and-microcopy.md              # โทนเสียง (Voice & Tone) และชุดข้อความภาษาไทย/อังกฤษ
│   └── accessibility-spec.md                 # ข้อกำหนดการเข้าถึงตามมาตรฐาน WCAG 2.2 AA
│
├── 04-architecture/                          # สถาปัตยกรรมทางเทคนิคและสัญญาข้อมูล
│   ├── system-architecture.md                # สถาปัตยกรรมระบบหลัก (Component Diagram, Stack, Boundaries)
│   ├── state-machines.md                     # แผนภาพ State Machines (Event, Queue, Interview, Decision)
│   ├── domain-model-and-data.md              # Domain Entities, การแยก Identity Vault และ Retention
│   └── api-and-realtime-contracts.md         # สัญญา REST API, WebSocket Protocols, Error Codes
│
├── 05-security-and-governance/               # ความปลอดภัย ความเป็นส่วนตัว และ AI
│   ├── security-and-pdpa.md                  # การปฏิบัติตาม PDPA, Threat Model, Break-Glass Workflow
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
└── 07-playbooks-and-operations/              # คู่มือสำหรับ Agent และการนำเสนองาน
    ├── agent-playbook.md                     # คู่มือ AI Coding Agent (Invariants, Slices 0-6, Workflows)
    ├── demo-runbook-and-storyboard.md        # แผนการนำเสนอ 5 นาทีบนเวที, สคริปต์, Scenario Presets
    ├── demo-fixtures-and-assets.md           # ชุดข้อมูลจำลองมาตรฐาน (Fixtures) และ Asset Registry
    └── architecture-decision-records.md      # บันทึกการตัดสินใจทางสถาปัตยกรรม (ADR-001 ถึง ADR-010)
```

---

## 🧭 Quick Navigation by Role

- 👨‍💻 **สำหรับ AI Coding Agents & Developers:**
  1. เริ่มต้นที่ [07-playbooks-and-operations/agent-playbook.md](./07-playbooks-and-operations/agent-playbook.md) เพื่อทำความเข้าใจกฎเหล็ก 10 ประการ และ Build Sequence (Slices 0–6)
  2. ศึกษา [04-architecture/system-architecture.md](./04-architecture/system-architecture.md) และ [04-architecture/state-machines.md](./04-architecture/state-machines.md)
  3. ตรวจสอบข้อกำหนดใน [02-product/functional-requirements.md](./02-product/functional-requirements.md) และ [02-product/acceptance-criteria.md](./02-product/acceptance-criteria.md)

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
  2. ตรวจสอบข้อมูลจำลองใน [07-playbooks-and-operations/demo-fixtures-and-assets.md](./07-playbooks-and-operations/demo-fixtures-and-assets.md)

---

## ⚡ Quick Start Commands

```bash
# ติดตั้ง dependencies
npm install

# รัน Local Development Server
npm run dev

# ทดสอบ Typecheck, Build, และ Tests
npm run typecheck
npm run build
npm test
npm run test:e2e
npm run test:a11y
```
