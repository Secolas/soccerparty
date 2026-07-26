# Season 3 Ideas — Design Backlog

Parking lot for post–Season 2 content. Season 1 shipped the first Royale ladder
(9 arenas) plus the abilities/draft overhaul; Season 2 added the "Map 2" ladder
(Storm, Casino, Candy, Space Station, Skatepark, Jungle Temple, …) built visual +
music first, hazards layered on. These are candidates for the next season, kept
here so we don't lose them.

The bar is unchanged: **each new stadium must introduce a genuinely new
physics/hazard idea**, with 3 signature conditions (our per-stadium pattern).
The list below is a starting scaffold — refine, cut, and re-order freely.

## Mechanics already "spent" (do not re-skin)

Pulled from Season 1 + Season 2 so Season 3 starts fresh. Avoid another take on:

- **Season 1:** ice-slip, ball-grabbing bushes, pinball bumpers,
  cacti + geysers + dust-devil, portals + lasers, darkness + drains,
  webs + spider + crates, walls + portcullis + boulder, boss-keeper abilities.
- **Season 2:** buoyant ball + currents + shark, low-gravity + meteors +
  tractor UFO, lava cracks + ember rain + rising tide, conveyor belts + pistons +
  gears, shifting wind + puddles + lightning, roulette turntable + dice bumpers +
  shuffle walls, jelly super-bounce pads + caramel sticky floor + rolling gumballs,
  polarity-flipping magnet plates + airlock vents + rotating ring, tilting-gravity
  floor + quarter-pipe rails + grind bars, swinging pendulum vines + collapsing
  tiles + blow-darts.

The unclaimed "new-mechanic" space that's left: **time**, **the goal itself**,
**the ball's identity** (one vs. many), **radial pull to a fixed point**, and
**sustained verticality**. Season 3 leans into those.

## New stadium concepts (Season 3 brainstorm)

### ⏳ CLOCKWORK — "THE CHRONO" (hard, ~d4–5)
- **Time-dilation zones** — floor pools where the ball drops into slow-motion,
  then snaps back to full pace the instant it exits (local time-scale, only the
  ball's own clock changes — not a global slowmo)
- **Metronome gates** — barriers that open and close on a fixed, audible beat;
  read the tick and time your flick through the gap
- **Reversing cogs** — floor patches that briefly flip the ball's curve/spin
- *New mechanic:* per-region time scaling on the ball — the biggest new
  "ball-feel" beat since Moon's low gravity, and it pairs interestingly with
  Slow Mo / Joystick loadouts.

### 🪞 HALL OF MIRRORS — "THE FUNHOUSE" (medium, ~d2–3)
- **Split panes** — crossing a mirror line spawns 1–2 decoy clones of the ball
  that fan out; only the **real** ball scores, the decoys fade after a beat
- **Warp glass** — a lens region that bends the shown aim guide (visual bluff,
  no physics change — a fair-but-disorienting read twist)
- **Silvered walls** — high-restitution mirror walls that return shots crisply
- *New mechanic:* transient decoy balls (identity confusion) — forces "track the
  real one" reads without ever letting a decoy actually count.

### 🚂 RAILYARD — "THE SHUNTING YARD" (medium–hard, ~d3–4)
- **Sliding goals** — each goal drifts along its goal-line on a slow rail, so the
  target is never where it was last flick (difficulty scales the travel + speed)
- **Boxcar walls** — freight cars that roll across mid-pitch as moving cover
- **Turntable spur** — a small rotating disc mid-field that re-aims a rolling ball
- *New mechanic:* the **goal moves** — every prior arena moved hazards or the
  ball; this moves the objective. Big strategic shift; keep the rail slow and
  clearly telegraphed so it reads as skill, not luck.

### 🌀 THE MAELSTROM — "EYE OF THE STORM" (hard, ~d4)
- **Whirlpool sink** — a fixed centre vortex that pulls a slow ball into a
  decaying inward spiral, then spits it out on a random tangent (distinct from
  Casino's roulette *capture* and Space Station's *rotating ring* — this is a
  stationary radial pull with a spiral decay)
- **Cross-currents** — two opposing flow lanes that meet at the eye
- **Debris ring** — junk orbiting the vortex as soft, moving obstacles
- *New mechanic:* a stationary radial gravity-well on the floor with spiral
  decay — power beats it (fast balls fly through), slow rollers get eaten.

### 🎈 SKY GARDENS — "CLOUD NINE" (medium, ~d3)
- **Thermal columns** — vertical updrafts that keep an *airborne* ball aloft and
  drifting (extends the Chip/Lob height-fake from a one-hop into sustained flight)
- **Cloud platforms** — soft puffs that briefly float the ball before it drops
- **Gust birds** — flock that crosses and nudges an airborne ball off line
- *New mechanic:* sustained faked-height flight (aerial lanes) rather than the
  current single-hop lob — opens a genuine "keep it in the air" game.

**Leaning:** **THE CHRONO** (time-dilation is the standout new ball-feel) and
**THE SHUNTING YARD** (a moving goal is a first for the game and changes how you
aim every flick). Hall of Mirrors is the cheapest to prototype and a fun mid-run
palette-cleanser.

## Cross-cutting / meta ideas

- **Season modifiers** — a light run-wide twist chosen at ladder start (e.g.
  "double draft, half power" or "sudden death") to give Season 3 a distinct feel
  without new arenas. Reuses the draft + scoring systems already in place.
- **Prototype order (unchanged from S2):** ship each arena as a selectable
  exhibition pitch — visual + music + ambience first — then layer the Royale
  hazard in, difficulty-scaled (easy strips/soft-caps, hard runs all three
  conditions).
- **Abilities:** new ability ideas live in [`ABILITY_IDEAS.md`](./ABILITY_IDEAS.md);
  a Season 3 ladder pairs well with the unbuilt Juggernaut (anti-fortress) and
  The Gaffer (whole-shape reset) from that backlog.

## Other parking-lot notes

- Only one genuinely-new core mechanic is needed per arena; the other two
  conditions can lean on existing systems (walls, obstacles, ambience) re-themed.
- Keep the 60 fps / no-per-frame-allocation guardrails from `POLISH_ROADMAP.md`
  in mind — time-dilation and thermal-flight especially must not add draw-loop
  gradients.
- Difficulty scaling convention (from Storm/Casino/Candy): easy softens or
  disables the harshest condition, med/med-hard adds count/frequency, hard runs
  everything at full radius/speed.
