# MCP-Assisted Research, Asset Iteration & Visual QA

> **Status:** Required workflow for active R0 world/visual implementation
> **Version:** 3.0 · 22 August 2026

## 1. Objective

ใช้ Model Context Protocol (MCP) และ tool connectors เพื่อให้การออกแบบโลก 8-bit อิงหลักฐานจากของจริง มีสัดส่วน รายละเอียด การเคลื่อนไหว และ responsive behavior ที่ตรวจสอบได้ ไม่ใช่การเดาจาก prompt เพียงอย่างเดียว

MCP เป็น **development and QA tooling** เท่านั้น ห้ามให้ Phaser game loop หรือ production client ต้องเชื่อม MCP เพื่อทำงาน และห้ามส่ง secret, session token, PII หรือข้อมูลผู้สมัครจริงออกไปยัง tool ภายนอก

> [!IMPORTANT]
> **Zero-cost baseline:** Phaser 4 framework เป็น open-source ภายใต้ MIT License และไม่ต้องซื้อ Phaser Editor เพื่อสร้างหรือรันเกม เอกสารนี้ไม่บังคับ subscription ใดๆ ให้ใช้ Browser/general MCP และเครื่องมือฟรีที่มีอยู่ก่อน ส่วน Phaser Editor MCP หรือ paid connector เป็น optional และต้องได้รับอนุมัติงบประมาณจากผู้ใช้ก่อนเท่านั้น

## 2. Required MCP Workflow

ทุกงานที่แตะ world, booth, avatar, motion, lighting, HUD integration หรือ responsive layout ต้องทำตามลำดับนี้:

1. **Discover:** ตรวจ MCP servers/tools ที่มีใน session และเลือกเฉพาะตัวที่ตรงงาน โดยเริ่มจากเครื่องมือที่มีอยู่/ไม่มีค่าใช้จ่าย หากไม่มีตัวที่เหมาะสมให้บันทึก fallback ก่อนเริ่ม
2. **Inspect:** ใช้ Browser/DevTools MCP ตรวจ reference ที่เปิดเผยสาธารณะหรือที่ทีมมีสิทธิ์เข้าถึง เก็บ viewport, layout measurement, interaction states, motion timing, console และ network/performance evidence เท่าที่จำเป็น
3. **Brief:** แปลงหลักฐานเป็น original design brief โดยระบุสิ่งที่รับเป็น principle และสิ่งที่ห้าม copy เช่น artwork, trade dress, copywriting และ proprietary behavior
4. **Create:** ใช้ Design/Image/Asset MCP ที่ได้รับอนุญาตเพื่อสร้างหรือปรับ original concept/asset หลายรอบ จากนั้น normalize เป็น tileset, atlas, animation และ metadata ของ MaskedMatch
5. **Integrate:** นำ approved asset เข้า `packages/assets/` ผ่าน manifest เท่านั้น ห้ามให้ MCP output หรือ `docs/ref_pics/` ถูก import เข้า runtime โดยตรง
6. **Verify:** ใช้ Browser/DevTools MCP เปิด implementation จริงบน target viewports, capture ภาพก่อน–หลัง, ตรวจ collision/depth/animation/DOM overlay และเก็บ performance trace
7. **Record:** บันทึก tool/server, model/version ถ้ามี, source URL/file, วันที่, prompt/brief version, allowed use, reviewer และ checksum ลง provenance record

## 3. Tool Routing

| Need | Preferred MCP/tool category | Required evidence |
|---|---|---|
| วิเคราะห์ Hideout/Gather และ reference สาธารณะ | Browser/DevTools MCP | URL, date, viewport, screenshots, interaction notes, public network/bundle observations |
| อ่าน design source ของทีม | Figma/design MCP ที่เชื่อมต่อและได้รับอนุญาต | Frame/component ID, owner, version/date |
| สร้าง original pixel concept/props | Image/asset generation MCP หรือ approved generation tool | Brief, model/tool version, output variants, reviewer decision |
| ตรวจ Tiled map/atlas | Filesystem/design tooling + Phaser preview | Tile size, collision layer, atlas bounds, animation frames |
| Responsive, a11y, motion และ performance QA | Browser/DevTools MCP | 320/390/768/1440 px captures, keyboard result, reduced-motion state, trace/budget |
| Fixture/content context | Approved project-data MCP | Synthetic fixture ID เท่านั้น; ห้ามข้อมูลบุคคลจริง |

ชื่อ server อาจต่างกันในแต่ละ environment จึงให้เลือกจาก capability ไม่ hard-code ชื่อ connector หาก MCP ที่จำเป็นไม่ได้ติดตั้งหรือเชื่อมต่อ Agent ต้องรายงานข้อจำกัดและใช้ read-only local/browser fallback ที่ปลอดภัย ห้ามสร้างหลักฐานเท็จ

ไม่ต้องใช้ “Phaser MCP” โดยเฉพาะเพื่อผ่าน workflow นี้ Browser/DevTools MCP, filesystem tooling, official Phaser documentation/skills และ local test harness สามารถเป็นชุดเครื่องมือพื้นฐานได้ การซื้อ Phaser Editor ไม่ใช่ acceptance criterion

## 4. Visual Evidence Gate

นิยาม “สมจริง”, top-front camera, booth variants, avatar layers, collision/depth และ test scenes มีเจ้าของเพียงแห่งเดียวใน [Game Visual & World Specification](../03-design/world-and-scene-design.md) ส่วน workflow นี้กำหนดหลักฐานที่ต้องแนบ:

- camera lineup และ character turnaround
- collider/sensor/approach-point overlay
- การเดินหน้า–หลัง prop เพื่อยืนยัน Y-depth/occlusion
- booth combination ที่ไม่ซ้ำติดกัน
- Character Studio ที่เปลี่ยน skin, hair, top, bottom/trousers, shoes และ accessory
- interactive capture ที่ viewport 390 และ 1440 CSS px
- performance trace และ asset provenance

ภาพนิ่งสวยเพียงภาพเดียวหรือผลจาก generator โดยยังไม่ integrate ใน Phaser runtime ไม่ถือว่าผ่าน

## 5. Privacy, Security & IP Boundary

- ตรวจเฉพาะ public page หรือ account/environment ที่ผู้ใช้อนุญาต ห้ามนำ browser-save ที่มี token/cookie/account identity เข้า repository หรือส่งต่อให้ MCP อื่น
- ห้ามใช้ MCP เพื่อ bypass authentication, rate limit, paywall หรือ access control
- ห้ามดาวน์โหลดหรือคัดลอก source, sprite, map, font หรือเสียงของ Hideout/Gather มาเป็น production asset
- MCP/generated output ต้องผ่าน license, provenance, accessibility และ human review ก่อนเข้า asset registry
- External write, paid generation, account connection หรือ publication ต้องอยู่ใน scope ที่ผู้ใช้อนุญาต
- ห้ามเริ่ม trial, subscription หรือซื้อ credit ของ Phaser Editor/MCP/AI tool โดยไม่ได้รับคำสั่งอนุมัติจากผู้ใช้

## 6. Handoff Template

```text
MCP evidence:
- Tool/server:
- Public/authorized sources + inspected date:
- Viewports/states captured:
- Measurements/performance observations:
- Original design decisions derived:
- Items explicitly not copied:
- Generated asset provenance + checksum:
- Browser visual/a11y/performance QA result:
- Fallbacks or unresolved limitations:
```

การส่งมอบ world/visual slice ที่ไม่มี block นี้ถือว่ายังไม่ผ่าน Definition of Done
