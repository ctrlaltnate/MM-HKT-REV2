# MaskedMatch Current Progress and Handoff

> **Status owner:** สถานะ implementation ปัจจุบัน, หลักฐานการตรวจ และจุดเริ่มงานถัดไป
> **Last updated:** 26 August 2026
> **Delivery label:** `LOCAL FOUNDATION / PARTIAL`
> **Production readiness:** ยังไม่พร้อมใช้กับข้อมูลผู้ใช้จริงหรือเปิด public production

เอกสารนี้ช่วยให้คนหรือ AI Agent ตัวใหม่ทำงานต่อได้โดยไม่ต้องเดาสถานะจาก roadmap ห้ามใช้ไฟล์นี้แทน requirement หรือ architecture contract หากข้อมูลขัดกัน ให้ตรวจ code แล้วแก้ canonical owner ตาม [Documentation Ownership](../01-overview/terminology.md)

## 1. Start here

ก่อนเริ่มงานทุกครั้ง:

1. ตรวจ `git status` และรักษาการแก้ไขเดิมของผู้ใช้
2. อ่าน [Agent Entrypoint](../AGENT.md), เอกสารนี้ และ canonical owner ของงาน
3. ตรวจ route ปัจจุบันใน [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx)
4. รันระบบด้วย `npm run dev` และเปิด `http://127.0.0.1:4173`
5. หลังแก้ code ให้รัน `npm run typecheck`, `npm test` และ `npm run build`
6. หาก capability หรือ delivery label เปลี่ยน ให้อัปเดตหัวข้อ 2, 5, 6 และ 9 ของเอกสารนี้

> ลิงก์จากไฟล์นี้อ้างอิงจากตำแหน่ง `docs/07-playbooks-and-operations/` จึงใช้ `../../` เพื่อกลับไป repository root

## 2. Verified checkpoint

ตรวจล่าสุดเมื่อ 26 August 2026:

| Check | Result |
|---|---|
| `npm run typecheck` | ผ่านทั้ง workspaces |
| `npm test` | ผ่าน 7 tests: API 2, Web 5 |
| `npm run build` | ผ่านทั้ง Express API และ React/Vite Web |
| `npm audit --omit=dev` | 0 vulnerabilities |
| Desktop layout capture | ตรวจ Landing ที่ 1440 px แล้ว ไม่พบ Hero overlap หรือการ์ดตกขอบ |

หลักฐาน screenshot สำหรับตรวจระหว่างพัฒนาอยู่ใน `.system_generated/` และไม่ใช่ production asset

## 3. What works now

### Engineering foundation

- npm workspaces แยก [`apps/web`](../../apps/web) และ [`apps/api`](../../apps/api)
- root scripts สำหรับ dev, typecheck, test และ build อยู่ที่ [`package.json`](../../package.json)
- Web ใช้ React, Vite, TypeScript, React Router, GSAP, `liquid-glass-react` และ `@lottiefiles/dotlottie-react`
- API ใช้ Express/TypeScript และเป็น proxy สำหรับ Gemini เพื่อไม่เปิด API key ใน browser
- ตัวอย่าง environment อยู่ที่ [`.env.example`](../../.env.example); secret จริงต้องอยู่ใน `.env.local` เท่านั้น

### Public website and Landing

- Landing 8-bit responsive พร้อม Hero, selling points, role benefits, privacy section และ live counts จาก local database
- มี Lottie + SVG + GSAP motion story และเคารพ `prefers-reduced-motion`
- ใช้โลโก้ PNG แบบ pixel art จาก [`apps/web/public/assets/brand`](../../apps/web/public/assets/brand)
- Lottie asset อยู่ที่ [`profile-to-fair.json`](../../apps/web/public/assets/motion/profile-to-fair.json)
- Public visitor เปิดรายการ Job Fair, รายละเอียดบูธ และตำแหน่งงานได้

ไฟล์หลัก:

- [`LandingPage.tsx`](../../apps/web/src/pages/LandingPage.tsx)
- [`LandingJourneyMotion.tsx`](../../apps/web/src/components/LandingJourneyMotion.tsx)
- [`styles.css`](../../apps/web/src/styles.css)
- [`FairsPage.tsx`](../../apps/web/src/pages/FairsPage.tsx)
- [`FairDetailPage.tsx`](../../apps/web/src/pages/FairDetailPage.tsx)

### Shared shell, navigation and membership

- Navbar แบบ fixed ใช้ shell เดียวครอบ routes ปัจจุบัน
- เมนูเปลี่ยนตาม role: Job Seeker, Recruiter และ Admin
- ปุ่มเข้าสู่ระบบบน Navbar เปิด login/register modal
- Profile dropdown ใช้ GSAP และมี avatar, ข้อมูลบัญชี, แก้ข้อมูล และออกจากระบบ
- หน้า Account Settings แก้ชื่อ อีเมล และเปลี่ยนรหัสผ่านโดยต้องยืนยันรหัสปัจจุบัน
- มี protected route และ role guard ฝั่ง client
- บัญชีและข้อมูลโดเมนเก็บใน browser `localStorage`; รหัสผ่าน hash ด้วย PBKDF2

ไฟล์หลัก:

- [`AppShell.tsx`](../../apps/web/src/components/AppShell.tsx)
- [`AuthModal.tsx`](../../apps/web/src/components/AuthModal.tsx)
- [`AuthForm.tsx`](../../apps/web/src/components/AuthForm.tsx)
- [`ProfileMenu.tsx`](../../apps/web/src/components/ProfileMenu.tsx)
- [`AccountSettingsPage.tsx`](../../apps/web/src/pages/AccountSettingsPage.tsx)
- [`ProtectedRoute.tsx`](../../apps/web/src/components/ProtectedRoute.tsx)
- [`local-database.ts`](../../apps/web/src/domain/local-database.ts)

### Job Seeker/Candidate

- สร้างและแก้ข้อมูลโปรไฟล์ผู้สมัคร
- เลือก Resume PDF และอ่านข้อความใน browser ก่อนส่งวิเคราะห์
- ส่ง PDF ไป local API เพื่อวิเคราะห์ด้วย Gemini เมื่อผู้ใช้กดยินยอม
- แสดง structured summary, skills, confidence, evidence, strengths, gaps และ suggested roles
- ผู้สมัครเลือกเปิดการแชร์ Masked summary และเข้าร่วม Job Fair ได้หลายงาน
- ไฟล์ PDF ต้นฉบับไม่ถูกบันทึกใน local database

ไฟล์หลัก:

- [`CandidateProfilePage.tsx`](../../apps/web/src/pages/CandidateProfilePage.tsx)
- [`pdf.ts`](../../apps/web/src/services/pdf.ts)
- [`resume-api.ts`](../../apps/web/src/services/resume-api.ts)
- [`gemini.ts`](../../apps/api/src/gemini.ts)
- [`resume-schema.ts`](../../apps/api/src/resume-schema.ts)

### Recruiter

- สร้าง/แก้ข้อมูลบริษัทของบัญชีตนเอง
- สร้างบูธใน Job Fair ที่ Published/Live
- เพิ่มตำแหน่งงาน, JD, responsibilities, must-have/nice-to-have skills, เงินเดือน และรูปแบบการจ้าง
- ดู Masked Candidate Board เฉพาะผู้สมัครที่เข้าร่วม Fair เดียวกัน มีผลวิเคราะห์ และเปิด consent
- คำนวณ local skill coverage ระหว่าง Candidate กับตำแหน่งงาน

ไฟล์หลัก:

- [`RecruiterWorkspacePage.tsx`](../../apps/web/src/pages/RecruiterWorkspacePage.tsx)
- [`matching.ts`](../../apps/web/src/domain/matching.ts)

### Admin

- สร้าง Job Fair และเปลี่ยนสถานะ `DRAFT → PUBLISHED → LIVE → ENDED`
- ดูจำนวนบูธและสมาชิกในแต่ละงาน
- ดู Recruiter oversight: บริษัท เจ้าของบูธ อีเมล และจำนวนตำแหน่งใน Fair ที่ตนดูแล

ไฟล์หลัก:

- [`AdminFairsPage.tsx`](../../apps/web/src/pages/AdminFairsPage.tsx)

## 4. Current routes

| Route | Access | Current purpose |
|---|---|---|
| `/` | Public | Landing Page |
| `/auth` | Public fallback | หน้า login/register กรณีเข้าผ่าน URL หรือ protected redirect |
| `/fairs` | Public | รายการ Published/Live fairs |
| `/fairs/:fairId` | Public | รายละเอียด Fair, Booth และ Job |
| `/app` | Signed in | Role summary/dashboard |
| `/account` | Signed in | แก้ข้อมูลบัญชีและรหัสผ่าน |
| `/candidate/profile` | Candidate | Profile, PDF และ Resume analysis |
| `/recruiter/workspace` | Recruiter | Company, Booth, Jobs และ Candidate Board |
| `/admin/fairs` | Admin | Fair lifecycle และ Recruiter oversight |
| `*` | Public | 404 recovery |

Route source of truth ฝั่ง implementation คือ [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx); route contract ระยะยาวให้ตรวจ [Information Architecture](../03-design/information-architecture.md)

## 5. Important limitations — not implemented yet

### P0 — Website hardening before real users

- [ ] Server-side authentication/session, authorization และ RBAC; ปัจจุบัน role guard เป็น client-side
- [ ] ปิดการสมัครเป็น Admin/Recruiter แบบเลือก role เองเมื่อเปลี่ยนจาก local foundation
- [ ] Database ฝั่ง server และ multi-device persistence; ปัจจุบันเปลี่ยน browser/device แล้วข้อมูลไม่ตามไป
- [ ] Email/OTP verification, password recovery, session revocation และ account lifecycle
- [ ] Recruiter invitation/approval ต่อ Job Fair และสิทธิ์จัดการสมาชิกอย่างชัดเจน
- [ ] Edit/unpublish/archive สำหรับ Fair, Booth และ Job; ปัจจุบัน flow หลักเน้น create/publish
- [ ] Validation และ authorization ทุก mutation ที่ API/server ไม่เชื่อ input จาก browser
- [ ] Playwright interaction tests, Axe accessibility audit และ evidence ที่ 320/390/768/1024/1440 px

### P1 — Candidate/recruitment completeness

- [ ] Resume upload storage, antivirus/malware scan, file retention/deletion และ signed access
- [ ] Resume analysis versioning, correction/approval และ audit trail ของ consent
- [ ] Application/interest pipeline, shortlist, contact reveal, interview scheduling และ recruiter decision
- [ ] Admin moderation, reporting, event membership management และ operational audit
- [ ] Notification/email workflow และ recovery states เมื่อ Gemini/API ล้มเหลว
- [ ] PDPA production copy, privacy request, export/delete account และ retention enforcement

### P2 — Game and runtime assets intentionally deferred

- [ ] `apps/game` Phaser workspace
- [ ] Gather/Hideout-style movement motor, collision, camera, depth sorting และ interaction
- [ ] Navigator/List Mode ที่ทำ action สำคัญเทียบเท่า Canvas
- [ ] Pre-asset renders, sprite directions, layered wardrobe, booth variants และ asset manifest pipeline
- [ ] Career Hall world, booth interaction, queue/interview/decision/reveal flow

เริ่มส่วนนี้ต่อจาก [Phase 2–4 ใน Implementation Execution Plan](./implementation-execution-plan.md) และ [Game Visual & World Specification](../03-design/world-and-scene-design.md)

### P3 — Production/backend/platform

- [ ] Shared API contracts package และ contract tests
- [ ] Production database, object storage, migrations และ tenant boundaries
- [ ] Realtime/presence/queue infrastructure
- [ ] Rate limiting, CSP/security headers, secret manager และ abuse controls
- [ ] CI/CD, staging/production deployment, monitoring, logs, analytics และ backup/recovery
- [ ] Load, security, accessibility และ disaster-recovery gates

## 6. Recommended next work order

หากผู้ใช้ไม่ได้เปลี่ยน priority ให้ทำเว็บไซต์ให้แน่นก่อนเริ่มเกม:

1. **WEB-HARDEN-01:** เพิ่ม Playwright + Axe ครอบ login modal, role nav, Profile dropdown และ responsive overflow
2. **WEB-CRUD-01:** เพิ่ม edit/unpublish/archive สำหรับ Fair, Booth และ Job พร้อม confirm/recovery
3. **MEMBERSHIP-01:** ออกแบบ Recruiter invitation/approval ต่อ Fair และ Admin member management บน local adapter ก่อน
4. **CONTRACT-01:** แยก domain/API DTO ไป `packages/contracts` และวาง repository/service adapter boundary
5. **BACKEND-01:** ต่อ database + server authorization โดยรักษา UI flow เดิม
6. **IDENTITY-01:** เปลี่ยน local identity เป็น production auth/verification/recovery ตาม canonical identity spec
7. เมื่อ website preparation gate ผ่านแล้วจึงเริ่ม Phaser movement lab และ pre-asset pipeline

ทุก slice ต้องมี loading, empty, error, unauthorized และ recovery state ไม่ใช่เฉพาะ happy path

## 7. Data and security boundaries

- `GEMINI_API_KEY` อ่านเฉพาะใน [`apps/api`](../../apps/api); ห้ามสร้างตัวแปร `VITE_GEMINI_API_KEY`
- `.env.local` ถูก ignore และห้ามนำค่าจริงลงเอกสาร, screenshot, test fixture หรือ commit
- Local membership ไม่ใช่ ThaID, centralized auth หรือ production security boundary
- Resume จริงและ PII จริงห้ามใช้เป็น fixture; ใช้ synthetic data เท่านั้น
- Candidate Board ต้องไม่แสดงชื่อ อีเมล PDF หรือ extracted text ก่อน consented reveal flow
- `.system_generated/` เป็นหลักฐาน/ไฟล์ชั่วคราว ไม่ใช่ runtime source of truth

## 8. Useful commands

```bash
npm install
npm run dev
npm run typecheck
npm test
npm run build
npm audit --omit=dev
```

Web: `http://127.0.0.1:4173`  
Local API: `http://127.0.0.1:8787`

หาก Resume analysis ใช้ไม่ได้ ให้ตรวจ health ของ API และตรวจว่าตั้ง `GEMINI_API_KEY` ใน `.env.local` แล้ว จากนั้น restart API โดยห้ามพิมพ์ค่า key ลง terminal output

## 9. Handoff update template

เมื่อจบงานที่เปลี่ยน progress ให้แก้เอกสารนี้ด้วยรูปแบบสั้นต่อไปนี้:

```md
### YYYY-MM-DD — <slice name>

- Delivery label: LOCAL | PARTIAL | CONNECTED | PRODUCTION-READY
- Implemented: <พฤติกรรมที่ใช้งานได้จริงและ path หลัก>
- Verified: <คำสั่ง/จำนวน tests/responsive evidence>
- Known limits: <สิ่งที่ยังไม่ทำหรือยังเป็น mock/local>
- Next recommended slice: <หนึ่งงานที่มี dependency พร้อม>
```

อย่าเก็บ changelog ยาวแบบซ้ำกับ Git history ในไฟล์นี้ ให้ปรับ snapshot ด้านบนให้ตรง code และเพิ่ม handoff note เฉพาะข้อมูลที่ Agent ตัวต่อไปจำเป็นต้องรู้

### 2026-08-26 — Website-first local foundation and Landing refresh

- Delivery label: `LOCAL FOUNDATION / PARTIAL`
- Implemented: role-aware fixed Navbar, auth modal, animated Profile dropdown, account settings, Landing Lottie/SVG/GSAP story, organized benefit cards และ Admin recruiter oversight
- Verified: build ผ่าน, API 2 tests, Web 5 tests, audit 0 vulnerabilities และ desktop layout capture 1440 px
- Known limits: localStorage identity/domain state, local API เฉพาะ Gemini, ไม่มี production RBAC/database/recovery และยังไม่มี Phaser game
- Next recommended slice: `WEB-HARDEN-01` เพิ่ม browser-level interaction/accessibility/responsive tests
