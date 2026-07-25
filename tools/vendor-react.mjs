#!/usr/bin/env node
// Refresh the vendored React UMD builds in assets/vendor/.
//
// The game boots through the dc runtime, which otherwise downloads React and
// ReactDOM from unpkg.com on every load. That made the game unloadable when the
// CDN was blocked or slow, forced two blocking round-trips before first paint,
// ruled out offline/PWA use, and made headless smoke-testing impossible.
// Vendoring them removes the runtime's only external dependency: it skips its
// own download when window.React / window.ReactDOM already exist.
//
// Usage: node tools/vendor-react.mjs
// Pulls the tarballs from the npm registry, extracts the UMD production builds
// and verifies them against the SRI hashes the runtime pins, so the vendored
// bytes are provably the same as the CDN would have served.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, copyFileSync, readFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';

const VERSION = '18.3.1';
const OUT = path.resolve('assets/vendor');

// Hashes pinned inside the dc runtime for the CDN copies.
const EXPECTED = {
  'react.production.min.js':
    'sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z',
  'react-dom.production.min.js':
    'sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1',
};

const work = mkdtempSync(path.join(tmpdir(), 'vendor-react-'));
try {
  execFileSync('npm', ['pack', `react@${VERSION}`, `react-dom@${VERSION}`, '--silent'], {
    cwd: work, stdio: ['ignore', 'ignore', 'inherit'],
  });
  mkdirSync(OUT, { recursive: true });

  let failed = 0;
  for (const [pkg, file] of [
    ['react', 'react.production.min.js'],
    ['react-dom', 'react-dom.production.min.js'],
  ]) {
    execFileSync('tar', ['xzf', `${pkg}-${VERSION}.tgz`, `package/umd/${file}`], { cwd: work });
    const src = path.join(work, 'package', 'umd', file);
    const got = 'sha384-' + createHash('sha384').update(readFileSync(src)).digest('base64');
    if (got !== EXPECTED[file]) {
      console.error(`SRI MISMATCH for ${file}\n  expected ${EXPECTED[file]}\n  got      ${got}`);
      failed++;
      continue;
    }
    copyFileSync(src, path.join(OUT, file));
    console.log(`${file} -> assets/vendor/ (SRI verified)`);
  }
  if (failed) { console.error('refusing to vendor mismatched bytes'); process.exit(1); }
  console.log('done');
} finally {
  rmSync(work, { recursive: true, force: true });
}
