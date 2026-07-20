    // Benign-error guard. The bundled runtime's reconciler occasionally throws
    // "removeChild ... not a child of this node" when it re-renders around the
    // game's imperative DOM (e.g. the royale kickoff writes the opponent's
    // preloaded ability slots + immunity badge into the scorebug at once). The
    // match still loads and plays; this only swallows that one exact, harmless
    // signature so it doesn't spam the on-screen error overlay. Everything else
    // still surfaces normally.
    try{ window.addEventListener('error', function(_e){ try{ var _m=(_e&&_e.error&&_e.error.message)||(_e&&_e.message)||''; if(/removeChild/.test(_m) && /not a child/.test(_m)){ if(_e.preventDefault) _e.preventDefault(); if(_e.stopImmediatePropagation) _e.stopImmediatePropagation(); return false; } }catch(_x){} }, true); }catch(_e){}

    // When true, the royale scorebug writes (immunity badge, ability slots) are
    // held back so they don't run during the runtime's kickoff render commit —
    // startRoyaleArena sets it, then clears it one frame later and re-renders.
    var _royScoreDefer=false;

    // ================= UI COLOR TOKENS =================
    // Single source of truth for the game's menu/overlay palette. Every panel
    // (onboarding, HOW TO PLAY, ability draft, results, achievements, shop)
    // should draw its colours from PAL so the UI can't drift into one-off
    // shades again. In-match/canvas art (pitch, kits, crowd) is separate — this
    // is only the dark "night-stadium" chrome that frames the game.
    //
    // Sorts right after 00-bootstrap (before 01-layout), so PAL exists before
    // any overlay builder runs. See docs/UI_TOKENS.md for the reference.
    var PAL = {
      // Panels / surfaces
      scrim:     'rgba(6,4,10,0.86)',                 // full-screen overlay backdrop
      panel:     'linear-gradient(#1a1330,#0e0a18)',  // modal / card ground
      panelTop:  '#1a1330',
      panelBase: '#0e0a18',
      panelSoft: '#241a38',                            // raised rows / secondary buttons
      // Framing
      frame:     '#4a3a5e',                            // panel border
      frameSoft: '#3a3050',                            // dividers / inactive dots & pips
      // Text
      head:      '#a9c94b',                            // titles / headings (accent green)
      body:      '#c7bcd8',                            // body copy (lavender)
      muted:     '#9a8fb0',                            // labels / secondary text
      cream:     '#f4e9c8',                            // emphasis text on dark
      ink:       '#0b1a0e',                            // text on gold / green buttons
      // Accents
      green:     '#a9c94b',
      greenHi:   '#e6ff7a',
      gold:      '#f2c14e',
      goldDeep:  '#d79a2c',
      goldEdge:  '#f0d089',                            // gold button border/highlight
      goldSh:    '#7c5714',                            // gold button drop-shadow
      btnGold:   'linear-gradient(#f2c14e,#d79a2c)'    // primary CTA fill
    };
