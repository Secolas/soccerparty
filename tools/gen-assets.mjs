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

// Gemini image model ("Nano Banana"). Update if the API changes.
const MODEL = "gemini-2.5-flash-image-preview";

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

for (const a of ASSETS) {
  process.stdout.write(`Generating ${a.file} ... `);
  try {
    const res = await ai.models.generateContent({ model: MODEL, contents: a.prompt });
    const parts = res?.candidates?.[0]?.content?.parts || [];
    const img = parts.find((p) => p.inlineData?.data);
    if (!img) { console.log("no image in response"); continue; }
    writeFileSync(join(OUT, a.file), Buffer.from(img.inlineData.data, "base64"));
    console.log("ok");
  } catch (e) {
    console.log("FAILED:", e.message);
  }
}

console.log(
  "\nDone -> assets/generated/. Next: clean them up (key out the magenta to " +
  "transparency, downscale to ~24px), keep the good ones, then commit."
);
