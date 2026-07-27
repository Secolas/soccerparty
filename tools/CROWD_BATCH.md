# Crowd-Sprite Batch — run in LOCAL Claude Code (PixelLab connected)

Regenerate the stadium crowd characters (`fan-*-sheet.png`) as one cohesive,
higher-detail Dave-the-Diver set — the fans in the stands and behind the goals.
This is the art upgrade that makes the crowd read like the promo video instead
of the older, flatter sprites.

## READ THIS FIRST — the recolor constraint (most important thing here)

The game **recolors each fan at runtime** so one sprite serves every team and a
festive mix of casual colours. It does this by recolouring the **low-saturation
(grey/white) pixels** of the sprite — see `_fanFrame` in `src/game/05-ambience.js`.
So the source art MUST follow these rules or the tinting breaks:

- **Draw the shirt/jersey in plain WHITE or light GREY.** The engine paints the
  team/casual colour onto those grey pixels. A shirt drawn red in the source can
  never be recoloured — it will stay red for every team.
- **Skin, hair, shorts, shoes stay coloured** — they are saturated, so the
  recolour leaves them alone (the top ~15px of hair is explicitly preserved).
- **Flag-holders (`fan-flag-*`): draw the flag cloth in plain WHITE/GREY too.**
  The engine paints the correct national flag onto the top portion of that grey
  cloth (`_flagTintFor`). A pre-coloured flag will not become the right country.
- Keep a **single dark outline** and a clean, readable silhouette. At 48px
  drawn down to ~17px in play, detail turns to mush — bold shapes read, fine
  shading does not (see `PIXELLAB_STYLE.md`, the small-tier rule).

## Fixed spec for EVERY sprite

- **Frame size:** 48×48. Export each pose as a **horizontal sprite sheet**
  (frames laid left-to-right, each 48px wide). The engine reads
  `frames = sheet.width / 48` automatically, so any frame count works — 4 is a
  good default.
- **Filename:** `fan-<pose>-<n>-sheet.png` in `assets/generated/`, overwriting
  the old sheets. Poses and variant count below.
- **Anchoring:** feet at the bottom of the frame, centred horizontally
  (the game draws the sprite feet-down).
- **Params:** single outline · basic shading · low detail · white/grey shirt.
- **No text, no watermark, no drop shadow, transparent background.**

## STYLE PREFIX — paste at the start of every prompt

> detailed expressive pixel art in the style of Dave the Diver, warm rich
> saturated palette, rounded friendly proportions, clean bold readable
> silhouette, single dark outline, cozy vibrant mood, tiny stadium fan
> character, WHITE/LIGHT-GREY shirt (recolourable), transparent background,
> no text, no watermark, no drop shadow

## The poses (pose → filename → what it does)

Generate **4 variants** of each pose (`-1` … `-4`) so the crowd looks varied —
different faces, hair colours, skin tones, builds, and slightly different arm
positions. Keep the shirt grey on every one.

- **`fan-standing-<n>-sheet.png`** — a fan standing and cheering, both arms
  raised, mouth open shouting, a small up-and-down bounce across the 4 frames.
- **`fan-scarf-<n>-sheet.png`** — a fan holding a football **scarf** stretched
  overhead with both hands, waving it side to side across the frames.
- **`fan-flag-<n>-sheet.png`** — a fan holding a **flag on a pole**; the flag
  cloth is a plain white/grey rectangle (the engine paints the nation onto it),
  rippling across the frames. Bias the flag to one side so it mirrors cleanly.
- **`fan-seated-<n>-sheet.png`** — a calmer seated spectator, gentle clap or
  lean, subtle motion — these fill the back rows and read as depth.

## WORKFLOW (don't skip step 1)

1. **Anchor first:** generate ONLY `fan-standing-1` a few times at 48px, pick
   the best on-model one, and **check it recolours** — open the built game
   (`node tools/build-game.mjs`) and confirm the shirt takes the team colour. If
   the shirt won't recolour, the source shirt isn't grey — fix and redo before
   generating the rest.
2. **Batch the rest matching the anchor** — tell PixelLab to match the approved
   `fan-standing-1` for palette, proportion, outline weight, and framing, so all
   16 sheets feel like one set.
3. Save each to `assets/generated/` (overwrite the old `fan-*-sheet.png`).
4. Commit the PNGs. On the web/remote side I rebuild and smoke-test; the V2
   crowd composition (tiered fans behind the goals, national flags, floodlights)
   already consumes these filenames, so better art drops straight in with no
   code change.

## Sanity check after generating

- `node tools/build-game.mjs` then open the game — start an exhibition and look
  at the stands and behind the goals.
- Confirm: shirts show varied team/casual colours (recolour working), flags
  show the right nations, silhouettes read clearly at play size.
- `node tools/smoke.mjs` should still pass (booted, rendered, zero external
  requests).
