# 4. Risks, Assumptions, Dependencies & Decision Registry

---

## 4.1 Key Risk Matrix & Mitigations

| ความเสี่ยง (Risk) | ผลกระทบ | แนวทางป้องกันและแก้ไข (Mitigation Strategy) |
|---|---|---|
| **การกล่าวอ้างว่า "AI กำจัดอคติได้ 100%"** | สูญเสียความน่าเชื่อถือ / ข้อพิพาททางกฎหมาย | สื่อสารอย่างตรงไปตรงมาว่าช่วยลดอคติในด่านแรก และเปิดเผยข้อจำกัดของระบบ |
| **Redaction สกัด PII พลาดทำให้ตัวตนรั่วไหล** | ข้อมูลส่วนบุคคลรั่วไหล | มีระบบตรวจสอบหลายชั้น (Multi-layer scan) และให้ Candidate ตรวจทานก่อนเสมอ |
| **Face Mask หลุดจนเห็นใบหน้าจริง** | ละเมิดความเป็นส่วนตัวอย่างรุนแรง | ใช้หลักการ **Fail-Closed** หยุดส่งวิดีโอทันที และสลับเป็นโหมด Avatar-only |
| **Voice Transform ทำให้น้ำเสียงฟังไม่เข้าใจ** | คุณภาพการสัมภาษณ์ลดลง | แสดงหน้าจอทดสอบเสียงก่อนเข้าห้อง และมีโหมดเสียงธรรมดา/คำบรรยายสดทดแทน |
| **World Canvas หนักเกินไปบนมือถือ** | ผู้ใช้เกิดอาการแลค / ละทิ้งการใช้งาน | โหลด Asset แยกตามโซน, มี Full List Mode ให้ใช้แทน, และปิด Canvas ตอนสัมภาษณ์ |
| **เวลาคิวประเมินไม่ตรง / รอนานเกินไป** | ผู้สมัครออกจากคิวกลางคัน | แสดงเวลารอเป็นช่วง (Range), มีระบบ Heartbeat ตรวจสอบ Recruiter ตลอดเวลา |
| **ขาดแคลน Recruiter ในบางช่วงเวลา** | คิวสะสมเป็นจำนวนมาก | มีระบบแจ้งเตือนเจ้าหน้าที่ และ Organizer สามารถ Pause คิวชั่วคราวได้ |
| **Integrity Signals แจ้งเตือนผิดพลาด (False Alert)**| เกิดการเลือกปฏิบัติที่ไม่เป็นธรรม | ให้สัญญาณเป็นเพียง Advisory, ห้าม Auto-reject, และลบข้อมูลภายใน 7 วัน |
| **ความล่าช้าในการอนุมัติจาก DOPA (ThaID)** | เลื่อนกำหนดการเปิดตัว | พัฒนาระบบยืนยันตัวตนสำรอง (Email OTP) เพื่อให้ระบบทำงานต่อได้ |
| **การนำ Asset ที่ติดลิขสิทธิ์มาใช้งาน** | ความเสี่ยงด้านทรัพย์สินทางปัญญา | ใช้เฉพาะ Original Asset และบันทึก Asset Registry ทุกชิ้นอย่างเป็นทางการ |

---

## 4.2 Assumptions to Validate

1. ผู้สมัครยินดีให้ข้อมูลบริษัทและตำแหน่งงานเปิดเผย แต่ต้องการปิดบังตัวตนของตนเองก่อนการ Match
2. การจำกัดให้เข้าคิวได้ครั้งละ **1 คิว (1 Active Queue)** ช่วยลดความสับสนและลด No-show ได้ดีกว่าการเข้าหลายคิวพร้อมกัน
3. การสัมภาษณ์สั้นแบบ Speed Interview 10–15 นาที เพียงพอสำหรับการประเมินเบื้องต้นในด่านแรก
4. ผู้ใช้งานบนมือถือพึงพอใจกับการแตะเพื่อเดิน (Tap-to-move) มากกว่าการใช้ Virtual Joystick
5. การใช้ Avatar สัตว์ช่วยสร้างบรรยากาศที่เป็นมิตรและลดอคติเรื่องรูปลักษณ์ได้จริง

---

## 4.3 Key Dependencies

- การอนุมัติการเชื่อมต่อระบบ Digital ID (ThaID) จากกรมการปกครอง (DOPA)
- การตรวจสอบความสอดคล้องตามกฎหมาย PDPA จาก DPO และทีมที่ปรึกษากฎหมาย
- ผู้ให้บริการระบบ WebRTC SFU / TURN Infrastructure สำหรับการสื่อสารแบบ Real-time
- การผลิตงานภาพ Pixel Art และ Asset ที่ถูกต้องตามลิขสิทธิ์
- พันธมิตรผู้จัดงาน Job Fair และบริษัทนายจ้างที่เข้าร่วมโครงการ Pilot

---

## 4.4 EventPolicy Defaults (YAML Schema)

```yaml
# Proposed R2 EventPolicy Defaults
blind_mode: candidate_anonymous
hidden_profile_fields:
  - legal_name
  - email
  - phone_number
  - exact_school_name
  - exact_employer_name
  - exact_residential_address
active_queue_limit: 1
interview_duration_seconds: 720        # 12 minutes (including 1-minute wrap up)
timer_runs_during_reconnect: true
ready_check_seconds: 60
snooze_limit: 1
no_show_requeue_limit: 1
decision_window_seconds: 86400         # 24 hours
reveal_window_seconds: 86400           # 24 hours
recording_enabled: false
transcription_enabled: false
underage_participation: false
```

---

## 4.5 Decision Registry (Open Policy Decisions)

| รายการตัดสินใจ (Decision) | Proposed Default Value | ผู้รับผิดชอบ (Accountable Owner) | กำหนดสรุปผล |
|---|---|---|---|
| **Product / Data Controller** | Sponsor แต่งตั้ง Product Owner; Legal กำหนด Controller/Processor | Sponsor + Legal/DPO | R1 Architecture Sign-off |
| **Verification Fallback** | Email OTP + Organizer Invite; ThaID เปิดเมื่อ DOPA อนุมัติ | Security + Legal | ก่อนเริ่ม R2 Onboarding Build |
| **Blind Fields Policy** | ซ่อนสถาบัน/นายจ้างเดิม; คงระดับวุฒิ สาขา อุตสาหกรรม และผลงาน | Product + Legal | Design Freeze |
| **Masking Asymmetry** | Candidate Masked; Recruiter ระบุชื่อบริษัท/บทบาทได้ชัดเจน | Product + UX Research | Design Freeze |
| **Interview Duration** | 12 นาที รวม 1 นาที Wrap-up; นาฬิกาเดินต่อตอน Reconnect | Product + Event Operations | ก่อนเริ่ม Queue Build |
| **Queue Recovery Rules** | Ready Check 60s; Snooze 1 ครั้ง; Requeue 1 ครั้ง | Product + Event Operations | ก่อนเริ่ม Queue Build |
| **Decision / Reveal Window**| 24 ชม. สำหรับ Decision และ 24 ชม. สำหรับ Reveal Consent | Product + Legal | ก่อนเริ่ม Decision Build |
| **Salary Range Disclosure** | บังคับระบุ Salary Range หรือระบุชัดเจนว่า `NOT_DISCLOSED` | Product + Employer Partner | Content Freeze |
| **Recording / Transcript** | ปิดการบันทึกใน R2 (Off by default) | Legal + Accessibility Owner | ก่อนเริ่ม Media Build |
| **Voice Transform** | ไม่เป็น Blocker ใน R2; เลื่อนการทดลองไป R3 | Media Tech Lead | R3 Discovery |
| **Retention Purge Policy** | ใช้ตาม Section 16.3 พร้อม Purge Backup ภายใน ≤35 วัน | Legal / DPO | ก่อนรับข้อมูล PII จริง |
