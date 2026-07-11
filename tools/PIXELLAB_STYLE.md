# Soccer Party — Art Style Guide (PixelLab)

The one job of this file: **every asset looks like it belongs in the same game.**
Always start a PixelLab prompt with the STYLE PREFIX below, use the recommended
parameters, and lock new work against a reference sprite you already like.

## Direction

Bold, characterful pixel art. Read-at-a-glance silhouettes (Balatro) with a warm,
saturated, richly-lit palette (Dave the Diver). Playful, punchy, a little juicy.

- **Small sprites (≤48px: birds, fans, coin, ball, players):** bold silhouette
  first, LOW detail. If it isn't readable as a black shape, it's wrong.
- **Large assets (backgrounds, UI panels, trophy):** allow rich detail, layered
  shading, atmosphere.

## STYLE PREFIX (paste at the start of every prompt)

> vibrant characterful pixel art, bold clean silhouette, single dark outline,
> saturated palette with warm highlights and cool shadows, chunky readable shapes,
> juicy and playful, high contrast against background, no text, no watermark,
> no drop shadow

## Palette

- Grass/brand green: `#2f8f3e` / accent lime `#c6e84a`
- Netherlands accent (Oranje): warm orange `#ff8c1a`
- Keep 8–16 colors per sprite. Saturated mids, punchy highlights, cool dark shadows.

## Recommended PixelLab parameters

| Parameter   | Small sprites        | Large assets            |
|-------------|----------------------|-------------------------|
| size        | 32 or 48             | 128+                    |
| outline     | single color black   | single color / selective|
| shading     | basic shading        | medium/detailed shading |
| detail      | low detail           | medium/highly detailed  |
| view        | side                 | side / high top-down    |
| proportions | default (chibi ok)   | default                 |

## Consistency workflow

1. Generate the **first** sprite (the bird) with the prefix + params above.
2. Curate: regenerate until you love ONE result. That becomes the **reference**.
3. For every later sprite, tell PixelLab to **match the style of** that reference
   image (PixelLab supports style-reference / same-character generation). This is
   what keeps 30 assets looking like one set instead of thirty guesses.

## Note on existing assets

Current art (`assets/generated/*.png`) was made with Gemini in a "16-bit SNES"
look. Once this PixelLab style is dialed in, plan to **regenerate the visible set**
(fans, coin, ball, backgrounds, UI) so nothing clashes. Don't mix half-and-half.

## First test prompt — the bird

> A small plump bird, side view, mid-flight with wings up, cheerful, bright
> plumage. 4-frame flapping animation. vibrant characterful pixel art, bold clean
> silhouette, single dark outline, saturated palette with warm highlights and cool
> shadows, chunky readable shapes, juicy and playful, high contrast against
> background, no text, no watermark, no drop shadow.
> size 48, side view, single color outline, basic shading, low detail.
> Save frames to assets/generated/.
