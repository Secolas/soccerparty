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
- Model is `gemini-2.5-flash-image-preview` in `gen-assets.mjs`; update it if the
  API changes (see https://ai.google.dev/gemini-api/docs/image-generation).
- AI pixel-art needs a curation/touch-up loop — expect to regenerate and pick.
- Wiring PNGs into the game (loading them and drawing on the canvas) is a
  separate step; ability icons are the easiest to slot in first.
