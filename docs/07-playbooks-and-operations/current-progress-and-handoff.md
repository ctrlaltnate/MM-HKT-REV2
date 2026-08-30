# Current Progress and Handoff

## Recruiter-only assessment & Sponsor Jobboard update (2026-08-30)

### Sponsor-Backed Job Catalog & Interactive Company Profiles
- Expanded `/recruiter` catalog to 18 positions across all 4 categories (Tech: 6, Business: 4, People: 4, Operations: 4), with every category having at least 4 detailed jobs.
- Directly mapped all jobs to real sponsor organizations: **Microsoft**, **LINE MAN Wongnai**, **Canva**, **MFEC**, **MuvMi**, **JobThai**, **if (General Beverage)**, **Julian's The Spa**, **Tech Career Spark**, and **SHAKESPHERE**.
- Added interactive **Company Profile Modal** (`selectedCompanyForModal`), accessible via top sponsor pills, job card peek buttons (`[🏢 ข้อมูลบริษัท]`), and the detailed JD header. Displays Core Values (with descriptions), Work Culture & Principles, Products & Services, and Office Perks & Environment.

### Dynamic, Deep Scenario-Based AI Assessment (10 MCQs + 1 Subjective Question · 10-Minute Modal Popup)
- **Pinned Top Header, Pinned Statement & Pinned Bottom Navigation**: Re-architected `.assessment-modal-dialog` with fixed sections:
  - **Top Pinned Header**: Fixed `.assessment-modal-top-pinned` displaying Live Assessment title, 10-min countdown timer, real-time proctoring status badge, 11-pill progress tracker, and the full pinned question statement (`.quiz-pinned-question-statement`).
  - **Scrollable Middle Body**: Only `.assessment-modal-scrollable-body` scrolls vertically, ensuring the candidate always sees the question, timer, and proctoring status regardless of choice/text length.
  - **Bottom Pinned Footer**: Fixed `.assessment-modal-bottom-pinned` with Previous, Question Counter (`ข้อที่ X / 11`), and Next/Submit buttons.
- **Clean Choice Card Typography & Radio Indicator**: Fixed layout and text-wrapping bug by properly hiding native radio buttons via `.sr-only` utility, giving `.choice-text-content` full width, and rendering a sleek custom right-aligned radio ring (`.choice-radio-indicator`).
- **10 Multiple-Choice + 1 Subjective Problem-Solving Question**:
  - **Questions 1 to 10 (MCQs)**: 10 Scenario-based Multiple-Choice Questions scored 0–100% for the Knowledge Score gauge.
  - **Question 11 (Subjective - อัตนัย พิมพ์ตอบ)**: Practical workplace problem-solving scenario where candidates type their reasoning, trade-offs, and incident response into a rich `<textarea>`. It is not scored automatically by machine, but forwarded directly into the **Recruiter Evaluation Card (Turn 2)** and **Reflection Portfolio (Turn 3)** for HR/Hiring Manager decision making.
- **Default Routing Redirection to `/recruiter`**:
  - Configured root `/`, `/r`, and `/home` in `apps/web/src/App.tsx` and `vercel.json` to automatically redirect straight to `/recruiter` (`RecruiterDemoPage`), making the live assessment demo the primary entry point across the deployed application.
- **Production Deployment & AI API Routing Diagnostics**:
  - Removed `prebuild` recursive workspace hook from `apps/web/package.json` and set explicit linear monorepo build pipeline (`npm run build -w @maskedmatch/contracts && npm run build -w @maskedmatch/api && npm run build -w @maskedmatch/web`) to eliminate Vercel workspace recursion exit code 2.
  - Added dedicated Vercel Serverless Function entry points (`api/resumes/analyze.ts`, `api/assessments/generate.ts`, `api/health.ts`, `api/index.ts`, `api/[...path].ts`) with `export const config = { api: { bodyParser: false } }` to ensure native Vercel file-based routing and raw stream forwarding for Multer PDF uploads.
  - Added server dependencies (`@google/genai`, `express`, `multer`, `cors`, `zod`, `dotenv`) and `@types/*` into root `package.json` and created root `tsconfig.json` for seamless Vercel Serverless Lambda compilation.
  - Added `!process.env.VERCEL` guard to `app.listen()` in `apps/api/src/server.ts` so Vercel Serverless Functions export clean handlers without socket binding blocks.
  - Implemented smart API URL resolution (`resolveApiBaseUrl()`) that sanitizes localhost/127.0.0.1 environment variable overrides when running on production domains (preventing `ERR_CONNECTION_REFUSED` and 404 HTML responses in production).
  - Set primary default model to `gemini-3.6-flash` with fallback exclusively to `gemini-3.5-flash` in `apps/api/src/gemini.ts` (removed all legacy 2.x/2.0 references).
- **Stage 4: Two-Sided Private Swipe Deck & Mutual Match Contact Form**:
  - Enabled **Full Touch & Mouse Drag Interactivity** (`PointerEvents` with `setPointerCapture`, `touch-action: none`, and hardware-accelerated 3D transforms) for both Candidate Turn (Turn 1) and Recruiter Turn (Turn 2) swipe cards.
  - Users can physically drag or swipe the card horizontally on both mobile screens and desktop trackpads/mice with dynamic tilt rotation and visual stamp badge reveal (`MATCH! / สนใจ` green stamp on right swipe, `PASS / ข้าม` red stamp on left swipe), with an elastic bounce-back when released below the threshold or smooth exit fling and instant turn transition when thrown.
  - Streamlined Recruiter Turn (Turn 2) controls with balanced binary action buttons (`[ ✕ ไม่ผ่าน / REJECT ]` and `[ ✓ ผ่านสัมภาษณ์ / ACCEPT ]`).
  - Added **Candidate Unmask & Contact Submission Form** on Mutual Match (`recruiterDecision === "APPROVE" && candidateDecision === "APPROVE"`):
    - Collects Full Name (ชื่อ-นามสกุล), Email (อีเมล), Phone Number (เบอร์โทรศัพท์), and optional Preferred Contact Time note.
    - Features real-time validation and a luminous green submit button (`[ 🚀 ส่งข้อมูลให้ HR และจบเซสชั่นอย่างสมบูรณ์ ]`).
    - Transitions smoothly to a confirmed **Session Complete Submission Receipt** displaying candidate details, company/position data, submission timestamp, and next-step onboarding status.
- **Streamlined Job Catalog & Showcase Header (UI/UX Clean-up)**:
  - Streamlined the Application/CV Intake modal by removing the redundant top AI estimate banner and consolidating time notifications into the live progress card below (`.ai-time-estimate-pill`).
  - Generalized AI processing status logs to neutral `AI Engine` terminology, removing specific model identifiers from user-facing UI messages.
  - Adjusted Scenario Assessment timer duration to **15 minutes** (900 seconds) across the entire application flow, pre-assessment integrity checkpoint modal, live countdown HUD, step navigation, and audit logs.
  - Upgraded the Assessment Submit Button (`.quiz-submit-btn`) to a **bright, luminous neon-emerald gradient** (`linear-gradient(135deg, #10b981, #22c55e, #4ade80)` with high-contrast text and glowing border) for prominent visibility and unmistakable visual feedback.
  - Implemented a **Sticky Sidebar Container** (`.rec-job-panel` with `position: sticky; top: 86px; max-height: calc(100vh - 106px)` and `align-items: start` grid alignment) preventing sidebar truncation or scroll drift when the right Work Panel expands with long multi-stage assessments.
  - Implemented **Pinned Header & Search Bar** (`.rec-job-panel-pinned-top` with `position: sticky; top: 0; z-index: 12`) so the search bar and category navigation remain permanently pinned at the top in both full catalog view and 2-column sidebar view, with a dedicated custom scrollbar on the job list below.
  - Fixed search input bar styling (`.rec-search`) to ensure 100% background transparency and borderless seamlessness across desktop and responsive viewport scaling, overriding global form input styles.
  - Resolved job card vertical clipping (`.rec-job-card-item` / `.rec-job-list`) during responsive resizing and mobile viewports by enabling dynamic `fit-content` height, flexible wrapping, and expanding viewport scroll bounds.
  - Fixed job card hover state (`.rec-job-card-item:hover`) by removing horizontal translation (`translateX`) and applying clean box-shadow/border glow, preventing right-boundary layout overflow.
  - Removed redundant category label ("TECH") from individual cards since the user is already browsing the active category view, relocating salary into a dedicated top-right pill (`.job-card-salary-badge`) for balanced visual hierarchy.
  - Fixed search input bar alignment and color mismatch (`.rec-search`) with a unified cyberpunk dark theme container.
  - Eliminated redundant, visually cluttered "ข้อมูลบริษัท" peek buttons from individual job catalog cards in the sidebar list.
  - Replaced individual cards with unified, clean interactive button cards showing company badge, job title, company name, salary, and skill chips without text clipping.
  - Moved company details access into a rich, dedicated **Company Showcase Header Banner** (`.job-company-showcase-bar`) with `[🏢 ดูข้อมูลบริษัท & Culture]` directly within the active Job Detail / Work Panel view, eliminating duplication and enhancing responsiveness across viewports.
- **Real-Time Live One-Line Status Logger (UI & Server)**: Added a real-time single-line ticker bar (`.ai-live-oneline-ticker`) in the UI progress modal that displays live step-by-step terminal logs with millisecond timestamps (e.g. `⚡ [11:24:01] อ่านไฟล์พร้อมเข้ารหัส Privacy Shield`, `📤 [11:24:02] ส่งคำขอไปยัง AI Engine (gemini-3.6-flash)...`, `📥 [11:24:04] ได้รับชุดข้อสอบ 10 MCQs + 1 อัตนัยใน 2.1s`) and aligned server-side log output in `apps/api/src/gemini.ts`.
- **AI Processing Time Estimates & User Guidance (1–2 นาที)**: Added explicit notices across CV upload, resume analysis modals, and assessment generation loading screens informing users that deep AI analysis and customized question generation take approximately **1–2 minutes**, preventing premature tab exits.
- **Model Fallback Priority (Gemini 3.6 -> 3.7 -> 3.5)**: Configured `GEMINI_MODEL=gemini-3.6-flash` as primary in `.env.local`, `.env.example`, and `apps/api/src/server.ts` for fast direct token generation without reasoning budget lag, with fallback to `gemini-3.7-flash` and `gemini-3.5-flash` in `apps/api/src/gemini.ts`.
- **10-Minute Countdown Timer & Anti-Cheat Proctoring**: Live 600-second timer with dynamic color urgency and full Tab Switch / Window Blur proctoring with warning modals and security audit logs.

### Interactive Two-Sided Swipe Decision Arena (GSAP)
- Replaced static decision stage with an interactive **Two-Sided Swipe Arena** using GSAP physics, pointer drag gestures, and action buttons (`[✕ PASS / REJECT]`, `[♥ / ✓ MATCH / ACCEPT]`):
  1. **Phase 1 (Candidate Turn)**: Candidate evaluates the company, culture fit, compensation, and interview impressions. Swipes left or right with animated stamps ("MATCH! สนใจ" vs "PASS ข้าม").
  2. **Phase 2 (Recruiter Turn)**: Smooth GSAP card transition to Recruiter view evaluating Candidate #7F2A (8-bit Cat avatar), showing Match Score gauge, Resume ↔ JD coverage %, 10-question Knowledge Check score, and Anti-Cheat Integrity status.
  3. **Phase 3 (Reveal & Reflection)**: Mutual Match celebration or private closure screen with score gauges, reflection breakdown (Strengths, Development Areas, Explanations from missed questions, and Anti-Cheat Audit Trail), and restart controls.
- Fully responsive design with tuned padding, margins, and dark cyberpunk styling.
- Verification 2026-08-30: `npm run typecheck` PASS across all workspaces; `npm test` PASS (36/36 tests: web 24/24, api 5/5, contracts 7/7); `npm run build` PASS.

- **Delivery label: `LOCAL UI DEMO / CONNECTED`**.


## 1. Quick start สำหรับผู้มารับงานต่อ

1. อ่าน [`AGENTS.md`](../../AGENTS.md) เพื่อทราบ continuity rules และ context การทำงาน
2. อ่าน [Agent Entrypoint](../AGENT.md), เอกสารนี้ และ canonical owner ของงาน
3. ตรวจ route ปัจจุบันใน [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx)
4. รันระบบด้วย `npm run dev` และเปิด `http://127.0.0.1:4173`
5. หลังแก้ code ให้รัน `npm run typecheck`, `npm test` และ `npm run build`
6. หาก capability หรือ delivery label เปลี่ยน ให้อัปเดตหัวข้อ 2, 5, 6 และ 9 ของเอกสารนี้

> ลิงก์จากไฟล์นี้อ้างอิงจากตำแหน่ง `docs/07-playbooks-and-operations/` จึงใช้ `../../` เพื่อกลับไป repository root

## 2. Verified checkpoint

## Snapshot Summary (2026-08-28)

- **สถานะโดยรวม:** `CONNECTED` (Web + API + Contracts + Phaser 4 Master Pokémon GBA Expo Map)
- **การทดสอบอัตโนมัติล่าสุด:**
  - `npm run typecheck`: **PASS** (100% across all 3 workspaces)
  - `npm test`: **PASS** (29/29 unit & integration tests)
  - `npm run build`: **PASS** (Production bundle build in 1.38s)
  - `Playwright E2E`: **PASS** (Diagnose & E2E passed with zero errors)
- **ฟีเจอร์เด่นล่าสุด:**
  - **Master 16-Bit Pokémon GBA Convention Expo Hall Map**:
    - แผนที่รวมแสงเงา สมจริง ไร้รอยต่อ และมีสไตล์ภาพเป็นเนื้อเดียวกัน 100%
    - พื้นกระเบื้อง Convention Blue Tile ขัดเงานุ่มละมุน พร้อมทางเดินหลักและลูกศรนำทางสีทอง
    - **Contact Drop Shadows ใต้เท้าตัวละครและเฟอร์นิเจอร์ทุกชิ้น**: หมดปัญหาภาพลอย
    - **Dynamic Illuminated Brand Wall Displays**: แสดงโลโก้ ชื่อบริษัท และประเภทธุรกิจแบบ High-DPI Resolution 3
    - **Pixel-Perfect Scaling**: บังคับ CSS `image-rendering: pixelated; crisp-edges;` แก้ปัญหาภาพเบลอ 100%
    - Center Circular Info Desk, Living Visitor Crowd และ Interactive Proximity Sensors ปลอดข้อผิดพลาด

| Check | Result |
|---|---|
| Mode Toggle Parity (Accessibility) | สลับโหมดได้อย่างอิสระระหว่าง `[ 🎮 2D Virtual Expo Hall ]` และ `[ 📋 รายการบูธ (List View) ]` ในหน้า `FairDetailPage.tsx` |
| Clean Job Catalog List Layout | ปรับปรุงเลย์เอาต์รายการตำแหน่งงานในคลังบริษัทให้เป็น Clean Structured List จัดวางข้อมูลชัดเจน 3 บรรทัด (Title & Badges / Meta Info & Salary / Skills) พร้อม Action buttons จัดกลุ่มชิดขวาเป็นระเบียบ |
| Fixed Modal Architecture & Toast Feedback | ทุก Modal Popup ในระบบมี Header พร้อมปุ่มกากบาท (X) ตรึงตำแหน่งมุมขวาบน และ Footer (ปุ่มบันทึก/ยกเลิก) ตรึงตำแหน่งด้านล่างเสมอ พร้อมทั้งมีระบบ Toast Error Feedback แจ้งเตือนข้อผิดพลาด |
| Industry-Agnostic Tag System | นำ Hardcoded IT tags ออกจาก SkillTagInput ทำให้ระบบเปิดกว้างรองรับทุกสายงานและอาชีพอย่างเท่าเทียม |
| Streamlined Recruiter ATS Pipeline | หน้าจัดการผู้สมัครของ Recruiter ได้รับการปรับปรุงให้เรียบหรู คลีนตา โดยตัดกล่องสถิติซ้ำซ้อน 2 ชั้นออก และรวมเป็น Interactive Stage Tabs แถวเดียว พร้อมจัดกลุ่มตามสายงาน (Job Role Tabs) และแสดง Headcount เป้าหมายชัดเจน |
| Centralized Company Job Catalog | ระบบคลังตำแหน่งงานกลางของบริษัท (Company-level Job Entity) สร้าง JD/เงินเดือน/Headcount/ทักษะ ไว้ครั้งเดียว และสามารถเลือกติ๊กนำตำแหน่งงานไปเปิดรับในบูธของแต่ละ Job Fair ได้อย่างอิสระ |

## 3. What works now

- **2D Virtual Career Hall (Phaser 4)**: เดินสำรวจงานแฟร์ในมุมมอง Top-front Pokémon GBA 4 ทิศทาง, บังคับด้วย Keyboard (WASD/ลูกศร), Mouse/Touch (Click-to-Move), หรือ Virtual D-Pad บนหน้าจอ, คุยกับ Info Desk NPC และ Visitor Crowd NPCs, เดินเข้าใกล้บูธบริษัทแล้วกด `E` หรือคลิกเพื่อเปิด Drawer ดูตำแหน่งงานและกดสมัครงานแบบ Masked, ตัวละครสะท้อนการแต่งตัวจาก Avatar Studio 100%
- **Authentication & Roles**: สลับ role (Candidate, Recruiter, Admin) พร้อม Local Storage persistence
- **Admin Workspace**: จัดการวงจรชีวิต Job Fair, สตูดิโอปรับแต่ง Branding & Schedule, ศูนย์จัดการสมาชิกและคำขอรออนุมัติ, ศูนย์ Live Operations
- **Recruiter Workspace & Streamlined ATS**: Task-first dashboard, คลังตำแหน่งงานส่วนกลางของบริษัทพร้อม Headcount, จัดการ Company / Fair Access / Virtual Booths ผ่าน accessible `<Modal>`, เลือกระบุตำแหน่งงานที่จะเปิดรับในแต่ละบูธได้อิสระ, จัดการผู้สมัครแยกตามสายงาน (Job Role Tabs), แถบ Unified Stage Tabs กรองสถานะคัดเลือกได้ในคลิกเดียว (รอตรวจ/เข้ารอบ/สัมภาษณ์/เปิดเผยข้อมูล/ตกรอบ), ขอเปิดเผยข้อมูลติดต่อ (Reveal Request), Shortlist, และ Reject
- **Candidate Workspace**: สร้างโปรไฟล์แบบปิดบังตัวตน (Masked), วิเคราะห์เรซูเม่ด้วย AI, บันทึกทักษะและผลงาน, เข้าร่วมงานแฟร์และสมัครงานแบบ Masked พร้อมคำนวณ Match Score, ตรวจสอบสถานะใบสมัคร และให้ Consent เปิดเผยข้อมูลติดต่อ
- **Public Fair Directory & Detail**: ค้นหางานแฟร์ คัดกรองงานที่เปิดรับ vs งานที่สิ้นสุดแล้ว ดูรายชื่อบูธและตำแหน่งงานที่เปิดรับ พร้อมโหมดสลับ 2D Game vs List Mode
