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
- `17-boot.js` — resize hooks, pause menu, boot sequence

All files run inside one `componentDidMount()` scope, so code in any file can
call functions and read variables defined in any other file. New sections can
be added as new numbered files.

## Workflow

1. Edit files under `src/`
2. Rebuild: `node tools/build-game.mjs`
3. Sanity-check: `node tools/build-game.mjs --check`
4. Commit **both** the `src/` changes and the regenerated `index.html`

CI (`.github/workflows/verify-build.yml`) fails any push where `index.html`
doesn't match `src/`, so a stale or hand-edited `index.html` can't slip in.

## Deployment

Merging to `main` auto-deploys via Vercel — `index.html` plus `assets/` is the
whole deployed game, which is why the built file is committed.

## Other directories

- `assets/generated/` — pixel-art PNGs produced by `tools/gen-assets.mjs` (see `tools/README.md`)
- `tools/` — build + asset generation scripts, not shipped
