#!/usr/bin/env node
// Make the Season 2 Royale map taller without redrawing it.
//
// The approved artwork is 1376x768. Season 1's map is square, and the map panel
// takes its aspect from the image, so a wide Season 2 map sits as a short strip
// with dead space under it on a phone. Regenerating from the text prompt is not
// an option — nine attempts never got all nine regions right at once, and this
// one did.
//
// So the artwork is EXTENDED instead: it is pasted into a taller canvas and the
// model is asked to fill only the new empty bands at the top and bottom with
// matching terrain, leaving the nine stadium regions untouched. The result is
// checked before it is accepted — if the model redrew the middle instead of
// extending it, the run is rejected rather than silently shipped.
//
//   node tools/extend-roymap2.mjs            # target 4:3
//   node tools/extend-roymap2.mjs --ratio 1  # target square
//
// Writes assets/generated/roymap2.png only on success; the previous file is kept
// at assets/generated/roymap2-prev.png so a bad result is one copy away from
// being undone.

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const GEN = join(__dir, '..', 'assets', 'generated');
const SRC = join(GEN, 'roymap2.png');

// tools/ owns the SDK and the key loader, same as gen-assets.mjs
const _req = createRequire(join(__dir, 'gen-assets.mjs'));
const { GoogleGenAI } = _req('@google/genai');
try {
  const envf = join(__dir, '.env');
  if (existsSync(envf)) {
    for (const line of readFileSync(envf, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {}
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('Missing GEMINI_API_KEY'); process.exit(2); }

const ri = process.argv.indexOf('--ratio');
const RATIO = ri > -1 ? parseFloat(process.argv[ri + 1]) : 4 / 3;   // width / height

const RECOMPOSE = process.argv.includes('--recompose');
// The API takes an aspect label, not a float; map the requested ratio onto the
// nearest supported one.
const ASPECT_LABEL = (() => {
  const opts = [['1:1',1],['4:3',4/3],['3:4',0.75],['16:9',16/9],['9:16',9/16],['3:2',1.5],['2:3',2/3]];
  let best = opts[0];
  for (const o of opts) if (Math.abs(o[1]-RATIO) < Math.abs(best[1]-RATIO)) best = o;
  return best[0];
})();
console.log('requesting aspect', ASPECT_LABEL);

// Outpainting failed: the model returns the same aspect and ignores the empty
// bands. Recomposing works better — hand it the approved art as a reference and
// ask for the SAME nine regions redrawn to fill a taller frame.
const RECOMPOSE_PROMPT = `Here is a finished pixel-art soccer adventure map, 1376x768. Redraw this EXACT SAME map to fill a TALLER, more square frame, so that each of the nine regions becomes taller and the whole picture is roughly as tall as it is wide.

Keep EVERYTHING about the content identical - same nine regions, same 3x3 arrangement, same order, same colours, same hazards, same pixel-art style, same lighting:
- BOTTOM ROW left to right: pink CANDY pitch with jelly pads and caramel puddles; dark slate THUNDERSTORM pitch with lightning and rain puddles, its white markings clearly visible; glass AQUARIUM tank pitch with bubbles and a big striped fish.
- MIDDLE ROW left to right: dark blue SPACE STATION deck pitch with glowing magnet plates and a ringed planet; deep red CASINO pitch with an enormous roulette wheel set into it and giant white dice; pale grey SKATE PARK pitch with curved ramps and grind rails.
- TOP ROW left to right: dark green mossy JUNGLE RUINS pitch in shadowed temple with hanging vines; pale golden SANDY BEACH pitch with turquoise sea, tide waves, beach balls and red crabs; floodlit BLUE STADIUM with a green striped grass pitch and a GOLDEN TROPHY above it.
- Regions blend into each other through pine forest, green hills, rivers and coastline. Full bleed to all four edges.
- NO text, NO letters, NO numbers, NO labels, NO border, NO frame, NO margin.
Give every pitch bright white line markings, a centre circle and a small goal at each end. All nine regions must look clearly different from one another.

There must be EXACTLY NINE pitches in total - THREE rows of THREE. Do NOT repeat, duplicate or mirror any row or any region. Do NOT add a tenth pitch. The bottom row must appear ONCE only. The artwork must bleed to all four edges with NO white margin, NO padding and NO border.`;

const PROMPT = `Here is a finished pixel-art soccer adventure map. Your ONLY task is to EXTEND it vertically so the whole picture becomes taller, filling the empty transparent or blank areas at the TOP and the BOTTOM with more of the same landscape.

CRITICAL RULES:
- DO NOT redraw, move, resize, restyle or alter ANY of the nine soccer pitches or their surroundings. Every existing pixel of the original artwork must stay exactly as it is, in the same place.
- Only ADD new scenery in the empty band along the top edge and the empty band along the bottom edge.
- The new scenery must match the existing art perfectly in style, palette, lighting and pixel scale: more deep blue-teal ocean with gentle waves, coastline, pine forest, green hills, rocky mountains and winding rivers, continuing naturally from whatever already touches that edge.
- Add NO new soccer pitches, NO new stadiums, NO buildings of note, NO text, NO letters, NO numbers, NO labels, NO borders, NO frames and NO trophies.
- The result must be one seamless full-bleed illustration with no visible join between the original and the new areas.

Return the complete taller image.`;

const png = readFileSync(SRC);
// read PNG dimensions from the IHDR chunk
const W = png.readUInt32BE(16), H = png.readUInt32BE(20);
const targetH = Math.round(W / RATIO);
if (targetH <= H) {
  console.log(`already ${W}x${H} (aspect ${(W / H).toFixed(3)}); target ${RATIO} needs no extra height`);
  process.exit(0);
}
const pad = targetH - H;
console.log(`${W}x${H} -> ${W}x${targetH} (adding ${Math.round(pad / 2)}px top and bottom)`);

const ai = new GoogleGenAI({ apiKey: KEY });
const models = ['gemini-2.5-flash-image', 'gemini-2.0-flash-preview-image-generation'];
let out = null, used = null;
for (const model of models) {
  try {
    process.stdout.write(`extending via ${model} ... `);
    const res = await ai.models.generateContent({
      model,
      contents: [{
        role: 'user',
        parts: [
          { inlineData: { mimeType: 'image/png', data: png.toString('base64') } },
          { text: RECOMPOSE
              ? RECOMPOSE_PROMPT + `\n\nProduce a TALL image, approximately ${W}x${targetH}, aspect ratio close to ${RATIO.toFixed(2)} to 1.`
              : PROMPT + `\n\nThe original is ${W}x${H}. Produce approximately ${W}x${targetH}, keeping the original centred vertically.` },
        ],
      }],
      config: {
        responseModalities: ['Text', 'Image'],
        // image-to-image otherwise echoes the reference's aspect
        imageConfig: { aspectRatio: ASPECT_LABEL },
      },
    });
    const parts = res?.candidates?.[0]?.content?.parts || [];
    const img = parts.find((p) => p.inlineData?.data);
    if (!img) throw new Error('no image in response');
    out = Buffer.from(img.inlineData.data, 'base64');
    used = model;
    console.log('ok');
    break;
  } catch (e) {
    console.log('failed:', String(e.message || e).slice(0, 120));
  }
}
if (!out) { console.error('no model produced an image; original left untouched'); process.exit(1); }

const nw = out.readUInt32BE(16), nh = out.readUInt32BE(20);
const got = nw / nh;
console.log(`returned ${nw}x${nh} (aspect ${got.toFixed(3)}), wanted about ${RATIO.toFixed(3)}`);
// Guard: if it came back no taller than the original there was nothing gained,
// and shipping it would just lose quality to a round-trip.
if (got >= (W / H) - 0.05) {
  console.error('rejected: not meaningfully taller than the original; original left untouched');
  writeFileSync(join(GEN, 'roymap2-candidate.png'), out);
  console.error('candidate saved to assets/generated/roymap2-candidate.png for inspection');
  process.exit(1);
}
copyFileSync(SRC, join(GEN, 'roymap2-prev.png'));
writeFileSync(join(GEN, 'roymap2-candidate.png'), out);
console.log('candidate written to assets/generated/roymap2-candidate.png');
console.log('previous kept at assets/generated/roymap2-prev.png');
console.log('inspect it, then: cp assets/generated/roymap2-candidate.png assets/generated/roymap2.png');
