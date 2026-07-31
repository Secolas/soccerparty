#!/usr/bin/env node
// Generate the 9 Royale TROPHY sprites (assets/generated/trophy-s{1,2,3}-{bronze,silver,gold}.png).
//
// One cup per season final x difficulty. Bronze = Easy, Silver = Medium, Gold = Hard.
// Each cup is decorated with the motifs of that season's FINAL-stadium hazards, so the trophy
// wears the pitch you beat. Rendered as a single centred pixel-art trophy on the SAME dark
// background the achievements screen and map summit use (#0e0b16), so it drops straight in with
// no chroma-keying. Same generate-candidates-then-accept flow as gen-roymap3.mjs.
//
//   node tools/gen-trophies.mjs                 # 1 candidate for every trophy -> /tmp/trophy-<key>-1.png
//   node tools/gen-trophies.mjs --n 3           # 3 candidates each
//   node tools/gen-trophies.mjs --only s3-gold  # just one trophy
//   node tools/gen-trophies.mjs --sheet         # assemble /tmp/trophies-gen.png contact sheet
//   node tools/gen-trophies.mjs --accept 2      # ship candidate #2 of every trophy
//   node tools/gen-trophies.mjs --accept 2 --only s3-gold

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const GEN = join(__dir, '..', 'assets', 'generated');
const _req = createRequire(join(__dir, 'gen-assets.mjs'));
const { GoogleGenAI } = _req('@google/genai');
const { PNG } = _req('pngjs');
try {
  const envf = join(__dir, '.env');
  if (existsSync(envf)) for (const line of readFileSync(envf, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
} catch (e) {}
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(2); }

const ai = new GoogleGenAI({ apiKey: KEY });
const MODELS = ['gemini-2.5-flash-image', 'gemini-2.5-flash-image-preview', 'gemini-2.0-flash-preview-image-generation'];

const STYLE = 'detailed 16-bit PIXEL ART, crisp clean pixels, rich metallic shading with clear highlights and reflections, cohesive retro palette, charming and epic, NO text, NO letters, NO numbers, NO watermark, NO frame, NO border';
const METALS = {
  bronze: 'BRONZE metal, warm coppery brown with orange highlights',
  silver: 'SILVER metal, cool bright chrome with white highlights',
  gold:   'GOLD metal, rich yellow gold with brilliant sparkling highlights',
};
// 3x3 spec table: each of the nine trophies gets its OWN silhouette AND its own
// slice of that season's hazards, so no cup repeats a shape or a motif within a
// season. Bronze=Easy, Silver=Medium, Gold=Hard; the cup grows grander with the
// difficulty. Season themes: S1 desert/haunted gauntlet, S2 tropical beach,
// S3 multi-sport athletics.
const SPEC = {
  's1-bronze': { shape: 'a small stout weathered cup with a wide shallow bowl, short chunky handles and a single chunky stone base', motif: 'a green desert CACTUS and a coiled green SNAKE wound around the bowl' },
  's1-silver': { shape: 'a tall slender chiselled cup with a narrow deep bowl, long spiky angular handles and a two-step base', motif: 'an erupting water GEYSER spout rising from the cup and a delicate SPIDER WEB strung between the handles' },
  's1-gold':   { shape: 'a huge grand ornate cup with a broad fluted bowl, big sweeping horned handles and a tall multi-tier pedestal, regal and imposing', motif: 'a crown of little skull-and-horn DEVIL charms around the rim and crossed BONES on the front, swirling desert dust' },
  's2-bronze': { shape: 'a small rounded cheerful cup with a wide friendly bowl, little loop handles and a short round base', motif: 'a colourful striped BEACH BALL and a yellow BANANA resting on the bowl' },
  's2-silver': { shape: 'a tall elegant cup with a smooth wave-curved fluted bowl, flowing ribbon handles and a two-tier base', motif: 'a little red CRAB and a green climbing PALM VINE with leaves curling up the stem' },
  's2-gold':   { shape: 'a huge majestic cup with a giant scalloped shell-like bowl, grand curling handles and a tall tiered pedestal', motif: 'a towering curling ocean WAVE cresting over the bowl and a golden lightning BOLT charm' },
  's3-bronze': { shape: 'a small solid sporty cup with a wide bowl, stubby handles and a blocky base', motif: 'a crossed BASEBALL BAT and a white baseball BALL, plus a few white bowling PINS' },
  's3-silver': { shape: 'a tall athletic cup with a sleek faceted bowl, streamlined handles and a two-tier base', motif: 'a TENNIS RACKET crossed with a golf FLAG and a taut tennis NET across the bowl' },
  's3-gold':   { shape: 'a huge imposing championship cup with a massive bowl, bold muscular handles and a towering multi-tier pedestal', motif: 'an orange BASKETBALL HOOP with a white net and big red BOXING GLOVES hanging from the handles' },
};

function promptFor(sk, mk) {
  const s = SPEC[`${sk}-${mk}`], mt = METALS[mk];
  return `A single victory TROPHY CUP, centred, front view, filling most of the frame, standing on a stepped pedestal base with a blank plaque. The whole trophy is cast in ${mt}. Its shape: ${s.shape}. It is decorated with ${s.motif}. ${STYLE}. Solid FLAT UNIFORM very dark background, exact colour #0e0b16 edge to edge, the trophy fully inside the frame with a little dark margin all around, a subtle soft glow directly behind the cup only, no ground shadow spilling to the edges, no scenery.`;
}

const TROPHIES = [];
for (const sk of ['s1', 's2', 's3']) for (const mk of ['bronze', 'silver', 'gold']) TROPHIES.push({ key: `${sk}-${mk}`, sk, mk });

const arg = (f) => { const i = process.argv.indexOf(f); return i > -1 ? process.argv[i + 1] : null; };
const N = arg('--n') ? parseInt(arg('--n'), 10) : 1;
const only = arg('--only');
const accept = arg('--accept');
const list = only ? TROPHIES.filter(t => t.key === only) : TROPHIES;

if (process.argv.includes('--sheet')) {
  // 3x3 contact sheet of /tmp/trophy-<key>-1.png for eyeballing
  const CELL = 220, cols = 3, rows = 3, out = new PNG({ width: cols * CELL, height: rows * CELL });
  for (let i = 0; i < out.data.length; i += 4) { out.data[i] = 14; out.data[i + 1] = 11; out.data[i + 2] = 22; out.data[i + 3] = 255; }
  TROPHIES.forEach((t, idx) => {
    const f = `/tmp/trophy-${t.key}-1.png`; if (!existsSync(f)) return;
    const src = PNG.sync.read(readFileSync(f));
    const cx = (idx % 3) * CELL, cy = Math.floor(idx / 3) * CELL;
    for (let y = 0; y < CELL; y++) for (let x = 0; x < CELL; x++) {
      const sx = Math.floor(x / CELL * src.width), sy = Math.floor(y / CELL * src.height);
      const si = (sy * src.width + sx) * 4, di = ((cy + y) * out.width + (cx + x)) * 4;
      out.data[di] = src.data[si]; out.data[di + 1] = src.data[si + 1]; out.data[di + 2] = src.data[si + 2]; out.data[di + 3] = 255;
    }
  });
  writeFileSync('/tmp/trophies-gen.png', PNG.sync.write(out));
  console.log('wrote /tmp/trophies-gen.png');
  process.exit(0);
}

// nearest-neighbour downscale to keep pixel-art crisp while cutting the 1024px
// generation down to a web-shippable sprite.
function downscale(src, size) {
  const out = new PNG({ width: size, height: size });
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const sx = Math.min(src.width - 1, Math.floor(x / size * src.width));
    const sy = Math.min(src.height - 1, Math.floor(y / size * src.height));
    const si = (sy * src.width + sx) * 4, di = (y * size + x) * 4;
    out.data[di] = src.data[si]; out.data[di + 1] = src.data[si + 1];
    out.data[di + 2] = src.data[si + 2]; out.data[di + 3] = src.data[si + 3];
  }
  return out;
}

if (accept != null) {
  const SIZE = 320;
  for (const t of list) {
    const cand = `/tmp/trophy-${t.key}-${accept}.png`;
    const dst = join(GEN, `trophy-${t.key}.png`);
    if (!existsSync(cand)) { console.log('missing', cand); continue; }
    if (existsSync(dst)) copyFileSync(dst, join(GEN, `trophy-${t.key}-prev.png`));
    const small = downscale(PNG.sync.read(readFileSync(cand)), SIZE);
    writeFileSync(dst, PNG.sync.write(small));
    console.log('shipped', cand, `-> ${dst} (${SIZE}px)`);
  }
  process.exit(0);
}

async function genOne(t, i) {
  const prompt = promptFor(t.sk, t.mk);
  for (const model of MODELS) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '1:1' } },
      });
      const parts = res?.candidates?.[0]?.content?.parts || [];
      for (const p of parts) if (p.inlineData?.data) {
        const f = `/tmp/trophy-${t.key}-${i}.png`;
        writeFileSync(f, Buffer.from(p.inlineData.data, 'base64'));
        console.log('candidate', f, `(${model})`);
        return true;
      }
      console.log(t.key, model, 'returned no image');
    } catch (e) { console.log(t.key, model, 'failed:', String(e).slice(0, 140)); }
  }
  return false;
}

for (const t of list) for (let i = 1; i <= N; i++) await genOne(t, i);
console.log('done');
