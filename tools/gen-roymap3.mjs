#!/usr/bin/env node
// Generate the SEASON 3 Royale journey map (assets/generated/roymap3.png).
//
// Same illustrated treatment and 3x3 region layout as roymap.png / roymap2.png, so the three
// season maps read as one family. The region order follows the Season 3 LADDER order
// (bottom row 1-3, middle 4-6, top 7-9, trophy at 9) — regenerate this if the ladder is ever
// reordered again. The lesson from Season 2 applies here too: one-shot generation rarely gets
// all nine regions right, so this script writes EVERY candidate to /tmp/roymap3-N.png and only
// copies a candidate to assets/generated/roymap3.png when --accept N is passed.
//
//   node tools/gen-roymap3.mjs               # generate 1 candidate -> /tmp/roymap3-1.png
//   node tools/gen-roymap3.mjs --n 3         # 3 candidates
//   node tools/gen-roymap3.mjs --accept 2    # ship /tmp/roymap3-2.png

import { createRequire } from 'node:module';
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dir = dirname(fileURLToPath(import.meta.url));
const GEN = join(__dir, '..', 'assets', 'generated');
const _req = createRequire(join(__dir, 'gen-assets.mjs'));
const { GoogleGenAI } = _req('@google/genai');
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

const SCENE = 'detailed 16-bit pixel art, rich shading, warm stadium atmosphere, cohesive retro palette, no text, no lettering, no watermark';
const PROMPT = `A beautiful hand-illustrated fantasy ADVENTURE MAP, richly detailed 16-bit PIXEL ART, FULL BLEED, land running to all four edges. NO border, NO frame, NO panel edges, NO dividing lines, NO margin, NO text, NO letters, NO numbers, NO labels. ONE single connected continent seen from above, with NINE neighbouring regions blending into each other through park, hill and river - never separate tiles or islands. Each region holds ONE clearly visible RECTANGULAR FOOTBALL PITCH with white markings and a small goal at each end, made of that region's material, and each pitch is COVERED IN ITS OWN SPORTS OBSTACLES so you can see what the stadium does. BOTTOM ROW, left to right: (1) a BASEBALL BALLPARK - a green pitch with a tan dirt infield DIAMOND across it, a wooden BAT lying at each end and small white baseballs; (2) a BOWLING ALLEY - a polished golden maple lane pitch with dark GUTTER channels down both sides and triangles of white BOWLING PINS with red neck stripes at each end, the lane itself spotless - no oil, no stains; (3) a MOTOR RACEWAY - a dark tarmac pitch ringed by red-and-white KERBS, with stacks of black TYRES on its corners, a glossy black OIL SLICK in the middle and a small START-LIGHT gantry of red and green lamps. MIDDLE ROW, left to right: (4) a GRIDIRON FOOTBALL field - a deep green pitch striped with white YARD LINES, tall yellow GOALPOSTS at each end; (5) a BASKETBALL HARDWOOD court - a warm maple pitch with an orange basketball HOOP with a white net guarding each goal and blue round TRAMPOLINES on the floor, and NOTHING ELSE on it - no gloves, no ropes; (6) a BOXING RING - a raised beige canvas pitch inside three taut RED ROPES with corner post pads, big red BOXING GLOVES mounted on the side walls and a hanging brown leather HEAVY BAG, and NOTHING ELSE on it - no trampolines, no hoops. TOP ROW, left to right: (7) a TENNIS CENTRE COURT - a bright blue court pitch split across the middle by a white NET, with two tennis RACKETS lying on it; (8) a CRAZY GOLF course - a bright green putting pitch with a blue POND in the middle, pale SAND BUNKERS, little trees and a golf CUP with a yellow FLAG; (9) top-right, a majestic floodlit ATHLETICS STADIUM - a green infield pitch ringed by a red RUNNING TRACK with white lane lines, and a huge GOLDEN TROPHY above it. Warm cohesive palette, crisp detailed pixel art, charming and epic. ${SCENE}`;

const argN = process.argv.indexOf('--n');
const N = argN > -1 ? parseInt(process.argv[argN + 1], 10) : 1;
const argA = process.argv.indexOf('--accept');

if (argA > -1) {
  const cand = `/tmp/roymap3-${process.argv[argA + 1]}.png`;
  if (existsSync(join(GEN, 'roymap3.png'))) copyFileSync(join(GEN, 'roymap3.png'), join(GEN, 'roymap3-prev.png'));
  copyFileSync(cand, join(GEN, 'roymap3.png'));
  console.log('shipped', cand, '-> assets/generated/roymap3.png');
  process.exit(0);
}

async function genOne(i) {
  for (const model of MODELS) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: PROMPT }] }],
        config: { responseModalities: ['TEXT', 'IMAGE'], imageConfig: { aspectRatio: '16:9' } },
      });
      const parts = res?.candidates?.[0]?.content?.parts || [];
      for (const p of parts) if (p.inlineData?.data) {
        const f = `/tmp/roymap3-${i}.png`;
        writeFileSync(f, Buffer.from(p.inlineData.data, 'base64'));
        console.log('candidate', f, `(${model})`);
        return true;
      }
      console.log(model, 'returned no image');
    } catch (e) { console.log(model, 'failed:', String(e).slice(0, 140)); }
  }
  return false;
}
for (let i = 1; i <= N; i++) await genOne(i);
