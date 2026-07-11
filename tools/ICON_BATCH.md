# Ability-Icon Batch — run this in LOCAL Claude Code (PixelLab connected)

Goal: regenerate the whole ability-icon set as ONE cohesive family, so the game
stops looking like assembled clip-art and starts looking designed. This is the
single biggest visual win (40 icons, always on screen during play).

## Direction (honors "Dave the Diver", adapted for tiny icons)
Warm, saturated, friendly pixel art with DtD's palette and soft rim-light — but
BOLD and readable, because these render ~26px in the scoreboard. Detail that
doesn't survive at small size is wrong here. Consistency > detail.

## FIXED STYLE SUFFIX — append to EVERY prompt below, unchanged
> centered game power-up icon, bold clean silhouette, single dark outline, warm
> saturated palette with soft highlight and subtle rim light, chunky readable
> shapes, fills most of the frame, flat solid #FF00FF magenta background, no
> text, no lettering, no drop shadow, no gradient background

## FIXED PARAMS — same for every icon
size 64 · single color outline · basic shading · low-medium detail · front/side view

## WORKFLOW (do NOT skip step 1)
1. **Reference first.** Generate ONLY `icon-shield` (below) 4–6 times, pick the
   best, save it as the style anchor. STOP and eyeball it — is this the family
   look you want? If not, tweak the suffix and redo before touching the rest.
2. **Batch the rest matching the anchor.** For every other icon, tell PixelLab
   to *match the style/palette/outline of the approved icon-shield*, using the
   suffix + params above.
3. Save each to `assets/generated/` (overwrite the old PNGs).
4. Curate: anything that drifts off-family, regenerate.
5. `git add assets/generated && git commit && git push`.

## The set (subject → filename)

**ANCHOR — do this one first:**
- `icon-shield` — a classic heraldic knight shield, glossy steel-blue, white highlight

**Then the rest, each matching the anchor:**
- `icon-flick` — a chunky soccer cleat boot, side view, cream-white and gold
- `icon-wild` — a joker/wild playing card tilted, bold star on its face
- `icon-swap` — two curved arrows in a ring, one blue one orange
- `icon-trap` — dark navy disc with a white spider web and a chunky spider
- `icon-bumper` — a glowing pinball bumper cap, orange/yellow rings, spark marks
- `icon-ricochet` — a yellow arrow bouncing off a grey wall bar in a V, impact spark
- `icon-fog` — a puffy grey storm cloud with short mist streaks
- `icon-drunk` — a frothy beer tankard, amber beer, white foam overflowing
- `icon-serpent` — a green snake curled into an "S", small head, red tongue
- `icon-cannon` — a stubby black cannon barrel angled up, lit fuse, smoke puff
- `icon-curveball` — a ripe yellow banana
- `icon-glide` — a shiny pale-blue ice cube
- `icon-magnet` — a red horseshoe magnet
- `icon-sticky` — a golden honey pot
- `icon-sniper` — a black telescopic rifle scope alone, side view, glinting lens
- `icon-bigkeeper` — a single goalkeeper glove, palm forward, blue and white
- `icon-freeze` — a crisp pale-blue snowflake, symmetrical
- `icon-guided` — a bright cyan spiral swirl with an arrowhead, glowing
- `icon-joystick` — an arcade joystick with a glossy RED ball knob, black base
- `icon-wall` — a short grey stone brick wall barrier, front view
- `icon-hammer` — a chunky hammer, grey head, brown handle, diagonal
- `icon-slowmo` — an hourglass with glowing pale-cyan sand
- `icon-ghost` — a cute white cartoon ghost, wavy bottom, two dark eyes
- `icon-reflex` — a blue goalkeeper glove with yellow speed motion lines
- `icon-striker` — two overlapping glossy soccer-player token discs, jersey stripe
- `icon-anchor` — a heavy grey iron ship anchor
- `icon-reflex-2` — a goalkeeper in blue diving sideways to catch a ball
- `icon-striker-2` — a golden cleat kicking a white ball with motion lines
- `icon-portal` — a swirling portal vortex, cyan and purple rings, white center
- `icon-sweeper` — a blue/white glove punching a ball, one forward arrow, no person
- `icon-strategist` — a tactics clipboard, dark green, white pitch diagram, yellow arrow
- `icon-volley` — a golden cleat striking a ball, curved swoosh lines, impact spark
- `icon-medic` — a bold red medical cross on a white first-aid badge
- `icon-flex` — a flexed bicep arm (💪), solid skin tone, big muscle bulge
- `icon-fire` — a campfire flame, orange/yellow/red tongues

## Note
The larger `icon-trophy` (size 96) is a HERO asset — generate it separately at
higher detail (it renders big on the win screen), not in this small-icon batch.
