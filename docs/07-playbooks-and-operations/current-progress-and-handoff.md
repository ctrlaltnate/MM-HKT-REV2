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
