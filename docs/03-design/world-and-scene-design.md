# 3. Neon Career Hall World & Scene Design

---

## 3.1 Spatial Concept: Indoor Neon Career Hall (Revision 2.1)

จากการปรับปรุงล่าสุด (Revision 2.1) ฉากหลักของ MaskedMatch ถูกเปลี่ยนจากแผนที่เมืองภายนอกอาคารเป็น **Grand Indoor Career Hall ขนาดใหญ่ (1536 × 1024 logical px)**:
- **Renderer:** ขับเคลื่อนด้วย Phaser 2D Canvas พร้อมกล้อง Smooth Camera-Follow ที่เคลื่อนตามตัวละครด้วย Easing แบบนุ่มนวล
- **Multi-Control:** รองรับการควบคุมผ่าน Keyboard (WASD / Arrow keys), Point-and-Click บน Desktop, และ Tap-to-Move บน Mobile
- **Visual Depth:** รองรับการจัดเรียงความลึก (Y-axis Depth Sorting) ทำให้ตัวละคร, NPCs, และ Scene Props บังซ้อนกันอย่างสมจริง

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             NEON CAREER HALL                                │
│                          (World Bounds 1536×1024)                           │
│                                                                             │
│  ┌──────────────────┐                     ┌──────────────────┐              │
│  │  Cyber Orchard   │                     │ Riverbyte Studio │              │
│  │   (Cloud / IoT)  │                     │   (Creative AI)  │              │
│  └─────────┬────────┘                     └─────────┬────────┘              │
│            │                                        │                       │
│            └───────────────┐        ┌───────────────┘                       │
│                            │        │                                       │
│                    ┌───────┴────────┴───────┐                               │
│                    │      CENTRAL HUB       │ ── [Quiet Lounge]             │
│                    │  Wayfinding & Info POI │                               │
│                    └───────┬────────┬───────┘                               │
│                            │        │                                       │
│            ┌───────────────┘        └───────────────┐                       │
│            │                                        │                       │
│  ┌─────────┴────────┐                     ┌─────────┴────────┐              │
│  │    Apex Cloud    │                     │ SolarPulse Energy│              │
│  │  (Infra / Sec)   │                     │  (Green Tech/Fin)│              │
│  └──────────────────┘                     └──────────────────┘              │
│                                                                             │
│  [Support / A11y Desk] ── [Device Test Pods] ── [Grand Arrival Lobby]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3.2 Key Zones & Landmarks

1. **Grand Arrival Lobby & Info Desk:** จุดเริ่มต้นของผู้สมัคร พร้อมบทเรียนสั้น (Tutorial), ทดสอบอุปกรณ์ (Device Check), และปุ่มลัดเข้าสู่ Navigator
2. **Central Hub & Wayfinding Aisle:** ลานกว้างใจกลางฮอลล์ แสดงตำแหน่งบูธ, ป้ายแนะนำงาน, และกระดานประกาศ
3. **Exhibitor Booths (4 บูธบริษัทสมมติ):** พื้นที่จัดแสดงพร้อม Dynamic Logo Plate, รายการงาน, จุดกดเข้าคิว และโต๊ะสัมภาษณ์
4. **Quiet & Accessibility Lounge:** โซนพักผ่อนที่มีความเคลื่อนไหวต่ำ (Low motion), ปราศจากเสียงรบกวน พร้อมจุดติดต่อเจ้าหน้าที่ล่ามภาษามือ/ช่วยเหลือ
5. **Support & Moderation Desk:** โต๊ะช่วยเหลือสำหรับแจ้งปัญหาการใช้งาน หรือขอความช่วยเหลือฉุกเฉิน
6. **Device-Test & Interview Pods:** บูธจำลองสำหรับซักซ้อมการเปิดไมค์/กล้อง และดูตัวอย่าง Animal Mask ก่อนเข้าห้องจริง

---

## 3.3 Original Exhibitor Booths

| บริษัทจำลอง | รหัสอ้างอิง | อุตสาหกรรม | ตำแหน่งงานหลัก | จุดเด่นของบูธ |
|---|---|---|---|---|
| **Cyber Orchard Co.** | `company-cyber-orchard` | IoT & Cloud Systems | Backend Developer | ธีมสีม่วง-เขียว, ป้าย IoT Telemetry |
| **Riverbyte Studio** | `company-riverbyte` | Creative Tech & Media | Frontend / UI Engineer | ธีมสีชมพู-ส้ม, จอแสดงผล Interactive Art |
| **Apex Cloud Tech** | `company-apex-cloud` | Cloud Infra & Security | DevOps / Cloud Architect | ธีมสีฟ้า Cyan, Server Racks & Holo-Globe |
| **SolarPulse Energy** | `company-solarpulse` | GreenTech & Smart Grid | Data / Firmware Engineer | ธีมสีเหลือง Mango, แผงโซลาร์จำลอง |

### Dynamic Logo Plate Architecture
แต่ละบูธมีเลเยอร์ป้ายชื่อ (Logo Plate / Sign Fixture) แยกต่างหากจากพื้นหลังแผนที่ ช่วยให้สามารถเปลี่ยนบริษัทหรือสลับตำแหน่งได้โดยไม่ต้องเรนเดอร์ภาพฉากใหม่ทั้งหมด

---

## 3.4 Interactive NPC Crowd & Scene Props

### NPC Crowd (≥12 Instances / 5 Role Silhouettes)

| บทบาท NPC | จำนวนในฉาก | ลักษณะภายนอก | พฤติกรรม & บทสนทนาสังเคราะห์ |
|---|:---:|---|---|
| **Candidates (Job Seekers)** | 6 | สวมหน้ากากสัตว์หลากหลายแบบ | เดินสำรวจรอบฮอลล์, แสดงข้อความพูดคุยเกี่ยวกับตำแหน่งงาน |
| **Recruiters / Hiring Team** | 4 | ชุดสูททำงานประจำโต๊ะบูธ | ยืนต้อนรับประจำบูธ, แนะนำข้อมูลบริษัทสังเคราะห์ |
| **Event Guides / Staff** | 2 | สวมเสื้อกั๊กสะท้อนแสง | ให้คำแนะนำทิศทางรอบฮอลล์ |
| **Accessibility Specialist** | 1 | ประจำ Quiet Zone | แนะนำการเปิดโหมด Contrast / Navigator |
| **Tech Support** | 1 | ประจำ Device Pods | แนะนำการทดสอบไมค์และกล้อง |

### Scene Props & Interactive Objects
- **ประดับตกแต่ง:** โต๊ะสัมภาษณ์, เก้าอี้ทำงาน, กระถางต้นไม้ประดับ, เสาไฟสไตล์นีออน, Coffee Kiosk, ฉากกั้นห้อง (Partition), พรมทางเดิน
- **Interactive Props:** ตู้ข้อมูล (Kiosk), ป้ายงานแนะนำ (Job Board), ประตูห้องสัมภาษณ์ (Interview Pod)
- **กฎความชัดเจน:** วัตถุตกแต่งต้องไม่ขวางเส้นทางเดินหลัก และไม่บดบังตำแหน่ง NPC หรือป้ายบูธ

---

## 3.5 Animation, Camera & Reduced Motion Contract

- **Smooth Camera Follow:** กล้องติดตามตำแหน่งผู้เล่นด้วยค่า Linear Interpolation (Lerp/Easing) ไม่กระตุก
- **Time-Delta Movement:** ความเร็วในการเดินคำนวณจาก `delta time` ทำให้ความเร็วสม่ำเสมอในทุกค่า Refresh Rate ของหน้าจอ
- **Ambient Visual Pulse:** ไฟนีออนตามบูธ, แสงสะท้อนของ Central Hub, และ Marker ลอยบอกตำแหน่ง
- **Reduced Motion Behavior:** เมื่อระบบตรวจพบ `prefers-reduced-motion: reduce`:
  - ปิด Parallax Scrolling, Particle Spawns, และ Camera Shake ทั้งหมด
  - หยุด Animation การลอย/กระพริบของ Marker โดยเปลี่ยนเป็นป้ายนิ่งที่มี Contrast ชัดเจน
  - เปลี่ยนการเคลื่อนที่ของกล้องเป็นแบบฉับพลัน (Instant Jump) เพื่อป้องกันอาการเวียนศีรษะ
