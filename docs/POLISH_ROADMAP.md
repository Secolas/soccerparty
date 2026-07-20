# Premium-Pixel Polish Roadmap

Goal: push the *perceived* quality toward a premium pixel look (Dave-the-Diver
juice) **without a rewrite** — stay in Canvas 2D, one `index.html`, mobile
budget. Each phase is ordered by impact-to-cost. The line where a WebGL
re-platform becomes necessary is called out explicitly (Phase 5) and is
deliberately last.

Effort key: **S** ≈ hours · **M** ≈ a few days · **L** ≈ a week+ / art-driven.

## Guardrails (apply to every phase)

- **60 fps on low-end phones.** No per-frame allocation in the draw loop — no
  `createLinearGradient`/`createRadialGradient` per token per frame (that's why
  the kit shading uses offset-disc lenses). Cache anything static to an
  offscreen canvas once and `drawImage` it.
- **fps-adaptive.** Gate the expensive effects (bloom, god-rays) behind a
  running-average FPS check; drop them automatically on slow devices.
- **Readability is sacred.** The ball, the goal, and the HUD must never be
  obscured by juice. Effects sit *under* or *around* gameplay, never over it.
- **Respect `prefers-reduced-motion` and the mute/music toggles.**
- **Bundle stays lean.** New art is committed PNGs under `assets/generated/`;
  avoid ballooning the single-file build.

## What already exists (build on these, don't reinvent)

`shotTrail`, `hitSparks`, `spawnSparks`, `turnFlash`, screen **shake**, camera
**zoom**, `flyTo` reward animations, per-pitch **ambience** (beach gulls, snow,
drones), the crowd renderer, and the SNES audio pass (mtone + anthem bed). The
juice foundation is real — the gaps are lighting, atmosphere depth, animation,
and a live audio bed.

---

## Phase 1 — Juice polish  ·  **S**  ·  `11-physics.js`, `12-draw.js`

Tighten the game-feel with the systems already present.
- **Hitstop:** 2–4 frame freeze on goals and hard collisions — the single
  biggest "expensive game" tell, nearly free.
- **Squash & stretch** on the ball: stretch along velocity, squash on impact.
- **Camera punch** on goals: a short zoom-in + shake beat (extend existing
  zoom/shake) then ease back.
- **Trail upgrade:** taper width + fade the existing `shotTrail`, tint it by
  active ability (cannon = fire, freeze = frost).
- **Anticipation** on flick release: brief scale/tilt on the striking token.

## Phase 2 — Lighting & atmosphere  ·  **M**  ·  `12-draw.js`, `05-ambience.js`

Where most of the "premium" read comes from, all Canvas-fakeable.
- **Faked bloom:** draw bright elements (ball glow, ability FX, floodlit lines)
  to a half-res offscreen, blur by down/up-scale, screen-blend back. One pass,
  fps-gated.
- **Vignette + stadium light:** a cached radial warm-light overlay + soft
  corner darkening for depth (pairs perfectly with the new warm surrounds).
- **Pitch specular sweep:** a slow-moving sheen band across the turf so the
  grass catches "floodlight."
- **Rim-light near the ball:** tokens within ~40px of the ball pick up a warm
  edge — cheap, sells dynamic light.
- **Ambient particles per pitch (expand what's there):** dust motes, floodlight
  god-rays, clay heat-shimmer, savanna-dusk fireflies, stadium smoke/flares.

## Phase 3 — Animation depth  ·  **M–L (art-driven)**  ·  draw + asset pipeline

The most labor; do it incrementally, pitch/team at a time.
- **Token life:** idle bob, anticipation squash, a kick-lunge on the striker,
  a celebration hop on a goal.
- **Keeper dive frames** instead of pure position-tracking.
- **Crowd animation:** idle sway, a jump-and-flags-up burst on goals, tifo
  ripple (there's already a tifo system to lean on).
- **Time-of-day / weather variants** per pitch (day, dusk, night, rain).

## Phase 4 — Live audio bed  ·  **M**  ·  `08-sound.js`

Extend the SNES audio pass from anthems into the match itself.
- **Under-match music bed:** a low, loopable groove during play (not just the
  pre-match anthem), ducked under SFX.
- **Crowd ambience loop** that swells on chances and erupts on goals.
- **Transition stingers** (kickoff, half, match point) and a simple mix bus so
  music sits beneath gameplay sound.

## Phase 5 — WebGL re-platform (the rewrite line)  ·  **L+**  ·  only if needed

Everything above lives in Canvas 2D. True HD-2D shader effects do not.
- Move the **render layer** to WebGL (PixiJS), keep all game logic.
- Unlocks: real bloom, normal-mapped dynamic 2D lights, water/heat shaders,
  blend modes at scale, cheap large particle counts.
- Costs: a render rewrite, bigger bundle, more moving parts, new perf profile.
- **Recommendation:** hold this unless Phases 1–4 leave you wanting more, or a
  bigger release justifies it.

---

## Recommended sequence

Do **1 → 2 → 4** first: juice + faked lighting + a live audio bed deliver
roughly 70% of the "premium" impression for a fraction of the cost, entirely
within the current architecture. Treat **Phase 3** as ongoing art that trickles
in. Reserve **Phase 5** for a deliberate step up in ambition.

### First-week quick wins (all S, all shippable independently)
1. Hitstop on goals/hard hits
2. Goal camera-punch (zoom + shake beat)
3. Cached vignette + warm stadium-light overlay
4. Pitch specular sweep
5. Crowd goal-jump burst
6. Under-match music bed (quiet)
