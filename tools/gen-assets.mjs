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

// Shared style so every asset matches. Solid magenta background = easy to
// key out to transparency in the post-process step.
const STYLE =
  "16-bit SNES pixel art, chunky visible pixels, clean bold silhouette, " +
  "vibrant retro palette, centered subject, flat solid #FF00FF magenta background, " +
  "no text, no lettering, no drop shadow, no gradient background";

// One entry per asset. Start with the ability icons; add crowd/board later.
const ASSETS = [
  { file: "icon-cannon.png",    prompt: `A glowing lightning-bolt cannon power-up icon. ${STYLE}` },
  { file: "icon-curveball.png", prompt: `A ripe banana power-up icon (curveball). ${STYLE}` },
  { file: "icon-glide.png",     prompt: `A shiny ice cube power-up icon (glide). ${STYLE}` },
  { file: "icon-magnet.png",    prompt: `A red horseshoe magnet power-up icon. ${STYLE}` },
  { file: "icon-sticky.png",    prompt: `A golden honey pot power-up icon (sticky). ${STYLE}` },
  { file: "icon-laser.png",     prompt: `A laser-sight scope power-up icon. ${STYLE}` },
];

const ai = new GoogleGenAI({ apiKey: KEY });
const OUT = join(__dir, "..", "assets", "generated");
mkdirSync(OUT, { recursive: true });

// Ask a candidate model for one image. Returns the base64 data, or throws.
async function tryGenerate(model, prompt) {
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
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
  for (const model of models) {
    try {
      const data = await tryGenerate(model, a.prompt);
      writeFileSync(join(OUT, a.file), Buffer.from(data, "base64"));
      MODEL = model; // lock in the working model for the rest
      console.log(`ok (${model})`);
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
