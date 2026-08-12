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

// --- shared props for the "reacting to a shot" clips ------------------------
// a small standing player token (used as the thing a shot phases through / hits)
function player(p, cx, cy, col, dark) {
  disc(p, cx, cy + 6, 4.6, OUT);                                  // base + body outline
  disc(p, cx, cy + 6, 3.6, col);
  disc(p, cx, cy, 4.2, OUT);                                      // head
  disc(p, cx, cy, 3.2, col);
  disc(p, cx - 1, cy - 1, 1.4, [255, 255, 255, 90]);              // soft top light
  if (dark) { disc(p, cx + 1.4, cy + 6.6, 2.2, [0, 0, 0, 60]); }
}
// a keeper glove: a padded cuff + a rounded mitt facing left (the incoming ball)
function glove(p, cx, cy, tint) {
  const c = tint || [232, 196, 92, 255];
  disc(p, cx, cy, 6, OUT); disc(p, cx, cy, 5, c);                 // palm
  for (let k = -1; k <= 2; k++) disc(p, cx - 4.5, cy + k * 3, 2.2, c); // fingers to the left
  disc(p, cx + 3.5, cy + 4, 2.6, c);                             // thumb
  disc(p, cx + 2, cy + 6.5, 3.2, [150, 120, 54, 255]);           // cuff
  disc(p, cx - 1, cy - 2, 2, [255, 255, 255, 80]);               // sheen
}

// --- 4. GHOST: ball turns translucent, phases through a defender ------------
function drawGhost(p, f, ox) {
  const dcx = ox + 26, dcy = 22;                                  // the defender it slips through
  const t = f / (N - 1), bx = ox + 8 + t * 32, by = 24;
  const near = 1 - Math.min(1, Math.abs(bx - dcx) / 16);          // 0 far -> 1 overlapping
  const ballA = Math.round(255 - near * 205);                     // fade to a faint ghost mid-pass
  // defender drawn AFTER a faded ball would hide it, so draw defender first, then ghost ball over
  player(p, dcx, dcy, [120, 96, 150, 255], 1);
  for (let s = 0.02; s < 0.5; s += 0.05) {                        // trailing spectral wisps
    const gx = bx - s * 34; if (gx < ox + 4) break;
    disc(p, gx, by + Math.sin(s * 20 + f) * 1.5, 3.6 - s * 3, [200, 224, 255, Math.round(90 * (0.5 - s))]);
  }
  // ghost ball: a cream ball at full alpha, dropping to a translucent blue-white as it overlaps
  const r = 4.5;
  disc(p, bx, by, r + 1, [90, 110, 140, Math.round(ballA * 0.7)]);
  disc(p, bx, by, r, [247, 250, 255, ballA]);
  disc(p, bx - 1.4, by - 1.4, 2, [255, 255, 255, Math.round(ballA * 0.9)]);
  if (near > 0.3) for (let k = 0; k < 3; k++)                     // eerie glow while phasing
    disc(p, bx + Math.cos(k * 2.1 + f) * 6, by + Math.sin(k * 2.1 + f) * 6, 1, [180, 220, 255, Math.round(120 * near)]);
}

// --- 5. FREEZE: ball flash-frozen in a bloom of ice crystals ----------------
function drawFreeze(p, f, ox) {
  const cx = ox + 24, cy = 24, grow = Math.min(1, f / 4);         // frost builds over 4 frames, holds
  ball(p, cx, cy, 0.6, 5);
  const ICE = [176, 226, 246, 255], ICE2 = [120, 190, 230, 255], SH = [236, 250, 255, 255];
  // six radiating crystal spikes
  for (let k = 0; k < 6; k++) {
    const a = k * Math.PI / 3 + 0.2, len = (6 + (k % 2) * 2) * grow;
    const ex = cx + Math.cos(a) * (5 + len), ey = cy + Math.sin(a) * (5 + len);
    line(p, cx + Math.cos(a) * 4, cy + Math.sin(a) * 4, ex, ey, 2.2, ICE2);
    line(p, cx + Math.cos(a) * 4, cy + Math.sin(a) * 4, ex, ey, 1, SH);
    if (grow > 0.6) { const bx = cx + Math.cos(a) * (5 + len * 0.6), by = cy + Math.sin(a) * (5 + len * 0.6); // little barbs
      line(p, bx, by, bx + Math.cos(a + 1) * 2.4, by + Math.sin(a + 1) * 2.4, 1, ICE); }
  }
  // frosty overlay tint creeping onto the ball
  disc(p, cx, cy, 4.6, [200, 232, 250, Math.round(150 * grow)]);
  disc(p, cx - 1.4, cy - 1.4, 1.8, [255, 255, 255, Math.round(220 * grow)]);
  // sparkle motes on the hold frames
  if (f >= 4) for (let k = 0; k < 4; k++) {
    const a = f + k * 1.7, rr = 9 + (k % 2) * 3;
    disc(p, cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 0.8, [255, 255, 255, 200]);
  }
}

// --- 6. WALL: ball smashes a brick wall, bricks scatter ---------------------
function drawWall(p, f, ox) {
  const wallX = ox + 30, top = 8, bot = 40, bw = 7, bh = 4;       // brick wall stands right-of-centre
  const hit = f >= 3;
  const shake = hit ? Math.round(Math.sin(f * 3) * (f < 5 ? 2 : 0)) : 0;
  if (f < 6) for (let ry = top, row = 0; ry < bot; ry += bh, row++) { // draw intact bricks (skip the smashed ones after impact)
    for (let bx = wallX + (row % 2 ? -bw / 2 : 0); bx < ox + F - 2; bx += bw) {
      const broken = hit && Math.abs(ry - 24) < 8 + (f - 3) * 5;  // a growing hole around the impact
      if (broken) continue;
      const bxs = bx + shake;
      for (let yy = ry; yy < ry + bh - 1; yy++) for (let xx = bxs; xx < bxs + bw - 1; xx++) px(p, xx, yy, (yy === ry ? [176, 84, 58, 255] : [150, 62, 42, 255]));
      for (let xx = bxs; xx < bxs + bw - 1; xx++) px(p, xx, ry, [198, 108, 78, 255]); // top mortar highlight
    }
  }
  const t = Math.min(1, f / 3), bx = ox + 6 + t * 22, by = 24;    // ball drives into the wall then stops/rebounds
  if (f < 3) ball(p, bx, by, f * 1.3, 4.5);
  else { const rb = ox + 28 - (f - 3) * 3; ball(p, rb, by, -f, 4.5); } // small rebound after the smash
  if (f === 3) { disc(p, wallX, 24, 7, [255, 240, 170, 255]); disc(p, wallX, 24, 4, [255, 255, 235, 255]); } // impact flash
  if (hit) for (let k = 0; k < 7; k++) {                          // flying brick chunks
    const a = -0.6 + k * 0.42, d = (f - 2) * 5;
    const fx = wallX + Math.cos(a) * d, fy = 24 + Math.sin(a) * d + (f - 2) * (f - 2) * 0.6;
    disc(p, fx, fy, 1.8, k % 2 ? [176, 84, 58, 255] : [150, 62, 42, 255]);
  }
}

// --- 7. PORTAL: ball spirals into one swirl, bursts from another ------------
function drawPortal(p, f, ox) {
  const inX = ox + 12, outX = ox + 36, cy = 24;                   // entry (left) + exit (right) portals
  function swirl(cx, spin, a) {
    for (let k = 0; k < 3; k++) ring(p, cx, cy, 8 - k * 2.4, 1.4, [120 + k * 30, 70, 200 - k * 20, a]);
    for (let s = 0; s < 6.28; s += 0.5) { const rr = 2 + s * 1.1; disc(p, cx + Math.cos(s * 2 + spin) * rr, cy + Math.sin(s * 2 + spin) * rr, 1, [200, 150, 255, a]); }
    disc(p, cx, cy, 2.2, [245, 230, 255, a]);
  }
  swirl(inX, f * 0.7, 210); swirl(outX, -f * 0.7, 210);
  if (f <= 3) {                                                    // shrink into the left portal
    const t = f / 3, bx = ox + 4 + t * (inX - ox - 4), r = 4.5 * (1 - t * 0.75);
    ball(p, bx, cy, f * 1.5, Math.max(1.4, r));
  } else {                                                         // grow out of the right portal
    const t = (f - 4) / 3, bx = outX + t * (ox + F - 4 - outX), r = 4.5 * (0.3 + t * 0.7);
    ball(p, bx, cy, f * 1.5, r);
    for (let k = 0; k < 4; k++) disc(p, outX + Math.cos(k * 1.6) * (4 + t * 4), cy + Math.sin(k * 1.6) * (4 + t * 4), 0.9, [220, 180, 255, Math.round(180 * (1 - t))]); // exit burst
  }
}

// --- 8. AFTERSHOCK: ball hits the keeper, a shock ring freezes it ------------
function drawAftershock(p, f, ox) {
  const kx = ox + 32, ky = 24;                                    // keeper glove being struck
  const frozen = f >= 3;
  glove(p, kx, ky, frozen ? [150, 210, 240, 255] : null);         // turns icy-blue once shocked
  if (frozen) for (let k = 0; k < 5; k++) {                       // electric arcs crawling over it
    const a = k * 1.25 + f * 0.4, r0 = 3, r1 = 8;
    line(p, kx + Math.cos(a) * r0, ky + Math.sin(a) * r0, kx + Math.cos(a + 0.5) * r1, ky + Math.sin(a + 0.5) * r1, 1, [150, 230, 255, 220]);
  }
  const t = Math.min(1, f / 2), bx = ox + 6 + t * 18, by = 24;    // ball drives in, then rebounds with pace
  if (f < 2) { for (let k = 1; k <= 2; k++) line(p, bx - k * 4, by, bx - k * 6, by, 1, [255, 245, 200, 150]); ball(p, bx, by, f * 1.4, 4.5); }
  else { const rb = ox + 22 - (f - 2) * 4; ball(p, rb, by, -f * 1.4, 4.5); for (let k = 1; k <= 2; k++) line(p, rb + k * 4, by, rb + k * 6, by, 1, [255, 245, 200, 130]); }
  if (f === 2 || f === 3) { const s = f === 2 ? 1 : 0.6; disc(p, kx - 3, ky, 6 * s, [255, 244, 170, 255]); disc(p, kx - 3, ky, 3 * s, [255, 255, 240, 255]); } // impact flash
  if (f >= 2) { const rr = (f - 1) * 6; ring(p, kx - 2, ky, rr, 1.6, [150, 230, 255, Math.round(200 - (f - 2) * 55)]); } // expanding shock ring
}

// --- 9. SHIELD: a glowing dome blocks the ball and ripples ------------------
function drawShield(p, f, ox) {
  const gx = ox + 38, cy = 24, R = 15;                            // dome hugging the right goal
  const hit = f === 3 || f === 4;
  // goal hint bricks behind the dome
  for (let yy = 10; yy < 38; yy += 2) for (let xx = gx + 2; xx < ox + F; xx++) px(p, xx, yy, [60, 52, 74, 255]);
  const t = Math.min(1, f / 3), bx = ox + 6 + t * 18, by = 24;    // ball flies in, bounces off the dome
  if (f < 3) { for (let k = 1; k <= 2; k++) line(p, bx - k * 4, by, bx - k * 6, by, 1, [255, 245, 200, 150]); ball(p, bx, by, f * 1.3, 4.5); }
  else { const rb = ox + 24 - (f - 3) * 5; ball(p, rb, by, -f, 4.5); }
  // the dome: a bright half-circle arc, brighter and rippling on impact
  const baseA = hit ? 255 : 150, col = [120, 210, 255, baseA];
  for (let rr = R; rr > R - 4; rr -= 1.2) for (let a = -Math.PI / 2; a <= Math.PI / 2; a += 0.06)
    px(p, gx + Math.cos(a) * -rr + 2, cy + Math.sin(a) * rr, [col[0], col[1], col[2], Math.round(baseA * (0.4 + 0.6 * Math.random()))]);
  if (hit) { const rr = (f - 2) * 5; ring(p, bx + 3, by, rr, 1.6, [180, 240, 255, Math.round(220 - (f - 3) * 60)]); // ripple where it struck
    disc(p, bx + 4, by, 4, [230, 250, 255, 200]); }
  disc(p, gx - 8, cy - 8, 2, [255, 255, 255, Math.round(baseA * 0.7)]); // dome sheen
}

// --- write the sheets --------------------------------------------------------
const SHEETS = {
  banana: drawBanana, cannon: drawCannon, chip: drawChip,
  ghost: drawGhost, freeze: drawFreeze, wall: drawWall,
  portal: drawPortal, aftershock: drawAftershock, shield: drawShield,
};
for (const [name, draw] of Object.entries(SHEETS)) {
  const p = new PNG({ width: F * N, height: F });
  for (let f = 0; f < N; f++) draw(p, f, f * F);
  const out = join(GEN, `load-${name}-sheet.png`);
  writeFileSync(out, PNG.sync.write(p));
  console.log('wrote', out);
}
