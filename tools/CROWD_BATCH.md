# Crowd-Sprite Batch (PixelLab) — the fans in the side stands

Authoring spec for `assets/generated/fan-*-sheet.png`, the cheering crowd in the
left and right stands. The stands are now wide enough to show these at full size
in two columns, so this art is the main thing standing between the game and the
promo-video look.

## THE SIZE RULE — 32×32, non-negotiable

**Author every frame at exactly 32×32.** The game draws fans at 32px
(`FAN_PX` in `src/game/01-layout.js`), and when the sheet's frame size equals the
draw size the blit is 1:1 and pixel-perfect.

This is the whole reason the old crowd looked mushy: the sheets were 48px and the
game drew them at 17px. That is a 2.82x non-integer reduction, so it dropped
pixels irregularly and turned faces into speckle. Any mismatch resamples and
softens the art — 32×32 in, 32px out, nothing lost.

(The engine reads the frame size from the sheet *height*, so a 48px sheet still
loads; it just gets resampled down to 32 and loses detail. Don't rely on it.)

## Sheet format

- **Frame:** 32×32, transparent background.
- **Sheet:** frames laid out horizontally, left to right, in ONE png. The engine
  computes `frames = sheet.width / sheet.height`, so any frame count works —
  4 is a good default (→ a 128×32 sheet).
- **Filename:** `fan-<pose>-<n>-sheet.png` in `assets/generated/`, overwriting
  the existing sheets. Poses and variants below.
- **Anchoring:** feet on the BOTTOM edge of the frame, centred horizontally. The
  game draws fans feet-down; art floating in the frame will hover.

## THE RECOLOUR RULE — grey shirts

The game recolours each fan at runtime so one sprite serves every team and a
festive mix of casual colours (`_fanFrame` in `src/game/05-ambience.js`). It
repaints only the pixels that are **low-saturation AND mid-luminance**:
`saturation < 0.22` and `luma` between `60` and `236`.

So:

- **Draw the shirt in MID-TO-LIGHT GREY — not pure white.** Pure white is luma
  255, above the band, and would stay white for every team. Aim for a grey around
  40–80% brightness with its shading inside that range.
- **Skin, hair, shorts and shoes should be COLOURFUL** — saturated colour is
  ignored by the recolour pass, so it survives untouched. (The top of the hair is
  additionally protected, scaled from the frame size.)
- **The outline should be very dark** (luma under 60) so it is below the band and
  never repainted as shirt.
- **Flag-holders:** draw the flag cloth as plain grey too — the engine paints the
  correct national flag onto the upper part of that cloth. A pre-coloured flag
  will not become the right country.

## Readability at 32px

These render 32px on a dark stand, so:

- **A thick, near-black outline all the way around** is what separates each fan
  from the crowd behind it. This mattered more than any other single thing in
  testing — outline-less fans blurred into the background.
- **Bold shapes over fine detail.** Faces should be a few decisive pixels (eyes,
  open shouting mouth), not soft shading.
- **Silhouette first:** raised arms, a scarf held overhead, a flag on a pole —
  the pose should be readable from the outline alone.

## The poses (4 variants each, 16 sheets total)

Vary faces, hair colour, skin tone and build across variants so the stand doesn't
look cloned. Keep the shirt grey on every one.

- **`fan-standing-<n>-sheet.png`** — standing, BOTH ARMS RAISED, mouth open
  shouting; a 1–2px vertical bounce across the frames.
- **`fan-scarf-<n>-sheet.png`** — holding a scarf stretched overhead with both
  hands, waving side to side across the frames. Scarf is grey.
- **`fan-flag-<n>-sheet.png`** — holding a flag on a thin pole, cloth flying to
  one side and rippling across the frames. Cloth is plain grey.
- **`fan-seated-<n>-sheet.png`** — a calmer seated spectator, gentle clap; these
  fill the outer column and read as depth.

## STYLE PREFIX — paste at the start of every prompt

> chunky retro pixel art sprite, THICK NEAR-BLACK OUTLINE around the whole
> character, bold high-contrast saturated colours, strong simple readable
> silhouette, low detail, few colours, rounded friendly proportions, cheerful
> stadium football fan, full body head to feet, front view, feet at the bottom of
> the frame, MID-GREY shirt with no colour or pattern (it is recoloured in game),
> colourful hair skin shorts and shoes, transparent background, no text, no
> watermark, no drop shadow

## Workflow

1. **Anchor first:** make ONLY `fan-standing-1` at 32×32, pick the best, then
   **verify the recolour** — rebuild (`node tools/build-game.mjs`), open the game,
   start an exhibition, and check the shirt takes the team colour. If it stays
   grey or stays white, the shirt luma is outside the 60–236 band; fix it before
   making 15 more.
2. **Batch the rest matching the anchor** so all 16 read as one crowd.
3. Save into `assets/generated/`, overwriting the old sheets.
4. `node tools/build-game.mjs` → `node tools/smoke.mjs` → commit.

## Checks after dropping the art in

- Shirts show varied team/casual colours (recolour working), flags show the right
  nations, and each fan is separable from its neighbour at 32px.
- The stands are cropped on a phone and full-width on desktop — check both.
- `node tools/smoke.mjs` still passes.
