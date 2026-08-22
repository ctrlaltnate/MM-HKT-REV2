# Visual Reference Catalog & Usage Boundary

> **Document role:** Catalog, priority and IP/provenance boundary ของภาพอ้างอิงเท่านั้น
> **Game design rules:** [Game Visual & World Specification](./world-and-scene-design.md)

---

## 1. Reference Priority

| Priority | File | Use |
|:---:|---|---|
| P0 | [`00_MAIN_virtual_job_fair_map.jpg`](../ref_pics/00_MAIN_virtual_job_fair_map.jpg) | hall readability, aisle width, booth density, landmark และ relative scale |
| P0 | [`00_MAIN_spritesheet_booths_characters_props.png`](../ref_pics/00_MAIN_spritesheet_booths_characters_props.png) | top-front perspective, dimensional silhouette, prop vocabulary, actor/object scale และ grounded shadow |
| P1 | [`01_top_down_hall_tileset_props.png`](../ref_pics/01_top_down_hall_tileset_props.png) | tile rhythm และ secondary prop ideas |
| P1 | [`02_pixel_office_32x32_tileset.png`](../ref_pics/02_pixel_office_32x32_tileset.png) | 32 px grid และ office material vocabulary |
| P2 | [`03_cyberpunk_neon_plaza.jpg`](../ref_pics/03_cyberpunk_neon_plaza.jpg) | accent/mood เท่านั้น ไม่ใช่ brightness baseline |
| P1 | [`04_office_cubicles_workstations.png`](../ref_pics/04_office_cubicles_workstations.png) | workstation anatomy และ furniture grouping |
| P1 | [`05_grand_convention_exhibition_hall.jpg`](../ref_pics/05_grand_convention_exhibition_hall.jpg) | professional convention-hall density และ circulation |

เมื่อ secondary reference ขัดกับสอง `00_MAIN_*` ให้ master references ชนะ

---

## 2. What to Extract

Reviewer บันทึกเฉพาะหลักการที่วัด/อธิบายได้:

- camera family และ visible planes
- logical tile/actor/object scale relationship
- aisle/booth/prop density
- silhouette readability
- material highlight/shade direction
- contact-shadow direction/length
- booth anatomy และ prop categories
- landmark/wayfinding hierarchy

ผลการวิเคราะห์ต้องกลายเป็น original brief ไม่ใช่คำสั่ง “ทำให้เหมือนภาพนี้”

---

## 3. What Must Not Be Copied

- pixel, sprite, tileset, character, logo, company, sign หรือ map layout แบบ one-to-one
- exact palette, typography, copywriting, UI chrome, sound หรือ trade dress
- file ใน `docs/ref_pics/` เป็น runtime import
- source/bundle/asset ที่ดาวน์โหลดจาก Hideout, Gather หรือผลิตภัณฑ์ภายนอกโดยไม่มีสิทธิ์

Generated output ที่อิง reference ยังต้องผ่าน human review และ provenance; การใช้ AI/MCP ไม่ได้สร้างสิทธิ์ให้กับงานต้นทางโดยอัตโนมัติ

---

## 4. Reference Review Record

ทุก art brief ต้องมี block นี้:

```text
Reference review
- Files inspected:
- Date/reviewer:
- Camera/scale/light principles extracted:
- Density/booth/prop principles extracted:
- Items explicitly not copied:
- Original changes introduced:
- Target asset IDs:
```

ข้อกำหนดรายละเอียดของ top-front, booth variants, props, characters และ QA อยู่ใน [Game Visual & World Specification](./world-and-scene-design.md) เพียงแห่งเดียว
