# UI Color Tokens

The game's menu/overlay chrome uses **one dark "night-stadium" palette**, defined
once in [`src/game/00b-palette.js`](../src/game/00b-palette.js) as the `PAL` object
and consumed by every overlay. This keeps the UI from drifting back into one-off
shades (like the old wood-brown onboarding).

> In-match/canvas art — pitch, kits, crowd, boards — is **not** part of this. `PAL`
> is only the dark chrome that frames the game.

## Tokens

| Token | Value | Role |
|---|---|---|
| **Panels / surfaces** | | |
| `PAL.scrim` | `rgba(6,4,10,0.86)` | Full-screen overlay backdrop |
| `PAL.panel` | `linear-gradient(#1a1330,#0e0a18)` | Modal / card ground |
| `PAL.panelTop` | `#1a1330` | Panel gradient top |
| `PAL.panelBase` | `#0e0a18` | Panel gradient base |
| `PAL.panelSoft` | `#241a38` | Raised rows / secondary buttons |
| **Framing** | | |
| `PAL.frame` | `#4a3a5e` | Panel border |
| `PAL.frameSoft` | `#3a3050` | Dividers / inactive dots & pips |
| **Text** | | |
| `PAL.head` | `#a9c94b` | Titles / headings (accent green) |
| `PAL.body` | `#c7bcd8` | Body copy (lavender) |
| `PAL.muted` | `#9a8fb0` | Labels / secondary text |
| `PAL.cream` | `#f4e9c8` | Emphasis text on dark |
| `PAL.ink` | `#0b1a0e` | Text on gold / green buttons |
| **Accents** | | |
| `PAL.green` | `#a9c94b` | Primary accent (pitch green) |
| `PAL.greenHi` | `#e6ff7a` | Bright lime highlight |
| `PAL.gold` | `#f2c14e` | Trophy gold |
| `PAL.goldDeep` | `#d79a2c` | Gold gradient base |
| `PAL.goldEdge` | `#f0d089` | Gold button border/highlight |
| `PAL.goldSh` | `#7c5714` | Gold button drop-shadow |
| `PAL.btnGold` | `linear-gradient(#f2c14e,#d79a2c)` | Primary CTA fill |

## Usage

Build inline styles by concatenating tokens instead of hardcoding hex:

```js
var card = mk('div',
  'background:'+PAL.panel+';border:2px solid '+PAL.frame+';border-radius:14px;');
var title = mk('div', FS(13, PAL.head)+'text-align:center;', 'SOCCER PARTY');
var cta   = mk('button',
  FS(10, PAL.ink)+'background:'+PAL.btnGold+';border:2px solid '+PAL.goldEdge+';', 'PLAY');
```

`src/game/17-onboard.js` is the reference consumer — copy its pattern for new panels.

## Migration status

- ✅ **Onboarding** — fully tokenized (reference implementation).
- ⏳ **HOW TO PLAY, ability draft, results, achievements, coin shop** — already use
  these exact values, so they match the system; migrating them to reference `PAL`
  directly is a mechanical follow-up.
