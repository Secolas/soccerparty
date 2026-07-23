# Soccer Party — Promo Capture Assets

Real screenshots and screen-recordings captured from the actual game (headless
Chromium, 9:16 portrait), for building the promo video described in
`docs/VIDEO_PROMO_AI_PROMPT.md`. These are the Higgsfield image-to-video seed
frames / clips.

## Stills (`promo-shots-final/`)

| File | What it shows |
|---|---|
| `01-menu-exhibition.png` | Main menu — team/pitch/formation select |
| `02-menu-neon-lineup.png` | Neon board with both teams lined up |
| `03-neon-board-kickoff.png` | In-match neon board, scorebugs + coin tokens |
| `04-coin-toss.png` | "Brazil KICKS OFF!" coin toss |
| `05-aquarium-board.png` | Aquarium board (menu-scale) |
| `06-royale-setup.png` | Stadium Royale setup screen |
| `07-royale-world-map.png` | **Royale world map — all 9 boss arenas** |
| `08-how-to-play.png` | HOW TO PLAY reference |
| `09-achievements.png` | 24-achievement list |
| `10-flick-aim-arrow.png` | **Slingshot aim arrow mid-flick** (green arrow + trajectory + power bar) |
| `11-flick-ball-travel.png` | Ball travelling after release |
| `12-ball-in-motion.png` | Flicked ball crossing the pitch |
| `inmatch-01..12-*.png` | **Full-size in-match boards for all 12 pitches** (GRASS, STREET, BEACH, NEON, ICE, COBBLE, CLAY, TURF, STONE, SAVANNA, AQUARIUM, WOOD) |
| `00-logo-tap-to-start.png` | **Logo cold-open** — SOCCER/PARTY + TAP TO START |
| `00b-loading-bar.png` | Boot loading bar |
| `13-goal-celebration.png` | **GOAL! celebration** (confetti, tifo, crowd) |
| `14-ability-curveball.png` | **Curveball** — bending Magnus trail |
| `15-ability-cannon.png` | **Cannon** — full-length power beam |
| `16-ability-laser-aim.png` | **Laser/sniper** aim line |
| `17-coin-rush-board.png` | **Coin Rush** — gold tokens on the pitch + coin counters |

## Clips (`promo-video/`, webm)

| File | What it shows |
|---|---|
| `01-aquarium-ambience.webm` | Fish drifting under the glass pitch + crowd/anthem motion |
| `02-neon-flick.webm` | Slingshot flick — aim + shot travelling |
| `03-grass-rally.webm` | Several flicks with the packed stadium crowd |
| `04-pitch-carousel.webm` | Cycling through all 12 pitch themes |

webm plays in any modern browser. To convert to mp4 locally:
`ffmpeg -i clip.webm -c:v libx264 -pix_fmt yuv420p clip.mp4`
