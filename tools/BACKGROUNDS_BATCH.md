# Country-Backgrounds Batch — run in LOCAL Claude Code (PixelLab connected)

Regenerate the 16 national backdrops (`vsbg-*.png`) as one cohesive, high-detail
Dave-the-Diver set. These render LARGE behind the team-select / scoreboard panels
(with a dark gradient scrim on top), so this is where painterly detail pays off.

## Fixed spec for EVERY background
- **Size:** 320×320 (matches the current assets; the game shows them `center/cover`).
- **Params:** selective outline · highly detailed shading · highly detailed.
- **Composition:** a packed stadium crowd + atmosphere, framed so the CENTER is a
  bit calmer (a dark scrim + panels sit over the middle — keep key detail toward
  the edges/top). Warm floodlit evening mood.

## STYLE SUFFIX — append to every prompt, unchanged
> detailed expressive pixel art in the style of Dave the Diver, warm rich
> saturated palette, soft painterly shading, atmospheric stadium lighting, deep
> depth of field, cohesive, no text, no lettering, no watermark

## WORKFLOW (don't skip step 1)
1. **Anchor first:** generate ONLY `vsbg-netherlands` a few times, pick the best,
   save it. Eyeball it — is this the mood/detail you want for all 16? Tweak the
   suffix and redo if not.
2. **Batch the rest matching the anchor** — tell PixelLab to match the approved
   Netherlands background's style, palette, lighting, and framing.
3. Save each to `assets/generated/` (overwrite the old `vsbg-*.png`).
4. `git add assets/generated && git commit && git push` → the PR preview updates.

## The 16 (national theme → filename)

**ANCHOR — do this one first:**
- `vsbg-netherlands` — a sea of ORANGE-clad fans, Dutch canal + tulip hints, festive

**Then the rest, each matching the anchor:**
- `vsbg-brazil` — yellow & green carnival crowd, tropical, samba energy
- `vsbg-argentina` — sky-blue & white striped crowd, streamers
- `vsbg-portugal` — red & green fans, sunlit coastal Lisbon rooftops behind
- `vsbg-france` — blue-white-red crowd, faint Eiffel Tower silhouette at dusk
- `vsbg-mexico` — green-white-red fiesta crowd, papel picado banners
- `vsbg-spain` — red & gold crowd, warm sunlit stadium
- `vsbg-england` — red & white crowd, classic terraced stadium, overcast
- `vsbg-germany` — black-red-gold crowd, big modern arena
- `vsbg-italy` — azzurri blue crowd, warm Roman evening tones
- `vsbg-belgium` — red-yellow-black crowd, floodlit
- `vsbg-croatia` — red & white checkerboard crowd, bold pattern
- `vsbg-japan` — blue crowd, cherry-blossom pink accents, soft neon glow
- `vsbg-usa` — red-white-blue crowd, stars, big bright stadium
- `vsbg-iceland` — cool-toned crowd doing the Viking clap, aurora in the sky
- `vsbg-senegal` — green-yellow-red crowd, vibrant, drums, warm sun

## After this set
Next natural PixelLab targets (separate batches): the **menu/title art**
(`menu-bg`, 320×320 — first impression) and the **fan sprites** (`fan-*`, 48×48 —
keep simple, they render small). Ask me and I'll build those worklists too.
