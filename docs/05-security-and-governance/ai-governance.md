# 2. AI Governance, Ethics & Matching Integrity

---

## 2.1 AI Governance & Ethical Principles

- **Human-Accountable Decision Support:** ระบบ AI และ Recommendation Algorithms ทำหน้าที่เป็น **เครื่องมือช่วยสนับสนุนการตัดสินใจ (Decision Support)** เท่านั้น **ไม่ใช่** ผู้มีอำนาจตัดสินใจรับหรือไม่รับเข้าทำงาน
- **Zero Protected Attribute Usage:** ข้อมูล Demographic ที่ละเอียดอ่อน (เช่น เพศ อายุ เชื้อชาติ ศาสนา ความพิการ สถาบันการศึกษา หรือรูปถ่าย) **MUST NOT** ถูกนำมาใช้เป็น Feature ในการประมวลผล จัดอันดับ หรือจับคู่ทักษะ
- **Candidate Agency & Correction Loop:** ผู้สมัครจะต้องสามารถตรวจสอบผลการสกัดข้อมูลของ AI (Masked Profile) และมีสิทธิ์แก้ไขข้อมูลที่ผิดพลาดได้เสมอก่อนที่ข้อมูลจะถูกนำไปใช้งาน
- **Model Explainability:** คะแนนการแนะนำงาน (Match Score) ทุกครั้งต้องมีคำอธิบายเหตุผล 3–5 ข้อที่อ้างอิงจากหลักฐานผลงาน (Evidence) เชิงประจักษ์

---

## 2.2 Model Card & Governance Requirements

ทุก Model หรือ AI Service ที่นำมาใช้งานในระบบต้องจัดทำ **Model Card** ประกอบด้วย:
1. **Purpose & Scope:** วัตถุประสงค์การใช้งานและขอบเขตหน้าที่ที่ชัดเจน
2. **Feature Inventory & Exclusion List:** รายการข้อมูล Input ที่ได้รับอนุญาต และรายการฟิลด์ที่ถูกตัดออก (Excluded Sensitive Attributes)
3. **Training & Benchmark Provenance:** แหล่งที่มาของ Dataset ที่ผ่านการตรวจสอบสิทธิ์และการยินยอม
4. **Performance & Calibration Metrics:** ค่า Precision, Recall, False Omission Rate และการวัดผลการกระจายตัวของคะแนน
5. **Known Limitations & Edge Cases:** ข้อจำกัดของโมเดล และกรณีที่อาจเกิดความคลาดเคลื่อน
6. **Deterministic Fallback:** กลไกการทำงานทดแทนด้วย Rule-based ในกรณีที่ Service ขัดข้อง

---

## 2.3 Fairness Audits & Disparity Guardrails

- **Demographic Parity Monitoring:** ตรวจสอบอัตราการแนะนำงาน (Recommendation Exposure Rate) และอัตราการเกิด Mutual Match ข้ามกลุ่มผู้ใช้ที่สมัครใจระบุข้อมูลเพื่อการตรวจสอบ (Auditing Cohort)
- **Privacy Threshold:** การรายงานสถิติ Fairness จะต้องมีขนาดกลุ่มตัวอย่างอย่างน้อย `n ≥ 30` เพื่อป้องกันการอนุมานย้อนกลับไปยังตัวตนของผู้สมัคร (Re-identification Risk)
- **Separate Audit Store:** ข้อมูล Demographic เพื่อการตรวจสอบความเท่าเทียมจะถูกจัดเก็บแยกต่างหาก และ **ห้าม** เชื่อมต่อไปยัง Ranking Algorithm โดยเด็ดขาด

---

## 2.4 Prompt Injection & Untrusted Data Safeguards

- **Untrusted Input Policy:** เอกสาร Resume และ Job Description ต้องถือว่าเป็น Untrusted Data ที่อาจมีคำสั่งแปลกปลอมแฝงอยู่ (Indirect Prompt Injection)
- **Parser Isolation:** การแยกวิเคราะห์โครงสร้างเอกสารทำงานใน Isolated Sandbox ก่อนส่งเฉพาะ Plaintext ที่ผ่านการกรองแล้วไปยัง Model
- **Fixed System Prompt & Schema Guard:** กำหนด Output Schema ที่เข้มงวด (Strict JSON Schema) และห้ามไม่ให้ Model เรียก External Tools หรือสั่งเปลี่ยน System Policies

---

## 2.5 Integrity Signals vs Prohibited Inferences

### Browser Reality & Permitted Signals
เว็บเบราว์เซอร์ **ไม่สามารถล็อกหน้าจอ หรือตรวจจับการโกงได้อย่างสมบูรณ์** สัญญาณที่ระบบบันทึกได้จำกัดเฉพาะ:
- การสลับแท็บ (`document.visibilitychange`)
- การขาดหายของสัญญาณอินเทอร์เน็ตหรือ Media Interruption
- ความผิดปกติของ Session State

### Prohibited Inferences (ข้อห้ามเด็ดขาดด้าน AI):
- ✕ **MUST NOT** ประเมินความซื่อสัตย์หรือสมาธิจากการเคลื่อนไหวของดวงตา (Gaze / Eye-Tracking)
- ✕ **MUST NOT** อนุมานอารมณ์หรือบุคลิกภาพ (Emotion / Personality Inference) จากภาพใบหน้าหรือน้ำเสียง
- ✕ **MUST NOT** สร้างระบบให้คะแนน "ความเป็นมนุษย์" (Humanity Score)
- ✕ **MUST NOT** นำสัญญาณเบราว์เซอร์มาใช้ในการ Reject หรือลดคะแนนผู้สมัครโดยอัตโนมัติ (No Auto-Adverse Action)
