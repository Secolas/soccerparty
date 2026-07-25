    // ================= CHALLENGE LINKS =================
    // Share a Royale run as a URL so a friend plays the same ladder — same
    // season, same difficulty, same run of opponents, same team — and the two
    // flick totals can be compared. There is no server: the whole challenge
    // rides in the fragment, so it works from any chat app and offline once the
    // page is cached.
    //
    // Hazard placement is still random per run, so this is a fair contest on the
    // same fixture list rather than a byte-identical replay. Seeding the world
    // would need the gameplay RNG routed through a seeded generator; the payload
    // is versioned (v) so that can be added later without breaking old links.
    var CHALLENGE = null;        // an incoming challenge, parsed from the URL
    var _chPending = null;       // its config, applied when the run starts

    function chEncode(o){
      try {
        var json = JSON.stringify(o);
        var b64 = btoa(unescape(encodeURIComponent(json)));
        return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } catch (e) { return null; }
    }
    function chDecode(str){
      try {
        var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (b64.length % 4) b64 += '=';
        var o = JSON.parse(decodeURIComponent(escape(atob(b64))));
        return (o && o.v === 1 && o.o && o.o.length) ? o : null;
      } catch (e) { return null; }
    }

    // Total flicks the player used across a finished run.
    function chRunFlicks(){
      try {
        var h = (ROYALE && ROYALE.history) || [], t = 0, any = false;
        for (var i = 0; i < h.length; i++) if (typeof h[i].f === 'number') { t += h[i].f; any = true; }
        return any ? t : null;
      } catch (e) { return null; }
    }

    // Build the shareable link for the run that just finished.
    function chLinkForRun(champ){
      try {
        if (!ROYALE || !ROYALE.opps) return null;
        var f = chRunFlicks();
        var payload = {
          v: 1,
          m: (ROYALE.map === 2) ? 2 : 1,
          d: royaleLevel || 'med',
          p: ROYALE.player,
          o: ROYALE.opps.slice(),
          f: (champ && f != null) ? f : null,      // only a completed run sets a target
          n: (PRESETS[ROYALE.player] && PRESETS[ROYALE.player].abbr) || ''
        };
        var code = chEncode(payload);
        if (!code) return null;
        var base = location.origin + location.pathname;
        return base + '#c=' + code;
      } catch (e) { return null; }
    }

    // Read a challenge out of the URL on boot.
    function chReadUrl(){
      try {
        var m = (location.hash || '').match(/[#&]c=([A-Za-z0-9_-]+)/);
        if (!m) return null;
        return chDecode(m[1]);
      } catch (e) { return null; }
    }
    function chClearUrl(){
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }

    // Start the challenge run: the same ladder, opponents and team as the sender.
    // The difficulty/season locks are bypassed on purpose — you should always be
    // able to accept a link, even if you have not unlocked that rung yourself.
    function chStart(){
      if (!CHALLENGE) return;
      var c = CHALLENGE;
      royMap = (c.m === 2) ? 2 : 1;
      royaleLevel = (c.d === 'easy' || c.d === 'hard') ? c.d : (c.d === 'med' ? 'med' : 'med');
      _chPending = c;
      var pi = (typeof c.p === 'number' && PRESETS[c.p]) ? c.p : 0;
      try { teamKits.red = PRESETS[pi]; buildCrowd(); } catch (e) {}
      try { spClearRun('royale'); } catch (e) {}
      startRoyale(pi, { opps: c.o.slice(), target: (typeof c.f === 'number') ? c.f : null, from: c.n || '' });
    }

    // --- UI ---------------------------------------------------------------

    // Banner shown on the menu when the page was opened from a challenge link.
    function chBanner(host){
      if (!CHALLENGE) return;
      var c = CHALLENGE;
      var who = c.n ? (c.n + ' challenges you') : 'A challenge';
      var lvl = { easy: 'EASY', med: 'MEDIUM', hard: 'HARD' }[c.d] || 'MEDIUM';
      var box = mk('div', 'margin:2px 0 8px;padding:11px 12px;border-radius:10px;background:linear-gradient(#1a1330,#0e0a18);border:2px solid #ffd84a;box-shadow:0 0 16px rgba(255,216,74,0.28);');
      box.appendChild(mk('div', FS(8, '#ffd84a') + 'text-align:center;letter-spacing:1px;margin-bottom:6px;', '⚔  ' + who.toUpperCase()));
      box.appendChild(mk('div', FS(6, '#f4e9c8') + 'text-align:center;line-height:1.9;',
        'SEASON ' + ((c.m === 2) ? 2 : 1) + '  •  ' + lvl));
      if (typeof c.f === 'number') {
        box.appendChild(mk('div', FS(7, '#a9c94b') + 'text-align:center;line-height:1.9;margin-top:3px;',
          'BEAT ' + c.f + ' FLICKS'));
      } else {
        box.appendChild(mk('div', 'font-size:10px;line-height:1.6;color:#9a8fb0;text-align:center;margin-top:4px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;',
          'They did not finish this run — see if you can.'));
      }
      var go = mk('button', 'margin-top:9px;width:100%;' + FS(10, '#0b1a0e') + 'background:#ffd84a;border:2px solid #fff0a8;padding:10px;cursor:pointer;', 'ACCEPT CHALLENGE  ▸');
      go.onclick = function(){ chStart(); };
      box.appendChild(go);
      var no = mk('div', FS(6, '#8a7ea0') + 'text-align:center;margin-top:7px;padding:5px;cursor:pointer;', 'DISMISS');
      no.onclick = function(){ CHALLENGE = null; chClearUrl(); try { buildPre(); } catch (e) {} };
      box.appendChild(no);
      host.appendChild(box);
    }

    // "Challenge a friend" button for the result screen.
    function chShareButton(champ){
      var link = chLinkForRun(champ);
      if (!link) return null;
      var b = mk('button', 'width:100%;max-width:260px;' + FS(9, '#0b1a0e') + 'background:#ffd84a;border:2px solid #fff0a8;padding:10px;cursor:pointer;', '⚔  CHALLENGE A FRIEND');
      b.onclick = function(){
        var f = chRunFlicks();
        var msg = champ && f != null
          ? 'I cleared this Soccer Party run in ' + f + ' flicks. Beat it:'
          : 'Try this Soccer Party run:';
        var done = function(t){ b.textContent = t; setTimeout(function(){ b.textContent = '⚔  CHALLENGE A FRIEND'; }, 1800); };
        try {
          if (navigator.share) { navigator.share({ title: 'Soccer Party', text: msg, url: link }).catch(function(){}); return; }
        } catch (e) {}
        try {
          navigator.clipboard.writeText(msg + ' ' + link)
            .then(function(){ done('LINK COPIED!'); })
            .catch(function(){ done('COPY FAILED'); });
        } catch (e) { done('COPY FAILED'); }
      };
      return b;
    }

    // Result line comparing your total with the challenger's.
    function chResultLine(){
      try {
        if (!ROYALE || !ROYALE.ch || typeof ROYALE.ch.target !== 'number') return null;
        var mine = chRunFlicks();
        if (mine == null) return null;
        var theirs = ROYALE.ch.target, beat = mine < theirs;
        var who = ROYALE.ch.from ? ROYALE.ch.from : 'THEM';
        var d = mk('div', 'margin:6px 0 2px;padding:9px 11px;border-radius:9px;text-align:center;background:' +
          (beat ? 'rgba(70,130,45,0.3)' : 'rgba(90,80,130,0.28)') + ';border:1px solid ' +
          (beat ? 'rgba(150,220,90,0.5)' : 'rgba(150,140,200,0.4)') + ';');
        d.appendChild(mk('div', FS(7, beat ? '#a9c94b' : '#c9bce0') + 'letter-spacing:1px;line-height:1.7;',
          beat ? 'CHALLENGE BEATEN!' : 'CHALLENGE NOT BEATEN'));
        d.appendChild(mk('div', FS(6, '#f4e9c8') + 'line-height:1.9;margin-top:3px;',
          'YOU ' + mine + '  •  ' + who + ' ' + theirs));
        return d;
      } catch (e) { return null; }
    }
