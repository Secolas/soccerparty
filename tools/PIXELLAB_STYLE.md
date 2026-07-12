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
tee+curly hair), grey clothing, subtle idle bob (no jumping). Match the style of the
`fan-standing-*` sheets — chibi proportions (big head), eye-level front view.

**Walk cycles (4-direction):** `prop-street-fan-{n}-walk-{south,north,east,west}-sheet.png`
— 8×48 frames (384×48), one sheet per facing. In the street scene these drive the `sfan`
ambient actor: it paces up (north), turns (east/west), and walks back down (south) along
each sidewalk. Built from PixelLab `walking-8-frames` on the same v2 chibi characters, at a
per-fan uniform scale so a fan doesn't resize when it turns. Frame count is read from
sheet width (`_fanFrame` slices by width/48), so walk (8f) and idle (9f) coexist fine.

### Savanna pitch animals + trees
Pitch `savanna` -> ambience `safari` (country Senegal). Replaced the procedural `drawAntelope`
critters with PixelLab side-view sprites, seagull-style (`drawProp` slices by width/48, `flip` for
direction). Sheets in `assets/generated/`:
- Animals (Nx48 square cells): `prop-savanna-{gazelle,zebra,lion,elephant,giraffe}-sheet.png`.
  Gazelle/zebra walk (cross the plain, v3 walk); lion/elephant/giraffe idle (stand). Quadruped
  bases: horse skeleton (gazelle/zebra/giraffe), lion, bear (elephant). Giraffe uses its front
  (south) view since the horse skeleton short-necks the side view.
- Trees (static 48x48 props, `create_map_object` side view): `prop-savanna-tree-{acacia,baobab}.png`.
Wired via `NS_SAVANNA` + the `sanim` ambient kind (vx!=0 walker w/ direction flip, vx=0 idle/prop).
Trees pushed before animals so they render behind. Sizes ~13-17 (animals) / 26-30 (trees). Later reworked: all savanna decor is drawn in a `drawSavannaTop(now)` pass
(mirrors `drawBeachTop`, runs after the field via `over:true` flags) so nothing hides behind the
pitch. Layout: forest of trees lining the left & right margins, a giraffe on each side, gazelle/zebra
walking the top & bottom touchlines with lion/elephant idling there, seagulls (`kind:'bird'`,
`shadow:true`) gliding diagonally over the pitch, and drifting `kind:'swind'` particles for wind.
The procedural `drawSun`/`drawGiraffe`/`drawElephant`/`drawAcacia` calls for `safari` were removed.

### World scale (human vs animal) — reuse across all pitches
Baseline: a **human sprite draws at ~17px** (beach/street/grass fans). Keep living things in a
believable size hierarchy relative to that:

| Thing            | draw sz | vs human |
|------------------|---------|----------|
| gazelle          | ~15     | ~0.9×    |
| human fan        | 17      | 1×       |
| lion             | ~18     | ~1.05×   |
| zebra            | ~19     | ~1.1×    |
| elephant         | ~28     | ~1.6×    |
| giraffe          | ~30     | ~1.8×    |
| trees (acacia/baobab) | ~30–36 | tower over all |

**Constraint:** the surround bands are thin (top/bottom `CROWD_TB`=10px, sides `CROWD_LR`=12px),
so realistically-sized big animals/trees **cannot sit fully inside them** — they're placed at the
touchlines/corners and deliberately overlap the pitch edge as *foreground framing* (drawn `over:true`).
Strict "zero overlap" would require a wider decorative border (bigger layout change). Runners
(gazelle/zebra) are kept nearer human size so they read as running along the land line.

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
