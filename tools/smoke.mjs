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
//   6. the PWA installs and the game still boots with the network cut
//
// Usage: node tools/smoke.mjs [--headed] [--slow] [--shots <dir>]
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
// --slow throttles the CPU to emulate a slow CI runner. Fixed sleeps used to make
// this test pass locally and fail in CI; run with --slow to catch that here.
const SLOW = process.argv.includes('--slow');
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
const waitFor = async (fn, failMsg, timeout = 20000) => {
  try { await page.waitForFunction(fn, { timeout }); return true; }
  catch (e) { if (failMsg) problems.push(failMsg); return false; }
};
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
if (SLOW) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
}
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
  // Wait for the menu rather than sleeping: CI runners are much slower than a
  // dev machine, and fixed sleeps here are what made the first CI run flaky.
  await waitFor(
    () => [...document.querySelectorAll('button')]
      .some(b => /^(PLAY|START TUTORIAL|START CUP|START ROYALE)\b/i.test((b.textContent || '').trim())
                 && b.offsetParent !== null),
    'menu never appeared after the tap-gate', 30000);
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
  await clickText(/^2 PLAYERS$/);      // no CPU: whoever wins the toss, the game waits for a human
  await page.waitForTimeout(300);
  const started = await clickText(/^(PLAY|START TUTORIAL|START CUP|START ROYALE)\b/);
  if (!started) problems.push('no PLAY/START button on the menu');

  await waitFor(() => !!document.getElementById('ns_scorebug'),
    'scorebug missing after starting a match', 30000);
  // the VS intro sits over the pitch for a couple of seconds
  await waitFor(() => !document.getElementById('ns_vs'), null, 12000);
  await page.evaluate(() => { const v = document.getElementById('ns_vs'); if (v) v.remove(); });
  await shot('setup');

  // kick off: wait for the button, click it, then let the coin toss play out
  await waitFor(() => {
    const s = document.getElementById('ns_start');
    return s && s.offsetParent !== null;
  }, 'kickoff button never became clickable', 20000);
  await page.evaluate(() => { const s = document.getElementById('ns_start'); if (s) s.click(); });

  // the flick counter only shows once it is the player's turn and play has begun
  await waitFor(() => {
    const n = document.getElementById('ns_flicknum_red');
    return n && n.offsetParent !== null;
  }, null, 30000);
  await shot('play');

  // 5. a flick must register. The game state lives inside componentDidMount, so
  //    assert on what a player can see. Two things matter for reliability: the
  //    ball has to be AT REST on our turn (the game ignores a grab while it is
  //    moving), and the counter has to be sampled while the ball is live (it
  //    resets to full once the turn passes).
  const ready = await page.evaluate(() => new Promise(res => {
    const c = document.getElementById('ns_game');
    const g = c.getContext('2d');
    // the ball is cream: bright and warm, unlike the pure-white pitch markings
    const findBall = () => {
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let sx = 0, sy = 0, n = 0;
      for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
        const i2 = (y * c.width + x) * 4, R = d[i2], G = d[i2 + 1], B = d[i2 + 2];
        if (R > 225 && G > 210 && B > 140 && B < 215 && R - B > 30) { sx += x; sy += y; n++; }
      }
      return n > 4 ? { x: sx / n, y: sy / n } : null;
    };
    let last = null, stable = 0;
    const t0 = Date.now();
    const iv = setInterval(() => {
      const n = ['ns_flicknum_red', 'ns_flicknum_blue']
        .map(id => document.getElementById(id))
        .find(e => e && e.offsetParent !== null);
      const myTurn = !!n;
      if (n) window.__turnId = n.id;
      const b = findBall();
      if (myTurn && b && last && Math.abs(b.x - last.x) < 0.7 && Math.abs(b.y - last.y) < 0.7) stable++;
      else stable = 0;
      last = b;
      if (stable >= 4) { clearInterval(iv); res({ ok: true, bx: b.x, by: b.y, count: n.textContent.trim(), id: n.id }); }
      else if (Date.now() - t0 > 45000) { clearInterval(iv); res({ ok: false, sawTurn: myTurn, sawBall: !!b }); }
    }, 120);
  }));

  if (!ready.ok) {
    problems.push(`never reached an idle player turn (my turn seen: ${ready.sawTurn}, ball found: ${ready.sawBall})`);
  } else {
    const box = await page.evaluate(([bx, by]) => {
      const c = document.getElementById('ns_game');
      const r = c.getBoundingClientRect();
      const cx = r.left + (bx / c.width) * r.width;
      const cy = r.top + (by / c.height) * r.height;
      const top = document.elementFromPoint(cx, cy);
      return { cx, cy, blockedBy: (top === c) ? null : (top ? (top.id || top.tagName) : 'nothing') };
    }, [ready.bx, ready.by]);
    // an overlay sitting over the pitch is a real bug class in its own right
    if (box.blockedBy) problems.push(`pitch is covered by #${box.blockedBy} — taps cannot reach the ball`);

    const watch = page.evaluate(([start, id]) => new Promise(res => {
      let dropped = false;
      const t0 = Date.now();
      const iv = setInterval(() => {
        const n = document.getElementById(id);
        if (n && n.textContent.trim() !== start) dropped = true;
        if (dropped || Date.now() - t0 > 8000) { clearInterval(iv); res(dropped); }
      }, 50);
    }), [ready.count, ready.id]);

    // Drag deliberately: a fast multi-step move can outrun a loaded main thread.
    await page.mouse.move(box.cx, box.cy);
    await page.mouse.down();
    for (let k = 1; k <= 7; k++) {
      await page.mouse.move(box.cx, box.cy + k * 10);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(120);
    await page.mouse.up();

    if (!await watch) problems.push(`flick did not register (counter never moved off ${ready.count})`);
    await page.waitForTimeout(400);
  }
  await shot('after-flick');

  // The balance harness needs a hook into the game's closure, and that hook must
  // never be reachable in a real session — it can start matches and rewrite
  // loadouts. It is armed by ?sim=1 only; this page was loaded without it.
  const simLeak = await page.evaluate(() => typeof window.__spSim);
  if (simLeak !== 'undefined') problems.push(`__spSim is exposed without ?sim=1 (got ${simLeak}) — the sim hook is reachable in production`);

  // 6. PWA: the manifest has to be installable and the service worker has to
  //    make the game boot offline. This only became possible once React stopped
  //    being fetched from a CDN, so it is worth guarding — it would regress
  //    silently the moment anything re-introduced a runtime download.
  const mf = await page.evaluate(async () => {
    const link = document.querySelector('link[rel=manifest]');
    if (!link) return { ok: false, why: 'no <link rel=manifest>' };
    try {
      const res = await fetch(link.href);
      if (!res.ok) return { ok: false, why: 'manifest ' + res.status };
      const m = await res.json();
      const big = (m.icons || []).some(i => parseInt(i.sizes) >= 192);
      const maskable = (m.icons || []).some(i => (i.purpose || '').includes('maskable'));
      return { ok: true, name: m.name, display: m.display, big, maskable };
    } catch (e) { return { ok: false, why: String(e) }; }
  });
  if (!mf.ok) problems.push(`manifest not usable: ${mf.why}`);
  else {
    if (mf.display !== 'standalone') problems.push(`manifest display is "${mf.display}", expected standalone`);
    if (!mf.big) problems.push('manifest has no icon >= 192px — browsers will not offer to install it');
    if (!mf.maskable) problems.push('manifest has no maskable icon — Android will letterbox the home-screen icon');
  }

  const sw = await page.evaluate(async () => {
    if (!('serviceWorker' in navigator)) return 'unsupported';
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise(r => setTimeout(() => r(null), 15000)),
    ]).catch(() => null);
    return reg ? (reg.active ? 'active' : 'not-active') : 'never-ready';
  });
  if (sw !== 'active') problems.push(`service worker ${sw} — the game will not work offline`);

  // cut the network and make sure it still starts
  await page.waitForTimeout(1500);            // let the precache settle
  await page.context().setOffline(true);
  let offlineBooted = false;
  try {
    await page.reload({ waitUntil: 'load', timeout: 25000 });
    offlineBooted = await page.waitForFunction(
      () => /TAP TO START/.test(document.body.innerText || ''), { timeout: 20000 }
    ).then(() => true).catch(() => false);
  } catch (e) { /* reported below */ }
  const offlineReact = offlineBooted
    ? await page.evaluate(() => !!(window.React && window.ReactDOM)).catch(() => false)
    : false;
  if (!offlineBooted) problems.push('game did not boot with the network offline');
  else if (!offlineReact) problems.push('offline boot is missing React — it is not being precached');
  await shot('offline');
  await page.context().setOffline(false);
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
console.log('smoke OK — booted, rendered, started a match, flicked, booted again offline, zero external requests');
