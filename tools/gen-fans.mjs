// Crowd-fan sprite generator (local/build-time, Gemini).
//
// Generates the stadium crowd characters as game-ready 48px sprite sheets.
// Writes to assets/generated/_fan-candidates/ — it NEVER overwrites the live
// fan-*-sheet.png, so a bad batch can't regress the game. Review, then copy the
// ones you like over the real filenames.
//
// Two things make this different from gen-assets.mjs and they both matter:
//
//  1. AREA-AVERAGE DOWNSCALE. The model returns ~1024px art that has to become
//     48px. processIcon() point-samples, which at a 21x reduction throws away
//     20 of every 21 pixels and aliases the face into noise. Averaging over the
//     source box keeps the features.
//  2. FEET-ANCHORED, BOTTOM-CENTRED. The game draws fans feet-down
//     (dy = y - sz in _fanTint), so the sprite's feet must sit on the bottom
//     edge of the frame or the crowd floats.
//
// The shirt/flag cloth MUST come back white/light grey: the game recolours the
// low-saturation pixels per team and per nation (_fanFrame in 05-ambience.js).
// A pre-coloured shirt can never be tinted, so this script measures how
// recolourable each result is and prints a warning when it is too low.
//
// Usage:
//   node gen-fans.mjs                 # the default batch
//   node gen-fans.mjs standing-1 ...  # only these ids
//   FAN_VARIANTS=2 node gen-fans.mjs  # variants per pose (default 2)

import { GoogleGenAI } from "@google/genai";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, existsSync } from "node:fs";
import { PNG } from "pngjs";

const __dir = dirname(fileURLToPath(import.meta.url));
// .env support so the key never has to live in the shell history
(() => {
  const f = join(__dir, ".env");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
})();
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error("gen-fans: GEMINI_API_KEY not set (tools/.env or env)"); process.exit(2); }

const MODEL_CANDIDATES = [
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
];

const FRAME = 48;      // engine frame size (frames = sheet.width / 48)
const FRAMES = 4;      // frames per sheet
const BOB = [0, -1, -2, -1];   // cheering bounce, applied per frame

// Style shared by every fan so the set looks like one crowd.
//
// The outline wording is load-bearing, not decoration. These sprites render
// ~24px against dark stands; a soft, outline-less character (which is what a
// generic "Dave the Diver" prompt returns) turns to mush and blends into the
// crowd behind it. A thick near-black outline is what keeps each fan readable
// at that size — the small-tier rule in PIXELLAB_STYLE.md.
const STYLE =
  "CHUNKY RETRO PIXEL ART SPRITE with a THICK SOLID NEAR-BLACK OUTLINE completely surrounding the " +
  "whole character (a heavy 2-pixel dark contour around the body, arms, head and legs), bold high-contrast " +
  "saturated colours, strong simple readable silhouette, low detail, few colours, chunky visible pixels, " +
  "rounded friendly proportions, cheerful stadium crowd character, " +
  "full body head to feet, front view, standing upright, feet visible at the bottom, " +
  "flat solid #FF00FF magenta background, no shadow, no drop shadow, no text, no lettering, no watermark";

// CRITICAL: the shirt has to come back grey so the engine can recolour it.
const GREY_SHIRT =
  "IMPORTANT: the shirt/t-shirt is PLAIN WHITE AND LIGHT GREY with no colour, no pattern, no logo, " +
  "no stripes at all — a blank greyscale shirt. The skin, hair, shorts and shoes ARE colourful. ";

const POSES = {
  standing: GREY_SHIRT +
    "A cheerful stadium football fan standing and cheering with BOTH ARMS RAISED high above the head, " +
    "mouth open shouting happily, excited expression.",
  scarf: GREY_SHIRT +
    "A cheerful stadium football fan holding a football SCARF stretched overhead with both hands, " +
    "arms up, mouth open singing. IMPORTANT: the scarf is PLAIN WHITE AND LIGHT GREY, no colour.",
  flag: GREY_SHIRT +
    "A cheerful stadium football fan holding up a FLAG ON A THIN POLE beside the body, the flag cloth " +
    "flying to one side above shoulder height. IMPORTANT: the flag cloth is a PLAIN BLANK WHITE AND " +
    "LIGHT GREY rectangle — absolutely no colours, no pattern, no emblem, no national flag design.",
  seated: GREY_SHIRT +
    "A calm stadium football spectator SEATED on a stadium seat, hands clapping in the lap, relaxed smile.",
};

// Variety so the crowd doesn't look cloned.
const LOOKS = [
  "young man, short brown hair, light skin",
  "woman, long blonde hair, light skin",
  "man, black hair, brown skin",
  "older man, grey hair and beard, light skin",
  "boy, curly dark hair, dark brown skin",
  "woman, red hair in a ponytail, freckles, pale skin",
];

// ---------- PNG helpers ----------
const dist2 = (r, g, b, R, G, B) => (r - R) ** 2 + (g - G) ** 2 + (b - B) ** 2;

// Key the flat background to transparency (flood-fill from the border, then a
// global colour-key for pockets the subject encloses), and return the source
// plus the subject's bounding box.
function keyAndBox(buf, keyTol = 120) {
  const src = PNG.sync.read(buf);
  const { width: w, height: h, data } = src;
  const KT2 = keyTol * keyTol;
  const idx = (x, y) => (y * w + x) << 2;
  let br = 0, bg = 0, bb = 0;
  for (const [cx, cy] of [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]]) {
    const p = idx(cx, cy); br += data[p]; bg += data[p + 1]; bb += data[p + 2];
  }
  br /= 4; bg /= 4; bb /= 4;
  const bgm = new Uint8Array(w * h);
  const stack = [];
  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const c = y * w + x; if (bgm[c]) return;
    const p = c << 2;
    if (dist2(data[p], data[p + 1], data[p + 2], br, bg, bb) <= KT2) { bgm[c] = 1; stack.push(x, y); }
  };
  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
  while (stack.length) { const y = stack.pop(), x = stack.pop(); push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1); }
  for (let c = 0; c < w * h; c++) if (bgm[c]) data[(c << 2) + 3] = 0;
  for (let c = 0; c < w * h; c++) {
    const p = c << 2; if (data[p + 3] === 0) continue;
    if (dist2(data[p], data[p + 1], data[p + 2], br, bg, bb) <= KT2) data[p + 3] = 0;
  }
  // drop the anti-aliased halo so the sprite cuts cleanly
  for (let c = 0; c < w * h; c++) { const a = data[(c << 2) + 3]; if (a > 0 && a < 96) data[(c << 2) + 3] = 0; }
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (data[idx(x, y) + 3] > 0) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
  }
  if (maxX < 0) throw new Error("nothing left after background removal");
  return { w, h, data, minX, minY, maxX, maxY };
}

// Area-average downscale of the subject box into a FRAME-wide cell, preserving
// aspect, anchored bottom-centre (feet on the bottom edge) with `bob` applied.
function renderCell(sub, bob = 0) {
  const { w, data, minX, minY, maxX, maxY } = sub;
  const bw = maxX - minX + 1, bh = maxY - minY + 1;
  const scale = Math.min((FRAME - 2) / bw, (FRAME - 2) / bh);
  const dw = Math.max(1, Math.round(bw * scale)), dh = Math.max(1, Math.round(bh * scale));
  const offX = Math.floor((FRAME - dw) / 2);
  const offY = FRAME - dh + bob;                 // feet on the bottom edge
  const cell = new Uint8Array(FRAME * FRAME * 4);
  for (let oy = 0; oy < dh; oy++) {
    const y0 = minY + Math.floor(oy * bh / dh), y1 = Math.max(y0 + 1, minY + Math.floor((oy + 1) * bh / dh));
    const ty = oy + offY; if (ty < 0 || ty >= FRAME) continue;
    for (let ox = 0; ox < dw; ox++) {
      const x0 = minX + Math.floor(ox * bw / dw), x1 = Math.max(x0 + 1, minX + Math.floor((ox + 1) * bw / dw));
      let R = 0, G = 0, B = 0, A = 0, n = 0;
      for (let sy = y0; sy < y1; sy++) for (let sx = x0; sx < x1; sx++) {
        const p = ((sy * w + sx) << 2), a = data[p + 3] / 255;
        R += data[p] * a; G += data[p + 1] * a; B += data[p + 2] * a; A += a; n++;
      }
      if (!n || A <= 0) continue;
      const tp = ((ty * FRAME) + ox + offX) << 2;
      if (ox + offX < 0 || ox + offX >= FRAME) continue;
      cell[tp] = Math.round(R / A); cell[tp + 1] = Math.round(G / A);
      cell[tp + 2] = Math.round(B / A); cell[tp + 3] = Math.round((A / n) * 255);
    }
  }
  // hard alpha: pixel art wants a crisp edge, not a soft ramp
  for (let i = 3; i < cell.length; i += 4) cell[i] = cell[i] > 110 ? 255 : 0;
  return cell;
}

// Guarantee the engine can recolour the shirt. _fanFrame only repaints pixels
// with sat < 0.22 AND luma in (60, 236) — a pure-white shirt (luma 255) is
// OUTSIDE that band, so it would stay white for every team no matter what the
// prompt asked for. Rather than re-roll prompts until the model happens to pick
// mid-grey, compress the greyscale pixels into the middle of the band. Relative
// shading is preserved, so the folds still read; only the level moves.
function normalizeGreys(cell) {
  const LO = 96, HI = 210;            // comfortably inside (60, 236)
  let mn = 255, mx = 0;
  for (let i = 0; i < cell.length; i += 4) {
    if (cell[i + 3] < 8) continue;
    const r = cell[i], g = cell[i + 1], b = cell[i + 2];
    const c = Math.max(r, g, b), m = Math.min(r, g, b);
    const sat = c === 0 ? 0 : (c - m) / c, lum = (r + g + b) / 3;
    if (sat >= 0.22) continue;
    if (lum < 40) continue;           // leave the dark outline alone
    if (lum < mn) mn = lum; if (lum > mx) mx = lum;
  }
  if (mx <= mn) return;
  for (let i = 0; i < cell.length; i += 4) {
    if (cell[i + 3] < 8) continue;
    const r = cell[i], g = cell[i + 1], b = cell[i + 2];
    const c = Math.max(r, g, b), m = Math.min(r, g, b);
    const sat = c === 0 ? 0 : (c - m) / c, lum = (r + g + b) / 3;
    if (sat >= 0.22 || lum < 40) continue;
    const t = (lum - mn) / (mx - mn), nl = LO + t * (HI - LO), k = nl / (lum || 1);
    cell[i] = Math.min(255, Math.round(r * k));
    cell[i + 1] = Math.min(255, Math.round(g * k));
    cell[i + 2] = Math.min(255, Math.round(b * k));
  }
}

// Trace a hard dark contour around the silhouette. At ~24px on dark stands an
// outline-less fan blends into the crowd behind it, and asking the model for one
// is unreliable — doing it here is deterministic and always exactly 1px at
// sprite resolution. Kept very dark (luma < 60) so it sits outside the recolour
// band and never gets repainted as shirt.
function addOutline(cell) {
  const A = (x, y) => (x < 0 || y < 0 || x >= FRAME || y >= FRAME) ? 0 : cell[(((y * FRAME) + x) << 2) + 3];
  const add = [];
  for (let y = 0; y < FRAME; y++) for (let x = 0; x < FRAME; x++) {
    if (A(x, y) > 0) continue;
    if (A(x + 1, y) > 0 || A(x - 1, y) > 0 || A(x, y + 1) > 0 || A(x, y - 1) > 0) add.push(x, y);
  }
  for (let i = 0; i < add.length; i += 2) {
    const p = (((add[i + 1] * FRAME) + add[i]) << 2);
    cell[p] = 26; cell[p + 1] = 22; cell[p + 2] = 32; cell[p + 3] = 255;
  }
}

// How much of the sprite can the engine recolour? (low-saturation, mid-luma
// pixels are what _fanFrame repaints). Below ~12% the shirt came back coloured.
function recolourableFraction(cell) {
  let tot = 0, rec = 0;
  for (let i = 0; i < cell.length; i += 4) {
    if (cell[i + 3] < 8) continue;
    tot++;
    const r = cell[i], g = cell[i + 1], b = cell[i + 2];
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
    const sat = mx === 0 ? 0 : (mx - mn) / mx, lum = (r + g + b) / 3;
    if (sat < 0.22 && lum > 60 && lum < 236) rec++;
  }
  return tot ? rec / tot : 0;
}

function writeSheet(path, cells) {
  const out = new PNG({ width: FRAME * cells.length, height: FRAME });
  out.data.fill(0);
  cells.forEach((cell, i) => {
    for (let y = 0; y < FRAME; y++) for (let x = 0; x < FRAME; x++) {
      const sp = ((y * FRAME) + x) << 2, dp = ((y * FRAME * cells.length) + (i * FRAME + x)) << 2;
      out.data[dp] = cell[sp]; out.data[dp + 1] = cell[sp + 1];
      out.data[dp + 2] = cell[sp + 2]; out.data[dp + 3] = cell[sp + 3];
    }
  });
  writeFileSync(path, PNG.sync.write(out));
}

// ---------- generate ----------
const ai = new GoogleGenAI({ apiKey: KEY });
const OUT = join(__dir, "..", "assets", "generated", "_fan-candidates");
mkdirSync(OUT, { recursive: true });

async function tryGenerate(model, prompt) {
  const res = await ai.models.generateContent({
    model, contents: prompt, config: { responseModalities: ["Text", "Image"] },
  });
  const parts = res?.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) throw new Error("no image in response");
  return Buffer.from(img.inlineData.data, "base64");
}

const VARIANTS = Math.max(1, Number(process.env.FAN_VARIANTS || 2));
const ONLY = process.argv.slice(2);
const jobs = [];
for (const pose of Object.keys(POSES)) {
  for (let v = 1; v <= VARIANTS; v++) jobs.push({ id: `${pose}-${v}`, pose, look: LOOKS[(v - 1) % LOOKS.length] });
}

let MODEL = null, ok = 0;
for (const j of jobs) {
  if (ONLY.length && !ONLY.includes(j.id)) continue;
  process.stdout.write(`fan-${j.id} ... `);
  const prompt = `${POSES[j.pose]} The fan is a ${j.look}. ${STYLE}`;
  let done = false, lastErr = "";
  for (const model of (MODEL ? [MODEL] : MODEL_CANDIDATES)) {
    try {
      const raw = await tryGenerate(model, prompt);
      writeFileSync(join(OUT, `fan-${j.id}-raw.png`), raw);   // keep the source for inspection
      const sub = keyAndBox(raw);
      const cells = BOB.map((b) => {
        const cell = renderCell(sub, b);
        normalizeGreys(cell);   // shirt lands inside the engine's recolour band
        addOutline(cell);       // readable at ~24px against the dark stands
        return cell;
      });
      const frac = recolourableFraction(cells[0]);
      writeSheet(join(OUT, `fan-${j.id}-sheet.png`), cells);
      MODEL = model; ok++; done = true;
      const warn = frac < 0.12 ? `  !! only ${(frac * 100).toFixed(0)}% recolourable — shirt came back coloured, regenerate` : "";
      console.log(`ok (${model}, ${FRAMES}f, recolourable ${(frac * 100).toFixed(0)}%)${warn}`);
      break;
    } catch (e) { lastErr = String(e.message || e); }
  }
  if (!done) console.log(`FAILED (${lastErr.slice(0, 140)})`);
}
console.log(`\n${ok}/${jobs.filter((j) => !ONLY.length || ONLY.includes(j.id)).length} written to assets/generated/_fan-candidates/`);
console.log("Review them, then copy the good ones over assets/generated/fan-<pose>-<n>-sheet.png");
if (!ok) process.exit(1);
