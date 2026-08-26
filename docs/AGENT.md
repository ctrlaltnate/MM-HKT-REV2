# MaskedMatch Agent Entrypoint

> **Version:** 3.3 · Website-first local foundation in progress

เริ่มจาก [Documentation Index](./README.md), [Current Progress and Handoff](./07-playbooks-and-operations/current-progress-and-handoff.md) และ [Terminology & Document Ownership](./01-overview/terminology.md) ทุกครั้ง เอกสารใช้หลัก one topic, one canonical owner; ห้ามสร้างสเปกซ้ำในไฟล์ใหม่

## Required Read Order

1. [Current Progress and Handoff](./07-playbooks-and-operations/current-progress-and-handoff.md) เพื่อตรวจ implementation truth และงานถัดไป
2. [Functional Requirements](./02-product/functional-requirements.md)
3. [Acceptance Criteria](./02-product/acceptance-criteria.md)
4. [Agent Playbook](./07-playbooks-and-operations/agent-playbook.md)
5. เมื่อลงมือสร้าง code ใช้ [Implementation Execution Plan](./07-playbooks-and-operations/implementation-execution-plan.md) เพื่อเลือก task/dependency/exit gate
6. เลือก owner ตามงาน:
   - Game/world/avatar/booth/collision: [Game Visual & World Specification](./03-design/world-and-scene-design.md)
   - Website/UI: [Website & Product UI Design System](./03-design/design-system.md)
   - Web/Game ownership: [Web–Game Separation](./04-architecture/web-game-separation.md)
   - State/domain/API: [Architecture](./04-architecture/system-architecture.md)
   - QA/release: [Definition of Done](./06-engineering-and-qa/definition-of-done.md)

## Project Invariants

- Website/Landing/Event/Virtual Fair เป็น journey เดียว แต่ React DOM กับ Phaser world แยก workspace/ownership
- Navigator/List Mode ทำ action สำคัญได้เท่า Canvas
- Blind identity, private decision, consented reveal และ fail-closed media ห้ามลดทอน
- Demo ใช้ synthetic data และติดป้าย mock อย่างตรงไปตรงมา
- Game ต้องผ่าน G1–G10: rendered entities, top-front camera, physics/depth, directional characters, layered wardrobe, booth variants, functional modes, runtime-shadow/shared-actor compositor, complete orientation/autotile coverage และ recolorable reusable parts
- `docs/ref_pics/` เป็น reference only; runtime asset ผ่าน `packages/assets/manifest.json`
- งาน world/visual ใช้ [MCP-Assisted Workflow](./07-playbooks-and-operations/mcp-assisted-workflow.md) และเก็บ evidence; ไม่บังคับ paid MCP/Phaser Editor
- เมื่อ implementation truth, verification หรือ recommended next slice เปลี่ยน ต้องอัปเดต [Current Progress and Handoff](./07-playbooks-and-operations/current-progress-and-handoff.md) ในงานเดียวกัน

เมื่อเอกสารขัดกัน ให้ใช้ลำดับ priority ใน [Terminology & Document Ownership](./01-overview/terminology.md) และแก้ canonical owner ก่อน supporting document
