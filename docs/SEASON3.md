# Season 3 — design brief

Handoff document. Nothing here is built yet; this captures the concept, the
technical groundwork already verified, and the open decisions.

---

## The organizing idea

Each season should escalate rather than re-skin:

| | what an arena does |
|---|---|
| Season 1 | hazards **move the ball** |
| Season 2 | hazards **+ a boss loadout** |
| **Season 3** | the arena **changes how you score** |

The theme is **sports crossover** — baseball, basketball, golf, darts, bowling,
hockey, tennis. Every arena borrows another sport's scoring rule, which is a
genuine third act rather than a new coat of paint.

**This is feasible in the current engine.** The goal path in
`src/game/11-physics.js` (search `scoring=true; scoringTeam=`) already supports
conditional denial — `shieldHit()`, `varcheck` and the wall all sit in front of
it. An arena rule like "the bat must be struck first" hooks into that existing
seam; no new architecture needed.

---

## The arenas

### 1. THE DIAMOND ⚾ — season opener
A bat sits across the goal mouth. **Hitting the bat is the goal.**

Three readings were considered; **A** is the recommendation:

- **A — the bat is the target.** A clean strike scores; a glancing hit knocks
  the bat aside for ~3 seconds, leaving the net open. Rewards precision and the
  "crack" is the payoff moment. Best as the opener because it teaches the
  season's whole concept in one shot.
- **B — the bat defends.** It swings on a rhythm and you time a flick through
  the gap. More punishing, less satisfying.
- **C — sweet spot.** A small centre zone worth double. Better as a *modifier*
  on A than as its own arena.

### 2. THE COURT 🏀
A raised hoop above the goal worth **3**; the normal goal worth **1**. Only
reachable with an airborne ball.

Beyond novelty this fixes something real: **CHIP measured 28%, the worst ability
in the game**, purely because the AI misplays its mid-flight tap. A hoop gives it
an obvious purpose for a human.

### 3. THE GREEN ⛳
The goal shrinks to a cup. Power is useless, precision is everything.
**SNIPER** and **BACKSPIN** become the loadout.

### 4. THE OCHE 🎯
Concentric rings on the goal — outer 1, middle 2, bullseye 3. Every shot becomes
a risk/reward call.

### 5. THE LANES 🎳
Ten pins in front of the goal. **Goals do not count until the pins are cleared**,
so the early match is demolition work. Rewards **CANNON** and **DRILL**.

### 6. THE RINK 🏒
Rounded corners so nothing dies in a corner, ice-fast surface, tiny goal. Pure
flow — the palate cleanser of the season.

### 7. CENTER COURT 🎾
A net across halfway the ball must clear; ground shots bounce back at you.
**CHIP** and **GLIDE** territory.

### 8. THE DECATHLON 🏆 — finale
Rotates through the season's rules, one per goal: bat, then hoop, then cup. A
victory lap that tests everything learned.

---

## New abilities

| ability | effect |
|---|---|
| **SLAM DUNK** | airborne goals count double — gives air play a reason to exist |
| **PINCH HITTER** | once a turn, one of your players acts as a bat: any ball touching it launches at max power |
| **TIMEOUT** | freeze the arena's gimmick for one turn — the first genuinely defensive-tactical ability, and a counter to the season's own rules |
| **REBOUND** | missed shots come back off the backboard instead of going out |
| **SUBSTITUTE** | swap two of your own players' positions mid-match |

> ⚠️ **TIMEOUT and SUBSTITUTE are manual-activation abilities** — the exact class
> the balance harness measures badly. `rewind` (47%), `strategist` (46%) and
> `medic` (48.5%) all read low for this reason: a human times them well, the AI
> does not. If these ship, teach `src/game/09-ai.js` to use them **in the same
> change**, or they will look broken in the next sweep and get wrongly demoted.

---

## New countries

Currently **24 teams** in `src/game/02-teams.js` (16 nations + 8 fun sides:
RED BLU STR HOP SAS ROY SKY RAV).

Adding nations is cheap: 17 kit types exist and `solid`, `vstripes`, `hbands`,
`sash`, `vhalves`, `cross`, `nordic`, `tricolor`, `dot` are all **generic and
reusable**, so most nations are data entry rather than new art.

| tier | teams (with the kit type each maps to) |
|---|---|
| Should be in already | Morocco `solid`, Uruguay `sash`, Colombia `hbands`, South Korea `solid`, Poland `vhalves` |
| Strong adds | Denmark `cross`, Switzerland `cross`, Serbia `tricolor`, Nigeria `vstripes`, Australia `solid` |
| Depth | Ghana `hbands`, Cameroon `solid`, Peru `sash`, Chile `solid`, Turkey `solid`, Ukraine `vhalves`, Sweden `cross`, Canada `solid`, Egypt `solid`, Ivory Coast `solid` |

This also fixes a live bug: **the Royale ladder repeats opponents** because the
ladder is longer than the country pool (`startRoyale` pads with
`supply[a % supply.length]`).

Entry shape:
```js
{cat:'country', name:'Morocco', abbr:'MAR', primary:'#c1272d',
 kit:{type:'solid', colors:['#c1272d','#006233']}}
```

---

## What a season actually requires

Discovered while scoping — saves rediscovery:

| piece | where |
|---|---|
| Arena list | `10-tournament.js` — `ROYALE_ARENAS` (S1, 9 arenas), `ROYALE_ARENAS_2` (S2, 9) |
| Arena entry | `{name, pitch, ab:[3 ability ids], d:difficulty, blurb}` |
| Boss scaling | difficulty picks how many of `ab` apply: `easy 1 / med 2 / hard 3` |
| Board theme | `03-boards.js` — 18 exist, and all 18 are in use: Season 2 has **nine** arenas, not eight (THE HALF-PIPE, pitch `skate`, sits sixth). A new season needs new board themes. |
| Ambience | `05-ambience.js` — per-pitch scenery |
| Hazard icons | `condMiniDraw(g,S,key)` in `10-tournament.js`, referenced by `'@name'` markers (never PNG paths — Season 2 originally shipped emoji because the PNGs never existed) |
| Sounds | `08-sound.js` |
| Unlock gating | `roySeasonUnlocked()`, `royDiffsFor()`, `royLvlUnlocked()`, `royTopUnlocked()` |
| Progress keys | `royDiffs1` / `royDiffs2` in the achievement store → needs `royDiffs3` |
| Achievements | `ACH` list in `13-input.js` → add `season3`; **widen `grandslam` to three seasons** |
| Season selector | `15-prematch.js` — currently two buttons, hardcoded |

**Build rules that bite:**
- `index.html` is generated — edit `src/`, run `node tools/build-game.mjs`, and
  commit both. CI fails on a stale build.
- A new file must sort **before `19-boot.js`**, which closes `componentDidMount()`.
- Run `node tools/fmt.mjs` after editing; CI enforces `--check --limit 2000`.
- `node tools/smoke.mjs` before pushing.
- New abilities can be measured with `node tools/balance.mjs --only <id>` — but
  read the header first for what a single-ability sweep **cannot** measure.

---

## Recommended sequencing

1. **Countries** (~20). Small, independent, immediately visible, and fixes the
   repeating-opponent bug. Ships on its own.
2. **Season plumbing + THE DIAMOND + THE COURT** as a vertical slice — gating,
   `royDiffs3`, third season button, achievements, two playable arenas. Enough
   to judge whether "the arena changes the scoring rule" feels good in the hand.
3. **Remaining six arenas** once the concept is confirmed.

Splitting at step 2 matters: if the concept disappoints at arena three, only two
have been built rather than eight.

---

## Open decisions

- Which of the eight arenas make the cut, and is 8 the right length (S1 has 9)?
- Is "the arena changes the scoring rule" the direction, or should Season 3 stay
  with hazards-plus-boss like Season 2?
- Do the new abilities ship with Season 3 or separately?
- If TIMEOUT/SUBSTITUTE ship, is teaching the AI to use them in scope?
