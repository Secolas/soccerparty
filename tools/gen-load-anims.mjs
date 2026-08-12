#!/usr/bin/env node
// Placeholder LOADING-SCREEN ability animations (assets/generated/load-{banana,cannon,chip}-sheet.png).
//
// The boot loader plays one of these instead of the seated fan (see showLoading in
// src/game/10-tournament.js): a horizontal strip of SQUARE frames, frame width = image height,
// any size. These hand-drawn 48px sheets exist so the loader never 404s — the real art is
// generated in PixelLab per tools/PIXELLAB_STYLE.md and OVERWRITES these same filenames
// (any square frame size works; the loader reads the frame count from the sheet width).
//
//   node tools/gen-load-anims.mjs
//
// Animations (8 frames, ~1s loop at the loader's 120ms/frame):
//   banana — a soccer ball swerving along a banana-shaped curve, yellow-to-orange trail
//   cannon — a stout cannon fires the ball: recoil, muzzle flash, drifting smoke
//   chip   — a boot chips the ball up a high arc; it lands and rolls back to the boot

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const GEN = join(__dir, '..', 'assets', 'generated');
const { PNG } = createRequire(join(__dir, 'gen-assets.mjs'))('pngjs');

const F = 48, N = 8;

// --- tiny pixel toolkit (alpha-over compositing) ---------------------------
function px(p, x, y, [r, g, b, a = 255]) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= p.width || y >= p.height || a <= 0) return;
  const i = (p.width * y + x) << 2, d = p.data, sa = a / 255, da = d[i + 3] / 255, oa = sa + da * (1 - sa);
  if (oa <= 0) return;
  d[i]     = Math.round((r * sa + d[i]     * da * (1 - sa)) / oa);
  d[i + 1] = Math.round((g * sa + d[i + 1] * da * (1 - sa)) / oa);
  d[i + 2] = Math.round((b * sa + d[i + 2] * da * (1 - sa)) / oa);
  d[i + 3] = Math.round(oa * 255);
}
function disc(p, cx, cy, r, col) {
  for (let y = Math.floor(cy - r); y <= cy + r; y++) for (let x = Math.floor(cx - r); x <= cx + r; x++)
    if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) px(p, x, y, col);
}
function ring(p, cx, cy, r, w, col) {
  for (let y = Math.floor(cy - r - w); y <= cy + r + w; y++) for (let x = Math.floor(cx - r - w); x <= cx + r + w; x++) {
    const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    if (d >= r - w / 2 && d <= r + w / 2) px(p, x, y, col);
  }
}
function line(p, x0, y0, x1, y1, w, col) {
  const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) * 2));
  for (let i = 0; i <= n; i++) disc(p, x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, w / 2, col);
}

// --- shared props -----------------------------------------------------------
const OUT = [58, 45, 38, 255];        // warm dark outline (never pure black)
function ball(p, cx, cy, spin, r = 4.5) {
  disc(p, cx, cy, r + 1, OUT);
  disc(p, cx, cy, r, [247, 243, 232, 255]);                      // cream shell
  disc(p, cx - r * 0.35, cy - r * 0.35, r * 0.45, [255, 255, 250, 255]); // soft top-left light
  disc(p, cx + r * 0.3, cy + r * 0.35, r * 0.5, [216, 205, 185, 255]);   // gentle under-shade
  const a = spin;                                                 // one rotating patch = spin read
  disc(p, cx + Math.cos(a) * r * 0.45, cy + Math.sin(a) * r * 0.45, 1.6, [74, 66, 88, 255]);
  disc(p, cx + Math.cos(a + 2.6) * r * 0.55, cy + Math.sin(a + 2.6) * r * 0.55, 1.1, [74, 66, 88, 255]);
}
const bez = (t, a, b, c, d) => {
  const u = 1 - t;
  return u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
};

// --- 1. BANANA: ball swerves along a banana curve, yellow->orange trail -----
function drawBanana(p, f, ox) {
  const P = [[7, 40], [22, 42], [38, 30], [40, 8]];               // banana-shaped bend
  const at = t => [ox + bez(t, P[0][0], P[1][0], P[2][0], P[3][0]), bez(t, P[0][1], P[1][1], P[2][1], P[3][1])];
  const t = 0.12 + 0.88 * (f / (N - 1));
  for (let s = 0; s < t - 0.02; s += 0.02) {                      // trail: older = thinner + fainter
    const age = (t - s) / t, [x, y] = at(s);
    const col = age > 0.55 ? [255, 140, 26, Math.round(120 * (1 - age) + 30)] : [255, 210, 58, Math.round(200 * (1 - age) + 55)];
    disc(p, x, y, 1 + (1 - age) * 2.2, col);
  }
  const [bx, by] = at(t);
  const [lx, ly] = at(Math.max(0, t - 0.06));                     // speed lines trail the motion
  for (let k = 1; k <= 2; k++) line(p, bx + (lx - bx) * k, by + (ly - by) * k + (k === 2 ? 2 : -2), bx + (lx - bx) * (k + 1.6), by + (ly - by) * (k + 1.6), 1, [255, 245, 200, 150]);
  ball(p, bx, by, f * 0.9);
  if (f >= N - 2) for (let k = 0; k < 3; k++)                     // arrival sparkle on the last beats
    disc(p, bx + Math.cos(k * 2.1 + f) * 7, by + Math.sin(k * 2.1 + f) * 7, 0.8, [255, 250, 210, 200]);
}

// --- 2. CANNON: recoil, muzzle flash, ball out, smoke drifts ----------------
function drawCannon(p, f, ox) {
  const rec = (f === 1) ? 3 : (f === 2) ? 2 : (f === 3) ? 1 : 0;  // recoil eases back over 3 frames
  const pxv = ox + 12 - rec, pyv = 36, ang = -0.5;                // barrel pivot + elevation
  const dx = Math.cos(ang), dy = Math.sin(ang), L = 13;
  const mx = pxv + dx * L, my = pyv + dy * L;                     // muzzle
  line(p, pxv, pyv, mx, my, 8.5, OUT);                            // barrel silhouette
  line(p, pxv, pyv, mx, my, 6.5, [90, 95, 110, 255]);
  line(p, pxv - dy * 1.6, pyv + dx * 1.6 - 3, mx - dy * 1.6, my + dx * 1.6 - 3, 1.6, [126, 134, 152, 255]); // top sheen
  ring(p, mx, my, 3.4, 1.6, [58, 62, 76, 255]);                   // muzzle lip
  disc(p, pxv - 2, pyv - 1, 4.4, [74, 78, 92, 255]);              // breech
  disc(p, ox + 14, 41, 4.6, OUT);                                 // wheel
  disc(p, ox + 14, 41, 3.6, [138, 90, 42, 255]);
  disc(p, ox + 14, 41, 1.4, [88, 56, 26, 255]);
  if (f >= 1) {                                                   // ball flies out along the barrel line
    const bt = (f - 1) / (N - 2), bx = mx + dx * (3 + bt * 34), by = my + dy * (3 + bt * 34);
    if (bx < ox + F + 6) { line(p, bx - dx * 6, by - dy * 6, bx - dx * 11, by - dy * 11, 1.2, [255, 245, 200, 140]); ball(p, bx, by, f * 1.2, 4); }
  }
  if (f === 1 || f === 2) {                                       // two-beat muzzle flash
    const s = f === 1 ? 1 : 0.55;
    for (let k = 0; k < 6; k++) line(p, mx, my, mx + Math.cos(ang + (k - 2.5) * 0.42) * 8 * s, my + Math.sin(ang + (k - 2.5) * 0.42) * 8 * s, 2.4 * s, [255, 140, 26, 230]);
    disc(p, mx + dx * 2, my + dy * 2, 4.5 * s, [255, 242, 160, 255]);
    disc(p, mx + dx * 2, my + dy * 2, 2.4 * s, [255, 255, 235, 255]);
  }
  if (f >= 2) for (let k = 0; k < 3; k++) {                       // smoke puffs drift up and fade
    const sa = (f - 2) / (N - 2), sx = mx - dx * 2 - k * 2.6 - sa * 4, sy = my - 3 - k * 3.4 - sa * 9;
    disc(p, sx, sy, 2.2 + k * 0.9 + sa * 2.2, [184, 180, 196, Math.round(150 * (1 - sa) - k * 18)]);
  }
}

// --- 3. CHIP: boot pops the ball up an arc; it lands and rolls home ---------
function drawChip(p, f, ox) {
  const kick = (f === 1);                                         // contact frame: toe under the ball
  const bx0 = ox + 9, by0 = 41, tilt = kick ? -0.35 : 0;
  line(p, bx0 - 4, by0 + (kick ? -2 : 0), bx0 + 5, by0 + tilt * 8, 6.5, OUT);   // boot silhouette
  line(p, bx0 - 4, by0 + (kick ? -2 : 0), bx0 + 5, by0 + tilt * 8, 4.8, [214, 75, 58, 255]); // warm red boot
  line(p, bx0 - 3, by0 + 2.6 + (kick ? -2 : 0), bx0 + 5.5, by0 + 2.6 + tilt * 8, 1.6, [244, 233, 200, 255]); // sole
  disc(p, bx0 + 5.5, by0 - 1 + tilt * 8, 2.2, [176, 52, 40, 255]);              // toe cap
  line(p, bx0 - 4, by0 - 3, bx0 - 4, by0 - 9, 3.4, [63, 79, 128, 255]);         // sock
  const u = f / (N - 1);                                          // ball flight: chip arc then roll-back
  let cx, cy, spin;
  if (f === 0) { cx = bx0 + 9; cy = by0 - 1; spin = 0; }
  else if (f <= 5) { const t = (f - 1) / 4; cx = bx0 + 9 + t * 24; cy = by0 - 1 - Math.sin(Math.PI * Math.min(1, t * 0.86)) * 26; spin = -f * 1.1; }
  else { const t = (f - 6) / 2; cx = bx0 + 33 - t * 10; cy = by0 - 1; spin = -6 - f; }
  if (f >= 1 && f <= 5) for (let s = 0; s <= (f - 1) / 4 - 0.03; s += 0.05) {   // faint white arc trail
    const tx = bx0 + 9 + s * 24, ty = by0 - 1 - Math.sin(Math.PI * Math.min(1, s * 0.86)) * 26;
    disc(p, tx, ty, 1, [255, 252, 240, Math.round(60 + 80 * (s / Math.max(0.05, u)))]);
  }
  if (f === 6) for (let k = 0; k < 3; k++) disc(p, bx0 + 30 + k * 2.4, by0 + 2.4, 1.1, [216, 205, 185, 170]); // landing puff
  disc(p, cx, by0 + 3.4, 3.2, [40, 32, 30, 60]);                  // soft contact shadow
  ball(p, cx, cy, spin);
  if (kick) for (let k = 0; k < 4; k++) line(p, bx0 + 7, by0 - 2, bx0 + 7 + Math.cos(-0.6 - k * 0.5) * 6, by0 - 2 + Math.sin(-0.6 - k * 0.5) * 6, 1, [255, 245, 200, 190]); // impact flick
}

// --- write the three sheets --------------------------------------------------
const SHEETS = { banana: drawBanana, cannon: drawCannon, chip: drawChip };
for (const [name, draw] of Object.entries(SHEETS)) {
  const p = new PNG({ width: F * N, height: F });
  for (let f = 0; f < N; f++) draw(p, f, f * F);
  const out = join(GEN, `load-${name}-sheet.png`);
  writeFileSync(out, PNG.sync.write(p));
  console.log('wrote', out);
}
