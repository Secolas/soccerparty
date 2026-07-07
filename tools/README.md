# Asset generator (local, build-time)

Generates game art with the Gemini API **on your machine**. The API key never
ships in the game and never goes to Vercel — you commit the resulting PNGs and
the existing GitHub → Vercel auto-deploy publishes them.

## What you do

1. **Get a key:** https://aistudio.google.com → *Get API key*.
2. **Store it locally (never commit it):**
   ```
   cd tools
   echo "GEMINI_API_KEY=paste_your_key_here" > .env
   ```
   `.env` is gitignored.
3. **Install + run:**
   ```
   npm install
   npm run gen
   ```
   Game-ready PNGs land in `../assets/generated/` — the generator **auto-processes
   each one** (keys out the flat background to transparency and downscales to a
   crisp 64px, via `process-icon.mjs`). No manual clean-up needed.
4. **Commit** the ones you like. Merging to `main` deploys them via Vercel — **no
   Vercel configuration needed.** The ability icons are already wired into the
   scoreboard slots (`ICON_SRC`/`slotFace` in the game), with the emoji as a
   fallback if a PNG is missing.

## Notes
- The generator tries several image-model names (`MODEL_CANDIDATES` in
  `gen-assets.mjs`) and uses the first that responds, since the "Nano Banana"
  model gets renamed as it graduates from preview to GA. If they all 404, add
  the current name from https://ai.google.dev/gemini-api/docs/image-generation.
- The script exits non-zero when it produces zero images, so a broken run shows
  a red ❌ in the Actions tab instead of a misleading green ✅.
- AI pixel-art needs a curation loop — expect to regenerate and pick favourites.
- Icon size is `ICON_SIZE` in `process-icon.mjs` (64px, a clean ÷16 downscale
  from the 1024px source that fits the 26px scoreboard slots). Change it there.
- Background removal is a flood-fill from the image edges, so it only clears the
  background actually connected to the border — a coloured pixel *inside* the
  subject is never punched out.
