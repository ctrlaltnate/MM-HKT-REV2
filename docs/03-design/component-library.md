# Product Component Library

> **Document role:** Semantic DOM component contracts and naming
> **Visual tokens/states:** [Website & Product UI Design System](./design-system.md)
> **Game entities/character layers:** [Game Visual & World Specification](./world-and-scene-design.md)

---

## 1. Foundation Components

| Component | Required variants/states | Accessibility contract |
|---|---|---|
| `Button` | primary, secondary, tertiary, danger; default/focus/pressed/disabled/loading | native button, visible label, no duplicate submit |
| `IconButton` | default/focus/pressed/disabled | accessible name required |
| `TextField` / `TextArea` | default/focus/filled/error/disabled | persistent label + described error/help |
| `Select` / `Combobox` | closed/open/result/empty/error | keyboard listbox behavior |
| `Checkbox` / `RadioGroup` | unchecked/checked/indeterminate/disabled | native semantics and group label |
| `Card` | static, selectable, actionable | card itselfไม่ interactive หากมี nested action |
| `Dialog` | info, confirm, danger, ready-check | focus trap, Escape policy, focus return |
| `Drawer` / `BottomSheet` | closed/50dvh/90dvh/full | explicit open/close/expand; swipe not required |
| `Tabs` | default/selected/disabled | arrow-key navigation + `aria-selected` |
| `StatusBadge` | success/warning/danger/offline/demo | icon/shape + text; not color-only |
| `Toast` | info/success/warning/error | live region; critical message persists |
| `Skeleton` | card/list/profile | Reduced Motion-safe |

---

## 2. Website and Journey Components

| Component | Responsibility |
|---|---|
| `GlobalHeader` | product/event/status navigation + functional mobile menu |
| `EventHero` | demo label, event summary, Start/Resume/Guest World actions |
| `JourneyProgress` | verify/profile/avatar/world progress and resume target |
| `DemoIdentityCard` | mock label, alias, consent and privacy explanation |
| `ProfileImportForm` | validated synthetic/manual input and sample data action |
| `MaskedProfileReview` | source vs recruiter view, redaction and approve/edit actions |
| `PolicyPage` | privacy/terms with truthful prototype limitations |
| `SystemStatusList` | implemented vs demo-only services without production claims |
| `RouteRecovery` | 404/direct-route recovery action |

---

## 3. World Bridge Components

ส่วนเหล่านี้เป็น DOM UI รอบ Phaser ไม่ใช่วัตถุใน Canvas:

| Component | Responsibility |
|---|---|
| `GameSurface` | mount one Phaser runtime, dispatch typed commands, destroy on unmount |
| `WorldStatus` | loading/ready/error/renderer state |
| `MissionCard` | one current objective; must not cover core destination |
| `NavigatorPanel` | search/filter/booth list and complete Canvas-action parity |
| `BoothDetailPanel` | role, match evidence, recruiter/queue and navigate/join actions |
| `QueueChip` | active local/server ticket, position/ETA and cancel |
| `NpcDialogue` | synthetic role/message, dismiss and paused game input |
| `CharacterStudio` | customization controls; all layer options have text labels |
| `AvatarPreviewStage` | Phaser preview with front/back/left/right controls |

Booth, counter, kiosk, prop, player และ NPC ไม่อยู่ใน Component Library นี้; ใช้ prefab/entity contract ใน [Game Visual & World Specification](./world-and-scene-design.md)

---

## 4. Product Domain Components

| Component | Essential content |
|---|---|
| `DemoBanner` | explicit synthetic/mock status |
| `BlindModeBadge` | what is hidden and until when |
| `CandidateAlias` | event-scoped pseudonym only |
| `VisibilityTable` | hidden vs visible fields |
| `MatchScoreCard` | score, confidence/fixture label and evidence reasons |
| `BoothCard` | company/job, status, wait and action |
| `JobCard` | job requirements/evidence/work mode/queue action |
| `ReadyCheckDialog` | server time, accept/request-delay path |
| `NetworkBadge` | good/unstable/reconnecting/offline with text |
| `MediaControlDock` | mic/camera/avatar/caption/leave controls |
| `PrivacyStatusBar` | mask/recording/transcription status |
| `DecisionCard` | private interested/pass submit |
| `RevealRequestComposer` | Recruiter selects fields, purpose and expiry after Mutual Match; postal address never default |
| `RevealFieldPicker` | Candidate sees requester/purpose and grants subset/all or denies |
| `CompanyEditor` | company/job/JD/salary/rubric draft, validation and version conflict |
| `ShowcaseEditor` | provenance-aware item add/order/moderation state |
| `PublicationPanel` | Preview/Validate/Publish/Pause/Unpublish aggregate version |
| `RecruiterQueueBoard` | scoped masked queue, availability and atomic claim feedback |
| `IntegrationHealthList` | sanitized dependency status and degraded action; never secret values |
| `SupportTicketPanel` | create/assign/update/resolve with pseudonymous context |
| `SupportEntry` | support/report/emergency leave path |

---

## 5. Character Studio Control Contract

รายละเอียด sprite/layer/variant เป็นของ Game Visual Spec ส่วน DOM controls ต้องมี:

- `SkinTonePicker`
- `HairStylePicker` + `HairColorPicker`
- `TopStylePicker` + `TopColorPicker`
- `BottomStylePicker` + `BottomColorPicker`
- `ShoeStylePicker` + `ShoeColorPicker`
- `AccessoryPicker`
- `RandomizeCharacterButton` พร้อม custom SVG icon และ text
- `DirectionSelector` สำหรับ front/back/left/right
- `SaveAvatarButton`

ทุก picker ใช้ button/radio semantics, มี selected state และไม่พึ่ง thumbnail/color อย่างเดียว

---

## 6. Naming

```text
Button/Primary/Default
Button/Primary/Loading
Status/Network/Reconnecting
Queue/Chip/ReadyCheck
Dialog/ReadyCheck/Mobile
Card/Job/Recommended
World/Navigator/Panel
Avatar/Direction/Back
Avatar/Bottom/Trousers
Avatar/Shoe/Neutral
Media/Control/Mic/Muted
```
