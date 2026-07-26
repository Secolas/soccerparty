# Season 3 Ideas — Design Backlog

Parking lot for post–Season 2 content. **Season 3's theme is other sports** — a
third Royale ladder where every stadium is built around a different sport
(baseball, basketball, tennis, golf…), each borrowing a signature mechanic from
that sport. Same shape as Season 1 & 2 (9 arenas, easy → hard, 3 signature
conditions each, built visual + music first and hazards layered on later,
difficulty-scaled).

Alongside the ladder: a batch of new abilities (in
[`ABILITY_IDEAS.md`](./ABILITY_IDEAS.md)) and a proposed set of new national
teams (below). Everything here is a starting scaffold — refine, cut, re-order.

## Guiding idea

Every arena reads instantly as its sport (court markings, crowd, kit, music) and
plays a hazard lifted from that sport. Where a sport's mechanic would echo one
already "spent" in Season 1 or 2, either differentiate it or swap the mechanic —
the notes call these out. Avoid re-skinning: ice-slip (frozen arena / would-be
hockey), whole-floor tilt (skatepark / would-be halfpipe), pinball bumpers,
portals, buoyant-water (aquarium / would-be swimming).

## Royale ladder — Season 3 (the "Sports" run)

### 1. ⚾ THE DIAMOND — "BASEBALL" (easy, ~d1)
- **Batter's box** — a bat swings on a timed arc by the sideline; catch the beat
  and it launches your ball goalward at +speed, mistime it and it swats it away
- **Pitching machine** — a feeder that periodically fires a stray baseball across
  the pitch as a moving obstacle
- **Base paths** — diamond speed lanes; rolling along a base line carries faster
- *New mechanic:* a **rhythm-timed deflector** (the bat) — the game's first
  "hit the beat for a payoff" hazard. Friendly, teachable, great opener.

### 2. 🏀 THE HARDWOOD — "BASKETBALL" (easy–med, ~d2)
- **Dribble ball** — the ball bounces with an oscillating height; it can only be
  blocked/tackled when it's *down* on the hardwood, sailing over defenders on the
  up-beat
- **Backboards** — angled boards behind each goal you can bank a shot off
- **Shot clock** — a possession timer that speeds the ball up as it runs down
- *New mechanic:* a **dribble / height-cycle ball** — blockable only on the
  down-beat. The marquee new ball-feel of the season.

### 3. 🎾 CENTRE COURT — "TENNIS" (medium, ~d2–3)
- **The net** — a low barrier across midfield; grounded shots rebound off it, so
  you must lob (Chip) over — flat play is walled into your own half
- **Tramlines** — side speed lanes that keep the ball fast down the flanks
- **Ball-kid** — a little sweeper that jogs on to clear a stalled ball back in
- *New mechanic:* a **mid-pitch barrier only aerial shots clear** (a verticality
  gate) — makes Chip/Lob abilities suddenly essential.

### 4. ⛳ THE LINKS — "GOLF" (medium, ~d3)
- **Undulating greens** — patchy local slope contours that gently curve a *slow*
  ball toward or away from a low point (not Skatepark's whole-floor tilt —
  small, directional, a putting read)
- **Bunkers** — sand patches that bog the ball down
- **Windmill** — a rotating mini-golf sail that periodically blocks a lane
- *New mechanic:* **patchy directional slope contours** — reward reading the
  green, not just aiming straight.

### 5. 🏈 THE END ZONE — "GRIDIRON" (med–hard, ~d3–4)
- **Rushers** — linebacker markers that actively charge the ball's line and body
  it off course (a *pursuing* hazard, not a static block)
- **Yard lines** — zones that strip a little pace each line the ball crosses
  upfield (defensive drag that deepens toward goal)
- **Uprights** — narrow goalpost frames the ball rattles between
- *New mechanic:* **pursuing tackler hazards** that chase the ball — the biggest
  new "hazard type" of the season.

### 6. 🎳 THE ALLEY — "BOWLING" (med–hard, ~d4)
- **Pin rack** — a cluster of standing pins; strike them and they scatter into
  rolling debris that lingers as fresh obstacles (destructible → mess)
- **Gutter channels** — shallow side troughs that funnel a wall-hugging ball
- **Oiled lane** — a slick centre strip the ball keeps its pace across
- *New mechanic:* **destructible pin clusters** that convert into scattered
  obstacles — the pitch gets messier the longer the rally runs.

### 7. 🏎️ THE GRAND PRIX — "MOTORSPORT" (hard, ~d4)
- **Slipstream** — trail close behind the roaming pace-car and you draft, gaining
  speed; clip it and you spin out
- **Boost strips** — DRS pads that punch a crossing ball forward
- **Oil & tyre wall** — oil spills spin the ball; a springy tyre-wall boundary
- *New mechanic:* **slipstream drafting** behind a moving object — the first
  hazard you *want* to chase.

### 8. 🥊 THE RING — "BOXING" (hard, ~d4–5)
- **Ring ropes** — the elastic boundary flings the ball back inward with extra
  pace (a springy *edge*, distinct from Candy's interior bounce pads)
- **Speed-bag** — a swinging bag mid-pitch that jabs a passing ball off line on
  its beat
- **Canvas drag** — the mat slows a dawdling ball, keeping rallies moving
- *New mechanic:* a **fully elastic boundary** that returns shots amplified —
  turns the whole edge of the pitch into a weapon.

### 9. 🏟️ SPORTS DAY — "THE PODIUM" (final boss, all difficulties)
- **Event medley** — the arena cycles one signature condition from each prior
  sport on a telegraphed rotation (bat-beat → net → rushers → ropes → …)
- **Boss keeper** — per the S1 & S2 final pattern: a stacked keeper (Sweeper +
  Reflexes + Big Keeper) plus a fixed signature bonus escalating by tier
  (easy / med / hard each get one gift, e.g. Fog / Magnet / Cannon-style)
- **Home crowd** — cosmetic amp for the finale
- *New mechanic:* a **rotating gauntlet** that recombines the season's sports
  gimmicks — "everything you learned, all at once."

**Leaning:** **BASEBALL** (the bat-beat is a fresh, teachable hook and a friendly
first arena) and **BASKETBALL** (the dribble/height ball is the standout new
ball-feel). **GRIDIRON**'s pursuing rushers are the biggest new hazard type; ship
**THE PODIUM** last.

*Prototype order (unchanged from S2):* land each arena as a selectable exhibition
pitch — visual + music + ambience first — then layer the Royale hazard in,
difficulty-scaled (easy softens/soft-caps the harshest condition; med/med-hard
add count + frequency; hard runs all three at full strength).

## New national teams (Season 3 roster expansion)

**Docs proposal only — not yet implemented.** Current roster (16): Brazil,
Argentina, France, Spain, Germany, England, Portugal, Netherlands, Italy,
Belgium, Croatia, Japan, USA, Mexico, Iceland, Senegal.

Proposed additions below. "Kit type" maps to an existing `paintPattern` branch
in [`src/game/02-teams.js`](../src/game/02-teams.js) where possible; where it
says *new art*, the flag needs a small bespoke pixel routine (like `brazil`,
`spain`, `mexico` already have). Each new preset also wants a `KIT_ALT` pair
(home/away) and a `KIT_EMBLEM`, matching the existing entries.

| Country | Abbr | Primary | Kit type (flag) | Art effort | Notes |
|---|---|---|---|---|---|
| **Uruguay** | URU | `#7bb1e0` | `hbands` + `sun` emblem | reuse (sun exists) | Sky/white with a Sun of May — reuse the `sun` emblem drawn for ARG |
| **Colombia** | COL | `#fcd116` | `tricolor-h` (yellow/blue/red) | reuse | Top band is double-height on the real flag; tricolor-h approximates |
| **Nigeria** | NGA | `#008751` | `tricolor-v` (green/white/green) | reuse | Clean fit for the existing vertical tricolor |
| **Ivory Coast** | CIV | `#f77f00` | `tricolor-v` (orange/white/green) | reuse | Distinct primary from NGA |
| **Poland** | POL | `#dc143c` | `hhalves` (white/red) | reuse | Simplest possible fit |
| **Sweden** | SWE | `#006aa7` | `nordic` (blue/gold) | reuse | Nordic cross already exists (ISL uses it) |
| **Ghana** | GHA | `#ce1126` | `tricolor-h` (red/gold/green) + `star` | reuse | Black star over the gold band → `star` emblem, dark fg |
| **Cameroon** | CMR | `#007a5e` | `tricolor-v` (green/red/yellow) + `star` | reuse | Star on the centre red band |
| **Morocco** | MAR | `#c1272d` | solid red + green pentagram | *new art* | 5-point green star centred on red — small bespoke routine |
| **South Korea** | KOR | `#003478` | white + taegeuk + trigrams | *new art* | Most complex; taegeuk disc + 4 trigrams |
| **Türkiye** | TUR | `#e30a17` | solid red + crescent & star | *new art* | Crescent + star routine (reusable for other crescent flags) |
| **Australia** | AUS | `#00247d` | blue + union canton + stars | *new art* | Fiddly canton; lowest priority |

Suggested first tranche (all reuse existing pattern types, zero new art):
**Uruguay, Colombia, Nigeria, Poland, Sweden, Ghana** — six teams that drop
straight into `PRESETS` + `KIT_ALT` + `KIT_EMBLEM`. The *new art* flags
(Morocco, South Korea, Türkiye, Australia) are a nice second pass.

Implementation checklist per country (for whoever picks this up later):
1. Add a `{cat:'country', …}` entry to `PRESETS` in `src/game/02-teams.js`.
2. Add a `KIT_ALT[ABBR]` home/away pair and a `KIT_EMBLEM[ABBR]`.
3. If it needs bespoke flag art, add a `paintPattern` branch + a `JERSEY` entry.
4. Optionally map it in `COUNTRY_PITCH` (which pitch it plays home matches on).
5. `node tools/build-game.mjs` → `--check` → `node tools/smoke.mjs`, commit
   `src/` **and** the regenerated `index.html`.

## Abilities

Season 3's new ability ideas live in [`ABILITY_IDEAS.md`](./ABILITY_IDEAS.md)
under **"Season 3 batch (2026)"** — several hook into the sports arenas above
(Trailblazer ↔ Grand Prix boost/slipstream, Time Out ↔ any hazard arena,
Slalom ↔ Gridiron rushers & Bowling pins, Aftershock ↔ Boxing, Gyroscope ↔
Golf greens & Tennis).

## Other parking-lot notes

- Only one genuinely-new core mechanic is needed per arena; the other two
  conditions can lean on existing systems re-themed.
- Keep the 60 fps / no-per-frame-allocation guardrails from `POLISH_ROADMAP.md`
  in mind — the dribble-ball height cycle and the rhythm bat especially must not
  add per-frame gradients to the draw loop.
- Difficulty scaling convention (from Storm/Casino/Candy): easy softens or
  disables the harshest condition, med/med-hard adds count/frequency, hard runs
  everything at full strength.
