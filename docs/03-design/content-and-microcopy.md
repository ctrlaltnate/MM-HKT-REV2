# 6. Content Design, Microcopy & Localization

---

## 6.1 Brand Voice & Tone Guidelines

- **เป็นมิตรและให้เกียรติ (Respectful & Empathetic):** สื่อสารด้วยความเข้าใจ ไม่สร้างความกดดัน ไม่ใช้คำที่ตัดสินผู้ใช้งาน
- **ตรงไปตรงมาและโปร่งใส (Clear & Transparent):** บอกผลลัพธ์ที่จะเกิดขึ้นก่อนการกระทำที่ย้อนกลับยาก (เช่น การออกจากคิว หรือการเปิดเผยข้อมูล)
- **AI as an Assistant, Not a Judge:** เรียกฟังก์ชัน AI ว่า “แนะนำ”, “สกัดข้อมูล”, หรือ “ประเมินความตรงกัน” เสมอ **ห้าม** ใช้คำว่า “AI ตัดสินใจ”, “ระบบคัดออก”
- **ปราศจากคำกล่าวหา (No Blame Language):** **ห้าม** ใช้คำว่า “ตรวจพบการโกง”, “มีพฤติกรรมผิดปกติ”, หรือ “ไม่ใช่มนุษย์” จากสัญญาณอินเทอร์เน็ตหลุดหรือการสลับแท็บ

---

## 6.2 Canonical Microcopy Set

| สถานการณ์ | Preferred UI Copy (ภาษาไทย) | English Equivalent |
|---|---|---|
| **Demo Identity** | `โหมดสาธิต — ไม่ได้เชื่อมต่อ ThaID จริง` | `Demo Mode — Not a real ThaID integration` |
| **Profile Uncertainty** | `เรายังไม่มั่นใจว่าข้อมูลนี้ถูกต้อง กรุณาตรวจและแก้ไข` | `We are not confident in this extraction. Please review.` |
| **Queue Delayed** | `คิวล่าช้ากว่าประมาณการราว 5 นาที ตำแหน่งของคุณยังอยู่` | `Queue is delayed by ~5 min. Your position is retained.` |
| **Mask Failure** | `ระบบปิดบังใบหน้าหยุดชั่วคราว เราหยุดส่งวิดีโอแล้ว เลือกลองใหม่หรือใช้ Avatar-only` | `Face mask stopped. Video paused. Retry or use Avatar-only.` |
| **Network Reconnect** | `การเชื่อมต่อขาดชั่วคราว กำลังนำสถานะล่าสุดกลับมา` | `Connection lost. Restoring your session...` |
| **Ready Timeout** | `หมดเวลาตอบรับครั้งนี้ คุณเข้าคิวใหม่ได้โดยไม่ถูกลงโทษ` | `Ready check expired. You can requeue without penalty.` |
| **No Match Result** | `ครั้งนี้ยังไม่มีขั้นตอนต่อ ข้อมูลติดต่อของคุณยังไม่ถูกเปิดเผย` | `No mutual match this time. Your contact remains private.` |
| **Mutual Match / No PII Yet** | `สนใจตรงกันแล้ว ข้อมูลติดต่อยังไม่ถูกเปิดเผย รอคำขอจากบริษัท` | `It's a mutual match. Your contact is still private while the company prepares a request.` |
| **Recruiter Field Request** | `บริษัทขอข้อมูลต่อไปนี้เพื่อดำเนินการขั้นถัดไป คุณเลือกแชร์เพียงบางรายการหรือไม่แชร์ก็ได้` | `The company requested these fields for the next step. You may share some or none.` |
| **Consented Reveal** | `แชร์เฉพาะข้อมูลที่คุณเลือก บริษัทจะไม่เห็นข้อมูลอื่น` | `Only your selected fields will be shared with the employer.` |
| **Connected Service Down** | `บริการนี้เชื่อมต่อไม่ได้ในขณะนี้ ข้อมูลสาธิตจะไม่ถูกนำมาแทนข้อมูลจริง` | `This service is unavailable. Demo data will not replace connected data.` |

---

## 6.3 Localization Specification

- **Translation Keys:** ข้อความ UI ทั้งหมดต้องเก็บในรูป Translation Keys (เช่น `auth.demo_notice`, `queue.ready_check_title`) ห้าม Hard-code ภาษาไทยใน Business Logic
- **Dynamic Text Expansion:** ออกแบบ Layout รองรับภาษาอังกฤษที่อาจยาวขึ้น 30–40% และรองรับการตัดคำภาษาไทยอย่างถูกต้อง
- **Internationalization (Intl):**
  - แสดงเวลาและวันที่พร้อม Timezone ของงาน (`Asia/Bangkok`) และเวลาท้องถิ่นของผู้ใช้
  - ตัวเลขและเวลานับถอยหลังใช้ `Intl.NumberFormat` และ Tabular Numerals
- **No Embedded Text in Bitmaps:** ห้ามเรนเดอร์ตัวหนังสือฝังลงในภาพ Pixel Art เพื่อให้ Screen Reader สามารถอ่านออกเสียงและสามารถแปลภาษาได้
