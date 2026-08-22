# 3. คู่มือเชื่อมต่อ API, AI และระบบมัลติมีเดียแบบเข้าใจง่าย

---

## 3.1 การเชื่อมต่อ AI สำหรับวิเคราะห์ Resume & แนะนำงาน

สร้าง Serverless Function บน Vercel เช่น `api/ai/match.ts` หรือ `api/ai/parse-resume.ts` เพื่อเรียกใช้ AI:

### ตัวเลือกที่ 1: ใช้ OpenAI (GPT-4o-mini / GPT-4o)

```typescript
// api/ai/match.ts (Vercel Serverless Function)
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini', // แนะนำตัวนี้: เร็วมากและราคาถูกมาก
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `คุณคือ SkillMatch AI จงเปรียบเทียบทักษะของผู้สมัครกับตำแหน่งงาน
ส่งผลลัพธ์เป็น JSON ในรูปแบบ:
{
  "match_score": 92,
  "match_reasons": ["ทักษะ Node.js ตรงกับความต้องการหลัก", "มีประสบการณ์ระบบ Queue และ Redis"],
  "uncertainties": ["ยังไม่มีหลักฐานเรื่อง Cloud Architecture"]
}`
      },
      {
        role: 'user',
        content: `เรซูเม่ผู้สมัคร: ${resumeText}\n\nรายละเอียดงาน: ${jobDescription}`
      }
    ]
  });

  return new Response(response.choices[0].message.content, {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### ตัวเลือกที่ 2: ใช้ Google Gemini (Gemini 1.5 Flash - ฟรีโควตาเริ่มต้น)

```typescript
// api/ai/gemini-match.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { resumeText, jobDescription } = await request.json();
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `เปรียบเทียบทักษะและคำนวณคะแนนความตรงกัน 0-100 พร้อมเหตุผล 3 ข้อ (ตอบเป็น JSON): \nเรซูเม่: ${resumeText}\nงาน: ${jobDescription}`;
  const result = await model.generateContent(prompt);
  
  return new Response(result.response.text(), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

---

## 3.2 การเชื่อมต่อ Supabase & MongoDB ในโค้ด

### 1. เชื่อมต่อ Supabase Client & Authentication (`src/data/supabaseClient.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 1.1 ล็อกอินสำหรับผู้สมัครงาน (Jobseeker Sign-in)
export async function signInJobseeker(email: string, password?: string) {
  if (password) {
    return await supabase.auth.signInWithPassword({ email, password });
  }
  // หรือใช้ Magic Link ส่ง OTP ทางอีเมล
  return await supabase.auth.signInWithOtp({ email });
}

// 1.2 ล็อกอินสำหรับผู้สรรหา (Recruiter Sign-in)
export async function signInRecruiter(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

// 1.3 ฟังก์ชันฟังการอัปเดตคิวแบบเรียลไทม์ (Real-time Queue Listener)
export function subscribeToQueue(ticketId: string, onUpdate: (ticket: any) => void) {
  return supabase
    .channel(`queue:${ticketId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'queue_tickets', filter: `id=eq.${ticketId}` },
      (payload) => onUpdate(payload.new)
    )
    .subscribe();
}

// 1.4 Recruiter Action: สลับความพร้อมและเรียกคิวคนถัดไป
export async function claimNextCandidateFromQueue(jobId: string, companyId: string) {
  const { data, error } = await supabase
    .from('queue_tickets')
    .update({ state: 'READY_CHECK', dispatched_at: new Date().toISOString() })
    .match({ job_id: jobId, state: 'QUEUED' })
    .order('joined_at', { ascending: true })
    .limit(1)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 2. เชื่อมต่อ MongoDB ใน Backend Serverless (`api/mongo.ts`)

```typescript
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
let client: MongoClient;

export async function getMongoDb() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
  }
  return client.db('maskedmatch');
}
```

---

## 3.3 การเชื่อมต่อห้องสัมภาษณ์ LiveKit WebRTC

### 1. ฟังก์ชันสร้าง Room Token ใน Backend (`api/livekit/token.ts`)

```typescript
import { AccessToken } from 'livekit-server-sdk';

export async function POST(request: Request) {
  const { roomName, candidateCode } = await request.json();

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    { identity: candidateCode, name: candidateCode, ttl: '30m' }
  );

  at.addGrant({ roomJoin: true, room: roomName, canPublish: true, canSubscribe: true });
  const token = await at.toJwt();

  return new Response(JSON.stringify({ token }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
```

### 2. เชื่อมต่อในหน้าสัมภาษณ์บนเว็บ Frontend

```typescript
import { Room } from 'livekit-client';

export async function connectToInterview(wsUrl: string, token: string) {
  const room = new Room({
    adaptiveStream: true,
    dynacast: true,
  });

  await room.connect(wsUrl, token);
  return room;
}
```

---

## 3.4 การเปิดกล้องจริงและครอบหน้ากากอวตาร (MediaPipe FaceMesh)

ระบบโหลดไลบรารี MediaPipe มารันบนเครื่องผู้ใช้ได้ฟรี:

```typescript
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

export function setupFaceMaskTracker(
  videoElement: HTMLVideoElement,
  canvasElement: HTMLCanvasElement,
  onLandmarks: (landmarks: any) => void
) {
  const faceMesh = new FaceMesh({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
  });

  faceMesh.setOptions({
    maxNumFaces: 1,
    refineLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  faceMesh.onResults((results) => {
    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      onLandmarks(results.multiFaceLandmarks[0]);
    }
  });

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });

  camera.start();
}
```
