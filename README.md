# MaskedMatch R0

Functional hackathon prototype for a skills-first, candidate-anonymous virtual job fair. Built with React, TypeScript, Vite and Phaser. Revision 1.1 adds a full indoor Neon Career Hall with smooth camera-follow movement, animated NPC crowd, booth proximity interaction and generated original pixel assets.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:4173/event/demo`.

## Demo flow

1. Enter Demo → accept required consent.
2. Use the sample resume → approve the Masked Profile → choose an avatar.
3. Open Cyber Orchard's Backend Developer role and join the queue.
4. Click `Demo: เรียกคิว` or dispatch from `/demo/control`.
5. Accept Ready Check → choose a safe media mode → finish the interview.
6. Submit the candidate decision and open `/recruiter/demo/dashboard` in another tab.
7. Submit the recruiter decision → select reveal fields.

Use `/demo/control` to reset data or select Happy match, No match, Media denied, Queue timeout and Offline recovery presets.

Inside Career Hall: use WASD/arrow keys, click/tap a destination, press `E` near a booth, or click NPCs to see synthetic conversations. Navigator remains the complete non-canvas alternative.

## Checks

```bash
npm run typecheck
npm run build
npm test
npm run test:e2e
npm run test:a11y
```

## Demo limitations

- Synthetic data only; no real ThaID integration.
- Media is an avatar/privacy sandbox, not production WebRTC or biometric masking.
- Match score is a deterministic demo recommendation, not a hiring decision.
- Browser storage is used only to make the R0 two-tab demo refresh-safe.
