# 1. Product Scope & Delivery Roadmap

---

## 1.0 Current Phase — Website-first Local Foundation In Progress

**สถานะ ณ 26 สิงหาคม 2026: repository มี runnable Website และ local API แล้ว; Game, production backend และ runtime assets ยังไม่เริ่ม**

- มี npm workspaces, React/Vite website, Express API, local persistence, role-aware routes และ Vitest/typecheck/build scripts; ยังไม่มี shared `packages/`, runtime asset manifest, E2E harness หรือ deployment artifact
- implementation รุ่นก่อนมีอยู่ใน Git history แต่ใช้ architecture/asset shortcuts ที่ไม่ผ่านข้อกำหนดปัจจุบัน จึงห้าม restore ทั้งก้อนแล้วอ้างว่าเป็น R0 implementation
- ภาพใน `docs/ref_pics/` เป็น reference only และยังไม่มี asset ใดผ่าน runtime admission
- Website foundation, Candidate Resume PDF/Gemini preparation, Admin fair creation และ Recruiter booth/job authoring มีสถานะ `IN_PROGRESS` พร้อม unit/build evidence; Career Hall, queue/interview/decision/reveal, durable backend, realtime, media และ deployment pipeline ยัง `NOT_STARTED`
- ลำดับงานและ exit gate อยู่ใน [Implementation Execution Plan](../07-playbooks-and-operations/implementation-execution-plan.md)
- เมื่อ implementation เริ่ม ให้เปลี่ยนสถานะเป็นราย task/delivery level `L1 Playable`, `L2 Demo Complete` หรือ `L3 Pilot Ready`; ห้ามใช้คำว่า implemented จาก mockup, historical commit หรือเอกสารเพียงอย่างเดียว

## 1.1 Release Strategy Overview

| Release | Focus | Target Environment | Key Objective |
|---|---|---|---|
| **R0** | Hackathon Prototype | Browser (Mobile + Desktop) | พิสูจน์ 5-Step Core Loop ด้วย Synthetic Data & Interactive Neon Career Hall |
| **R1** | Product Foundation | Staging / Private Alpha | แยก Identity Vault, วางโครงสร้าง RBAC, Durable Queue และ WebRTC Provider |
| **R2** | Closed Pilot MVP | Live Pilot Event | รองรับงาน Job Fair จริงร่วมกับพันธมิตร, ThaID Onboarding, WCAG 2.2 AA Gate |
| **R3** | Scale & Ecosystem | Production Multi-tenant | Multi-instance World, ATS / Calendar Integration, Advanced Media Privacy |
| **R4** | Policy & Ecosystem `[PDF]` | Policy & Public Sector | Skill Passport, Verifiable Credentials, Inclusive Co-design สำหรับกลุ่มเปราะบาง |

---

## 1.2 R0 — Hackathon Demo Scope

เป้าหมายคือการสาธิต Core User Loop ให้กรรมการและผู้ใช้เห็นคุณค่าภายใน 4–5 นาที โดยติดป้ายสิ่งจำลองอย่างตรงไปตรงมา:

### R0 Must Ship (สิ่งที่ต้องมีใน Prototype):
- **Complete Website + Product Landing:** มี Global Web Shell, value proposition, how-it-works, privacy/status/legal, responsive navigation, 404 recovery และ CTA ที่ทำงานจริงทุกจุด
- **Functional Event Landing:** แสดง Demo state, schedule, booths/jobs, accessibility/privacy, journey progress, Start/Resume/Reset และ Guest World โดยไม่ต้องแก้ URL เอง
- **Responsive Web Shell:** ผ่าน Smoke Test ที่ความกว้าง 320, 390, 768, 1024 และ 1440 CSS px
- **Interactive Neon Career Hall:** 1 ฮอลล์ในอาคารขนาดใหญ่, 4 บริษัทสมมติ, ช่อง Dynamic Logo, NPC Crowd (≥12 ตัว/5 บทบาท), Scene Props และ Smooth Camera Easing
- **P0 Game Visual Gate:** ผ่าน G1–G10 ของ [Game Visual & World Specification](../03-design/world-and-scene-design.md): top-front camera เดียว, real rendered entities, collision/depth, directional characters, wardrobe แยกเสื้อ–กางเกง–รองเท้า, modular booth variants, functional modes, no baked shadow, shared player/NPC compositor, complete orientation/autotile coverage และ recolorable/rearrangeable parts
- **Navigator / List Mode Parity:** โหมดรายการแบบ Semantic DOM 100% สำหรับค้นหา ดูบูธ เข้าคิว และนำทางโดยไม่ต้องควบคุม Canvas
- **Digital ID Verification & Consent:** ป้ายชัดเจน `DEMO DATA / OFFICIAL DIGITAL ID COMPLIANT`
- **Resume Import & Masked Profile:** เครื่องมือ Redaction สังเคราะห์ พร้อม Side-by-side Review ให้ Candidate ตรวจสอบและ Approve
- **Explainable Skill Match:** สูตรคำนวณคะแนนตามหลักฐาน (Deterministic Match Rule) พร้อมเหตุผล 3–5 ข้อจาก Evidence
- **Queue Management:** 1 Active Queue ต่อ Candidate, Position/ETA, Ready Check Alert Dialog และ Refresh Recovery
- **Interview Sandbox:** สัมภาษณ์แบบ 2 บทบาท (Candidate & Recruiter) หรือ Media Sandbox พร้อม Timer, Control Dock, Avatar-only Fallback
- **Private Decision & Requester-first Reveal:** ส่งผลแยกสองฝ่าย, resolve ทันทีเมื่อครบ, ไม่เปิดเผยว่าใคร Pass; หลัง Mutual Match Recruiter ขอ field + purpose ก่อน แล้ว Candidate grant subset/deny
- **Recruiter/Company Workspace:** กรอก company, job/JD/salary/rubric, booth/showcase, preview/validate/publish, รับคิว, ตรวจ Masked Profile, interview, decision, reveal request และ follow-up
- **Organizer/Support Workspace:** event/queue/interview/integration overview, pause/resume/broadcast, company moderation และ support ticket recovery ด้วย scoped aggregate data
- **State Recovery & Error Handling:** รองรับ Refresh ระหว่างรอคิว, Ready Check Timeout, Media Denied และ Network Reconnect
- **Shared Three-role Demo:** Candidate, Recruiter และ Ops tabs ใช้ `DemoScenarioStore` เดียวกันและ flow ทุก action ผ่าน adapter/canonical state
- **Demo Controller:** สำหรับ Reset ข้อมูล และสลับ Scenario Presets (Happy match, No match, Media denied, Queue timeout, Offline recovery, Reveal partial grant, Publication invalid)
- **Accessibility & Motion:** รองรับ Keyboard Core Flow, Reduced Motion และ Color Contrast AA

### R0 Must Not Pretend to Ship (ข้อห้ามสำหรับการสาธิต):
- ✕ การเชื่อมต่อ Production ThaID หรือระบบหน่วยงานราชการจริง
- ✕ AI ที่ตัดสินใจรับ/ไม่รับเข้าทำงานโดยอัตโนมัติ
- ✕ การกล่าวอ้างว่าระบบ “ไร้อคติ 100%” หรือ “ตรวจจับการโกงได้สมบูรณ์”
- ✕ Eye tracking, Emotion / Personality inference, Humanity score หรือ Browser locking
- ✕ การเปิดกล้อง/ไมค์/บันทึกเสียงโดยไม่ได้รับอนุญาตล่วงหน้า
- ✕ ข้อมูลบุคคลจริง, ชื่อบริษัทจริง, หรือ Asset ที่ละเมิดลิขสิทธิ์จากภายนอก

---

## 1.3 R2 — Pilot MVP Scope (Production Readiness)

### Must Deliverables:
- **Authentication & Identity:** Email/Phone OTP พร้อม Identity Provider ที่ผ่านการรับรอง; ThaID เมื่อได้รับความเห็นชอบและ Credentials จาก DOPA
- **Resume & Masked Profile:** File Upload Sandbox (PDF/DOCX), Malware Scan, Redaction Review และ Immutable Profile Versioning
- **Job & Booth Management:** Structured Job Posting, Skill Weighting, Verified Company Onboarding
- **Explainable AI Matching:** Model Card, Feature Exclusion Policy, Disparity Monitoring และ Deterministic Fallback
- **Spatial World & Full Navigator:** Multi-zone Career Hall พร้อม Full Semantic DOM Alternative
- **Durable Queue Orchestrator:** FIFO Queue, Atomic Claim, Ready Check (60s), Event-scoped Pause
- **WebRTC Interview Room:** Managed SFU/TURN, Preflight Check, Masking Capability Ladder (Video Mask -> Blur -> Avatar -> Audio -> Text)
- **Double-blind Decision & Reveal:** Encrypted Choice, Time-bounded Resolution, Field-level Reveal Grants, Revocation Workflow
- **Admin Portals:** Recruiter Desk, Company Admin Portal, Organizer Live Operations Dashboard, Moderator Tools
- **PDPA & Compliance:** Separate Identity Vault, Consent Center, DSAR Workflow, Automated Retention Purge
- **Accessibility & Quality:** ผ่านเกณฑ์ WCAG 2.2 AA Release Gate, Load Testing ตาม Capacity ที่อนุมัติ

---

## 1.4 R3+ & Post-Pilot Extensions

- รองรับการเข้าคิวหลายตำแหน่งพร้อม Conflict Resolution Policy
- Proximity Audio / Video Conversation แบบ Explicit Opt-in
- Main Stage Keynotes พร้อม Live Captions และ Sign Language Interpreter
- Collaborative Realtime Codepad / Whiteboard สำหรับ Technical Assessment
- ATS & Calendar Integration (เช่น Greenhouse, Lever, Google Calendar)
- On-device AudioWorklet Formant/Pitch Voice Alteration
- Event Map Builder และ Custom Booth Designer
- Aggregated Education-to-Employment Insights Dashboard

---

## 1.5 Explicitly Deferred / Out of Scope (จนกว่าจะผ่าน Legal/Ethics Review)

- ✕ การตัดสิทธิ์ผู้สมัครอัตโนมัติจาก Gaze, Facial expression, Voice tone, หรือ Tab visibility
- ✕ การบันทึกวิดีโอ/เสียงสัมภาษณ์เป็นค่าเริ่มต้น (Recording must always be explicit opt-in)
- ✕ การประเมินอารมณ์หรือบุคลิกภาพ (Emotion / Personality Inference) จากใบหน้าหรือน้ำเสียง
- ✕ การคาดเดาเพศ อายุ หรือเชื้อชาติ (Demographic Inference)
- ✕ ระบบ Social Scoring ข้ามงานอีเวนต์
- ✕ การแสดง Leaderboard ผู้สมัครแบบสาธารณะ
- ✕ ฟังก์ชันให้ Recruiter ค้นหาผู้สมัครด้วย Sensitive / Protected Attributes
