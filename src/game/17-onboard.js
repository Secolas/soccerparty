    // ================= FIRST-RUN ONBOARDING =================
    // One guided intro shown once on first launch. Replaces the old auto
    // HOW-TO pop and the scattered first-match tips (setup/shoot/ability),
    // which are now retired in nsShowTip. HOW TO PLAY stays available from
    // the menu as a reference. Pass force=true to replay it.
    // Colours come from PAL (see 00b-palette.js) — this is the reference
    // consumer of the shared UI token system.
    function showOnboarding(force){
      try{ if(!force && localStorage.getItem('ns_onboard_seen')) return; }catch(e){}
      if(document.getElementById('ns_onboard')) return;
      var STEPS=[
        {img:'assets/generated/icon-app.png', t:'SOCCER PARTY', b:'Pixel flick-football. Score goals, win powers, party on the pitch.'},
        {img:'assets/generated/icon-flick.png', t:'FLICK TO SHOOT', b:'Drag back from the ball and let go — like a slingshot. The longer you pull, the harder the shot.'},
        {img:'assets/generated/icon-striker.png', t:'SCORE & KEEP THE BALL', b:'Flick into the far goal. Clip one of YOUR players and you keep the turn — up to 3 flicks.'},
        {img:'assets/generated/icon-cannon.png', t:'WIN ABILITIES', b:'Score to earn powers — cannons, big keepers, curveballs. Tap a slot on the scoreboard to see or pick one.'},
        {img:'assets/generated/icon-trophy.png', t:'PICK A MODE', b:'Jump into Exhibition, chase the cup in Tournament, or brave STADIUM ROYALE — 9 hazard stadiums.'}
      ];
      var i=0;
      var ov=mk('div','position:fixed;left:0;top:0;right:0;bottom:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:'+PAL.scrim+';padding:16px;box-sizing:border-box;');
      ov.id='ns_onboard';
      var card=mk('div','position:relative;width:100%;max-width:340px;background:'+PAL.panel+';border:2px solid '+PAL.frame+';border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.6),inset 0 0 0 1px rgba(120,90,160,0.15);padding:20px 18px 16px;');
      function done(){ try{ localStorage.setItem('ns_onboard_seen','1'); localStorage.setItem('ns_howto_seen','1'); }catch(e){} if(ov.parentNode) ov.parentNode.removeChild(ov); }
      var skip=mk('div',FS(8,PAL.muted)+'position:absolute;top:8px;right:10px;padding:5px 9px;border-radius:7px;background:rgba(0,0,0,0.3);cursor:pointer;letter-spacing:1px;','SKIP');
      skip.onclick=done; card.appendChild(skip);
      var emo=mk('div','width:72px;height:72px;margin:6px auto 12px;background-repeat:no-repeat;background-position:center;background-size:contain;image-rendering:pixelated;border-radius:16px;overflow:hidden;','');
      var ttl=mk('div',FS(13,PAL.head)+'text-align:center;letter-spacing:1px;margin-bottom:12px;text-shadow:0 3px 0 #12210a;padding:0 26px;','');
      var body=mk('div',FS(9,PAL.body)+'text-align:center;line-height:1.9;min-height:96px;padding:0 4px;','');
      var dots=mk('div','display:flex;gap:6px;justify-content:center;margin:14px 0 12px;');
      var dotEls=STEPS.map(function(_,k){ var d=mk('div','width:8px;height:8px;border-radius:50%;background:'+PAL.frameSoft+';',''); dots.appendChild(d); return d; });
      var nav=mk('div','display:flex;gap:10px;');
      var back=mk('button',FS(9,PAL.body)+'flex:0 0 auto;background:'+PAL.panelSoft+';border:2px solid '+PAL.frame+';border-radius:9px;padding:11px 14px;cursor:pointer;','BACK');
      var next=mk('button',FS(10,PAL.ink)+'flex:1;background:'+PAL.btnGold+';border:2px solid '+PAL.goldEdge+';border-radius:9px;padding:11px;cursor:pointer;box-shadow:0 3px 0 '+PAL.goldSh+';letter-spacing:1px;','NEXT');
      back.onclick=function(){ if(i>0){ i--; render(); } };
      next.onclick=function(){ if(i<STEPS.length-1){ i++; render(); } else { done(); } };
      function render(){ var st=STEPS[i]; emo.style.backgroundImage='url('+st.img+')'; ttl.textContent=st.t; body.textContent=st.b; dotEls.forEach(function(d,k){ d.style.background=(k===i)?PAL.green:PAL.frameSoft; }); back.style.visibility=(i>0)?'visible':'hidden'; next.textContent=(i<STEPS.length-1)?'NEXT ▸':'PLAY!'; }
      card.appendChild(emo); card.appendChild(ttl); card.appendChild(body); card.appendChild(dots);
      nav.appendChild(back); nav.appendChild(next); card.appendChild(nav);
      ov.appendChild(card); document.body.appendChild(ov); render();
    }
