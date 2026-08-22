# Production Deployment Guide

> **Status:** Future-state release procedure. There is no production backend/deployment configuration in the current repository. Do not treat a successful frontend upload or presence of API keys as production readiness.

---

## 1. Environments and Artifacts

Use isolated `development`, `staging` and `production` accounts, databases, storage, credentials and hostnames.

| Artifact | Build/deploy responsibility |
|---|---|
| `apps/web` | React routes and all three role workspaces |
| `apps/game` | Phaser bundle loaded only by World host |
| public assets | immutable hashed files from approved manifest |
| API/BFF + WebSocket | role/tenant/event authorization and domain orchestration |
| workers/scheduler | resume processing, deadline/expiry, retention and notification jobs |
| schema migrations | forward migration, compatibility check and rehearsed rollback/restore plan |

Provider selection is recorded in an ADR. Use the provider-neutral baseline in [Cloud & Tech Stack](./cloud-and-tech-stack.md); do not add a database or SDK to the browser merely because it offers a free tier.

---

## 2. Deployment Sequence

1. **Prepare staging:** provision PostgreSQL, private object storage, optional realtime/cache and provider adapters with synthetic tenant/event only.
2. **Load secrets:** use the deployment secret manager following [Environment & Secrets](./env-and-secrets-configuration.md); never copy production values to Preview/Development.
3. **Run migrations:** take/verify backup, apply migrations, run constraints and tenant-isolation checks.
4. **Deploy backend/worker:** verify `/health`, sanitized integration health, scheduler ownership and queue/decision/reveal transaction tests.
5. **Deploy immutable Game and Web artifacts:** verify Web references the intended Game contract/asset manifest version.
6. **Run connected smoke:** complete Candidate, Recruiter/Company and Organizer/Support path from [Demo Runbook](../07-playbooks-and-operations/demo-runbook-and-storyboard.md), without demo controller or fixture fallback.
7. **Promote:** require named security, privacy, accessibility, operations and product sign-off. Start with a controlled canary and watch release metrics.

---

## 3. Mandatory Pre-Production Gates

- `npm run typecheck`, tests and production build pass for every workspace.
- API/gateway contract tests pass against demo and connected adapters.
- Authorization matrix covers role + tenant + organization + event membership; cross-tenant negative tests pass.
- One-active-queue, atomic claim, Ready Check expiry, reconnect and idempotency tests pass.
- Private decision remains hidden; resolver is atomic; requester-first reveal exposes only granted subset.
- Resume quarantine/scan/parser failure/manual recovery and retention purge are exercised.
- Media permission denial/tracking loss/reconnect fail closed with accessible fallbacks.
- No raw PII/private decision/secret appears in logs, events, client bundle, source maps or lock-screen notification.
- Backup restore, migration rollback/forward-fix, dependency outage and incident communications are rehearsed.
- AC-01..44, WCAG 2.2 AA gate and agreed load/capacity target pass with stored evidence.

---

## 4. Release and Rollback

Use backward-compatible API/schema changes across one deployment window. Feature flags may disable AI, media enhancement or a world zone, but cannot bypass consent, authorization, audit or reveal rules.

Rollback triggers include auth/tenant leakage, raw-media privacy failure, decision/reveal leakage, corrupt queue ordering, migration inconsistency or severe accessibility blocker. On trigger:

1. pause affected entry/queue/feature through audited operations control;
2. stop/rollback application traffic while preserving evidence;
3. revoke affected tokens/credentials when exposure is suspected;
4. restore or forward-fix data using the rehearsed plan;
5. notify owners/users according to incident policy and verify recovery before resume.

Never solve a connected outage by switching production users to synthetic demo data.

---

## 5. Post-Deploy Verification

For the first release window, monitor:

- sign-in/profile-processing success and safe failure rates;
- queue depth/wait percentiles, duplicate tickets and dispatch conflicts;
- preflight/media join/reconnect/fallback rates by supported browser class;
- decision resolution latency and reveal access denials;
- integration/job worker lag, support ticket volume and incident state;
- Web/Game error rate, performance budgets and accessibility smoke checks.

Store release ID, contract/schema versions, evidence links, approvers, incident contacts and rollback decision in the release record. Provider dashboards and prices change; verify them during procurement instead of embedding time-sensitive free-tier claims in canonical Docs.
