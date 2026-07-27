// Hand-authored pixel art for THE DIAMOND props (bat + fielder's glove).
// Authored at 2x the in-game display size so the nearest-neighbour downscale is
// a clean 2:1 — an AI 1024px render squeezed to 64px turns to mush at 27px.
import { PNG } from 'pngjs';
import { writeFileSync } from 'node:fs';

const OUT = process.env.OUT || new URL('../assets/generated', import.meta.url).pathname;

function make(w, h) {
  const p = new PNG({ width: w, height: h });
  p.data.fill(0);
  return p;
}
function px(p, x, y, c) {
  x = Math.round(x); y = Math.round(y);
  if (x < 0 || y < 0 || x >= p.width || y >= p.height) return;
  const i = (p.width * y + x) << 2;
  p.data[i] = c[0]; p.data[i + 1] = c[1]; p.data[i + 2] = c[2]; p.data[i + 3] = c.length > 3 ? c[3] : 255;
}
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

// ---------------------------------------------------------------- BAT ------
// Top-down, horizontal, knob at the LEFT, barrel filling the RIGHT.
function bat() {
  const W = 76, H = 26, p = make(W, H), cy = H / 2;
  const OUT_C = hex('#33200e'), GRIP = hex('#5b3a1b'), GRIP_HI = hex('#7a5028');
  const TAPE = hex('#efe0bc');
  const WOOD_D = hex('#a5682c'), WOOD_M = hex('#c8873c'), WOOD_L = hex('#e0a556'), WOOD_HI = hex('#f7e3b4');
  const x0 = 2, x1 = 73;
  // half-thickness profile: knob -> handle -> taper -> barrel -> rounded cap
  const ht = x => {
    if (x < x0) return 0;
    if (x < 7) { const t = (x - x0) / 5; return 3.0 + 1.4 * Math.sin(t * Math.PI); }   // knob flare
    if (x < 28) return 2.6;                                                            // handle
    if (x < 46) { const t = (x - 28) / 18; return 2.6 + (6.8 - 2.6) * t * t; }          // taper
    if (x < 69) return 6.8;                                                            // barrel
    const t = (x - 69) / (x1 - 69); return 6.8 * Math.sqrt(Math.max(0, 1 - t * t));     // cap
  };
  for (let x = x0; x <= x1; x++) {
    const t = ht(x); if (t <= 0) continue;
    const top = Math.round(cy - t), bot = Math.round(cy + t);
    const isGrip = x >= 7 && x < 27;
    const isTape = x === 25 || x === 27 || x === 23;
    for (let y = top; y <= bot; y++) {
      const d = (y - cy) / t;              // -1 top .. +1 bottom
      let c;
      if (y === top || y === bot) c = OUT_C;
      else if (isTape && !(y === top || y === bot)) c = TAPE;
      else if (isGrip) c = d < -0.15 ? GRIP_HI : GRIP;
      else if (d < -0.62) c = WOOD_L;
      else if (d < -0.28) c = WOOD_HI;      // specular streak along the top of the barrel
      else if (d < 0.35) c = WOOD_M;
      else c = WOOD_D;
      px(p, x, y, c);
    }
    // wood grain: faint darker ticks along the barrel
    if (x > 48 && x % 6 === 0) { px(p, x, cy + 1, WOOD_D); px(p, x, cy + 2, WOOD_D); }
  }
  // left/right end caps outline
  for (let y = Math.round(cy - ht(x0)); y <= Math.round(cy + ht(x0)); y++) px(p, x0, y, OUT_C);
  writeFileSync(`${OUT}/sprite-bat.png`, PNG.sync.write(p));
  console.log('wrote sprite-bat.png', W + 'x' + H);
}

// -------------------------------------------------------------- GLOVE ------
// Fielder's glove seen from a three-quarter top angle: palm + four finger
// stalls fanning up + thumb to the left + a dark catch pocket, cream lacing.
function glove() {
  const S = 54, p = make(S, S);
  const OUT_C = hex('#2b1a09'), L_HI = hex('#d2a05c'), L_LT = hex('#b8823c'),
        L_MD = hex('#96622c'), L_DK = hex('#6d4520'), POCKET = hex('#4a2c12'),
        LACE = hex('#f2e6c4');
  // A glove reads at 27px through a broad rounded mitt with a SCALLOPED top edge
  // plus dark finger creases and a laced web notch — not long separated stalls
  // (those read as claws). Bumps only bulge slightly past the palm.
  // NOTE screen-space angles: -90 deg is UP, +90 is DOWN. Fingers fan up-right,
  // the thumb sits up-LEFT, and a V notch is carved out between them — that
  // negative space in the rim is what makes it read as a glove when tiny.
  const pc = { x: 27, y: 31 }, pr = 15.0;
  const lobe = (deg, dist, r) => { const a = deg * Math.PI / 180;
    return { x: pc.x + Math.cos(a) * dist, y: pc.y + Math.sin(a) * dist, r }; };
  const fingers = [-98, -72, -46, -20].map(d => lobe(d, 13.5, 6.4));
  const thumb = lobe(-156, 12.5, 7.4);
  const notch = lobe(-128, 19.0, 6.2);                // carved out of the rim
  const sdf = (x, y) => {
    let d = Math.hypot(x - pc.x, y - pc.y) - pr;
    for (const f of fingers) d = Math.min(d, Math.hypot(x - f.x, y - f.y) - f.r);
    d = Math.min(d, Math.hypot(x - thumb.x, y - thumb.y) - thumb.r);
    return Math.max(d, -(Math.hypot(x - notch.x, y - notch.y) - notch.r));
  };
  for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) {
    const d = sdf(x + 0.5, y + 0.5);
    if (d > 0) continue;                              // outside the mitt
    if (d > -1.35) { px(p, x, y, OUT_C); continue; }   // outer outline
    // deep catch pocket, centred low in the palm (where a ball would sit)
    const pk = Math.hypot((x - 27.0) / 6.6, (y - 34.0) / 5.4) - 1;
    if (pk < 0) { px(p, x, y, pk > -0.3 ? OUT_C : POCKET); continue; }
    // shade by direction: light on the upper-left, dark lower-right
    const nx = (x - pc.x) / pr, ny = (y - pc.y) / pr, lum = -(nx * 0.45 + ny * 0.88);
    let c = lum > 0.55 ? L_HI : lum > 0.12 ? L_LT : lum > -0.45 ? L_MD : L_DK;
    if (d > -2.6 && lum > 0.2) c = L_HI;               // rim light along the top edge
    px(p, x, y, c);
  }
  // finger creases: a dark line down each valley between finger lobes — this is
  // what actually reads as "fingers" once the sprite is small.
  for (let i = 0; i < fingers.length - 1; i++) {
    const mx = (fingers[i].x + fingers[i + 1].x) / 2, my = (fingers[i].y + fingers[i + 1].y) / 2;
    const ang = Math.atan2(my - pc.y, mx - pc.x);
    for (let r = 4.5; r <= 13.5; r += 1) {
      const x = pc.x + Math.cos(ang) * r, y = pc.y + Math.sin(ang) * r;
      if (sdf(x, y) < -1.2) px(p, x, y, L_DK);
    }
  }
  // laced web in the notch between the thumb and the first finger
  for (let t = 0; t <= 1; t += 0.13) {
    const x = thumb.x + (fingers[0].x - thumb.x) * t, y = thumb.y + (fingers[0].y - thumb.y) * t;
    if (sdf(x, y) < -1.4) { px(p, x, y, LACE); px(p, x, y + 1, OUT_C); }
  }
  // stitch ticks along the scalloped top rim
  for (const f of fingers) {
    const ang = Math.atan2(f.y - pc.y, f.x - pc.x);
    const x = f.x + Math.cos(ang) * (f.r - 2.6), y = f.y + Math.sin(ang) * (f.r - 2.6);
    if (sdf(x, y) < -1.8) px(p, x, y, LACE);
  }
  writeFileSync(`${OUT}/sprite-glove.png`, PNG.sync.write(p));
  console.log('wrote sprite-glove.png', S + 'x' + S);
}

bat(); glove();
