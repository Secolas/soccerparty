# Soccer Party

A mobile-first pixel-art flick-football game. One HTML page, canvas rendering,
no runtime dependencies beyond React (loaded by the bundled runtime).

## Where the code lives — IMPORTANT

**`index.html` is a generated file. Never edit it directly.**

The editable source of truth is `src/`:

| Path | What it is |
|---|---|
| `src/game/*.js` | The game code, split by feature. Concatenated in filename order at build time. |
| `src/template.html` | The game page (HTML + CSS). Its `__GAME_SCRIPT__` line is where the game code is injected. |
| `src/shell.html` | The self-extracting bundle wrapper (loader + font/runtime manifest). Its `__TEMPLATE_JSON__` line is where the JSON-encoded template is injected. Rarely needs editing. |

Game code map (`src/game/`):

- `00-bootstrap.js` — component class header, canvas/context setup
- `01-layout.js` — board dimensions, responsive `fit()`
- `02-teams.js` — team presets, kits, flags
- `03-boards.js` — pitch/board themes
- `04-crowd.js` — crowd rendering
- `05-ambience.js` — per-pitch scenery (beach, snow, drones…)
- `06-tifo.js` — crowd banners behind the goals
- `07-game-state.js` — match state variables
- `08-sound.js` — Web Audio synth, music
- `09-ai.js` — CPU opponent
- `10-tournament.js` — tournament/royale modes
- `11-physics.js` — movement, collisions, goals
- `12-draw.js` — main canvas rendering
- `13-input.js` — flick/drag input
- `14-scoreboard.js` — scorebug canvas
- `15-prematch.js` — menu / pre-match overlay
- `16-howto.js` — HOW TO PLAY screen
- `18-economy.js` — token/coin economy (exhibition test feature)
- `19-boot.js` — resize hooks, pause menu, boot sequence

All files run inside one `componentDidMount()` scope, so code in any file can
call functions and read variables defined in any other file. New sections can
be added as new numbered files — but they must sort BEFORE `19-boot.js`,
because that file contains the closing braces of `componentDidMount()`; a file
sorting after it lands outside the shared scope and silently breaks.

## Workflow

1. Edit files under `src/`
2. Rebuild: `node tools/build-game.mjs`
3. Sanity-check: `node tools/build-game.mjs --check`
4. Smoke-test: `node tools/smoke.mjs` (see below)
5. Commit **both** the `src/` changes and the regenerated `index.html`

CI (`.github/workflows/verify-build.yml`) fails any push where `index.html`
doesn't match `src/`, so a stale or hand-edited `index.html` can't slip in.

### Smoke test

`--check` only proves `index.html` is in sync — it cannot see a game that
renders a blank canvas, points a tutorial step at a hidden element, or stops
booting. `node tools/smoke.mjs` boots the built page in headless Chromium,
clicks through the tap-gate and menu into a match, flicks the ball, and fails on
any page error **or any external network request**. It runs in CI as the
`smoke` job and uploads screenshots on failure.

- `--shots <dir>` writes a screenshot per stage (handy for eyeballing layout)
- `--headed` watches it run
- `CHROMIUM_PATH=...` uses a preinstalled browser instead of Playwright's

### Balance harness

`node tools/balance.mjs` plays CPU-vs-CPU matches and reports how often each
ability wins. It drives the **real** engine and AI through a hook in
`src/game/18c-sim.js`, armed only by `?sim=1` — never reimplemented physics,
which would drift out of sync. The smoke test asserts `window.__spSim` is
absent without the flag, so the hook cannot leak into production.

Matches run in **practice mode**: it is the only mode that skips the goal-time
ability draft, so a loadout survives the whole match. Speed comes from a
virtual clock (rAF + `setTimeout` queued against a counter, frames batched
through a `MessageChannel` because `setTimeout(0)` is clamped to ~4ms once
nested) — over 200x realtime, about a second per match.

Each ability is played on both sides to cancel any kickoff advantage, and
results carry Wilson intervals. With no abilities the baseline sits at ~48%,
so the sides are symmetric and any gap is the ability.

```
node tools/balance.mjs --n 100 --workers 4 --json out.json
node tools/balance.mjs --only cannon,wall --level hard
```

**50% is not the fair line.** Each ability is played against an *empty*
loadout, so beating 50% is the point — 50% means the ability is worth no more
than nothing, and below 50% it actively hurts its holder. Judge against the
median ability (~54.5%), which the tool prints.

**The AI is not a stand-in for a human.** Engine-native effects (CANNON's power
multiplier, FREEZE, BIG KEEPER, WALL, GLIDE, WET's bounce bias) are measured
faithfully. Abilities needing a manual follow-up input — CHIP's mid-flight tap,
BACKSPIN's aim compensation — read low because the AI misplays them, which is
evidence about the AI, not proof the ability is weak for a human. Check whether
the ability's flag is read in `09-ai.js` before acting on a low number.

### Vendored React — do not reintroduce a CDN

The dc runtime downloads React + ReactDOM from unpkg.com unless
`window.React`/`window.ReactDOM` already exist. That made the game unloadable
when the CDN was blocked, added two blocking round-trips before first paint,
ruled out offline use, and made headless testing impossible. `src/shell.html`
therefore loads `assets/vendor/react*.production.min.js` before the runtime, so
the game makes **zero external requests**. The smoke test enforces this.

Refresh the pinned copies with `node tools/vendor-react.mjs` — it pulls them
from npm and verifies them against the SRI hashes the runtime pins.

## Deployment

Merging to `main` auto-deploys via Vercel — `index.html` plus `assets/` is the
whole deployed game, which is why the built file is committed.

## Other directories

- `assets/generated/` — pixel-art PNGs produced by `tools/gen-assets.mjs` (see `tools/README.md`)
- `tools/` — build + asset generation scripts, not shipped
