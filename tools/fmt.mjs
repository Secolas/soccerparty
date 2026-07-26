#!/usr/bin/env node
// Break up absurdly long source lines at statement and array-element boundaries.
//
// The game source had lines up to 26,919 characters. That is not a style
// complaint. A one-character edit on such a line appears in a diff as the whole
// line changing, so a reviewer cannot see what actually moved — and review is
// the last line of defence here, because no automated check can notice that the
// ball stopped bouncing properly. grep and editors truncate too, which silently
// hides code from searches.
//
// The transformation is the most boring one available: insert a newline after a
// `;` that ends a top-level statement, or after a `,` that separates elements of
// a top-level array literal (the data tables — TACTICS, PRESETS, ACH — are one
// vast line each, and are the most-read code in the repo). Nothing is reordered,
// rewritten or deleted.
//
// The file is tokenized as ONE STREAM, not line by line. Strings, template
// literals, comments and unbalanced brackets all span lines, so a per-line
// scanner both mis-reads them and has to bail on the very lines this is meant
// to fix.
//
// Safety is proved, not assumed: canon() strips every whitespace character
// outside a literal and drops comments, and its output must be byte-identical
// before and after or the tool refuses to write. Because every insertion follows
// a `;` or `,`, there is no automatic-semicolon-insertion hazard.
//
// Usage:
//   node tools/fmt.mjs                 rewrite src/game/*.js
//   node tools/fmt.mjs --check         fail if any line exceeds the limit (CI)
//   node tools/fmt.mjs --limit 300

import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const CHECK = argv.includes('--check');
const li = argv.indexOf('--limit');
const LIMIT = li > -1 ? parseInt(argv[li + 1], 10) : 200;
const DIR = 'src/game';

// Tokenize the whole file and mark every character after which a newline may be
// inserted. Carrying state across newlines is the entire point.
function classify(src) {
  const brk = new Uint8Array(src.length);
  let i = 0, prevSig = '';
  const stack = [];   // open brackets, innermost last
  while (i < src.length) {
    const c = src[i], c2 = src[i + 1];
    if (c === '/' && c2 === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2; continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; i++;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === q) { i++; break; }
        i++;
      }
      prevSig = q; continue;
    }
    if (c === '/' && !/[A-Za-z0-9_$)\]]/.test(prevSig)) {
      i++;                                    // regex literal
      let cls = false;
      while (i < src.length) {
        if (src[i] === '\\') { i += 2; continue; }
        if (src[i] === '[') cls = true;
        else if (src[i] === ']') cls = false;
        else if (src[i] === '/' && !cls) { i++; break; }
        i++;
      }
      while (i < src.length && /[a-z]/.test(src[i])) i++;
      prevSig = '/'; continue;
    }
    if (c === '(' || c === '[' || c === '{') stack.push(c);
    else if (c === ')' || c === ']' || c === '}') stack.pop();
    // What matters is the INNERMOST open bracket, not a raw depth count. A `;`
    // separates statements whenever it sits directly inside a block — which
    // includes the body of a callback or IIFE, even though that body lives inside
    // the call's parentheses. Checking paren===0 instead wrongly excluded every
    // statement in `(function(){...})()` and `.forEach(function(){...})`, which
    // is where the longest surviving lines all were.
    const top = stack.length ? stack[stack.length - 1] : '';
    // a `;` directly inside a block (or at top level) ends a statement; the ones
    // in a `for(;;)` header have `(` on top and are excluded
    if (c === ';' && (top === '{' || top === '')) brk[i] = 1;
    // a `,` directly inside an array literal separates elements
    if (c === ',' && top === '[') brk[i] = 1;
    if (!/\s/.test(c)) prevSig = c;
    i++;
  }
  return brk;
}

// The file with all whitespace outside literals removed and comments dropped.
// Two versions equal under this differ only in formatting.
function canon(src) {
  let acc = '', i = 0, prevSig = '';
  while (i < src.length) {
    const c = src[i], c2 = src[i + 1];
    if (c === '/' && c2 === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    if (c === '/' && c2 === '*') {
      i += 2;
      while (i < src.length && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2; continue;
    }
    if (c === '"' || c === "'" || c === '`') {
      const q = c; acc += c; i++;
      while (i < src.length) {
        if (src[i] === '\\') { acc += src[i] + (src[i + 1] || ''); i += 2; continue; }
        acc += src[i];
        if (src[i] === q) { i++; break; }
        i++;
      }
      prevSig = q; continue;
    }
    if (c === '/' && !/[A-Za-z0-9_$)\]]/.test(prevSig)) {
      acc += c; i++;
      let cls = false;
      while (i < src.length) {
        if (src[i] === '\\') { acc += src[i] + (src[i + 1] || ''); i += 2; continue; }
        if (src[i] === '[') cls = true;
        else if (src[i] === ']') cls = false;
        acc += src[i];
        if (src[i] === '/' && !cls) { i++; break; }
        i++;
      }
      while (i < src.length && /[a-z]/.test(src[i])) { acc += src[i]; i++; }
      prevSig = '/'; continue;
    }
    if (/\s/.test(c)) { i++; continue; }
    acc += c; prevSig = c; i++;
  }
  return acc;
}

function reflow(src) {
  const brk = classify(src);
  const bounds = [];
  let lineStart = 0;
  for (let i = 0; i <= src.length; i++) {
    if (i === src.length || src[i] === '\n') { bounds.push([lineStart, i]); lineStart = i + 1; }
  }
  let out = '';
  for (let b = 0; b < bounds.length; b++) {
    const [s, e] = bounds[b];
    const line = src.slice(s, e);
    if (b) out += '\n';
    if (line.length <= LIMIT) { out += line; continue; }
    const indent = (line.match(/^\s*/) || [''])[0];
    const pieces = [];
    let start = s;
    for (let i = s; i < e; i++) {
      if (!brk[i]) continue;
      if (!src.slice(i + 1, e).trim()) continue;                 // nothing follows
      if (src.slice(start, i + 1).trim().length < 24) continue;   // avoid confetti
      pieces.push(src.slice(start, i + 1));
      start = i + 1;
    }
    if (!pieces.length) { out += line; continue; }
    pieces.push(src.slice(start, e));
    out += pieces
      .map((p, n) => (n === 0 ? p : indent + p.replace(/^\s+/, '')))
      .filter(p => p.trim().length)
      .join('\n');
  }
  return out;
}

const files = fs.readdirSync(DIR).filter(f => f.endsWith('.js')).sort();

if (CHECK) {
  const bad = [];
  for (const f of files) {
    fs.readFileSync(path.join(DIR, f), 'utf8').split('\n').forEach((l, n) => {
      if (l.length > LIMIT) bad.push(`${DIR}/${f}:${n + 1} is ${l.length} chars (limit ${LIMIT})`);
    });
  }
  if (bad.length) {
    console.error(`fmt: ${bad.length} line(s) over ${LIMIT} chars`);
    bad.slice(0, 20).forEach(b => console.error('  ' + b));
    if (bad.length > 20) console.error(`  ... and ${bad.length - 20} more`);
    console.error('run: node tools/fmt.mjs');
    process.exit(1);
  }
  console.log(`fmt OK: no line in ${DIR} exceeds ${LIMIT} chars`);
  process.exit(0);
}

let touched = 0, added = 0;
for (const f of files) {
  const p = path.join(DIR, f);
  const src = fs.readFileSync(p, 'utf8');
  const next = reflow(src);
  if (next === src) continue;
  if (canon(next) !== canon(src)) {
    console.error(`fmt: ABORT on ${f} — canonical form changed, refusing to write`);
    process.exit(1);
  }
  const delta = next.split('\n').length - src.split('\n').length;
  fs.writeFileSync(p, next);
  touched++; added += delta;
  console.log(`${f.padEnd(22)} +${delta} lines`);
}
console.log(`\n${touched} file(s) rewritten, ${added} line breaks inserted.`);
