# Hideout Technical Notes

> Snapshot date: 22 August 2026 (Asia/Bangkok)  
> Scope: public HTML, JavaScript, CSS and images delivered to a normal browser  
> Purpose: architecture research only; do not copy proprietary source, product copy or artwork

## Executive finding

Hideout does use **Phaser 4.1.0** for the interactive world. The production console banner and the public game-engine bundle both identify `Phaser v4.1.0`. Phaser is not used for the whole product: Hideout composes three distinct surfaces.

1. Marketing site: Astro-generated static site
2. Product shell: Next.js App Router + React + Tailwind-style CSS + Zustand state
3. World runtime: Phaser 4, loaded as a dynamic JavaScript chunk only when the authenticated app mounts the world

This separation is the most useful lesson for MaskedMatch. Hideout's code is still bundled into one Next application and its Phaser scene reads shared app state/API modules directly, so it is not as strongly isolated as the workspace boundary proposed for MaskedMatch.

## Downloaded snapshot

```text
/home/ctrlaltnate/hd/public-snapshot-2026-08-22/
├── site.html                         # Public marketing page, no launch token
├── site-assets/                      # Astro CSS/JS/logo + public hero screenshot
├── app.html                          # Public app shell, no launch token
└── app-assets/_next/static/          # Next/React, app code and dynamic chunks
```

The older `Hideout.html` in the parent folder came from a signed-in browser save and contains an expired short-lived launch token plus account identity. Do not publish or commit that file. The clean snapshot above contains no launch-token marker.

## Verified stack

| Layer | Evidence in browser payload | Finding |
|---|---|---|
| Marketing | `_astro/*`, Astro attributes | Astro static site |
| Product shell | `_next/static/*`, App Router runtime | Next.js + React |
| Client state | Zustand persist middleware | Zustand |
| Styling | Tailwind `--tw-*` variables plus inline component styles | Tailwind-style utilities + component styles |
| Game | Phaser console banner and bundled `VERSION: 4.1.0` | Phaser 4.1.0 |
| Physics | Game config selects Arcade Physics with zero gravity | Phaser Arcade Physics; Matter is bundled by Phaser but not selected for the world |
| World realtime | Custom authenticated WebSocket | Dedicated world/presence channel |
| Voice/video | LiveKit client and `wss://livekit.gethideout.app` | LiveKit SFU/WebRTC |
| Authentication | WorkOS-related app modules | WorkOS-based organization/session flow |
| Map authoring | `/assets/maps/default.tmx` plus external TSX files | Tiled TMX/TSX asset pipeline |

The app bundle carries a React 19.2 canary build. This is an observation, not a recommendation for MaskedMatch; use stable framework releases unless a measured requirement needs otherwise.

## How the Phaser world is embedded

- React renders a host `div` for the game canvas.
- Phaser and the game configuration are dynamically imported; the initial shell does not pay the full engine cost.
- React creates the `Phaser.Game` instance after the host exists.
- User ID, organization, spawn location, locale and avatar appearance are passed through the Phaser registry during `preBoot`.
- When the product pauses the world, React calls the Phaser loop's sleep/wake lifecycle.
- On unmount, React destroys the game instance and clears related resources.
- DOM menus/HUD remain outside Phaser. Small shared anchor modules expose screen coordinates so React menus can follow a Phaser sprite using `requestAnimationFrame`.

This is conceptually DOM shell + Canvas world, but it is implemented with shared stores/modules rather than a strict serialized adapter.

## Phaser configuration

The effective world configuration is:

- renderer: automatic WebGL/Canvas selection; production currently reports WebGL
- transparent canvas with a DOM-owned fallback background
- pixel-art sampling enabled
- scale mode: resize to host, centered
- physics: Arcade, gravity `(0, 0)`, debug off
- input: window-level Phaser events disabled
- scenes: a small `BootScene`, then a large `WorldScene`
- the React host controls pause/wake/destroy

## Map, rendering and asset pipeline

- Base map is authored in Tiled as TMX with external TSX tilesets.
- `BootScene` loads TMX/TSX text, parses XML in the browser, converts it into Phaser's Tiled JSON shape, registers the tilemap, then starts `WorldScene`.
- Core grid uses 16 px tiles. The inspected map logic uses 48 columns and 13 rows (768 px world width).
- Multiple floors reuse the base floor representation and are stacked vertically with a 208 px internal offset. Stairs/elevators bridge floor-local grids.
- Walls and handrails become collidable tile layers. Furniture obstacles use static Arcade bodies.
- Depth is calculated from the actor/object foot position, with small offsets for sitting/stacking, giving natural top-down occlusion.
- Runtime building tools place furniture, paint floor/wall structure, create zones and add/remove floors.

### Character compositor

- Appearance is composed from category atlases rather than one pre-rendered character sheet per combination.
- The client creates canvas textures for a chosen body/eyes/outfit/hair/accessory combination.
- Composed textures are cached and reference-counted.
- Nearest-neighbor filtering preserves pixel edges.
- Idle animations run at 6 fps and running animations at 12 fps.

This layered compositor is directly relevant to MaskedMatch's planned avatar system, but the artwork and atlas layout must be original.

## Movement, collision and navigation

- WASD/arrow movement is client-side through Arcade Physics.
- Normal speed is approximately 100 px/s; sprint is approximately 200 px/s.
- Diagonal input is resolved to one axis, keeping movement aligned with the grid.
- The local player uses a small 12×12 foot hitbox offset inside the taller sprite.
- Position is sent over the world socket at most every 100 ms while changing, plus an immediate stop-state update.
- Click-to-walk/follow uses a custom A* grid pathfinder over four cardinal neighbors and Manhattan distance.
- Cross-floor paths are assembled from per-floor A* paths plus stair entry/exit cells.
- Follow mode recalculates the target path at a bounded cadence rather than every render frame.

## Realtime world channel

Hideout separates world-state traffic from media traffic.

1. The browser requests a short-lived WebSocket ticket from its same-origin auth endpoint.
2. It opens a dedicated socket at `wss://api.gethideout.app/api/ws/world/{organization}` with the ticket and a per-device session ID.
3. The channel carries position/presence plus world mutations such as furniture, zones, floors, elevator rides and chat signals.
4. On reconnect, the client also re-fetches durable floor/object state through API calls instead of trusting missed socket events.
5. A newer tab can take over the session, and the old tab receives a takeover event.

Architecturally this is a sound split: WebSocket for low-latency fan-out, REST/BFF for authorization and durable resynchronization.

## Spatial voice/video channel

- LiveKit is hosted separately from the world WebSocket.
- The client requests a room token based on the current target voice room; approval-only desk zones use a distinct authorization/token path.
- Changing between open-floor proximity, room zone and desk zone causes the client to leave/join the corresponding LiveKit room.
- LiveKit connects with `autoSubscribe: false`.
- The game computes the audible user set; the media layer subscribes only to tracks for users in that set. This reduces unnecessary downstream media.
- Camera and screen share are DOM/media-layer features, not Phaser objects.
- A custom mic processor uses Web Audio analyser + gain nodes for voice-activity threshold and push-to-talk gating.
- Network/media counters are sampled and reported periodically.

This is the strongest reusable architecture idea: **Phaser decides spatial membership, while LiveKit transports media and the product shell owns consent/controls.**

## UI and visual composition

The public hero screenshot is at [`site-assets/app-screenshots/hero.png`](./public-snapshot-2026-08-22/site-assets/app-screenshots/hero.png).

- Phaser fills most of the viewport.
- A dark translucent DOM top bar owns organization, zoom, build mode, desk navigation and presence.
- A floating DOM dock owns mic, deafen, camera, screen share, status and mood.
- Chat/help/accessibility controls are independent DOM surfaces.
- Pixel art is used for the world and avatars; product controls use readable modern UI rather than drawing forms into Canvas.
- The marketing site uses a warm cream/terracotta/sage system, Pixelify Sans for brand display and regular sans-serif/Thai fonts for body copy.
- The app credits LimeZu artwork. MaskedMatch must not reuse those assets; `docs/ref_pics/` remains reference-only and production atlases must be original/licensed for our project.

## What MaskedMatch should adopt

1. Load Phaser only on the world route and keep the initial website bundle independent.
2. Use Phaser 4 with a small boot scene and focused world scenes.
3. Author maps in Tiled and build an explicit atlas/map manifest pipeline.
4. Keep semantic product UI, dialogs, media controls and accessibility in DOM.
5. Use small foot hitboxes, Y-based depth and low-frame-rate pixel animations.
6. Keep world WebSocket/presence separate from WebRTC/SFU media.
7. Let the game emit spatial membership; let the web/media layer authorize and subscribe.
8. Use short-lived socket/media tickets and durable REST resync after reconnect.
9. Use layered avatar atlases with cached client-side composition.
10. Budget dynamic chunks and runtime assets separately.

## What MaskedMatch should do differently

- Preserve the planned workspace boundary: `apps/web` must not reach into Phaser scenes, and `apps/game` must not call product REST/state stores directly. Communicate through versioned typed commands/events.
- Use a stable React release rather than copying a canary dependency choice.
- Pin the Phaser 4 version selected at implementation kickoff after our own compatibility/performance spike; do not pin 4.1.0 just because Hideout uses it.
- Keep accessibility/list-mode parity as a first-class requirement; Hideout's world remains movement-centered.
- Require explicit media consent suitable for a job-fair/interview context. Hideout's automatic proximity voice behavior is not appropriate as a default for MaskedMatch.
- Use original 8-bit production assets built from our art direction and reference library, with provenance recorded in the asset manifest.

## Recommended future workspace shape

```text
apps/
├── site/       # Optional lightweight marketing site
├── web/        # Product shell, task UI, accessibility, media controls
└── game/       # Phaser 4 runtime only
packages/
├── contracts/  # Versioned Web ↔ Game messages
├── domain/     # Renderer-independent rules/types
└── assets/     # Approved runtime manifests and original assets
```

Hideout validates the overall Phaser 4 + DOM shell direction. It does not remove the need for MaskedMatch's compatibility spike, privacy model, job-fair domain architecture or original visual design.
