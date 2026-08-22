# 2. Demo Runbook, Real Media & 5-Minute Pitch Storyboard

---

## 2.1 5-Minute Hackathon Demo Storyboard

| เวลาบนเวที | การกระทำบนหน้าจอ (Screen Action) | ประเด็นสำคัญที่กรรมการต้องเข้าใจ (Key Takeaway) |
|:---:|---|---|
| **0:00–0:25** | เปิดหน้า Landing (`/event/demo`) อธิบายปัญหาการจ้างงาน | **Skills First, Bias Last:** เริ่มต้นจากทักษะจริงก่อนตัดสินจากตัวตน |
| **0:25–0:55** | กดใช้ Resume ตัวอย่าง แสดง Side-by-Side Redaction Review | **Candidate Agency:** AI ช่วยสกัดข้อมูล แต่ผู้สมัครเป็นผู้ตรวจสอบและควบคุม |
| **0:55–1:35** | เข้าสู่ Neon Career Hall เดินชมบูธสมจริง สลับโหมด Navigator | **Spatial & Inclusive:** บูธมีเคาน์เตอร์ จอแสดงผล Recruiter นั่งประจำ และเข้าถึงได้ 100% ผ่าน List Mode |
| **1:35–2:05** | เปิดบูธ Cyber Orchard ดูคะแนน 92/100 และอ่านเหตุผล | **Explainable AI:** แนะนำงานจากหลักฐานผลงานจริง ไม่ใช่ Black-box |
| **2:05–2:35** | กดเข้าคิว, Refresh หน้าจอเพื่อโชว์ Recovery, รับ Ready Check | **Stateful & Resilient:** คิวสัมภาษณ์ไม่สูญหายแม้เน็ตหลุด |
| **2:35–3:15** | **เปิดกล้องจริง สตรีมวิดีโอพร้อม Face Tracking Mask & ดัดเสียงจริง** | **Real Production Media:** ปลอดภัย 100% ด้วย Face Landmark Overlay และ Voice DSP บนเครื่องผู้ใช้ |
| **3:15–3:45** | ฝั่ง Candidate และ Recruiter ส่ง Private Decision แยก Tab | **Double-Blind Choice:** การตัดสินใจเป็นความลับ ปราศจากแรงกดดัน |
| **3:45–4:20** | หน้าจอแสดง Mutual Match และ Candidate เลือกแชร์เฉพาะ Email | **Consented Reveal:** ข้อมูลติดต่อเปิดเผยเฉพาะเมื่อยินยอมทั้งสองฝ่าย |
| **4:20–5:00** | สรุปภาพรวมสถาปัตยกรรมและโอกาสต่อยอดทางนโยบาย | **Feasible & Practical:** ใช้งานได้จริงบนเบราว์เซอร์ พร้อมขยายสู่ Pilot |

---

## 2.2 Step-by-Step Demo Runbook

1. **เปิดเบราว์เซอร์ 3 หน้าต่าง (Multi-Role Demo Setup):**
   - Tab 1 (ผู้สมัคร): `http://localhost:4173/event/demo`
   - Tab 2 (ผู้สัมภาษณ์): `http://localhost:4173/recruiter/demo/dashboard`
   - Tab 3 (ผู้ดูแลระบบ): `http://localhost:4173/ops/events/demo/live`

2. **Tab 1 (Candidate Flow):**
   - กดปุ่ม `[ 👤 เข้าเป็น Candidate ]` ใน Demo Switcher Bar
   - กดยอมรับความยินยอม และยืนยันตัวตนจำลอง ThaID
   - กดปุ่ม `ใช้ Resume ตัวอย่าง` → ตรวจทาน Masked Profile Preview → กดยืนยัน
   - เข้าสตูดิโอแต่งตัวละคร 8-bit กดปุ่ม `[🎲 สุ่มตัวละคร]` แล้วเข้าสู่ Career Hall
   - เดินไปที่บูธ **Cyber Orchard Co.** หรือใช้ Navigator เลือกตำแหน่ง **Backend Developer**
   - ตรวจดูคะแนนความตรงกัน **92/100** และกด `เข้าคิวสัมภาษณ์`

3. **Tab 2 (Recruiter Live Desk Flow):**
   - สลับไป Tab 2 สังเกตเห็นชื่อ **Candidate #8F3A** ปรากฏใน Live Queue Board ทันที
   - Recruiter กดปุ่ม **`[▶ เรียกผู้สมัครคนถัดไป]`**

4. **Trigger & Attend Speed Interview:**
   - หน้าจอ Tab 1 (ผู้สมัคร) จะเด้ง Ready Check Alert Dialog (60s) → กด `พร้อมสัมภาษณ์ทันที`
   - ทั้งสองฝ่ายเข้าสู่หน้าห้องสัมภาษณ์: **เปิดกล้องจริงของผู้พรีเซนต์** ผ่าน `getUserMedia`
   - แสดงการทำงานของ **Realtime Face Tracking Engine** (เรนเดอร์หน้ากากสัตว์ครอบทับแบบ Real-time)
   - แสดงการทำงานของ **Web Audio API AudioWorklet DSP Voice Pitch Shift** ที่ดัดเสียงจริงทันที

5. **ส่งผลการตัดสินใจ (Private Decision) & Mutual Match:**
   - Tab 1 (ผู้สมัคร) กดปุ่ม `สนใจไปต่อ` (หน้าจอรอคำตอบ)
   - Tab 2 (Recruiter) กดปุ่ม `สนใจไปต่อ`
   - หน้าจอแสดง **🎉 MUTUAL MATCH!** ทั้งสองฝ่าย
   - Candidate ติ๊กเลือกเฉพาะ `อีเมล` และ `Portfolio` → กดยืนยันการแชร์ข้อมูล
   - Recruiter มองเห็นข้อมูลติดต่อใน Pipeline ทันที

6. **Tab 3 (Admin & Live Operations Flow):**
   - สลับไป Tab 3 (Admin Portal) สังเกตเห็นสถิติ CCU และ Mutual Match นับเพิ่มขึ้น
   - พิมพ์ข้อความประกาศด่วนในช่อง Live Broadcast: `“ยินดีต้อนรับสู่งาน! รอบสัมภาษณ์พิเศษเปิดแล้ว”` แล้วกด `[📢 ส่งประกาศ]`
   - สังเกตเห็นแถบประกาศสีนีออนปรากฏขึ้นบนหน้าจอ Tab 1 และ Tab 2 แบบ Real-time ทันที!

---

## 2.3 Scenario Presets in Demo Controller (`/demo/control`)

| Scenario Preset | Candidate Choice | Recruiter Choice | Media Mode | Queue / State Behavior |
|---|:---:|:---:|---|---|
| **Happy Match** | สนใจไปต่อ | สนใจไปต่อ | Real Face Mask + Voice DSP | Ready check ผ่านทันที → เกิด Mutual Match และเปิด Reveal |
| **No Match** | สนใจไปต่อ | ยังไม่ไปต่อ | Avatar-only | ผลลัพธ์ปิดเงียบ ไม่เปิดเผยว่าใครเลือก Pass |
| **Media Denied** | สนใจไปต่อ | สนใจไปต่อ | Camera Denied | สลับเข้าสู่ Avatar-only mode อัตโนมัติและสัมภาษณ์ต่อได้ |
| **Queue Timeout** | — | — | — | ปล่อยให้เวลา 60s หมดลง → แสดงปุ่มเสนอเข้าคิวใหม่ (Requeue) |
| **Offline Recovery** | สนใจไปต่อ | สนใจไปต่อ | Reconnect Once | จำลองสัญญาณหลุด → กู้คืน Ticket เดิมสำเร็จ |

---

## 2.4 Rehearsal & Backup Plan

- **Local Build Running:** รัน Server แบบ Local บนเครื่องคอมพิวเตอร์พรีเซนต์เสมอ
- **One-Click Reset:** ในกรณีที่เกิดข้อผิดพลาด ให้กดปุ่ม `Reset All Demo Data` ใน `/demo/control` เพื่อเริ่มต้นใหม่ภายใน 5 วินาที
- **Offline Backup Asset:** เตรียมวิดีโอบันทึกหน้าจอความยาว 90 วินาที และสไลด์ภาพจับหน้าจอ (Static Screenshots) ของแต่ละขั้นตอนสำคัญไว้สำรองเผื่อกรณีระบบเสียง/เน็ตในงานขัดข้อง
