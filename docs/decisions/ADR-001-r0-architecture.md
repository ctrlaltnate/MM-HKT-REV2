# ADR-001: R0 prototype architecture and assumptions

Status: accepted for the hackathon prototype, 21 August 2026

## Decision

- Use Vite, React and TypeScript for the semantic application shell.
- Use Phaser only for the Career City renderer. Forms, copy, queue status, dialogs and all core actions remain in the DOM.
- Use a reducer as the demo state machine and a repository-like context backed by `maskedmatch.demo.v1` local storage. State synchronizes between candidate and recruiter tabs with `BroadcastChannel`.
- Use only the canonical fictional fixtures and `.test` contacts from the specification.

## R0 assumptions

- The browser is the authoritative store only for synthetic demo state; this is not a production security model.
- Interview media is a truthful avatar/media sandbox. No camera frame, recording, transcription or production WebRTC is used.
- Ready Check is dispatched through a visibly labelled demo control so the presentation stays deterministic.
- The Phaser world uses original generated indoor hall art plus a generated NPC/prop atlas. Reference images informed only density/top-down mood; no PDF, Gather, Hideout, Pokémon or third-party product asset/UI is reused.
- Thai is the default UI language. Full runtime English localization remains a subsequent slice.
