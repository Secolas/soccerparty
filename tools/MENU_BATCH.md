# Menu Background Batch — run in LOCAL Claude Code (PixelLab connected)

Regenerate `menu-bg.png` (320×320) — the main-menu backdrop and the game's first
impression. Rendered full-bleed `center bottom / cover` with a dark gradient over
it and the title + menu buttons on top.

## Fixed spec
- **Size:** 320×320 (matches current asset).
- **Params:** selective outline · highly detailed shading · highly detailed.
- **Composition:** hero focal interest in the UPPER 2/3 (a dramatic stadium /
  pitch scene). Keep the BOTTOM calmer and less busy — the menu buttons sit there
  and a dark scrim covers it. No text (the title is drawn by the game).

## STYLE SUFFIX — append to the prompt
> detailed expressive pixel art in the style of Dave the Diver, warm rich
> saturated palette, soft painterly shading, dramatic stadium floodlights, deep
> depth of field, epic inviting mood, no text, no lettering, no watermark

## Prompt
> A dramatic hero shot of a floodlit soccer stadium at dusk — lush green pitch,
> packed glowing crowd, a ball on the center spot catching the light, warm rim
> light, cinematic. Focal interest in the upper two-thirds, calmer toward the
> bottom. [STYLE SUFFIX above]. size 320, selective outline, highly detailed
> shading, highly detailed. Save to assets/generated/menu-bg.png.

## Workflow
1. Generate 4–6 candidates, pick the most inviting one.
2. If you've already approved a `vsbg` anchor, tell PixelLab to match its palette
   and lighting so the menu and the country screens feel like one game.
3. Save → `git add assets/generated/menu-bg.png && git commit && git push` →
   PR preview updates.

## NOT worth generating (orphan assets — unused by the game)
`ui-board.png`, `tile-wood.png`, `tile-grass.png` are not referenced anywhere.
The wood panels and grass are drawn in code, so regenerating these does nothing.
Skip them.
