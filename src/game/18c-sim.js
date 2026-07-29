    // ================= HEADLESS SIMULATION HOOK =================
    // Armed only by ?sim=1, so a normal session can never reach it. It exists so
    // tools/balance.mjs can play thousands of CPU-vs-CPU matches against the REAL
    // engine and AI. Balance numbers from a reimplemented physics model would
    // drift out of sync with the game the moment either side changed; this way
    // the thing measured is the thing shipped.
    //
    // Matches run in practice mode on purpose: it is the one mode that skips the
    // goal-time ability draft (see the scorer branch in 11-physics.js), so a
    // loadout set here survives the whole match instead of being topped up after
    // every goal.
    function simArmed(){
      try { return /[?&]sim=1/.test((location && location.search) || ''); }
      catch (e) { return false; }
    }
    function simInstall(){
      if (!simArmed()) return;
      window.__spSim = {
        // Kick off one match. Returns true, or an error string.
        start: function(o){
          o = o || {};
          try {
            muted = true; musicOn = false;
            mode = 'practice';                   // no ability draft between goals
            teamSize = o.size || 5;
            winTarget = o.target || 3;
            matchLen = 0;                        // goals decide it, not the clock
            aiLevel = exhLevel = o.level || 'med';
            aiEnabled = { red: true, blue: true };
            var ri = (typeof o.redTeam === 'number') ? o.redTeam : 0;
            var bi = (typeof o.blueTeam === 'number') ? o.blueTeam : 1;
            teamKits.red = PRESETS[ri]; teamKits.blue = PRESETS[bi];
            buildBoard(); buildCrowd();
            try { var pre = el('ns_pre'); if (pre) pre.style.display = 'none'; } catch (e) {}
            newMatch();
            // after newMatch, or rebuildFormations would not see the loadout
            sideAb = { red: (o.red || []).slice(), blue: (o.blue || []).slice() };
            tacticsChosen = true;
            try { applyTactics(); } catch (e) {}
            try { syncSpecialNails(); } catch (e) {}
            try { syncSlots(); } catch (e) {}
            // newMatch() leaves the board in setup, waiting for a human to place
            // pieces. In practice mode startMatch() goes straight to beginPlay
            // with no coin toss, so red always kicks off and the only difference
            // between two runs is the loadout under test.
            startMatch();
            return true;
          } catch (e) { return String(e); }
        },
        // Poll this until done is true.
        state: function(){
          try {
            return {
              done: !!winner, winner: winner || null,
              red: score.red, blue: score.blue,
              turns: (typeof _matchTurns === 'number') ? _matchTurns : -1,
              phase: phase
            };
          } catch (e) { return { done: false, err: String(e) }; }
        },
        // Read the live ball and board, and place the ball with a velocity. A stadium hazard is often
        // impossible to check from outside: whether a bank rail turned the ball back into play, or a
        // sail launched it, or a cup claimed it, cannot be told apart from the pixels. With these a
        // test can put the ball on one and read the result instead of flicking blindly and hoping.
        // Behind ?sim=1 like the rest of this hook, and smoke.mjs asserts the hook is absent without it.
        probe: function(){
          try {
            return {
              board: (typeof boardKey !== 'undefined') ? boardKey : null,
              mode: mode, tier: (typeof hzTier === 'function') ? hzTier() : -1,
              x: coin.x, y: coin.y, vx: coin.vx, vy: coin.vy,
              air: coin.air || 0, moving: !!moving, phase: phase, turn: current,
              red: score.red, blue: score.blue,
              // the pegs, so a test can check nothing was placed standing in a hazard
              nails: nails.map(function(n){ return {x:n.x, y:n.y, team:n.team, goalie:!!n.goalie}; }),
              // CPU aim-telegraph state, so a test can catch a wind-up frame
              aiPending: (typeof aiPending!=='undefined') ? !!aiPending : false,
              aiAim: (typeof aiAim!=='undefined' && aiAim) ? {x:aiAim.x, y:aiAim.y} : null,
              aiTp: (typeof aiThink0!=='undefined' && aiThink0) ? 1-Math.max(0,aiDelay)/aiThink0 : 0
            };
          } catch (e) { return { err: String(e) }; }
        },
        // Ask the ARENA whether a point is on a hazard, rather than having the test reimplement the
        // shapes. A test that recomputed them as plain ellipses reported pegs as standing in the pond when
        // the wobbled outline put them safely outside it — the fourth time a hand-rolled probe measured
        // something other than what the game does.
        hz: function(x, y, r){
          try { return (typeof cgHazardAt === 'function') ? !!cgHazardAt(x, y, r || 0) : null; }
          catch (e) { return null; }
        },
        put: function(o){
          try {
            o = o || {};
            coin.x = o.x; coin.y = o.y;
            coin.vx = o.vx || 0; coin.vy = o.vy || 0;
            coin.air = o.air || 0; coin.air0 = o.air || 0; coin.spin = 0;
            if (o.turn) current = o.turn;
            moving = !!(coin.vx || coin.vy);
            return true;
          } catch (e) { return String(e); }
        },
        // Every ability id, so the runner never hardcodes a list that can rot.
        abilities: function(){
          try { return TACTICS.map(function(t){ return t.id; }); } catch (e) { return []; }
        }
      };
    }
    try { simInstall(); } catch (e) {}
