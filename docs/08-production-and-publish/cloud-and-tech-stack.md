# 2. Future Production Tech Stack & Architecture

> **สถานะ:** Future-state proposal ระหว่าง R0; มีเฉพาะ local Web/Game vertical slice ส่วน service/backend ชุดนี้ยังไม่มีใน repository
> **เป้าหมาย:** สถาปัตยกรรมที่เข้าใจง่าย ใช้น้อยชิ้นแต่ทรงพลัง ลดภาระดูแล Server และขยายตัวได้เมื่อมีผู้ใช้จำนวนมาก

---

## 2.1 Proposed Tech Stack

| ส่วนของระบบ | เทคโนโลยีที่เลือกใช้ | ทำไมถึงเลือกตัวนี้? (จุดเด่น) |
|---|---|---|
| **Website Shell** | **React + Vite (workspace แยก)** | เป็น owner ของ route, form, accessibility, queue, interview และ admin UI |
| **Career Hall Game** | **Phaser 4.x (workspace แยก)** | เป็น owner ของ world loop, tilemap, collision, actor, camera และ proximity sensor |
| **โฮสติ้งเว็บ (Hosting)** | **Vercel** | เชื่อมต่อกับ GitHub แล้ว Deploy อัตโนมัติใน 1 คลิก พร้อม Global Edge CDN ฟรี |
| **ฐานข้อมูลหลัก & Realtime** | **Supabase** | ให้ครบทั้ง PostgreSQL, Auth, Realtime คิวสัมภาษณ์ และ Storage เก็บไฟล์ |
| **ฐานข้อมูลเอกสาร & Logs** | **MongoDB Atlas** | เก็บโครงสร้าง Resume แบบยืดหยุ่น (JSON Documents) และประวัติการใช้งาน |
| **ระบบวิดีโอ & เสียง (WebRTC)** | **LiveKit Cloud** | มีห้องสัมภาษณ์แบบ WebRTC สำเร็จรูป ไม่ต้องเขียน WebRTC Signaling เอง |
| **AI วิเคราะห์ Resume & แมตช์งาน** | **OpenAI / Anthropic / Gemini** | ใช้สกัดทักษะ ปิดบังประวัติส่วนตัว และคำนวณคะแนนความตรงกัน 0–100 |
| **ระบบครอบหน้ากากอวตาร (Face Mask)**| **MediaPipe FaceMesh (WASM)** | **ฟรี!** รันบนเบราว์เซอร์ของผู้ใช้เอง ไม่เสียค่า Server และปลอดภัย 100% |
| **ระบบดัดเสียงสด (Voice Pitch Shift)** | **Web Audio API (AudioWorklet)**| **ฟรี!** รันบนเบราว์เซอร์ของผู้ใช้ ดัดเสียงได้แบบ Real-time ความหน่วงต่ำมาก |

Website และ Game แชร์เฉพาะ typed contracts, domain types และ approved game assets ตาม [Web–Game Separation](../04-architecture/web-game-separation.md) แม้สุดท้ายจะถูก deploy ภายใต้ origin เดียวกันก็ตาม

---

## 2.2 การแบ่งหน้าที่ของฐานข้อมูล: Supabase vs MongoDB

เพื่อให้ระบบทำงานได้เร็วและปลอดภัย เราแบ่งการจัดเก็บข้อมูลออกเป็น 2 ส่วนตามความเหมาะสม:

```text
┌────────────────────────────────────────┐       ┌────────────────────────────────────────┐
│               SUPABASE                 │       │             MONGODB ATLAS              │
│        (Structured & Real-time)        │       │         (Unstructured & Logs)          │
├────────────────────────────────────────┤       ├────────────────────────────────────────┤
│ • บัญชีผู้ใช้ (Users & Auth)            │       │ • ข้อความและข้อมูลดิบจาก Resume PDF    │
│ • คิวสัมภาษณ์สด (Queue Tickets)         │       │ • ประวัติการวิเคราะห์ของ AI (Prompts)  │
│ • ผลการตัดสินใจ (Decisions & Matches)  │       │ • บันทึกสถิติและเหตุการณ์ (Event Logs) │
│ • การแต่งตัวละคร (Avatar Customization)│       │ • รายละเอียดบริษัทและแกลเลอรีผลงาน     │
└────────────────────────────────────────┘       └────────────────────────────────────────┘
```

1. **Supabase (PostgreSQL):** ใช้สำหรับข้อมูลที่ต้องการความถูกต้องแม่นยำสูง (ACID) และระบบเรียลไทม์ เช่น คิวสัมภาษณ์, การแย่งคิว, การส่งคำตอบ Private Decision และการเปิดเผยข้อมูล
2. **MongoDB Atlas:** ใช้สำหรับข้อมูลที่ไม่มีโครงสร้างตายตัว (Unstructured JSON) เช่น ข้อความที่สกัดได้จาก Resume, บันทึกการประมวลผลของ AI และบันทึกกิจกรรม

---

## 2.3 การทำงานของ Privacy Engines บนเบราว์เซอร์ (ไม่ต้องมี Server แพงๆ)

จุดเด่นของ MaskedMatch คือการทำให้ระบบความเป็นส่วนตัวทำงานบน **เครื่องของผู้ใช้ (Client-Side)** โดยตรง:
- **ครอบหน้ากากเรียลไทม์:** MediaPipe FaceMesh โหลดไฟล์โมเดลขนาดเล็ก (~3MB) มารันบน WebAssembly ของเครื่องผู้ใช้ เพื่อจับตำแหน่งหน้าและขยับหน้ากากสัตว์
- **ดัดเสียงเรียลไทม์:** Web Audio API ดัดคลื่นเสียงก่อนส่งเข้า LiveKit ทำให้เสียงที่ส่งออกไปถูกแปลงเรียบร้อยแล้วตั้งแต่ต้นทาง
- **ผลลัพธ์:** คุณไม่ต้องจ่ายค่า Server GPU สำหรับแปลงวิดีโอ/เสียง และไม่มีภาพหน้าจริงของผู้สมัครหลุดไปยังเซิร์ฟเวอร์
