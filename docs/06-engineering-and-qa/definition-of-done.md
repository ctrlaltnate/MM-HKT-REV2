# 5. Definition of Done (DoD)

---

## 5.1 Engineering Definition of Done

ฟีเจอร์หรือ User Story ในทางวิศวกรรมจะถือว่า **Done (เสร็จสมบูรณ์)** เมื่อผ่านเกณฑ์ครบทุกข้อต่อไปนี้:

1. **Requirement & Acceptance Approval:** ได้รับการยืนยันตรงตาม Functional Requirements และ Acceptance Criteria
2. **Responsive Design Coverage:** ผ่านการทดสอบบน Viewport หลักครบถ้วน: Mobile Compact (360/390 px), Tablet (768 px), Desktop (1440 px) และผ่าน 320 px Reflow
3. **Universal UI States:** มีการรองรับสถานะ `Loading`, `Populated`, `Empty`, `Validation Error`, `Permission Denied`, `Offline / Reconnecting`, และ `Server Error`
4. **Accessibility Equivalency:** ผ่านการทดสอบ Keyboard Navigation 100%, มี Skip Link, และ Screen Reader อ่านข้อมูลสำคัญได้ถูกต้อง
5. **Security & Authorization:** มีการตรวจสอบสิทธิ์ Server-side (RBAC/Tenant Isolation) และบันทึก Append-only Audit Log
6. **Zero PII in Telemetry:** ตรวจสอบแล้วว่าไม่มีการส่งข้อมูลส่วนบุคคล, Resume Text, หรือ Secret ลงใน Application Logs และ Analytics
7. **Automated Test Coverage:** ผ่านชุดการทดสอบ Unit Tests, Component Tests, Contract Tests, และ Playwright E2E Tests ทั้งหมด
8. **Performance Budget:** ขนาด Bundle และการเรนเดอร์ไม่ส่งผลกระทบให้ Core Web Vitals (LCP, INP, CLS) ถดถอยเกินเกณฑ์
9. **Documentation & Changelog:** อัปเดตเอกสาร API, Data Schema, และ State Machine ในโฟลเดอร์ `docs/` ให้ตรงกับโค้ดปัจจุบัน
10. **Synthetic Data Hygiene:** ข้อมูล Demo และ Seed Data ปราศจากข้อมูลบุคคลจริงหรือ Asset ที่ละเมิดลิขสิทธิ์
11. **P0 Complete Website Gate:** Product Landing, Event Landing, candidate preparation และ Career Hall เชื่อมเป็น flow ที่กดใช้งานได้จริงทุก control พร้อม direct route, back/forward, reload/resume/reset, validation, 404 recovery, responsive reflow และ Phaser mount/unmount lifecycle หากขาดส่วนใด Website ยังไม่ถือว่า Done แม้หน้าเกมเปิดได้
12. **P0 Native World Gate:** Career Hall ผ่าน G1–G7 ใน [Game Visual & World Specification](../03-design/world-and-scene-design.md): real Phaser entities, top-front camera เดียว, owner-linked collider/sensor, foot hitbox/Y-depth, directional character 4 ทิศ × 3 เฟรม, wardrobe แยก skin/hair/top/bottom/trousers/shoes/accessory และ modular booth variants ตามขั้นต่ำ หากขาดข้อใด feature World ยังไม่ถือว่า Done แม้ build ผ่าน

---

## 5.2 Design Definition of Done

งานออกแบบ (Design Handoff) จะถือว่าพร้อมสำหรับการส่งมอบให้ทีม Engineering พัฒนา เมื่อ:

1. **P0 Screen Frames Complete:** มี Frame ครบทั้ง Desktop 1440 px และ Mobile 390 px สำหรับทุกหน้าจอระดับ P0
2. **Narrow Reflow Review:** ออกแบบและตรวจทานการจัดวางหน้าจอที่ความกว้าง 320 CSS px สำหรับ Semantic Task Flow ทั้งหมด
3. **State & Interaction Annotation:** ทุก Frame มี Annotation กำกับ Role, Route, Entry State, Primary Action, และ Error Handling
4. **Design Token Consistency:** ใช้ Color Tokens, Spacing Grid (4/8 px), และ Typography ตาม Design System โดยไม่มี One-off Style แปลกปลอม
5. **World & Navigator Parity:** ข้อมูลในฉาก World Canvas และโหมด Navigator / List Mode ตรงกัน 100%
6. **Focus & Keyboard Behavior:** ระบุ Focus Order, Active Ring, และ Escape/Close Behavior สำหรับ Dialog และ Sheet
7. **Privacy Peer Review:** ผ่านการตรวจทาน Flow การเปิดเผยข้อมูล (Reveal) และ Blind Mode โดยผู้ที่ไม่ได้เป็นผู้วาด Frame นั้น
8. **Asset Registry Provenance:** บันทึกข้อมูล Asset ID, แหล่งที่มา, สิทธิ์การใช้งาน, และขนาดไฟล์ของงานภาพครบทุกชิ้น
9. **Clickable Prototype Validation:** เชื่อมต่อ Flow ใน Prototype ครบทั้ง Happy Path, No Match, และ Media Denied Path
10. **User Testing Passed:** ผ่านการทดสอบกับผู้ใช้งานกลุ่มตัวอย่าง 3 คน และแก้ไขประเด็นความสับสนหลักเรียบร้อยแล้ว
11. **Game Visual Handoff:** มี camera lineup, character turnaround, booth variant sheet, pivot/collider overlay และ in-scene 390/1440 px evidence ตาม [Game Visual & World Specification](../03-design/world-and-scene-design.md) โดยใช้สอง `00_MAIN_*` เป็น reference เท่านั้นและไม่คัดลอก branding/layout
