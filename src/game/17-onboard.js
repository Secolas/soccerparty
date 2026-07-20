    // ================= FIRST-RUN ONBOARDING =================
    // One guided intro shown once on first launch. Replaces the old auto
    // HOW-TO pop and the scattered first-match tips (setup/shoot/ability),
    // which are now retired in nsShowTip. HOW TO PLAY stays available from
    // the menu as a reference. Pass force=true to replay it.
    function showOnboarding(force){
      try{ if(!force && localStorage.getItem('ns_onboard_seen')) return; }catch(e){}
      if(document.getElementById('ns_onboard')) return;
      var STEPS=[
        {emo:'🎉', t:'SOCCER PARTY', b:'Pixel flick-football. Score goals, win powers, party on the pitch.'},
        {emo:'👆', t:'FLICK TO SHOOT', b:'Drag back from the ball and let go — like a slingshot. The longer you pull, the harder the shot.'},
        {emo:'🥅', t:'SCORE & KEEP THE BALL', b:'Flick into the far goal. Clip one of YOUR players and you keep the turn — up to 3 flicks.'},
        {emo:'⚡', t:'WIN ABILITIES', b:'Score to earn powers — cannons, big keepers, curveballs. Tap a slot on the scoreboard to see or pick one.'},
        {emo:'🏆', t:'PICK A MODE', b:'Jump into Exhibition, chase the cup in Tournament, or brave STADIUM ROYALE — 9 hazard stadiums.'}
      ];
      var i=0;
      var ov=mk('div','position:fixed;left:0;top:0;right:0;bottom:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(6,4,10,0.86);padding:16px;box-sizing:border-box;');
      ov.id='ns_onboard';
      var card=mk('div','position:relative;width:100%;max-width:340px;background:linear-gradient(#6e421f,#5e3818 42%,#3a2110);border:3px solid #d7a94e;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.6),inset 0 0 0 1px #8a6338,inset 0 2px 0 rgba(240,208,137,0.25);padding:20px 18px 16px;');
      function done(){ try{ localStorage.setItem('ns_onboard_seen','1'); localStorage.setItem('ns_howto_seen','1'); }catch(e){} if(ov.parentNode) ov.parentNode.removeChild(ov); }
      var skip=mk('div',FS(8,'#f3e4c4')+'position:absolute;top:8px;right:10px;padding:5px 9px;border-radius:7px;background:rgba(0,0,0,0.3);cursor:pointer;letter-spacing:1px;','SKIP');
      skip.onclick=done; card.appendChild(skip);
      var emo=mk('div','font-size:46px;line-height:1;text-align:center;margin:8px 0 12px;','');
      var ttl=mk('div',FS(13,'#a9c94b')+'text-align:center;letter-spacing:1px;margin-bottom:12px;text-shadow:0 3px 0 #12210a;padding:0 26px;','');
      var body=mk('div',FS(9,'#f3e4c4')+'text-align:center;line-height:1.9;min-height:96px;padding:0 4px;','');
      var dots=mk('div','display:flex;gap:6px;justify-content:center;margin:14px 0 12px;');
      var dotEls=STEPS.map(function(_,k){ var d=mk('div','width:8px;height:8px;border-radius:50%;background:#8a6338;',''); dots.appendChild(d); return d; });
      var nav=mk('div','display:flex;gap:10px;');
      var back=mk('button',FS(9,'#f3e4c4')+'flex:0 0 auto;background:#3a2110;border:2px solid #8a6320;border-radius:9px;padding:11px 14px;cursor:pointer;','BACK');
      var next=mk('button',FS(10,'#1a130a')+'flex:1;background:linear-gradient(#f2c14e,#d79a2c);border:2px solid #f0d089;border-radius:9px;padding:11px;cursor:pointer;box-shadow:0 3px 0 #7c5714;letter-spacing:1px;','NEXT');
      back.onclick=function(){ if(i>0){ i--; render(); } };
      next.onclick=function(){ if(i<STEPS.length-1){ i++; render(); } else { done(); } };
      function render(){ var st=STEPS[i]; emo.textContent=st.emo; ttl.textContent=st.t; body.textContent=st.b; dotEls.forEach(function(d,k){ d.style.background=(k===i)?'#a9c94b':'#8a6338'; }); back.style.visibility=(i>0)?'visible':'hidden'; next.textContent=(i<STEPS.length-1)?'NEXT ▸':'PLAY!'; }
      card.appendChild(emo); card.appendChild(ttl); card.appendChild(body); card.appendChild(dots);
      nav.appendChild(back); nav.appendChild(next); card.appendChild(nav);
      ov.appendChild(card); document.body.appendChild(ov); render();
    }
