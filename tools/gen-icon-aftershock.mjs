// Draws assets/generated/icon-aftershock.png — the AFTERSHOCK ability icon.
//
// Every other icon in assets/generated/ came from gen-assets.mjs (Gemini). This one is drawn in
// CODE instead, deterministically, so it can be rebuilt without an API key:
//
//   node tools/gen-icon-aftershock.mjs
//
// It is deliberately NOT listed in gen-assets.mjs, so a model run cannot silently replace it.
//
// The art is a comic shock burst: a spiky 8-point star built from r(t) = base + amp*cos(8t), filled
// as FLAT BANDS by radius (white core -> yellow -> orange -> deep orange) with a hard dark outline,
// then nearest-neighbour upscaled 4x. Same idiom as the in-game pixel art: integer grid, flat bands,
// no anti-aliasing, no gradients.

import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'generated', 'icon-aftershock.png');
const S = 16, SCALE = 4;                       // 16x16 authored, 64x64 shipped
const K = [42, 18, 6, 255];                    // outline
const R = [198, 58, 22, 255];                  // deep orange rim
const O = [245, 135, 43, 255];                 // orange
const Y = [255, 210, 63, 255];                 // yellow
const W = [255, 246, 216, 255];                // hot core
const NONE = [0, 0, 0, 0];

const CX = 7.5, CY = 7.5, SPIKES = 8;
// spike phase chosen so one point aims up and the star does not sit mirror-flat on the grid
const PHASE = -Math.PI / 2 + 0.18;

function reach(t) { return 6.4 + 1.9 * Math.cos((t - PHASE) * SPIKES); }

// r/reach(t) in 0..1: how far out this pixel sits along its own spike
function band(x, y) {
  const dx = x - CX, dy = y - CY, r = Math.hypot(dx, dy);
  if (r < 0.001) return 0;
  const f = r / reach(Math.atan2(dy, dx));
  return f > 1 ? -1 : f;
}

const px = [], fs_ = [];
for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const f = band(x, y);
    fs_.push(f);
    px.push(f < 0 ? NONE : f > 0.84 ? K : f > 0.66 ? R : f > 0.47 ? O : f > 0.26 ? Y : W);
  }
}
// Close the silhouette: an OUTER pixel (f > 0.55) that touches empty space becomes outline. Gated on
// f so the fix cannot eat into the core — an ungated pass turned every thin spike solid dark.
const at = (x, y) => (x < 0 || y < 0 || x >= S || y >= S) ? NONE : px[y * S + x];
const lit = (c) => c[3] > 0;
const outlined = px.slice();
for (let y = 0; y < S; y++) {
  for (let x = 0; x < S; x++) {
    const i = y * S + x;
    if (!lit(px[i]) || px[i] === K || fs_[i] <= 0.55) continue;
    if (!lit(at(x - 1, y)) || !lit(at(x + 1, y)) || !lit(at(x, y - 1)) || !lit(at(x, y + 1))) outlined[i] = K;
  }
}

const png = new PNG({ width: S * SCALE, height: S * SCALE });
for (let y = 0; y < S * SCALE; y++) {
  for (let x = 0; x < S * SCALE; x++) {
    const c = outlined[Math.floor(y / SCALE) * S + Math.floor(x / SCALE)];
    const i = (y * S * SCALE + x) * 4;
    png.data[i] = c[0]; png.data[i + 1] = c[1]; png.data[i + 2] = c[2]; png.data[i + 3] = c[3];
  }
}
writeFileSync(OUT, PNG.sync.write(png));
console.log('wrote', OUT);
