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
