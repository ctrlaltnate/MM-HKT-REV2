# 3. Test Strategy, Quality Gates & QA Matrix

---

## 3.1 Multi-Layered Testing Strategy

- **Unit & Domain Tests (Vitest):** ทดสอบ Pure Domain Rules, State Transition Guards, Match Scoring Formula, Redaction Logic, และ Interview Timers
- **Contract Tests:** ทดสอบ REST API Schemas (OpenAPI/JSON Schema), WebSocket Events Payload, Concurrency Optimistic Locking (`If-Match`), และ Idempotency
- **Component Tests (React Testing Library):** ทดสอบ Dialog/Sheet Focus Trap, Escape Behavior, QueueChip Live Status, และ Media Control Toggles
- **Critical End-to-End Tests (Playwright):**
  1. Candidate Happy Path บน Desktop
  2. Candidate Onboarding จนถึงเข้าคิวบน Mobile (390 px Touch Viewport)
  3. Narrow 320 px Semantic / List Mode Flow
  4. Refresh ระหว่างรอคิว (`QUEUED`) แล้ว Ticket เดิมต้องได้รับการกู้คืน
  5. Ready Check Accept vs Timeout Branches
  6. Double-Blind Decision: คำนวณผล Match เฉพาะเมื่อทั้งสองฝ่ายส่งคำตอบครบ
  7. No-match ไม่เปิดเผยว่าใครเลือก Pass
  8. Media Denied แล้วสลับเป็น Avatar Fallback โดยไม่ขัดขวาง Decision Flow
  9. Keyboard-Only Navigation ตลอด Core Flow
  10. Demo Reset คืนค่าสถานะเริ่มต้นอย่างสมบูรณ์ภายใน 10 วินาที
- **Accessibility Tests (Axe-core & Screen Reader):** Automated Accessibility Scan + Manual Keyboard Navigation + VoiceOver/NVDA Testing

---

## 3.2 Required Device & Viewport QA Matrix

| Viewport / Device Class | Dimensions | Mode & Input Type | Acceptance Focus |
|---|---|---|---|
| **Narrow Mobile (Reflow)** | `320 × 568 px` | Portrait / Touch-only | Reflow สมบูรณ์, ไม่มี Horizontal Scroll |
| **Android Compact** | `360 × 640 px` | Portrait / Touch-only | Layout ปุ่มไม่ซ้อนทับ, Bottom Sheet สไลด์ลื่น |
| **Standard Phone (iPhone)** | `390 × 844 px` | Portrait / Touch-only | Safe-area Inset, แตะปุ่มง่ายด้วยมือเดียว |
| **Phone Landscape** | `844 × 390 px` | Landscape / Touch-only | Modal ไม่ล้นจอ, ปิด/เปิดแถบควบคุมได้ |
| **Tablet Portrait** | `768 × 1024 px` | Portrait / Touch + Stylus| Split View: World Canvas + 1 Side Sheet |
| **Desktop Compact** | `1024 × 768 px` | Landscape / Pointer + Key| Side Panel พับเก็บได้, Minimap ชัดเจน |
| **Standard Desktop** | `1440 × 900 px` | Landscape / Pointer + Key| Three-column Layout, Full 60 FPS |
| **Desktop 400% Zoom** | `1280 × 1024 px` | Zoom 400% / Keyboard | Text Reflow ไม่ตกขอบ, Focus Indicator ชัด |

---

## 3.3 R0 Hackathon Demo Release Gate

ระบบพร้อมนำเสนอและสาธิตบนเวทีเมื่อผ่านเกณฑ์ต่อไปนี้ครบถ้วน:
- [ ] ติดตั้งและเปิดเครื่อง Cold Start ได้ผ่านคำสั่งเดียวใน `README.md`
- [ ] สามารถ Reset ข้อมูล Demo ทั้งหมดได้ภายใน 10 วินาทีผ่าน `/demo/control`
- [ ] เส้นทาง Candidate Journey จบกระบวนการ Mutual Match ได้ภายใน 4–5 นาที
- [ ] Recruiter View เปิดในอีก Tab/อุปกรณ์ และสถานะ Sync กันแบบ Real-time
- [ ] ใช้งานบนมือถือ (390 px) ได้สมบูรณ์ และหน้าจอแคบ (320 px) ไม่ล้นขอบ
- [ ] ฟังก์ชัน Queue Refresh Recovery และ Ready Check ทำงานซ้ำได้อย่างมั่นคง
- [ ] Match Score มีเหตุผลประกอบ 3–5 ข้อที่เข้าใจง่าย
- [ ] ไม่มีข้อมูล PII บุคคลจริง, ชื่อบริษัทจริง, หรือ Asset ที่ละเมิดลิขสิทธิ์
- [ ] ทุกหน้าจอที่มีการ Mock ติดป้าย `DEMO DATA` และ `NOT REAL THAID` ชัดเจน
- [ ] คำสั่ง Typecheck, Build, และ Tests ทั้งหมดผ่าน 100%

---

## 3.4 User Testing Script (Validation Protocol)

ทดสอบกับผู้ใช้งานกลุ่มตัวอย่าง 3 คนที่ไม่เคยเห็นระบบมาก่อน โดยให้ทำ 7 ภารกิจ:
1. “เข้า Event และบอกว่าบริษัทจะเห็นข้อมูลอะไรจากคุณบ้างในโหมด Blind Mode”
2. “ตรวจโปรไฟล์ที่ระบบซ่อนข้อมูลแล้วแก้ไขจุดที่มีความไม่มั่นใจ”
3. “ค้นหาตำแหน่งงาน Backend Developer โดยไม่ต้องเดินในแผนที่จำลอง”
4. “กดเข้าคิวสัมภาษณ์และบอกว่าตอนนี้ต้องรอนานเท่าใด”
5. “หากไม่ต้องการเปิดกล้อง คุณจะเข้าสัมภาษณ์ต่อด้วยวิธีใด”
6. “เลือกส่งผลการตัดสินใจ และบอกว่าอีกฝ่ายจะเห็นคำตอบของคุณเมื่อใด”
7. “หลังเกิด Mutual Match ให้เลือกแชร์เฉพาะอีเมลและลิงก์ผลงาน”
