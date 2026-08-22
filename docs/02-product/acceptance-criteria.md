# 4. Acceptance Criteria & Traceability Matrix

---

## 4.1 Acceptance Criteria (AC-01 to AC-44)

### AC-01 Candidate anonymity
- **Given:** Job เปิด Blind Mode และ candidate อนุมัติ Masked Profile
- **When:** Recruiter เปิด queue/profile/interview ก่อน mutual match
- **Then:** Response, UI, และ Log ต้องไม่มีชื่อ รูป contact original resume หรือ field ที่ policy ซ่อน

### AC-02 Redaction review
- **Given:** Parser พบ PII ที่มี confidence ต่ำ หรือไม่มั่นใจ
- **When:** Candidate เปิดดู Masked Profile Preview
- **Then:** Field ถูก highlight พร้อมเปรียบเทียบ Original vs Masked และยัง publish ไม่ได้จนกว่า candidate จะกดยืนยัน

### AC-03 Explainable recommendation
- **Given:** Candidate profile และ Job posting version ที่ถูกต้อง
- **When:** ระบบแสดงคะแนน Match Score
- **Then:** แสดง score (0–100), confidence, เหตุผลจาก evidence อย่างน้อย 3 ข้อ และ model/rule version ใน audit

### AC-04 Mobile core flow
- **Given:** Viewport แคบ 320×568 px และเป็น touch-only
- **When:** Candidate ใช้งานตั้งแต่ landing page จนถึงเข้าคิว
- **Then:** สามารถทำ task ได้ครบถ้วนโดยไม่ต้องหมุนจอ (landscape), ไม่ต้องพึ่ง hover, และไม่มี horizontal page scroll

### AC-05 Navigator parity
- **Given:** ผู้ใช้เลือกไม่ใช้ Canvas หรือใช้ Screen Reader
- **When:** เปิดใช้งาน Navigator / List Mode
- **Then:** ค้นหา job, ดูบูธ, ดูคะแนน match, เข้าคิว, ดู schedule และขอความช่วยเหลือได้ครบถ้วนเท่ากับ World mode

### AC-06 Queue idempotency
- **Given:** Candidate กดปุ่ม `เข้าคิว` ซ้ำเร็วๆ (Double-tap) หรือ network retry request
- **When:** Request ส่งมาด้วย `Idempotency-Key` เดียวกัน
- **Then:** ระบบสร้าง active ticket เพียงใบเดียวและคืน response เดียวกัน

### AC-07 Queue recovery
- **Given:** Candidate อยู่ในสถานะ `QUEUED` แล้วเกิด refresh หน้าจอหรือ offline 20 วินาที
- **When:** Client กลับมาเชื่อมต่อ socket หรือ sign-in ใหม่
- **Then:** Ticket, ลำดับคิว, และ ETA ล่าสุดจะถูกกู้คืนภายใน 5 วินาทีโดยไม่เสียลำดับคิว

### AC-08 Ready check
- **Given:** Server ส่ง Ready Check สัมภาษณ์พร้อมเวลา countdown 60 วินาที
- **When:** Candidate ตอบรับก่อนหมดเวลา
- **Then:** Alert dialog โฟกัส heading ก่อน, ไม่รับ Enter ที่หลุดมาจากฟอร์มเดิม, สถานะเปลี่ยนเป็น `ACCEPTED` แบบ atomic, และ Screen Reader ประกาศชัดเจน

### AC-09 No forced teleport
- **Given:** Candidate กำลังเดินสำรวจ World เมื่อถึงคิวสัมภาษณ์
- **When:** Ready Check มาถึง
- **Then:** Avatar และหน้าจอจะไม่ถูก teleport บังคับย้าย จนกว่าผู้สมัครจะกดปุ่ม `พร้อมสัมภาษณ์`

### AC-10 Media fail closed
- **Given:** Outgoing Masked Video กำลังทำงาน
- **When:** Landmark / Face Mask pipeline เกิดความล้มเหลว
- **Then:** Video track ถูกระงับทันทีหรือแทนด้วย Avatar ก่อนที่ Recruiter จะเห็น Raw Camera Frame และมีตัวเลือก fallback ให้ผู้ใช้

### AC-11 Low bandwidth
- **Given:** สัญญาณเครือข่ายความเร็วต่ำหรือมี packet loss สูง
- **When:** วิดีโอกระตุกหรือ degraded
- **Then:** ผู้ใช้สามารถสลับเป็น Audio-only ได้โดย Session, Queue, และ Timer ไม่สูญหาย

### AC-12 Integrity signal limitation
- **Given:** มีการสลับแท็บเบราว์เซอร์ (`visibilitychange`) เกิดขึ้น
- **When:** ระบบบันทึก Integrity Event
- **Then:** Recruiter จะไม่เห็น raw event/timeline, ไม่มีการ auto-reject, และการตรวจสอบต้องทำโดย Independent Reviewer พร้อมรับฟังเหตุผลจากผู้สมัคร

### AC-13 Private decision
- **Given:** ฝ่ายหนึ่งส่งคำตอบ Decision ก่อนอีกฝ่าย
- **When:** อีกฝ่ายยังไม่ได้ส่งคำตอบ
- **Then:** Client, API, และ Recruiter จะไม่สามารถล่วงรู้คำตอบของ Candidate ได้จนกว่าทั้งสองฝ่ายจะส่งครบ

### AC-14 Consent-based reveal
- **Given:** เกิด Mutual Match แล้ว แต่ Candidate ยังไม่ได้เลือกเปิดเผย Email
- **When:** Recruiter ขอเรียกดูข้อมูลผู้สมัครที่ match
- **Then:** Email จะยังคงถูกปิดบัง และการพยายามเข้าถึงจะถูกบันทึกใน Audit Log

### AC-15 No-match privacy
- **Given:** มีฝ่ายใดฝ่ายหนึ่งหรือทั้งสองฝ่ายเลือก Pass
- **When:** หน้า Result แสดงผล
- **Then:** UI จะไม่บอกว่าใครเป็นคนเลือก Pass และข้อมูลติดต่อของทั้งสองฝ่ายจะยังคงถูกปกปิด

### AC-16 Accessibility
- **Given:** การใช้งานด้วย Keyboard-only + 200% Zoom + Reduced Motion
- **When:** ทำ Onboarding, Navigator, Queue, Interview Controls และ Decision
- **Then:** Focus indicator ชัดเจน, ไม่มี Keyboard Trap, ไม่มี Action ที่ต้อง Swipe/Drag เท่านั้น, และหน้าจอ Reflow ได้ที่ 320 CSS px

### AC-17 Event pause
- **Given:** Organizer สั่ง Pause Queue
- **When:** Client ออนไลน์หรือ Reconnect เข้ามา
- **Then:** การขอเข้าคิวใหม่จะถูกระเสดงเหตุผลเดียวกัน ในขณะที่รอบสัมภาษณ์ที่กำลังดำเนินอยู่ทำตามนโยบายที่ตั้งไว้

### AC-18 Tenant isolation
- **Given:** Recruiter ของบริษัท A
- **When:** พยายามเข้าถึง Resource ของบริษัท B โดยใช้ ID ที่ทราบ
- **Then:** ได้รับการปฏิเสธ (403/404) แบบไม่ยืนยันว่า Resource นั้นมีอยู่จริง พร้อมบันทึก Security Audit Event

### AC-19 Data deletion
- **Given:** Candidate ส่งคำขอลบข้อมูล (DSAR) และไม่มีข้อบังคับทางกฎหมาย (Legal Hold)
- **When:** Workflow ลบข้อมูลทำงานสำเร็จ
- **Then:** Raw Resume และ PII จะถูกลบหรือ Anonymize ถาวร, Access Token ถูกยกเลิก และแจ้งยืนยันผู้ใช้

### AC-20 AI fallback
- **Given:** Matching Model ขัดข้องหรือไม่พร้อมใช้งาน
- **When:** Candidate เปิดดูรายการงานที่แนะนำ
- **Then:** ระบบสลับไปใช้ Deterministic Rules หรือแจ้งโหมด Degraded โดยไม่สร้างคะแนนปลอม

### AC-21 Consent withdrawal
- **Given:** Candidate ถอน Consent การถอดเสียงหรือการเปิดเผยข้อมูลขณะที่ Session ยัง Active
- **When:** Consent Service บันทึก Version ใหม่
- **Then:** การประมวลผลและการเข้าถึงในอนาคตจะหยุดลงทันที, Token/Cache ถูก Revoke, และระบบเปลี่ยนเป็น Fallback โดยไม่ลงโทษ

### AC-22 Membership & job publish authorization
- **Given:** User เป็น Company Admin ของ Tenant A แต่ไม่มี Role ใน Tenant B
- **When:** สั่ง Publish Job ของ Tenant A และพยายามแก้ไข Job ของ Tenant B
- **Then:** Job ของ A Publish สำเร็จ ส่วนคำขอของ B ถูกปฏิเสธพร้อมบันทึก Audit แยก Tenant

### AC-23 Authoritative movement
- **Given:** Client ส่ง Movement Intent เร็วเกินกำหนดหรือพยายามเดินทะลุ Collision
- **When:** World Service ประมวลผล
- **Then:** Server ปรับแก้ (Clamp/Reject) ตำแหน่ง และส่ง Authoritative Delta กลับมา

### AC-24 Interview timer, reconnect & recording
- **Given:** สัมภาษณ์ 12 นาที โดย Recording ปิดอยู่ และเน็ตหลุดไป 20 วินาที
- **When:** กลับมาเชื่อมต่อใหม่ก่อนครบ 60 วินาที
- **Then:** ใช้ Session เดิม, นาฬิกา Server เดินต่อตามจริง, ไม่มีการบันทึกวิดีโอ, และส่งแจ้งเตือน `WRAP_UP` 1 ครั้งเมื่อเหลือ 60 วินาที

### AC-25 Moderation
- **Given:** มีผู้ใช้รายงานการคุกคาม (Report Harassment)
- **When:** Moderator ตรวจสอบและสั่ง Suspend ผู้ถูกรายงาน
- **Then:** ผู้รายงานปลอดภัย/ไม่พบผู้ถูกรายงานอีก, Action มีเหตุผล/บันทึก Audit และมีช่องทางอุทธรณ์

### AC-26 Background notification recovery
- **Given:** Browser บนมือถือถูก OS พักการทำงาน (Suspend) และไม่ได้เปิด Web Push
- **When:** เวลา Ready Deadline ผ่านไป แล้วผู้ใช้เปิดหน้าจอขึ้นมาใหม่
- **Then:** Client Resync ข้อมูลจาก Server ทันที และเสนอทางเลือก Requeue โดยไม่ลงโทษ

### AC-27 Break-glass
- **Given:** Moderator ขอเปิดดูข้อมูล PII เนื่องจากเหตุฉุกเฉิน
- **When:** พยายามอนุมัติคำขอตนเอง หรือขอเกินขอบเขต
- **Then:** คำขอถูกปฏิเสธ; ต้องมี Independent Approver อนุมัติเท่านั้น โดยออก Token อายุ ≤30 นาทีและ Audit ทุกการเข้าถึง

### AC-28 Async resume lifecycle
- **Given:** อัปโหลด Resume ผ่านการตรวจ MIME แต่ Malware Scan ล้มเหลว
- **When:** Background Worker ปรับสถานะ
- **Then:** Asset ถูกกักกันในสถานะ `SCAN_FAILED`, ห้าม Parser/Model เข้าถึง และแสดงข้อความแจ้งเตือนที่ปลอดภัย

### AC-29 Realtime resume & deduplication
- **Given:** WebSocket หลุดหลัง Sequence 41 และได้รับ Event 42 ซ้ำ
- **When:** Client Reconnect เข้ามาด้วย Cursor 41
- **Then:** Deduplicate ด้วย `message_id`, อัปเดต Entity Version ครั้งเดียว หรือดึง Snapshot ใหม่เมื่อหลุด Replay Window

### AC-30 Conditional Main Stage captions
- **Given:** Organizer เปิด Feature Flag สำหรับ Main Stage Live Broadcast
- **When:** Accessibility Preflight ไม่พบ Live Captions หรือล่ามภาษามือ
- **Then:** Broadcast ไม่สามารถเริ่มได้ จนกว่าจะมีความพร้อมด้าน Accessibility

### AC-31 Interactive Career Hall
- **Given:** Candidate เปิด World Route บน Desktop, Mobile 390 px หรือ Narrow 320 px
- **When:** ใช้ WASD/ลูกศร หรือ Tap-to-move เข้าใกล้บูธและแตะ NPC
- **Then:** กล้องเคลื่อนตาม Avatar อย่างนุ่มนวล, บูธแสดง Interactive Glow, NPC แสดงบทสนทนาสังเคราะห์, Logo Plate เปลี่ยนตาม Fixture, และ Reduced Motion หยุด Ambient Animation ได้

### AC-32 Native Phaser scene composition
- **Given:** เปิด Career Hall และ inspect Phaser scene graph/runtime
- **When:** ซ่อนหรือลบ floor/background layer แล้วตรวจ booth, kiosk, counter, display, planter, player และ NPC
- **Then:** วัตถุทั้งหมดต้องยังเป็น entity แยกชิ้นที่ render, interactive, depth-sort และมี physics/state ได้เอง; ไม่มีภาพ hall สำเร็จรูปหรือ transparent hotspot ทำหน้าที่แทนวัตถุ และ collision body ตรงกับฐานวัตถุที่มองเห็น

### AC-33 Complete modes and avatar customization
- **Given:** Candidate อยู่ใน World แล้วเปิดทุกโหมดจาก keyboard/pointer ที่ viewport Desktop, 390 px และ 320 px
- **When:** สลับ World/Navigator/Booth/Character Studio, ค้นหาและนำทาง, join/cancel queue, คุย NPC, เปิด Info Hub และปรับตัวละครทุกหมวด
- **Then:** ทุก control เปลี่ยน state หรือส่ง typed command จริง, Game input หยุดขณะใช้ DOM panel/dialogue, avatar preview และ player ใช้ Dynamic Texture เดียวกัน และค่าที่บันทึกกลับมาใช้หลัง reload

### AC-34 P0 reference fidelity and collision
- **Given:** Reviewer เปิด runtime คู่กับ `00_MAIN_virtual_job_fair_map.jpg` และ `00_MAIN_spritesheet_booths_characters_props.png` พร้อมเปิด physics debug overlay
- **When:** ตรวจ floor, booth facade, recruiter desk, workstation, display, kiosk, queue rail, plant, truss, lounge, player และ NPC แล้วเดินชน/อ้อม/ผ่านหน้า–หลังทุกชนิด
- **Then:** Visual final เป็น original pre-rendered pixel elements ที่มี top-front 3/4 silhouette และ material detail ใกล้เคียงระดับ readability ของ reference; source texture เป็น transparent RGBA ไม่มี baked floor/contact/cast shadow; ไม่มี primitive placeholder ทำหน้าที่เป็น final object; collider ตรงฐานและมี owner link, sensor แยกจาก solid body, navigation ไม่ target กลางวัตถุ และ Y-depth ถูกต้อง

### AC-35 Complete Website, Landing and Virtual Fair journey
- **Given:** ผู้ใช้เปิด `/` ใหม่บน viewport 320, 390, 768, 1024 หรือ 1440 CSS px โดยยังไม่มี demo state
- **When:** ใช้เฉพาะ controls ที่เห็นบนหน้าเพื่อไป Product Landing → Event Landing → Mock Verify/Consent → Profile Import → Masked Review → Avatar Setup → Phaser Career Hall แล้วใช้ browser back/forward, reload, Resume และ Reset
- **Then:** ทุก step navigate/validate/persist/recover ตาม label, ไม่มี dead control หรือ horizontal overflow ใน core flow, Demo/Mock แสดงชัด, World mount เพียงหนึ่ง instance และถูก destroy เมื่อออก, direct URL/404 มี recovery path และผู้ใช้กลับ Website/Event ได้โดยไม่ต้องแก้ URL เอง

### AC-36 Directional avatar, scene perspective and cohesive UI
- **Given:** Reviewer เปิด Character Studio และ Career Hall เทียบกับ perspective guide ที่ viewport 390 และ 1440 CSS px
- **When:** เปลี่ยน skin, hair, เสื้อ, กางเกง/ท่อนล่าง, รองเท้า และ accessory แยกชั้น/แยกสี กดดูหน้า–หลัง–ซ้าย–ขวา บันทึก เดินครบสี่ทิศ และตรวจ booth/desk/kiosk/plant/NPC ทุกโซน
- **Then:** Avatar แสดง top-front/top-behind/top-left-side/top-right-side จริงและ walk cycle 3 เฟรมต่อทิศโดยไม่มี front-frame flip แทนด้านหลัง ทุก layer ตรง frame และไม่เหลื่อม, customization คงหลัง reload, ทุก scene element ใช้ orthographic top-front 3/4 พร้อม top-left material light, Phaser runtime shadow และ scale/grid เดียวกัน, booth ทุกแถวหันตาม camera convention เดียว และ Website/World UI มี hierarchy, navigation และ state feedback ที่สอดคล้องโดยไม่บดบัง core world action

### AC-37 Modular booth variety without perspective breaks
- **Given:** Career Hall แสดง booth อย่างน้อย 4 จุดและ reviewer เปิด entity/collider overlay
- **When:** เปรียบเทียบ facade, counter, showcase, kiosk, queue setup, decoration, seating และ plant ของ booth ที่ติดกัน
- **Then:** Library มีจำนวนขั้นต่ำตาม `FR-WORLD-036`, ไม่มี booth คู่ติดกันที่ใช้ combination เหมือนกันทุกหมวด, ทุกชิ้นยังเป็น runtime entity แยกพร้อม pivot/collider/sensor ที่ถูกต้อง และไม่มีการ flip/rotate/arbitrary scale เพื่อหลอกเป็น variant จน camera, light, shadow หรือสัดส่วนกับ actor ผิด

### AC-38 Runtime shadows and compositor-generated NPCs
- **Given:** Reviewer เปิด alpha/source inspection, Phaser scene graph และ NPC seed fixture
- **When:** ปิด `RuntimeShadow` layer, randomize NPC ด้วย seed เดิม/ต่างกัน และเดิน NPC ครบ top-front/top-behind/top-left-side/top-right-side
- **Then:** Object/player/NPC texture ไม่มีเงาพื้นติดอยู่ เมื่อปิด layer เงาทั้งหมดหายโดย sprite ไม่เปลี่ยน, shadow GameObject ทุกชิ้นผูก owner และไม่มี collider, seed เดิมสร้าง NPC configuration เดิม, seed ต่างกันสร้างความหลากหลายภายใน allowed combinations และ NPC ใช้ base/skin/hair/top/bottom/shoes/accessory compositor, direction และ animation contract เดียวกับ player

### AC-39 Complete character, prop and tile orientation coverage
- **Given:** Reviewer เปิด direction manifest, character compositor test, prop turntable และ autotile test map
- **When:** ตรวจทุก character layer ที่ 4 directions × 3 motion frames, สลับ authored view ของ directional prop ผ่าน N/E/S/W, ประกอบ floor/aisle/road/wall เป็น straight, turn, inner/outer corner, T, cross, endpoint, transition และ opening แล้วสร้าง partition แบบ straight/L/U/shared-wall พร้อมประตูซ้าย–กลาง–ขวา
- **Then:** ไม่มี direction/frame/layer ที่ขาดหรือใช้ front-frame/one-view rotate/flip หลอก, asymmetric detail/material light ถูกต้องทุกมุม, radial-symmetric exception มี metadata/review, tile ทุก topology ต่อโดยไม่มี seam, partition ต่อ left/center/right ได้โดยไม่เกิดช่องว่างหรือ collider ซ้อน และ doorway/accessibility opening ทุกตำแหน่งเดินผ่านได้จริง

### AC-40 Recolorable and rearrangeable asset composition
- **Given:** Reviewer เลือก prefab booth, actor และ prop set เดียวกันพร้อม palette/debug inspector
- **When:** สลับ company accent, skin, hair, top, bottom, shoes และ material palettes แล้ว rearrange facade/counter/screen/chair/plant/sign เป็นอย่างน้อย 3 layouts
- **Then:** Recolor เปลี่ยนเฉพาะ semantic palette slots โดย highlight/base/shade/outline/skin ไม่ปนกัน, ไม่มี floor/neighbor/text/logo/shadow bake ใน part, anchor/pivot/collider/occlusion ยังตรงหลังจัดใหม่ และแต่ละ layout สร้างจาก asset IDs/metadata โดยไม่ redraw texture

### AC-41 Executable Job Seeker end-to-end demo
- **Given:** `VITE_APP_MODE=demo` และเปิด preset Happy Match หรือ No Match จาก state เริ่มต้น
- **When:** ผู้ทดสอบ sign in/mock verify, consent, เลือก upload/demo/manual CV, ผ่าน processing/review, แต่งตัว, เข้างาน, อ่าน booth/company/job, เข้าคิว, accept Ready Check, ผ่าน media preflight/fallback, สัมภาษณ์และส่ง decision
- **Then:** ทุกขั้นเปลี่ยน canonical state และ recover หลัง reload, Candidate มี active ticket ไม่เกินหนึ่งใบ, ผลแสดงทันทีเมื่อสอง decision ครบ และผู้ใช้กลับ Hall เพื่อไปบูธอื่นได้โดยไม่แก้ storage/console

### AC-42 Executable Recruiter/company end-to-end demo
- **Given:** Recruiter demo account ที่มี organization role ถูกต้อง
- **When:** สร้าง/แก้ company, job, JD, salary, rubric, booth และ showcase/Hall of Fame แล้ว Save Draft → Preview → Validate → Publish, ตั้ง Available, claim candidate, สัมภาษณ์และส่ง decision
- **Then:** World/Navigator เห็น publication version เดียวกัน, invalid data publish ไม่ได้, queue claim เป็น atomic, recruiter เห็นเพียง Masked Profile ก่อน consent และทุก primary control มี visible success/error/recovery state

### AC-43 Mutual decision and requester-first field reveal
- **Given:** Candidate และ Recruiter คุยเสร็จและส่ง decision แยกกัน
- **When:** มีเพียงหนึ่ง decision, ทั้งสองเลือก Interested, Recruiter ขอ default/optional contact fields และ Candidate grant บางส่วนหรือ deny หรือเมื่อมีฝ่ายใด Pass
- **Then:** คำตอบแรกไม่รั่ว, Mutual Match ยังไม่เปิด PII, Recruiter ต้องระบุ fields/purpose ก่อน, อ่านได้เฉพาะ subset ที่ Candidate grant, postal address ไม่ถูกเลือก default, No Match ไม่บอกว่าใคร Pass และทุก transition มี audit

### AC-44 Organizer/support and demo-connected parity
- **Given:** เปิด Candidate, Recruiter และ Organizer/Support คนละ tab ด้วย scenario เดียวกัน
- **When:** queue/interview/integration/support state เปลี่ยน, organizer pause/resume หรือ connected API ถูกตั้งให้ unavailable
- **Then:** ทั้งสาม tab sync state เดียวกัน, Organizer เห็นเฉพาะ aggregate/scoped data, support recovery ทำงาน, connected mode แสดง truthful degraded/error state โดยไม่สลับเป็น fixture เงียบๆ และไม่มี server secret ใน frontend bundle/network payload

---

## 4.2 Requirement Traceability Matrix (R2 Pilot Scope)

| Capability | Requirements | Canonical State | Primary Endpoint / Event | Main Entities | Key Acceptance Criteria |
|---|---|---|---|---|---|
| **Website & Three Role Journeys** | FR-WEB-001..015 | Shared Demo Scenario / Connected Session | `/`, `/event/demo`, candidate/recruiter/ops routes | `DemoScenario`, `AvatarAppearance` | AC-04, AC-16, AC-35, AC-41..44 |
| **Identity & Consent** | FR-AUTH, FR-CONSENT | Active / Withdrawn | `/auth`, `/consents` | `User`, `IdentityClaim`, `ConsentRecord` | AC-01, AC-21 |
| **Resume & Profile** | FR-PROFILE | Section 9.6 Lifecycle | `/resumes`, `/profiles` | `ResumeAsset`, `CandidateProfile`, `CandidateEventAlias` | AC-02, AC-28 |
| **Organization & Job** | FR-ORG, FR-JOB, FR-BOOTH | Draft / Validating / Published | `/companies`, `/jobs`, `/booths`, `/showcase-items` | `OrganizationMembership`, `JobPosting`, `Booth`, `ShowcaseItem` | AC-18, AC-22, AC-42 |
| **Skill Recommendation** | FR-MATCH | Versioned Result | `/jobs/:id/recommendation` | `RecommendationResult` | AC-03, AC-20 |
| **World & Navigator** | FR-WORLD-001..039 | Presence Snapshot / Delta | `world.*` | `Presence`, `EventPolicy`, `AvatarAppearance`, `WorldEntity` | AC-04, AC-05, AC-23, AC-31..34, AC-36..40 |
| **Queue Management** | FR-QUEUE | Section 2.2 State Machine | `/queue-tickets`, `queue.*` | `QueueTicket` | AC-06..09, AC-17, AC-26, AC-29, AC-41..42 |
| **Interview Sandbox** | FR-INT | Section 2.3 State Machine | `/interviews`, `interview.*` | `InterviewSession` | AC-10, AC-11, AC-24, AC-41..42 |
| **Integrity Signals** | FR-INTEGRITY | Advisory Store | Restricted Event Store | `IntegrityEvent` | AC-12 |
| **Decision & Reveal** | FR-DEC, FR-REVEAL | Section 2.4 State Machine | `/decision-cases`, `/matches` | `DecisionCase`, `Decision`, `RevealRequest`, `RevealGrant` | AC-13..15, AC-21, AC-43 |
| **Assessment** | FR-ASSESS | Section 9.7 State Machine | `/assessments` | `Assessment` | Contract Suite |
| **Notifications** | FR-NOTIFY | Queued / Sent / Read | `/notifications`, `notification.*` | `Notification` | AC-26, AC-29 |
| **Operations & Moderation**| FR-OPS, FR-MOD, FR-SUPPORT | Event / Report / Ticket / Break-glass| `/ops`, `/reports`, `/support/tickets` | `Event`, `SupportTicket`, `AuditEvent`, `BreakGlassRequest` | AC-17, AC-25, AC-27, AC-44 |
| **Responsive & A11y** | Sections 11, 14 | UI Mapping | Semantic DOM + Manifest | Design Tokens & Components | AC-04, AC-05, AC-08, AC-16, AC-30 |
| **Retention & DSAR** | Sections 16.3, 18.2 | Request Lifecycle | `/data-subject-requests` | `DataSubjectRequest`, `AuditEvent` | AC-19, AC-21 |
