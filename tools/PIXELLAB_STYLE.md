# Soccer Party — Art Style Guide (PixelLab)

**Direction: Dave the Diver.** Detailed, warm, expressive pixel art — soft
painterly shading, rich saturated palette, rounded friendly characters, subtle
rim light, cozy vibrant mood. Every asset should feel like it came from one
warm, hand-crafted set.

The old Gemini "SNES" assets (goat, blue bird, chunky icons) are **retired** — we
are regenerating the visible set in this style. Do not mix the two looks.

## STYLE PREFIX (paste at the start of every prompt)

> detailed expressive pixel art in the style of Dave the Diver, warm rich
> saturated palette, soft painterly shading with smooth gradients, subtle rim
> light, rounded friendly proportions, clean readable forms, cozy vibrant mood,
> no text, no watermark, no drop shadow

## The size rule (READ THIS)

Dave-the-Diver detail needs pixels. Match detail to how big the asset renders:

| Asset renders...        | size    | shading          | detail          | outline           |
|-------------------------|---------|------------------|-----------------|-------------------|
| Large (bg, menu, mascot)| 128+    | highly detailed  | highly detailed | selective outline |
| Medium (trophy, panels) | 64–96   | detailed shading | medium detail   | selective outline |
| Small (gameplay sprites)| 32–48   | basic shading    | low detail      | single color      |

For the small tier, keep the Dave-the-Diver *palette and warmth* but simplify —
a bold, readable silhouette beats detail that turns to mush at 32px.

## Palette

- Grass green `#2f8f3e`, accent lime `#c6e84a`, Oranje `#ff8c1a`
- Warm saturated mid-tones, soft highlights, gentle cool shadows (not pure black)
- Soft selective outlines on big assets; a single darker outline on tiny sprites

## Consistency workflow

1. Generate ONE hero asset you love in this style → it becomes the **reference**.
2. For everything after, tell PixelLab to **match the style of** that reference
   image. This is what makes 30 assets look like one set.
3. Curate hard: regenerate until on-model before saving.

## Animated actors (fans, spectators, mascots) — spritesheet spec

Every animated **person/creature the game tints and loops** uses ONE format so it
drops into the existing slicer/tint code with zero changes:

- **Sheet:** one horizontal strip, **432×48 px**, RGBA, **transparent background**.
- **Frames:** **9 frames of 48×48** (the slicer assumes 9). Read left→right as a loop.
- **Framing:** **front-facing**, full body, **feet on the bottom edge** of each 48px
  cell. The game plants feet at a y-position and lets the pitch frame clip the body,
  exactly like the grass stands.
- **Tintable clothing = neutral mid-grey.** The recolor pass (`_fanFrame`) repaints
  only *near-grey* pixels (low saturation, mid luminance) with the team / skin color.
  So anything you want recolored **must be grey**; keep skin, hair, and fixed-color
  details in their real colors so they survive.
- Keep the Dave-the-Diver palette/warmth but **simplify at this size** — bold readable
  silhouette, a single darker outline (small tier, per the size rule above).

### Naming
- Match/menu fans: `fan-<pose>-<n>-sheet.png` — poses in use: `standing`, `seated`,
  `scarf`, `flag`.
- Themed scenery actors & props: `prop-<theme>-<name>[-<n>]-sheet.png` (animated) or
  `prop-<theme>-<name>.png` (static 48×48). Examples: `prop-beach-seagull-1-sheet.png`,
  `prop-beach-umbrella-red.png`, `prop-street-fan-1-sheet.png`.

### Reusable actor prompt
> [STYLE PREFIX] + `<who / wardrobe>`, front view, full body, feet at the bottom of
> the frame. `<idle / celebrating / seated>` animation, **9 frames**. Clothing a
> **neutral mid-grey** so the game recolors it; natural skin and hair. size 48, front
> view, single-color outline, basic shading. Export as **one horizontal spritesheet
> 432×48 (9 × 48px frames), transparent background.** Save to
> `assets/generated/<name>-sheet.png`.

### Current task — street pitch spectators
`prop-street-fan-{1,2,3}-sheet.png` — idle urban onlookers (hoodie+cap / jacket+beanie /
different build), grey clothing, subtle idle bob (no jumping). Match the style of the
`fan-standing-*` sheets.

## Test prompt — Dave-the-Diver bird (generate BIG so detail shows)

> A plump friendly bird, side view, mid-flight with wings raised, bright warm
> orange plumage, cheerful expressive face. 4-frame flapping animation. detailed
> expressive pixel art in the style of Dave the Diver, warm rich saturated
> palette, soft painterly shading with smooth gradients, subtle rim light, rounded
> friendly proportions, cozy vibrant mood, no text, no watermark, no drop shadow.
> size 128, side view, selective outline, highly detailed shading, highly
> detailed. Save frames to assets/generated/.

Generate at 128px so the Dave-the-Diver look is visible; the game can downscale
per-use. Don't judge the style on a 32px render.
