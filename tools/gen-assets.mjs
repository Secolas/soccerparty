// Build-time asset generator for Soccer Party, using the Gemini API.
//
// The API key NEVER ships in the game. You run this locally, review the PNGs,
// keep the good ones, and commit them. The static game just loads the PNGs.
//
// Usage:
//   cd tools
//   npm install
//   echo "GEMINI_API_KEY=your_key_here" > .env      # .env is gitignored
//   node gen-assets.mjs                              # writes ../assets/generated/*.png
//
// If the model name errors, check the current one at:
//   https://ai.google.dev/gemini-api/docs/image-generation

import { GoogleGenAI } from "@google/genai";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { processIcon, processSheet, ICON_SIZE } from "./process-icon.mjs";

// ---- load key from tools/.env (or the environment) ----
const __dir = dirname(fileURLToPath(import.meta.url));
(function loadEnv() {
  const f = join(__dir, ".env");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Missing GEMINI_API_KEY. Put it in tools/.env or the environment.");
  process.exit(1);
}

// Gemini image models ("Nano Banana"). Names change as models graduate from
// preview to GA, so we try each in order and use the first that responds.
// Update the list if the API changes: https://ai.google.dev/gemini-api/docs/image-generation
const MODEL_CANDIDATES = [
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
];

// Style for small ability icons / single sprites: solid magenta background so the
// post-processor can flood-fill it out to transparency.
const ICON = "16-bit SNES pixel art, chunky visible pixels, clean bold silhouette, " +
  "vibrant retro palette, centered subject, flat solid #FF00FF magenta background, " +
  "no text, no lettering, no drop shadow, no gradient background";

// Style for larger scene assets (crowd, wooden board) kept as-is (no keying),
// matching the detailed, lush pixel-art look of the reference art.
const SCENE = "detailed 16-bit pixel art, rich shading, warm stadium atmosphere, " +
  "cohesive retro palette, no text, no lettering, no watermark";

// Prefix for image-to-image board prompts (the reference image conditions it).
const ENH = "Redraw and upgrade this reference texture in chunky 16-bit pixel art, " +
  "matching its palette and top-down style, no text, no watermark.";

// One entry per asset.
//   keyOut (default true) -> flood-fill background to transparency + trim + downscale
//   keyOut:false          -> keep the whole frame, just downscale (scene backgrounds)
//   size                  -> final square px (icons small, sprites medium, scenes large)
const ASSETS = [
  // Ability icons (small, transparent)
  { file: "icon-cannon.png",    size: 64,  prompt: `A classic black iron artillery cannon on wooden spoked wheels with a lit fuse, side view, game power-up icon. ${ICON}` },
  { file: "icon-curveball.png", size: 64,  prompt: `A ripe banana power-up icon (curveball). ${ICON}` },
  { file: "icon-glide.png",     size: 64,  prompt: `A shiny pale-blue ice cube power-up icon (glide). ${ICON}` },
  { file: "icon-magnet.png",    size: 64,  prompt: `A red horseshoe magnet power-up icon. ${ICON}` },
  { file: "icon-sticky.png",    size: 64,  prompt: `A golden honey pot power-up icon (sticky). ${ICON}` },
  { file: "icon-sniper.png",    size: 64,  prompt: `A military sniper rifle with a large telescopic scope, side view, game power-up icon. ${ICON}` },

  // Crowd fans — 2-frame animation sheets (rest pose | cheer pose). Both poses
  // of the SAME character in one image so they stay coherent; the processor
  // splits them into fan-N-1.png (rest) and fan-N-2.png (cheer). The game bobs
  // between the two frames and jumps them on goals.
  { file: "fan-1", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character at the same size and position. LEFT frame: standing relaxed, arms down. RIGHT frame: both arms raised cheering. Red jersey, dark skin, front view, full body. Clear vertical gap between the two frames. ${ICON}` },
  { file: "fan-2", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing, arms down. RIGHT: waving a little flag overhead. Blue jersey, light skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-3", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing, arms down. RIGHT: both fists punching up. Yellow jersey, brown skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-4", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing, arms down. RIGHT: arms up clapping. Green jersey, dark skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-5", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing holding a scarf low. RIGHT: holding the scarf stretched overhead. White jersey, light skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-6", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing on the ground. RIGHT: jumping with joy, arms up. Orange jersey, brown skin, front view, full body. Clear gap between frames. ${ICON}` },

  // Animal mascots — 2-frame animation sheets (rest | active)
  { file: "sprite-dog",  frames: 2, size: 72, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small brown dog side by side, identical character. LEFT: standing calm. RIGHT: front paws up leaping happily, tail wagging. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },
  { file: "sprite-goat", frames: 2, size: 72, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small grey goat side by side, identical character. LEFT: standing calm. RIGHT: rearing up on hind legs. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },
  { file: "sprite-cat",  frames: 2, size: 64, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small orange tabby cat side by side, identical character. LEFT: sitting. RIGHT: stretching with tail up. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },
  { file: "sprite-bird", frames: 2, size: 56, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small blue bird side by side, identical character. LEFT: wings folded. RIGHT: wings spread up. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },

  // Static decor + ground tiles + scoreboard skin
  { file: "sprite-tree.png", size: 96,  keyOut: true,  prompt: `A single lush round green tree with a brown trunk, side view. ${ICON}` },
  { file: "tile-grass.png",  size: 128, keyOut: false, prompt: `A seamless top-down lush green grass texture tile, subtle blades, pixel art, edges tile seamlessly. ${SCENE}` },
  { file: "tile-wood.png",   size: 128, keyOut: false, prompt: `A seamless horizontal wooden plank bleacher texture tile, warm brown boards, pixel art, edges tile seamlessly. ${SCENE}` },
  { file: "ui-board.png",    size: 256, keyOut: false, prompt: `A horizontal scoreboard panel made of carved wooden planks with brass corner brackets, empty face with no text, clean front-on view. ${SCENE}` },

  // Board surface textures — IMAGE-TO-IMAGE: the reference (refs/board-*.png) is
  // a swatch of the game's ORIGINAL surface, so Gemini keeps the same colours and
  // layout but adds richer detail (grain, cracks, wear). Filled into the play area.
  { file: "board-wood.png",   ref: "refs/board-wood.png",   size: 256, keyOut: false, solid: true, prompt: `${ENH} Keep the SAME warm wooden plank layout and colours as the reference, but make it a richly detailed seamless top-down wood floor: real wood grain, a few knots, subtle worn patches, crisp plank seams. Tile seamlessly. No lines or markings.` },
  { file: "board-grass.png",  ref: "refs/board-grass.png",  size: 256, keyOut: false, solid: true, prompt: `${ENH} Keep the SAME green mowing-stripe pattern and colours as the reference, but make it lush detailed grass: fine blades, subtle wear and faint mud patches. Tile seamlessly. No lines or markings.` },
  { file: "board-street.png", ref: "refs/board-street.png", size: 256, keyOut: false, solid: true, prompt: `${ENH} Keep the SAME grey asphalt tone as the reference, but make it a detailed street court: visible cracks, patched tar, small pebbles and scuff marks. Tile seamlessly. No lines or markings.` },
  { file: "board-beach.png",  ref: "refs/board-beach.png",  size: 256, keyOut: false, solid: true, prompt: `${ENH} Keep the SAME sandy tone as the reference, but make it detailed beach sand: rippled dunes, footprints, tiny shells and speckle. Tile seamlessly. No lines or markings.` },
  { file: "board-neon.png",   ref: "refs/board-neon.png",   size: 256, keyOut: false, solid: true, prompt: `${ENH} Keep the SAME dark neon look and colours as the reference, but make it a detailed glowing arcade court: crisp neon grid, soft glow gradients, subtle scanlines. Tile seamlessly. No text.` },
  { file: "board-ice.png",    ref: "refs/board-ice.png",    size: 256, keyOut: false, solid: true, prompt: `${ENH} Keep the SAME pale-blue icy tone as the reference, but make it detailed ice: fine cracks, frost patches and a glossy sheen. Tile seamlessly. No lines or markings.` },
];

const ai = new GoogleGenAI({ apiKey: KEY });
const OUT = join(__dir, "..", "assets", "generated");
mkdirSync(OUT, { recursive: true });

// Ask a candidate model for one image. Returns the base64 data, or throws.
// If refB64 is given, run image-to-image (the reference conditions the output).
async function tryGenerate(model, prompt, refB64) {
  const contents = refB64
    ? [{ text: prompt }, { inlineData: { mimeType: "image/png", data: refB64 } }]
    : prompt;
  const res = await ai.models.generateContent({
    model,
    contents,
    config: { responseModalities: ["Text", "Image"] },
  });
  const parts = res?.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) throw new Error("no image in response");
  return img.inlineData.data;
}

// Discover which candidate model this key/API version actually supports, so we
// only pay the discovery cost once instead of on every asset.
let MODEL = null;
let ok = 0;

for (const a of ASSETS) {
  process.stdout.write(`Generating ${a.file} ... `);
  const models = MODEL ? [MODEL] : MODEL_CANDIDATES;
  let done = false;
  let lastErr = "";
  const refB64 = a.ref ? readFileSync(join(__dir, a.ref)).toString("base64") : null;
  for (const model of models) {
    try {
      const data = await tryGenerate(model, a.prompt, refB64);
      const raw = Buffer.from(data, "base64");
      // Always ship game-ready assets. Multi-frame assets are split into N
      // separate frame PNGs (base-1.png..base-N.png); everything else is a
      // single (optionally keyed) downscaled PNG. Fall back to raw on failure.
      if (a.frames && a.frames > 1) {
        const base = a.file.replace(/\.png$/, "");
        let frames;
        try {
          frames = processSheet(raw, { size: a.size || ICON_SIZE, frames: a.frames });
        } catch (pe) {
          console.log(`(kept raw sheet, split failed: ${pe.message}) `);
          frames = [raw];
        }
        frames.forEach((b, i) => writeFileSync(join(OUT, `${base}-${i + 1}.png`), b));
      } else {
        let outBuf = raw;
        try {
          outBuf = processIcon(raw, { size: a.size || ICON_SIZE, keyOut: a.keyOut !== false, solid: a.solid === true });
        } catch (pe) {
          console.log(`(kept raw, post-process failed: ${pe.message}) `);
        }
        writeFileSync(join(OUT, a.file), outBuf);
      }
      MODEL = model; // lock in the working model for the rest
      console.log(`ok (${model}, ${a.frames ? a.frames + "f " : ""}${a.size || ICON_SIZE}px)`);
      ok++;
      done = true;
      break;
    } catch (e) {
      lastErr = e.message;
    }
  }
  if (!done) console.log("FAILED:", lastErr);
}

if (ok === 0) {
  console.error(
    `\nNo assets were generated. Tried models: ${MODEL_CANDIDATES.join(", ")}. ` +
    "Check the error above (usually a bad/expired GEMINI_API_KEY or a renamed " +
    "model). Current model names: https://ai.google.dev/gemini-api/docs/image-generation"
  );
  process.exit(1); // fail the job so the run shows red, not a misleading green
}

console.log(
  `\nDone -> assets/generated/ (${ok}/${ASSETS.length}). Next: clean them up ` +
  "(key out the magenta to transparency, downscale to ~24px), keep the good ones."
);
