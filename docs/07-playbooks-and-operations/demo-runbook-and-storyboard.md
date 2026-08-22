# 2. Demo Runbook & 5-Minute Pitch Storyboard

---

## 2.1 5-Minute Hackathon Demo Storyboard

| เวลาบนเวที | การกระทำบนหน้าจอ (Screen Action) | ประเด็นสำคัญที่กรรมการต้องเข้าใจ (Key Takeaway) |
|:---:|---|---|
| **0:00–0:25** | เปิดหน้า Landing (`/event/demo`) อธิบายปัญหาการจ้างงาน | **Skills First, Bias Last:** เริ่มต้นจากทักษะจริงก่อนตัดสินจากตัวตน |
| **0:25–0:55** | กดใช้ Resume ตัวอย่าง แสดง Side-by-Side Redaction Review | **Candidate Agency:** AI ช่วยสกัดข้อมูล แต่ผู้สมัครเป็นผู้ตรวจสอบและควบคุม |
| **0:55–1:35** | เข้าสู่ Neon Career Hall แสดงการเดิน และสลับโหมด Navigator | **Spatial & Inclusive:** สนุกเหมือนเกม 2D แต่เข้าถึงได้ 100% ผ่าน List Mode |
| **1:35–2:05** | เปิดบูธ Cyber Orchard ดูคะแนน 92/100 และอ่านเหตุผล | **Explainable AI:** แนะนำงานจากหลักฐานผลงานจริง ไม่ใช่ Black-box |
| **2:05–2:35** | กดเข้าคิว, Refresh หน้าจอเพื่อโชว์ Recovery, รับ Ready Check | **Stateful & Resilient:** คิวสัมภาษณ์ไม่สูญหายแม้เน็ตหลุด |
| **2:35–3:15** | เข้าห้องสัมภาษณ์ สลับโหมด Animal Mask / Avatar-only | **Media Privacy:** ควบคุมความเป็นส่วนตัวได้ กล้อง/ไมค์ปลอดภัย ไม่เปิดภาพจริง |
| **3:15–3:45** | ฝั่ง Candidate และ Recruiter ส่ง Private Decision แยก Tab | **Double-Blind Choice:** การตัดสินใจเป็นความลับ ปราศจากแรงกดดัน |
| **3:45–4:20** | หน้าจอแสดง Mutual Match และ Candidate เลือกแชร์เฉพาะ Email | **Consented Reveal:** ข้อมูลติดต่อเปิดเผยเฉพาะเมื่อยินยอมทั้งสองฝ่าย |
| **4:20–5:00** | สรุปภาพรวมสถาปัตยกรรมและโอกาสต่อยอดทางนโยบาย | **Real Prototype:** พร้อมขยายสู่ Pilot จริงด้วย Architecture ที่ได้มาตรฐาน |

---

## 2.2 Step-by-Step Demo Runbook

1. **เปิดเบราว์เซอร์ 2 หน้าต่าง (Side-by-Side Tabs):**
   - Tab 1: ผู้สมัคร `http://localhost:4173/event/demo`
   - Tab 2: ผู้สัมภาษณ์ `http://localhost:4173/demo/role/recruiter`
2. **Tab 1 (Candidate Flow):**
   - กดยอมรับความยินยอม และเลือกยืนยันตัวตนแบบจำลอง
   - กดปุ่ม `ใช้ Resume ตัวอย่าง` → ตรวจทาน Masked Profile Preview → กดยืนยัน
   - เลือก Avatar สัตว์ (จิ้งจอก/แมว) และเข้าสู่ Career Hall
   - เดินไปที่บูธ **Cyber Orchard Co.** หรือใช้ Navigator เลือกตำแหน่ง **Backend Developer**
   - ตรวจดูคะแนนความตรงกัน **92/100** และกด `เข้าคิวสัมภาษณ์`
3. **Trigger Ready Check:**
   - กดปุ่ม `Demo: เรียกคิวทันที` หรือใช้ `/demo/control` เพื่อจำลองการเรียกคิว
   - หน้าต่าง Ready Check Alert Dialog (60s) จะปรากฏขึ้น → กด `พร้อมสัมภาษณ์ทันที`
4. **เข้าสู่ห้องสัมภาษณ์ (Interview Room):**
   - ผ่านการตรวจ Preflight Check เลือกลักษณะภาพ (Animal Mask หรือ Avatar-only)
   - ดำเนินการสนทนาจำลองในห้องสัมภาษณ์
5. **ส่งผลการตัดสินใจ (Private Decision):**
   - ฝั่ง Candidate กดปุ่ม `สนใจไปต่อ` (หน้าจอจะขึ้นรอคำตอบอีกฝ่าย)
   - สลับไป Tab 2 (Recruiter) กดปุ่ม `สนใจไปต่อ` เช่นกัน
6. **Mutual Match & Reveal:**
   - หน้าจอจะเฉลิมฉลองสถานะ **Mutual Match!**
   - Candidate ติ๊กเลือกเฉพาะ `อีเมล` และ `Portfolio` → กดยืนยันการแชร์ข้อมูล
   - Recruiter จะได้รับข้อมูลติดต่อเฉพาะฟิลด์ที่ได้รับอนุญาต

---

## 2.3 Scenario Presets in Demo Controller (`/demo/control`)

| Scenario Preset | Candidate Choice | Recruiter Choice | Media Mode | Queue / State Behavior |
|---|:---:|:---:|---|---|
| **Happy Match** | สนใจไปต่อ | สนใจไปต่อ | Animal Mask / Avatar | Ready check ผ่านทันที → เกิด Mutual Match และเปิด Reveal |
| **No Match** | สนใจไปต่อ | ยังไม่ไปต่อ | Avatar-only | ผลลัพธ์ปิดเงียบ ไม่เปิดเผยว่าใครเลือก Pass |
| **Media Denied** | สนใจไปต่อ | สนใจไปต่อ | Camera Denied | สลับเข้าสู่ Avatar-only mode อัตโนมัติและสัมภาษณ์ต่อได้ |
| **Queue Timeout** | — | — | — | ปล่อยให้เวลา 60s หมดลง → แสดงปุ่มเสนอเข้าคิวใหม่ (Requeue) |
| **Offline Recovery** | สนใจไปต่อ | สนใจไปต่อ | Reconnect Once | จำลองสัญญาณหลุด → กู้คืน Ticket เดิมสำเร็จ |

---

## 2.4 Rehearsal & Backup Plan

- **Local Build Running:** รัน Server แบบ Local บนเครื่องคอมพิวเตอร์พรีเซนต์เสมอ
- **One-Click Reset:** ในกรณีที่เกิดข้อผิดพลาด ให้กดปุ่ม `Reset All Demo Data` ใน `/demo/control` เพื่อเริ่มต้นใหม่ภายใน 5 วินาที
- **Offline Backup Asset:** เตรียมวิดีโอบันทึกหน้าจอความยาว 90 วินาที และสไลด์ภาพจับหน้าจอ (Static Screenshots) ของแต่ละขั้นตอนสำคัญไว้สำรองเผื่อกรณีระบบเสียง/เน็ตในงานขัดข้อง
