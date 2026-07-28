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

### 1. ⚾ THE DIAMOND — "BASEBALL" (easy, ~d1) — BUILT

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

### 3. 🎾 CENTRE COURT — "TENNIS" (medium, ~d2–3) — BUILT

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

### 4. ⛳ THE LINKS — "MINIGOLF" (medium, ~d4) — BUILT

**Fantasy:** one minigolf hole laid straight across midfield.

```
   FAN   |  BUNKER  |  THE GREEN  |  BUNKER  |   FAN
 sideline    sand      flagstick      sand     sideline
```

*New mechanic:* **a route choice, not an obstacle.** Every arena before this one hazards the ball in
flight; this one hazards the **decision**. Crossing midfield always costs something, and the three
routes charge different currencies: the bunker costs **pace**, the fan costs **your line**, and the
green costs **a pin in the way** but pays a powered flick. Nothing here is a wall.

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Bunkers** (sand drag) | on | ″ | ″ |
| **The green** (flagstick + boost apron) | on | ″ | pin **pulled**, cup opens |
| **Sideline fans** | OFF | **on** — a blade shoves the ball off its line | ″ |

Additive, as with the other three: nothing gets faster or stronger between tiers, a hazard is *added*.

**The routes**

- **Bunker** — sand, and *not* a blocker. It multiplies drag (`LK_SAND=0.70`, combined 0.689, so the
  ball rolls v×2.21px), which makes how hard you struck it decide everything. Measured in-engine
  entering from 40px out: flicks of 5 and 7 die in it; 9 and a boosted 13.5 plough through. From
  inside, 3 stays stuck and 5 climbs out. That is "requires 100 to come out, or skip if it is strong"
  falling out of drag rather than being special-cased — and because drag only ever removes speed, sand
  can never stop the ball settling and the turn ending.
- **The green** — the flagstick. On easy and medium its post can knock a shot off line, but a ball that
  comes to **rest** on the mown apron powers the next flick to 1.35×, past `FLICK_MAX`. That is the
  counterplay to the bunkers: unboosted, a flick from range cannot carry 20px of sand; boosted, it can.
  Chipping over works too — sand never touches an airborne ball.
- **Side lane** — 24px of clear ground between each fan's reach and the bunker, so a 14px window for
  the ball's centre. Wider than CENTRE COURT's side lanes, which play fine. This is what the flank is
  *for*; the fan is what punishes a shot that strays onto the sideline — normally the safest rail in the
  game.

**Two things were built wrong first, and both are worth keeping written down.**

*The windmill was a building with a tunnel through it.* An 18px doorway leaves an 8px corridor for the
ball's centre, so getting in was a precision shot rather than a choice and the flank stopped being a
route anybody would take. Removing the building and leaving a rotating cross in the ball's path was
**worse**: swept over every crossing x and every fan phase, a straight crossing got through **0%** of
the time, and in-engine it measured 0/24. The arithmetic says why — the clear arc between two blades 90°
apart is (π/2)·r wide, and the ball plus the blade eat 16px of it, so at r=12 there are under 3px of
daylight. *A rotating cross cannot be a gate at this ball size.* Paddle variants with an open middle
only reached 6–21%. Two fixes together: the fan is **mounted on the sideline** with part of its sweep
behind the wall, leaving a real lane beside it; and a blade **deflects rather than blocks** — an
impulse, no reflection and no push-out, so forward speed survives. All four columns now clear the row
16/16, and the sideline columns bend the line where the lanes do not.
`LK_BAT` needed calibrating twice: an impulse buys ~1/(1−FRICTION) = 62px of drift per unit, so 2.2
measured as **80px** of sideways travel — a catapult across the pitch. 0.5 is about 30px: enough to
lose a scoring angle, not enough to lose the ball.

*The cup punished simply passing through the middle.* `LK_POST=3` plus `COIN_R=5` means the ball's
centre can never come within 8px of the pin, so the cup had to be ≥10px to be reachable at all — which
made it claim any ball that merely came to rest leaning on the pin. That is not a hole, it is a trap
ringed around a post. Fix: on hard the **pin is pulled** (`lkPinSolid=false`, exactly what a golfer
does before a long putt) and the cup is a genuine 7px target. Measured after: rolling through the green
at pace is holed 0–1 times in 10, while a ball deliberately trickled to a stop at the hole is holed
6/6. On easy and medium there is no cup at all and the pin stays solid, so the middle still costs
something.

**HARD — the cup.** A ball that *dies* in the hole is dropped back where the flick was struck: a
penalty stroke, so the shot achieved nothing and the turn is gone. A firm putt runs over the lip, which
is the counterplay — do not arrive at the pin out of pace.

**The kickoff trap, and why the bookkeeping lives where it does.** The centre spot *is* the cup and *is*
the pin, and a kickoff drops a brand-new ball right on it. Left alone, hard would hole every kickoff on
the spot for ever, and the opening flick would bounce off a post it was already inside. So the centre
arms on two conditions — the ball has been struck (`lkArm`) and has been clear of the hole at least once
(`lkPinFree`) — and both disarm when a still ball is seen to have *jumped*, which is what a placement
looks like. That check, and the boost, run from `linksTick()` (the draw loop) and not from
`stepPhysics()`, **because `stepPhysics()` returns immediately while the ball is at rest** — by the time
it runs again the flick has already gone. Written into the physics block first, both were silently dead.

**Bunkers are drawn as excavations, not stickers.** Two concentric ellipses read as something pasted on
the pitch. What makes it a hollow is the order: a dark collar of scuffed grass, then the far lip
overhanging and casting shade *inside* the sand, then sand lit from the near side, with rake lines
curved to the bowl. The outline is a wobbled shape rather than an ellipse, and the *same* wobble drives
`lkSandAt` and the drawing — an ellipse for physics and a wobble for looks would be a lie to the player.

**AI plays the hole.** `lkAimPlan()` picks the nearest cheap route — a side lane, or the green — then
aims at the point on the *goal line* whose straight line runs through that gap, so the flick is full
length rather than a short one that dies in the row. The CPU gets the green's boost on the same terms as
the player, applied outside the `FLICK_MAX` clamp. THE LINKS joins the other S3 arenas in the 55%
aim-spread cut.

**Cut from the original spec:** *green contours* (Skatepark's whole-floor tilt with a golf skin, and a
slope feeding a bunker takes away the very agency the lie mechanic exists to create) and the *windmill
as a rotating blocker* (that is CENTRE COURT's gates in polar coordinates, one arena later).

*Test affordance:* `window.__spSim.probe()` / `.put()` were added to the `?sim=1` hook. Whether sand
stopped the ball, or a sail bent its line, cannot be told apart from the pixels — every number above was
measured through them. Two lessons about measuring, both of which cost a wrong conclusion first:
sampling on a fixed cadence **aliases** against a periodic hazard (24 shots at a steady interval read a
39% gate as 8%; random jitter read it as 37%), and because friction here is 0.984 every shot rolls the
length of the pitch, so **where the ball settles measures the formation, not the hazard** — read it as
it leaves the row instead. Both still behind the same flag, and `smoke.mjs` still asserts the hook is
absent without it.

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
