# 5. ตัวแปร Environment (.env) และที่อยู่ API Keys ที่ต้องนำมาใส่

---

## 5.1 ตัวอย่างไฟล์ `.env.local` / `.env.production` (คัดลอกไปใช้ได้ทันที)

สร้างไฟล์ชื่อ `.env.local` ใน Root Folder ของโปรเจกต์ หรือใส่ในเมนู **Environment Variables** บน Vercel:

```bash
# ========================================================
# 1. ฐานข้อมูล & เรียลไทม์ SUPABASE
# ========================================================
# ดูที่: Supabase Dashboard -> Project Settings -> API
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi... (anon public key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (service_role secret key)

# ========================================================
# 2. ฐานข้อมูลเอกสาร MONGODB ATLAS
# ========================================================
# ดูที่: MongoDB Atlas -> Clusters -> Connect -> Drivers
MONGODB_URI=mongodb+srv://db_user:password123@cluster0.abcde.mongodb.net/maskedmatch?retryWrites=true&w=majority

# ========================================================
# 3. ปัญญาประดิษฐ์ AI (เลือกใช้ตัวใดตัวหนึ่งหรือใส่ทั้งคู่)
# ========================================================
# ดูที่: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# หรือใช้ Google Gemini (ฟรีเริ่มต้น): https://aistudio.google.com/
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# หรือใช้ Anthropic Claude: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxx

# ========================================================
# 4. วิดีโอคอลล์ห้องสัมภาษณ์ LIVEKIT CLOUD
# ========================================================
# ดูที่: LiveKit Cloud Dashboard -> Settings -> Project Keys
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxx
LIVEKIT_API_SECRET=secretxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ========================================================
# 5. ตั้งค่าแอปพลิเคชันทั่วไป
# ========================================================
VITE_APP_TITLE=MaskedMatch Virtual Job Fair
NODE_ENV=production
```

---

## 5.2 ตารางบอกตำแหน่งที่ต้องไปเอา API Keys มาใส่ (ชัดเจน 100%)

| ตัวแปรใน `.env` | บริการ | วิธีเข้าไปเอา Key ใน Dashboard (ทีละสเต็ป) |
|---|---|---|
| `VITE_SUPABASE_URL` | **Supabase** | เข้า [supabase.com](https://supabase.com) → เลือกโปรเจกต์ → ไปที่เมนูฟันเฟือง **Project Settings** (ซ้ายล่าง) → เลือก **API** → คัดลอกค่า **Project URL** |
| `VITE_SUPABASE_ANON_KEY` | **Supabase** | อยู่ในหน้าเดียวกับด้านบน (Project Settings → API) → ดูที่หัวข้อ **Project API keys** → คัดลอกค่า **`anon public`** |
| `SUPABASE_SERVICE_ROLE_KEY` | **Supabase** | อยู่ในหน้าเดียวกับด้านบน (Project Settings → API) → ดูที่หัวข้อ **Project API keys** → กดเปิดตาและคัดลอกค่า **`service_role secret`** *(ใช้เฉพาะฝั่ง Backend)* |
| `MONGODB_URI` | **MongoDB Atlas** | เข้า [mongodb.com/atlas](https://www.mongodb.com/atlas) → กดปุ่ม **Connect** ที่ Cluster → เลือก **Drivers** → คัดลอก Connection String แล้วเปลี่ยน `<password>` เป็นรหัสผ่านของคุณ |
| `OPENAI_API_KEY` | **OpenAI** | เข้า [platform.openai.com/api-keys](https://platform.openai.com/api-keys) → กด **Create new secret key** → ตั้งชื่อแล้วกดสร้าง → คัดลอก `sk-proj-...` |
| `GEMINI_API_KEY` | **Google Gemini** | เข้า [aistudio.google.com](https://aistudio.google.com/) → กดปุ่ม **Get API key** → กด **Create API key** → คัดลอก `AIzaSy...` |
| `LIVEKIT_URL` | **LiveKit Cloud** | เข้า [cloud.livekit.io](https://cloud.livekit.io) → เลือกโปรเจกต์ → ดูที่ **Project Settings** → คัดลอก **WebSocket URL** (ขึ้นต้นด้วย `wss://...`) |
| `LIVEKIT_API_KEY` | **LiveKit Cloud** | ใน LiveKit Dashboard → ไปที่ **Settings** → **Keys** → กดสร้างหรือคัดลอก **API Key** |
| `LIVEKIT_API_SECRET` | **LiveKit Cloud** | อยู่ที่เดียวกับ API Key ด้านบน → คัดลอก **Secret Key** |

---

## 5.3 วิธีใส่ Environment Variables บน Vercel ตอนจะปล่อยเว็บจริง

1. ไปที่ Dashboard ของโปรเจกต์บน [vercel.com](https://vercel.com)
2. กดไปที่แท็บ **Settings** ด้านบน → เลือกเมนู **Environment Variables** ทางซ้าย
3. พิมพ์ชื่อตัวแปรในช่อง **Key** (เช่น `OPENAI_API_KEY`) และวางค่าลงในช่อง **Value**
4. ติ๊กถูกเลือกทั้ง **Production**, **Preview**, และ **Development**
5. กดปุ่ม **Save**
6. ไปที่แท็บ **Deployments** → กดจุดสามจุด (`...`) ที่การ Deploy ล่าสุด → เลือก **Redeploy** เพื่อให้ระบบดึงค่า Environment Variables ใหม่ไปใช้งานทันที!
