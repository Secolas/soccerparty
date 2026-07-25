#!/usr/bin/env node
// Headless smoke test: boots the built index.html in Chromium, plays a little,
// and fails on anything that a "does it compile" check cannot see.
//
// Every bug that reached a human during the tutorial work was the same shape:
// correct in code, wrong on screen (a coin toss overriding the scripted kickoff,
// hint rings drawn at the wrong origin, a step pointing at a hidden element, a
// panel behind a dialog). None were catchable by `build-game.mjs --check`,
// which only asserts index.html matches src/. This boots the real thing.
//
// Checks:
//   1. no external network request at all (the game must be self-contained)
//   2. no uncaught page error / failed resource
//   3. the canvas actually renders (non-blank pixels)
//   4. the tap-gate, menu and a real match are reachable
//   5. a flick is registered by the game (the flick counter ticks down)
//
// Usage: node tools/smoke.mjs [--headed] [--shots <dir>]
//   CHROMIUM_PATH=... to use a preinstalled browser.

import { createRequire } from 'node:module';

// Resolve playwright from the project, then from a global install, so the same
// script runs in CI (npm i playwright) and on a machine with it installed globally.
const _req = createRequire(import.meta.url);
function loadPlaywright() {
  const tries = ['playwright', 'playwright-core',
    '/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright'];
  for (const t of tries) { try { return _req(t); } catch (e) {} }
  console.error('smoke: playwright not found. Install with: npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const { chromium } = loadPlaywright();

import path from 'node:path';
import { mkdirSync, createReadStream, statSync } from 'node:fs';
import http from 'node:http';

const HEADED = process.argv.includes('--headed');
const shotsIx = process.argv.indexOf('--shots');
const SHOTS = shotsIx > -1 ? process.argv[shotsIx + 1] : null;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

// Serve over HTTP rather than file:// — the shell fetches its own bundle, which
// a file:// origin blocks under CORS, and http is what production actually uses.
const ROOT = path.resolve('.');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg' };
const server = http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/+/, '') || 'index.html';
  const file = path.join(ROOT, rel);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
  try {
    if (!statSync(file).isFile()) throw new Error('dir');
    res.writeHead(200, { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404).end('not found'); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const PORT = server.address().port;
const INDEX = `http://127.0.0.1:${PORT}/index.html`;

const problems = [];
const external = [];
let step = 0;

const browser = await chromium.launch({
  headless: !HEADED,
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const page = await browser.newPage({ viewport: { width: 420, height: 880 } });
// Mark the first-run flows as already seen so the smoke exercises normal play.
// (The tutorial deliberately gates input, which would otherwise block the flick.)
await page.addInitScript(() => {
  try {
    localStorage.setItem("ns_onboard_seen","1");
    localStorage.setItem("ns_howto_seen","1");
    localStorage.setItem("sp_tut_exh","1");
    localStorage.setItem("sp_tut_roy","1");
    localStorage.setItem("sp_first_exh","1");
  } catch (e) {}
});
const shot = async name => {
  if (!SHOTS) return;
  await page.screenshot({ path: path.join(SHOTS, `${String(++step).padStart(2, '0')}-${name}.png`) });
};

page.on('pageerror', e => problems.push(`pageerror: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') problems.push(`console.error: ${m.text()}`); });
page.on('requestfailed', r => problems.push(`requestfailed: ${r.url()} (${r.failure()?.errorText})`));
// The game must be fully self-contained: same-origin, data: and blob: only.
page.on('request', r => {
  const u = r.url();
  if (/^(data:|blob:|about:)/.test(u)) return;
  if (u.startsWith(`http://127.0.0.1:${PORT}/`)) return;   // our own static server
  external.push(u);
});

// Click the top-most visible element whose text matches. Returns its label.
const clickText = (re) => page.evaluate(rs => {
  const rx = new RegExp(rs, 'i');
  const els = [...document.querySelectorAll('button,div,span')].reverse();
  const hit = els.find(e => {
    if (!rx.test((e.textContent || '').trim())) return false;
    const st = getComputedStyle(e);
    return st.display !== 'none' && st.visibility !== 'hidden' && e.offsetParent !== null;
  });
  if (!hit) return null;
  hit.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, pointerId: 1, isPrimary: true }));
  hit.click();
  return (hit.textContent || '').trim().slice(0, 40);
}, re.source);

try {
  await page.goto(INDEX, { waitUntil: 'load' });

  // 1. the shell unpacks and the tap-gate (audio unlock) appears
  await page.waitForFunction(
    () => /TAP TO START/.test(document.body.innerText || ''),
    { timeout: 25000 }
  ).catch(() => problems.push('tap-to-start gate never appeared (shell failed to unpack?)'));
  await shot('gate');

  // dismiss it with a real trusted click in the middle of the screen
  await page.mouse.click(210, 440);
  await page.waitForTimeout(3000);
  await shot('menu');

  // 2. React must be the vendored copy, not a CDN download
  if (!await page.evaluate(() => !!(window.React && window.ReactDOM)))
    problems.push('React/ReactDOM missing after boot');

  // 3. the canvas must have painted something
  const painted = await page.evaluate(() => {
    const c = document.getElementById('ns_game');
    if (!c) return -1;
    const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 8) n++;
    return n;
  });
  if (painted < 0) problems.push('no #ns_game canvas');
  else if (painted < 500) problems.push(`canvas looks blank (${painted} painted px)`);

  // 4. into a match: drop the onboarding carousel, hit PLAY / START TUTORIAL
  await page.evaluate(() => { const o = document.getElementById('ns_onboard'); if (o) o.remove(); });
  const started = await clickText(/^(PLAY|START TUTORIAL|START CUP|START ROYALE)\b/);
  if (!started) problems.push('no PLAY/START button on the menu');
  await page.waitForTimeout(3000);

  await page.evaluate(() => { const v = document.getElementById('ns_vs'); if (v) v.remove(); });
  await page.waitForTimeout(500);
  await shot('setup');

  if (!await page.evaluate(() => !!document.getElementById('ns_scorebug')))
    problems.push('scorebug missing after starting a match');

  // kick off (setup -> play), then sit through the coin toss
  await page.evaluate(() => { const s = document.getElementById('ns_start'); if (s) s.click(); });
  await page.waitForTimeout(5000);
  await shot('play');

  // 5. a flick must register. The game's state lives inside componentDidMount,
  //    so assert on what the player can see: the flick counter ticking down.
  const before = await page.evaluate(() => {
    const n = document.getElementById('ns_flicknum_red');
    return n && n.offsetParent !== null ? n.textContent.trim() : null;
  });
  if (before === null) {
    problems.push('flick counter not visible — never reached a playable turn');
  } else {
    const box = await page.evaluate(() => {
      const c = document.getElementById('ns_game');
      const r = c.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const top = document.elementFromPoint(cx, cy);
      return { cx, cy, blockedBy: (top === c) ? null : (top ? (top.id || top.tagName) : 'nothing') };
    });
    // an overlay sitting over the pitch is a real bug class in its own right
    if (box.blockedBy) problems.push(`pitch is covered by #${box.blockedBy} — taps cannot reach the ball`);
    // Watch the counter while the ball is live. Sampling only after it settles
    // is unreliable: once the turn passes the counter resets to full again.
    const watch = page.evaluate(start => new Promise(res => {
      let dropped = false;
      const t0 = Date.now();
      const iv = setInterval(() => {
        const n = document.getElementById('ns_flicknum_red');
        if (n && n.textContent.trim() !== start) dropped = true;
        if (dropped || Date.now() - t0 > 4000) { clearInterval(iv); res(dropped); }
      }, 60);
    }), before);

    await page.mouse.move(box.cx, box.cy);
    await page.mouse.down();
    await page.mouse.move(box.cx, box.cy + 70, { steps: 8 });
    await page.mouse.up();

    if (!await watch) problems.push(`flick did not register (counter never moved off ${before})`);
    await page.waitForTimeout(600);
  }
  await shot('after-flick');
} catch (e) {
  problems.push(`harness: ${e.message}`);
} finally {
  await browser.close();
  await new Promise(r => server.close(r));
}

if (external.length) {
  problems.unshift(`game made ${external.length} external request(s): ${[...new Set(external)].slice(0, 5).join(', ')}`);
}

if (problems.length) {
  console.error('SMOKE FAILED');
  for (const p of problems) console.error('  - ' + p);
  process.exit(1);
}
console.log('smoke OK — booted, rendered, started a match, flicked, zero external requests');
