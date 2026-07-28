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
| **The rims** — THREE fixed hoops (left / centre / right) across each penalty area; only a shot threaded through one counts | — | — | on |

*Design notes:*
- The **dribble** (a height-cycle ball) was cut. Going airborne skips every nail
  collision in `collideStep` **including the goalie**, so a real dribble either
  lobs the keeper at random or has to be fenced into midcourt — a half-measure
  either way. The **shot clock** was cut with it.
- The trampoline deliberately differs from Candy's jelly pad (a *helpful* hop
  along your travel, which is spent): this one adds a random lateral kick, so it
  costs control rather than granting a hop over defenders.
- The rims are **fixed furniture inside the penalty area**, three per end, mirrored
  — not re-thrown each goal. You learn the three lanes and pick one, and both teams
  face the same layout. A single wide gate was considered and rejected: it is passed
  almost every shot, so the rule stops biting.
- They stand **on the penalty-area border** — the line the box closes with, furthest from
  goal — spread across its width (27px apart against a 16px mouth). Each faces the goal
  centre, so the two wing hoops are **angled diagonally** while the centre one squares up.
  You thread a hoop at the edge of the box, then still have the keeper to beat.
- The net hangs on the goal side (the ball drops through and out toward the goal). There
  is no backboard plate behind the ring — it read as a barrier sitting behind each hoop.
- Dashed **lane dividers** fan out of the goal mouth between the hoops, so each hoop
  owns a visible slice of the box.
- The "white line behind the net" was three cosmetic markings stacked on the goal
  line: the goal-mouth line, the goal-side edge of the painted key, and — the real
  culprit — the penalty and 6-yard boxes, which `drawEndMarks` closes with
  `strokeRect` and double-strokes. On the court all three are dropped and the boxes
  are drawn three-sided, genuinely "open to goal" as that function's comment intends.
  Cosmetic only; physics untouched, and other pitches keep their markings.
- **The AI aims through them** (`bkAimTarget` + the shot branch in `09-ai.js`): it picks
  the hoop closest to its natural line at goal — wing hoop from the wing, centre hoop
  from central — and tightens its spread to the hoop mouth. Without this the CPU keeps
  having goals waved off and the rule becomes a one-sided advantage for the player.
- The mouth is `BK_RIM_HALF*2` = 16px against a 10px ball — a bit over 1.5 balls
  wide. Exactly coin-tight reads as a luck check once anything deflects.
- A shot reaching the net without going through a hoop is bounced back out with a
  **NO BASKET** flash (reusing the VAR-style denial path).

### 3. 🎾 CENTRE COURT — "TENNIS" (medium, ~d2–3) — EASY BUILT, MED/HARD TBD

**Fantasy:** a blue hard court split by a net. Nothing on the ground gets through it —
you go over it off a racket, chip it, or curl round the lanes at either end.

*New mechanic:* a **hard barrier with an aerial answer** — the first hazard that simply
cannot be beaten along the ground, paired with the launcher that beats it.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **The net** — spans the blue court, posts on the sidelines. NO ground shot passes it at any speed; it knocks the ball back | on | on | on |
| **Rackets** — 2 per half; run onto one and it lobs the ball into the air, over the net | on | on | on |
| **The side lanes** — the green apron outside the court stays open at each end of the net, to curl or thread a flick around | on | on | on |
| **Racket flip** — the rackets cycle green (live, lobs you over) → amber (about to flip) → red (dead, swats you back), phases staggered | — | on | on |
| **Sliding gates** — shutters run out from both net posts to the walls on a loop, sealing BOTH side lanes together. While they are out the ground is shut completely | — | — | 2 |

*Design notes:*
- The net is **solid to the ground at any speed**. An earlier version let a hard shot
  punch through, as insurance against a loadout with no Chip being unable to attack —
  the rackets and the side lanes remove that risk, so the net can be absolute.
- Three ways across, each a different skill: **positioning** onto a racket, **an ability**
  (Chip), or **curve** round the lane.
- The net spans the blue court exactly, posts on the sidelines, so the lane is the green
  apron outside. The apron is 22px, leaving about a 12px window for a 10px ball —
  threadable, not free. The width lives in one helper (`tnApron()`) read by the board art,
  the net physics and the net drawing, so they cannot drift apart.
- The racket lob caps the ball's speed (a lob is slower) so it lands before reaching the
  goal — an airborne ball at the net is rejected as a goal and would just read as broken.
- The flip cycle is 170 frames, 62% green / 38% red, with the four rackets a quarter-cycle
  apart — so only one is red at a time and there is always a live one to run onto. An amber
  frame precedes each flip as the tell, so going red is never a surprise.
- The gates run a 210-frame loop (open 70 / slide 25 / sealed 90 / slide 25) and share a phase, so
  they **seal together**: 43% of the cycle the ground is shut wall-to-wall (left gate + net + right
  gate, no gap), 34% both lanes are open, 23% mid-slide. Ground balls only — a lob clears a gate
  exactly as it clears the net, so during a sealed window the only ways across are a **racket lob**
  or **Chip**.
- They were built in **antiphase** first, which guaranteed one lane was always open. That read as
  "the gates do nothing" — you just switched sides. Sharing a phase is what makes the tier bite.
- Volleyers (patrolling players who smashed a lob out of the air) were built first and replaced.
  The gates contest the **lane** rather than the air, which is the more interesting pressure: the
  air already has the racket flip taxing it at medium.
- A kickoff sits the ball exactly ON the net line, which the net would otherwise knock straight
  back. A ball leaving the centre spot is treated as a **serve** and allowed through; after that
  the net is absolute.
- **The AI plays the court** (`tnAimPlan` / `tnBlocksAt` + the shot and chip branches in `09-ai.js`).
  When the net is between it and the goal it picks a route rather than shooting into the cord:
  with **Chip** it shoots at goal and lifts the ball in flight (`aiMaybeChip` triggers 7–34px before
  the net — 22 frames of air clears the band and still lands short of the goal at every flick speed);
  otherwise it aims down an **open side lane**, which its existing curve search then bends round toward
  goal; failing that it runs onto a **live racket** to be lobbed over. Lane openness is sampled across
  the ball's width, so a half-extended shutter is not mistaken for a gap.
- On all four S3 arenas the CPU's aim spread and launch noise are cut to **55%**. These arenas gate
  scoring on threading something, so a loose CPU shot is simply a wasted turn.
- **Cut:** tramlines (flank speed lanes) and ball-kids. The painted tramlines stay as court
  markings; they no longer do anything.

### 4. ⛳ CRAZY GOLF — "MINIGOLF" (medium, ~d4) — IN PROGRESS

**Fantasy:** a minigolf course. *New mechanic:* **things you aim at.**

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Windmill launchers** | on | ″ | ″ |
| *(open slot — obstacle being designed)* | — | ? | ? |
| **Cups** (hole out → one more flick) | OFF | OFF | **on** |

- **Windmill launchers** — two mills at midfield. A sail meeting a moving ball throws it along the sweep
  at `CG_LAUNCH`, and it never blocks or pushes back. Measured: 16/18 launched at a peak of 13.3 against
  a `FLICK_MAX` of 10, 2/18 rolled through untouched for free, and of the launches 12 went goalward to 4
  back. So even an unread arrival beats even money, and reading the sails is what makes it a tool.
- **Cups** — hole out and you get **one more flick, played from the hole**. Measured 6/6 paid, turn kept
  6/6, ball left in the hole 6/6. A firm putt skips the lip 6/6. A cup is live only for the side
  attacking that end, so putting into the wrong one paid 0/5. `cgBonus` caps it at one per possession:
  without it, an extra flick played from inside the hole could drop straight back in and hand out turns
  for ever — verified at 0/6.

**Three things have now been cut, and the pattern in them is the useful part.**

1. *The fence* (windmill/bunker/green/bunker/windmill across midfield). A row of obstacles across
   midfield is a fence, and this pitch already has ten player pegs and a keeper on it — things-in-the-way
   is the one thing it is not short of.
2. *The punishing cup* (a ball that died in the hole was dropped back where it was struck). Ordinary play
   through the middle got punished for it.
3. *The springy bank rails* (corner chamfers and funnels outside the posts). These measured perfectly —
   6/6 corner turns, 6/6 missed wing shots turned back inside the near post — and were still wrong. **A
   deflector is a deflector.** The ball ends up where the geometry chose rather than where the player
   chose, which is the same complaint the fence earned in a friendlier costume.

So the bar for anything added here: **the player must aim at it on purpose, and get back what they aimed
for.** Bouncing off it, being redirected by it, or being punished by it all fail that bar. A launcher
passes (you aim at the mill and choose your moment). A cup passes (you aim at a 7px target and get paid).

**Obstacle candidates for the open slot** — all classic minigolf, all aim-at rather than bounce-off:

| Obstacle | Mechanic | Fits? |
|---|---|---|
| **Pipe / tunnel** | enter one mouth, pop out the other, keeping pace — a shortcut up the pitch | Strong. Precision reward, missing costs nothing |
| **Loop-the-loop** | a speed gate: enough pace and it carries you round and spits you out fast; too soft and you come back out | Strong. A pure power test, and the counterplay is obvious |
| **Ramp / hump** | the ball goes airborne over it — a chip you did not pay for, useful for clearing player pegs | Strong, and it reuses `coin.air`. Note an airborne ball skips ALL nail collisions including the keeper, and an airborne shot at goal is rejected, so it is a positioning tool not a scoring one |
| **Bell / target** | strike a standing target for a bonus — the same payout family as the cup | Good, pairs with the hole-out rule |
| **Turntable** | roll on and it carries you round, releasing you on a new heading with pace intact | Interesting but close to a deflector |
| **Volcano / mound** | ball rolls off the peak away from centre | Fails the bar — pure deflector |
| **Water hazard** | in the water, replay the stroke | Fails the bar — it is the punishing cup again |

**AI.** The CPU learns that a live cup within 58px is worth a turn, and that a mill on its line to goal is
a coin flip it cannot time, so it aims past the edge. A cup putt needs a soft flick, and since the roll
here is v/(1−FRICTION) = 62.5·v, the speed that dies on the hole is dist/62.5 — far under the CPU's usual
5.0 floor, so the plan carries `soft:true` and `aiFlick` lowers the floor for it.

*Test affordance:* `window.__spSim.probe()` / `.put()` on the `?sim=1` hook. Three harness lessons, each
of which reported a **working** feature as dead before being fixed: poll every frame, because a launch
lasts about five frames and a 33ms cadence sampled either side of it; jitter the interval, because a
fixed cadence aliases against a rotating hazard; and run order-sensitive checks first, because a 13.5
launch scores goals and the match state moves on underneath you. When an aggregate reads exactly zero,
trace one shot before believing it.

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
