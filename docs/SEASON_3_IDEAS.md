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

### 4. ⛳ CRAZY GOLF — "FOOTGOLF" (medium, ~d4) — BUILT

**Fantasy:** a golf hole whose cup is a goal. *New mechanic:* **the pitch has a SHAPE.**

This is the fourth design for arena 4 and the first that is not a pile of props. What the three failures
had in common is that they were all *objects added to a football pitch*; what they lacked was a **shape**.
A golf hole is not obstacles scattered on a fairway — it is hazards placed so the direct line is dead,
leaving routes that curve. The skill is choosing a line, not surviving a barrier.

**Measured: there is no straight path to goal.** Sampling the direct shot at the goal centre from a grid
across the pitch (`#` dead, `S` needs a near-max strike through sand, `.` clean):

```
  y=280  #####################SS    0/23 columns have a clean straight shot
  y=240  ####################SSS    0/23
  y=200  #################SSSSSS    0/23
  y=165  ################SSSSSSS    0/23   <- the kickoff spot
  y=140  ###############SSSSSSSS    0/23
  y=110  .#############SSSSSSs..    3/23
  y= 80  ....##########ssss.....    9/23
```

From your own half and from midfield there is **no** clean line, from anywhere. Clean lines only appear
once you have worked into the approach. And the green (goal area) measures **100% clear**, so the hazards
are all in the approach and a close-range shot is always on — hard to get there, not impossible to score.

**The hazards, and why each one is a landmark rather than a pusher**

| | Behaviour | Measured |
|---|---|---|
| **Water** | The shot dies at the bank. Never redirects, never teleports you — the ball is set down on the shore it crossed and the turn ends. A big obvious blue thing with a red hazard margin | 8/8 shots died, ball left outside the bank 8/8, stopped dead 8/8. Airborne carries clean over 5/5 — **Chip is the answer to water**, exactly as in golf |
| **Sand** | Extra drag. Landing in it costs you the shot and you play out of it next turn | Escaping the ~20px to the lip needs v>3.6 (about a third of a flick): v=2 and 3 stay in, v=4 and 6 get out |
| **Trees** | A tree **kills** the ball — no bounce, no deflection. Golf's oldest joke is that a tree is 90% air and you always hit it. One guards each goal so the last shot comes from an angle | Ball comes to rest at exactly 14px from the trunk (the contact radius), stopped 6/6 |
| **Cups** | Hole out → one more flick, played from the hole | 6/6 paid, turn kept 6/6, ball left in the hole 6/6. Firm putt skips the lip 6/6. Wrong end pays 0/5. Second hole-out in the same possession pays 0/6 |

Every one of these only ever **removes** energy, so none of them can stop the ball settling and the turn
ending — the invariant every earlier arena needed special-casing to preserve, satisfied here by
construction.

Tiers are additive, and now each one actually adds a hazard type (they used to all arrive at once, so easy
and med played the same):

| Tier | Hazards | Why |
|---|---|---|
| **Easy** | Pond (water) | Just the pond to route around — no straight line to goal, but only one landmark to read. Still unmistakably a golf hole |
| **Med** | + Sand bunkers + Trees | The full hazard field: bunkers toll the flank lanes and trees can kill the ball, so approach play matters |
| **Hard** | + Cups | The flagstick cups in the attacking corners — the hole-out reward and the pin that punishes a hard shot |

Gated in `initMinigolf` by `hzTier()` (easy 0 / med 1 / hard 2): water unconditionally, sand + trees on
`t>=1`, cups on `t>=2` (`cgCupOn`). The old unused `cgFairOn` med flag was removed — med's step up is now
the real sand + trees, not a dead flag. The `?hz=` dev selector still narrows the set for a spot-check, but
the tier gate is the production rule.

The layout is **180° rotationally symmetric**, not mirrored: rotating the top half about the centre spot
gives the bottom half, so both sides face the identical hole with the water on the same hand. A
reflection would have handed one side the easier approach.

**Four designs, and what each one taught**

1. *The fence* — windmill/bunker/green/bunker/windmill across midfield. A row across midfield is a fence,
   and this pitch already has ten player pegs and a keeper on it. Things-in-the-way is the one thing it
   is not short of.
2. *The punishing cup* — a ball that died in the hole was dropped back where it was struck. It punished
   ordinary play through the middle. Same object, inverted, is now the best thing in the arena.
3. *Springy bank rails* — these measured **perfectly** (6/6 corner turns, 6/6 missed wing shots turned
   back inside the near post) and were still wrong. **A deflector is a deflector**: the ball ends up
   where the geometry chose rather than where the player chose.
4. *The windmill launcher* — measured well (17/18 launched at 13.3 against a `FLICK_MAX` of 10) and was
   **cut anyway**, because a spinning mill belongs on a crazy-golf course and this is a golf hole. It is
   a few lines to restore at the med tier if the arena wants a moving part later.

**Two things needed re-tuning after measurement, both caught by numbers rather than by eye.** `CG_SAND_DRAG`
started at 0.70, giving a roll of only v·2.21px — every strike from 4 to 10 died inside the 40px bunker, so
the bunker was not a hazard with a price, it was a second pond. At 0.86 the roll is v·5.49 and the outcomes
split the way a bunker should. And the tree's kill factor had to be a kill, not a bounce: `CG_TREE_KILL=0.10`
leaves the ball on the spot.

**Art direction, and what the first pass got wrong.** The hazards were originally drawn with
`ctx.ellipse` and soft alpha gradients, and next to this game's chunky crowd sprites, dithered kits and
hard-edged flags they read as **vector clip-art pasted onto a pixel-art board**. That was the real
complaint, not the colours. Four things changed:

- **Pixel-art idiom throughout.** Integer coordinates, flat colour bands, hard 1px edges, and 1×1 stipple
  where one material meets another instead of a gradient — the way the beach's sand is built. `_cgFill`
  walks a shape scanline by scanline so stacking calls at increasing insets gives flat bands with crisp
  edges; `_cgDither` stipples the outermost pixels into whatever is behind. The stipple uses a fixed hash
  rather than `Math.random`, because a shoreline that re-rolls every frame shimmers.
- **Irregular outlines.** A perfect ellipse is programmer art. Every pond and bunker carries two edge
  profiles, left and right, sampled smoothly down its height — and **both the collision test and the
  drawing read the same profiles**, so the water you can see is exactly the water that drowns you.
  Profiles are capped at 1.0 so the wobbled shape always sits inside its base ellipse, which is what
  keeps the water push-out (which normalises in ellipse space) safe.
- **The pitch shows its shape.** Flat turf left the hazards floating on a featureless field with no
  indication of where the route was. There is now rough at the edges, fairway down the two lanes, and a
  lighter apron at each green — and it is painted **scanline by scanline**, not as rectangles: the dead
  middle opens and closes with a smoothstep, so the fairway edges come out curved instead of leaving
  straight horizontal seams across the pitch like a layer cake.
- **Details that were lying about the material.** The bunkers' long horizontal stripes read as wood
  grain, so they are now short rake dashes and grain speckle. The pond's fat smooth red ring looked like
  a rubber tyre, so it is a thin dashed **stake line**, which is how a course actually marks a hazard.
  The cups' soft radial glow became a dashed pixel ring, and the pins got proper pennants. The trees were
  mid-green on bright turf and nearly invisible — the object that kills your ball is now the most legible
  thing on the course, dark with a hard near-black rim, and there are three of them in a copse rather
  than one stray blob.

**The surround is a treeline, and there is no gallery.** A golf course has no stand, so `buildCrowd` skips
this ambience type entirely and the trees get the full 12-unit band: two staggered rows down each side plus
a row along the top and bottom.

*(Note for anyone chasing "spectators" on this board: the coloured tiles down the inside of the timber are
`drawTurnBoards` — the scrolling perimeter ad-boards that show whose turn it is in the current team's flag.
They are on every pitch and are nothing to do with the crowd.)*

**The old note, kept for the reasoning:** The board was originally mapped to the `jungle` ambience,
which nothing handles, so no scenery was built at all. There is now a `golf` ambience type with two dense
staggered rows of trees down each side band plus a thin row top and bottom, so the hole reads as cut out of
woodland the way a real one does — with the spectators still in front of them. Sizes and offsets are
jittered per tree; a row of identical sprites reads as wallpaper.

**The dots were mine, and they were on the PITCH.** A "sandy course path" stippled along the inside of the
timber was scattering hundreds of 1px tan specks around the edge of the play area. On grass that reads as
dirt, not as a course feature, and it sat right where the ball runs. Deleted — the grass texture is all the
edge needs.

**The pins are golf yellow on every cup.** Colouring the pennants by team made the course look like it was
flying two nations' flags, and it was redundant: which cups are yours is already said by the dashed ring,
which only ever appears on the two you can use.

**THE PIN IS SOLID, and a soft arrival drops.** Requiring the ball to come to REST inside a 7px hole made
the cup a lottery — you had to stop dead on it, which is not how anyone holes a putt. A solid flagstick
gives you something to *aim at*: arrive at the pin softly and it drops. Hit it hard and the pin kills the
ball's pace and it stays out, so power is the wrong answer. Two details mattered:
- **Arm on exit.** Without it a hard shot still went in — the pin killed its pace, and the now-slow ball was
  still touching the pin, so it qualified as a soft arrival on the very next frame. Measured before: hard
  arrivals holed 6/6. Holing now requires the ball to have been clear of the pin first, so a hard hit has to
  leave and come back softly. Measured after: soft holes 6/6, hard stays out 6/6.
- **No bounce off the pin.** The inward component of the velocity is *removed* rather than reflected — a
  flagstick stops a ball dead and it drops beside the hole, it does not spring off like a bumper.

**Holing out pays a FULL-POWER flick.** An ordinary extra flick was too quiet a reward for a target this
small. You supply the aim and the game supplies the power: measured, a deliberately tiny drag after holing
out launched at 10.0 against a `FLICK_MAX` of 10, where that drag would normally give about 1. The CPU gets
it on the same terms, applied *after* the soft-putt speed cap so the cap cannot quietly throw it away.

**On the keeper.** Measured on three boards with the ball parked identically and the goalie tracking settled,
both keepers come out **byte-identical**: `x=105.00` (dead centre of a mouth spanning 72–139) and `y=20.00 /
310.00`. There is no board-specific placement difference. What does move them is `updateGoalies`, which lerps
a keeper 12% a frame toward the ball's x while a shot is incoming and back to centre otherwise — and with
the SWEEPER ability drafted it roams in y as well. So a screenshot taken mid-play shows a keeper off-centre
on *any* pitch. No fix was applied because none was found; if it still reads wrong in play, SWEEPER is the
first thing to check.

**A ball that finishes in a tree disappears INTO it.** The trees are drawn in their own pass from the same
call site as THE THICKET's bushes — which runs *after* the ball — so the canopy covers a ball that stops in
it rather than the ball sitting on top of a tree taller than itself, and it drops to 62% alpha while the
ball is inside so you can still see where it went. Season 1's behaviour, and the right one.

**The trees are THE THICKET's bushes** (`assets/generated/sprite-bush-*.png`), on the pitch and in the
surround. Reusing art the game already ships beats a second hand-rolled style, it is already pixel art at
roughly the right scale, and it ties Season 3's golf hole back to Season 1's savanna. A dark disc goes down
first so the canopy keeps a hard rim against bright turf, and the procedural canopy stays as the fallback
for the frames before the image loads — the same pattern the ballpark props use.

Two more details that were shouting: the pond's hazard stakes were drawn every 4px, which read as piping on
a cushion rather than as stakes, so they are now 1px marks every 11px down the flanks only; and the
bunkers' dither halo was dense enough to look furry, so it is thinner and the grass specks match the
collar instead of the rough.

**Pegs must not be placed on hazards.** The formation grid knows nothing about this board, so pieces were
being laid out standing in the pond and on the bunkers — which looks broken and is unfair on whoever drew
that spot. `cgClearSpot` pushes a piece radially clear and re-checks, because shoving one out of the water
can land it in sand. Radial pushing alone was not enough: the pond's right edge is at x=109 and the
bunker's left edge at x=114, so a peg bounced between the two until the loop ran out of passes and left it
in the water. There is now a fallback that searches outward from the original point for the nearest
genuinely clear spot. And the sweep runs from `minigolfTick`, not only from `rebuildFormations` — formations
are laid out *before* the arena's board is applied, so `boardKey` was not yet `minigolf` and the nudge
bailed out of its own guard. From the tick it runs with the board definitely set and the pegs definitely
built, it re-runs after a goal rebuilds the formation, and it skips the piece being dragged. Measured: 0 of
10 pegs on a hazard, at kickoff and again mid-match. Keepers are left alone and verified dead centre of the
mouth (x=105 against a mouth of 72..139), 7px off their goal line.

**The live-cup ring is static.** It rotated and pulsed at first, and animation on a fixed piece of course
furniture reads as a UI widget sitting on the grass rather than as part of the hole. It has one job — say
which two cups are yours — and a still ring does that.

**The "dots" down the touchline were mine.** The fairway ran to `WALL+2` and then dithered that edge, but
there was no rough there to dither into, so all the dither did was scatter a vertical dotted line of dark
specks along both touchlines, right where the ball runs. The fairway now stops at `WALL+7`, leaving a
genuine strip of rough, and only real material boundaries get dithered.

*A fifth harness lesson, and the sharpest one:* the peg check first recomputed the hazard shapes as plain
ellipses and reported pegs standing in the pond that the wobbled outline put safely outside. **Never
reimplement the thing under test.** `window.__spSim.hz(x,y,r)` now asks the arena, and the answer went from
"2 offenders" to the truth, which was none.

**Water splashes down where the ball CROSSED the bank.** The first version pushed the ball to the nearest
point on the bank in ellipse space, and for a hard strike — a Cannon shot covers ~20px in a single frame and
lands well inside the pond — that threw the ball sideways or out the far side. It read as the ball being
grabbed and flung rather than splashing down, which is exactly what it was. It now walks the path the ball
actually travelled that frame and takes the last point still on dry land. Measured, the splash point is
**0.0px off the ball's own line of travel** for shots entering from below, from the side and from above.

Three guards, each added because measurement caught it failing:
- the previous point is only usable if it was on dry land *and* close enough to be this frame's position — a
  kickoff, VAR or rewind teleports the ball and leaves a stale previous point, which silently sent two of
  four test shots down the old radial path;
- otherwise fall back to the radial push, out to 1.10× the base ellipse;
- and then **verify**. A push that lands in another hazard is stepped outward until the point is genuinely
  clear. One measured case had been leaving the ball sitting in the pond.

**Water polish + cup ownership.** Three changes from playtest feedback: (1) removed the red hazard stakes
around the pond — they read as a loud dotted ring and flashed yellow on a drown, which the player disliked;
(2) removed the moving ripple lines (they looked like crawling scanlines) in favour of a single static
sheen, so the pond is calm at rest; (3) the pond now only comes alive when the ball hits it — a proper
sprinkle of droplets that arc up and fall back, played at the stored entry point (cgSplashX/Y) so it stays
put even as the turn moves the ball on. And every cup is now sinkable by whoever is playing (cgCupLive
returns true): it was gated to one team per end, which left one of your two "own" cups uselessly in your
defensive corner and made it unclear which holes you could use. Still one hole-out per possession.

**THE ROOT CAUSE OF THE WHOLE "PITCH IS BROKEN" SAGA: a stray `ctx.restore()` in the cup draw loop.** The
cup loop in `drawMinigolf` ended each iteration with `ctx.restore()` but opened no `ctx.save()`. It runs
once per cup, so with the four cups present it popped the canvas transform stack four times — including the
pitch's own `translate(OX,OY)` — so everything drawn AFTER the cups (the pegs, the ball, later overlays)
rendered in a corrupted transform, shifted off the pitch. That is why:
- every hard-tier screenshot showed the keeper and tokens "moved" and the pitch looking misaligned (cups are
  the hard-tier hazard);
- `?nohz=1` looked correct (it removed the cups, so the loop never ran and the stack stayed balanced);
- `?hz=tree,water,sand` looked correct (no cups) but `?hz=all` broke (cups);
- and — the trap that hid it for so long — the debug overlay ran even later, in the SAME corrupted
  transform, so its markers were shifted by the same amount as the sprites and appeared to sit right on
  them. Two things both offset by the same transform look aligned to each other.
Removing the stray `restore()` fixed it. Verified with cups on: the cyan centre line and the keeper marker
both land at canvas centre (x=202 of 404). The `?hz=` selector (`cgActive`) that isolated it is kept for
future spot-checks; the default is `all`.

**THE "MISALIGNMENT" WAS THE DARK ROUGH LENS.** A clean A/B settled it: `?nohz=1` (bare pitch) looked
right, the hazard version looked wrong, and the only shared element that could differ was the surface. The
surface had shaded a dark "rough" dead-zone down the middle of each half to show the route — but the central
pond already shows the route, and with hazards drawn on top the dark lens read as a muddy, off-centre
discolouration. Every geometric measurement said the pitch was dead centre (halfway line midpoint → board
x=105.00, pond art on its collision to 0.1px, keepers at 105, pegs mirror-symmetric); the lens was a
*shading* illusion, not a position error. Fixed by removing the lens: the pitch is now a plain even fairway
with faint mower stripes and a light apron ring at each green, and the hazards carry all the visual
structure. `?flat=1` was the diagnostic that confirmed it — the flat surface with hazards read clean and
symmetric immediately.

**The hazards are SMALLER and SYMMETRIC now, which is the real "alignment" fix.** With `?nohz=1` the bare
pitch measured square, so the skew was never the pitch — it was the hazard *layout*. The first version put a
big pond on one flank and a bunker on the other and rotated that 180° for the far half, so the dark rough sat
left-of-centre up top and right-of-centre below and the whole thing read as lopsided. The hole is now built
**symmetric about the centre line**: one smaller central pond per half (blocks the straight shot by sitting on
it), a matched pair of flank bunkers (med), and a tree pair either side of the goal. Because every piece is
symmetric about `W/2`, the 180° rotation to the far half equals a vertical mirror, so the pitch is balanced on
both axes. Measured: 0 of 23 grid columns have a straight line to goal from your own half or midfield; the
left-right hazard mask is identical bar the sub-pixel edge wobble; keepers dead centre.

**Alignment: what is actually true, and a correction.** An earlier pass through this concluded the tree
canopies were drawn `(OX,OY)` off and "fixed" it by adding an explicit `ctx.translate(OX,OY)` at the late draw
pass. **That conclusion was wrong and the fix made it worse** — the late pass already carries the pitch
translate, so the second one double-applied and shifted the trees 21px right and 17px down. It has been
reverted.

The mistake was measuring positions out of a rendered PNG by assuming the board→canvas mapping. Every such
attempt in this arena produced a different wrong answer. What finally worked was **comparisons inside a single
image that need no mapping at all**:

- **Two markers, two passes.** A cross drawn for each peg from *inside the peg loop* (blue) and again for the
  same peg from the *late pass* (white/red). Before the revert they sat 28px apart; after it, 9 of 10 blue
  crosses are hidden underneath the white ones. The passes agree.
- **Sprite vs its own marker.** The keeper's red marker sits on the keeper sprite, and the cyan centre line
  (drawn at `W/2`) passes through both. The keeper is on the pitch centre line.
- **Art vs collision.** The ball parked exactly on a tree's collision centre is *hidden by that tree's
  canopy*. The tree art and the tree collisions are the same place.

So the pitch, the pegs, the keepers, the cups and the trees are all aligned, and `?dbg=1` is the way to check
it: the red cross should sit on the keeper and the cyan line should run through it.

**"The pitch is badly aligned" — it was not, but three real things were making it look that way.** Measured
on the canvas itself, CRAZY GOLF's margins are left 41.0 / right 42.0 and top 39.0 / bottom 39.0, and the
pitch centre is off by 0.5px in x and 0.0px in y. The calibration is trustworthy because the derived scale
comes out at exactly 404/234. So the pitch is centred; what was wrong was everything drawn *around* it:

1. **Corner arcs half on the frame.** Each arc is centred exactly ON the pitch's inner corner with radius 8,
   so half of every stroke falls outside the playing area and onto the surround. That has always been true of
   every board and the frame tone normally hides it — but CRAZY GOLF's frame is bright timber, so the stray
   half read as a white curve floating on the woodwork, at all four corners. The arcs are now clipped to the
   pitch rect, which is what a pitch marking always meant. Measured after: three of four corners have zero
   light pixels outside the pitch, down from 28 in the top-left alone.
2. **Birds drawn on the timber.** The ambience formula, copied from the safari case, computes bird y as
   `3+Math.random()*(OY-14)` — and `OY` is 10, so that range is **negative** and every bird lands at y 0..3,
   drawn as a pale curved wing stroke on top of the frame. The formula is wrong wherever it appears; birds are
   not worth having on a 10-unit band, so this arena has none.
3. **Markings on near-black rough.** The perimeter rough was 7 units of very dark green pressed against the
   timber, so the touchlines, goal-box lines and corner arcs sat on grass that read as *frame*. It is now 3
   units and a shade lighter, so every line reads as a pitch marking. The dark rough that matters — the lens
   framing each half's hazards — is untouched.

*(The one pale curve left on the left rail is the Brazil flag's ribbon on the perimeter ad-boards, rotated
90° by `drawTurnBoards`. That is intended art and appears on every pitch.)*

**Is the pitch off-centre? No — measured.** Calibrating off the halfway line, whose board coordinates are
known exactly (y=165, x=12..198), it spans image x 49..370 and its midpoint maps to board **x=105.00**, which
is also the canvas centre. The frame, the markings, the hazards and the pegs all come off the same transform
in the same draw call, so they cannot slide relative to one another.

What *can* read as a lopsided pitch is the deliberate **180° rotational symmetry**. Each half's hazards are a
rotation of the other half's, not a mirror — so the dark rough sits left-of-centre in the top half and
right-of-centre in the bottom, and the eye reads the whole pitch as skewed. That choice is what makes both
sides face the identical hole; a mirror would hand one team the easier approach. If the lopsided *look* is
the problem rather than the fairness, the fix is to make each half left-right symmetric in itself (a pond
each side of a central bunker, say) — balanced to look at and still identical for both teams.

*Diagnostic:* the surround treeline is behind a `CG_TREELINE` flag in the `golf` ambience case, currently
**off** so the pitch's alignment can be judged against a bare frame. One word to put it back.

**AI.** Unlike the prop arenas there is exactly one real lesson, and it is a big one: **do not shoot into
the pond.** Left to itself the CPU fires at the goal centre every turn, which on this layout is the middle
of the water — it would drown its own possession over and over and the arena would read as broken rather
than hard. So `cgAimPlan` walks the straight line to goal, and if it crosses water or a tree it aims
through the nearer flank lane instead, picking the point on the *goal line* whose straight line runs
through that lane (aiming at the lane itself only earns a short flick that dies in it — learned on THE
LINKS). It also takes a live cup within 58px, with the speed floor lowered, since a putt that dies on the
hole needs dist/62.5.

*Not built, from the reference shot:* the **par / shots counter**. That is a season-wide scoring layer
rather than an arena feature — see the standalone par idea in the parking lot.

*Test affordance:* `window.__spSim.probe()` / `.put()` on the `?sim=1` hook. Four harness lessons now, each
of which reported a **working** feature as broken: poll every frame (a launch lasts ~5 frames and a 33ms
cadence sampled either side of it); jitter the interval (a fixed cadence aliases against a rotating
hazard); run order-sensitive checks first (a hard launch scores goals and the match state moves on
underneath you); and check the hazard is the only thing on the line you are testing — the pond sits on the
approach to the tree and a defender was intercepting the sand shot, so two "broken" readings were the
layout working. When an aggregate reads exactly zero, trace one shot before believing it.

### 5. 🏈 THE END ZONE — "GRIDIRON" (med–hard, ~d3–4) — BUILT (first pass, tuning on preview)

**Build status:** registered as Season 3 stadium #5 (`pitch:'gridiron'`, board in `03-boards.js`, ambience →
`stadium`). The design went through several cut passes (rusher/drag/upright sprites; a live-defence screen;
separate grey roamer sprites; a breathing goal). The **current** design (all in `11-physics.js`):

**ROAMING DEFENCE — the tokens themselves.** No new sprites: when a shot goes live, the DEFENDING side's
nearest **N outfield tokens** break formation and PATROL left↔right in their lanes (`gridironTick` moves the
real nails), bouncing off the walls and off any token they meet. When a **moving** ball comes within
`cfg.clearR` of a roaming defender **inside a defensive third**, that token **CLEARS** it back toward
midfield (`gridironStep`). Once the ball is **too slow to roam but still in play** they **HOLD** as solid
obstacles — a slow ball hitting one bounces off it, it does not scoot away — and only **after the ball has
fully settled** (`!moving`) do they jog back to the spots they were placed on (homes snapshotted at the
idle→moving transition; `_gridHomeNail` restores them). Jogging home during the slow-finish would make the
return-path anti-overlap dodge the ball, which read as defenders fleeing on contact.

- **Clear, not a bounce, not a boost:** `clearR` is a hair larger than the ball↔token contact radius, so a
  roaming defender redirects the ball *before* contact. The clear keeps the pace the ball ARRIVED at
  (`min(sp·1.05, clearCap)`) — a soft ball gets a soft clear, a firm shot a firm one — rather than the old
  fixed high-power boot that launched even a slow ball hard.
- **Settle-safe:** roam/clear only on a moving ball (`sp>0.8`); the clear sends it out of the third; per-nail
  cooldown; and jogging home a defender never enters a resting ball's space — so the turn always ends. Only
  the DEFENDING side's outfield roam (goalie excluded, dragged token skipped); the attacking formation is
  untouched.
- By tier: **easy** 2 roam, **med** 4, **hard** all **+ a BREATHING GOAL**. Roam speed 1.05 / 1.35 / 1.7;
  clear cap 5.0 / 6.0 / 7.0.

**BREATHING GOAL (hard only) — moving posts.** Each mouth's two posts are **objects that slide**. The
half-gap oscillates between `23 ± 15` under its own velocity (`gridBreatheStep`, per mouth `[top,bottom]`) —
no longer a pure sine, so it can react to collisions:

- **Posts push the ball.** A shot into a post still reflects (`1+RESTITUTION`, no boost), but because the post
  is *sliding*, it also **carries the ball sideways** (`coin.vx += s·gridGapV·GRID_PUSH`, where `gridGapV` is
  the px the post moved this frame) — a sweeping paddle, not a static bumper. A post crossing the ball shoves
  it along its travel.
- **Posts bounce off the keeper.** On the inward stroke, if the post on the keeper's side reaches that mouth's
  goalie nail (`gridKeeperFor`), the gap **reverses** (`gridGapDir = +1`) and springs back out with a spark —
  the keeper physically blocks the post, so the goal can't cinch shut past its own keeper.
- **Settle-safe:** the carry is only applied to a moving ball inside `gridironStep`, and it's a few tenths of
  a px/frame, so friction still drops the ball under `STOP_V` and the turn ends. `drawGridiron` draws each
  mouth's posts at *its* gap (both mouths can now desync when a keeper interferes).

**Symmetric pitch.** The board's end-zone bands are now an **identical** darker-green tint at both ends —
the earlier red/blue split read as a pale wash on the red end and nothing on the blue, so the two penalty
areas looked different.

Verified in royale (headless drive to stadium 5, hard): enters with zero errors; the defending team's tokens
break formation and patrol while the attacking side holds shape, and the ball is only cleared, never
rebounds.

**Fantasy:** a scrappy gridiron — loose defenders roam the field and boot any ball that strays into their
zone, and on hard the posts themselves won't hold still.

Superseded first-pass hazard tables (kept for reference):

| Condition | Easy | Med | Hard |
|---|---|---|---|
| **Rushers** | 1, slow, gentle nudge (no steal) | 2, moderate, deflect off-line | 3, fast, can knock the ball back toward your half |
| **Yard-line drag** | OFF | −5%/line (2 lines) | −8%/line (3 lines) — deepening near goal |
| **Uprights** (narrow goal frame) | wide gap | standard | narrow + posts rattle shots out |

*Reuse:* rushers = the sweeper/keeper-chase AI repurposed as roaming field
markers; yard-line drag = zonal speed-loss (Zone-Defense-style bands); uprights =
static bounce walls (bumper/wall).

### 6. 🎳 THE ALLEY — "BOWLING" (med–hard, ~d4) — BUILT (hazards in, tuning on preview)

**Build status:** registered as Season 3 stadium #6 (`pitch:'bowling'`, board in `03-boards.js`, ambience →
`arena`). The board is a polished maple lane — lengthwise board seams, an alternating plank tint and grain
speckle, dark gutters down each side wall, a foul line at each end and the dovetail aiming arrows. The
hazards (all in `11-physics.js` + `drawBowling` in `12-draw.js`):

**PIN RACK (all tiers) — the signature mechanic.** A triangle of pins guards each goal, apex toward centre
(the 1-pin the ball meets first), so you must **bowl through** them to score. Each pin the ball touches is
knocked down (leaves collision at once and scatters as fading debris) and **bleeds a little pace**
(`pinLoss`), so a firm strike ploughs through while a soft shot dies in the rack. A **chip flies clean over**
(the pins only touch a grounded ball). **Pins you knock down STAY down across turns** — both sides chip the
rack open over the course of the rally, working a lane through it flick by flick — and the rack only
**re-racks when a goal is scored** (`bowlRerack` from `finalizeGoal`), starting the next point fresh.

**THE RAKE GATE (med+).** A metal pinsetter bar spans the goal mouth and **rises and falls along the lane**
(timed on `bowlRakePh`; the vertical motion is the telegraph). **DOWN** — in front of the pins — it blocks the
whole mouth and a shot **bounces cleanly off it**; **UP** — lifted toward the goal line — the gate is open and
you **score**. So you time your shot for the up window. Off on easy; bar spans 56px med / 66px hard, cycles at
`rakeFreq` 0.036 / 0.05 with an open threshold of 0.50 / 0.58 (wider bar, faster cycle, shorter open window on
hard). Blocks a **moving grounded** ball only, and a **chip flies over**. `bowlRakeClosed()` drives it;
`drawBowling` draws it solid+opaque when down, lifted+translucent when up.

**GUTTER (med+) — a real gutter, rolled by physics.** Each side has a **coin-width sunken channel**. Touch a
side wall and the ball is **captured** into the gutter: its outward speed is killed and it **rolls down the
channel on its own momentum** (no freeze, no teleport), friction bringing it to rest — a **lost shot**, so the
turn passes through the normal settle. The sides are gutters, not bumpers: keep it down the lane. Captures a
**moving** ball only (a resting ball is safe) and a **chip clears** the gutter.

*Iteration history:* v1 was a **funnel** (pulled a wall shot down the rail) — made the ball feel *stuck* and
killed wall bounces, cut. v2 was a freeze-then-teleport gutter ball — replaced here by the **physics roll**
(the ball actually rolls the channel to a stop). The **oiled centre strip**, the animated blue tells, and the
side-to-side sweep rake were all cut along the way.

**Tiers:** easy — a light **3-pin** rack, pins bleed least (0.90), no rake, no gutters (*meet the sport*).
Med — **6-pin** rack (0.86) + rake gate + gutters (*the sport bites*). Hard — full **10-pin** rack (0.82) +
wider/faster rake with a tighter window + gutters (*hostile*).

**Settle-safe:** the rake and pins only touch a **moving grounded** ball and a knocked pin leaves collision at
once; a guttered ball rolls to rest and the turn passes through the normal `STOP_V` settle. Symmetric
top/bottom.

Verified in royale (headless to stadium 6, med): the rake gate spans both mouths and the gutters are coin-width
channels; a shot into a side wall is captured and rolls down the gutter to a stop, and possession passes; zero
page errors.

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

## CPU aim telegraph (game-wide, under review)

A "thinking, then aiming" cue shown while the CPU winds up, so its turn reads as deliberate rather than an
instant snap. **The telegraph is now the SAME aim guide the player sees** — same 3-colour stamina power line,
same predicted bounce path, same ability trajectory (curve/serpent/wet/backspin). If the CPU has Curveball or
Banana equipped, its telegraph bends exactly like a human's aim guide would.

How it stays honest: `aiFlick` was split into `aiComputeShot()` (works out the target, angle, speed, curve
spin and any drunk jitter, with no side effects — returns a plain shot object) and `aiApplyShot()` (writes it
to the ball and fires the one-time effects: curve sound, full-flick spend, rewind snapshot, per-flick flag
resets). At think-start `maybeAI` calls `aiComputeShot()` once and stores it in `aiShot`; the telegraph draws
*that* shot, and at release `aiApplyShot(aiShot)` fires the very same shot — so the line drawn is the shot
taken, jitter included. `aiFlick()` is now just `aiApplyShot(aiComputeShot())`, so any standalone call (and
the balance harness) is unchanged. Penalties still compute at release (`pen.dive` can change mid-wind-up), so
they are never precomputed and never telegraphed.

Rendering: the player's aim-guide body in `12-draw.js` was extracted into `drawAimGuide(angD,power,rawP,
gAlpha,showMeter)`. The player calls it at full alpha with the power meter; the CPU calls it during the
wind-up with no meter. The CPU's `power` is the inverse of the guide's `v0` formula so the drawn line's
launch speed equals the real shot's speed.

The wind-up plays out like a human taking the shot, not an instant snap: (1) a **think beat** — a pulse
ringing the ball for the first ~16% of the delay; (2) a **drag+point** — the aim line pulls back and grows
as `power` ramps `0.30→1.0×` over a smoothstep (spread over `tp 0.16→0.78`, so it reads slowly and clearly),
while a small angle waver (`(1-dragE)·sin·0.10`) settles to zero so it looks like a hand adjusting onto
target and locking; (3) a longer **locked hold** at full power; then the **fast flick** fires at release.
The think delay was lengthened to ~1.2–1.85s so the drag is easy to follow. Because the waver decays to zero
by the lock, the final drawn line is the true shot. Gated by `CPU_AIM_TELEGRAPH` (on for review; **game-wide,
every mode** — `maybeAI` runs from the main tick loop regardless of mode, so exhibition, cup, royale and
practice all telegraph identically). Verified in-engine: the guide renders as a stamina-coloured arrow +
pull-back marker along the CPU's shot line and grows through the wind-up, matching the player's guide.

## CPU shot smarts (own-goal guard + CRAZY GOLF routing)

**Own-goal guard (all arenas).** `aiClearFront()` nudges the CPU's aim off any token sitting right in front
of the ball — a near head-on hit is a wasted flick at best and, when the bounce comes back at our own net,
an auto own-goal. It finds the nearest token that is just ahead (≤30px) and within `COIN_R+NAIL_R` of the
shot line, then rotates the aim (≤0.42 rad) to the side the token is *not* on. Runs in `aiComputeShot` right
after the aim angle is picked, before the curveball search re-optimises, and is skipped for soft cup putts
(the cup was already chosen with a clear line). Read-only w.r.t. game state.

**CRAZY GOLF routing.** `cgLineBlocked(x0,y0,x1,y1)` traces a segment for water (drown), trees (dead stop)
**and now sand** (heavy drag) — the CPU avoids the bunker as well as the pond. `cgAimPlan` uses it two ways:
it only commits to a **cup** whose approach line is clear (so it actually reaches the hole instead of putting
into a hazard), and when the straight line to goal is blocked it tries **both** flank lanes and takes the
first whose routed line is clear. Cup-seeking is more decisive now (take-a-live-cup probability raised to
0.4 / 0.65 / 0.9 by tier), and any cup counts, not just this side's.

## Turn transition banner

When possession rotates, a short **"[CPU ·] TEAM TO PLAY"** strip slides in from the new attacker's side and
fades out (~42 frames), sitting toward the end that side attacks. It gives the turn hand-off a beat so a CPU
turn (which then winds up and flicks) doesn't begin out of nowhere. Set in `endFlick` only where `current`
actually flips (the pass and the lucky-loser branches — not the keep-turn/hole-out branches, where the same
player continues); `_turnBanner` is advanced by `updateFX`, drawn by `drawTurnBanner`, cleared on reset.

## CRAZY GOLF: hole-out reward + water drown

**Hole-out is "play on" with a stamina refresh, not a free flick.** Sinking a cup **counts as a flick** —
the tally keeps ticking down, so holing on your first flick leaves you 2 — and you keep the turn (whether or
not the shot touched your own players). The reward is not extra flicks or a free full-power one (the old
`cgFullFlick_` auto-power freebie is gone); it is a **stamina refresh**: stamina jumps back to 100% at the
hole and then **decreases again** with each following flick, exactly as a fresh possession would — it is
*not* pinned at 100% for the rest of the turn. `cgStamBase` records the flick count at the hole and
`staminaMul` counts stamina forward from there (the aim guide's power colour restarts at full-green too), so
the count and the stamina curve are decoupled: the counter keeps falling while the stamina ramp restarts.
Since a 100%-stamina flick already gives full power at max drag, there is no separate "power" reward — the
two would be the same thing. `cgBonus` caps it at one hole-out per possession; `cgStamBase` resets when the
turn passes.

**Water drown is a real, unhurried transition.** Instead of snapping the ball to the bank and ending the turn
next frame, entering the pond starts `cgDrown`: the ball **sinks** where it went in (shrinks, goes waterlogged
blue-grey, ripples spread, bubbles rise) over `CG_DROWN_SINK` frames, then is **dropped** back onto the grass
shore over `CG_DROWN_DROP` frames — falling from a height with a shadow that tightens as it lands, a small
bounce, and a flashing ring marking where it is ready for the next flick (~1.4s total, deliberately slow).
`stepPhysics` only ticks `cgDrown` while it runs (play is frozen, input blocked because `moving` stays true),
then releases into `endFlick`. Rendered by `drawCgDrown` in place of the ball; the impact splash still plays.

