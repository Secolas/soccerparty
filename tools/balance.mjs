#!/usr/bin/env node
// Balance harness: plays CPU-vs-CPU matches against the real engine and reports
// how often each ability wins.
//
// It drives the shipped game through the ?sim=1 hook (src/game/18c-sim.js)
// rather than reimplementing physics, so the numbers describe the game that
// actually ships. Matches run in practice mode — the one mode that skips the
// goal-time ability draft — so a loadout survives the whole match.
//
// Speed comes from a virtual clock: rAF callbacks and setTimeout are queued
// against a counter that advances a fixed 16.67ms per frame, and frames are run
// in batches through a MessageChannel (setTimeout(0) is clamped to ~4ms once
// nested, which caps a naive loop at ~250fps). That yields >200x realtime, so a
// full match takes about a second.
//
// READ THIS BEFORE TRUSTING THE NUMBERS
// The AI is not a stand-in for a human, so a win rate here is a claim about the
// CPU's use of an ability, not a human's.
//
//   - Engine-native effects (CANNON's 1.5x power, FREEZE's power cap, BIG
//     KEEPER, WALL, GLIDE, WET's bounce bias) are measured faithfully — the
//     physics does not care who is holding the flick.
//   - Abilities needing a manual follow-up input (CHIP's mid-flight tap,
//     BACKSPIN's aim compensation) read LOW, because the AI either skips the
//     input or fails to correct for the effect. A low score here is evidence
//     about the AI, not proof the ability is weak for a human.
//   - SNIPER is NOT the pure human-precision case it looks like: TAC.laser is
//     read in 09-ai.js, so the CPU consumes it too and its score is real.
//
// Check whether an ability's flag is actually read by 09-ai.js before drawing a
// conclusion from a low number.
//
// WHAT THIS SWEEP STRUCTURALLY CANNOT MEASURE
// Each ability is played ALONE against an EMPTY loadout. Four classes of
// ability therefore measure as a no-op no matter how strong they really are,
// and their numbers must not be used to set rarity:
//
//   no-op vs empty  the effect needs something the empty opponent never had.
//                   SWAP steals an opponent ability (there were none); MEDIC
//                   cures a curse (none were cast).
//   AI-immune       the effect targets the human interface. FOG hides the aim
//                   guide; the AI computes vectors and never reads one.
//   combo           designed to pair with another ability. SLOW MO's own
//                   description says "Pair with Joystick".
//   toggle floor    AB_TOGGLE abilities are measured permanently ON, because
//                   aiPickShotMod only toggles when the AI holds BOTH curve and
//                   serpent. A human switches a bad one off, so it can never be
//                   worse than neutral: treat these as floors and only ever
//                   promote on them, never demote.
//
// To measure these properly the sweep needs loadout pairs (ability vs ability),
// not ability vs nothing.
//
// Usage:
//   node tools/balance.mjs                     # every ability, default N
//   node tools/balance.mjs --n 100             # matches per ability (per side)
//   node tools/balance.mjs --only cannon,wall  # just these
//   node tools/balance.mjs --level hard --goals 3 --size 5
//   node tools/balance.mjs --workers 4 --json out.json
//   CHROMIUM_PATH=... to use a preinstalled browser.

import { createRequire } from 'node:module';
import path from 'node:path';
import http from 'node:http';
import os from 'node:os';
import { statSync, createReadStream, writeFileSync } from 'node:fs';

const _req = createRequire(import.meta.url);
function loadPlaywright() {
  for (const t of ['playwright', 'playwright-core',
    '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright']) {
    try { return _req(t); } catch (e) {}
  }
  console.error('balance: playwright not found. npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const { chromium } = loadPlaywright();

// ---- args ----------------------------------------------------------------
const argv = process.argv.slice(2);
const arg = (k, d) => { const i = argv.indexOf('--' + k); return i > -1 ? argv[i + 1] : d; };
const N        = parseInt(arg('n', '60'), 10);       // matches per side, per ability
const LEVEL    = arg('level', 'med');
const GOALS    = parseInt(arg('goals', '3'), 10);
const SIZE     = parseInt(arg('size', '5'), 10);
const ONLY     = (arg('only', '') || '').split(',').map(s => s.trim()).filter(Boolean);
const JSONOUT  = arg('json', null);
const WORKERS  = parseInt(arg('workers', String(Math.max(1, Math.min(6, os.cpus().length - 2)))), 10);

// ---- static server -------------------------------------------------------
const ROOT = path.resolve('.');
const MIME = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.png':'image/png',
  '.jpg':'image/jpeg', '.svg':'image/svg+xml', '.json':'application/json', '.woff2':'font/woff2', '.mp3':'audio/mpeg' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    if (!statSync(file).isFile()) throw new Error('dir');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  } catch (e) { res.writeHead(404).end('not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}/`;

// ---- page setup ----------------------------------------------------------
const VIRTUAL_CLOCK = () => {
  // Drawing is pure overhead here — nothing reads pixels back.
  const P = CanvasRenderingContext2D.prototype;
  const keep = new Set(['measureText','createRadialGradient','createLinearGradient','createPattern','getImageData','save','restore']);
  for (const k of Object.getOwnPropertyNames(P)) {
    try { const d = Object.getOwnPropertyDescriptor(P, k);
      if (!d || typeof d.value !== 'function' || keep.has(k)) continue; P[k] = function () {}; } catch (e) {}
  }
  P.measureText = () => ({ width: 10, actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2 });
  const g = { addColorStop() {} };
  P.createRadialGradient = () => g; P.createLinearGradient = () => g; P.createPattern = () => null;

  const STEP = 1000 / 60;
  let t = performance.now(), timers = [], id = 1, cbs = [];
  performance.now = () => t;
  window.setTimeout = (cb, d) => { const h = { id: id++, due: t + (+d || 0), cb }; timers.push(h); return h.id; };
  window.clearTimeout = (h) => { timers = timers.filter(x => x.id !== h); };
  window.requestAnimationFrame = (cb) => { cbs.push(cb); return cbs.length; };
  function frame() {
    t += STEP;
    const due = timers.filter(x => x.due <= t); timers = timers.filter(x => x.due > t);
    due.sort((a, b) => a.due - b.due).forEach(x => { try { x.cb(); } catch (e) {} });
    const run = cbs; cbs = [];
    run.forEach(cb => { try { cb(t); } catch (e) {} });
  }
  const mc = new MessageChannel();
  mc.port1.onmessage = () => { for (let i = 0; i < 240; i++) frame(); mc.port2.postMessage(0); };
  mc.port2.postMessage(0);
};

async function newWorker(browser) {
  const page = await browser.newPage({ viewport: { width: 420, height: 820 } });
  page.on('pageerror', () => {});           // a stray FX error must not kill a run
  await page.addInitScript(() => {
    try {
      localStorage.setItem('sp_first_exh', '1');
      localStorage.setItem('sp_tut_exh', '1');
      localStorage.setItem('sp_tut_roy', '1');
      localStorage.setItem('sp_ach', JSON.stringify({ done: { firstwin: 1 }, goals: 1, cups: [], matches: 1 }));
    } catch (e) {}
  });
  await page.goto(BASE + '?sim=1', { waitUntil: 'load' });
  await page.waitForFunction(() => /TAP TO START/.test(document.body.innerText || ''), { timeout: 30000 });
  await page.mouse.click(210, 410);
  await page.waitForFunction(() => !!window.__spSim, { timeout: 30000 });
  await page.evaluate(VIRTUAL_CLOCK);
  return page;
}

// A worker owns a page and replaces it when it dies or gets old. Chromium
// renderers do crash under a sustained full-speed frame loop, and a sweep that
// aborts on the 4th of 41 abilities is useless — a dead page has to cost one
// match, not the run. Pages are also recycled periodically: match state is
// rebuilt per match but the page accumulates across hundreds of them, and a
// fresh page is far cheaper than debugging a slow leak.
const RECYCLE_AFTER = 150;
class Worker {
  constructor(browser) { this.browser = browser; this.page = null; this.used = 0; this.crashes = 0; }
  async ready() {
    if (this.page && this.used < RECYCLE_AFTER) return this.page;
    await this.dispose();
    this.page = await newWorker(this.browser);
    this.used = 0;
    return this.page;
  }
  async dispose() {
    if (!this.page) return;
    try { await this.page.close(); } catch (e) {}
    this.page = null;
  }
  async run(red, blue) {
    for (let attempt = 0; attempt < 2; attempt++) {
      let page;
      try { page = await this.ready(); }
      catch (e) { this.page = null; continue; }
      try {
        this.used++;
        return await playMatch(page, red, blue);
      } catch (e) {
        // page died mid-match: drop it, take a fresh one, retry once
        this.crashes++;
        this.page = null;
        try { await page.close(); } catch (_) {}
      }
    }
    return { err: 'worker-crash' };
  }
}

async function playMatch(page, red, blue) {
  const ok = await page.evaluate(o => window.__spSim.start(o),
    { red, blue, level: LEVEL, size: SIZE, target: GOALS });
  if (ok !== true) return { err: String(ok) };
  // Poll inside the page: one round-trip per match instead of one per 120ms.
  // A match that never resolves (an ability that can deadlock the AI) has to
  // fail rather than hang the sweep, so this is bounded.
  try {
    await page.waitForFunction(() => window.__spSim.state().done, null, { polling: 25, timeout: 30000 });
  } catch (e) { return { err: 'timeout' }; }
  return await page.evaluate(() => window.__spSim.state());
}

// Wilson score interval — honest error bars on a win proportion at these Ns.
function wilson(wins, n) {
  if (!n) return [0, 0];
  const z = 1.96, p = wins / n, d = 1 + z * z / n;
  const c = (p + z * z / (2 * n)) / d;
  const h = (z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n))) / d;
  return [Math.max(0, c - h), Math.min(1, c + h)];
}

// ---- run -----------------------------------------------------------------
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ['--no-sandbox', '--disable-gpu', '--mute-audio', '--disable-dev-shm-usage'],
});

const probePage = await newWorker(browser);
const ALL = await probePage.evaluate(() => window.__spSim.abilities());
await probePage.close();
const LIST = ONLY.length ? ALL.filter(a => ONLY.includes(a)) : ALL;
if (ONLY.length) {
  const missing = ONLY.filter(o => !ALL.includes(o));
  if (missing.length) console.error(`unknown ability id(s): ${missing.join(', ')}`);
}

console.log(`balance: ${LIST.length} abilities x ${N} matches/side, level=${LEVEL}, first-to-${GOALS}, ${SIZE}-a-side, ${WORKERS} workers`);
console.log('(each ability is played on BOTH sides to cancel the kickoff advantage)\n');

// Baseline: no abilities at all. Quantifies how much red gains just by kicking
// off, which every ability number below has to be read against.
const workers = Array.from({ length: WORKERS }, () => new Worker(browser));

async function pool(jobs) {
  const out = new Array(jobs.length);
  let next = 0;
  await Promise.all(workers.map(async (w) => {
    while (true) {
      const i = next++;
      if (i >= jobs.length) return;
      out[i] = await jobs[i](w);
    }
  }));
  return out;
}

const t0 = Date.now();
const baseJobs = Array.from({ length: N * 2 }, () => (w) => w.run([], []));
const baseRes = await pool(baseJobs);
const baseOk = baseRes.filter(r => !r.err);
const baseRed = baseOk.filter(r => r.winner === 'red').length;
const basePct = baseOk.length ? baseRed / baseOk.length : 0;
console.log(`baseline (no abilities): red wins ${(basePct * 100).toFixed(1)}% of ${baseOk.length}`);
console.log(`  -> kickoff advantage = ${((basePct - 0.5) * 100).toFixed(1)}pp\n`);

const rows = [];
for (const ab of LIST) {
  // half the matches with the ability on red, half on blue
  const jobs = [
    ...Array.from({ length: N }, () => (w) => w.run([ab], []).then(r => ({ ...r, holder: 'red' }))),
    ...Array.from({ length: N }, () => (w) => w.run([], [ab]).then(r => ({ ...r, holder: 'blue' }))),
  ];
  const res = await pool(jobs);
  const ok = res.filter(r => !r.err);
  const wins = ok.filter(r => r.winner === r.holder).length;
  const errs = res.length - ok.length;
  const n = ok.length;
  const pct = n ? wins / n : 0;
  const [lo, hi] = wilson(wins, n);
  const turns = ok.length ? ok.reduce((a, r) => a + (r.turns || 0), 0) / ok.length : 0;
  rows.push({ id: ab, n, wins, pct, lo, hi, turns, errs });
  const bar = '█'.repeat(Math.round(pct * 30)).padEnd(30, '·');
  console.log(`${ab.padEnd(12)} ${(pct * 100).toFixed(1).padStart(5)}%  ${bar}  ±${(((hi - lo) / 2) * 100).toFixed(1)}pp  ${turns.toFixed(1)} turns${errs ? `  (${errs} failed)` : ''}`);
}

rows.sort((a, b) => b.pct - a.pct);

// 50% is NOT the fair line. Every ability here is played against an EMPTY
// loadout, so beating 50% is the whole point — an ability sitting at 50% is
// worth no more than having no ability at all, and one below 50% is actively
// hurting whoever holds it. The reference for "balanced" is the median ability;
// outliers are the ones whose interval clears it.
const sortedPct = rows.map(r => r.pct).slice().sort((a, b) => a - b);
const MED = sortedPct.length ? sortedPct[Math.floor(sortedPct.length / 2)] : 0.5;
console.log(`\n=== ranked (median ability = ${(MED * 100).toFixed(1)}%; 50% means "no better than nothing") ===`);
for (const r of rows) {
  const verdict = r.lo > MED ? 'ABOVE BAND' : (r.hi < MED ? 'BELOW BAND' : '');
  const dead = r.pct < 0.5 ? '  <- worse than no ability' : '';
  console.log(`${r.id.padEnd(12)} ${(r.pct * 100).toFixed(1).padStart(5)}%  [${(r.lo * 100).toFixed(0)}-${(r.hi * 100).toFixed(0)}]  ${verdict.padEnd(10)}${dead}`);
}
// A run that silently lost matches to crashes would look identical to a clean
// one, so say it out loud.
const totalCrashes = workers.reduce((a, w) => a + w.crashes, 0);
const totalErrs = rows.reduce((a, r) => a + r.errs, 0);
if (totalCrashes || totalErrs) {
  console.log(`\nWARNING: ${totalErrs} matches failed (${totalCrashes} page crashes) — those are excluded from the rates above.`);
}
const flagged = rows.filter(r => r.lo > MED || r.hi < MED);
const dead = rows.filter(r => r.pct < 0.5);
console.log(`\n${flagged.length} of ${rows.length} abilities sit outside the median band at N=${N * 2}.`);
console.log(`${dead.length} are below 50% — holding them is worse than holding nothing.`);
console.log(`took ${((Date.now() - t0) / 1000 / 60).toFixed(1)} min`);

if (JSONOUT) {
  writeFileSync(JSONOUT, JSON.stringify({
    config: { n: N, level: LEVEL, goals: GOALS, size: SIZE },
    baseline: { redWinPct: basePct, n: baseOk.length },
    rows,
  }, null, 2));
  console.log(`wrote ${JSONOUT}`);
}

await browser.close();
server.close();
