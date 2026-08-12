#!/usr/bin/env node
// Capture REAL-ENGINE ability clips for the loading-screen showreel.
//
// Instead of hand-drawing the loader animations, this drives the shipped game
// through the ?sim=1 hook (src/game/18c-sim.js) in headless Chromium, sets up a
// practice-mode scenario per ability, launches the ball, and records the actual
// pitch frames. The ball is therefore pixel-identical to gameplay, because it IS
// gameplay. Output: assets/generated/load-<name>-sheet.png (horizontal strip of
// square frames), the same format the loader reads.
//
//   CHROMIUM_PATH=/opt/pw-browsers/chromium node tools/capture-abilities.mjs
//   ... --only ghost,serpent      # just some
//   ... --preview /tmp/x.png      # also write a stacked 4x contact sheet
//
// Each scenario is engine-automatic: no manual follow-up input, so what the
// camera records is what the real ability does to a placed shot.

import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import http from 'node:http';
import { createReadStream, statSync } from 'node:fs';

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dir, '..');
const GEN = join(ROOT, 'assets', 'generated');
const _req = createRequire(join(__dir, 'gen-assets.mjs'));
const { PNG } = _req('pngjs');
function loadPW() { for (const t of ['playwright', 'playwright-core', '/opt/node22/lib/node_modules/playwright']) { try { return _req(t); } catch (e) {} } console.error('playwright not found'); process.exit(2); }
const { chromium } = loadPW();

const argv = process.argv.slice(2);
const ONLY = (() => { const i = argv.indexOf('--only'); return i > -1 ? argv[i + 1].split(',') : null; })();
const PREVIEW = (() => { const i = argv.indexOf('--preview'); return i > -1 ? argv[i + 1] : null; })();

// Pitch is 234x350 in practice (see probe). Red attacks UP (toward y=20).
// center-x = 117-ish; ball spawns mid. Coordinates below are in that space.
const W = 234, H = 350, CX = 105, MID = 120;   // clean grass above the centre circle, clear of goal lines
const BOX = 84, OUT = 60, FRAMES = 12;          // tight window -> big readable ball
// A scenario places ONE token (its `def` team) at `spot`, parks the rest off-camera,
// then launches a SLOW ball so the effect stays in frame. Fixed camera at `center`
// unless `follow` (a tracking shot). `gap` ms between captured frames.
const SCENES = {
  // ball banana-curves across the frame (real Magnus from coin.spin; a wider view fits the arc)
  curve: { red: ['curve'], blue: [], def: null, center: { x: CX, y: MID + 4 }, box: 116,
    put: { x: CX + 15, y: MID + 44, vx: 0.2, vy: -3.4, spin: 2.6, turn: 'red' }, gap: 55 },
  // ball turns translucent and phases through an opponent defender token
  ghost: { red: ['ghost'], blue: ['defender', 'striker'], def: 'blue', spot: { x: CX, y: MID },
    center: { x: CX, y: MID }, put: { x: CX, y: MID + 40, vx: 0, vy: -3.4, turn: 'red' }, gap: 55 },
  // ball JUMPS high over an opponent token (airborne shots ignore players) and drops beyond it
  chip: { red: ['chip'], blue: ['defender', 'striker'], def: 'blue', spot: { x: CX, y: MID + 8 },
    center: { x: CX, y: MID }, box: 96, put: { x: CX, y: MID + 30, vx: 0, vy: -2.0, air: 36, turn: 'red' }, gap: 55 },
  // ball snakes up the pitch in a smooth S (serpent self-corrects its axis from the heading)
  serpent: { red: ['serpent'], blue: [], def: null, center: { x: CX, y: MID + 6 }, box: 108,
    put: { x: CX, y: MID + 54, vx: 0, vy: -2.4, turn: 'red' }, gap: 55 },
  // ball thuds to a dead stop against a heavy ANCHOR token (its speed collapses on contact)
  anchor: { red: [], blue: ['anchor', 'defender'], def: 'blue', dampOnly: true, spot: { x: CX, y: MID },
    center: { x: CX, y: MID }, put: { x: CX, y: MID + 40, vx: 0, vy: -4.2, turn: 'red' }, gap: 55 },
  // ball barges an opponent token aside and powers through
  drill: { red: ['drill'], blue: ['defender', 'striker'], def: 'blue', spot: { x: CX, y: MID },
    center: { x: CX, y: MID }, put: { x: CX, y: MID + 40, vx: 0, vy: -3.6, turn: 'red' }, gap: 55 },
  // ball strikes an opponent token; a shock freezes it (icy flash), rebound keeps pace
  aftershock: { red: ['aftershock'], blue: ['defender', 'striker'], def: 'blue', spot: { x: CX, y: MID },
    center: { x: CX, y: MID }, put: { x: CX, y: MID + 42, vx: 0, vy: -3.6, turn: 'red' }, gap: 55 },
  // slippery ball skids off a player at a surprise angle
  wet: { red: ['wet'], blue: ['defender', 'striker'], def: 'blue', spot: { x: CX - 5, y: MID },
    center: { x: CX, y: MID }, put: { x: CX + 4, y: MID + 42, vx: -0.4, vy: -3.6, turn: 'red' }, gap: 55 },
  // ball ricochets off one of your OWN players with extra speed
  bumper: { red: ['bumper'], blue: [], def: 'red', spot: { x: CX, y: MID },
    center: { x: CX, y: MID }, put: { x: CX + 5, y: MID + 42, vx: -0.5, vy: -3.8, turn: 'red' }, gap: 55 },
  // opponent's soft shot bends into the magnetic keeper and is caught (aim + camera from probe)
  magnet: { red: ['magnet'], blue: [], def: null, dyn: 'magnet', gap: 55 },
  // ball fired into the corner portal by the goal warps out the opposite corner (whole-board view)
  portal: { red: ['portal'], blue: [], def: null, dyn: 'portal', gap: 60 },
};

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.json': 'application/json' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const f = join(ROOT, rel);
  try { if (!statSync(f).isFile()) throw 0; res.writeHead(200, { 'Content-Type': MIME[f.slice(f.lastIndexOf('.')).toLowerCase()] || 'application/octet-stream' }); createReadStream(f).pipe(res); }
  catch { res.writeHead(404).end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;

const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 420, height: 820 } });
page.on('pageerror', () => {});
await page.addInitScript(() => { try { localStorage.setItem('sp_first_exh', '1'); localStorage.setItem('sp_tut_exh', '1'); localStorage.setItem('sp_tut_roy', '1'); localStorage.setItem('sp_ach', JSON.stringify({ done: { firstwin: 1 }, goals: 1, cups: [], matches: 1 })); } catch (e) {} });
await page.goto(`http://127.0.0.1:${PORT}/index.html?sim=1`, { waitUntil: 'load' });
await page.waitForFunction(() => /TAP TO START/.test(document.body.innerText || ''), { timeout: 30000 });
await page.mouse.click(210, 410);
await page.waitForFunction(() => !!window.__spSim, { timeout: 30000 });

const names = Object.keys(SCENES).filter(n => !ONLY || ONLY.includes(n));
const collected = {};
for (const name of names) {
  const S = SCENES[name];
  await page.evaluate(o => window.__spSim.start(o), { red: S.red, blue: S.blue, level: 'easy', size: 5 });
  await page.waitForTimeout(1400);
  // hide overlays that would bleed into the crop (VS card, kickoff banner)
  await page.evaluate(() => { ['ns_vs', 'ns_status'].forEach(id => { const e = document.getElementById(id); if (e) e.style.display = 'none'; }); });
  // relocate nails: put the chosen token at `spot`, park every other outfield token off-camera
  await page.evaluate(({ def, spot, dampOnly }) => {
    const nails = window.__spSim.probe().nails;
    let defIdx = -1;
    if (def) defIdx = nails.findIndex(n => n.team === def && !n.goalie && (!dampOnly || n.damp));
    let edge = 0;
    nails.forEach((n, i) => {
      if (n.goalie) return;                 // keepers stay off-camera
      if (i === defIdx) window.__spSim.nail({ i, x: spot.x, y: spot.y });
      else { window.__spSim.nail({ i, x: (edge % 2 ? 12 : 234 - 12), y: 300 + edge * 12 }); edge++; }
    });
  }, { def: S.def, spot: S.spot || S.center, dampOnly: !!S.dampOnly });
  // dynamic scenes (magnet/portal) derive their aim + camera from the live board geometry
  const eff = await page.evaluate(({ dyn, put, center, box }) => {
    if (!dyn) return { put, center, box };
    const p = window.__spSim.probe();
    if (dyn === 'magnet') {                                   // blue shoots softly at red's magnetic keeper
      const k = p.nails.find(n => n.team === 'red' && n.goalie) || { x: p.W / 2, y: p.H - 30 };
      return { put: { x: k.x, y: k.y - 60, vx: 0.35, vy: 2.9, turn: 'blue' }, center: { x: k.x, y: k.y - 10 }, box: 100 };
    }
    if (dyn === 'portal') {                                   // fire into red's bottom-left corner portal (framed on the entry swirl)
      const ex = p.WALL + 11, ey = p.H - p.WALL - 11;
      return { put: { x: ex + 30, y: ey - 30, vx: -2.8, vy: 2.8, turn: 'red' }, center: { x: ex + 8, y: ey - 8 }, box: 92 };
    }
    return { put, center, box };
  }, { dyn: S.dyn || null, put: S.put || null, center: S.center || null, box: S.box || null });
  // launch, then capture full-canvas frames + ball positions
  const cap = await page.evaluate(async ({ put, frames, gap }) => {
    window.__spSim.put(put);
    const c = document.getElementById('ns_game');
    const shots = [], pos = [];
    await new Promise(res => {
      let k = 0;
      function grab() {
        shots.push(c.toDataURL('image/png'));
        const p = window.__spSim.probe(); pos.push({ x: p.x, y: p.y });
        if (++k >= frames) return res();
        setTimeout(() => requestAnimationFrame(grab), gap);
      }
      requestAnimationFrame(grab);
    });
    return { shots, pos, cw: c.width, ch: c.height };
  }, { put: eff.put, frames: FRAMES, gap: S.gap });
  collected[name] = { ...cap, center: eff.center, box: eff.box };
  console.log(`captured ${name}: ${cap.shots.length} frames (${cap.cw}x${cap.ch})`);
}
await browser.close();
server.close();

// --- offline: crop each frame to a square box, assemble the sheet ------------
function decode(dataURL) { return PNG.sync.read(Buffer.from(dataURL.split(',')[1], 'base64')); }
function cropScaled(src, cx, cy, box, out) {
  const dst = new PNG({ width: out, height: out });
  const sx0 = Math.round(cx - box / 2), sy0 = Math.round(cy - box / 2), s = box / out;
  for (let y = 0; y < out; y++) for (let x = 0; x < out; x++) {
    const sx = Math.min(src.width - 1, Math.max(0, Math.round(sx0 + x * s)));
    const sy = Math.min(src.height - 1, Math.max(0, Math.round(sy0 + y * s)));
    const si = (src.width * sy + sx) << 2, di = (out * y + x) << 2;
    dst.data[di] = src.data[si]; dst.data[di + 1] = src.data[si + 1]; dst.data[di + 2] = src.data[si + 2]; dst.data[di + 3] = 255;
  }
  return dst;
}
const sheets = {};
for (const name of names) {
  const S = SCENES[name], cap = collected[name];
  const frames = cap.shots.map(decode);
  const sheet = new PNG({ width: OUT * frames.length, height: OUT });
  frames.forEach((fr, i) => {
    const c = cap.center || S.center;
    const cell = cropScaled(fr, c.x, c.y, cap.box || S.box || BOX, OUT);
    for (let y = 0; y < OUT; y++) for (let x = 0; x < OUT; x++) {
      const si = (OUT * y + x) << 2, di = (sheet.width * y + (i * OUT + x)) << 2;
      sheet.data[di] = cell.data[si]; sheet.data[di + 1] = cell.data[si + 1]; sheet.data[di + 2] = cell.data[si + 2]; sheet.data[di + 3] = 255;
    }
  });
  const out = join(GEN, `load-${name}-sheet.png`);
  writeFileSync(out, PNG.sync.write(sheet));
  sheets[name] = sheet;
  console.log('wrote', out);
}

if (PREVIEW) {
  const S = 3, cols = FRAMES, rows = names.length;
  const pv = new PNG({ width: OUT * cols * S, height: OUT * rows * S });
  names.forEach((name, r) => { const sh = sheets[name];
    for (let y = 0; y < OUT; y++) for (let x = 0; x < sh.width; x++) { const si = (sh.width * y + x) << 2;
      for (let dy = 0; dy < S; dy++) for (let dx = 0; dx < S; dx++) { const o = (pv.width * (r * OUT * S + y * S + dy) + x * S + dx) << 2;
        pv.data[o] = sh.data[si]; pv.data[o + 1] = sh.data[si + 1]; pv.data[o + 2] = sh.data[si + 2]; pv.data[o + 3] = 255; } } });
  writeFileSync(PREVIEW, PNG.sync.write(pv));
  console.log('preview', PREVIEW);
}
