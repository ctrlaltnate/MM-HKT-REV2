# MaskedMatch

Website-first implementation of a skills-first online Job Fair. The current runnable slice includes local membership, Candidate resume preparation, Gemini PDF analysis, Admin Job Fair management, Recruiter company/booth/job management, and joining multiple fairs. The Phaser world is intentionally deferred.

## Run locally

Requirements: Node.js 22+ and npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://127.0.0.1:4173`. The local API listens at `http://127.0.0.1:8787`.

Set `GEMINI_API_KEY` in `.env.local` to enable Resume PDF analysis. The key is used only by `apps/api`; it must never be exposed as a `VITE_` variable or committed.

## Available workflows

- Candidate: create a local account, edit a profile, read a PDF locally, consent to Gemini analysis, inspect the evidence-based summary, and join multiple published fairs.
- Recruiter: create a company profile, publish booths/jobs, and review consented masked Candidate summaries in fairs shared with those booths.
- Admin: create a fair and transition it through Draft, Published, Live and Ended.
- Public visitor: browse published/live fairs, booths and job listings without signing in.

Local membership data is stored in this browser's `localStorage`. Passwords are PBKDF2-hashed, but this is not centralized authentication, ThaID verification, account recovery, server authorization, or durable multi-device storage.

## Quality commands

```bash
npm run typecheck
npm test
npm run build
```

Detailed product, privacy, game, asset and production plans live in [docs/README.md](./docs/README.md).
