# 1. Product Scope & Delivery Roadmap

---

## 1.0 Current Phase — R0 Implementation Started

**สถานะ ณ 22 สิงหาคม 2026: Website foundation, Candidate Preparation และ World vertical slice implemented**

- scaffold `apps/web` (React DOM) และ `apps/game` (Phaser 4.2.1) เป็นคนละ workspace แล้ว
- มี Product Landing, Event Landing, Mock Verify/Consent, Profile Import/Masked Review, Character Setup, legal/status/404 และ route journey ที่ resume/reset ผ่าน local demo state ได้
- มี Career Hall 1 ฉาก, 4 synthetic booths, NPC crowd, player movement, collision, proximity interaction, DOM booth detail, queue fixture และ Navigator parity ขั้นต้น
- Game visual gate ยังไม่ครบ: wardrobe ปัจจุบันยังรวม outfit, booth variant library และ directional NPC ยังไม่ถึงขั้นต่ำ, browser collision/depth evidence ยัง pending จึงห้ามเรียก World ว่า Done
- Web–Game ติดต่อผ่าน versioned typed contract ใน `packages/contracts`; domain fixtures และ runtime asset แยก package
- ผ่าน typecheck, unit test และ production build; Browser visual QA ยังต้องทำซ้ำเมื่อ browser control พร้อม
- backend, database, production authentication, realtime multiplayer, durable queue, interview media, decision/reveal, recruiter/ops portal และ deployment pipeline ยังไม่เริ่ม และห้ามแสดงว่าเป็นของจริง

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
- **P0 Game Visual Gate:** ผ่าน G1–G7 ของ [Game Visual & World Specification](../03-design/world-and-scene-design.md): top-front camera เดียว, real rendered entities, collision/depth, directional characters, wardrobe แยกเสื้อ–กางเกง–รองเท้า, modular booth variants และ functional modes
- **Navigator / List Mode Parity:** โหมดรายการแบบ Semantic DOM 100% สำหรับค้นหา ดูบูธ เข้าคิว และนำทางโดยไม่ต้องควบคุม Canvas
- **Digital ID Verification & Consent:** ป้ายชัดเจน `DEMO DATA / OFFICIAL DIGITAL ID COMPLIANT`
- **Resume Import & Masked Profile:** เครื่องมือ Redaction สังเคราะห์ พร้อม Side-by-side Review ให้ Candidate ตรวจสอบและ Approve
- **Explainable Skill Match:** สูตรคำนวณคะแนนตามหลักฐาน (Deterministic Match Rule) พร้อมเหตุผล 3–5 ข้อจาก Evidence
- **Queue Management:** 1 Active Queue ต่อ Candidate, Position/ETA, Ready Check Alert Dialog และ Refresh Recovery
- **Interview Sandbox:** สัมภาษณ์แบบ 2 บทบาท (Candidate & Recruiter) หรือ Media Sandbox พร้อม Timer, Control Dock, Avatar-only Fallback
- **Private Decision & Consent-based Reveal:** ส่งผลแยกสองฝ่าย, ไม่เปิดเผยว่าใคร Pass, และเลือก Field ข้อมูลติดต่อหลัง Mutual Match
- **Recruiter Dashboard:** หน้าสำหรับรับคิว, ตรวจสอบ Masked Profile, และส่งผลการตัดสินใจ
- **State Recovery & Error Handling:** รองรับ Refresh ระหว่างรอคิว, Ready Check Timeout, Media Denied และ Network Reconnect
- **Demo Controller:** สำหรับ Reset ข้อมูล และสลับ Scenario Presets (Happy match, No match, Media denied, Queue timeout, Offline recovery)
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
