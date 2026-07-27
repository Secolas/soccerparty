# Local art workflow (Git Bash + PixelLab)

How to pull this branch onto your machine, author sprites in PixelLab, and get
them into the game with the checks passing.

Branch: **`claude/game-visual-style-mjrcpl`** · Repo: `Secolas/soccerparty`

---

## 1. One-time setup

Install **Node 22** (what CI uses) from https://nodejs.org, then in Git Bash:

```bash
cd ~
git clone https://github.com/Secolas/soccerparty.git
cd soccerparty
git fetch origin claude/game-visual-style-mjrcpl
git checkout claude/game-visual-style-mjrcpl
node --version        # expect v22.x
```

Install the browser the smoke test drives (once, ~150 MB):

```bash
npm i --no-save playwright@1.49.1
npx playwright install --with-deps chromium
```

## 2. Every session: get the latest first

```bash
git checkout claude/game-visual-style-mjrcpl
git pull origin claude/game-visual-style-mjrcpl
```

## 3. Build and look at the game

`index.html` is **generated** — never edit it by hand. After any change under
`src/` or `assets/`:

```bash
node tools/build-game.mjs
```

To view it, serve over **HTTP** — opening `index.html` as a `file://` URL fails
because the page fetches its own bundle and CORS blocks it:

```bash
python -m http.server 8000
# then open http://localhost:8000/index.html
```

(If you don't have Python: `npx serve -l 8000 .`)

## 4. The three checks (all must pass before pushing)

```bash
node tools/build-game.mjs --check              # index.html matches src/
node tools/fmt.mjs --check --limit 2000        # no monster source lines
node tools/smoke.mjs                           # boots, plays, zero external requests
```

`node tools/smoke.mjs --shots shots/` writes a screenshot per stage, which is the
quickest way to eyeball new art in context. `--headed` watches it run.

## 5. Authoring the crowd in PixelLab

Files: `assets/generated/fan-<pose>-<n>-sheet.png` — four poses
(`standing`, `scarf`, `flag`, `seated`) × four variants (`1`–`4`) = 16 sheets.

### Format (match the existing sheets exactly for a drop-in replacement)

| | value |
|---|---|
| Frame | **48×48**, transparent background |
| Sheet | frames laid out **horizontally**, one PNG. Existing sheets are 9 frames → **432×48**. Any count works — the engine computes `frames = width / 48` |
| Anchor | feet on the **bottom** edge, centred horizontally (fans are drawn feet-down) |

### The recolour rule — read this before making 16 of anything

The game recolours each fan at runtime so one sprite serves every team and a mix
of casual colours (`_fanFrame` in `src/game/05-ambience.js`). It repaints **only**
pixels that are low-saturation **and** mid-luminance:

> `saturation < 0.22` **and** `luma` between **60 and 236**

Therefore:

- **Shirts: mid-to-light GREY — not pure white.** Pure white is luma 255, above
  the band, so it would stay white for every team.
- **Skin, hair, shorts, shoes: COLOURFUL.** Saturated colour is ignored by the
  recolour pass, so it survives untouched.
- **Outline: very dark** (luma under 60) so it sits below the band and is never
  repainted as shirt.
- **Flag-holders:** the flag cloth must be plain grey too — the engine paints the
  correct nation onto the upper part of that cloth. A pre-coloured flag will not
  become the right country.

### Style, to match the promo video

> chunky retro pixel art sprite, THICK NEAR-BLACK OUTLINE around the whole
> character, bold high-contrast saturated colours, strong simple readable
> silhouette, low detail, few colours, rounded friendly proportions, cheerful
> stadium football fan, full body head to feet, front view, feet at the bottom of
> the frame, MID-GREY shirt with no colour or pattern (it is recoloured in game),
> colourful hair skin shorts and shoes, transparent background, no text, no
> watermark, no drop shadow

A **thick dark outline** matters more than any other single thing: these render
small against a dark stand, and an outline-less fan blends into the crowd behind
it. Bold shapes beat fine shading — the face should be a few decisive pixels
(eyes, open shouting mouth).

### Order of work (don't skip step 1)

1. **Anchor:** make ONLY `fan-standing-1` first. Rebuild, open the game, start an
   exhibition and check **the shirt takes the team colour**. If it stays grey or
   stays white, the shirt luma is outside 60–236 — fix it before making 15 more.
2. **Batch the rest matching the anchor** so all 16 read as one crowd. In PixelLab
   this means telling it to match the approved anchor's palette and outline.
3. Save into `assets/generated/`, overwriting the old sheets.
4. Build, run the three checks, commit, push.

### ⚠ Pending: the render size

Right now the game draws fans at **17px** from these 48px sheets. That is a 2.82×
non-integer reduction, which drops pixels irregularly and is what made the old
crowd look mushy. **Author at 48×48 anyway** — it is the drop-in size and the
better source of truth — then tell me the art is in and I'll match the render size
to it so nothing gets resampled. That is a small, contained change on my side.

## 6. Other assets worth revamping

All in `assets/generated/`, all PNG:

| Group | Count | Size | What it is |
|---|---|---|---|
| `vsbg-<country>.png` | 16 | 320×320 | Backdrop behind the team-select / scoreboard panels. Renders LARGE — detail pays off most here |
| `menu-bg.png` | 1 | 320×320 | Main-menu backdrop, the game's first impression |
| `crowdbg-<country>.png` | 16 | 320×320 | Crowd backdrop art |
| `icon-*.png` | ~68 | 64×64 (trophy 96) | Ability / menu icons. Bold silhouette, reads at ~26px |
| `sprite-*.png`, `prop-*.png` | ~24 | varies | Pitch scenery (bushes, cactus, seagulls, sailboats) |

For the 320×320 backdrops, generate **big and detailed** — they are shown
`center/cover` with a dark scrim over them, so keep key detail toward the
edges/top and the centre calmer, because panels sit over the middle.

**Skip these** — they are not referenced anywhere in the game, so regenerating
them does nothing: `ui-board.png`, `tile-wood.png`, `tile-grass.png`.

## 7. Committing back

```bash
git add assets/generated src index.html
git commit -m "Revamp crowd fan sprites in the video style"
git push origin claude/game-visual-style-mjrcpl
```

Push triggers CI (`verify` + `smoke`) and a Vercel preview on PR #278. If
`verify` fails you almost certainly forgot `node tools/build-game.mjs` before
committing — rebuild, amend, push again.

## Gotchas

- **Never hand-edit `index.html`.** CI fails any push where it doesn't match
  `src/`. Always rebuild.
- **Commit both** the `src/`/`assets/` change and the regenerated `index.html`.
- **The game makes zero external requests** by design, and the smoke test
  enforces it. Don't add a CDN font, script, or image URL.
- **`file://` won't work** — serve over HTTP (step 3).
