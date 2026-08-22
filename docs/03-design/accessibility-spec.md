# 7. Accessibility & Inclusive Design Specification (WCAG 2.2 AA)

---

## 7.1 Canvas Semantic Alternative & Navigator Parity

- **Canvas Concealment:** World Canvas มีการระบุ `aria-hidden="true"` เมื่อผู้ใช้เปิดใช้งาน Navigator / List Mode
- **Skip Link First:** เพิ่ม Skip Link เป็นลิงก์แรกของหน้า: `ข้ามฮอลล์งานเสมือนจริง 2.5Dและเปิดโหมดรายการ (Navigator)`
- **Full DOM Parity:** ทุกข้อมูลและ Action ในแผนที่ (ค้นหางาน, ดูบูธ, ดูคะแนน Match, เข้าคิว, ดูตารางเวลา, ขอความช่วยเหลือ) ต้องมีโครงสร้างใน Semantic HTML และใช้งานได้ 100% โดยไม่ต้องควบคุม Avatar
- **No Coordinate Flooding:** Screen Reader จะไม่อ่านพิกัดตำแหน่งของตัวละครอย่างต่อเนื่อง เพื่อป้องกันการรบกวนสมาธิ

---

## 7.2 Keyboard Navigation & Focus Management

- **Complete Keyboard Path:** ทุกปุ่ม ลิงก์ และการกระทำต้องเข้าถึงและสั่งงานได้ด้วยแป้นพิมพ์
- **Visible Focus Ring:** Focus Ring 2 ชั้น (Inner Dark + Outer White/Cyan 2px) มองเห็นได้ชัดเจนในทุกองค์ประกอบ
- **Modal Focus Trap:** Dialog และ Bottom Sheet จะกักกัน Focus ไว้ภายใน และคืน Focus กลับสู่จุดเริ่มต้น (Trigger) เมื่อปิด
- **Ready Check Focus Safety:** Alert Dialog จะโฟกัสที่ Heading/คำอธิบายก่อนปุ่ม `พร้อม` เพื่อป้องกันการกด Enter ซ้ำซ้อนโดยไม่ได้ตั้งใจ
- **No Keyboard Traps:** ห้ามมีจุดติดขัด (Trap) ใน Canvas, หน้าต่างแชท หรือตัวแก้ไขโค้ด

---

## 7.3 Touch Targets & Responsive Reflow

- **Minimum Touch Target:** ขนาดปุ่มและจุดสัมผัสขั้นต่ำ `44 × 44 CSS px` (สำหรับ Mobile Action สำคัญใช้ `48 × 48 CSS px`)
- **No Hover-Only Content:** ไม่มีข้อมูลหรือปุ่มสำคัญใดๆ ที่ซ่อนอยู่หลัง Hover
- **320px Reflow Guarantee:** ทุกหน้าจอ (ยกเว้น World Map Canvas) จะต้องปรับเป็น 1 คอลัมน์โดยไม่มี Horizontal Page Scroll ที่ความกว้าง 320 CSS px และรองรับ Browser Zoom 400%
- **Gesture Alternatives:** ท่าทางอย่าง Swipe, Drag, หรือ Pinch ต้องมีปุ่มกด (Button Alternative) ควบคู่เสมอ

---

## 7.4 Color Contrast, Visuals & Motion

- **Contrast Ratios:** ข้อความและองค์ประกอบ UI ทั้งหมดต้องผ่านเกณฑ์ Contrast ขั้นต่ำ 4.5:1 สำหรับข้อความปกติ และ 3.0:1 สำหรับข้อความขนาดใหญ่
- **Multi-cue Status:** สถานะต่างๆ ต้องสื่อสารด้วย Icon + Text + Shape ห้ามใช้สีเพียงอย่างเดียว
- **Reduced Motion:** ปิด Particle Effects, Parallax Scrolling, Floating Animation, และ Camera Shake ทันทีเมื่อผู้ใช้เปิด Reduced Motion
- **Live Region Throttling:** `aria-live="polite"` จะไม่ประกาศตัวเลขนับถอยหลังทุกวินาที แต่จะประกาศเมื่อสถานะเปลี่ยนแปลงสำคัญ (เช่น เมื่อถึงคิว หรือเมื่อเหลือเวลา 1 นาที)

---

## 7.5 Media & Interview Accommodations

- **Live Captions:** รองรับคำบรรยายเสียงสดและการระบุชื่อผู้พูด
- **Camera-free Path:** โหมด `Avatar-only` หรือ `Audio-only` ต้องเป็นทางเลือกที่มีศักดิ์ศรีเท่าเทียม ไม่ถูกออกแบบให้ดูด้อยกว่า
- **No Forced Eye Contact:** ห้ามมีระบบวัดระดับการสบตา (Eye-contact scoring)
- **Interpreter Support:** มีช่องทางสำหรับล่ามภาษามือหรือผู้ช่วยเข้าร่วมในรอบสัมภาษณ์

---

## 7.6 Design & QA Accessibility Checklist

- [ ] ทุกฟังก์ชันในงานสามารถเข้าถึงได้ผ่าน Keyboard โดยไม่ต้องพึ่งเมาส์
- [ ] Skip Link `ข้ามโลกและเปิดโหมดรายการ` ทำงานถูกต้อง
- [ ] Focus Order เป็นไปตามลำดับสายตา (Visual Reading Order)
- [ ] Modal และ Bottom Sheet กักกัน Focus และคืน Focus เมื่อปิด
- [ ] ข้อความและปุ่มผ่านเกณฑ์ Contrast AA 4.5:1 ตามสูตร Token ที่กำหนด
- [ ] หน้าจอ Reflow ได้สมบูรณ์ที่ 320 CSS px โดยไม่มี Horizontal Scroll
- [ ] Reduced Motion หยุด Animation ที่ไม่จำเป็นทั้งหมด
- [ ] สถานะคิวและเครือข่ายมีข้อความกำกับเสมอ ไม่ใช้สีอย่างเดียว
- [ ] Ready Check Alert Dialog ไม่รับ Key Enter ที่หลุดมาจากการกระทำก่อนหน้า
- [ ] ทดสอบผ่าน Screen Reader (VoiceOver บน iOS/macOS, NVDA/Chrome บน Windows)
