# Three-Role Demo Runbook and API-Connected Rehearsal

> **Target, not current implementation claim:** The repository currently contains an early Candidate/World frontend slice. The routes and controls below are the P0 demo-completion contract. Mark an item `READY` only after it works from the visible UI and passes the listed recovery check.

---

## 1. Demo Topology

Run `VITE_APP_MODE=demo` and open four tabs on the same origin:

| Tab | Route | Role |
|---|---|---|
| Candidate | `/event/demo` | Job Seeker full journey |
| Recruiter | `/recruiter/demo/dashboard` | Company editor + Live Desk |
| Operations | `/ops/events/demo/live` | Organizer/Support overview |
| Controller | `/demo/control` | reset/preset only; not a normal role surface |

All role tabs must share one `DemoScenarioStore` using `BroadcastChannel` and a local snapshot fallback. Open `/demo/control`, select `Happy Match`, press Reset, and confirm each role displays the same scenario ID and `DEMO DATA / MOCK SERVICE` badge.

---

## 2. Full Happy-Match Script

### A. Recruiter prepares the fair

1. Sign in with the synthetic recruiter account and confirm organization-role verification is labeled Mock.
2. Open Company Editor; complete company summary and work locations.
3. Create a job with title, JD, responsibilities, must-have/nice-to-have, evidence, salary range, type, work mode, duration and fairness rubric.
4. Configure booth template/tokens and add at least one showcase/Hall of Fame item with synthetic provenance.
5. Save Draft, Preview, intentionally trigger one validation error, fix it, then Publish.
6. Confirm Candidate World and Navigator show the same published company/job/showcase version.
7. Open Live Desk and set availability to `AVAILABLE`.

### B. Candidate prepares and explores

1. From Event Landing choose Job Seeker, complete Mock Verify and versioned consent.
2. Choose one profile source: sample CV for the presentation, local upload simulation, or manual form.
3. Observe processing states, review extracted facts/redaction spans and approve the Masked Profile.
4. Open Character Studio, change skin, hair, top, bottom, shoes and accessory; inspect four directional views and save.
5. Enter Career Hall. Open a booth both from a world interaction and Navigator/List Mode.
6. Read company, showcase, active job, salary, evidence requirements and match reasons.
7. Join the queue. Attempt a second booth and confirm the existing active ticket is shown instead of creating another.
8. Refresh Candidate tab and confirm the same ticket/position/ETA returns.

### C. Queue and interview

1. Recruiter sees only candidate alias/job/wait time/masked skill summary and claims the next ticket.
2. Candidate receives an accessible 60-second Ready Check; accept it from the visible dialog.
3. Both participants complete Preflight. Show camera/mic/sensor capability and the selected animal-mask/voice mode.
4. If real media health is not `READY`, explicitly use avatar-only, audio-only or text-assisted mode; never call simulated media real.
5. Start the interview, show server/demo authoritative timer, disconnect/reconnect once, and complete the session.

### D. Private decision, reveal and follow-up

1. Candidate submits `INTERESTED`; Recruiter tab must not reveal that value and Candidate displays waiting.
2. Recruiter submits `INTERESTED`; both tabs immediately receive `MUTUAL_MATCH` without contact fields.
3. Recruiter creates a request for `legal_name`, `email`, `phone` and `resume_file`, with purpose shown. Postal address remains unselected.
4. Candidate grants only `legal_name`, `email` and `resume_file`, denying/omitting phone.
5. Recruiter can read/download only those three granted fields and sends a synthetic next-step follow-up.
6. Operations sees aggregate match/follow-up counts but no raw decisions or candidate contact values.
7. Candidate returns to Hall and can explore another booth.

---

## 3. Required Negative and Recovery Presets

| Preset | Visible proof |
|---|---|
| `No Match` | two decisions resolve; UI does not identify who passed; no reveal request/PII; Candidate returns to Hall |
| `Media Denied` | permission denial continues through avatar/audio/text fallback without losing interview state |
| `Queue Timeout` | authoritative Ready Check expires and offers one-time requeue; no hidden penalty |
| `Offline Recovery` | refresh/reconnect restores ticket/session/sequence and deduplicates events |
| `Reveal Partial Grant` | Recruiter requests fields first and can access only Candidate-approved subset |
| `Publication Invalid` | Recruiter sees field-level errors; old published version remains visible to Candidate |
| `Integration Down` | connected mode shows dependency error/degraded action and never swaps to fixture data |

Each preset must be resettable within five seconds and use deterministic IDs/timing where practical.

---

## 4. Organizer and Support Checks

1. Verify event capacity, queue depth/wait, recruiter availability, interview health, incidents and sanitized integration health.
2. Pause the queue with a reason; Candidate and Recruiter receive the same announcement and active interviews follow configured policy.
3. Resume without losing queue order.
4. Candidate creates a technical support ticket; Support assigns, updates and resolves it.
5. Confirm normal Support cannot read private decisions, raw integrity timeline or contact grants.
6. Exercise break-glass only in a dedicated preset with reason, approval, expiry and audit.

---

## 5. Connected-Mode Rehearsal

Before using `VITE_APP_MODE=connected`:

- backend migration/seed and `/health` pass;
- public API/realtime URLs point to the correct environment;
- server secrets exist only in that environment's secret manager;
- Auth, Object Storage, Profile Worker, Realtime, Media, Notification and Audit show expected health;
- synthetic test tenant/event/company/users are isolated from production people;
- API contract, authz/tenant-isolation and secret-scan tests pass.

Repeat the complete script without `/demo/control`. For each step capture request ID, state transition and audit evidence. An unavailable optional provider must take its documented fallback; an unavailable core dependency must block truthfully.

---

## 6. Five-Minute Presentation Cut

| Time | Screen action | Point |
|---:|---|---|
| 0:00–0:35 | Event Landing → sample CV → Masked Review | skills-first with Candidate review/control |
| 0:35–1:15 | Character Studio → World/Navigator → booth/job | game-like spatial hall with accessible parity |
| 1:15–1:55 | one active queue → Ready Check → Preflight | durable state and explicit privacy choices |
| 1:55–2:45 | interview with verified real mode or labeled fallback | feasible media behavior, no exaggerated claim |
| 2:45–3:35 | two private decisions → immediate Mutual Match | double-blind result |
| 3:35–4:15 | recruiter requests fields → candidate partial grant | requester-first, field-level consent |
| 4:15–5:00 | recruiter follow-up + ops/support overview | complete two-sided workflow and operability |

Keep an offline screen recording as presentation backup, but do not count it as acceptance evidence for interactive controls.
