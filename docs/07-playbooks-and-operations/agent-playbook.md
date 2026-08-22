# AI & Coding Agent Playbook

> **Version:** 3.0 · R0 implementation in progress · 22 August 2026
> **Purpose:** วิธีทำงานและข้อห้ามสำหรับ agent; ไม่ใช่เจ้าของรายละเอียด Product/UI/Game

---

## 1. Read Order and Ownership

ก่อนแก้งานให้อ่านเฉพาะเจ้าของหัวข้อที่เกี่ยวข้อง:

1. [Documentation Index](../README.md) และ [Terminology & Document Control](../01-overview/terminology.md)
2. [Functional Requirements](../02-product/functional-requirements.md) และ [Acceptance Criteria](../02-product/acceptance-criteria.md)
3. งานเกม: [Game Visual & World Specification](../03-design/world-and-scene-design.md)
4. งานเว็บ/UI: [Website & Product UI Design System](../03-design/design-system.md) และ [Screen Blueprints](../03-design/screen-blueprints.md)
5. งาน boundary/runtime: [Web–Game Separation](../04-architecture/web-game-separation.md)
6. งาน QA: [Test Strategy](../06-engineering-and-qa/test-strategy-and-gates.md) และ [Definition of Done](../06-engineering-and-qa/definition-of-done.md)

ห้ามสร้างสำเนาของกฎ game visual, UI token, requirement หรือ state machine ในไฟล์ใหม่ ให้แก้ owner document แล้ว link จากเอกสารประกอบ

---

## 2. Non-Negotiable Invariants

### Privacy and fairness

1. Recruiter ไม่เห็นชื่อ, รูป, contact, original resume หรือ masked PII ก่อน mutual consent
2. World เป็น optional; action สำคัญทั้งหมดมี Semantic Navigator/List Mode equivalent
3. กล้องและไมค์ปิดเป็นค่าเริ่มต้น; mask failure ต้อง fail closed ก่อน raw frame ไปถึง recruiter
4. Decision เป็นส่วนตัวจนทั้งสองฝ่ายส่งครบ และ reveal เป็น field-level consent หลัง mutual match
5. Integrity Signal ไม่ใช่หลักฐานโกงและห้าม auto-reject
6. ใช้ synthetic data/domain `.test` เท่านั้น และ mock capability ต้องติดป้ายให้เห็นใน UI

### Product and architecture

7. Website, Product Landing, Event Landing, preparation flow และ Virtual Fair เป็น journey เดียวที่ใช้งานได้จริง
8. Website เป็น React Semantic DOM owner; Phaser workspace เป็น owner เฉพาะ Career Hall
9. ทุก visible control มี action/state/error/recovery จริง; ห้าม dead control
10. back/forward, direct URL, reload, resume/reset, 404 และ mount/unmount ต้อง recover ตาม contract
11. Responsive core flow ผ่าน 320/390/768/1440 px และ keyboard/reduced-motion path

### Game quality

12. Career Hall ต้องผ่าน G1–G10 ของ [Game Visual & World Specification](../03-design/world-and-scene-design.md)
13. Final world object เป็น rendered/authored entity แยกชิ้น ไม่ใช่ flat hall, CSS hotspot หรือ primitive placeholder
14. ทุก scene element ใช้ orthographic top-front 3/4 camera, grid, scale และ top-left material-light convention เดียว; texture ไม่มี baked shadow และ Phaser render shadow แยก
15. Player/NPC ใช้ directional anatomy จริง, foot hitbox, Y-depth และ owner-linked collision/sensor
16. Character Studio แยก skin, hair, top, bottom/trousers, shoes และ accessory พร้อม 4-direction preview/apply/persist
17. Booth เป็น modular prefab และผ่าน variant minimum; ห้ามใช้ flip/rotate/arbitrary scale หลอกความหลากหลาย
18. งาน visual ใช้ two `00_MAIN_*` files เป็น master reference ด้าน readability เท่านั้น ห้าม copy asset/layout/branding
19. Player/NPC ใช้ base/skin/hair/top/bottom/shoes/accessory compositor เดียว; NPC สุ่มแบบ seeded และห้ามใช้ full-body atlas เป็น final system
20. Character/layer และ directional prop ต้องมี authored orientation/frame coverage ครบ; floor/road/wall ต้องมี complete autotile topology และทุก part ต้อง recolor/rearrange ผ่าน palette slots/metadata ได้

---

## 3. Vertical Slice Sequence

| Slice | Outcome | Scope boundary |
|---|---|---|
| 0 | Router, shell, tokens, demo store, test harness | foundation |
| 1 | Event landing, mock verify/consent, import, masked review | Website |
| 2 | Phaser world, Character Studio, discovery, Navigator parity | Website + Game contract |
| 3 | Queue, ready check, reconnect recovery | domain + realtime |
| 4 | Interview preflight, fail-closed mask, voice/media fallback | privacy-critical |
| 5 | Private decision, mutual match, consented reveal | privacy-critical |
| 6 | Recruiter desk, ops, accessibility and demo hardening | completion |

ทำ slice ปัจจุบันให้ผ่าน acceptance และ gate ก่อนอ้างว่า complete; implementation บางส่วนไม่เท่ากับ production-ready

---

## 4. Working Method

### Before coding

- ระบุ requirement/acceptance IDs, route, persona, state owner และ workspace owner
- ตรวจ code, tests, dirty worktree และ asset manifest ก่อนเพิ่มไฟล์/dependency
- งาน visual ต้องทำ evidence brief ตาม [MCP-Assisted Workflow](./mcp-assisted-workflow.md)
- กำหนดสิ่งที่เป็น implemented, mocked, planned และ blocked ให้ชัด

### During coding

- ทำ route → state/contract → UI/game entity → error/fallback → tests ใน vertical slice เดียว
- แยก domain rules จาก presentation และสื่อสาร Web–Game ผ่าน typed commands/events
- ใช้ canonical fixtures จาก [Demo Fixtures & Asset Registry](./demo-fixtures-and-assets.md)
- ตรวจ mobile และ keyboard ไปพร้อม desktop
- Asset runtime ต้องผ่าน manifest; ห้าม import `docs/ref_pics/`

### Before handoff

รายงาน outcome, files changed, routes/scenarios, tests, responsive/accessibility checks, current limitations และ MCP/provenance evidence ตามงานที่ทำ ห้ามเรียก mock, concept, static screenshot หรือ planned backend ว่า implemented

---

## 5. Current Commands

```bash
npm install
npm run dev
npm run typecheck
npm run test
npm run build
```

Root package มี workspace scripts แล้ว ข้อความเก่าที่อ้างว่า repository ยังไม่มี implementation หรือ npm workspace ถือว่า stale และต้องแก้ให้ตรงกับสถานะจริง

---

## 6. Stop and Ask

หยุดและขอผู้ใช้อนุมัติก่อนเมื่อจำเป็นต้อง:

- ใช้ production credential, PII จริง หรือ external account
- เปลี่ยน Blind Mode, Reveal Policy, Decision Privacy หรือ fail-closed policy
- ตัด Navigator/List Mode หรือ accessibility path
- ใช้ asset/license ที่ไม่ชัดเจน
- ส่ง raw camera/audio เมื่อ transform ล้มเหลว
- เริ่ม trial/subscription, ซื้อ credit หรือเชื่อม paid MCP/Phaser Editor
- publish/deploy หรือทำ external write ที่อยู่นอก scope
