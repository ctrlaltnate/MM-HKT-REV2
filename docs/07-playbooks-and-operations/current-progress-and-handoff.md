# Current Progress and Handoff

เอกสารนี้เป็น status snapshot และ handoff ล่าสุดของโครงการ MaskedMatch เพื่อให้ AI Agent และผู้พัฒนาเข้ามาทำงานต่อได้ทันทีโดยไม่ต้องคาดเดาสถานะระบบ

## 1. Quick start สำหรับผู้มารับงานต่อ

1. อ่าน [`AGENTS.md`](../../AGENTS.md) เพื่อทราบ continuity rules และ context การทำงาน
2. อ่าน [Agent Entrypoint](../AGENT.md), เอกสารนี้ และ canonical owner ของงาน
3. ตรวจ route ปัจจุบันใน [`apps/web/src/App.tsx`](../../apps/web/src/App.tsx)
4. รันระบบด้วย `npm run dev` และเปิด `http://127.0.0.1:4173`
5. หลังแก้ code ให้รัน `npm run typecheck`, `npm test` และ `npm run build`
6. หาก capability หรือ delivery label เปลี่ยน ให้อัปเดตหัวข้อ 2, 5, 6 และ 9 ของเอกสารนี้

> ลิงก์จากไฟล์นี้อ้างอิงจากตำแหน่ง `docs/07-playbooks-and-operations/` จึงใช้ `../../` เพื่อกลับไป repository root

## 2. Verified checkpoint

ตรวจล่าสุดเมื่อ 27 August 2026:

| Check | Result |
|---|---|
| `npm run typecheck` | ผ่านทั้ง 3 workspaces (`@maskedmatch/api`, `@maskedmatch/web`, `@maskedmatch/contracts`) |
| `npm test` | ผ่าน 16 unit & integration tests: API 5, Web 7, Contracts 4 |
| `npm run build` | ผ่านทั้ง Express API (`tsc -b`), Web bundle (`vite build`) และ Contracts package (`tsc -b`) |
| `npm audit --omit=dev` | 0 vulnerabilities |
| Typography System | ใช้ **Chakra Petch** เป็นฟอนต์หลักทั้งระบบ ทั้งภาษาไทยและภาษาอังกฤษ ให้ความรู้สึก Cyberpunk/Sci-Fi คมชัด อ่านง่าย และเป็นเอกภาพทั่วทั้งเว็บ |
| Virtual Avatar Customizer Studio | สตูดิโอปรับแต่งอวตารตัวละคร 8-Bit Pixel Avatar (สีผิว, ทรงผม, สีผม, ดวงตา, สีตา, รูปปาก/สีหน้า, ของตกแต่งหน้า/ศีรษะ, สีเสื้อผ้า) ใช้งานได้ทุก Role (Candidate, Recruiter, Admin) |
| Admin Fair Studio & Lifecycle Control | ระบบตั้งเวลาเปิด-ปิดงานอัตโนมัติด้วย Cyberpunk Toggle Switch, เลือก Timezone หลากหลายภูมิภาค, ใส่รูปโลโก้งานและภาพ Cover Banner พร้อม Live Preview และ Presets, ระบบจัดการลิงก์มีเดีย/เอกสาร (YouTube, Keynote Deck, Livestream, Website, Social), และระบบ Interactive Tag Input (พิมพ์กด Enter/, เพื่อเพิ่มแท็ก, กด Backspace หรือปุ่ม x เพื่อลบ, พร้อมปุ่มแท็กแนะนำ) |
| Fair Membership Governance Modal | แยกส่วนจัดการสมาชิกและคำขอรออนุมัติออกมาเป็น Popup Modal รองรับ 2 โหมด: 1) ล็อกเฉพาะงานเมื่อกดจากการ์ด (ไม่มี Dropdown ให้สับสน) 2) โหมดรวมทุกงานเมื่อกดจากปุ่มใหญ่ พร้อม Dropdown จัดกลุ่มงานที่เปิดอยู่ vs งานที่หมดอายุ/สิ้นสุดแล้วอย่างชัดเจนและปลอดภัย |
| Expired Fairs Categorization & Management | ปรับปรุงกล่องสถิติเป็น "จ็อบแฟร์ที่หมดอายุ" พร้อมระบบแยกหมวดหมู่งานแฟร์ที่หมดอายุ/จบงานออกจากงานแฟร์ที่กำลังเปิดรับ ทั้งในฝั่ง Admin (`/admin/fairs`) และ Public Directory (`/fairs`) |

## 3. What works now

- **Authentication & Roles**: สลับ role (Candidate, Recruiter, Admin) พร้อม Local Storage persistence
- **Admin Workspace**: จัดการวงจรชีวิต Job Fair (Draft -> Published -> Live -> Ended -> Archived), สตูดิโอปรับแต่ง Branding & Schedule, ศูนย์จัดการสมาชิกและคำขอรออนุมัติแยกตามงาน/รวมทุกงาน
- **Recruiter Workspace**: จัดการข้อมูลบริษัท, อัปโหลดสไลด์/วิดีโอแนะนำบูธ, สร้างประกาศรับสมัครงาน, ตรวจสอบผู้สมัครและสถานะการสัมภาษณ์
- **Candidate Workspace**: สร้างโปรไฟล์แบบปิดบังตัวตน (Masked), วิเคราะห์เรซูเม่ด้วย AI, บันทึกทักษะและผลงาน, เข้าร่วมงานแฟร์และสมัครงาน
- **Public Fair Directory**: ค้นหางานแฟร์ คัดกรองงานที่เปิดรับ vs งานที่สิ้นสุดแล้ว ดูรายชื่อบูธและตำแหน่งงานที่เปิดรับ

## 4. Active implementation checkpoint — Admin Live Operations

> **สถานะ ณ 27 August 2026:** `IN PROGRESS · LOCAL · UNVERIFIED FINAL GATE`  
> บันทึก checkpoint นี้ก่อน compact context ตามคำขอผู้ใช้ ห้ามตีความหัวข้อนี้ว่า production-ready หรือเสร็จสมบูรณ์จนกว่าจะผ่าน verification ในรายการด้านล่าง

สิ่งที่ implement อยู่ใน working tree:

- เพิ่ม canonical route `/ops/events/:eventId/live` สำหรับ Admin พร้อมหน้า `AdminOperationsPage`
- เพิ่ม `OperationsGateway` port, `LocalOperationsGateway`, `OperationsProvider` และ local persistence/cross-tab notification เพื่อให้เปลี่ยน adapter เป็น Supabase/Postgres ภายหลังโดยไม่ผูก UI กับ provider
- เพิ่ม aggregate-only operations snapshot, Pause/Resume พร้อม reason/scope, local broadcast log, sanitized integration health, booth overview และ local audit trail
- เพิ่ม `PAUSED`/`CANCELLED` ใน shared Fair contract และ pure lifecycle guard; Admin Fair actions ใช้ confirmation และ guard แทนการวนสถานะโดยตรง
- เพิ่ม local auto-schedule evaluator ขณะเว็บเปิดอยู่ และปรับ public/recruiter filters ให้มองเห็นงาน `PAUSED`
- ปรับ `/admin/fairs`: search, sort, filter pressed state, preview, persistent feedback, offline state, touch target/responsive CSS และลิงก์เข้า Live Operations
- ปรับ shared Modal ให้ initial focus, focus trap และ focus restoration; ปรับ Fair Studio tabs/switch/labels ให้ semantic keyboard controls
- เพิ่ม unit tests สำหรับ fair lifecycle และ local operations gateway

ข้อจำกัดที่ต้องแสดงตามจริง:

- Metrics ที่ยังไม่มี queue/interview/media/match service แสดง `0` หรือ `N/A`; ไม่มีการสร้างตัวเลข realtime ปลอม
- Broadcast, audit, auth และ sync เป็น local browser simulation เท่านั้น; ไม่มี server delivery, durable audit หรือ tenant authorization ฝั่ง server
- Auto schedule ทำงานเมื่อแอปเปิด/กลับมา visible เท่านั้น ยังไม่มี background scheduler
- Supabase/Postgres ยังไม่ได้ติดตั้งหรือเชื่อมต่อใน slice นี้

Verification ที่ทำแล้วใน checkpoint นี้:

- `npm.cmd --workspace @maskedmatch/web run typecheck` — ผ่านหลังรวม route/page/domain/CSS ล่าสุด
- Operations gateway tests — agent ย่อยรายงานผ่าน 7/7 ก่อน checkpoint; agent หลักยังต้อง rerun ใน final gate

งานที่ต้องทำต่อทันทีหลัง compact:

1. ตรวจและแก้ responsive/visual ของ `/admin/fairs` และ `/ops/events/:eventId/live` ที่ 320, 390, 768 และ 1440 px
2. เพิ่ม/ปรับ Playwright flow สำหรับ create → Publish → Start → Live Operations → Pause/Resume → Broadcast รวม keyboard, focus restoration, Axe และ overflow
3. แก้ E2E membership tests เก่าที่ไม่ได้เปิด create/membership modal ก่อนหา field
4. ตรวจ partial-commit/idempotent replay behavior ของ local gateway และบันทึก limitation หรือแก้ให้ atomic เท่าที่ local adapterทำได้
5. รัน final gate: `npm run typecheck`, `npm test`, `npm run build` และ `npm run test:e2e`; อัปเดต Verified checkpoint/What works now หลังผลผ่านจริง
