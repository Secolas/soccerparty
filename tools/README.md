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
   PNGs land in `../assets/generated/`.
4. **Clean up:** key out the magenta background to transparency and downscale
   (any image editor, or a `sharp` script). Keep the good ones.
5. **Commit** the keepers. Merging to `main` deploys them via Vercel — **no
   Vercel configuration needed.**

## Notes
- The generator tries several image-model names (`MODEL_CANDIDATES` in
  `gen-assets.mjs`) and uses the first that responds, since the "Nano Banana"
  model gets renamed as it graduates from preview to GA. If they all 404, add
  the current name from https://ai.google.dev/gemini-api/docs/image-generation.
- The script exits non-zero when it produces zero images, so a broken run shows
  a red ❌ in the Actions tab instead of a misleading green ✅.
- AI pixel-art needs a curation/touch-up loop — expect to regenerate and pick.
- Wiring PNGs into the game (loading them and drawing on the canvas) is a
  separate step; ability icons are the easiest to slot in first.
