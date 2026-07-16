# Ability Ideas — Design Backlog

Brainstorm of future abilities in the Balatro spirit: buildcrafting, synergies,
rarity excitement, "broken combo" moments — **no currency, no points, no shops**.
Everything hooks into systems the game already has (goals, turns, flicks, slots,
walls, debuffs, the draft).

Current roster for reference: Cannon, Curveball, Glide, Magnet, Sticky, Sniper,
Big Keeper, Freeze, Joystick, Wall, Slow Mo, Ghost, Striker, Anchor, Volley,
Spider Trap, Portal, Ricochet, Bumper, Shield, Strategist, Medic, Swap,
Wild Card, Serpent, Drunk Shot, Fog, Reflexes, Sweeper.

Rarity scale: COMMON · UNCOMMON · RARE · EPIC · LEGENDARY
(weights 5–7 · 4 · 3 · 2 · 1 in `AB_WEIGHT` terms)

## Shipped

- **TIKI-TAKA** (RARE) — bounce a single shot off 3 of your own players and it
  re-launches at full speed off the third. (This doc's "Trio" idea.)
- **VAR CHECK** (RARE) — once per match your first own goal is ruled out; the
  ball resets and play continues (opponent kicks off if it was your last flick).
  (Shipped from the "Referee's Friend" parking-lot idea.)
- **REWIND** (EPIC) — on your turn, take back your last flick (recharges each kickoff).
- **DEFENDER** (RARE) — an extra player guards deep in front of your own goal (Striker's mirror).
- **BOOMERANG** (EPIC) — a missed shot that rolls back over halfway curves back at goal.
- **CLEARANCE** (RARE) — once each turn, when a dangerous shot bears down on your goal your
  nearest defender lunges to block it, then jogs back to its spot. First interactive-defense
  ability (replaced the earlier "High Press" creep, which felt wrong).
- **WET SHOT** (RARE) — a slick/wet ball skids off players, keeper and walls keeping its
  pace; obstacles nudge it off line but can't slow it (friction still stops it over distance).
- **CHIP SHOT** (RARE) — after you flick, tap to lob the ball over players and the keeper for
  a moment (faked height + shadow), then it drops. From the doc's Chip Shot idea.
- **MARKET** (UNCOMMON) — Coin Rush only: coins you bank on a goal are doubled; filtered out
  of the draft unless economy is on.
- **MAGNET** reworked into a gentle keeper-attraction field; **MEDIC** cures one curse (picker
  when 2+), once per match, disables the opponent debuff it cleanses.

## Fresh ideas (2026 brainstorm — not yet built)

| Name | Icon | Rarity | Effect | Notes |
|---|---|---|---|---|
| **Nutmeg** | 🧦 | RARE | Thread a shot cleanly through the gap between two opponent players → +40% speed + taunt spark. | New "gap detection" hook; rewards precision |
| **Panenka** | 🥄 | RARE | Penalty-mode only: a soft chip option that beats a keeper who dives early. | Deepens the shootout minigame |
| **Screamer** | 💥 | EPIC | Hold past full power ~0.5s to overcharge one shot/turn to 130%; release late and it fizzles to 50%. | Risk/reward power |
| **Poacher** | 🦊 | RARE | When your shot is saved/blocked, the rebound drops to your nearest attacker (keep possession). | vs Counter-Attack which fires at their goal |
| **Juggernaut** | 🐂 | EPIC | One flick/turn ignores Anchor, Spider Trap and Magnet — barrels through. | Explicit anti-fortress counter |
| **Clean Sheet Bonus** | 🧼 | RARE | Every turn the opponent fails to score, +8% power next shot (cap ~+40%, resets on concede). | Defensive scaling engine |
| **The Gaffer** | 🎩 | EPIC | Once per match, reposition ALL your outfield players at once (mega-Strategist). | Whole-shape reset |
| **Overload** | ⚽⚽ | LEGENDARY | Once per match your flick launches two balls; either scoring counts. | Needs a parallel two-ball sim — its own focused build |
| **Lob Shot / Chip** | 🪂 | RARE | Flick then tap to hop the ball over the next player it would hit (faked height + shadow). | Top-down height fake; keeper can still claim on landing |
| **Market** | 🛒 | UNCOMMON | Economy mode only: currency you claim is doubled. | Filter out of the draft pool unless Coin Rush is on |

---

## 1. Shot modifiers

| Name | Icon | Rarity | Effect | Synergies |
|---|---|---|---|---|
| **Knuckleball** | 🌀 | RARE | Firm shots wobble unpredictably side to side in the last third of flight — keepers track them 50% slower. | Fog (they can't see it AND can't read it), Cannon |
| **Chip Shot** | 🪂 | UNCOMMON | Drag with two fingers (or double-tap then drag) to loft the ball OVER one player it would hit — lands and keeps rolling. | Striker (chip the wall of defenders, striker taps in), Sniper |
| **Boomerang** | 🪃 | EPIC | Once per turn, if your shot misses the goal and crosses back over the halfway line, it curves back toward the opponent goal for a second attempt. | Curveball, Ricochet |
| **Splitter** | ✌️ | LEGENDARY | On a max-power flick the ball splits into two half-speed balls for 1 second, then the one closer to the goal becomes real. | Cannon (easier to hit max power), Magnet |
| **Drill Shot** | 🔩 | RARE | Your shot doesn't lose speed on the first player it hits — it drills straight through with 20% reduced pace. Keepers still block. | Cannon, Ghost (drill the first, phase the second) |
| **Soft Touch** | 🪶 | COMMON | Shots under half power get a precision aim guide and never bounce off walls (they stop dead instead). | Sticky (set up tap-ins), Strategist |
| **Afterburner** | 🚀 | EPIC | Your shot ACCELERATES for the first half-second instead of slowing. Terrifying from close range. | Slow Mo (accelerates in slow motion = controllable rocket), Volley |
| **Topspin** | ⤵️ | UNCOMMON | Your shot's wall bounces keep 100% energy (no restitution loss). | Ricochet, Bumper — the full bounce build |
| **Heavy Ball** | 🏐 | UNCOMMON | Your shots knock opposing players back 2× further on contact — physically rearrange their defense. | Cannon, Strategist (destroy their shape, then fix yours) |
| **Feint** | 🎭 | RARE | The opponent sees your aim guide pointing 30° off from where you actually aimed (only matters in 2-player; vs CPU it fuzzes keeper prediction). | Fog, Drunk Shot — the deception build |

## 2. Defense & keeper

| Name | Icon | Rarity | Effect | Synergies |
|---|---|---|---|---|
| **Twin Keepers** | 👥 | LEGENDARY | Your keeper splits into two half-width keepers that bracket the goal mouth. | Big Keeper is redundant with it — classic Balatro "choose your keeper archetype" tension |
| **Rubber Goalposts** | 🥅 | UNCOMMON | Shots that hit your goal frame bounce OUT with double force instead of dribbling in the box. | Counter-Attack (below), Bumper |
| **Offside Trap** | 🚩 | RARE | Once per match, when an opponent shot enters your half, freeze it mid-flight for a beat and nudge it 15px sideways. | Spider Trap, Anchor — the "nothing gets through" build |
| **Sixth Defender** | 🧱 | EPIC | A ghost defender materializes on your goal line for the opponent's NEXT shot after they score. Fades after one block. | Shield (stack the after-goal insurance), Wall |
| **Magnetic Keeper** | 🧲🧤 | EPIC | Your keeper pulls slow shots (under 30% speed) toward its gloves from twice the normal range. | Anchor + Freeze (slow their shots down, then vacuum them up) |
| **Counter-Attack** | ⚡️ | RARE | When your keeper or wall blocks a shot, the rebound flies toward the opponent's goal at +50% speed. | Wall, Rubber Goalposts, Reflexes — the riposte build |
| **Zone Defense** | 🛡️ | UNCOMMON | Opponent shots lose 15% speed while in your defensive third. | Big Keeper, Sweeper — layered defense |
| **Last Stand** | 🫡 | RARE | While you're losing, your keeper is 25% bigger and 25% faster. Deactivates when level. | Natural comeback pairing; stacks with Big Keeper |

## 3. Field & terrain

| Name | Icon | Rarity | Effect | Synergies |
|---|---|---|---|---|
| **Mud Patch** | 🟤 | UNCOMMON | Place a mud circle (like Spider Trap placement) — opponent shots crossing it lose 40% speed. Yours are immune. | Spider Trap, Magnetic Keeper |
| **Ice Rink** | 🧊 | UNCOMMON | A frictionless strip appears across midfield — ALL shots crossing it keep their speed (both teams). Risky symmetric twist. | Glide (double up = your shots basically never stop), Topspin |
| **Sinkhole** | 🕳️ | RARE | A small hole in the opponent's half swallows THEIR ball and respawns it at their goal line (like a forced back-pass). | Fog (they can't see where it is), Heavy Ball |
| **Trampoline Walls** | 🤸 | RARE | YOUR side walls bounce your shots with +30% energy (opponent's shots unaffected). | Ricochet + Topspin + Bumper — the pinball god build |
| **Home Turf** | 🏟️ | EPIC | Choose one arena twist from Stadium Royale (wind, portals, fortress...) to apply to THIS match — both sides feel it, but you chose it to fit your build. | Everything — this is the build-defining pick |
| **Narrow Pitch** | ↔️ | RARE | The walls move in 10% for the whole match. Fewer angles, more bounces, brutal with a bounce build. | Ricochet, Trampoline Walls, Bumper |

## 4. Squad & players

| Name | Icon | Rarity | Effect | Synergies |
|---|---|---|---|---|
| **Captain** | ©️ | RARE | Pick one of your players: shots that touch them gain +25% speed and a straighter line. | Volley, Sticky (bounce it off the captain every turn) |
| **Shadow Striker** | 🥷 | EPIC | Your Striker (requires Striker equipped — first explicit "requires X" ability) is invisible to the opponent until the ball crosses midfield. | Striker — makes it a true combo piece, Balatro-style enabler |
| **Twelfth Man** | 📣 | UNCOMMON | Once per match, after conceding, add a temporary extra outfield player for one turn. | Sixth Defender, Last Stand — the resilience build |
| **Bodyguard** | 🦺 | UNCOMMON | Your player nearest the ball carrier can't be knocked back by opponent shots. | Anchor (they now have two immovable objects), Heavy Ball counter |
| **Playmaker** | 🎩 | RARE | Hitting your own player no longer counts toward the 3-flick possession cap (still passes turn on a miss). | Sticky — infinite tiki-taka potential, capped by miss risk |
| **Veteran** | 🧓 | COMMON | One random player of yours starts each match repositioned into the ideal blocking lane (auto mini-Strategist). | Strategist (fully scripted defense) |

## 5. Turn & tempo

| Name | Icon | Rarity | Effect | Synergies |
|---|---|---|---|---|
| **Quick Restart** | ⏩ | RARE | After conceding, you kick off instantly — the goal celebration is skipped and the opponent's next-turn setup time is halved. | Tempo build with Playmaker |
| **Second Wind** | 🌬️ | EPIC | Once per match, immediately after your shot stops, flick again from where it lies (a true extra turn, no own-hit needed). | Sniper (line up the rebound), Soft Touch |
| **Time Bank** | ⏳ | UNCOMMON | In timed matches, your goals add +10 seconds each. Meaningless in goal-target matches — situational by design. | Golden-goal scenarios; Last Stand |
| **Opening Gambit** | 🎬 | UNCOMMON | You always win the kickoff coin flip. Boring? No — kickoff is the only guaranteed clean look at goal. | Cannon + Sniper first-blood build |
| **Momentum** | 📈 | RARE | Score twice in a row and your next shot gets +20% power. Resets when you concede. A scaling ability — Balatro's growth jokers. | Cannon (stack toward one-flick screamers) |

## 6. Curses (opponent debuffs)

| Name | Icon | Rarity | Effect | Synergies |
|---|---|---|---|---|
| **Jinx** | 🐈‍⬛ | RARE | The first time the opponent would score each half, the post saves it. One guaranteed denial per half. | Shield (two free denials), Sixth Defender |
| **Stage Fright** | 🎤 | UNCOMMON | Opponent power meter shows wrong values (visual only — their max is unchanged). | Fog + Drunk + Feint — the full chaos/casino build |
| **Heavy Legs** | 🦵🐌 | UNCOMMON | Opponent's possession cap drops from 3 flicks to 2. | Freeze — grind them down |
| **Echo** | 🔁 | EPIC | The opponent's next shot after THEY equip a new ability is forced to be a repeat of their previous shot vector. Punishes their draft moment. | Spider Trap placed on the known path = scripted interception |
| **Small Goal** | 🥅➖ | EPIC | The opponent attacks a goal that's 15% narrower. Direct mirror of Big Keeper — pick your poison. | Big Keeper + Small Goal = fortress fantasy |
| **Sticky Pitch** | 🍯 | RARE | Opponent shots that bounce off ANY wall lose 30% extra speed. Anti-bounce tech — the explicit counter to the pinball build. | Zone Defense |

## 7. Meta & slot manipulation (the most Balatro layer)

| Name | Icon | Rarity | Effect | Synergies |
|---|---|---|---|---|
| **Curator** | 🖼️ | RARE | Your future drafts show 4 options instead of 3. Pure draft-power — a "shop upgrade" without a shop. | Everything; premium early pick |
| **Mulligan** | 🔀 | UNCOMMON | Once per draft, reroll all three options. | Curator — draft-perfectionist build |
| **Duplicate** | 🪞 | LEGENDARY | Copy an ability you already own into this slot (first ability that can stack: 2× Cannon = 4× power? cap it at 2.5×; 2× Glide = near-zero friction...). | Literally everything — THE legendary chase pick |
| **Heirloom** | 🏺 | EPIC | This slot's ability survives into your next match even in modes that reset loadouts (royale stages, tournament rounds keep it locked in). | Tournament runs — lock in a build cornerstone |
| **Saboteur** | 🧨 | EPIC | When you steal or the opponent loses an ability (Swap interactions), that slot stays broken for them for 2 turns before refilling. | Swap — makes the trade economy vicious |
| **Understudy** | 🎭 | RARE | Your empty slots each grant +5% shot power until filled. Rewards drafting LESS — a deliberate anti-build build. | Tension with Curator/Mulligan; speed-run archetype |
| **Loan** | 🤝 | UNCOMMON | Both teams get a copy of this random COMMON ability. You know it's coming; they don't. | Ice Rink-style symmetric twists you're built to exploit |

## 8. Explicit combo callouts (tag these in the UI)

When both pieces are equipped, show a "COMBO!" chip on the team bar — visible
buildcraft payoff, like Balatro joker interactions:

| Combo name | Pieces | Payoff |
|---|---|---|
| **PINBALL WIZARD** | Ricochet + Bumper (+ Topspin/Trampoline) | Bounce build: every wall touch accelerates; three-wall goals feel incredible |
| **BLIZZARD** | Freeze + Glide | Their shots crawl, yours never stop — ice-age control |
| **POLTERGEIST** | Ghost + Portal | Ball phases through the defense then teleports — pure disrespect |
| **SET PIECE** | Sticky + Playmaker (+ Captain) | Pass-pass-shoot every turn like a training drill |
| **HOWITZER** | Cannon + Afterburner (+ Momentum) | The one-flick nuke build; wall HP evaporates (Cannon already double-damages Wall) |
| **DARK ARTS** | Fog + Drunk + Feint/Stage Fright | Opponent aims blind, wobbly, and lied-to |
| **CATENACCIO** | Wall + Anchor + Big Keeper/Small Goal | The 0-0-until-they-crack fortress; pairs with Last Chance drama |
| **SNIPER'S NEST** | Sniper + Slow Mo + Joystick | Full fire-control system — see far, fly slow, steer true |
| **BANANA STORM** | Curveball + Serpent | S-curve THEN banana arc — physically legal, visually cursed (already possible today!) |
| **INSURANCE FRAUD** | Shield + Jinx + Sixth Defender | Three separate free-goal denials before they play real football |

## 9. Build archetypes to balance around

Name the archetypes so drafts have identity (Balatro's "flush build / mult build"):

- **Pinball** — bounce amplification, wins from impossible angles
- **Fortress** — deny goals, win 1-0 or on penalties
- **Blitz** — raw power + tempo, race to the win target before defense matters
- **Control** — slow, steered, precise; wins the aim duel
- **Chaos** — debuff stacking; opponent beats themselves
- **Drafter** — slot/meta manipulation; out-scales everyone by match end

Balance rule of thumb: every archetype should have a COMMON entry point, a RARE
power spike, and exactly one LEGENDARY fantasy piece. Every archetype should have
one explicit counter-pick in another archetype (Sticky Pitch counters Pinball,
Small Goal counters Blitz, Medic counters Chaos...).

## 10. Wilder one-offs (parking lot)

- **Penalty Insurance** 🎟️ (EPIC) — if the match reaches a shootout, you start it 1-0 up
- **Grudge** 😤 (RARE) — +10% power against the last team that beat you (persists via localStorage)
- **Weather Vane** 🌦️ (UNCOMMON) — royale-style wind, but it always blows toward the opponent goal on your turn
- **Encore** 🎪 (LEGENDARY) — replay your last goal's exact shot as a free flick, once per match
- **Referee's Friend** 🤫 (RARE) — your first own-goal each match doesn't count
- **Mascot** 🐣 (COMMON) — pure cosmetic pet on your bench that cheers; exists ONLY to be a joke common that makes rare pulls feel rarer (Balatro's Gros Michel energy)
- **Tifo Master** 🎨 (COMMON) — your goal celebrations get bigger and your crowd louder; morale placebo
- **Time Traveler** ⏪ (LEGENDARY) — once per match, undo the last completed turn (both teams' state rolls back)

---

*Implementation note: nothing above introduces currency, points, shops, or XP.
Everything triggers off existing systems — goals, turns, flicks, slots, drafts,
debuffs, walls, arenas — so each idea is a self-contained `TACTICS` entry plus
its hook, in the same pattern as the current 29.*
