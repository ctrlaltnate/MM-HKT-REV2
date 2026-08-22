# 3. Domain Model, Data Classification & Retention

---

## 3.1 Core Domain Entities

| Entity Name | Important Fields | Data Classification | Primary Source of Truth |
|---|---|---|---|
| **`User`** | `id`, `status`, `locale`, `created_at` | Internal | Auth DB |
| **`OrganizationMembership`** | `user_id`, `tenant_id`, `role`, `status`, `version` | Internal | Auth / Admin DB |
| **`EventRole`** | `user_id`, `career_event_id`, `role`, `scope`, `expires_at` | Internal | Auth / Admin DB |
| **`IdentityClaim`** | `user_id`, `provider_sub`, `assurance_level`, `verified_at` | **Restricted PII** | **Identity Vault** |
| **`CandidateProfile`** | `profile_id`, `user_ref`, `skills`, `preferences`, `version` | Pseudonymous | Profile DB |
| **`CandidateEventAlias`** | `career_event_id`, `candidate_id`, `candidate_code`, `profile_version` | Restricted Mapping | Identity / Profile DB |
| **`ResumeAsset`** | `storage_key`, `hash`, `mime`, `scan_status`, `uploaded_at` | **Restricted PII** | Private Object Store |
| **`RedactionSpan`** | `source_ref`, `category`, `range`, `confidence`, `action` | Restricted | Profile DB |
| **`Organization`** | `tenant_id`, `legal_name`, `verification_status` | Internal / Public | Admin DB |
| **`Event`** | `id`, `tenant_id`, `slug`, `lifecycle`, `timezone`, `policy_version` | Public / Internal | Admin DB |
| **`EventPolicy`** | `event_id`, `duration`, `ready_deadline`, `requeue_limit`, `version` | Internal | Admin DB |
| **`Booth`** | `id`, `event_id`, `organization_id`, `zone`, `theme`, `status` | Public | Admin DB |
| **`JobPosting`** | `id`, `title`, `must_have_skills`, `weights`, `work_mode`, `salary` | Public / Internal | Admin DB |
| **`RecommendationResult`** | `event_id`, `candidate_id`, `job_id`, `score`, `reasons`, `version` | Sensitive Decision Support | Match DB |
| **`QueueTicket`** | `id`, `event_id`, `candidate_id`, `job_id`, `joined_at`, `state`, `version` | Sensitive Operational | Queue DB |
| **`InterviewSession`** | `id`, `ticket_id`, `starts_at`, `ends_at`, `media_mode`, `state`, `version` | Sensitive Operational | Interview DB |
| **`IntegrityEvent`** | `id`, `session_id`, `type`, `server_time`, `confidence` | **Highly Sensitive** | Restricted Store |
| **`DecisionCase`** | `session_id`, `event_id`, `deadline`, `state`, `version` | **Highly Sensitive** | Decision DB |
| **`Decision`** | `case_id`, `actor_id`, `encrypted_choice`, `submitted_at` | **Highly Sensitive** | Decision DB |
| **`MutualMatch`** | `case_id`, `event_id`, `state`, `reveal_deadline` | Sensitive | Decision DB |
| **`RevealGrant`** | `owner_id`, `recipient_id`, `granted_fields`, `status`, `expires_at`| **Restricted PII** | Identity / Decision DB |
| **`Assessment`** | `match_id`, `template_ref`, `deadline`, `status` | Sensitive | Post-match DB |
| **`ConsentRecord`** | `user_id`, `purpose`, `policy_version`, `granted_at`, `withdrawn_at`| Restricted Compliance | Consent Store |
| **`BreakGlassRequest`** | `requester_id`, `approver_id`, `reason`, `fields`, `ttl`, `state` | **Highly Sensitive** | Audit / Consent Store |
| **`DataSubjectRequest`** | `user_id`, `type`, `scope`, `due_at`, `state` | Restricted Compliance | Consent / DSAR Store |
| **`AuditEvent`** | `id`, `actor_id`, `action`, `target_resource`, `occurred_at`, `hash` | Restricted Compliance | Append-Only Audit Store |
| **`Presence`** | `pseudonym`, `zone_id`, `coordinates_x_y`, `status` | Ephemeral | Redis Cache |
| **`AvatarCustomizationConfig`**| `candidate_id`, `skin_tone`, `hair_style`, `hair_color`, `outfit_style`, `outfit_color`, `animal_mask` | Public Aesthetic | Profile DB / Presence |
| **`Notification`** | `id`, `recipient_id`, `type`, `redacted_payload`, `status` | Internal | Notification DB |

---

## 3.2 Identity Separation Architecture

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                             IDENTITY VAULT (Restricted)                     │
│  • User Real Name, Thai National ID, Raw Resume, Full Contact Details       │
│  • Mapping: User ID ◄──[CandidateEventAlias]──► candidate_id                │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │ Scoped Token / Consent Reveal Only
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EVENT & MATCHING PLANE (Anonymous)                 │
│  • candidate_id: Opaque Internal Identifier (e.g. cand_9x12a)               │
│  • candidate_code: Public Pseudonymous Display Alias (e.g. Candidate #8F3A) │
│  • MaskedProfile: Skills, Proficiency, Sanitized Project Evidence           │
│  • World Presence: Animal Avatar Coordinates, Queue Status                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Opaque Event Key:** ระบบ World, Matching, และ Queue รู้จักผู้สมัครในรูป `career_event_id + candidate_id` เท่านั้น
- **Display Pseudonym:** หน้าจอแสดงผลและ Recruiter มองเห็นเฉพาะ `candidate_code` (เช่น `Candidate #8F3A`)
- **Zero Raw PII in Logs:** Log ทั้งหมดในระบบ **MUST NOT** บันทึกชื่อจริง, อีเมล, เบอร์โทร, Original Resume Text, หรือ Plaintext Decision

---

## 3.3 Data Retention & Purge Schedule

| ประเภทข้อมูล | นโยบายระยะเวลาจัดเก็บ (Retention Period) | หมายเหตุ / เงื่อนไขการลบ |
|---|---|---|
| **Raw Resume Files** | ลบเมื่อผู้ใช้ถอนความยินยอม หรือภายใน Event End + 90 วัน | ยกเว้นกรณีติด Legal Hold ที่ได้รับอนุมัติ |
| **Masked Candidate Profile** | ลบเมื่อผู้ใช้ลบ หรือภายใน Last Activity + 180 วัน | สามารถต่ออายุได้ด้วยความยินยอมใหม่ |
| **Presence Coordinates** | ไม่บันทึกลงดิสก์ถาวร (Ephemeral Redis ≤24 ชม.) | ใช้สำหรับ Realtime Multiplayer เท่านั้น |
| **Interview Media Stream** | **ไม่บันทึกวิดีโอ/เสียง (Zero Recording by Default)** | การบันทึกต้องผ่าน DPIA และความยินยอมเฉพาะรอบ |
| **Integrity Events** | ลบถาวรภายใน 7 วันหลังสิ้นสุดรอบสัมภาษณ์ | Incident Hold มีอายุไม่เกิน 30 วัน |
| **Queue / Session Logs** | จัดเก็บ 180 วัน เพื่อการวิเคราะห์ทางเทคนิค | แปลงเป็น Aggregate Data หลังหมดอายุ |
| **Decision & Reveal Grants** | ลบเมื่อวัตถุประสงค์การจ้างงานสิ้นสุด หรือ Event End + 1 ปี | เข้ารหัสและจำกัดสิทธิ์การเข้าถึง |
| **Append-Only Audit Logs** | จัดเก็บ 1 ปี ตามข้อกำหนดทางกฎหมาย | จัดเก็บในระบบที่ป้องกันการแก้ไข (Tamper-Evident) |
| **Backup Storage** | Purge สำเนาสำรองทั้งหมดภายใน ≤35 วัน หลัง Primary Deletion | เป็นไปตามมาตรฐาน PDPA |
