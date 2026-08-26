# MaskedMatch Agent Instructions

ไฟล์นี้เป็น root entrypoint สำหรับ AI Agent และผู้พัฒนาที่เข้ามาทำงานต่อใน repository นี้

## Read before changing code

1. อ่าน [Agent Entrypoint](./docs/AGENT.md) เพื่อทราบ canonical documentation และ project invariants
2. อ่าน [Current Progress and Handoff](./docs/07-playbooks-and-operations/current-progress-and-handoff.md) เพื่อทราบว่า code ปัจจุบันทำอะไรได้จริง ขาดอะไร และควรเริ่มงานต่อที่ใด
3. อ่าน canonical owner ของส่วนที่จะเปลี่ยนตามลิงก์ใน `docs/AGENT.md`
4. ใช้ [Implementation Execution Plan](./docs/07-playbooks-and-operations/implementation-execution-plan.md) สำหรับ dependency และ exit gate

## Continuity rules

- ห้ามสรุปสถานะจากแผนเพียงอย่างเดียว ให้ตรวจ code, tests และ Current Progress ก่อน
- เมื่อส่งมอบ implementation ที่เปลี่ยนสถานะโครงการอย่างมีนัยสำคัญ ต้องอัปเดต Current Progress ในงานเดียวกัน
- Current Progress เป็น status snapshot และ handoff เท่านั้น ไม่ใช่เจ้าของ requirement, API contract หรือ design rule
- ระบุให้ชัดว่าเป็น `LOCAL`, `PARTIAL`, `CONNECTED` หรือ `PRODUCTION-READY`; ห้ามเรียก localStorage/local API ว่า production backend
- ห้าม commit `.env.local`, API key, Resume จริง หรือข้อมูลส่วนบุคคลจริง
- ก่อนส่งมอบให้รันอย่างน้อย `npm run typecheck`, `npm test` และ `npm run build` หรือบันทึกเหตุผลที่รันไม่ได้ไว้ใน Current Progress

