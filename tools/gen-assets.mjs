// Build-time asset generator for Soccer Party, using the Gemini API.
//
// The API key NEVER ships in the game. You run this locally, review the PNGs,
// keep the good ones, and commit them. The static game just loads the PNGs.
//
// Usage:
//   cd tools
//   npm install
//   echo "GEMINI_API_KEY=your_key_here" > .env      # .env is gitignored
//   node gen-assets.mjs                              # writes ../assets/generated/*.png
//
// If the model name errors, check the current one at:
//   https://ai.google.dev/gemini-api/docs/image-generation

import { GoogleGenAI } from "@google/genai";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { processIcon, processSheet, ICON_SIZE } from "./process-icon.mjs";

// ---- load key from tools/.env (or the environment) ----
const __dir = dirname(fileURLToPath(import.meta.url));
(function loadEnv() {
  const f = join(__dir, ".env");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
})();
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Missing GEMINI_API_KEY. Put it in tools/.env or the environment.");
  process.exit(1);
}

// Gemini image models ("Nano Banana"). Names change as models graduate from
// preview to GA, so we try each in order and use the first that responds.
// Update the list if the API changes: https://ai.google.dev/gemini-api/docs/image-generation
const MODEL_CANDIDATES = [
  "gemini-2.5-flash-image",
  "gemini-2.5-flash-image-preview",
  "gemini-2.0-flash-preview-image-generation",
];

// Style for small ability icons / single sprites: solid magenta background so the
// post-processor can flood-fill it out to transparency.
const ICON = "16-bit SNES pixel art, chunky visible pixels, clean bold silhouette, " +
  "vibrant retro palette, centered subject, flat solid #FF00FF magenta background, " +
  "no text, no lettering, no drop shadow, no gradient background";

// Style for larger scene assets (crowd, wooden board) kept as-is (no keying),
// matching the detailed, lush pixel-art look of the reference art.
const SCENE = "detailed 16-bit pixel art, rich shading, warm stadium atmosphere, " +
  "cohesive retro palette, no text, no lettering, no watermark";

// One entry per asset.
//   keyOut (default true) -> flood-fill background to transparency + trim + downscale
//   keyOut:false          -> keep the whole frame, just downscale (scene backgrounds)
//   size                  -> final square px (icons small, sprites medium, scenes large)
const ASSETS = [
  // Ability icons (small, transparent)
  { file: "icon-flick.png",    size: 64,  prompt: `A single chunky soccer cleat boot in side view, no ball, just the boot, in bright cream white and gold colours, very bold thick simple silhouette, dark outline, minimal detail, fills most of the frame, game icon. ${ICON}` },
  { file: "icon-wild.png",     size: 64,  prompt: `A playing card joker wild card, a single card tilted slightly with a bold star or question mark on its face and a colorful border, clean bold shapes, big and simple, game power-up icon. ${ICON}` },
  { file: "icon-swap.png",     size: 64,  prompt: `Two bold curved arrows forming a circular two-way swap or exchange symbol, one arrow bright blue and the other bright orange chasing each other in a ring, clean bold shapes, big and simple, game power-up icon. ${ICON}` },
  { file: "icon-trap.png",     size: 64,  prompt: `A round dark navy disc with a bold white spider web spun across it and a chunky black cartoon spider with a round body and thick legs sitting in the middle, clean bold shapes, big and simple, game power-up icon. ${ICON}` },
  { file: "icon-shield.png",   size: 64,  prompt: `A classic heraldic knight shield, glossy steel-blue with a bright white highlight and a bold dark outline, big and simple, front view, game power-up icon. ${ICON}` },
  { file: "icon-bumper.png",   size: 64,  prompt: `A glowing round pinball bumper mushroom cap, concentric orange and yellow rings with a bright glowing center and small white spark marks around the rim, bold thick shapes, top-down view, game power-up icon. ${ICON}` },
  { file: "icon-ricochet.png", size: 64,  prompt: `One bold bright yellow arrow ricocheting off a short thick grey wall bar in a clean V-shaped bounce, a small white impact spark where it hits, nothing else, bold thick shapes, big and simple, game power-up icon. ${ICON}` },
  { file: "icon-fog.png",      size: 64,  prompt: `A puffy grey storm fog cloud made of layered rounded puffs with a few short mist streak lines below it, bold thick shapes, big and simple, game power-up icon. ${ICON}` },
  { file: "icon-drunk.png",   size: 64,  prompt: `A frothy beer mug tankard full of amber beer with thick white foam overflowing the top, a chunky handle on the right side, one or two small curved wobble marks near the rim to suggest dizziness, bold thick shapes, big and simple, side view, game power-up icon. ${ICON}` },
  { file: "icon-serpent.png", size: 64,  prompt: `A bright green snake curled into a bold capital letter S shape, small head at the top with a round eye and a thin red forked tongue, simple round scales, bold thick shapes, big and simple, game power-up icon. ${ICON}` },
  { file: "icon-cannon.png",    size: 64,  prompt: `A stubby black iron cannon barrel with NO wheels and no carriage, angled up to the right, a lit fuse and a small puff of white smoke, bold thick shapes, big and simple, side view, game power-up icon. ${ICON}` },
  { file: "icon-curveball.png", size: 64,  prompt: `A ripe banana power-up icon (curveball). ${ICON}` },
  { file: "icon-glide.png",     size: 64,  prompt: `A shiny pale-blue ice cube power-up icon (glide). ${ICON}` },
  { file: "icon-magnet.png",    size: 64,  prompt: `A red horseshoe magnet power-up icon. ${ICON}` },
  { file: "icon-sticky.png",    size: 64,  prompt: `A golden honey pot power-up icon (sticky). ${ICON}` },
  { file: "icon-sniper.png",    size: 64,  prompt: `Just a single black telescopic rifle scope by itself (no gun), side view — a short chunky cylinder with a glinting glass lens at each end and adjustment rings, one clean simple bold object, centered, game power-up icon. ${ICON}` },
  { file: "icon-trophy.png",    size: 96,  prompt: `A shiny golden winner's trophy cup with two side handles on a stepped base, bright gold with highlights, bold simple chunky pixel art, centered, front view. ${ICON}` },
  { file: "icon-bigkeeper.png", size: 64,  prompt: `A single goalkeeper glove, palm facing forward, blue and white, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-freeze.png",    size: 64,  prompt: `A single crisp pale-blue and white snowflake, symmetrical, bold thick chunky arms, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-guided.png",    size: 64,  prompt: `A single bright cyan spiral swirl with an arrowhead, glowing, bold thick chunky, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-joystick.png",  size: 64,  prompt: `A single arcade joystick with a big bright RED glossy ball knob on top of a short black stick and a black base, vivid red sphere, front view, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-wall.png",      size: 64,  prompt: `A short sturdy grey stone brick wall barrier, front view, bold thick chunky blocks, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-hammer.png",    size: 64,  prompt: `A single chunky hammer with a grey metal head and brown wooden handle, diagonal, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-slowmo.png",    size: 64,  prompt: `A single chunky hourglass with glowing pale-cyan sand, bold thick outline, symmetrical, big and simple, centered, game power-up icon for slow motion. ${ICON}` },
  { file: "icon-ghost.png",     size: 64,  prompt: `A single cute white cartoon ghost with a wavy bottom and two dark eyes, glowing pale outline, bold thick chunky shape, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-reflex.png",   size: 64,  prompt: `A single bright blue goalkeeper glove with bold yellow speed motion lines behind it, dynamic, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-striker.png",  size: 64,  prompt: `Two overlapping round soccer player tokens like subbuteo counters, each a glossy circular disc with a bold horizontal green-and-yellow jersey stripe across the middle, one disc in front and an identical one offset behind it to show a duplicate extra player, top-down view, thick dark outline, bright high-contrast colors, bold simple chunky pixel art, big and easy to read, centered, game power-up icon. ${ICON}` },
  { file: "icon-anchor.png",   size: 64,  prompt: `A single heavy grey iron ship anchor, bold thick chunky shape, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-reflex-2.png", size: 64,  prompt: `A single dynamic goalkeeper in a blue jersey diving sideways to catch a ball, full-body action save pose, bold thick chunky pixel silhouette, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-striker-2.png",size: 64,  prompt: `A single golden soccer cleat boot kicking a white ball, with bold motion speed lines, side view, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-portal.png",   size: 64,  prompt: `A glowing swirling portal vortex, concentric rings of bright cyan and purple energy spiraling into a glowing white center, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-sweeper.png",  size: 64,  prompt: `A single blue and white goalkeeper glove punching a white soccer ball, with one bold bright forward-pointing arrow behind it, ABSOLUTELY NO person, no player, no arm, no body — ONLY the glove, the ball and the arrow, bold thick chunky pixel silhouette, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-strategist.png",size: 64, prompt: `A single tactics clipboard board, dark green with a white soccer pitch diagram and one bold bright yellow arrow drawn across it, held upright, front view, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-volley.png",   size: 64,  prompt: `A single golden soccer cleat boot striking a white soccer ball, with bold curved motion swoosh lines and a small white impact spark, ABSOLUTELY NO person, no player, no leg, no body — ONLY the boot and the ball, side view, bold thick chunky pixel silhouette, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-medic.png",    size: 64,  prompt: `A single bold red medical cross (plus symbol) on a white rounded first-aid badge, clean symmetrical shape, thick dark outline, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-flex.png",     size: 64,  prompt: `A bold flexed bicep ARM in the style of the 💪 emoji: one SOLID FILLED shape completely coloured in flat skin tone with a big rounded muscle bulge, simple flat shading, ONE thick dark outline on the outer edge ONLY, absolutely NO inner line-art, NO hollow areas, NO see-through gaps, filled like a sticker, chunky bold pixel art, big and simple, centered, game icon. ${ICON}` },
  { file: "icon-fire.png",     size: 64,  prompt: `A single bold campfire flame, bright orange yellow and red tongues of fire, clean bold chunky rounded shapes, thick dark outline, big and simple, centered, game icon. ${ICON}` },
  { file: "icon-lastchance.png", size: 64,  prompt: `A white and black soccer ball with a single bold bright red exclamation mark rising just above and beside it, an urgent do-or-die last-chance vibe, a couple of short motion spark lines, ABSOLUTELY NO person and no text letters, ONLY the ball and the exclamation mark, thick dark outline, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-trio.png",     size: 64,  prompt: `Three small white-and-black soccer balls at the three points of a triangle, joined by bold bright yellow curved passing arrows that loop from ball to ball, showing a quick one-two-three passing move, ABSOLUTELY NO person and no text letters, ONLY the three balls and the passing arrows, thick dark outline, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },
  { file: "icon-varcheck.png", size: 64,  prompt: `A chunky television or video monitor on a small stand, front view, a small green soccer pitch shown on its screen with one bold bright red X crossing it out to signal a disallowed goal (VAR video review), ABSOLUTELY NO person and no text letters, ONLY the monitor and the red X, thick dark outline, bold thick chunky shapes, big and simple, centered, game power-up icon. ${ICON}` },

  // Crowd fans — 2-frame animation sheets (rest pose | cheer pose). Both poses
  // of the SAME character in one image so they stay coherent; the processor
  // splits them into fan-N-1.png (rest) and fan-N-2.png (cheer). The game bobs
  // between the two frames and jumps them on goals.
  { file: "fan-1", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character at the same size and position. LEFT frame: standing relaxed, arms down. RIGHT frame: both arms raised cheering. Red jersey, dark skin, front view, full body. Clear vertical gap between the two frames. ${ICON}` },
  { file: "fan-2", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing, arms down. RIGHT: waving a little flag overhead. Blue jersey, light skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-3", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing, arms down. RIGHT: both fists punching up. Yellow jersey, brown skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-4", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing, arms down. RIGHT: arms up clapping. Green jersey, dark skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-5", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing holding a scarf low. RIGHT: holding the scarf stretched overhead. White jersey, light skin, front view, full body. Clear gap between frames. ${ICON}` },
  { file: "fan-6", frames: 2, size: 48, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small soccer fan side by side, identical character. LEFT: standing on the ground. RIGHT: jumping with joy, arms up. Orange jersey, brown skin, front view, full body. Clear gap between frames. ${ICON}` },

  // Animal mascots — 2-frame animation sheets (rest | active)
  { file: "sprite-dog",  frames: 2, size: 72, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small brown dog side by side, identical character. LEFT: standing calm. RIGHT: front paws up leaping happily, tail wagging. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },
  { file: "sprite-goat", frames: 2, size: 72, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small grey goat side by side, identical character. LEFT: standing calm. RIGHT: rearing up on hind legs. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },
  { file: "sprite-cat",  frames: 2, size: 64, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small orange tabby cat side by side, identical character. LEFT: sitting. RIGHT: stretching with tail up. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },
  { file: "sprite-bird", frames: 2, size: 56, prompt: `A 2-frame pixel-art sprite sheet: TWO copies of the SAME small blue bird side by side, identical character. LEFT: wings folded. RIGHT: wings spread up. Side view, cartoon mascot. Clear gap between frames. ${ICON}` },

  // Static decor + ground tiles + scoreboard skin
  { file: "sprite-tree.png", size: 96,  keyOut: true,  prompt: `A single lush round green tree with a brown trunk, side view. ${ICON}` },
  { file: "tile-grass.png",  size: 128, keyOut: false, prompt: `A seamless top-down lush green grass texture tile, subtle blades, pixel art, edges tile seamlessly. ${SCENE}` },
  { file: "tile-wood.png",   size: 128, keyOut: false, prompt: `A seamless horizontal wooden plank bleacher texture tile, warm brown boards, pixel art, edges tile seamlessly. ${SCENE}` },
  { file: "ui-board.png",    size: 256, keyOut: false, prompt: `A horizontal scoreboard panel made of carved wooden planks with brass corner brackets, empty face with no text, clean front-on view. ${SCENE}` },

  // Home-screen backdrop: dark and atmospheric so menu text stays readable on top.
  { file: "menu-bg.png",     size: 320, keyOut: false, prompt: `A moody night football stadium backdrop, portrait framing: very dark navy-to-black vertical gradient, two soft floodlight glows in the top corners, faint blurred crowd silhouettes across the upper stands, a dim empty pitch fading into darkness at the bottom, lots of dark negative space, subtle, atmospheric, no text, no players, no scoreboard. ${SCENE}` },

  // Versus-clash backdrops, one per country, themed to that nation's culture.
  // Dark base with glowing highlights so they read under a translucent kit tint.
  { file: "vsbg-brazil.png",      size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Rio de Janeiro on a bright sunny day: Sugarloaf Mountain and the Christ the Redeemer statue on a green hill above a blue bay, palm trees, a clear turquoise sky with a few white clouds, vivid and colourful, no text, no people. ${SCENE}` },
  { file: "vsbg-argentina.png",   size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. The colourful Caminito street in La Boca, Buenos Aires on a bright day: rows of vivid red, blue and yellow corrugated-metal houses, a clear blue sky, warm sunlight, cheerful and vibrant, no text, no people. ${SCENE}` },
  { file: "vsbg-france.png",       size: 320, keyOut: false, prompt: `Portrait framing, Paris at night: dark silhouette of the Eiffel Tower sparkling with warm golden lights, deep blue sky, a low city glow, lots of dark negative space, no text, no people. ${SCENE}` },
  { file: "vsbg-spain.png",        size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. A sunny Spanish plaza at midday: a grand sandstone cathedral and terracotta rooftops under a bright clear blue sky, strings of colourful festival flags, warm golden sunlight, vivid, no text, no people. ${SCENE}` },
  { file: "vsbg-germany.png",      size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. Neuschwanstein castle in Bavaria on a bright clear day: a fairytale white castle on a green forested hill with snow-capped Alps behind, a blue sky with white clouds, vivid, no text, no people. ${SCENE}` },
  { file: "vsbg-england.png",      size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. London by day: Big Ben and the Houses of Parliament beside the river under a bright partly-cloudy sky, a red double-decker bus on the bridge, warm daylight, crisp and colourful, no text, no people. ${SCENE}` },
  { file: "vsbg-portugal.png",     size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, absolutely no border, no decorative frame, no vignette, no letterboxing. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. Lisbon coast at dusk: dark silhouette of coastal cliffs and a hillside of tiled houses with a vintage tram, a warm sunset over the Atlantic, lots of dark negative space, no text, no people. ${SCENE}` },
  { file: "vsbg-netherlands.png",  size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. Dutch tulip fields by day: rows of bright red, yellow and pink tulips leading to classic windmills beside a canal, a big blue sky with fluffy white clouds, cheerful and vivid, no text, no people. ${SCENE}` },
  { file: "vsbg-italy.png",        size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. The Roman Colosseum on a bright sunny day: warm honey-coloured stone, a clear blue sky, cypress trees and umbrella pines, vivid Mediterranean daylight, no text, no people. ${SCENE}` },
  { file: "vsbg-belgium.png",      size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Chunky 16-bit pixel art. The Brussels Grand-Place at night: the ornate golden-lit guild-hall buildings sit small and centred in the middle of the frame, shown whole and complete (spires included, nothing cropped), surrounded by generous dark starry night sky above and a dark empty cobbled square below, warm window glow. Keep the important subject well away from every edge. no text, no people. ${SCENE}` },
  { file: "vsbg-croatia.png",      size: 320, keyOut: false, prompt: `Portrait framing, Dubrovnik at dusk: dark silhouette of red-roofed old-town walls above the Adriatic Sea, a warm sunset glow on the water, lots of dark negative space, no text, no people. ${SCENE}` },
  { file: "vsbg-japan.png",        size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Mount Fuji on a bright spring day: the snow-capped peak behind a red torii gate framed by pink cherry-blossom branches, a clear blue sky, vivid and serene, no text, no people. ${SCENE}` },
  { file: "vsbg-usa.png",          size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, no border, no frame, no vignette. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. New York City at night: a tall Manhattan skyline silhouette with the Statue of Liberty, thousands of tiny warm window lights, a deep starry blue sky, lots of dark negative space, no text, no people. ${SCENE}` },
  { file: "vsbg-mexico.png",       size: 320, keyOut: false, prompt: `Portrait framing, a Mexican Day of the Dead night: dark silhouette of an Aztec step-pyramid, a glowing marigold-orange light, papel picado banners and candle glow, lots of dark negative space, no text, no people. ${SCENE}` },
  { file: "vsbg-iceland.png",      size: 320, keyOut: false, prompt: `Portrait framing, Iceland at night: dark silhouette of a snowy volcanic mountain and a lone turf-roof house, swirling green aurora borealis overhead, a frozen waterfall catching faint light, deep blue sky, lots of dark negative space, no text, no people. ${SCENE}` },
  // App icon base: a ball being shot with a straight motion streak. The final
  // icon-app.png is built by compositing the real ability icons flying in the
  // trail — run `python3 tools/compose-app-icon.py` after regenerating this.
  { file: "icon-base.png",        size: 512, keyOut: false, prompt: `A square mobile app icon, chunky retro 16-bit PIXEL ART with large visible pixels and bold outlines. A single black-and-white soccer ball being SHOT fast across the frame, positioned to the RIGHT side, with a bold bright glowing STRAIGHT tapering motion streak / speed trail behind it coming from the lower-left (like a comet tail or motion blur, NOT a curved crescent, NOT a moon, NOT an arc). The trail is a strong diagonal line of energy. Clean vibrant lime-green and dark navy split background with a faint grid; generous empty space along the trail; NO other objects, NO icons, NO confetti clutter, no text, fills the whole square edge to edge.` },
  { file: "vsbg-senegal.png",      size: 320, keyOut: false, prompt: `Vertical full-bleed scene that fills the entire image edge to edge, absolutely no border, no decorative frame, no vignette, no letterboxing. Chunky retro 16-bit PIXEL ART with clearly visible large square pixels, dithering and a limited palette — NOT a photo, NOT realistic, NOT smooth. The Senegal savanna at dusk: dark silhouettes of flat-topped acacia trees and a lone baobab on the open plains, a giraffe silhouette, a big warm orange sun low on the horizon, lots of dark negative space, no text, no people. ${SCENE}` },
  { file: "roymap.png",            size: 512, keyOut: false, prompt: `A beautiful hand-illustrated fantasy ADVENTURE MAP, richly detailed 16-bit PIXEL ART, full-bleed edge to edge, in the style of an old quest map or a pilgrim journey map - lush, colourful and charming with lots of little detail. A single clear winding road travels from a small soccer village at the BOTTOM up to a majestic GOLDEN TROPHY STADIUM crowning the TOP. The road passes, in order from bottom to top, through distinct themed lands: a frozen snowy ICE lake, golden SAVANNA plains dotted with acacia trees, a quaint COBBLESTONE village, orange DESERT sand dunes, a glowing NEON night city, a misty FOGGY STREET district with lamp posts, a wooden WAREHOUSE port with crates, and a mighty grey STONE FORTRESS castle, before reaching a lush green GRASS stadium with the golden trophy at the summit. Rolling hills, forests, winding rivers, and little soccer touches like goalposts and balls. Keep the winding road itself clear and open - no dots, no numbers, no flags, no text, no labels. Warm cohesive palette, crisp detailed pixel art, charming and epic. ${SCENE}` },
];

const ai = new GoogleGenAI({ apiKey: KEY });
const OUT = join(__dir, "..", "assets", "generated");
mkdirSync(OUT, { recursive: true });

// Ask a candidate model for one image. Returns the base64 data, or throws.
async function tryGenerate(model, prompt) {
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
    config: { responseModalities: ["Text", "Image"] },
  });
  const parts = res?.candidates?.[0]?.content?.parts || [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) throw new Error("no image in response");
  return img.inlineData.data;
}

// Discover which candidate model this key/API version actually supports, so we
// only pay the discovery cost once instead of on every asset.
let MODEL = null;
let ok = 0;

// Optional: pass asset filenames as CLI args to regenerate only those
// (e.g. `node gen-assets.mjs icon-cannon.png icon-sniper.png`).
const ONLY = process.argv.slice(2);

for (const a of ASSETS) {
  if (ONLY.length && !ONLY.includes(a.file)) continue;
  process.stdout.write(`Generating ${a.file} ... `);
  const models = MODEL ? [MODEL] : MODEL_CANDIDATES;
  let done = false;
  let lastErr = "";
  for (const model of models) {
    try {
      const data = await tryGenerate(model, a.prompt);
      const raw = Buffer.from(data, "base64");
      // Always ship game-ready assets. Multi-frame assets are split into N
      // separate frame PNGs (base-1.png..base-N.png); everything else is a
      // single (optionally keyed) downscaled PNG. Fall back to raw on failure.
      if (a.frames && a.frames > 1) {
        const base = a.file.replace(/\.png$/, "");
        let frames;
        try {
          frames = processSheet(raw, { size: a.size || ICON_SIZE, frames: a.frames });
        } catch (pe) {
          console.log(`(kept raw sheet, split failed: ${pe.message}) `);
          frames = [raw];
        }
        frames.forEach((b, i) => writeFileSync(join(OUT, `${base}-${i + 1}.png`), b));
      } else {
        let outBuf = raw;
        try {
          outBuf = processIcon(raw, { size: a.size || ICON_SIZE, keyOut: a.keyOut !== false });
        } catch (pe) {
          console.log(`(kept raw, post-process failed: ${pe.message}) `);
        }
        writeFileSync(join(OUT, a.file), outBuf);
      }
      MODEL = model; // lock in the working model for the rest
      console.log(`ok (${model}, ${a.frames ? a.frames + "f " : ""}${a.size || ICON_SIZE}px)`);
      ok++;
      done = true;
      break;
    } catch (e) {
      lastErr = e.message;
    }
  }
  if (!done) console.log("FAILED:", lastErr);
}

if (ok === 0) {
  console.error(
    `\nNo assets were generated. Tried models: ${MODEL_CANDIDATES.join(", ")}. ` +
    "Check the error above (usually a bad/expired GEMINI_API_KEY or a renamed " +
    "model). Current model names: https://ai.google.dev/gemini-api/docs/image-generation"
  );
  process.exit(1); // fail the job so the run shows red, not a misleading green
}

console.log(
  `\nDone -> assets/generated/ (${ok}/${ASSETS.length}). Next: clean them up ` +
  "(key out the magenta to transparency, downscale to ~24px), keep the good ones."
);
