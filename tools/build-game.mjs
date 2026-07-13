#!/usr/bin/env node
// Reassembles the deployed index.html from the editable sources in src/.
//
//   node tools/build-game.mjs          rebuild index.html
//   node tools/build-game.mjs --check  verify index.html matches src/ (used by CI)
//
// How the pieces fit together:
//   src/game/*.js     the game code, split by feature, concatenated in filename order
//   src/template.html the game page; its __GAME_SCRIPT__ line is replaced by the game code
//   src/shell.html    the self-extracting bundle wrapper; its __TEMPLATE_JSON__ line is
//                     replaced by the JSON-encoded template
//
// The template is stored in index.html as a JSON string inside a <script> tag, so "</"
// must be escaped (the slash is emitted as a JSON unicode escape) or the browser
// would end the tag early while parsing.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'index.html');

const gameDir = path.join(SRC, 'game');
const parts = fs.readdirSync(gameDir).filter(f => f.endsWith('.js')).sort();
if (parts.length === 0) throw new Error('no game sources found in src/game/');

const gameScript = parts
  .map(f => fs.readFileSync(path.join(gameDir, f), 'utf8').replace(/\n$/, ''))
  .join('\n');

const template = fs.readFileSync(path.join(SRC, 'template.html'), 'utf8');
if (!/^__GAME_SCRIPT__$/m.test(template)) throw new Error('src/template.html is missing the __GAME_SCRIPT__ placeholder line');
const page = template.replace(/^__GAME_SCRIPT__$/m, () => gameScript);

const encoded = JSON.stringify(page).replace(/<\//g, '<\\u002F');

const shell = fs.readFileSync(path.join(SRC, 'shell.html'), 'utf8');
if (!/^__TEMPLATE_JSON__$/m.test(shell)) throw new Error('src/shell.html is missing the __TEMPLATE_JSON__ placeholder line');
const out = shell.replace(/^__TEMPLATE_JSON__$/m, () => encoded);

if (process.argv.includes('--check')) {
  const current = fs.readFileSync(OUT, 'utf8');
  if (current === out) {
    console.log('OK: index.html matches src/');
    process.exit(0);
  }
  // Byte differences can be pure escaping noise; compare the decoded game pages
  // to tell "cosmetic" apart from "actually different".
  const decode = html => {
    const m = html.split('\n').find(l => l.startsWith('"') && l.length > 100000);
    return m ? JSON.parse(m) : null;
  };
  const same = decode(current) !== null && decode(current) === decode(out);
  console.error(same
    ? 'STALE: index.html decodes to the same game but was not produced by this build. Run: node tools/build-game.mjs'
    : 'MISMATCH: index.html does not match src/. Edit src/ and run: node tools/build-game.mjs (never edit index.html directly)');
  process.exit(1);
}

fs.writeFileSync(OUT, out);
console.log('built index.html (' + out.length + ' chars) from ' + parts.length + ' game files');
