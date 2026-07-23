# Soccer Party — Promo Cut List (assets → storyboard)

Maps the **captured assets** (`promo-shots-final/`, `promo-video/`) onto the
8-shot storyboard in `VIDEO_PROMO_AI_PROMPT.md`. This is the editor's build
sheet: what goes on the timeline, for how long, what to do to it, and what still
needs to be shot or AI-generated.

**Target:** 30s vertical (9:16). **Music:** chiptune anthem ~130–150 BPM, drop
on the Shot 3 goal. Cut on the beat.

Legend: 🎬 = video clip · 🖼️ = still (animate with a Ken Burns move or feed to
Higgsfield image-to-video) · ⚠️ = gap, not yet captured (see "Gaps to fill").

---

## Timeline at a glance

| # | Time | Beat | Primary asset | Type |
|---|------|------|---------------|------|
| 1 | 0:00–0:03 | Logo cold-open | `inmatch`/logo crop ⚠️ + Higgsfield | 🖼️⚠️ |
| 2 | 0:03–0:08 | Flick hook | `02-neon-flick.webm` + `10-flick-aim-arrow.png` | 🎬🖼️ |
| 3 | 0:08–0:12 | GOAL | `12-ball-in-motion.png` + goal grab ⚠️ | 🖼️⚠️ |
| 4 | 0:12–0:18 | Pitch variety | `04-pitch-carousel.webm`, `01-aquarium-ambience.webm`, `inmatch-04/05/11` | 🎬🖼️ |
| 5 | 0:18–0:23 | Stadium Royale | `07-royale-world-map.png` + `06-royale-setup.png` | 🖼️ |
| 6 | 0:23–0:27 | Abilities | ability grab ⚠️ + `08-how-to-play.png` | ⚠️🖼️ |
| 7 | 0:27–0:29 | Coin economy | `03-neon-board-kickoff.png` + wallet grab ⚠️ | 🖼️⚠️ |
| 8 | 0:29–0:30 | Logo + CTA | same as Shot 1 | 🖼️⚠️ |

---

## Shot-by-shot

### Shot 1 — Logo cold-open · 0:00–0:03
- **Asset:** ⚠️ no standalone logo frame yet. Two options:
  - **Fast:** crop the "SOCCER / PARTY" logo from the top of
    `01-menu-exhibition.png` onto a black card.
  - **Best:** feed that crop to Higgsfield with a slow push-in (see prompt pack
    Shot 1) so it glows/assembles.
- **Editor:** black bg, logo centered, slow 3–5% scale-up. Optional coin-spin
  overlay.
- **Caption:** none. **Audio:** anthem intro swells in; whistle on cut-out.

### Shot 2 — Flick hook · 0:03–0:08
- **Asset:** 🎬 `02-neon-flick.webm` — the slingshot flick + shot travelling.
- **Editor:** trim to the **pull-back → release → ball streak** (~2.5–3s). Add a
  0.3s **freeze-frame** on `10-flick-aim-arrow.png` at the moment of max pull
  (arrow + power bar visible), then resume motion. Slight speed-ramp: 0.7× on the
  pull, 1.3× on the release.
- **Caption:** **FLICK. AIM. SCORE.** (snap in on release)
- **Audio:** slingshot *thwip* on release, wall *ping* if it bounces.

### Shot 3 — GOAL celebration · 0:08–0:12  ⚠️
- **Asset:** 🖼️ `12-ball-in-motion.png` / `11-flick-ball-travel.png` cover the
  approach, **but there is no net-bulge goal frame yet.**
- **Fill it (pick one):**
  - **Live grab (5s):** play a match, score, screen-record the net bulge + crowd.
  - **Higgsfield:** feed `03-neon-board-kickoff.png` with the Shot 3 prompt
    ("ball slams into the goal, net bulges, tifo waves, crowd erupts").
- **Editor:** crash-zoom on the goal mouth, 1–2 frame white flash, screen shake,
  then cut to the scorebug flipping.
- **Caption:** **GOOOAL!** **Audio:** rising 4-note goal arpeggio + crowd swell
  (the drop lands here).

### Shot 4 — Pitch variety · 0:12–0:18
- **Assets:**
  - 🎬 `04-pitch-carousel.webm` — spine of the montage (cycles all 12 boards).
  - 🎬 `01-aquarium-ambience.webm` — hero beat: fish drifting under the glass.
  - 🖼️ `inmatch-04-NEON`, `inmatch-05-ICE`, `inmatch-11-AQUARIUM` for punch-in stills.
- **Editor:** ride the carousel, but **cut away to full-screen `inmatch` stills**
  on the strongest 3 boards (NEON → AQUARIUM → ICE), each ~1s with a fast
  push-in, on the beat. Land on the aquarium clip so it breathes for 1.5s.
- **Caption:** **13 PITCHES. ONE BOARD.** (Note: 12 are shown here; the 13th,
  the animated preview variant, only appears in-menu — say "13" only if you also
  show it, otherwise change the caption to **12 WILD PITCHES**.)
- **Audio:** whoosh per cut; music continues.

### Shot 5 — Stadium Royale · 0:18–0:23
- **Assets:** 🖼️ `07-royale-world-map.png` (hero), `06-royale-setup.png` (support).
- **Editor:** **Ken Burns dolly** along the dotted path on the world map — start
  low on Stadium 1 (Frozen Arena), pan/zoom up toward Stadium 9 (the trophy
  final). Optional quick 0.5s cut to `06-royale-setup` for the "9 stadiums, one
  loss ends the run" line. For extra energy, feed the map to Higgsfield with a
  path-follow camera move.
- **Caption:** **STADIUM ROYALE — BEAT 9 BOSSES.**
- **Audio:** tension riser under the pan.

### Shot 6 — Abilities · 0:23–0:27  ⚠️
- **Asset:** ⚠️ no ability-firing footage yet. `08-how-to-play.png` can flash the
  ability list as a filler, but it reads as a menu, not action.
- **Fill it (pick one):**
  - **Live grab:** in a match, earn/buy Cannon, Curveball, Chip and screen-record
    each firing (3× ~1.5s).
  - **Higgsfield:** generate per the Shot 6 prompt (cannon muzzle-flash, curve
    arc, chip loft).
- **Editor:** 3 rapid punch-in cuts, one per ability, each with a light burst.
- **Caption:** **CURVE • CANNON • CHIP • 20+ ABILITIES**
- **Audio:** a distinct chiptune zap per ability.

### Shot 7 — Coin economy · 0:27–0:29  ⚠️
- **Asset:** 🖼️ `03-neon-board-kickoff.png` shows the gold coin tokens lining the
  rails (good establishing frame), **but no coins-into-wallet moment.**
- **Fill it:** live-grab a goal that banks the pot (the "BRA CLAIMS N COINS —
  ASSIST x2!" toast + coins flying to the wallet), or Higgsfield per Shot 7.
- **Editor:** tight push-in on the pot, coins streak up to the wallet counter.
- **Caption:** **BANK THE POT. ASSIST ×2.** **Audio:** rising coin "ching."

### Shot 8 — Logo + CTA outro · 0:29–0:30+
- **Asset:** reuse Shot 1 logo (crop or Higgsfield).
- **Editor:** settle the logo, gold shimmer sweep, coin lands with a wink.
- **Caption:** **SOCCER PARTY** → *Play free in your browser*
- **Audio:** champion sting + final whistle.

---

## Gaps to fill (only 4 short grabs)

Everything else is captured. To finish the cut you need:

1. **Logo card** (Shots 1 & 8) — crop from `01-menu-exhibition.png`, or a clean
   TAP-TO-START screen-record (~2s). Higgsfield can animate the crop.
2. **A goal** (Shot 3) — ~5s live screen-record of a net-bulge + celebration.
3. **Abilities firing** (Shot 6) — 3× ~1.5s of Cannon / Curveball / Chip.
4. **Coins → wallet** (Shot 7) — ~3s of a pot payout with the assist toast.

All four are quick live screen-records on a phone/browser, or Higgsfield
image-to-video from the stills we already have (prompts in
`VIDEO_PROMO_AI_PROMPT.md`).

## Assembly quick-steps (CapCut / Premiere / Resolve)

1. Drop the anthem on the audio track; mark the beat grid.
2. Lay clips/stills in storyboard order; trim each to the timeline table above.
3. Stills → add a push-in/Ken Burns keyframe (scale 100→108% over the shot).
4. Convert webm→mp4 if your editor needs it:
   `ffmpeg -i clip.webm -c:v libx264 -pix_fmt yuv420p clip.mp4`
5. Add captions in a pixel font (Press Start 2P), cream/lime/gold; snap on beats.
6. Layer SFX (thwip, ping, goal arpeggio, ching, whistle).
7. Export 1080×1920 (9:16) for TikTok/Reels/Shorts; recut a 16:9 for the web.
