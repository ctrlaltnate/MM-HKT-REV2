# 1. AI & Coding Agent Playbook

> **Version 2.1 — Interactive Career Hall & Real Media Revision**  
> เอกสารคู่มือสำหรับ AI Coding Agent ในการพัฒนาและต่อยอดระบบ MaskedMatch อย่างมีแบบแผน ปลอดภัย และตรงตามข้อกำหนด

---

## 1.1 Core Mission

สร้าง **MaskedMatch R0 Hackathon Prototype** เพื่อพิสูจน์ว่า Virtual Job Fair แบบ 2D Top-Down สามารถพาผู้สมัครผ่านลูป 5 ขั้นตอนได้จริงบน Web Browser ทั้งบนสมาร์ทโฟน แท็บเล็ต และคอมพิวเตอร์:
1. เข้า Event และยืนยันตัวตนผ่านระบบ Digital ID (Digital ID Verification)
2. สร้างและตรวจ Masked Profile ที่เน้นทักษะและผลงานจริง
3. สำรวจ Neon Career Hall หรือใช้ Navigator โหมดรายการ
4. เปิดบูธเสมือนจริง ดูงาน เหตุผลความตรงกัน และกดเข้าคิว
5. รับ Ready Check และเข้าห้องสัมภาษณ์ (Speed Interview) ด้วย **กล้องจริง ดัดเสียงจริง และ Face Tracking Overlay จริง**
6. ส่งผลการตัดสินใจส่วนตัวทั้งสองฝ่าย (Private Decision)
7. Reveal ข้อมูลติดต่อเฉพาะที่ผู้สมัครยินยอมเมื่อเกิด Mutual Match

---

## 1.2 Non-Negotiable Experience Invariants (12 กฎเหล็กที่ห้ามละเมิด)

1. **Identity stays masked before mutual consent:** ฝั่ง Recruiter ก่อนเกิด Mutual Match ต้องไม่มีชื่อ รูป อีเมล เบอร์โทร หรือ Original Resume ของผู้สมัคร
2. **World is optional:** ทุกฟังก์ชันและ Action ใน Canvas ต้องทำผ่าน Semantic Navigator / List Mode ได้ 100%
3. **No surprise media:** ไมค์และกล้องเริ่มต้นด้วยการปิดเสมอ ไม่มีการเปิดเผยภาพ/บันทึกเสียงอัตโนมัติ
4. **Mask fails closed:** หาก Face Tracking หรือ Mask Engine เกิดความล้มเหลว ต้องหยุดส่งวิดีโอทันทีก่อนเห็นภาพจริง แล้วสลับเป็น Avatar
5. **Real camera & voice engines:** การ Demo และ Interview ต้องใช้ `getUserMedia` กล้องจริง, Realtime Face Landmark Mesh, และ Web Audio DSP Voice Pitch Shift ที่ทำงานได้จริง (Production Feasible)
6. **Strict No-Emoji standard:** ทุก Element ในฉาก (พร็อพ, บูธ, ตัวละคร NPC) และ Web UI Icons ต้องใช้ **Generated Pixel / Vector Assets** ห้ามใช้อิโมจิ
7. **Decision is private:** ทั้งสองฝ่ายห้ามเห็นคำตอบของอีกฝ่ายจนกว่าจะส่งคำตอบครบทั้งคู่
8. **Mobile is complete:** ห้ามซ่อน Action สำคัญไว้หลัง Hover หรือจำกัดให้ใช้เฉพาะโหมดแนวนอน (Landscape-only)
9. **Status is explicit:** สถานะคิว เครือข่าย และสื่อ ต้องมี Icon + Text กำกับเสมอ ไม่ใช้สีเพียงอย่างเดียว
10. **AI explains and defers:** แสดงเหตุผลจากหลักฐานผลงานเสมอ และผู้ใช้สามารถแก้ไขข้อมูลได้
11. **Synthetic data only:** ใช้เฉพาะโดเมน `.test` และข้อมูลบุคคล/บริษัทจัดแสดงเท่านั้น
12. **Truthful demo:** ทุกส่วนที่มีการจำลอง (Mock) ต้องมีป้ายกำกับชัดเจนโดยไม่ต้องเปิด DevTools
13. **React + GSAP minimalist shell:** ทุกหน้าที่ไม่ใช่ Career Hall ต้องเป็น React Semantic DOM ใช้ GSAP อย่างพอดี และรักษา Minimalist Liquid Glass ที่มี whitespace/contrast ชัดเจน
14. **Seamless physics world:** Career Hall ต้องเป็น Phaser world แบบ loop/streaming ที่มี collision, sensor, Y-depth และ foreground occlusion จริง; ห้ามใช้ภาพแบนร่วมกับ CSS hotspot เป็นตัวแทนเกม
15. **Zero Unfinished/Raw UI Standard (ห้าม UI ดิบ/ไม่เสร็จโดยเด็ดขาด):** ห้ามแสดงผลเป็น Raw HTML ดิบที่ขาด CSS/Tailwind, ขาด Flexbox/Grid, ขาด Card/Container, ขาดสี Gradient/Glow หรือปุ่มรูปทรงดั้งเดิมของเบราว์เซอร์ ทุกหน้าจอต้องเรนเดอร์ UI ระดับ Production-grade ที่สวยงาม คมชัด มี Responsive Padding, Typography, Glassmorphism และ Neon Aesthetics ที่สมบูรณ์พร้อมใช้งานจริง 100%

---

## 1.3 Recommended Build Sequence (Slices 0 to 6)

```text
Slice 0: Foundation (Router, Shell, Design Tokens, Primitives, Demo Store, Test Harness)
  │
  ├─► Slice 1: Event & Profile (Landing, Mock Verify, Consent, Resume Import, Masked Review)
  │
  ├─► Slice 2: World & Discovery (Seamless Phaser Hall, Physics/Depth Layers, Info Kiosks, Navigator parity, AI Explanation)
  │
  ├─► Slice 3: Queue Management (1 Active Ticket, Ready Check Alert, Recovery)
  │
  ├─► Slice 4: Speed Interview (Real Cam, Face Tracking Mask, Web Audio DSP Voice Alteration)
  │
  ├─► Slice 5: Decision & Reveal (Private Decision, Mutual Match, Consented Field Reveal)
  │
  └─► Slice 6: Recruiter Desk & Demo Polish (Recruiter Dashboard, Presets, A11y, Runbook)
```

---

## 1.4 Agent Working Method

### 1. Before Coding (ก่อนลงมือเขียนโค้ด)
- อ่านข้อกำหนดที่เกี่ยวข้องในโฟลเดอร์ `docs/` (Requirements, Architecture, Design)
- ระบุ Vertical Slice, Routes, Personas, และ Acceptance Criteria ให้ชัดเจน
- ตรวจสอบโครงสร้างไฟล์เดิมก่อนเพิ่ม Dependency ใหม่

### 2. During Coding (ระหว่างการเขียนโค้ด)
- พัฒนาทีละ 1 Vertical Slice ตั้งแต่ Route → State Machine → UI → Error Fallback → Tests
- แยก Domain Rules ออกจาก Presentation Layer
- ใช้ Fixture IDs มาตรฐาน (เช่น `Candidate #8F3A`, `company-cyber-orchard`)
- ตรวจสอบการแสดงผลบน Mobile (390 px) ไปพร้อมกับ Desktop เสมอ
- รักษาขนาด Diff ให้เล็ก และไม่แก้ไขไฟล์นอก Scope ที่กำหนด

### 3. Before Handing Off (ก่อนส่งมอบงาน)
Agent ต้องสรุปผลและรายงาน:
- **Outcome:** ฟังก์ชันที่สร้างเสร็จสมบูรณ์
- **Files Changed:** รายการไฟล์ที่มีการแก้ไข/เพิ่ม
- **Routes / Scenarios Covered:** เส้นทางการทำงานที่ครอบคลุม
- **Tests Run & Results:** ผลการรัน Unit Tests, Typecheck, Build, E2E
- **Accessibility & Responsive Checks:** ผลการตรวจทานที่ 320 px, 390 px, และ Keyboard flow

---

## 1.5 Required npm Scripts

```bash
npm run dev          # เปิด Local Development Server
npm run build        # ทดสอบการ Build Production
npm run typecheck    # ตรวจสอบ TypeScript Types
npm run lint         # ตรวจสอบ Linting Rules
npm test             # รัน Vitest Unit & Component Tests
npm run test:e2e     # รัน Playwright End-to-End Tests
npm run test:a11y    # รัน Axe-core Accessibility Tests
```

---

## 1.6 Stop Conditions (เงื่อนไขที่ Agent ต้องหยุดและสอบถามผู้ใช้)

- เมื่อจำเป็นต้องใช้ Production Credential จริง, ข้อมูลส่วนบุคคลจริง, หรือ External Account
- เมื่อจำเป็นต้องเปลี่ยนนโยบาย Blind Mode, Reveal Policy, หรือ Decision Privacy
- เมื่อจำเป็นต้องตัดโหมด Navigator / List Mode ออกเพื่อแลกกับให้ World เสร็จทัน
- เมื่อจำเป็นต้องใช้ Asset ที่ไม่ชัดเจนเรื่องลิขสิทธิ์
- เมื่อการทำงานของ Feature จะทำให้ภาพกล้องจริงหลุดออกไปโดยไม่มีการ Mask
