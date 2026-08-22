# Future Production Tech Stack

> **Status:** Future-state proposal. The repository currently contains a local Web/Game vertical slice, not these production services.
> **Principle:** choose replaceable providers behind ports; adding a vendor account or API key is not equivalent to implementing the product flow.

---

## 1. Baseline Stack

| Layer | Baseline | Responsibility |
|---|---|---|
| Website | React + Vite + TypeScript | routes, forms, role workspaces, a11y, queue/interview UI and `AppGateway` |
| Career Hall | Phaser 4.x, separately built | world loop, entities, collision, actor/camera and typed Web bridge |
| Backend | TypeScript BFF/modular service | authorization, domain transitions, provider adapters and sanitized health |
| Durable data | PostgreSQL | tenant/event/company/profile metadata, queue, session, decision, reveal, support and audit references |
| Flexible metadata | PostgreSQL JSONB initially | parsed facts, versioned policy/model metadata and booth layout where relational columns are not useful |
| Files | private S3-compatible object storage | resume quarantine, approved company/showcase media and signed access |
| Realtime | WebSocket service; Redis only when needed | presence/fanout/cache; never replaces durable queue/decision transactions |
| Media | standards-based WebRTC provider/SFU + TURN | transport only; backend owns membership, timer and interview state |
| On-device privacy | approved landmark runtime + Web Audio API | transformed video/audio with fail-closed fallback |
| AI assistance | provider adapter + deterministic/manual fallback | evidence-bound extraction/redaction assistance and explanations |
| Observability | structured logs, metrics, traces and alerting | request/state/provider health without raw PII/decision values |

PostgreSQL + private object storage is the default minimum. Add Redis for measured realtime/capacity needs. Add a separate document database only after workload evidence and an ADR; it is not required merely because resume extraction produces JSON.

---

## 2. Deployment Units

```text
CDN / Web host
├── apps/web build
└── apps/game build + versioned public assets

Backend environment
├── API/BFF + WebSocket gateway
├── resume/profile worker
├── scheduler (ready checks, expiry, retention)
└── provider adapters (identity, object storage, AI, media, notification)

Data environment
├── PostgreSQL + encrypted Identity Vault boundary
├── private object storage / quarantine
├── optional Redis
└── append-only/tamper-evident audit sink
```

Start as a modular backend unless independent scaling/compliance evidence justifies separate services. Logical boundaries and least-privilege credentials are mandatory even when modules deploy in one process.

---

## 3. Provider Selection Criteria

Evaluate candidates using:

- Thailand/target-region latency and data-location needs;
- OIDC/security capability, tenant isolation and audit export;
- signed upload/download and malware-scanning integration;
- WebRTC browser/device coverage, TURN availability and short-lived token support;
- PDPA/DPA terms, deletion/backup behavior and incident notification;
- cost at measured concurrent users/minutes, not marketing free-tier assumptions;
- portability through the ports in [API, AI and Media Integration Plan](./api-and-ai-integrations.md).

Do not name a provider as “selected” until an ADR records owner, pricing assumptions, threat/privacy review, spike results and exit plan.

---

## 4. Client Privacy Boundary

Face landmarks and optional voice transformation run on the participant device. Only a validated transformed track may enter the media transport; tracking loss disables outgoing video or switches to avatar. Raw media is not recorded by default. These claims require device/browser tests—client-side processing alone does not guarantee anonymity or zero latency.

Website and Game share only typed contracts, domain types and approved assets as specified in [Web–Game Separation](../04-architecture/web-game-separation.md). Environment and secret placement is canonical in [Environment and Secrets](./env-and-secrets-configuration.md).
