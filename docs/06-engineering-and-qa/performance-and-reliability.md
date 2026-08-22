# 1. Performance Budgets, Scalability & Reliability

---

## 1.1 Pilot Performance Targets (SLOs)

| Metric / Indicator | Target Value (SLO) | Measurement Context |
|---|:---:|---|
| **LCP (Largest Contentful Paint) p75** | `≤ 2.5 s` | วัดแยกกันระหว่าง Mobile และ Desktop |
| **INP (Interaction to Next Paint) p75** | `≤ 200 ms` | วัดการตอบสนองต่อการคลิก/แตะหน้าจอ |
| **CLS (Cumulative Layout Shift) p75** | `≤ 0.1` | ความนิ่งขององค์ประกอบ UI |
| **World Render Frame Rate** | `60 fps` (Desktop) / `≥ 30 fps` (Mobile) | ขณะเดินในฉากปกติ |
| **Local Input-to-Avatar Feedback p95** | `≤ 100 ms` | การขยับ Avatar บนเครื่องผู้ใช้ (Client-side) |
| **App Shell Compressed Transfer** | `≤ 1.5 MB` | HTML, CSS, Core JS, Base Fonts |
| **Initial World Asset Pack** | `≤ 2.0 MB` | Background Image + Base Sprite Atlas |
| **Total Cold Transfer before Interactive** | `≤ 3.5 MB` | โหลดครั้งแรกก่อนเริ่มเดินใน World |
| **Core API Response Time p95** | `≤ 400 ms` | ไม่รวมการประมวลผล AI หรือ Media |
| **Queue State Propagation p95** | `≤ 1.0 s` | การอัปเดตสถานะคิวผ่าน WebSocket |
| **Interview Join Time p95** | `≤ 10.0 s` | ตั้งแต่ผ่าน Preflight จนเห็นภาพคู่สนทนา |
| **Availability during Live Event** | `≥ 99.9%` | ตลอดช่วงเวลาจัดงานแฟร์ |

---

## 1.2 Reproducible Performance Profile (CI Baseline)

การทดสอบประสิทธิภาพใน CI Pipeline ต้องจำลองสภาวะแวดล้อมมาตรฐาน:
- **Viewport:** 412 × 915 px (Mobile Portrait), DPR 2.625
- **CPU Throttling:** 4× Slowdown
- **Network Profile:** Throttled Fast 3G / 4G (1.6 Mbps Down, 750 Kbps Up, RTT 150 ms)
- **Standard Scene Load:** 50 Remote Avatars, 200 Decorative Objects, 20 Interactive POIs, Floating HUD, Minimap และ 1 Side Panel
- **Sampling:** ทำการรันแบบ Cold Cache 5 ครั้ง + Warm Cache 5 ครั้ง เพื่อหาค่า Median, p75, p95 และ Heap Memory Peak

---

## 1.3 Asset & Runtime Optimization Strategy

- **Route-based Code Splitting:** ทำการแยก Bundle ของแต่ละ Route (เช่น Onboarding, World, Interview, Recruiter Desk)
- **Sprite Atlas & Tile Culling:** รวม Sprite ขนาดเล็กเป็น Texture Atlas แผ่นเดียว และเรนเดอร์เฉพาะ Tile ที่อยู่ในขอบเขตสายตาของกล้อง (Camera Viewport Culling)
- **Unmount World during Interview:** สั่งทำลายหรือ Freeze Phaser Instance เมื่อผู้ใช้เข้าสู่ห้องสัมภาษณ์ เพื่อคืนทรัพยากร CPU/GPU ให้กับ WebRTC Video
- **Adaptive Video Resolution:** ลดความละเอียดของวิดีโอลงตามคุณภาพเครือข่าย โดยให้ความสำคัญกับสัญญาณเสียง (Audio Priority) ก่อนภาพเสมอ

---

## 1.4 Reliability & Fault-Tolerance Strategy

- **PostgreSQL Transactions:** การเปลี่ยนสถานะคิว, การส่ง Decision, และการ Grant สิทธิ์เข้าถึงข้อมูล ต้องทำผ่าน Database Transaction ที่รองรับ ACID
- **State Recovery after Redis Loss:** หาก Redis Cache ขัดข้อง ระบบสามารถ Rebuild ข้อมูลคิวและสถานะปัจจุบันกลับขึ้นมาจาก PostgreSQL ได้อย่างสมบูรณ์
- **Exponential Backoff with Jitter:** การ Reconnect ของ WebSocket และ Client API ใช้การหน่วงเวลาแบบ Backoff เพื่อป้องกันปัญหา Thundering Herd
- **Circuit Breaker & Backpressure:** เมื่อ Capacity ของโซนหรือ Worker ถึง 80% ระบบจะเปิดโหมด Waiting Room และระงับฟังก์ชันตกแต่งเพื่อรักษา Core Queue & Interview Loop
