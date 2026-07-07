// Post-process a raw generated icon into a game-ready one:
//   1. Remove the flat background (flood-fill from the edges -> transparent)
//   2. Trim to the subject and nearest-neighbor downscale to a square canvas
//
// Nearest-neighbor keeps pixel-art edges crisp; flood-fill from the border only
// removes background that is actually connected to the edge, so a magenta pixel
// *inside* the subject is never punched out. Pure JS (pngjs) so it runs anywhere
// (local + GitHub Actions) with no native build step.

import { PNG } from "pngjs";

// Final square size of each icon, sized to fit the game: the scoreboard ability
// slots render at 26px, so 64px covers them crisply (with retina headroom) while
// staying tiny. 1024 / 64 = 16, a clean integer downscale that keeps pixels sharp.
export const ICON_SIZE = 64;

// How close a pixel must be to the sampled background colour to count as
// background (squared Euclidean distance in RGB). Generous enough to eat the
// anti-aliased fringe, low enough to stop at the subject's dark outline.
const TOL = 120;
const TOL2 = TOL * TOL;

function dist2(r1, g1, b1, r2, g2, b2) {
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return dr * dr + dg * dg + db * db;
}

// Decode -> remove background -> trim + scale -> encode. Returns a PNG Buffer.
export function processIcon(inputBuffer, size = ICON_SIZE) {
  const src = PNG.sync.read(inputBuffer);
  const { width: w, height: h, data } = src;
  const idx = (x, y) => (y * w + x) << 2;

  // Sample the background colour from the four corners (average).
  let br = 0, bg = 0, bb = 0;
  const corners = [[0, 0], [w - 1, 0], [0, h - 1], [w - 1, h - 1]];
  for (const [cx, cy] of corners) {
    const p = idx(cx, cy);
    br += data[p]; bg += data[p + 1]; bb += data[p + 2];
  }
  br /= 4; bg /= 4; bb /= 4;

  // Flood-fill the connected background region from every border pixel.
  const transparent = new Uint8Array(w * h); // 1 = background
  const stack = [];
  const pushIfBg = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const c = y * w + x;
    if (transparent[c]) return;
    const p = c << 2;
    if (dist2(data[p], data[p + 1], data[p + 2], br, bg, bb) <= TOL2) {
      transparent[c] = 1;
      stack.push(x, y);
    }
  };
  for (let x = 0; x < w; x++) { pushIfBg(x, 0); pushIfBg(x, h - 1); }
  for (let y = 0; y < h; y++) { pushIfBg(0, y); pushIfBg(w - 1, y); }
  while (stack.length) {
    const y = stack.pop(), x = stack.pop();
    pushIfBg(x + 1, y); pushIfBg(x - 1, y); pushIfBg(x, y + 1); pushIfBg(x, y - 1);
  }
  // Zero the alpha of everything we flagged as background.
  for (let c = 0; c < w * h; c++) if (transparent[c]) data[(c << 2) + 3] = 0;

  // Bounding box of the remaining (opaque) subject.
  let minX = w, minY = h, maxX = -1, maxY = -1;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[idx(x, y) + 3] > 0) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) throw new Error("nothing left after background removal");

  const bw = maxX - minX + 1, bh = maxY - minY + 1;
  const pad = Math.round(size * 0.06);
  const target = size - pad * 2;
  const scale = target / Math.max(bw, bh);
  const drawW = Math.max(1, Math.round(bw * scale));
  const drawH = Math.max(1, Math.round(bh * scale));
  const offX = Math.floor((size - drawW) / 2);
  const offY = Math.floor((size - drawH) / 2);

  const out = new PNG({ width: size, height: size });
  out.data.fill(0); // fully transparent canvas
  for (let oy = 0; oy < size; oy++) {
    if (oy < offY || oy >= offY + drawH) continue;
    const sy = minY + Math.min(bh - 1, Math.floor((oy - offY) / scale));
    for (let ox = 0; ox < size; ox++) {
      if (ox < offX || ox >= offX + drawW) continue;
      const sx = minX + Math.min(bw - 1, Math.floor((ox - offX) / scale));
      const sp = idx(sx, sy);
      const dp = (oy * size + ox) << 2;
      out.data[dp] = data[sp];
      out.data[dp + 1] = data[sp + 1];
      out.data[dp + 2] = data[sp + 2];
      out.data[dp + 3] = data[sp + 3];
    }
  }
  return PNG.sync.write(out);
}
