# MaskedMatch — Complete Specification (Master Hub)

> **Skills First. Bias Last.**  
> **Interactive 8-bit Virtual Job Fair — Complete Specification Suite**  
> Version 2.1 · Interactive Career Hall Revision · August 2026

เอกสารข้อกำหนดฉบับสมบูรณ์ (Complete Specification) เดิมที่มีขนาดยาวกว่า 2,500 บรรทัด ได้รับการปรับโครงสร้างและจัดแบ่งออกเป็น **7 หมวดหมู่หลัก (26 เอกสารย่อย)** เพื่อความสะดวกในการอ่าน ค้นหา และนำไปพัฒนาต่ออย่างมีประสิทธิภาพ โดยข้อมูลทุกส่วนยังคงความครบถ้วน 100%

---

## 📑 สารบัญหมวดหมู่เอกสารทั้งหมด (Table of Contents)

### 1. หมวดภาพรวมและบทบาท (01-overview)
- [01-overview/executive-summary.md](./01-overview/executive-summary.md) — วิสัยทัศน์ ปัญหา เป้าหมาย พันธกิจ และ Stakeholders
- [01-overview/terminology.md](./01-overview/terminology.md) — นิยามศัพท์เทคนิค ลำดับความสำคัญ และ Document Control
- [01-overview/personas-and-permissions.md](./01-overview/personas-and-permissions.md) — บทบาทผู้ใช้ (Personas) และตารางสิทธิ์ (RBAC Matrix)

### 2. หมวดข้อกำหนดเชิงผลิตภัณฑ์ (02-product)
- [02-product/scope-and-roadmap.md](./02-product/scope-and-roadmap.md) — แผนพัฒนา R0 ถึง R4 และรายการที่อยู่นอกขอบเขต
- [02-product/user-journeys.md](./02-product/user-journeys.md) — เส้นทางการใช้งาน (Candidate, Recruiter, Organizer, Recovery)
- [02-product/functional-requirements.md](./02-product/functional-requirements.md) — ข้อกำหนดฟังก์ชัน (FR-AUTH ถึง FR-NOTIFY)
- [02-product/acceptance-criteria.md](./02-product/acceptance-criteria.md) — เกณฑ์การยอมรับ (AC-01 ถึง AC-31) และ Traceability Matrix

### 3. หมวดระบบการออกแบบและฉากเสมือน (03-design)
- [03-design/design-system.md](./03-design/design-system.md) — Design Tokens, Typography, Geometry, Contrast Recipes
- [03-design/information-architecture.md](./03-design/information-architecture.md) — Sitemap, Routes และ Responsive Layout Grid
- [03-design/world-and-scene-design.md](./03-design/world-and-scene-design.md) — ฉาก Neon Career Hall, บูธ, NPCs, Props, กล้อง
- [03-design/screen-blueprints.md](./03-design/screen-blueprints.md) — พิมพ์เขียวและ Wireframes ทุกหน้าจอ (SC-01 ถึง SC-17)
- [03-design/component-library.md](./03-design/component-library.md) — แคตตาล็อก UI Primitives และ Domain Components
- [03-design/content-and-microcopy.md](./03-design/content-and-microcopy.md) — โทนเสียง (Voice & Tone) และชุดข้อความภาษาไทย/อังกฤษ
- [03-design/accessibility-spec.md](./03-design/accessibility-spec.md) — ข้อกำหนดการเข้าถึงตามมาตรฐาน WCAG 2.2 AA

### 4. หมวดสถาปัตยกรรมทางเทคนิค (04-architecture)
- [04-architecture/system-architecture.md](./04-architecture/system-architecture.md) — สถาปัตยกรรมระบบหลัก (Component Diagram, Stack)
- [04-architecture/state-machines.md](./04-architecture/state-machines.md) — State Machines (Event, Queue, Interview, Decision)
- [04-architecture/domain-model-and-data.md](./04-architecture/domain-model-and-data.md) — Domain Entities, Identity Vault, Retention
- [04-architecture/api-and-realtime-contracts.md](./04-architecture/api-and-realtime-contracts.md) — สัญญา REST API และ WebSocket Protocols

### 5. หมวดความปลอดภัยและธรรมาภิบาล (05-security-and-governance)
- [05-security-and-governance/security-and-pdpa.md](./05-security-and-governance/security-and-pdpa.md) — PDPA Compliance, Threat Model, Break-Glass
- [05-security-and-governance/ai-governance.md](./05-security-and-governance/ai-governance.md) — จริยธรรม AI, Model Card, Guardrails, Integrity Signals
- [05-security-and-governance/identity-and-thaid.md](./05-security-and-governance/identity-and-thaid.md) — สถาปัตยกรรม Digital ID และการเชื่อมต่อ ThaID

### 6. หมวดวิศวกรรมและการประกันคุณภาพ (06-engineering-and-qa)
- [06-engineering-and-qa/performance-and-reliability.md](./06-engineering-and-qa/performance-and-reliability.md) — งบประมาณประสิทธิภาพ (SLOs), CI Profile
- [06-engineering-and-qa/observability-and-analytics.md](./06-engineering-and-qa/observability-and-analytics.md) — Logs, Metrics, Tracing และ Funnel Analytics
- [06-engineering-and-qa/test-strategy-and-gates.md](./06-engineering-and-qa/test-strategy-and-gates.md) — กลยุทธ์การทดสอบ และ Release Gates
- [06-engineering-and-qa/risks-and-decisions.md](./06-engineering-and-qa/risks-and-decisions.md) — ตารางความเสี่ยง และ Decision Registry
- [06-engineering-and-qa/definition-of-done.md](./06-engineering-and-qa/definition-of-done.md) — เกณฑ์การส่งมอบงาน (DoD) ฝั่ง Engineering และ Design

### 7. หมวดคู่มือปฏิบัติการและการสาธิต (07-playbooks-and-operations)
- [07-playbooks-and-operations/agent-playbook.md](./07-playbooks-and-operations/agent-playbook.md) — คู่มือ AI Coding Agent (Invariants, Slices 0-6)
- [07-playbooks-and-operations/demo-runbook-and-storyboard.md](./07-playbooks-and-operations/demo-runbook-and-storyboard.md) — แผนการนำเสนอ 5 นาทีบนเวที
- [07-playbooks-and-operations/demo-fixtures-and-assets.md](./07-playbooks-and-operations/demo-fixtures-and-assets.md) — ชุดข้อมูลจำลองมาตรฐาน (Fixtures) และ Asset Registry
- [07-playbooks-and-operations/architecture-decision-records.md](./07-playbooks-and-operations/architecture-decision-records.md) — บันทึกการตัดสินใจทางสถาปัตยกรรม (ADR-001 ถึง ADR-010)
