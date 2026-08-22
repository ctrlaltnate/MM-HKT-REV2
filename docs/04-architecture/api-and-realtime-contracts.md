# 4. API, WebSocket & Realtime Protocols

---

## 4.1 REST-Style API Inventory

| Method | Endpoint Path | Actor / Required Scope | Success | Purpose & Description |
|---|---|---|:---:|---|
| `POST` | `/v1/auth/thaid/start` | Candidate / `identity:start` | 201 | เริ่มต้นขั้นตอนยืนยันตัวตนผ่าน ThaID |
| `GET` | `/v1/consent-policies/:purpose` | Auth User / own context | 200 | อ่านนโยบายความยินยอมและเวอร์ชันปัจจุบัน |
| `PUT` | `/v1/consents/:purpose` | Data Owner / `consent:own` | 200 | บันทึกการให้หรือถอนความยินยอม |
| `POST` | `/v1/resumes` | Candidate / `profile:own` | 201 | ขอ Signed URL สำหรับอัปโหลด Resume |
| `POST` | `/v1/resumes/:id/process` | Candidate / `profile:own` | 202 | เริ่มกระบวนการ Scan, Parse, Redact |
| `GET` | `/v1/resumes/:id/processing-status`| Candidate / `profile:own` | 200 | ตรวจสอบสถานะการประมวลผล Resume |
| `GET` | `/v1/profiles/me/masked-preview` | Candidate / `profile:own` | 200 | ดึงข้อมูล Masked Profile เพื่อตรวจสอบ |
| `PATCH`| `/v1/profiles/me/extracted-fields/:id`| Candidate / `profile:own` | 200 | แก้ไขข้อมูลทักษะ/ผลงานที่สกัดผิดพลาด |
| `PUT` | `/v1/profiles/me/approval` | Candidate / `profile:own` | 200 | อนุมัติ Masked Profile เพื่อเริ่มใช้งาน |
| `GET` | `/v1/events/:id/jobs` | Participant / `event:read` | 200 | ค้นหาและกรองตำแหน่งงานในงานแฟร์ |
| `POST` | `/v1/company/jobs` | Company Admin / `job:write` | 201 | สร้างตำแหน่งงานใหม่ |
| `GET` | `/v1/jobs/:id/recommendation` | Candidate / `match:own` | 200 | ดึงคะแนน Match Score และเหตุผล 3–5 ข้อ |
| `POST` | `/v1/jobs/:id/queue-tickets` | Candidate / `queue:own` | 201 | เข้าคิวสัมภาษณ์ (1 Active Queue) |
| `GET` | `/v1/queue-tickets/active` | Candidate / `queue:own` | 200/204 | ดึงสถานะคิวปัจจุบัน (Polling Fallback) |
| `DELETE`| `/v1/queue-tickets/:id` | Candidate / `queue:own` | 204 | ออกจากคิว / สละสิทธิ์ |
| `POST` | `/v1/queue-tickets/:id/ready-response`| Candidate / `queue:own`| 200 | ตอบรับ Ready Check (`ACCEPT`, `SNOOZE`) |
| `POST` | `/v1/queue-tickets/:id/requeue` | Candidate / `queue:own` | 200 | ขอเข้าคิวใหม่เมื่อพ้นสถานะ Expired |
| `PUT` | `/v1/recruiter/availability` | Recruiter / `queue:staff` | 200 | ตั้งสถานะความพร้อมรับคิวของผู้สัมภาษณ์ |
| `POST` | `/v1/recruiter/queues/:id/claim-next`| Recruiter / `queue:staff` | 200/204 | เรียกผู้สมัครคนถัดไปเข้าสัมภาษณ์ |
| `GET` | `/v1/interviews/:id/preflight-policy`| Participant / `interview:join`| 200 | ดึงข้อกำหนดอุปกรณ์และโหมดทดแทน |
| `POST` | `/v1/interviews/:id/token` | Participant / `interview:join`| 201 | ขอ Short-lived Media/WebRTC Token |
| `POST` | `/v1/interviews/:id/state-intents` | Participant / `interview:join`| 202 | ส่ง Intent แจ้งสถานะ (Ready/Leave/Report)|
| `GET` | `/v1/interviews/:id` | Participant / `interview:read`| 200 | Snapshot สถานะห้องสัมภาษณ์ปัจจุบัน |
| `POST` | `/v1/decision-cases/:id/decisions` | Participant / `decision:own` | 201 | ส่งผลการตัดสินใจส่วนตัวแบบเข้ารหัส |
| `GET` | `/v1/decision-cases/:id/result` | Participant / `decision:own` | 200/202| ดึงผลการตัดสินใจ (Mutual Match/No Match) |
| `PUT` | `/v1/matches/:id/reveal-grants` | Data Owner / `reveal:own` | 200 | บันทึกความยินยอมเปิดเผยข้อมูลรายฟิลด์ |
| `GET` | `/v1/matches/:id/revealed-profile` | Matched Recipient / `reveal:read`| 200 | อ่านข้อมูลเฉพาะฟิลด์ที่ได้รับการยินยอม |
| `POST` | `/v1/reports` | Auth User / `report:create` | 201 | แจ้งรายงานปัญหาความปลอดภัย/การคุกคาม |
| `POST` | `/v1/data-subject-requests` | Data Owner / `dsar:own` | 202 | ส่งคำขอลบ/ส่งออกข้อมูลตามสิทธิ์ PDPA |
| `POST` | `/v1/ops/events/:id/transitions` | Organizer / `event:operate` | 200 | สั่ง Start, Pause, Resume, End Event |

---

## 4.2 Standard Request & Response Envelopes

### Mutating Headers
- `Idempotency-Key: "<uuid>"` — ป้องกันการสร้างข้อมูลซ้ำซ้อน
- `If-Match: "<entity_version>"` — ป้องกันปัญหา Concurrency Collision (Optimistic Locking)

### Success Envelope

```json
{
  "data": {
    "ticket_id": "qt_01H9A8B7C",
    "position": 3,
    "estimated_wait_seconds": 480,
    "state": "QUEUED"
  },
  "meta": {
    "request_id": "req_01H9A8B7XYZ",
    "entity_version": 4,
    "timestamp": "2026-08-21T06:30:00Z"
  }
}
```

### Error Envelope

```json
{
  "error": {
    "code": "VERSION_CONFLICT",
    "message_key": "errors.version_conflict",
    "request_id": "req_01H9A8B7XYZ",
    "retryable": true,
    "details": [
      {
        "field": "entity_version",
        "issue": "Version 3 is outdated. Current version is 4."
      }
    ]
  }
}
```

---

## 4.3 Error Codes & Client Handling

| Error Code | Meaning | Client Behavior & User Guidance |
|---|---|---|
| `AUTH_REAUTH_REQUIRED` | Session หมดอายุ | นำกลับหน้า Sign-in และ Redirect กลับ Route เดิม |
| `CONSENT_REQUIRED` | ยังไม่ได้ให้ความยินยอม | เปิด Dialog ขอความยินยอมตามวัตถุประสงค์ที่ขาด |
| `PROFILE_NOT_APPROVED` | ยังไม่อนุมัติ Masked Profile | นำทางไปยังหน้า Profile Review & Approval |
| `QUEUE_ALREADY_ACTIVE` | มีคิวสัมภาษณ์ที่รออยู่แล้ว | เปิดการ์ด Active Queue Ticket ให้ผู้ใช้ |
| `QUEUE_CLOSED` | คิวปิดรับชั่วคราว | แสดงข้อความแจ้งเตือนและแนะนำตำแหน่งงานอื่น |
| `READY_CHECK_EXPIRED` | หมดเวลาตอบรับคิว | ปิด Alert Dialog และเสนอทางเลือก Requeue |
| `INTERVIEW_NOT_READY` | ยังไม่ผ่าน Preflight Check | นำทางไปยังหน้า Preflight Device Check |
| `MEDIA_CAPABILITY_UNAVAILABLE`| อุปกรณ์ไม่รองรับกล้อง/ไมค์ | สลับเข้าสู่โหมดทดแทน (Avatar-only / Text) |
| `MATCH_NOT_MUTUAL` | ไม่เกิด Mutual Match | ไม่อนุญาตให้เข้าถึงฟิลด์ข้อมูลติดต่อ |
| `REVEAL_NOT_GRANTED` | ผู้สมัครยังไม่ได้อนุญาตฟิลด์นี้ | แสดงเฉพาะข้อมูลที่ได้รับอนุญาตแล้ว |
| `EVENT_PAUSED` | งานถูกระงับชั่วคราว | แสดงป้ายประกาศจาก Organizer |
| `RATE_LIMITED` | ส่งคำขอถี่เกินกำหนด | แสดงเวลานับถอยหลังก่อนลองใหม่ (Retry-After) |
| `VERSION_CONFLICT` | ข้อมูลถูกแก้ไขพร้อมกัน | Refetch สถานะล่าสุดและให้ผู้ใช้ยืนยันใหม่ |

---

## 4.4 WebSocket Events & Realtime Protocol

| Event Name | Direction | Payload Content |
|---|:---:|---|
| `world.presence.snapshot` | S → C | รายชื่อผู้ใช้แบบ Pseudonymous ในโซนปัจจุบัน |
| `world.movement.intent` | C → S | ทิศทาง/พิกัดที่ผู้ใช้ต้องการเดินไป (Untrusted Input) |
| `world.presence.delta` | S → C | พิกัดที่ Server ตัดสินแล้ว (Authoritative Position Delta) |
| `queue.ticket.snapshot` | S → C | ข้อมูล Ticket เต็มรูปแบบหลังเชื่อมต่อ Socket |
| `queue.ticket.updated` | S → C | สถานะคิว, ลำดับ, เวลาประมาณการ, Entity Version |
| `queue.ready_check` | S → C | แจ้งเตือนถึงคิวสัมภาษณ์และเวลานับถอยหลัง (60s) |
| `interview.state_changed` | S → C | การเปลี่ยนสถานะห้องสัมภาษณ์, เวลา Grace Period |
| `event.state_changed` | S → C | สถานะงานเปลี่ยนเป็น Live, Paused, หรือ Ended |
| `notification.created` | S → C | ข้อความแจ้งเตือนสำคัญที่ผ่านการตัด PII แล้ว |

### WebSocket Message Example (`queue.ready_check`)

```json
{
  "message_id": "msg_01H9A8B7XYZ",
  "career_event_id": "evt_neon_career_city_01",
  "type": "queue.ready_check",
  "stream": "queue:qt_01H9A8B7C",
  "stream_sequence": 42,
  "entity_id": "qt_01H9A8B7C",
  "entity_version": 7,
  "occurred_at": "2026-08-21T06:30:00Z",
  "data": {
    "job_label": "Backend Developer",
    "company_label": "Cyber Orchard Co.",
    "respond_by": "2026-08-21T06:31:00Z",
    "actions": ["ACCEPT", "SNOOZE_ONCE", "DECLINE"]
  }
}
```

### Realtime Reconnection & Deduplication Contract
1. **Audience-Scoped Token:** เชื่อมต่อ WebSocket ด้วย Short-lived Token ที่ผูกกับ Tenant และ Event
2. **Sequence & Deduplication:** Client ส่ง `resume_from_sequence` เมื่อ Reconnect และกำจัดข้อความซ้ำด้วย `message_id`
3. **Snapshot Fallback:** หาก Cursor เก่าเกินไป Server จะส่ง `snapshot_required` เพื่อให้ Client ดึง Snapshot ใหม่ผ่าน REST API
