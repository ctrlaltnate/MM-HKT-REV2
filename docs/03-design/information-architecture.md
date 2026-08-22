# 2. Information Architecture, Routes & Responsive Layouts

---

## 2.1 Complete Route Inventory

### A. Public Routes

| Route Path | Screen Title & Purpose | Target Persona |
|---|---|---|
| `/` | Product Landing & Value Proposition | All visitors |
| `/events/:eventSlug` | Event Landing, Schedule, Participating Booths, A11y Info | Candidates, Public |
| `/auth/sign-in` | Role-aware Authentication Entry | All users |
| `/auth/callback` | OAuth / OIDC Identity Provider Callback | All users |
| `/legal/privacy` | Privacy Notice & PDPA Policy | All users |
| `/legal/terms` | Terms of Service | All users |
| `/system-status` | Incident & Service Status Dashboard | All users |

### B. Candidate Routes

| Route Path | Screen Title & Purpose |
|---|---|
| `/app/onboarding` | Identity Verification, Consent & Resume Upload |
| `/app/avatar` | Avatar Customization & World Controls Tutorial |
| `/app/events/:eventId/world` | Interactive 2D Neon Career Hall World |
| `/app/events/:eventId/navigator` | Accessible Semantic List / Search Mode |
| `/app/booths/:boothId` | Company Overview, Tech Stack & Active Jobs |
| `/app/jobs/:jobId` | Job Requirements, Evidence Criteria & Match Score |
| `/app/queue` | Active Queue Ticket, Position, ETA & Ready Check |
| `/app/interviews/:sessionId/preflight` | Device, Mask, and Network Preflight Check |
| `/app/interviews/:sessionId` | 1:1 Private Speed Interview Room |
| `/app/interviews/:sessionId/decision` | Private Post-interview Decision Submission |
| `/app/matches` | Mutual Matches, Consented Reveal & Next Steps |
| `/app/settings/privacy` | Consent Management, Reveal Grants & Data Deletion |
| `/app/settings/accessibility` | Motion, Contrast, Text Size, Audio & Controls |

### C. Recruiter & Company Routes

| Route Path | Screen Title & Purpose |
|---|---|
| `/recruiter/home` | Availability Switch, Next Dispatched Session, Alerts |
| `/recruiter/jobs` | Assigned Jobs, Skill Rubrics & Interview Notes |
| `/recruiter/booths/:boothId/queue` | Booth Queue Status & Manual Dispatch Control |
| `/recruiter/interviews/:sessionId` | Interview Room with Private Rubric Evaluator |
| `/recruiter/matches` | Matched Candidates Pipeline (Consented Fields Only) |
| `/company/jobs` | Job Posting Management (Create, Edit, Publish) |
| `/company/booths` | Booth Content, Theme & Staff Management |
| `/company/analytics` | Aggregate Hiring Funnel & Equity Analytics |

### D. Organizer & Operations Routes

| Route Path | Screen Title & Purpose |
|---|---|
| `/ops/events` | Event Lifecycle Management (Draft, Live, Pause, End) |
| `/ops/events/:eventId/map` | Map Zones, Booth Allocation & Capacity Limits |
| `/ops/events/:eventId/live` | Real-time System Load, Queues, Media Health |
| `/ops/moderation` | User Reports, Warnings & Incident Holds |
| `/ops/audit` | Append-only Access & Reveal Audit Viewer |

### E. Demo & Stage Control (Hidden Routes)

| Route Path | Screen Title & Purpose |
|---|---|
| `/event/demo` | R0 Standalone Hackathon Prototype Entry |
| `/demo/control` | Demo Scenario Switcher, Data Reset & Instant Dispatch |

### F. R0 Website Implementation Status (22 August 2026)

| Surface | Implemented Route | Current Status |
|---|---|---|
| Product Website / Landing | `/` | **Implemented:** value proposition, how-it-works, World/Navigator parity และ Event CTA |
| Event Landing | `/event/demo`, `/events/neon-career-city` | **Implemented:** schedule, 4 booths, privacy/a11y, progress, resume/reset และ Guest World |
| Candidate Preparation | `/demo/verify`, `/candidate/profile/import`, `/candidate/profile/review`, `/candidate/avatar` | **Implemented as synthetic frontend demo:** consent, validation, masked side-by-side review, Phaser avatar preview และ local recovery |
| Virtual Job Fair | `/event/demo/world`, `/app/events/event-neon-career-city/world` | **Implemented vertical slice:** Phaser 4 Career Hall, Navigator, booth detail, local queue, NPC dialogue, Info Hub และ Character Studio |
| Legal / Recovery | `/legal/privacy`, `/legal/terms`, `/system-status`, unknown route | **Implemented:** truthful demo policy/status และ 404 recovery |
| Queue orchestration, Interview, Decision/Reveal, Recruiter/Ops | canonical routes in sections B–E | **Not implemented yet:** อยู่ใน R0 slices 3–6 และห้ามนำเสนอว่า production-ready |

> Route inventory คือ target architecture; ตารางนี้เป็นหลักฐานสถานะ runtime ปัจจุบัน เพื่อไม่ให้คำว่า “ทุกส่วนทำงานจริง” ถูกตีความเกิน vertical slice ที่ส่งมอบแล้ว

---

## 2.2 Responsive Breakpoints & Viewport Grid

| Viewport Class | CSS Width Range | Layout Behavior & Adaptation |
|---|:---:|---|
| **Narrow / Reflow** | `320–359 px` | Single-column semantic flow, full List Mode, no horizontal scroll |
| **Mobile Compact** | `360–479 px` | Mobile portrait, floating HUD, bottom navigation, bottom sheet |
| **Mobile Wide** | `480–767 px` | Large phone / landscape view |
| **Tablet** | `768–1023 px` | Split layout: Canvas + one side drawer panel |
| **Desktop Standard** | `1024–1439 px` | Three-region layout: Left Minimap + Center Canvas + Right Context |
| **Wide Desktop** | `≥1440 px` | Full-bleed Canvas with capped panel widths |

---

## 2.3 Desktop World Layout (1440 × 900 px Reference)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│ EVENT • 13:45 • Online: 428   [Verified] [Network: Good] [Queue #3 • ~8-12m]│
├───────────────┬────────────────────────────────────────┬────────────────────┤
│ MINIMAP       │                                        │ CONTEXT PANEL      │
│ • Search      │          NEON CAREER HALL              │ Cyber Orchard Co.  │
│ • Districts   │        Phaser 2D World Canvas          │ Backend Developer  │
│ • Booth List  │       Avatar + NPCs + Booth POIs       │ Match: 92/100      │
│               │                                        │ [เข้าคิวสัมภาษณ์]  │
│ Width: 280px  │            Flexible Center             │ Width: 320–360px   │
├───────────────┴────────────────────────────────────────┴────────────────────┤
│ [Mic off] [Support] [Navigator] [Accessibility]   [E Interact] [Help: ?]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

- **Canvas Integrity:** World Canvas แสดงผลเต็มพื้นที่กลางจอ โดยมี HUD ลอยอยู่ด้านบน
- **Collapsible Panels:** แผงซ้าย/ขวาสามารถพับเก็บได้เมื่อผู้ใช้ต้องการพื้นที่เดินสำรวจ

---

## 2.4 Mobile World Layout (390 × 844 px Reference)

```text
┌──────────────────────────────┐
│ Career District   [Queue #3] │
│ Network: Good        [Map]   │
├──────────────────────────────┤
│                              │
│       WORLD CANVAS           │
│    (Tap to Move / POI)       │
│                              │
│ [Recenter]          [ดูบูธ]  │
├──────────────────────────────┤
│ แผนที่  งาน  คิว  ช่วย  ฉัน  │
└──────────────────────────────┘
         ▼ Booth Bottom Sheet (Snap 50% / 90% dvh)
┌──────────────────────────────┐
│ Cyber Orchard Co.        [×] │
│ Backend Developer • 92/100   │
│ เหตุผล: Node.js, Queue, IoT  │
│ เวลารอประมาณ 8–12 นาที       │
│ [ดูรายละเอียด]  [เข้าคิว]    │
└──────────────────────────────┘
```

- **Safe-Area Insets:** ใช้ `100dvh` ป้องกันการถูก URL Bar หรือ Home Bar ของมือถือบัง
- **Bottom Navigation:** เมนูหลัก 5 ปุ่ม (`แผนที่ | งาน | คิว | ช่วยเหลือ | ฉัน`) แตะง่ายด้วยนิ้วโป้งเดียว

---

## 2.5 Interview Room Responsive Behavior

| UI Region | Desktop Layout | Tablet Layout | Mobile Portrait Layout |
|---|---|---|---|
| **Interviewer Stream** | 50–60% Primary Pane | Primary Pane | Full-width Top Pane |
| **Self Preview** | Secondary Pane | Small Drawer Pane | Picture-in-Picture (PiP มุมจอ) |
| **Timer / Status HUD** | Top Center Bar | Top Center Bar | Sticky Top (ไม่ทับ Notch) |
| **Rubric / Shared Task**| Right Drawer | Side / Bottom Sheet | Full-screen Toggle View |
| **Control Dock** | Bottom Center Dock | Bottom Center Dock | Thumb-reachable Bottom Bar |
| **Live Captions** | Bottom Overlay | Bottom Panel | Above Controls Dock |
| **Phaser World** | **Unmounted** | **Unmounted** | **Unmounted** (ประหยัดพลังงาน) |

---

## 2.6 Browser Capability & Support Manifest

| Browser Surface | Semantic UI + Navigator | 2D World Controls | WebRTC Camera / Mic | Masked Video / Avatar |
|---|:---:|:---:|:---:|:---:|
| **Chrome / Edge Desktop** | PASS | Keyboard / Pointer | PASS | On-device PASS |
| **Safari Desktop / macOS** | PASS | Pointer / Keyboard | PASS | On-device PASS |
| **Safari iOS (iPhone/iPad)**| PASS | Touch / Tap-to-move | PASS | On-device / Avatar fallback |
| **Chrome Android** | PASS | Touch / Tap-to-move | PASS | On-device / Avatar fallback |
| **Firefox Desktop** | PASS | Keyboard / Pointer | PASS | Avatar-only fallback |
