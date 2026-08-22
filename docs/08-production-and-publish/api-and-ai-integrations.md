# API, AI and Media Integration Plan

> **Status:** Target contract; current repository is still an early frontend/world slice. A screen is not “connected” until its adapter, authorization, audit and failure tests pass.
> **Canonical flow:** [End-to-End Role Journeys](../02-product/user-journeys.md)
> **Wire contract:** [API & Realtime Contracts](../04-architecture/api-and-realtime-contracts.md)

---

## 1. Two Runtime Modes, One Product Flow

| Mode | Purpose | Data source | Required label |
|---|---|---|---|
| `demo` | Run the full three-role story without external accounts | deterministic `DemoScenarioStore`, fixtures and scenario clock | `DEMO DATA / MOCK SERVICE` |
| `connected` | Pilot/production integration | backend REST, WebSocket, object storage, worker and media provider | environment + service health |

Both modes implement the same `AppGateway` ports and domain states. Components must not import provider SDKs, fixtures or raw `fetch` calls directly. Connected mode must fail visibly when a dependency is unavailable; it must never substitute demo data silently.

```text
React routes / semantic UI / Phaser bridge
                    │
               AppGateway
        ┌───────────┴────────────┐
 Demo adapters             Connected adapters
 ScenarioStore        HTTP + WebSocket + upload + media
```

Required ports: `auth`, `profile`, `company`, `catalog`, `queue`, `interview`, `decision`, `reveal`, `operations` and `support`.

---

## 2. Integration Map by Journey

| Flow area | Demo adapter | Connected backend responsibility | External provider is optional/swappable |
|---|---|---|---|
| Sign-in/verification | synthetic verified alias | OIDC callback, session, role/event membership, assurance claim | identity provider / approved ThaID integrator |
| CV upload | local file metadata or sample CV | signed upload, quarantine, malware scan, content extraction job | object storage, scanner, parser/AI provider |
| Profile review | deterministic extracted facts/redaction spans | immutable profile version, provenance and Identity Vault separation | AI is assistive; deterministic/manual path remains |
| Company/job/booth | synthetic draft + validation | tenant authorization, versioned draft, moderation, atomic publication | media/object storage |
| World/catalog | fixtures published from same scenario | published snapshot + server-authoritative presence | realtime broker |
| Queue | deterministic scenario clock | single-active-ticket constraint, atomic claim, deadlines, recovery | broker/cache cannot replace durable DB |
| Interview | capability check + simulated peer or configured provider | short-lived room token, session clock/state, incident handling | WebRTC provider |
| Decision | private per-tab values | encrypted/idempotent writes and atomic two-party resolver | none required |
| Reveal/follow-up | requester-first local state | field request, consent grants, Identity Vault scoped reads and audit | notification provider optional |
| Ops/support | aggregate scenario state | scoped aggregates, integration health, incident/support audit | monitoring/ticket provider optional |

---

## 3. Resume and Matching Pipeline

```text
signed upload → quarantine → malware scan → safe text extraction
→ PII candidate spans → structured facts with provenance
→ deterministic policy redaction → candidate review/correction
→ approved immutable Masked Profile → recommendation
```

Rules:

- Raw file, extracted facts, Masked Profile and contact fields are separate records and scopes.
- Resume/JD text is untrusted input; embedded instructions never change system/tool policy.
- AI output must satisfy a versioned schema and cite source spans. Missing evidence stays missing; the model must not invent skills or experience.
- Matching has a deterministic rules fallback and stores rule/model version, feature version, score, confidence and explanation.
- AI/provider errors return normal processing states (`PARSE_FAILED`, retry/manual path), not a half-filled profile presented as fact.
- No browser receives an AI provider secret. The backend/worker invokes providers through an `AiExtractionPort`.

---

## 4. Identity and Authorization

- Demo verification creates a clearly labeled synthetic assurance claim and must never imply real ThaID verification.
- Connected verification uses backend OAuth/OIDC initiation and callback with PKCE/state/nonce as applicable.
- API authorization derives from the server session: role alone is insufficient; tenant, organization and event membership are also checked.
- Candidate contact fields live in an Identity Vault boundary and never appear in pre-match queue/profile responses.
- Support/Organizer receives aggregate/scoped views only. Break-glass requires reason, approval, expiry and audit.

---

## 5. Queue, Decision and Reveal Must Be Server-Authoritative

These flows cannot be productionized with frontend state alone:

1. Database enforces one active queue ticket per candidate/event and returns the existing ticket for idempotent retries.
2. Recruiter claim/dispatch uses a transaction or lock so two recruiters cannot receive the same candidate.
3. Server timestamps decide Ready Check and interview deadlines.
4. Each decision is private and idempotent. The result is committed atomically only after both values exist.
5. Mutual Match creates no PII access. Recruiter first submits `RevealRequest(fields, purposes)`; Candidate then grants a subset, all, or none.
6. Scoped reveal tokens/API responses expose only granted fields, expire, and generate view/download audit events.

---

## 6. Real Media Integration

Preflight is a product flow even without a media vendor. It checks browser permission/capability and offers animal-mask, avatar-only, audio-only and text-assisted modes.

Connected media sequence:

1. Client requests camera/mic only after plain-language consent.
2. Face landmarks and optional voice transform run locally.
3. Outgoing video is disabled until the transformed track is valid; tracking loss fails closed to avatar/disabled video.
4. Backend checks interview membership and issues a short-lived room token. API secret never reaches the browser.
5. Session state/timer remains in the MaskedMatch backend; a media room is transport, not the business source of truth.
6. Recording/transcription is off by default and needs separate policy, consent and visible state.

Real face masking and voice transformation must be measured on supported devices before any privacy/performance claim. Demo/rehearsal must not call simulated media “real”.

---

## 7. Adapter Contract and Verification

Every port must have:

- typed request/response and standard error envelope;
- idempotency and `If-Match` behavior for mutations;
- authorization and audit tests in connected mode;
- deterministic happy/error/timeout fixtures in demo mode;
- contract tests executed against both adapters;
- observable request ID, dependency health and safe log redaction.

Minimum connected smoke path:

```text
sign in → process sample CV → approve profile → publish company/job/booth
→ join and claim one queue → preflight/token → complete interview
→ submit two private decisions → resolve result
→ recruiter requests fields → candidate grants subset → recruiter reads subset
→ ops sees aggregate state → support ticket resolves
```

---

## 8. Promotion Gates

| Gate | Evidence before promotion |
|---|---|
| Demo complete | Happy Match + No Match + failure presets work through visible controls across three tabs |
| API-ready | OpenAPI/schema and gateway contract tests pass; connected mode has no fixture import/fallback |
| Pilot-ready | authz/tenant isolation, migrations, audit, retention, monitoring, backups and media failure tests pass |
| Production-ready | security/privacy review, load/recovery rehearsal, accessibility sign-off and incident ownership complete |

Adding API keys alone does not make the system production-ready; it only enables a provider adapter. The business, security and operational gates above remain mandatory.
