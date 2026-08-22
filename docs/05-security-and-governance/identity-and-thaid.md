# 3. Identity Verification & ThaID Integration Architecture

---

## 3.1 Digital Identity Verification Architecture

ระบบยืนยันตัวตนของ MaskedMatch ออกแบบตามหลักการ **Privacy-Preserving Identity Assurance**:
- ยืนยันว่าผู้สมัครมีตัวตนจริงและมีคุณสมบัติตรงตามสิทธิ์ โดย **ไม่เปิดเผยข้อมูลส่วนบุคคลให้แก่บริษัทนายจ้างก่อนเกิด Mutual Match**
- การยืนยันตัวตนสร้างเฉพาะ **Identity Assurance Level Claim** และผูกกับ `candidate_id` ภายใน โดยไม่ส่งต่อข้อมูลส่วนบุคคลไปยังระบบ World หรือ Matching

```text
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│ Candidate Browser      │ ───►  │ Identity Provider /    │ ───►  │ Identity Vault         │
│ (Sign-in / Verification│       │ DOPA ThaID (Approved)  │       │ (Stores Minimal Claim) │
└────────────────────────┘       └────────────────────────┘       └───────────┬────────────┘
                                                                              │ Issues Candidate Token
                                                                              ▼
                                                                  ┌────────────────────────┐
                                                                  │ Career World & Queues  │
                                                                  │ (Pseudonymous Only)    │
                                                                  └────────────────────────┘
```

---

## 3.2 ThaID Official Integration Path (Production R2)

1. **หน่วยงานรับผิดชอบ:** ผู้จัดงานหรือองค์กรพันธมิตรต้องดำเนินการลงทะเบียนและขออนุญาตใช้งานระบบ Digital ID กับกรมการปกครอง (DOPA) ผ่านช่องทางทางการ
2. **Security & Privacy Review:** จัดทำรายงานประเมินความเสี่ยงด้านความปลอดภัยและความเป็นส่วนตัว (DPIA) ก่อนรับ Production Credentials
3. **OAuth 2.0 / OIDC Protocol:** ทำงานผ่าน Redirect หรือ QR Code Authentication ตามมาตรฐานที่ DOPA กำหนด
4. **Data Minimization:** ขอเฉพาะ Claims ที่จำเป็นสำหรับการยืนยันสิทธิ์เท่านั้น **ห้ามจัดเก็บหมายเลขบัตรประชาชน Raw 13 หลัก** หากไม่จำเป็นทางกฎหมาย โดยให้เก็บเฉพาะ Hash, Provider Subject ID, Assurance Level, และ Verification Timestamp

---

## 3.3 Demo Mock ThaID Rules (Hackathon R0)

สำหรับ Prototype ในงาน Hackathon:
- **ป้ายเตือนที่มองเห็นได้ชัดเจน:** ทุกหน้าจอที่มีการจำลอง ThaID ต้องติดป้าย `DEMO DATA / NOT A REAL THAID INTEGRATION`
- **ห้ามกล่าวอ้างเท็จ:** ห้ามสื่อสารหรือทำให้กรรมการ/ผู้ใช้งานเข้าใจว่าระบบเชื่อมต่อกับฐานข้อมูลราชการจริงแล้ว
- **Synthetic Test Identities:** ใช้ข้อมูลจำลอง (เช่น `Candidate #8F3A`) และโดเมนอีเมล `.test` เท่านั้น
- **ห้ามใช้ตราสัญลักษณ์โดยไม่ได้รับอนุญาต:** ห้ามนำตรากระทรวงมหาดไทยหรือโลโก้ ThaID มาใช้เกินกว่าแนวทาง Brand Guideline

---

## 3.4 Alternative & Assisted Verification Fallbacks

เพื่อความเท่าเทียมและการเข้าถึง (Inclusivity) ระบบต้องมีกระบวนการยืนยันตัวตนสำรอง:
- **Email / SMS OTP:** สำหรับผู้สมัครทั่วไปในกรณีที่ระบบ ThaID ขัดข้องชั่วคราว
- **Foreign Applicants:** ช่องทางยืนยันตัวตนด้วย Passport หรือ Email Verification ที่ผู้จัดงานอนุมัติ
- **Users Without Smartphone / ThaID:** กระบวนการ Assisted Verification โดยเจ้าหน้าที่งานแฟร์ ณ จุด Help Desk
