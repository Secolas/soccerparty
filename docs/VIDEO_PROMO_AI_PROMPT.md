# Soccer Party — AI Video Promo Prompt Pack

A ready-to-use prompt package for generating a promo video with **Higgsfield**
(or Runway Gen-3, Kling, Luma, Sora, Veo). Built from the actual game features,
not generic soccer footage.

---

## ⚠️ Read this first — the approach that actually works

Pure **text-to-video** AI *cannot* reproduce Soccer Party's exact pixel art,
national flags, coin-token players, or UI. If you prompt "pixel soccer game"
you'll get a generic, off-brand clip.

For an app promo, use **image-to-video** instead:

1. **Capture real footage/screens** from the game first:
   - The **TAP TO START** logo screen (SOCCER / PARTY stacked logo).
   - A slingshot **flick** in motion (drag-back aim arrow + shot).
   - A **goal** with the net bulging + scorebug ticking.
   - The **VS intro** cinematic (lightning + gold "VS").
   - The **STADIUM ROYALE** map with the 9 boss arenas.
   - 3–4 signature pitches: NEON, AQUARIUM (glass over deep sea), ICE, BEACH.
   - The **coin pot** filling and coins flying into the wallet.
   - An **ability** firing (Cannon / Curveball / Chip).
2. Feed each screenshot into Higgsfield as the **start frame**, then use the
   prompts below to describe the *camera move and motion* you want added.
3. Higgsfield's strength is **camera control** — lean on its motion presets
   (push-in, orbit, crash zoom, whip pan) rather than asking it to invent
   gameplay.

Text-to-video prompts are included at the end as a fallback / for abstract
hype cutaways, but image-to-video from real screens will look 10× more like
your actual game.

---

## 🎨 Style bible (paste into every shot)

Keep these descriptors consistent across all shots so the clips cut together:

> Retro SNES-era pixel art, crisp `image-rendering: pixelated` (no blur, no
> anti-aliasing), chunky "Press Start 2P" arcade font. Dark night-stadium mood:
> near-black `#0b0910` background, cream `#f4e9c8` text, signature lime-green
> `#a9c94b` and gold `#f2c14e` accents. Top-down tabletop-football board framed
> by animated pixel crowds. Glossy coin/disc player tokens painted in team kits.
> Punchy, arcade, celebratory. Mobile portrait (9:16) framing.

**Negative / avoid:** photorealism, 3D render, blurry, motion blur smear,
realistic humans, real stadium grass, generic FIFA look, watermark, warped
text, extra fingers, HUD clutter that isn't in the game.

---

## 🎬 Master promo — 30-second shot list (9:16 vertical)

Generate each shot as a 3–6s clip, then stitch. Every shot = one Higgsfield
generation. Format: **[Camera] + [Subject/motion] + style bible.**

### Shot 1 — Cold open / logo (0:00–0:03)
- **Input frame:** TAP TO START logo screen.
- **Camera:** slow push-in, subtle screen shake on impact.
- **Prompt:** "Slow cinematic push-in on a stacked pixel-art logo — the word
  SOCCER in cream, PARTY in lime-green — glowing over a dark night-stadium
  background, a gold coin spinning beside it, tiny pixel crowd twinkling in the
  stands. Retro arcade energy." + style bible.
- **On-screen text:** *(none — let the logo breathe)*

### Shot 2 — The flick hook (0:03–0:08)
- **Input frame:** a flick mid-aim (drag-back arrow visible).
- **Camera:** low push-in behind the token, then snap-follow the ball on release.
- **Prompt:** "Top-down view of a glossy coin-token soccer player. A slingshot
  aim arrow stretches back and glows from green to red, then RELEASES — the coin
  fires across the striped pixel board, ricochets off the wall throwing pixel
  sparks, and rockets toward goal. Fast, snappy, satisfying." + style bible.
- **On-screen text:** **FLICK. AIM. SCORE.**

### Shot 3 — GOAL celebration (0:08–0:12)
- **Input frame:** a goal moment (net bulging, scorebug).
- **Camera:** crash-zoom on the net, quick shake, then pull to the scorebug.
- **Prompt:** "The coin slams into the goal, the pixel net bulges and ripples,
  the giant tifo banner behind the goal waves wildly, the crowd erupts. A
  green-and-gold LED scorebug flips the score digit. Confetti of pixels, screen
  shake, pure celebration." + style bible.
- **On-screen text:** **GOOOAL!**

### Shot 4 — Stadium tour / pitch variety (0:12–0:18)
Rapid montage — 3 quick sub-clips (2s each) or one whip-pan sequence.
- **Input frames:** NEON, AQUARIUM, ICE pitches.
- **Camera:** whip-pan / fast dissolve between boards.
- **Prompt A (NEON):** "Fast whip-pan across a neon cyber pitch — glowing
  cyan-and-magenta grid lines, flying drones with colored lights, sweeping laser
  beams." + style bible.
- **Prompt B (AQUARIUM):** "Reveal a crystal-glass soccer pitch you look
  *through* into a deep-sea floor — light columns, coral clusters, rising
  bubbles, sea life drifting beneath the transparent board." + style bible.
- **Prompt C (ICE):** "An icy rink pitch, snowflakes falling, tiny pixel skaters
  gliding around the edges, a red center line, crisp winter light." + style bible.
- **On-screen text:** **13 PITCHES. ONE BOARD.**

### Shot 5 — STADIUM ROYALE (0:18–0:23)
- **Input frame:** the Royale map (dotted path, 9 arena nodes).
- **Camera:** dolly along the dotted path, then crash-zoom into a boss arena.
- **Prompt:** "Camera glides along a dotted map path linking nine themed boss
  arenas, a VS coin advancing node to node, then CRASH-ZOOMS into a chaotic
  arena — pinball bumpers and flippers batting the ball, glowing portals, a
  giant boss keeper filling the goal. Escalating, high-stakes." + style bible.
- **On-screen text:** **STADIUM ROYALE — BEAT 9 BOSSES.**

### Shot 6 — Abilities power-up (0:23–0:27)
- **Input frames:** Cannon / Curveball / Chip firing.
- **Camera:** quick punch-in cuts, one per ability.
- **Prompt:** "Rapid-fire montage of special shots: a CANNON shot doubling in
  power with a muzzle flash, a CURVEBALL bending in a glowing arc, a CHIP shot
  lofting airborne over defenders. Each fires with a burst of pixel light and a
  chiptune zap." + style bible.
- **On-screen text:** **CURVE • CANNON • CHIP • +20 ABILITIES**

### Shot 7 — Coin economy flourish (0:27–0:29)
- **Input frame:** coins flying into the wallet / pot.
- **Camera:** tight push-in on the pot, coins streak to wallet.
- **Prompt:** "Gold pixel coins spin on the board, a shot rolls over them
  scooping them into a glowing POT, then coins streak in a golden arc into the
  wallet counter which spins upward. Jackpot energy." + style bible.
- **On-screen text:** **BANK THE POT. ASSIST ×2.**

### Shot 8 — Logo + CTA outro (0:29–0:30+)
- **Input frame:** logo screen again.
- **Camera:** settle / gentle bob, gold shimmer sweep.
- **Prompt:** "Return to the SOCCER PARTY pixel logo, gold shimmer sweeping
  across it, a coin landing with a wink of light, confetti settling. Clean,
  iconic end card." + style bible.
- **On-screen text:** **SOCCER PARTY** → *Play free in your browser*

---

## 🎙️ Voiceover script (optional, ~30s, energetic arcade announcer)

> "Drag back… and FLICK. *(sfx: shot + goal)* Score across thirteen pixel
> pitches — from neon grids to a glass tank over the deep sea. Enter **Stadium
> Royale** and battle nine boss arenas. Curve it, cannon it, chip it — over
> twenty abilities. Grab the coins, bank the pot, lift the cup. **Soccer
> Party** — flick-football, party rules."

Keep it punchy; cut a word before you cut a beat.

---

## 🎵 Music & sound direction

- **Music:** upbeat 8-bit / chiptune anthem (kick-snare-hat-bass), ~130–150 BPM,
  building to a drop on the Shot 3 goal. Matches the game's own synth anthem bed.
- **SFX to layer:** slingshot *thwip* on flicks, wall-bounce *pings*, the rising
  4-note goal arpeggio (C-E-G-C) + crowd swell, coin "ching," a whistle to open
  and a champion sting to close.
- **Cut on the beat** — flicks and scene changes should land on downbeats.

## 🔤 On-screen caption style

- Font: **Press Start 2P** (or nearest pixel font) to match the game.
- Colors: cream `#f4e9c8` body, lime `#a9c94b` keywords, gold `#f2c14e` for the
  CTA. Chunky drop shadow, no fade — snap in/out on the beat.

---

## 🕹️ Higgsfield-specific tips

- Use **image-to-video** with your real screenshots as the start frame — this is
  the single biggest quality lever for app promos.
- Apply Higgsfield **camera motion presets** per shot: *Push-in* (logo/goal),
  *Crash Zoom* (Royale reveal), *Whip Pan* (pitch montage), *Orbit* (VS intro),
  *Bullet Time* (ability freeze). Let the preset do the movement, keep the text
  prompt about *what* moves.
- Keep clips **3–6s** — short generations stay coherent and on-model; stitch in
  a video editor (CapCut, Premiere, Resolve).
- Generate 2–3 variations per shot and pick the cleanest — pixel art can shimmer.
- Lock **9:16 vertical** for TikTok/Reels/Shorts; export a 16:9 recut for the
  web/store trailer by re-framing wider shots.
- If a shot warps the pixel text, regenerate with a shorter, motion-only prompt
  and rely on the input frame for the look.

---

## 🧾 Fallback: single text-to-video hero prompt

For one abstract hype clip when you don't have a screenshot to seed:

> "A high-energy retro SNES pixel-art soccer promo, 9:16 vertical. Top-down
> tabletop football board framed by cheering pixel crowds and rippling tifo
> banners. A glossy gold coin-token player is flicked slingshot-style — a glowing
> aim arrow stretches back then releases, the coin streaks across a striped
> neon-grid pitch, ricochets off the wall in a shower of pixel sparks, and slams
> into the goal; the net bulges, the crowd erupts, gold coins burst upward. Dark
> night-stadium palette with lime-green (#a9c94b) and gold accents, chunky
> 'Press Start 2P' arcade font, crisp pixels with no blur, celebratory chiptune
> energy. Camera pushes in then crash-zooms on the goal."
>
> **Negative:** photorealistic, 3D, blurry, motion blur, realistic humans, real
> grass, FIFA-style, warped text, watermark.

---

## 📋 Feature checklist (make sure the cut shows these)

- [x] Slingshot **flick** mechanic (drag-back aim arrow)
- [x] **Goal** celebration (net + tifo + scorebug + crowd)
- [x] Multiple **pitches** (neon, aquarium-glass, ice, beach…)
- [x] **STADIUM ROYALE** boss-arena run (9 arenas, hazards)
- [x] **Abilities** (Cannon, Curveball, Chip, +more)
- [x] **Coin economy** (pot, assist ×2, wallet)
- [x] **VS intro** cinematic (optional bonus shot)
- [x] **Logo / branding** open and close
- [x] Chiptune **music + SFX**
