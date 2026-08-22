# 1. คู่มือการ Deploy สู่ Production ฉบับเข้าใจง่าย (Vercel + Supabase + MongoDB)

> **แนวคิดหลัก:** ใช้บริการ Cloud และ Serverless สมัยใหม่ที่ติดตั้งง่าย ไม่ต้องดูแล Server เอง (Zero DevOps Overhead) ประหยัดค่าใช้จ่าย และพร้อมเปิดให้ใช้งานจริงได้ทันที

---

## 1.1 ภาพรวมสถาปัตยกรรมที่ใช้งานง่าย (Simple & Modern Stack)

```mermaid
flowchart TB
    USER["ผู้ใช้งาน (Browser / Mobile)"] --> VERCEL["Vercel Edge Hosting\n(React SPA + Phaser 3 + Serverless Functions)"]
    
    VERCEL -->|"Auth, DB, Realtime, Storage"| SUPABASE["Supabase (All-in-One Backend)\n• PostgreSQL (User, Queue, Decision)\n• Supabase Auth (Sign-in / Session)\n• Supabase Realtime (Presence & คิวสด)\n• Supabase Storage (ไฟล์ Resume)"]
    
    VERCEL -->|"Resume Facts & Logs"| MONGO["MongoDB Atlas\n(เก็บบันทึกข้อมูล Resume ดิบ & Event Logs)"]
    
    VERCEL -->|"AI สกัดทักษะ & Match Score"| OPENAI["OpenAI / Anthropic / Gemini API"]
    
    USER <-->|"WebRTC 1:1 Video/Audio"| LIVEKIT["LiveKit Cloud\n(บริการห้องสัมภาษณ์วิดีโอฟรี/สำเร็จรูป)"]
```

---

## 1.2 บริการที่ต้องเตรียม (Checklist 5 บริการ)

| บริการ | หน้าที่หลัก | ราคา / Free Tier | สมัครที่เว็บไซต์ |
|---|---|---|---|
| **1. Vercel** | โฮสต์เว็บ Frontend + Serverless API | **ฟรี** (Hobby) | [vercel.com](https://vercel.com) |
| **2. Supabase** | ฐานข้อมูลหลัก (PostgreSQL), Auth, คิวแบบ Realtime | **ฟรี** (Free tier 2 โปรเจกต์) | [supabase.com](https://supabase.com) |
| **3. MongoDB Atlas** | เก็บเอกสาร Resume ที่แยกโครงสร้างและ Log | **ฟรี** (Shared Cluster M0 512MB) | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| **4. OpenAI / Anthropic / Gemini** | AI ช่วยสกัดทักษะและคำนวณ Match Score | จ่ายตามใช้จริง (~$1–$5 ต่อเดือน) | [platform.openai.com](https://platform.openai.com) หรือ [console.anthropic.com](https://console.anthropic.com) |
| **5. LiveKit Cloud** | ระบบห้องสัมภาษณ์ WebRTC วิดีโอ/เสียง | **ฟรี** (50GB แบนด์วิดท์ต่อเดือน) | [livekit.io](https://livekit.io) |

---

## 1.3 ขั้นตอนการ Deploy ทีละสเต็ป (Step-by-Step)

### สเต็ปที่ 1: ตั้งค่าฐานข้อมูลบน Supabase
1. เข้าไปที่ [supabase.com](https://supabase.com) แล้วกด **New Project**
2. ตั้งชื่อโปรเจกต์ เช่น `maskedmatch-prod` และตั้งรหัสผ่าน Database
3. ไปที่เมนู **SQL Editor** แล้ววางโค้ดสร้างตาราง (Schema) ที่เตรียมไว้ (ดูใน Section 1.4)
4. ไปที่เมนู **Storage** → กดสร้าง Bucket ชื่อ `resumes` (ตั้งเป็น Private)
5. ไปที่เมนู **Project Settings** → **API** แล้วคัดลอกค่า:
   - `Project URL` (เช่น `https://xyzcompany.supabase.co`)
   - `anon public` API Key
   - `service_role` Secret Key

### สเต็ปที่ 2: ตั้งค่าฐานข้อมูล MongoDB Atlas
1. เข้าไปที่ [mongodb.com/atlas](https://www.mongodb.com/atlas) แล้วสร้าง Free Cluster (M0)
2. สร้าง Database User (Username / Password)
3. ไปที่เมนู **Network Access** → กด **Add IP Address** → เลือก `Allow Access from Anywhere` (`0.0.0.0/0`)
4. กดปุ่ม **Connect** → เลือก **Drivers** แล้วคัดลอก Connection String (เช่น `mongodb+srv://user:pass@cluster0.xyz.mongodb.net/maskedmatch?retryWrites=true&w=majority`)

### สเต็ปที่ 3: ขอ API Key สำหรับ AI (OpenAI หรือ Anthropic)
1. ไปที่ [platform.openai.com](https://platform.openai.com/api-keys)
2. กดปุ่ม **Create new secret key** แล้วคัดลอก `sk-proj-...`
3. (หรือใช้ Gemini API จาก [Google AI Studio](https://aistudio.google.com/) แบบฟรี)

### สเต็ปที่ 4: ขอ API Key จาก LiveKit Cloud (สำหรับ WebRTC)
1. เข้าไปที่ [livekit.io](https://livekit.io) แล้วกด **Create Project**
2. ไปที่ **Settings** → **Keys** แล้วคัดลอก:
   - `WebSocket URL` (เช่น `wss://myproject.livekit.cloud`)
   - `API Key`
   - `API Secret`

### สเต็ปที่ 5: Deploy ขึ้น Vercel ในคลิกเดียว
1. นำโค้ดโปรเจกต์ขึ้น **GitHub Repository**
2. เข้าไปที่ [vercel.com](https://vercel.com) แล้วกด **Add New...** → **Project**
3. เลือก Repository ของ MaskedMatch
4. ในหน้าต่าง **Environment Variables** ให้ใส่ค่า API Key ทั้งหมดที่คัดลอกมาจากสเต็ป 1–4
5. กดปุ่ม **Deploy** ระบบจะ Build และเปิดเว็บให้ใช้งานได้ภายใน 1–2 นาที!

---

## 1.4 โค้ด SQL สำหรับรันใน Supabase SQL Editor

คัดลอกโค้ดนี้ไปวางใน **Supabase SQL Editor** เพื่อสร้างตารางที่จำเป็น:

```sql
-- 1. ตารางเก็บโปรไฟล์ผู้สมัคร (ไม่เปิดเผยตัวตน)
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_code TEXT UNIQUE NOT NULL, -- เช่น "Candidate #8F3A"
  skills JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  avatar_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ตารางเก็บคิวสัมภาษณ์ (Real-time Queue)
CREATE TABLE IF NOT EXISTS queue_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id TEXT NOT NULL,
  company_id TEXT NOT NULL,
  candidate_id UUID REFERENCES candidate_profiles(id),
  candidate_code TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'QUEUED', -- QUEUED, READY_CHECK, IN_SESSION, COMPLETED, EXPIRED
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  dispatched_at TIMESTAMPTZ,
  version INT DEFAULT 1
);

-- 3. ตารางเก็บผลการตัดสินใจส่วนตัว (Double-Blind Decisions)
CREATE TABLE IF NOT EXISTS decision_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  candidate_decision TEXT, -- INTERESTED หรือ PASS (เก็บเป็นความลับ)
  recruiter_decision TEXT,
  state TEXT NOT NULL DEFAULT 'AWAITING_DECISIONS', -- AWAITING_DECISIONS, MUTUAL_MATCH, NO_MATCH
  revealed_fields JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ตารางสำหรับ Admin ควบคุมงานและส่งข้อความประกาศสด
CREATE TABLE IF NOT EXISTS event_controls (
  id TEXT PRIMARY KEY DEFAULT 'main-event',
  is_paused BOOLEAN DEFAULT false,
  pause_reason TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. เปิด Realtime สำหรับตารางคิว, ข้อความประกาศ และสถานะงาน
ALTER PUBLICATION supabase_realtime ADD TABLE queue_tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE decision_cases;
ALTER PUBLICATION supabase_realtime ADD TABLE event_controls;
ALTER PUBLICATION supabase_realtime ADD TABLE admin_broadcasts;
```
