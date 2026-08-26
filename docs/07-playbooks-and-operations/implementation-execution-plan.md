# MaskedMatch Implementation Execution Plan

> **Document role:** แผนลงมือพัฒนาทีละส่วนจาก local website foundation ไปสู่ Interactive Demo และ Pilot-ready system
> **Version:** 1.1 · 26 August 2026
> **Current baseline:** Website-first local foundation runs in `apps/web` + `apps/api`; Phaser/game and production backend are deferred

เอกสารนี้เป็นเจ้าของเฉพาะ **ลำดับงาน, dependency, deliverable และ exit gate** ไม่สร้าง requirement, visual rule, state machine หรือ API contract ชุดใหม่ หากรายละเอียดขัดกับ canonical owner ให้แก้ owner ก่อนแล้วอัปเดต task ในแผนนี้

Canonical owners:

- Product scope: [Scope & Roadmap](../02-product/scope-and-roadmap.md)
- Functional behavior: [Functional Requirements](../02-product/functional-requirements.md)
- Acceptance: [Acceptance Criteria](../02-product/acceptance-criteria.md)
- Website/UI: [Website & Product UI Design System](../03-design/design-system.md)
- Game/world/assets: [Game Visual & World Specification](../03-design/world-and-scene-design.md)
- Routes/screens: [Information Architecture](../03-design/information-architecture.md) และ [Screen Blueprints](../03-design/screen-blueprints.md)
- Web/Game boundary: [Web–Game Separation](../04-architecture/web-game-separation.md)
- Domain transitions: [State Machines](../04-architecture/state-machines.md)
- API/realtime: [API & Realtime Contracts](../04-architecture/api-and-realtime-contracts.md)
- QA/release: [Test Strategy](../06-engineering-and-qa/test-strategy-and-gates.md) และ [Definition of Done](../06-engineering-and-qa/definition-of-done.md)

### Current implementation checkpoint

| Area | Completed in local foundation | Required next gate |
|---|---|---|
| Engineering | npm workspaces, root dev/typecheck/test/build, React/Vite and Express/TypeScript | CI, Playwright/Axe, shared contracts and deployment |
| Website/UI | role-aware shell, responsive 8-bit surfaces, selective liquid glass, GSAP motion and 404 | UI gallery, overlays, 320/768 interaction evidence and full a11y audit |
| Membership | local register/login/logout, PBKDF2 password hash, role guards and browser persistence | backend sessions, server RBAC, verification/recovery and multi-device persistence |
| Candidate | profile, local PDF extraction, explicit Gemini consent, structured masked analysis and opt-in fair sharing | correction/approval/versioning, malware scan/object storage and durable audit |
| Admin/Recruiter | fair lifecycle, company, booth, job/JD/salary, published directory and consent-filtered Candidate board | tenant authorization, moderation/validation, edit/unpublish and server storage |
| Game/assets | intentionally deferred by current product priority | resume at Phase 2/3 after website preparation gates pass |

---

## 1. Delivery Levels

ห้ามใช้คำว่า “เสร็จ” โดยไม่ระบุระดับต่อไปนี้:

| Level | Meaning | Required proof |
|---|---|---|
| **L1 — Playable Slice** | เว็บไซต์เปิดได้, Character Studio ใช้ได้, World เดิน/ชน/interact ได้ และ Navigator ทำ action เดียวกัน | local runtime, automated tests, 390/1440 interaction capture |
| **L2 — Demo Complete** | Candidate, Recruiter/Company และ Organizer/Support เล่นเรื่องเดียวกันจน Happy Match/No Match ได้ด้วย synthetic data | AC-35, AC-41..44, shared scenario, recovery presets, five-minute runbook |
| **L3 — Pilot Ready** | ต่อ backend, identity, durable state, realtime, media, audit, retention และ operations จริง | connected contract tests, security/a11y/load/recovery evidence, production gates |

เป้าหมายลำดับแรกคือ L1 จากนั้น L2 ห้ามเริ่ม production infrastructure ขนาดใหญ่ก่อน L2 domain flow ผ่านด้วย adapter contract เพราะจะทำให้แก้ UX/state แพงเกินจำเป็น

---

## 2. Target Repository Layout

```text
apps/
├── web/                         # React DOM: routes, UI, forms, HUD, role workspaces
└── game/                        # Phaser: world, movement, physics, actors, camera
packages/
├── contracts/                   # versioned Web↔Game commands/events + API DTOs
├── domain/                      # entities, pure transitions, validation, demo clock
├── assets/
│   ├── manifest.json            # admitted runtime assets only
│   ├── game/                    # atlas, tilemap, sprites, metadata
│   ├── media/                   # approved mask/overlay assets
│   └── source/                  # source sheets awaiting normalization/review
├── demo/                        # synthetic fixtures, presets, DemoScenarioStore
└── test-support/                # builders, viewport fixtures, contract harness
tools/
├── assets/                      # alpha/crop/register/atlas/manifest validation
└── qa/                          # coverage report and evidence helpers
tests/
├── e2e/                         # Playwright journeys
├── visual/                      # camera/UI/asset evidence scenes
└── contracts/                   # demo/connected parity suites
```

Root scripts required from the first runnable commit:

```bash
npm run dev
npm run typecheck
npm run test
npm run test:e2e
npm run build
npm run assets:validate
```

---

## 3. Implementation Sequence

### Phase 0 — Repository Truth and Engineering Foundation

**Outcome:** repository ติดตั้งและเปิดได้ด้วยคำสั่งเดียว โดยสถานะเอกสารตรงกับสิ่งที่มีจริง

| Task | Work | Output | Exit gate |
|---|---|---|---|
| `FND-001` | แก้ current-status claims ที่อ้าง implementation ซึ่งไม่มีใน `HEAD` | README/roadmap status ที่ truthful | ไม่มีคำสั่ง run หรือ path ที่ไม่มีอยู่ |
| `FND-002` | สร้าง npm workspaces และ root scripts | root `package.json`, lockfile, workspace configs | clean install + all empty-suite commands pass |
| `FND-003` | Scaffold React/Vite/TypeScript ใน `apps/web` | app shell + route recovery | `/`, `/event/demo`, unknown route render ได้ |
| `FND-004` | Scaffold Phaser exact version ตาม engine decisionใน `apps/game` | isolated game package | game builds without importing React |
| `FND-005` | สร้าง `packages/contracts`, `domain`, `assets`, `demo` | dependency boundaries | forbidden import checks pass |
| `FND-006` | ตั้ง Vitest, RTL, Playwright, Axe และ CI baseline | test harness | typecheck/test/build run from root |
| `FND-007` | สร้าง public config validator สำหรับ `demo/connected` | composition root | invalid connected config fails truthfully |

**Do not include:** final art, multiplayer, backend, media provider หรือ production credentials

---

### Phase 1 — 8-bit Website and Product UI Foundation

**Outcome:** React DOM มี visual language 8-bit ที่เป็นมืออาชีพและ reusable ก่อนสร้างหน้าจอจำนวนมาก

#### UI foundation tasks

| Task | Work | Output | Exit gate |
|---|---|---|---|
| `UI-001` | แปลง design tokens เป็น CSS custom properties | colors, spacing, type, focus, motion tokens | token contrast and snapshot tests pass |
| `UI-002` | ตั้ง typography ไทย/อังกฤษ | body sans + short pixel/mono display roles | Thai paragraph readable at 320 px/200% zoom |
| `UI-003` | สร้าง original SVG/pixel icon set | navigation, status, queue, avatar, media icons | no emoji; accessible names present |
| `UI-004` | สร้าง primitives | Button, IconButton, Field, Select, Checkbox, Radio, Card, Badge | all required interaction states implemented |
| `UI-005` | สร้าง overlays | Dialog, Drawer, BottomSheet, Tabs, Toast, Skeleton | focus trap/return/Escape/live-region tests pass |
| `UI-006` | สร้าง shells | GlobalHeader, mobile menu, AppShell, WorldHUDShell | 320/390/768/1440 no core overflow |
| `UI-007` | สร้าง `/dev/ui` development gallery | every component/state on one route | keyboard and reduced-motion QA repeatable |

#### Visual direction

- 8-bit มาจาก grid, pixel edge, selective outline, hard offset shadow, custom icon และ animation rhythm
- ใช้ `Noto Sans Thai`/system sans กับข้อความยาว; pixel font ใช้เฉพาะ heading สั้น/ตัวเลข
- cyan ใช้กับ information/navigation, violet กับ selection/avatar, mango กับ attention/Ready Check, pink กับ match accent
- glow/CRT/liquid-glass เป็น accent เท่านั้น ห้ามทำให้ข้อความเบลอหรือแทน hierarchy
- semantic status ต้องใช้ text + icon/shape ไม่ใช้สีอย่างเดียว

---

### Phase 2 — Phaser Movement Lab

**Outcome:** movement ให้ความรู้สึกแบบ spatial world ของ Hideout/Gather แต่ใช้ contract และ privacy rules ของ MaskedMatch

| Task | Work | Output | Exit gate |
|---|---|---|---|
| `MOV-001` | Phaser host lifecycle | boot once, resize, suspend, destroy | mount/unmount loop produces no duplicate canvas/listener |
| `MOV-002` | Keyboard movement motor | WASD/arrow, normalized diagonal, time-based velocity | input-to-avatar feedback within local budget |
| `MOV-003` | Tap/click movement | navigation grid, A* path, reachable target, cancel/repath | mobile reaches destination without targeting collider center |
| `MOV-004` | Player body | foot hitbox, world bounds, collision resolution | actor cannot cross solid debug fixtures |
| `MOV-005` | Direction and animation | south/north/west/east + idle/step frames | no front-frame substitution for back/side |
| `MOV-006` | Camera | follow, clamp/dead zone, resize behavior, Reduced Motion | no camera jump on panel open/viewport resize |
| `MOV-007` | Depth/occlusion | base-Y sorting and foreground occluder | player walks correctly before/behind fixtures |
| `MOV-008` | Interaction | owner-linked sensor + approach point + `E`/click/tap | prompt appears only for reachable active entity |
| `MOV-009` | Typed bridge | commands/events from Web–Game contract | no React object, DOM node or mutable store crosses boundary |
| `MOV-010` | Navigator parity spike | list target → `navigateTo`; detail opens without Canvas | booth action works with keyboard and Canvas disabled |
| `MOV-011` | Debug evidence scene | body/sensor/path/depth/shadow toggles | collision lane captured at 390 and 1440 |

Suggested tuning values are implementation defaults, not new canonical requirements: 60 Hz fixed simulation, actor speed around 130–150 logical px/s, normalized diagonal, small center-bottom foot body and render interpolation. Tune through playtest and record approved values in the Game Visual owner.

Temporary primitive geometry is permitted only in this debug lab. It cannot pass final World visual gates.

---

### Phase 3 — Pre-asset Render and Asset Pipeline

**Outcome:** generated/art-authored sources ถูกตรวจ แยกชิ้น normalize และ pack ได้ซ้ำโดยไม่แก้ crop coordinate ใน scene code

#### Pipeline tasks

| Task | Work | Output | Exit gate |
|---|---|---|---|
| `AST-001` | Reference review record | principles extracted from authorized references | copied items explicitly excluded |
| `AST-002` | Machine-readable sidecar schema | part/frame/orientation/anchor/palette metadata schema | invalid or incomplete source rejected |
| `AST-003` | Alpha inspection | genuine RGBA and baked-content detector/review | checkerboard/floor/shadow contamination blocked |
| `AST-004` | Crop/register/normalize | deterministic cell extraction and baseline registration | repeat run produces identical checksum |
| `AST-005` | Palette masks | semantic highlight/base/shade slots | recolor changes intended material only |
| `AST-006` | Atlas packing | separated floor/booth/prop/avatar families | nearest-neighbor atlas loads by stable frame ID |
| `AST-007` | Manifest/provenance | source→runtime lineage, license/tool/checksum/reviewer | every runtime import exists in manifest |
| `AST-008` | Coverage reports | character, prop orientation and autotile matrix | missing cells block runtime-ready status |
| `AST-009` | Visual test scenes | lineup, turntable, maze, collision, rearrangement | evidence stored for each admission gate |

#### Pre-render production order

1. `PR-01 Camera Lineup` — actor + facade + counter + kiosk + chair + plant บน baseline/grid เดียว
2. `PR-02 Character Base` — 4 directions × 3 frames พร้อม skin mask/anchors
3. `PR-03 Wardrobe Proof` — hair/top/bottom/shoes/accessory อย่างละหนึ่ง complete variant
4. `PR-04 Character Expansion` — variant minimum ทั้งหมดหลัง proof registration ผ่าน
5. `PR-05 Booth Anatomy` — facade/counter/showcase/kiosk/queue/sign แยก RGBA
6. `PR-06 Environment Variants` — ขยายจำนวนตาม minimum catalog โดย silhouette/material ต่างจริง
7. `PR-07 Prop Turntable` — N/E/S/W สำหรับ directional props
8. `PR-08 Autotile Kit` — floor/aisle/pad/transition/wall/opening topology
9. `PR-09 Partition Kit` — straight/L/U/shared-wall และ door left/center/right/wide
10. `PR-10 UI Icon Sheet` — original icons สำหรับ Website/HUD โดยไม่มี emoji

ทุก brief ต้องใช้ contract ใน Game Visual section 8.3 และทุกผลลัพธ์ต้องผ่าน human review ก่อนเข้า `packages/assets/manifest.json`

---

### Phase 4 — Career Hall Vertical Slice

**Outcome:** hall เป็น Phaser entities จริง เดิน สำรวจ และใช้งานหนึ่งบูธแบบ end-to-end ก่อนขยายเป็น four-booth gate

| Task | Work | Output | Exit gate |
|---|---|---|---|
| `WRD-001` | Scene layers | floor, decal, shadow, collision, props, actors, foreground, FX | layer toggles and lifecycle tests pass |
| `WRD-002` | Plain modular floor | tilemap + navigation/collision metadata | no booth/person/hotspot baked into floor |
| `WRD-003` | Entity factory | stable IDs, pivots, footprint, collider, sensor, lifecycle | entity overlay matches metadata |
| `WRD-004` | Runtime shadows | owner-linked no-collider shadow objects | disabling shadow removes every ground shadow only |
| `WRD-005` | Booth prefab | data-driven assembly + dynamic sign/content sockets | rearrange/recolor without redraw |
| `WRD-006` | One complete booth | recruiter point, kiosk, job display, queue approach | Canvas and Navigator open same booth/job data |
| `WRD-007` | Four-booth hall | non-identical adjacent combinations | variety minimum and doorway traversal pass |
| `WRD-008` | Character compositor | shared DynamicTexture/atlas contract | Player/preview/NPC use same frames and palette rules |
| `WRD-009` | NPC population | 12 seeded NPCs, 5 role silhouettes, movement schedules | seed reproducibility and collision pass |
| `WRD-010` | Character Studio integration | all layers/colors/directions/randomize/save | apply immediately and recover after reload |
| `WRD-011` | World modes | World, Navigator, booth, dialogue, Info Hub, Studio | no dead control; game input pauses under DOM UI |
| `WRD-012` | Seamless module | wrap or streamed repeating module + nav continuity | no false “endless” label before runtime proof |

**World exit gate:** G1–G10 and AC-31..40. A screenshot or static render alone does not pass.

---

### Phase 5 — Public Website and Candidate Preparation

**Outcome:** ผู้ใช้เข้า product จาก URL เปล่าและไปถึง Hall ได้ผ่าน controls ที่มองเห็นทั้งหมด

| Slice | Routes/screens | Primary completion |
|---|---|---|
| `WEB-01` | `/` | value proposition, how it works, privacy/a11y, working Event CTA |
| `WEB-02` | `/event/demo`, canonical event route | schedule, booth/job preview, progress, Start/Resume/Reset/Guest World |
| `WEB-03` | sign-in/mock verify + consent | role-aware entry, versioned demo consent, truthful labels |
| `WEB-04` | profile import | sample/upload simulation/manual modes with validation |
| `WEB-05` | processing | recoverable lifecycle states and safe failure paths |
| `WEB-06` | masked review | source vs recruiter view, uncertainty correction, approval |
| `WEB-07` | avatar | Character Studio route using game compositor |
| `WEB-08` | world/navigator | one game mount; destroy on exit; direct-route recovery |
| `WEB-09` | legal/status/404 | truthful implementation limits and recovery links |

ทุก slice ต้องทำ 320, 390, 768, 1024 และ 1440 px พร้อม keyboard, focus, loading, empty, validation, permission, offline และ server-error states ตามบริบท

---

### Phase 6 — Shared Demo Domain and Adapters

**Outcome:** ทุก role ใช้ state เดียวกันและ UI ไม่ผูกกับ fixture โดยตรง

| Task | Work | Exit gate |
|---|---|---|
| `DOM-001` | Canonical domain types and pure transition guards | illegal transitions fail unit tests |
| `DOM-002` | `AppGateway` ports | components import ports, not fetch/provider/fixture |
| `DOM-003` | `DemoScenarioStore` | versioned snapshot + deterministic scenario clock |
| `DOM-004` | Cross-tab sync | BroadcastChannel + local snapshot fallback |
| `DOM-005` | Idempotency/version | duplicate mutation returns same result; conflict recoverable |
| `DOM-006` | Demo presets | Happy Match, No Match, Media Denied, Queue Timeout, Offline Recovery, Partial Reveal, Publication Invalid, Integration Down |
| `DOM-007` | `/demo/control` | reset/preset within five seconds; hidden from normal role navigation |

---

### Phase 7 — Queue, Interview, Decision and Reveal

**Outcome:** Candidate ทำ complete core loop ได้ด้วย demo adapter โดย privacy invariants ไม่ถูกลดทอน

| Slice | Required behavior | Acceptance focus |
|---|---|---|
| `FLOW-01 Queue` | one active ticket, join/cancel, position/ETA, refresh recovery | AC-06, AC-07 |
| `FLOW-02 Ready Check` | authoritative 60s clock, accessible dialog, accept/timeout/requeue | AC-08, AC-09, AC-26 |
| `FLOW-03 Preflight` | explicit permission, device/capability check, avatar/audio/text fallbacks | AC-10, AC-11 |
| `FLOW-04 Interview` | role-aware room, timer, reconnect, no recording by default | AC-24 |
| `FLOW-05 Private Decision` | idempotent private submit and waiting state | AC-13 |
| `FLOW-06 Resolver` | resolve only after both decisions; respectful No Match | AC-15, AC-43 |
| `FLOW-07 Reveal Request` | recruiter selects fields + purpose after Mutual Match | AC-14, AC-43 |
| `FLOW-08 Candidate Grant` | grant subset/all or deny; no default postal address | AC-21, AC-43 |
| `FLOW-09 Follow-up` | recruiter sees only granted values and sends next step | audit/scoped access tests |

Demo may use avatar-only or labeled simulated peer. It must not call media “real” until camera/mask/audio pipeline has runtime evidence.

---

### Phase 8 — Recruiter/Company and Organizer/Support

#### Recruiter/Company

- `REC-01` role entry and capability guard
- `REC-02` company profile editor
- `REC-03` job/JD/salary/rubric editor
- `REC-04` booth/showcase editor with provenance
- `REC-05` Preview → Validate → Publish/Pause/Unpublish
- `REC-06` availability and masked queue board
- `REC-07` atomic claim simulation and interview readiness
- `REC-08` private rubric/decision
- `REC-09` requester-first reveal and follow-up

#### Organizer/Support

- `OPS-01` event/queue/interview aggregate health
- `OPS-02` pause/resume/broadcast with reason
- `OPS-03` sanitized integration status
- `OPS-04` company/showcase moderation
- `OPS-05` support ticket create/assign/update/resolve
- `OPS-06` incident and accessibility recovery
- `OPS-07` scoped audit view; no private decision/contact values

**Demo-complete gate:** AC-41..44 ผ่านใน three-tab test โดยไม่แก้ storage/console และ Demo Runbook ทำครบภายในห้านาที

---

### Phase 9 — Connected Backend and Realtime

เริ่มเมื่อ L2 ผ่านและ UI/state contract คงที่พอสมควร

| Workstream | Implementation |
|---|---|
| `BE-01 Platform` | TypeScript modular BFF, PostgreSQL migrations, health, request IDs |
| `BE-02 Auth/RBAC` | session, capability endpoint, tenant/org/event authorization |
| `BE-03 Identity Vault` | separate credentials/encryption boundary and scoped reveal reads |
| `BE-04 Profile Worker` | signed upload, quarantine, malware scan, parse/redact/review lifecycle |
| `BE-05 Company Publication` | versioned draft, validation, atomic publication snapshot |
| `BE-06 World Presence` | zone/instance presence, movement intents, authoritative deltas |
| `BE-07 Queue` | durable one-active constraint, atomic claim, deadlines and recovery |
| `BE-08 Interview` | state/timer service and short-lived media-room token |
| `BE-09 Decision/Reveal` | encrypted decisions, atomic resolver, requester-first scoped grants |
| `BE-10 Operations` | aggregate metrics, support, incidents, audited controls |
| `BE-11 Realtime` | scoped WebSocket streams, cursor/resync/deduplication |
| `BE-12 Jobs` | expiry, retention/purge and notification workers |

`HttpRealtimeAppGateway` ต้องผ่าน contract suite เดียวกับ Demo adapter Connected mode ห้าม import demo fixture หรือ fallback เป็น synthetic state เมื่อ dependency ล้มเหลว

---

### Phase 10 — Real Media, Security, Deployment and Scale

| Task group | Required completion |
|---|---|
| Media | getUserMedia consent, on-device landmark compositor, outgoing transformed track, fail-closed guard, avatar/audio/text fallback |
| Audio | optional AudioWorklet spike; intelligibility/device evidence before enabling |
| Security | threat model tests, secret scan, tenant isolation, audit, rate limit, DSAR and retention |
| Accessibility | Axe + keyboard + NVDA/VoiceOver + 320 px/400% zoom + Reduced Motion |
| Performance | route splitting, atlas/chunk budgets, world FPS, input latency, WebRTC resource handoff |
| Reliability | reconnect storm, Redis loss, DB transaction, provider outage, backup/restore |
| Deployment | dev/staging/prod isolation, migrations, immutable artifacts, canary and rollback rehearsal |
| Capacity | approved event profile, component load, event rehearsal, failure rehearsal and soak |

Voice transformation is not a blocker if the approved roadmap keeps it deferred; fail-closed video and dignified non-camera paths remain mandatory where real media is enabled.

---

## 4. Cross-Cutting Test Matrix

แต่ละ slice ต้องเพิ่ม test ใน layer ที่เกี่ยวข้อง ไม่รอทำ QA ตอนท้าย:

| Layer | Minimum tests |
|---|---|
| Domain | transition guards, idempotency, versions, timers, privacy selectors |
| Contracts | Web↔Game serialization, API envelope, demo/connected parity |
| Components | keyboard/focus, loading/error, duplicate submit, live region |
| Game | movement, collision, path reachability, depth, sensors, lifecycle |
| Assets | alpha, shadow contamination, orientation/frame/topology coverage, checksum |
| E2E | candidate, recruiter, ops, presets, reload, direct URL, responsive paths |
| Security | cross-tenant denial, PII/log scan, private decision/reveal scope |
| Performance | shell transfer, world asset pack, FPS/input, memory after destroy |

Required evidence routes/scenes:

- `/dev/ui`
- `/dev/game/movement`
- `/dev/game/camera-lineup`
- `/dev/game/character-turnaround`
- `/dev/game/prop-turntable`
- `/dev/game/autotile-maze`
- `/dev/game/collision-lane`
- `/demo/control`

Development routes must be excluded or access-controlled in production builds.

---

## 5. Recommended Commit Order

1. `docs: correct repository baseline and add execution plan`
2. `chore: scaffold npm workspaces and quality commands`
3. `feat(ui): add tokens, typography, icons and primitive gallery`
4. `feat(game): add Phaser host lifecycle and movement lab`
5. `feat(game): add collision, pathfinding, depth and interaction bridge`
6. `feat(assets): add manifest schema and validation pipeline`
7. `feat(assets): admit first complete actor and booth proof set`
8. `feat(world): compose one-booth Career Hall slice`
9. `feat(web): add landing, event and candidate preparation journey`
10. `feat(demo): add shared scenario store and presets`
11. `feat(flow): add queue and Ready Check recovery`
12. `feat(flow): add preflight, interview fallback and private decision`
13. `feat(flow): add requester-first reveal and follow-up`
14. `feat(recruiter): add company publication and Live Desk`
15. `feat(ops): add operations and support workspace`
16. `test: close AC-35 and AC-41..44 demo gates`
17. `feat(api): add connected backend adapter and durable services`
18. `feat(media): add measured real-media privacy pipeline`
19. `ops: add staging, observability, recovery and deployment gates`

แต่ละ commit ต้อง build/test ได้เอง ห้ามรวม generated source หลายร้อยไฟล์กับ runtime behavior และ route flow ไว้ใน commit เดียว

---

## 6. Vibe Coding Work Card

ทุก coding session ใช้ work card นี้เพื่อคุม scope:

```text
Task ID and outcome:
Delivery level: L1 / L2 / L3
Canonical docs and FR/AC IDs:
Persona and routes:
Workspace owner: web / game / shared / backend / assets
Allowed files/packages:
State owner and transitions:
Required loading/error/recovery states:
Responsive/a11y targets:
Tests and evidence required:
Explicit non-goals:
Truthful demo/connected label:
```

กฎการทำงาน:

1. ทำ route/state/UI-or-entity/recovery/tests เป็น vertical slice เดียว
2. หนึ่ง session ห้ามเปลี่ยนทั้ง architecture, asset direction และ product policy พร้อมกัน
3. ห้ามเพิ่ม control ก่อนกำหนด action/error/recovery
4. ห้ามเพิ่ม runtime asset ก่อน manifest/provenance/coverage ผ่าน
5. ห้ามเรียก placeholder, mock media, fixture หรือ static render ว่า implemented production capability
6. งาน visual ต้องเก็บ MCP/tool evidence ตาม workflow ที่กำหนด
7. หาก slice ยังไม่ผ่าน exit gate ให้รายงาน `PARTIAL` พร้อม missing evidence แทน `DONE`

---

## 7. Immediate Starting Backlog

ลำดับเริ่มงานที่ลดความเสี่ยงที่สุด:

### Batch A — Foundation

- [ ] `FND-001..007`
- [ ] `UI-001..007`
- [ ] `/`, `/event/demo` และ 404 render ผ่าน shell เดียวกัน

### Batch B — Playable movement

- [ ] `MOV-001..011`
- [ ] test player ใช้ temporary debug sprite ที่ประกาศชัด
- [ ] keyboard/tap/Navigator target ใช้ movement motor เดียวกัน

### Batch C — First production-quality visual proof

- [ ] `AST-001..009`
- [ ] `PR-01..03`, `PR-05`, `PR-10`
- [ ] one actor + one booth complete before expanding variants

### Batch D — L1 vertical slice

- [ ] `WRD-001..006`, `WRD-008`, `WRD-010..011`
- [ ] `WEB-01..09`
- [ ] AC-31..35 evidence at 390 and 1440 px

### Batch E — L2 completion

- [ ] four-booth/asset gates and `WRD-007`, `WRD-009`, `WRD-012`
- [ ] `DOM-001..007`, `FLOW-01..09`
- [ ] Recruiter and Ops workspaces
- [ ] AC-36..44 and five-minute runbook

### Batch F — L3 pilot

- [ ] `BE-01..12`
- [ ] real media/security/accessibility/load/deployment gates
- [ ] connected rehearsal with synthetic staging tenant before real user data

---

## 8. Completion Reporting

ทุก handoff ต้องรายงาน:

- task IDs และ delivery level ที่ปิดได้จริง
- routes/scenarios ที่ทดลองได้จาก visible controls
- files/packages changed
- tests/build/asset validation ที่รันและผลลัพธ์
- viewport, keyboard, Reduced Motion และ visual evidence
- implemented vs mocked vs planned vs blocked
- asset provenance/checksum เมื่อมีงานภาพ
- privacy/security limitations และ dependency ถัดไป

แผนนี้ถือว่าเสร็จเมื่อทุก task ถูกย้ายไปยัง issue/backlog ที่ track ได้ หรือมี implementation/evidence ปิด gate ที่เกี่ยวข้อง ไม่ใช่เมื่อสร้างหน้าจอหรือภาพ concept ครบเพียงอย่างเดียว
