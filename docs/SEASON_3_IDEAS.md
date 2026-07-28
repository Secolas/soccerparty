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

## Hazard difficulty grammar (shared scaffold)

One reusable difficulty model that every Season 3 hazard plugs into, so a tier is
just a set of parameters. Lifted from how Storm/Casino/Candy already scale in
Season 2.

**Three knobs** every hazard moves along:
1. **Presence** — is it on at all? Easy usually switches the *nastiest* condition
   fully OFF (Storm's lightning is off on easy).
2. **Quantity** — how many instances (Candy's puddles 2/3/5, caramel 1/3/5).
3. **Intensity + intent** — radius / speed / frequency, and *random vs.
   aimed-at-you* (Casino's roulette is random on easy, aims at your goal on
   med/hard).

**Two invariants** that keep it fair at every tier:
- **Speed-gate** — a hazard only acts above a speed threshold, so a dying ball
  still settles and turns end (Storm's wind only bends flight above ~0.8 speed).
- **Symmetry** — mirror geometry, both teams feel it. Tune every tier to
  ~48–50% in `tools/balance.mjs` so any edge is skill, not the arena.

**Telegraph rule** — every hazard must be readable *before* it acts (the bat's
tempo, the pitching cadence, the shot-clock countdown). Difficulty raises the
stakes; it never removes the tell.

**Tier feel:**
- **Easy** — "meet the sport": worst condition off, effects gentle, mistakes
  harmless (you learn the mechanic safely).
- **Med** — "the sport bites": all three on, moderate.
- **Hard** — "the sport is hostile *and it targets you*": full intensity + aimed
  + one extra instance.

*Build order (unchanged from S2):* ship each arena as a selectable exhibition
pitch — board + music + ambience first, no hazard — then build the hazard at
**med** (the reference tuning) and derive easy (soften/disable) and hard
(amplify + aim) as multipliers off it. Balance-harness each tier before locking.

All numbers below are **starting values to tune**, not final.

## Royale ladder — Season 3 (the "Sports" run)

### 1. ⚾ THE DIAMOND — "BASEBALL" (easy, ~d1) — fully specced opener

**Fantasy:** a ballpark infield — the dirt diamond speeds you up, a batter takes
swings by the plate, the pitching machine spits stray balls. Route your shot
*through* the batter's box on the beat for a launch, or play it safe outside.

*New mechanic:* a **rhythm-timed deflector** (the bat) — the game's first "hit
the beat for a payoff" hazard.

**Design decisions (resolved):** one bat per attacking side (mirrored →
symmetric); base paths *help only*, no downside, to keep the opener inviting; on
hard the swat sends the ball **wide toward the sideline, never a clean own-goal**
(true own-goal risk is saved for later, harder arenas).

The bat sweeps continuously on the arena tempo; contact direction = where the bat
is in its arc. The **sweet spot** (pointing at the opponent goal) launches;
elsewhere it whacks the ball in the swing's current direction, so mistiming sends
it off-line.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Bat** swing period | 2.0 s | 1.4 s | 1.0 s |
| **Bat** sweet-spot share of arc | 60% (forgiving) | 35% | 15% (tight) |
| **Bat** sweet-spot launch | +25% toward goal | +40% | +55% |
| **Bat** off-beat contact | gentle nudge only | ±15° deflection | full swat, wide to sideline |
| **Bat** count | 1 / side | 1 / side | 2 / side |
| **Pitching machine** | OFF | 1, fires 3.5 s | 2, fires 2.2 s, leads your lane |
| **Base paths** carry | +10% | +20% | +35% + gentle lane steering |

*Reuse:* bat = swinging-obstacle family (windmill/gears/speed-bag) + directional
impulse + tempo timer (the one new primitive); machine = moving-projectile family
(aquarium shark / dust-devil); base paths = directional speed-lane family
(grind-bars/conveyor), masked to the diamond.

*Ability synergies:* Cannon → sweet spot = a screamer (marquee combo); Slow Mo /
Joystick trivializes the timing (fine — skill expression); Chip/Lob hops *over*
the box and stray balls (the safe route); Wet Shot shrugs off machine deflections.

### 2. 🏀 THE HARDWOOD — "BASKETBALL" (easy–med, ~d2) — BUILT

**Fantasy:** an indoor court — bank a shot off the boards, mind the trampolines,
and put it through the hoop.

*New mechanic:* the **rim gates scoring** — the first arena where a goal is only
a goal if the ball went through something first.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Backboards** — angled boards outside each post, canted so a bank shot turns goalwards | on | on | on |
| **Trampolines** — a *bad* hop: throws the ball up AND kicks it off its line, so you lose control | — | 3 pads | 3 pads |
| **The rim** — a hoop guards each goal; only a shot threaded through it counts, and the hoops are re-thrown after every basket | — | — | on |

*Design notes:*
- The **dribble** (a height-cycle ball) was cut. Going airborne skips every nail
  collision in `collideStep` **including the goalie**, so a real dribble either
  lobs the keeper at random or has to be fenced into midcourt — a half-measure
  either way. The **shot clock** was cut with it.
- The trampoline deliberately differs from Candy's jelly pad (a *helpful* hop
  along your travel, which is spent): this one adds a random lateral kick, so it
  costs control rather than granting a hop over defenders.
- Rim placement avoids players, the ball and the other props, and its mouth
  faces the goalie it guards. Clipping a post rims you out; a denied shot bounces
  out of the goal with a **NO BASKET** flash (reusing the VAR-style denial path).

### 3. 🎾 CENTRE COURT — "TENNIS" (medium, ~d2–3)

**Fantasy:** a grass court split by a net — flat shots come back at you, so you
lob; the flanks are fast tramlines; a ball-kid clears dead balls.

*New mechanic:* a **mid-pitch barrier only aerial shots clear** (a verticality
gate) — makes Chip/Lob suddenly essential.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **The net** | low; shots above ~0.6 speed clear it | full; grounded shots rebound, must lob | tall; short chips clip and drop, needs a high lob |
| **Tramlines** (flank speed lanes) | OFF | +15% carry | +30% + nudges ball toward the sideline |
| **Ball-kid** (sweeper) | clears a fully-stopped ball to center after 2 s | same, faster | actively intercepts slow loose balls in the neutral third (soft pursuer) |

*Reuse:* net = a conditional barrier keyed off the Chip height flag (permeable by
altitude, like the portcullis but gated on height not time); tramlines =
speed-lane family; ball-kid = the sweeper/pursuer AI.

### 4. ⛳ THE LINKS — "GOLF" (medium, ~d3)

**Fantasy:** a links course — undulating greens curve your putts, sand bunkers
bog you down, a mini-golf windmill guards a lane.

*New mechanic:* **patchy directional slope contours** — reward reading the green,
distinct from Skatepark's whole-floor tilt.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Green contours** | OFF (flat) | 2 gentle slopes curving slow balls to a low point | 4 stronger; some push *away* from goal (misreads punished) |
| **Bunkers** (sand drag) | 1, mild | 3, moderate | 5, strong |
| **Windmill** (rotating blocker) | OFF | 1, slow rotation, blocks one lane | 1 fast + a 2nd sail |

*Reuse:* contours = localized, speed-gated directional force-field (Storm wind /
currents, masked to patches); bunkers = drag-patch family (puddle/caramel);
windmill = rotating-obstacle family (gears).

### 5. 🏈 THE END ZONE — "GRIDIRON" (med–hard, ~d3–4)

**Fantasy:** a gridiron — linebackers rush your ball, yard lines drag it as you
push upfield, narrow uprights guard the goal.

*New mechanic:* **pursuing tackler hazards** that chase the ball — the biggest new
hazard *type* of the season. Settle-safe: rushers only pursue while the ball is
above the speed-gate and outside the deep zones; they retreat to lanes when it
slows, so the ball always comes to rest.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Rushers** | 1, slow, gentle nudge (no steal) | 2, moderate, deflect off-line | 3, fast, can knock the ball back toward your half |
| **Yard-line drag** | OFF | −5%/line (2 lines) | −8%/line (3 lines) — deepening near goal |
| **Uprights** (narrow goal frame) | wide gap | standard | narrow + posts rattle shots out |

*Reuse:* rushers = the sweeper/keeper-chase AI repurposed as roaming field
markers; yard-line drag = zonal speed-loss (Zone-Defense-style bands); uprights =
static bounce walls (bumper/wall).

### 6. 🎳 THE ALLEY — "BOWLING" (med–hard, ~d4)

**Fantasy:** a bowling lane — knock the pins and they scatter into a mess, gutters
funnel wall-huggers, the oiled centre lane keeps you fast.

*New mechanic:* **destructible pin clusters** that convert into scattered
obstacles — the pitch gets messier the longer the rally runs.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Pin rack** | 1 rack, pins vanish on hit | 2 racks, struck pins linger ~2 s then clear | 3 racks, pins linger ~4 s and roll (persistent debris) |
| **Gutter channels** | OFF | shallow, mild rail funnel | deep, strong funnel (wall shots get sucked down the rail) |
| **Oiled lane** (keeps pace) | OFF | centre strip: no friction | wider strip + slight forward carry |

*Reuse:* pins = the falling-crates spawned-obstacle family (web warehouse);
gutters = directional lane funnel (conveyor); oiled lane = pace-preserving strip
(Wet Shot's "keeps speed off contact", **not** ice-slip — that's spent).

### 7. 🏎️ THE GRAND PRIX — "MOTORSPORT" (hard, ~d4)

**Fantasy:** a race circuit — draft behind the pace-car for a tow, hit the DRS
boost strips, mind the oil and the tyre walls.

*New mechanic:* **slipstream drafting** behind a moving object — the first hazard
you actually *want* to chase.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Pace-car / slipstream** | parked (static obstacle) | roams; draft behind = +20% | faster; draft +30%; clipping spins the ball |
| **Boost strips** (DRS) | 1 pad, +15% | 2 pads, +25% | 3 pads, +35% (mirrored to both lanes) |
| **Oil + tyre wall** | tyre-wall springy edge only | + 1 oil spill (spins crossing ball) | + 3 oil spills, stronger spin |

*Reuse:* pace-car = mover + local speed-field (tractor-UFO for the draft zone);
boost = speed-lane/charge-node; oil = spin-injection (roulette spin / Serpent
curve); tyre wall = high-restitution boundary (bumper along the edge).

### 8. 🥊 THE RING — "BOXING" (hard, ~d4–5)

**Fantasy:** a boxing ring — the ropes fling you back in with interest, a
speed-bag jabs on the beat, the canvas centre drags you down.

*New mechanic:* a **fully elastic boundary** (the ropes) that returns shots
amplified — turns the whole pitch edge into a weapon (brutal with bounce builds).

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Ring ropes** (elastic edge) | +10% on wall bounce | +25% | +40% (pinball edges) |
| **Speed-bag** (beat jab) | OFF | 1, slow beat, small deflection | 1 fast + a 2nd bag, bigger jab |
| **Canvas drag** (centre slow zone) | OFF | mild | strong (forces play out to the chaotic ropes) |

*Reuse:* ropes = high-restitution boundary (Candy jelly applied along the edge);
speed-bag = reuses the Baseball bat's swinging + timing tech (blocking flavor);
canvas drag = drag zone (puddle/caramel).

### 9. 🏟️ SPORTS DAY — "THE PODIUM" (final boss, all difficulties)

**Fantasy:** a decathlon finale — the arena cycles through every sport's signature
gimmick against a boss keeper.

*New mechanic:* a **rotating gauntlet** that recombines the season's sports
gimmicks — "everything you learned, all at once."

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Event medley** | 1 borrowed condition active at a time, slow rotation | 1–2 active, medium rotation | 2–3 overlapping, fast rotation |
| **Boss keeper** | Sweeper + Reflexes + Big Keeper + **Fog** gift | …+ **Magnet** gift | …+ **Cannon**-style gift |
| **Home crowd** | cosmetic amp | cosmetic amp | cosmetic amp |

*Pattern:* mirrors the S1 & S2 finals (stacked boss keeper + a fixed signature
bonus escalating by tier). Ship it last.

**Build-order leaning:** **BASEBALL** first (bat-beat is fresh, teachable, and a
friendly opener), then **BASKETBALL** (the dribble ball is the marquee ball-feel).
**GRIDIRON**'s pursuing rushers are the riskiest to get settle-safe — prototype
that one early to de-risk the pursuer primitive. **THE PODIUM** ships last.

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
- The one genuinely new engine primitive the season needs is the **beat/timing
  clock** (bat, speed-bag) — build it once in Baseball and reuse it in Boxing and
  the Podium medley.
