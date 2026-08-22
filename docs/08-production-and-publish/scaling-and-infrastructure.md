# 4. คู่มือการสเกลระบบ (Scaling) เมื่องานมีผู้ใช้งานจำนวนมาก

> **แนวคิด:** บริการอย่าง Vercel, Supabase, และ MongoDB ได้รับการออกแบบให้รองรับการขยายตัว (Auto-scaling) อยู่แล้ว เมื่อคนเข้ามาใช้งานพร้อมกันหลักพันหรือหลักหมื่น คุณเพียงแค่เลือกปรับตั้งค่าบางจุดตามคำแนะนำนี้

---

## 4.1 แผนการสเกลตามจำนวนผู้ใช้งาน (Scaling Milestones)

| จำนวนผู้ใช้งานพร้อมกัน (CCU) | Vercel Tier | Supabase Plan | MongoDB Tier | LiveKit SFU Plan |
|---|---|---|---|---|
| **ทดสอบ / Demo (1–100 คน)** | **Hobby (ฟรี)** | **Free Tier (ฟรี)** | **Shared M0 (ฟรี)** | **Community Cloud (ฟรี)** |
| **งานแฟร์ขนาดเล็ก (100–1,000 คน)** | Pro ($20/เดือน) | Pro ($25/เดือน) | Shared M2/M5 (~$10/เดือน) | Cloud Boost (จ่ายตามนาทีใช้งาน) |
| **งานแฟร์ระดับประเทศ (10,000+ คน)** | Pro / Enterprise | Pro + Compute Add-on (4–8 Core) | Dedicated M10+ | LiveKit Cloud Dedicated Egress |

---

## 4.2 วิธีทำให้ Phaser และ Supabase รองรับคนเดินพร้อมกัน 10,000 คน

1. **ลดภาระ Realtime ด้วยการจำกัดโซน (Spatial Grid):**
   - ในแผนที่ฮอลล์งานแฟร์ ไม่จำเป็นต้องส่งตำแหน่งของทุกคนให้ทุกคนเห็น
   - ใช้ **Supabase Realtime Broadcast Channel** แยกตามโซนย่อย (เช่น `room:zone_a1`, `room:zone_central`) ทำให้ผู้เล่นส่งและรับเฉพาะตำแหน่งคนที่อยู่ใกล้เคียงเท่านั้น

2. **ระบบคิวที่ไม่มีวันพัง (Atomic Queue Locks):**
   - เมื่อผู้สมัครกดเข้าคิวพร้อมกันหลายร้อยคน ให้ใช้ SQL Function บน Supabase ทำการเพิ่มคิวแบบ Atomic Transaction ป้องกันปัญหาคิวชนกัน

3. **ใช้ On-Device Privacy เสมอ:**
   - การประมวลผล Face Mask (MediaPipe) และ Voice DSP (Web Audio API) ทำงานบนเครื่องผู้ใช้ 100% ทำให้ **เซิร์ฟเวอร์ของคุณไม่ต้องรับภาระแปลงภาพหรือเสียงเลยแม้แต่เปอร์เซ็นต์เดียว** ไม่ว่าจะมีผู้ใช้ 10 คนหรือ 10,000 คน

---

## 4.3 Checklist ตรวจสอบความพร้อมก่อนเปิดงาน (Pre-Launch Checklist)

- [ ] เชื่อมต่อ Supabase URL และ Anon Key ครบถ้วน
- [ ] รันคำสั่ง SQL สร้างตาราง `candidate_profiles`, `queue_tickets`, `decision_cases` ใน Supabase เรียบร้อย
- [ ] ใส่ API Key ของ OpenAI / Gemini บน Vercel เรียบร้อย
- [ ] ใส่ LiveKit URL และ Secret Key สำหรับห้องสัมภาษณ์ WebRTC เรียบร้อย
- [ ] ทดสอบสร้างตัวละคร 8-bit และกดปุ่มสุ่มสไตล์ (Randomize) ทำงานถูกต้อง
- [ ] ทดสอบเปิดกล้องในหน้า Preflight พบว่า Face Mask ขยับตามใบหน้าจริง และตัดภาพเมื่อหันหน้าหนี (Fail-Closed)
- [ ] ทดสอบส่ง Private Decision แยก 2 จอ (ผู้สมัคร และ ผู้สัมภาษณ์) และเกิด Mutual Match เมื่อกดตรงกัน
