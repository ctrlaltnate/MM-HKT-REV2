# Scaling and Infrastructure Capacity Plan

> Scale from measurements, not an assumed provider tier or advertised CCU. Vendor limits/prices are verified during procurement and load rehearsal, outside canonical requirements.

---

## 1. Capacity Model

Record a target event profile before choosing infrastructure:

| Dimension | Required estimate/evidence |
|---|---|
| registered / peak concurrent participants | arrival curve and reconnect spike |
| world presence | zones, visible neighbors, movement update rate/payload |
| queue | joins/minute, active tickets, Ready Checks/minute, recruiters/job |
| interviews | concurrent rooms, duration, video/audio modes and TURN percentage |
| resume processing | upload/parse jobs per minute, file size and retry rate |
| realtime/notifications | subscribed streams, messages/sec and snapshot size |
| operations | support/incident staffing and recovery objectives |

Demo fixtures and frontend render FPS are not evidence that a backend supports the same number of real users.

---

## 2. Scaling Boundaries

- Partition world presence by event/instance/zone and send interest-scoped neighbors; never broadcast all coordinates to all users.
- Keep movement/presence ephemeral, but persist queue, interview, decision, reveal, event and support transitions in PostgreSQL.
- Enforce one active queue and atomic recruiter claim with database constraints/transactions. Cache/Redis can schedule or fan out but is not the source of truth.
- Use snapshot + sequence cursor + deduplication after reconnect; cap payload size and apply backpressure.
- Process resume scanning/parsing asynchronously with bounded concurrency, quarantine and dead-letter/manual recovery.
- Issue short-lived media tokens; scale SFU/TURN from measured concurrent rooms, bitrate and relay percentage.
- Client-side media transformation reduces server compute for effects, but does **not** remove SFU/TURN bandwidth, token, state, monitoring or support capacity.
- Load Phaser assets by event/zone chunks and cap visible actors/effects independently of actual event attendance.

---

## 3. Test Stages and Exit Evidence

| Stage | Workload | Exit evidence |
|---|---|---|
| Functional | deterministic 3-role scenarios | AC-41..44 and adapter contract tests pass |
| Component load | DB queue/decision/reveal, WebSocket fanout, worker, media separately | no invariant violation; latency/error/lag within approved SLO |
| Event rehearsal | agreed peak + reconnect/arrival burst with synthetic tenants | stable queue ordering, session timers, ops visibility and support recovery |
| Failure rehearsal | DB/cache/realtime/media/AI/worker outage | truthful degraded behavior, no fixture fallback/data leak, recovery objective met |
| Soak | sustained event duration + cleanup/retention jobs | no memory/connection leak or unbounded backlog |

Publish exact target CCU, SLO and cost only after the capacity profile is approved and tests provide evidence.

---

## 4. Pre-Launch Capacity Checklist

- [ ] event capacity and admission controls are configured and visible to Operations
- [ ] database constraints, indexes, pool limits, backups and restore rehearsal pass
- [ ] queue join/claim/ready/requeue invariants pass under concurrent load
- [ ] WebSocket sequence/resync and notification deduplication pass reconnect storms
- [ ] resume worker has quarantine, retry limits, dead-letter/manual route and lag alert
- [ ] media browser matrix, SFU/TURN capacity and fail-closed fallback are measured
- [ ] Decision/Reveal privacy and requester-first subset authorization pass concurrency tests
- [ ] provider quotas/rate limits/billing alerts and named escalation owners are recorded
- [ ] Organizer/Support dashboard reports sanitized health and can pause/resume safely
- [ ] rollback, incident communication and synthetic rehearsal data purge are complete

See [Performance & Reliability](../06-engineering-and-qa/performance-and-reliability.md) for SLO ownership and [Production Deployment Guide](./production-deployment-guide.md) for promotion/rollback.
