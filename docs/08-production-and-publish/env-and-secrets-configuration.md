# Environment and Secrets Configuration

> Commit only placeholder names in `.env.example`. Put real values in a local ignored file or deployment secret manager. Never paste a real key into Docs, Git, issue, screenshot, client bundle or browser storage.

---

## 1. Runtime Modes

```bash
# Public build-time configuration; safe to expose to the browser.
VITE_APP_MODE=demo
VITE_API_BASE_URL=http://127.0.0.1:8787
VITE_REALTIME_URL=ws://127.0.0.1:8787/realtime
VITE_ENABLE_REAL_MEDIA=false
VITE_MEDIA_PUBLIC_URL=
```

| `VITE_APP_MODE` | Behavior |
|---|---|
| `demo` | Use `DemoAppGateway`, deterministic fixtures and cross-tab `DemoScenarioStore`; show Demo badge |
| `connected` | Use backend/realtime adapters; missing/unhealthy services show truthful error/degraded state and never fall back to fixtures |

Everything prefixed `VITE_` is public because Vite can place it in browser JavaScript. **Never prefix a secret with `VITE_`.** A public project URL or deliberately public anonymous client key is allowed only when the provider security model, server policy and row-level authorization have been reviewed.

---

## 2. Server-Only Configuration

Use only the variables required by the chosen adapters; providers are replaceable.

```bash
# Core backend
APP_ENV=development
APP_ORIGIN=http://127.0.0.1:4173
DATABASE_URL=__SET_IN_SECRET_MANAGER__
SESSION_SIGNING_SECRET=__SET_IN_SECRET_MANAGER__
FIELD_ENCRYPTION_KEY=__SET_IN_SECRET_MANAGER__
AUDIT_SIGNING_KEY=__SET_IN_SECRET_MANAGER__

# Object storage / resume processing
OBJECT_STORAGE_ENDPOINT=__PROVIDER_ENDPOINT__
OBJECT_STORAGE_BUCKET=__BUCKET_NAME__
OBJECT_STORAGE_ACCESS_KEY_ID=__SET_IN_SECRET_MANAGER__
OBJECT_STORAGE_SECRET_ACCESS_KEY=__SET_IN_SECRET_MANAGER__

# Optional AI extraction adapter; configure one approved provider
AI_PROVIDER=openai_or_other_approved_provider
AI_PROVIDER_API_KEY=__SET_IN_SECRET_MANAGER__
AI_EXTRACTION_MODEL=__PIN_APPROVED_MODEL_VERSION__

# Optional media adapter
MEDIA_PROVIDER=livekit_or_other_approved_provider
MEDIA_PUBLIC_URL=__PUBLIC_WSS_URL__
MEDIA_API_KEY=__SET_IN_SECRET_MANAGER__
MEDIA_API_SECRET=__SET_IN_SECRET_MANAGER__

# Optional connected identity adapter
IDENTITY_PROVIDER=approved_oidc_provider
IDENTITY_CLIENT_ID=__SET_IN_SECRET_MANAGER__
IDENTITY_CLIENT_SECRET=__SET_IN_SECRET_MANAGER__
IDENTITY_REDIRECT_URI=https://example.invalid/v1/auth/callback
```

If a Supabase adapter is selected, its service-role key is server-only. If direct browser access is deliberately used, expose only its intended public/anonymous key and prove row-level authorization/tenant isolation before pilot. A second document database is not required by default; PostgreSQL JSONB/object storage can cover flexible resume metadata until evidence shows otherwise.

---

## 3. Startup Validation and Secret Boundaries

- `demo`: external credentials are optional; production-like controls must still use adapters and canonical state.
- `connected` backend: fail startup when database, signing or encryption secrets are missing/placeholder/too short.
- Enable AI, media or identity only when all variables for that adapter exist and health checks pass.
- Frontend validates public URL schemes and mode, but never receives database credentials, service-role keys, media signing secrets, identity client secret or AI key.
- Backend returns capability/health booleans and sanitized error codes, never environment values.
- CI scans repository/build artifacts/source maps for secret patterns and rejects accidental exposure.

---

## 4. Local and Deployment Placement

| Location | Allowed content |
|---|---|
| committed `.env.example` | variable names and non-secret placeholders only |
| ignored `.env.local` | developer public config; server secrets only when running local backend |
| CI/deployment secret manager | staging/production server secrets scoped per environment |
| frontend hosting variables | public `VITE_*` only |

Development, preview/staging and production must use separate projects/credentials. Do not automatically copy a production secret into Preview/Development.

---

## 5. Rotation and Incident Procedure

1. Revoke exposed credential at the provider first.
2. Create a replacement with least privilege and update only the affected environment.
3. Redeploy/restart the server adapter and verify sanitized integration health.
4. Invalidate sessions/tokens derived from the old key where relevant.
5. Search Git history, build artifacts and logs; purge where supported and record an incident/audit entry.
6. Rotate signing/encryption keys through a versioned dual-read migration. Never overwrite encryption keys without a decrypt/re-encrypt plan.

Use [API, AI and Media Integration Plan](./api-and-ai-integrations.md) for adapter behavior and [Production Deployment Guide](./production-deployment-guide.md) for release gates.
