# 4. Architecture Decision Records (ADRs) & References

---

## 4.1 Suggested Architecture Decision Records

### ADR-001: DOM Overlay Architecture for Task UI with Canvas Renderer
- **Status:** Accepted
- **Context:** ต้องการสร้าง Virtual Job Fair 2D ที่สนุกเหมือนเกม แต่ฟอร์มการสมัครงานและการนำทางต้องเข้าถึงได้ (Accessible) ผ่าน Screen Reader และอุปกรณ์ทุกชนิด
- **Decision:** ใช้ Phaser/Canvas สำหรับ World Rendering และใช้ Semantic HTML/DOM สำหรับ Navigation, Forms, HUD, Dialogs, และ Captions ทั้งหมด
- **Consequences:** เข้าถึงได้ 100% ตามมาตรฐาน WCAG 2.2 AA โดยไม่ต้องเขียน Custom Canvas Accessibility Engine

### ADR-002: Single Active Queue Policy in MVP
- **Status:** Accepted
- **Context:** การอนุญาตให้ผู้สมัครเข้าหลายคิวพร้อมกันอาจทำให้เกิดปัญหาคิวชนกัน (Conflicting Ready Checks) และเพิ่มอัตรา No-show
- **Decision:** จำกัดให้ผู้สมัครมีได้เพียง **1 Active Queue Ticket** ต่อครั้ง โดยสามารถบันทึกงานที่สนใจลง Watchlist ได้ไม่จำกัด
- **Consequences:** สถาปัตยกรรมคิวมีความเรียบง่าย คาดเดาเวลารอได้แม่นยำ และลดปัญหาผู้สมัครพลาดรอบสัมภาษณ์

### ADR-003: Physical & Logical Separation of Identity Vault
- **Status:** Accepted
- **Context:** กฎหมาย PDPA และหลักการ Blind Mode กำหนดให้ต้องปกป้องข้อมูลส่วนบุคคล (PII) ของผู้สมัครจากการมองเห็นของ Recruiter
- **Decision:** แยกตารางและฐานข้อมูล Identity Vault ออกจากฐานข้อมูล World & Matching พร้อมเข้ารหัสด้วย Key แยกต่างหาก
- **Consequences:** มั่นใจได้ว่าข้อมูล PII จะไม่รั่วไหลผ่าน API หรือ Log ของระบบ World ก่อนที่ผู้สมัครจะยินยอม

### ADR-004: Managed WebRTC / SFU Infrastructure Strategy
- **Status:** Accepted
- **Context:** การสร้าง WebRTC SFU / TURN Server เองในระยะ Hackathon/Pilot มีความเสี่ยงด้านความเสถียรและระยะเวลาพัฒนา
- **Decision:** ใช้ Managed WebRTC Provider หรือ SFU Cloud Service ที่ได้มาตรฐาน
- **Consequences:** ลดความซับซ้อนด้านโครงสร้างพื้นฐาน และสามารถมุ่งเน้นการพัฒนา Privacy Media Masking บนเครื่องผู้ใช้ได้เต็มที่

### ADR-005: On-Device Media Masking with Fail-Closed Behavior
- **Status:** Accepted
- **Context:** การปิดบังใบหน้าด้วย Face Mask อาจเกิดความล้มเหลวจากแสงไม่พอหรือมุมกล้อง
- **Decision:** การประมวลผล Face Landmark ทำงานบน Client และใช้หลักการ **Fail-Closed** ระงับการส่งวิดีโอทันทีหาก Mask หลุด
- **Consequences:** ป้องกันการรั่วไหลของใบหน้าจริง 100% โดยผู้ใช้สามารถสลับไปใช้โหมด Avatar-only หรือ Audio-only ได้

### ADR-006: Deterministic Rules as Primary Fallback for AI Matching
- **Status:** Accepted
- **Context:** AI Recommendation Model อาจมีความล่าช้าหรือขัดข้องในบางช่วงเวลา
- **Decision:** กำหนดสูตรคำนวณคะแนนแบบ Rule-based ที่โปร่งใสและตรวจสอบได้เป็น Default Fallback เสมอ
- **Consequences:** ระบบสามารถทำงานได้อย่างต่อเนื่องและอธิบายเหตุผลความตรงกันของทักษะได้ในทุกสถานการณ์

### ADR-007: Navigator / List Mode as a First-Class Equivalent Surface
- **Status:** Accepted
- **Context:** ผู้ใช้งานบางกลุ่มอาจใช้อุปกรณ์สเปกต่ำ มีปัญหาเน็ตช้า หรือมีความบกพร่องทางการมองเห็น
- **Decision:** พัฒนา Navigator / List Mode ให้มีฟังก์ชันเทียบเท่า World Mode 100%
- **Consequences:** ผู้ใช้ทุกคนสามารถค้นหางาน ดูบูธ เข้าคิว และสัมภาษณ์ได้โดยไม่ต้องควบคุม Avatar บน Canvas

### ADR-008: Zero Interview Recording by Default
- **Status:** Accepted
- **Context:** การบันทึกวิดีโอสัมภาษณ์สร้างความกังวลด้านความเป็นส่วนตัวและมีภาระจัดเก็บข้อมูลตาม PDPA
- **Decision:** ปิดการบันทึกเสียงและวิดีโอในทุกรอบสัมภาษณ์เป็นค่าเริ่มต้น
- **Consequences:** สร้างความไว้วางใจให้แก่ผู้สมัคร และลดความเสี่ยงด้าน Data Leakage

### ADR-009: Integrity Signals are Strictly Advisory
- **Status:** Accepted
- **Context:** เว็บเบราว์เซอร์ไม่สามารถล็อกหน้าจอหรือตรวจจับการโกงได้อย่างแม่นยำ
- **Decision:** สัญญาณการสลับแท็บเป็นเพียงข้อมูลเตือนเบื้องต้น **ห้ามนำมาใช้ในการตัดสิทธิ์ผู้สมัครอัตโนมัติ**
- **Consequences:** ป้องกันการเลือกปฏิบัติที่ไม่เป็นธรรมต่อผู้ใช้งานที่ใช้ Assistive Tools หรือมีเหตุขัดข้องทางเทคนิค

### ADR-010: Original Asset & Comprehensive License Registry
- **Status:** Accepted
- **Context:** ภาพใน Pitch Deck และภาพจากระบบอื่นมีข้อจำกัดด้านลิขสิทธิ์
- **Decision:** ผลิตงานภาพ Pixel Art และ Tileset ขึ้นมาใหม่ทั้งหมด และบันทึกลง Asset Registry
- **Consequences:** ปลอดภัยจากปัญหาการละเมิดทรัพย์สินทางปัญญา และมีความพร้อมสำหรับการขยายสู่ Production

### ADR-011: Phaser 4 Stable Line for the Career Hall
- **Status:** Accepted; implementation not present at repository `HEAD`
- **Context:** Career Hall ต้องรองรับ orthographic top-front 2D tilemap, sprites, collision, camera, proximity sensor และ input หลายรูปแบบ โดย Phaser 4 เป็น stable release line แล้ว
- **Decision:** ใช้ Phaser 4.x สำหรับ Game workspace ตาม [Web–Game Separation](../04-architecture/web-game-separation.md); R0 pin ที่ `4.2.1` การตรวจ public production payload เมื่อ 22 August 2026 พบว่า Hideout ใช้ Phaser 4.1.0 แต่ไม่ใช่เหตุผลให้คัดลอก version โดยไม่ทดสอบ requirement ของ MaskedMatch
- **Consequences:** ได้ engine ที่ตรงกับ world requirement; การอัปเกรด dependency/plugin ต้องผ่าน compatibility, typecheck, build และ performance test

### ADR-012: Website and Game as Separate Workspaces
- **Status:** Accepted; implementation not present at repository `HEAD`
- **Context:** Product task UI ต้องเป็น semantic DOM ขณะที่ world simulation ต้องมี game loop ของตนเอง การรวม ownership ทำให้ accessibility, testing และ lifecycle ของ WebRTC/Canvas ซับซ้อน
- **Decision:** แยก `apps/web` และ `apps/game`; แชร์เฉพาะ `packages/contracts`, `packages/domain` และ `packages/assets` ผ่าน typed adapter
- **Consequences:** build/test/performance budget แยกได้, เปลี่ยน renderer ได้ง่ายขึ้น และป้องกัน Phaser object รั่วเข้า product UI แลกกับการต้องดูแล contract version อย่างเป็นระบบ

### ADR-013: MCP-Assisted Evidence and Visual QA
- **Status:** Accepted and active for R0 visual work
- **Context:** ความสมจริงของโลก 8-bit ต้องอาศัย measurement, interaction evidence, asset iteration และการตรวจ implementation จริง ไม่ควรตัดสินจาก prompt หรือภาพนิ่งเพียงภาพเดียว
- **Decision:** งาน world/visual ต้องใช้ MCP/tool connectors ที่มีอยู่และไม่มีค่าใช้จ่ายเมื่อเกี่ยวข้องตาม [MCP-Assisted Workflow](./mcp-assisted-workflow.md) ตั้งแต่ reference inspection ถึง browser visual/performance QA พร้อม provenance record โดย MCP เป็น development/QA tooling เท่านั้น ไม่เป็น production runtime dependency และไม่บังคับซื้อ Phaser Editor/paid MCP
- **Consequences:** ได้งานที่ตรวจสอบย้อนกลับได้และลดการเดา แต่ต้องดูแล permission, privacy, IP boundary, tool availability และ fallback อย่างชัดเจน

---

## 4.2 Standards & Official References

- **Web Accessibility Standards:** [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) · [WAI-ARIA 1.2 Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- **Web Standards & Performance:** [WebRTC 1.0](https://www.w3.org/TR/webrtc/) · [Page Visibility API Level 2](https://www.w3.org/TR/page-visibility-2/) · [Google Web Vitals](https://web.dev/articles/vitals)
- **Legal & Data Protection:** [พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)](https://www.pdpc.or.th/) · [ระบบ DOPA Digital ID (ThaID)](https://digitalid.bora.dopa.go.th/pr)
- **Game Engine:** [Phaser releases](https://github.com/phaserjs/phaser/releases) · [Phaser API](https://docs.phaser.io/api-documentation/namespace/phaser)
- **Spatial Concept Inspiration:** [Gather](https://www.gather.town/features) · [Gather Spatial Audio/Video](https://support.gather.town/articles/4624155403-overview-of-spatial-audio-video) · [Hideout](https://gethideout.app/) (ใช้เป็น experience reference; stack observations มาจาก public client payload เท่านั้น)
